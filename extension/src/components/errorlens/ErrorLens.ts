/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as vscode from 'vscode';
import { ELLogger } from './ELLogger';
import { ELCommands } from './ELCommands';
import { ELDecorations } from './ELDecorations';
import { EELConstants } from './enums';
import { ELStatusBarMessage } from './ELStatusBarMessage';
import { ELStatusBarIcons } from './ELStatusBarIcons';
import { ELExtUtils } from './ELExtUtils';
import { ELErrorLensCodeLens } from './ELErrorLensCodeLens';
import { ELEvents } from './ELEvents';
import { TELExtensionConfig } from './declares';

/**
 * All user settings.
 */
export let $config: TELExtensionConfig;

/**
 * Global state.
 */
export abstract class $state {
  static configErrorEnabled = true;
  static configWarningEnabled = true;
  static configInfoEnabled = true;
  static configHintEnabled = true;
  /**
   * VSCode `problems.visibility` setting value.
   */
  static vscodeGlobalProblemsEnabled = true;
  /**
   * Status bar object. Handles all status bar stuff (for text message)
   */
  static statusBarMessage: ELStatusBarMessage;
  /**
   * Status bar object. Handles all status bar stuff (for icons)
   */
  static statusBarIcons: ELStatusBarIcons;
  /**
   * Code Lens Provider. Handles all Code Lens stuff https://github.com/microsoft/vscode-extension-samples/tree/main/codelens-sample
   */
  static codeLens: ELErrorLensCodeLens;
  /**
   * Array of RegExp matchers and their updated messages.
   * message may include groups references like $0 (entire expression), $1 (first group), etc.
   */
  static replaceRegexp?: {
    matcher: RegExp;
    message: string;
  }[] = undefined;

  /**
   * Array of RegExp (that would match against diagnostic message)
   */
  static excludeRegexp: RegExp[] = [];
  /**
   * Array of source/code to ignore (that would match against diagnostic object)
   */
  static excludeSources: {
    source: string;
    code?: string;
  }[] = [];

  /**
   * Array of document selectors (that would match against document)
   */
  static excludePatterns?: {
    pattern: string;
  }[] = undefined;

  /**
   * Editor icons can be rendered only for active line (to reduce the visual noise).
   * But it might be useful to show gutter icons for all lines. With `gutterIconsFollowCursorOverride`
   * setting then gutter icons will be rendered as a separate set of decorations.
   */
  static renderGutterIconsAsSeparateDecoration: boolean;
  /**
   * Set event listener for when editor visibleRanges change (vertical scroll), only when necessary.
   */
  static shouldUpdateOnEditorScrollEvent: boolean;
  /**
   * Use console.log() when developing extension.
   */
  static logger: ELLogger;
  static log = (message: string, ...args: unknown[]): void => {
    $state.logger.log(message, ...args);
  };
}

/**
 * The ErrorLens class provides functionality to manage and update error decorations,
 * status bar messages, and icons in the VSCode editor. It handles configuration changes,
 * updates decorations for visible editors, and manages event listeners.
 *
 * @class
 * @example
 * // Example usage:
 * const errorLens = new FDErrorLens();
 * errorLens.activate(context);
 */
export class FDErrorLens {
  /**
   * Runs only on extension configuration change event.
   *
   * - Update all global state
   * - Update all decoration styles
   * - Update decorations for all visible editors
   * - Update all event listeners
   */
  protected updateEverything(context: vscode.ExtensionContext): void {
    this.updateTransformState();
    this.updateExcludeState();

    $state.renderGutterIconsAsSeparateDecoration =
      $config.gutterIconsEnabled &&
      $config.gutterIconsFollowCursorOverride &&
      $config.followCursor !== 'allLines';

    $state.shouldUpdateOnEditorScrollEvent =
      $config.followCursor === 'closestProblemMultiline' ||
      $config.followCursor === 'closestProblemMultilineInViewport' ||
      $config.followCursor === 'closestProblemMultilineBySeverity';

    $state.statusBarMessage?.dispose();
    $state.statusBarIcons?.dispose();
    $state.statusBarMessage = new ELStatusBarMessage({
      isEnabled: ELExtUtils.prototype.shouldShowStatusBarMessage(),
      colorsEnabled: $config.statusBarColorsEnabled,
      messageType: $config.statusBarMessageType,
      priority: $config.statusBarMessagePriority,
      alignment: $config.statusBarMessageAlignment
    });
    $state.statusBarIcons = new ELStatusBarIcons({
      isEnabled: ELExtUtils.prototype.shouldShowStatusBarIcons(),
      atZero: $config.statusBarIconsAtZero,
      useBackground: $config.statusBarIconsUseBackground,
      targetProblems: $config.statusBarIconsTargetProblems
    });
    $state.codeLens?.dispose();
    $state.codeLens = new ELErrorLensCodeLens(context);
    $state.configErrorEnabled = $config.enabledDiagnosticLevels.includes('error');
    $state.configWarningEnabled = $config.enabledDiagnosticLevels.includes('warning');
    $state.configInfoEnabled = $config.enabledDiagnosticLevels.includes('info');
    $state.configHintEnabled = $config.enabledDiagnosticLevels.includes('hint');

    ELDecorations.prototype.setDecorationStyle(context);

    ELDecorations.prototype.updateDecorationsForAllVisibleEditors();

    $state.statusBarIcons.updateText();

    ELEvents.prototype.updateChangeDiagnosticListener();
    ELEvents.prototype.updateChangeVisibleTextEditorsListener();
    ELEvents.prototype.updateOnSaveListener();
    ELEvents.prototype.updateCursorChangeListener();
    ELEvents.prototype.updateChangedActiveTextEditorListener();
    ELEvents.prototype.updateChangeBreakpointsListener();
    ELEvents.prototype.updateOnVisibleRangesListener();
  }

  /**
   * - Create `RegExp` from string for messages.
   */
  protected updateTransformState(): void {
    $state.replaceRegexp = $config.replace.map(config => ({
      matcher: this.createMessageRegex(config.matcher),
      message: config.message
    }));
  }

  /**
   * - Create `RegExp` from string for messages.
   * - Create `DocumentFilter[]` for document match.
   * - Create `source/code` exclusion object.
   */
  protected updateExcludeState(): void {
    $state.excludeRegexp = [];
    $state.excludeSources = [];
    $state.excludePatterns = undefined;

    // ──── Exclude by source ─────────────────────────────────────
    for (const excludeSourceCode of $config.excludeBySource) {
      const sourceCode = ELExtUtils.prototype.parseSourceCodeFromString(excludeSourceCode);
      if (!sourceCode.source) {
        continue;
      }
      $state.excludeSources.push({
        source: sourceCode.source,
        code: sourceCode.code
      });
    }

    // ──── Exclude by message ────────────────────────────────────
    for (const excludeMessage of $config.exclude) {
      if (typeof excludeMessage === 'string') {
        $state.excludeRegexp.push(this.createMessageRegex(excludeMessage));
      }
    }

    // ──── Exlude by glob ────────────────────────────────────────
    if (
      Array.isArray($config.excludePatterns) &&
      $config.excludePatterns.length !== 0
    ) {
      $state.excludePatterns = $config.excludePatterns.map(item => ({
        pattern: item
      }));
    }
  }

  /**
   * Create a RegExp for matching diagnostic messages from its string source
   */
  protected createMessageRegex(source: string): RegExp {
    return new RegExp(source, 'iu');
  }

  /**
   * Dispose all disposables (except `onDidChangeConfiguration`).
   */
  protected disposeEverything(): void {
    ELEvents.prototype.disposeAllEventListeners();
    $state.statusBarMessage?.dispose();
    $state.statusBarIcons?.dispose();
    $state.codeLens?.dispose();
    ELDecorations.prototype?.disposeAllDecorations();
  }

  /**
   * Activates the Error Lens feature for the extension.
   *
   * @param context - The extension context provided by VSCode.
   *
   * This function initializes the Error Lens logger, updates the configuration,
   * registers all commands, and sets up decorations for all visible editors.
   * It also listens for configuration changes to update the settings and reapply
   * the necessary updates.
   *
   * If an error occurs during activation, an error message is logged to the console
   * and displayed to the user, and the Error Lens feature is deactivated.
   *
   * @throws Will throw an error if there is an issue during activation.
   */
  public activate(context: vscode.ExtensionContext) {
    try {

      console.log('Flawuldragon - Error Lens activated!');

      $state.logger = new ELLogger({
        // isDev: context.extensionMode === ExtensionMode.Development,
        isDev: false
      });
      updateConfigAndEverything();
      ELCommands.prototype.registerAllCommands(context);

      // Have some delay on startup to apply decorations when "onSave" enabled
      if ($config.onSave && $config.onSaveUpdateOnActiveEditorChange) {
        setTimeout(() => {
          ELDecorations.prototype.updateDecorationsForAllVisibleEditors();
        }, $config.onSaveTimeout * 2);
      }

      /**
       * - Update config
       * - Dispose everything
       * - Update everything
       */
      function updateConfigAndEverything(): void {
        
        $config = vscode.workspace.getConfiguration().get(EELConstants.SettingsPrefix)!;
        
        $state.vscodeGlobalProblemsEnabled =
          vscode.workspace
            .getConfiguration('problems')
            .get<boolean>('visibility') ?? true;
        FDErrorLens.prototype.disposeEverything();
        if ($config.enabled) {
          FDErrorLens.prototype.updateEverything(context);
        }
      }

      context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
          if (
            !e.affectsConfiguration(EELConstants.SettingsPrefix) &&
            !e.affectsConfiguration('problems.visibility')
          ) {
            return;
          }
          updateConfigAndEverything();
        })
      );
    } catch (error) {
      console.error('Flawuldragon - Error Lens error: ' + error);
      vscode.window.showErrorMessage(
        'An error occurred while activating the error lens integration feature: ' +
          error +
          '. Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)'
      );
      this.desactivate();
    } finally {
    }
  }

  /**
   * Deactivates the Error Lens feature.
   * Logs a message indicating that the Error Lens has been deactivated.
   */
  public desactivate() {
    console.log('Flawuldragon - Error Lens deactivated!');
  }
}
