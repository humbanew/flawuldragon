import * as vscode from "vscode";
import { deactivateJBM, JBMActivation, firstTimeActivation } from "./util.cjs";
import * as fs from "fs";
import * as path from "path";

let statusBar: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  // Jetbrains Mono Font Extension Configs
  console.log(
    `Congratulations, your extension "${context.extension.packageJSON.displayName} - Jetbrains Mono Font installed!"`
  );
  firstTimeActivation(context);
  let activateCommand = vscode.commands.registerCommand(
    "flawuldragon_jetbrainsmonofont.activate",
    () => JBMActivation(context)
  );
  let deactivateCommand = vscode.commands.registerCommand(
    "flawuldragon_jetbrainsmonofont.deactivate",
    () => deactivateJBM(context)
  );
  context.subscriptions.push(activateCommand, deactivateCommand);

  // Flawuldragon Configs
  console.log("Flawuldragon is loaded!");
  const flawuldragonStatusbaritemId = "flawuldragon.extension.infos";
  context.subscriptions.push(
    vscode.commands.registerCommand(flawuldragonStatusbaritemId, () => {
      let viewPanel = vscode.window.createWebviewPanel("flawuldragon", "Flawuldragon Notes", vscode.ViewColumn.Two, {});
      return 0;
    })
  );

  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBar.text = `$(flawuldragon-on) FD`;
  statusBar.command = flawuldragonStatusbaritemId;
  statusBar.color = "darkblue";
  statusBar.backgroundColor = new vscode.ThemeColor(
    "statusBarItem.warningBackground"
  );
  statusBar.tooltip = "Click to view Flawuldragon Notes";
  // statusBar.tooltip = new vscode.MarkdownString(fs.readFileSync(
  //   path.join(__dirname, "../", "assets", "flawuldragon.md"),
  //   "utf-8"
  // ));
  statusBar.show();
  context.subscriptions.push(statusBar);

  if (
    vscode.workspace.getConfiguration("flawuldragon").get("enable") === false
  ) {
    console.warn("Flawuldragon is disabled. Enable it in your settings.");
    vscode.window.showWarningMessage(
      "Flawuldragon is disabled. Enable it in your settings."
    );
    statusBar.text = `$(flawuldragon-off) The Flawuldragon`;
    statusBar.color = "darkred";
    statusBar.backgroundColor = new vscode.ThemeColor(
      "statusBarItem.errorBackground"
    );
    return;
  }
}

export function deactivate(context: vscode.ExtensionContext) {
  deactivateJBM(context);
}
