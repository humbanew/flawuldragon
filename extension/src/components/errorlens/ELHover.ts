/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as vscode from 'vscode';
import { TELExtensionConfig, IELRuleDefinitionArgs } from './declares';
import { ELExtUtils } from './ELExtUtils';
import { ELVSCodeUtils } from './ELVSCodeUtils';
import { EELCommandId, EELConstants } from './enums';

// hover/hover.ts
export class ELHover {

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
  
    const diagnosticTarget = ELExtUtils.prototype.getDiagnosticTarget(diagnostic);
    const diagnosticCode = ELExtUtils.prototype.getDiagnosticCode(diagnostic);
  
    // ──── Message ───────────────────────────────────────────────
    if (messageEnabled) {
      const problemIcon = ELVSCodeUtils.prototype.createProblemIconMarkdown(diagnostic.severity === 0 ? 'error' : diagnostic.severity === 1 ? 'warning' : 'info');
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
      const copyCodeButton = ELVSCodeUtils.prototype.createButtonLinkMarkdown({
        text: '$(clippy) Copy',
        href: ELVSCodeUtils.prototype.createCommandUri(EELCommandId.CopyProblemCode, { code: diagnosticCode }).toString(),
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
      const excludeProblemButton = ELVSCodeUtils.prototype.createButtonLinkMarkdown({
        text: '$(exclude) Exclude',
        href: ELVSCodeUtils.prototype.createCommandUri(EELCommandId.ExcludeProblem, diagnostic).toString(),
        title: 'Exclude problem from Error Lens by source/code',
      });
      const openRuleDefinitionButton = ELVSCodeUtils.prototype.createButtonLinkMarkdown({
        text: '$(file) Definition',
        href: ELVSCodeUtils.prototype.createCommandUri(EELCommandId.FindLinterRuleDefinition, { source: diagnostic.source, code: diagnosticCode } satisfies IELRuleDefinitionArgs).toString(),
        title: 'Open diagnostic definition (linter file).',
      });
      const searchForProblemButton = ELVSCodeUtils.prototype.createButtonLinkMarkdown({
        text: '$(search) Search',
        href: ELVSCodeUtils.prototype.createCommandUri(EELCommandId.SearchForProblem, diagnostic).toString(),
        title: 'Open problem in default browser (controlled by `errorLens.searchForProblemQuery` setting).',
      });
      const disableLineButton = ELVSCodeUtils.prototype.createButtonLinkMarkdown({
        text: '$(arrow-circle-up) Disable line',
        href: ELVSCodeUtils.prototype.createCommandUri(EELCommandId.DisableLine, diagnostic).toString(),
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
        const openDocsButton = ELVSCodeUtils.prototype.createButtonLinkMarkdown({
          text: '$(book) Docs',
          href: ELVSCodeUtils.prototype.createCommandUri(EELConstants.VscodeOpenCommandId, diagnosticTarget).toString(),
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
