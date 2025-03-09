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
        },
        visibility: {
          'statusBar': 'flawuldragon.vanilla.accessibility.visibility.statusBar'
        }
      }
    },
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
  errorLens: {
    comandos: {
      'root': 'flawuldragon.errorLens',
      'toggle': 'flawuldragon.errorLens.toggle',
      'toggle-error': 'flawuldragon.errorLens.toggleError',
      'toggle-warning': 'flawuldragon.errorLens.toggleWarning',
      'toggle-info': 'flawuldragon.errorLens.toggleInfo',
      'toggle-hint': 'flawuldragon.errorLens.toggleHint',
      'toggle-inline-message': 'flawuldragon.errorLens.toggleInlineMessage',
      'toggle-workspace': 'flawuldragon.errorLens.toggleWorkspace',
      'copy-problem-message': 'flawuldragon.errorLens.copyProblemMessage',
      'copy-problem-code': 'flawuldragon.errorLens.copyProblemCode',
      'select-problem': 'flawuldragon.errorLens.selectProblem',
      'find-linter-rule-definition': 'flawuldragon.errorLens.findLinterRuleDefinition',
      'search-for-problem': 'flawuldragon.errorLens.searchForProblem',
      'disable-line': 'flawuldragon.errorLens.disableLine',
      'status-bar-command': 'flawuldragon.errorLens.statusBarCommand',
      'reveal-line': 'flawuldragon.errorLens.revealLine',
      'exclude-problem': 'flawuldragon.errorLens.excludeProblem',
      'code-lens-on-click': 'flawuldragon.errorLens.codeLensOnClick'
    },
    statusBar: {
      posicao: {
        error: vscode.window.createStatusBarItem('errorLensError', vscode.StatusBarAlignment.Left, 2493),
        warning: vscode.window.createStatusBarItem('errorLensWarning', vscode.StatusBarAlignment.Left, 2492)
      }
    }
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
