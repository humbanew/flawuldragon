import * as vscode from 'vscode';
import { IELStatusBarIconsInit, TELExtensionConfig, TELStatusBarProblemType } from './declares';
import { ELExtUtils } from './ELExtUtils.ac.cjs';
import { ELUtils } from './ELUtils.ac.cjs';
import { EELConstants, EELCommandId } from './enums.js';

// statusBar/statusBarIcons.ts
/**
 * Handle status bar updates.
 */
export class ELStatusBarIcons {
  protected extUtils = new ELExtUtils;
  protected utils = new ELUtils;

  private readonly errorStatusBarItem: vscode.StatusBarItem;
  private readonly warningStatusBarItem: vscode.StatusBarItem;

  private readonly errorBackgroundThemeColor = new vscode.ThemeColor('statusBarItem.errorBackground');
  private readonly warningBackgroundThemeColor = new vscode.ThemeColor('statusBarItem.warningBackground');
  private readonly errorForegroundThemeColor = new vscode.ThemeColor('flawuldragon.errorLens.statusBarIconErrorForeground');
  private readonly warningForegroundThemeColor = new vscode.ThemeColor('flawuldragon.errorLens.statusBarIconWarningForeground');

  private readonly isEnabled: boolean;
  private readonly atZero: TELExtensionConfig['statusBarIconsAtZero'];
  private readonly useBackground: TELExtensionConfig['statusBarIconsUseBackground'];
  private readonly targetProblems: TELExtensionConfig['statusBarIconsTargetProblems'];

  constructor({
    isEnabled,
    atZero,
    useBackground,
    priority,
    alignment,
    targetProblems,
  }: IELStatusBarIconsInit) {
    this.isEnabled = isEnabled;
    this.atZero = atZero;
    this.useBackground = useBackground;
    this.targetProblems = targetProblems;

    const statusBarAlignment = alignment === 'right' ? vscode.StatusBarAlignment.Right : vscode.StatusBarAlignment.Left;
    this.errorStatusBarItem = vscode.window.createStatusBarItem('errorLensError', statusBarAlignment, priority);
    this.errorStatusBarItem.name = 'Error Lens: Error icon';
    this.errorStatusBarItem.command = EELConstants.OpenProblemsViewCommandId;
    this.warningStatusBarItem = vscode.window.createStatusBarItem('errorLensWarning', statusBarAlignment, priority - 1);
    this.warningStatusBarItem.name = 'Error Lens: Warning icon';
    this.warningStatusBarItem.command = EELConstants.OpenProblemsViewCommandId;
    this.setBackground('error');
    this.setForeground('error');
    this.setBackground('warning');
    this.setForeground('warning');

    if (this.isEnabled) {
      this.errorStatusBarItem.show();
      this.warningStatusBarItem.show();
    } else {
      this.dispose();
    }
  }

  public updateText(): void {
    if (!this.isEnabled) {
      return;
    }

    const errorsWithUri: [vscode.Uri, vscode.Diagnostic[]][] = [];
    const warningsWithUri: [vscode.Uri, vscode.Diagnostic[]][] = [];
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
        } else if (diag.severity === 1) {
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
      } else {
        this.clearBackground('error');
        this.clearForeground('error');
        this.errorStatusBarItem.text = `$(error) ${errorCount}`;
        this.errorStatusBarItem.tooltip = this.makeTooltip(errorsWithUri, 'error');
      }
    } else {
      this.setBackground('error');
      this.setForeground('error');
      this.errorStatusBarItem.text = `$(error) ${errorCount}`;
      this.errorStatusBarItem.tooltip = this.makeTooltip(errorsWithUri, 'error');
    }
    if (warningCount === 0) {
      if (this.atZero === 'hide') {
        this.warningStatusBarItem.text = '';
      } else {
        this.clearBackground('warning');
        this.clearForeground('warning');
        this.warningStatusBarItem.text = `$(warning) ${warningCount}`;
        this.warningStatusBarItem.tooltip = this.makeTooltip(warningsWithUri, 'warning');
      }
    } else {
      this.setBackground('warning');
      this.setForeground('warning');
      this.warningStatusBarItem.text = `$(warning) ${warningCount}`;
      this.warningStatusBarItem.tooltip = this.makeTooltip(warningsWithUri, 'warning');
    }
  }

  /**
   * Dispose both status bar items.
   */
  public dispose(): void {
    this.errorStatusBarItem.dispose();
    this.warningStatusBarItem.dispose();
  }

  private makeTooltip(allDiagnostics: [vscode.Uri, vscode.Diagnostic[]][], type: 'error' | 'warning'): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString(undefined, true);
    markdown.isTrusted = true;
    for (const diagWithUri of allDiagnostics) {
      const uri = diagWithUri[0];
      const diagnostics = diagWithUri[1];
      if (diagnostics.length) {
        markdown.appendMarkdown(`**${this.utils.basename(uri.path)}**\n\n`);
      }
      for (const diag of diagnostics) {
        const revealLineUri = vscode.Uri.parse(
          `command:${EELCommandId.RevealLine}?${encodeURIComponent(JSON.stringify([uri.fsPath, [diag.range.start.line, diag.range.start.character]]))}`,
        );
        markdown.appendMarkdown(`<span style="color:${type === 'error' ? 'var(--vscode-editorError-foreground)' : 'var(--vscode-editorWarning-foreground)'};">$(${type})</span> [${diag.message} \`${diag.source ?? '<No source>'}\`](${revealLineUri.toString()})\n\n`);
      }
    }
    return markdown;
  }

  private setForeground(statusBarType: TELStatusBarProblemType): void {
    if (statusBarType === 'error') {
      this.errorStatusBarItem.color = this.errorForegroundThemeColor;
    } else if (statusBarType === 'warning') {
      this.warningStatusBarItem.color = this.warningForegroundThemeColor;
    }
  }

  private clearForeground(statusBarType: TELStatusBarProblemType): void {
    if (statusBarType === 'error') {
      this.errorStatusBarItem.color = undefined;
    } else if (statusBarType === 'warning') {
      this.warningStatusBarItem.color = undefined;
    }
  }

  /**
   * Set background (only if it's enabled) or clear it.
   */
  private setBackground(statusBarType: TELStatusBarProblemType): void {
    if (!this.useBackground) {
      return;
    }

    if (statusBarType === 'error') {
      this.errorStatusBarItem.backgroundColor = this.errorBackgroundThemeColor;
    } else if (statusBarType === 'warning') {
      this.warningStatusBarItem.backgroundColor = this.warningBackgroundThemeColor;
    }
  }

  private clearBackground(statusBarType: TELStatusBarProblemType): void {
    if (statusBarType === 'error') {
      this.errorStatusBarItem.backgroundColor = undefined;
    } else if (statusBarType === 'warning') {
      this.warningStatusBarItem.backgroundColor = undefined;
    }
  }
}
