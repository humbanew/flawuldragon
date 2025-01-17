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
exports.ELVSCodeUtils = void 0;
const vscode = __importStar(require("vscode"));
const ELUtils_ac_js_1 = require("./ELUtils.ac.js");
// utils/vscodeUtils.ts
class ELVSCodeUtils {
    /**
     * Update global settings.json file with the new setting value.
     */
    async updateGlobalSetting(settingId, newValue) {
        const vscodeConfig = vscode.workspace.getConfiguration();
        await vscodeConfig.update(settingId, newValue, vscode.ConfigurationTarget.Global);
    }
    /**
     * Update global settings.json file with the toggled boolean setting.
     */
    async toggleGlobalBooleanSetting(settingId) {
        const vscodeConfig = vscode.workspace.getConfiguration();
        const settingValue = vscodeConfig.get(settingId);
        if (settingValue === undefined) {
            return;
        }
        await this.updateGlobalSetting(settingId, !settingValue);
    }
    /**
     * Transform string svg to {@link Uri}
     */
    svgToUri(svg) {
        return vscode.Uri.parse(`data:image/svg+xml;utf8,${svg}`);
    }
    /**
     * Open vscode Settings GUI with input value set to the specified value.
     */
    async openSettingGuiAt(settingName) {
        await vscode.commands.executeCommand('workbench.action.openSettings', settingName);
    }
    /**
     * Create [Command URI](https://code.visualstudio.com/api/extension-guides/command#command-uris).
     */
    createCommandUri(commandId, args) {
        const commandArg = args ? `?${encodeURIComponent(JSON.stringify(args))}` : '';
        return vscode.Uri.parse(`command:${commandId}${commandArg}`);
    }
    revealLine(editor, lineNumber) {
        const range = new vscode.Range(lineNumber, 0, lineNumber, 0);
        editor.selection = new vscode.Selection(range.start, range.end);
        editor.revealRange(range, vscode.TextEditorRevealType.AtTop);
        // Highlight for a short time revealed range
        const lineHighlightDecorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: '#ffa30468',
            isWholeLine: true,
        });
        editor.setDecorations(lineHighlightDecorationType, [range]);
        setTimeout(() => {
            editor.setDecorations(lineHighlightDecorationType, []);
            lineHighlightDecorationType?.dispose();
        }, 700);
    }
    /**
     * Create a styled span to use in MarkdownString.
     *
     * `editorError.foreground` => `--vscode-editorError-foreground`
     */
    createStyledMarkdown({ strMd = '', backgroundColor = 'var(--vscode-editorHoverWidget-background)', color = 'var(--vscode-editorHoverWidget-foreground)', }) {
        const colorStyle = color ? `color:${color};` : '';
        const backgroundStyle = backgroundColor ? `background-color:${backgroundColor};` : '';
        return `<span style="${colorStyle}${backgroundStyle}">${strMd}</span>`;
    }
    createButtonLinkMarkdown({ text, href, title = '', }) {
        const buttonText = this.createStyledMarkdown({
            strMd: ELUtils_ac_js_1.ELUtils.prototype.surround(text, "&nbsp;" /* EELConstants.NonBreakingSpaceSymbolHtml */),
            backgroundColor: 'var(--vscode-button-background)',
            color: 'var(--vscode-button-foreground)',
        });
        return `<a title="${title}" href="${href}">${buttonText}</a>`;
    }
    createProblemIconMarkdown(kind) {
        const colorClass = kind === 'error' ?
            'var(--vscode-editorError-foreground)' :
            kind === 'warning' ? 'var(--vscode-editorWarning-foreground)' : 'var(--vscode-editorInfo-foreground)';
        return this.createStyledMarkdown({
            strMd: `$(${kind})`,
            color: colorClass,
        });
    }
    async readFileVscode(pathOrUri) {
        try {
            const uri = typeof pathOrUri === 'string' ? vscode.Uri.file(pathOrUri) : pathOrUri;
            const file = await vscode.workspace.fs.readFile(uri);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            return new TextDecoder().decode(file);
        }
        catch (e) {
            vscode.window.showErrorMessage(e.message);
            return '';
        }
    }
    async openFileInVscode(pathOrUri) {
        let document;
        if (typeof pathOrUri === 'string') {
            document = await vscode.workspace.openTextDocument(pathOrUri);
        }
        else {
            document = await vscode.workspace.openTextDocument(pathOrUri);
        }
        return vscode.window.showTextDocument(document);
    }
    getIndentationAtLine(document, lineNumber) {
        const textLine = document.lineAt(lineNumber);
        return textLine.text.slice(0, textLine.firstNonWhitespaceCharacterIndex);
    }
    setCaretInEditor({ editor, range }) {
        if (!editor) {
            editor = vscode.window.activeTextEditor;
        }
        if (editor) {
            editor.selection = new vscode.Selection(range.start, range.end);
            editor.revealRange(range);
        }
    }
}
exports.ELVSCodeUtils = ELVSCodeUtils;
