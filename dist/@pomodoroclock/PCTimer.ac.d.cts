/**
 * Represents a Pomodoro Clock Timer.
 * This class provides functionality to start, stop, and reset a timer,
 * as well as track the accumulated time in milliseconds.
 */
export declare class PCTimer {
    interval: number;
    /**
     * A private property that holds the identifier of the timer.
     * This identifier is used to manage the timer instance created by Node.js.
     */
    private _timerId;
    /**
     * Accumulates the total time in milliseconds.
     * This variable is used to keep track of the total elapsed time.
     */
    private _accumulateTime;
    /**
     * Gets a value indicating whether the Pomodoro clock is currently running.
     *
     * @returns `true` if the Pomodoro clock is running; otherwise, `false`.
     */
    get isRunning(): boolean;
    /**
     * Creates an instance of PomodoroClock.
     *
     * @param interval - The interval time in milliseconds for the clock. Defaults to 1000 ms.
     */
    constructor(interval?: number);
    /**
     * Resets the Pomodoro clock by stopping the timer and resetting the accumulated time to zero.
     */
    reset(): void;
    /**
     * Starts the Pomodoro timer if it is not already running.
     * Executes the provided callback function at each interval tick.
     *
     * @param callback - The function to be called at each interval tick.
     * @throws Will log an error if the timer is already running.
     */
    start(callback: any): void;
    /**
     * Stops the Pomodoro timer if it is currently running.
     * Clears the interval associated with the timer and sets the timer ID to null.
     */
    stop(): void;
    /**
     * Updates the accumulated time by adding the interval duration in seconds.
     * This method is called periodically to keep track of the elapsed time.
     */
    private tick;
    /**
     * Gets the accumulated time.
     *
     * @returns The accumulated time.
     */
    get accumulateTime(): number;
}
//# sourceMappingURL=PCTimer.ac.d.cts.map