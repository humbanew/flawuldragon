import * as vscode from 'vscode';
export declare class ThemeSwitch {
    /**
     * The context provided by the Visual Studio Code extension API.
     * This context is used to interact with the VS Code environment,
     * such as accessing global state, subscriptions, and other extension-specific resources.
     *
     * @protected
     * @type {vscode.ExtensionContext}
     */
    protected context: vscode.ExtensionContext;
    /**
     * A protected optional property representing a status bar item in Visual Studio Code.
     * This property can be used to switch themes or perform other status bar related actions.
     */
    protected switch?: vscode.StatusBarItem;
    /**
     * @protected
     * @property {vscode.WorkspaceConfiguration} config - The configuration settings for the workspace.
     */
    protected config: vscode.WorkspaceConfiguration;
    /**
     * Optional property to store the name or identifier of the dark theme.
     * This can be used to apply a dark theme to the application or component.
     */
    protected darkTheme?: string;
    /**
     * The CSS class name or identifier for the light theme.
     * This property is optional and may not be defined.
     */
    protected lightTheme?: string;
    /**
     * Initializes the theme switch context by setting the provided context and configuration.
     * Calls the themeSwitch_Initialize method to complete the initialization process.
     *
     * @param context - The VS Code extension context.
     */
    protected themeSwitch_context(context: vscode.ExtensionContext): void;
    /**
     * Initializes the theme switch functionality.
     *
     * This method performs the following tasks:
     * - Converts old theming settings to the new format.
     * - Registers commands for switching to dark and light themes.
     * - Registers a command for toggling between dark and light themes.
     * - Updates the theme settings based on the current configuration.
     *
     * The following commands are registered:
     * - `flawuldragon.themeswitch.darktheme`: Switches to the preferred dark theme.
     * - `flawuldragon.themeswitch.lighttheme`: Switches to the preferred light theme.
     * - `flawuldragon.themeswitch.toggle`: Toggles between the preferred dark and light themes.
     *
     * If the current theme is not the preferred dark or light theme, the user is prompted to set it as the preferred theme.
     *
     * @protected
     */
    protected themeSwitch_Initialize(): void;
    /**
     * Destroys the theme switch by disposing of any resources it holds.
     * If the switch exists and has a dispose method, it will be called.
     *
     * @protected
     */
    protected themeSwitch_destroy(): void;
    /**
     * Handles the configuration update event for the theme switcher.
     *
     * This method is triggered when there is a change in the configuration.
     * It checks if the configuration change affects the 'themeswitch.priority' setting
     * and updates the theme accordingly.
     *
     * @param ev - The configuration change event.
     */
    protected themeSwitch_configUpdate(ev: vscode.ConfigurationChangeEvent): void;
    /**
     * Switches the theme based on the configuration setting 'themeswitch.toggleDefaultDark'.
     * If 'themeswitch.toggleDefaultDark' is set to true, it switches to the dark theme.
     * Otherwise, it switches to the light theme.
     *
     * @protected
     */
    protected themeSwitch_fallbackToTheme(): void;
    /**
     * Updates or creates the theme switch status bar item.
     *
     * @param {boolean} [force=false] - If true, forces the creation of the switch even if it already exists.
     *
     * This method ensures that the theme switch status bar item is created and displayed.
     * If the switch already exists and `force` is true, it disposes of the existing switch and creates a new one.
     * The switch is configured with a warning background color, a command to toggle the theme, an icon, and a tooltip.
     * The switch is then added to the context's subscriptions and shown in the status bar.
     */
    protected themeSwitch_update(force?: boolean): void;
    /**
     * Retrieves the current theme configuration from the VS Code workspace settings.
     * It sets the `darkTheme` and `lightTheme` properties based on the user's preferred themes.
     *
     * @protected
     */
    protected themeSwitch_getTheme(): void;
    /**
     * Registers a command with the given URI and callback function.
     *
     * @param uri - The unique identifier for the command.
     * @param callback - The function to be executed when the command is invoked.
     *                   It can accept any number of arguments.
     */
    protected themeSwitch_registerCommand(uri: string, callback: (...args: any[]) => any): void;
    /**
     * Activates the theme switch functionality for the Flawuldragon extension.
     *
     * @param {vscode.ExtensionContext} context - The context provided by the VS Code extension host.
     *
     * This method sets up the theme switch context and listens for configuration changes.
     * If an error occurs during activation, it logs the error to the console and shows an error message to the user.
     *
     * Error messages include a link to the Humbanew support team for assistance.
     */
    themeSwitch_activate(context: vscode.ExtensionContext): void;
    /**
     * Deactivates the theme switch by destroying it.
     * This method calls the `themeSwitch_destroy` method to perform the destruction.
     */
    themeSwitch_desactivate(): void;
}
//# sourceMappingURL=ThemeSwitch.d.cts.map