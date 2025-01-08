import * as vscode from 'vscode';
export declare const constants: {
    statusBar: {
        positions: {
            posA: vscode.StatusBarItem;
            posB: vscode.StatusBarItem;
            posC: vscode.StatusBarItem;
            posD: vscode.StatusBarItem;
            posE: vscode.StatusBarItem;
            posF: vscode.StatusBarItem;
            posG: vscode.StatusBarItem;
            posH: vscode.StatusBarItem;
        };
    };
    commands: {
        vanilla: {
            release: {
                fdNotesViewPanel: string;
                fdDateTimeStatusbar: string;
            };
            experimental: {
                fdDateTimeInvertPosition: string;
                fdDateTimeShowSeconds: string;
                fdDateTimeTimeFormat: string;
            };
        };
        filesize: {
            release: {
                fdFilesize: string;
                fdFilesizeInfo: string;
            };
            experimental: {};
        };
        indentRainbow: {
            release: string;
            experimental: string;
        };
        jetbrainsMono: {
            release: {
                fdActivate: string;
                fdDeactivate: string;
            };
            experimental: {};
        };
        pomodoroClock: {
            release: {
                fdToggleCurrentPomodoroCountdown: string;
                fdPomodoroStartClock: string;
                fdPomodoroPauseClock: string;
                fdPomodoroContinueClock: string;
                fdPomodoroRestartClock: string;
                fdPomodoroResetClock: string;
                fdClockStatusBar: string;
                fdTypeStatusBar: string;
            };
            experimental: {};
        };
        themeSwitch: {
            release: {
                fdThemeSwitchDarkTheme: string;
                fdThemeSwitchLightTheme: string;
                fdThemeSwitchToggle: string;
            };
            experimental: {};
        };
        todoHighlight: {
            release: {
                fdToggleTodoHighlight: string;
                fdListAnnotations: string;
                fdOutputPanel: string;
                fdTodoHighlight: string;
            };
            experimental: {};
        };
    };
};
//# sourceMappingURL=constants.d.cts.map