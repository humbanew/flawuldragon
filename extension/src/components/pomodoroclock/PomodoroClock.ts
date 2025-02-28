/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as vscode from "vscode";
import { PCPomodoroManager } from "./PCPomodoroManager";
import { Global } from "../globalDefs";

/**
 * Represents a Pomodoro Clock extension for VS Code.
 * 
 * The `PomodoroClock` class provides methods to activate and deactivate the Pomodoro Clock
 * extension. It registers several commands related to Pomodoro timer operations and manages
 * the lifecycle of these commands within the VS Code extension context.
 * 
 * @class
 * @example
 * const pomodoroClock = new FDPomodoroClock();
 * pomodoroClock.activate(context);
 */
export class FDPomodoroClock {
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
  public activate(context: vscode.ExtensionContext) {
    try {
      console.log("Flawuldragon - Pomodoro Clock activated!");

      const pomodoroManager = new PCPomodoroManager(context);
      // list of commands
      const startDisposable = vscode.commands.registerCommand(
        Global.pomodoroClock.comandos["start-pomodoro"],
        () => {
          pomodoroManager.start();
        },
      );

      const pauseDisposable = vscode.commands.registerCommand(
        Global.pomodoroClock.comandos["pause-pomodoro"],
        () => {
          pomodoroManager.pause();
        },
      );

      const continueDisposable = vscode.commands.registerCommand(
        Global.pomodoroClock.comandos["continue-pomodoro"],
        () => {
          pomodoroManager.continue();
        },
      );

      const restartDisposable = vscode.commands.registerCommand(
        Global.pomodoroClock.comandos["restart-pomodoro"],
        () => {
          pomodoroManager.restart();
        },
      );

      const resetDisposable = vscode.commands.registerCommand(
        Global.pomodoroClock.comandos["reset-pomodoro"],
        () => {
          pomodoroManager.reset();
        },
      );

      const toggleDisposable = vscode.commands.registerCommand(
        Global.pomodoroClock.comandos["toggle-current-pomodoro-countdown"],
        () => {
          pomodoroManager.toggleCountdown();
        },
      );

      // Add to a list of disposables which are disposed when this extension is deactivated.
      context.subscriptions.push(
        pomodoroManager,
        startDisposable,
        pauseDisposable,
        continueDisposable,
        restartDisposable,
        resetDisposable,
        toggleDisposable,
      );
    } catch (error) {
      console.log("Flawuldragon Pomodoro Clock - Error: " + error);
      vscode.window.showErrorMessage(
        "An error occurred while activating the Flawuldragon Pomodoro Clock: " +
          error +
          ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)",
      );
      this.desactivate();
    } finally {}
  }

  /**
   * Deactivates the Pomodoro clock.
   * This method logs a message indicating that the Pomodoro clock has been deactivated.
   */
  public desactivate() {
    console.log("pomodoro deactivate");
  }
}
