import * as vscode from "vscode";
import { deactivateJBM, JBMActivation, firstTimeActivation } from "./util.cjs";

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
  console.log("StatusBarItem Loaded!");
  const flawuldragonStatusbaritemId = "flawuldragon.extension.infos";
  context.subscriptions.push(vscode.commands.registerCommand(
    flawuldragonStatusbaritemId,
    () => vscode.window.showInformationMessage("Working!")
  ));

  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBar.text = "The Flawuldragon ✅";
  statusBar.command = flawuldragonStatusbaritemId;
  statusBar.backgroundColor = new vscode.ThemeColor("statusBarItem.background='#ffffff'");
  statusBar.show();
  context.subscriptions.push(statusBar);
}

export function deactivate(context: vscode.ExtensionContext) {
  deactivateJBM(context);
}
