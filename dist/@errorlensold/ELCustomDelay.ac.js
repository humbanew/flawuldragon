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
exports.ELCustomDelay = void 0;
const vscode = __importStar(require("vscode"));
const lodash_1 = require("lodash");
const ELDecorations_ac_js_1 = require("./ELDecorations.ac.js");
const ELExtUtils_ac_js_1 = require("./ELExtUtils.ac.js");
const ErrorLens_js_1 = require("./ErrorLens.js");
// delay/customDelay.ts
class ELCustomDelay {
    decorations = new ELDecorations_ac_js_1.ELDecorations;
    extUtils = new ELExtUtils_ac_js_1.ELExtUtils;
    /**
     * Saved diagnostics for each Uri.
     */
    cachedDiagnostics = {};
    /**
     * Do not update more often than once in 300ms to avoid flickering.
     */
    updateDecorationsThrottled;
    /**
     * Function that uses user delay setting `errorLens.delay` to debounce rendering of NEW problems.
     */
    updateDecorationsDebounced;
    /**
     * Try to add delay to new decorations.
     * But old fixed errors should be removed immediately.
     */
    constructor(delayMs) {
        this.updateDecorationsThrottled = (0, lodash_1.throttle)(this.updateDecorations, 300, {
            leading: true,
            trailing: true,
        });
        this.updateDecorationsDebounced = (0, lodash_1.debounce)(this.updateDecorationsThrottled, delayMs, {
            leading: false,
            trailing: true,
        });
    }
    onDiagnosticChange = (event) => {
        if (!event.uris.length) {
            this.cachedDiagnostics = {};
            return;
        }
        for (const uri of event.uris) {
            this.updateCachedDiagnosticForUri(uri);
        }
    };
    updateCachedDiagnosticForUri = (uri) => {
        const stringUri = uri.toString();
        const diagnosticForUri = vscode.languages.getDiagnostics(uri);
        const cachedDiagnosticsForUri = this.cachedDiagnostics[stringUri];
        const transformed = {
            [stringUri]: {},
        };
        for (const diagnostic of diagnosticForUri) {
            if (transformed[stringUri]) {
                transformed[stringUri][this.convertDiagnosticToId(diagnostic)] = diagnostic;
            }
        }
        if (cachedDiagnosticsForUri) {
            const transformedDiagnosticForUri = transformed[stringUri];
            const cachedKeys = Object.keys(cachedDiagnosticsForUri);
            const transformedKeys = Object.keys(transformedDiagnosticForUri);
            for (const key of cachedKeys) {
                if (!transformedKeys.includes(key)) {
                    // Fixed old problem => remove it fast => do throttle
                    this.updateDecorationsThrottled(uri);
                    return;
                }
            }
            for (const key of transformedKeys) {
                if (!cachedKeys.includes(key)) {
                    // Created new problem => Use delay => do debounce
                    this.updateDecorationsDebounced(uri);
                    return;
                }
            }
        }
        else {
            // If there's no uri saved - save it and render all diagnostics
            this.cachedDiagnostics[stringUri] = transformed[stringUri];
            this.updateDecorationsThrottled(uri);
        }
    };
    updateDecorations = (uri) => {
        const stringUri = uri.toString();
        const diagnostics = vscode.languages.getDiagnostics(uri);
        const groupedDiagnostics = this.extUtils.groupDiagnosticsByLine(diagnostics);
        this.cachedDiagnostics[stringUri] = {};
        for (const diag of diagnostics) {
            this.cachedDiagnostics[stringUri][this.convertDiagnosticToId(diag)] = diag;
        }
        for (const editor of vscode.window.visibleTextEditors) {
            if (editor.document.uri.toString(true) === uri.toString(true)) {
                ErrorLens_js_1.$state.log('CustomDelay => updateDecorations()');
                this.decorations.updateDecorationsForUri({
                    uri,
                    editor,
                    groupedDiagnostics,
                });
            }
        }
        ErrorLens_js_1.$state.statusBarIcons.updateText();
    };
    /**
     * Make id from diagnostic:
     *
     * ```js
     * "1_Missing semicolon"
     * ```
     */
    convertDiagnosticToId(diagnostic) {
        return `${diagnostic.range.start.line}_${diagnostic.message}`;
    }
}
exports.ELCustomDelay = ELCustomDelay;
