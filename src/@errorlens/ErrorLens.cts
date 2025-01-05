import * as vscode from 'vscode';
import { ELLogger } from './ELLogger.ac.cjs';
import { ELCommands } from './ELCommands.ac.cjs';
import { ELDecorations } from './ELDecorations.ac.cjs';
import { EELConstants } from './enums.js';
import { ELStatusBarMessage } from './ELStatusBarMessage.ac.cjs';
import { ELStatusBarIcons } from './ELStatusBarIcons.ac.cjs';
import { ELExtUtils } from './ELExtUtils.ac.cjs';
import { ELErrorLensCodeLens } from './ELErrorLensCodeLens.ac.cjs';
import { ELEvents } from './ELEvents.ac.cjs';
import { TELExtensionConfig } from './declares.js';

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
 * const errorLens = new ErrorLens();
 * errorLens.errorLens_activate(context);
 */
export class ErrorLens {
  protected commands = new ELCommands;
  protected decorations = new ELDecorations;
  protected events = new ELEvents;
  /**
   * Runs only on extension configuration change event.
   *
   * - Update all global state
   * - Update all decoration styles
   * - Update decorations for all visible editors
   * - Update all event listeners
   */
  protected errorLens_updateEverything(context: vscode.ExtensionContext): void {
    this.errorLens_updateTransformState();
    this.errorLens_updateExcludeState();

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
      priority: $config.statusBarIconsPriority,
      alignment: $config.statusBarIconsAlignment,
      targetProblems: $config.statusBarIconsTargetProblems
    });
    $state.codeLens?.dispose();
    $state.codeLens = new ELErrorLensCodeLens(context);
    $state.configErrorEnabled = $config.enabledDiagnosticLevels.includes('error');
    $state.configWarningEnabled =
      $config.enabledDiagnosticLevels.includes('warning');
    $state.configInfoEnabled = $config.enabledDiagnosticLevels.includes('info');
    $state.configHintEnabled = $config.enabledDiagnosticLevels.includes('hint');

    this.decorations.setDecorationStyle(context);

    this.decorations.updateDecorationsForAllVisibleEditors();

    $state.statusBarIcons.updateText();

    this.events.updateChangeDiagnosticListener();
    this.events.updateChangeVisibleTextEditorsListener();
    this.events.updateOnSaveListener();
    this.events.updateCursorChangeListener();
    this.events.updateChangedActiveTextEditorListener();
    this.events.updateChangeBreakpointsListener();
    this.events.updateOnVisibleRangesListener();
  }

  /**
   * - Create `RegExp` from string for messages.
   */
  protected errorLens_updateTransformState(): void {
    $state.replaceRegexp = $config.replace.map(config => ({
      matcher: this.errorLens_createMessageRegex(config.matcher),
      message: config.message
    }));
  }

  /**
   * - Create `RegExp` from string for messages.
   * - Create `DocumentFilter[]` for document match.
   * - Create `source/code` exclusion object.
   */
  protected errorLens_updateExcludeState(): void {
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
        $state.excludeRegexp.push(this.errorLens_createMessageRegex(excludeMessage));
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
  protected errorLens_createMessageRegex(source: string): RegExp {
    return new RegExp(source, 'iu');
  }

  /**
   * Dispose all disposables (except `onDidChangeConfiguration`).
   */
  protected errorLens_disposeEverything(): void {
    this.events.disposeAllEventListeners();
    $state.statusBarMessage?.dispose();
    $state.statusBarIcons?.dispose();
    $state.codeLens?.dispose();
    this.decorations.disposeAllDecorations();
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
  public errorLens_activate(context: vscode.ExtensionContext) {
    try {

      console.log('Flawuldragon - Error Lens activated!');

      $state.logger = new ELLogger({
        // isDev: context.extensionMode === ExtensionMode.Development,
        isDev: false
      });
      updateConfigAndEverything();
      this.commands.registerAllCommands(context);

      // Have some delay on startup to apply decorations when "onSave" enabled
      if ($config.onSave && $config.onSaveUpdateOnActiveEditorChange) {
        setTimeout(() => {
          this.decorations.updateDecorationsForAllVisibleEditors();
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
        ErrorLens.prototype.errorLens_disposeEverything();
        if ($config.enabled) {
          ErrorLens.prototype.errorLens_updateEverything(context);
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
      this.errorLens_desactivate();
    } finally {
    }
  }

  /**
   * Deactivates the Error Lens feature.
   * Logs a message indicating that the Error Lens has been deactivated.
   */
  public errorLens_desactivate() {
    console.log('Flawuldragon - Error Lens deactivated!');
  }
}
