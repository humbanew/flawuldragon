import * as vscode from 'vscode';
import { AutoCloseTag } from './AutoCloseTag.ac.cjs';
import { AutoRenameTag } from './AutoRenameTag.ac.cjs';

export class AutoRCCTag {
  protected autoCloseTag = new AutoCloseTag();
  protected autoRenameTag = new AutoRenameTag();

  public autoRCCTag_activate(context: vscode.ExtensionContext) {
    try {
      this.autoCloseTag.activate(context);
      this.autoRenameTag.activate(context);
    } catch (error) {
      console.error("Flawuldragon - Auto Rename Close Complete Tag error: " + error);
      vscode.window.showErrorMessage("An error occurred while activating the auto rename close complete tag integration feature: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
      this.autoRCCTag_desactivate();
    } finally {}
  }
  public autoRCCTag_desactivate() {
    this.autoCloseTag.deactivate();
  }
}
