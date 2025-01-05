import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { IVFDInterruptor } from './IVFDInterruptor';
import * as packageJson from '../package.json';
import { constants } from './constants.cjs';

/**
 * Interface Save Mode Display StatusBar
 * 1- Display datetime default visualization (date - time)
 * 2- Display datetime invert position visualization (time - date)
 * 3- Display datetime with seconds visualization
 * 4- Display datetime with custom time format
 */

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
  protected flawuldragonStatusBar: vscode.StatusBarItem = constants.statusBar.positions.posA;

  /**
   * A status bar item that displays the date and time for the Flawuldragon extension.
   *
   * This status bar item is aligned to the left with a priority of 98.
   * It is created using the `vscode.window.createStatusBarItem` method.
   */
  protected flawuldragonDateTimeStatusBar: vscode.StatusBarItem = constants.statusBar.positions.posC;

  /**
   * A unique identifier for the status bar item associated with the Flawuldragon extension.
   * This ID is used to register and manage the status bar item within the extension.
   */
  protected flawuldragonStatusbaritemId = constants.commands.vanilla.release.fdNotesViewPanel;

  protected vanilla_flawuldragonNotes(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
      vscode.commands.registerCommand(this.flawuldragonStatusbaritemId, () => {
        let viewPanel = vscode.window.createWebviewPanel(
          'flawuldragon',
          'Flawuldragon Notes',
          vscode.ViewColumn.One,
          {}
        );
        viewPanel.title = 'Flawuldragon Notes';
        viewPanel.iconPath = vscode.Uri.file(
          path.join(__dirname, '../', 'assets', 'icon.png')
        );
        viewPanel.webview.html = fs
          .readFileSync(
            path.join(__dirname, '../', 'webview', 'flawuldragon.html')
          )
          .toString();
        return 0;
      })
    );

    // flawuldragon development notes status bar item
    this.flawuldragonStatusBar.text = `$(flawuldragon-on) FD`;
    this.flawuldragonStatusBar.command = this.flawuldragonStatusbaritemId;
    this.flawuldragonStatusBar.backgroundColor = new vscode.ThemeColor(
      'statusBarItem.warningBackground'
    );
    this.flawuldragonStatusBar.tooltip = 'Click to view Flawuldragon Notes';
    this.flawuldragonStatusBar.show();
    context.subscriptions.push(this.flawuldragonStatusBar);
  }

  protected vanilla_checkingIsOk(): void {
    // check if the extension is enabled in the settings
    if (
      vscode.workspace.getConfiguration('flawuldragon').get('enable') === false
    ) {
      console.warn('Flawuldragon is disabled. Enable it in your settings.');
      vscode.window.showWarningMessage(
        'Flawuldragon is disabled. Enable it in your settings.'
      );
      this.flawuldragonStatusBar.text = `$(flawuldragon-off) FD`;
      this.flawuldragonStatusBar.color = 'darkred';
      this.flawuldragonStatusBar.backgroundColor = new vscode.ThemeColor(
        'statusBarItem.errorBackground'
      );
      return;
    }
  }

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

  protected vanilla_dateTimeComponent(): void {
    packageJson.flawuldragonFlags.statusBars.vanilla.dateTime;

    vscode.commands.registerCommand('flawuldragon.vanillaDateTime.invertPosition', ()=>{});
    vscode.commands.registerCommand('flawuldragon.vanillaDateTime.showSeconds', ()=>{});
    vscode.commands.registerCommand('flawuldragon.vanillaDateTime.timeFormat', ()=>{});
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

      /** -------------------- Development Block ------------------------------- */

      // arrumar todos os itens abaixo
      let int_timer, int_date, int_hours, int_minutes, int_seconds, int_text;

      // flawuldragon date and time status bar items
      // update every second window to show the current time
      setInterval(() => {
        let timer: Date = new Date(),
          text: string;
        let day = timer.getDate().toString();
        let month = (timer.getMonth() + 1).toString();
        let hours = timer.getHours().toString();
        let minutes = timer.getMinutes().toString();
        if (parseInt(day) < 10) {
          day = 0 + day;
        }
        if (parseInt(month) < 10) {
          month = 0 + month;
        }
        if (parseInt(hours) < 10) {
          hours = 0 + hours;
        }
        if (parseInt(minutes) < 10) {
          minutes = 0 + minutes;
        }
        let date = `${day}-${month}-${timer.getFullYear()}`;
        text = date + ` ◆ ${hours}:${minutes}`;
        this.flawuldragonDateTimeStatusBar.text = text;
      }, 1000);
      this.flawuldragonDateTimeStatusBar.tooltip = 'Current time';
      this.flawuldragonDateTimeStatusBar.backgroundColor =
        new vscode.ThemeColor('statusBarItem.warningBackground');
      this.flawuldragonDateTimeStatusBar.show();
      context.subscriptions.push(this.flawuldragonDateTimeStatusBar);

      this.vanilla_interruptorStatusBarConstructor(
        this.flawuldragonDateTimeStatusBar,
        constants.commands.vanilla.release.fdDateTimeStatusbar
      ); // show or hide the status bar
    
      // // flawuldragon dont applied commands
      // vscode.commands.registerCommand(
      //   'flawuldragon.vanillaDateTime.invertTextPosition',
      //   () => {
      //     // invert the text position
      //     if(text == `${date} ◆ ${hours}:${minutes}`){
      //       text = `${minutes}:${hours} ◆ ${date}`;
      //     } else {
      //       text = `${date} ◆ ${hours}:${minutes}`;
      //     }
      //   }
      // );
      /** -------------------- End of Development Block --------------------------- */

      this.vanilla_checkingIsOk();
    } catch (error) {
      console.error('Flawuldragon vanilla error: ' + error);
      vscode.window.showErrorMessage(
        'An error occurred while activating the Flawuldragon vanilla features: ' +
          error +
          '. Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)'
      );
      this.vanilla_desactivate();
    } finally {
    }
  }

  /**
   * Deactivates the vanilla feature by disposing of the flawuldragon status bar.
   */
  public vanilla_desactivate() {
    this.flawuldragonStatusBar.dispose();
  }
}

class VDateTime {
  /**
   * A status bar item that displays the date and time for the Flawuldragon extension.
   *
   * This status bar item is aligned to the left with a priority of 98.
   * It is created using the `vscode.window.createStatusBarItem` method.
   */
  // protected flawuldragonDateTimeStatusBar: vscode.StatusBarItem =
  //   vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98);
}

class VTimer {
  protected horas = 0;
  protected minutos = 0;
  protected segundos = 0;
  protected temporizador = setInterval(()=>{
    this.segundos++;
    if (this.segundos == 60){
      this.segundos = 0;
      this.minutos++;
    }
    if (this.minutos == 60){
      this.minutos = 0;
      this.horas++;
    }
  }, 1000);

  protected escritorDeInformacoes(): void {
    // write the timer information
    // date, time, timer, etc.
    // fs.writeFileSync('./timerInfos.txt', 'Timer: ' + this.horas + ':' + this.minutos + ':' + this.segundos);
  }

  protected flawuldragonTimerStatusBar: vscode.StatusBarItem = constants.statusBar.positions.posD;

  public constructor(context: vscode.ExtensionContext){
    this.flawuldragonTimerStatusBar.text = "00:00:00 Elapsed (Placeholder)";
    this.flawuldragonTimerStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    this.flawuldragonTimerStatusBar.show();
    context.subscriptions.push(this.flawuldragonTimerStatusBar);
  }

  protected vtimer_storageInformations(): void {
    // store the timer information
  }
}

class VExtensionIntelligence {
  public constructor(){
    // desabilita as extensoes duplicadas
    /**
     * [Auto Close Tag]
     * Publisher 	Jun Han 	
     * Unique Identifier 	formulahendry.auto-close-tag
     * 
     * [Auto Complete Tag]
     * Publisher 	Jun Han 	
     * Unique Identifier 	formulahendry.auto-complete-tag
     * 
     * [Auto Rename Tag]
     * Publisher 	Jun Han
     * Unique Identifier 	formulahendry.auto-rename-tag
     * 
     * [Color Highlight]
     * Publisher 	Sergii Naumov
     * Unique Identifier 	naumovs.color-highlight
     * 
     * [Error Lens]
     * Publisher 	Phil Hutchinson
     * Unique Identifier 	philhindle.errorlens
     * 
     * [Filesize]
     * Publisher 	Wei_ds
     * Unique Identifier 	wei_ds.filesize
     * 
     * [Indent Rainbow]
     * Publisher 	oderwat
     * Unique Identifier 	oderwat.indent-rainbow
     * 
     * [Jetbrains Mono Font Pack]
     * Publisher 	Narasima Pandiyan 	
     * Unique Identifier 	NarasimaPandiyan.jetbrainsmono
     * 
     * [Pomodoro Clock]
     * Publisher 	jackluson 	
     * Unique Identifier 	jackluson.pomodoro-clock
     * 
     * [Theme Switch]
     * Publisher 	Wei Wang
     * Unique Identifier 	weiiwang.theme-switch
     * 
     * [Todo Highlight]
     * Publisher 	Wayou Liu 	
     * Unique Identifier 	wayou.vscode-todo-highlight
     * 
     * [Fluent Icons]
     * Publisher 	Miguel Solorio 	
     * Unique Identifier 	miguelsolorio.fluent-icons
     * 
     * [Visual Studio Icons v1]
     * Publisher 	Jordan Lowe 	
     * Unique Identifier 	jtlowe.vscode-icon-theme
     * 
     * [Visual Studio Icons v2]
     * Publisher 	vigan-abd 	
     * Unique Identifier 	vigan-abd.vscode-icon-v2
     * 
     * [Visual Studio Icons Classic]
     * Publisher 	jez9999 	
     * Unique Identifier 	jez9999.vsclassic-icon-theme
     * 
     * [Visual Studio Code Icons]
     * Publisher 	VSCode Icons Team 	
     * Unique Identifier 	vscode-icons-team.vscode-icons
     * 
     * [Datapack Icons Minecraft]
     * Publisher 	FuncFusion 	
     * Unique Identifier 	SuperAnt.mc-dp-icons
     * 
     */
    vscode.workspace.getConfiguration().get('installedExtensions');
  }
}
