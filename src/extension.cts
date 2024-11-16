var fs = require("fs");
var path = require("path");
var vscode = require("vscode");

/**
 * Activates the extension.
 *
 * This function is called when the extension is activated. It is used to set up
 * any necessary state or register commands, providers, etc.
 *
 * @param context - The context in which the extension is activated. This provides
 * access to the extension's global state, subscriptions, and other utilities.
 */
export function activate(context: typeof vscode.ExtensionContext) {
  let statusBar: typeof vscode.StatusBarItem;
  console.log("Flawuldragon is loaded!");
  const flawuldragonStatusbaritemId = "flawuldragon.extension.infos";
  context.subscriptions.push(
    vscode.commands.registerCommand(flawuldragonStatusbaritemId, () => {
      let viewPanel = vscode.window.createWebviewPanel(
        "flawuldragon",
        "Flawuldragon Notes",
        vscode.ViewColumn.One,
        {},
      );
      viewPanel.title = "Flawuldragon Notes";
      viewPanel.iconPath = vscode.Uri.file(
        path.join(__dirname, "../", "assets", "icon.png"),
      );
      viewPanel.webview.html = fs
        .readFileSync(
          path.join(__dirname, "../", "assets", "flawuldragon.html"),
        )
        .toString();
      return 0;
    }),
  );

  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100,
  );
  statusBar.text = `$(flawuldragon-on) FD`;
  statusBar.command = flawuldragonStatusbaritemId;
  statusBar.color = "darkblue";
  statusBar.backgroundColor = new vscode.ThemeColor(
    "statusBarItem.warningBackground",
  );
  statusBar.tooltip = "Click to view Flawuldragon Notes";
  statusBar.show();
  context.subscriptions.push(statusBar);

  if (
    vscode.workspace.getConfiguration("flawuldragon").get("enable") === false
  ) {
    console.warn("Flawuldragon is disabled. Enable it in your settings.");
    vscode.window.showWarningMessage(
      "Flawuldragon is disabled. Enable it in your settings.",
    );
    statusBar.text = `$(flawuldragon-off) The Flawuldragon`;
    statusBar.color = "darkred";
    statusBar.backgroundColor = new vscode.ThemeColor(
      "statusBarItem.errorBackground",
    );
    return;
  }
}

/**
 * Deactivates the extension.
 *
 * This function is called when the extension is deactivated. It can be used to
 * perform any necessary cleanup tasks.
 *
 * @param context - The context in which the extension is running.
 */
export function deactivate(context: typeof vscode.ExtensionContext) {}

// import fs from "fs";
// import path from "path";
// import vscode from "vscode";
// import { annotationsFound, chooseAnnotationType, createStatusBarItem, deactivateJetBrainsMono, DEFAULT_STYLE, escapeRegExp, firstTimeActivation, getAssembledData, JetBrainsMonoActivation, searchAnnotations, showOutputChannel } from "./util.cjs";

// let statusBar: vscode.StatusBarItem;
// let window = vscode.window;
// let statusBarItem: vscode.StatusBarItem | undefined;
// let workspace = vscode.workspace;

// // File Size Configs Functions
// function getCurrentFileSize(statusItem: {
//   text: string | undefined;
//   show: () => void;
// }) {
//   new Promise((resolve) => {
//     let _filepath = vscode.window.activeTextEditor
//       ? vscode.window.activeTextEditor.document.fileName
//       : "";
//     resolve(_filepath);
//   }).then((filepath) => {
//     let _size = fs.statSync(filepath as string).size;
//     let _sizeText = convertSize(_size);

//     // let statusBarRightItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000)
//     statusItem.text = _sizeText;
//     statusItem.show();
//   });
// }

// function convertSize(size: number) {
//   if (size < 1024) {
//     return `${size} B`;
//   } else if (size >= 1024 && size < 1048576) {
//     return `${Math.floor(size / 10.24 / 100)} KB`;
//   } else if (size > 1048576) {
//     return `${Math.floor(size / 10485.76) / 100} MB`;
//   }
// }

// export function activate(context: vscode.ExtensionContext) {
//   // Jetbrains Mono Font Extension Configs
//   console.log(
//     `Congratulations, your extension "${context.extension.packageJSON.displayName} - Jetbrains Mono Font installed!"`,
//   );
//   firstTimeActivation(context);
//   let activateCommand = vscode.commands.registerCommand(
//     "flawuldragon_jetbrainsmonofont.activate",
//     () => JetBrainsMonoActivation(context),
//   );
//   let deactivateCommand = vscode.commands.registerCommand(
//     "flawuldragon_jetbrainsmonofont.deactivate",
//     () => deactivateJetBrainsMono(context),
//   );
//   context.subscriptions.push(activateCommand, deactivateCommand);

//   // Todo Highlight Configs
//   var timeout: NodeJS.Timeout | null = null;
//   var activeEditor = window.activeTextEditor;
//   interface AssembledData {
//     [key: string]: vscode.DecorationRenderOptions;
//   }

//   interface DecorationTypes {
//     [key: string]: vscode.TextEditorDecorationType;
//   }

//   let isCaseSensitive: boolean,
//     assembledData: AssembledData | undefined,
//     decorationTypes: DecorationTypes,
//     pattern: RegExp,
//     styleForRegExp: vscode.DecorationRenderOptions,
//     keywordsPattern: string;
//   var workspaceState = context.workspaceState;

//   var settings = workspace.getConfiguration("todohighlight");

//   init(settings);

//   context.subscriptions.push(
//     vscode.commands.registerCommand(
//       "fd_todohighlight.toggleHighlight",
//       function () {
//         settings
//           .update("isEnable", !settings.get("isEnable"), true)
//           .then(function () {
//             triggerUpdateDecorations();
//           });
//       },
//     ),
//   );

//   context.subscriptions.push(
//     vscode.commands.registerCommand(
//       "fd_todohighlight.listAnnotations",
//       function () {
//         if (keywordsPattern.trim()) {
//           searchAnnotations(
//             workspaceState,
//             pattern,
//             (err: any, annotations: any, annotationList = []) =>
//               annotationsFound(err, annotations, annotationList),
//           );
//         } else {
//           if (!assembledData) return;
//           var availableAnnotationTypes = Object.keys(assembledData);
//           availableAnnotationTypes.unshift("ALL");
//           interface AnnotationType {
//             annotationType: string;
//           }

//           interface SearchPattern {
//             searchPattern: RegExp;
//           }

//           chooseAnnotationType(
//             availableAnnotationTypes.map((type) => ({
//               label: type,
//               annotationType: type,
//             })),
//           ).then(function (annotationType: AnnotationType | undefined) {
//             if (!annotationType) return;

//             var searchPattern: SearchPattern["searchPattern"] = pattern;
//             if (annotationType.annotationType != "ALL") {
//               annotationType.annotationType = escapeRegExp(
//                 annotationType.annotationType,
//               );
//               searchPattern = new RegExp(
//                 annotationType.annotationType,
//                 isCaseSensitive ? "g" : "gi",
//               );
//             }
//             searchAnnotations(
//               workspaceState,
//               searchPattern,
//               (err: any, annotations: any, annotationList = []) =>
//                 annotationsFound(err, annotations, annotationList),
//             );
//           });
//         }
//       },
//     ),
//   );

//   context.subscriptions.push(
//     vscode.commands.registerCommand(
//       "fd_todohighlight.showOutputChannel",
//       function () {
//         var annotationList = workspaceState.get("annotationList", []);
//         showOutputChannel(annotationList);
//       },
//     ),
//   );

//   if (activeEditor) {
//     triggerUpdateDecorations();
//   }

//   window.onDidChangeActiveTextEditor(
//     function (editor: any) {
//       activeEditor = editor;
//       if (editor) {
//         triggerUpdateDecorations();
//       }
//     },
//     null,
//     context.subscriptions,
//   );

//   workspace.onDidChangeTextDocument(
//     function (event: { document: any; }) {
//       if (activeEditor && event.document === activeEditor.document) {
//         triggerUpdateDecorations();
//       }
//     },
//     null,
//     context.subscriptions,
//   );

//   workspace.onDidChangeConfiguration(
//     function () {
//       settings = workspace.getConfiguration("todohighlight");

//       //NOTE: if disabled, do not re-initialize the data or we will not be able to clear the style immediatly via 'toggle highlight' command
//       if (!settings.get("isEnable")) return;

//       init(settings);
//       triggerUpdateDecorations();
//     },
//     null,
//     context.subscriptions,
//   );

//   function init(settings: vscode.WorkspaceConfiguration) {
//     var customDefaultStyle = settings.get("defaultStyle");
//     keywordsPattern = settings.get("keywordsPattern") || "";
//     isCaseSensitive = settings.get("isCaseSensitive", true);
//     if (!statusBarItem) {
//       statusBarItem = createStatusBarItem();
//       statusBarItem = createStatusBarItem();
//     }
//     const outputChannel = vscode.window.createOutputChannel("TodoHighlight");

//     decorationTypes = {};

//     if (keywordsPattern.trim()) {
//       styleForRegExp = Object.assign({}, DEFAULT_STYLE, customDefaultStyle, {
//         overviewRulerLane: vscode.OverviewRulerLane.Right,
//       });
//       pattern = new RegExp(keywordsPattern, isCaseSensitive ? "g" : "gi");
//     } else {
//       assembledData = getAssembledData(
//         settings.get("keywords") || [],
//         customDefaultStyle,
//         isCaseSensitive,
//       );

//       if (assembledData != undefined) {
//         Object.keys(assembledData).forEach((v) => {
//           if (!isCaseSensitive) {
//             v = v.toUpperCase();
//           }

//           var mergedStyle = Object.assign(
//             {},
//             {
//               overviewRulerLane: vscode.OverviewRulerLane.Right,
//             },
//             assembledData ? assembledData[v] : {},
//           );

//           if (!mergedStyle.overviewRulerColor) {
//             // use backgroundColor as the default overviewRulerColor if not specified by the user setting
//             mergedStyle.overviewRulerColor = mergedStyle.backgroundColor;
//           }

//           decorationTypes[v] =
//             window.createTextEditorDecorationType(mergedStyle);
//         });

//         const patternString = Object.keys(assembledData)
//           .map((v) => {
//             return escapeRegExp(v);
//           })
//           .join("|");
//         pattern = new RegExp(patternString, "gi");
//       }
//     }

//     pattern = new RegExp(pattern, "gi");
//     if (isCaseSensitive) {
//       pattern = new RegExp(pattern, "g");
//     }
//   }

//   // File Size Configs
//   let statusBarItemFilesize = vscode.window.createStatusBarItem(
//     vscode.StatusBarAlignment.Left,
//     99,
//   );
//   statusBarItemFilesize.backgroundColor = new vscode.ThemeColor(
//     "statusBarItem.warningBackground",
//   );

//   getCurrentFileSize(statusBarItemFilesize);

//   vscode.window.onDidChangeActiveTextEditor(function () {
//     getCurrentFileSize(statusBarItemFilesize);
//   });

//   vscode.workspace.onDidSaveTextDocument(function () {
//     getCurrentFileSize(statusBarItemFilesize);
//   });

//   // Indent Rainbow Configs
//   // Create a decorator types that we use to decorate indent levels
//   let decorationTypesIR: any[] = [];

//   let doIt = false;
//   let clearMe = false;
//   let currentLanguageId: string | null = null;
//   let skipAllErrors = false;

//   // Error color gets shown when tabs aren't right,
//   //  e.g. when you have your tabs set to 2 spaces but the indent is 3 spaces
//   const error_color = vscode.workspace.getConfiguration('indentRainbow')['errorColor'] || "rgba(128,32,32,0.3)";
//   const error_decoration_type = vscode.window.createTextEditorDecorationType({
//     backgroundColor: error_color
//   });

//   const tabmix_color = vscode.workspace.getConfiguration('indentRainbow')['tabmixColor'] || "";
//   const tabmix_decoration_type = "" !== tabmix_color ? vscode.window.createTextEditorDecorationType({
//     backgroundColor: tabmix_color
//   }) : null;

//   const ignoreLinePatterns = vscode.workspace.getConfiguration('indentRainbow')['ignoreLinePatterns'] || [];
//   const colorOnWhiteSpaceOnly = vscode.workspace.getConfiguration('indentRainbow')['colorOnWhiteSpaceOnly'] || false;
//   const indicatorStyle = vscode.workspace.getConfiguration('indentRainbow')['indicatorStyle'] || 'classic';
//   const lightIndicatorStyleLineWidth = vscode.workspace.getConfiguration('indentRainbow')['lightIndicatorStyleLineWidth'] || 1;

//   // Colors will cycle through, and can be any size that you want
//   const colors = vscode.workspace.getConfiguration('indentRainbow')['colors'] || [
//     "rgba(255,255,64,0.07)",
//     "rgba(127,255,127,0.07)",
//     "rgba(255,127,255,0.07)",
//     "rgba(79,236,236,0.07)"
//   ];

//   // Loops through colors and creates decoration types for each one
//   colors.forEach((color: any, index: number) => {
//     if (indicatorStyle === 'classic') {
//       decorationTypesIR[index] = vscode.window.createTextEditorDecorationType({
//         backgroundColor: color
//       });
//     } else if (indicatorStyle === 'light') {
//       decorationTypesIR[index] = vscode.window.createTextEditorDecorationType({
//         borderStyle: "solid",
//         borderColor: color,
//         borderWidth: `0 0 0 ${lightIndicatorStyleLineWidth}px`
//       });
//     }
//   });

//   // loop through ignore regex strings and convert to valid RegEx's.
//   ignoreLinePatterns.forEach((ignorePattern: string | RegExp,index: string | number) => {
//     if (typeof ignorePattern === 'string') {
//       //parse the string for a regex
//       var regParts = ignorePattern.match(/^\/(.*?)\/([gim]*)$/);
//       if (regParts) {
//         // the parsed pattern had delimiters and modifiers. handle them.
//         ignoreLinePatterns[index] = new RegExp(regParts[1], regParts[2]);
//       } else {
//         // we got pattern string without delimiters
//         ignoreLinePatterns[index] = new RegExp(ignorePattern);
//       }
//     }
//   });

//   if(activeEditor) {
//     indentConfig();
//   }

//   if (activeEditor && checkLanguage()) {
//     triggerUpdateDecorations();
//   }

//   vscode.window.onDidChangeActiveTextEditor(editor => {
//     activeEditor = editor;
//     if (editor) {
//       indentConfig();
//     }

//     if (editor && checkLanguage()) {
//       triggerUpdateDecorations();
//     }
//   }, null, context.subscriptions);

//   vscode.workspace.onDidChangeTextDocument(event => {
//     if(activeEditor) {
//       indentConfig();
//     }

//     if (activeEditor && event.document === activeEditor.document && checkLanguage()) {
//       triggerUpdateDecorations();
//     }
//   }, null, context.subscriptions);

//   function isEmptyObject(obj: any) {
//       return Object.getOwnPropertyNames(obj).length === 0;
//   }

//   function indentConfig() {
//     var skiplang = vscode.workspace.getConfiguration('indentRainbow')['ignoreErrorLanguages'] || [];
//     skipAllErrors = false;
//     if(skiplang.length !== 0) {
//       if(skiplang.indexOf('*') !== -1 || skiplang.indexOf(currentLanguageId) !== -1) {
//         skipAllErrors = true;
//       }
//     }
//   }

//   function checkLanguage() {
//     if (activeEditor) {
//       if(currentLanguageId !== activeEditor.document.languageId) {
//         var inclang = vscode.workspace.getConfiguration('indentRainbow')['includedLanguages'] || [];
//         var exclang = vscode.workspace.getConfiguration('indentRainbow')['excludedLanguages'] || [];

//         currentLanguageId = activeEditor.document.languageId;
//         doIt = true;
//         if(inclang.length !== 0) {
//           if(inclang.indexOf(currentLanguageId) === -1) {
//             doIt = false;
//           }
//         }

//         if(doIt && exclang.length !== 0) {
//           if(exclang.indexOf(currentLanguageId) !== -1) {
//             doIt = false;
//           }
//         }
//       }
//     }

//     if( clearMe && ! doIt) {
//       // Clear decorations when language switches away
//       var decor: vscode.DecorationOptions[] = [];
//       for (let decorationType of decorationTypesIR) {
//         if(activeEditor)
//         activeEditor.setDecorations(decorationType, decor);
//       }
//       clearMe = false;
//     }

//     indentConfig();

//     return doIt;
//   }

//   var timeout: NodeJS.Timeout | null = null;
//   function triggerUpdateDecorations() {
//     if (timeout) {
//       clearTimeout(timeout);
//     }
//     var updateDelay = vscode.workspace.getConfiguration('indentRainbow')['updateDelay'] || 100;
//     timeout = setTimeout(updateDecorations, updateDelay);
//   }

//   function updateDecorations() {
//     if (!activeEditor) {
//       return;
//     }
//     var regEx = /^[\t ]+/gm;
//     var text = activeEditor.document.getText();
//     var tabSizeRaw = activeEditor.options.tabSize;
//     var tabSize = 4
//     if(tabSizeRaw != 'auto' && tabSizeRaw != null) {
//       tabSize=+tabSizeRaw
//     }
//     var tabs = " ".repeat(tabSize);
//     const ignoreLines: number[] = [];
//     let error_decorator: vscode.DecorationOptions[] = [];
//     let tabmix_decorator: vscode.DecorationOptions[] = tabmix_decoration_type ? [] : [];
//     let decorators: any[] = [];
//     decorationTypesIR.forEach(() => {
//       let decorator: vscode.DecorationOptions[] = [];
//       decorators.push(decorator);
//     });

//     var match;
//     var ignore;

//     if(!skipAllErrors) {
//       /**
//        * Checks text against ignore regex patterns from config(or default).
//        * stores the line positions of those lines in the ignoreLines array.
//        */
//       ignoreLinePatterns.forEach((ignorePattern: { exec: (arg0: string) => any; }) => {
//         while (ignore = ignorePattern.exec(text)) {
//           const pos = activeEditor ? activeEditor.document.positionAt(ignore.index) : undefined;
//           if(activeEditor) {
//             const line = pos ? activeEditor.document.lineAt(pos).lineNumber : 0;
//             ignoreLines.push(line);
//           }
//         }
//       });
//     }

//     var re = new RegExp("\t","g");
//     let defaultIndentCharRegExp = null;

//     while (match = regEx.exec(text)) {
//       const pos = activeEditor.document.positionAt(match.index);
//       const line = activeEditor.document.lineAt(pos).lineNumber;
//       let skip = skipAllErrors || ignoreLines.indexOf(line) !== -1; // true if the lineNumber is in ignoreLines.
//      var thematch = match[0];
//       var ma = (match[0].replace(re, tabs)).length;
//       /**
//        * Error handling.
//        * When the indent spacing (as spaces) is not divisible by the tabsize,
//        * consider the indent incorrect and mark it with the error decorator.
//        * Checks for lines being ignored in ignoreLines array ( `skip` Boolran)
//        * before considering the line an error.
//        */
//       if(!skip && ma % tabSize !== 0) {
//         var startPos = activeEditor.document.positionAt(match.index);
//         var endPos = activeEditor.document.positionAt(match.index + match[0].length);
//         var decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: undefined };
//         error_decorator.push(decoration);
//       } else {
//         var m = match[0];
//         var l = m.length;
//         var o = 0;
//         var n = 0;
//         while(n < l) {
//           const s = n;
//           var startPos = activeEditor.document.positionAt(match.index + n);
//           if(m[n] === "\t") {
//             n++;
//           } else {
//             n+=tabSize;
//           }
//           if (colorOnWhiteSpaceOnly && n > l) {
//             n = l
//           }
//           var endPos = activeEditor.document.positionAt(match.index + n);
//           var decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: undefined };
//           var sc=0;
//           var tc=0;
//           if (!skip && tabmix_decorator) {
//             // counting (split is said to be faster than match()
//             // only do it if we don't already skip all errors
//             var tc=(thematch.split("\t").length - 1)
//             if(tc) {
//               // only do this if we already have some tabs
//               var sc=(thematch.split(" ").length - 1)
//             }
//             // if we have (only) "spaces" in a "tab" indent file we
//             // just ignore that, because we don't know if there
//             // should really be tabs or spaces for indentation
//             // If you (yes you!) know how to find this out without
//             // infering this from the file, speak up :)
//           }
//           if(sc>0 && tc>0) {
//             tabmix_decorator.push(decoration);
//           } else {
//             let decorator_index = o % decorators.length;
//             decorators[decorator_index].push(decoration);
//           }
//           o++;
//         }
//       }
//     }
//     decorationTypesIR.forEach((decorationType, index) => {
//       if(activeEditor)
//         activeEditor.setDecorations(decorationType, decorators[index]);
//     });
//     activeEditor.setDecorations(error_decoration_type, error_decorator);
//     tabmix_decoration_type && activeEditor.setDecorations(tabmix_decoration_type, tabmix_decorator);
//     clearMe = true;
//   }
//   /**
//    * Listen for configuration change in indentRainbow section
//    * When anything changes in the section, show a prompt to reload
//    * VSCode window
//   */
//   vscode.workspace.onDidChangeConfiguration(configChangeEvent => {

//     if (configChangeEvent.affectsConfiguration('indentRainbow')) {
//       const actions = ['Reload now', 'Later'];

//       vscode.window
//         .showInformationMessage('The VSCode window needs to reload for the changes to take effect. Would you like to reload the window now?', ...actions)
//         .then(action => {
//           if (action === actions[0]) {
//             vscode.commands.executeCommand('workbench.action.reloadWindow');
//           }
//         });
//     }
// 	});

//   // Flawuldragon Configs
//   console.log("Flawuldragon is loaded!");
//   const flawuldragonStatusbaritemId = "flawuldragon.extension.infos";
//   context.subscriptions.push(
//     vscode.commands.registerCommand(flawuldragonStatusbaritemId, () => {
//       let viewPanel = vscode.window.createWebviewPanel(
//         "flawuldragon",
//         "Flawuldragon Notes",
//         vscode.ViewColumn.One,
//         {},
//       );
//       viewPanel.title = "Flawuldragon Notes";
//       viewPanel.iconPath = vscode.Uri.file(
//         path.join(__dirname, "../", "assets", "icon.png"),
//       );
//       viewPanel.webview.html = fs
//         .readFileSync(
//           path.join(__dirname, "../", "assets", "flawuldragon.html"),
//         )
//         .toString();
//       return 0;
//     }),
//   );

//   statusBar = vscode.window.createStatusBarItem(
//     vscode.StatusBarAlignment.Left,
//     100,
//   );
//   statusBar.text = `$(flawuldragon-on) FD`;
//   statusBar.command = flawuldragonStatusbaritemId;
//   statusBar.color = "darkblue";
//   statusBar.backgroundColor = new vscode.ThemeColor(
//     "statusBarItem.warningBackground",
//   );
//   statusBar.tooltip = "Click to view Flawuldragon Notes";
//   statusBar.show();
//   context.subscriptions.push(statusBar);

//   if (
//     vscode.workspace.getConfiguration("flawuldragon").get("enable") === false
//   ) {
//     console.warn("Flawuldragon is disabled. Enable it in your settings.");
//     vscode.window.showWarningMessage(
//       "Flawuldragon is disabled. Enable it in your settings.",
//     );
//     statusBar.text = `$(flawuldragon-off) The Flawuldragon`;
//     statusBar.color = "darkred";
//     statusBar.backgroundColor = new vscode.ThemeColor(
//       "statusBarItem.errorBackground",
//     );
//     return;
//   }
// }

// export function deactivate(context: vscode.ExtensionContext) {
//   // Jetbrains Mono Font Extension Configs
//   deactivateJetBrainsMono(context);
// }
