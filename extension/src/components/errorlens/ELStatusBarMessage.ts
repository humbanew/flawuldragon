/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as vscode from 'vscode';
import { TELExtensionConfig, IELStatusBarMessageInit, TELGroupedByLineDiagnostics } from './declares';
import { ELExtUtils } from './ELExtUtils';
import { ELUtils } from './ELUtils';
import { EELCommandId } from './enums';
import { ELHover } from './ELHover';
import { $config } from './ErrorLens';

// statusBar/statusBarMessage.ts
/**
 * Handle status bar updates.
 */
export class ELStatusBarMessage {

  /**
   * Array of vscode `ThemeColor` for each of 4 diagnostic severity states.
   */
  public statusBarColors: vscode.ThemeColor[] = [];
  /**
   * Position in editor of active message. Needed to jump to error on click.
   */
  public activeMessagePosition: vscode.Position = new vscode.Position(0, 0);
  /**
   * Active message text. Needed to copy to clipboard on click.
   */
  public activeMessageText = '';
  /**
   * Active message source. Needed to copy to clipboard on click.
   */
  public activeMessageSource?: string = '';
  /**
   * Status bar item reference.
   */
  private readonly statusBarItem: vscode.StatusBarItem;
  private readonly isEnabled: boolean;
  private readonly colorsEnabled: boolean;
  private readonly messageType: TELExtensionConfig['statusBarMessageType'];

  constructor(
    {
      isEnabled,
      colorsEnabled,
      messageType,
      priority,
      alignment,
    }: IELStatusBarMessageInit,
  ) {
    const statusBarAlignment = alignment === 'right' ? vscode.StatusBarAlignment.Right : vscode.StatusBarAlignment.Left;
    this.isEnabled = isEnabled;
    this.colorsEnabled = colorsEnabled;
    this.messageType = messageType;

    this.statusBarItem = vscode.window.createStatusBarItem('errorLensMessage', statusBarAlignment, priority);
    this.statusBarItem.name = 'Error Lens: Message';
    this.statusBarItem.command = EELCommandId.StatusBarCommand;
    this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    if (this.isEnabled) {
      this.statusBarItem.show();
    } else {
      this.dispose();
    }
  }

  public updateText(editor: vscode.TextEditor, groupedDiagnostics: TELGroupedByLineDiagnostics): void {
    if (!this.isEnabled) {
      return;
    }
    const keys = Object.keys(groupedDiagnostics);
    if (keys.length === 0) {
      this.clear();
      return;
    }

    const ln = editor.selection.active.line;
    let diagnostic: vscode.Diagnostic | undefined;
    let numberOfDiagnosticsOnThatLine = 0;

    if (this.messageType === 'activeLine') {
      if (groupedDiagnostics[ln]) {
        diagnostic = groupedDiagnostics[ln][0];
        numberOfDiagnosticsOnThatLine = groupedDiagnostics[ln].length;
      } else {
        this.clear();
        return;
      }
    } else if (this.messageType === 'activeCursor') {
      if (groupedDiagnostics[ln]) {
        const sortedInlinDiagnostics = groupedDiagnostics[ln].sort((diag1, diag2) => {
          const distanceCharToCursor1 = this.distanceInCharachtersToCursor(diag1);
          const distanceCharToCursor2 = this.distanceInCharachtersToCursor(diag2);

          if (distanceCharToCursor1 === distanceCharToCursor2) {
            return diag1.severity - diag2.severity;
          } else {
            return distanceCharToCursor1 - distanceCharToCursor2;
          }
        });
        diagnostic = sortedInlinDiagnostics[0];
      }
    } else if (this.messageType === 'closestProblem') {
      // Sort by how close it is to the cursor
      const sortedLineNumbers = keys.map(Number).sort((a, b) => Math.abs(ln - a) - Math.abs(ln - b));// TODO: duplicate code?
      outerLoop:
      for (const lineNumber of sortedLineNumbers) {
        const diagnosticsAtLine = groupedDiagnostics[lineNumber];
        for (const diag of diagnosticsAtLine) {
          if (ELExtUtils.prototype.isSeverityEnabled(diag.severity)) {
            diagnostic = diag;
            numberOfDiagnosticsOnThatLine = diagnosticsAtLine.length;
            break outerLoop;
          }
        }
      }
    } else if (this.messageType === 'closestSeverity') {
      const allDiagnosticsSorted = keys.map(key => groupedDiagnostics[key]).flat().sort((d1, d2) => {
        const severityScore = (d1.severity * 1e4) - (d2.severity * 1e4);
        return severityScore + (Math.abs(ln - d1.range.start.line) - Math.abs(ln - d2.range.start.line));
      });
      for (const diag of allDiagnosticsSorted) {
        if (ELExtUtils.prototype.isSeverityEnabled(diag.severity)) {
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

    let message = ELExtUtils.prototype.diagnosticToInlineMessage(
      $config.statusBarMessageTemplate || $config.messageTemplate,
      diagnostic,
      numberOfDiagnosticsOnThatLine,
    );

    if ($config.removeLinebreaks) {
      message = ELUtils.prototype.replaceLinebreaks(message, $config.replaceLinebreaksSymbol);
    }

    this.activeMessageText = message;
    this.activeMessageSource = diagnostic.source;

    if (this.colorsEnabled) {
      this.statusBarItem.color = this.statusBarColors[diagnostic.severity];
    }

    this.statusBarItem.text = message;
    this.statusBarItem.tooltip = this.makeTooltip(diagnostic, $config.lintFilePaths);
  }

  /**
   * Clear status bar message.
   */
  public clear(): void {
    if (!this.isEnabled) {
      return;
    }
    this.statusBarItem.text = '';
    this.statusBarItem.tooltip = '';
  }

  distanceInCharachtersToCursor(diagnostic: vscode.Diagnostic): number {
    const activeSelection = vscode.window.activeTextEditor?.selection.active;
    if (!activeSelection) {
      return 0;
    }
    if (diagnostic.range.contains(activeSelection)) {
      return 0;
    }
    return Math.min(
      Math.abs(diagnostic.range.start.character - activeSelection.character),
      Math.abs(diagnostic.range.end.character - activeSelection.character),
    );
  }

  /**
   * Dispose status bar item.
   */
  public dispose(): void {
    this.statusBarItem.dispose();
  }

  private makeTooltip(diagnostic: vscode.Diagnostic, lintFilePaths: TELExtensionConfig['lintFilePaths']): vscode.MarkdownString | undefined {
    const markdownHover = ELHover.prototype.createHoverForDiagnostic({
      diagnostic,
      buttonsEnabled: true,
      messageEnabled: true,
      sourceCodeEnabled: true,
      lintFilePaths,
    });

    return markdownHover;
  }
}
