"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
exports.activationPrompt = activationPrompt;
const FileSize_cjs_1 = require("./FileSize.cjs");
const IndentRainbow_cjs_1 = require("./IndentRainbow.cjs");
const JetbrainsIcons_cjs_1 = require("./JetbrainsIcons.cjs");
const JetbrainsMono_cjs_1 = require("./JetbrainsMono.cjs");
const TodoHighlight_cjs_1 = require("./TodoHighlight.cjs");
const Vanilla_cjs_1 = require("./Vanilla.cjs");
const vscode = require("vscode");
const vanilla = new Vanilla_cjs_1.Vanilla();
const jetbrainsmono = new JetbrainsMono_cjs_1.JetbrainsMono();
const jetbrainsicons = new JetbrainsIcons_cjs_1.JetbrainsIcons();
const filesize = new FileSize_cjs_1.FileSize();
const todohighlight = new TodoHighlight_cjs_1.TodoHighlight();
const indentrainbow = new IndentRainbow_cjs_1.IndentRainbow();
/**
 * Activates the extension.
 *
 * This function is called when the extension is activated. It is used to set up
 * any necessary state or register commands, providers, etc.
 *
 * @param context - The context in which the extension is activated. This provides
 * access to the extension's global state, subscriptions, and other utilities.
 */
function activate(context) {
    try {
        console.log("Flawuldragon core hub activated!");
        vanilla.vanilla_activate(context);
        jetbrainsmono.jetbrainsMono_activate(context);
        jetbrainsmono.jetbrainsMono_firstTimeActivation(context);
        jetbrainsicons.jetbrainsIcons_activate(context);
        filesize.filesize_activate(context);
        todohighlight.todoHighlight_activate(context);
        indentrainbow.indentRainbow_activate(context);
    }
    catch (error) {
        console.log("Flawuldragon core hub - Error: " + error);
        vscode.window.showErrorMessage("An error occurred while activating the Flawuldragon core hub: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
        deactivate(context);
    }
}
/**
 * Deactivates the extension.
 *
 * This function is called when the extension is deactivated. It can be used to
 * perform any necessary cleanup tasks.
 *
 * @param context - The context in which the extension is running.
 */
function deactivate(context) {
    vanilla.vanilla_desactivate();
    jetbrainsmono.jetbrainsMono_desactivate(context);
    jetbrainsicons.jetbrainsIcons_deactivate();
    filesize.filesize_deactivate();
    todohighlight.todoHighlight_desactivate();
    indentrainbow.indentRainbow_deactivate();
}
/**
 * Activates the JetBrains Mono prompt within the given VS Code extension context.
 *
 * @param context - The VS Code extension context in which the activation prompt is triggered.
 */
function activationPrompt(context) {
    jetbrainsmono.jetbrainsMono_activationPrompt(context);
}
