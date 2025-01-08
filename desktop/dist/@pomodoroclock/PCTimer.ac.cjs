"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PCTimer = void 0;
/**
 * Represents a Pomodoro Clock Timer.
 * This class provides functionality to start, stop, and reset a timer,
 * as well as track the accumulated time in milliseconds.
 */
class PCTimer {
    interval;
    /**
     * A private property that holds the identifier of the timer.
     * This identifier is used to manage the timer instance created by Node.js.
     */
    _timerId;
    /**
     * Accumulates the total time in milliseconds.
     * This variable is used to keep track of the total elapsed time.
     */
    _accumulateTime;
    /**
     * Gets a value indicating whether the Pomodoro clock is currently running.
     *
     * @returns `true` if the Pomodoro clock is running; otherwise, `false`.
     */
    get isRunning() {
        return this._timerId != null;
    }
    /**
     * Creates an instance of PomodoroClock.
     *
     * @param interval - The interval time in milliseconds for the clock. Defaults to 1000 ms.
     */
    constructor(interval = 1000) {
        this.interval = interval;
        this._timerId = null;
        this._accumulateTime = 0;
    }
    /**
     * Resets the Pomodoro clock by stopping the timer and resetting the accumulated time to zero.
     */
    reset() {
        this.stop();
        this._accumulateTime = 0;
    }
    /**
     * Starts the Pomodoro timer if it is not already running.
     * Executes the provided callback function at each interval tick.
     *
     * @param callback - The function to be called at each interval tick.
     * @throws Will log an error if the timer is already running.
     */
    start(callback) {
        if (this._timerId == null) {
            this._timerId = setInterval(async () => {
                this.tick();
                await callback();
            }, this.interval);
        }
        else {
            console.error("A timer instance is already running...");
        }
    }
    /**
     * Stops the Pomodoro timer if it is currently running.
     * Clears the interval associated with the timer and sets the timer ID to null.
     */
    stop() {
        if (this._timerId != null) {
            clearInterval(this._timerId);
        }
        this._timerId = null;
    }
    /**
     * Updates the accumulated time by adding the interval duration in seconds.
     * This method is called periodically to keep track of the elapsed time.
     */
    tick() {
        this._accumulateTime += this.interval / 1000;
    }
    /**
     * Gets the accumulated time.
     *
     * @returns The accumulated time.
     */
    get accumulateTime() {
        return this._accumulateTime;
    }
}
exports.PCTimer = PCTimer;
