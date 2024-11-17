"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vanilla = void 0;
const fs = require("node:fs");
const path = require("node:path");
const vscode = require("vscode");
/**
 * Represents the Vanilla class which manages the activation and deactivation
 * of the Flawuldragon extension in VS Code.
 */
class Vanilla {
    /**
     * A status bar item for the Flawuldragon extension.
     * This status bar item is aligned to the left with a priority of 100.
     *
     * @private
     * @type {vscode.StatusBarItem}
     */
    flawuldragonStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    /**
     * A unique identifier for the status bar item associated with the Flawuldragon extension.
     * This ID is used to register and manage the status bar item within the extension.
     */
    flawuldragonStatusbaritemId = "flawuldragon.extension.infos";
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
    vanilla_activate(context) {
        context.subscriptions.push(vscode.commands.registerCommand(this.flawuldragonStatusbaritemId, () => {
            let viewPanel = vscode.window.createWebviewPanel("flawuldragon", "Flawuldragon Notes", vscode.ViewColumn.One, {});
            viewPanel.title = "Flawuldragon Notes";
            viewPanel.iconPath = vscode.Uri.file(path.join(__dirname, "../", "assets", "icon.png"));
            viewPanel.webview.html = fs
                .readFileSync(path.join(__dirname, "../", "assets", "flawuldragon.html"))
                .toString();
            return 0;
        }));
        this.flawuldragonStatusBar.text = `$(flawuldragon-on) FD`;
        this.flawuldragonStatusBar.command = this.flawuldragonStatusbaritemId;
        this.flawuldragonStatusBar.color = "darkblue";
        this.flawuldragonStatusBar.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
        this.flawuldragonStatusBar.tooltip = "Click to view Flawuldragon Notes";
        this.flawuldragonStatusBar.show();
        context.subscriptions.push(this.flawuldragonStatusBar);
        if (vscode.workspace.getConfiguration("flawuldragon").get("enable") === false) {
            console.warn("Flawuldragon is disabled. Enable it in your settings.");
            vscode.window.showWarningMessage("Flawuldragon is disabled. Enable it in your settings.");
            this.flawuldragonStatusBar.text = `$(flawuldragon-off) The Flawuldragon`;
            this.flawuldragonStatusBar.color = "darkred";
            this.flawuldragonStatusBar.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
            return;
        }
    }
    /**
     * Deactivates the vanilla feature by disposing of the flawuldragon status bar.
     */
    vanilla_desactivate() {
        this.flawuldragonStatusBar.dispose();
    }
}
exports.Vanilla = Vanilla;
