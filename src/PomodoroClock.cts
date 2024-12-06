import * as vscode from "vscode";
import { EPCPomodoroType } from "./EPCPomodoroType.enum.cjs";
import { EPCPomodoroStatus } from "./EPCPomodoroStatus.enum.cjs";

type CommandStatus = "start" | "pause" | "continue" | "restart" | "reset";

class PCTimer {
  private _timerId: NodeJS.Timer;
  private _accumulateTime: number;

  public get isRunning() {
    return this._timerId != null;
  }

  constructor(public interval: number = 1000) {
    this._timerId = null;
    this._accumulateTime = 0;
  }

  public reset() {
    this.stop();
    this._accumulateTime = 0;
  }

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

  public stop() {
    if (this._timerId != null) {
      clearInterval(this._timerId as NodeJS.Timeout);
    }

    this._timerId = null;
  }

  private tick() {
    this._accumulateTime += this.interval / 1000;
  }

  get accumulateTime() {
    return this._accumulateTime;
  }
}

class PCPomodoro {
  // properties
  private _type: EPCPomodoroType;
  private _timer: PCTimer;
  private _status: EPCPomodoroStatus;

  public get type() {
    return this._type;
  }

  public set type(type: EPCPomodoroType) {
    this._type = type;
  }

  public get timer() {
    return this._timer;
  }

  public get status() {
    return this._status;
  }

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

  public get showTime() {
    if (!this.isCountDown) return this.timer.accumulateTime;
    return this.totalTime - this.timer.accumulateTime;
  }

  // tick callback
  public onTick: () => void;

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
  private done() {
    this.timer.reset();
    this._status = EPCPomodoroStatus.Done;
  }

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
  public start(type: EPCPomodoroType = EPCPomodoroType.Work) {
    if (type) {
      this.type = type;
      this.tick();
    } else {
      console.error("Start timer error");
    }
  }

  public continue() {
    if (this.status === EPCPomodoroStatus.Paused) {
      this.tick();
    }
  }

  public restart() {
    this.timer.reset();
    this.tick();
  }

  public pause() {
    this.stop();
    this._status = EPCPomodoroStatus.Paused;
  }

  public reset() {
    this._status = EPCPomodoroStatus.None;
    this._type = EPCPomodoroType.Work;
    this.timer.reset();
  }

  public stop() {
    this._timer.stop();
  }

  public dispose() {
    this.stop();
    this.type = EPCPomodoroType.Work;
    this._status = EPCPomodoroStatus.Paused;
  }
}

class PCPomodoroManager {
  // logic properties
  private _pomodoroIndex: number;
  private _commandMap: Record<
    CommandStatus,
    {
      link: vscode.Uri;
      imgSrc: vscode.Uri;
    }
  >;
  public workTime: number;
  public breakTime: number;
  public longBreakTime: number;
  public isCountDown: boolean;
  public repeat: number;
  public pomodori: PCPomodoro[];
  private _pomodoroCount: number;
  private _breakCount: number;

  public get currentPomodoro() {
    return this.pomodori[this._pomodoroIndex];
  }

  public get isSessionFinished(): boolean {
    return !this.currentPomodoro;
  }
  // UI properties
  private _clockBarText: vscode.StatusBarItem;
  private _typeBarText: vscode.StatusBarItem;
  // private _vscodeContext: ExtensionContext

  constructor(public vscodeContext: vscode.ExtensionContext) {
    // create status bar items
    if (!this._clockBarText) {
      this._clockBarText = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        95,
      );
      this._typeBarText = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        96,
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
    vscode.commands.registerCommand("flawuldragon.pomodoroClock.showClockStatusBar", () => {
      this._clockBarText.show();
    });
    vscode.commands.registerCommand("flawuldragon.pomodoroClock.hideClockStatusBar", () => {
      this._clockBarText.hide();
    });
    vscode.commands.registerCommand("flawuldragon.pomodoroClock.showTypeStatusBar", () => {
      this._typeBarText.show();
    });
    vscode.commands.registerCommand("flawuldragon.pomodoroClock.hideTypeStatusBar", () => {
      this._typeBarText.hide();
    });
  }

  private setParamsFromConfig() {
    const config = vscode.workspace.getConfiguration("pomodoroClock");
    this.workTime = config.get("workTime");
    this.breakTime = config.get("breakTime");
    this.longBreakTime = config.get("longBreakTime");
    this.isCountDown = config.get("isCountDown");
    this.repeat = config.get("repeat");
  }

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

  private draw() {
    this.setTypeStatusBar();
    this.setClockStatusBar();
  }

  // public methods
  public start(type: EPCPomodoroType = EPCPomodoroType.Work) {
    this.currentPomodoro.start(type);
    this.currentPomodoro.onTick = () => {
      this.tick();
    };
  }

  public continue() {
    this.currentPomodoro.continue();
    this.currentPomodoro.onTick = () => {
      this.tick();
    };
  }

  public restart() {
    this.currentPomodoro.restart();
    this.currentPomodoro.onTick = () => {
      this.tick();
    };
  }

  public pause() {
    this.currentPomodoro.pause();
    this.draw();
  }

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

  public reset() {
    this.currentPomodoro.reset();
    this.draw();
  }

  public toggleCountdown() {
    this.isCountDown = !this.isCountDown;
    this.currentPomodoro.isCountDown = this.isCountDown;
    this.draw();
  }

  public dispose() {
    // stop current Pomodoro
    this.currentPomodoro.dispose();
    // reset UI
    this._clockBarText.dispose();
  }
}

export class PomodoroClock {
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
    } finally {}
  }
  public pomodoroClock_deactivate() {
    console.log("pomodoro deactivate");
  }
}
