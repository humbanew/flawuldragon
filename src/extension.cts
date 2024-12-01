import { FileSize } from "./FileSize.cjs";
import { IndentRainbow } from "./IndentRainbow.cjs";
import { JetbrainsIcons } from "./JetbrainsIcons.cjs";
import { JetbrainsMono } from "./JetbrainsMono.cjs";
import { TodoHighlight } from "./TodoHighlight.cjs";
import { Vanilla } from "./Vanilla.cjs";
import * as vscode from "vscode";

const vanilla = new Vanilla();
const jetbrainsmono = new JetbrainsMono();
const jetbrainsicons = new JetbrainsIcons();
const filesize = new FileSize();
const todohighlight = new TodoHighlight();
const indentrainbow = new IndentRainbow();

/**
 * Activates the extension.
 *
 * This function is called when the extension is activated. It is used to set up
 * any necessary state or register commands, providers, etc.
 *
 * @param context - The context in which the extension is activated. This provides
 * access to the extension's global state, subscriptions, and other utilities.
 */
export function activate(context: vscode.ExtensionContext) {
  try {
    console.log("Flawuldragon core hub activated!");

    vanilla.vanilla_activate(context);
    jetbrainsmono.jetbrainsMono_activate(context);
    jetbrainsmono.jetbrainsMono_firstTimeActivation(context);
    jetbrainsicons.jetbrainsIcons_activate(context);
    filesize.filesize_activate(context);
    todohighlight.todoHighlight_activate(context);
    indentrainbow.indentRainbow_activate(context);
  } catch (error) {
    console.log("Flawuldragon core hub - Error: " + error);
    vscode.window.showErrorMessage(
      "An error occurred while activating the Flawuldragon core hub: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
    deactivate(context);
  } finally {}
}

/**
 * Deactivates the extension.
 *
 * This function is called when the extension is deactivated. It can be used to
 * perform any necessary cleanup tasks.
 *
 * @param context - The context in which the extension is running.
 */
export function deactivate(context: vscode.ExtensionContext) {
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
export function activationPrompt(context: vscode.ExtensionContext) {
  jetbrainsmono.jetbrainsMono_activationPrompt(context);
}
