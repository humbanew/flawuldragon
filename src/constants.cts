import * as vscode from 'vscode';

export const constants = {
  statusBar: {
    positions: {
      posA: vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        100
      ), //vanilla flawuldragon notes
      posB: vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        99
      ), //themeswitch
      posC: vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        98
      ), //vanilla flawuldragon datetime
      posD: vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        97
      ), //vanilla flawuldragon timer vscode opened
      posE: vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        96
      ), //filesize
      posF: vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        95
      ), //todo highlight
      posG: vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        94
      ), //pomodoro clock fnca
      posH: vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        93
      ) //pomodoro clock
    }
  },
  commands: {
    vanilla: {
      release: {
        fdNotesViewPanel: 'flawuldragon.extension.infos',
        fdDateTimeStatusbar:
          'flawuldragon.vanillaDateTime.ui.interruptorStatusBar'
      },
      experimental: {
        fdDateTimeInvertPosition: 'flawuldragon.vanillaDateTime.invertPosition',
        fdDateTimeShowSeconds: 'flawuldragon.vanillaDateTime.showSeconds',
        fdDateTimeTimeFormat: 'flawuldragon.vanillaDateTime.timeFormat'
      }
    },
    filesize: {
      release: {
        fdFilesize: 'flawuldragon.filesize.ui.interruptorStatusBar',
        fdFilesizeInfo: 'flawuldragon.filesize.toggleFileSizeInfo',
        fdFilesizeAdvancedInfo:
          'flawuldragon.filesize.toggleFileSizeAdvancedInfo'
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
        fdToggleCurrentPomodoroCountdown:
          'flawuldragon.pomodoroClock.toggleCurrentPomodoroCountdown',
        fdPomodoroStartClock: 'flawuldragon.pomodoroClock.startPomodoro',
        fdPomodoroPauseClock: 'flawuldragon.pomodoroClock.pausePomodoro',
        fdPomodoroContinueClock: 'flawuldragon.pomodoroClock.continuePomodoro',
        fdPomodoroRestartClock: 'flawuldragon.pomodoroClock.restartPomodoro',
        fdPomodoroResetClock: 'flawuldragon.pomodoroClock.resetPomodoro',
        fdClockStatusBar:
          'flawuldragon.pomodoroClock.ui.interruptorClockStatusBar',
        fdTypeStatusBar:
          'flawuldragon.pomodoroClock.ui.interruptorTypeStatusBar'
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
    }
  }
};
