import { AssertionError } from 'assert';
import 'source-map-support/register';
import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  RequestType,
  ServerOptions,
  TransportKind,
  Disposable
} from 'vscode-languageclient/node';
import { IARTLanguageClientProxy } from './IARTLanguageClientProxy';
import { IARTTag } from './IARTTag';
import { IARTParams } from './IARTParams';
import { IARTResult } from './IARTResult';

/**
 * The `AutoRenameTag` class provides functionality for automatically renaming HTML and Handlebars tags
 * within a Visual Studio Code extension. It includes methods for setting up a language client proxy,
 * handling text document changes, and applying auto-completion results to the active text editor.
 * 
 * The class maintains state information such as the latest cancellation token source, previous text,
 * regular expressions for matching tag names, and a mapping of offsets to words that need to be renamed.
 * 
 * Key methods include:
 * - `autoRenameTag_createLanguageClientProxy`: Creates a language client proxy for communication with the language server.
 * - `autoRenameTag_askServerForAutoCompletionsElementRenameTag`: Requests auto-completion suggestions from the server.
 * - `autoRenameTag_applyResults`: Applies the results of the auto rename tag operation to the active text editor.
 * - `autoRenameTag_updateWordsAtOffset`: Updates the words at specific offsets based on the provided tags.
 * - `autoRenameTag_doAutoCompletionElementRenameTag`: Handles the auto-completion and renaming of tags within the active text editor.
 * - `autoRenameTag_setPreviousText`: Sets the previous text from the provided text editor.
 * - `autoRenameTag_activate`: Activates the Auto Rename Tag feature for the Flawuldragon extension.
 * - `autoRenameTag_desactivate`: Deactivates the auto rename tag feature.
 * 
 * The class also includes utility methods for asserting that values are defined and for managing the state of the auto rename tag feature.
 * 
 * @class
 * @example
 * // Example usage:
 * const autoRenameTag = new AutoRenameTag();
 * autoRenameTag.autoRenameTag_activate(context);
 */
export class AutoRenameTag {
  /**
   * A token source that can be used to cancel the latest operation.
   * This property holds an instance of `vscode.CancellationTokenSource` or `undefined` if no operation is in progress.
   */
  protected latestCancelTokenSource: vscode.CancellationTokenSource | undefined;

  /**
   * Stores the previous text value for comparison or other purposes.
   * This property is protected and can be undefined if no previous text is set.
   */
  protected previousText: string | undefined;

  /**
   * Regular expression to match the left part of an HTML tag name.
   * This pattern matches the start of an HTML tag, including the opening angle bracket `<` 
   * and any characters that are not whitespace, backslashes, forward slashes, single quotes, 
   * double quotes, parentheses, backticks, curly braces, or square brackets.
   * 
   * Example matches:
   * - `<div`
   * - `</span`
   * 
   * Example non-matches:
   * - `< div`
   * - `<div>`
   */
  protected tagNameReLeft = /<\/?[^<>\s\\\/\'\"\(\)\`\{\}\[\]]*$/;

  /**
   * Regular expression to match the right part of a tag name.
   * This pattern matches any sequence of characters that are not
   * angle brackets, whitespace, backslashes, forward slashes, 
   * single quotes, double quotes, parentheses, backticks, curly braces, 
   * or square brackets.
   */
  protected tagNameRERight = /^[^<>\s\\\/\'\"\(\)\`\{\}\[\]]*/;

  /**
   * A request type for the auto-rename-tag feature.
   * 
   * This request type is used to handle requests for automatically renaming tags.
   * It takes parameters of type `IARTParams` and returns an array of `IARTResult`.
   */
  protected autoRenameTagRequestType = new RequestType<
    IARTParams,
    IARTResult[],
    any
  >('$/auto-rename-tag');

  /**
   * Utility variable that stores the last changed version (document.uri.fsPath and document.version)
   * When a change was caused by auto-rename-tag, we can ignore that change, which is a simple performance improvement. One thing to take care of is undo, but that works now (and there are test cases).
   */
  protected lastChangeByAutoRenameTag: { fsPath: string; version: number } = {
    fsPath: '',
    version: -1
  };

  /**
   * A mapping of offsets to words that need to be renamed.
   * Each offset is associated with an object containing the old word and the new word.
   *
   * @property {Object.<string, { oldWord: string, newWord: string }>} wordsAtOffsets
   * - The key is the offset as a string.
   * - The value is an object containing:
   *   - `oldWord`: The original word at the given offset.
   *   - `newWord`: The new word to replace the original word.
   */
  protected wordsAtOffsets: {
    [offset: string]: {
      oldWord: string;
      newWord: string;
    };
  } = {};

  /**
   * Creates a language client proxy for the AutoRenameTag extension.
   *
   * @param context - The VS Code extension context.
   * @param id - The unique identifier for the language client.
   * @param name - The name of the language client.
   * @param clientOptions - The options for the language client.
   * @returns A promise that resolves to an `IARTLanguageClientProxy` instance.
   *
   * The function sets up the server module path, server options, and output channel for the language client.
   * It then creates a new `LanguageClient` instance, registers proposed features, and starts the client.
   * Once the client is ready, it returns a proxy object that allows sending requests to the language server.
   */
  protected autoRenameTag_createLanguageClientProxy: (
    context: vscode.ExtensionContext,
    id: string,
    name: string,
    clientOptions: LanguageClientOptions
  ) => Promise<IARTLanguageClientProxy> = async (
    context,
    id,
    name,
    clientOptions
  ) => {
    const serverModule = context.asAbsolutePath('../out/ARTServer.ac.cjs');
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
      append() {},
      appendLine(value: string) {
        try {
          const message = JSON.parse(value);
          if (!message.isLSPMessage) {
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
    const languageClientProxy: IARTLanguageClientProxy = {
      code2ProtocolConverter: languageClient.code2ProtocolConverter,
      sendRequest: (type, params) => languageClient.sendRequest(type, params)
    };
    return languageClientProxy;
  };

  /**
   * Asserts that the provided value is neither `undefined` nor `null`.
   * Throws an `AssertionError` if the value is `undefined` or `null`.
   *
   * @template T - The type of the value to be asserted.
   * @param value - The value to be checked.
   * @throws {AssertionError} If the value is `undefined` or `null`.
   */
  protected autoRenameTag_assertDefined: <T>(
    value: T
  ) => asserts value is NonNullable<T> = val => {
    if (val === undefined || val === null) {
      throw new AssertionError({
        message: `Expected 'value' to be defined, but received ${val}`
      });
    }
  };

  // TODO implement max concurrent requests

  /**
   * Asks the server for auto-completions for renaming tags.
   *
   * @param languageClientProxy - The language client proxy to communicate with the server.
   * @param document - The text document in which the tags are located.
   * @param tags - The list of tags to be renamed.
   * @returns A promise that resolves to an array of results containing the auto-completions.
   */
  protected autoRenameTag_askServerForAutoCompletionsElementRenameTag: (
    languageClientProxy: IARTLanguageClientProxy,
    document: vscode.TextDocument,
    tags: IARTTag[]
  ) => Promise<IARTResult[]> = async (languageClientProxy, document, tags) => {
    const params: IARTParams = {
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
   * Applies the results of the auto rename tag operation to the active text editor.
   *
   * @param results - An array of IARTResult objects containing the results of the auto rename tag operation.
   * @returns A promise that resolves when the operation is complete.
   *
   * This method performs the following steps:
   * 1. Asserts that there is an active text editor.
   * 2. Stores the current version of the document.
   * 3. Applies the edits to the document using the provided results.
   * 4. Updates the last change information if the edits were successfully applied.
   * 5. Adjusts the wordsAtOffsets mapping based on the results.
   */
  protected autoRenameTag_applyResults: (
    results: IARTResult[]
  ) => Promise<void> = async results => {
    this.autoRenameTag_assertDefined(vscode.window.activeTextEditor);
    const prev = vscode.window.activeTextEditor.document.version;
    const applied = await vscode.window.activeTextEditor.edit(
      editBuilder => {
        this.autoRenameTag_assertDefined(vscode.window.activeTextEditor);
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

  /**
   * Updates the words at specific offsets based on the provided tags.
   * 
   * This method updates the `wordsAtOffsets` property of the class. It first checks if the current
   * offsets in `wordsAtOffsets` match the provided tags. If they do not match, it resets the 
   * `wordsAtOffsets` object. Then, it updates the `wordsAtOffsets` with the new offsets and words 
   * from the provided tags.
   * 
   * @param tags - An array of tags containing offset information and words to update.
   */
  protected autoRenameTag_updateWordsAtOffset: (tags: IARTTag[]) => void =
    tags => {
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

  /**
   * Handles the auto-completion and renaming of tags within the active text editor.
   * 
   * @param languageClientProxy - The language client proxy used to communicate with the language server.
   * @param tags - An array of tags to be processed for auto-completion and renaming.
   * @returns A promise that resolves when the auto-completion and renaming process is complete.
   * 
   * This method performs the following steps:
   * 1. Cancels any ongoing auto-completion process if one exists.
   * 2. Creates a new cancellation token source for the current operation.
   * 3. Checks if there is an active text editor. If not, the process is aborted.
   * 4. Captures the document version before making any changes.
   * 5. Waits for any pending changes to be applied.
   * 6. Checks if the last change was made by the auto rename tag feature. If so, the process is aborted.
   * 7. Requests auto-completion suggestions from the server.
   * 8. If the operation is cancelled during the request, the process is aborted.
   * 9. If the current cancellation token source is still valid, it is disposed of.
   * 10. If no results are returned, the process is aborted.
   * 11. Checks if there is an active text editor. If not, the process is aborted.
   * 12. Captures the document version after making changes.
   * 13. If the document version has changed during the process, the results are not applied.
   * 14. Applies the auto-completion results to the document.
   */
  protected autoRenameTag_doAutoCompletionElementRenameTag: (
    languageClientProxy: IARTLanguageClientProxy,
    tags: IARTTag[]
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

    const results =
      await this.autoRenameTag_askServerForAutoCompletionsElementRenameTag(
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
    await this.autoRenameTag_applyResults(results);
  };

  /**
   * Sets the previous text from the provided text editor.
   * If the text editor is undefined, it sets the previous text to undefined.
   *
   * @param textEditor - The text editor from which to retrieve the text. If undefined, the previous text is set to undefined.
   */
  protected autoRenameTag_setPreviousText: (
    textEditor: vscode.TextEditor | undefined
  ) => void = textEditor => {
    if (textEditor) {
      this.previousText = textEditor.document.getText();
    } else {
      this.previousText = undefined;
    }
  };

  /**
   * Activates the Auto Rename Tag feature for the Flawuldragon extension.
   * 
   * This method sets up the necessary event listeners and configurations to enable
   * the automatic renaming of HTML and Handlebars tags in the editor. It listens for
   * changes in the text document and updates the tags accordingly.
   * 
   * @param context - The extension context provided by VSCode.
   * 
   * @throws Will show an error message if an error occurs during activation.
   * 
   * @remarks
   * - The method checks if the feature is enabled for the current document based on
   *   the language ID and editor settings.
   * - It sets up a change listener to handle text document changes and update tags.
   * - It also listens for configuration changes to purge the cache for `vscode.workspace.getConfiguration`.
   * 
   * @example
   * ```typescript
   * // Activate the Auto Rename Tag feature
   * const context: vscode.ExtensionContext = ...;
   * await autoRenameTag_activate(context);
   * ```
   */
  public async autoRenameTag_activate(context: vscode.ExtensionContext) {
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
      // const languageClientProxy = await this.autoRenameTag_createLanguageClientProxy(
      //   context,
      //   'auto-rename-tag',
      //   'Auto Rename Tag',
      //   clientOptions
      // );
      let activeTextEditor: vscode.TextEditor | undefined =
        vscode.window.activeTextEditor;
      let changeListener: Disposable | undefined;
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
            const tags: IARTTag[] = [];
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
              this.autoRenameTag_assertDefined(this.previousText);
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
            this.autoRenameTag_updateWordsAtOffset(tags);
            if (tags.length === 0) {
              this.previousText = currentText;
              return;
            }
            this.autoRenameTag_assertDefined(vscode.window.activeTextEditor);
            this.previousText = currentText;
            // this.autoRenameTag_doAutoCompletionElementRenameTag(languageClientProxy, tags);
          }
        );
      };
      this.autoRenameTag_setPreviousText(vscode.window.activeTextEditor);
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
          this.autoRenameTag_setPreviousText(textEditor);
          setupChangeListener();
        })
      );
    } catch (error) {
      console.log('Flawuldragon Auto Rename Tag - Error: ' + error);
      vscode.window.showErrorMessage(
        'An error occurred while activating the Flawuldragon Auto Rename Tag: ' +
          error +
          '. Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)'
      );
      this.autoRenameTag_desactivate();
    } finally {
    }
  }

  /**
   * Deactivates the auto rename tag feature.
   * Logs a message indicating that the auto rename tag is deactivated.
   */
  public autoRenameTag_desactivate() {
    console.log('Auto Rename Tag is desactivate.');
  }
}
