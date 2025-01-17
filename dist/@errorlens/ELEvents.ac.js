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
exports.ELEvents = void 0;
const lodash_1 = require("lodash");
const vscode = __importStar(require("vscode"));
const ELCustomDelay_ac_js_1 = require("./ELCustomDelay.ac.js");
const ELDecorations_ac_js_1 = require("./ELDecorations.ac.js");
const ELExtUtils_ac_js_1 = require("./ELExtUtils.ac.js");
const ELNewDelay_ac_js_1 = require("./ELNewDelay.ac.js");
const ErrorLens_js_1 = require("./ErrorLens.js");
// events.ts
class ELEvents {
    onDidChangeDiagnosticsDisposable;
    onDidChangeActiveTextEditor;
    onDidChangeVisibleTextEditors;
    onDidCursorChangeDisposable;
    onDidChangeBreakpoints;
    onDidChangeTextEditorVisibleRangesDisposable;
    onDidChangeTextDocumentForOnSaveDisposable;
    onDidSaveTextDocumentDisposable;
    newDelay;
    // Defina os tipos de decoração
    errorDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255,0,0,0.3)', // Vermelho para erros
    });
    warningDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255,255,0,0.3)', // Amarelo para avisos
    });
    infoDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(0,0,255,0.3)', // Azul para informações
    });
    hintDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(0,255,0,0.3)', // Verde para dicas
    });
    // Função para aplicar decorações com base nos diagnósticos
    applyDecorations(editor, diagnostics) {
        const errorDecorations = [];
        const warningDecorations = [];
        const infoDecorations = [];
        const hintDecorations = [];
        for (const diagnostic of diagnostics) {
            const decoration = {
                range: diagnostic.range,
                hoverMessage: diagnostic.message,
            };
            switch (diagnostic.severity) {
                case vscode.DiagnosticSeverity.Error:
                    errorDecorations.push(decoration);
                    break;
                case vscode.DiagnosticSeverity.Warning:
                    warningDecorations.push(decoration);
                    break;
                case vscode.DiagnosticSeverity.Information:
                    infoDecorations.push(decoration);
                    break;
                case vscode.DiagnosticSeverity.Hint:
                    hintDecorations.push(decoration);
                    break;
            }
        }
        editor.setDecorations(this.errorDecorationType, errorDecorations);
        editor.setDecorations(this.warningDecorationType, warningDecorations);
        editor.setDecorations(this.infoDecorationType, infoDecorations);
        editor.setDecorations(this.hintDecorationType, hintDecorations);
    }
    /**
     * Update listener for when active editor changes.
     */
    updateChangedActiveTextEditorListener() {
        this.onDidChangeActiveTextEditor?.dispose();
        this.onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(editor => {
            ErrorLens_js_1.$state.log('onDidChangeActiveTextEditor()', editor?.document.uri.toString(true));
            if (ErrorLens_js_1.$config.onSave && !ErrorLens_js_1.$config.onSaveUpdateOnActiveEditorChange) {
                return;
            }
            if (editor) {
                ELDecorations_ac_js_1.ELDecorations.prototype.updateDecorationsForUri({
                    uri: editor.document.uri,
                    editor,
                });
                const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
                this.applyDecorations(editor, diagnostics);
            }
            else {
                ErrorLens_js_1.$state.statusBarMessage.clear();
            }
        });
    }
    /**
     * Update listener for when visible editors change.
     */
    updateChangeVisibleTextEditorsListener() {
        this.onDidChangeVisibleTextEditors?.dispose();
        this.onDidChangeVisibleTextEditors = vscode.window.onDidChangeVisibleTextEditors(ELDecorations_ac_js_1.ELDecorations.prototype.updateDecorationsForAllVisibleEditors);
    }
    /**
     * Update listener for when language server (or extension) sends diagnostic change events.
     */
    updateChangeDiagnosticListener() {
        this.onDidChangeDiagnosticsDisposable?.dispose();
        function onChangedDiagnostics(diagnosticChangeEvent) {
            // Many URIs can change - we only need to decorate visible editors
            for (const uri of diagnosticChangeEvent.uris) {
                for (const editor of vscode.window.visibleTextEditors) {
                    if (uri.toString(true) === editor.document.uri.toString(true)) {
                        ErrorLens_js_1.$state.log('onChangedDiagnostics()');
                        ELDecorations_ac_js_1.ELDecorations.prototype.updateDecorationsForUri({
                            uri,
                            editor,
                        });
                    }
                }
            }
            ErrorLens_js_1.$state.statusBarIcons.updateText();
        }
        if (ErrorLens_js_1.$config.onSave) {
            // onDidChangeDiagnosticsDisposable = languages.onDidChangeDiagnostics(e => {
            // 	// if (Date.now() - $state.lastSavedTimestamp < $config.onSaveTimeout) {
            // 	// 	onChangedDiagnostics(e);
            // 	// }
            // });
            return;
        }
        if (typeof ErrorLens_js_1.$config.delay === 'number' && ErrorLens_js_1.$config.delay > 0) {
            // Delay
            const delayMs = Math.max(ErrorLens_js_1.$config.delay, 500) || 500;
            if (ErrorLens_js_1.$config.delayMode === 'old') {
                const customDelay = new ELCustomDelay_ac_js_1.ELCustomDelay(delayMs);
                this.onDidChangeDiagnosticsDisposable = vscode.languages.onDidChangeDiagnostics(customDelay.onDiagnosticChange);
            }
            else if (ErrorLens_js_1.$config.delayMode === 'debounce') {
                this.onDidChangeDiagnosticsDisposable = vscode.languages.onDidChangeDiagnostics((0, lodash_1.debounce)((e) => {
                    onChangedDiagnostics(e);
                }, delayMs));
            }
            else if (ErrorLens_js_1.$config.delayMode === 'new') {
                this.newDelay?.dispose();
                this.newDelay = new ELNewDelay_ac_js_1.ELNewDelay(delayMs);
                this.onDidChangeDiagnosticsDisposable = vscode.languages.onDidChangeDiagnostics(this.newDelay.onDiagnosticChange);
            }
        }
        else {
            // No delay
            this.onDidChangeDiagnosticsDisposable = vscode.languages.onDidChangeDiagnostics(onChangedDiagnostics);
        }
    }
    /**
     * Update listener for when active selection (cursor) moves.
     * (only assign event listener when needed: either render decorations depending on caret OR status bar message depending on caret)
     */
    updateCursorChangeListener() {
        this.onDidCursorChangeDisposable?.dispose();
        const shouldUpdateEditorDecorations = ErrorLens_js_1.$config.followCursor === 'activeLine' ||
            ErrorLens_js_1.$config.followCursor === 'closestProblem' ||
            ErrorLens_js_1.$config.followCursor === 'allLinesExceptActive' ||
            ErrorLens_js_1.$config.followCursor === 'closestProblemMultiline';
        if (shouldUpdateEditorDecorations ||
            ELExtUtils_ac_js_1.ELExtUtils.prototype.shouldShowStatusBarMessage()) {
            let lastPositionLine = -1;
            this.onDidCursorChangeDisposable = vscode.window.onDidChangeTextEditorSelection(e => {
                const selection = e.selections[0];
                // Only update on active line change
                if (this.caretMovedToAnotherLine(e.selections, lastPositionLine)) {
                    ErrorLens_js_1.$state.log('caret moved to another line');
                    if (shouldUpdateEditorDecorations) {
                        ELDecorations_ac_js_1.ELDecorations.prototype.updateDecorationsForUri({
                            uri: e.textEditor.document.uri,
                            editor: e.textEditor,
                            range: selection,
                        });
                    }
                    if (ELExtUtils_ac_js_1.ELExtUtils.prototype.shouldShowStatusBarMessage()) {
                        ErrorLens_js_1.$state.statusBarMessage.updateText(e.textEditor, ELExtUtils_ac_js_1.ELExtUtils.prototype.groupDiagnosticsByLine(vscode.languages.getDiagnostics(e.textEditor.document.uri)));
                    }
                    lastPositionLine = e.selections[0].active.line;
                }
                // Update on any cursor movements
                if (ErrorLens_js_1.$config.statusBarMessageType === 'activeCursor') {
                    ErrorLens_js_1.$state.statusBarMessage.updateText(e.textEditor, ELExtUtils_ac_js_1.ELExtUtils.prototype.groupDiagnosticsByLine(vscode.languages.getDiagnostics(e.textEditor.document.uri)));
                }
            });
        }
    }
    caretMovedToAnotherLine(selections, lastPositionLine) {
        return selections.length === 1 &&
            selections[0].isEmpty &&
            lastPositionLine !== selections[0].active.line;
    }
    updateOnVisibleRangesListener() {
        this.onDidChangeTextEditorVisibleRangesDisposable?.dispose();
        if (!ErrorLens_js_1.$state.shouldUpdateOnEditorScrollEvent) {
            return;
        }
        this.onDidChangeTextEditorVisibleRangesDisposable = vscode.window.onDidChangeTextEditorVisibleRanges(e => {
            ErrorLens_js_1.$state.log('scrolling');
            ELDecorations_ac_js_1.ELDecorations.prototype.updateDecorationsForUri({
                uri: e.textEditor.document.uri,
                editor: e.textEditor,
            });
            // throttle(() => {
            // }, 300, {
            // 	leading: false,
            // });
        });
    }
    /**
     * Update listener for when user performs manual save.
     *
     * Editor `files.autoSave` is ignored.
     */
    updateOnSaveListener() {
        this.onDidSaveTextDocumentDisposable?.dispose();
        this.onDidChangeTextDocumentForOnSaveDisposable?.dispose();
        if (!ErrorLens_js_1.$config.onSave) {
            return;
        }
        this.onDidSaveTextDocumentDisposable = vscode.workspace.onWillSaveTextDocument(e => {
            ErrorLens_js_1.$state.log('onWillSaveTextDocument()');
            if (e.reason === vscode.TextDocumentSaveReason.Manual) {
                setTimeout(() => {
                    ELDecorations_ac_js_1.ELDecorations.prototype.updateDecorationsForUri({
                        uri: e.document.uri,
                    });
                }, 250);
                setTimeout(() => {
                    ELDecorations_ac_js_1.ELDecorations.prototype.updateDecorationsForUri({
                        uri: e.document.uri,
                    });
                }, ErrorLens_js_1.$config.onSaveTimeout);
            }
        });
        this.onDidChangeTextDocumentForOnSaveDisposable = vscode.workspace.onDidChangeTextDocument(e => {
            ELDecorations_ac_js_1.ELDecorations.prototype.updateDecorationsForUri({
                uri: e.document.uri,
                groupedDiagnostics: {},
            });
        });
    }
    updateChangeBreakpointsListener() {
        this.onDidChangeBreakpoints?.dispose();
        if (ELExtUtils_ac_js_1.ELExtUtils.prototype.shouldShowGutterIcons()) {
            this.onDidChangeBreakpoints = vscode.debug.onDidChangeBreakpoints(() => {
                for (const editor of vscode.window.visibleTextEditors) {
                    ELDecorations_ac_js_1.ELDecorations.prototype.updateWorkaroundGutterIcon(editor);
                }
            });
        }
    }
    disposeAllEventListeners() {
        this.onDidChangeVisibleTextEditors?.dispose();
        this.onDidChangeDiagnosticsDisposable?.dispose();
        this.onDidChangeActiveTextEditor?.dispose();
        this.onDidCursorChangeDisposable?.dispose();
        this.onDidChangeBreakpoints?.dispose();
        this.onDidChangeTextEditorVisibleRangesDisposable?.dispose();
        this.onDidSaveTextDocumentDisposable?.dispose();
        this.onDidChangeTextDocumentForOnSaveDisposable?.dispose();
        this.newDelay?.dispose();
    }
}
exports.ELEvents = ELEvents;
