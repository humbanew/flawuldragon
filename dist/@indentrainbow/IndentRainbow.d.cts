import * as vscode from "vscode";
/**
 * The `IndentRainbow` class provides functionality to visually indicate indentation levels in the active text editor
 * for a VSCode extension. It sets up various configurations, decorations, and event listeners to enhance the
 * readability of code by highlighting indentation levels.
 *
 * @class
 * @example
 * // Example usage:
 * const indentrainbow = new IndentRainbow();
 * indentrainbow.indentRainbow_activate(context);
 */
export declare class IndentRainbow {
    /**
     * An array to hold the decoration types.
     * This array is used to store different types of decorations.
     */
    protected static decorationTypes: any[];
    /**
     * A static boolean property indicating whether the action should be performed.
     * Defaults to `false`.
     */
    protected static doIt: boolean;
    /**
     * A flag indicating whether the current instance should be cleared.
     */
    protected static clearMe: boolean;
    /**
     * Stores the current language identifier.
     * This is used to keep track of the language currently being processed or highlighted.
     */
    protected static currentLanguageId: any;
    /**
     * A flag to indicate whether all errors should be skipped.
     * When set to `true`, the system will bypass error handling.
     * Defaults to `false`.
     */
    protected static skipAllErrors: boolean;
    /**
     * A reference to the currently active text editor in the Visual Studio Code window.
     * This property is static and can be accessed without instantiating the class.
     */
    protected static activeEditor: vscode.TextEditor;
    /**
     * The color used to highlight errors in the indentation rainbow.
     * This value is retrieved from the "indentRainbow" configuration in the workspace settings.
     * If the configuration is not set, it defaults to "rgba(128,32,32,0.3)".
     */
    protected static error_color: any;
    /**
     * A static property that defines the decoration type for error highlighting in the text editor.
     * It uses the `vscode.window.createTextEditorDecorationType` method to create a decoration type
     * with a background color specified by `this.error_color`.
     *
     * @protected
     * @static
     */
    protected static error_decoration_type: vscode.TextEditorDecorationType;
    /**
     * The color configuration for tab mix in the Indent Rainbow extension.
     * This value is retrieved from the user's workspace settings under the "indentRainbow" configuration.
     * If the "tabmixColor" setting is not defined, it defaults to an empty string.
     */
    protected static tabmix_color: any;
    /**
     * A static property that holds a `TextEditorDecorationType` instance if `tabmix_color` is not an empty string.
     * The decoration type is created with a background color specified by `tabmix_color`.
     * If `tabmix_color` is an empty string, the property is set to `null`.
     */
    protected static tabmix_decoration_type: vscode.TextEditorDecorationType;
    /**
     * An array of patterns used to ignore specific lines when applying the indent rainbow effect.
     * These patterns are retrieved from the "ignoreLinePatterns" configuration in the "indentRainbow" section
     * of the user's workspace settings. If no patterns are configured, an empty array is used by default.
     */
    protected static ignoreLinePatterns: any;
    /**
     * A configuration setting that determines whether the indent rainbow colors
     * should be applied only to whitespace characters.
     *
     * This setting is retrieved from the "indentRainbow" configuration in the
     * user's VSCode workspace settings. If the setting is not defined, it defaults
     * to `false`.
     */
    protected static colorOnWhiteSpaceOnly: any;
    /**
     * The style of the indent indicator.
     *
     * This value is retrieved from the VS Code workspace configuration
     * under the "indentRainbow" section. If the configuration is not set,
     * it defaults to "classic".
     */
    protected static indicatorStyle: any;
    /**
     * Retrieves the configuration value for the light indicator style line width from the
     * "indentRainbow" settings in the VS Code workspace configuration. If the configuration
     * value is not set, it defaults to 1.
     */
    protected static lightIndicatorStyleLineWidth: any;
    /**
     * An array of RGBA color strings used for indent highlighting.
     * The colors are retrieved from the "indentRainbow" configuration in the workspace settings.
     * If the configuration is not set, a default set of colors is used.
     *
     * Default colors:
     * - "rgba(255,255,64,0.07)" (light yellow)
     * - "rgba(127,255,127,0.07)" (light green)
     * - "rgba(255,127,255,0.07)" (light pink)
     * - "rgba(79,236,236,0.07)" (light cyan)
     */
    protected static colors: any;
    /**
     * A static property that holds a timeout identifier.
     * It can be a string, a number, or a NodeJS.Timeout object.
     * Initially set to null.
     */
    protected static timeout: string | number | NodeJS.Timeout;
    /**
     * Activates the Indent Rainbow feature for the VSCode extension.
     * This function sets up various configurations, decorations, and event listeners
     * to visually indicate indentation levels in the active text editor.
     *
     * @param {vscode.ExtensionContext} context - The context in which the extension is running.
     *
     * @throws Will throw an error if there is an issue during activation.
     *
     * Configuration options:
     * - `indentRainbow.errorColor`: Color for indicating indentation errors.
     * - `indentRainbow.tabmixColor`: Color for indicating mixed tab and space indentation.
     * - `indentRainbow.ignoreLinePatterns`: Array of regex patterns to ignore specific lines.
     * - `indentRainbow.colorOnWhiteSpaceOnly`: Boolean to color only whitespace.
     * - `indentRainbow.indicatorStyle`: Style of the indicator, either "classic" or "light".
     * - `indentRainbow.lightIndicatorStyleLineWidth`: Line width for the light indicator style.
     * - `indentRainbow.colors`: Array of colors to cycle through for indentation levels.
     * - `indentRainbow.ignoreErrorLanguages`: Array of languages to ignore indentation errors.
     * - `indentRainbow.includedLanguages`: Array of languages to include for indentation decoration.
     * - `indentRainbow.excludedLanguages`: Array of languages to exclude from indentation decoration.
     * - `indentRainbow.updateDelay`: Delay in milliseconds before updating decorations.
     *
     * Listens for:
     * - Active text editor changes to reconfigure and update decorations.
     * - Text document changes to update decorations.
     * - Configuration changes in the `indentRainbow` section to prompt for a window reload.
     */
    indentRainbow_activate(context: vscode.ExtensionContext): void;
    /**
     * Deactivates the indent rainbow feature.
     *
     * This function is called when the extension is deactivated. It can be used to perform any necessary cleanup tasks.
     */
    indentRainbow_desactivate(): void;
}
//# sourceMappingURL=IndentRainbow.d.cts.map