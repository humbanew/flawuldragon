/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as vscode from 'vscode';
import { IELGutter, TELGroupedByLineDiagnostics } from './declares';
import { ELDecorations } from './ELDecorations';
import { ELVSCodeUtils } from './ELVSCodeUtils';
import { $config } from './ErrorLens';

// gutter.ts
export class ELGutter {

  protected fontFamily = '';

  /**
   * Set some defaults for gutter styles and return it.
   */
  public getGutterStyles(extensionContext: vscode.ExtensionContext): IELGutter {
    const gutter: Partial<IELGutter> = {};
  
    gutter.iconSet = $config.gutterIconSet;
  
    if ($config.gutterIconSet === 'circle') {
      gutter.errorIconPath = ELVSCodeUtils.prototype.svgToUri(this.createCircleIcon($config.errorGutterIconColor));
      gutter.errorIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createCircleIcon($config.light.errorGutterIconColor || $config.errorGutterIconColor));
      gutter.warningIconPath = ELVSCodeUtils.prototype.svgToUri(this.createCircleIcon($config.warningGutterIconColor));
      gutter.warningIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createCircleIcon($config.light.warningGutterIconColor || $config.warningGutterIconColor));
      gutter.infoIconPath = ELVSCodeUtils.prototype.svgToUri(this.createCircleIcon($config.infoGutterIconColor));
      gutter.infoIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createCircleIcon($config.light.infoGutterIconColor || $config.infoGutterIconColor));
      gutter.hintIconPath = ELVSCodeUtils.prototype.svgToUri(this.createCircleIcon($config.hintGutterIconColor));
      gutter.hintIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createCircleIcon($config.light.hintGutterIconPath || $config.hintGutterIconColor));
    } else if ($config.gutterIconSet === 'square') {
      gutter.errorIconPath = ELVSCodeUtils.prototype.svgToUri(this.createSquareIcon($config.errorGutterIconColor));
      gutter.errorIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createSquareIcon($config.light.errorGutterIconColor || $config.errorGutterIconColor));
      gutter.warningIconPath = ELVSCodeUtils.prototype.svgToUri(this.createSquareIcon($config.warningGutterIconColor));
      gutter.warningIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createSquareIcon($config.light.warningGutterIconColor || $config.warningGutterIconColor));
      gutter.infoIconPath = ELVSCodeUtils.prototype.svgToUri(this.createSquareIcon($config.infoGutterIconColor));
      gutter.infoIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createSquareIcon($config.light.infoGutterIconColor || $config.infoGutterIconColor));
      gutter.hintIconPath = ELVSCodeUtils.prototype.svgToUri(this.createSquareIcon($config.hintGutterIconColor));
      gutter.hintIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createSquareIcon($config.light.hintGutterIconPath || $config.hintGutterIconColor));
    } else if ($config.gutterIconSet === 'squareRounded') {
      gutter.errorIconPath = ELVSCodeUtils.prototype.svgToUri(this.createSquareRoundedIcon($config.errorGutterIconColor));
      gutter.errorIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createSquareRoundedIcon($config.light.errorGutterIconColor || $config.errorGutterIconColor));
      gutter.warningIconPath = ELVSCodeUtils.prototype.svgToUri(this.createSquareRoundedIcon($config.warningGutterIconColor));
      gutter.warningIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createSquareRoundedIcon($config.light.warningGutterIconColor || $config.warningGutterIconColor));
      gutter.infoIconPath = ELVSCodeUtils.prototype.svgToUri(this.createSquareRoundedIcon($config.infoGutterIconColor));
      gutter.infoIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createSquareRoundedIcon($config.light.infoGutterIconColor || $config.infoGutterIconColor));
      gutter.hintIconPath = ELVSCodeUtils.prototype.svgToUri(this.createSquareRoundedIcon($config.hintGutterIconColor));
      gutter.hintIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createSquareRoundedIcon($config.light.hintGutterIconPath || $config.hintGutterIconColor));
    } else if ($config.gutterIconSet === 'letter') {
      gutter.errorIconPath = ELVSCodeUtils.prototype.svgToUri(this.createLetterIcon($config.errorGutterIconColor, 'E'));
      gutter.errorIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createLetterIcon($config.light.errorGutterIconColor || $config.errorGutterIconColor, 'E'));
      gutter.warningIconPath = ELVSCodeUtils.prototype.svgToUri(this.createLetterIcon($config.warningGutterIconColor, 'W'));
      gutter.warningIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createLetterIcon($config.light.warningGutterIconColor || $config.warningGutterIconColor, 'W'));
      gutter.infoIconPath = ELVSCodeUtils.prototype.svgToUri(this.createLetterIcon($config.infoGutterIconColor, 'I'));
      gutter.infoIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createLetterIcon($config.light.infoGutterIconColor || $config.infoGutterIconColor, 'I'));
      gutter.hintIconPath = ELVSCodeUtils.prototype.svgToUri(this.createLetterIcon($config.hintGutterIconColor, 'H'));
      gutter.hintIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createLetterIcon($config.light.hintGutterIconPath || $config.hintGutterIconColor, 'H'));
    } else if ($config.gutterIconSet === 'emoji') {
      gutter.errorIconPath = ELVSCodeUtils.prototype.svgToUri(this.createEmojiIcon($config.gutterEmoji.error));
      gutter.errorIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createEmojiIcon($config.gutterEmoji.error));
      gutter.warningIconPath = ELVSCodeUtils.prototype.svgToUri(this.createEmojiIcon($config.gutterEmoji.warning));
      gutter.warningIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createEmojiIcon($config.gutterEmoji.warning));
      gutter.infoIconPath = ELVSCodeUtils.prototype.svgToUri(this.createEmojiIcon($config.gutterEmoji.info));
      gutter.infoIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createEmojiIcon($config.gutterEmoji.info));
      gutter.hintIconPath = ELVSCodeUtils.prototype.svgToUri(this.createEmojiIcon($config.gutterEmoji.hint));
      gutter.hintIconPathLight = ELVSCodeUtils.prototype.svgToUri(this.createEmojiIcon($config.gutterEmoji.hint));
    } else {
      gutter.errorIconPath = extensionContext.asAbsolutePath(`../../../assets/errorLens/${gutter.iconSet}/error-dark.svg`);
      gutter.errorIconPathLight = extensionContext.asAbsolutePath(`../../../assets/errorLens/${gutter.iconSet}/error-light.svg`);
      gutter.warningIconPath = extensionContext.asAbsolutePath(`../../../assets/errorLens/${gutter.iconSet}/warning-dark.svg`);
      gutter.warningIconPathLight = extensionContext.asAbsolutePath(`../../../assets/errorLens/${gutter.iconSet}/warning-light.svg`);
      gutter.infoIconPath = extensionContext.asAbsolutePath(`../../../assets/errorLens/${gutter.iconSet}/info-dark.svg`);
      gutter.infoIconPathLight = extensionContext.asAbsolutePath(`../../../assets/errorLens/${gutter.iconSet}/info-light.svg`);
    }
    // ──── User specified custom gutter path ─────────────────────
    if ($config.errorGutterIconPath) {
      gutter.errorIconPath = $config.errorGutterIconPath;
    }
    if ($config.light.errorGutterIconPath || $config.errorGutterIconPath) {
      gutter.errorIconPathLight = $config.light.errorGutterIconPath || $config.errorGutterIconPath;
    }
    if ($config.warningGutterIconPath) {
      gutter.warningIconPath = $config.warningGutterIconPath;
    }
    if ($config.light.warningGutterIconPath || $config.warningGutterIconPath) {
      gutter.warningIconPathLight = $config.light.warningGutterIconColor || $config.warningGutterIconPath;
    }
    if ($config.infoGutterIconPath) {
      gutter.infoIconPath = $config.infoGutterIconPath;
    }
    if ($config.light.infoGutterIconPath || $config.infoGutterIconPath) {
      gutter.infoIconPathLight = $config.light.infoGutterIconColor || $config.infoGutterIconPath;
    }
    if ($config.hintGutterIconPath) {
      gutter.hintIconPath = $config.hintGutterIconPath;
    }
    if ($config.light.hintGutterIconPath || $config.hintGutterIconPath) {
      gutter.hintIconPathLight = $config.light.hintGutterIconColor || $config.hintGutterIconPath;
    }
  
    return {
      errorIconPath: gutter.errorIconPath,
      errorIconPathLight: gutter.errorIconPathLight,
      warningIconPath: gutter.warningIconPath,
      warningIconPathLight: gutter.warningIconPathLight,
      infoIconPath: gutter.infoIconPath,
      infoIconPathLight: gutter.infoIconPathLight,
      hintIconPath: gutter.hintIconPath,
      hintIconPathLight: gutter.hintIconPathLight,
      iconSet: gutter.iconSet,
  
      transparent1x1Icon: vscode.Uri.parse('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='),
    };
  }
  
  /**
   * Actually apply gutter decorations.
   */
  public doUpdateGutterDecorations(editor: vscode.TextEditor, groupedDiagnostics: TELGroupedByLineDiagnostics): void {
    const decorationOptionsGutterError: vscode.DecorationOptions[] = [];
    const decorationOptionsGutterWarning: vscode.DecorationOptions[] = [];
    const decorationOptionsGutterInfo: vscode.DecorationOptions[] = [];
    const decorationOptionsGutterHint: vscode.DecorationOptions[] = [];
  
    for (const key in groupedDiagnostics) {
      const groupedDiagnostic = groupedDiagnostics[key];
      const diagnostic = groupedDiagnostic[0];
      const severity = diagnostic.severity;
  
      const diagnosticDecorationOptions: vscode.DecorationOptions = {
        range: diagnostic.range,
      };
  
      switch (severity) {
        case 0: {
          decorationOptionsGutterError.push(diagnosticDecorationOptions);
          break;
        }
        case 1: {
          decorationOptionsGutterWarning.push(diagnosticDecorationOptions);
          break;
        }
        case 2: {
          decorationOptionsGutterInfo.push(diagnosticDecorationOptions);
          break;
        }
        case 3: {
          if ($config.gutterIconSet === 'circle' ||
            $config.gutterIconSet === 'square' ||
            $config.gutterIconSet === 'squareRounded' ||
            $config.gutterIconSet === 'letter' ||
            $config.gutterIconSet === 'emoji') {
            decorationOptionsGutterHint.push(diagnosticDecorationOptions);
          }
          break;
        }
        default: {}
      }
    }
  
    editor.setDecorations(ELDecorations.prototype.decorationTypes.gutterError, decorationOptionsGutterError);
    editor.setDecorations(ELDecorations.prototype.decorationTypes.gutterWarning, decorationOptionsGutterWarning);
    editor.setDecorations(ELDecorations.prototype.decorationTypes.gutterInfo, decorationOptionsGutterInfo);
    editor.setDecorations(ELDecorations.prototype.decorationTypes.gutterHint, decorationOptionsGutterHint);
  }

  /**
   * Create circle gutter icons with different colors.
   */
  public createCircleIcon(color: string): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30"><circle cx="15" cy="15" r="7" fill="${this.escapeColor(color)}"/></svg>`;
  }

  /**
   * Create square gutter icons with different colors.
   */
  public createSquareIcon(color: string, rx = 0): string {
    return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" height="40" width="40"><g transform="translate(12, 12)"><rect width="16" height="16" rx="${rx}" fill="${this.escapeColor(color)}"/></g></svg>`;
  }
  /**
   * Create square gutter icons with rounded corners.
   */
  public createSquareRoundedIcon(color: string): string {
    return this.createSquareIcon(color, 3);
  }
  
  /**
   * Crate centered single letter icon.
   */
  public createLetterIcon(color: string, letter: 'E' | 'H' | 'I' | 'W'): string {
    this.fontFamily = this.fontFamily ? this.fontFamily : vscode.workspace.getConfiguration('editor').get('fontFamily') ?? '';
    return `<svg viewBox="-10 -6 20 10" xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill="${this.escapeColor(color)}"><text font-family="${this.fontFamily}" text-anchor="middle" dominant-baseline="middle">${letter}</text></svg>`;
  }

  public createEmojiIcon(emojiSymbol: string): string {
    this.fontFamily = this.fontFamily ? this.fontFamily : vscode.workspace.getConfiguration('editor').get('fontFamily') ?? '';
    return `<svg viewBox="-10 -6 20 10" xmlns='http://www.w3.org/2000/svg' width='16' height='16'><text font-family="${this.fontFamily}" text-anchor="middle" dominant-baseline="middle">${emojiSymbol}</text></svg>`;
  }

  /**
   * `%23` is encoded `#` sign (need it to work).
   */
  public escapeColor(color: string): string {
    return `%23${color.slice(1)}`;
  }
}
