/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as vscode from 'vscode';
import { Global } from '../globalDefs';

/**
 * Represents the Flawuldragon Bracket Guides feature.
 * 
 * This class provides methods to activate and deactivate the bracket guides feature in the editor.
 * It allows users to toggle the visibility of bracket pair guides and updates the editor settings accordingly.
 *
 * @class
 * @example
 * // Example usage:
 * const bracketGuides = new FDBracketGuides();
 * bracketGuides.activate(context);
 */
export class FDBracketGuides {
  /**
   * Activates the Flawuldragon - Toggle Bracket Guides extension.
   * 
   * This method registers a command that toggles the visibility of bracket pair guides in the editor.
   * It updates the `editor.guides.bracketPairs` setting based on its current value and provides feedback to the user.
   * 
   * @param {vscode.ExtensionContext} context - The context in which the extension is activated.
   * 
   * @throws Will throw an error if there is an issue during activation.
   */
  public activate(context: vscode.ExtensionContext) {
    try {

      console.log('Flawuldragon - Toggle Bracket Guides is now active!');
  
      let disposable = vscode.commands.registerCommand(
        Global.bracketguides.comandos['toggle-bracket-guides'],
        () => {
          const config = vscode.workspace.getConfiguration();
          const currentValue = config.get('editor.guides.bracketPairs');
  
          let newValue;
          let message;
  
          if (currentValue === true) {
            newValue = 'active';
            message = 'Bracket pairs guides set to active!';
          } else if (currentValue === 'active') {
            newValue = false;
            message = 'Bracket pairs guides disabled!';
          } else {
            newValue = true;
            message = 'Bracket pairs guides enabled!';
          }
  
          // Update the setting
          config.update(
            'editor.guides.bracketPairs',
            newValue,
            vscode.ConfigurationTarget.Global
          );
  
          vscode.window.showInformationMessage(message);
        }
      );
  
      context.subscriptions.push(disposable);
    } catch (error) {
      console.error("Flawuldragon - Bracket Guides error: " + error);
      vscode.window.showErrorMessage("An error occurred while activating the bracket guides integration feature: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
      this.desactivate();
    } finally {}
  }

  /**
   * Deactivates the Bracket Guides feature.
   * Logs a message indicating that the Bracket Guides are now inactive.
   */
  public desactivate() {
    console.log('Flawuldragon - Toggle Bracket Guides is now inactive!');
  }
}
