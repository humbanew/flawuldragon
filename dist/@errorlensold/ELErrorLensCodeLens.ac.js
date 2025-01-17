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
exports.ELErrorLensCodeLens = void 0;
const vscode = __importStar(require("vscode"));
const ELExtUtils_ac_js_1 = require("./ELExtUtils.ac.js");
const ELUtils_ac_js_1 = require("./ELUtils.ac.js");
const ErrorLens_js_1 = require("./ErrorLens.js");
// codeLens.ts
/**
 * Creates a `Code Lens` above the code. `provideCodeLenses` is called
 * by the application so we can't hook into the `doUpdateDecorations` like other decorators.
 * Instead, if diagnostics change, we need to call `requestUpdate` should be called to ask for a refresh.
 */
class ELErrorLensCodeLens {
    extUtils = new ELExtUtils_ac_js_1.ELExtUtils;
    utils = new ELUtils_ac_js_1.ELUtils;
    onDidChangeCodeLenses;
    onDidChangeEventEmitter;
    disposables;
    constructor(_extensionContext) {
        this.onDidChangeEventEmitter = new vscode.EventEmitter();
        this.onDidChangeCodeLenses = this.onDidChangeEventEmitter.event;
        this.disposables = [
            this.onDidChangeEventEmitter,
            vscode.languages.registerCodeLensProvider('*', this),
        ];
    }
    formatDiagnostic(diagnostic) {
        return this.extUtils.prepareMessage({
            template: ErrorLens_js_1.$config.codeLensTemplate,
            diagnostic,
            lineProblemCount: 1,
            removeLinebreaks: true,
            replaceLinebreaksSymbol: ErrorLens_js_1.$config.replaceLinebreaksSymbol,
        });
    }
    /**
     * A Code Lens tooltip does not support markdown https://github.com/microsoft/vscode/issues/154063
     * so we cannot use the very nicely formatted `createHoverForDiagnostic`
     */
    createTooltip(diagnostics) {
        return diagnostics
            .map(this.formatDiagnostic)
            .join('\n');
    }
    /**
     * Format and truncate/pad diagnostic message if needed depending on user settings.
     */
    createTitle(diagnostic) {
        const formattedDiagnostic = this.formatDiagnostic(diagnostic);
        return this.utils.truncateString(formattedDiagnostic, ErrorLens_js_1.$config.codeLensLength.max)
            .padEnd(ErrorLens_js_1.$config.codeLensLength.min, "\u2800" /* EELConstants.NonBreakingSpaceSymbol */);
    }
    /**
     * Called by Vscode to provide code lenses
     */
    provideCodeLenses(document, _cancellationToken) {
        if (!this.isEnabled()) {
            return [];
        }
        // TODO: duplicate code in `decorations.ts`
        if (ErrorLens_js_1.$state.excludePatterns) {
            for (const pattern of ErrorLens_js_1.$state.excludePatterns) {
                if (vscode.languages.match(pattern, document) !== 0) {
                    return [];
                }
            }
        }
        const groupedDiagnostic = this.extUtils.groupDiagnosticsByLine(vscode.languages.getDiagnostics(document.uri));
        const codeLens = [];
        for (const lineNumber in groupedDiagnostic) {
            const diagnosticsAtLine = groupedDiagnostic[lineNumber];
            for (const diagnostic of diagnosticsAtLine) {
                codeLens.push(new vscode.CodeLens(new vscode.Range(Number(lineNumber), 0, Number(lineNumber), 0), {
                    title: this.createTitle(diagnostic),
                    command: "flawuldragon.errorLens.codeLensOnClick" /* EELCommandId.CodeLensOnClick */,
                    tooltip: this.createTooltip(diagnosticsAtLine),
                    arguments: [
                        diagnostic,
                    ],
                }));
            }
        }
        return codeLens;
    }
    isEnabled() {
        return (ErrorLens_js_1.$config.enabled &&
            ErrorLens_js_1.$config.codeLensEnabled);
    }
    update() {
        this.onDidChangeEventEmitter.fire();
    }
    dispose() {
        this.update();
        setInterval(() => {
            for (const disposable of this.disposables) {
                disposable?.dispose();
            }
            this.disposables = [];
        }, 500);
    }
}
exports.ELErrorLensCodeLens = ELErrorLensCodeLens;
