import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { IVFDInterruptor } from './defines';
import { constants } from '../constants.js';
import './flwdnDts.json';
import { activate, deactivate } from '../extension';
import { activate as WebActivate, deactivate as WebDeactivate } from '../extension-web';

/**
 * Represents the Vanilla class which is responsible for managing the Flawuldragon extension's status bar item.
 *
 * The Vanilla class provides methods to activate and deactivate the Flawuldragon extension, including setting up
 * the status bar item, registering commands, and handling the extension's enabled/disabled state.
 *
 * @class
 * @example
 * // Example usage:
 * const vanilla = new Vanilla();
 * vanilla.vanilla_activate(context);
 */
export class Vanilla {
  /**
   * A status bar item for the Flawuldragon extension.
   * This status bar item is aligned to the left with a priority of 100.
   */
  public flawuldragonStatusBar: vscode.StatusBarItem =
    constants.statusBar.positions.posA;

  /**
   * A status bar item that displays the date and time for the Flawuldragon extension.
   *
   * This status bar item is aligned to the left with a priority of 98.
   * It is created using the `vscode.window.createStatusBarItem` method.
   */
  protected flawuldragonDateTimeStatusBar: vscode.StatusBarItem =
    constants.statusBar.positions.posC;

  /**
   * A unique identifier for the status bar item associated with the Flawuldragon extension.
   * This ID is used to register and manage the status bar item within the extension.
   */
  protected flawuldragonStatusbaritemId =
    constants.commands.vanilla.release.fdNotesViewPanel;

  /** 
   * Flawuldragon DateTime States ⌁ Global Getter
   * ___
   * gstate: 0 - date first, 1 - time first
   * 
   * dstate: 0 - american format, 1 - european format
   * 
   * tstate: 0 - 24-hour format, 1 - 12-hour format
  */
  protected flwdnDts = fs
    .readFileSync(__dirname + '/flwdnDts.json', 'utf-8')
    .toString()
    .match(/\d/gi);

  /**
   * Flawuldragon DateTime States
   * ___
   * gstate: 0 - [dayweek] [date] [time], 1 - [time] [date] [dayweek], 2 - [date] [dayweek] [time], 3 - [time] [dayweek] [date], 4 - [dayweek] [time] [date], 5 - [date] [time] [dayweek]
   */
  protected flwdnGstate = parseInt(this.flwdnDts[0]);

  /**
   * Flawuldragon DateTime States
   * ___
   * dstate: 0 - european format, 1 - american format
   */
  protected flwdnDstate = parseInt(this.flwdnDts[1]);
  
  /**
   * Flawuldragon DateTime States
   * ___
   * tstate: 0 - 24-hour format, 1 - 12-hour format
   */
  protected flwdnTstate = parseInt(this.flwdnDts[2]);

  /**
   * Flawuldragon DateTime States
   * ___
   * hstate: 0 - show date and time, 1 - show only time, 2 - show only date
   */
  protected flwdnHstate = parseInt(this.flwdnDts[3]);

  /**
   * Flawuldragon DateTime States
   * ___
   * sstate: 0 - hide seconds in time, 1 - show seconds in time
   */
  protected flwdnSstate = parseInt(this.flwdnDts[4]);

  /**
   * Flawuldragon DateTime States
   * ___
   * wstate: 0 - hide day of the week, 1 - show day of the week
   */
  protected flwdnWstate = parseInt(this.flwdnDts[5]);

  /**
   * Registers a command to open a webview panel displaying Flawuldragon Notes and sets up a status bar item.
   *
   * @param context - The extension context provided by VS Code.
   *
   * The command creates a webview panel with the title 'Flawuldragon Notes' and an icon.
   * The webview content is loaded from an HTML file.
   *
   * The status bar item displays an icon and text 'FD', and shows a tooltip 'Click to view Flawuldragon Notes'.
   * Clicking the status bar item triggers the command to open the webview panel.
   */
  protected vanilla_flawuldragonNotes(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
      vscode.commands.registerCommand(this.flawuldragonStatusbaritemId, () => {
        let viewPanel = vscode.window.createWebviewPanel(
          'flawuldragon',
          'Flawuldragon Notes',
          vscode.ViewColumn.One,
          {
            enableScripts: true,
            enableForms: true
          }
        );
        viewPanel.title = 'Flawuldragon Notes';
        viewPanel.iconPath = vscode.Uri.file(
          path.join(__dirname, '../../', 'assets', 'icon.png')
        );
        viewPanel.webview.html = fs
          .readFileSync(
            path.join(__dirname, '../../', 'display', 'flawuldragon.html')
          )
          .toString();
        return 0;
      })
    );

    // flawuldragon development notes status bar item
    this.flawuldragonStatusBar.text = `$(flawuldragon-on)`;
    this.flawuldragonStatusBar.command = this.flawuldragonStatusbaritemId;
    this.flawuldragonStatusBar.backgroundColor = new vscode.ThemeColor(
      'statusBarItem.warningBackground'
    );
    this.flawuldragonStatusBar.tooltip = 'Click to view Flawuldragon Notes';
    this.flawuldragonStatusBar.show();
    context.subscriptions.push(this.flawuldragonStatusBar);
  }

  /**
   * Constructs a status bar item interruptor that toggles the visibility of the status bar item.
   *
   * @param statusBarItem - The status bar item to be controlled.
   * @param command - The command identifier to register for toggling the status bar item.
   *
   * This method registers a command that toggles the visibility of the provided status bar item.
   * When the command is executed, the status bar item is either shown or hidden based on its current state.
   */
  public vanilla_interruptorStatusBarConstructor(
    statusBarItem: vscode.StatusBarItem,
    command: string
  ): void {
    const interruptor: IVFDInterruptor = { on: true, off: false };
    vscode.commands.registerCommand(command, () => {
      if (interruptor.on == true) {
        statusBarItem.hide();
        interruptor.on = false;
        interruptor.off = true;
      } else {
        statusBarItem.show();
        interruptor.on = true;
        interruptor.off = false;
      }
    });
  }

  /**
   * Updates the status bar with the current date and time every second.
   *
   * @param context - The VS Code extension context.
   *
   * This method sets up an interval that updates the status bar item with the current date and time
   * formatted as `DD/MM/YYYY - HH:MM`. It also sets the tooltip and background color of the status bar item,
   * and ensures it is shown in the status bar. The status bar item is added to the extension's subscriptions
   * to ensure it is disposed of properly when the extension is deactivated.
   */
  protected vanilla_dateTimeComponent(context: vscode.ExtensionContext): void {
    let text: string,
      divisor = ' ◈ ';
    // pausa para o processador descansar um pouco
    setTimeout(() => {
      setInterval(() => {
        let timer: Date = new Date(),
          day = timer.getDate().toString(),
          month = (timer.getMonth() + 1).toString(),
          hours = timer.getHours().toString(),
          minutes = timer.getMinutes().toString(),
          seconds = timer.getSeconds().toString(),
          dayofweek = timer.getDay().toString(),
          hours12hf =
            timer.getHours() > 12 ? timer.getHours() - 12 : timer.getHours();
  
        if (parseInt(day) < 10) day = 0 + day;
        if (parseInt(month) < 10) month = 0 + month;
        if (parseInt(hours) < 10) hours = 0 + hours;
        if (parseInt(minutes) < 10) minutes = 0 + minutes;
        if (parseInt(seconds) < 10) seconds = 0 + seconds;

        switch(this.flwdnGstate) { // #fff
          case 0:
            switch(this.flwdnDstate) {
              case 0:
                switch(this.flwdnTstate) {
                  case 0:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0: // 0-0-0-0-0-0
                                text = `${day}/${month}/${timer.getFullYear()}${divisor}${hours}:${minutes}`;
                                break;
                              case 1: // 0-0-0-0-0-1
                                text = `${dayofweek}${divisor}${day}/${month}/${timer.getFullYear()}${divisor}${hours}:${minutes}`;
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0: // 0-0-0-0-1-0
                                text = `${day}/${month}/${timer.getFullYear()}${divisor}${hours}:${minutes}:${seconds}`;
                                break;
                              case 1: // 0-0-0-0-1-1
                                text = `${dayofweek}${divisor}${day}/${month}/${timer.getFullYear()}${divisor}${hours}:${minutes}:${seconds}`;
                                break; // 4
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0: // 0-0-0-1-0-0
                                text = `${hours}:${minutes}`;
                                break;
                              case 1: // 0-0-0-1-0-1
                                text = `${dayofweek}${divisor}${hours}:${minutes}`;
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0: // 0-0-0-1-1-0
                                text = `${hours}:${minutes}:${seconds}`;
                                break;
                              case 1: // 0-0-0-1-1-1
                                text = `${dayofweek}${divisor}${hours}:${minutes}:${seconds}`;
                                break; // 8
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0: // 0-0-0-2-0-0
                                text = `${day}/${month}/${timer.getFullYear()}`;
                                break;
                              case 1: // 0-0-0-2-0-1
                                text = `${dayofweek}${divisor}${day}/${month}/${timer.getFullYear()}`;
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0: // 0-0-0-2-1-0
                                text = `${day}/${month}/${timer.getFullYear()}`;
                                break;
                              case 1: // 0-0-0-2-1-1
                                text = `${dayofweek}${divisor}${day}/${month}/${timer.getFullYear()}`;
                                break; // 12
                            }
                            break;
                        }
                        break;
                    }
                    break;
                  case 1:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0: // 0-0-1-0-0-0
                                text = `${day}/${month}/${timer.getFullYear()}${divisor}${hours12hf}:${minutes} ${timer.getHours() > 12 ? 'PM' : 'AM'}`;
                                break;
                              case 1: // 0-0-1-0-0-1
                                text = `${dayofweek}${divisor}${day}/${month}/${timer.getFullYear()}${divisor}${hours12hf}:${minutes} ${timer.getHours() > 12 ? 'PM' : 'AM'}`;
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0: // 0-0-1-0-1-0
                                text = `${day}/${month}/${timer.getFullYear()}${divisor}${hours12hf}:${minutes}:${seconds} ${timer.getHours() > 12 ? 'PM' : 'AM'}`;
                                break;
                              case 1: // 0-0-1-0-1-1
                                text = `${dayofweek}${divisor}${day}/${month}/${timer.getFullYear()}${divisor}${hours12hf}:${minutes}:${seconds} ${timer.getHours() > 12 ? 'PM' : 'AM'}`;
                                break; // 16
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                }
                break;
              case 1:
                switch(this.flwdnTstate) {
                  case 0:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                  case 1:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                }
                break;
            }
            break;
          case 1:
            switch(this.flwdnDstate) {
              case 0:
                switch(this.flwdnTstate) {
                  case 0:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                  case 1:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                }
                break;
              case 1:
                switch(this.flwdnTstate) {
                  case 0:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                  case 1:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                }
                break;
            }
            break;
          case 2:
            switch(this.flwdnDstate) {
              case 0:
                switch(this.flwdnTstate) {
                  case 0:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                  case 1:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                }
                break;
              case 1:
                switch(this.flwdnTstate) {
                  case 0:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                  case 1:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                }
                break;
            }
            break;
          case 3:
            switch(this.flwdnDstate) {
              case 0:
                switch(this.flwdnTstate) {
                  case 0:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                  case 1:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                }
                break;
              case 1:
                switch(this.flwdnTstate) {
                  case 0:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                  case 1:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                }
                break;
            }
            break;
          case 4:
            switch(this.flwdnDstate) {
              case 0:
                switch(this.flwdnTstate) {
                  case 0:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                  case 1:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                }
                break;
              case 1:
                switch(this.flwdnTstate) {
                  case 0:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                  case 1:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                }
                break;
            }
            break;
          case 5:
            switch(this.flwdnDstate) {
              case 0:
                switch(this.flwdnTstate) {
                  case 0:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                  case 1:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                }
                break;
              case 1:
                switch(this.flwdnTstate) {
                  case 0:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                  case 1:
                    switch(this.flwdnHstate) {
                      case 0:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 1:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                      case 2:
                        switch(this.flwdnSstate) {
                          case 0:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                          case 1:
                            switch(this.flwdnWstate) {
                              case 0:
                                break;
                              case 1:
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                }
                break;
            }
            break;
        }

        this.flawuldragonDateTimeStatusBar.text = text;
      }, 1000);
    }, 100);

    function generateJson(): string {
      return JSON.stringify({
        gstate: this.flwdnGstate,
        dstate: this.flwdnDstate,
        tstate: this.flwdnTstate,
        hstate: this.flwdnHstate,
        sstate: this.flwdnSstate,
        wstate: this.flwdnWstate
      });
    }

    this.flawuldragonDateTimeStatusBar.tooltip = 'Current time';
    this.flawuldragonDateTimeStatusBar.backgroundColor = new vscode.ThemeColor(
      'statusBarItem.warningBackground'
    );
    this.flawuldragonDateTimeStatusBar.show();
    context.subscriptions.push(this.flawuldragonDateTimeStatusBar);

    vscode.commands.registerCommand(
      constants.commands.vanilla.release.fdPropsInvertPositions,
      () => {
        switch(this.flwdnGstate) {
          case 0:
            this.flwdnGstate = 1;
            break;
          case 1:
            this.flwdnGstate = 2;
            break;
          case 2:
            this.flwdnGstate = 3;
            break;
          case 3:
            this.flwdnGstate = 4;
            break;
          case 4:
            this.flwdnGstate = 5;
            break;
          case 5:
            this.flwdnGstate = 0;
            break;
        }
        fs.writeFileSync(
          __dirname + '/flwdnDts.json',
          generateJson()
        );
      }
    );

    vscode.commands.registerCommand(
      constants.commands.vanilla.release.fdPropsAmericanFormat,
      () => {
        if (this.flwdnDstate == 1) {
          this.flwdnDstate = 0;
        } else {
          this.flwdnDstate = 1;
        }
        fs.writeFileSync(
          __dirname + '/flwdnDts.json',
          generateJson()
        );
      }
    );

    vscode.commands.registerCommand(
      constants.commands.vanilla.release.fdProps12HourFormat,
      () => {
        if (this.flwdnTstate == 1) {
          this.flwdnTstate = 0;
        } else {
          this.flwdnTstate = 1;
        }
        fs.writeFileSync(
          __dirname + '/flwdnDts.json',
          generateJson()
        );
      }
    );

    vscode.commands.registerCommand(
      constants.commands.vanilla.release.fdPropsSwitchVisibility,
      () => {
        switch(this.flwdnHstate) {
          case 0:
            this.flwdnHstate = 1;
            break;
          case 1:
            this.flwdnHstate = 2;
            break;
          case 2:
            this.flwdnHstate = 0;
            break;
        }
        fs.writeFileSync(
          __dirname + '/flwdnDts.json',
          generateJson()
        );
      }
    )

    vscode.commands.registerCommand(
      constants.commands.vanilla.release.fdPropsShowSeconds,
      () => {
        if (this.flwdnSstate == 1) {
          this.flwdnSstate = 0;
        } else {
          this.flwdnSstate = 1;
        }
        fs.writeFileSync(
          __dirname + '/flwdnDts.json',
          generateJson()
        );
      }
    )

    vscode.commands.registerCommand(
      constants.commands.vanilla.release.fdPropsShowDayWeek,
      () => {
        if (this.flwdnWstate == 1) {
          this.flwdnWstate = 0;
        } else {
          this.flwdnWstate = 1;
        }
        fs.writeFileSync(
          __dirname + '/flwdnDts.json',
          generateJson()
        );
      }
    )
  }

  /**
   * Activates the Flawuldragon extension.
   *
   * This method sets up the status bar item and command for the Flawuldragon extension.
   * It creates a webview panel to display Flawuldragon Notes and configures the status bar item
   * with appropriate text, color, and tooltip. If the extension is disabled in the settings,
   * it updates the status bar item to reflect the disabled state and shows a warning message.
   *
   * @param context - The extension context provided by VS Code.
   */
  public vanilla_activate(context: vscode.ExtensionContext) {
    try {
      console.log('Flawuldragon - Vanilla activated!');
      this.vanilla_flawuldragonNotes(context);
      this.vanilla_dateTimeComponent(context);
      this.vanilla_interruptorStatusBarConstructor(
        this.flawuldragonDateTimeStatusBar,
        constants.commands.vanilla.release.fdDateTimeStatusbar
      ); // show or hide the status bar

      vscode.workspace
        .getConfiguration()
        .update('editor.inlayHints.enabled', true);

      vscode.workspace
        .getConfiguration()
        .update('editor.inlayHints.fontFamily', 'JetBrains Mono');

      vscode.workspace
        .getConfiguration()
        .update('editor.inlayHints.fontSize', 12);

      vscode.workspace
        .getConfiguration()
        .update('accessibility.signals.lineHasError', { sound: 'on' });

      vscode.workspace
        .getConfiguration()
        .update('accessibility.signals.lineHasWarning', {
          sound: 'on',
          announcement: 'auto'
        });

      vscode.workspace
        .getConfiguration()
        .update('accessibility.signals.lineHasInlineSuggestion', {
          sound: 'on'
        });

      vscode.commands.registerCommand(constants.commands.vanilla.release.fdAccessibilityInlayHints, ()=>{
        if(vscode.workspace.getConfiguration().get('editor.inlayHints.enabled')){
          vscode.workspace.getConfiguration().update('editor.inlayHints.enabled', false);
        } else {
          vscode.workspace.getConfiguration().update('editor.inlayHints.enabled', true);
        }
      });

      vscode.commands.registerCommand(constants.commands.vanilla.release.fdAccessibilityInlayHintsFontFamily, ()=>{
        if(vscode.workspace.getConfiguration().get('editor.inlayHints.fontFamily') == 'JetBrains Mono'){
          vscode.workspace.getConfiguration().update('editor.inlayHints.fontFamily', 'Segoe UI');
        } else {
          vscode.workspace.getConfiguration().update('editor.inlayHints.fontFamily', 'JetBrains Mono');
        }
      });

      vscode.commands.registerCommand(constants.commands.vanilla.release.fdAccessibilityInlayHintsFontSize, ()=>{
        if(vscode.workspace.getConfiguration().get('editor.inlayHints.fontSize') == 12){
          vscode.workspace.getConfiguration().update('editor.inlayHints.fontSize', 14);
        } else {
          vscode.workspace.getConfiguration().update('editor.inlayHints.fontSize', 12);
        }
      });

      vscode.commands.registerCommand(constants.commands.vanilla.release.fdAccessibilitySignalsLineHasError, ()=>{
        if((vscode.workspace.getConfiguration().get('accessibility.signals.lineHasError') as { sound: string }).sound == 'on'){
          vscode.workspace.getConfiguration().update('accessibility.signals.lineHasError', { sound: 'off' });
        } else {
          vscode.workspace.getConfiguration().update('accessibility.signals.lineHasError', { sound: 'on' });
        }
      });

      vscode.commands.registerCommand(constants.commands.vanilla.release.fdAccessibilitySignalsLineHasWarning, ()=>{
        if((vscode.workspace.getConfiguration().get('accessibility.signals.lineHasError') as { sound: string }).sound == 'on'){
          vscode.workspace.getConfiguration().update('accessibility.signals.lineHasWarning', { sound: 'off', announcement: 'off' });
        } else {
          vscode.workspace.getConfiguration().update('accessibility.signals.lineHasWarning', { sound: 'on', announcement: 'auto' });
        }
      });

      vscode.commands.registerCommand(constants.commands.vanilla.release.fdAccessibilitySignalsLineHasInlineSuggestion, ()=>{
        if((vscode.workspace.getConfiguration().get('accessibility.signals.lineHasError') as { sound: string }).sound == 'on'){
          vscode.workspace.getConfiguration().update('accessibility.signals.lineHasInlineSuggestion', { sound: 'off' });
        } else {
          vscode.workspace.getConfiguration().update('accessibility.signals.lineHasInlineSuggestion', { sound: 'on' });
        }
      });

    } catch (error) {
      this.vanilla_desactivate();
      console.error('Flawuldragon vanilla error: ' + error);
      vscode.window.showErrorMessage(
        'An error occurred while activating the Flawuldragon vanilla features: ' +
          error +
          '. Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)'
      );
    } finally {
    }
  }

  /**
   * Deactivates the vanilla feature by disposing of the flawuldragon status bar.
   */
  public vanilla_desactivate() {
    console.log('Flawuldragon - Vanilla deactivated!');

    vscode.workspace
      .getConfiguration()
      .update('editor.inlayHints.enabled', false);

    vscode.workspace
      .getConfiguration()
      .update('editor.inlayHints.fontFamily', 'Segoe UI');

    vscode.workspace
      .getConfiguration()
      .update('editor.inlayHints.fontSize', 12);

    vscode.workspace
      .getConfiguration()
      .update('accessibility.signals.lineHasError', { 
        sound: 'off' 
      });

    vscode.workspace
      .getConfiguration()
      .update('accessibility.signals.lineHasWarning', {
        sound: 'off',
        announcement: 'auto'
      });

    vscode.workspace
      .getConfiguration()
      .update('accessibility.signals.lineHasInlineSuggestion', {
        sound: 'off'
      });

  }
}
