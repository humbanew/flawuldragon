import * as vscode from 'vscode';
import {
  IARCCTLanguageClientProxy,
  IARCCTTag,
  IARCCTParams,
  IARCCTResult
} from './declares';
import { RequestType } from 'vscode-languageserver';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';
import { AssertionError } from 'node:assert';

export class AutoRenameTag {
  public createLanguageClientProxy: (
    context: vscode.ExtensionContext,
    id: string,
    name: string,
    clientOptions: LanguageClientOptions
  ) => Promise<IARCCTLanguageClientProxy> = async (
    context,
    id,
    name,
    clientOptions
  ) => {
      const serverModule = context.extensionPath + '/@autorcctag/AutoRenameTagServer.ac.js';
      const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
          module: serverModule,
          transport: TransportKind.ipc,
          options: { execArgv: ['--nolazy', '--inspect=6009'] }
        }
      };
      const outputChannel = vscode.window.createOutputChannel(name);
      clientOptions.outputChannel = {
        name: outputChannel.name,
        append() { },
        appendLine(value: string) {
          try {
            let message = null;
            if (typeof value === 'object') {
              message = JSON.parse(value);
            }
            if (!message?.isLSPMessage) {
              outputChannel.appendLine(value);
            }
          } catch (error) {
            if (typeof value !== 'object') {
              outputChannel.appendLine(value);
            }
          }
        },
        replace(value) {
          outputChannel.replace(value);
        },
        clear() {
          outputChannel.clear();
        },
        show() {
          outputChannel.show();
        },
        hide() {
          outputChannel.hide();
        },
        dispose() {
          outputChannel.dispose();
        }
      };

      const languageClient = new LanguageClient(
        id,
        name,
        serverOptions,
        clientOptions
      );

      languageClient.registerProposedFeatures();
      context.subscriptions.push(languageClient.start());
      await languageClient.onReady();
      const languageClientProxy: IARCCTLanguageClientProxy = {
        code2ProtocolConverter: languageClient.code2ProtocolConverter,
        sendRequest: (type, params) => languageClient.sendRequest(type, params)
      };
      return languageClientProxy;
    };

  public assertDefined: <T>(value: T) => asserts value is NonNullable<T> =
    val => {
      if (val === undefined || val === null) {
        throw new AssertionError({
          message: `Expected 'value' to be defined, but received ${val}`
        });
      }
    };

  public autoRenameTagRequestType = new RequestType<
    IARCCTParams,
    IARCCTResult[],
    any
  >('$/flawuldragon');

  // TODO implement max concurrent requests

  public askServerForAutoCompletionsElementRenameTag: (
    languageClientProxy: IARCCTLanguageClientProxy,
    document: vscode.TextDocument,
    tags: IARCCTTag[]
  ) => Promise<IARCCTResult[]> = async (
    languageClientProxy,
    document,
    tags
  ) => {
      const params: IARCCTParams = {
        textDocument:
          languageClientProxy.code2ProtocolConverter.asVersionedTextDocumentIdentifier(
            document
          ),
        tags
      };
      return languageClientProxy.sendRequest(
        this.autoRenameTagRequestType,
        params
      );
    };

  /**
   * Utility variable that stores the last changed version (document.uri.fsPath and document.version)
   * When a change was caused by auto-rename-tag, we can ignore that change, which is a simple performance improvement. One thing to take care of is undo, but that works now (and there are test cases).
   */
  public lastChangeByAutoRenameTag: { fsPath: string; version: number } = {
    fsPath: '',
    version: -1
  };

  public applyResults: (results: IARCCTResult[]) => Promise<void> =
    async results => {
      this.assertDefined(vscode.window.activeTextEditor);
      const prev = vscode.window.activeTextEditor.document.version;
      const applied = await vscode.window.activeTextEditor.edit(
        editBuilder => {
          this.assertDefined(vscode.window.activeTextEditor);
          for (const result of results) {
            const startPosition =
              vscode.window.activeTextEditor.document.positionAt(
                result.startOffset
              );
            const endPosition =
              vscode.window.activeTextEditor.document.positionAt(
                result.endOffset
              );
            const range = new vscode.Range(startPosition, endPosition);
            editBuilder.replace(range, result.tagName);
          }
        },
        {
          undoStopBefore: false,
          undoStopAfter: false
        }
      );

      const next = vscode.window.activeTextEditor.document.version;
      if (!applied) {
        return;
      }
      this.lastChangeByAutoRenameTag = {
        fsPath: vscode.window.activeTextEditor.document.uri.fsPath,
        version: vscode.window.activeTextEditor.document.version
      };
      if (prev + 1 !== next) {
        return;
      }
      for (const result of results) {
        const oldWordAtOffset = this.wordsAtOffsets[result.originalOffset];
        delete this.wordsAtOffsets[result.originalOffset];

        let moved = 0;
        if (result.originalWord.startsWith('</')) {
          moved = result.endOffset - result.startOffset + 2;
        }
        this.wordsAtOffsets[result.originalOffset + moved] = {
          newWord: oldWordAtOffset && oldWordAtOffset.newWord,
          oldWord: result.originalWord
        };
      }
    };

  public latestCancelTokenSource: vscode.CancellationTokenSource | undefined;
  public previousText: string | undefined;
  public tagNameReLeft = /<\/?[^<>\s\\\/\'\"\(\)\`\{\}\[\]]*$/;
  public tagNameRERight = /^[^<>\s\\\/\'\"\(\)\`\{\}\[\]]*/;

  public wordsAtOffsets: {
    [offset: string]: {
      oldWord: string;
      newWord: string;
    };
  } = {};

  public updateWordsAtOffset: (tags: IARCCTTag[]) => void = tags => {
    const keys = Object.keys(this.wordsAtOffsets);
    if (keys.length > 0) {
      if (keys.length !== tags.length) {
        this.wordsAtOffsets = {};
      }
      for (const tag of tags) {
        if (!this.wordsAtOffsets.hasOwnProperty(tag.previousOffset)) {
          this.wordsAtOffsets = {};
          break;
        }
      }
    }
    for (const tag of tags) {
      this.wordsAtOffsets[tag.offset] = {
        oldWord:
          (this.wordsAtOffsets[tag.previousOffset] &&
            this.wordsAtOffsets[tag.previousOffset].oldWord) ||
          tag.oldWord,
        newWord: tag.word
      };
      if (tag.previousOffset !== tag.offset) {
        delete this.wordsAtOffsets[tag.previousOffset];
      }
      tag.oldWord = this.wordsAtOffsets[tag.offset].oldWord;
    }
  };

  public doAutoCompletionElementRenameTag: (
    languageClientProxy: IARCCTLanguageClientProxy,
    tags: IARCCTTag[]
  ) => Promise<void> = async (languageClientProxy, tags) => {
    if (this.latestCancelTokenSource) {
      this.latestCancelTokenSource.cancel();
    }
    const cancelTokenSource = new vscode.CancellationTokenSource();
    this.latestCancelTokenSource = cancelTokenSource;
    if (!vscode.window.activeTextEditor) {
      return;
    }
    const beforeVersion = vscode.window.activeTextEditor.document.version;
    // the change event is fired before we can update the version of the last change by auto rename tag, therefore we wait for that
    await new Promise(resolve => setTimeout(resolve, 0));
    if (!vscode.window.activeTextEditor) {
      return;
    }
    if (
      this.lastChangeByAutoRenameTag.fsPath ===
      vscode.window.activeTextEditor.document.uri.fsPath &&
      this.lastChangeByAutoRenameTag.version ===
      vscode.window.activeTextEditor.document.version
    ) {
      return;
    }

    if (cancelTokenSource.token.isCancellationRequested) {
      return;
    }

    const results = await this.askServerForAutoCompletionsElementRenameTag(
      languageClientProxy,
      vscode.window.activeTextEditor.document,
      tags
    );
    if (cancelTokenSource.token.isCancellationRequested) {
      return;
    }
    if (this.latestCancelTokenSource === cancelTokenSource) {
      this.latestCancelTokenSource = undefined;
      cancelTokenSource.dispose();
    }
    if (results.length === 0) {
      this.wordsAtOffsets = {};
      return;
    }
    if (!vscode.window.activeTextEditor) {
      return;
    }
    const afterVersion = vscode.window.activeTextEditor.document.version;
    if (beforeVersion !== afterVersion) {
      return;
    }
    await this.applyResults(results);
  };

  public setPreviousText: (textEditor: vscode.TextEditor | undefined) => void =
    textEditor => {
      if (textEditor) {
        this.previousText = textEditor.document.getText();
      } else {
        this.previousText = undefined;
      }
    };

  public activate: (context: vscode.ExtensionContext) => Promise<void> =
    async context => {
      try {
        vscode.workspace
          .getConfiguration('auto-rename-tag')
          .get('activationOnLanguage');
        const isEnabled = (document: vscode.TextDocument | undefined) => {
          if (!document) {
            return false;
          }

          const languageId = document.languageId;

          if (languageId === 'html' || languageId === 'handlebars') {
            const editorSettings = vscode.workspace.getConfiguration(
              'editor',
              document
            );
            if (
              editorSettings.get('renameOnType') ||
              editorSettings.get('linkedEditing')
            ) {
              return false;
            }
          }

          const config = vscode.workspace.getConfiguration(
            'auto-rename-tag',
            document.uri
          );

          const languages = config.get<string[]>('activationOnLanguage', ['*']);
          return languages.includes('*') || languages.includes(languageId);
        };
        context.subscriptions.push(
          vscode.workspace.onDidChangeConfiguration(event => {
            // purges cache for `vscode.workspace.getConfiguration`
            if (!event.affectsConfiguration('auto-rename-tag')) {
              return;
            }
          })
        );
        const clientOptions: LanguageClientOptions = {
          documentSelector: [
            {
              scheme: '*'
            }
          ]
        };
        const languageClientProxy = await this.createLanguageClientProxy(
          context,
          'flawuldragon',
          'Flawuldragon - ARCCTag',
          clientOptions
        );
        let activeTextEditor: vscode.TextEditor | undefined =
          vscode.window.activeTextEditor;
        let changeListener: vscode.Disposable | undefined;
        context.subscriptions.push({
          dispose() {
            if (changeListener) {
              changeListener.dispose();
              changeListener = undefined;
            }
          }
        });
        const setupChangeListener = () => {
          if (changeListener) {
            return;
          }
          changeListener = vscode.workspace.onDidChangeTextDocument(
            async event => {
              if (event.document !== activeTextEditor?.document) {
                return;
              }

              if (!isEnabled(event.document)) {
                changeListener?.dispose();
                changeListener = undefined;
                return;
              }

              if (event.contentChanges.length === 0) {
                return;
              }

              const currentText = event.document.getText();
              const tags: IARCCTTag[] = [];
              let totalInserted = 0;
              const sortedChanges = event.contentChanges
                .slice()
                .sort((a, b) => a.rangeOffset - b.rangeOffset);
              const keys = Object.keys(this.wordsAtOffsets);
              for (const change of sortedChanges) {
                for (const key of keys) {
                  const parsedKey = parseInt(key, 10);
                  if (
                    change.rangeOffset <= parsedKey &&
                    parsedKey <= change.rangeOffset + change.rangeLength
                  ) {
                    delete this.wordsAtOffsets[key];
                  }
                }
                this.assertDefined(this.previousText);
                const line = event.document.lineAt(change.range.start.line);
                const lineStart = event.document.offsetAt(line.range.start);
                const lineChangeOffset = change.rangeOffset - lineStart;
                const lineLeft = line.text.slice(
                  0,
                  lineChangeOffset + totalInserted
                );
                const lineRight = line.text.slice(
                  lineChangeOffset + totalInserted
                );
                const lineTagNameLeft = lineLeft.match(this.tagNameReLeft);
                const lineTagNameRight = lineRight.match(this.tagNameRERight);
                const previousTextRight = this.previousText.slice(
                  change.rangeOffset
                );
                const previousTagNameRight = previousTextRight.match(
                  this.tagNameRERight
                );
                let newWord: string;
                let oldWord: string;
                if (!lineTagNameLeft) {
                  totalInserted += change.text.length - change.rangeLength;
                  continue;
                }
                newWord = lineTagNameLeft[0];
                oldWord = lineTagNameLeft[0];
                if (lineTagNameRight) {
                  newWord += lineTagNameRight[0];
                }
                if (previousTagNameRight) {
                  oldWord += previousTagNameRight[0];
                }
                const offset =
                  change.rangeOffset - lineTagNameLeft[0].length + totalInserted;
                tags.push({
                  oldWord,
                  word: newWord,
                  offset,
                  previousOffset: offset - totalInserted
                });
                totalInserted += change.text.length - change.rangeLength;
              }

              this.updateWordsAtOffset(tags);
              if (tags.length === 0) {
                this.previousText = currentText;
                return;
              }
              this.assertDefined(vscode.window.activeTextEditor);
              this.previousText = currentText;
              this.doAutoCompletionElementRenameTag(languageClientProxy, tags);
            }
          );
        };
        this.setPreviousText(vscode.window.activeTextEditor);
        setupChangeListener();
        context.subscriptions.push(
          vscode.window.onDidChangeActiveTextEditor(textEditor => {
            activeTextEditor = textEditor;
            const doument = activeTextEditor?.document;
            if (!isEnabled(doument)) {
              if (changeListener) {
                changeListener.dispose();
                changeListener = undefined;
              }
              return;
            }
            this.setPreviousText(textEditor);
            setupChangeListener();
          })
        );
      } catch (error) {
        return;
      }
    };
}
