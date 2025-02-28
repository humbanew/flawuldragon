/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as vscode from 'vscode';
import { debounce } from 'lodash';
import { ELDecorations } from './ELDecorations';
import { $state } from './ErrorLens';

// delay/newDelay.ts
export class ELNewDelay {

  private readonly updateDecorationsDebounced: (uri: vscode.Uri)=> void;
  private readonly documentChangeDisposable: vscode.Disposable;

  constructor(delayMs: number) {
    this.updateDecorationsDebounced = debounce(this.updateDecorations, delayMs, {
      leading: false,
      trailing: true,
    });
    this.documentChangeDisposable = vscode.workspace.onDidChangeTextDocument(e => {
      this.clearDecorationsForUri(e.document.uri);
      this.updateDecorationsDebounced(e.document.uri);
    });
  }

  dispose(): void {
    this.documentChangeDisposable?.dispose();
  }

  onDiagnosticChange = (event: vscode.DiagnosticChangeEvent): void => {
    for (const uri of event.uris) {
      for (const editor of vscode.window.visibleTextEditors) {
        if (editor.document.uri.toString(true) === uri.toString(true)) {
          this.updateDecorationsDebounced(uri);
        }
      }
    }
  };

  private readonly updateDecorations = (uri: vscode.Uri): void => {
    $state.log('NewDelay => updateDecorations()', uri.toString(true));
    ELDecorations.prototype.updateDecorationsForUri({
      uri,
    });
    $state.statusBarIcons.updateText();
  };

  private clearDecorationsForUri(uri: vscode.Uri): void {
    ELDecorations.prototype.updateDecorationsForUri({
      uri,
      groupedDiagnostics: {},
    });
  }
}
