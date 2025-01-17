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
exports.ELCommands = void 0;
const vscode = __importStar(require("vscode"));
const lodash_1 = require("lodash");
const ELExtUtils_ac_js_1 = require("./ELExtUtils.ac.js");
const ELVSCodeUtils_ac_js_1 = require("./ELVSCodeUtils.ac.js");
const ErrorLens_js_1 = require("./ErrorLens.js");
// commands.ts
// commands/*
class ELCommands {
    codeLensOnClickCommand(diagnostic) {
        switch (ErrorLens_js_1.$config.codeLensOnClick) {
            case 'showProblemsView':
                vscode.commands.executeCommand("workbench.actions.view.problems" /* EELConstants.OpenProblemsViewCommandId */);
                break;
            case 'showQuickFix':
                ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.setCaretInEditor({
                    range: diagnostic.range,
                });
                vscode.commands.executeCommand("editor.action.quickFix" /* EELConstants.QuickFixCommandId */, diagnostic);
                break;
            case 'searchForProblem':
                ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.setCaretInEditor({
                    range: diagnostic.range,
                });
                vscode.commands.executeCommand("flawuldragon.errorLens.searchForProblem" /* EELCommandId.SearchForProblem */, diagnostic);
                break;
            case 'none':
            default:
                break;
        }
    }
    /**
     * Can be used from Command Palette (arg = undefined) or from hover (arg = {code: string | undefined})
     */
    copyProblemCodeCommand(arg) {
        if (arg) {
            if (typeof arg.code === 'string') {
                vscode.env.clipboard.writeText(arg.code);
            }
            return;
        }
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const diagnosticAtActiveLineNumber = ELExtUtils_ac_js_1.ELExtUtils.prototype.getDiagnosticAtLine(editor.document.uri, editor.selection.active.line);
        if (!diagnosticAtActiveLineNumber) {
            return;
        }
        const codeAsString = ELExtUtils_ac_js_1.ELExtUtils.prototype.getDiagnosticCode(diagnosticAtActiveLineNumber);
        if (!codeAsString) {
            return;
        }
        vscode.env.clipboard.writeText(codeAsString);
    }
    copyProblemMessageCommand(editor) {
        const groupedDiagnostics = ELExtUtils_ac_js_1.ELExtUtils.prototype.groupDiagnosticsByLine(vscode.languages.getDiagnostics(editor.document.uri));
        const activeLineNumber = editor.selection.active.line;
        const diagnosticAtActiveLineNumber = groupedDiagnostics[activeLineNumber];
        if (!diagnosticAtActiveLineNumber) {
            vscode.window.showInformationMessage('There\'s no problem at the active line.');
            return;
        }
        const renderedDiagnostic = diagnosticAtActiveLineNumber[0];
        const source = renderedDiagnostic.source ? `[${renderedDiagnostic.source}] ` : '';
        vscode.env.clipboard.writeText(source + renderedDiagnostic.message);
    }
    disableLineCommand(diagnostic) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let lineNumber;
        if (diagnostic) {
            // Passed diagnostic is not a real diagnostic - json stringified.
            lineNumber = diagnostic.range[0].line;
        }
        else {
            const diagnosticAtActiveLine = ELExtUtils_ac_js_1.ELExtUtils.prototype.getDiagnosticAtLine(editor.document.uri, editor.selection.active.line);
            if (!diagnosticAtActiveLine) {
                return;
            }
            // eslint-disable-next-line no-param-reassign
            diagnostic = diagnosticAtActiveLine;
            lineNumber = diagnostic.range.start.line;
        }
        if (!diagnostic.source) {
            vscode.window.showWarningMessage('Diagnostic has no "source".');
            return;
        }
        let template = ErrorLens_js_1.$config.disableLineComments[diagnostic.source];
        const isTheSameLine = template.includes('SAME_LINE');
        if (isTheSameLine) {
            template = template.replace(/\s?SAME_LINE\s?/u, '');
        }
        if (!template) {
            this.showNoCommentSpecifiedForSource(diagnostic.source);
            return;
        }
        let comment = ELExtUtils_ac_js_1.ELExtUtils.prototype.diagnosticToInlineMessage(template, diagnostic, 0);
        let position;
        if (isTheSameLine) {
            position = editor.document.validatePosition(new vscode.Position(lineNumber, Infinity));
        }
        else {
            // Line above
            if (lineNumber <= 1) {
                position = new vscode.Position(0, 0);
            }
            else {
                position = new vscode.Position(lineNumber, 0);
            }
            comment = `${ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.getIndentationAtLine(editor.document, lineNumber)}${comment}\n`;
        }
        editor.edit(builder => {
            builder.insert(position, comment);
        });
    }
    // associated with disableLineCommand
    async showNoCommentSpecifiedForSource(source) {
        const showSettingsButton = 'Show Settings';
        const pressedButton = await vscode.window.showInformationMessage(`Comment not specified for source "${source}"`, showSettingsButton);
        if (pressedButton === showSettingsButton) {
            ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.openSettingGuiAt(`@ext:${"usernamehw.errorlens" /* EELConstants.ExtensionId */} ${'disableLineComments'}`);
        }
    }
    async excludeProblemCommand(diagnostic) {
        const code = ELExtUtils_ac_js_1.ELExtUtils.prototype.getDiagnosticCode(diagnostic);
        const source = diagnostic.source;
        if (!source) {
            this.showExcludeByMessageNotification(`Diagnostic has no "source".`, diagnostic);
            return;
        }
        if (!code) {
            this.showExcludeByMessageNotification(`Diagnostic has no "code".`, diagnostic);
            return;
        }
        const sourceCodeString = ELExtUtils_ac_js_1.ELExtUtils.prototype.diagnosticToSourceCodeString(source, code);
        if (ErrorLens_js_1.$config.excludeBySource.includes(sourceCodeString)) {
            return;
        }
        await ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.updateGlobalSetting(`${"errorLens" /* EELConstants.SettingsPrefix */}.${'excludeBySource'}`, [
            ...ErrorLens_js_1.$config.excludeBySource,
            sourceCodeString,
        ]);
        this.showCompletionNotification(sourceCodeString);
    }
    // associated with excludeProblemCommand
    async showExcludeByMessageNotification(message, diagnostic) {
        const messageToExclude = (0, lodash_1.escapeRegExp)(await vscode.window.showInputBox({
            title: `${message}: Exclude by message:`,
            value: diagnostic.message,
        }));
        if (!messageToExclude) {
            return;
        }
        if (ErrorLens_js_1.$config.exclude.includes(messageToExclude)) {
            return;
        }
        await ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.updateGlobalSetting(`${"errorLens" /* EELConstants.SettingsPrefix */}.${'exclude'}`, [
            ...ErrorLens_js_1.$config.exclude,
            messageToExclude,
        ]);
        this.showCompletionByMessageNotification(messageToExclude);
    }
    // associated with excludeProblemCommand
    async showCompletionByMessageNotification(messageToExclude) {
        const openSettingsButton = 'Open Setting';
        const pressedButton = await vscode.window.showInformationMessage(`Excluded problem by message: "${messageToExclude}"`, openSettingsButton);
        if (pressedButton === openSettingsButton) {
            ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.openSettingGuiAt(`@ext:${"usernamehw.errorlens" /* EELConstants.ExtensionId */} ${"errorLens" /* EELConstants.SettingsPrefix */}.${'exclude'}`);
        }
    }
    // associated with excludeProblemCommand
    async showCompletionNotification(sourceCodeString) {
        const openSettingsButton = 'Open Setting';
        const pressedButton = await vscode.window.showInformationMessage(`Excluded problem by source+code: "${sourceCodeString}"`, openSettingsButton);
        if (pressedButton === openSettingsButton) {
            ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.openSettingGuiAt(`@ext:${"usernamehw.errorlens" /* EELConstants.ExtensionId */} ${'excludeBySource'}`);
        }
    }
    /**
     * Try to open a linter file where the lint rule is defined based on source + code of a Diagnostic,
     * for example: { source: 'eslint', code: 'padded-blocks' }.
     */
    async findLinterRuleDefinitionCommand(args) {
        let source = args?.source;
        let code = args?.code;
        if (!args) {
            const diagnostic = this.tryToFindDiagnosticFromActiveEditor();
            if (diagnostic) {
                code = ELExtUtils_ac_js_1.ELExtUtils.prototype.getDiagnosticCode(diagnostic);
                source = diagnostic.source;
            }
        }
        if (!source) {
            vscode.window.showWarningMessage(`Diagnostic has no "source".`);
            return;
        }
        if (!code) {
            vscode.window.showWarningMessage(`Diagnostic has no "code".`);
            return;
        }
        const lintFilesGlobs = ErrorLens_js_1.$config.lintFilePaths[source];
        if (lintFilesGlobs === 'none') {
            return;
        }
        if (!lintFilesGlobs) {
            this.showNotificationWithOpenSettingsButton(`No linter files specified for source: "${source}".`);
            return;
        }
        const resultPromises = [];
        for (const glob of lintFilesGlobs) {
            resultPromises.push(vscode.workspace.findFiles(glob, '**/node_modules/**', 10));
        }
        const linterFilePaths = (await Promise.all(resultPromises)).flat();
        if (!linterFilePaths.length) {
            this.showNotificationWithOpenSettingsButton(`No linter files found that match any of the globs: ${JSON.stringify(linterFilePaths)}.`);
            return;
        }
        const ruleMatchResults = [];
        for (const linterFilePath of linterFilePaths) {
            const fileContents = await ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.readFileVscode(linterFilePath.fsPath);
            if (fileContents.includes(code)) {
                ruleMatchResults.push({
                    fileContents,
                    linterFilePath,
                });
            }
        }
        if (!ruleMatchResults.length) {
            const message = `No linter file with "${code}" found.`;
            if (linterFilePaths.length === 1) {
                this.showNotificationWithGlobalSearchButton(message, code);
                const editor = await ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.openFileInVscode(linterFilePaths[0]);
                ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.revealLine(editor, 0);
            }
            else {
                const pickedFile = await vscode.window.showQuickPick(linterFilePaths.map(filePathUri => filePathUri.fsPath), {
                    title: message,
                });
                if (pickedFile) {
                    ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.openFileInVscode(pickedFile);
                }
            }
            return;
        }
        if (ruleMatchResults.length === 1) {
            const fileRuleMatch = ruleMatchResults[0];
            await this.openAndReveal(fileRuleMatch.linterFilePath.fsPath, fileRuleMatch.fileContents, code);
            return;
        }
        const pickedFile = await vscode.window.showQuickPick(ruleMatchResults.map(matchResult => ({
            label: matchResult.linterFilePath.fsPath,
            linterFilePath: matchResult.linterFilePath,
            fileContents: matchResult.fileContents,
        })), {
            title: `"${code}" is found in multiple files:`,
        });
        if (!pickedFile) {
            return;
        }
        this.openAndReveal(pickedFile.linterFilePath, pickedFile.fileContents, code);
    }
    // associated with findLinterRuleDefinitionCommand
    async showNotificationWithOpenSettingsButton(message) {
        const openLinterSetting = 'Open Setting';
        const pressedButton = await vscode.window.showWarningMessage(message, openLinterSetting);
        if (pressedButton === openLinterSetting) {
            ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.openSettingGuiAt(`@ext:${"usernamehw.errorlens" /* EELConstants.ExtensionId */} ${'lintFilePaths'}`);
        }
    }
    // associated with findLinterRuleDefinitionCommand
    async showNotificationWithGlobalSearchButton(message, code) {
        const runGlobalSearchButton = 'Search';
        const openLinterSetting = 'Open Setting';
        const pressedButton = await vscode.window.showWarningMessage(message, openLinterSetting, runGlobalSearchButton);
        if (pressedButton === openLinterSetting) {
            ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.openSettingGuiAt(`@ext:${"usernamehw.errorlens" /* EELConstants.ExtensionId */} ${'lintFilePaths'}`);
        }
        else if (pressedButton === runGlobalSearchButton) {
            vscode.commands.executeCommand('workbench.action.findInFiles', {
                query: code,
                isRegex: false,
                triggerSearch: true,
                excludeSettingAndIgnoreFiles: true,
            });
        }
    }
    // associated with findLinterRuleDefinitionCommand
    async openAndReveal(pathOrUri, contents, needle) {
        const textEditor = await ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.openFileInVscode(pathOrUri);
        const lineNumber = this.getLineNumberForMatch(contents, needle);
        if (lineNumber) {
            ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.revealLine(textEditor, lineNumber);
        }
    }
    // associated with findLinterRuleDefinitionCommand
    getLineNumberForMatch(text, needle) {
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(needle)) {
                return i;
            }
        }
    }
    // associated with findLinterRuleDefinitionCommand
    /**
     * Command was called from Command Palette or keybinding.
     * This function needs to find diagnostic with the highest priority at
     * the line where the cursor is.
     */
    tryToFindDiagnosticFromActiveEditor() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const activeLineNumber = editor.selection.active.line;
        const diagnosticsForUri = vscode.languages.getDiagnostics(editor.document.uri);
        const groupedDiagnostics = ELExtUtils_ac_js_1.ELExtUtils.prototype.groupDiagnosticsByLine(diagnosticsForUri);
        return groupedDiagnostics[activeLineNumber]?.[0];
    }
    async revealLineCommand(fsPath, [line, char]) {
        const range = new vscode.Range(line, char, line, char);
        const document = await vscode.workspace.openTextDocument(fsPath);
        const editor = await vscode.window.showTextDocument(document);
        editor.revealRange(range);
        editor.selection = new vscode.Selection(range.start.line, range.start.character, range.start.line, range.start.character);
    }
    /**
     * When arg = undefined => it was called from Command Palette.
     */
    searchForProblemCommand(diagnostic) {
        if (!diagnostic) {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }
            const diagnosticAtActiveLine = ELExtUtils_ac_js_1.ELExtUtils.prototype.getDiagnosticAtLine(editor.document.uri, editor.selection.active.line);
            if (!diagnosticAtActiveLine) {
                return;
            }
            // eslint-disable-next-line no-param-reassign
            diagnostic = diagnosticAtActiveLine;
        }
        const query = ELExtUtils_ac_js_1.ELExtUtils.prototype.diagnosticToInlineMessage(ErrorLens_js_1.$config.searchForProblemQuery, diagnostic, 0);
        vscode.env.openExternal(vscode.Uri.parse(query));
    }
    /**
     * Can be used from Command Palette (arg = undefined) or from hover (arg = {code: string | undefined})
     */
    selectProblemCommand(editor) {
        let diagnostic;
        if (ErrorLens_js_1.$config.selectProblemType === 'closestProblem') {
            diagnostic = ELExtUtils_ac_js_1.ELExtUtils.prototype.getClosestDiagnostic(editor);
        }
        else if (ErrorLens_js_1.$config.selectProblemType === 'closestSeverity') {
            diagnostic = ELExtUtils_ac_js_1.ELExtUtils.prototype.getClosestBySeverityDiagnostic(editor);
        }
        else if (ErrorLens_js_1.$config.selectProblemType === 'activeLine') {
            diagnostic = ELExtUtils_ac_js_1.ELExtUtils.prototype.getDiagnosticAtLine(editor.document.uri, editor.selection.active.line);
        }
        if (!diagnostic) {
            return;
        }
        editor.selection = new vscode.Selection(diagnostic.range.start, diagnostic.range.end);
        editor.revealRange(diagnostic.range);
    }
    async statusBarCommand(editor) {
        if (ErrorLens_js_1.$config.statusBarCommand === 'goToLine' || ErrorLens_js_1.$config.statusBarCommand === 'goToProblem') {
            const range = new vscode.Range(ErrorLens_js_1.$state.statusBarMessage.activeMessagePosition, ErrorLens_js_1.$state.statusBarMessage.activeMessagePosition);
            editor.selection = new vscode.Selection(range.start, range.end);
            editor.revealRange(range, vscode.TextEditorRevealType.Default);
            await vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup" /* EELConstants.FocusActiveEditorCommandId */);
            if (ErrorLens_js_1.$config.statusBarCommand === 'goToProblem') {
                vscode.commands.executeCommand("editor.action.marker.next" /* EELConstants.NextProblemCommandId */);
            }
        }
        else if (ErrorLens_js_1.$config.statusBarCommand === 'copyMessage') {
            const source = ErrorLens_js_1.$state.statusBarMessage.activeMessageSource ? `[${ErrorLens_js_1.$state.statusBarMessage.activeMessageSource}] ` : '';
            vscode.env.clipboard.writeText(source + ErrorLens_js_1.$state.statusBarMessage.activeMessageText);
        }
    }
    /**
     * Update global setting `errorLens.enabledDiagnosticLevels`.
     * Either add a diagnostic severity or remove it.
     */
    async toggleEnabledLevels(severity, arrayValue) {
        const oldValueIndex = arrayValue.indexOf(severity);
        if (oldValueIndex === -1) {
            arrayValue.push(severity);
        }
        else {
            arrayValue.splice(oldValueIndex, 1);
        }
        await ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.updateGlobalSetting('errorLens.enabledDiagnosticLevels', arrayValue);
    }
    async toggleWorkspaceCommand() {
        const activeTextEditor = vscode.window.activeTextEditor;
        let workspaceFsPath;
        if (activeTextEditor) {
            workspaceFsPath = vscode.workspace.getWorkspaceFolder(activeTextEditor?.document?.uri)?.uri.fsPath;
            if (!workspaceFsPath) {
                vscode.window.showWarningMessage(`Counldn't find workspace folder for "${activeTextEditor.document.uri.toString()}".`);
            }
        }
        else {
            workspaceFsPath = await this.tryToGuessWorkspaceFolder();
            if (!workspaceFsPath) {
                vscode.window.showWarningMessage(`No opened/picked workspace folder.`);
            }
        }
        if (!workspaceFsPath) {
            return;
        }
        let newExcludeWorkspaceList;
        if (ErrorLens_js_1.$config.excludeWorkspaces?.includes(workspaceFsPath)) {
            newExcludeWorkspaceList = ErrorLens_js_1.$config.excludeWorkspaces.filter(workspacePath => workspacePath !== workspaceFsPath);
            this.showResultNotification(`"${workspaceFsPath}" - Removed from "errorLens.excludeWorkspaces"`);
        }
        else {
            newExcludeWorkspaceList = [...(ErrorLens_js_1.$config.excludeWorkspaces || []), workspaceFsPath];
            this.showResultNotification(`"${workspaceFsPath}" - Added to "errorLens.excludeWorkspaces" (now ignored)`);
        }
        ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.updateGlobalSetting('errorLens.excludeWorkspaces', newExcludeWorkspaceList);
    }
    // associated with toggleWorkspaceCommand
    async showResultNotification(message) {
        const buttonToOpenSettings = 'Open Settings UI';
        const pressedButton = await vscode.window.showInformationMessage(message, buttonToOpenSettings);
        if (!pressedButton) {
            return;
        }
        ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.openSettingGuiAt(`@ext:${"usernamehw.errorlens" /* EELConstants.ExtensionId */} ${'excludeWorkspaces'}`);
    }
    // associated with toggleWorkspaceCommand
    async tryToGuessWorkspaceFolder() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders?.length) {
            return;
        }
        if (workspaceFolders.length === 1) {
            return workspaceFolders[0].uri.fsPath;
        }
        const pickedFsPath = await vscode.window.showQuickPick(workspaceFolders.map(workspaceFolder => workspaceFolder.uri.fsPath), {
            title: 'Pick workspace folder to include/exclude:',
        });
        return pickedFsPath;
    }
    /**
     * Register all commands contributed by this extension.
     */
    registerAllCommands(context) {
        // ────────────────────────────────────────────────────────────
        // ──── Global commands ───────────────────────────────────────
        // ────────────────────────────────────────────────────────────
        context.subscriptions.push(vscode.commands.registerCommand("flawuldragon.errorLens.toggle" /* EELCommandId.Toggle */, () => {
            ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.updateGlobalSetting('errorLens.enabled', !ErrorLens_js_1.$config.enabled);
        }));
        context.subscriptions.push(vscode.commands.registerCommand("flawuldragon.errorLens.toggleError" /* EELCommandId.ToggleError */, () => {
            this.toggleEnabledLevels('error', ErrorLens_js_1.$config.enabledDiagnosticLevels);
        }));
        context.subscriptions.push(vscode.commands.registerCommand("flawuldragon.errorLens.toggleWarning" /* EELCommandId.ToggleWarning */, () => {
            this.toggleEnabledLevels('warning', ErrorLens_js_1.$config.enabledDiagnosticLevels);
        }));
        context.subscriptions.push(vscode.commands.registerCommand("flawuldragon.errorLens.toggleInfo" /* EELCommandId.ToggleInfo */, () => {
            this.toggleEnabledLevels('info', ErrorLens_js_1.$config.enabledDiagnosticLevels);
        }));
        context.subscriptions.push(vscode.commands.registerCommand("flawuldragon.errorLens.toggleHint" /* EELCommandId.ToggleHint */, () => {
            this.toggleEnabledLevels('hint', ErrorLens_js_1.$config.enabledDiagnosticLevels);
        }));
        context.subscriptions.push(vscode.commands.registerCommand("flawuldragon.errorLens.toggleInlineMessage" /* EELCommandId.ToggleInlineMessage */, () => {
            ELVSCodeUtils_ac_js_1.ELVSCodeUtils.prototype.toggleGlobalBooleanSetting('errorLens.messageEnabled');
        }));
        context.subscriptions.push(vscode.commands.registerCommand("flawuldragon.errorLens.toggleWorkspace" /* EELCommandId.ToggleWorkspace */, this.toggleWorkspaceCommand));
        context.subscriptions.push(vscode.commands.registerCommand("flawuldragon.errorLens.findLinterRuleDefinition" /* EELCommandId.FindLinterRuleDefinition */, this.findLinterRuleDefinitionCommand));
        context.subscriptions.push(vscode.commands.registerCommand("flawuldragon.errorLens.copyProblemCode" /* EELCommandId.CopyProblemCode */, this.copyProblemCodeCommand));
        context.subscriptions.push(vscode.commands.registerCommand("flawuldragon.errorLens.searchForProblem" /* EELCommandId.SearchForProblem */, this.searchForProblemCommand));
        context.subscriptions.push(vscode.commands.registerCommand("flawuldragon.errorLens.disableLine" /* EELCommandId.DisableLine */, this.disableLineCommand));
        // ────────────────────────────────────────────────────────────
        // ──── Text Editor commands ──────────────────────────────────
        // ────────────────────────────────────────────────────────────
        context.subscriptions.push(vscode.commands.registerTextEditorCommand("flawuldragon.errorLens.selectProblem" /* EELCommandId.SelectProblem */, this.selectProblemCommand));
        context.subscriptions.push(vscode.commands.registerTextEditorCommand("flawuldragon.errorLens.copyProblemMessage" /* EELCommandId.CopyProblemMessage */, this.copyProblemMessageCommand));
        // ────────────────────────────────────────────────────────────
        // ──── Internal commands ─────────────────────────────────────
        // ────────────────────────────────────────────────────────────
        context.subscriptions.push(vscode.commands.registerCommand("flawuldragon.errorLens.codeLensOnClick" /* EELCommandId.CodeLensOnClick */, this.codeLensOnClickCommand));
        context.subscriptions.push(vscode.commands.registerCommand("flawuldragon.errorLens.revealLine" /* EELCommandId.RevealLine */, this.revealLineCommand));
        context.subscriptions.push(vscode.commands.registerCommand("flawuldragon.errorLens.excludeProblem" /* EELCommandId.ExcludeProblem */, this.excludeProblemCommand));
        context.subscriptions.push(vscode.commands.registerTextEditorCommand("flawuldragon.errorLens.statusBarCommand" /* EELCommandId.StatusBarCommand */, this.statusBarCommand));
    }
}
exports.ELCommands = ELCommands;
