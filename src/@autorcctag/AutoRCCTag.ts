import * as vscode from 'vscode';
import { AutoCloseTag } from './AutoCloseTag.ac.js';
import { AutoRenameTag } from './AutoRenameTag.ac.js';

/**
 * Class representing the AutoRCCTag functionality.
 *
 * @class
 * @example
 * // Example usage:
 * const autorcctag = new AutoRCCTag();
 * autorcctag.autoRCCTag_activate(context);
 */
export class AutoRCCTag {
  protected autoCloseTag = new AutoCloseTag();
  protected autoRenameTag = new AutoRenameTag();

  /**
   * Activates the AutoRCCTag features.
   * 
   * @param context - The VSCode extension context.
   */
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

  /**
   * Deactivates the AutoRCCTag features.
   */
  public autoRCCTag_desactivate() {
    this.autoCloseTag.deactivate();
  }
}
