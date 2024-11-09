"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JBMActivationPrompt = void 0;
exports.dirOpen = dirOpen;
exports.JBMActivation = JBMActivation;
exports.firstTimeActivation = firstTimeActivation;
exports.deactivateJBM = deactivateJBM;
const vscode = require("vscode");
const path = require("path");
const defaultSettings_cjs_1 = require("./defaultSettings.cjs");
const showDialog = vscode.window.showInformationMessage;
const JBMPath = (context) => path.resolve(context.extensionPath, "JetBrainsMono");
const updateUserSettings = (settings, remove = false) => Object.entries(settings).forEach(([key, value]) => vscode.workspace
    .getConfiguration()
    .update(key, remove ? undefined : value, vscode.ConfigurationTarget.Global));
function dirOpen(dirPath) {
    let command = "";
    switch (process.platform) {
        case "darwin":
            command = "open";
            break;
        case "win32":
            command = "explorer";
            break;
        default:
            command = "xdg-open";
            break;
    }
    return require("child_process").exec(`${command} ${dirPath}`);
}
function JBMActivation(context) {
    const JBMAddress = JBMPath(context);
    updateUserSettings(defaultSettings_cjs_1.defaultSettings);
    dirOpen(JBMAddress);
    showDialog(`${context.extension.packageJSON.displayName} - Jetbrains Mono Font is activated!`);
    showDialog(`Important Note - Don't forget to install fonts! Font Directory will open, once you have manually installed fonts, restart VSCODE - ${JBMAddress}`);
}
const JBMActivationPrompt = (context) => showDialog("Activate JetBrains Mono Font for Flawuldragon?", "Yes", "No").then((value) => value === "Yes"
    ? JBMActivation(context)
    : showDialog("You can activate JetBrains Mono later by running 'JetBrainsMono' or 'JBM' in command palette."));
exports.JBMActivationPrompt = JBMActivationPrompt;
function firstTimeActivation(context) {
    const version = context.extension.packageJSON.version ?? "1.0.0";
    const previousVersion = context.globalState.get(context.extension.id);
    if (previousVersion === version)
        return;
    JBMActivation(context);
    context.globalState.update(context.extension.id, version);
}
function deactivateJBM(context) {
    // context.globalState.update(context.extension.id, undefined);
    updateUserSettings(defaultSettings_cjs_1.defaultSettings, true);
    showDialog(`${context.extension.packageJSON.displayName} is deactivated!`);
}
