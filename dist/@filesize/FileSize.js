"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSize = void 0;
const fs = __importStar(require("node:fs"));
const vscode = __importStar(require("vscode"));
const Vanilla_js_1 = require("../@vanilla/Vanilla.js");
const constants_js_1 = require("../constants.js");
const vanillaFeatures = new Vanilla_js_1.Vanilla();
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
class FileSize {
    /**
     * A status bar item that displays the file size in the Visual Studio Code editor.
     * It is aligned to the left side of the status bar with a priority of 96.
     */
    filesizeStatusBar = constants_js_1.constants.statusBar.positions.posE;
    /**
     * Retrieves the current file size of the active text editor's document and updates the provided status item with the file size.
     *
     * @param statusItem - An object containing a text property and a show method. The text property will be updated with the file size, and the show method will be called to display the status item.
     * @returns A promise that resolves when the file size has been retrieved and the status item has been updated.
     */
    filesize_getCurrentFileSize(statusItem) {
        new Promise((resolve) => {
            let _filepath = vscode.window.activeTextEditor
                ? vscode.window.activeTextEditor.document.fileName
                : "";
            resolve(_filepath);
        }).then((filepath) => {
            if (filepath == "") {
                if (!fs.existsSync(filepath)) {
                    return;
                }
                statusItem.text = "No file";
                statusItem.show();
                return;
            }
            let _size = fs.statSync(filepath).size;
            let _sizeText = this.filesize_convertSize(_size);
            statusItem.text = _sizeText;
            statusItem.show();
        });
    }
    /**
     * Converts a file size in bytes to a human-readable string format.
     *
     * @param size - The size of the file in bytes.
     * @returns A string representing the file size in B, KB, MB, GB and TB.
     */
    filesize_convertSize(size) {
        if (size < 1024) {
            return `${size} B`;
        }
        else if (size >= 1024 && size < 1048576) {
            return `${Math.floor(size / 10.24 / 100)} KB`;
        }
        else if (size > 1048576) {
            return `${Math.floor(size / 10485.76) / 100} MB`;
        }
        else if (size > 1073741824) {
            return `${Math.floor(size / 10737418.24) / 100} GB`;
        }
        else {
            return `${Math.floor(size / 1099511627776) / 100} TB`;
        }
    }
    /**
     * Activates the file size functionality within the given VS Code extension context.
     *
     * @param content - The VS Code extension context in which the file size functionality is activated.
     */
    filesize_activate(content) {
        try {
            console.log("Flawuldragon - File size activated!");
            this.filesizeStatusBar.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
            this.filesize_getCurrentFileSize(this.filesizeStatusBar);
            this.filesizeStatusBar.tooltip = "Filesize of the current document";
            content.subscriptions.push(vscode.commands.registerCommand(constants_js_1.constants.commands.filesize.release.fdFilesizeInfo, () => {
                this.filesize_getCurrentFileSize(this.filesizeStatusBar);
            }));
            let statusBarCommand = constants_js_1.constants.commands.filesize.release.fdFilesize;
            vanillaFeatures.vanilla_interruptorStatusBarConstructor(this.filesizeStatusBar, statusBarCommand);
            vscode.window.onDidChangeActiveTextEditor(() => {
                this.filesize_getCurrentFileSize(this.filesizeStatusBar);
            });
            vscode.workspace.onDidSaveTextDocument(() => {
                this.filesize_getCurrentFileSize(this.filesizeStatusBar);
            });
        }
        catch (error) {
            console.error("Flawuldragon - File size error: " + error);
            vscode.window.showErrorMessage("An error occurred while activating the file size integration feature: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
            this.filesize_desactivate();
        }
        finally { }
    }
    /**
     * Deactivates the file size functionality.
     *
     * This method is intended to be used to disable or deactivate any operations
     * or features related to file size within the application.
     */
    filesize_desactivate() {
        this.filesizeStatusBar.dispose();
    }
}
exports.FileSize = FileSize;
