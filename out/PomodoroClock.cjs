"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PomodoroClock = void 0;
const vscode = require("vscode");
const PCPomodoroManager_ac_cjs_1 = require("./PCPomodoroManager.ac.cjs");
/**
 * Represents a Pomodoro Clock extension for VS Code.
 *
 * The `PomodoroClock` class provides methods to activate and deactivate the Pomodoro Clock
 * extension. It registers several commands related to Pomodoro timer operations and manages
 * the lifecycle of these commands within the VS Code extension context.
 *
 * @class
 * @example
 * const pomodoroClock = new PomodoroClock();
 * pomodoroClock.activate(context);
 */
class PomodoroClock {
    /**
     * Activates the Pomodoro Clock extension.
     *
     * This function registers several commands related to the Pomodoro Clock functionality
     * and adds them to the context's subscriptions. It also initializes the `PCPomodoroManager`
     * to manage the Pomodoro timer operations.
     *
     * @param context - The extension context provided by VS Code.
     *
     * @throws Will log an error message and show an error notification if activation fails.
     */
    pomodoroClock_activate(context) {
        try {
            console.log("Flawuldragon - Pomodoro Clock activated!");
            const pomodoroManager = new PCPomodoroManager_ac_cjs_1.PCPomodoroManager(context);
            // list of commands
            const startDisposable = vscode.commands.registerCommand("flawuldragon.pomodoroClock.startPomodoro", () => {
                pomodoroManager.start();
            });
            const pauseDisposable = vscode.commands.registerCommand("flawuldragon.pomodoroClock.pausePomodoro", () => {
                pomodoroManager.pause();
            });
            const continueDisposable = vscode.commands.registerCommand("flawuldragon.pomodoroClock.continuePomodoro", () => {
                pomodoroManager.continue();
            });
            const restartDisposable = vscode.commands.registerCommand("flawuldragon.pomodoroClock.restartPomodoro", () => {
                pomodoroManager.restart();
            });
            const resetDisposable = vscode.commands.registerCommand("flawuldragon.pomodoroClock.resetPomodoro", () => {
                pomodoroManager.reset();
            });
            const toggleDisposable = vscode.commands.registerCommand("flawuldragon.pomodoroClock.toggleCurrentPomodoroCountdown", () => {
                pomodoroManager.toggleCountdown();
            });
            // Add to a list of disposables which are disposed when this extension is deactivated.
            context.subscriptions.push(pomodoroManager, startDisposable, pauseDisposable, continueDisposable, restartDisposable, resetDisposable, toggleDisposable);
        }
        catch (error) {
            console.log("Flawuldragon Pomodoro Clock - Error: " + error);
            vscode.window.showErrorMessage("An error occurred while activating the Flawuldragon Pomodoro Clock: " +
                error +
                ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
            this.pomodoroClock_deactivate();
        }
        finally { }
    }
    /**
     * Deactivates the Pomodoro clock.
     * This method logs a message indicating that the Pomodoro clock has been deactivated.
     */
    pomodoroClock_deactivate() {
        console.log("pomodoro deactivate");
    }
}
exports.PomodoroClock = PomodoroClock;
