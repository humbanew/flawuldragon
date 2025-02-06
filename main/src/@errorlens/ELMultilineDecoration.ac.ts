import * as vscode from 'vscode';
import { ELDecorations } from './ELDecorations.ac.js';
import { IELGroupedTextLines, IELScoreGroupedLinesArg } from './declares.js';
import { ELDecorationsAlign } from './ELDecorationsAlign.ac.js';
import { ELExtUtils } from './ELExtUtils.ac.js';
import { $config } from './ErrorLens.js';

// utils/showMultilineDecoration.ts
export class ELMultilineDecoration {

  public createMultilineDecorations(): void {
    // ──── Multiline message ─────────────────────────────────────
    // TODO: after props with fontFamily config
    ELDecorations.prototype.decorationTypes.multilineError = vscode.window.createTextEditorDecorationType({
      after: {
        backgroundColor: new vscode.ThemeColor('flawuldragon.errorMessageBackground'),
        color: new vscode.ThemeColor('flawuldragon.errorForeground'),
      },
    });
    ELDecorations.prototype.decorationTypes.multilineWarning = vscode.window.createTextEditorDecorationType({
      after: {
        backgroundColor: new vscode.ThemeColor('flawuldragon.warningMessageBackground'),
        color: new vscode.ThemeColor('flawuldragon.warningForeground'),
      },
    });
    ELDecorations.prototype.decorationTypes.multilineInfo = vscode.window.createTextEditorDecorationType({
      after: {
        backgroundColor: new vscode.ThemeColor('errorLens.infoMessageBackground'),
        color: new vscode.ThemeColor('errorLens.infoForeground'),
      },
    });
    ELDecorations.prototype.decorationTypes.multilineHint = vscode.window.createTextEditorDecorationType({
      after: {
        backgroundColor: new vscode.ThemeColor('errorLens.hintMessageBackground'),
        color: new vscode.ThemeColor('errorLens.hintForeground'),
      },
    });
  
    // Since message decoration is located in a different random place in the editor => highlight line/range where the problem is.
  
    // ──── Highlight line where problem is located ───────────────
    ELDecorations.prototype.decorationTypes.multilineErrorLineBackground = vscode.window.createTextEditorDecorationType({
      backgroundColor: new vscode.ThemeColor('errorLens.errorBackground'),
      isWholeLine: true,
    });
    ELDecorations.prototype.decorationTypes.multilineWarningLineBackground = vscode.window.createTextEditorDecorationType({
      backgroundColor: new vscode.ThemeColor('errorLens.warningBackground'),
      isWholeLine: true,
    });
    ELDecorations.prototype.decorationTypes.multilineInfoLineBackground = vscode.window.createTextEditorDecorationType({
      backgroundColor: new vscode.ThemeColor('errorLens.infoBackground'),
      isWholeLine: true,
    });
    ELDecorations.prototype.decorationTypes.multilineHintLineBackground = vscode.window.createTextEditorDecorationType({
      backgroundColor: new vscode.ThemeColor('errorLens.hintBackground'),
      isWholeLine: true,
    });
  }

  /**
   * Try to find pockets of empty space where extension can draw multiline decorations.
   */
  public showMultilineDecoration(editor: vscode.TextEditor): void {
    const diagnosticsForUri = vscode.languages.getDiagnostics(editor.document.uri);
    if (diagnosticsForUri.length === 0 || !ELExtUtils.prototype.shouldShowInlineMessage()) {
      // There are no problems in this file
      this.clearAllMultilineDecorations(editor);
      return;
    }
  
    // const cursorInViewport = isCursorInViewport(editor);
    // const closestDiagnosticInViewport = extUtils.getClosestDiagnosticInViewport(editor);
  
    let diagnostic: vscode.Diagnostic | undefined;
    if ($config.followCursor === 'closestProblemMultiline') {
      diagnostic = ELExtUtils.prototype.getClosestDiagnostic(editor);
    } else if ($config.followCursor === 'closestProblemMultilineInViewport') {
      diagnostic = ELExtUtils.prototype.getClosestDiagnosticInViewport(editor);
    } else if ($config.followCursor === 'closestProblemMultilineBySeverity') {
      diagnostic = ELExtUtils.prototype.getClosestBySeverityDiagnostic(editor);
    }
  
    if (diagnostic === undefined) {
      this.clearAllMultilineDecorations(editor);
      return;
    }
  
    const indentStyle = editor.options.insertSpaces as boolean ? 'spaces' : 'tab';
    const indentSize = editor.options.tabSize as number;
  
    let messageLines = diagnostic.message.split(/[\n\r]/u);
    const maxMessageLineLength = messageLines.slice(0).sort((ln1, ln2) => ln2.length - ln1.length)[0].length;
    messageLines = messageLines.map(line => line.padEnd(maxMessageLineLength, ' '));
    const isProblemInViewport = ELExtUtils.prototype.isDiagnosticInViewport(editor, diagnostic);
    const visibleLineCount = this.getVisibleLineCount(editor);//
  
    const howManyLinesInDecoration = Math.min(messageLines.length, $config.multilineMessage.decorationMaxNumberOfLines, editor.document.lineCount);
  
    let result: IELGroupedTextLines[] = [];
  
    const groupedTextLines: vscode.TextLine[][] = [];
  
    for (const visibleRange of editor.visibleRanges) {
      for (let i = visibleRange.start.line; i < visibleRange.end.line; i++) {
        const textLines: vscode.TextLine[] = [];
        for (let j = i; j < (i + howManyLinesInDecoration); j++) {
          if (j > editor.document.lineCount - 1) {
            break;
          }
          const lineAt = editor.document.lineAt(j);
          if (lineAt) {
            textLines.push(lineAt);
          }
        }
        groupedTextLines.push(textLines);
      }
    }
  
    for (const textLines of groupedTextLines) {
      const howManyLinesFromDiagnostic = this.howManyLinesAwayFromDiagnostic(textLines[0].range.start.line, textLines.at(-1)!.range.end.line, diagnostic);
      const minLine = textLines.slice(0).sort((tl1, tl2) => ELExtUtils.prototype.getVisualLineLength(tl2, indentSize, indentStyle) - ELExtUtils.prototype.getVisualLineLength(tl1, indentSize, indentStyle))[0];
      const minVisualLineLength = Math.max(ELExtUtils.prototype.getVisualLineLength(minLine, indentSize, indentStyle), $config.multilineMessage.alignStart);
  
      result.push({
        startLineIndex: textLines[0].range.start.line,
        endLineIndex: textLines.at(-1)!.range.end.line,
        howManyLinesFromDiagnostic,
        minVisualLineLength,
        score: this.scoreGroupedLines({
          textLines,
          diagnostic,
          messageLines,
          howManyLinesFromDiagnostic,
          minVisualLineLength,
          visibleLineCount,
          preferFittingMessageMultiplier: $config.multilineMessage.preferFittingMessageMultiplier,
        }),
        textLines,
        startLineStartsWith: textLines[0].text.slice(0, 10),
      });
    }
  
    result = result.slice(0).sort((group1, group2) => group2.score - group1.score);
    // console.table(result);
    const whereToShowDecoration = result[0];
  
    const decorationsToDraw: vscode.DecorationOptions[] = [];
    let i = 0;
    for (const textLine of whereToShowDecoration.textLines) {
      // const visualLineLength = extUtils.getVisualLineLength(textLine, indentSize, indentStyle);
      // const margin = $config.multilineMessage.margin + whereToShowDecoration.minVisualLineLength - visualLineLength;
      const borderRadius = this.makeRoundCornersForDecoration({
        isFirstLineOfDecoration: i === 0,
        isLastLineOfDecoration: i === whereToShowDecoration.textLines.length - 1,
      });
      /** Both line & message decorations have transparency so when they overlap it looks bad */
      const skipBackground = $config.multilineMessage.highlightProblemLine === 'line' && textLine.range.start.line === diagnostic.range.start.line;
  
      let styleStr = '';
      let range: vscode.Range;
      let heightStyle: string | undefined;
      if ($config.multilineMessage.useFixedPosition) {
        // Draw decoration as fixed positioned element
        const fixedMarginStyle = ELDecorationsAlign.prototype.getStyleForAlignment({
          isMultilineDecoration: true,
          alignmentKind: 'fixed',
          indentSize,
          indentStyle,
          minVisualLineLength: whereToShowDecoration.minVisualLineLength,
          minimumMargin: $config.multilineMessage.margin,
          textLine,
          start: $config.multilineMessage.alignStart,
          end: $config.multilineMessage.alignEnd,
          problemMessage: messageLines[i],
        });
        range = fixedMarginStyle.range;
        styleStr = fixedMarginStyle.styleStr;
      } else {
        const normalMarginStyle = ELDecorationsAlign.prototype.getStyleForAlignment({
          isMultilineDecoration: true,
          alignmentKind: 'normal',
          indentSize,
          indentStyle,
          minVisualLineLength: whereToShowDecoration.minVisualLineLength,
          minimumMargin: $config.multilineMessage.margin,
          textLine,
          start: $config.multilineMessage.alignStart,
          end: $config.multilineMessage.alignEnd,
          problemMessage: messageLines[i],
        });
        range = normalMarginStyle.range;
        styleStr = normalMarginStyle.styleStr;
        heightStyle = '100%';
      }
  
      decorationsToDraw.push({
        range,
        renderOptions: {
          after: {
            height: heightStyle,
            backgroundColor: skipBackground ? '#fff0' : undefined,
            contentText: messageLines[i],
            textDecoration: `;white-space:pre;padding:0 ${$config.multilineMessage.padding}ch;${borderRadius};${styleStr};`, // Keep leading whitespace in ::after content
          },
        },
      });
      i++;
    }
  
    let errorDecorations: vscode.DecorationOptions[] = [];
    let warningDecorations: vscode.DecorationOptions[] = [];
    let infoDecorations: vscode.DecorationOptions[] = [];
    let hintDecorations: vscode.DecorationOptions[] = [];
  
    let errorLineDecorations: vscode.Range[] = [];
    let warningLineDecorations: vscode.Range[] = [];
    let infoLineDecorations: vscode.Range[] = [];
    let hintLineDecorations: vscode.Range[] = [];
  
    if (diagnostic.severity === 0) {
      errorDecorations = decorationsToDraw;
      errorLineDecorations = [new vscode.Range(diagnostic.range.start, diagnostic.range.start)];
    } else if (diagnostic.severity === 1) {
      warningDecorations = decorationsToDraw;
      warningLineDecorations = [new vscode.Range(diagnostic.range.start, diagnostic.range.start)];
    } else if (diagnostic.severity === 2) {
      infoDecorations = decorationsToDraw;
      infoLineDecorations = [new vscode.Range(diagnostic.range.start, diagnostic.range.start)];
    } else if (diagnostic.severity === 3) {
      hintDecorations = decorationsToDraw;
      hintLineDecorations = [new vscode.Range(diagnostic.range.start, diagnostic.range.start)];
    }
  
    editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineError, errorDecorations);
    editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineWarning, warningDecorations);
    editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineInfo, infoDecorations);
    editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineHint, hintDecorations);
  
    if ($config.multilineMessage.highlightProblemLine === 'line') {
      editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineErrorLineBackground, errorLineDecorations);
      editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineWarningLineBackground, warningLineDecorations);
      editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineInfoLineBackground, infoLineDecorations);
      editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineHintLineBackground, hintLineDecorations);
    } else if ($config.multilineMessage.highlightProblemLine === 'range') {
      if (diagnostic.severity === 0) {
        editor.setDecorations(ELDecorations.prototype.decorationTypes.errorRange, [diagnostic.range]);
      } else if (diagnostic.severity === 1) {
        editor.setDecorations(ELDecorations.prototype.decorationTypes.warningRange, [diagnostic.range]);
      } else if (diagnostic.severity === 2) {
        editor.setDecorations(ELDecorations.prototype.decorationTypes.infoRange, [diagnostic.range]);
      } else if (diagnostic.severity === 3) {
        editor.setDecorations(ELDecorations.prototype.decorationTypes.hintRange, [diagnostic.range]);
      }
    }
  }
  
  public clearAllMultilineDecorations(editor: vscode.TextEditor): void {
    editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineError, []);
    editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineWarning, []);
    editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineInfo, []);
    editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineHint, []);
  
    editor.setDecorations(ELDecorations.prototype.decorationTypes.errorRange, []);
    editor.setDecorations(ELDecorations.prototype.decorationTypes.warningRange, []);
    editor.setDecorations(ELDecorations.prototype.decorationTypes.infoRange, []);
    editor.setDecorations(ELDecorations.prototype.decorationTypes.hintRange, []);
  
    editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineErrorLineBackground, []);
    editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineWarningLineBackground, []);
    editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineInfoLineBackground, []);
    editor.setDecorations(ELDecorations.prototype.decorationTypes.multilineHintLineBackground, []);
  }
  
  /**
   * Round corners on multiple decoration lines to make an illusion that they are all a part of single decoration.
   */
  public makeRoundCornersForDecoration({ isFirstLineOfDecoration, isLastLineOfDecoration }: { isFirstLineOfDecoration: boolean; isLastLineOfDecoration: boolean }): string {
    let borderRadiusValue = '';
    const configBorderRadius = $config.multilineMessage.borderRadius || $config.borderRadius;
  
    if (isFirstLineOfDecoration) {
      borderRadiusValue = `${configBorderRadius} ${configBorderRadius} 0 0`;
    } else if (isLastLineOfDecoration) {
      borderRadiusValue = `0 0 ${configBorderRadius} ${configBorderRadius}`;
    }
    if (isFirstLineOfDecoration && isLastLineOfDecoration) {
      borderRadiusValue = `${configBorderRadius}`;
    }
  
    return `border-radius:${borderRadiusValue}`;
  }

  /**
   * Calculate how far away (in lines) the diagnostic is from the place where multiline
   * decoration will be shown.
   */
  public howManyLinesAwayFromDiagnostic(startLine: number, endLine: number, diagnostic: vscode.Diagnostic): number {
    return Math.min(
      Math.abs(startLine - diagnostic.range.start.line),
      Math.abs(endLine - diagnostic.range.start.line),
    );
  }
  
  public isCursorInViewport(editor: vscode.TextEditor): boolean {
    const cursorLine = editor.selection.active.line;
    for (const visibleRange of editor.visibleRanges) {
      if (cursorLine >= visibleRange.start.line && cursorLine <= visibleRange.end.line) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Assuming this about a user's viewport (not a split/grid):
   * - Calculate visible line count from `editor.visibleRanges`
   *
   * Try to balance the empty space size (fit more of the message content) and
   * the distance of that empty space from where the diagnostic is located (the closer - the better).
   *
   * Give 100 points for the group that is 0 lines away from diagnostic, 0 - for box that is >visibleLineCount lines away
   * Give 100 points for the group that fits 100% of the message text, 0 - for box that fits none of the message text
   */
  public scoreGroupedLines({ textLines, messageLines, howManyLinesFromDiagnostic, minVisualLineLength, visibleLineCount, preferFittingMessageMultiplier, diagnostic }: IELScoreGroupedLinesArg): number {
    const messageTotalCharacters = messageLines.join('').length;
    const distanceScore = howManyLinesFromDiagnostic >= visibleLineCount ? 0 : Math.floor(100 - (howManyLinesFromDiagnostic / visibleLineCount * 100));
  
    const oneLineCharactersFit = $config.multilineMessage.maxColumnForCalculation - minVisualLineLength;
    const totalCharactersThatDontFit = messageLines.reduce((acc, lineText) => acc + (
      (lineText.length <= oneLineCharactersFit) ? 0 : lineText.length - oneLineCharactersFit
    ), 0);
    const messageFitScore = totalCharactersThatDontFit === 0 ? 100 : (100 - (100 / (messageTotalCharacters / 100 * totalCharactersThatDontFit)));
  
    // eslint-disable-next-line prefer-const
    let score = (distanceScore + (messageFitScore * preferFittingMessageMultiplier));
  
    // Prefer the group that starts at the same place where diagnostic starts
    // if (howManyLinesFromDiagnostic === 0 && textLines[0].range.start.line === diagnostic.range.start.line) {
    // 	score += 2;
    // }
  
    return Math.round(score);
  }
  
  public getVisibleLineCount(editor: vscode.TextEditor): number {
    let visibleLineCount = 0;
    for (const visibleRange of editor.visibleRanges) {
      visibleLineCount += visibleRange.end.line - visibleRange.start.line;
    }
    return visibleLineCount;
  }
}
