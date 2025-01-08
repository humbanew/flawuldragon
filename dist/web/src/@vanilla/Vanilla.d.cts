import * as vscode from 'vscode';
/**
 * Interface Save Mode Display StatusBar
 * 1- Display datetime default visualization (date - time)
 * 2- Display datetime invert position visualization (time - date)
 * 3- Display datetime with seconds visualization
 * 4- Display datetime with custom time format
 */
/**
 * Represents the Vanilla class which is responsible for managing the Flawuldragon extension's status bar item.
 *
 * The Vanilla class provides methods to activate and deactivate the Flawuldragon extension, including setting up
 * the status bar item, registering commands, and handling the extension's enabled/disabled state.
 *
 * @class
 * @example
 * // Example usage:
 * const vanilla = new Vanilla();
 * vanilla.vanilla_activate(context);
 */
export declare class Vanilla {
    /**
     * A status bar item for the Flawuldragon extension.
     * This status bar item is aligned to the left with a priority of 100.
     */
    protected flawuldragonStatusBar: vscode.StatusBarItem;
    /**
     * A status bar item that displays the date and time for the Flawuldragon extension.
     *
     * This status bar item is aligned to the left with a priority of 98.
     * It is created using the `vscode.window.createStatusBarItem` method.
     */
    protected flawuldragonDateTimeStatusBar: vscode.StatusBarItem;
    /**
     * A unique identifier for the status bar item associated with the Flawuldragon extension.
     * This ID is used to register and manage the status bar item within the extension.
     */
    protected flawuldragonStatusbaritemId: string;
    protected vanilla_flawuldragonNotes(context: vscode.ExtensionContext): void;
    protected vanilla_checkingIsOk(): void;
    vanilla_interruptorStatusBarConstructor(statusBarItem: vscode.StatusBarItem, command: string): void;
    protected vanilla_dateTimeComponent(context: vscode.ExtensionContext): void;
    /**
     * Activates the Flawuldragon extension.
     *
     * This method sets up the status bar item and command for the Flawuldragon extension.
     * It creates a webview panel to display Flawuldragon Notes and configures the status bar item
     * with appropriate text, color, and tooltip. If the extension is disabled in the settings,
     * it updates the status bar item to reflect the disabled state and shows a warning message.
     *
     * @param context - The extension context provided by VS Code.
     */
    vanilla_activate(context: vscode.ExtensionContext): void;
    /**
     * Deactivates the vanilla feature by disposing of the flawuldragon status bar.
     */
    vanilla_desactivate(): void;
}
//# sourceMappingURL=Vanilla.d.cts.map