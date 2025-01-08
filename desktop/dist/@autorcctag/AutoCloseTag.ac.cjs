"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoCloseTag = void 0;
const vscode = __importStar(require("vscode"));
class AutoCloseTag {
    activate(context) {
        vscode.workspace.onDidChangeTextDocument(event => {
            this.insertAutoCloseTag(event);
        });
        let closeTag = vscode.commands.registerCommand('flawuldragon.auto-close-tag.closeTag', () => {
            this.insertCloseTag();
        });
        context.subscriptions.push(closeTag);
    }
    // this method is called when your extension is deactivated
    deactivate() { }
    insertAutoCloseTag(event) {
        if (!event.contentChanges[0] ||
            (event.reason && event.reason == vscode.TextDocumentChangeReason.Undo) ||
            (event.reason && event.reason == vscode.TextDocumentChangeReason.Redo)) {
            return;
        }
        let isRightAngleBracket = this.CheckRightAngleBracket(event.contentChanges[0]);
        if (!isRightAngleBracket && event.contentChanges[0].text !== '/') {
            return;
        }
        let editor = vscode.window.activeTextEditor;
        if (!editor || (editor && event.document !== editor.document)) {
            return;
        }
        let config = vscode.workspace.getConfiguration('auto-close-tag', editor.document.uri);
        if (!config.get('enableAutoCloseTag', true)) {
            return;
        }
        let languageId = editor.document.languageId;
        let languages = config.get('activationOnLanguage', ['*']);
        let disableOnLanguage = config.get('disableOnLanguage', []);
        if ((languages.indexOf('*') === -1 && languages.indexOf(languageId) === -1) ||
            disableOnLanguage.indexOf(languageId) !== -1) {
            return;
        }
        let selection = editor.selection;
        let originalPosition = selection.start.translate(0, 1);
        let excludedTags = config.get('excludedTags', []);
        let isSublimeText3Mode = config.get('SublimeText3Mode', false);
        let enableAutoCloseSelfClosingTag = config.get('enableAutoCloseSelfClosingTag', true);
        let isFullMode = config.get('fullMode');
        if ((isSublimeText3Mode || isFullMode) &&
            event.contentChanges[0].text === '/') {
            let text = editor.document.getText(new vscode.Range(new vscode.Position(0, 0), originalPosition));
            let last2chars = '';
            if (text.length > 2) {
                last2chars = text.substr(text.length - 2);
            }
            if (last2chars === '</') {
                let closeTag = this.getCloseTag(text, excludedTags);
                if (closeTag) {
                    let nextChar = this.getNextChar(editor, originalPosition);
                    if (nextChar === '>') {
                        closeTag = closeTag.substr(0, closeTag.length - 1);
                    }
                    editor
                        .edit(editBuilder => {
                        editBuilder.insert(originalPosition, closeTag);
                    })
                        .then(() => {
                        if (nextChar === '>') {
                            editor.selection = this.moveSelectionRight(editor.selection, 1);
                        }
                    });
                }
            }
        }
        if (((!isSublimeText3Mode || isFullMode) && isRightAngleBracket) ||
            (enableAutoCloseSelfClosingTag && event.contentChanges[0].text === '/')) {
            let textLine = editor.document.lineAt(selection.start);
            let text = textLine.text.substring(0, selection.start.character + 1);
            let result = /<([_a-zA-Z][a-zA-Z0-9:\-_.]*)(?:\s+[^<>]*?[^\s/<>=]+?)*?\s?(\/|>)$/.exec(text);
            if (result !== null &&
                this.occurrenceCount(result[0], "'") % 2 === 0 &&
                this.occurrenceCount(result[0], '"') % 2 === 0 &&
                this.occurrenceCount(result[0], '`') % 2 === 0) {
                if (result[2] === '>') {
                    if (excludedTags.indexOf(result[1].toLowerCase()) === -1) {
                        editor
                            .edit(editBuilder => {
                            editBuilder.insert(originalPosition, '</' + result[1] + '>');
                        })
                            .then(() => {
                            editor.selection = new vscode.Selection(originalPosition, originalPosition);
                        });
                    }
                }
                else {
                    if (textLine.text.length <= selection.start.character + 1 ||
                        textLine.text[selection.start.character + 1] !== '>') {
                        // if not typing "/" just before ">", add the ">" after "/"
                        editor.edit(editBuilder => {
                            if (config.get('insertSpaceBeforeSelfClosingTag')) {
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
    CheckRightAngleBracket(contentChange) {
        return (contentChange.text === '>' ||
            this.CheckRightAngleBracketInVSCode_1_8(contentChange));
    }
    CheckRightAngleBracketInVSCode_1_8(contentChange) {
        return (contentChange.text.endsWith('>') &&
            contentChange.range.start.character === 0 &&
            contentChange.range.start.line === contentChange.range.end.line &&
            !contentChange.range.end.isEqual(new vscode.Position(0, 0)));
    }
    insertCloseTag() {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let selection = editor.selection;
        let originalPosition = selection.start;
        let config = vscode.workspace.getConfiguration('auto-close-tag', editor.document.uri);
        let excludedTags = config.get('excludedTags', []);
        let text = editor.document.getText(new vscode.Range(new vscode.Position(0, 0), originalPosition));
        if (text.length > 2) {
            let closeTag = this.getCloseTag(text, excludedTags);
            if (closeTag) {
                editor.edit(editBuilder => {
                    editBuilder.insert(originalPosition, closeTag);
                });
            }
        }
    }
    getNextChar(editor, position) {
        let nextPosition = position.translate(0, 1);
        let text = editor.document.getText(new vscode.Range(position, nextPosition));
        return text;
    }
    getCloseTag(text, excludedTags) {
        let regex = /<(\/?[_a-zA-Z][a-zA-Z0-9:\-_.]*)(?:\s+[^<>]*?[^\s/<>=]+?)*?\s?>/g;
        let result = null;
        let stack = [];
        while ((result = regex.exec(text)) !== null) {
            let isStartTag = result[1].substr(0, 1) !== '/';
            let tag = isStartTag ? result[1] : result[1].substr(1);
            if (excludedTags.indexOf(tag.toLowerCase()) === -1) {
                if (isStartTag) {
                    stack.push(tag);
                }
                else if (stack.length > 0) {
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
        }
        else {
            return null;
        }
    }
    moveSelectionRight(selection, shift) {
        let newPosition = selection.active.translate(0, shift);
        let newSelection = new vscode.Selection(newPosition, newPosition);
        return newSelection;
    }
    occurrenceCount(source, find) {
        return source.split(find).length - 1;
    }
}
exports.AutoCloseTag = AutoCloseTag;
