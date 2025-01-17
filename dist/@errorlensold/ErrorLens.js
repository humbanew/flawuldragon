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
exports.ErrorLens = exports.$state = exports.$config = void 0;
const vscode = __importStar(require("vscode"));
const ELLogger_ac_js_1 = require("./ELLogger.ac.js");
const ELCommands_ac_js_1 = require("./ELCommands.ac.js");
const ELDecorations_ac_js_1 = require("./ELDecorations.ac.js");
const ELStatusBarMessage_ac_js_1 = require("./ELStatusBarMessage.ac.js");
const ELStatusBarIcons_ac_js_1 = require("./ELStatusBarIcons.ac.js");
const ELExtUtils_ac_js_1 = require("./ELExtUtils.ac.js");
const ELErrorLensCodeLens_ac_js_1 = require("./ELErrorLensCodeLens.ac.js");
const ELEvents_ac_js_1 = require("./ELEvents.ac.js");
/**
 * Global state.
 */
class $state {
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
    static statusBarMessage;
    /**
     * Status bar object. Handles all status bar stuff (for icons)
     */
    static statusBarIcons;
    /**
     * Code Lens Provider. Handles all Code Lens stuff https://github.com/microsoft/vscode-extension-samples/tree/main/codelens-sample
     */
    static codeLens;
    /**
     * Array of RegExp matchers and their updated messages.
     * message may include groups references like $0 (entire expression), $1 (first group), etc.
     */
    static replaceRegexp = undefined;
    /**
     * Array of RegExp (that would match against diagnostic message)
     */
    static excludeRegexp = [];
    /**
     * Array of source/code to ignore (that would match against diagnostic object)
     */
    static excludeSources = [];
    /**
     * Array of document selectors (that would match against document)
     */
    static excludePatterns = undefined;
    /**
     * Editor icons can be rendered only for active line (to reduce the visual noise).
     * But it might be useful to show gutter icons for all lines. With `gutterIconsFollowCursorOverride`
     * setting then gutter icons will be rendered as a separate set of decorations.
     */
    static renderGutterIconsAsSeparateDecoration;
    /**
     * Set event listener for when editor visibleRanges change (vertical scroll), only when necessary.
     */
    static shouldUpdateOnEditorScrollEvent;
    /**
     * Use console.log() when developing extension.
     */
    static logger;
    static log = (message, ...args) => {
        $state.logger.log(message, ...args);
    };
}
exports.$state = $state;
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
class ErrorLens {
    commands = new ELCommands_ac_js_1.ELCommands;
    decorations = new ELDecorations_ac_js_1.ELDecorations;
    events = new ELEvents_ac_js_1.ELEvents;
    /**
     * Runs only on extension configuration change event.
     *
     * - Update all global state
     * - Update all decoration styles
     * - Update decorations for all visible editors
     * - Update all event listeners
     */
    errorLens_updateEverything(context) {
        this.errorLens_updateTransformState();
        this.errorLens_updateExcludeState();
        $state.renderGutterIconsAsSeparateDecoration =
            exports.$config.gutterIconsEnabled &&
                exports.$config.gutterIconsFollowCursorOverride &&
                exports.$config.followCursor !== 'allLines';
        $state.shouldUpdateOnEditorScrollEvent =
            exports.$config.followCursor === 'closestProblemMultiline' ||
                exports.$config.followCursor === 'closestProblemMultilineInViewport' ||
                exports.$config.followCursor === 'closestProblemMultilineBySeverity';
        $state.statusBarMessage?.dispose();
        $state.statusBarIcons?.dispose();
        $state.statusBarMessage = new ELStatusBarMessage_ac_js_1.ELStatusBarMessage({
            isEnabled: ELExtUtils_ac_js_1.ELExtUtils.prototype.shouldShowStatusBarMessage(),
            colorsEnabled: exports.$config.statusBarColorsEnabled,
            messageType: exports.$config.statusBarMessageType,
            priority: exports.$config.statusBarMessagePriority,
            alignment: exports.$config.statusBarMessageAlignment
        });
        $state.statusBarIcons = new ELStatusBarIcons_ac_js_1.ELStatusBarIcons({
            isEnabled: ELExtUtils_ac_js_1.ELExtUtils.prototype.shouldShowStatusBarIcons(),
            atZero: exports.$config.statusBarIconsAtZero,
            useBackground: exports.$config.statusBarIconsUseBackground,
            priority: exports.$config.statusBarIconsPriority,
            alignment: exports.$config.statusBarIconsAlignment,
            targetProblems: exports.$config.statusBarIconsTargetProblems
        });
        $state.codeLens?.dispose();
        $state.codeLens = new ELErrorLensCodeLens_ac_js_1.ELErrorLensCodeLens(context);
        $state.configErrorEnabled = exports.$config.enabledDiagnosticLevels.includes('error');
        $state.configWarningEnabled =
            exports.$config.enabledDiagnosticLevels.includes('warning');
        $state.configInfoEnabled = exports.$config.enabledDiagnosticLevels.includes('info');
        $state.configHintEnabled = exports.$config.enabledDiagnosticLevels.includes('hint');
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
    errorLens_updateTransformState() {
        $state.replaceRegexp = exports.$config.replace.map(config => ({
            matcher: this.errorLens_createMessageRegex(config.matcher),
            message: config.message
        }));
    }
    /**
     * - Create `RegExp` from string for messages.
     * - Create `DocumentFilter[]` for document match.
     * - Create `source/code` exclusion object.
     */
    errorLens_updateExcludeState() {
        $state.excludeRegexp = [];
        $state.excludeSources = [];
        $state.excludePatterns = undefined;
        // ──── Exclude by source ─────────────────────────────────────
        for (const excludeSourceCode of exports.$config.excludeBySource) {
            const sourceCode = ELExtUtils_ac_js_1.ELExtUtils.prototype.parseSourceCodeFromString(excludeSourceCode);
            if (!sourceCode.source) {
                continue;
            }
            $state.excludeSources.push({
                source: sourceCode.source,
                code: sourceCode.code
            });
        }
        // ──── Exclude by message ────────────────────────────────────
        for (const excludeMessage of exports.$config.exclude) {
            if (typeof excludeMessage === 'string') {
                $state.excludeRegexp.push(this.errorLens_createMessageRegex(excludeMessage));
            }
        }
        // ──── Exlude by glob ────────────────────────────────────────
        if (Array.isArray(exports.$config.excludePatterns) &&
            exports.$config.excludePatterns.length !== 0) {
            $state.excludePatterns = exports.$config.excludePatterns.map(item => ({
                pattern: item
            }));
        }
    }
    /**
     * Create a RegExp for matching diagnostic messages from its string source
     */
    errorLens_createMessageRegex(source) {
        return new RegExp(source, 'iu');
    }
    /**
     * Dispose all disposables (except `onDidChangeConfiguration`).
     */
    errorLens_disposeEverything() {
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
    errorLens_activate(context) {
        try {
            console.log('Flawuldragon - Error Lens activated!');
            $state.logger = new ELLogger_ac_js_1.ELLogger({
                // isDev: context.extensionMode === ExtensionMode.Development,
                isDev: false
            });
            updateConfigAndEverything();
            this.commands.registerAllCommands(context);
            // Have some delay on startup to apply decorations when "onSave" enabled
            if (exports.$config.onSave && exports.$config.onSaveUpdateOnActiveEditorChange) {
                setTimeout(() => {
                    this.decorations.updateDecorationsForAllVisibleEditors();
                }, exports.$config.onSaveTimeout * 2);
            }
            /**
             * - Update config
             * - Dispose everything
             * - Update everything
             */
            function updateConfigAndEverything() {
                exports.$config = vscode.workspace.getConfiguration().get("errorLens" /* EELConstants.SettingsPrefix */);
                $state.vscodeGlobalProblemsEnabled =
                    vscode.workspace
                        .getConfiguration('problems')
                        .get('visibility') ?? true;
                ErrorLens.prototype.errorLens_disposeEverything();
                if (exports.$config.enabled) {
                    ErrorLens.prototype.errorLens_updateEverything(context);
                }
            }
            context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
                if (!e.affectsConfiguration("errorLens" /* EELConstants.SettingsPrefix */) &&
                    !e.affectsConfiguration('problems.visibility')) {
                    return;
                }
                updateConfigAndEverything();
            }));
        }
        catch (error) {
            console.error('Flawuldragon - Error Lens error: ' + error);
            vscode.window.showErrorMessage('An error occurred while activating the error lens integration feature: ' +
                error +
                '. Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)');
            this.errorLens_desactivate();
        }
        finally {
        }
    }
    /**
     * Deactivates the Error Lens feature.
     * Logs a message indicating that the Error Lens has been deactivated.
     */
    errorLens_desactivate() {
        console.log('Flawuldragon - Error Lens deactivated!');
    }
}
exports.ErrorLens = ErrorLens;
