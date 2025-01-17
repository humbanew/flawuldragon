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
exports.ELMultilineDecoration = void 0;
const vscode = __importStar(require("vscode"));
const ELDecorations_ac_js_1 = require("./ELDecorations.ac.js");
const ELDecorationsAlign_ac_js_1 = require("./ELDecorationsAlign.ac.js");
const ELExtUtils_ac_js_1 = require("./ELExtUtils.ac.js");
const ErrorLens_js_1 = require("./ErrorLens.js");
// utils/showMultilineDecoration.ts
class ELMultilineDecoration {
    decorations = new ELDecorations_ac_js_1.ELDecorations;
    decorationsAlign = new ELDecorationsAlign_ac_js_1.ELDecorationsAlign;
    extUtils = new ELExtUtils_ac_js_1.ELExtUtils;
    createMultilineDecorations() {
        // ──── Multiline message ─────────────────────────────────────
        // TODO: after props with fontFamily config
        this.decorations.decorationTypes.multilineError = vscode.window.createTextEditorDecorationType({
            after: {
                backgroundColor: new vscode.ThemeColor('flawuldragon.errorMessageBackground'),
                color: new vscode.ThemeColor('flawuldragon.errorForeground'),
            },
        });
        this.decorations.decorationTypes.multilineWarning = vscode.window.createTextEditorDecorationType({
            after: {
                backgroundColor: new vscode.ThemeColor('flawuldragon.warningMessageBackground'),
                color: new vscode.ThemeColor('flawuldragon.warningForeground'),
            },
        });
        this.decorations.decorationTypes.multilineInfo = vscode.window.createTextEditorDecorationType({
            after: {
                backgroundColor: new vscode.ThemeColor('errorLens.infoMessageBackground'),
                color: new vscode.ThemeColor('errorLens.infoForeground'),
            },
        });
        this.decorations.decorationTypes.multilineHint = vscode.window.createTextEditorDecorationType({
            after: {
                backgroundColor: new vscode.ThemeColor('errorLens.hintMessageBackground'),
                color: new vscode.ThemeColor('errorLens.hintForeground'),
            },
        });
        // Since message decoration is located in a different random place in the editor => highlight line/range where the problem is.
        // ──── Highlight line where problem is located ───────────────
        this.decorations.decorationTypes.multilineErrorLineBackground = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('errorLens.errorBackground'),
            isWholeLine: true,
        });
        this.decorations.decorationTypes.multilineWarningLineBackground = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('errorLens.warningBackground'),
            isWholeLine: true,
        });
        this.decorations.decorationTypes.multilineInfoLineBackground = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('errorLens.infoBackground'),
            isWholeLine: true,
        });
        this.decorations.decorationTypes.multilineHintLineBackground = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('errorLens.hintBackground'),
            isWholeLine: true,
        });
    }
    /**
     * Try to find pockets of empty space where extension can draw multiline decorations.
     */
    showMultilineDecoration(editor) {
        const diagnosticsForUri = vscode.languages.getDiagnostics(editor.document.uri);
        if (diagnosticsForUri.length === 0 || !this.extUtils.shouldShowInlineMessage()) {
            // There are no problems in this file
            this.clearAllMultilineDecorations(editor);
            return;
        }
        // const cursorInViewport = isCursorInViewport(editor);
        // const closestDiagnosticInViewport = extUtils.getClosestDiagnosticInViewport(editor);
        let diagnostic;
        if (ErrorLens_js_1.$config.followCursor === 'closestProblemMultiline') {
            diagnostic = this.extUtils.getClosestDiagnostic(editor);
        }
        else if (ErrorLens_js_1.$config.followCursor === 'closestProblemMultilineInViewport') {
            diagnostic = this.extUtils.getClosestDiagnosticInViewport(editor);
        }
        else if (ErrorLens_js_1.$config.followCursor === 'closestProblemMultilineBySeverity') {
            diagnostic = this.extUtils.getClosestBySeverityDiagnostic(editor);
        }
        if (diagnostic === undefined) {
            this.clearAllMultilineDecorations(editor);
            return;
        }
        const indentStyle = editor.options.insertSpaces ? 'spaces' : 'tab';
        const indentSize = editor.options.tabSize;
        let messageLines = diagnostic.message.split(/[\n\r]/u);
        const maxMessageLineLength = messageLines.slice(0).sort((ln1, ln2) => ln2.length - ln1.length)[0].length;
        messageLines = messageLines.map(line => line.padEnd(maxMessageLineLength, ' '));
        const isProblemInViewport = this.extUtils.isDiagnosticInViewport(editor, diagnostic);
        const visibleLineCount = this.getVisibleLineCount(editor); //
        const howManyLinesInDecoration = Math.min(messageLines.length, ErrorLens_js_1.$config.multilineMessage.decorationMaxNumberOfLines, editor.document.lineCount);
        let result = [];
        const groupedTextLines = [];
        for (const visibleRange of editor.visibleRanges) {
            for (let i = visibleRange.start.line; i < visibleRange.end.line; i++) {
                const textLines = [];
                for (let j = i; j < (i + howManyLinesInDecoration); j++) {
                    if (j > editor.document.lineCount - 1) {
                        break;
                    }
                    const lineAt = editor.document.lineAt(j);
                    if (lineAt) {
                        textLines.push(lineAt);
                    }
                }
                groupedTextLines.push(textLines);
            }
        }
        for (const textLines of groupedTextLines) {
            const howManyLinesFromDiagnostic = this.howManyLinesAwayFromDiagnostic(textLines[0].range.start.line, textLines.at(-1).range.end.line, diagnostic);
            const minLine = textLines.slice(0).sort((tl1, tl2) => this.extUtils.getVisualLineLength(tl2, indentSize, indentStyle) - this.extUtils.getVisualLineLength(tl1, indentSize, indentStyle))[0];
            const minVisualLineLength = Math.max(this.extUtils.getVisualLineLength(minLine, indentSize, indentStyle), ErrorLens_js_1.$config.multilineMessage.alignStart);
            result.push({
                startLineIndex: textLines[0].range.start.line,
                endLineIndex: textLines.at(-1).range.end.line,
                howManyLinesFromDiagnostic,
                minVisualLineLength,
                score: this.scoreGroupedLines({
                    textLines,
                    diagnostic,
                    messageLines,
                    howManyLinesFromDiagnostic,
                    minVisualLineLength,
                    visibleLineCount,
                    preferFittingMessageMultiplier: ErrorLens_js_1.$config.multilineMessage.preferFittingMessageMultiplier,
                }),
                textLines,
                startLineStartsWith: textLines[0].text.slice(0, 10),
            });
        }
        result = result.slice(0).sort((group1, group2) => group2.score - group1.score);
        // console.table(result);
        const whereToShowDecoration = result[0];
        const decorationsToDraw = [];
        let i = 0;
        for (const textLine of whereToShowDecoration.textLines) {
            // const visualLineLength = extUtils.getVisualLineLength(textLine, indentSize, indentStyle);
            // const margin = $config.multilineMessage.margin + whereToShowDecoration.minVisualLineLength - visualLineLength;
            const borderRadius = this.makeRoundCornersForDecoration({
                isFirstLineOfDecoration: i === 0,
                isLastLineOfDecoration: i === whereToShowDecoration.textLines.length - 1,
            });
            /** Both line & message decorations have transparency so when they overlap it looks bad */
            const skipBackground = ErrorLens_js_1.$config.multilineMessage.highlightProblemLine === 'line' && textLine.range.start.line === diagnostic.range.start.line;
            let styleStr = '';
            let range;
            let heightStyle;
            if (ErrorLens_js_1.$config.multilineMessage.useFixedPosition) {
                // Draw decoration as fixed positioned element
                const fixedMarginStyle = this.decorationsAlign.getStyleForAlignment({
                    isMultilineDecoration: true,
                    alignmentKind: 'fixed',
                    indentSize,
                    indentStyle,
                    minVisualLineLength: whereToShowDecoration.minVisualLineLength,
                    minimumMargin: ErrorLens_js_1.$config.multilineMessage.margin,
                    textLine,
                    start: ErrorLens_js_1.$config.multilineMessage.alignStart,
                    end: ErrorLens_js_1.$config.multilineMessage.alignEnd,
                    problemMessage: messageLines[i],
                });
                range = fixedMarginStyle.range;
                styleStr = fixedMarginStyle.styleStr;
            }
            else {
                const normalMarginStyle = this.decorationsAlign.getStyleForAlignment({
                    isMultilineDecoration: true,
                    alignmentKind: 'normal',
                    indentSize,
                    indentStyle,
                    minVisualLineLength: whereToShowDecoration.minVisualLineLength,
                    minimumMargin: ErrorLens_js_1.$config.multilineMessage.margin,
                    textLine,
                    start: ErrorLens_js_1.$config.multilineMessage.alignStart,
                    end: ErrorLens_js_1.$config.multilineMessage.alignEnd,
                    problemMessage: messageLines[i],
                });
                range = normalMarginStyle.range;
                styleStr = normalMarginStyle.styleStr;
                heightStyle = '100%';
            }
            decorationsToDraw.push({
                range,
                renderOptions: {
                    after: {
                        height: heightStyle,
                        backgroundColor: skipBackground ? '#fff0' : undefined,
                        contentText: messageLines[i],
                        textDecoration: `;white-space:pre;padding:0 ${ErrorLens_js_1.$config.multilineMessage.padding}ch;${borderRadius};${styleStr};`, // Keep leading whitespace in ::after content
                    },
                },
            });
            i++;
        }
        let errorDecorations = [];
        let warningDecorations = [];
        let infoDecorations = [];
        let hintDecorations = [];
        let errorLineDecorations = [];
        let warningLineDecorations = [];
        let infoLineDecorations = [];
        let hintLineDecorations = [];
        if (diagnostic.severity === 0) {
            errorDecorations = decorationsToDraw;
            errorLineDecorations = [new vscode.Range(diagnostic.range.start, diagnostic.range.start)];
        }
        else if (diagnostic.severity === 1) {
            warningDecorations = decorationsToDraw;
            warningLineDecorations = [new vscode.Range(diagnostic.range.start, diagnostic.range.start)];
        }
        else if (diagnostic.severity === 2) {
            infoDecorations = decorationsToDraw;
            infoLineDecorations = [new vscode.Range(diagnostic.range.start, diagnostic.range.start)];
        }
        else if (diagnostic.severity === 3) {
            hintDecorations = decorationsToDraw;
            hintLineDecorations = [new vscode.Range(diagnostic.range.start, diagnostic.range.start)];
        }
        editor.setDecorations(this.decorations.decorationTypes.multilineError, errorDecorations);
        editor.setDecorations(this.decorations.decorationTypes.multilineWarning, warningDecorations);
        editor.setDecorations(this.decorations.decorationTypes.multilineInfo, infoDecorations);
        editor.setDecorations(this.decorations.decorationTypes.multilineHint, hintDecorations);
        if (ErrorLens_js_1.$config.multilineMessage.highlightProblemLine === 'line') {
            editor.setDecorations(this.decorations.decorationTypes.multilineErrorLineBackground, errorLineDecorations);
            editor.setDecorations(this.decorations.decorationTypes.multilineWarningLineBackground, warningLineDecorations);
            editor.setDecorations(this.decorations.decorationTypes.multilineInfoLineBackground, infoLineDecorations);
            editor.setDecorations(this.decorations.decorationTypes.multilineHintLineBackground, hintLineDecorations);
        }
        else if (ErrorLens_js_1.$config.multilineMessage.highlightProblemLine === 'range') {
            if (diagnostic.severity === 0) {
                editor.setDecorations(this.decorations.decorationTypes.errorRange, [diagnostic.range]);
            }
            else if (diagnostic.severity === 1) {
                editor.setDecorations(this.decorations.decorationTypes.warningRange, [diagnostic.range]);
            }
            else if (diagnostic.severity === 2) {
                editor.setDecorations(this.decorations.decorationTypes.infoRange, [diagnostic.range]);
            }
            else if (diagnostic.severity === 3) {
                editor.setDecorations(this.decorations.decorationTypes.hintRange, [diagnostic.range]);
            }
        }
    }
    clearAllMultilineDecorations(editor) {
        editor.setDecorations(this.decorations.decorationTypes.multilineError, []);
        editor.setDecorations(this.decorations.decorationTypes.multilineWarning, []);
        editor.setDecorations(this.decorations.decorationTypes.multilineInfo, []);
        editor.setDecorations(this.decorations.decorationTypes.multilineHint, []);
        editor.setDecorations(this.decorations.decorationTypes.errorRange, []);
        editor.setDecorations(this.decorations.decorationTypes.warningRange, []);
        editor.setDecorations(this.decorations.decorationTypes.infoRange, []);
        editor.setDecorations(this.decorations.decorationTypes.hintRange, []);
        editor.setDecorations(this.decorations.decorationTypes.multilineErrorLineBackground, []);
        editor.setDecorations(this.decorations.decorationTypes.multilineWarningLineBackground, []);
        editor.setDecorations(this.decorations.decorationTypes.multilineInfoLineBackground, []);
        editor.setDecorations(this.decorations.decorationTypes.multilineHintLineBackground, []);
    }
    /**
     * Round corners on multiple decoration lines to make an illusion that they are all a part of single decoration.
     */
    makeRoundCornersForDecoration({ isFirstLineOfDecoration, isLastLineOfDecoration }) {
        let borderRadiusValue = '';
        const configBorderRadius = ErrorLens_js_1.$config.multilineMessage.borderRadius || ErrorLens_js_1.$config.borderRadius;
        if (isFirstLineOfDecoration) {
            borderRadiusValue = `${configBorderRadius} ${configBorderRadius} 0 0`;
        }
        else if (isLastLineOfDecoration) {
            borderRadiusValue = `0 0 ${configBorderRadius} ${configBorderRadius}`;
        }
        if (isFirstLineOfDecoration && isLastLineOfDecoration) {
            borderRadiusValue = `${configBorderRadius}`;
        }
        return `border-radius:${borderRadiusValue}`;
    }
    /**
     * Calculate how far away (in lines) the diagnostic is from the place where multiline
     * decoration will be shown.
     */
    howManyLinesAwayFromDiagnostic(startLine, endLine, diagnostic) {
        return Math.min(Math.abs(startLine - diagnostic.range.start.line), Math.abs(endLine - diagnostic.range.start.line));
    }
    isCursorInViewport(editor) {
        const cursorLine = editor.selection.active.line;
        for (const visibleRange of editor.visibleRanges) {
            if (cursorLine >= visibleRange.start.line && cursorLine <= visibleRange.end.line) {
                return true;
            }
        }
        return false;
    }
    /**
     * Assuming this about a user's viewport (not a split/grid):
     * - Calculate visible line count from `editor.visibleRanges`
     *
     * Try to balance the empty space size (fit more of the message content) and
     * the distance of that empty space from where the diagnostic is located (the closer - the better).
     *
     * Give 100 points for the group that is 0 lines away from diagnostic, 0 - for box that is >visibleLineCount lines away
     * Give 100 points for the group that fits 100% of the message text, 0 - for box that fits none of the message text
     */
    scoreGroupedLines({ textLines, messageLines, howManyLinesFromDiagnostic, minVisualLineLength, visibleLineCount, preferFittingMessageMultiplier, diagnostic }) {
        const messageTotalCharacters = messageLines.join('').length;
        const distanceScore = howManyLinesFromDiagnostic >= visibleLineCount ? 0 : Math.floor(100 - (howManyLinesFromDiagnostic / visibleLineCount * 100));
        const oneLineCharactersFit = ErrorLens_js_1.$config.multilineMessage.maxColumnForCalculation - minVisualLineLength;
        const totalCharactersThatDontFit = messageLines.reduce((acc, lineText) => acc + ((lineText.length <= oneLineCharactersFit) ? 0 : lineText.length - oneLineCharactersFit), 0);
        const messageFitScore = totalCharactersThatDontFit === 0 ? 100 : (100 - (100 / (messageTotalCharacters / 100 * totalCharactersThatDontFit)));
        // eslint-disable-next-line prefer-const
        let score = (distanceScore + (messageFitScore * preferFittingMessageMultiplier));
        // Prefer the group that starts at the same place where diagnostic starts
        // if (howManyLinesFromDiagnostic === 0 && textLines[0].range.start.line === diagnostic.range.start.line) {
        // 	score += 2;
        // }
        return Math.round(score);
    }
    getVisibleLineCount(editor) {
        let visibleLineCount = 0;
        for (const visibleRange of editor.visibleRanges) {
            visibleLineCount += visibleRange.end.line - visibleRange.start.line;
        }
        return visibleLineCount;
    }
}
exports.ELMultilineDecoration = ELMultilineDecoration;
