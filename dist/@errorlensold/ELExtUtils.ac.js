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
exports.ELExtUtils = void 0;
const vscode = __importStar(require("vscode"));
const ELUtils_ac_js_1 = require("./ELUtils.ac.js");
const ErrorLens_js_1 = require("./ErrorLens.js");
// utils/extUtils.ts
class ELExtUtils {
    utils = new ELUtils_ac_js_1.ELUtils;
    /**
     * Usually documentation website Uri.
     */
    getDiagnosticTarget(diagnostic) {
        return typeof diagnostic.code !== 'number' && typeof diagnostic.code !== 'string' && diagnostic.code?.target;
    }
    getDiagnosticCode(diagnostic) {
        const code = typeof diagnostic.code === 'string' || typeof diagnostic.code === 'number' ? diagnostic.code : diagnostic.code?.value;
        if (code === undefined) {
            return undefined;
        }
        return String(code);
    }
    /**
     * Take strings like:
     * - `eslint`
     * - `eslint(padded-blocks)`
     * and return { source: 'eslint', code: 'padded-blocks' }
     */
    parseSourceCodeFromString(str) {
        const sourceCodeMatch = /(?<source>[^()]+)(?:\((?<code>.+)\))?/u.exec(str);
        const source = sourceCodeMatch?.groups?.source;
        const code = sourceCodeMatch?.groups?.code;
        return {
            source,
            code,
        };
    }
    diagnosticToSourceCodeString(source, code) {
        return `${source}${code ? `(${code})` : ''}`;
    }
    /**
     * Return diagnostics grouped by line: `Record<string, Diagnostic[]>`
     *
     * Also, excludes diagnostics according to `errorLens.excludeSources` & `errorLens.exclude` settings.
     *
     * Also, sorts the problems in every line by severity err>warn>info>hint.
     */
    groupDiagnosticsByLine(diagnostics) {
        const groupedDiagnostics = {};
        for (const diagnostic of diagnostics) {
            if (this.shouldExcludeDiagnostic(diagnostic)) {
                continue;
            }
            const key = diagnostic.range.start.line;
            if (groupedDiagnostics[key]) {
                groupedDiagnostics[key].push(diagnostic);
            }
            else {
                groupedDiagnostics[key] = [diagnostic];
            }
        }
        // Apply sorting err>warn>info>hint
        for (const key in groupedDiagnostics) {
            groupedDiagnostics[key] = groupedDiagnostics[key].sort((diag1, diag2) => diag1.severity - diag2.severity);
        }
        return groupedDiagnostics;
    }
    /**
     * Check multiple exclude sources if the diagnostic should not be shown.
     */
    shouldExcludeDiagnostic(diagnostic) {
        if (!this.isSeverityEnabled(diagnostic.severity)) {
            return true;
        }
        if (diagnostic.source) {
            for (const excludeSourceCode of ErrorLens_js_1.$state.excludeSources) {
                if (excludeSourceCode.source === diagnostic.source) {
                    let diagnosticCode = '';
                    if (typeof diagnostic.code === 'number') {
                        diagnosticCode = String(diagnostic.code);
                    }
                    else if (typeof diagnostic.code === 'string') {
                        diagnosticCode = diagnostic.code;
                    }
                    else if (diagnostic.code?.value) {
                        diagnosticCode = String(diagnostic.code.value);
                    }
                    if (!excludeSourceCode.code) {
                        // only source exclusion
                        return true;
                    }
                    if (excludeSourceCode.code && diagnosticCode && excludeSourceCode.code === diagnosticCode) {
                        // source and code matches
                        return true;
                    }
                }
            }
        }
        for (const regex of ErrorLens_js_1.$state.excludeRegexp) {
            if (regex.test(diagnostic.message)) {
                return true;
            }
        }
        return false;
    }
    /**
     * `true` when diagnostic enabled in config & in temp variable
     */
    isSeverityEnabled(severity) {
        return ((severity === 0 && ErrorLens_js_1.$state.configErrorEnabled) ||
            (severity === 1 && ErrorLens_js_1.$state.configWarningEnabled) ||
            (severity === 2 && ErrorLens_js_1.$state.configInfoEnabled) ||
            (severity === 3 && ErrorLens_js_1.$state.configHintEnabled));
    }
    /**
     * Generate inline message from template.
     */
    diagnosticToInlineMessage(template, diagnostic, count) {
        let message = diagnostic.message;
        if (ErrorLens_js_1.$state.replaceRegexp) {
            // Apply transformations sequentially, checking at each stage if the updated
            // message matches the next checker. Usuaully there would only be one match,
            // but this ensures individual matchers can transform parts in sequence.
            for (const transformation of ErrorLens_js_1.$state.replaceRegexp) {
                const matchResult = transformation.matcher.exec(message);
                if (matchResult) {
                    message = transformation.message;
                    // Replace groups like $0 and $1 with groups from the match
                    for (let groupIndex = 0; groupIndex < matchResult.length; groupIndex++) {
                        message = message.replace(new RegExp(`\\$${groupIndex}`, 'gu'), matchResult[Number(groupIndex)]);
                    }
                    break;
                }
            }
        }
        if (template === "$message" /* TemplateVars.Message */) {
            // When default template - no need to use RegExps or other stuff.
            return message;
        }
        else {
            // Message & severity is always present.
            let result = template
                .replace("$message" /* TemplateVars.Message */, message)
                .replace("$severity" /* TemplateVars.Severity */, ErrorLens_js_1.$config.severityText[diagnostic.severity] || '');
            /**
             * Count, source & code can be absent.
             * If present - replace them as simple string.
             * If absent - replace by RegExp removing all adjacent non-whitespace symbols with them.
             */
            /* eslint-disable prefer-named-capture-group, max-params */
            if (template.includes("$count" /* TemplateVars.Count */)) {
                if (count > 1) {
                    result = result.replace("$count" /* TemplateVars.Count */, String(count));
                }
                else {
                    // no `$count` in the template - remove it
                    result = result.replace(/(\s*?)?(\S*?)?(\$count)(\S*?)?(\s*?)?/u, (match, g1, g2, g3, g4, g5) => (g1 ?? '') + (g5 ?? ''));
                }
            }
            if (template.includes("$source" /* TemplateVars.Source */)) {
                if (diagnostic.source) {
                    result = result.replace("$source" /* TemplateVars.Source */, String(diagnostic.source));
                }
                else {
                    result = result.replace(/(\s*?)?(\S*?)?(\$source)(\S*?)?(\s*?)?/u, (match, g1, g2, g3, g4, g5) => (g1 ?? '') + (g5 ?? ''));
                }
            }
            if (template.includes("$code" /* TemplateVars.Code */)) {
                const code = typeof diagnostic.code === 'object' ? String(diagnostic.code.value) : String(diagnostic.code);
                if (diagnostic.code) {
                    result = result.replace("$code" /* TemplateVars.Code */, code);
                }
                else {
                    result = result.replace(/(\s*?)?(\S*?)?(\$code)(\S*?)?(\s*?)?/u, (match, g1, g2, g3, g4, g5) => (g1 ?? '') + (g5 ?? ''));
                }
            }
            /* eslint-enable prefer-named-capture-group, max-params */
            return result;
        }
    }
    /**
     * Apply extension settings (`errorLens.messageTemplate`, `errorLens.messageMaxChars`, `errorLens.removeLinebreaks`) to diagnostic message.
     *
     * If the message has thousands of characters - VSCode will render all of them offscreen and the editor will freeze.
     * If the message has linebreaks - it will cut off the message in that place.
     */
    prepareMessage({ template, diagnostic, lineProblemCount, removeLinebreaks, replaceLinebreaksSymbol }) {
        const templated = this.diagnosticToInlineMessage(template, diagnostic, lineProblemCount);
        return this.utils.truncateString(removeLinebreaks ? this.utils.replaceLinebreaks(templated, replaceLinebreaksSymbol) : templated, ErrorLens_js_1.$config.messageMaxChars);
    }
    /**
     * Get all diagnostics from (all/visibleEditors/activeEditor).
     */
    getDiagnostics(arg) {
        const allDiagnostics = vscode.languages.getDiagnostics();
        if (arg === undefined || arg.target === 'all') {
            return allDiagnostics;
        }
        if (arg.target === 'activeEditor') {
            return allDiagnostics.filter(diag => diag[0].toString(true) === vscode.window.activeTextEditor?.document.uri.toString(true));
        }
        else if (arg.target === 'visibleEditors') {
            const visibleUriWithDiagnostics = [];
            for (const diag of allDiagnostics) {
                for (const visibleEditor of vscode.window.visibleTextEditors) {
                    if (visibleEditor.document.uri.toString(true) === diag[0].toString(true)) {
                        visibleUriWithDiagnostics.push(diag);
                    }
                }
            }
            return visibleUriWithDiagnostics;
        }
        return [];
    }
    getDiagnosticAtLine(uri, lineNumber) {
        const diagnostics = vscode.languages.getDiagnostics(uri);
        const groupedDiagnostics = this.groupDiagnosticsByLine(diagnostics);
        const diagnosticsAtLineNumber = groupedDiagnostics[lineNumber];
        if (!diagnosticsAtLineNumber) {
            return;
        }
        return diagnosticsAtLineNumber[0];
    }
    /**
     * Get closest to the active cursor diagnostic.
     *
     * TODO: duplicates code in `statusBarMessage.ts`
     */
    getClosestDiagnostic(editor) {
        const groupedDiagnostics = this.groupDiagnosticsByLine(vscode.languages.getDiagnostics(editor.document.uri));
        const lineNumberKeys = Object.keys(groupedDiagnostics);
        const activeLineNumber = editor.selection.active.line;
        // Sort by how close it is to the cursor
        const sortedLineNumbers = lineNumberKeys.map(Number).sort((ln1, ln2) => Math.abs(activeLineNumber - ln1) - Math.abs(activeLineNumber - ln2));
        for (const lineNumber of sortedLineNumbers) {
            const diagnosticsAtLine = groupedDiagnostics[lineNumber];
            for (const diagnostic of diagnosticsAtLine) {
                if (this.isSeverityEnabled(diagnostic.severity)) {
                    return diagnostic;
                }
            }
        }
    }
    /**
     * Get closest by severity diagnostic (error=>warning=>info=>hint)
     *
     * TODO: duplicates code in `statusBarMessage.ts`
     */
    getClosestBySeverityDiagnostic(editor) {
        const groupedDiagnostics = this.groupDiagnosticsByLine(vscode.languages.getDiagnostics(editor.document.uri));
        const lineNumberKeys = Object.keys(groupedDiagnostics);
        const activeLineNumber = editor.selection.active.line;
        const allDiagnosticsSorted = lineNumberKeys.map(key => groupedDiagnostics[key]).flat().sort((d1, d2) => {
            const severityScore = (d1.severity * 1e4) - (d2.severity * 1e4);
            return severityScore + (Math.abs(activeLineNumber - d1.range.start.line) - Math.abs(activeLineNumber - d2.range.start.line));
        });
        for (const diagnostic of allDiagnosticsSorted) {
            if (this.isSeverityEnabled(diagnostic.severity)) {
                return diagnostic;
            }
        }
    }
    /**
     * Is error visible to the user or scrolled out of the editor view?
     */
    isDiagnosticInViewport(editor, diagnostic) {
        for (const visibleRange of editor.visibleRanges) {
            if (visibleRange.intersection(diagnostic.range)) {
                return true;
            }
        }
        return false;
    }
    getClosestDiagnosticInViewport(editor) {
        const groupedDiagnostics = this.groupDiagnosticsByLine(vscode.languages.getDiagnostics(editor.document.uri));
        const activeLineNumber = editor.selection.active.line;
        for (const key in groupedDiagnostics) {
            const diagnostic = groupedDiagnostics[key][0];
            if (!this.isDiagnosticInViewport(editor, diagnostic)) {
                delete groupedDiagnostics[key];
            }
        }
        const diagnosticsInViewport = groupedDiagnostics;
        const sortedLineNumbers = Object.keys(diagnosticsInViewport).sort((ln1, ln2) => Math.abs(activeLineNumber - Number(ln1)) - Math.abs(activeLineNumber - Number(ln2)));
        for (const lineNumber of sortedLineNumbers) {
            const diagnosticsAtLine = groupedDiagnostics[lineNumber];
            for (const diagnostic of diagnosticsAtLine) {
                if (this.isSeverityEnabled(diagnostic.severity)) {
                    return diagnostic;
                }
            }
        }
    }
    /**
     * Tabs take 1 character in line but visually will be multiple characters (according to `editor.tabSize`).
     *
     * @returns How many characters the line visually looks (different from range.end when using tabs to indent).
     */
    getVisualLineLength(textLine, indentSize, indentStyle) {
        if (indentStyle === 'spaces') {
            return textLine.range.end.character;
        }
        else {
            /** `firstNonWhitespaceCharacterIndex` can include whitespaces, only tabs are needed to correctly get visual indent here */
            const onlyTabsIndent = textLine.text.slice(0, textLine.firstNonWhitespaceCharacterIndex).replace(/[^\t]/gu, '');
            const thisLineIndentSize = onlyTabsIndent.length;
            const textWithoutIndent = textLine.text.slice(thisLineIndentSize);
            return (onlyTabsIndent.length * indentSize) + textWithoutIndent.length;
        }
    }
    /**
     * Whether or not to align editor message text based on values of `errorLens.alignMessage` setting.
     */
    shouldAlign() {
        return Boolean(ErrorLens_js_1.$config.alignMessage.start || ErrorLens_js_1.$config.alignMessage.end);
    }
    shouldShowInlineMessage() {
        const extensionEnabled = ErrorLens_js_1.$config.messageEnabled;
        const respectUpstreamEnabled = ErrorLens_js_1.$config.respectUpstreamEnabled;
        if (!respectUpstreamEnabled.enabled || !respectUpstreamEnabled.inlineMessage) {
            return extensionEnabled;
        }
        return extensionEnabled && ErrorLens_js_1.$state.vscodeGlobalProblemsEnabled;
    }
    shouldShowGutterIcons() {
        const extensionEnabled = ErrorLens_js_1.$config.gutterIconsEnabled;
        const respectUpstreamEnabled = ErrorLens_js_1.$config.respectUpstreamEnabled;
        if (!respectUpstreamEnabled.enabled || !respectUpstreamEnabled.gutter) {
            return extensionEnabled;
        }
        return extensionEnabled && ErrorLens_js_1.$state.vscodeGlobalProblemsEnabled;
    }
    shouldShowStatusBarIcons() {
        const extensionEnabled = ErrorLens_js_1.$config.statusBarIconsEnabled;
        const respectUpstreamEnabled = ErrorLens_js_1.$config.respectUpstreamEnabled;
        if (!respectUpstreamEnabled.enabled || !respectUpstreamEnabled.statusBar) {
            return extensionEnabled;
        }
        return extensionEnabled && ErrorLens_js_1.$state.vscodeGlobalProblemsEnabled;
    }
    shouldShowStatusBarMessage() {
        const extensionEnabled = ErrorLens_js_1.$config.statusBarMessageEnabled;
        const respectUpstreamEnabled = ErrorLens_js_1.$config.respectUpstreamEnabled;
        if (!respectUpstreamEnabled.enabled || !respectUpstreamEnabled.statusBar) {
            return extensionEnabled;
        }
        return extensionEnabled && ErrorLens_js_1.$state.vscodeGlobalProblemsEnabled;
    }
}
exports.ELExtUtils = ELExtUtils;
