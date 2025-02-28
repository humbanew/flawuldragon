/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

/**
 * Represents a Pomodoro Clock Timer.
 * This class provides functionality to start, stop, and reset a timer,
 * as well as track the accumulated time in milliseconds.
 */
export class PCTimer {
  /**
   * A private property that holds the identifier of the timer.
   * This identifier is used to manage the timer instance created by Node.js.
   */
  private _timerId: NodeJS.Timer | null;

  /**
   * Accumulates the total time in milliseconds.
   * This variable is used to keep track of the total elapsed time.
   */
  private _accumulateTime: number;

  /**
   * Gets a value indicating whether the Pomodoro clock is currently running.
   *
   * @returns `true` if the Pomodoro clock is running; otherwise, `false`.
   */
  public get isRunning() {
    return this._timerId != null;
  }

  /**
   * Creates an instance of PomodoroClock.
   *
   * @param interval - The interval time in milliseconds for the clock. Defaults to 1000 ms.
   */
  constructor(public interval: number = 1000) {
    this._timerId = null;
    this._accumulateTime = 0;
  }

  /**
   * Resets the Pomodoro clock by stopping the timer and resetting the accumulated time to zero.
   */
  public reset() {
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
  public start(callback: any) {
    if (this._timerId == null) {
      this._timerId = setInterval(async () => {
        this.tick();
        await callback();
      }, this.interval);
    } else {
      console.error("A timer instance is already running...");
    }
  }

  /**
   * Stops the Pomodoro timer if it is currently running.
   * Clears the interval associated with the timer and sets the timer ID to null.
   */
  public stop() {
    if (this._timerId != null) {
      clearInterval(this._timerId as NodeJS.Timeout);
    }

    this._timerId = null;
  }

  /**
   * Updates the accumulated time by adding the interval duration in seconds.
   * This method is called periodically to keep track of the elapsed time.
   */
  private tick() {
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
