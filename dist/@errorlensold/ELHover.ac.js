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
exports.ELHover = void 0;
const vscode = __importStar(require("vscode"));
const ELExtUtils_ac_js_1 = require("./ELExtUtils.ac.js");
const ELVSCodeUtils_ac_js_1 = require("./ELVSCodeUtils.ac.js");
// hover/hover.ts
class ELHover {
    extUtils = new ELExtUtils_ac_js_1.ELExtUtils;
    vscodeUtils = new ELVSCodeUtils_ac_js_1.ELVSCodeUtils;
    /**
     * Create hover tooltip for text editor decoration.
     */
    createHoverForDiagnostic({ diagnostic, messageEnabled, buttonsEnabled, sourceCodeEnabled, lintFilePaths, }) {
        if (!messageEnabled && !buttonsEnabled && !sourceCodeEnabled) {
            return;
        }
        const markdown = new vscode.MarkdownString(undefined, true);
        markdown.supportHtml = true;
        markdown.isTrusted = true;
        const diagnosticTarget = this.extUtils.getDiagnosticTarget(diagnostic);
        const diagnosticCode = this.extUtils.getDiagnosticCode(diagnostic);
        // ──── Message ───────────────────────────────────────────────
        if (messageEnabled) {
            const problemIcon = this.vscodeUtils.createProblemIconMarkdown(diagnostic.severity === 0 ? 'error' : diagnostic.severity === 1 ? 'warning' : 'info');
            markdown.appendMarkdown(`<table>`);
            markdown.appendMarkdown(`<tr>`);
            markdown.appendMarkdown(`<td>${problemIcon}</td>`);
            markdown.appendMarkdown(`<td>`);
            markdown.appendMarkdown('\n\n');
            markdown.appendCodeblock(diagnostic.message, 'plaintext');
            markdown.appendMarkdown('\n\n');
            markdown.appendMarkdown(`</td>`);
            markdown.appendMarkdown(`</tr>`);
            markdown.appendMarkdown(`</table>`);
        }
        // ──── Source Code ──────────────────────────────────────────
        if (sourceCodeEnabled) {
            const copyCodeButton = this.vscodeUtils.createButtonLinkMarkdown({
                text: '$(clippy) Copy',
                href: this.vscodeUtils.createCommandUri("flawuldragon.errorLens.copyProblemCode" /* EELCommandId.CopyProblemCode */, { code: diagnosticCode }).toString(),
                title: 'Copy problem code into the clipboard.',
            });
            markdown.appendMarkdown('\n\n');
            markdown.appendMarkdown(`${diagnostic.source ?? '<No source>'}(\`${diagnosticCode ?? '<No code>'}\`) `);
            if (diagnosticCode) {
                markdown.appendMarkdown(copyCodeButton);
            }
        }
        // ──── Buttons ───────────────────────────────────────────────
        if (buttonsEnabled) {
            const excludeProblemButton = this.vscodeUtils.createButtonLinkMarkdown({
                text: '$(exclude) Exclude',
                href: this.vscodeUtils.createCommandUri("flawuldragon.errorLens.excludeProblem" /* EELCommandId.ExcludeProblem */, diagnostic).toString(),
                title: 'Exclude problem from Error Lens by source/code',
            });
            const openRuleDefinitionButton = this.vscodeUtils.createButtonLinkMarkdown({
                text: '$(file) Definition',
                href: this.vscodeUtils.createCommandUri("flawuldragon.errorLens.findLinterRuleDefinition" /* EELCommandId.FindLinterRuleDefinition */, { source: diagnostic.source, code: diagnosticCode }).toString(),
                title: 'Open diagnostic definition (linter file).',
            });
            const searchForProblemButton = this.vscodeUtils.createButtonLinkMarkdown({
                text: '$(search) Search',
                href: this.vscodeUtils.createCommandUri("flawuldragon.errorLens.searchForProblem" /* EELCommandId.SearchForProblem */, diagnostic).toString(),
                title: 'Open problem in default browser (controlled by `errorLens.searchForProblemQuery` setting).',
            });
            const disableLineButton = this.vscodeUtils.createButtonLinkMarkdown({
                text: '$(arrow-circle-up) Disable line',
                href: this.vscodeUtils.createCommandUri("flawuldragon.errorLens.disableLine" /* EELCommandId.DisableLine */, diagnostic).toString(),
                title: 'Add comment to disable linter rule for this line.',
            });
            markdown.appendMarkdown('\n\n');
            markdown.appendMarkdown(excludeProblemButton);
            const sourceIsLinter = lintFilePaths[String(diagnostic?.source)] !== 'none';
            if (sourceIsLinter) {
                markdown.appendMarkdown("&nbsp;" /* EELConstants.NonBreakingSpaceSymbolHtml */.repeat(2));
                markdown.appendMarkdown(openRuleDefinitionButton);
            }
            if (diagnosticTarget) {
                markdown.appendMarkdown("&nbsp;" /* EELConstants.NonBreakingSpaceSymbolHtml */.repeat(2));
                const openDocsButton = this.vscodeUtils.createButtonLinkMarkdown({
                    text: '$(book) Docs',
                    href: this.vscodeUtils.createCommandUri("vscode.open" /* EELConstants.VscodeOpenCommandId */, diagnosticTarget).toString(),
                    title: 'Open diagnostic code or search it in default browser.',
                });
                markdown.appendMarkdown(openDocsButton);
            }
            markdown.appendMarkdown("&nbsp;" /* EELConstants.NonBreakingSpaceSymbolHtml */.repeat(2));
            markdown.appendMarkdown(searchForProblemButton);
            if (sourceIsLinter) {
                markdown.appendMarkdown("&nbsp;" /* EELConstants.NonBreakingSpaceSymbolHtml */.repeat(2));
                markdown.appendMarkdown(disableLineButton);
            }
        }
        return markdown;
    }
}
exports.ELHover = ELHover;
