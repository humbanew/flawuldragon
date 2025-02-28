/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import { debounce } from 'lodash';
import * as vscode from 'vscode';
import { ELCustomDelay } from './ELCustomDelay';
import { ELDecorations } from './ELDecorations';
import { ELExtUtils } from './ELExtUtils';
import { ELNewDelay } from './ELNewDelay';
import { $state, $config } from './ErrorLens';

// events.ts
export class ELEvents {

  public onDidChangeDiagnosticsDisposable: vscode.Disposable | undefined;
  public onDidChangeActiveTextEditor: vscode.Disposable | undefined;
  public onDidChangeVisibleTextEditors: vscode.Disposable | undefined;
  public onDidCursorChangeDisposable: vscode.Disposable | undefined;
  public onDidChangeBreakpoints: vscode.Disposable | undefined;
  public onDidChangeTextEditorVisibleRangesDisposable: vscode.Disposable | undefined;
  public onDidChangeTextDocumentForOnSaveDisposable: vscode.Disposable | undefined;
  public onDidSaveTextDocumentDisposable: vscode.Disposable | undefined;
  public newDelay: ELNewDelay | undefined;

  /**
   * Update listener for when active editor changes.
   */
  public updateChangedActiveTextEditorListener(): void {
    this.onDidChangeActiveTextEditor?.dispose();
  
    this.onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(editor => {
      $state.log('onDidChangeActiveTextEditor()', editor?.document.uri.toString(true));
  
      if ($config.onSave && !$config.onSaveUpdateOnActiveEditorChange) {
        return;
      }
  
      if (editor) {
        ELDecorations.prototype.updateDecorationsForUri({
          uri: editor.document.uri,
          editor,
        });
      } else {
        $state.statusBarMessage.clear();
      }
    });
  }

  /**
   * Update listener for when visible editors change.
   */
  public updateChangeVisibleTextEditorsListener(): void {
    this.onDidChangeVisibleTextEditors?.dispose();
  
    this.onDidChangeVisibleTextEditors = vscode.window.onDidChangeVisibleTextEditors(ELDecorations.prototype.updateDecorationsForAllVisibleEditors);
  }

  /**
   * Update listener for when language server (or extension) sends diagnostic change events.
   */
  public updateChangeDiagnosticListener(): void {
    this.onDidChangeDiagnosticsDisposable?.dispose();
  
    function onChangedDiagnostics(diagnosticChangeEvent: vscode.DiagnosticChangeEvent): void {
      // Many URIs can change - we only need to decorate visible editors
      for (const uri of diagnosticChangeEvent.uris) {
        for (const editor of vscode.window.visibleTextEditors) {
          if (uri.toString(true) === editor.document.uri.toString(true)) {
            $state.log('onChangedDiagnostics()');
            ELDecorations.prototype.updateDecorationsForUri({
              uri,
              editor,
            });
          }
        }
      }
      $state.statusBarIcons.updateText();
    }
    if ($config.onSave) {
      // onDidChangeDiagnosticsDisposable = languages.onDidChangeDiagnostics(e => {
      // 	// if (Date.now() - $state.lastSavedTimestamp < $config.onSaveTimeout) {
      // 	// 	onChangedDiagnostics(e);
      // 	// }
      // });
      return;
    }
    if (typeof $config.delay === 'number' && $config.delay > 0) {
      // Delay
      const delayMs = Math.max($config.delay, 500) || 500;
      if ($config.delayMode === 'old') {
        const customDelay = new ELCustomDelay(delayMs);
        this.onDidChangeDiagnosticsDisposable = vscode.languages.onDidChangeDiagnostics(customDelay.onDiagnosticChange);
      } else if ($config.delayMode === 'debounce') {
        this.onDidChangeDiagnosticsDisposable = vscode.languages.onDidChangeDiagnostics(debounce((e: vscode.DiagnosticChangeEvent) => {
          onChangedDiagnostics(e);
        }, delayMs));
      } else if ($config.delayMode === 'new') {
        this.newDelay?.dispose();
        this.newDelay = new ELNewDelay(delayMs);
        this.onDidChangeDiagnosticsDisposable = vscode.languages.onDidChangeDiagnostics(this.newDelay.onDiagnosticChange);
      }
    } else {
      // No delay
      this.onDidChangeDiagnosticsDisposable = vscode.languages.onDidChangeDiagnostics(onChangedDiagnostics);
    }
  }

  /**
   * Update listener for when active selection (cursor) moves.
   * (only assign event listener when needed: either render decorations depending on caret OR status bar message depending on caret)
   */
  public updateCursorChangeListener(): void {
    this.onDidCursorChangeDisposable?.dispose();
  
    const shouldUpdateEditorDecorations = $config.followCursor === 'activeLine' ||
      $config.followCursor === 'closestProblem' ||
      $config.followCursor === 'allLinesExceptActive' ||
      $config.followCursor === 'closestProblemMultiline';
  
    if (
      shouldUpdateEditorDecorations ||
      ELExtUtils.prototype.shouldShowStatusBarMessage()
    ) {
      let lastPositionLine = -1;
  
      this.onDidCursorChangeDisposable = vscode.window.onDidChangeTextEditorSelection(e => {
        const selection = e.selections[0];
  
        // Only update on active line change
        if (this.caretMovedToAnotherLine(e.selections, lastPositionLine)) {
          $state.log('caret moved to another line');
          if (shouldUpdateEditorDecorations) {
            ELDecorations.prototype.updateDecorationsForUri({
              uri: e.textEditor.document.uri,
              editor: e.textEditor,
              range: selection,
            });
          }
          if (ELExtUtils.prototype.shouldShowStatusBarMessage()) {
            $state.statusBarMessage.updateText(
              e.textEditor,
              ELExtUtils.prototype.groupDiagnosticsByLine(vscode.languages.getDiagnostics(e.textEditor.document.uri)),
            );
          }
          lastPositionLine = e.selections[0].active.line;
        }
        // Update on any cursor movements
        if ($config.statusBarMessageType === 'activeCursor') {
          $state.statusBarMessage.updateText(
            e.textEditor,
            ELExtUtils.prototype.groupDiagnosticsByLine(vscode.languages.getDiagnostics(e.textEditor.document.uri)),
          );
        }
      });
    }
  }

  public caretMovedToAnotherLine(selections: readonly vscode.Selection[], lastPositionLine: number): boolean {
    return selections.length === 1 &&
      selections[0].isEmpty &&
      lastPositionLine !== selections[0].active.line;
  }
  
  public updateOnVisibleRangesListener(): void {
    this.onDidChangeTextEditorVisibleRangesDisposable?.dispose();
  
    if (!$state.shouldUpdateOnEditorScrollEvent) {
      return;
    }
  
    this.onDidChangeTextEditorVisibleRangesDisposable = vscode.window.onDidChangeTextEditorVisibleRanges(e => {
      $state.log('scrolling');
  
      ELDecorations.prototype.updateDecorationsForUri({
        uri: e.textEditor.document.uri,
        editor: e.textEditor,
      });
      // throttle(() => {
  
      // }, 300, {
      // 	leading: false,
      // });
    });
  }

  /**
   * Update listener for when user performs manual save.
   *
   * Editor `files.autoSave` is ignored.
   */
  public updateOnSaveListener(): void {
    this.onDidSaveTextDocumentDisposable?.dispose();
    this.onDidChangeTextDocumentForOnSaveDisposable?.dispose();
  
    if (!$config.onSave) {
      return;
    }
  
    this.onDidSaveTextDocumentDisposable = vscode.workspace.onWillSaveTextDocument(e => {
      $state.log('onWillSaveTextDocument()');
  
      if (e.reason === vscode.TextDocumentSaveReason.Manual) {
        setTimeout(() => {
          ELDecorations.prototype.updateDecorationsForUri({
            uri: e.document.uri,
          });
        }, 250);
        setTimeout(() => {
          ELDecorations.prototype.updateDecorationsForUri({
            uri: e.document.uri,
          });
        }, $config.onSaveTimeout);
      }
    });
  
    this.onDidChangeTextDocumentForOnSaveDisposable = vscode.workspace.onDidChangeTextDocument(e => {
      ELDecorations.prototype.updateDecorationsForUri({
        uri: e.document.uri,
        groupedDiagnostics: {},
      });
    });
  }
  
  public updateChangeBreakpointsListener(): void {
    this.onDidChangeBreakpoints?.dispose();
  
    if (ELExtUtils.prototype.shouldShowGutterIcons()) {
      this.onDidChangeBreakpoints = vscode.debug.onDidChangeBreakpoints(() => {
        for (const editor of vscode.window.visibleTextEditors) {
          ELDecorations.prototype.updateWorkaroundGutterIcon(editor);
        }
      });
    }
  }
  
  public disposeAllEventListeners(): void {
    this.onDidChangeVisibleTextEditors?.dispose();
    this.onDidChangeDiagnosticsDisposable?.dispose();
    this.onDidChangeActiveTextEditor?.dispose();
    this.onDidCursorChangeDisposable?.dispose();
    this.onDidChangeBreakpoints?.dispose();
    this.onDidChangeTextEditorVisibleRangesDisposable?.dispose();
    this.onDidSaveTextDocumentDisposable?.dispose();
    this.onDidChangeTextDocumentForOnSaveDisposable?.dispose();
    this.newDelay?.dispose();
  }
}
