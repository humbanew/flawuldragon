import * as vscode from "vscode";
import { EPCPomodoroType } from "./EPCPomodoroType.enum.cjs";
import { EPCPomodoroStatus } from "./EPCPomodoroStatus.enum.cjs";

/**
 * Represents the possible statuses for a command in the Pomodoro clock.
 *
 * - `start`: Indicates that the Pomodoro timer should start.
 * - `pause`: Indicates that the Pomodoro timer should pause.
 * - `continue`: Indicates that the Pomodoro timer should continue after being paused.
 * - `restart`: Indicates that the Pomodoro timer should restart from the beginning.
 * - `reset`: Indicates that the Pomodoro timer should reset to its initial state.
 */
type CommandStatus = "start" | "pause" | "continue" | "restart" | "reset";

/**
 * Represents a Pomodoro Clock Timer.
 * This class provides functionality to start, stop, and reset a timer,
 * as well as track the accumulated time in milliseconds.
 */
class PCTimer {
  /**
   * A private property that holds the identifier of the timer.
   * This identifier is used to manage the timer instance created by Node.js.
   */
  private _timerId: NodeJS.Timer;

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
  // properties
  /**
   * Represents the type of the Pomodoro clock.
   *
   * @private
   * @type {EPCPomodoroType}
   */
  private _type: EPCPomodoroType;

  /**
   * A private instance of the PCTimer class used to manage the timer functionality
   * within the PomodoroClock component.
   *
   * @private
   */
  private _timer: PCTimer;

  /**
   * Represents the current status of the Pomodoro clock.
   * This status is of type `EPCPomodoroStatus`.
   *
   * @private
   */
  private _status: EPCPomodoroStatus;

  /**
   * Gets the type of the PomodoroClock.
   *
   * @returns The type of the PomodoroClock.
   */
  public get type() {
    return this._type;
  }

  /**
   * Sets the type of the Pomodoro clock.
   *
   * @param type - The type of the Pomodoro clock, represented by the `EPCPomodoroType` enum.
   */
  public set type(type: EPCPomodoroType) {
    this._type = type;
  }

  /**
   * Gets the current timer value.
   * @returns The current timer value.
   */
  public get timer() {
    return this._timer;
  }

  /**
   * Gets the current status of the Pomodoro clock.
   *
   * @returns The current status.
   */
  public get status() {
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
  public get totalTime() {
    let totalTime = 0;
    if (this.type === EPCPomodoroType.Work) {
      totalTime = this.workTime;
    } else if (this.type === EPCPomodoroType.Break) {
      totalTime = this.breakTime;
    } else if (this.type === EPCPomodoroType.LongBreak) {
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
  public get showTime() {
    if (!this.isCountDown) return this.timer.accumulateTime;
    return this.totalTime - this.timer.accumulateTime;
  }

  // tick callback
  /**
   * A callback function that is invoked on each tick of the Pomodoro clock.
   */
  public onTick: () => void;

  // Constructor of the class
  constructor(
    public workTime: number = 25 * 60,
    public breakTime: number = 5 * 60,
    public longBreakTime: number,
    public isCountDown: boolean = true,
    type = EPCPomodoroType.Work,
  ) {
    this.workTime = Math.floor(this.workTime);
    this.breakTime = Math.floor(this.breakTime);
    this.longBreakTime = Math.floor(this.longBreakTime);
    this._timer = new PCTimer();
    this._type = type;
    this._status = EPCPomodoroStatus.None;
  }

  // private methods
  /**
   * Resets the timer and updates the status to indicate that the Pomodoro session is done.
   *
   * @private
   */
  private done() {
    this.timer.reset();
    this._status = EPCPomodoroStatus.Done;
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
  private tick() {
    this._status = EPCPomodoroStatus.Running;
    this._timer.start(async () => {
      // console.log('tick', Math.random())
      // stop the timer if no second left
      const isDone =
        (this.type === EPCPomodoroType.Work &&
          this.timer.accumulateTime === this.workTime) ||
        (this.type === EPCPomodoroType.Break &&
          this.timer.accumulateTime === this.breakTime) ||
        (this.type === EPCPomodoroType.LongBreak &&
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
  public start(type: EPCPomodoroType = EPCPomodoroType.Work) {
    if (type) {
      this.type = type;
      this.tick();
    } else {
      console.error("Start timer error");
    }
  }

  /**
   * Continues the Pomodoro clock if it is currently paused.
   * If the status of the clock is `Paused`, it will call the `tick` method to resume the timer.
   */
  public continue() {
    if (this.status === EPCPomodoroStatus.Paused) {
      this.tick();
    }
  }

  /**
   * Restarts the Pomodoro timer by resetting it and initiating the tick process.
   */
  public restart() {
    this.timer.reset();
    this.tick();
  }

  /**
   * Pauses the Pomodoro clock.
   *
   * This method stops the clock and sets its status to `Paused`.
   */
  public pause() {
    this.stop();
    this._status = EPCPomodoroStatus.Paused;
  }

  /**
   * Resets the Pomodoro clock to its initial state.
   *
   * This method sets the status to `EPCPomodoroStatus.None` and the type to `EPCPomodoroType.Work`.
   * It also resets the timer.
   */
  public reset() {
    this._status = EPCPomodoroStatus.None;
    this._type = EPCPomodoroType.Work;
    this.timer.reset();
  }

  /**
   * Stops the Pomodoro timer.
   * This method will halt the current timer and prevent it from continuing.
   */
  public stop() {
    this._timer.stop();
  }

  /**
   * Disposes of the current PomodoroClock instance by stopping the timer,
   * resetting the type to Work, and setting the status to Paused.
   */
  public dispose() {
    this.stop();
    this.type = EPCPomodoroType.Work;
    this._status = EPCPomodoroStatus.Paused;
  }
}

/**
 * Manages the Pomodoro clock functionality within a Visual Studio Code extension.
 * 
 * This class handles the logic and UI components for a Pomodoro timer, including
 * work sessions, short breaks, and long breaks. It integrates with the Visual Studio
 * Code status bar to display the current state of the Pomodoro timer and provides
 * commands to control the timer.
 * 
 * @class
 */
class PCPomodoroManager {
  // logic properties
  /**
   * The index of the current Pomodoro session.
   * This is used to track the number of completed Pomodoro intervals.
   * @private
   */
  private _pomodoroIndex: number;

  /**
   * A private map that associates each `CommandStatus` with an object containing
   * a link and an image source URI. This map is used to manage the resources
   * associated with different command statuses.
   *
   * @private
   * @type {Record<CommandStatus, { link: vscode.Uri; imgSrc: vscode.Uri }>}
   */
  private _commandMap: Record<
    CommandStatus,
    {
      link: vscode.Uri;
      imgSrc: vscode.Uri;
    }
  >;

  /**
   * The duration of the work period in minutes.
   */
  public workTime: number;

  /**
   * The duration of the break time in minutes.
   * This value determines how long the break period will last
   * after a work session in the Pomodoro technique.
   */
  public breakTime: number;

  /**
   * The duration of the long break time in milliseconds.
   */
  public longBreakTime: number;

  /**
   * Indicates whether the Pomodoro clock is in countdown mode.
   */
  public isCountDown: boolean;

  /**
   * The number of times the Pomodoro timer will repeat.
   */
  public repeat: number;

  /**
   * An array of PCPomodoro objects representing individual pomodoro sessions.
   */
  public pomodori: PCPomodoro[];

  /**
   * The number of completed Pomodoro intervals.
   * This counter increments each time a Pomodoro interval is completed.
   */
  private _pomodoroCount: number;

  /**
   * The number of breaks taken during the Pomodoro session.
   * This counter increments each time a break is started.
   *
   * @private
   */
  private _breakCount: number;

  /**
   * Gets the current Pomodoro session.
   *
   * @returns The current Pomodoro session object from the `pomodori` array.
   */
  public get currentPomodoro() {
    return this.pomodori[this._pomodoroIndex];
  }

  /**
   * Determines if the current Pomodoro session is finished.
   *
   * @returns {boolean} - Returns `true` if the current Pomodoro session is finished, otherwise `false`.
   */
  public get isSessionFinished(): boolean {
    return !this.currentPomodoro;
  }

  // UI properties
  /**
   * A status bar item used to display the clock bar text in the Visual Studio Code status bar.
   * This item is used to show the current state of the Pomodoro clock.
   *
   * @private
   */
  private _clockBarText: vscode.StatusBarItem;

  /**
   * A private member representing a status bar item in Visual Studio Code.
   * This item is used to display text related to the type bar in the status bar.
   *
   * @private
   * @type {vscode.StatusBarItem}
   */
  private _typeBarText: vscode.StatusBarItem;

  /**
   * Creates an instance of the PomodoroClock class.
   *
   * @param {vscode.ExtensionContext} vscodeContext - The context of the VS Code extension.
   *
   * Initializes the status bar items and sets their properties.
   * Registers commands for controlling the Pomodoro clock and status bar visibility.
   * Sets up a configuration change listener to update parameters and status bar items.
   *
   * Commands:
   * - `flawuldragon.pomodoroClock.toggleCurrentPomodoroCountdown`: Toggles the current Pomodoro countdown.
   * - `flawuldragon.pomodoroClock.startPomodoro`: Starts the Pomodoro timer.
   * - `flawuldragon.pomodoroClock.pausePomodoro`: Pauses the Pomodoro timer.
   * - `flawuldragon.pomodoroClock.continuePomodoro`: Continues the Pomodoro timer.
   * - `flawuldragon.pomodoroClock.restartPomodoro`: Restarts the Pomodoro timer.
   * - `flawuldragon.pomodoroClock.resetPomodoro`: Resets the Pomodoro timer.
   * - `flawuldragon.pomodoroClock.showClockStatusBar`: Shows the clock status bar item.
   * - `flawuldragon.pomodoroClock.hideClockStatusBar`: Hides the clock status bar item.
   * - `flawuldragon.pomodoroClock.showTypeStatusBar`: Shows the type status bar item.
   * - `flawuldragon.pomodoroClock.hideTypeStatusBar`: Hides the type status bar item.
   */
  constructor(public vscodeContext: vscode.ExtensionContext) {
    // create status bar items
    if (!this._clockBarText) {
      this._clockBarText = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        94,
      );
      this._typeBarText = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        95,
      );
      this._clockBarText.command =
        "flawuldragon.pomodoroClock.toggleCurrentPomodoroCountdown";
      this._clockBarText.show();
      this._clockBarText.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.warningBackground",
      );
      this._typeBarText.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.warningBackground",
      );
    }
    this._commandMap = {
      start: {
        link: vscode.Uri.parse(
          `command:flawuldragon.pomodoroClock.startPomodoro`,
        ),
        imgSrc: vscode.Uri.joinPath(
          this.vscodeContext.extensionUri,
          "assets/pmcl-assets/assets/imgs",
          "start.svg",
        ),
      },
      pause: {
        link: vscode.Uri.parse(
          `command:flawuldragon.pomodoroClock.pausePomodoro`,
        ),
        imgSrc: vscode.Uri.joinPath(
          this.vscodeContext.extensionUri,
          "assets/pmcl-assets/assets/imgs",
          "pause.svg",
        ),
      },
      continue: {
        link: vscode.Uri.parse(
          `command:flawuldragon.pomodoroClock.continuePomodoro`,
        ),
        imgSrc: vscode.Uri.joinPath(
          this.vscodeContext.extensionUri,
          "assets/pmcl-assets/assets/imgs",
          "continue.svg",
        ),
      },
      restart: {
        link: vscode.Uri.parse(
          `command:flawuldragon.pomodoroClock.restartPomodoro`,
        ),
        imgSrc: vscode.Uri.joinPath(
          this.vscodeContext.extensionUri,
          "assets/pmcl-assets/assets/imgs",
          "restart.svg",
        ),
      },
      reset: {
        link: vscode.Uri.parse(
          `command:flawuldragon.pomodoroClock.resetPomodoro`,
        ),
        imgSrc: vscode.Uri.joinPath(
          this.vscodeContext.extensionUri,
          "assets/pmcl-assets/assets/imgs",
          "reset.svg",
        ),
      },
    };
    this.init();

    vscode.workspace.onDidChangeConfiguration(() => {
      this.setParamsFromConfig();
      this.setTypeStatusBar();
      this.currentPomodoro.isCountDown = this.isCountDown;
    });

    // comandos adicionais para habilitar e desabilitar status bar itens
    vscode.commands.registerCommand(
      "flawuldragon.pomodoroClock.showClockStatusBar",
      () => {
        this._clockBarText.show();
      },
    );
    vscode.commands.registerCommand(
      "flawuldragon.pomodoroClock.hideClockStatusBar",
      () => {
        this._clockBarText.hide();
      },
    );
    vscode.commands.registerCommand(
      "flawuldragon.pomodoroClock.showTypeStatusBar",
      () => {
        this._typeBarText.show();
      },
    );
    vscode.commands.registerCommand(
      "flawuldragon.pomodoroClock.hideTypeStatusBar",
      () => {
        this._typeBarText.hide();
      },
    );
  }

  /**
   * Sets the parameters for the Pomodoro clock from the configuration.
   *
   * This method retrieves the configuration settings for the Pomodoro clock
   * from the Visual Studio Code workspace settings and assigns them to the
   * corresponding properties of the Pomodoro clock instance.
   *
   * Configuration settings retrieved:
   * - `workTime`: The duration of the work period.
   * - `breakTime`: The duration of the short break period.
   * - `longBreakTime`: The duration of the long break period.
   * - `isCountDown`: A boolean indicating if the timer should count down.
   * - `repeat`: The number of times the Pomodoro cycle should repeat.
   */
  private setParamsFromConfig() {
    const config = vscode.workspace.getConfiguration("pomodoroClock");
    this.workTime = config.get("workTime");
    this.breakTime = config.get("breakTime");
    this.longBreakTime = config.get("longBreakTime");
    this.isCountDown = config.get("isCountDown");
    this.repeat = config.get("repeat");
  }

  /**
   * Converts the given input time in seconds to a formatted string in "MM:SS" format.
   *
   * @param inputTime - The input time in seconds.
   * @returns A string representing the formatted time in "MM:SS" format.
   */
  private getShowClock(inputTime: any) {
    const seconds = inputTime % 60;
    const minutes = (inputTime - seconds) / 60;
    // update status bar (text)
    const showClock =
      (minutes < 10 ? "0" : "") +
      minutes +
      ":" +
      (seconds < 10 ? "0" : "") +
      seconds;
    return showClock;
  }

  /**
   * Updates the status bar text and tooltip based on the current Pomodoro type and count.
   *
   * - If the current Pomodoro type is `Work`, it appends the work count to the status bar text.
   * - If the current Pomodoro type is `Break` or `LongBreak`, it appends the break count to the status bar text.
   * - Sets the tooltip to display the total time of the current Pomodoro.
   * - Shows the status bar text if the Pomodoro type is defined, otherwise hides it.
   *
   * @private
   */
  private setTypeStatusBar() {
    let countNumberPart = "";
    if (this.currentPomodoro.type) {
      if (this.currentPomodoro.type === EPCPomodoroType.Work) {
        countNumberPart += "(" + this._pomodoroCount + ")";
      } else if (
        this.currentPomodoro.type === EPCPomodoroType.Break ||
        this.currentPomodoro.type === EPCPomodoroType.LongBreak
      ) {
        countNumberPart += "(" + this._breakCount + ")";
      }
      this._typeBarText.text = `${this.currentPomodoro.type + countNumberPart}`;
      this._typeBarText.tooltip = `total: ${this.getShowClock(
        this.currentPomodoro.totalTime,
      )}`;
      this._typeBarText.show();
    } else {
      this._typeBarText.hide();
    }
  }

  /**
   * Updates the status bar with the current state of the Pomodoro clock.
   *
   * Depending on the current status of the Pomodoro timer, this method will:
   * - Display a start button if the timer is not running or has completed.
   * - Display a pause button if the timer is currently running.
   * - Display a continue button if the timer is paused.
   * - Display restart and reset buttons if the timer is in any state other than 'None' or 'Done'.
   *
   * The status bar will also show the current time of the Pomodoro timer.
   *
   * The buttons are rendered as HTML links with images, and the tooltip for the status bar
   * is updated with these buttons.
   *
   * @private
   */
  private setClockStatusBar() {
    const btns = [];
    if (
      this.currentPomodoro.status === EPCPomodoroStatus.None ||
      this.currentPomodoro.status === EPCPomodoroStatus.Done
    ) {
      btns.push(
        `<a href="${this._commandMap.start.link}"><img src="${this._commandMap.start.imgSrc}" /></a>`,
      );
    }
    if (this.currentPomodoro.status === EPCPomodoroStatus.Running) {
      btns.push(
        `<a href="${this._commandMap.pause.link}"><img src="${this._commandMap.pause.imgSrc}" /></a>`,
      );
    } else if (this.currentPomodoro.status === EPCPomodoroStatus.Paused) {
      btns.push(
        `<a href="${this._commandMap.continue.link}"><img src="${this._commandMap.continue.imgSrc}" /></a>`,
      );
    }
    if (
      this.currentPomodoro.status !== EPCPomodoroStatus.None &&
      this.currentPomodoro.status !== EPCPomodoroStatus.Done
    ) {
      btns.push(
        `<a href="${this._commandMap.restart.link}"><img src="${this._commandMap.restart.imgSrc}" /></a>`,
      );
      btns.push(
        `<a href="${this._commandMap.reset.link}"><img src="${this._commandMap.reset.imgSrc}" /></a>`,
      );
    }
    let currentTime = this.currentPomodoro.showTime;
    let timerPart = this.getShowClock(currentTime);
    this._clockBarText.text = `$(clock) ${timerPart}`;
    const contents = new vscode.MarkdownString(
      btns.join("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"),
      true,
    );
    contents.isTrusted = true;
    contents.supportHtml = true;
    this._clockBarText.tooltip = contents;
  }

  /**
   * Handles the ticking of the Pomodoro clock. Depending on the current status and type of the Pomodoro,
   * it updates the type and shows appropriate messages to the user. It also increments the Pomodoro and break counts
   * as necessary and starts the next Pomodoro session based on user selection.
   *
   * - If the current Pomodoro is done and is of type Work, it determines if the next break is a long break or a short break,
   *   increments the Pomodoro count, and shows a message to the user to take a break.
   * - If the current Pomodoro is done and is of type Break, it increments the break count, sets the next Pomodoro type to Work,
   *   and shows a message to the user that the break is over.
   * - If the current Pomodoro is done and is of type LongBreak, it increments the break count, sets the next Pomodoro type to Work,
   *   and shows a message to the user that the break is over.
   *
   * The user can select to start the next work session or continue the break, and the appropriate Pomodoro type will be started.
   *
   * @private
   * @async
   * @returns A promise that resolves when the tick handling is complete.
   */
  private async tick() {
    if (this.currentPomodoro.status === EPCPomodoroStatus.Done) {
      if (this.currentPomodoro.type === EPCPomodoroType.Work) {
        const isLongBreack = !(this._pomodoroCount % this.repeat);
        this._pomodoroCount++;
        this.currentPomodoro.type = isLongBreack
          ? EPCPomodoroType.LongBreak
          : EPCPomodoroType.Break;
        const breakText = isLongBreack ? "Long Break" : "Break";
        vscode.window
          .showInformationMessage(
            "Work done! Take a break.",
            breakText,
            "Next work",
          )
          .then((select: any) => {
            if (select === breakText) {
              this.start(
                isLongBreack
                  ? EPCPomodoroType.LongBreak
                  : EPCPomodoroType.Break,
              );
            } else if (select === "Next work") {
              this.start(EPCPomodoroType.Work);
            }
          });
      } else if (this.currentPomodoro.type === EPCPomodoroType.Break) {
        this._breakCount++;
        this.currentPomodoro.type = EPCPomodoroType.Work;
        vscode.window
          .showInformationMessage(
            "Break is over.",
            "Next work",
            "Continue break",
          )
          .then((select) => {
            if (select === "Continue break") {
              this.start(EPCPomodoroType.Break);
            } else if (select === "Next work") {
              this.start(EPCPomodoroType.Work);
            }
          });
      } else if (this.currentPomodoro.type === EPCPomodoroType.LongBreak) {
        this._breakCount++;
        this.currentPomodoro.type = EPCPomodoroType.Work;
        vscode.window
          .showInformationMessage(
            "Break is over.",
            "Next work",
            "Continue break",
          )
          .then((select) => {
            if (select === "Continue break") {
              this.start(EPCPomodoroType.LongBreak);
            } else if (select === "Next work") {
              this.start(EPCPomodoroType.Work);
            }
          });
      }
    }
    this.draw();
  }

  /**
   * Updates the status bar and clock status bar.
   * This method is responsible for drawing the necessary UI components
   * related to the type status bar and clock status bar.
   *
   * @private
   */
  private draw() {
    this.setTypeStatusBar();
    this.setClockStatusBar();
  }

  // public methods
  /**
   * Starts a new Pomodoro session of the specified type.
   *
   * This method initializes the current Pomodoro session with the given type
   * and sets up the tick handler to manage the Pomodoro timer.
   *
   * @param {EPCPomodoroType} [type=EPCPomodoroType.Work] - The type of Pomodoro session to start.
   * Defaults to `EPCPomodoroType.Work` if not specified.
   */
  public start(type: EPCPomodoroType = EPCPomodoroType.Work) {
    this.currentPomodoro.start(type);
    this.currentPomodoro.onTick = () => {
      this.tick();
    };
  }

  /**
   * Continues the current Pomodoro session and sets up the onTick event handler.
   * The onTick event handler will call the tick method.
   */
  public continue() {
    this.currentPomodoro.continue();
    this.currentPomodoro.onTick = () => {
      this.tick();
    };
  }

  /**
   * Restarts the current Pomodoro timer and sets up the onTick event handler.
   * The onTick event handler will call the tick method.
   */
  public restart() {
    this.currentPomodoro.restart();
    this.currentPomodoro.onTick = () => {
      this.tick();
    };
  }

  /**
   * Pauses the current Pomodoro timer and updates the display.
   *
   * This method calls the `pause` method on the current Pomodoro instance
   * and then triggers a redraw of the Pomodoro clock interface.
   */
  public pause() {
    this.currentPomodoro.pause();
    this.draw();
  }

  /**
   * Initializes the PomodoroClock instance by setting initial values for 
   * pomodoro and break counts, configuring parameters from the config, 
   * and creating the first Pomodoro session.
   * 
   * @remarks
   * This method sets the initial values for `_pomodoroIndex`, `_pomodoroCount`, 
   * and `_breakCount`. It then calls `setParamsFromConfig` to configure 
   * parameters from the configuration. After that, it initializes the `pomodori` 
   * array and adds a new `PCPomodoro` instance to it with the configured work, 
   * break, and long break times. Finally, it calls the `draw` method to render 
   * the initial state.
   */
  public init() {
    this._pomodoroIndex = 0;
    this._pomodoroCount = 1;
    this._breakCount = 1;
    this.setParamsFromConfig();
    this.pomodori = [];
    this.pomodori.push(
      new PCPomodoro(
        this.workTime * 60,
        this.breakTime * 60,
        this.longBreakTime * 60,
        this.isCountDown,
      ),
    );
    this.draw();
  }

  /**
   * Resets the current Pomodoro session and updates the display.
   */
  public reset() {
    this.currentPomodoro.reset();
    this.draw();
  }

  /**
   * Toggles the countdown state of the Pomodoro clock.
   * 
   * This method switches the `isCountDown` property between true and false,
   * updates the `isCountDown` property of the current Pomodoro session,
   * and triggers a redraw of the clock.
   */
  public toggleCountdown() {
    this.isCountDown = !this.isCountDown;
    this.currentPomodoro.isCountDown = this.isCountDown;
    this.draw();
  }

  /**
   * Disposes of the current Pomodoro session and resets the UI elements.
   * 
   * This method performs the following actions:
   * - Stops the current Pomodoro session by calling `dispose` on `this.currentPomodoro`.
   * - Resets the UI by disposing of the `_clockBarText` element.
   */
  public dispose() {
    // stop current Pomodoro
    this.currentPomodoro.dispose();
    // reset UI
    this._clockBarText.dispose();
  }
}

/**
 * Represents a Pomodoro Clock extension for VS Code.
 * 
 * The `PomodoroClock` class provides methods to activate and deactivate the Pomodoro Clock
 * extension. It registers several commands related to Pomodoro timer operations and manages
 * the lifecycle of these commands within the VS Code extension context.
 */
export class PomodoroClock {
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
  public pomodoroClock_activate(context: vscode.ExtensionContext) {
    try {
      console.log("Flawuldragon - Pomodoro Clock activated!");

      const pomodoroManager = new PCPomodoroManager(context);
      // list of commands
      const startDisposable = vscode.commands.registerCommand(
        "flawuldragon.pomodoroClock.startPomodoro",
        () => {
          pomodoroManager.start();
        },
      );

      const pauseDisposable = vscode.commands.registerCommand(
        "flawuldragon.pomodoroClock.pausePomodoro",
        () => {
          pomodoroManager.pause();
        },
      );

      const continueDisposable = vscode.commands.registerCommand(
        "flawuldragon.pomodoroClock.continuePomodoro",
        () => {
          pomodoroManager.continue();
        },
      );

      const restartDisposable = vscode.commands.registerCommand(
        "flawuldragon.pomodoroClock.restartPomodoro",
        () => {
          pomodoroManager.restart();
        },
      );

      const resetDisposable = vscode.commands.registerCommand(
        "flawuldragon.pomodoroClock.resetPomodoro",
        () => {
          pomodoroManager.reset();
        },
      );

      const toggleDisposable = vscode.commands.registerCommand(
        "flawuldragon.pomodoroClock.toggleCurrentPomodoroCountdown",
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
      this.pomodoroClock_deactivate();
    } finally {
    }
  }

  /**
   * Deactivates the Pomodoro clock.
   * This method logs a message indicating that the Pomodoro clock has been deactivated.
   */
  public pomodoroClock_deactivate() {
    console.log("pomodoro deactivate");
  }
}
