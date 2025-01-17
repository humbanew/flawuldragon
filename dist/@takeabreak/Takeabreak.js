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
exports.Takeabreak = void 0;
const vscode = __importStar(require("vscode"));
const Vanilla_1 = require("../@vanilla/Vanilla");
/**
 * The `Takeabreak` class provides functionality to remind users to take breaks at regular intervals.
 * It integrates with the Visual Studio Code extension API to display notifications and manage commands.
 *
 * @class
 * @example
 * // Example usage:
 * const takeabreak = new Takeabreak();
 * takeabreak.takeabreak_activate(context);
 */
class Takeabreak {
    /**
     * A protected property that holds a reference to an interval timer.
     * This property is likely used to manage repeated actions at specified intervals.
     */
    interval = vscode.workspace.getConfiguration('takeabreak').get('interval');
    /**
     * A status bar item that displays interval information in the Visual Studio Code status bar.
     * This item is protected and can be accessed or modified by subclasses.
     */
    statusBarInterval = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 90);
    /**
     * Command identifier for showing or hiding the status bar in the Takeabreak UI.
     * This command is used to toggle the visibility of the status bar in the application.
     */
    statusBarShowOrHideCmd = "flawuldragon.takeabreak.ui.interruptorStatusBar";
    /**
     * @param {vscode.ExtensionContext} context - The context object representing the state of the extension.
     */
    takeabreak_activate(context) {
        try {
            console.log("Flawuldragon - Take a break activated!");
            /**
             * Displays the reminder message to take a break.
             */
            let showReminder = () => {
                vscode.window.showWarningMessage("It's time to take a break!", {
                    modal: true,
                    detail: "Blink your eyes quickly 25 times, close and roll them around in circular motions, and look at a distant object for " + this.interval + " seconds or more."
                });
            };
            let interruptor = new Vanilla_1.Vanilla();
            interruptor.vanilla_interruptorStatusBarConstructor(this.statusBarInterval, this.statusBarShowOrHideCmd);
            this.statusBarInterval.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
            this.statusBarInterval.tooltip = "Take a break reminder interval";
            this.statusBarInterval.text = `Take a break in ${this.interval} min`;
            context.subscriptions.push(this.statusBarInterval);
            this.statusBarInterval.show();
            let aux = this.interval;
            setInterval(() => {
                if (aux == 0) {
                    aux = this.interval;
                    setInterval(() => {
                        showReminder();
                    }, 20000);
                }
                aux = aux - 1;
                this.statusBarInterval.text = `Take a break in ${aux} min`;
                // se o comando de parada for chamado, o intervalo vira "Off"
                // executeCommand
                if (vscode.commands.executeCommand('flawuldragon.takeabreak.Take a break: Stop')) {
                    this.statusBarInterval.text = `Take a break is off`;
                }
                if (vscode.commands.executeCommand('flawuldragon.takeabreak.Take a break: Start')) {
                    this.statusBarInterval.text = `Take a break in ${aux} min`;
                }
            }, 60000);
            /**
             * Starts showing the reminder message every 20 seconds.
             * @param {boolean} showNotification - Whether to show a notification when starting the reminder.
             */
            let startShowingTheReminder = (showNotification) => {
                // If the reminder is already active, display a message and return.
                if (this.interval) {
                    vscode.window.showInformationMessage("Take a break is already doing its job! You're safe.");
                    return;
                }
                let internalInterval = this.interval * 60 * 1000;
                // Start the reminder by setting an interval to show the reminder message every 20 seconds.
                this.interval = setInterval(showReminder, internalInterval);
                // Show a notification or not, depends on "showNotification" parameter.
                showNotification ?? vscode.window.showInformationMessage(`Take a break successfully started! We will notify you every ${internalInterval / 60 / 1000} minutes to take a break.`);
            };
            /**
             * Stops showing the reminder message.
             */
            let stopShowingTheReminder = () => {
                // If the reminder is active, stop it and display a confirmation message.
                if (this.interval) {
                    clearInterval(this.interval);
                    this.interval = undefined;
                    vscode.window.showInformationMessage("Take a break is now stopped! We will not notify you to take a break. We hope you know what you're doing 😞");
                }
                else {
                    // If the reminder is already stopped, display a message indicating that.
                    vscode.window.showInformationMessage("Take a break is already stopped.");
                }
            };
            // Automatically start showing the reminder without showing a notification.
            startShowingTheReminder(false);
            // Register commands for starting and stopping the reminder.
            let startCommand = vscode.commands.registerCommand('flawuldragon.takeabreak.Take a break: Start', () => {
                startShowingTheReminder(true);
            });
            let stopCommand = vscode.commands.registerCommand('flawuldragon.takeabreak.Take a break: Stop', () => {
                stopShowingTheReminder();
            });
            // Add the commands to the context subscriptions.
            context.subscriptions.push(startCommand, stopCommand);
        }
        catch (error) {
            console.error("Flawuldragon - Take a break error: " + error);
            vscode.window.showErrorMessage("An error occurred while activating the take a break feature: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
        }
        finally { }
    }
    /**
     * This method is called when your extension is deactivated.
     */
    takeabreak_desactivate() {
        // If the reminder is active, stop it when the extension is deactivated.
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }
}
exports.Takeabreak = Takeabreak;
