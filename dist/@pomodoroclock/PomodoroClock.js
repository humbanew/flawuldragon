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
exports.PomodoroClock = void 0;
const vscode = __importStar(require("vscode"));
const PCPomodoroManager_ac_js_1 = require("./PCPomodoroManager.ac.js");
const constants_js_1 = require("../constants.js");
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
            const pomodoroManager = new PCPomodoroManager_ac_js_1.PCPomodoroManager(context);
            // list of commands
            const startDisposable = vscode.commands.registerCommand(constants_js_1.constants.commands.pomodoroClock.release.fdPomodoroStartClock, () => {
                pomodoroManager.start();
            });
            const pauseDisposable = vscode.commands.registerCommand(constants_js_1.constants.commands.pomodoroClock.release.fdPomodoroPauseClock, () => {
                pomodoroManager.pause();
            });
            const continueDisposable = vscode.commands.registerCommand(constants_js_1.constants.commands.pomodoroClock.release.fdPomodoroContinueClock, () => {
                pomodoroManager.continue();
            });
            const restartDisposable = vscode.commands.registerCommand(constants_js_1.constants.commands.pomodoroClock.release.fdPomodoroRestartClock, () => {
                pomodoroManager.restart();
            });
            const resetDisposable = vscode.commands.registerCommand(constants_js_1.constants.commands.pomodoroClock.release.fdPomodoroResetClock, () => {
                pomodoroManager.reset();
            });
            const toggleDisposable = vscode.commands.registerCommand(constants_js_1.constants.commands.pomodoroClock.release.fdToggleCurrentPomodoroCountdown, () => {
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
            this.pomodoroClock_desactivate();
        }
        finally { }
    }
    /**
     * Deactivates the Pomodoro clock.
     * This method logs a message indicating that the Pomodoro clock has been deactivated.
     */
    pomodoroClock_desactivate() {
        console.log("pomodoro deactivate");
    }
}
exports.PomodoroClock = PomodoroClock;
