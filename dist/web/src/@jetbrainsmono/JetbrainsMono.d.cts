import * as vscode from "vscode";
import { IJBMGeneralObject } from "./declares";
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
export declare class JetbrainsMono {
    /**
     * Default settings for the JetBrains Mono font.
     * @property {string} editor.fontFamily - The font family name.
     * @property {boolean} editor.fontLigatures - Whether font ligatures are enabled.
     */
    protected jetbrainsMono_defaultSettings: {
        "editor.fontFamily": string;
        "editor.fontLigatures": boolean;
        "accessibility.signals.lineHasError": {
            sound: string;
        };
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
    protected jetbrainsMono_showDialog: typeof vscode.window.showInformationMessage;
    /**
     * Resolves the path to the JetBrainsMono directory within the extension.
     *
     * @param context - The context of the VSCode extension, which provides the extension's path.
     * @returns The resolved path to the "JetBrainsMono" directory.
     */
    protected jetbrainsMono_path: (context: vscode.ExtensionContext) => string;
    /**
     * Updates the user settings in the JetBrains Mono configuration.
     *
     * @param settings - An object containing key-value pairs of settings to be updated.
     * @param remove - A boolean flag indicating whether to remove the settings. Defaults to false.
     */
    protected jetbrainsMono_updateUserSettings: (settings: IJBMGeneralObject, remove?: boolean) => void;
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
    protected jetbrainsMono_dirOpen(dirPath: string): any;
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
    protected jetbrainsMono_activation(context: vscode.ExtensionContext): void;
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
    jetbrainsMono_activationPrompt: (context: vscode.ExtensionContext) => PromiseLike<any>;
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
    jetbrainsMono_firstTimeActivation(context: vscode.ExtensionContext): void;
    /**
     * Activates the JetBrains Mono Integration settings.
     * @param {vscode.ExtensionContext} context - The context in which the extension is activated.
     */
    jetbrainsMono_activate(context: vscode.ExtensionContext): void;
    /**
     * Deactivates the JetBrains Mono Integration settings.
     */
    jetbrainsMono_desactivate(context: vscode.ExtensionContext): void;
}
//# sourceMappingURL=JetbrainsMono.d.cts.map