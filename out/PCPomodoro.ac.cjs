"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PCPomodoro = void 0;
const EPCPomodoroStatus_cjs_1 = require("./EPCPomodoroStatus.cjs");
const EPCPomodoroType_cjs_1 = require("./EPCPomodoroType.cjs");
const PCTimer_ac_cjs_1 = require("./PCTimer.ac.cjs");
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
class PCPomodoro {
    workTime;
    breakTime;
    longBreakTime;
    isCountDown;
    // properties
    /**
     * Represents the type of the Pomodoro clock.
     *
     * @private
     * @type {EPCPomodoroType}
     */
    _type;
    /**
     * A private instance of the PCTimer class used to manage the timer functionality
     * within the PomodoroClock component.
     *
     * @private
     */
    _timer;
    /**
     * Represents the current status of the Pomodoro clock.
     * This status is of type `EPCPomodoroStatus`.
     *
     * @private
     */
    _status;
    /**
     * Gets the type of the PomodoroClock.
     *
     * @returns The type of the PomodoroClock.
     */
    get type() {
        return this._type;
    }
    /**
     * Sets the type of the Pomodoro clock.
     *
     * @param type - The type of the Pomodoro clock, represented by the `EPCPomodoroType` enum.
     */
    set type(type) {
        this._type = type;
    }
    /**
     * Gets the current timer value.
     * @returns The current timer value.
     */
    get timer() {
        return this._timer;
    }
    /**
     * Gets the current status of the Pomodoro clock.
     *
     * @returns The current status.
     */
    get status() {
        return this._status;
    }
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
    get totalTime() {
        let totalTime = 0;
        if (this.type === EPCPomodoroType_cjs_1.EPCPomodoroType.Work) {
            totalTime = this.workTime;
        }
        else if (this.type === EPCPomodoroType_cjs_1.EPCPomodoroType.Break) {
            totalTime = this.breakTime;
        }
        else if (this.type === EPCPomodoroType_cjs_1.EPCPomodoroType.LongBreak) {
            totalTime = this.longBreakTime;
        }
        return totalTime;
    }
    /**
     * Gets the current time to be displayed on the Pomodoro clock.
     *
     * If the countdown is not active, it returns the accumulated time.
     * Otherwise, it returns the remaining time by subtracting the accumulated time from the total time.
     *
     * @returns The time to be displayed on the clock.
     */
    get showTime() {
        if (!this.isCountDown)
            return this.timer.accumulateTime;
        return this.totalTime - this.timer.accumulateTime;
    }
    // tick callback
    /**
     * A callback function that is invoked on each tick of the Pomodoro clock.
     */
    onTick;
    // Constructor of the class
    constructor(workTime = 25 * 60, breakTime = 5 * 60, longBreakTime, isCountDown = true, type = EPCPomodoroType_cjs_1.EPCPomodoroType.Work) {
        this.workTime = workTime;
        this.breakTime = breakTime;
        this.longBreakTime = longBreakTime;
        this.isCountDown = isCountDown;
        this.workTime = Math.floor(this.workTime);
        this.breakTime = Math.floor(this.breakTime);
        this.longBreakTime = Math.floor(this.longBreakTime);
        this._timer = new PCTimer_ac_cjs_1.PCTimer();
        this._type = type;
        this._status = EPCPomodoroStatus_cjs_1.EPCPomodoroStatus.None;
    }
    // private methods
    /**
     * Resets the timer and updates the status to indicate that the Pomodoro session is done.
     *
     * @private
     */
    done() {
        this.timer.reset();
        this._status = EPCPomodoroStatus_cjs_1.EPCPomodoroStatus.Done;
    }
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
    tick() {
        this._status = EPCPomodoroStatus_cjs_1.EPCPomodoroStatus.Running;
        this._timer.start(async () => {
            // console.log('tick', Math.random())
            // stop the timer if no second left
            const isDone = (this.type === EPCPomodoroType_cjs_1.EPCPomodoroType.Work &&
                this.timer.accumulateTime === this.workTime) ||
                (this.type === EPCPomodoroType_cjs_1.EPCPomodoroType.Break &&
                    this.timer.accumulateTime === this.breakTime) ||
                (this.type === EPCPomodoroType_cjs_1.EPCPomodoroType.LongBreak &&
                    this.timer.accumulateTime === this.longBreakTime);
            if (isDone) {
                this.done();
            }
            if (this.onTick) {
                this.onTick();
            }
        });
    }
    // public methods
    /**
     * Starts the Pomodoro timer with the specified type.
     *
     * @param {EPCPomodoroType} [type=EPCPomodoroType.Work] - The type of Pomodoro session to start. Defaults to `EPCPomodoroType.Work`.
     * @throws Will log an error to the console if the type is not provided.
     */
    start(type = EPCPomodoroType_cjs_1.EPCPomodoroType.Work) {
        if (type) {
            this.type = type;
            this.tick();
        }
        else {
            console.error("Start timer error");
        }
    }
    /**
     * Continues the Pomodoro clock if it is currently paused.
     * If the status of the clock is `Paused`, it will call the `tick` method to resume the timer.
     */
    continue() {
        if (this.status === EPCPomodoroStatus_cjs_1.EPCPomodoroStatus.Paused) {
            this.tick();
        }
    }
    /**
     * Restarts the Pomodoro timer by resetting it and initiating the tick process.
     */
    restart() {
        this.timer.reset();
        this.tick();
    }
    /**
     * Pauses the Pomodoro clock.
     *
     * This method stops the clock and sets its status to `Paused`.
     */
    pause() {
        this.stop();
        this._status = EPCPomodoroStatus_cjs_1.EPCPomodoroStatus.Paused;
    }
    /**
     * Resets the Pomodoro clock to its initial state.
     *
     * This method sets the status to `EPCPomodoroStatus.None` and the type to `EPCPomodoroType.Work`.
     * It also resets the timer.
     */
    reset() {
        this._status = EPCPomodoroStatus_cjs_1.EPCPomodoroStatus.None;
        this._type = EPCPomodoroType_cjs_1.EPCPomodoroType.Work;
        this.timer.reset();
    }
    /**
     * Stops the Pomodoro timer.
     * This method will halt the current timer and prevent it from continuing.
     */
    stop() {
        this._timer.stop();
    }
    /**
     * Disposes of the current PomodoroClock instance by stopping the timer,
     * resetting the type to Work, and setting the status to Paused.
     */
    dispose() {
        this.stop();
        this.type = EPCPomodoroType_cjs_1.EPCPomodoroType.Work;
        this._status = EPCPomodoroStatus_cjs_1.EPCPomodoroStatus.Paused;
    }
}
exports.PCPomodoro = PCPomodoro;
