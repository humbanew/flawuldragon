import * as vscode from "vscode";
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
export declare class PomodoroClock {
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
    pomodoroClock_activate(context: vscode.ExtensionContext): void;
    /**
     * Deactivates the Pomodoro clock.
     * This method logs a message indicating that the Pomodoro clock has been deactivated.
     */
    pomodoroClock_desactivate(): void;
}
//# sourceMappingURL=PomodoroClock.d.cts.map