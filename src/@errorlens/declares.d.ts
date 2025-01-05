import * as vscode from 'vscode';
import { EELConstants } from './enums';

/// <reference types="node" />

// types.ts
export declare interface IELExtensionConfigType {
  /**
   * If extension is enabled.
   */
  enabled: boolean;
  /**
   * When enabled - extension will take into account global VSCode setting `#problems.visibility#`.
   */
  respectUpstreamEnabled: {
    enabled: boolean;
    inlineMessage: boolean;
    gutter: boolean;
    statusBar: boolean;
  };
  /**
   * Controls if decorations are shown if the editor has git merge conflict indicators `<<<<<<<` or `=======` or `>>>>>>>`.
   */
  enabledInMergeConflict: boolean;
  /**
   * Font family of inline message.
   */
  fontFamily: string;
  /**
   * Font weight of inline message.
   */
  fontWeight: string;
  /**
   * Font size of inline message.
   */
  fontSize: string;
  /**
   * When enabled - shows inline message in italic font style.
   */
  fontStyleItalic: boolean;
  /**
   * Distance between the last word on the line and the start of inline message.
   */
  margin: string;
  /**
   * Align inline error message (either by starting position or ending position).
   */
  alignMessage: {
    start: number;
    end: number;
    minimumMargin: number;
    useFixedPosition: boolean;
  };
  /**
   * Inner margin of the inline message.
   */
  padding: string;
  /**
   * Border radius of the inline message.
   */
  borderRadius: string;
  /**
   * Controls whether inline message is shown or not (Including background highlight).
   */
  messageEnabled: boolean;
  /**
   * When checked - highlight the entire problem range.
   */
  problemRangeDecorationEnabled: boolean;
  /**
   * Controls which parts of the editor hover tooltip to show.
   */
  editorHoverPartsEnabled: {
    messageEnabled: boolean;
    buttonsEnabled: boolean;
    sourceCodeEnabled: boolean;
  };
  /**
   * Controls how inline message is highlighted in the editor (entire line / only message / none).
   */
  messageBackgroundMode: 'line' | 'message' | 'none';
  /**
   * Choose which levels of diagnostics to highlight.
   */
  enabledDiagnosticLevels: ('error' | 'hint' | 'info' | 'warning')[];
  /**
   * Template used for all inline messages. Interpolates `$message`, `$source`, `$code`, `$count`, `$severity`.
   */
  messageTemplate: string;
  /**
   * Cut off inline message if it's longer than this value.
   */
  messageMaxChars: number;
  /**
   * Replaces `$severity` variable in `#errorLens.messageTemplate#`.
   */
  severityText: string[];
  /**
   * Array of objects with a "pattern" that matches a `Diagnostic.message` and a "message" that transforms it.
   * Captured groups from the match are available in "message" as $0, $1 etc.
   * Applies before the message is added to the template.
   *
   * Example usage:
   *
   * Original message: "foo bar"
   * Config: [{ matcher: "foo (.*)", message: "just $1" }]
   * Transformed message: "just bar"
   */
  replace: {
    matcher: string;
    message: string;
  }[];
  /**
   * Array of diagnostic messages that should not be decorated. Matches against `Diagnostic.message`.
   */
  exclude: string[];
  /**
   * Specify sources that should not be highlighted (string).
   */
  excludeBySource: string[];
  /**
   * Glob matching files that should not be decorated. Matches against absolute file path.
   */
  excludePatterns: string[];
  /**
   * When enabled - shows highlighted error/warning icons in status bar.
   */
  statusBarIconsEnabled: boolean;
  /**
   * Move status bar icons left or right by adjusting the number priority.
   */
  statusBarIconsPriority: number;
  /**
   * Choose on which side the icons status bar is on: left or right.
   */
  statusBarIconsAlignment: 'left' | 'right';
  /**
   * Which problems to use for counting problems at icons status bar.
   */
  statusBarIconsTargetProblems: TELDiagnosticTarget;
  /**
   * When enabled - highlights status bar icons with background, when disabled - with foreground.
   */
  statusBarIconsUseBackground: boolean;
  /**
   * What to do when there are 0 errors/warnings - hide the item or strip its background color.
   */
  statusBarIconsAtZero: 'hide' | 'removeBackground';
  /**
   * Whether to show status bar item or not. Default is **false**.
   */
  statusBarMessageEnabled: boolean;
  /**
   * Move status bar message left or right by adjusting the number priority.
   */
  statusBarMessagePriority: number;
  /**
   * Choose on which side the message status bar is on: left or right.
   */
  statusBarMessageAlignment: 'left' | 'right';
  /**
   * Pick what to show in Status Bar: closest message or only message for the active line.
   */
  statusBarMessageType:
    | 'activeCursor'
    | 'activeLine'
    | 'closestProblem'
    | 'closestSeverity';
  /**
   * Which problem to select when running `errorLens.selectProblem` command.
   */
  selectProblemType: 'activeLine' | 'closestProblem' | 'closestSeverity';
  /**
   * Whether to use color for status bar items or not.
   */
  statusBarColorsEnabled: boolean;
  /**
   * Command to execute when clicking on status bar item.
   */
  statusBarCommand: 'copyMessage' | 'goToLine' | 'goToProblem';
  /**
   * See `#errorLens.messageTemplate#`.
   */
  statusBarMessageTemplate: string;
  /**
   * Adds delay before showing diagnostic.
   */
  delay?: number;
  /**
   * Pick which version of the delay to use.
   */
  delayMode: 'debounce' | 'new' | 'old';
  /**
   * Highlight only portion of the problems.
   * For instance, only active line or the closest to the cursor diagnostic.
   */
  followCursor:
    | 'activeLine'
    | 'allLines'
    | 'allLinesExceptActive'
    | 'closestProblem'
    | 'closestProblemMultiline'
    | 'closestProblemMultilineBySeverity'
    | 'closestProblemMultilineInViewport';
  /**
   * Augments `followCursor`.
   * Adds number of lines to top and bottom when `followCursor` is `activeLine`.
   * Adds number of closest problems when `followCursor` is `closestProblem`
   */
  followCursorMore: number;
  /**
   *
   */
  multilineMessage: {
    decorationMaxNumberOfLines: number;
    maxColumnForCalculation: number;
    // whenCursorOutsideOfViewport: 'none' | 'showClosestProblemInViewport' | 'showClosestToCursorProblem';
    preferFittingMessageMultiplier: number;
    /** TODO: **implement** */
    preferSameLineMultiplier: number;
    highlightProblemLine: 'line' | 'none' | 'range';
    alignStart: number;
    alignEnd: number;
    margin: number;
    padding: number;
    borderRadius: string;
    /**
     * Use fixed position for decoration that has stuttering/twitching when typing... BUT!!! decoration can overlap text in editor for a short period of time on the active line.
     */
    useFixedPosition: boolean;
  };
  /**
   * Update decorations only on save.
   */
  onSave: boolean;
  /**
   * Time period that used for showing decorations after the document save (manual).
   */
  onSaveTimeout: number;
  /**
   * When `#errorLens.onSave#` enabled - extension still draws decorations when active/visible editors change.
   */
  onSaveUpdateOnActiveEditorChange: boolean;
  /**
   * Enable decorations when viewing a diff view in the editor (e.g. Git diff).
   */
  enableOnDiffView: boolean;
  /**
   * Prevent scrollbars from appearing for decorations.
   */
  scrollbarHackEnabled: boolean;
  /**
   * When enabled - replaces line breaks in inline diagnostic message with the whitespace ` ` sign.
   */
  removeLinebreaks: boolean;
  /**
   * Symbol to replace linebreaks. Requires enabling `#errorLens.removeLinebreaks#`.
   */
  replaceLinebreaksSymbol: string;
  /**
   * When enabled - shows gutter icons (In place of the debug breakpoint icon).
   */
  gutterIconsEnabled: boolean;
  /**
   * When enabled and `#errorLens.followCursor#` setting is not `allLines`, then gutter icons would be rendered for all problems.
   * But line decorations (background, message) only for active line.
   */
  gutterIconsFollowCursorOverride: boolean;
  /**
   * Change gutter icon size. Examples: `auto`, `contain`, `cover`, `50%`, `150%`.
   */
  gutterIconSize: string;
  /**
   * Change gutter icon style.
   */
  gutterIconSet:
    | 'borderless'
    | 'circle'
    | 'default'
    | 'defaultOutline'
    | 'emoji'
    | 'letter'
    | 'square'
    | 'squareRounded';
  /**
   * Pick emoji symbol for gutter icon when `#errorLens.gutterIconSet#` is `emoji`.
   */
  gutterEmoji: {
    error: string;
    warning: string;
    info: string;
    hint: string;
  };
  /**
   * Absolute path to error gutter icon.
   */
  errorGutterIconPath: string;
  /**
   * Absolute path to warning gutter icon.
   */
  warningGutterIconPath: string;
  /**
   * Absolute path to info gutter icon.
   */
  infoGutterIconPath: string;
  /**
   * Absolute path to hint gutter icon.
   */
  hintGutterIconPath: string;
  /**
   * Error color of simple gutter icons (shapes and letters).
   */
  errorGutterIconColor: string;
  /**
   * Warning color of simple gutter icons (shapes and letters).
   */
  warningGutterIconColor: string;
  /**
   * Info color of simple gutter icons (shapes and letters).
   */
  infoGutterIconColor: string;
  /**
   * Info color of simple gutter icons (shapes and letters).
   */
  hintGutterIconColor: string;

  /**
   * Overwrite gutter settings for light theme
   */
  light: {
    errorGutterIconPath: string;
    warningGutterIconPath: string;
    infoGutterIconPath: string;
    hintGutterIconPath: string;

    errorGutterIconColor: string;
    warningGutterIconColor: string;
    infoGutterIconColor: string;
    hintGutterIconColor: string;
  };

  /**
   * Disable highlighting for selected workspaces
   */
  excludeWorkspaces: string[];
  /**
   * Specify where to search for linter rule definitions.
   */
  lintFilePaths: Record<string, string[] | 'none'>;
  /**
   * Used for `errorLens.disableLine` command that adds a comment disabling linter rule for a line.
   */
  disableLineComments: Record<string, string>;
  /**
   * Pick query to open in default browser when searching for problem with `errorLens.searchForProblem` command.
   */
  searchForProblemQuery: string;
  /**
   * Advanced decoration tweaking.
   */
  decorations: Record<
    | 'errorMessage'
    | 'errorRange'
    | 'hintMessage'
    | 'hintRange'
    | 'infoMessage'
    | 'infoRange'
    | 'warningMessage'
    | 'warningRange',
    vscode.DecorationRenderOptions
  >;
  /**
   * Controls whether to run on untitled (unsaved) files.
   */
  ignoreUntitled: boolean;
  /**
   * Controls whether to show the Error Lens as a Code Lens above the code.
   */
  codeLensEnabled: boolean;
  /**
   * Enforce minimum length of first code lens item and max of subsequent items.
   */
  codeLensLength: {
    min: number;
    max: number;
  };
  /**
   * See `#errorLens.messageTemplate#`.
   */
  codeLensTemplate: string;
  /**
   * Controls what do on clicking the `#errorLens.codeLensEnabled#`
   */
  codeLensOnClick:
    | 'none'
    | 'searchForProblem'
    | 'showProblemsView'
    | 'showQuickFix';
}

export declare type TELExtensionConfig = Readonly<IELExtensionConfigType>;

/**
 * Common groups of diagnostics to target.
 */
export declare type TELDiagnosticTarget =
  | 'activeEditor'
  | 'all'
  | 'visibleEditors';
/**
 * Valid strings of this extension setting ids.
 */
export declare type TELErrorLensSettings =
  `${EELConstants.SettingsPrefix}.${keyof TELExtensionConfig}`;

// utils/vscodeUtils.ts
/** VSCode span accepts only #fff #fff0 #fffff #ffffff00 var(--vscode...) color formats. */
export declare type TELColorFormat = `#${string}` | `var(--vscode-${string}`;

// utils/extUtils.ts
export declare interface IELPrepareMessageArg {
  template: string;
  diagnostic: vscode.Diagnostic;
  lineProblemCount: number;
  removeLinebreaks: boolean;
  replaceLinebreaksSymbol: string;
}

export declare type TELGroupedByLineDiagnostics = Record<
  string,
  vscode.Diagnostic[]
>;

// statusBar/statusBarIcons.ts
export declare type TELStatusBarProblemType = 'error' | 'warning';

export declare interface IELStatusBarIconsInit {
  isEnabled: boolean;
  atZero: TELExtensionConfig['statusBarIconsAtZero'];
  useBackground: TELExtensionConfig['statusBarIconsUseBackground'];
  priority: TELExtensionConfig['statusBarMessagePriority'];
  alignment: TELExtensionConfig['statusBarMessageAlignment'];
  targetProblems: TELExtensionConfig['statusBarIconsTargetProblems'];
}

// statusBar/statusBarMessage.ts
export declare interface IELStatusBarMessageInit {
  isEnabled: boolean;
  colorsEnabled: boolean;
  messageType: TELExtensionConfig['statusBarMessageType'];
  priority: TELExtensionConfig['statusBarMessagePriority'];
  alignment: TELExtensionConfig['statusBarMessageAlignment'];
}

// commands/findLinterRuleDefinitionCommand.ts
export declare interface IELRuleDefinitionArgs {
  source?: string;
  code?: string;
}

// decorations/align.ts
export declare interface IELGetMarginForAlignmentArgs {
  start: number;
  end: number;
  message: string;
  minimumMargin: number;
  visualLineLength: number;
}

export declare interface IELAlignmentArgs {
  isMultilineDecoration: boolean;
  alignmentKind: 'fixed' | 'normal';
  textLine: vscode.TextLine;
  problemMessage: string;
  indentSize: number;
  indentStyle: 'spaces' | 'tab';
  minVisualLineLength: number;
  minimumMargin: number;
  start: number;
  end: number;
}

export declare interface IELAlignmentReturnArg {
  styleStr: string;
  range: vscode.Range;
}

// decorations.ts
/* eslint-disable @typescript-eslint/sort-type-constituents */
export declare type TELDecorationKeys =
  | 'error'
  | 'warning'
  | 'info'
  | 'hint'
  | 'gutterError'
  | 'gutterWarning'
  | 'gutterInfo'
  | 'gutterHint'
  | 'errorRange'
  | 'warningRange'
  | 'infoRange'
  | 'hintRange'
  | 'multilineError'
  | 'multilineWarning'
  | 'multilineInfo'
  | 'multilineHint'
  | 'multilineErrorLineBackground'
  | 'multilineHintLineBackground'
  | 'multilineInfoLineBackground'
  | 'multilineWarningLineBackground'
  | 'transparent1x1Icon';

  
export declare interface IELGroupedTextLines {
  startLineIndex: number;
  endLineIndex: number;
  minVisualLineLength: number;
  howManyLinesFromDiagnostic: number;
  score: number;
  textLines: vscode.TextLine[];
  startLineStartsWith: string;
}

export declare interface IELScoreGroupedLinesArg {
	textLines: vscode.TextLine[];
	messageLines: string[];
	howManyLinesFromDiagnostic: number;
	preferFittingMessageMultiplier: number;
	minVisualLineLength: number;
	visibleLineCount: number;
	diagnostic: vscode.Diagnostic;
}

// gutter.ts
export declare interface IELGutter {
	iconSet: TELExtensionConfig['gutterIconSet'];

	errorIconPath: vscode.Uri | string;
	errorIconPathLight: vscode.Uri | string;

	warningIconPath: vscode.Uri | string;
	warningIconPathLight: vscode.Uri | string;

	infoIconPath: vscode.Uri | string;
	infoIconPathLight: vscode.Uri | string;

	hintIconPath: vscode.Uri | string | undefined;
	hintIconPathLight: vscode.Uri | string | undefined;

	transparent1x1Icon: vscode.Uri | string;
}

// delay/customDelay.ts
export declare type TELCachedDiagnostic = Record<string, Record<string, vscode.Diagnostic>>;
