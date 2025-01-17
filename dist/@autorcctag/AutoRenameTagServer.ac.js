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
exports.AutoRenameTagServer = void 0;
const fs = __importStar(require("node:fs"));
const vscode_languageserver_1 = require("vscode-languageserver");
const code_frame_1 = require("@babel/code-frame");
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const AutoRenameTagService_ac_js_1 = require("./AutoRenameTagService.ac.js");
class AutoRenameTagServer {
    autoRenameTagRequestType = new vscode_languageserver_1.RequestType('$/auto-rename-tag');
    NULL_AUTO_RENAME_TAG_RESULT = [];
    autoRenameTag = documents => async ({ textDocument, tags }) => {
        await new Promise(r => setTimeout(r, 20));
        const document = documents.get(textDocument.uri);
        if (!document) {
            return this.NULL_AUTO_RENAME_TAG_RESULT;
        }
        if (textDocument.version !== document.version) {
            return this.NULL_AUTO_RENAME_TAG_RESULT;
        }
        const text = document.getText();
        const results = tags
            .map(tag => {
            const result = AutoRenameTagService_ac_js_1.AutoRenameTagService.prototype?.doAutoRenameTag(text, tag.offset, tag.word, tag.oldWord, document.languageId);
            if (!result) {
                return result;
            }
            result.originalOffset = tag.offset;
            result.originalWord = tag.word;
            return result;
        })
            .filter(Boolean);
        return results;
    };
    handleError = error => {
        console.error(error.stack);
        const lines = error.stack?.split('\n') || [];
        let file = lines[1];
        if (file) {
            let match = file.match(/\((.*):(\d+):(\d+)\)$/);
            if (!match) {
                match = file.match(/at (.*):(\d+):(\d+)$/);
            }
            if (match) {
                const [_, path, line, column] = match;
                const rawLines = fs.readFileSync(path, 'utf-8');
                const location = {
                    start: {
                        line: parseInt(line),
                        column: parseInt(column)
                    }
                };
                const result = (0, code_frame_1.codeFrameColumns)(rawLines, location);
                console.log('\n' + result + '\n');
            }
        }
        let relevantStack = error.stack?.split('\n').slice(1).join('\n');
        if (relevantStack?.includes('at CallbackList.invoke')) {
            relevantStack = relevantStack.slice(0, relevantStack.indexOf('at CallbackList.invoke'));
        }
        console.log(relevantStack);
    };
    useConnectionConsole = (connection, { trace = false } = {}) => method => (...args) => {
        if (trace) {
            const stack = new Error().stack || '';
            let file = stack.split('\n')[2];
            file = file.slice(file.indexOf('at') + 'at'.length, -1);
            const match = file.match(/(.*):(\d+):(\d+)$/);
            if (match) {
                const [_, path, line, column] = match;
                connection.console[method]('at ' + path + ':' + line);
            }
        }
        const stringify = arg => {
            if (arg && arg.toString) {
                if (arg.toString() === '[object Promise]') {
                    return JSON.stringify(arg);
                }
                if (arg.toString() === '[object Object]') {
                    return JSON.stringify(arg);
                }
                return arg;
            }
            return JSON.stringify(arg);
        };
        connection.console[method](args.map(stringify).join(''));
    };
    /**
     * Enables better stack traces for errors and logging.
     */
    enableBetterErrorHandlingAndLogging = connection => {
        const connectionConsole = this.useConnectionConsole(connection, { trace: false });
        console.log = connectionConsole('log');
        console.info = connectionConsole('info');
        console.error = connectionConsole('error');
        process.on('uncaughtException', this.handleError);
        process.on('unhandledRejection', this.handleError);
    };
    connection = (0, node_1.createConnection)();
    documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
    exec() {
        this.enableBetterErrorHandlingAndLogging(this.connection);
        this.connection.onInitialize(() => ({
            capabilities: {
                textDocumentSync: node_1.TextDocumentSyncKind.Incremental
            }
        }));
        this.connection.onInitialized(() => {
            console.log('Auto Rename Tag has been initialized.');
        });
        const handleRequest = fn => params => {
            try {
                return fn(params);
            }
            catch (error) {
                this.handleError(error);
                throw error;
            }
        };
        this.connection.onRequest(this.autoRenameTagRequestType, handleRequest(this.autoRenameTag(this.documents)));
        this.documents.listen(this.connection);
        this.connection.listen();
    }
}
exports.AutoRenameTagServer = AutoRenameTagServer;
