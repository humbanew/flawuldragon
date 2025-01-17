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
exports.ELDecorations = void 0;
const vscode = __importStar(require("vscode"));
const ELDecorationsAlign_ac_js_1 = require("./ELDecorationsAlign.ac.js");
const ELExtUtils_ac_js_1 = require("./ELExtUtils.ac.js");
const ELHover_ac_js_1 = require("./ELHover.ac.js");
const ELGutter_ac_js_1 = require("./ELGutter.ac.js");
const ELMultilineDecoration_ac_js_1 = require("./ELMultilineDecoration.ac.js");
const ErrorLens_js_1 = require("./ErrorLens.js");
// decorations.ts
class ELDecorations {
    constructor() { }
    decorationTypes = {};
    /* eslint-enable @typescript-eslint/sort-type-constituents */
    textDecorationStyleString = '';
    /**
     * Update all decoration styles: editor, gutter, status bar
     */
    setDecorationStyle(context) {
        this.disposeAllDecorations();
        let gutter;
        if (ELExtUtils_ac_js_1.ELExtUtils.prototype.shouldShowGutterIcons()) {
            gutter = ELGutter_ac_js_1.ELGutter.prototype.getGutterStyles(context);
            if (ErrorLens_js_1.$state.renderGutterIconsAsSeparateDecoration) {
                this.decorationTypes.gutterError = vscode.window.createTextEditorDecorationType({
                    gutterIconPath: gutter.errorIconPath,
                    gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
                    light: {
                        gutterIconPath: gutter.errorIconPathLight,
                        gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
                    },
                });
                this.decorationTypes.gutterWarning = vscode.window.createTextEditorDecorationType({
                    gutterIconPath: gutter.warningIconPath,
                    gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
                    light: {
                        gutterIconPath: gutter.warningIconPathLight,
                        gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
                    },
                });
                this.decorationTypes.gutterInfo = vscode.window.createTextEditorDecorationType({
                    gutterIconPath: gutter.infoIconPath,
                    gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
                    light: {
                        gutterIconPath: gutter.infoIconPathLight,
                        gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
                    },
                });
                this.decorationTypes.gutterHint = vscode.window.createTextEditorDecorationType({
                    gutterIconPath: gutter.hintIconPath,
                    gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
                    light: {
                        gutterIconPath: gutter.hintIconPathLight,
                        gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
                    },
                });
                // gutter will be rendered as a separate decoration, delete gutter from ordinary decorations
                gutter = undefined;
            }
        }
        if (ErrorLens_js_1.$config.followCursor === 'closestProblemMultiline' ||
            ErrorLens_js_1.$config.followCursor === 'closestProblemMultilineInViewport' ||
            ErrorLens_js_1.$config.followCursor === 'closestProblemMultilineBySeverity') {
            ELMultilineDecoration_ac_js_1.ELMultilineDecoration.prototype.createMultilineDecorations();
        }
        let errorBackground = new vscode.ThemeColor('flawuldragon.errorLens.errorBackground');
        let errorBackgroundLight = new vscode.ThemeColor('flawuldragon.errorLens.errorBackgroundLight');
        const errorForeground = new vscode.ThemeColor('flawuldragon.errorLens.errorForeground');
        const errorForegroundLight = new vscode.ThemeColor('flawuldragon.errorLens.errorForegroundLight');
        let errorMessageBackground = new vscode.ThemeColor('flawuldragon.errorLens.errorMessageBackground');
        let warningBackground = new vscode.ThemeColor('flawuldragon.errorLens.warningBackground');
        let warningBackgroundLight = new vscode.ThemeColor('flawuldragon.errorLens.warningBackgroundLight');
        const warningForeground = new vscode.ThemeColor('flawuldragon.errorLens.warningForeground');
        const warningForegroundLight = new vscode.ThemeColor('flawuldragon.errorLens.warningForegroundLight');
        let warningMessageBackground = new vscode.ThemeColor('flawuldragon.errorLens.warningMessageBackground');
        let infoBackground = new vscode.ThemeColor('flawuldragon.errorLens.infoBackground');
        let infoBackgroundLight = new vscode.ThemeColor('flawuldragon.errorLens.infoBackgroundLight');
        const infoForeground = new vscode.ThemeColor('flawuldragon.errorLens.infoForeground');
        const infoForegroundLight = new vscode.ThemeColor('flawuldragon.errorLens.infoForegroundLight');
        let infoMessageBackground = new vscode.ThemeColor('flawuldragon.errorLens.infoMessageBackground');
        let hintBackground = new vscode.ThemeColor('flawuldragon.errorLens.hintBackground');
        let hintBackgroundLight = new vscode.ThemeColor('flawuldragon.errorLens.hintBackgroundLight');
        const hintForeground = new vscode.ThemeColor('flawuldragon.errorLens.hintForeground');
        const hintForegroundLight = new vscode.ThemeColor('flawuldragon.errorLens.hintForegroundLight');
        let hintMessageBackground = new vscode.ThemeColor('flawuldragon.errorLens.hintMessageBackground');
        const statusBarErrorForeground = new vscode.ThemeColor('flawuldragon.errorLens.statusBarErrorForeground');
        const statusBarWarningForeground = new vscode.ThemeColor('flawuldragon.errorLens.statusBarWarningForeground');
        const statusBarInfoForeground = new vscode.ThemeColor('flawuldragon.errorLens.statusBarInfoForeground');
        const statusBarHintForeground = new vscode.ThemeColor('flawuldragon.errorLens.statusBarHintForeground');
        if (ErrorLens_js_1.$config.messageBackgroundMode === 'line') {
            errorMessageBackground = undefined;
            warningMessageBackground = undefined;
            infoMessageBackground = undefined;
            hintMessageBackground = undefined;
        }
        else if (ErrorLens_js_1.$config.messageBackgroundMode === 'message') {
            errorBackground = undefined;
            errorBackgroundLight = undefined;
            warningBackground = undefined;
            warningBackgroundLight = undefined;
            infoBackground = undefined;
            infoBackgroundLight = undefined;
            hintBackground = undefined;
            hintBackgroundLight = undefined;
        }
        else if (ErrorLens_js_1.$config.messageBackgroundMode === 'none') {
            errorBackground = undefined;
            errorBackgroundLight = undefined;
            warningBackground = undefined;
            warningBackgroundLight = undefined;
            infoBackground = undefined;
            infoBackgroundLight = undefined;
            hintBackground = undefined;
            hintBackgroundLight = undefined;
            errorMessageBackground = undefined;
            warningMessageBackground = undefined;
            infoMessageBackground = undefined;
            hintMessageBackground = undefined;
        }
        const onlyDigitsRegExp = /^\d+$/u;
        const fontFamily = ErrorLens_js_1.$config.fontFamily ? `font-family:${ErrorLens_js_1.$config.fontFamily}` : '';
        const fontSize = ErrorLens_js_1.$config.fontSize ? `font-size:${onlyDigitsRegExp.test(ErrorLens_js_1.$config.fontSize) ? `${ErrorLens_js_1.$config.fontSize}px` : ErrorLens_js_1.$config.fontSize}` : '';
        const marginLeft = onlyDigitsRegExp.test(ErrorLens_js_1.$config.margin) ? `${ErrorLens_js_1.$config.margin}px` : ErrorLens_js_1.$config.margin;
        const padding = ErrorLens_js_1.$config.padding ? `padding:${onlyDigitsRegExp.test(ErrorLens_js_1.$config.padding) ? `${ErrorLens_js_1.$config.padding}px` : ErrorLens_js_1.$config.padding}` : '';
        const borderRadius = `border-radius: ${ErrorLens_js_1.$config.borderRadius || '0'}`;
        const scrollbarHack = ErrorLens_js_1.$config.scrollbarHackEnabled ? 'position:absolute;pointer-events:none;top:50%;transform:translateY(-50%);' : '';
        this.textDecorationStyleString = `none;${fontFamily};${fontSize};${borderRadius}`;
        const afterProps = {
            fontStyle: ErrorLens_js_1.$config.fontStyleItalic ? 'italic' : 'normal',
            fontWeight: ErrorLens_js_1.$config.fontWeight,
            margin: `0 0 0 ${marginLeft}`,
            textDecoration: `${this.textDecorationStyleString};${padding};${scrollbarHack}`,
        };
        const decorationRenderOptionsError = {
            backgroundColor: errorBackground,
            gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
            gutterIconPath: gutter?.errorIconPath,
            after: {
                ...afterProps,
                color: errorForeground,
                backgroundColor: errorMessageBackground,
                ...ErrorLens_js_1.$config.decorations?.errorMessage,
            },
            light: {
                backgroundColor: errorBackgroundLight,
                gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
                gutterIconPath: gutter?.errorIconPathLight,
                after: {
                    color: errorForegroundLight,
                    ...ErrorLens_js_1.$config.decorations?.errorMessage,
                    ...ErrorLens_js_1.$config.decorations?.errorMessage?.light,
                },
            },
            isWholeLine: true,
        };
        const decorationRenderOptionsWarning = {
            backgroundColor: warningBackground,
            gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
            gutterIconPath: gutter?.warningIconPath,
            after: {
                ...afterProps,
                color: warningForeground,
                backgroundColor: warningMessageBackground,
                ...ErrorLens_js_1.$config.decorations?.warningMessage,
            },
            light: {
                backgroundColor: warningBackgroundLight,
                gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
                gutterIconPath: gutter?.warningIconPathLight,
                after: {
                    color: warningForegroundLight,
                    ...ErrorLens_js_1.$config.decorations?.warningMessage,
                    ...ErrorLens_js_1.$config.decorations?.warningMessage?.light,
                },
            },
            isWholeLine: true,
        };
        const decorationRenderOptionsInfo = {
            backgroundColor: infoBackground,
            gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
            gutterIconPath: gutter?.infoIconPath,
            after: {
                ...afterProps,
                color: infoForeground,
                backgroundColor: infoMessageBackground,
                ...ErrorLens_js_1.$config.decorations?.infoMessage,
            },
            light: {
                backgroundColor: infoBackgroundLight,
                gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
                gutterIconPath: gutter?.infoIconPathLight,
                after: {
                    color: infoForegroundLight,
                    ...ErrorLens_js_1.$config.decorations?.infoMessage,
                    ...ErrorLens_js_1.$config.decorations?.infoMessage?.light,
                },
            },
            isWholeLine: true,
        };
        const decorationRenderOptionsHint = {
            backgroundColor: hintBackground,
            gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
            gutterIconPath: gutter?.hintIconPath,
            after: {
                ...afterProps,
                color: hintForeground,
                backgroundColor: hintMessageBackground,
                ...ErrorLens_js_1.$config.decorations?.hintMessage,
            },
            light: {
                backgroundColor: hintBackgroundLight,
                gutterIconSize: ErrorLens_js_1.$config.gutterIconSize,
                gutterIconPath: gutter?.hintIconPathLight,
                after: {
                    color: hintForegroundLight,
                    ...ErrorLens_js_1.$config.decorations?.hintMessage,
                    ...ErrorLens_js_1.$config.decorations?.hintMessage?.light,
                },
            },
            isWholeLine: true,
        };
        if (!ELExtUtils_ac_js_1.ELExtUtils.prototype.shouldShowInlineMessage()) {
            decorationRenderOptionsError.backgroundColor = undefined;
            decorationRenderOptionsError.after = undefined;
            decorationRenderOptionsError.light.backgroundColor = undefined;
            decorationRenderOptionsError.light.after = undefined;
            decorationRenderOptionsWarning.backgroundColor = undefined;
            decorationRenderOptionsWarning.after = undefined;
            decorationRenderOptionsWarning.light.backgroundColor = undefined;
            decorationRenderOptionsWarning.light.after = undefined;
            decorationRenderOptionsInfo.backgroundColor = undefined;
            decorationRenderOptionsInfo.after = undefined;
            decorationRenderOptionsInfo.light.backgroundColor = undefined;
            decorationRenderOptionsInfo.light.after = undefined;
            decorationRenderOptionsHint.backgroundColor = undefined;
            decorationRenderOptionsHint.after = undefined;
            decorationRenderOptionsHint.light.backgroundColor = undefined;
            decorationRenderOptionsHint.light.after = undefined;
        }
        if (this.decorationTypes) {
            this.decorationTypes.error = vscode.window.createTextEditorDecorationType(decorationRenderOptionsError);
            this.decorationTypes.warning = vscode.window.createTextEditorDecorationType(decorationRenderOptionsWarning);
            this.decorationTypes.info = vscode.window.createTextEditorDecorationType(decorationRenderOptionsInfo);
            this.decorationTypes.hint = vscode.window.createTextEditorDecorationType(decorationRenderOptionsHint);
            // ──── Range ─────────────────────────────────────────────────
            this.decorationTypes.errorRange = vscode.window.createTextEditorDecorationType({
                backgroundColor: new vscode.ThemeColor('flawuldragon.errorLens.errorRangeBackground'),
                rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
                ...ErrorLens_js_1.$config.decorations.errorRange,
            });
            this.decorationTypes.warningRange = vscode.window.createTextEditorDecorationType({
                backgroundColor: new vscode.ThemeColor('flawuldragon.errorLens.warningRangeBackground'),
                rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
                ...ErrorLens_js_1.$config.decorations.warningRange,
            });
            this.decorationTypes.infoRange = vscode.window.createTextEditorDecorationType({
                backgroundColor: new vscode.ThemeColor('flawuldragon.errorLens.infoRangeBackground'),
                rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
                ...ErrorLens_js_1.$config.decorations.infoRange,
            });
            this.decorationTypes.hintRange = vscode.window.createTextEditorDecorationType({
                backgroundColor: new vscode.ThemeColor('flawuldragon.errorLens.hintRangeBackground'),
                rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
                ...ErrorLens_js_1.$config.decorations.hintRange,
            });
        }
        const transparentGutterIcon = {
            gutterIconPath: gutter?.transparent1x1Icon,
            light: {
                gutterIconPath: gutter?.transparent1x1Icon,
            },
        };
        if (this.decorationTypes) {
            this.decorationTypes.transparent1x1Icon = vscode.window.createTextEditorDecorationType(transparentGutterIcon);
        }
        ErrorLens_js_1.$state.statusBarMessage.statusBarColors = [statusBarErrorForeground, statusBarWarningForeground, statusBarInfoForeground, statusBarHintForeground];
    }
    /**
     * Actually apply decorations for editor.
     * @param range Only allow decorating lines in this range.
     */
    doUpdateDecorations(editor, groupedDiagnostics, range) {
        const decorationOptionsError = [];
        const decorationOptionsWarning = [];
        const decorationOptionsInfo = [];
        const decorationOptionsHint = [];
        const decorationOptionsErrorRange = [];
        const decorationOptionsWarningRange = [];
        const decorationOptionsInfoRange = [];
        const decorationOptionsHintRange = [];
        let allowedLineNumbersToRenderDiagnostics;
        if (ErrorLens_js_1.$config.followCursor === 'closestProblem' || ErrorLens_js_1.$config.followCursor === 'closestProblemMultiline') {
            if (range === undefined) {
                range = editor.selection;
            }
            const line = range.start.line;
            const groupedDiagnosticsAsArray = Object?.entries(groupedDiagnostics).sort((a, b) => Math.abs(line - Number(a[0])) - Math.abs(line - Number(b[0])));
            groupedDiagnosticsAsArray.length = ErrorLens_js_1.$config.followCursorMore + 1; // Reduce array length to the number of allowed rendered lines (decorations)
            allowedLineNumbersToRenderDiagnostics = groupedDiagnosticsAsArray.map(d => d[1][0].range.start.line);
        }
        if (ErrorLens_js_1.$config.followCursor === 'closestProblemMultiline' ||
            ErrorLens_js_1.$config.followCursor === 'closestProblemMultilineInViewport' ||
            ErrorLens_js_1.$config.followCursor === 'closestProblemMultilineBySeverity') {
            ELMultilineDecoration_ac_js_1.ELMultilineDecoration.prototype.showMultilineDecoration(editor);
        }
        for (const key in groupedDiagnostics) {
            const allDiagnosticsInLine = groupedDiagnostics[key];
            const diagnostic = allDiagnosticsInLine[0];
            const severity = diagnostic.severity;
            let message;
            if (ELExtUtils_ac_js_1.ELExtUtils.prototype.shouldShowInlineMessage()) {
                message = ELExtUtils_ac_js_1.ELExtUtils.prototype.prepareMessage({
                    diagnostic,
                    template: ErrorLens_js_1.$config.messageTemplate,
                    lineProblemCount: allDiagnosticsInLine.length,
                    removeLinebreaks: ErrorLens_js_1.$config.removeLinebreaks,
                    replaceLinebreaksSymbol: ErrorLens_js_1.$config.replaceLinebreaksSymbol,
                });
            }
            else {
                message = undefined;
            }
            let alignMarginStyle = '';
            let alignRange;
            if (ELExtUtils_ac_js_1.ELExtUtils.prototype.shouldAlign()) {
                const styleForAlignment = ELDecorationsAlign_ac_js_1.ELDecorationsAlign.prototype.getStyleForAlignment({
                    isMultilineDecoration: false,
                    alignmentKind: ErrorLens_js_1.$config.alignMessage.useFixedPosition ? 'fixed' : 'normal',
                    textLine: editor.document.lineAt(Number(key)),
                    indentSize: editor.options.tabSize,
                    indentStyle: editor.options.insertSpaces ? 'spaces' : 'tab',
                    minimumMargin: ErrorLens_js_1.$config.alignMessage.minimumMargin,
                    minVisualLineLength: ErrorLens_js_1.$config.alignMessage.start,
                    start: ErrorLens_js_1.$config.alignMessage.start,
                    end: ErrorLens_js_1.$config.alignMessage.end,
                    problemMessage: message ?? '',
                });
                alignMarginStyle = styleForAlignment.styleStr;
                alignRange = styleForAlignment.range;
            }
            const decInstanceRenderOptions = {
                after: {
                    contentText: message,
                    // height: extUtils.shouldAlign() && $config.alignMessage.useFixedPosition ? '100%' : undefined,
                    textDecoration: ELExtUtils_ac_js_1.ELExtUtils.prototype.shouldAlign() ? `${this.textDecorationStyleString};${alignMarginStyle}` : undefined,
                },
            };
            let messageRange;
            if (ErrorLens_js_1.$config.followCursor === 'allLines') {
                // Default value (most used)
                messageRange = diagnostic.range;
            }
            else {
                // Others require cursor tracking
                if (range === undefined) {
                    range = editor.selection;
                }
                const diagnosticRange = diagnostic.range;
                if (ErrorLens_js_1.$config.followCursor === 'activeLine') {
                    const lineStart = range.start.line - ErrorLens_js_1.$config.followCursorMore;
                    const lineEnd = range.end.line + ErrorLens_js_1.$config.followCursorMore;
                    if (((diagnosticRange.start.line >= lineStart) && (diagnosticRange.start.line <= lineEnd)) ||
                        ((diagnosticRange.end.line >= lineStart) && (diagnosticRange.end.line <= lineEnd))) {
                        messageRange = diagnosticRange;
                    }
                }
                else if (ErrorLens_js_1.$config.followCursor === 'allLinesExceptActive') {
                    const lineStart = range.start.line;
                    const lineEnd = range.end.line;
                    if (((diagnosticRange.start.line >= lineStart) && (diagnosticRange.start.line <= lineEnd)) ||
                        ((diagnosticRange.end.line >= lineStart) && (diagnosticRange.end.line <= lineEnd))) {
                        messageRange = undefined;
                    }
                    else {
                        messageRange = diagnosticRange;
                    }
                }
                else if (ErrorLens_js_1.$config.followCursor === 'closestProblem') {
                    if (allowedLineNumbersToRenderDiagnostics.includes(diagnosticRange.start.line) || allowedLineNumbersToRenderDiagnostics.includes(diagnosticRange.end.line)) {
                        messageRange = diagnosticRange;
                    }
                }
                if (!messageRange) {
                    continue;
                }
            }
            const diagnosticDecorationOptions = {
                range: alignRange ?? new vscode.Range(messageRange.start.line, messageRange.start.character, messageRange.start.line, messageRange.start.character),
                hoverMessage: ELHover_ac_js_1.ELHover.prototype.createHoverForDiagnostic({
                    diagnostic,
                    buttonsEnabled: ErrorLens_js_1.$config.editorHoverPartsEnabled.buttonsEnabled,
                    messageEnabled: ErrorLens_js_1.$config.editorHoverPartsEnabled.messageEnabled,
                    sourceCodeEnabled: ErrorLens_js_1.$config.editorHoverPartsEnabled.sourceCodeEnabled,
                    lintFilePaths: ErrorLens_js_1.$config.lintFilePaths,
                }),
                renderOptions: decInstanceRenderOptions,
            };
            switch (severity) {
                case 0: {
                    decorationOptionsError.push(diagnosticDecorationOptions);
                    if (ErrorLens_js_1.$config.problemRangeDecorationEnabled) {
                        decorationOptionsErrorRange.push({
                            range: messageRange,
                        });
                    }
                    break;
                }
                case 1: {
                    decorationOptionsWarning.push(diagnosticDecorationOptions);
                    if (ErrorLens_js_1.$config.problemRangeDecorationEnabled) {
                        decorationOptionsWarningRange.push({
                            range: messageRange,
                        });
                    }
                    break;
                }
                case 2: {
                    decorationOptionsInfo.push(diagnosticDecorationOptions);
                    if (ErrorLens_js_1.$config.problemRangeDecorationEnabled) {
                        decorationOptionsInfoRange.push({
                            range: messageRange,
                        });
                    }
                    break;
                }
                case 3: {
                    decorationOptionsHint.push(diagnosticDecorationOptions);
                    if (ErrorLens_js_1.$config.problemRangeDecorationEnabled) {
                        decorationOptionsHintRange.push({
                            range: messageRange,
                        });
                    }
                    break;
                }
                default: { }
            }
        }
        if (ELExtUtils_ac_js_1.ELExtUtils.prototype.shouldShowGutterIcons()) {
            this.updateWorkaroundGutterIcon(editor);
        }
        if (this.decorationTypes) {
            editor.setDecorations(this.decorationTypes.error, decorationOptionsError);
            editor.setDecorations(this.decorationTypes.warning, decorationOptionsWarning);
            editor.setDecorations(this.decorationTypes.info, decorationOptionsInfo);
            editor.setDecorations(this.decorationTypes.hint, decorationOptionsHint);
        }
        if (ErrorLens_js_1.$config.problemRangeDecorationEnabled) {
            if (this.decorationTypes) {
                editor.setDecorations(this.decorationTypes.errorRange, decorationOptionsErrorRange);
                editor.setDecorations(this.decorationTypes.warningRange, decorationOptionsWarningRange);
                editor.setDecorations(this.decorationTypes.infoRange, decorationOptionsInfoRange);
                editor.setDecorations(this.decorationTypes.hintRange, decorationOptionsHintRange);
            }
        }
        if (ErrorLens_js_1.$state.renderGutterIconsAsSeparateDecoration) {
            ELGutter_ac_js_1.ELGutter.prototype.doUpdateGutterDecorations(editor, groupedDiagnostics);
        }
        ErrorLens_js_1.$state.statusBarMessage.updateText(editor, groupedDiagnostics);
        ErrorLens_js_1.$state.codeLens.update();
    }
    updateDecorationsForAllVisibleEditors() {
        if (ErrorLens_js_1.$config.onSave &&
            !ErrorLens_js_1.$config.onSaveUpdateOnActiveEditorChange) {
            return;
        }
        for (const editor of vscode.window.visibleTextEditors) {
            ErrorLens_js_1.$state.log('updateDecorationsForAllVisibleEditors()');
            this.updateDecorationsForUri({
                uri: editor.document.uri,
                editor,
            });
        }
    }
    /**
     * Update decorations for one editor.
     */
    updateDecorationsForUri({ uri, editor, groupedDiagnostics, range, }) {
        if (editor === undefined) {
            editor = vscode.window.activeTextEditor;
        }
        if (!editor) {
            return;
        }
        if (!editor.document.uri.fsPath) {
            return;
        }
        if (ErrorLens_js_1.$config.ignoreUntitled && editor.document.uri.scheme === 'untitled') {
            return;
        }
        if ((!ErrorLens_js_1.$config.enableOnDiffView && editor.viewColumn === undefined) &&
            editor.document.uri.scheme !== 'vscode-notebook-cell') {
            this.doUpdateDecorations(editor, {});
            return;
        }
        if (!ErrorLens_js_1.$config.enabledInMergeConflict) {
            const editorText = editor.document.getText();
            if (editorText.includes("<<<<<<<" /* EELConstants.MergeConflictSymbol1 */) ||
                editorText.includes("=======" /* EELConstants.MergeConflictSymbol2 */) ||
                editorText.includes(">>>>>>>" /* EELConstants.MergeConflictSymbol3 */)) {
                this.doUpdateDecorations(editor, {});
                return;
            }
        }
        if (ErrorLens_js_1.$state.excludePatterns) {
            for (const pattern of ErrorLens_js_1.$state.excludePatterns) {
                if (vscode.languages.match(pattern, editor.document) !== 0) {
                    return;
                }
            }
        }
        const currentWorkspacePath = vscode.workspace.getWorkspaceFolder(editor.document.uri)?.uri.fsPath;
        if (currentWorkspacePath &&
            ErrorLens_js_1.$config.excludeWorkspaces.includes(currentWorkspacePath)) {
            return;
        }
        ErrorLens_js_1.$state.log('updateDecorationsForUri()', uri.toString(true));
        this.doUpdateDecorations(editor, groupedDiagnostics ?? ELExtUtils_ac_js_1.ELExtUtils.prototype.groupDiagnosticsByLine(vscode.languages.getDiagnostics(uri)), range);
    }
    /**
     * Issue https://github.com/usernamehw/vscode-error-lens/issues/177
     */
    updateWorkaroundGutterIcon(editor) {
        const ranges = [];
        for (const breakpoint of vscode.debug.breakpoints) {
            // @ts-expect-error location is probably optional, but can be there
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const location = breakpoint?.location;
            if (location && location.uri.toString(true) === editor?.document.uri.toString(true)) {
                ranges.push(location.range);
            }
        }
        if (this.decorationTypes) {
            editor.setDecorations(this.decorationTypes.transparent1x1Icon, ranges);
        }
    }
    disposeAllDecorations() {
        if (this.decorationTypes) {
            for (const decorationType of Object?.values(this.decorationTypes)) {
                decorationType?.dispose();
            }
        }
    }
}
exports.ELDecorations = ELDecorations;
