"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const util_cjs_1 = require("./util.cjs");
const fs = require("fs");
const path = require("path");
let statusBar;
function activate(context) {
    // Jetbrains Mono Font Extension Configs
    console.log(`Congratulations, your extension "${context.extension.packageJSON.displayName} - Jetbrains Mono Font installed!"`);
    (0, util_cjs_1.firstTimeActivation)(context);
    let activateCommand = vscode.commands.registerCommand("flawuldragon_jetbrainsmonofont.activate", () => (0, util_cjs_1.JBMActivation)(context));
    let deactivateCommand = vscode.commands.registerCommand("flawuldragon_jetbrainsmonofont.deactivate", () => (0, util_cjs_1.deactivateJBM)(context));
    context.subscriptions.push(activateCommand, deactivateCommand);
    // Flawuldragon Configs
    console.log("Flawuldragon is loaded!");
    const flawuldragonStatusbaritemId = "flawuldragon.extension.infos";
    context.subscriptions.push(vscode.commands.registerCommand(flawuldragonStatusbaritemId, () => {
        return 0;
    }));
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBar.text = `$(flawuldragon-on) FD`;
    statusBar.command = flawuldragonStatusbaritemId;
    statusBar.color = "darkblue";
    statusBar.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
    statusBar.tooltip = new vscode.MarkdownString(fs.readFileSync(path.join(__dirname, "../", "assets", "flawuldragon.md"), "utf-8"));
    statusBar.tooltip.isTrusted = true;
    statusBar.show();
    context.subscriptions.push(statusBar);
    if (vscode.workspace.getConfiguration("flawuldragon").get("enable") === false) {
        console.warn("Flawuldragon is disabled. Enable it in your settings.");
        vscode.window.showWarningMessage("Flawuldragon is disabled. Enable it in your settings.");
        statusBar.text = `$(flawuldragon-off) The Flawuldragon`;
        statusBar.color = "darkred";
        statusBar.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
        return;
    }
}
function deactivate(context) {
    (0, util_cjs_1.deactivateJBM)(context);
}
