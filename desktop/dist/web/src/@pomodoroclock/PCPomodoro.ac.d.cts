import { EPCPomodoroStatus, EPCPomodoroType } from "./enums.cjs";
import { PCTimer } from "./PCTimer.ac.cjs";
/**
 * The `PCPomodoro` class represents a Pomodoro clock with various functionalities
 * such as starting, pausing, restarting, and resetting the timer. It manages the
 * timer for different Pomodoro sessions (Work, Break, LongBreak) and provides
 * methods to control the timer and retrieve its status and type.
 *
 * @class PCPomodoro
 *
 * @property {EPCPomodoroType} _type - Represents the type of the Pomodoro clock.
 * @property {PCTimer} _timer - A private instance of the PCTimer class used to manage the timer functionality.
 * @property {EPCPomodoroStatus} _status - Represents the current status of the Pomodoro clock.
 * @property {number} workTime - The duration of the work session in seconds.
 * @property {number} breakTime - The duration of the break session in seconds.
 * @property {number} longBreakTime - The duration of the long break session in seconds.
 * @property {boolean} isCountDown - Indicates whether the timer is counting down.
 * @property {() => void} onTick - A callback function that is invoked on each tick of the Pomodoro clock.
 *
 * @method get type - Gets the type of the PomodoroClock.
 * @method set type - Sets the type of the Pomodoro clock.
 * @method get timer - Gets the current timer value.
 * @method get status - Gets the current status of the Pomodoro clock.
 * @method get totalTime - Gets the total time for the current Pomodoro session based on its type.
 * @method get showTime - Gets the current time to be displayed on the Pomodoro clock.
 * @method start - Starts the Pomodoro timer with the specified type.
 * @method continue - Continues the Pomodoro clock if it is currently paused.
 * @method restart - Restarts the Pomodoro timer by resetting it and initiating the tick process.
 * @method pause - Pauses the Pomodoro clock.
 * @method reset - Resets the Pomodoro clock to its initial state.
 * @method stop - Stops the Pomodoro timer.
 * @method dispose - Disposes of the current PomodoroClock instance.
 *
 * @constructor
 * @param {number} [workTime=1500] - The duration of the work session in seconds. Defaults to 25 minutes.
 * @param {number} [breakTime=300] - The duration of the break session in seconds. Defaults to 5 minutes.
 * @param {number} longBreakTime - The duration of the long break session in seconds.
 * @param {boolean} [isCountDown=true] - Indicates whether the timer is counting down. Defaults to true.
 * @param {EPCPomodoroType} [type=EPCPomodoroType.Work] - The type of the Pomodoro clock. Defaults to Work.
 */
export declare class PCPomodoro {
    workTime: number;
    breakTime: number;
    longBreakTime: number;
    isCountDown: boolean;
    /**
     * Represents the type of the Pomodoro clock.
     *
     * @private
     * @type {EPCPomodoroType}
     */
    private _type;
    /**
     * A private instance of the PCTimer class used to manage the timer functionality
     * within the PomodoroClock component.
     *
     * @private
     */
    private _timer;
    /**
     * Represents the current status of the Pomodoro clock.
     * This status is of type `EPCPomodoroStatus`.
     *
     * @private
     */
    private _status;
    /**
     * Gets the type of the PomodoroClock.
     *
     * @returns The type of the PomodoroClock.
     */
    get type(): EPCPomodoroType;
    /**
     * Sets the type of the Pomodoro clock.
     *
     * @param type - The type of the Pomodoro clock, represented by the `EPCPomodoroType` enum.
     */
    set type(type: EPCPomodoroType);
    /**
     * Gets the current timer value.
     * @returns The current timer value.
     */
    get timer(): PCTimer;
    /**
     * Gets the current status of the Pomodoro clock.
     *
     * @returns The current status.
     */
    get status(): EPCPomodoroStatus;
    /**
     * Gets the total time for the current Pomodoro session based on its type.
     *
     * @returns The total time in milliseconds for the current session.
     *
     * The total time is determined by the type of the Pomodoro session:
     * - If the type is `EPCPomodoroType.Work`, it returns the work time.
     * - If the type is `EPCPomodoroType.Break`, it returns the break time.
     * - If the type is `EPCPomodoroType.LongBreak`, it returns the long break time.
     */
    get totalTime(): number;
    /**
     * Gets the current time to be displayed on the Pomodoro clock.
     *
     * If the countdown is not active, it returns the accumulated time.
     * Otherwise, it returns the remaining time by subtracting the accumulated time from the total time.
     *
     * @returns The time to be displayed on the clock.
     */
    get showTime(): number;
    /**
     * A callback function that is invoked on each tick of the Pomodoro clock.
     */
    onTick: () => void;
    constructor(workTime: number, breakTime: number, longBreakTime: number, isCountDown?: boolean, type?: EPCPomodoroType);
    /**
     * Resets the timer and updates the status to indicate that the Pomodoro session is done.
     *
     * @private
     */
    private done;
    /**
     * Starts the Pomodoro timer and updates the status to Running.
     * The timer will execute the provided callback function at each tick.
     *
     * The callback function checks if the timer has reached the end of the current session
     * (Work, Break, or LongBreak) based on the accumulated time. If the session is done,
     * it calls the `done` method. Additionally, if an `onTick` callback is provided, it will
     * be called at each tick.
     *
     * @private
     */
    private tick;
    /**
     * Starts the Pomodoro timer with the specified type.
     *
     * @param {EPCPomodoroType} [type=EPCPomodoroType.Work] - The type of Pomodoro session to start. Defaults to `EPCPomodoroType.Work`.
     * @throws Will log an error to the console if the type is not provided.
     */
    start(type?: EPCPomodoroType): void;
    /**
     * Continues the Pomodoro clock if it is currently paused.
     * If the status of the clock is `Paused`, it will call the `tick` method to resume the timer.
     */
    continue(): void;
    /**
     * Restarts the Pomodoro timer by resetting it and initiating the tick process.
     */
    restart(): void;
    /**
     * Pauses the Pomodoro clock.
     *
     * This method stops the clock and sets its status to `Paused`.
     */
    pause(): void;
    /**
     * Resets the Pomodoro clock to its initial state.
     *
     * This method sets the status to `EPCPomodoroStatus.None` and the type to `EPCPomodoroType.Work`.
     * It also resets the timer.
     */
    reset(): void;
    /**
     * Stops the Pomodoro timer.
     * This method will halt the current timer and prevent it from continuing.
     */
    stop(): void;
    /**
     * Disposes of the current PomodoroClock instance by stopping the timer,
     * resetting the type to Work, and setting the status to Paused.
     */
    dispose(): void;
}
//# sourceMappingURL=PCPomodoro.ac.d.cts.map