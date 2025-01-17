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
exports.AutoRenameTag = void 0;
const vscode = __importStar(require("vscode"));
const vscode_languageserver_1 = require("vscode-languageserver");
const node_1 = require("vscode-languageclient/node");
const node_assert_1 = require("node:assert");
class AutoRenameTag {
    createLanguageClientProxy = async (context, id, name, clientOptions) => {
        const serverModule = context.asAbsolutePath('./src/@errorlens/AutoRenameTagServer.ac.js');
        const serverOptions = {
            run: { module: serverModule, transport: node_1.TransportKind.ipc },
            debug: {
                module: serverModule,
                transport: node_1.TransportKind.ipc,
                options: { execArgv: ['--nolazy', '--inspect=6009'] }
            }
        };
        const outputChannel = vscode.window.createOutputChannel(name);
        clientOptions.outputChannel = {
            name: outputChannel.name,
            append() { },
            appendLine(value) {
                try {
                    let message = null;
                    if (typeof value === 'object') {
                        message = JSON.parse(value);
                    }
                    if (!message?.isLSPMessage) {
                        outputChannel.appendLine(value);
                    }
                }
                catch (error) {
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
        const languageClient = new node_1.LanguageClient(id, name, serverOptions, clientOptions);
        languageClient.registerProposedFeatures();
        context.subscriptions.push(languageClient.start());
        await languageClient.onReady();
        const languageClientProxy = {
            code2ProtocolConverter: languageClient.code2ProtocolConverter,
            sendRequest: (type, params) => languageClient.sendRequest(type, params)
        };
        return languageClientProxy;
    };
    assertDefined = val => {
        if (val === undefined || val === null) {
            throw new node_assert_1.AssertionError({
                message: `Expected 'value' to be defined, but received ${val}`
            });
        }
    };
    autoRenameTagRequestType = new vscode_languageserver_1.RequestType('$/flawuldragon');
    // TODO implement max concurrent requests
    askServerForAutoCompletionsElementRenameTag = async (languageClientProxy, document, tags) => {
        const params = {
            textDocument: languageClientProxy.code2ProtocolConverter.asVersionedTextDocumentIdentifier(document),
            tags
        };
        return languageClientProxy.sendRequest(this.autoRenameTagRequestType, params);
    };
    /**
     * Utility variable that stores the last changed version (document.uri.fsPath and document.version)
     * When a change was caused by auto-rename-tag, we can ignore that change, which is a simple performance improvement. One thing to take care of is undo, but that works now (and there are test cases).
     */
    lastChangeByAutoRenameTag = {
        fsPath: '',
        version: -1
    };
    applyResults = async (results) => {
        this.assertDefined(vscode.window.activeTextEditor);
        const prev = vscode.window.activeTextEditor.document.version;
        const applied = await vscode.window.activeTextEditor.edit(editBuilder => {
            this.assertDefined(vscode.window.activeTextEditor);
            for (const result of results) {
                const startPosition = vscode.window.activeTextEditor.document.positionAt(result.startOffset);
                const endPosition = vscode.window.activeTextEditor.document.positionAt(result.endOffset);
                const range = new vscode.Range(startPosition, endPosition);
                editBuilder.replace(range, result.tagName);
            }
        }, {
            undoStopBefore: false,
            undoStopAfter: false
        });
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
    latestCancelTokenSource;
    previousText;
    tagNameReLeft = /<\/?[^<>\s\\\/\'\"\(\)\`\{\}\[\]]*$/;
    tagNameRERight = /^[^<>\s\\\/\'\"\(\)\`\{\}\[\]]*/;
    wordsAtOffsets = {};
    updateWordsAtOffset = tags => {
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
                oldWord: (this.wordsAtOffsets[tag.previousOffset] &&
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
    doAutoCompletionElementRenameTag = async (languageClientProxy, tags) => {
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
        if (this.lastChangeByAutoRenameTag.fsPath ===
            vscode.window.activeTextEditor.document.uri.fsPath &&
            this.lastChangeByAutoRenameTag.version ===
                vscode.window.activeTextEditor.document.version) {
            return;
        }
        if (cancelTokenSource.token.isCancellationRequested) {
            return;
        }
        const results = await this.askServerForAutoCompletionsElementRenameTag(languageClientProxy, vscode.window.activeTextEditor.document, tags);
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
    setPreviousText = textEditor => {
        if (textEditor) {
            this.previousText = textEditor.document.getText();
        }
        else {
            this.previousText = undefined;
        }
    };
    activate = async (context) => {
        try {
            vscode.workspace
                .getConfiguration('auto-rename-tag')
                .get('activationOnLanguage');
            const isEnabled = (document) => {
                if (!document) {
                    return false;
                }
                const languageId = document.languageId;
                if (languageId === 'html' || languageId === 'handlebars') {
                    const editorSettings = vscode.workspace.getConfiguration('editor', document);
                    if (editorSettings.get('renameOnType') ||
                        editorSettings.get('linkedEditing')) {
                        return false;
                    }
                }
                const config = vscode.workspace.getConfiguration('auto-rename-tag', document.uri);
                const languages = config.get('activationOnLanguage', ['*']);
                return languages.includes('*') || languages.includes(languageId);
            };
            context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(event => {
                // purges cache for `vscode.workspace.getConfiguration`
                if (!event.affectsConfiguration('auto-rename-tag')) {
                    return;
                }
            }));
            const clientOptions = {
                documentSelector: [
                    {
                        scheme: '*'
                    }
                ]
            };
            const languageClientProxy = await this.createLanguageClientProxy(context, 'flawuldragon', 'Flawuldragon - ARCCTag', clientOptions);
            let activeTextEditor = vscode.window.activeTextEditor;
            let changeListener;
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
                changeListener = vscode.workspace.onDidChangeTextDocument(async (event) => {
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
                    const tags = [];
                    let totalInserted = 0;
                    const sortedChanges = event.contentChanges
                        .slice()
                        .sort((a, b) => a.rangeOffset - b.rangeOffset);
                    const keys = Object.keys(this.wordsAtOffsets);
                    for (const change of sortedChanges) {
                        for (const key of keys) {
                            const parsedKey = parseInt(key, 10);
                            if (change.rangeOffset <= parsedKey &&
                                parsedKey <= change.rangeOffset + change.rangeLength) {
                                delete this.wordsAtOffsets[key];
                            }
                        }
                        this.assertDefined(this.previousText);
                        const line = event.document.lineAt(change.range.start.line);
                        const lineStart = event.document.offsetAt(line.range.start);
                        const lineChangeOffset = change.rangeOffset - lineStart;
                        const lineLeft = line.text.slice(0, lineChangeOffset + totalInserted);
                        const lineRight = line.text.slice(lineChangeOffset + totalInserted);
                        const lineTagNameLeft = lineLeft.match(this.tagNameReLeft);
                        const lineTagNameRight = lineRight.match(this.tagNameRERight);
                        const previousTextRight = this.previousText.slice(change.rangeOffset);
                        const previousTagNameRight = previousTextRight.match(this.tagNameRERight);
                        let newWord;
                        let oldWord;
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
                        const offset = change.rangeOffset - lineTagNameLeft[0].length + totalInserted;
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
                });
            };
            this.setPreviousText(vscode.window.activeTextEditor);
            setupChangeListener();
            context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(textEditor => {
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
            }));
        }
        catch (error) {
            return;
        }
    };
}
exports.AutoRenameTag = AutoRenameTag;
