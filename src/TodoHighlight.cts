import * as vscode from 'vscode';

export class TodoHighlight {

  private os = require("os");
  private defaultIcon = "$(checklist)";
  private zapIcon = "$(zap)";
  private defaultMsg = "0";

  public todohighlight_activate(context: vscode.ExtensionContext) {

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
  }

}
