/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as path from "node:path";
import * as vscode from "vscode";
import { IFDCustomFontsSetupConfig, IJBMGeneralObject } from "./declares";
import { Global } from "../globalDefs";
import { readFileSync, writeFileSync } from "fs";

/**
 * The `JetbrainsMono` class provides methods to manage the JetBrains Mono font settings
 * within a Visual Studio Code extension. It includes functionalities to activate, deactivate,
 * and update font settings, as well as to prompt the user for activation and handle first-time
 * activation scenarios.
 *
 * @class
 * @example
 * // Example usage:
 * const customFonts = new FDCustomFonts();
 * customFonts.activate(context);
 */
export class FDCustomFonts {
    /**
     * Default settings for the custom font.
     * @property {string} editor.fontFamily - The font family name.
     * @property {boolean} editor.fontLigatures - Whether font ligatures are enabled.
     */
    protected defaultSettings = {
        "editor.fontFamily": "JetBrains Mono",
        "editor.fontLigatures": true,
        "accessibility.signals.lineHasError": { sound: "on" },
    };
    protected static actualSetupConfig = JSON.parse(
        readFileSync(__dirname + "/setupCustomFontsConfig.json", "utf-8")
    ) as IFDCustomFontsSetupConfig;
    protected static dynamicSetupConfig: IFDCustomFontsSetupConfig = {
        "actual-customfonts-statusbar-text":
            FDCustomFonts.actualSetupConfig["actual-customfonts-statusbar-text"] as string,
        "actual-customfonts-statusbar-tooltip":
            FDCustomFonts.actualSetupConfig["actual-customfonts-statusbar-tooltip"] as string,
    };

    /**
     * Status bar item for switching custom fonts.
     */
    protected switchCustomFontsStatusBar: vscode.StatusBarItem =
        Global.customFonts.statusBar;

    /**
     * Displays an information message to the user.
     *
     * This method is a reference to `vscode.window.showInformationMessage`.
     *
     * @param message The message to display.
     * @param items A set of items that will be rendered as actions in the message.
     * @returns A promise that resolves to the selected item or `undefined` when being dismissed.
     */
    protected showDialog = vscode.window.showInformationMessage;

    /**
     * Resolves the path to the JetBrainsMono directory within the extension.
     *
     * @param context - The context of the VSCode extension, which provides the extension's path.
     * @returns The resolved path to the "JetBrainsMono" directory.
     */
    protected path = (context: vscode.ExtensionContext) =>
        path.resolve(context.extensionPath, "assets/customfonts");

    /**
     * Updates the user settings in the JetBrains Mono configuration.
     *
     * @param settings - An object containing key-value pairs of settings to be updated.
     * @param remove - A boolean flag indicating whether to remove the settings. Defaults to false.
     */
    protected updateUserSettings = (
        settings: IJBMGeneralObject,
        remove = false
    ) =>
        Object.entries(settings).forEach(([key, value]) =>
            vscode.workspace
                .getConfiguration()
                .update(
                    key,
                    remove ? undefined : value,
                    vscode.ConfigurationTarget.Global
                )
        );

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
    protected dirOpen(dirPath: string) {
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
    protected activation(context: vscode.ExtensionContext) {
        const JetBrainsMonoAddress = this.path(context);
        this.updateUserSettings(this.defaultSettings);
        this.dirOpen(JetBrainsMonoAddress);
        this.showDialog(
            `${context.extension.packageJSON.displayName} - Custom Fonts is activated!`
        );
        this.showDialog(
            `Important Note - Don't forget to install fonts! Font Directory will open, once you have manually installed fonts, restart VSCODE - ${JetBrainsMonoAddress}`
        );
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
    public activationPrompt = (context: vscode.ExtensionContext) =>
        this.showDialog(
            "Activate Custom Fonts for Flawuldragon?",
            "Yes",
            "No"
        ).then((value) =>
            value === "Yes"
                ? this.activation(context)
                : (this.showDialog(
                      "You can activate Custom Fonts later by running 'CustomFonts' in command palette."
                  ) as any)
        );

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
    public firstTimeActivation(context: vscode.ExtensionContext) {
        const version = context.extension.packageJSON.version ?? "0.0.17";
        const previousVersion = context.globalState.get(context.extension.id);
        if (previousVersion === version) return;

        this.activation(context);
        context.globalState.update(context.extension.id, version);
    }

    /**
     * Activates the JetBrains Mono Integration settings.
     * @param {vscode.ExtensionContext} context - The context in which the extension is activated.
     */
    public activate(context: vscode.ExtensionContext) {
        try {
            console.log("Flawuldragon - Custom Fonts activated!");
            console.log(
                `Congratulations, your extension "${context.extension.packageJSON.displayName} - Custom Fonts installed!"`
            );
            let activateCommand = vscode.commands.registerCommand(
                Global.customFonts.comandos.activate,
                () => this.activation(context)
            );
            let deactivateCommand = vscode.commands.registerCommand(
                Global.customFonts.comandos.deactivate,
                () => this.desactivate(context)
            );
            let switchCommand = vscode.commands.registerCommand(
                Global.customFonts.comandos.switch,
                () => this.switchCustomFonts()
            );

            context.subscriptions.push(
                activateCommand,
                deactivateCommand,
                switchCommand
            );
            this.switchCustomFontsStatusBar.text = FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"];
            this.switchCustomFontsStatusBar.tooltip = FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"];
            this.switchCustomFontsStatusBar.command =
                Global.customFonts.comandos.switch;
            this.switchCustomFontsStatusBar.show();
            this.switchCustomFontsStatusBar.color = "gold";
        } catch (error) {
            console.log("Flawuldragon - Custom Fonts error: " + error);
            vscode.window.showErrorMessage(
                "An error occurred while activating the custom fonts integration feature: " +
                    error +
                    ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)"
            );
            this.desactivate(context);
        } finally {
        }
    }

    protected switchCustomFonts(): any {
        vscode.window
            .showQuickPick([
                "$(microsoft-font-cf-icon) Microsoft Font",
                "$(cascadia-code-cf-icon) Default VS Code",
                "$(jetbrains-mono-cf-icon) JetBrains Mono",
                "$(fira-mono-cf-icon) Fira Mono",
                "$(intel-one-mono-cf-icon) Intel One Mono",
                "$(pt-mono-cf-icon) PT Mono",
                "$(space-mono-cf-icon) Space Mono",
                "$(ubuntu-mono-cf-icon) Ubuntu Mono",
                "$(martian-mono-cf-icon) Martian Mono",
                "$(martian-mono-condensed-cf-icon) Martian Mono Condensed",
                "$(martian-mono-semicondensed-cf-icon) Martian Mono Semicondensed",
                "$(martian-mono-semiexpanded-cf-icon) Martian Mono Semiexpanded",
                "$(reddit-mono-cf-icon) Reddit Mono",
                "$(cascadia-code-cf-icon) Cascadia Code",
                "$(google-sans-code-cf-icon) Google Sans Code",
                "$(redhat-mono-cf-icon) Red Hat Mono",
                "$(sometype-mono-cf-icon) Sometype Mono",
                "$(ubuntu-sans-mono-cf-icon) Ubuntu Sans Mono",
                "$(azeret-mono-cf-icon) Azeret Mono",
                "$(chivo-mono-cf-icon) Chivo Mono",
                "$(fragment-mono-cf-icon) Fragment Mono",
                "$(overpass-mono-cf-icon) Overpass Mono",
                "$(oxygen-mono-cf-icon) Oxygen Mono",
            ])
            .then((selectedFont) => {
                if (selectedFont) {
                    if (
                        selectedFont ===
                        "$(microsoft-font-cf-icon) Microsoft Font"
                    ) {
                        let text = "$(microsoft-font-cf-icon) CF";
                        let tooltip = "Switch Editor Font | Actual: Microsoft Font";
                        this.switchCustomFontsStatusBar.text = text;
                        this.switchCustomFontsStatusBar.tooltip = tooltip;
                        FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                        FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                        writeFileSync(
                            __dirname + "/setupCustomFontsConfig.json",
                            JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                        );
                        this.updateUserSettings({
                            "editor.fontFamily": "Segoe UI",
                        });
                    } else if (
                        selectedFont ===
                        "$(cascadia-code-cf-icon) Default VS Code"
                    ) {
                        let text = "$(cascadia-code-cf-icon) CF";
                        let tooltip = "Switch Editor Font | Actual: Default VS Code";
                        this.switchCustomFontsStatusBar.text = text;
                        this.switchCustomFontsStatusBar.tooltip = tooltip;
                        FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                        FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                        writeFileSync(
                            __dirname + "/setupCustomFontsConfig.json",
                            JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                        );
                        this.updateUserSettings({
                            "editor.fontFamily": "monospace",
                        });
                    } else {
                        let text, tooltip;
                        switch (selectedFont) {
                            case "$(jetbrains-mono-cf-icon) JetBrains Mono":
                                text = "$(jetbrains-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: JetBrains Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(fira-mono-cf-icon) Fira Mono":
                                text = "$(fira-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Fira Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(intel-one-mono-cf-icon) Intel One Mono":
                                text = "$(intel-one-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Intel One Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(pt-mono-cf-icon) PT Mono":
                                text = "$(pt-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: PT Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(pt-mono-cf-icon) PT Mono":
                                text = "$(pt-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: PT Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(space-mono-cf-icon) Space Mono":
                                text = "$(space-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Space Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(space-mono-cf-icon) Space Mono":
                                text = "$(space-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Space Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(ubuntu-mono-cf-icon) Ubuntu Mono":
                                text = "$(ubuntu-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Ubuntu Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(ubuntu-mono-cf-icon) Ubuntu Mono":
                                text = "$(ubuntu-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Ubuntu Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(martian-mono-cf-icon) Martian Mono":
                                text = "$(martian-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Martian Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(martian-mono-condensed-cf-icon) Martian Mono Condensed":
                                text = "$(martian-mono-condensed-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Martian Mono Condensed";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(martian-mono-semicondensed-cf-icon) Martian Mono Semicondensed":
                                text = "$(martian-mono-semicondensed-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Martian Mono Semicondensed";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(martian-mono-seiexpanded-cf-icon) Martian Mono Semiexpanded":
                                text = "$(martian-mono-seiexpanded-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Martian Mono Semiexpanded";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(reddit-mono-cf-icon) Reddit Mono":
                                text = "$(reddit-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Reddit Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(cascadia-code-cf-icon) Cascadia Code":
                                text = "$(cascadia-code-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Cascadia Code";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(google-sans-code-cf-icon) Google Sans Code":
                                text = "$(google-sans-code-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Google Sans Code";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(red-hat-mono-cf-icon) Red Hat Mono":
                                text = "$(red-hat-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Red Hat Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(sometype-mono-cf-icon) Sometype Mono":
                                text = "$(sometype-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Sometype Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(ubuntu-sans-mono-cf-icon) Ubuntu Sans Mono":
                                text = "$(ubuntu-sans-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Ubuntu Sans Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(azeret-mono-cf-icon) Azeret Mono":
                                text = "$(azeret-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Azeret Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(chivo-mono-cf-icon) Chivo Mono":
                                text = "$(chivo-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Chivo Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(fragment-mono-cf-icon) Fragment Mono":
                                text = "$(fragment-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Fragment Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(overpass-mono-cf-icon) Overpass Mono":
                                text = "$(overpass-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Overpass Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                            case "$(oxygen-mono-cf-icon) Oxygen Mono":
                                text = "$(oxygen-mono-cf-icon) CF";
                                tooltip = "Switch Editor Font | Actual: Oxygen Mono";
                                this.switchCustomFontsStatusBar.text = text;
                                this.switchCustomFontsStatusBar.tooltip = tooltip;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-text"] = text;
                                FDCustomFonts.dynamicSetupConfig["actual-customfonts-statusbar-tooltip"] = tooltip;
                                writeFileSync(
                                    __dirname + "/setupCustomFontsConfig.json",
                                    JSON.stringify(FDCustomFonts.dynamicSetupConfig, null, 2)
                                );
                                break;
                        }
                        this.updateUserSettings({
                            // remove the icon part from the selected font string
                            "editor.fontFamily": selectedFont
                                .split(") ")[1]
                                .replace(/ /g, " "),
                        });
                    }
                }
            });
    }

    /**
     * Deactivates the JetBrains Mono Integration settings.
     */
    public desactivate(context: vscode.ExtensionContext) {
        // context.globalState.update(context.extension.id, undefined);
        this.updateUserSettings(this.defaultSettings, true);
        this.showDialog(
            `${context.extension.packageJSON.displayName} is deactivated!`
        );
    }
}
