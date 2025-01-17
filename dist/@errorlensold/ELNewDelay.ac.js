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
exports.ELNewDelay = void 0;
const vscode = __importStar(require("vscode"));
const lodash_1 = require("lodash");
const ELDecorations_ac_js_1 = require("./ELDecorations.ac.js");
const ErrorLens_js_1 = require("./ErrorLens.js");
// delay/newDelay.ts
class ELNewDelay {
    decorations = new ELDecorations_ac_js_1.ELDecorations;
    updateDecorationsDebounced;
    documentChangeDisposable;
    constructor(delayMs) {
        this.updateDecorationsDebounced = (0, lodash_1.debounce)(this.updateDecorations, delayMs, {
            leading: false,
            trailing: true,
        });
        this.documentChangeDisposable = vscode.workspace.onDidChangeTextDocument(e => {
            this.clearDecorationsForUri(e.document.uri);
            this.updateDecorationsDebounced(e.document.uri);
        });
    }
    dispose() {
        this.documentChangeDisposable?.dispose();
    }
    onDiagnosticChange = (event) => {
        for (const uri of event.uris) {
            for (const editor of vscode.window.visibleTextEditors) {
                if (editor.document.uri.toString(true) === uri.toString(true)) {
                    this.updateDecorationsDebounced(uri);
                }
            }
        }
    };
    updateDecorations = (uri) => {
        ErrorLens_js_1.$state.log('NewDelay => updateDecorations()', uri.toString(true));
        this.decorations.updateDecorationsForUri({
            uri,
        });
        ErrorLens_js_1.$state.statusBarIcons.updateText();
    };
    clearDecorationsForUri(uri) {
        this.decorations.updateDecorationsForUri({
            uri,
            groupedDiagnostics: {},
        });
    }
}
exports.ELNewDelay = ELNewDelay;
