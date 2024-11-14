import * as vscode from "vscode";
import * as path from "path";
import { defaultSettings, GeneralObject } from "./defaultSettings.cjs";

// Jetbrains Mono Font Extension Configs
const showDialog = vscode.window.showInformationMessage;

const JBMPath = (context: vscode.ExtensionContext) =>
  path.resolve(context.extensionPath, "JetBrainsMono");

const updateUserSettings = (settings: GeneralObject, remove = false) =>
  Object.entries(settings).forEach(([key, value]) =>
    vscode.workspace
      .getConfiguration()
      .update(
        key,
        remove ? undefined : value,
        vscode.ConfigurationTarget.Global
      )
  );

export function dirOpen(dirPath: string) {
  let command = "";
  switch (process.platform) {
    case "darwin":
      command = "open";
      break;
    case "win32":
      command = "explorer";
      break;
    default:
      command = "xdg-open";
      break;
  }
  return require("child_process").exec(`${command} ${dirPath}`);
}

export function JBMActivation(context: vscode.ExtensionContext) {
  const JBMAddress = JBMPath(context);
  updateUserSettings(defaultSettings);
  dirOpen(JBMAddress);
  showDialog(
    `${context.extension.packageJSON.displayName} - Jetbrains Mono Font is activated!`
  );
  showDialog(
    `Important Note - Don't forget to install fonts! Font Directory will open, once you have manually installed fonts, restart VSCODE - ${JBMAddress}`
  );
}

export const JBMActivationPrompt = (context: vscode.ExtensionContext) =>
  showDialog(
    "Activate JetBrains Mono Font for Flawuldragon?",
    "Yes",
    "No"
  ).then((value) =>
    value === "Yes"
      ? JBMActivation(context)
      : (showDialog(
          "You can activate JetBrains Mono later by running 'JetBrainsMono' or 'JBM' in command palette."
        ) as any)
  );

export function firstTimeActivation(context: vscode.ExtensionContext) {
  const version = context.extension.packageJSON.version ?? "1.0.0";
  const previousVersion = context.globalState.get(context.extension.id);
  if (previousVersion === version) return;

  JBMActivation(context);
  context.globalState.update(context.extension.id, version);
}

export function deactivateJBM(context: vscode.ExtensionContext) {
  // context.globalState.update(context.extension.id, undefined);
  updateUserSettings(defaultSettings, true);
  showDialog(`${context.extension.packageJSON.displayName} is deactivated!`);
}

// Todo Highlight Extension Configs
export var os = require("os");
export var window = vscode.window as typeof vscode.window & { processing?: boolean, manuallyCancel?: boolean, outputChannel?: vscode.OutputChannel, statusBarItem?: vscode.StatusBarItem };
export var workspace = vscode.workspace;

export var defaultIcon = "$(checklist)";
export var zapIcon = "$(zap)";
export var defaultMsg = "0";

export var DEFAULT_KEYWORDS = {
  "TODO:": {
    text: "TODO:",
    color: "#fff",
    backgroundColor: "#ffbd2a",
    overviewRulerColor: "rgba(255,189,42,0.8)"
  },
  "FIXME:": {
    text: "FIXME:",
    color: "#fff",
    backgroundColor: "#f06292",
    overviewRulerColor: "rgba(240,98,146,0.8)"
  }
};

export var DEFAULT_STYLE = {
  color: "#2196f3",
  backgroundColor: "#ffeb3b"
};

interface Keyword {
  text: string;
  color?: string;
  backgroundColor?: string;
  overviewRulerColor?: string;
}

export function getAssembledData(keywords: Keyword[], customDefaultStyle: any, isCaseSensitive: boolean) {
    var result: { [key: string]: Keyword } = {}
    keywords.forEach((v) => {
        v = typeof v == 'string' ? { text: v } : v;
        var text = v.text;
            v = Object.assign({}, DEFAULT_KEYWORDS[text as keyof typeof DEFAULT_KEYWORDS], v);

        if (!isCaseSensitive) {
            text = text.toUpperCase();
        }

        if (text == 'TODO:' || text == 'FIXME:') {
            v = Object.assign({}, DEFAULT_KEYWORDS[text], v);
        }
        result[text] = Object.assign({}, DEFAULT_STYLE, customDefaultStyle, v);
    })

    Object.keys(DEFAULT_KEYWORDS).forEach((v) => {
        if (!result[v]) {
            result[v] = Object.assign({}, DEFAULT_STYLE, customDefaultStyle, DEFAULT_KEYWORDS[v as keyof typeof DEFAULT_KEYWORDS]);
        }
    });

    return result;
}

export interface AnnotationType {
  annotationType: string;
  label: string;
  description?: string;
}

export function chooseAnnotationType(availableAnnotationTypes: AnnotationType[]): Thenable<AnnotationType | undefined> {
  return window.showQuickPick(availableAnnotationTypes, {});
}

// get the include/exclude config
export interface Config {
  include?: string | string[];
  exclude?: string | string[];
}

export function getPathes(config: string | string[]): string {
  return Array.isArray(config)
    ? '{' + config.join(',') + '}'
    : (typeof config === 'string' ? config : '');
}

export function searchAnnotations(workspaceState: vscode.Memento, pattern: RegExp, callback: { (err: any, annotations: any, annotationList: any): void; (err: any, annotations: any, annotationList: any): void; (arg0: { message: string; } | null, arg1: {} | undefined, arg2: any[] | undefined): void; }) {

    var settings = workspace.getConfiguration('todohighlight');
    var includePattern = getPathes(settings.get('include') || '{**/*}');
    var excludePattern = getPathes(settings.get('exclude') || '{**/*}');
    var limitationForSearch = settings.get('maxFilesForSearch', 5120);

    var statusMsg = ` Searching...`;

    window.processing = true;

    setStatusMsg(zapIcon, statusMsg, "Status message");

    workspace.findFiles(includePattern, excludePattern, limitationForSearch).then(function (files) {

        if (!files || files.length === 0) {
            callback({ message: 'No files found' }, undefined, undefined);
            return;
        }

        var totalFiles: number = files.length,
            progress: number = 0,
            times: number = 0,
            annotations: { [key: string]: any[] } = {},
            annotationList: any[] = [];

        function file_iterated() {
            times++;
            progress = Math.floor(times / totalFiles * 100);

            setStatusMsg(zapIcon, progress + '% ' + statusMsg, "Status message");

            if (times === totalFiles || window.manuallyCancel) {
                window.processing = true;
                workspaceState.update('annotationList', annotationList);
                callback(null, annotations, annotationList);
            }
        }

        for (var i = 0; i < totalFiles; i++) {

            workspace.openTextDocument(files[i]).then(function (file) {
                searchAnnotationInFile(file, annotations, annotationList, pattern);
                file_iterated();
            }, function (err) {
                errorHandler(err);
                file_iterated();
            });

        }

    }, function (err) {
        errorHandler(err);
    });
}

export interface Annotation {
  uri: string;
  label: string;
  detail: string;
  lineNum: number;
  fileName: string;
  startCol: number;
  endCol: number;
}

export function searchAnnotationInFile(
  file: vscode.TextDocument,
  annotations: { [key: string]: Annotation[] },
  annotationList: Annotation[],
  regexp: RegExp
) {
  const fileInUri = file.uri.toString();
  const pathWithoutFile = fileInUri.substring(7, fileInUri.length);

  for (let line = 0; line < file.lineCount; line++) {
    const lineText = file.lineAt(line).text;
    const match = lineText.match(regexp);
    if (match !== null) {
      if (!annotations.hasOwnProperty(pathWithoutFile)) {
        annotations[pathWithoutFile] = [];
      }
      let content = getContent(lineText, match);
      if (content.length > 500) {
        content = content.substring(0, 500).trim() + '...';
      }
      const locationInfo = getLocationInfo(fileInUri, pathWithoutFile, lineText, line, match);

      const annotation: Annotation = {
        uri: locationInfo.uri,
        label: content,
        detail: locationInfo.relativePath,
        lineNum: line,
        fileName: locationInfo.absPath,
        startCol: locationInfo.startCol,
        endCol: locationInfo.endCol
      };
      annotationList.push(annotation);
      annotations[pathWithoutFile].push(annotation);
    }
  }
}

export interface AnnotationsFoundError {
  message: string;
}

export interface Annotations {
  [key: string]: Annotation[];
}

export function annotationsFound(
  err: AnnotationsFoundError | null,
  annotations: Annotations | undefined,
  annotationList: Annotation[]
) {
  if (err) {
    console.log('todohighlight err:', err);
    setStatusMsg(defaultIcon, defaultMsg, "Status message");
    return;
  }

  const resultNum = annotationList.length;
  const tooltip = resultNum + ' result(s) found';
  setStatusMsg(defaultIcon, resultNum.toString(), tooltip);
  showOutputChannel(annotationList);
}

export function showOutputChannel(data: Annotation[]) {
    if (!window.outputChannel) return;
    window.outputChannel.clear();

    if (data.length === 0) {
        window.showInformationMessage('No results');
        return;
    }

    var settings = workspace.getConfiguration('todohighlight');
    var toggleURI = settings.get('toggleURI', false);

    interface AnnotationData {
      uri: string;
      lineNum: number;
      startCol: number;
      label: string;
    }

    data.forEach(function (v: AnnotationData, i: number, a: AnnotationData[]) {
      // due to an issue of vscode(https://github.com/Microsoft/vscode/issues/586), in order to make file path clickable within the output channel,the file path differs from platform
      const patternA = '#' + (i + 1) + '\t' + v.uri + '#' + (v.lineNum + 1);
      const patternB = '#' + (i + 1) + '\t' + v.uri + ':' + (v.lineNum + 1) + ':' + (v.startCol + 1);
      const patterns = [patternA, patternB];

      //for windows and mac
      let patternType = 0;
      if (os.platform && os.platform() === "linux") {
        // for linux
        patternType = 1;
      }

      if (toggleURI) {
        //toggle the pattern
        patternType = +!patternType;
      }
      if (window.outputChannel) {
        window.outputChannel.appendLine(patterns[patternType]);
        window.outputChannel.appendLine('\t' + v.label + '\n');
      }
    });
    window.outputChannel.show();
}

export function getContent(lineText: string, match: any[]) {
    return lineText.substring(lineText.indexOf(match[0]), lineText.length);
};

export function getLocationInfo(fileInUri: string, pathWithoutFile: string, lineText: string | any[], line: number, match: any[]) {
    var rootPath = workspace.rootPath + '/';
    var outputFile = pathWithoutFile.replace(rootPath, '');
    var startCol = lineText.indexOf(match[0]);
    var endCol = lineText.length;
    var location = outputFile + ' ' + (line + 1) + ':' + (startCol + 1);

    return {
        uri: fileInUri,
        absPath: pathWithoutFile,
        relativePath: location,
        startCol: startCol,
        endCol: endCol
    };
};

export function createStatusBarItem() {
    var statusBarItem = window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarItem.text = defaultIcon + defaultMsg;
    statusBarItem.tooltip = 'List annotations';
    statusBarItem.command = 'fd_todohighlight.showOutputChannel';
    return statusBarItem;
};

export interface ErrorHandler {
  (err: any): void;
}

export function errorHandler(err: any): void {
  window.processing = true;
  setStatusMsg(defaultIcon, defaultMsg, "Status message");
  console.log('todohighlight err:', err);
}

export function setStatusMsg(icon: string, msg: string, tooltip: string | vscode.MarkdownString | undefined) {
    if (window.statusBarItem) {
        window.statusBarItem.text = `${icon} ${msg}` || '';
        if (tooltip) {
            window.statusBarItem.tooltip = tooltip || '';
        }
        window.statusBarItem.show();
    }
}

export function escapeRegExp(s: string) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
