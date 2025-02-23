/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as vscode from 'vscode';

/**
 * # Flawuldragon Global Definitions
 */
export const Global = {
  // vanilla features
  vanilla: {
    // flawuldragon notes
    notes: {
      comandos: {
        'root': 'flawuldragon.vanilla.notes'
      },
      statusBar: {
        posicao: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2500),
      }
    },
    // flawuldragon date and time
    dateTime: {
      comandos: {
        'root': 'flawuldragon.vanilla.datetime',
        'american-format': 'flawuldragon.vanilla.datetime.americanFormat',
        '12h-format': 'flawuldragon.vanilla.datetime.12hFormat',
        'invert-props': 'flawuldragon.vanilla.datetime.invertProps',
        'switch-visibility-date-or-time': 'flawuldragon.vanilla.datetime.switchVisibilityDateOrTime',
        'show-seconds': 'flawuldragon.vanilla.datetime.showSeconds',
        'show-day-of-week': 'flawuldragon.vanilla.datetime.showDayOfWeek'
      },
      statusBar: {
        posicao: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2498),
      }
    },
    // flawuldragon accessibility
    accessibilities: {
      comandos: {
        inlayHints: {
          'enabled': 'flawuldragon.vanilla.accessibility.inlayHints.enabled',
          'font-family': 'flawuldragon.vanilla.accessibility.inlayHints.fontFamily',
          'font-size': 'flawuldragon.vanilla.accessibility.inlayHints.fontSize'
        },
        signals: {
          'line-has-error': 'flawuldragon.vanilla.accessibility.signals.lineHasError',
          'line-has-warning': 'flawuldragon.vanilla.accessibility.signals.lineHasWarning',
          'line-has-inline-suggestion': 'flawuldragon.vanilla.accessibility.signals.lineHasInlineSuggestion'
        }
      }
    }
  },
  // incorporations
  autoccrtag: {
    comandos: {
      'root': 'flawuldragon.autoclosetag'
    },
    statusBar: null
  },
  colorhighlight: {
    comandos: {
      'root': 'flawuldragon.colorhighlight'
    },
    statusBar: null
  },
  filesize: {
    comandos: {
      'status-bar': 'flawuldragon.filesize.sb',
      'toggle-file-size-info': 'flawuldragon.filesize.toggleFileSizeInfo'
    },
    statusBar: {
      posicao: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2497),
    }
  },
  indentRainbow: {
    comandos: null,
    statusBar: null
  },
  jetbrainsMono: {
    comandos: {
      'activate': 'flawuldragon.jetbrainsmonofont.activate',
      'deactivate': 'flawuldragon.jetbrainsmonofont.deactivate'
    },
    statusBar: null
  },
  pomodoroClock: {
    comandos: {
      'toggle-current-pomodoro-countdown': 'flawuldragon.pomodoroclock.toggleCurrentPomodoroCountdown',
      'start-pomodoro': 'flawuldragon.pomodoroclock.startPomodoro',
      'pause-pomodoro': 'flawuldragon.pomodoroclock.pausePomodoro',
      'continue-pomodoro': 'flawuldragon.pomodoroclock.continuePomodoro',
      'restart-pomodoro': 'flawuldragon.pomodoroclock.restartPomodoro',
      'reset-pomodoro': 'flawuldragon.pomodoroclock.resetPomodoro',
      'clock-status-bar': 'flawuldragon.pomodoroclock.csb',
      'type-status-bar': 'flawuldragon.pomodoroclock.tsb'
    },
    statusBar: {
      posicao: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2495),
      posicaoType: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2494)
    }
  },
  themeSwitch: {
    comandos: {
      'dark-theme': 'flawuldragon.themeswitch.darktheme',
      'light-theme': 'flawuldragon.themeswitch.lighttheme',
      'toggle': 'flawuldragon.themeswitch.toggle'
    },
    statusBar: {
      posicao: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2499),
    }
  },
  todoHighlight: {
    comandos: {
      'toggle-highlight': 'flawuldragon.todohighlight.toggleHighlight',
      'list-annotations': 'flawuldragon.todohighlight.listAnnotations',
      'output-panel': 'flawuldragon.todohighlight.showOutputChannel',
      'status-bar': 'flawuldragon.todohighlight.sb'
    },
    statusBar: {
      posicao: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2496),
    }
  },
  bracketguides: {
    comandos: {
      'toggle-bracket-guides': 'flawuldragon.bracketguides.toggleBracketGuides'
    },
    statusBar: null
  },
  takeabreak: {
    comandos: {
      'start': 'flawuldragon.takeabreak.start',
      'stop': 'flawuldragon.takeabreak.stop'
    },
    statusBar: null
  },
  htmlCssSupport: {
    comandos: {
      'validate': 'flawuldragon.htmlcsssupport.validate',
      'clear': 'flawuldragon.htmlcsssupport.clear'
    },
    statusBar: null
  }
};
