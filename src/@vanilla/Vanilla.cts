import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { IVFDInterruptor } from './defines';
import { constants } from '../constants.cjs';

/**
 * Interface Save Mode Display StatusBar
 * 1- Display datetime default visualization (date - time)
 * 2- Display datetime invert position visualization (time - date)
 * 3- Display datetime with seconds visualization
 * 4- Display datetime with custom time format
 */

/**
 * Represents the Vanilla class which is responsible for managing the Flawuldragon extension's status bar item.
 *
 * The Vanilla class provides methods to activate and deactivate the Flawuldragon extension, including setting up
 * the status bar item, registering commands, and handling the extension's enabled/disabled state.
 *
 * @class
 * @example
 * // Example usage:
 * const vanilla = new Vanilla();
 * vanilla.vanilla_activate(context);
 */
export class Vanilla {

  /**
   * A status bar item for the Flawuldragon extension.
   * This status bar item is aligned to the left with a priority of 100.
   */
  protected flawuldragonStatusBar: vscode.StatusBarItem =
    constants.statusBar.positions.posA;

  /**
   * A status bar item that displays the date and time for the Flawuldragon extension.
   *
   * This status bar item is aligned to the left with a priority of 98.
   * It is created using the `vscode.window.createStatusBarItem` method.
   */
  protected flawuldragonDateTimeStatusBar: vscode.StatusBarItem =
    constants.statusBar.positions.posC;

  /**
   * A unique identifier for the status bar item associated with the Flawuldragon extension.
   * This ID is used to register and manage the status bar item within the extension.
   */
  protected flawuldragonStatusbaritemId =
    constants.commands.vanilla.release.fdNotesViewPanel;

  protected vanilla_flawuldragonNotes(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
      vscode.commands.registerCommand(this.flawuldragonStatusbaritemId, () => {
        let viewPanel = vscode.window.createWebviewPanel(
          'flawuldragon',
          'Flawuldragon Notes',
          vscode.ViewColumn.One,
          {
            enableScripts: true,
            enableForms: true
          }
        );
        viewPanel.title = 'Flawuldragon Notes';
        viewPanel.iconPath = vscode.Uri.file(
          path.join(__dirname, '../../', 'assets', 'icon.png')
        );
        viewPanel.webview.html = fs
          .readFileSync(
            path.join(__dirname, '../../', 'display', 'flawuldragon.html')
          )
          .toString();
        return 0;
      })
    );

    // flawuldragon development notes status bar item
    this.flawuldragonStatusBar.text = `$(flawuldragon-on) FD`;
    this.flawuldragonStatusBar.command = this.flawuldragonStatusbaritemId;
    this.flawuldragonStatusBar.backgroundColor = new vscode.ThemeColor(
      'statusBarItem.warningBackground'
    );
    this.flawuldragonStatusBar.tooltip = 'Click to view Flawuldragon Notes';
    this.flawuldragonStatusBar.show();
    context.subscriptions.push(this.flawuldragonStatusBar);
  }

  protected vanilla_checkingIsOk(): void {
    // check if the extension is enabled in the settings
    if (
      vscode.workspace.getConfiguration('flawuldragon').get('enable') === false
    ) {
      console.warn('Flawuldragon is disabled. Enable it in your settings.');
      vscode.window.showWarningMessage(
        'Flawuldragon is disabled. Enable it in your settings.'
      );
      this.flawuldragonStatusBar.text = `$(flawuldragon-off) FD`;
      this.flawuldragonStatusBar.color = 'darkred';
      this.flawuldragonStatusBar.backgroundColor = new vscode.ThemeColor(
        'statusBarItem.errorBackground'
      );
      return;
    }
  }

  public vanilla_interruptorStatusBarConstructor(
    statusBarItem: vscode.StatusBarItem,
    command: string
  ): void {
    const interruptor: IVFDInterruptor = { on: true, off: false };
    vscode.commands.registerCommand(command, () => {
      if (interruptor.on == true) {
        statusBarItem.hide();
        interruptor.on = false;
        interruptor.off = true;
      } else {
        statusBarItem.show();
        interruptor.on = true;
        interruptor.off = false;
      }
    });
  }

  protected vanilla_dateTimeComponent(context: vscode.ExtensionContext): void {
    let text: string;

    setInterval(() => {
      let timer: Date = new Date(),
        day = timer.getDate().toString(),
        month = (timer.getMonth() + 1).toString(),
        hours = timer.getHours().toString(),
        minutes = timer.getMinutes().toString(),
        seconds = timer.getSeconds().toString();

      if (parseInt(day) < 10) day = 0 + day;
      if (parseInt(month) < 10) month = 0 + month;
      if (parseInt(hours) < 10) hours = 0 + hours;
      if (parseInt(minutes) < 10) minutes = 0 + minutes;
      if (parseInt(seconds) < 10) seconds = 0 + seconds;

      text = `${day}/${month}/${timer.getFullYear()} - ${hours}:${minutes}`;
      this.flawuldragonDateTimeStatusBar.text = text;
    }, 1000);

    this.flawuldragonDateTimeStatusBar.tooltip = 'Current time';
    this.flawuldragonDateTimeStatusBar.backgroundColor = new vscode.ThemeColor(
      'statusBarItem.warningBackground'
    );
    this.flawuldragonDateTimeStatusBar.show();
    context.subscriptions.push(this.flawuldragonDateTimeStatusBar);

  }

  /**
   * Activates the Flawuldragon extension.
   *
   * This method sets up the status bar item and command for the Flawuldragon extension.
   * It creates a webview panel to display Flawuldragon Notes and configures the status bar item
   * with appropriate text, color, and tooltip. If the extension is disabled in the settings,
   * it updates the status bar item to reflect the disabled state and shows a warning message.
   *
   * @param context - The extension context provided by VS Code.
   */
  public vanilla_activate(context: vscode.ExtensionContext) {
    try {
      console.log('Flawuldragon - Vanilla activated!');
      this.vanilla_flawuldragonNotes(context);
      this.vanilla_dateTimeComponent(context);
      this.vanilla_interruptorStatusBarConstructor(
        this.flawuldragonDateTimeStatusBar,
        constants.commands.vanilla.release.fdDateTimeStatusbar
      ); // show or hide the status bar

      this.vanilla_checkingIsOk();
    } catch (error) {
      console.error('Flawuldragon vanilla error: ' + error);
      vscode.window.showErrorMessage(
        'An error occurred while activating the Flawuldragon vanilla features: ' +
          error +
          '. Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)'
      );
      this.vanilla_desactivate();
    } finally {
    }
  }

  /**
   * Deactivates the vanilla feature by disposing of the flawuldragon status bar.
   */
  public vanilla_desactivate() {
    this.flawuldragonStatusBar.dispose();
  }
}

class VColorHighlight {
  public constructor() {
  }
}
class VColorErrorLens {
  public constructor() {
    // collect lines with error or warning to do display hint after
    
  }
}
