/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as vscode from 'vscode';
import { ELExtUtils } from './ELExtUtils';
import { ELUtils } from './ELUtils';
import { EELConstants, EELCommandId } from './enums';
import { $config, $state } from './ErrorLens';

// codeLens.ts
/**
 * Creates a `Code Lens` above the code. `provideCodeLenses` is called
 * by the application so we can't hook into the `doUpdateDecorations` like other decorators.
 * Instead, if diagnostics change, we need to call `requestUpdate` should be called to ask for a refresh.
 */
export class ELErrorLensCodeLens implements vscode.CodeLensProvider {

  public onDidChangeCodeLenses: vscode.Event<void>;
  private readonly onDidChangeEventEmitter: vscode.EventEmitter<void>;
  private disposables: vscode.Disposable[];

  constructor(_extensionContext: vscode.ExtensionContext) {
    this.onDidChangeEventEmitter = new vscode.EventEmitter<void>();
    this.onDidChangeCodeLenses = this.onDidChangeEventEmitter.event;

    this.disposables = [
      this.onDidChangeEventEmitter,
      vscode.languages.registerCodeLensProvider('*', this),
    ];
  }

  formatDiagnostic(diagnostic: vscode.Diagnostic): string {
    return ELExtUtils.prototype.prepareMessage({
      template: $config.codeLensTemplate,
      diagnostic,
      lineProblemCount: 1,
      removeLinebreaks: true,
      replaceLinebreaksSymbol: $config.replaceLinebreaksSymbol,
    });
  }

  /**
   * A Code Lens tooltip does not support markdown https://github.com/microsoft/vscode/issues/154063
   * so we cannot use the very nicely formatted `createHoverForDiagnostic`
   */
  createTooltip(diagnostics: vscode.Diagnostic[]): string {
    return diagnostics
      .map(this.formatDiagnostic)
      .join('\n');
  }

  /**
   * Format and truncate/pad diagnostic message if needed depending on user settings.
   */
  createTitle(diagnostic: vscode.Diagnostic): string {
    const formattedDiagnostic = this.formatDiagnostic(diagnostic);
    return ELUtils.prototype.truncateString(formattedDiagnostic, $config.codeLensLength.max)
      .padEnd($config.codeLensLength.min, EELConstants.NonBreakingSpaceSymbol);
  }

  /**
   * Called by Vscode to provide code lenses
   */
  provideCodeLenses(document: vscode.TextDocument, _cancellationToken: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    if (!this.isEnabled()) {
      return [];
    }

    // TODO: duplicate code in `decorations.ts`
    if ($state.excludePatterns) {
      for (const pattern of $state.excludePatterns) {
        if (vscode.languages.match(pattern, document) !== 0) {
          return [];
        }
      }
    }

    const groupedDiagnostic = ELExtUtils.prototype.groupDiagnosticsByLine(vscode.languages.getDiagnostics(document.uri));

    const codeLens: vscode.CodeLens[] = [];

    for (const lineNumber in groupedDiagnostic) {
      const diagnosticsAtLine = groupedDiagnostic[lineNumber];

      for (const diagnostic of diagnosticsAtLine) {
        codeLens.push(new vscode.CodeLens(
          new vscode.Range(Number(lineNumber), 0, Number(lineNumber), 0),
          {
            title: this.createTitle(diagnostic),
            command: EELCommandId.CodeLensOnClick,
            tooltip: this.createTooltip(diagnosticsAtLine),
            arguments: [
              diagnostic,
            ],
          },
        ));
      }
    }

    return codeLens;
  }

  isEnabled(): boolean {
    return (
      $config.enabled &&
      $config.codeLensEnabled
    );
  }

  update(): void {
    this.onDidChangeEventEmitter.fire();
  }

  dispose(): void {
    this.update();

    setInterval(() => {
      for (const disposable of this.disposables) {
        disposable?.dispose();
      }
      this.disposables = [];
    }, 500);
  }
}
