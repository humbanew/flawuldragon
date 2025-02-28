/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as vscode from 'vscode';
import { TELDecorationKeys, IELGutter, TELGroupedByLineDiagnostics } from "./declares";
import { ELDecorationsAlign } from "./ELDecorationsAlign";
import { ELExtUtils } from "./ELExtUtils";
import { ELHover } from "./ELHover";
import { EELConstants } from "./enums";
import { ELGutter } from './ELGutter';
import { ELMultilineDecoration } from './ELMultilineDecoration';
import { $state, $config } from './ErrorLens';

// decorations.ts
export class ELDecorations {

  public constructor(){}

  public decorationTypes = {} as unknown as Record<TELDecorationKeys, vscode.TextEditorDecorationType>;
  /* eslint-enable @typescript-eslint/sort-type-constituents */
  public textDecorationStyleString = '';

  /**
   * Update all decoration styles: editor, gutter, status bar
   */
  public setDecorationStyle(context: vscode.ExtensionContext): void {
    this.disposeAllDecorations();
  
    let gutter: IELGutter | undefined;
    if (ELExtUtils.prototype.shouldShowGutterIcons()) {
      gutter = ELGutter.prototype.getGutterStyles(context);
  
      if ($state.renderGutterIconsAsSeparateDecoration) {
        this.decorationTypes.gutterError = vscode.window.createTextEditorDecorationType({
          gutterIconPath: gutter.errorIconPath,
          gutterIconSize: $config.gutterIconSize,
          light: {
            gutterIconPath: gutter.errorIconPathLight,
            gutterIconSize: $config.gutterIconSize,
          },
        });
        this.decorationTypes.gutterWarning = vscode.window.createTextEditorDecorationType({
          gutterIconPath: gutter.warningIconPath,
          gutterIconSize: $config.gutterIconSize,
          light: {
            gutterIconPath: gutter.warningIconPathLight,
            gutterIconSize: $config.gutterIconSize,
          },
        });
        this.decorationTypes.gutterInfo = vscode.window.createTextEditorDecorationType({
          gutterIconPath: gutter.infoIconPath,
          gutterIconSize: $config.gutterIconSize,
          light: {
            gutterIconPath: gutter.infoIconPathLight,
            gutterIconSize: $config.gutterIconSize,
          },
        });
        this.decorationTypes.gutterHint = vscode.window.createTextEditorDecorationType({
          gutterIconPath: gutter.hintIconPath,
          gutterIconSize: $config.gutterIconSize,
          light: {
            gutterIconPath: gutter.hintIconPathLight,
            gutterIconSize: $config.gutterIconSize,
          },
        });
        // gutter will be rendered as a separate decoration, delete gutter from ordinary decorations
        gutter = undefined;
      }
    }
  
    if ($config.followCursor === 'closestProblemMultiline' ||
      $config.followCursor === 'closestProblemMultilineInViewport' ||
      $config.followCursor === 'closestProblemMultilineBySeverity') {
      ELMultilineDecoration.prototype.createMultilineDecorations();
    }
  
    let errorBackground: vscode.ThemeColor | undefined = new vscode.ThemeColor('flawuldragon.errorLens.errorBackground');
    let errorBackgroundLight: vscode.ThemeColor | undefined = new vscode.ThemeColor('flawuldragon.errorLens.errorBackgroundLight');
    const errorForeground = new vscode.ThemeColor('flawuldragon.errorLens.errorForeground');
    const errorForegroundLight = new vscode.ThemeColor('flawuldragon.errorLens.errorForegroundLight');
    let errorMessageBackground: vscode.ThemeColor | undefined = new vscode.ThemeColor('flawuldragon.errorLens.errorMessageBackground');
  
    let warningBackground: vscode.ThemeColor | undefined = new vscode.ThemeColor('flawuldragon.errorLens.warningBackground');
    let warningBackgroundLight: vscode.ThemeColor | undefined = new vscode.ThemeColor('flawuldragon.errorLens.warningBackgroundLight');
    const warningForeground = new vscode.ThemeColor('flawuldragon.errorLens.warningForeground');
    const warningForegroundLight = new vscode.ThemeColor('flawuldragon.errorLens.warningForegroundLight');
    let warningMessageBackground: vscode.ThemeColor | undefined = new vscode.ThemeColor('flawuldragon.errorLens.warningMessageBackground');
  
    let infoBackground: vscode.ThemeColor | undefined = new vscode.ThemeColor('flawuldragon.errorLens.infoBackground');
    let infoBackgroundLight: vscode.ThemeColor | undefined = new vscode.ThemeColor('flawuldragon.errorLens.infoBackgroundLight');
    const infoForeground = new vscode.ThemeColor('flawuldragon.errorLens.infoForeground');
    const infoForegroundLight = new vscode.ThemeColor('flawuldragon.errorLens.infoForegroundLight');
    let infoMessageBackground: vscode.ThemeColor | undefined = new vscode.ThemeColor('flawuldragon.errorLens.infoMessageBackground');
  
    let hintBackground: vscode.ThemeColor | undefined = new vscode.ThemeColor('flawuldragon.errorLens.hintBackground');
    let hintBackgroundLight: vscode.ThemeColor | undefined = new vscode.ThemeColor('flawuldragon.errorLens.hintBackgroundLight');
    const hintForeground = new vscode.ThemeColor('flawuldragon.errorLens.hintForeground');
    const hintForegroundLight = new vscode.ThemeColor('flawuldragon.errorLens.hintForegroundLight');
    let hintMessageBackground: vscode.ThemeColor | undefined = new vscode.ThemeColor('flawuldragon.errorLens.hintMessageBackground');
  
    const statusBarErrorForeground = new vscode.ThemeColor('flawuldragon.errorLens.statusBarErrorForeground');
    const statusBarWarningForeground = new vscode.ThemeColor('flawuldragon.errorLens.statusBarWarningForeground');
    const statusBarInfoForeground = new vscode.ThemeColor('flawuldragon.errorLens.statusBarInfoForeground');
    const statusBarHintForeground = new vscode.ThemeColor('flawuldragon.errorLens.statusBarHintForeground');
  
    if ($config.messageBackgroundMode === 'line') {
      errorMessageBackground = undefined;
      warningMessageBackground = undefined;
      infoMessageBackground = undefined;
      hintMessageBackground = undefined;
    } else if ($config.messageBackgroundMode === 'message') {
      errorBackground = undefined;
      errorBackgroundLight = undefined;
      warningBackground = undefined;
      warningBackgroundLight = undefined;
      infoBackground = undefined;
      infoBackgroundLight = undefined;
      hintBackground = undefined;
      hintBackgroundLight = undefined;
    } else if ($config.messageBackgroundMode === 'none') {
      errorBackground = undefined;
      errorBackgroundLight = undefined;
      warningBackground = undefined;
      warningBackgroundLight = undefined;
      infoBackground = undefined;
      infoBackgroundLight = undefined;
      hintBackground = undefined;
      hintBackgroundLight = undefined;
  
      errorMessageBackground = undefined;
      warningMessageBackground = undefined;
      infoMessageBackground = undefined;
      hintMessageBackground = undefined;
    }
  
    const onlyDigitsRegExp = /^\d+$/u;
    const fontFamily = $config.fontFamily ? `font-family:${$config.fontFamily}` : '';
    const fontSize = $config.fontSize ? `font-size:${onlyDigitsRegExp.test($config.fontSize) ? `${$config.fontSize}px` : $config.fontSize}` : '';
    const marginLeft = onlyDigitsRegExp.test($config.margin) ? `${$config.margin}px` : $config.margin;
    const padding = $config.padding ? `padding:${onlyDigitsRegExp.test($config.padding) ? `${$config.padding}px` : $config.padding}` : '';
    const borderRadius = `border-radius: ${$config.borderRadius || '0'}`;
    const scrollbarHack = $config.scrollbarHackEnabled ? 'position:absolute;pointer-events:none;top:50%;transform:translateY(-50%);' : '';
  
    this.textDecorationStyleString = `none;${fontFamily};${fontSize};${borderRadius}`;
  
    const afterProps: vscode.ThemableDecorationAttachmentRenderOptions = {
      fontStyle: $config.fontStyleItalic ? 'italic' : 'normal',
      fontWeight: $config.fontWeight,
      margin: `0 0 0 ${marginLeft}`,
      textDecoration: `${this.textDecorationStyleString};${padding};${scrollbarHack}`,
    };
    
    const decorationRenderOptionsError: vscode.DecorationRenderOptions = {
      backgroundColor: errorBackground,
      gutterIconSize: $config.gutterIconSize,
      gutterIconPath: gutter?.errorIconPath,
      after: {
        ...afterProps,
        color: errorForeground,
        backgroundColor: errorMessageBackground,
        ...$config.decorations?.errorMessage,
      },
      light: {
        backgroundColor: errorBackgroundLight,
        gutterIconSize: $config.gutterIconSize,
        gutterIconPath: gutter?.errorIconPathLight,
        after: {
          color: errorForegroundLight,
          ...$config.decorations?.errorMessage,
          ...$config.decorations?.errorMessage?.light,
        },
      },
      isWholeLine: true,
    };
    const decorationRenderOptionsWarning: vscode.DecorationRenderOptions = {
      backgroundColor: warningBackground,
      gutterIconSize: $config.gutterIconSize,
      gutterIconPath: gutter?.warningIconPath,
      after: {
        ...afterProps,
        color: warningForeground,
        backgroundColor: warningMessageBackground,
        ...$config.decorations?.warningMessage,
      },
      light: {
        backgroundColor: warningBackgroundLight,
        gutterIconSize: $config.gutterIconSize,
        gutterIconPath: gutter?.warningIconPathLight,
        after: {
          color: warningForegroundLight,
          ...$config.decorations?.warningMessage,
          ...$config.decorations?.warningMessage?.light,
        },
      },
      isWholeLine: true,
    };
    const decorationRenderOptionsInfo: vscode.DecorationRenderOptions = {
      backgroundColor: infoBackground,
      gutterIconSize: $config.gutterIconSize,
      gutterIconPath: gutter?.infoIconPath,
      after: {
        ...afterProps,
        color: infoForeground,
        backgroundColor: infoMessageBackground,
        ...$config.decorations?.infoMessage,
      },
      light: {
        backgroundColor: infoBackgroundLight,
        gutterIconSize: $config.gutterIconSize,
        gutterIconPath: gutter?.infoIconPathLight,
        after: {
          color: infoForegroundLight,
          ...$config.decorations?.infoMessage,
          ...$config.decorations?.infoMessage?.light,
        },
      },
      isWholeLine: true,
    };
    const decorationRenderOptionsHint: vscode.DecorationRenderOptions = {
      backgroundColor: hintBackground,
      gutterIconSize: $config.gutterIconSize,
      gutterIconPath: gutter?.hintIconPath,
      after: {
        ...afterProps,
        color: hintForeground,
        backgroundColor: hintMessageBackground,
        ...$config.decorations?.hintMessage,
      },
      light: {
        backgroundColor: hintBackgroundLight,
        gutterIconSize: $config.gutterIconSize,
        gutterIconPath: gutter?.hintIconPathLight,
        after: {
          color: hintForegroundLight,
          ...$config.decorations?.hintMessage,
          ...$config.decorations?.hintMessage?.light,
        },
      },
      isWholeLine: true,
    };
  
    if (!ELExtUtils.prototype.shouldShowInlineMessage()) {
      decorationRenderOptionsError.backgroundColor = undefined;
      decorationRenderOptionsError.after = undefined;
      decorationRenderOptionsError.light!.backgroundColor = undefined;
      decorationRenderOptionsError.light!.after = undefined;
  
      decorationRenderOptionsWarning.backgroundColor = undefined;
      decorationRenderOptionsWarning.after = undefined;
      decorationRenderOptionsWarning.light!.backgroundColor = undefined;
      decorationRenderOptionsWarning.light!.after = undefined;
  
      decorationRenderOptionsInfo.backgroundColor = undefined;
      decorationRenderOptionsInfo.after = undefined;
      decorationRenderOptionsInfo.light!.backgroundColor = undefined;
      decorationRenderOptionsInfo.light!.after = undefined;
  
      decorationRenderOptionsHint.backgroundColor = undefined;
      decorationRenderOptionsHint.after = undefined;
      decorationRenderOptionsHint.light!.backgroundColor = undefined;
      decorationRenderOptionsHint.light!.after = undefined;
    }

    if(this.decorationTypes) {

      this.decorationTypes.error = vscode.window.createTextEditorDecorationType(decorationRenderOptionsError);
      this.decorationTypes.warning = vscode.window.createTextEditorDecorationType(decorationRenderOptionsWarning);
      this.decorationTypes.info = vscode.window.createTextEditorDecorationType(decorationRenderOptionsInfo);
      this.decorationTypes.hint = vscode.window.createTextEditorDecorationType(decorationRenderOptionsHint);
    
      // ──── Range ─────────────────────────────────────────────────
      this.decorationTypes.errorRange = vscode.window.createTextEditorDecorationType({
        backgroundColor: new vscode.ThemeColor('flawuldragon.errorLens.errorRangeBackground'),
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
        ...$config.decorations.errorRange,
      });
      this.decorationTypes.warningRange = vscode.window.createTextEditorDecorationType({
        backgroundColor: new vscode.ThemeColor('flawuldragon.errorLens.warningRangeBackground'),
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
        ...$config.decorations.warningRange,
      });
      this.decorationTypes.infoRange = vscode.window.createTextEditorDecorationType({
        backgroundColor: new vscode.ThemeColor('flawuldragon.errorLens.infoRangeBackground'),
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
        ...$config.decorations.infoRange,
      });
      this.decorationTypes.hintRange = vscode.window.createTextEditorDecorationType({
        backgroundColor: new vscode.ThemeColor('flawuldragon.errorLens.hintRangeBackground'),
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
        ...$config.decorations.hintRange,
      });
    }

    const transparentGutterIcon: vscode.DecorationRenderOptions = {
      gutterIconPath: gutter?.transparent1x1Icon,
      light: {
        gutterIconPath: gutter?.transparent1x1Icon,
      },
    };
    if(this.decorationTypes) {
      this.decorationTypes.transparent1x1Icon = vscode.window.createTextEditorDecorationType(transparentGutterIcon);
    }
  
    $state.statusBarMessage.statusBarColors = [statusBarErrorForeground, statusBarWarningForeground, statusBarInfoForeground, statusBarHintForeground];
  }

  /**
   * Actually apply decorations for editor.
   * @param range Only allow decorating lines in this range.
   */
  public doUpdateDecorations(editor: vscode.TextEditor, groupedDiagnostics: TELGroupedByLineDiagnostics, range?: vscode.Range): void {
    const decorationOptionsError: vscode.DecorationOptions[] = [];
    const decorationOptionsWarning: vscode.DecorationOptions[] = [];
    const decorationOptionsInfo: vscode.DecorationOptions[] = [];
    const decorationOptionsHint: vscode.DecorationOptions[] = [];
  
    const decorationOptionsErrorRange: vscode.DecorationOptions[] = [];
    const decorationOptionsWarningRange: vscode.DecorationOptions[] = [];
    const decorationOptionsInfoRange: vscode.DecorationOptions[] = [];
    const decorationOptionsHintRange: vscode.DecorationOptions[] = [];
  
    let allowedLineNumbersToRenderDiagnostics: number[] | undefined;
    if ($config.followCursor === 'closestProblem' || $config.followCursor === 'closestProblemMultiline') {
      if (range === undefined) {
        range = editor.selection;
      }
      const line = range.start.line;
  
      const groupedDiagnosticsAsArray = Object?.entries(groupedDiagnostics).sort((a, b) => Math.abs(line - Number(a[0])) - Math.abs(line - Number(b[0])));
      groupedDiagnosticsAsArray.length = $config.followCursorMore + 1;// Reduce array length to the number of allowed rendered lines (decorations)
      allowedLineNumbersToRenderDiagnostics = groupedDiagnosticsAsArray.map(d => d[1][0].range.start.line);
    }
  
    if ($config.followCursor === 'closestProblemMultiline' ||
      $config.followCursor === 'closestProblemMultilineInViewport' ||
      $config.followCursor === 'closestProblemMultilineBySeverity') {
      ELMultilineDecoration.prototype.showMultilineDecoration(editor);
    }
  
    for (const key in groupedDiagnostics) {
      const allDiagnosticsInLine = groupedDiagnostics[key];
      const diagnostic = allDiagnosticsInLine[0];
      const severity = diagnostic.severity;
  
      let message: string | undefined;
  
      if (ELExtUtils.prototype.shouldShowInlineMessage()) {
        message = ELExtUtils.prototype.prepareMessage({
          diagnostic,
          template: $config.messageTemplate,
          lineProblemCount: allDiagnosticsInLine.length,
          removeLinebreaks: $config.removeLinebreaks,
          replaceLinebreaksSymbol: $config.replaceLinebreaksSymbol,
        });
      } else {
        message = undefined;
      }
  
      let alignMarginStyle = '';
      let alignRange: vscode.Range | undefined;
      if (ELExtUtils.prototype.shouldAlign()) {
        const styleForAlignment = ELDecorationsAlign.prototype.getStyleForAlignment({
          isMultilineDecoration: false,
          alignmentKind: $config.alignMessage.useFixedPosition ? 'fixed' : 'normal',
          textLine: editor.document.lineAt(Number(key)),
          indentSize: editor.options.tabSize as number,
          indentStyle: editor.options.insertSpaces as boolean ? 'spaces' : 'tab',
          minimumMargin: $config.alignMessage.minimumMargin,
          minVisualLineLength: $config.alignMessage.start,
          start: $config.alignMessage.start,
          end: $config.alignMessage.end,
          problemMessage: message ?? '',
        });
        alignMarginStyle = styleForAlignment.styleStr;
        alignRange = styleForAlignment.range;
      }
  
      const decInstanceRenderOptions: vscode.DecorationInstanceRenderOptions = {
        after: {
          contentText: message,
          // height: extUtils.shouldAlign() && $config.alignMessage.useFixedPosition ? '100%' : undefined,
          textDecoration: ELExtUtils.prototype.shouldAlign() ? `${this.textDecorationStyleString};${alignMarginStyle}` : undefined,
        },
      };
  
      let messageRange: vscode.Range | undefined;
      if ($config.followCursor === 'allLines') {
        // Default value (most used)
        messageRange = diagnostic.range;
      } else {
        // Others require cursor tracking
        if (range === undefined) {
          range = editor.selection;
        }
        const diagnosticRange = diagnostic.range;
  
        if ($config.followCursor === 'activeLine') {
          const lineStart = range.start.line - $config.followCursorMore;
          const lineEnd = range.end.line + $config.followCursorMore;
  
          if (
            ((diagnosticRange.start.line >= lineStart) && (diagnosticRange.start.line <= lineEnd)) ||
              ((diagnosticRange.end.line >= lineStart) && (diagnosticRange.end.line <= lineEnd))
          ) {
            messageRange = diagnosticRange;
          }
        } else if ($config.followCursor === 'allLinesExceptActive') {
          const lineStart = range.start.line;
          const lineEnd = range.end.line;
  
          if (
            ((diagnosticRange.start.line >= lineStart) && (diagnosticRange.start.line <= lineEnd)) ||
              ((diagnosticRange.end.line >= lineStart) && (diagnosticRange.end.line <= lineEnd))
          ) {
            messageRange = undefined;
          } else {
            messageRange = diagnosticRange;
          }
        } else if ($config.followCursor === 'closestProblem') {
          if (allowedLineNumbersToRenderDiagnostics!.includes(diagnosticRange.start.line) || allowedLineNumbersToRenderDiagnostics!.includes(diagnosticRange.end.line)) {
            messageRange = diagnosticRange;
          }
        }
  
        if (!messageRange) {
          continue;
        }
      }
  
      const diagnosticDecorationOptions: vscode.DecorationOptions = {
        range: alignRange ?? new vscode.Range(messageRange.start.line, messageRange.start.character, messageRange.start.line, messageRange.start.character),
        hoverMessage: ELHover.prototype.createHoverForDiagnostic({
          diagnostic,
          buttonsEnabled: $config.editorHoverPartsEnabled.buttonsEnabled,
          messageEnabled: $config.editorHoverPartsEnabled.messageEnabled,
          sourceCodeEnabled: $config.editorHoverPartsEnabled.sourceCodeEnabled,
          lintFilePaths: $config.lintFilePaths,
        }),
        renderOptions: decInstanceRenderOptions,
      };
  
      switch (severity) {
        case 0: {
          decorationOptionsError.push(diagnosticDecorationOptions);
          if ($config.problemRangeDecorationEnabled) {
            decorationOptionsErrorRange.push({
              range: messageRange,
            });
          }
          break;
        }
        case 1: {
          decorationOptionsWarning.push(diagnosticDecorationOptions);
          if ($config.problemRangeDecorationEnabled) {
            decorationOptionsWarningRange.push({
              range: messageRange,
            });
          }
          break;
        }
        case 2: {
          decorationOptionsInfo.push(diagnosticDecorationOptions);
          if ($config.problemRangeDecorationEnabled) {
            decorationOptionsInfoRange.push({
              range: messageRange,
            });
          }
          break;
        }
        case 3: {
          decorationOptionsHint.push(diagnosticDecorationOptions);
          if ($config.problemRangeDecorationEnabled) {
            decorationOptionsHintRange.push({
              range: messageRange,
            });
          }
          break;
        }
        default: {}
      }
    }
  
    if (ELExtUtils.prototype.shouldShowGutterIcons()) {
      this.updateWorkaroundGutterIcon(editor);
    }

    if(this.decorationTypes) {
      editor.setDecorations(this.decorationTypes.error, decorationOptionsError);
      editor.setDecorations(this.decorationTypes.warning, decorationOptionsWarning);
      editor.setDecorations(this.decorationTypes.info, decorationOptionsInfo);
      editor.setDecorations(this.decorationTypes.hint, decorationOptionsHint);
    }
  
    if ($config.problemRangeDecorationEnabled) {
      if(this.decorationTypes) {
        editor.setDecorations(this.decorationTypes.errorRange, decorationOptionsErrorRange);
        editor.setDecorations(this.decorationTypes.warningRange, decorationOptionsWarningRange);
        editor.setDecorations(this.decorationTypes.infoRange, decorationOptionsInfoRange);
        editor.setDecorations(this.decorationTypes.hintRange, decorationOptionsHintRange);
      }
    }
  
    if ($state.renderGutterIconsAsSeparateDecoration) {
      ELGutter.prototype.doUpdateGutterDecorations(editor, groupedDiagnostics);
    }
  
    $state.statusBarMessage.updateText(editor, groupedDiagnostics);
  
    $state.codeLens.update();
  }
  
  public updateDecorationsForAllVisibleEditors(): void {
    if (
      $config.onSave &&
      !$config.onSaveUpdateOnActiveEditorChange
    ) {
      return;
    }
  
    for (const editor of vscode.window.visibleTextEditors) {
      $state.log('updateDecorationsForAllVisibleEditors()');
      this.updateDecorationsForUri({
        uri: editor.document.uri,
        editor,
      });
    }
  }

  /**
   * Update decorations for one editor.
   */
  public updateDecorationsForUri({
    uri,
    editor,
    groupedDiagnostics,
    range,
  }: {
    uri: vscode.Uri;
    editor?: vscode.TextEditor;
    groupedDiagnostics?: TELGroupedByLineDiagnostics;
    range?: vscode.Range;
  }): void {
    if (editor === undefined) {
      editor = vscode.window.activeTextEditor;
    }
    if (!editor) {
      return;
    }
  
    if (!editor.document.uri.fsPath) {
      return;
    }
  
    if ($config.ignoreUntitled && editor.document.uri.scheme === 'untitled') {
      return;
    }
  
    if (
      (!$config.enableOnDiffView && editor.viewColumn === undefined) &&
      editor.document.uri.scheme !== 'vscode-notebook-cell'
    ) {
      this.doUpdateDecorations(editor, {});
      return;
    }
  
    if (!$config.enabledInMergeConflict) {
      const editorText = editor.document.getText();
      if (
        editorText.includes(EELConstants.MergeConflictSymbol1) ||
        editorText.includes(EELConstants.MergeConflictSymbol2) ||
        editorText.includes(EELConstants.MergeConflictSymbol3)
      ) {
        this.doUpdateDecorations(editor, {});
        return;
      }
    }
  
    if ($state.excludePatterns) {
      for (const pattern of $state.excludePatterns) {
        if (vscode.languages.match(pattern, editor.document) !== 0) {
          return;
        }
      }
    }
  
    const currentWorkspacePath = vscode.workspace.getWorkspaceFolder(editor.document.uri)?.uri.fsPath;
    if (
      currentWorkspacePath &&
      $config.excludeWorkspaces.includes(currentWorkspacePath)
    ) {
      return;
    }
    $state.log('updateDecorationsForUri()', uri.toString(true));
    this.doUpdateDecorations(editor, groupedDiagnostics ?? ELExtUtils.prototype.groupDiagnosticsByLine(vscode.languages.getDiagnostics(uri)), range);
  }

  /**
   * Issue https://github.com/usernamehw/vscode-error-lens/issues/177
   */
  public updateWorkaroundGutterIcon(editor: vscode.TextEditor): void {
    const ranges: vscode.Range[] = [];
    for (const breakpoint of vscode.debug.breakpoints) {
      // @ts-expect-error location is probably optional, but can be there
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const location: vscode.Location = breakpoint?.location;
      if (location && location.uri.toString(true) === editor?.document.uri.toString(true)) {
        ranges.push(location.range);
      }
    }
    if(this.decorationTypes) {
      editor.setDecorations(this.decorationTypes.transparent1x1Icon, ranges);
    }
  }
  
  public disposeAllDecorations(): void {
    if(this.decorationTypes) {
      for (const decorationType of Object?.values(this.decorationTypes)) {
        decorationType?.dispose();
      }
    }
  }
}
