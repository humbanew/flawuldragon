"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const util_cjs_1 = require("./util.cjs");
async function activate(context) {
    console.log(`Congratulations, your extension "${context.extension.packageJSON.displayName}" - Jetbrains Mono Font installed!`);
    (0, util_cjs_1.firstTimeActivation)(context);
    let activateCommand = vscode.commands.registerCommand("flawuldragon_jetbrainsmonofont.activate", () => (0, util_cjs_1.JBMActivation)(context));
    let deactivateCommand = vscode.commands.registerCommand("flawuldragon_jetbrainsmonofont.deactivate", () => (0, util_cjs_1.deactivateJBM)(context));
    context.subscriptions.push(activateCommand, deactivateCommand);
}
function deactivate(context) {
    (0, util_cjs_1.deactivateJBM)(context);
}
