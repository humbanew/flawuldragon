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
exports.ELStatusBarIcons = void 0;
const vscode = __importStar(require("vscode"));
const ELExtUtils_ac_js_1 = require("./ELExtUtils.ac.js");
const ELUtils_ac_js_1 = require("./ELUtils.ac.js");
// statusBar/statusBarIcons.ts
/**
 * Handle status bar updates.
 */
class ELStatusBarIcons {
    extUtils = new ELExtUtils_ac_js_1.ELExtUtils;
    utils = new ELUtils_ac_js_1.ELUtils;
    errorStatusBarItem;
    warningStatusBarItem;
    errorBackgroundThemeColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    warningBackgroundThemeColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    errorForegroundThemeColor = new vscode.ThemeColor('flawuldragon.errorLens.statusBarIconErrorForeground');
    warningForegroundThemeColor = new vscode.ThemeColor('flawuldragon.errorLens.statusBarIconWarningForeground');
    isEnabled;
    atZero;
    useBackground;
    targetProblems;
    constructor({ isEnabled, atZero, useBackground, priority, alignment, targetProblems, }) {
        this.isEnabled = isEnabled;
        this.atZero = atZero;
        this.useBackground = useBackground;
        this.targetProblems = targetProblems;
        const statusBarAlignment = alignment === 'right' ? vscode.StatusBarAlignment.Right : vscode.StatusBarAlignment.Left;
        this.errorStatusBarItem = vscode.window.createStatusBarItem('errorLensError', statusBarAlignment, priority);
        this.errorStatusBarItem.name = 'Error Lens: Error icon';
        this.errorStatusBarItem.command = "workbench.actions.view.problems" /* EELConstants.OpenProblemsViewCommandId */;
        this.warningStatusBarItem = vscode.window.createStatusBarItem('errorLensWarning', statusBarAlignment, priority - 1);
        this.warningStatusBarItem.name = 'Error Lens: Warning icon';
        this.warningStatusBarItem.command = "workbench.actions.view.problems" /* EELConstants.OpenProblemsViewCommandId */;
        this.setBackground('error');
        this.setForeground('error');
        this.setBackground('warning');
        this.setForeground('warning');
        if (this.isEnabled) {
            this.errorStatusBarItem.show();
            this.warningStatusBarItem.show();
        }
        else {
            this.dispose();
        }
    }
    updateText() {
        if (!this.isEnabled) {
            return;
        }
        const errorsWithUri = [];
        const warningsWithUri = [];
        let errorCount = 0;
        let warningCount = 0;
        const allDiagnostics = this.extUtils.getDiagnostics({
            target: this.targetProblems,
        });
        for (const diagnosticWithUri of allDiagnostics) {
            const uri = diagnosticWithUri[0];
            const diagnostics = diagnosticWithUri[1];
            const errors = [];
            const warnings = [];
            for (const diag of diagnostics) {
                if (diag.severity === 0) {
                    errors.push(diag);
                }
                else if (diag.severity === 1) {
                    warnings.push(diag);
                }
            }
            errorCount += errors.length;
            warningCount += warnings.length;
            if (errors.length) {
                errorsWithUri.push([
                    uri,
                    errors,
                ]);
            }
            if (warnings.length) {
                warningsWithUri.push([
                    uri,
                    warnings,
                ]);
            }
        }
        if (errorCount === 0) {
            if (this.atZero === 'hide') {
                this.errorStatusBarItem.text = '';
            }
            else {
                this.clearBackground('error');
                this.clearForeground('error');
                this.errorStatusBarItem.text = `$(error) ${errorCount}`;
                this.errorStatusBarItem.tooltip = this.makeTooltip(errorsWithUri, 'error');
            }
        }
        else {
            this.setBackground('error');
            this.setForeground('error');
            this.errorStatusBarItem.text = `$(error) ${errorCount}`;
            this.errorStatusBarItem.tooltip = this.makeTooltip(errorsWithUri, 'error');
        }
        if (warningCount === 0) {
            if (this.atZero === 'hide') {
                this.warningStatusBarItem.text = '';
            }
            else {
                this.clearBackground('warning');
                this.clearForeground('warning');
                this.warningStatusBarItem.text = `$(warning) ${warningCount}`;
                this.warningStatusBarItem.tooltip = this.makeTooltip(warningsWithUri, 'warning');
            }
        }
        else {
            this.setBackground('warning');
            this.setForeground('warning');
            this.warningStatusBarItem.text = `$(warning) ${warningCount}`;
            this.warningStatusBarItem.tooltip = this.makeTooltip(warningsWithUri, 'warning');
        }
    }
    /**
     * Dispose both status bar items.
     */
    dispose() {
        this.errorStatusBarItem.dispose();
        this.warningStatusBarItem.dispose();
    }
    makeTooltip(allDiagnostics, type) {
        const markdown = new vscode.MarkdownString(undefined, true);
        markdown.isTrusted = true;
        for (const diagWithUri of allDiagnostics) {
            const uri = diagWithUri[0];
            const diagnostics = diagWithUri[1];
            if (diagnostics.length) {
                markdown.appendMarkdown(`**${this.utils.basename(uri.path)}**\n\n`);
            }
            for (const diag of diagnostics) {
                const revealLineUri = vscode.Uri.parse(`command:${"flawuldragon.errorLens.revealLine" /* EELCommandId.RevealLine */}?${encodeURIComponent(JSON.stringify([uri.fsPath, [diag.range.start.line, diag.range.start.character]]))}`);
                markdown.appendMarkdown(`<span style="color:${type === 'error' ? 'var(--vscode-editorError-foreground)' : 'var(--vscode-editorWarning-foreground)'};">$(${type})</span> [${diag.message} \`${diag.source ?? '<No source>'}\`](${revealLineUri.toString()})\n\n`);
            }
        }
        return markdown;
    }
    setForeground(statusBarType) {
        if (statusBarType === 'error') {
            this.errorStatusBarItem.color = this.errorForegroundThemeColor;
        }
        else if (statusBarType === 'warning') {
            this.warningStatusBarItem.color = this.warningForegroundThemeColor;
        }
    }
    clearForeground(statusBarType) {
        if (statusBarType === 'error') {
            this.errorStatusBarItem.color = undefined;
        }
        else if (statusBarType === 'warning') {
            this.warningStatusBarItem.color = undefined;
        }
    }
    /**
     * Set background (only if it's enabled) or clear it.
     */
    setBackground(statusBarType) {
        if (!this.useBackground) {
            return;
        }
        if (statusBarType === 'error') {
            this.errorStatusBarItem.backgroundColor = this.errorBackgroundThemeColor;
        }
        else if (statusBarType === 'warning') {
            this.warningStatusBarItem.backgroundColor = this.warningBackgroundThemeColor;
        }
    }
    clearBackground(statusBarType) {
        if (statusBarType === 'error') {
            this.errorStatusBarItem.backgroundColor = undefined;
        }
        else if (statusBarType === 'warning') {
            this.warningStatusBarItem.backgroundColor = undefined;
        }
    }
}
exports.ELStatusBarIcons = ELStatusBarIcons;
