import * as vscode from "vscode";
import { EPCPomodoroType, EPCPomodoroStatus } from "./enums.js";
import { TPCCommandStatus } from "./declares";
import { PCPomodoro } from "./PCPomodoro.ac.js";
import { Vanilla } from "../@vanilla/Vanilla.js";
import { constants } from "../constants.js";

const vanillaFeatures = new Vanilla();

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
export class PCPomodoroManager {
  // logic properties
  /**
   * The index of the current Pomodoro session.
   * This is used to track the number of completed Pomodoro intervals.
   * @private
   */
  private _pomodoroIndex: number;

  /**
   * A private map that associates each `TPCCommandStatus` with an object containing
   * a link and an image source URI. This map is used to manage the resources
   * associated with different command statuses.
   *
   * @private
   * @type {Record<TPCCommandStatus, { link: vscode.Uri; imgSrc: vscode.Uri }>}
   */
  private _commandMap: Record<
    TPCCommandStatus,
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
      this._clockBarText = constants.statusBar.positions.posH;
      this._typeBarText = constants.statusBar.positions.posG;
      this._clockBarText.command =
        constants.commands.pomodoroClock.release.fdToggleCurrentPomodoroCountdown;
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
          `command:${constants.commands.pomodoroClock.release.fdPomodoroStartClock}`,
        ),
        imgSrc: vscode.Uri.joinPath(
          this.vscodeContext.extensionUri,
          "assets/pomodoroClock/",
          "start.svg",
        ),
      },
      pause: {
        link: vscode.Uri.parse(
          `command:${constants.commands.pomodoroClock.release.fdPomodoroPauseClock}`,
        ),
        imgSrc: vscode.Uri.joinPath(
          this.vscodeContext.extensionUri,
          "assets/pomodoroClock/",
          "pause.svg",
        ),
      },
      continue: {
        link: vscode.Uri.parse(
          `command:${constants.commands.pomodoroClock.release.fdPomodoroContinueClock}`,
        ),
        imgSrc: vscode.Uri.joinPath(
          this.vscodeContext.extensionUri,
          "assets/pomodoroClock/",
          "continue.svg",
        ),
      },
      restart: {
        link: vscode.Uri.parse(
          `command:${constants.commands.pomodoroClock.release.fdPomodoroRestartClock}`,
        ),
        imgSrc: vscode.Uri.joinPath(
          this.vscodeContext.extensionUri,
          "assets/pomodoroClock/",
          "restart.svg",
        ),
      },
      reset: {
        link: vscode.Uri.parse(
          `command:${constants.commands.pomodoroClock.release.fdPomodoroResetClock}`,
        ),
        imgSrc: vscode.Uri.joinPath(
          this.vscodeContext.extensionUri,
          "assets/pomodoroClock/",
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

    let clockStatusBarCommand = constants.commands.pomodoroClock.release.fdClockStatusBar;
    let typeStatusBarCommand = constants.commands.pomodoroClock.release.fdTypeStatusBar;
    vanillaFeatures.vanilla_interruptorStatusBarConstructor(this._clockBarText, clockStatusBarCommand);
    vanillaFeatures.vanilla_interruptorStatusBarConstructor(this._typeBarText, typeStatusBarCommand);
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
    const config = vscode.workspace.getConfiguration("fd.pomodoroClock");
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
