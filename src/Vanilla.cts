import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { IVFDInterruptor } from './IVFDInterruptor';

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
    vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);

  /**
   * A status bar item that displays the date and time for the Flawuldragon extension.
   *
   * This status bar item is aligned to the left with a priority of 98.
   * It is created using the `vscode.window.createStatusBarItem` method.
   */
  protected flawuldragonDateTimeStatusBar: vscode.StatusBarItem =
    vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98);

  /**
   * A unique identifier for the status bar item associated with the Flawuldragon extension.
   * This ID is used to register and manage the status bar item within the extension.
   */
  protected flawuldragonStatusbaritemId = 'flawuldragon.extension.infos';

  protected vanilla_flawuldragonNotes(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
      vscode.commands.registerCommand(this.flawuldragonStatusbaritemId, () => {
        let viewPanel = vscode.window.createWebviewPanel(
          'flawuldragon',
          'Flawuldragon Notes',
          vscode.ViewColumn.One,
          {}
        );
        viewPanel.title = 'Flawuldragon Notes';
        viewPanel.iconPath = vscode.Uri.file(
          path.join(__dirname, '../', 'assets', 'icon.png')
        );
        viewPanel.webview.html = fs
          .readFileSync(
            path.join(__dirname, '../', 'webview', 'flawuldragon.html')
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

  protected vanilla_interruptorStatusBarConstructor(
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

      /** -------------------- Development Block ------------------------------- */

      // flawuldragon date and time status bar items
      // update every second window to show the current time
      setInterval(() => {
        let timer: Date = new Date(),
          text: string;
        let date = `${timer.getUTCDate()}-${
          timer.getUTCMonth() + 1
        }-${timer.getFullYear()}`;
        let hours = timer.getHours().toString();
        let minutes = timer.getMinutes().toString();
        if (parseInt(hours) < 10) {
          hours = 0 + hours;
        }
        if (parseInt(minutes) < 10) {
          minutes = 0 + minutes;
        }
        text = date + ` ◆ ${hours}:${minutes}`;
        this.flawuldragonDateTimeStatusBar.text = text;
      }, 1000);
      this.flawuldragonDateTimeStatusBar.tooltip = 'Current time';
      this.flawuldragonDateTimeStatusBar.backgroundColor =
        new vscode.ThemeColor('statusBarItem.warningBackground');
      this.flawuldragonDateTimeStatusBar.show();
      context.subscriptions.push(this.flawuldragonDateTimeStatusBar);

      // flawuldragon aprimored experimental commands
      this.vanilla_interruptorStatusBarConstructor(
        this.flawuldragonDateTimeStatusBar,
        'flawuldragon.vanillaDateTime.ui.interruptorStatusBar'
      ); // show or hide the status bar

      const vanillaDateTime = class VDateTime extends Vanilla {};
      const vanillaExtensionIntelligence = class VExtensionIntelligence extends Vanilla {};
      vscode.commands.registerCommand(
        'flawuldragon.vanillaDateTime.invertPosition',
        () => {}
      );
      vscode.commands.registerCommand(
        'flawuldragon.vanillaDateTime.showSeconds',
        () => {}
      );
      vscode.commands.registerCommand(
        'flawuldragon.vanillaDateTime.timeFormat',
        () => {}
      );
      /** -------------------- End of Development Block --------------------------- */

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

class VDateTime {
  /**
   * A status bar item that displays the date and time for the Flawuldragon extension.
   *
   * This status bar item is aligned to the left with a priority of 98.
   * It is created using the `vscode.window.createStatusBarItem` method.
   */
  protected flawuldragonDateTimeStatusBar: vscode.StatusBarItem =
    vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98);
}

class VExtensionIntelligence {}
