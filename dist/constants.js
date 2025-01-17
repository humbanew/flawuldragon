"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.constants = void 0;
const vscode = __importStar(require("vscode"));
exports.constants = {
    statusBar: {
        positions: {
            posA: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100), //vanilla flawuldragon notes
            posB: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99), //themeswitch
            posC: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98), //vanilla flawuldragon datetime
            posD: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 97), //vanilla flawuldragon timer vscode opened
            posE: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 96), //filesize
            posF: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 95), //todo highlight
            posG: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 94), //pomodoro clock fnca
            posH: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 93) //pomodoro clock
        }
    },
    commands: {
        vanilla: {
            release: {
                fdNotesViewPanel: 'flawuldragon.extension.infos',
                fdDateTimeStatusbar: 'flawuldragon.vanillaDateTime.ui.interruptorStatusBar',
                fdPropsAmericanFormat: 'flawuldragon.vanillaDateTime.americanFormat',
                fdProps12HourFormat: 'flawuldragon.vanillaDateTime.12hFormat',
                fdPropsInvertPositions: 'flawuldragon.vanillaDateTime.invertProps'
            },
            experimental: {}
        },
        filesize: {
            release: {
                fdFilesize: 'flawuldragon.filesize.ui.interruptorStatusBar',
                fdFilesizeInfo: 'flawuldragon.filesize.toggleFileSizeInfo'
            },
            experimental: {}
        },
        indentRainbow: { release: '{}', experimental: '{}' },
        jetbrainsMono: {
            release: {
                fdActivate: 'flawuldragon.jetbrainsmonofont.activate',
                fdDeactivate: 'flawuldragon.jetbrainsmonofont.deactivate'
            },
            experimental: {}
        },
        pomodoroClock: {
            release: {
                fdToggleCurrentPomodoroCountdown: 'flawuldragon.pomodoroClock.toggleCurrentPomodoroCountdown',
                fdPomodoroStartClock: 'flawuldragon.pomodoroClock.startPomodoro',
                fdPomodoroPauseClock: 'flawuldragon.pomodoroClock.pausePomodoro',
                fdPomodoroContinueClock: 'flawuldragon.pomodoroClock.continuePomodoro',
                fdPomodoroRestartClock: 'flawuldragon.pomodoroClock.restartPomodoro',
                fdPomodoroResetClock: 'flawuldragon.pomodoroClock.resetPomodoro',
                fdClockStatusBar: 'flawuldragon.pomodoroClock.ui.interruptorClockStatusBar',
                fdTypeStatusBar: 'flawuldragon.pomodoroClock.ui.interruptorTypeStatusBar'
            },
            experimental: {}
        },
        themeSwitch: {
            release: {
                fdThemeSwitchDarkTheme: 'flawuldragon.themeswitch.darktheme',
                fdThemeSwitchLightTheme: 'flawuldragon.themeswitch.lighttheme',
                fdThemeSwitchToggle: 'flawuldragon.themeswitch.toggle'
            },
            experimental: {}
        },
        todoHighlight: {
            release: {
                fdToggleTodoHighlight: 'flawuldragon.todohighlight.toggleHighlight',
                fdListAnnotations: 'flawuldragon.todohighlight.listAnnotations',
                fdOutputPanel: 'flawuldragon.todohighlight.showOutputChannel',
                fdTodoHighlight: 'flawuldragon.todohighlight.ui.interruptorStatusBar'
            },
            experimental: {}
        },
        bracketguides: {
            release: {
                fdBracketGuides: 'flawuldragon.toggleBracketPairGuides'
            }, experimental: {}
        }
    }
};
