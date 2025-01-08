import * as vscode from 'vscode';
/**
 * Activates the extension.
 *
 * This function is called when the extension is activated. It is used to set up
 * any necessary state or register commands, providers, etc.
 *
 * @param context - The context in which the extension is activated. This provides
 * access to the extension's global state, subscriptions, and other utilities.
 */
export declare function activate(context: vscode.ExtensionContext): void;
/**
 * Deactivates the extension.
 *
 * This function is called when the extension is deactivated. It can be used to
 * perform any necessary cleanup tasks.
 *
 * @param context - The context in which the extension is running.
 */
export declare function deactivate(context: vscode.ExtensionContext): void;
/**
 * Activates the JetBrains Mono prompt within the given VS Code extension context.
 *
 * @param context - The VS Code extension context in which the activation prompt is triggered.
 */
export declare function activationPrompt(context: vscode.ExtensionContext): void;
//# sourceMappingURL=extension.d.cts.map