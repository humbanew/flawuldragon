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
exports.ELStatusBarMessage = void 0;
const vscode = __importStar(require("vscode"));
const ELExtUtils_ac_js_1 = require("./ELExtUtils.ac.js");
const ELUtils_ac_js_1 = require("./ELUtils.ac.js");
const ELHover_ac_js_1 = require("./ELHover.ac.js");
const ErrorLens_js_1 = require("./ErrorLens.js");
// statusBar/statusBarMessage.ts
/**
 * Handle status bar updates.
 */
class ELStatusBarMessage {
    extUtils = new ELExtUtils_ac_js_1.ELExtUtils;
    hover = new ELHover_ac_js_1.ELHover;
    utils = new ELUtils_ac_js_1.ELUtils;
    /**
     * Array of vscode `ThemeColor` for each of 4 diagnostic severity states.
     */
    statusBarColors = [];
    /**
     * Position in editor of active message. Needed to jump to error on click.
     */
    activeMessagePosition = new vscode.Position(0, 0);
    /**
     * Active message text. Needed to copy to clipboard on click.
     */
    activeMessageText = '';
    /**
     * Active message source. Needed to copy to clipboard on click.
     */
    activeMessageSource = '';
    /**
     * Status bar item reference.
     */
    statusBarItem;
    isEnabled;
    colorsEnabled;
    messageType;
    constructor({ isEnabled, colorsEnabled, messageType, priority, alignment, }) {
        const statusBarAlignment = alignment === 'right' ? vscode.StatusBarAlignment.Right : vscode.StatusBarAlignment.Left;
        this.isEnabled = isEnabled;
        this.colorsEnabled = colorsEnabled;
        this.messageType = messageType;
        this.statusBarItem = vscode.window.createStatusBarItem('errorLensMessage', statusBarAlignment, priority);
        this.statusBarItem.name = 'Error Lens: Message';
        this.statusBarItem.command = "flawuldragon.errorLens.statusBarCommand" /* EELCommandId.StatusBarCommand */;
        if (this.isEnabled) {
            this.statusBarItem.show();
        }
        else {
            this.dispose();
        }
    }
    updateText(editor, groupedDiagnostics) {
        if (!this.isEnabled) {
            return;
        }
        const keys = Object.keys(groupedDiagnostics);
        if (keys.length === 0) {
            this.clear();
            return;
        }
        const ln = editor.selection.active.line;
        let diagnostic;
        let numberOfDiagnosticsOnThatLine = 0;
        if (this.messageType === 'activeLine') {
            if (groupedDiagnostics[ln]) {
                diagnostic = groupedDiagnostics[ln][0];
                numberOfDiagnosticsOnThatLine = groupedDiagnostics[ln].length;
            }
            else {
                this.clear();
                return;
            }
        }
        else if (this.messageType === 'activeCursor') {
            if (groupedDiagnostics[ln]) {
                const sortedInlinDiagnostics = groupedDiagnostics[ln].sort((diag1, diag2) => {
                    const distanceCharToCursor1 = this.distanceInCharachtersToCursor(diag1);
                    const distanceCharToCursor2 = this.distanceInCharachtersToCursor(diag2);
                    if (distanceCharToCursor1 === distanceCharToCursor2) {
                        return diag1.severity - diag2.severity;
                    }
                    else {
                        return distanceCharToCursor1 - distanceCharToCursor2;
                    }
                });
                diagnostic = sortedInlinDiagnostics[0];
            }
        }
        else if (this.messageType === 'closestProblem') {
            // Sort by how close it is to the cursor
            const sortedLineNumbers = keys.map(Number).sort((a, b) => Math.abs(ln - a) - Math.abs(ln - b)); // TODO: duplicate code?
            outerLoop: for (const lineNumber of sortedLineNumbers) {
                const diagnosticsAtLine = groupedDiagnostics[lineNumber];
                for (const diag of diagnosticsAtLine) {
                    if (this.extUtils.isSeverityEnabled(diag.severity)) {
                        diagnostic = diag;
                        numberOfDiagnosticsOnThatLine = diagnosticsAtLine.length;
                        break outerLoop;
                    }
                }
            }
        }
        else if (this.messageType === 'closestSeverity') {
            const allDiagnosticsSorted = keys.map(key => groupedDiagnostics[key]).flat().sort((d1, d2) => {
                const severityScore = (d1.severity * 1e4) - (d2.severity * 1e4);
                return severityScore + (Math.abs(ln - d1.range.start.line) - Math.abs(ln - d2.range.start.line));
            });
            for (const diag of allDiagnosticsSorted) {
                if (this.extUtils.isSeverityEnabled(diag.severity)) {
                    diagnostic = diag;
                    numberOfDiagnosticsOnThatLine = groupedDiagnostics[diag.range.start.line].length;
                    break;
                }
            }
        }
        if (!diagnostic) {
            this.clear();
            return;
        }
        this.activeMessagePosition = diagnostic.range.start;
        let message = this.extUtils.diagnosticToInlineMessage(ErrorLens_js_1.$config.statusBarMessageTemplate || ErrorLens_js_1.$config.messageTemplate, diagnostic, numberOfDiagnosticsOnThatLine);
        if (ErrorLens_js_1.$config.removeLinebreaks) {
            message = this.utils.replaceLinebreaks(message, ErrorLens_js_1.$config.replaceLinebreaksSymbol);
        }
        this.activeMessageText = message;
        this.activeMessageSource = diagnostic.source;
        if (this.colorsEnabled) {
            this.statusBarItem.color = this.statusBarColors[diagnostic.severity];
        }
        this.statusBarItem.text = message;
        this.statusBarItem.tooltip = this.makeTooltip(diagnostic, ErrorLens_js_1.$config.lintFilePaths);
    }
    /**
     * Clear status bar message.
     */
    clear() {
        if (!this.isEnabled) {
            return;
        }
        this.statusBarItem.text = '';
        this.statusBarItem.tooltip = '';
    }
    distanceInCharachtersToCursor(diagnostic) {
        const activeSelection = vscode.window.activeTextEditor?.selection.active;
        if (!activeSelection) {
            return 0;
        }
        if (diagnostic.range.contains(activeSelection)) {
            return 0;
        }
        return Math.min(Math.abs(diagnostic.range.start.character - activeSelection.character), Math.abs(diagnostic.range.end.character - activeSelection.character));
    }
    /**
     * Dispose status bar item.
     */
    dispose() {
        this.statusBarItem.dispose();
    }
    makeTooltip(diagnostic, lintFilePaths) {
        const markdownHover = this.hover.createHoverForDiagnostic({
            diagnostic,
            buttonsEnabled: true,
            messageEnabled: true,
            sourceCodeEnabled: true,
            lintFilePaths,
        });
        return markdownHover;
    }
}
exports.ELStatusBarMessage = ELStatusBarMessage;
