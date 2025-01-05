import * as fs from "node:fs";
import * as vscode from "vscode";
import { Vanilla } from "../@vanilla/Vanilla.cjs";
import { constants } from "../constants.cjs";

const vanillaFeatures = new Vanilla();

/**
 * Interface Save Mode Display StatusBar
 * 1- Display filesize default info
 * 2- Display filesize advanced info
 */

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
export class FileSize {
  /**
   * A status bar item that displays the file size in the Visual Studio Code editor.
   * It is aligned to the left side of the status bar with a priority of 96.
   */
  protected filesizeStatusBar: vscode.StatusBarItem = constants.statusBar.positions.posE;

  /**
   * Retrieves the current file size of the active text editor's document and updates the provided status item with the file size.
   *
   * @param statusItem - An object containing a text property and a show method. The text property will be updated with the file size, and the show method will be called to display the status item.
   * @returns A promise that resolves when the file size has been retrieved and the status item has been updated.
   */
  protected filesize_getCurrentFileSize(statusItem: {
    text: string | undefined;
    show: () => void;
  }) {
    new Promise((resolve) => {
      let _filepath = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.document.fileName
        : "";
      resolve(_filepath);
    }).then((filepath) => {
      if (filepath == "") {
        statusItem.text = "No file";
        statusItem.show();
        return;
      }
      let _size = fs.statSync(filepath as string).size;
      let _sizeText = this.filesize_convertSize(_size);
      statusItem.text = _sizeText;
      statusItem.show();
    });
  }

  /**
   * Retrieves the current file size of the active text editor's file and updates the provided status item with the file size.
   * If no file is open, the status item will display "No file".
   *
   * @param statusItem - An object containing a text property and a show method to update the status display.
   * @param statusItem.text - The text to display in the status item.
   * @param statusItem.show - A method to show the status item.
   */
  protected filesize_getCurrentAdvancedFileSize(statusItem: {
    text: string | undefined;
    show: () => void;
  }) {
    new Promise((resolve) => {
      let _filepath = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.document.fileName
        : "";
      resolve(_filepath);
    }).then((filepath) => {
      if (filepath == "") {
        statusItem.text = "No file";
        statusItem.show();
        return;
      }
      let _size = fs.statSync(filepath as string).size;
      let _sizeText = this.filesize_convertAdvancedSize(_size);
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
  protected filesize_convertSize(size: number) {
    if (size < 1024) {
      return `${size} B`;
    } else if (size >= 1024 && size < 1048576) {
      return `${Math.floor(size / 10.24 / 100)} KB`;
    } else if (size > 1048576) {
      return `${Math.floor(size / 10485.76) / 100} MB`;
    } else if (size > 1073741824) {
      return `${Math.floor(size / 10737418.24) / 100} GB`;
    } else {
      return `${Math.floor(size / 1099511627776) / 100} TB`;
    }
  }

  /**
   * Converts a file size in bytes to a more readable format with advanced size representation.
   * 
   * @param size - The file size in bytes.
   * @returns A string representing the file size in a more readable format, including the original size in bytes.
   * 
   * The conversion follows these rules:
   * - If the size is less than 1024 bytes, it returns the size in bytes (B).
   * - If the size is between 1024 bytes and less than 1 MB, it returns the size in kilobytes (KB) and bytes (B).
   * - If the size is greater than 1 MB, it returns the size in megabytes (MB) and bytes (B).
   * - If the size is greater than 1 GB, it returns the size in gigabytes (GB) and bytes (B).
   * - If the size is greater than 1 TB, it returns the size in terabytes (TB) and bytes (B).
   */
  protected filesize_convertAdvancedSize(size: number) {
    // brute size of bytes
    if (size < 1024) {
      return `${size} B`;
    } else if (size >= 1024 && size < 1048576) {
      return `${Math.floor(size / 10.24 / 100)} KB ◆ ${size} B`;
    } else if (size > 1048576) {
      return `${Math.floor(size / 10485.76) / 100} MB ◆ ${size} B`;
    } else if (size > 1073741824) {
      return `${Math.floor(size / 10737418.24) / 100} GB ◆ ${size} B`;
    } else {
      return `${Math.floor(size / 1099511627776) / 100} TB ◆ ${size} B`;
    }
  }

  /**
   * Activates the file size functionality within the given VS Code extension context.
   *
   * @param content - The VS Code extension context in which the file size functionality is activated.
   */
  public filesize_activate(content: vscode.ExtensionContext) {
    try {
      console.log("Flawuldragon - File size activated!");
      this.filesizeStatusBar.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.warningBackground",
      );
      this.filesize_getCurrentFileSize(this.filesizeStatusBar);
      this.filesizeStatusBar.tooltip = "Filesize of the current document";
  
      content.subscriptions.push(
        vscode.commands.registerCommand(constants.commands.filesize.release.fdFilesizeAdvancedInfo, () => {
          this.filesize_getCurrentAdvancedFileSize(this.filesizeStatusBar);
        })
      );
  
      content.subscriptions.push(
        vscode.commands.registerCommand(constants.commands.filesize.release.fdFilesizeInfo, () => {
          this.filesize_getCurrentFileSize(this.filesizeStatusBar);
        })
      );

      let statusBarCommand = constants.commands.filesize.release.fdFilesize;
      vanillaFeatures.vanilla_interruptorStatusBarConstructor(this.filesizeStatusBar, statusBarCommand);

      vscode.window.onDidChangeActiveTextEditor(() => {
        this.filesize_getCurrentFileSize(this.filesizeStatusBar);
        this.filesize_getCurrentAdvancedFileSize(this.filesizeStatusBar);
      });
  
      vscode.workspace.onDidSaveTextDocument(() => {
        this.filesize_getCurrentFileSize(this.filesizeStatusBar);
        this.filesize_getCurrentAdvancedFileSize(this.filesizeStatusBar);
      });
    } catch (error) {
      console.error("Flawuldragon - File size error: " + error);
      vscode.window.showErrorMessage("An error occurred while activating the file size integration feature: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
      this.filesize_desactivate();
    } finally {}
  }

  /**
   * Deactivates the file size functionality.
   *
   * This method is intended to be used to disable or deactivate any operations
   * or features related to file size within the application.
   */
  public filesize_desactivate() {
    this.filesizeStatusBar.dispose();
  }
}
