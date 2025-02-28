/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as fs from "node:fs";
import * as vscode from "vscode";
import { FDVanilla } from "../vanilla/Vanilla";
import { Global } from "../globalDefs";

const vanillaFeatures = new FDVanilla();

/**
 * A class that provides functionality to display the file size of the currently active text editor's document
 * in the Visual Studio Code status bar. It includes methods to retrieve and convert file sizes, as well as
 * activate and deactivate the file size display functionality.
 * 
 * @class
 * @example
 * // Example usage:
 * const filesize = new FDFileSize();
 * filesize.activate(context);
 */
export class FDFileSize {
  /**
   * A status bar item that displays the file size in the Visual Studio Code editor.
   * It is aligned to the left side of the status bar with a priority of 96.
   */
  protected filesizeStatusBar: vscode.StatusBarItem = Global.filesize.statusBar.posicao;

  /**
   * Retrieves the current file size of the active text editor's document and updates the provided status item with the file size.
   *
   * @param statusItem - An object containing a text property and a show method. The text property will be updated with the file size, and the show method will be called to display the status item.
   * @returns A promise that resolves when the file size has been retrieved and the status item has been updated.
   */
  protected getCurrentFileSize(statusItem: {
    text: string | undefined;
    show: () => void;
  }) {
    new Promise((resolve) => {
      let _filepath = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.document.fileName
        : "";
      resolve(_filepath);
    }).then((filepath: any) => {
      if (filepath == "" || filepath.includes("output:")) {
        statusItem.text = "No file";
        statusItem.show();
        return;
      }
      if (!fs.existsSync(filepath as string)) {
        return;
      }
      let _size = fs?.statSync(filepath as string)?.size;
      let _sizeText = this.convertSize(_size);
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
  protected convertSize(size: number) {
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
   * Activates the file size functionality within the given VS Code extension context.
   *
   * @param content - The VS Code extension context in which the file size functionality is activated.
   */
  public activate(content: vscode.ExtensionContext) {
    try {
      console.log("Flawuldragon - File size activated!");
      this.filesizeStatusBar.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.warningBackground",
      );
      this.getCurrentFileSize(this.filesizeStatusBar);
      this.filesizeStatusBar.tooltip = "Filesize of the current document";
  
      content.subscriptions.push(
        vscode.commands.registerCommand(Global.filesize.comandos["toggle-file-size-info"], () => {
          this.getCurrentFileSize(this.filesizeStatusBar);
        })
      );

      let statusBarCommand = Global.filesize.comandos["status-bar"];
      vanillaFeatures.interruptorStatusBarConstructor(this.filesizeStatusBar, statusBarCommand);

      vscode.window.onDidChangeActiveTextEditor(() => {
        this.getCurrentFileSize(this.filesizeStatusBar);
      });
  
      vscode.workspace.onDidSaveTextDocument(() => {
        this.getCurrentFileSize(this.filesizeStatusBar);
      });
    } catch (error) {
      console.error("Flawuldragon - File size error: " + error);
      vscode.window.showErrorMessage("An error occurred while activating the file size integration feature: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
      this.desactivate();
    } finally {}
  }

  /**
   * Deactivates the file size functionality.
   *
   * This method is intended to be used to disable or deactivate any operations
   * or features related to file size within the application.
   */
  public desactivate() {
    this.filesizeStatusBar.dispose();
  }
}
