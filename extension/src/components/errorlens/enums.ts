/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

// commands.ts
/**
 * All command ids contributed by this extensions.
 */
export declare const enum EELCommandId {
  // ──── User facing ───────────────────────────────────────────
  Toggle = 'flawuldragon.errorLens.toggle',
  ToggleError = 'flawuldragon.errorLens.toggleError',
  ToggleWarning = 'flawuldragon.errorLens.toggleWarning',
  ToggleInfo = 'flawuldragon.errorLens.toggleInfo',
  ToggleHint = 'flawuldragon.errorLens.toggleHint',
  ToggleInlineMessage = 'flawuldragon.errorLens.toggleInlineMessage',
  /** {@link toggleWorkspaceCommand} */
  ToggleWorkspace = 'flawuldragon.errorLens.toggleWorkspace',
  /** {@link copyProblemMessageCommand} */
  CopyProblemMessage = 'flawuldragon.errorLens.copyProblemMessage',
  /** {@link copyProblemCodeCommand} */
  CopyProblemCode = 'flawuldragon.errorLens.copyProblemCode',
  /** {@link selectProblemCommand} */
  SelectProblem = 'flawuldragon.errorLens.selectProblem',
  /** {@link findLinterRuleDefinitionCommand} */
  FindLinterRuleDefinition = 'flawuldragon.errorLens.findLinterRuleDefinition',
  /** {@link searchForProblemCommand} */
  SearchForProblem = 'flawuldragon.errorLens.searchForProblem',
  /** {@link disableLineCommand} */
  DisableLine = 'flawuldragon.errorLens.disableLine',
  // ──── Internal ──────────────────────────────────────────────
  /** {@link statusBarCommand} */
  StatusBarCommand = 'flawuldragon.errorLens.statusBarCommand',
  /** {@link revealLineCommand} */
  RevealLine = 'flawuldragon.errorLens.revealLine',
  /** {@link excludeProblemCommand} */
  ExcludeProblem = 'flawuldragon.errorLens.excludeProblem',
  /** {@link codeLensOnClickCommand} */
  CodeLensOnClick = 'flawuldragon.errorLens.codeLensOnClick'
}

// types.ts
export declare const enum EELConstants {
  /**
   * Extension unique id (publisher.name).
   */
  ExtensionId = 'humbanew.flawuldragon',
  /**
   * Prefix used for all settings of this extension.
   */
  SettingsPrefix = 'fd.errorLens',
  /**
   * Command id of vscode command to show problems view.
   */
  OpenProblemsViewCommandId = 'workbench.actions.view.problems',
  /**
   * Command id of vscode show quick fix menu in editor.
   */
  QuickFixCommandId = 'editor.action.quickFix',
  /**
   * Command id of vscode command to focus active editor group.
   */
  FocusActiveEditorCommandId = 'workbench.action.focusActiveEditorGroup',
  /**
   * Command id of vscode command to open next problem marker.
   */
  NextProblemCommandId = 'editor.action.marker.next',

  VscodeOpenCommandId = 'vscode.open',

  MergeConflictSymbol1 = '<<<<<<<',
  MergeConflictSymbol2 = '=======',
  MergeConflictSymbol3 = '>>>>>>>',

  NonBreakingSpaceSymbolHtml = '&nbsp;',
  NonBreakingSpaceSymbol = '⠀'
}
