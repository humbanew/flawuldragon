import * as vscode from 'vscode';
import { escapeRegExp } from 'lodash';
import { TELExtensionConfig, IELRuleDefinitionArgs } from './declares';
import { ELExtUtils } from './ELExtUtils.ac.cjs';
import { ELVSCodeUtils } from './ELVSCodeUtils.ac.cjs';
import { EELConstants, EELCommandId } from './enums.js';
import { $config, $state } from './ErrorLens.cjs';

// commands.ts
// commands/*
export class ELCommands {
  protected extUtils = new ELExtUtils;
  protected vscodeUtils = new ELVSCodeUtils;

  public codeLensOnClickCommand(diagnostic: vscode.Diagnostic): void {
    switch ($config.codeLensOnClick) {
      case 'showProblemsView':
        vscode.commands.executeCommand(EELConstants.OpenProblemsViewCommandId);
        break;
      case 'showQuickFix':
        this.vscodeUtils.setCaretInEditor({
          range: diagnostic.range,
        });
        vscode.commands.executeCommand(EELConstants.QuickFixCommandId, diagnostic);
        break;
      case 'searchForProblem':
        this.vscodeUtils.setCaretInEditor({
          range: diagnostic.range,
        });
        vscode.commands.executeCommand(EELCommandId.SearchForProblem, diagnostic);
        break;
      case 'none':
      default:
        break;
    }
  }

  /**
   * Can be used from Command Palette (arg = undefined) or from hover (arg = {code: string | undefined})
   */
  public copyProblemCodeCommand(arg: { code: string | undefined } | undefined): void {
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

    const diagnosticAtActiveLineNumber = this.extUtils.getDiagnosticAtLine(editor.document.uri, editor.selection.active.line);

    if (!diagnosticAtActiveLineNumber) {
      return;
    }

    const codeAsString = this.extUtils.getDiagnosticCode(diagnosticAtActiveLineNumber);
    if (!codeAsString) {
      return;
    }

    vscode.env.clipboard.writeText(codeAsString);
  }

  public copyProblemMessageCommand(editor: vscode.TextEditor): void {
    const groupedDiagnostics = this.extUtils.groupDiagnosticsByLine(vscode.languages.getDiagnostics(editor.document.uri));
  
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

  public disableLineCommand(diagnostic: vscode.Diagnostic | undefined): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    let lineNumber: number;

    if (diagnostic) {
      // Passed diagnostic is not a real diagnostic - json stringified.
      lineNumber = (diagnostic.range as unknown as { character: number; line: number }[])[0].line;
    } else {
      const diagnosticAtActiveLine = this.extUtils.getDiagnosticAtLine(editor.document.uri, editor.selection.active.line);
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

    let template = $config.disableLineComments[diagnostic.source];
    const isTheSameLine = template.includes('SAME_LINE');

    if (isTheSameLine) {
      template = template.replace(/\s?SAME_LINE\s?/u, '');
    }

    if (!template) {
      this.showNoCommentSpecifiedForSource(diagnostic.source);
      return;
    }

    let comment = this.extUtils.diagnosticToInlineMessage(template, diagnostic, 0);

    let position: vscode.Position;

    if (isTheSameLine) {
      position = editor.document.validatePosition(new vscode.Position(lineNumber, Infinity));
    } else {
      // Line above
      if (lineNumber <= 1) {
        position = new vscode.Position(0, 0);
      } else {
        position = new vscode.Position(lineNumber, 0);
      }
      comment = `${this.vscodeUtils.getIndentationAtLine(editor.document, lineNumber)}${comment}\n`;
    }

    editor.edit(builder => {
      builder.insert(position, comment);
    });
  }

  // associated with disableLineCommand
  protected async showNoCommentSpecifiedForSource(source: string): Promise<void> {
    const showSettingsButton = 'Show Settings';
    const pressedButton = await vscode.window.showInformationMessage(`Comment not specified for source "${source}"`, showSettingsButton);
    if (pressedButton === showSettingsButton) {
      this.vscodeUtils.openSettingGuiAt(`@ext:${EELConstants.ExtensionId} ${'disableLineComments' satisfies keyof TELExtensionConfig}`);
    }
  }

  public async excludeProblemCommand(diagnostic: vscode.Diagnostic): Promise<void> {
    const code = this.extUtils.getDiagnosticCode(diagnostic);
    const source = diagnostic.source;
    if (!source) {
      this.showExcludeByMessageNotification(`Diagnostic has no "source".`, diagnostic);
      return;
    }
    if (!code) {
      this.showExcludeByMessageNotification(`Diagnostic has no "code".`, diagnostic);
      return;
    }

    const sourceCodeString = this.extUtils.diagnosticToSourceCodeString(source, code);

    if ($config.excludeBySource.includes(sourceCodeString)) {
      return;
    }

    await this.vscodeUtils.updateGlobalSetting(`${EELConstants.SettingsPrefix}.${'excludeBySource' satisfies keyof TELExtensionConfig}`, [
      ...$config.excludeBySource,
      sourceCodeString,
    ]);

    this.showCompletionNotification(sourceCodeString);
  }

  // associated with excludeProblemCommand
  protected async showExcludeByMessageNotification(message: string, diagnostic: vscode.Diagnostic): Promise<void> {
    const messageToExclude = escapeRegExp(await vscode.window.showInputBox({
      title: `${message}: Exclude by message:`,
      value: diagnostic.message,
    }));
    if (!messageToExclude) {
      return;
    }
    if ($config.exclude.includes(messageToExclude)) {
      return;
    }
    await this.vscodeUtils.updateGlobalSetting(`${EELConstants.SettingsPrefix}.${'exclude' satisfies keyof TELExtensionConfig}`, [
      ...$config.exclude,
      messageToExclude,
    ]);

    this.showCompletionByMessageNotification(messageToExclude);
  }

  // associated with excludeProblemCommand
  protected async showCompletionByMessageNotification(messageToExclude: string): Promise<void> {
    const openSettingsButton = 'Open Setting';
    const pressedButton = await vscode.window.showInformationMessage(`Excluded problem by message: "${messageToExclude}"`, openSettingsButton);

    if (pressedButton === openSettingsButton) {
      this.vscodeUtils.openSettingGuiAt(`@ext:${EELConstants.ExtensionId} ${EELConstants.SettingsPrefix}.${'exclude' satisfies keyof TELExtensionConfig}`);
    }
  }

  // associated with excludeProblemCommand
  protected async showCompletionNotification(sourceCodeString: string): Promise<void> {
    const openSettingsButton = 'Open Setting';
    const pressedButton = await vscode.window.showInformationMessage(`Excluded problem by source+code: "${sourceCodeString}"`, openSettingsButton);

    if (pressedButton === openSettingsButton) {
      this.vscodeUtils.openSettingGuiAt(`@ext:${EELConstants.ExtensionId} ${'excludeBySource' satisfies keyof TELExtensionConfig}`);
    }
  }

  /**
   * Try to open a linter file where the lint rule is defined based on source + code of a Diagnostic,
   * for example: { source: 'eslint', code: 'padded-blocks' }.
   */
  public async findLinterRuleDefinitionCommand(args?: IELRuleDefinitionArgs): Promise<void> {
    let source = args?.source;
    let code = args?.code;

    if (!args) {
      const diagnostic = this.tryToFindDiagnosticFromActiveEditor();
      if (diagnostic) {
        code = this.extUtils.getDiagnosticCode(diagnostic);
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

    const lintFilesGlobs = $config.lintFilePaths[source];

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

    interface MatchResult {
      fileContents: string;
      linterFilePath: vscode.Uri;
    }

    const ruleMatchResults: MatchResult [] = [];
    for (const linterFilePath of linterFilePaths) {
      const fileContents = await this.vscodeUtils.readFileVscode(linterFilePath.fsPath);
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
        const editor = await this.vscodeUtils.openFileInVscode(linterFilePaths[0]);
        this.vscodeUtils.revealLine(editor, 0);
      } else {
        const pickedFile = await vscode.window.showQuickPick(linterFilePaths.map(filePathUri => filePathUri.fsPath), {
          title: message,
        });
        if (pickedFile) {
          this.vscodeUtils.openFileInVscode(pickedFile);
        }
      }
      return;
    }

    if (ruleMatchResults.length === 1) {
      const fileRuleMatch = ruleMatchResults[0];
      await this.openAndReveal(fileRuleMatch.linterFilePath.fsPath, fileRuleMatch.fileContents, code);
      return;
    }

    const pickedFile = await vscode.window.showQuickPick<MatchResult & vscode.QuickPickItem>(ruleMatchResults.map(matchResult => ({
      label: matchResult.linterFilePath.fsPath,
      linterFilePath: matchResult.linterFilePath,
      fileContents: matchResult.fileContents,
    } satisfies MatchResult & vscode.QuickPickItem)), {
      title: `"${code}" is found in multiple files:`,
    });

    if (!pickedFile) {
      return;
    }

    this.openAndReveal(pickedFile.linterFilePath, pickedFile.fileContents, code);
  }

  // associated with findLinterRuleDefinitionCommand
  protected async showNotificationWithOpenSettingsButton(message: string): Promise<void> {
    const openLinterSetting = 'Open Setting';
    const pressedButton = await vscode.window.showWarningMessage(message, openLinterSetting);
    if (pressedButton === openLinterSetting) {
      this.vscodeUtils.openSettingGuiAt(`@ext:${EELConstants.ExtensionId} ${'lintFilePaths' satisfies keyof TELExtensionConfig}`);
    }
  }

  // associated with findLinterRuleDefinitionCommand
  protected async showNotificationWithGlobalSearchButton(message: string, code: string): Promise<void> {
    const runGlobalSearchButton = 'Search';
    const openLinterSetting = 'Open Setting';

    const pressedButton = await vscode.window.showWarningMessage(message, openLinterSetting, runGlobalSearchButton);

    if (pressedButton === openLinterSetting) {
      this.vscodeUtils.openSettingGuiAt(`@ext:${EELConstants.ExtensionId} ${'lintFilePaths' satisfies keyof TELExtensionConfig}`);
    } else if (pressedButton === runGlobalSearchButton) {
      vscode.commands.executeCommand('workbench.action.findInFiles', {
        query: code,
        isRegex: false,
        triggerSearch: true,
        excludeSettingAndIgnoreFiles: true,
      });
    }
  }

  // associated with findLinterRuleDefinitionCommand
  protected async openAndReveal(pathOrUri: vscode.Uri | string, contents: string, needle: string): Promise<void> {
    const textEditor = await this.vscodeUtils.openFileInVscode(pathOrUri);
    const lineNumber = this.getLineNumberForMatch(contents, needle);
    if (lineNumber) {
      this.vscodeUtils.revealLine(textEditor, lineNumber);
    }
  }

  // associated with findLinterRuleDefinitionCommand
  protected getLineNumberForMatch(text: string, needle: string): number | undefined {
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
  protected tryToFindDiagnosticFromActiveEditor(): vscode.Diagnostic | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const activeLineNumber = editor.selection.active.line;
    const diagnosticsForUri = vscode.languages.getDiagnostics(editor.document.uri);
    const groupedDiagnostics = this.extUtils.groupDiagnosticsByLine(diagnosticsForUri);

    return groupedDiagnostics[activeLineNumber]?.[0];
  }

  public async revealLineCommand(fsPath: string, [line, char]: [number, number]): Promise<void> {
    const range = new vscode.Range(line, char, line, char);
    const document = await vscode.workspace.openTextDocument(fsPath);
    const editor = await vscode.window.showTextDocument(document);
    editor.revealRange(range);
    editor.selection = new vscode.Selection(range.start.line, range.start.character, range.start.line, range.start.character);
  }

  /**
   * When arg = undefined => it was called from Command Palette.
   */
  public searchForProblemCommand(diagnostic: vscode.Diagnostic | undefined): void {
    if (!diagnostic) {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const diagnosticAtActiveLine = this.extUtils.getDiagnosticAtLine(editor.document.uri, editor.selection.active.line);
      if (!diagnosticAtActiveLine) {
        return;
      }
      // eslint-disable-next-line no-param-reassign
      diagnostic = diagnosticAtActiveLine;
    }

    const query = this.extUtils.diagnosticToInlineMessage($config.searchForProblemQuery, diagnostic, 0);
    vscode.env.openExternal(vscode.Uri.parse(query));
  }

  /**
   * Can be used from Command Palette (arg = undefined) or from hover (arg = {code: string | undefined})
   */
  public selectProblemCommand(editor: vscode.TextEditor): void {
    let diagnostic: vscode.Diagnostic | undefined;
    if ($config.selectProblemType === 'closestProblem') {
      diagnostic = this.extUtils.getClosestDiagnostic(editor);
    } else if ($config.selectProblemType === 'closestSeverity') {
      diagnostic = this.extUtils.getClosestBySeverityDiagnostic(editor);
    } else if ($config.selectProblemType === 'activeLine') {
      diagnostic = this.extUtils.getDiagnosticAtLine(editor.document.uri, editor.selection.active.line);
    }

    if (!diagnostic) {
      return;
    }

    editor.selection = new vscode.Selection(diagnostic.range.start, diagnostic.range.end);
    editor.revealRange(diagnostic.range);
  }

  public async statusBarCommand(editor: vscode.TextEditor): Promise<void> {
    if ($config.statusBarCommand === 'goToLine' || $config.statusBarCommand === 'goToProblem') {
      const range = new vscode.Range($state.statusBarMessage.activeMessagePosition, $state.statusBarMessage.activeMessagePosition);
      editor.selection = new vscode.Selection(range.start, range.end);
      editor.revealRange(range, vscode.TextEditorRevealType.Default);
      await vscode.commands.executeCommand(EELConstants.FocusActiveEditorCommandId);
  
      if ($config.statusBarCommand === 'goToProblem') {
        vscode.commands.executeCommand(EELConstants.NextProblemCommandId);
      }
    } else if ($config.statusBarCommand === 'copyMessage') {
      const source = $state.statusBarMessage.activeMessageSource ? `[${$state.statusBarMessage.activeMessageSource}] ` : '';
      vscode.env.clipboard.writeText(source + $state.statusBarMessage.activeMessageText);
    }
  }

  /**
   * Update global setting `errorLens.enabledDiagnosticLevels`.
   * Either add a diagnostic severity or remove it.
   */
  public async toggleEnabledLevels(
    severity: TELExtensionConfig['enabledDiagnosticLevels'][number],
    arrayValue: TELExtensionConfig['enabledDiagnosticLevels'],
  ): Promise<void> {
    const oldValueIndex = arrayValue.indexOf(severity);
    if (oldValueIndex === -1) {
      arrayValue.push(severity);
    } else {
      arrayValue.splice(oldValueIndex, 1);
    }
  
    await this.vscodeUtils.updateGlobalSetting('errorLens.enabledDiagnosticLevels', arrayValue);
  }

  public async toggleWorkspaceCommand(): Promise<void> {
    const activeTextEditor = vscode.window.activeTextEditor;

    let workspaceFsPath: string | undefined;
    if (activeTextEditor) {
      workspaceFsPath = vscode.workspace.getWorkspaceFolder(activeTextEditor?.document?.uri)?.uri.fsPath;
      if (!workspaceFsPath) {
        vscode.window.showWarningMessage(`Counldn't find workspace folder for "${activeTextEditor.document.uri.toString()}".`);
      }
    } else {
      workspaceFsPath = await this.tryToGuessWorkspaceFolder();
      if (!workspaceFsPath) {
        vscode.window.showWarningMessage(`No opened/picked workspace folder.`);
      }
    }
    if (!workspaceFsPath) {
      return;
    }

    let newExcludeWorkspaceList: string[];
    if ($config.excludeWorkspaces?.includes(workspaceFsPath)) {
      newExcludeWorkspaceList = $config.excludeWorkspaces.filter(workspacePath => workspacePath !== workspaceFsPath);
      this.showResultNotification(`"${workspaceFsPath}" - Removed from "errorLens.excludeWorkspaces"`);
    } else {
      newExcludeWorkspaceList = [...($config.excludeWorkspaces || []), workspaceFsPath];
      this.showResultNotification(`"${workspaceFsPath}" - Added to "errorLens.excludeWorkspaces" (now ignored)`);
    }

    this.vscodeUtils.updateGlobalSetting('errorLens.excludeWorkspaces', newExcludeWorkspaceList);
  }

  // associated with toggleWorkspaceCommand
  protected async showResultNotification(message: string): Promise<void> {
    const buttonToOpenSettings = 'Open Settings UI';
    const pressedButton = await vscode.window.showInformationMessage(message, buttonToOpenSettings);
    if (!pressedButton) {
      return;
    }

    this.vscodeUtils.openSettingGuiAt(`@ext:${EELConstants.ExtensionId} ${'excludeWorkspaces' satisfies keyof TELExtensionConfig}`);
  }

  // associated with toggleWorkspaceCommand
  protected async tryToGuessWorkspaceFolder(): Promise<string | undefined> {
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
  public registerAllCommands(context: vscode.ExtensionContext): void {
    // ────────────────────────────────────────────────────────────
    // ──── Global commands ───────────────────────────────────────
    // ────────────────────────────────────────────────────────────
    context.subscriptions.push(vscode.commands.registerCommand(EELCommandId.Toggle, () => {
      this.vscodeUtils.updateGlobalSetting('errorLens.enabled', !$config.enabled);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(EELCommandId.ToggleError, () => {
      this.toggleEnabledLevels('error', $config.enabledDiagnosticLevels);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(EELCommandId.ToggleWarning, () => {
      this.toggleEnabledLevels('warning', $config.enabledDiagnosticLevels);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(EELCommandId.ToggleInfo, () => {
      this.toggleEnabledLevels('info', $config.enabledDiagnosticLevels);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(EELCommandId.ToggleHint, () => {
      this.toggleEnabledLevels('hint', $config.enabledDiagnosticLevels);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(EELCommandId.ToggleInlineMessage, () => {
      ELVSCodeUtils.prototype.toggleGlobalBooleanSetting('errorLens.messageEnabled');
    }));
    context.subscriptions.push(vscode.commands.registerCommand(EELCommandId.ToggleWorkspace, this.toggleWorkspaceCommand));
    context.subscriptions.push(vscode.commands.registerCommand(EELCommandId.FindLinterRuleDefinition, this.findLinterRuleDefinitionCommand));
    context.subscriptions.push(vscode.commands.registerCommand(EELCommandId.CopyProblemCode, this.copyProblemCodeCommand));
    context.subscriptions.push(vscode.commands.registerCommand(EELCommandId.SearchForProblem, this.searchForProblemCommand));
    context.subscriptions.push(vscode.commands.registerCommand(EELCommandId.DisableLine, this.disableLineCommand));
    // ────────────────────────────────────────────────────────────
    // ──── Text Editor commands ──────────────────────────────────
    // ────────────────────────────────────────────────────────────
    context.subscriptions.push(vscode.commands.registerTextEditorCommand(EELCommandId.SelectProblem, this.selectProblemCommand));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand(EELCommandId.CopyProblemMessage, this.copyProblemMessageCommand));
    // ────────────────────────────────────────────────────────────
    // ──── Internal commands ─────────────────────────────────────
    // ────────────────────────────────────────────────────────────
    context.subscriptions.push(vscode.commands.registerCommand(EELCommandId.CodeLensOnClick, this.codeLensOnClickCommand));
    context.subscriptions.push(vscode.commands.registerCommand(EELCommandId.RevealLine, this.revealLineCommand));
    context.subscriptions.push(vscode.commands.registerCommand(EELCommandId.ExcludeProblem, this.excludeProblemCommand));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand(EELCommandId.StatusBarCommand, this.statusBarCommand));
  }

}
