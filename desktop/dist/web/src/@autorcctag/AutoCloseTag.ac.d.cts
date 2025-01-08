import * as vscode from 'vscode';
export declare class AutoCloseTag {
    activate(context: vscode.ExtensionContext): void;
    deactivate(): void;
    protected insertAutoCloseTag(event: vscode.TextDocumentChangeEvent): void;
    protected CheckRightAngleBracket(contentChange: vscode.TextDocumentContentChangeEvent): boolean;
    protected CheckRightAngleBracketInVSCode_1_8(contentChange: vscode.TextDocumentContentChangeEvent): boolean;
    protected insertCloseTag(): void;
    protected getNextChar(editor: vscode.TextEditor, position: vscode.Position): string;
    protected getCloseTag(text: string, excludedTags: string[]): string;
    protected moveSelectionRight(selection: vscode.Selection, shift: number): vscode.Selection;
    protected occurrenceCount(source: string, find: string): number;
}
//# sourceMappingURL=AutoCloseTag.ac.d.cts.map