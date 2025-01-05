import * as vscode from 'vscode';
import { debounce } from 'lodash';
import { ELDecorations } from './ELDecorations.ac.cjs';
import { $state } from './ErrorLens.cjs';

// delay/newDelay.ts
export class ELNewDelay {
  protected decorations = new ELDecorations;

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
    this.decorations.updateDecorationsForUri({
      uri,
    });
    $state.statusBarIcons.updateText();
  };

  private clearDecorationsForUri(uri: vscode.Uri): void {
    this.decorations.updateDecorationsForUri({
      uri,
      groupedDiagnostics: {},
    });
  }
}
