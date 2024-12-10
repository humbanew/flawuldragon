import * as vscode from 'vscode';

/**
 * The `AutoCloseTag` class provides functionality to automatically insert closing tags
 * in HTML/XML-like documents within the Visual Studio Code editor. It listens for text
 * document change events and inserts appropriate closing tags based on the configuration
 * settings and the current context of the document.
 * 
 * The class includes methods to:
 * - Handle the insertion of auto-close tags when specific characters are typed.
 * - Check if the inserted character is a right angle bracket (`>`) or a slash (`/`).
 * - Retrieve configuration settings for the auto-close tag feature.
 * - Determine the position of the cursor and other configuration settings such as excluded tags and modes.
 * - Insert closing tags or self-closing tags based on the current context and configuration.
 * - Move the cursor position after inserting tags.
 * - Count occurrences of specific characters within a string.
 * - Activate and deactivate the auto-close tag functionality.
 * 
 * @class
 * @example
 * // To use the AutoCloseTag class, instantiate it and call the activate method with the VSCode extension context:
 * const autoCloseTag = new AutoCloseTag();
 * autoCloseTag.autoCloseTag_activate(context);
 */
export class AutoCloseTag {
  /**
   * Handles the insertion of auto-close tags in a text document.
   * 
   * @param event - The text document change event.
   * 
   * This method performs the following checks and actions:
   * - Ignores the event if there are no content changes, or if the change is due to an undo/redo action.
   * - Checks if the inserted character is a right angle bracket (`>`) or a slash (`/`).
   * - Retrieves the active text editor and verifies if the document in the event matches the active editor's document.
   * - Fetches the configuration settings for the auto-close tag feature.
   * - Checks if the auto-close tag feature is enabled and if the current language is supported.
   * - Determines the position of the cursor and other configuration settings such as excluded tags and modes.
   * - If in Sublime Text 3 mode or full mode and the inserted character is a slash (`/`), it attempts to insert a closing tag.
   * - If the inserted character is a right angle bracket (`>`) or a slash (`/`) and self-closing tags are enabled, it attempts to insert the appropriate closing tag or self-closing tag.
   */
  protected autoCloseTag_insertAutoCloseTag(
    event: vscode.TextDocumentChangeEvent
  ): void {
    if (
      !event.contentChanges[0] ||
      (event.reason && event.reason == vscode.TextDocumentChangeReason.Undo) ||
      (event.reason && event.reason == vscode.TextDocumentChangeReason.Redo)
    ) {
      return;
    }
    let isRightAngleBracket = this.autoCloseTag_CheckRightAngleBracket(event.contentChanges[0]);
    if (!isRightAngleBracket && event.contentChanges[0].text !== '/') {
      return;
    }

    let editor = vscode.window.activeTextEditor;
    if (!editor || (editor && event.document !== editor.document)) {
      return;
    }

    let config = vscode.workspace.getConfiguration(
      'auto-close-tag',
      editor.document.uri
    );
    if (!config.get<boolean>('enableAutoCloseTag', true)) {
      return;
    }

    let languageId = editor.document.languageId;
    let languages = config.get<string[]>('activationOnLanguage', ['*']);
    let disableOnLanguage = config.get<string[]>('disableOnLanguage', []);
    if (
      (languages.indexOf('*') === -1 && languages.indexOf(languageId) === -1) ||
      disableOnLanguage.indexOf(languageId) !== -1
    ) {
      return;
    }

    let selection = editor.selection;
    let originalPosition = selection.start.translate(0, 1);
    let excludedTags = config.get<string[]>('excludedTags', []);
    let isSublimeText3Mode = config.get<boolean>('SublimeText3Mode', false);
    let enableAutoCloseSelfClosingTag = config.get<boolean>(
      'enableAutoCloseSelfClosingTag',
      true
    );
    let isFullMode = config.get<boolean>('fullMode');

    if (
      (isSublimeText3Mode || isFullMode) &&
      event.contentChanges[0].text === '/'
    ) {
      let text = editor.document.getText(
        new vscode.Range(new vscode.Position(0, 0), originalPosition)
      );
      let last2chars = '';
      if (text.length > 2) {
        last2chars = text.substr(text.length - 2);
      }
      if (last2chars === '</') {
        let closeTag = this.autoCloseTag_getCloseTag(text, excludedTags);
        if (closeTag) {
          let nextChar = this.autoCloseTag_getNextChar(editor, originalPosition);
          if (nextChar === '>') {
            closeTag = closeTag.substr(0, closeTag.length - 1);
          }
          editor
            .edit(editBuilder => {
              editBuilder.insert(originalPosition, closeTag);
            })
            .then(() => {
              if (nextChar === '>') {
                editor.selection = this.autoCloseTag_moveSelectionRight(editor.selection, 1);
              }
            });
        }
      }
    }

    if (
      ((!isSublimeText3Mode || isFullMode) && isRightAngleBracket) ||
      (enableAutoCloseSelfClosingTag && event.contentChanges[0].text === '/')
    ) {
      let textLine = editor.document.lineAt(selection.start);
      let text = textLine.text.substring(0, selection.start.character + 1);
      let result =
        /<([_a-zA-Z][a-zA-Z0-9:\-_.]*)(?:\s+[^<>]*?[^\s/<>=]+?)*?\s?(\/|>)$/.exec(
          text
        );
      if (
        result !== null &&
        this.autoCloseTag_occurrenceCount(result[0], "'") % 2 === 0 &&
        this.autoCloseTag_occurrenceCount(result[0], '"') % 2 === 0 &&
        this.autoCloseTag_occurrenceCount(result[0], '`') % 2 === 0
      ) {
        if (result[2] === '>') {
          if (excludedTags.indexOf(result[1].toLowerCase()) === -1) {
            editor
              .edit(editBuilder => {
                editBuilder.insert(originalPosition, '</' + result[1] + '>');
              })
              .then(() => {
                editor.selection = new vscode.Selection(
                  originalPosition,
                  originalPosition
                );
              });
          }
        } else {
          if (
            textLine.text.length <= selection.start.character + 1 ||
            textLine.text[selection.start.character + 1] !== '>'
          ) {
            // if not typing "/" just before ">", add the ">" after "/"
            editor.edit(editBuilder => {
              if (config.get<boolean>('insertSpaceBeforeSelfClosingTag')) {
                const spacePosition = originalPosition.translate(0, -1);
                editBuilder.insert(spacePosition, ' ');
              }
              editBuilder.insert(originalPosition, '>');
            });
          }
        }
      }
    }
  }

  /**
   * Checks if the content change event involves a right angle bracket ('>').
   * This method is used to determine if the auto-close tag functionality should be triggered.
   *
   * @param contentChange - The content change event from the text document.
   * @returns `true` if the content change text is a right angle bracket ('>') or if the 
   *          `autoCloseTag_CheckRightAngleBracketInVSCode_1_8` method returns `true`.
   */
  protected autoCloseTag_CheckRightAngleBracket(
    contentChange: vscode.TextDocumentContentChangeEvent
  ): boolean {
    return (
      contentChange.text === '>' ||
      this.autoCloseTag_CheckRightAngleBracketInVSCode_1_8(contentChange)
    );
  }

  /**
   * Checks if the content change event in VSCode involves the insertion of a right angle bracket ('>') 
   * at the start of a line, and if the change does not occur at the very beginning of the document.
   *
   * @param contentChange - The content change event in the VSCode text document.
   * @returns `true` if the change involves a right angle bracket at the start of a line and not at the document's start, otherwise `false`.
   */
  protected autoCloseTag_CheckRightAngleBracketInVSCode_1_8(
    contentChange: vscode.TextDocumentContentChangeEvent
  ): boolean {
    return (
      contentChange.text.endsWith('>') &&
      contentChange.range.start.character === 0 &&
      contentChange.range.start.line === contentChange.range.end.line &&
      !contentChange.range.end.isEqual(new vscode.Position(0, 0))
    );
  }

  /**
   * Inserts a closing tag at the current cursor position in the active text editor.
   * 
   * This method checks the current text in the editor up to the cursor position
   * and determines if a closing tag should be inserted based on the configuration
   * and excluded tags. If a closing tag is determined to be necessary, it is inserted
   * at the cursor position.
   * 
   * @protected
   * @returns {void} This method does not return a value.
   */
  protected autoCloseTag_insertCloseTag(): void {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    let selection = editor.selection;
    let originalPosition = selection.start;
    let config = vscode.workspace.getConfiguration(
      'auto-close-tag',
      editor.document.uri
    );
    let excludedTags = config.get<string[]>('excludedTags', []);
    let text = editor.document.getText(
      new vscode.Range(new vscode.Position(0, 0), originalPosition)
    );
    if (text.length > 2) {
      let closeTag = this.autoCloseTag_getCloseTag(text, excludedTags);
      if (closeTag) {
        editor.edit(editBuilder => {
          editBuilder.insert(originalPosition, closeTag);
        });
      }
    }
  }

  /**
   * Retrieves the next character from the given position in the editor.
   *
   * @param editor - The instance of the VS Code text editor.
   * @param position - The current position in the editor from which to get the next character.
   * @returns The next character as a string.
   */
  protected autoCloseTag_getNextChar(
    editor: vscode.TextEditor,
    position: vscode.Position
  ): string {
    let nextPosition = position.translate(0, 1);
    let text = editor.document.getText(
      new vscode.Range(position, nextPosition)
    );
    return text;
  }

  /**
   * Determines the appropriate closing tag for an HTML/XML string based on the provided text and excluded tags.
   *
   * @param text - The input string containing HTML/XML content.
   * @param excludedTags - An array of tag names that should be excluded from auto-closing.
   * @returns The closing tag as a string if an unclosed tag is found, otherwise `null`.
   */
  protected autoCloseTag_getCloseTag(
    text: string,
    excludedTags: string[]
  ): string {
    let regex =
      /<(\/?[_a-zA-Z][a-zA-Z0-9:\-_.]*)(?:\s+[^<>]*?[^\s/<>=]+?)*?\s?>/g;
    let result = null;
    let stack = [];
    while ((result = regex.exec(text)) !== null) {
      let isStartTag = result[1].substr(0, 1) !== '/';
      let tag = isStartTag ? result[1] : result[1].substr(1);
      if (excludedTags.indexOf(tag.toLowerCase()) === -1) {
        if (isStartTag) {
          stack.push(tag);
        } else if (stack.length > 0) {
          let lastTag = stack[stack.length - 1];
          if (lastTag === tag) {
            stack.pop();
          }
        }
      }
    }
    if (stack.length > 0) {
      let closeTag = stack[stack.length - 1];
      if (text.substr(text.length - 2) === '</') {
        return closeTag + '>';
      }
      if (text.substr(text.length - 1) === '<') {
        return '/' + closeTag + '>';
      }
      return '</' + closeTag + '>';
    } else {
      return null;
    }
  }

  /**
   * Moves the selection to the right by a specified number of characters.
   *
   * @param selection - The current selection in the editor.
   * @param shift - The number of characters to move the selection to the right.
   * @returns A new selection with the cursor moved to the right by the specified number of characters.
   */
  protected autoCloseTag_moveSelectionRight(
    selection: vscode.Selection,
    shift: number
  ): vscode.Selection {
    let newPosition = selection.active.translate(0, shift);
    let newSelection = new vscode.Selection(newPosition, newPosition);
    return newSelection;
  }

  /**
   * Counts the number of occurrences of a specified substring within a given string.
   *
   * @param source - The string in which to search for the substring.
   * @param find - The substring to count within the source string.
   * @returns The number of times the substring occurs in the source string.
   */
  protected autoCloseTag_occurrenceCount(source: string, find: string): number {
    return source.split(find).length - 1;
  }

  /**
   * Activates the auto-close tag functionality for the Flawuldragon extension.
   * 
   * This method sets up event listeners and commands to automatically insert
   * closing tags when editing HTML/XML-like documents in VSCode.
   * 
   * @param context - The VSCode extension context.
   * 
   * @throws Will log an error message and show an error notification if activation fails.
   */
  public autoCloseTag_activate(context: vscode.ExtensionContext) {
    try {
      vscode.workspace.onDidChangeTextDocument(event => {
        this.autoCloseTag_insertAutoCloseTag(event);
      });

      let closeTag = vscode.commands.registerCommand('flawuldragon.auto-close-tag.closeTag', () => {
          this.autoCloseTag_insertCloseTag();
      });

      context.subscriptions.push(closeTag);
    } catch (error) {
      console.log("Flawuldragon Auto Close Tag - Error: " + error);
      vscode.window.showErrorMessage(
        "An error occurred while activating the Flawuldragon Auto Close Tag: " +
          error +
          ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)",
      );
      this.autoCloseTag_desactivate();
    } finally {}
  }

  /**
   * Deactivates the auto-close tag feature.
   * Logs a message indicating that the auto-close tag feature is deactivated.
   */
  public autoCloseTag_desactivate() {
    console.log('Auto Close Tag is desactivate.');
  }
}
