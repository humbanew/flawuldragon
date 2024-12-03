"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JetbrainsMono = void 0;
const path = require("node:path");
const vscode = require("vscode");
/**
 * The `JetbrainsMono` class provides methods to manage the JetBrains Mono font settings
 * within a Visual Studio Code extension. It includes functionalities to activate, deactivate,
 * and update font settings, as well as to prompt the user for activation and handle first-time
 * activation scenarios.
 *
 * @class
 * @example
 * // Example usage:
 * const jetbrainsMono = new JetbrainsMono();
 * jetbrainsMono.jetbrainsMono_activate(context);
 */
class JetbrainsMono {
    /**
     * Default settings for the JetBrains Mono font.
     * @property {string} editor.fontFamily - The font family name.
     * @property {boolean} editor.fontLigatures - Whether font ligatures are enabled.
     */
    jetbrainsMono_defaultSettings = {
        "editor.fontFamily": "JetBrains Mono",
        "editor.fontLigatures": true,
        "accessibility.signals.lineHasError": { "sound": "on" },
    };
    /**
     * Displays an information message to the user.
     *
     * This method is a reference to `vscode.window.showInformationMessage`.
     *
     * @param message The message to display.
     * @param items A set of items that will be rendered as actions in the message.
     * @returns A promise that resolves to the selected item or `undefined` when being dismissed.
     */
    jetbrainsMono_showDialog = vscode.window.showInformationMessage;
    /**
     * Resolves the path to the JetBrainsMono directory within the extension.
     *
     * @param context - The context of the VSCode extension, which provides the extension's path.
     * @returns The resolved path to the "JetBrainsMono" directory.
     */
    jetbrainsMono_path = (context) => path.resolve(context.extensionPath, "JetBrainsMono");
    /**
     * Updates the user settings in the JetBrains Mono configuration.
     *
     * @param settings - An object containing key-value pairs of settings to be updated.
     * @param remove - A boolean flag indicating whether to remove the settings. Defaults to false.
     */
    jetbrainsMono_updateUserSettings = (settings, remove = false) => Object.entries(settings).forEach(([key, value]) => vscode.workspace
        .getConfiguration()
        .update(key, remove ? undefined : value, vscode.ConfigurationTarget.Global));
    /**
     * Opens the specified directory in the default file explorer for the current platform.
     *
     * @param dirPath - The path of the directory to open.
     * @returns The child process instance created to execute the command.
     *
     * The command used to open the directory varies based on the operating system:
     * - On macOS (darwin), it uses the `open` command.
     * - On Windows (win32), it uses the `explorer` command.
     * - On other platforms, it uses the `xdg-open` command.
     */
    jetbrainsMono_dirOpen(dirPath) {
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
    /**
     * Activates the JetBrains Mono font for the extension.
     *
     * @param context - The extension context provided by VSCode.
     *
     * This method performs the following actions:
     * 1. Retrieves the path to the JetBrains Mono font.
     * 2. Updates the user settings with the default JetBrains Mono settings.
     * 3. Opens the directory containing the JetBrains Mono font.
     * 4. Displays a dialog indicating that the JetBrains Mono font is activated.
     * 5. Displays an important note reminding the user to install the fonts manually and restart VSCode.
     */
    jetbrainsMono_activation(context) {
        const JetBrainsMonoAddress = this.jetbrainsMono_path(context);
        this.jetbrainsMono_updateUserSettings(this.jetbrainsMono_defaultSettings);
        this.jetbrainsMono_dirOpen(JetBrainsMonoAddress);
        this.jetbrainsMono_showDialog(`${context.extension.packageJSON.displayName} - Jetbrains Mono Font is activated!`);
        this.jetbrainsMono_showDialog(`Important Note - Don't forget to install fonts! Font Directory will open, once you have manually installed fonts, restart VSCODE - ${JetBrainsMonoAddress}`);
    }
    /**
     * Prompts the user to activate the JetBrains Mono font for Flawuldragon.
     *
     * @param context - The VSCode extension context.
     * @returns A promise that resolves when the user makes a selection in the dialog.
     *
     * The function shows a dialog asking the user if they want to activate the JetBrains Mono font.
     * If the user selects "Yes", the font is activated.
     * If the user selects "No", another dialog is shown informing them that they can activate the font later.
     */
    jetbrainsMono_activationPrompt = (context) => this.jetbrainsMono_showDialog("Activate JetBrains Mono Font for Flawuldragon?", "Yes", "No").then((value) => value === "Yes"
        ? this.jetbrainsMono_activation(context)
        : this.jetbrainsMono_showDialog("You can activate JetBrains Mono later by running 'JetBrainsMono' or 'JetBrainsMono' in command palette."));
    /**
     * Handles the first-time activation of the JetbrainsMono extension.
     *
     * This method checks the current version of the extension against the previously
     * stored version in the global state. If the versions match, it returns early.
     * Otherwise, it triggers the activation process and updates the stored version.
     *
     * @param context - The extension context provided by VS Code, which includes
     *                  information about the extension's environment and state.
     */
    jetbrainsMono_firstTimeActivation(context) {
        const version = context.extension.packageJSON.version ?? "1.0.0";
        const previousVersion = context.globalState.get(context.extension.id);
        if (previousVersion === version)
            return;
        this.jetbrainsMono_activation(context);
        context.globalState.update(context.extension.id, version);
    }
    /**
     * Activates the JetBrains Mono Integration settings.
     * @param {vscode.ExtensionContext} context - The context in which the extension is activated.
     */
    jetbrainsMono_activate(context) {
        try {
            console.log("Flawuldragon - Jetbrains Mono Font activated!");
            console.log(`Congratulations, your extension "${context.extension.packageJSON.displayName} - Jetbrains Mono Font installed!"`);
            let activateCommand = vscode.commands.registerCommand("fd_jetbrainsmonofont.activate", () => this.jetbrainsMono_activation(context));
            let deactivateCommand = vscode.commands.registerCommand("fd_jetbrainsmonofont.deactivate", () => this.jetbrainsMono_desactivate(context));
            context.subscriptions.push(activateCommand, deactivateCommand);
        }
        catch (error) {
            console.log("Flawuldragon - Jetbrains Mono Font error: " + error);
            vscode.window.showErrorMessage("An error occurred while activating the jetbrains mono font pack integration feature: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
            this.jetbrainsMono_desactivate(context);
        }
        finally { }
    }
    /**
     * Deactivates the JetBrains Mono Integration settings.
     */
    jetbrainsMono_desactivate(context) {
        // context.globalState.update(context.extension.id, undefined);
        this.jetbrainsMono_updateUserSettings(this.jetbrainsMono_defaultSettings, true);
        this.jetbrainsMono_showDialog(`${context.extension.packageJSON.displayName} is deactivated!`);
    }
}
exports.JetbrainsMono = JetbrainsMono;
