"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PomodoroClock = void 0;
const vscode = require("vscode");
const EPCPomodoroType_enum_cjs_1 = require("./EPCPomodoroType.enum.cjs");
const EPCPomodoroStatus_enum_cjs_1 = require("./EPCPomodoroStatus.enum.cjs");
class PCTimer {
    interval;
    _timerId;
    _accumulateTime;
    get isRunning() {
        return this._timerId != null;
    }
    constructor(interval = 1000) {
        this.interval = interval;
        this._timerId = null;
        this._accumulateTime = 0;
    }
    reset() {
        this.stop();
        this._accumulateTime = 0;
    }
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
    stop() {
        if (this._timerId != null) {
            clearInterval(this._timerId);
        }
        this._timerId = null;
    }
    tick() {
        this._accumulateTime += this.interval / 1000;
    }
    get accumulateTime() {
        return this._accumulateTime;
    }
}
class PCPomodoro {
    workTime;
    breakTime;
    longBreakTime;
    isCountDown;
    // properties
    _type;
    _timer;
    _status;
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
    }
    get timer() {
        return this._timer;
    }
    get status() {
        return this._status;
    }
    get totalTime() {
        let totalTime = 0;
        if (this.type === EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Work) {
            totalTime = this.workTime;
        }
        else if (this.type === EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Break) {
            totalTime = this.breakTime;
        }
        else if (this.type === EPCPomodoroType_enum_cjs_1.EPCPomodoroType.LongBreak) {
            totalTime = this.longBreakTime;
        }
        return totalTime;
    }
    get showTime() {
        if (!this.isCountDown)
            return this.timer.accumulateTime;
        return this.totalTime - this.timer.accumulateTime;
    }
    // tick callback
    onTick;
    constructor(workTime = 25 * 60, breakTime = 5 * 60, longBreakTime, isCountDown = true, type = EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Work) {
        this.workTime = workTime;
        this.breakTime = breakTime;
        this.longBreakTime = longBreakTime;
        this.isCountDown = isCountDown;
        this.workTime = Math.floor(this.workTime);
        this.breakTime = Math.floor(this.breakTime);
        this.longBreakTime = Math.floor(this.longBreakTime);
        this._timer = new PCTimer();
        this._type = type;
        this._status = EPCPomodoroStatus_enum_cjs_1.EPCPomodoroStatus.None;
    }
    // private methods
    done() {
        this.timer.reset();
        this._status = EPCPomodoroStatus_enum_cjs_1.EPCPomodoroStatus.Done;
    }
    tick() {
        this._status = EPCPomodoroStatus_enum_cjs_1.EPCPomodoroStatus.Running;
        this._timer.start(async () => {
            // console.log('tick', Math.random())
            // stop the timer if no second left
            const isDone = (this.type === EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Work &&
                this.timer.accumulateTime === this.workTime) ||
                (this.type === EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Break &&
                    this.timer.accumulateTime === this.breakTime) ||
                (this.type === EPCPomodoroType_enum_cjs_1.EPCPomodoroType.LongBreak &&
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
    start(type = EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Work) {
        if (type) {
            this.type = type;
            this.tick();
        }
        else {
            console.error("Start timer error");
        }
    }
    continue() {
        if (this.status === EPCPomodoroStatus_enum_cjs_1.EPCPomodoroStatus.Paused) {
            this.tick();
        }
    }
    restart() {
        this.timer.reset();
        this.tick();
    }
    pause() {
        this.stop();
        this._status = EPCPomodoroStatus_enum_cjs_1.EPCPomodoroStatus.Paused;
    }
    reset() {
        this._status = EPCPomodoroStatus_enum_cjs_1.EPCPomodoroStatus.None;
        this._type = EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Work;
        this.timer.reset();
    }
    stop() {
        this._timer.stop();
    }
    dispose() {
        this.stop();
        this.type = EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Work;
        this._status = EPCPomodoroStatus_enum_cjs_1.EPCPomodoroStatus.Paused;
    }
}
class PCPomodoroManager {
    vscodeContext;
    // logic properties
    _pomodoroIndex;
    _commandMap;
    workTime;
    breakTime;
    longBreakTime;
    isCountDown;
    repeat;
    pomodori;
    _pomodoroCount;
    _breakCount;
    get currentPomodoro() {
        return this.pomodori[this._pomodoroIndex];
    }
    get isSessionFinished() {
        return !this.currentPomodoro;
    }
    // UI properties
    _clockBarText;
    _typeBarText;
    // private _vscodeContext: ExtensionContext
    constructor(vscodeContext) {
        this.vscodeContext = vscodeContext;
        // create status bar items
        if (!this._clockBarText) {
            this._clockBarText = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 95);
            this._typeBarText = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 96);
            this._clockBarText.command =
                "flawuldragon.pomodoroClock.toggleCurrentPomodoroCountdown";
            this._clockBarText.show();
            this._clockBarText.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
            this._typeBarText.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
        }
        this._commandMap = {
            start: {
                link: vscode.Uri.parse(`command:flawuldragon.pomodoroClock.startPomodoro`),
                imgSrc: vscode.Uri.joinPath(this.vscodeContext.extensionUri, "assets/pmcl-assets/assets/imgs", "start.svg"),
            },
            pause: {
                link: vscode.Uri.parse(`command:flawuldragon.pomodoroClock.pausePomodoro`),
                imgSrc: vscode.Uri.joinPath(this.vscodeContext.extensionUri, "assets/pmcl-assets/assets/imgs", "pause.svg"),
            },
            continue: {
                link: vscode.Uri.parse(`command:flawuldragon.pomodoroClock.continuePomodoro`),
                imgSrc: vscode.Uri.joinPath(this.vscodeContext.extensionUri, "assets/pmcl-assets/assets/imgs", "continue.svg"),
            },
            restart: {
                link: vscode.Uri.parse(`command:flawuldragon.pomodoroClock.restartPomodoro`),
                imgSrc: vscode.Uri.joinPath(this.vscodeContext.extensionUri, "assets/pmcl-assets/assets/imgs", "restart.svg"),
            },
            reset: {
                link: vscode.Uri.parse(`command:flawuldragon.pomodoroClock.resetPomodoro`),
                imgSrc: vscode.Uri.joinPath(this.vscodeContext.extensionUri, "assets/pmcl-assets/assets/imgs", "reset.svg"),
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
    setParamsFromConfig() {
        const config = vscode.workspace.getConfiguration("pomodoroClock");
        this.workTime = config.get("workTime");
        this.breakTime = config.get("breakTime");
        this.longBreakTime = config.get("longBreakTime");
        this.isCountDown = config.get("isCountDown");
        this.repeat = config.get("repeat");
    }
    getShowClock(inputTime) {
        const seconds = inputTime % 60;
        const minutes = (inputTime - seconds) / 60;
        // update status bar (text)
        const showClock = (minutes < 10 ? "0" : "") +
            minutes +
            ":" +
            (seconds < 10 ? "0" : "") +
            seconds;
        return showClock;
    }
    setTypeStatusBar() {
        let countNumberPart = "";
        if (this.currentPomodoro.type) {
            if (this.currentPomodoro.type === EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Work) {
                countNumberPart += "(" + this._pomodoroCount + ")";
            }
            else if (this.currentPomodoro.type === EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Break ||
                this.currentPomodoro.type === EPCPomodoroType_enum_cjs_1.EPCPomodoroType.LongBreak) {
                countNumberPart += "(" + this._breakCount + ")";
            }
            this._typeBarText.text = `${this.currentPomodoro.type + countNumberPart}`;
            this._typeBarText.tooltip = `total: ${this.getShowClock(this.currentPomodoro.totalTime)}`;
            this._typeBarText.show();
        }
        else {
            this._typeBarText.hide();
        }
    }
    setClockStatusBar() {
        const btns = [];
        if (this.currentPomodoro.status === EPCPomodoroStatus_enum_cjs_1.EPCPomodoroStatus.None ||
            this.currentPomodoro.status === EPCPomodoroStatus_enum_cjs_1.EPCPomodoroStatus.Done) {
            btns.push(`<a href="${this._commandMap.start.link}"><img src="${this._commandMap.start.imgSrc}" /></a>`);
        }
        if (this.currentPomodoro.status === EPCPomodoroStatus_enum_cjs_1.EPCPomodoroStatus.Running) {
            btns.push(`<a href="${this._commandMap.pause.link}"><img src="${this._commandMap.pause.imgSrc}" /></a>`);
        }
        else if (this.currentPomodoro.status === EPCPomodoroStatus_enum_cjs_1.EPCPomodoroStatus.Paused) {
            btns.push(`<a href="${this._commandMap.continue.link}"><img src="${this._commandMap.continue.imgSrc}" /></a>`);
        }
        if (this.currentPomodoro.status !== EPCPomodoroStatus_enum_cjs_1.EPCPomodoroStatus.None &&
            this.currentPomodoro.status !== EPCPomodoroStatus_enum_cjs_1.EPCPomodoroStatus.Done) {
            btns.push(`<a href="${this._commandMap.restart.link}"><img src="${this._commandMap.restart.imgSrc}" /></a>`);
            btns.push(`<a href="${this._commandMap.reset.link}"><img src="${this._commandMap.reset.imgSrc}" /></a>`);
        }
        let currentTime = this.currentPomodoro.showTime;
        let timerPart = this.getShowClock(currentTime);
        this._clockBarText.text = `$(clock) ${timerPart}`;
        const contents = new vscode.MarkdownString(btns.join("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"), true);
        contents.isTrusted = true;
        contents.supportHtml = true;
        this._clockBarText.tooltip = contents;
    }
    async tick() {
        if (this.currentPomodoro.status === EPCPomodoroStatus_enum_cjs_1.EPCPomodoroStatus.Done) {
            if (this.currentPomodoro.type === EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Work) {
                const isLongBreack = !(this._pomodoroCount % this.repeat);
                this._pomodoroCount++;
                this.currentPomodoro.type = isLongBreack
                    ? EPCPomodoroType_enum_cjs_1.EPCPomodoroType.LongBreak
                    : EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Break;
                const breakText = isLongBreack ? "Long Break" : "Break";
                vscode.window
                    .showInformationMessage("Work done! Take a break.", breakText, "Next work")
                    .then((select) => {
                    if (select === breakText) {
                        this.start(isLongBreack
                            ? EPCPomodoroType_enum_cjs_1.EPCPomodoroType.LongBreak
                            : EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Break);
                    }
                    else if (select === "Next work") {
                        this.start(EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Work);
                    }
                });
            }
            else if (this.currentPomodoro.type === EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Break) {
                this._breakCount++;
                this.currentPomodoro.type = EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Work;
                vscode.window
                    .showInformationMessage("Break is over.", "Next work", "Continue break")
                    .then((select) => {
                    if (select === "Continue break") {
                        this.start(EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Break);
                    }
                    else if (select === "Next work") {
                        this.start(EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Work);
                    }
                });
            }
            else if (this.currentPomodoro.type === EPCPomodoroType_enum_cjs_1.EPCPomodoroType.LongBreak) {
                this._breakCount++;
                this.currentPomodoro.type = EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Work;
                vscode.window
                    .showInformationMessage("Break is over.", "Next work", "Continue break")
                    .then((select) => {
                    if (select === "Continue break") {
                        this.start(EPCPomodoroType_enum_cjs_1.EPCPomodoroType.LongBreak);
                    }
                    else if (select === "Next work") {
                        this.start(EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Work);
                    }
                });
            }
        }
        this.draw();
    }
    draw() {
        this.setTypeStatusBar();
        this.setClockStatusBar();
    }
    // public methods
    start(type = EPCPomodoroType_enum_cjs_1.EPCPomodoroType.Work) {
        this.currentPomodoro.start(type);
        this.currentPomodoro.onTick = () => {
            this.tick();
        };
    }
    continue() {
        this.currentPomodoro.continue();
        this.currentPomodoro.onTick = () => {
            this.tick();
        };
    }
    restart() {
        this.currentPomodoro.restart();
        this.currentPomodoro.onTick = () => {
            this.tick();
        };
    }
    pause() {
        this.currentPomodoro.pause();
        this.draw();
    }
    init() {
        this._pomodoroIndex = 0;
        this._pomodoroCount = 1;
        this._breakCount = 1;
        this.setParamsFromConfig();
        this.pomodori = [];
        this.pomodori.push(new PCPomodoro(this.workTime * 60, this.breakTime * 60, this.longBreakTime * 60, this.isCountDown));
        this.draw();
    }
    reset() {
        this.currentPomodoro.reset();
        this.draw();
    }
    toggleCountdown() {
        this.isCountDown = !this.isCountDown;
        this.currentPomodoro.isCountDown = this.isCountDown;
        this.draw();
    }
    dispose() {
        // stop current Pomodoro
        this.currentPomodoro.dispose();
        // reset UI
        this._clockBarText.dispose();
    }
}
class PomodoroClock {
    pomodoroClock_activate(context) {
        try {
            console.log("Flawuldragon - Pomodoro Clock activated!");
            const pomodoroManager = new PCPomodoroManager(context);
            // list of commands
            const startDisposable = vscode.commands.registerCommand("flawuldragon.pomodoroClock.startPomodoro", () => {
                pomodoroManager.start();
            });
            const pauseDisposable = vscode.commands.registerCommand("flawuldragon.pomodoroClock.pausePomodoro", () => {
                pomodoroManager.pause();
            });
            const continueDisposable = vscode.commands.registerCommand("flawuldragon.pomodoroClock.continuePomodoro", () => {
                pomodoroManager.continue();
            });
            const restartDisposable = vscode.commands.registerCommand("flawuldragon.pomodoroClock.restartPomodoro", () => {
                pomodoroManager.restart();
            });
            const resetDisposable = vscode.commands.registerCommand("flawuldragon.pomodoroClock.resetPomodoro", () => {
                pomodoroManager.reset();
            });
            const toggleDisposable = vscode.commands.registerCommand("flawuldragon.pomodoroClock.toggleCurrentPomodoroCountdown", () => {
                pomodoroManager.toggleCountdown();
            });
            // Add to a list of disposables which are disposed when this extension is deactivated.
            context.subscriptions.push(pomodoroManager, startDisposable, pauseDisposable, continueDisposable, restartDisposable, resetDisposable, toggleDisposable);
        }
        catch (error) {
            console.log("Flawuldragon Pomodoro Clock - Error: " + error);
            vscode.window.showErrorMessage("An error occurred while activating the Flawuldragon Pomodoro Clock: " +
                error +
                ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
            this.pomodoroClock_deactivate();
        }
        finally { }
    }
    pomodoroClock_deactivate() {
        console.log("pomodoro deactivate");
    }
}
exports.PomodoroClock = PomodoroClock;
