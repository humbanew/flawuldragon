import * as vscode from 'vscode';
import { TELExtensionConfig, IELRuleDefinitionArgs } from './declares';
import { ELExtUtils } from './ELExtUtils.ac.cjs';
import { ELVSCodeUtils } from './ELVSCodeUtils.ac.cjs';
import { EELCommandId, EELConstants } from './enums.js';

// hover/hover.ts
export class ELHover {
  protected extUtils = new ELExtUtils;
  protected vscodeUtils = new ELVSCodeUtils;

  /**
   * Create hover tooltip for text editor decoration.
   */
  public createHoverForDiagnostic({
    diagnostic,
    messageEnabled,
    buttonsEnabled,
    sourceCodeEnabled,
    lintFilePaths,
  }: {
    diagnostic: vscode.Diagnostic;
    messageEnabled: boolean;
    buttonsEnabled: boolean;
    sourceCodeEnabled: boolean;
    lintFilePaths: TELExtensionConfig['lintFilePaths'];
  }): vscode.MarkdownString | undefined {
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
        href: this.vscodeUtils.createCommandUri(EELCommandId.CopyProblemCode, { code: diagnosticCode }).toString(),
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
        href: this.vscodeUtils.createCommandUri(EELCommandId.ExcludeProblem, diagnostic).toString(),
        title: 'Exclude problem from Error Lens by source/code',
      });
      const openRuleDefinitionButton = this.vscodeUtils.createButtonLinkMarkdown({
        text: '$(file) Definition',
        href: this.vscodeUtils.createCommandUri(EELCommandId.FindLinterRuleDefinition, { source: diagnostic.source, code: diagnosticCode } satisfies IELRuleDefinitionArgs).toString(),
        title: 'Open diagnostic definition (linter file).',
      });
      const searchForProblemButton = this.vscodeUtils.createButtonLinkMarkdown({
        text: '$(search) Search',
        href: this.vscodeUtils.createCommandUri(EELCommandId.SearchForProblem, diagnostic).toString(),
        title: 'Open problem in default browser (controlled by `errorLens.searchForProblemQuery` setting).',
      });
      const disableLineButton = this.vscodeUtils.createButtonLinkMarkdown({
        text: '$(arrow-circle-up) Disable line',
        href: this.vscodeUtils.createCommandUri(EELCommandId.DisableLine, diagnostic).toString(),
        title: 'Add comment to disable linter rule for this line.',
      });
  
      markdown.appendMarkdown('\n\n');
      markdown.appendMarkdown(excludeProblemButton);
  
      const sourceIsLinter = lintFilePaths[String(diagnostic?.source)] !== 'none';
  
      if (sourceIsLinter) {
        markdown.appendMarkdown(EELConstants.NonBreakingSpaceSymbolHtml.repeat(2));
        markdown.appendMarkdown(openRuleDefinitionButton);
      }
  
      if (diagnosticTarget) {
        markdown.appendMarkdown(EELConstants.NonBreakingSpaceSymbolHtml.repeat(2));
        const openDocsButton = this.vscodeUtils.createButtonLinkMarkdown({
          text: '$(book) Docs',
          href: this.vscodeUtils.createCommandUri(EELConstants.VscodeOpenCommandId, diagnosticTarget).toString(),
          title: 'Open diagnostic code or search it in default browser.',
        });
        markdown.appendMarkdown(openDocsButton);
      }
  
      markdown.appendMarkdown(EELConstants.NonBreakingSpaceSymbolHtml.repeat(2));
      markdown.appendMarkdown(searchForProblemButton);
  
      if (sourceIsLinter) {
        markdown.appendMarkdown(EELConstants.NonBreakingSpaceSymbolHtml.repeat(2));
        markdown.appendMarkdown(disableLineButton);
      }
    }
  
    return markdown;
  }
}
