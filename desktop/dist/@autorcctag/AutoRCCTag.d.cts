import * as vscode from 'vscode';
import { AutoCloseTag } from './AutoCloseTag.ac.cjs';
import { AutoRenameTag } from './AutoRenameTag.ac.cjs';
export declare class AutoRCCTag {
    protected autoCloseTag: AutoCloseTag;
    protected autoRenameTag: AutoRenameTag;
    autoRCCTag_activate(context: vscode.ExtensionContext): void;
    autoRCCTag_desactivate(): void;
}
//# sourceMappingURL=AutoRCCTag.d.cts.map