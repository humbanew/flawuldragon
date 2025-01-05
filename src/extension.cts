import * as vscode from 'vscode';
import { ErrorLens } from './@errorlens/ErrorLens.cjs';
import { FileSize } from './@filesize/FileSize.cjs';
import { IndentRainbow } from './@indentrainbow/IndentRainbow.cjs';
import { JetbrainsMono } from './@jetbrainsmono/JetbrainsMono.cjs';
import { PomodoroClock } from './@pomodoroclock/PomodoroClock.cjs';
import { ThemeSwitch } from './@themeswitch/ThemeSwitch.cjs';
import { TodoHighlight } from './@todohighlight/TodoHighlight.cjs';
import { Vanilla } from './@vanilla/Vanilla.cjs';

const vanilla = new Vanilla();
const jetbrainsmono = new JetbrainsMono();
const filesize = new FileSize();
const todohighlight = new TodoHighlight();
const indentrainbow = new IndentRainbow();
const pomodoroclock = new PomodoroClock();
const themeswitch = new ThemeSwitch();
const errorlens = new ErrorLens();

/**
 * Activates the extension.
 *
 * This function is called when the extension is activated. It is used to set up
 * any necessary state or register commands, providers, etc.
 *
 * @param context - The context in which the extension is activated. This provides
 * access to the extension's global state, subscriptions, and other utilities.
 */
export function activate(context: vscode.ExtensionContext) {
  try {
    console.log('Flawuldragon - Core Hub activated!');

    vanilla.vanilla_activate(context);
    jetbrainsmono.jetbrainsMono_activate(context);
    jetbrainsmono.jetbrainsMono_firstTimeActivation(context);
    filesize.filesize_activate(context);
    todohighlight.todoHighlight_activate(context);
    indentrainbow.indentRainbow_activate(context);
    pomodoroclock.pomodoroClock_activate(context);
    themeswitch.themeSwitch_activate(context);
    errorlens.errorLens_activate(context);
  } catch (error) {
    console.log('Flawuldragon Core Hub - Error: ' + error);
    vscode.window.showErrorMessage(
      'An error occurred while activating the Flawuldragon core hub: ' +
        error +
        '. Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)'
    );
    deactivate(context);
  } finally {}
}

/**
 * Deactivates the extension.
 *
 * This function is called when the extension is deactivated. It can be used to
 * perform any necessary cleanup tasks.
 *
 * @param context - The context in which the extension is running.
 */
export function deactivate(context: vscode.ExtensionContext) {
  vanilla.vanilla_desactivate();
  jetbrainsmono.jetbrainsMono_desactivate(context);
  filesize.filesize_desactivate();
  todohighlight.todoHighlight_desactivate();
  indentrainbow.indentRainbow_desactivate();
  pomodoroclock.pomodoroClock_desactivate();
  themeswitch.themeSwitch_desactivate();
  errorlens.errorLens_desactivate();
}

/**
 * Activates the JetBrains Mono prompt within the given VS Code extension context.
 *
 * @param context - The VS Code extension context in which the activation prompt is triggered.
 */
export function activationPrompt(context: vscode.ExtensionContext) {
  jetbrainsmono.jetbrainsMono_activationPrompt(context);
}
