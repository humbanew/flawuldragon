"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ELDecorationsTextEditor = void 0;
const vscode = __importStar(require("vscode"));
class ELDecorationsTextEditor {
    activate(context) {
        let errorLensEnabled = true;
        // Use the console to output diagnostic information (console.log) and errors (console.error)
        // console.log('Visual Studio Code Extension "errorlens" is now active');
        // Commands are defined in the package.json file
        // let disposableEnableErrorLens = vscode.commands.registerCommand('ErrorLens.enable', () => {
        //     errorLensEnabled = true;
        //     const activeTextEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
        //     if (activeTextEditor) {
        //         updateDecorationsForUri(activeTextEditor.document.uri);
        //     }
        // });
        // context.subscriptions.push(disposableEnableErrorLens);
        // let disposableDisableErrorLens = vscode.commands.registerCommand('ErrorLens.disable', () => {
        //     errorLensEnabled = false;
        //     const activeTextEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
        //     if (activeTextEditor) {
        //         updateDecorationsForUri(activeTextEditor.document.uri);
        //     }
        // });
        // context.subscriptions.push(disposableDisableErrorLens);
        function GetErrorBackgroundColor() {
            const errorColor = "rgba(240,10,0,0.5)";
            return errorColor;
        }
        function GetWarningBackgroundColor() {
            const warningColor = "rgba(200,100,0,0.5)";
            return warningColor;
        }
        function GetInfoBackgroundColor() {
            const infoColor = "rgba(40,20,120,0.5)";
            return infoColor;
        }
        function GetHintBackgroundColor() {
            const hintColor = "rgba(20,120,40,0.5)";
            return hintColor;
        }
        function GetEnabledDiagnosticLevels() {
            const enabledDiagnosticLevels = ["error", "warning"];
            return enabledDiagnosticLevels;
        }
        function IsErrorLevelEnabled() {
            return (GetEnabledDiagnosticLevels().indexOf("error") >= 0);
        }
        function IsWarningLevelEnabled() {
            return (GetEnabledDiagnosticLevels().indexOf("warning") >= 0);
        }
        function IsInfoLevelEnabled() {
            return (GetEnabledDiagnosticLevels().indexOf("info") >= 0);
        }
        function IsHintLevelEnabled() {
            return (GetEnabledDiagnosticLevels().indexOf("hint") >= 0);
        }
        function GetStatusBarControl() {
            const cfg = vscode.workspace.getConfiguration("errorLens");
            const statusBarControl = cfg.get("statusBarControl") || "hide-when-no-issues";
            return statusBarControl;
        }
        function AddAnnotationTextPrefixes() {
            const cfg = vscode.workspace.getConfiguration("errorLens");
            const addAnnotationTextPrefixes = cfg.get("addAnnotationTextPrefixes") || false;
            return addAnnotationTextPrefixes;
        }
        // Create decorator types that we use to amplify lines containing errors, warnings, info, etc.
        // createTextEditorDecorationType() ref. @ https://code.visualstudio.com/docs/extensionAPI/vscode-api#window.createTextEditorDecorationType
        // DecorationRenderOptions ref.  @ https://code.visualstudio.com/docs/extensionAPI/vscode-api#DecorationRenderOptions
        let errorLensDecorationTypeError = vscode.window.createTextEditorDecorationType({
            isWholeLine: true,
            backgroundColor: GetErrorBackgroundColor()
        });
        let errorLensDecorationTypeWarning = vscode.window.createTextEditorDecorationType({
            isWholeLine: true,
            backgroundColor: GetWarningBackgroundColor()
        });
        let errorLensDecorationTypeInfo = vscode.window.createTextEditorDecorationType({
            isWholeLine: true,
            backgroundColor: GetInfoBackgroundColor()
        });
        let errorLensDecorationTypeHint = vscode.window.createTextEditorDecorationType({
            isWholeLine: true,
            backgroundColor: GetHintBackgroundColor()
        });
        vscode.languages.onDidChangeDiagnostics(diagnosticChangeEvent => { onChangedDiagnostics(diagnosticChangeEvent); }, null, context.subscriptions);
        // Note: URIs for onDidOpenTextDocument() can contain schemes other than file:// (such as git://)
        vscode.workspace.onDidOpenTextDocument(textDocument => { updateDecorationsForUri(textDocument.uri); }, null, context.subscriptions);
        // Update on editor switch.
        vscode.window.onDidChangeActiveTextEditor(textEditor => {
            if (textEditor === undefined) {
                return;
            }
            updateDecorationsForUri(textEditor.document.uri);
        }, null, context.subscriptions);
        /**
         * Invoked by onDidChangeDiagnostics() when the language diagnostics change.
         *
         * @param {vscode.DiagnosticChangeEvent} diagnosticChangeEvent - Contains info about the change in diagnostics.
         */
        function onChangedDiagnostics(diagnosticChangeEvent) {
            if (!vscode.window) {
                return;
            }
            const activeTextEditor = vscode.window.activeTextEditor;
            if (!activeTextEditor) {
                return;
            }
            // Many URIs can change - we only need to decorate the active text editor
            for (const uri of diagnosticChangeEvent.uris) {
                // Only update decorations for the active text editor.
                if (uri.fsPath === activeTextEditor.document.uri.fsPath) {
                    updateDecorationsForUri(uri);
                    break;
                }
            }
        }
        /**
         * Update the editor decorations for the provided URI. Only if the URI scheme is "file" is the function
         * processed. (It can be others, such as "git://<something>", in which case the function early-exits).
         *
         * @param {vscode.Uri} uriToDecorate - Uri to add decorations to.
         */
        function updateDecorationsForUri(uriToDecorate) {
            if (!uriToDecorate) {
                return;
            }
            // Only process "file://" URIs.
            if (uriToDecorate.scheme !== "file") {
                return;
            }
            if (!vscode.window) {
                return;
            }
            const activeTextEditor = vscode.window.activeTextEditor;
            if (!activeTextEditor) {
                return;
            }
            if (!activeTextEditor.document.uri.fsPath) {
                return;
            }
            const errorLensDecorationOptionsError = [];
            const errorLensDecorationOptionsWarning = [];
            const errorLensDecorationOptionsInfo = [];
            const errorLensDecorationOptionsHint = [];
            let numErrors = 0;
            let numWarnings = 0;
            // The aggregatedDiagnostics object will contain one or more objects, each object being keyed by "lineN",
            // where N is the source line where one or more diagnostics are being reported.
            // Each object which is keyed by "lineN" will contain one or more arrayDiagnostics[] array of objects.
            // This facilitates gathering info about lines which contain more than one diagnostic.
            // {
            //     line28: {
            //         line: 28,
            //         arrayDiagnostics: [ <vscode.Diagnostic #1> ]
            //     },
            //     line67: {
            //         line: 67,
            //         arrayDiagnostics: [ <vscode.Diagnostic# 1>, <vscode.Diagnostic# 2> ]
            //     },
            //     line93: {
            //         line: 93,
            //         arrayDiagnostics: [ <vscode.Diagnostic #1> ]
            //     }
            // };
            if (errorLensEnabled) {
                let aggregatedDiagnostics = {};
                let diagnostic;
                // Iterate over each diagnostic that VS Code has reported for this file. For each one, add to
                // a list of objects, grouping together diagnostics which occur on a single line.
                for (diagnostic of vscode.languages.getDiagnostics(uriToDecorate)) {
                    let key = "line" + diagnostic.range.start.line;
                    if (aggregatedDiagnostics[key]) {
                        // Already added an object for this key, so augment the arrayDiagnostics[] array.
                        aggregatedDiagnostics[key].arrayDiagnostics.push(diagnostic);
                    }
                    else {
                        // Create a new object for this key, specifying the line: and a arrayDiagnostics[] array
                        aggregatedDiagnostics[key] = {
                            line: diagnostic.range.start.line,
                            arrayDiagnostics: [diagnostic]
                        };
                    }
                    switch (diagnostic.severity) {
                        case 0:
                            numErrors += 1;
                            break;
                        case 1:
                            numWarnings += 1;
                            break;
                        // Ignore other severities.
                    }
                }
                let key;
                let addMessagePrefix = AddAnnotationTextPrefixes();
                for (key in aggregatedDiagnostics) // Iterate over property values (not names)
                 {
                    let aggregatedDiagnostic = aggregatedDiagnostics[key];
                    let messagePrefix = "";
                    if (addMessagePrefix) {
                        if (aggregatedDiagnostic.arrayDiagnostics.length > 1) {
                            // If > 1 diagnostic for this source line, the prefix is "Diagnostic #1 of N: "
                            messagePrefix += "Diagnostic 1/" + aggregatedDiagnostic.arrayDiagnostics.length + ": ";
                        }
                        else {
                            // If only 1 diagnostic for this source line, show the diagnostic severity
                            switch (aggregatedDiagnostic.arrayDiagnostics[0].severity) {
                                case 0:
                                    messagePrefix += "Error: ";
                                    break;
                                case 1:
                                    messagePrefix += "Warning: ";
                                    break;
                                case 2:
                                    messagePrefix += "Info: ";
                                    break;
                                case 3:
                                default:
                                    messagePrefix += "Hint: ";
                                    break;
                            }
                        }
                    }
                    let decorationTextColor;
                    let addErrorLens = false;
                    switch (aggregatedDiagnostic.arrayDiagnostics[0].severity) {
                        // Error
                        case 0:
                            if (IsErrorLevelEnabled()) {
                                addErrorLens = true;
                            }
                            break;
                        // Warning
                        case 1:
                            if (IsWarningLevelEnabled()) {
                                addErrorLens = true;
                            }
                            break;
                        // Info
                        case 2:
                            if (IsInfoLevelEnabled()) {
                                addErrorLens = true;
                            }
                            break;
                        // Hint
                        case 3:
                            if (IsHintLevelEnabled()) {
                                addErrorLens = true;
                            }
                            break;
                    }
                }
            }
            // The errorLensDecorationOptions<X> arrays have been built, now apply them.
            activeTextEditor.setDecorations(errorLensDecorationTypeError, errorLensDecorationOptionsError);
            activeTextEditor.setDecorations(errorLensDecorationTypeWarning, errorLensDecorationOptionsWarning);
            activeTextEditor.setDecorations(errorLensDecorationTypeInfo, errorLensDecorationOptionsInfo);
            activeTextEditor.setDecorations(errorLensDecorationTypeHint, errorLensDecorationOptionsHint);
            updateStatusBar(numErrors, numWarnings);
        }
        /**
         * Update the Visual Studio Code status bar, showing the number of warnings and/or errors.
         * Control over when (or if) to show the ErrorLens info in the status bar is controlled via the
         * errorLens.statusBarControl configuration property.
         *
         * @param {number} numErrors - The number of error diagnostics reported.
         * @param {number} numWarnings - The number of warning diagnostics reported.
         */
        function updateStatusBar(numErrors, numWarnings) {
            const statusBarControl = GetStatusBarControl();
            var showStatusBarText = false;
            if (errorLensEnabled) {
                if (statusBarControl === 'always') {
                    showStatusBarText = true;
                }
                else if (statusBarControl === 'never') {
                    showStatusBarText = false;
                }
                else if (statusBarControl === 'hide-when-no-issues') {
                    if (numErrors + numWarnings > 0) {
                        showStatusBarText = true;
                    }
                }
            }
        }
        /**
         * Truncate the supplied string to a constant number of characters. (This truncation
         * limit is hard-coded, and may be changed only by editing the const inside this function).
         *
         * @param {string} str - The string to truncate.
         * @returns {string} - The truncated string, if the string argument is over the hard-coded limit.
         */
        function truncate(str) {
            const truncationLimit = 300;
            return str.length > truncationLimit ? str.slice(0, truncationLimit) + '…' : str;
        }
    }
}
exports.ELDecorationsTextEditor = ELDecorationsTextEditor;
