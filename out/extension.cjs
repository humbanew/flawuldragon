"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const util_cjs_1 = require("./util.cjs");
let statusBar;
function activate(context) {
    // Jetbrains Mono Font Extension Configs
    console.log(`Congratulations, your extension "${context.extension.packageJSON.displayName} - Jetbrains Mono Font installed!"`);
    (0, util_cjs_1.firstTimeActivation)(context);
    let activateCommand = vscode.commands.registerCommand("flawuldragon_jetbrainsmonofont.activate", () => (0, util_cjs_1.JBMActivation)(context));
    let deactivateCommand = vscode.commands.registerCommand("flawuldragon_jetbrainsmonofont.deactivate", () => (0, util_cjs_1.deactivateJBM)(context));
    context.subscriptions.push(activateCommand, deactivateCommand);
    // Flawuldragon Configs
    console.log("StatusBarItem Loaded!");
    const flawuldragonStatusbaritemId = "flawuldragon.extension.infos";
    context.subscriptions.push(vscode.commands.registerCommand(flawuldragonStatusbaritemId, () => vscode.window.showInformationMessage("Working!")));
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBar.text = "The Flawuldragon ✅";
    statusBar.command = flawuldragonStatusbaritemId;
    statusBar.backgroundColor = new vscode.ThemeColor("statusBarItem.background='#ffffff'");
    statusBar.show();
    context.subscriptions.push(statusBar);
}
function deactivate(context) {
    (0, util_cjs_1.deactivateJBM)(context);
}
