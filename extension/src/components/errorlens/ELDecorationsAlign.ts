/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as vscode from 'vscode';
import { IELGetMarginForAlignmentArgs, IELAlignmentArgs, IELAlignmentReturnArg } from "./declares";
import { ELExtUtils } from "./ELExtUtils";

// decorations/align.ts
export class ELDecorationsAlign {

  public getMarginForAlignment({ start, end, message, minimumMargin, visualLineLength }: IELGetMarginForAlignmentArgs): number {
    let margin = 0;
  
    if (start) {
      margin = start <= visualLineLength ? 0 : start - visualLineLength;
    } else if (end) {
      const charDiff = end - message.length - visualLineLength;
      margin = charDiff < 0 ? 0 : charDiff;
    }
  
    return margin < minimumMargin ? minimumMargin : margin;
  }
  
  public getStyleForAlignment({ isMultilineDecoration, alignmentKind, textLine, indentSize, indentStyle, minVisualLineLength, minimumMargin, problemMessage, start, end }: IELAlignmentArgs): IELAlignmentReturnArg {
    let range: vscode.Range;
    let styleStr = '';
  
    const visualLineLength = ELExtUtils.prototype.getVisualLineLength(textLine, indentSize, indentStyle);
    let marginChar = minimumMargin + minVisualLineLength - visualLineLength;
  
    if (isMultilineDecoration) {
      // TODO: implement alignment for multiline decoration
    } else {
      const marginCharAligned = this.getMarginForAlignment({
        start,
        end,
        visualLineLength,
        message: problemMessage,
        minimumMargin,
      });
      marginChar = marginCharAligned;
    }
  
    if (alignmentKind === 'fixed') {
      range = new vscode.Range(
        textLine.range.start,
        textLine.range.start,
      );
      styleStr = `position:fixed;left:${marginChar + visualLineLength}ch;padding:0;margin:0`;
    } else {
      range = new vscode.Range(
        textLine.range.start.line,
        textLine.range.end.character,
        textLine.range.start.line,
        textLine.range.end.character,
      );
      styleStr = `margin:0 0 0 ${marginChar >= 0 ? marginChar : 0}ch`;
    }
  
    return {
      range,
      styleStr,
    };
  }
}