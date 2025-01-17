import * as vscode from 'vscode';
import { throttle, debounce } from 'lodash';
import { TELCachedDiagnostic } from './declares';
import { ELDecorations } from './ELDecorations.ac.js';
import { ELExtUtils } from './ELExtUtils.ac.js';
import { $state } from './ErrorLens.js';

// delay/customDelay.ts
export class ELCustomDelay {

  /**
   * Saved diagnostics for each Uri.
   */
  private cachedDiagnostics: TELCachedDiagnostic = {};
  /**
   * Do not update more often than once in 300ms to avoid flickering.
   */
  private readonly updateDecorationsThrottled: (uri: vscode.Uri)=> void;
  /**
   * Function that uses user delay setting `errorLens.delay` to debounce rendering of NEW problems.
   */
  private readonly updateDecorationsDebounced: (uri: vscode.Uri)=> void;

  /**
   * Try to add delay to new decorations.
   * But old fixed errors should be removed immediately.
   */
  constructor(delayMs: number) {
    this.updateDecorationsThrottled = throttle(this.updateDecorations, 300, {
      leading: true,
      trailing: true,
    });
    this.updateDecorationsDebounced = debounce(this.updateDecorationsThrottled, delayMs, {
      leading: false,
      trailing: true,
    });
  }

  public onDiagnosticChange = (event: vscode.DiagnosticChangeEvent): void => {
    if (!event.uris.length) {
      this.cachedDiagnostics = {};
      return;
    }
    for (const uri of event.uris) {
      this.updateCachedDiagnosticForUri(uri);
    }
  };

  private readonly updateCachedDiagnosticForUri = (uri: vscode.Uri): void => {
    const stringUri = uri.toString();
    const diagnosticForUri = vscode.languages.getDiagnostics(uri);
    const cachedDiagnosticsForUri = this.cachedDiagnostics[stringUri];
    const transformed: TELCachedDiagnostic = {
      [stringUri]: {},
    };
    for (const diagnostic of diagnosticForUri) {
      if (transformed[stringUri]) {
        transformed[stringUri][this.convertDiagnosticToId(diagnostic)] = diagnostic;
      }
    }
    if (cachedDiagnosticsForUri) {
      const transformedDiagnosticForUri = transformed[stringUri];
      const cachedKeys = Object.keys(cachedDiagnosticsForUri);
      const transformedKeys = Object.keys(transformedDiagnosticForUri);

      for (const key of cachedKeys) {
        if (!transformedKeys.includes(key)) {
          // Fixed old problem => remove it fast => do throttle
          this.updateDecorationsThrottled(uri);
          return;
        }
      }

      for (const key of transformedKeys) {
        if (!cachedKeys.includes(key)) {
          // Created new problem => Use delay => do debounce
          this.updateDecorationsDebounced(uri);
          return;
        }
      }
    } else {
      // If there's no uri saved - save it and render all diagnostics
      this.cachedDiagnostics[stringUri] = transformed[stringUri];
      this.updateDecorationsThrottled(uri);
    }
  };

  private readonly updateDecorations = (uri: vscode.Uri): void => {
    const stringUri = uri.toString();
    const diagnostics = vscode.languages.getDiagnostics(uri);
    const groupedDiagnostics = ELExtUtils.prototype.groupDiagnosticsByLine(diagnostics);

    this.cachedDiagnostics[stringUri] = {};
    for (const diag of diagnostics) {
      this.cachedDiagnostics[stringUri][this.convertDiagnosticToId(diag)] = diag;
    }

    for (const editor of vscode.window.visibleTextEditors) {
      if (editor.document.uri.toString(true) === uri.toString(true)) {
        $state.log('CustomDelay => updateDecorations()');
        ELDecorations.prototype.updateDecorationsForUri({
          uri,
          editor,
          groupedDiagnostics,
        });
      }
    }

    $state.statusBarIcons.updateText();
  };

  /**
   * Make id from diagnostic:
   *
   * ```js
   * "1_Missing semicolon"
   * ```
   */
  private convertDiagnosticToId(diagnostic: vscode.Diagnostic): string {
    return `${diagnostic.range.start.line}_${diagnostic.message}`;
  }
}
