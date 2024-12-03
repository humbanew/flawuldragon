import * as vscode from "vscode";
import * as os from "os";
import { ITHKeyword } from "./ITHKeyboard";
import { ITHAnnotationType } from "./ITHAnnotationType";
import { ITHConfig } from "./ITHConfig";
import { ITHErrorHandler } from "./ITHErrorHandler";
import { ITHAnnotation } from "./ITHAnnotation";
import { ITHAnnotationsFoundError } from "./ITHAnnotationsFoundError";
import { ITHAnnotations } from "./ITHAnnotations";

/**
 * The `TodoHighlight` class provides functionality to highlight and manage TODO annotations within a Visual Studio Code workspace.
 * It includes methods to search for annotations, display them in the output channel, and manage the status bar item.
 *
 * @class
 * @example
 * // Example usage:
 * const todohighlight = new TodoHighlight();
 * todohighlight.todohighlight_activate(context);
 */
export class TodoHighlight {
  /**
   * A reference to the VS Code window object with additional custom properties.
   *
   * @property {boolean} [processing] - Indicates if a process is currently running.
   * @property {boolean} [manuallyCancel] - Indicates if a process was manually cancelled.
   * @property {vscode.OutputChannel} [outputChannel] - A custom output channel for logging.
   */
  private window = vscode.window as typeof vscode.window & {
    processing?: boolean;
    manuallyCancel?: boolean;
    outputChannel?: vscode.OutputChannel;
  };

  /**
   * The default icon used for the todo highlight.
   *
   * @default "$(checklist)"
   */
  private defaultIcon = "$(checklist)";

  /**
   * Represents the icon for a zap action.
   * The icon is defined using a string that corresponds to a specific symbol.
   *
   * @default "$(zap)"
   */
  private zapIcon = "$(zap)";

  /**
   * The default message to be displayed.
   *
   * @default "0"
   */
  private defaultMsg = "0";

  /**
   * A status bar item to display the current status of TODOs.
   * This item is used to provide quick information and actions related to TODOs in the editor.
   *
   * @type {vscode.StatusBarItem | undefined}
   */
  private todoStatusBarItem: vscode.StatusBarItem | undefined;

  /**
   * A collection of default keywords used for highlighting TODO comments in the code.
   * Each keyword is associated with a specific text, color, background color, and overview ruler color.
   *
   * @property {Object} DEFAULT_KEYWORDS - The default keywords for highlighting.
   * @property {Object} DEFAULT_KEYWORDS.TODO - Configuration for "TODO:" keyword.
   * @property {string} DEFAULT_KEYWORDS.TODO.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.TODO.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.TODO.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.TODO.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.FIXME - Configuration for "FIXME:" keyword.
   * @property {string} DEFAULT_KEYWORDS.FIXME.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.FIXME.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.FIXME.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.FIXME.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.NOTE - Configuration for "NOTE:" keyword.
   * @property {string} DEFAULT_KEYWORDS.NOTE.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.NOTE.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.NOTE.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.NOTE.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.HACK - Configuration for "HACK:" keyword.
   * @property {string} DEFAULT_KEYWORDS.HACK.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.HACK.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.HACK.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.HACK.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.BUG - Configuration for "BUG:" keyword.
   * @property {string} DEFAULT_KEYWORDS.BUG.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.BUG.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.BUG.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.BUG.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.IDEA - Configuration for "IDEA:" keyword.
   * @property {string} DEFAULT_KEYWORDS.IDEA.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.IDEA.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.IDEA.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.IDEA.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.REVIEW - Configuration for "REVIEW:" keyword.
   * @property {string} DEFAULT_KEYWORDS.REVIEW.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.REVIEW.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.REVIEW.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.REVIEW.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.QUESTION - Configuration for "QUESTION:" keyword.
   * @property {string} DEFAULT_KEYWORDS.QUESTION.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.QUESTION.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.QUESTION.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.QUESTION.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.EXAMPLE - Configuration for "EXAMPLE:" keyword.
   * @property {string} DEFAULT_KEYWORDS.EXAMPLE.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.EXAMPLE.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.EXAMPLE.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.EXAMPLE.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.TEST - Configuration for "TEST:" keyword.
   * @property {string} DEFAULT_KEYWORDS.TEST.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.TEST.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.TEST.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.TEST.overviewRulerColor - The color for the overview ruler.
   */
  private DEFAULT_KEYWORDS = {
    "TODO:": {
      text: "TODO:",
      color: "#fff",
      backgroundColor: "#ffbd2a",
      overviewRulerColor: "rgba(255,189,42,0.8)",
    },
    "FIXME:": {
      text: "FIXME:",
      color: "#fff",
      backgroundColor: "#f06292",
      overviewRulerColor: "rgba(240,98,146,0.8)",
    },
    "NOTE:": {
      text: "NOTE:",
      color: "#fff",
      backgroundColor: "#4caf50",
      overviewRulerColor: "rgba(76,175,80,0.8)",
    },
    "HACK:": {
      text: "HACK:",
      color: "#fff",
      backgroundColor: "#ff5722",
      overviewRulerColor: "rgba(255,87,34,0.8)",
    },
    "BUG:": {
      text: "BUG:",
      color: "#fff",
      backgroundColor: "#f44336",
      overviewRulerColor: "rgba(244,67,54,0.8)",
    },
    "IDEA:": {
      text: "IDEA:",
      color: "#fff",
      backgroundColor: "#2196f3",
      overviewRulerColor: "rgba(33,150,243,0.8)",
    },
    "REVIEW:": {
      text: "REVIEW:",
      color: "#fff",
      backgroundColor: "#673ab7",
      overviewRulerColor: "rgba(103,58,183,0.8)",
    },
    "QUESTION:": {
      text: "QUESTION:",
      color: "#fff",
      backgroundColor: "#9c27b0",
      overviewRulerColor: "rgba(156,39,176,0.8)",
    },
    "EXAMPLE:": {
      text: "EXAMPLE:",
      color: "#fff",
      backgroundColor: "#00bcd4",
      overviewRulerColor: "rgba(0,188,212,0.8)",
    },
    "TEST:": {
      text: "TEST:",
      color: "#fff",
      backgroundColor: "#009688",
      overviewRulerColor: "rgba(0,150,136,0.8)",
    },
  };

  /**
   * The default style configuration for highlighting TODO items.
   *
   * @property {string} color - The text color for the highlight.
   * @property {string} backgroundColor - The background color for the highlight.
   */
  private DEFAULT_STYLE = {
    color: "#2196f3",
    backgroundColor: "#ffeb3b",
  };

  /**
   * Assembles and returns a dictionary of keywords with their associated styles.
   *
   * @param keywords - An array of keywords to be highlighted. Each keyword can be a string or an object implementing the ITHKeyword interface.
   * @param customDefaultStyle - A custom style object to be applied to the keywords.
   * @param isCaseSensitive - A boolean indicating whether the keyword matching should be case sensitive.
   * @returns A dictionary where the keys are the keywords and the values are the corresponding styled keyword objects.
   */
  private todoHighlight_getAssembledData(
    keywords: ITHKeyword[],
    customDefaultStyle: any,
    isCaseSensitive: boolean,
  ) {
    var result: { [key: string]: ITHKeyword } = {};
    keywords.forEach((v) => {
      v = typeof v == "string" ? { text: v } : v;
      var text = v?.text;
      v = Object?.assign(
        {},
        this.DEFAULT_KEYWORDS[text as keyof typeof this.DEFAULT_KEYWORDS],
        v,
      );

      if (!isCaseSensitive) {
        text = text?.toUpperCase();
      }

      if (
        text == "TODO:" ||
        text == "FIXME:" ||
        text == "NOTE:" ||
        text == "HACK:" ||
        text == "BUG:" ||
        text == "IDEA:" ||
        text == "REVIEW:" ||
        text == "QUESTION:" ||
        text == "EXAMPLE:" ||
        text == "TEST:"
      ) {
        v = Object?.assign({}, this.DEFAULT_KEYWORDS[text], v);
      }
      result[text] = Object?.assign(
        {},
        this.DEFAULT_STYLE,
        customDefaultStyle,
        v,
      );
    });

    Object?.keys(this.DEFAULT_KEYWORDS).forEach((v) => {
      if (!result[v]) {
        result[v] = Object?.assign(
          {},
          this.DEFAULT_STYLE,
          customDefaultStyle,
          this.DEFAULT_KEYWORDS[v as keyof typeof this.DEFAULT_KEYWORDS],
        );
      }
    });

    return result;
  }

  /**
   * Prompts the user to choose an annotation type from the available options.
   *
   * @param availableAnnotationTypes - An array of available annotation types to choose from.
   * @returns A promise that resolves to the selected annotation type or undefined if no selection was made.
   */
  private todoHighlight_chooseAnnotationType(
    availableAnnotationTypes: ITHAnnotationType[],
  ): Thenable<ITHAnnotationType | undefined> {
    return this.window.showQuickPick(availableAnnotationTypes, {});
  }

  // get the include/exclude config
  /**
   * Generates a string representation of the given configuration paths.
   *
   * @param config - The configuration paths, which can be either an array of strings or a single string.
   * @returns A string representation of the configuration paths. If the input is an array, the paths are joined with commas and enclosed in curly braces. If the input is a string, it is returned as is. If the input is neither, an empty string is returned.
   */
  private todoHighlight_getPathes(config: ITHConfig | string): string {
    return Array.isArray(config)
      ? "{" + config.join(",") + "}"
      : typeof config === "string"
      ? config
      : "";
  }

  /**
   * Searches for annotations in the workspace based on the provided pattern and invokes the callback with the results.
   *
   * @param workspaceState - The state of the workspace, used to store the annotation list.
   * @param pattern - The regular expression pattern to search for annotations.
   * @param callback - The callback function to be invoked with the search results.
   *   - `err`: An error object if an error occurred, otherwise null.
   *   - `annotations`: An object containing the found annotations.
   *   - `annotationList`: A list of all found annotations.
   */
  private todoHighlight_searchAnnotations(
    workspaceState: vscode.Memento,
    pattern: RegExp,
    callback: {
      (err: any, annotations: any, annotationList: any): void;
      (err: any, annotations: any, annotationList: any): void;
      (arg0: { message: string }, arg1: {}, arg2: any[]): void;
    },
  ) {
    var settings = vscode.workspace.getConfiguration("todohighlight");
    var includePattern = this.todoHighlight_getPathes(
      settings.get("include") || "{**/*}",
    );
    var excludePattern = this.todoHighlight_getPathes(
      settings.get("exclude") || "{**/*}",
    );
    var limitationForSearch = settings.get("maxFilesForSearch", 5120);

    var statusMsg = ` Searching...`;

    this.window.processing = true;

    this.todoHighlight_setStatusMsg(this.zapIcon, statusMsg, "Status message");

    vscode.workspace
      .findFiles(includePattern, excludePattern, limitationForSearch)
      .then(
        function (files) {
          if (!files || files.length === 0) {
            callback({ message: "No files found" }, "", "");
            return;
          }

          var totalFiles: number = files.length,
            progress: number = 0,
            times: number = 0,
            annotations: { [key: string]: any[] } = {},
            annotationList: any[] = [];

          function file_iterated() {
            times++;
            progress = Math.floor((times / totalFiles) * 100);

            TodoHighlight.prototype.todoHighlight_setStatusMsg(
              TodoHighlight.prototype.zapIcon,
              progress + "% " + statusMsg,
              "Status message",
            );

            if (
              times === totalFiles ||
              TodoHighlight.prototype.window.manuallyCancel
            ) {
              TodoHighlight.prototype.window.processing = true;
              workspaceState.update("annotationList", annotationList);
              callback("", annotations, annotationList);
            }
          }

          for (var i = 0; i < totalFiles; i++) {
            vscode.workspace.openTextDocument(files[i]).then(
              function (file) {
                TodoHighlight.prototype.todoHighlight_searchAnnotationInFile(
                  file,
                  annotations,
                  annotationList,
                  pattern,
                );
                file_iterated();
              },
              function (err) {
                TodoHighlight.prototype.todoHighlight_errorHandler(err);
                file_iterated();
              },
            );
          }
        },
        function (err) {
          TodoHighlight.prototype.todoHighlight_errorHandler(err);
        },
      );
  }

  /**
   * Searches for annotations in a given file and updates the provided annotations and annotationList.
   *
   * @param file - The TextDocument to search for annotations.
   * @param annotations - An object where the keys are file paths and the values are arrays of ITHAnnotation.
   * @param annotationList - A list of all annotations found.
   * @param regexp - The regular expression to match annotations in the file.
   */
  private todoHighlight_searchAnnotationInFile(
    file: vscode.TextDocument,
    annotations: { [key: string]: ITHAnnotation[] },
    annotationList: ITHAnnotation[],
    regexp: RegExp,
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
        let content = this.todoHighlight_getContent(lineText, match);
        if (content.length > 500) {
          content = content.substring(0, 500)?.trim() + "...";
        }
        const locationInfo = this.todoHighlight_getLocationInfo(
          fileInUri,
          pathWithoutFile,
          lineText,
          line,
          match,
        );

        const annotation: ITHAnnotation = {
          uri: locationInfo.uri,
          label: content,
          detail: locationInfo.relativePath,
          lineNum: line,
          fileName: locationInfo.absPath,
          startCol: locationInfo.startCol,
          endCol: locationInfo.endCol,
        };
        annotationList.push(annotation);
        annotations[pathWithoutFile].push(annotation);
      }
    }
  }

  /**
   * Handles the event when annotations are found.
   *
   * @param err - The error object if an error occurred, otherwise null.
   * @param annotations - The annotations object containing the found annotations.
   * @param annotationList - The list of individual annotations found.
   */
  private todoHighlight_annotationsFound(
    err: ITHAnnotationsFoundError,
    annotations: ITHAnnotations,
    annotationList: ITHAnnotation[],
  ) {
    if (err) {
      console.log("todohighlight err:", err);
      this.todoHighlight_setStatusMsg(
        this.defaultIcon,
        this.defaultMsg,
        "Status message",
      );
      return;
    }

    const resultNum = annotationList.length;
    const tooltip = resultNum + " result(s) found";
    this.todoHighlight_setStatusMsg(
      this.defaultIcon,
      resultNum.toString(),
      tooltip,
    );
    this.todoHighlight_showOutputChannel(annotationList);
  }

  /**
   * Displays the output channel with the provided annotation data.
   *
   * @param data - An array of annotation data to be displayed in the output channel.
   *
   * The function performs the following steps:
   * 1. Clears the output channel if it exists.
   * 2. If no data is provided, shows an information message indicating no results.
   * 3. Retrieves the configuration settings for "todohighlight".
   * 4. Iterates over the annotation data and formats the output based on the platform (Windows, macOS, or Linux).
   * 5. Appends the formatted annotation data to the output channel.
   * 6. Displays the output channel.
   *
   * The annotation data includes:
   * - `uri`: The URI of the file.
   * - `lineNum`: The line number of the annotation.
   * - `startCol`: The starting column of the annotation.
   * - `label`: The label or description of the annotation.
   *
   * The function also handles toggling the URI format based on the configuration settings.
   */
  private todoHighlight_showOutputChannel(data: ITHAnnotation[]) {
    if (!this.window.outputChannel) return;
    this.window.outputChannel.clear();

    if (data.length === 0) {
      this.window.showInformationMessage("No results");
      return;
    }

    var settings = vscode.workspace.getConfiguration("todohighlight");
    var toggleURI = settings.get("toggleURI", false);

    interface AnnotationData {
      uri: string;
      lineNum: number;
      startCol: number;
      label: string;
    }

    data.forEach(function (v: AnnotationData, i: number, a: AnnotationData[]) {
      // due to an issue of vscode(https://github.com/Microsoft/vscode/issues/586), in order to make file path clickable within the output channel,the file path differs from platform
      const patternA = "#" + (i + 1) + "\t" + v.uri + "#" + (v.lineNum + 1);
      const patternB =
        "#" +
        (i + 1) +
        "\t" +
        v.uri +
        ":" +
        (v.lineNum + 1) +
        ":" +
        (v.startCol + 1);
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
      if (TodoHighlight.prototype.window.outputChannel) {
        TodoHighlight.prototype.window.outputChannel.appendLine(
          patterns[patternType],
        );
        TodoHighlight.prototype.window.outputChannel.appendLine(
          "\t" + v.label + "\n",
        );
      }
    });
    this.window.outputChannel.show();
  }

  /**
   * Extracts the content of a line starting from the first occurrence of a match.
   *
   * @param lineText - The text of the line to extract content from.
   * @param match - An array containing the match information, where the first element is the matched string.
   * @returns The substring of the line starting from the first occurrence of the match to the end of the line.
   */
  private todoHighlight_getContent(lineText: string, match: any[]) {
    return lineText.substring(lineText.indexOf(match[0]), lineText.length);
  }

  /**
   * Retrieves location information for a highlighted TODO item.
   *
   * @param fileInUri - The URI of the file containing the TODO item.
   * @param pathWithoutFile - The path of the file without the file name.
   * @param lineText - The text of the line containing the TODO item.
   * @param line - The line number of the TODO item.
   * @param match - The match array containing the TODO item.
   * @returns An object containing the URI, absolute path, relative path, start column, and end column of the TODO item.
   */
  private todoHighlight_getLocationInfo(
    fileInUri: string,
    pathWithoutFile: string,
    lineText: string | any[],
    line: number,
    match: any[],
  ) {
    var rootPath =
      (vscode.workspace.workspaceFolders &&
        vscode.workspace.workspaceFolders[0].uri.fsPath) + "/";
    var outputFile = pathWithoutFile.replace(rootPath, "");
    var startCol = lineText.indexOf(match[0]);
    var endCol = lineText.length;
    var location = outputFile + " " + (line + 1) + ":" + (startCol + 1);

    return {
      uri: fileInUri,
      absPath: pathWithoutFile,
      relativePath: location,
      startCol: startCol,
      endCol: endCol,
    };
  }

  /**
   * Creates a status bar item for the Todo Highlight extension.
   *
   * This status bar item is positioned on the left side of the status bar with a priority of 98.
   * It displays a default icon and message, and provides a tooltip and command for listing annotations.
   * The background color of the status bar item is set to a warning theme color.
   *
   * @returns {vscode.StatusBarItem} The created status bar item.
   */
  private todoHighlight_createStatusBarItem(numNotations?: number) {
    let todoHighlightStatusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      97,
    );
    if(numNotations == 0) {
      todoHighlightStatusBarItem.text = this.defaultIcon + " " + this.defaultMsg;
    } else {
      todoHighlightStatusBarItem.text = this.defaultIcon + " " + numNotations;
    }
    todoHighlightStatusBarItem.tooltip = "Number of available annotations";
    todoHighlightStatusBarItem.command = "fd_todohighlight.listAnnotations";
    todoHighlightStatusBarItem.backgroundColor = new vscode.ThemeColor(
      "statusBarItem.warningBackground",
    );
    todoHighlightStatusBarItem.show();
    this.todoStatusBarItem = todoHighlightStatusBarItem;
    return todoHighlightStatusBarItem;
  }

  /**
   * Handles errors for the TodoHighlight component.
   *
   * @param err - The error object implementing the ITHErrorHandler interface.
   * @private
   */
  private todoHighlight_errorHandler(err: ITHErrorHandler): void {
    this.window.processing = true;
    this.todoHighlight_setStatusMsg(
      this.defaultIcon,
      this.defaultMsg,
      "Status message",
    );
    console.log("todohighlight err:", err);
  }

  /**
   * Updates the status message of the todo status bar item.
   *
   * @param icon - The icon to display in the status bar item.
   * @param msg - The message to display in the status bar item.
   * @param tooltip - The tooltip to display when hovering over the status bar item. Can be a string or a `vscode.MarkdownString`.
   */
  private todoHighlight_setStatusMsg(
    icon: string,
    msg: string,
    tooltip: string | vscode.MarkdownString,
  ) {
    if (this.todoStatusBarItem) {
      this.todoStatusBarItem.text = `${icon} ${msg}` || "";
      if (tooltip) {
        this.todoStatusBarItem.tooltip = tooltip || "";
      }
      this.todoStatusBarItem.show();
    }
  }

  /**
   * Escapes special characters in a string to be used in a regular expression.
   *
   * This method takes a string and replaces characters that have special meaning
   * in regular expressions (such as `-`, `/`, `\`, `^`, `$`, `*`, `+`, `?`, `.`, `(`, `)`, `|`, `[`, `]`, `{`, and `}`)
   * with their escaped counterparts.
   *
   * @param s - The string to escape.
   * @returns The escaped string, safe to use in a regular expression.
   */
  private todoHighlight_escapeRegExp(s: string) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  /**
   * Activates the TodoHighlight extension.
   *
   * @param context - The extension context provided by VSCode.
   *
   * This function initializes the TodoHighlight extension, sets up the necessary configurations,
   * and registers commands for toggling highlights, listing annotations, and showing the output channel.
   * It also sets up event listeners for changes in the active text editor, text document, and configuration.
   *
   * The function uses the following interfaces:
   * - `AssembledData`: Represents the assembled decoration data.
   * - `DecorationTypes`: Represents the decoration types.
   *
   * The function performs the following tasks:
   * - Initializes variables and settings.
   * - Defines helper functions for updating decorations and initializing the extension.
   * - Registers commands for toggling highlights, listing annotations, and showing the output channel.
   * - Sets up event listeners for changes in the active text editor, text document, and configuration.
   * - Triggers the update of decorations if an active editor is present.
   */
  public todoHighlight_activate(context: vscode.ExtensionContext) {
    try {
      console.log("Flawuldragon - TodoHighlight activated");

      var timeout: NodeJS.Timeout = null;
      var activeEditor = this.window.activeTextEditor;
      interface AssembledData {
        [key: string]: vscode.DecorationRenderOptions;
      }
  
      interface DecorationTypes {
        [key: string]: vscode.TextEditorDecorationType;
      }
  
      let isCaseSensitive: boolean,
        assembledData: AssembledData,
        decorationTypes: DecorationTypes,
        pattern: RegExp,
        styleForRegExp: vscode.DecorationRenderOptions,
        keywordsPattern: string;
      var workspaceState = context.workspaceState;
  
      var settings = vscode.workspace.getConfiguration("todohighlight");
  
      let triggerUpdateDecorations = () => {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(updateDecorations, 0);
      };
  
      let updateDecorations = () => {
        if (!activeEditor || !activeEditor.document) {
          return;
        }
  
        var text = activeEditor.document.getText();
        var mathes: { [key: string]: vscode.DecorationOptions[] } = {},
          match;
        while ((match = pattern.exec(text))) {
          var startPos = activeEditor.document.positionAt(match.index);
          var endPos = activeEditor.document.positionAt(
            match.index + match[0].length,
          );
          var decoration = {
            range: new vscode.Range(startPos, endPos),
          };
  
          var matchedValue = match[0];
          if (!isCaseSensitive) {
            matchedValue = matchedValue.toUpperCase();
          }
  
          if (mathes[matchedValue]) {
            mathes[matchedValue].push(decoration);
          } else {
            mathes[matchedValue] = [decoration];
          }
  
          if (keywordsPattern?.trim() && !decorationTypes[matchedValue]) {
            decorationTypes[matchedValue] =
              vscode.window.createTextEditorDecorationType(styleForRegExp);
          }
        }
  
        Object.keys(decorationTypes).forEach((v) => {
          if (!isCaseSensitive) {
            v = v.toUpperCase();
          }
          var rangeOption =
            settings.get("isEnable") && mathes[v] ? mathes[v] : [];
          var decorationType = decorationTypes[v];
          if (activeEditor) {
            activeEditor.setDecorations(decorationType, rangeOption);
          }
        });
      };
  
      let init = (settings: vscode.WorkspaceConfiguration) => {
        var customDefaultStyle = settings.get("defaultStyle") || {};
        keywordsPattern = settings.get("keywordsPattern") || "";
        isCaseSensitive = settings.get("isCaseSensitive", true);
        const outputChannel = vscode.window.createOutputChannel(
          "Flawuldragon TodoHighlight",
        );
  
        decorationTypes = {};
  
        if (keywordsPattern.trim()) {
          styleForRegExp = Object?.assign(
            {},
            this.DEFAULT_STYLE,
            customDefaultStyle,
            {
              overviewRulerLane: vscode.OverviewRulerLane.Right,
            },
          );
          pattern = new RegExp(keywordsPattern, isCaseSensitive ? "g" : "gi");
        } else {
          const keywords = settings.get("keywords");
          assembledData = this.todoHighlight_getAssembledData(
            Array.isArray(keywords) ? keywords : [],
            customDefaultStyle,
            isCaseSensitive,
          );
          if (!this.todoStatusBarItem) {
            this.todoStatusBarItem = this.todoHighlight_createStatusBarItem(Object.keys(assembledData).length);
          }
  
          if (assembledData != undefined) {
            Object.keys(assembledData).forEach((v) => {
              if (!isCaseSensitive) {
                v = v.toUpperCase();
              }
  
              var mergedStyle = Object?.assign(
                {},
                {
                  overviewRulerLane: vscode.OverviewRulerLane.Right,
                },
                assembledData ? assembledData[v] : {},
              );
  
              if (!mergedStyle.overviewRulerColor) {
                // use backgroundColor as the default overviewRulerColor if not specified by the user setting
                mergedStyle.overviewRulerColor = mergedStyle.backgroundColor;
              }
  
              decorationTypes[v] =
                this.window.createTextEditorDecorationType(mergedStyle);
            });
  
            const patternString = Object.keys(assembledData)
              .map((v) => {
                return this.todoHighlight_escapeRegExp(v);
              })
              .join("|");
            pattern = new RegExp(patternString, "gi");
          }
        }
  
        pattern = new RegExp(pattern, "gi");
        if (isCaseSensitive) {
          pattern = new RegExp(pattern, "g");
        }
      };
  
      context.subscriptions.push(
        vscode.commands.registerCommand(
          "fd_todohighlight.toggleHighlight",
          () => {
            settings
              .update("isEnable", !settings.get("isEnable"), true)
              .then(() => {
                triggerUpdateDecorations();
              });
          },
        ),
      );
  
      context.subscriptions.push(
        vscode.commands.registerCommand(
          "fd_todohighlight.listAnnotations",
          () => {
            if (keywordsPattern?.trim()) {
              this.todoHighlight_searchAnnotations(
                workspaceState,
                pattern,
                (err, annotations, annotationList = []) =>
                  this.todoHighlight_annotationsFound(
                    err,
                    annotations,
                    annotationList,
                  ),
              );
            } else {
              if (!assembledData) return;
              var availableAnnotationTypes = Object.keys(assembledData);
              availableAnnotationTypes.unshift("ALL");
              interface AnnotationType {
                annotationType: string;
              }
  
              interface SearchPattern {
                searchPattern: RegExp;
              }
  
              this.todoHighlight_chooseAnnotationType(
                availableAnnotationTypes.map((type) => ({
                  label: type,
                  annotationType: type,
                })),
              ).then(function (annotationType) {
                if (!annotationType) return;
                if (!annotationType) return;
                var searchPattern: SearchPattern["searchPattern"] = pattern;
                if (annotationType.annotationType != "ALL") {
                  annotationType.annotationType =
                    new TodoHighlight().todoHighlight_escapeRegExp(
                      annotationType.annotationType,
                    );
                  searchPattern = new RegExp(
                    annotationType.annotationType,
                    isCaseSensitive ? "g" : "gi",
                  );
                }
                new TodoHighlight().todoHighlight_searchAnnotations(
                  workspaceState,
                  searchPattern,
                  (err, annotations, annotationList = []) =>
                    new TodoHighlight().todoHighlight_annotationsFound(
                      err,
                      annotations,
                      annotationList,
                    ),
                );
              });
            }
          },
        ),
      );
  
      context.subscriptions.push(
        vscode.commands.registerCommand(
          "fd_todohighlight.showOutputChannel",
          () => {
            var annotationList = workspaceState.get("annotationList", []);
            new TodoHighlight().todoHighlight_showOutputChannel(annotationList);
          },
        ),
      );
  
      if (activeEditor) {
        triggerUpdateDecorations();
      }
  
      vscode.window.onDidChangeActiveTextEditor(
        function (editor) {
          activeEditor = editor;
          if (editor) {
            triggerUpdateDecorations();
          }
        },
        "",
        context.subscriptions,
      );
  
      vscode.workspace.onDidChangeTextDocument(
        function (event) {
          if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations();
  
          }
        },
        "",
        context.subscriptions,
      );
  
      vscode.workspace.onDidChangeConfiguration(
        function () {
          settings = vscode.workspace.getConfiguration("todohighlight");
          if (!settings.get("isEnable")) return;
          // NOTE: if disabled, do not re-initialize the data or we will not be able to clear the style immediatly via 'toggle highlight' command
          init(settings);
          triggerUpdateDecorations();
        },
        "",
        context.subscriptions,
      );
  
      init(settings);
    } catch (error) {
      console.error("Flawuldragon - TODO Highlight error: " + error);
      vscode.window.showErrorMessage("An error occurred while activating the TODO Highlight integration: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
      this.todoHighlight_desactivate();
    } finally {}
  }

  /**
   * Deactivates the todo highlight feature by disposing of the status bar item and output channel if they exist.
   *
   * This method checks if the `todoStatusBarItem` and `outputChannel` are defined, and if so, disposes of them to clean up resources.
   */
  public todoHighlight_desactivate() {
    if (this.todoStatusBarItem) {
      this.todoStatusBarItem.dispose();
    }
    if (this.window.outputChannel) {
      this.window.outputChannel.dispose();
    }
  }
}
