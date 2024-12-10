"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoRenameTag = void 0;
const assert_1 = require("assert");
require("source-map-support/register");
const vscode = require("vscode");
const node_1 = require("vscode-languageclient/node");
class ARTServer {
}
class ARTService {
}
class AutoRenameTag {
    latestCancelTokenSource;
    previousText;
    tagNameReLeft = /<\/?[^<>\s\\\/\'\"\(\)\`\{\}\[\]]*$/;
    tagNameRERight = /^[^<>\s\\\/\'\"\(\)\`\{\}\[\]]*/;
    autoRenameTag_createIARTLanguageClientProxy = async (context, id, name, clientOptions) => {
        const serverModule = context.asAbsolutePath('../server/dist/serverMain.js');
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
                    const message = JSON.parse(value);
                    if (!message.isLSPMessage) {
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
    autoRenameTag_assertDefined = val => {
        if (val === undefined || val === null) {
            throw new assert_1.AssertionError({
                message: `Expected 'value' to be defined, but received ${val}`
            });
        }
    };
    autoRenameTag_autoRenameTagRequestType = new node_1.RequestType('$/auto-rename-tag');
    // TODO implement max concurrent requests
    autoRenameTag_askServerForAutoCompletionsElementRenameIARTTag = async (languageClientProxy, document, tags) => {
        const params = {
            textDocument: languageClientProxy.code2ProtocolConverter.asVersionedTextDocumentIdentifier(document),
            tags
        };
        return languageClientProxy.sendRequest(this.autoRenameTag_autoRenameTagRequestType, params);
    };
    /**
     * Utility variable that stores the last changed version (document.uri.fsPath and document.version)
     * When a change was caused by auto-rename-tag, we can ignore that change, which is a simple performance improvement. One thing to take care of is undo, but that works now (and there are test cases).
     */
    autoRenameTag_lastChangeByAutoRenameTag = {
        fsPath: '',
        version: -1
    };
    autoRenameTag_applyIARTResults = async (results) => {
        this.autoRenameTag_assertDefined(vscode.window.activeTextEditor);
        const prev = vscode.window.activeTextEditor.document.version;
        const applied = await vscode.window.activeTextEditor.edit(editBuilder => {
            this.autoRenameTag_assertDefined(vscode.window.activeTextEditor);
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
        this.autoRenameTag_lastChangeByAutoRenameTag = {
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
    wordsAtOffsets = {};
    autoRenameTag_updateWordsAtOffset = tags => {
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
    autoRenameTag_doAutoCompletionElementRenameTag = async (languageClientProxy, tags) => {
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
        if (this.autoRenameTag_lastChangeByAutoRenameTag.fsPath ===
            vscode.window.activeTextEditor.document.uri.fsPath &&
            this.autoRenameTag_lastChangeByAutoRenameTag.version ===
                vscode.window.activeTextEditor.document.version) {
            return;
        }
        if (cancelTokenSource.token.isCancellationRequested) {
            return;
        }
        const results = await this.autoRenameTag_askServerForAutoCompletionsElementRenameIARTTag(languageClientProxy, vscode.window.activeTextEditor.document, tags);
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
        await this.autoRenameTag_applyIARTResults(results);
    };
    autoRenameTag_setPreviousText = textEditor => {
        if (textEditor) {
            this.previousText = textEditor.document.getText();
        }
        else {
            this.previousText = undefined;
        }
    };
    async autoRenameTag_activate(context) {
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
            const languageClientProxy = await this.autoRenameTag_createIARTLanguageClientProxy(context, 'auto-rename-tag', 'Auto Rename Tag', clientOptions);
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
                        this.autoRenameTag_assertDefined(this.previousText);
                        const line = event.document.lineAt(change.range.start.line);
                        const lineStart = event.document.offsetAt(line.range.start);
                        const lineChangeOffset = change.rangeOffset - lineStart;
                        const lineLeft = line.text.slice(0, lineChangeOffset + totalInserted);
                        const lineRight = line.text.slice(lineChangeOffset + totalInserted);
                        const lineIARTTagNameLeft = lineLeft.match(this.tagNameReLeft);
                        const lineIARTTagNameRight = lineRight.match(this.tagNameRERight);
                        const previousTextRight = this.previousText.slice(change.rangeOffset);
                        const previousIARTTagNameRight = previousTextRight.match(this.tagNameRERight);
                        let newWord;
                        let oldWord;
                        if (!lineIARTTagNameLeft) {
                            totalInserted += change.text.length - change.rangeLength;
                            continue;
                        }
                        newWord = lineIARTTagNameLeft[0];
                        oldWord = lineIARTTagNameLeft[0];
                        if (lineIARTTagNameRight) {
                            newWord += lineIARTTagNameRight[0];
                        }
                        if (previousIARTTagNameRight) {
                            oldWord += previousIARTTagNameRight[0];
                        }
                        const offset = change.rangeOffset - lineIARTTagNameLeft[0].length + totalInserted;
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
                    this.autoRenameTag_doAutoCompletionElementRenameTag(languageClientProxy, tags);
                });
            };
            this.autoRenameTag_setPreviousText(vscode.window.activeTextEditor);
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
                this.autoRenameTag_setPreviousText(textEditor);
                setupChangeListener();
            }));
        }
        catch (error) {
            console.log("Flawuldragon Auto Rename Tag - Error: " + error);
            vscode.window.showErrorMessage("An error occurred while activating the Flawuldragon Auto Rename Tag: " +
                error +
                ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
            this.autoRenameTag_desactivate();
        }
        finally { }
    }
    autoRenameTag_desactivate() {
        console.log('Auto Rename Tag is desactivate.');
    }
}
exports.AutoRenameTag = AutoRenameTag;
