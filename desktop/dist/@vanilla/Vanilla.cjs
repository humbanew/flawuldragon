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
exports.Vanilla = void 0;
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const vscode = __importStar(require("vscode"));
const constants_cjs_1 = require("../constants.cjs");
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
class Vanilla {
    /**
     * A status bar item for the Flawuldragon extension.
     * This status bar item is aligned to the left with a priority of 100.
     */
    flawuldragonStatusBar = constants_cjs_1.constants.statusBar.positions.posA;
    /**
     * A status bar item that displays the date and time for the Flawuldragon extension.
     *
     * This status bar item is aligned to the left with a priority of 98.
     * It is created using the `vscode.window.createStatusBarItem` method.
     */
    flawuldragonDateTimeStatusBar = constants_cjs_1.constants.statusBar.positions.posC;
    /**
     * A unique identifier for the status bar item associated with the Flawuldragon extension.
     * This ID is used to register and manage the status bar item within the extension.
     */
    flawuldragonStatusbaritemId = constants_cjs_1.constants.commands.vanilla.release.fdNotesViewPanel;
    vanilla_flawuldragonNotes(context) {
        context.subscriptions.push(vscode.commands.registerCommand(this.flawuldragonStatusbaritemId, () => {
            let viewPanel = vscode.window.createWebviewPanel('flawuldragon', 'Flawuldragon Notes', vscode.ViewColumn.One, {
                enableScripts: true,
                enableForms: true
            });
            viewPanel.title = 'Flawuldragon Notes';
            viewPanel.iconPath = vscode.Uri.file(path.join(__dirname, '../../', 'assets', 'icon.png'));
            viewPanel.webview.html = fs
                .readFileSync(path.join(__dirname, '../../', 'display', 'flawuldragon.html'))
                .toString();
            return 0;
        }));
        // flawuldragon development notes status bar item
        this.flawuldragonStatusBar.text = `$(flawuldragon-on) FD`;
        this.flawuldragonStatusBar.command = this.flawuldragonStatusbaritemId;
        this.flawuldragonStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        this.flawuldragonStatusBar.tooltip = 'Click to view Flawuldragon Notes';
        this.flawuldragonStatusBar.show();
        context.subscriptions.push(this.flawuldragonStatusBar);
    }
    vanilla_checkingIsOk() {
        // check if the extension is enabled in the settings
        if (vscode.workspace.getConfiguration('flawuldragon').get('enable') === false) {
            console.warn('Flawuldragon is disabled. Enable it in your settings.');
            vscode.window.showWarningMessage('Flawuldragon is disabled. Enable it in your settings.');
            this.flawuldragonStatusBar.text = `$(flawuldragon-off) FD`;
            this.flawuldragonStatusBar.color = 'darkred';
            this.flawuldragonStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
            return;
        }
    }
    vanilla_interruptorStatusBarConstructor(statusBarItem, command) {
        const interruptor = { on: true, off: false };
        vscode.commands.registerCommand(command, () => {
            if (interruptor.on == true) {
                statusBarItem.hide();
                interruptor.on = false;
                interruptor.off = true;
            }
            else {
                statusBarItem.show();
                interruptor.on = true;
                interruptor.off = false;
            }
        });
    }
    vanilla_dateTimeComponent(context) {
        let text;
        setInterval(() => {
            let timer = new Date(), day = timer.getDate().toString(), month = (timer.getMonth() + 1).toString(), hours = timer.getHours().toString(), minutes = timer.getMinutes().toString(), seconds = timer.getSeconds().toString();
            if (parseInt(day) < 10)
                day = 0 + day;
            if (parseInt(month) < 10)
                month = 0 + month;
            if (parseInt(hours) < 10)
                hours = 0 + hours;
            if (parseInt(minutes) < 10)
                minutes = 0 + minutes;
            if (parseInt(seconds) < 10)
                seconds = 0 + seconds;
            text = `${day}/${month}/${timer.getFullYear()} - ${hours}:${minutes}`;
            this.flawuldragonDateTimeStatusBar.text = text;
        }, 1000);
        this.flawuldragonDateTimeStatusBar.tooltip = 'Current time';
        this.flawuldragonDateTimeStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        this.flawuldragonDateTimeStatusBar.show();
        context.subscriptions.push(this.flawuldragonDateTimeStatusBar);
    }
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
        try {
            console.log('Flawuldragon - Vanilla activated!');
            this.vanilla_flawuldragonNotes(context);
            this.vanilla_dateTimeComponent(context);
            this.vanilla_interruptorStatusBarConstructor(this.flawuldragonDateTimeStatusBar, constants_cjs_1.constants.commands.vanilla.release.fdDateTimeStatusbar); // show or hide the status bar
            this.vanilla_checkingIsOk();
        }
        catch (error) {
            console.error('Flawuldragon vanilla error: ' + error);
            vscode.window.showErrorMessage('An error occurred while activating the Flawuldragon vanilla features: ' +
                error +
                '. Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)');
            this.vanilla_desactivate();
        }
        finally {
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
class VColorHighlight {
    constructor() {
    }
}
class VColorErrorLens {
    constructor() {
        // collect lines with error or warning to do display hint after
    }
}
