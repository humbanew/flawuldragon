import * as vscode from "vscode";
/**
 * A class that provides functionality to display the file size of the currently active text editor's document
 * in the Visual Studio Code status bar. It includes methods to retrieve and convert file sizes, as well as
 * activate and deactivate the file size display functionality.
 *
 * @class
 * @example
 * // Example usage:
 * const filesize = new FileSize();
 * filesize.filesize_activate(context);
 */
export declare class FileSize {
    /**
     * A status bar item that displays the file size in the Visual Studio Code editor.
     * It is aligned to the left side of the status bar with a priority of 96.
     */
    protected filesizeStatusBar: vscode.StatusBarItem;
    /**
     * Retrieves the current file size of the active text editor's document and updates the provided status item with the file size.
     *
     * @param statusItem - An object containing a text property and a show method. The text property will be updated with the file size, and the show method will be called to display the status item.
     * @returns A promise that resolves when the file size has been retrieved and the status item has been updated.
     */
    protected filesize_getCurrentFileSize(statusItem: {
        text: string | undefined;
        show: () => void;
    }): void;
    /**
     * Converts a file size in bytes to a human-readable string format.
     *
     * @param size - The size of the file in bytes.
     * @returns A string representing the file size in B, KB, MB, GB and TB.
     */
    protected filesize_convertSize(size: number): string;
    /**
     * Activates the file size functionality within the given VS Code extension context.
     *
     * @param content - The VS Code extension context in which the file size functionality is activated.
     */
    filesize_activate(content: vscode.ExtensionContext): void;
    /**
     * Deactivates the file size functionality.
     *
     * This method is intended to be used to disable or deactivate any operations
     * or features related to file size within the application.
     */
    filesize_desactivate(): void;
}
//# sourceMappingURL=FileSize.d.cts.map