/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as vscode from 'vscode';
import { AutoCloseTag } from './AutoCloseTag';
import { AutoRenameTag } from './AutoRenameTag';

/**
 * Class representing the AutoRCCTag functionality.
 *
 * @class
 * @example
 * // Example usage:
 * const autorcctag = new AutoRCCTag();
 * autorcctag.autoRCCTag_activate(context);
 */
export class FDAutoRCCTag {
  protected autoCloseTag = new AutoCloseTag();
  protected autoRenameTag = new AutoRenameTag();

  /**
   * Activates the AutoRCCTag features.
   * 
   * @param context - The VSCode extension context.
   */
  public activate(context: vscode.ExtensionContext) {
    try {
      console.log('Flawuldragon - Auto Rename Close Complete Tag is now active!');
      this.autoCloseTag.activate(context);
      this.autoRenameTag.activate(context);
    } catch (error) {
      console.error("Flawuldragon - Auto Rename Close Complete Tag error: " + error);
      vscode.window.showErrorMessage("An error occurred while activating the auto rename close complete tag integration feature: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
      this.desactivate();
    } finally {}
  }

  /**
   * Deactivates the AutoRCCTag features.
   */
  public desactivate() {
    console.log('Flawuldragon - Auto Rename Close Complete Tag is now inactive!');
    this.autoCloseTag.deactivate();
  }
}
