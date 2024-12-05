"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlawuldragonIDElements = void 0;
const vscode = require("vscode");
class FlawuldragonIDElements {
    /**
     * Contains the status bar items and their respective IDs for the Flawuldragon extension.
     *
     * @property {Object} statusBars - An object containing various status bar items.
     * @property {vscode.StatusBarItem} statusBars.flawuldragonStatusBar - A status bar item for the Flawuldragon extension, aligned to the left with a priority of 100.
     * @property {vscode.StatusBarItem} statusBars.flawuldragonDateTimeStatusBar - A status bar item that displays the date and time for the Flawuldragon extension, aligned to the left with a priority of 99.
     * @property {vscode.StatusBarItem} statusBars.flawuldragonFilesizeStatusBar - A status bar item that displays the file size in the Visual Studio Code editor, aligned to the left with a priority of 98.
     * @property {vscode.StatusBarItem} statusBars.flawuldragonTodoHighlightStatusBarItem - A status bar item that displays the todo highlight notations list in the Visual Studio Code editor, aligned to the left with a priority of 97.
     *
     * @property {Object} ids - An object containing the IDs for the status bar items.
     * @property {string} ids.flawuldragonStatusbaritemId - The ID for the Flawuldragon status bar item.
     */
    sources = {
        statusBars: {
            /**
             * A status bar item for the Flawuldragon extension.
             * This status bar item is aligned to the left with a priority of 100.
             */
            flawuldragonStatusBar: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100),
            /**
             * A status bar item that displays the date and time for the Flawuldragon extension.
             * This status bar item is aligned to the left with a priority of 99.
             */
            flawuldragonDateTimeStatusBar: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99),
            /**
             * A status bar item that displays the file size in the Visual Studio Code editor.
             * It is aligned to the left side of the status bar with a priority of 98.
             */
            flawuldragonFilesizeStatusBar: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98),
            /**
             * A status bar item that displays the todo highlight notations list in the Visual Studio Code editor.
             * It is aligned to the left side of the status bar with a priority of 97.
             */
            flawuldragonTodoHighlightStatusBarItem: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 97)
        },
        ids: {
            /**
             * A status bar item id for the Flawuldragon extension.
             * This status bar item id declaration.
             */
            flawuldragonStatusbaritemId: "flawuldragon.extension.infos"
        },
    };
}
exports.FlawuldragonIDElements = FlawuldragonIDElements;
