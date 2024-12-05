import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";

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
  protected flawuldragonStatusBar: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);

  /**
   * A status bar item that displays the date and time for the Flawuldragon extension.
   * 
   * This status bar item is aligned to the left with a priority of 99.
   * It is created using the `vscode.window.createStatusBarItem` method.
   */
  protected flawuldragonDateTimeStatusBar: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);

  /**
   * A unique identifier for the status bar item associated with the Flawuldragon extension.
   * This ID is used to register and manage the status bar item within the extension.
   */
  protected flawuldragonStatusbaritemId = "flawuldragon.extension.infos";

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
      console.log("Flawuldragon Vanilla activated!");

      context.subscriptions.push(
        vscode.commands.registerCommand(this.flawuldragonStatusbaritemId, () => {
          let viewPanel = vscode.window.createWebviewPanel(
            "flawuldragon",
            "Flawuldragon Notes",
            vscode.ViewColumn.One,
            {},
          );
          viewPanel.title = "Flawuldragon Notes";
          viewPanel.iconPath = vscode.Uri.file(
            path.join(__dirname, "../", "assets", "icon.png"),
          );
          viewPanel.webview.html = fs
            .readFileSync(
              path.join(__dirname, "../", "assets", "flawuldragon.html"),
            )
            .toString();
          return 0;
        }),
      );
  
      // flawuldragon development notes status bar item
      this.flawuldragonStatusBar.text = `$(flawuldragon-on) FD`;
      this.flawuldragonStatusBar.command = this.flawuldragonStatusbaritemId;
      this.flawuldragonStatusBar.color = "darkblue";
      this.flawuldragonStatusBar.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.warningBackground",
      );
      this.flawuldragonStatusBar.tooltip = "Click to view Flawuldragon Notes";
      this.flawuldragonStatusBar.show();
      context.subscriptions.push(this.flawuldragonStatusBar);

      // flawuldragon date and time status bar items
      // update every second window to show the current time
      setInterval(() =>{
        let timer: Date = new Date(), text: string;
        let date = `${timer.getDay()+1}-${timer.getMonth()+1}-${timer.getFullYear()}`;
        if(timer.getHours() < 10) {
          text = date + ` ◆ 0${timer.getHours()}:${timer.getMinutes()}`; 
        } else if(timer.getMinutes() < 10) {
          text = date + ` ◆ ${timer.getHours()}:0${timer.getMinutes()}`;
        } else if(timer.getMinutes() < 10 && timer.getSeconds() < 10) {
          text = date + ` ◆ 0${timer.getHours()}:0${timer.getMinutes()}`;
        } else {
          text = date + ` ◆ ${timer.getHours()}:${timer.getMinutes()}`;
        }
        this.flawuldragonDateTimeStatusBar.text = text;
      }, 1000);
      this.flawuldragonDateTimeStatusBar.tooltip = "Current time";
      this.flawuldragonDateTimeStatusBar.color = "blue";
      this.flawuldragonDateTimeStatusBar.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.warningBackground",
      );
      this.flawuldragonDateTimeStatusBar.show();
      context.subscriptions.push(this.flawuldragonDateTimeStatusBar);

      // flawuldragon commands
      vscode.commands.registerCommand("flawuldragon.vanillaDatetime.active", ()=>{
        this.flawuldragonDateTimeStatusBar.show();
      });

      vscode.commands.registerCommand("flawuldragon.vanillaDatetime.deactive", ()=>{
        this.flawuldragonDateTimeStatusBar.hide();
      });
      vscode.commands.registerCommand("flawuldragon.vanillaDatetime.12hFormat", ()=>{});
      vscode.commands.registerCommand("flawuldragon.vanillaDatetime.24hFormat", ()=>{});
      vscode.commands.registerCommand("flawuldragon.vanillaDatetime.toggleDate", ()=>{});
      vscode.commands.registerCommand("flawuldragon.vanillaDatetime.untoggleDate", ()=>{});
      vscode.commands.registerCommand("flawuldragon.vanillaDatetime.invertPosition", ()=>{});

      // check if the extension is enabled in the settings
      if (
        vscode.workspace.getConfiguration("flawuldragon").get("enable") === false
      ) {
        console.warn("Flawuldragon is disabled. Enable it in your settings.");
        vscode.window.showWarningMessage(
          "Flawuldragon is disabled. Enable it in your settings.",
        );
        this.flawuldragonStatusBar.text = `$(flawuldragon-off) FD`;
        this.flawuldragonStatusBar.color = "darkred";
        this.flawuldragonStatusBar.backgroundColor = new vscode.ThemeColor(
          "statusBarItem.errorBackground",
        );
        return;
      }

    } catch (error) {
      console.error("Flawuldragon vanilla error: " + error);
      vscode.window.showErrorMessage("An error occurred while activating the Flawuldragon vanilla features: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
      this.vanilla_desactivate();
    } finally {}
  }

  /**
   * Deactivates the vanilla feature by disposing of the flawuldragon status bar.
   */
  public vanilla_desactivate() {
    this.flawuldragonStatusBar.dispose();
  }

}
