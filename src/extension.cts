import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { deactivateJBM, JBMActivation, firstTimeActivation, annotationsFound, chooseAnnotationType, createStatusBarItem, DEFAULT_STYLE, escapeRegExp, getAssembledData, searchAnnotations, showOutputChannel } from "./util.cjs";

let statusBar: vscode.StatusBarItem;
let window = vscode.window;
let statusBarItem: vscode.StatusBarItem | undefined;
let workspace = vscode.workspace;

export function activate(context: vscode.ExtensionContext) {
  // Jetbrains Mono Font Extension Configs
  console.log(
    `Congratulations, your extension "${context.extension.packageJSON.displayName} - Jetbrains Mono Font installed!"`
  );
  firstTimeActivation(context);
  let activateCommand = vscode.commands.registerCommand(
    "flawuldragon_jetbrainsmonofont.activate",
    () => JBMActivation(context)
  );
  let deactivateCommand = vscode.commands.registerCommand(
    "flawuldragon_jetbrainsmonofont.deactivate",
    () => deactivateJBM(context)
  );
  context.subscriptions.push(activateCommand, deactivateCommand);

  // Todo Highlight Configs
  var timeout: NodeJS.Timeout | null = null;
  var activeEditor = window.activeTextEditor;
  interface AssembledData {
    [key: string]: vscode.DecorationRenderOptions;
  }

  interface DecorationTypes {
    [key: string]: vscode.TextEditorDecorationType;
  }

  let isCaseSensitive: boolean,
    assembledData: AssembledData | undefined,
    decorationTypes: DecorationTypes,
    pattern: RegExp,
    styleForRegExp: vscode.DecorationRenderOptions,
    keywordsPattern: string;
  var workspaceState = context.workspaceState;

  var settings = workspace.getConfiguration("todohighlight");

  init(settings);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "fd_todohighlight.toggleHighlight",
      function () {
        settings
          .update("isEnable", !settings.get("isEnable"), true)
          .then(function () {
            triggerUpdateDecorations();
          });
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "fd_todohighlight.listAnnotations",
      function () {
        if (keywordsPattern.trim()) {
          searchAnnotations(
            workspaceState,
            pattern,
            (err, annotations, annotationList = []) => annotationsFound(err, annotations, annotationList)
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

          chooseAnnotationType(availableAnnotationTypes.map(type => ({ label: type, annotationType: type })))
            .then(function (annotationType) {
              if (!annotationType) return;
              if (!annotationType) return;
              var searchPattern: SearchPattern["searchPattern"] = pattern;
              if (annotationType.annotationType != "ALL") {
                annotationType.annotationType = escapeRegExp(annotationType.annotationType);
                searchPattern = new RegExp(
                  annotationType.annotationType,
                  isCaseSensitive ? "g" : "gi"
                );
              }
              searchAnnotations(
                workspaceState,
                searchPattern,
                (err, annotations, annotationList = []) => annotationsFound(err, annotations, annotationList)
              );
            });
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "fd_todohighlight.showOutputChannel",
      function () {
        var annotationList = workspaceState.get("annotationList", []);
        showOutputChannel(annotationList);
      }
    )
  );

  if (activeEditor) {
    triggerUpdateDecorations();
  }

  window.onDidChangeActiveTextEditor(
    function (editor) {
      activeEditor = editor;
      if (editor) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  workspace.onDidChangeTextDocument(
    function (event) {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  workspace.onDidChangeConfiguration(
    function () {
      settings = workspace.getConfiguration("todohighlight");

      //NOTE: if disabled, do not re-initialize the data or we will not be able to clear the style immediatly via 'toggle highlight' command
      if (!settings.get("isEnable")) return;

      init(settings);
      triggerUpdateDecorations();
    },
    null,
    context.subscriptions
  );

  function updateDecorations() {
    if (!activeEditor || !activeEditor.document) {
      return;
    }

    var text = activeEditor.document.getText();
    var mathes: { [key: string]: vscode.DecorationOptions[] } = {},
      match;
    while ((match = pattern.exec(text))) {
      var startPos = activeEditor.document.positionAt(match.index);
      var endPos = activeEditor.document.positionAt(
        match.index + match[0].length
      );
      var decoration = {
        range: new vscode.Range(startPos, endPos)
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

      if (keywordsPattern.trim() && !decorationTypes[matchedValue]) {
        decorationTypes[matchedValue] =
          window.createTextEditorDecorationType(styleForRegExp);
      }
    }

    Object.keys(decorationTypes).forEach((v) => {
      if (!isCaseSensitive) {
        v = v.toUpperCase();
      }
      var rangeOption = settings.get("isEnable") && mathes[v] ? mathes[v] : [];
      var decorationType = decorationTypes[v];
      if (activeEditor) {
        activeEditor.setDecorations(decorationType, rangeOption);
      }
    });
  }

  function init(settings: vscode.WorkspaceConfiguration) {
    var customDefaultStyle = settings.get("defaultStyle");
    keywordsPattern = settings.get("keywordsPattern") || "";
    isCaseSensitive = settings.get("isCaseSensitive", true);
    if (!statusBarItem) {
      statusBarItem = createStatusBarItem();
      statusBarItem = createStatusBarItem();
    }
    const outputChannel = vscode.window.createOutputChannel("TodoHighlight");

    decorationTypes = {};

    if (keywordsPattern.trim()) {
      styleForRegExp = Object.assign(
        {},
        DEFAULT_STYLE,
        customDefaultStyle,
        {
          overviewRulerLane: vscode.OverviewRulerLane.Right
        }
      );
      pattern = new RegExp(keywordsPattern, isCaseSensitive ? "g" : "gi");
    } else {
      assembledData = getAssembledData(
        settings.get("keywords") || [],
        customDefaultStyle,
        isCaseSensitive
      );

      if (assembledData != undefined) {
        Object.keys(assembledData).forEach((v) => {
          if (!isCaseSensitive) {
            v = v.toUpperCase();
          }

          var mergedStyle = Object.assign(
            {},
            {
              overviewRulerLane: vscode.OverviewRulerLane.Right
            },
            assembledData ? assembledData[v] : {}
          );

          if (!mergedStyle.overviewRulerColor) {
            // use backgroundColor as the default overviewRulerColor if not specified by the user setting
            mergedStyle.overviewRulerColor = mergedStyle.backgroundColor;
          }

          decorationTypes[v] =
            window.createTextEditorDecorationType(mergedStyle);
        });

        const patternString = Object.keys(assembledData)
          .map((v) => {
            return escapeRegExp(v);
          })
          .join("|");
        pattern = new RegExp(patternString, "gi");
      }
    }

    pattern = new RegExp(pattern, "gi");
    if (isCaseSensitive) {
      pattern = new RegExp(pattern, "g");
    }
  }

  function triggerUpdateDecorations() {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(updateDecorations, 0);
  }

  // Flawuldragon Configs
  console.log("Flawuldragon is loaded!");
  const flawuldragonStatusbaritemId = "flawuldragon.extension.infos";
  context.subscriptions.push(
    vscode.commands.registerCommand(flawuldragonStatusbaritemId, () => {
      let viewPanel = vscode.window.createWebviewPanel(
        "flawuldragon",
        "Flawuldragon Notes",
        vscode.ViewColumn.Two,
        {}
      );
      viewPanel.title = "Flawuldragon Notes";
      viewPanel.iconPath = vscode.Uri.file(
        path.join(__dirname, "../", "assets", "icon.png")
      );
      viewPanel.webview.html = fs
        .readFileSync(
          path.join(__dirname, "../", "assets", "flawuldragon.html")
        )
        .toString();
      return 0;
    })
  );

  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBar.text = `$(flawuldragon-on) FD`;
  statusBar.command = flawuldragonStatusbaritemId;
  statusBar.color = "darkblue";
  statusBar.backgroundColor = new vscode.ThemeColor(
    "statusBarItem.warningBackground"
  );
  statusBar.tooltip = "Click to view Flawuldragon Notes";
  statusBar.show();
  context.subscriptions.push(statusBar);

  if (
    vscode.workspace.getConfiguration("flawuldragon").get("enable") === false
  ) {
    console.warn("Flawuldragon is disabled. Enable it in your settings.");
    vscode.window.showWarningMessage(
      "Flawuldragon is disabled. Enable it in your settings."
    );
    statusBar.text = `$(flawuldragon-off) The Flawuldragon`;
    statusBar.color = "darkred";
    statusBar.backgroundColor = new vscode.ThemeColor(
      "statusBarItem.errorBackground"
    );
    return;
  }
}

export function deactivate(context: vscode.ExtensionContext) {
  deactivateJBM(context);
}
