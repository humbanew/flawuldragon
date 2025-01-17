import * as vscode from 'vscode';
import { TELErrorLensSettings, TELColorFormat } from './declares';
import { ELUtils } from './ELUtils.ac.js';
import { EELConstants } from './enums.js';

// utils/vscodeUtils.ts
export class ELVSCodeUtils {
  
  /**
   * Update global settings.json file with the new setting value.
   */
  public async updateGlobalSetting(settingId: TELErrorLensSettings, newValue: unknown): Promise<void> {
    const vscodeConfig = vscode.workspace.getConfiguration();
    await vscodeConfig.update(settingId, newValue, vscode.ConfigurationTarget.Global);
  }

  /**
   * Update global settings.json file with the toggled boolean setting.
   */
  public async toggleGlobalBooleanSetting(settingId: TELErrorLensSettings): Promise<void> {
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
  public svgToUri(svg: string): vscode.Uri {
    return vscode.Uri.parse(`data:image/svg+xml;utf8,${svg}`);
  }

  /**
   * Open vscode Settings GUI with input value set to the specified value.
   */
  public async openSettingGuiAt(settingName: string): Promise<void> {
    await vscode.commands.executeCommand('workbench.action.openSettings', settingName);
  }

  /**
   * Create [Command URI](https://code.visualstudio.com/api/extension-guides/command#command-uris).
   */
  public createCommandUri(commandId: string, args?: unknown): vscode.Uri {
    const commandArg = args ? `?${encodeURIComponent(JSON.stringify(args))}` : '';
    return vscode.Uri.parse(`command:${commandId}${commandArg}`);
  }

  public revealLine(editor: vscode.TextEditor, lineNumber: number): void {
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
  public createStyledMarkdown({
    strMd = '',
    backgroundColor = 'var(--vscode-editorHoverWidget-background)',
    color = 'var(--vscode-editorHoverWidget-foreground)',
  }: {
    strMd?: string;
    backgroundColor?: TELColorFormat;
    color?: string;
  }): string {
    const colorStyle = color ? `color:${color};` : '';
    const backgroundStyle = backgroundColor ? `background-color:${backgroundColor};` : '';
    return `<span style="${colorStyle}${backgroundStyle}">${strMd}</span>`;
  }

  public createButtonLinkMarkdown({
    text,
    href,
    title = '',
  }: {
    text: string;
    href: string;
    title?: string;
  }): string {
    const buttonText = this.createStyledMarkdown({
      strMd: ELUtils.prototype.surround(text, EELConstants.NonBreakingSpaceSymbolHtml),
      backgroundColor: 'var(--vscode-button-background)',
      color: 'var(--vscode-button-foreground)',
    });

    return `<a title="${title}" href="${href}">${buttonText}</a>`;
  }

  public createProblemIconMarkdown(kind: 'error' | 'info' | 'warning'): string {
    const colorClass: TELColorFormat = kind === 'error' ?
      'var(--vscode-editorError-foreground)' :
      kind === 'warning' ? 'var(--vscode-editorWarning-foreground)' : 'var(--vscode-editorInfo-foreground)';
    return this.createStyledMarkdown({
      strMd: `$(${kind})`,
      color: colorClass,
    });
  }

  public async readFileVscode(pathOrUri: vscode.Uri | string): Promise<string> {
    try {
      const uri = typeof pathOrUri === 'string' ? vscode.Uri.file(pathOrUri) : pathOrUri;
      const file = await vscode.workspace.fs.readFile(uri);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      return new TextDecoder().decode(file);
    } catch (e) {
      vscode.window.showErrorMessage((e as Error).message);
      return '';
    }
  }

  public async openFileInVscode(pathOrUri: vscode.Uri | string): Promise<vscode.TextEditor> {
    let document: vscode.TextDocument;
    if (typeof pathOrUri === 'string') {
      document = await vscode.workspace.openTextDocument(pathOrUri);
    } else {
      document = await vscode.workspace.openTextDocument(pathOrUri);
    }
    return vscode.window.showTextDocument(document);
  }

  public getIndentationAtLine(document: vscode.TextDocument, lineNumber: number): string {
    const textLine = document.lineAt(lineNumber);
    return textLine.text.slice(0, textLine.firstNonWhitespaceCharacterIndex);
  }

  public setCaretInEditor({ editor, range }: { editor?: vscode.TextEditor; range: vscode.Range }): void {
    if (!editor) {
      editor = vscode.window.activeTextEditor;
    }
    if (editor) {
      editor.selection = new vscode.Selection(range.start, range.end);
      editor.revealRange(range);
    }
  }
}
