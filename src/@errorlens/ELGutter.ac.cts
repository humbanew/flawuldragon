import * as vscode from 'vscode';
import { IELGutter, TELGroupedByLineDiagnostics } from './declares';
import { ELDecorations } from './ELDecorations.ac.cjs';
import { ELVSCodeUtils } from './ELVSCodeUtils.ac.cjs';
import { $config } from './ErrorLens.cjs';

// gutter.ts
export class ELGutter {
  protected decorations = new ELDecorations;
  protected vscodeUtils = new ELVSCodeUtils;

  protected fontFamily = '';

  /**
   * Set some defaults for gutter styles and return it.
   */
  public getGutterStyles(extensionContext: vscode.ExtensionContext): IELGutter {
    const gutter: Partial<IELGutter> = {};
  
    gutter.iconSet = $config.gutterIconSet;
  
    if ($config.gutterIconSet === 'circle') {
      gutter.errorIconPath = this.vscodeUtils.svgToUri(this.createCircleIcon($config.errorGutterIconColor));
      gutter.errorIconPathLight = this.vscodeUtils.svgToUri(this.createCircleIcon($config.light.errorGutterIconColor || $config.errorGutterIconColor));
      gutter.warningIconPath = this.vscodeUtils.svgToUri(this.createCircleIcon($config.warningGutterIconColor));
      gutter.warningIconPathLight = this.vscodeUtils.svgToUri(this.createCircleIcon($config.light.warningGutterIconColor || $config.warningGutterIconColor));
      gutter.infoIconPath = this.vscodeUtils.svgToUri(this.createCircleIcon($config.infoGutterIconColor));
      gutter.infoIconPathLight = this.vscodeUtils.svgToUri(this.createCircleIcon($config.light.infoGutterIconColor || $config.infoGutterIconColor));
      gutter.hintIconPath = this.vscodeUtils.svgToUri(this.createCircleIcon($config.hintGutterIconColor));
      gutter.hintIconPathLight = this.vscodeUtils.svgToUri(this.createCircleIcon($config.light.hintGutterIconPath || $config.hintGutterIconColor));
    } else if ($config.gutterIconSet === 'square') {
      gutter.errorIconPath = this.vscodeUtils.svgToUri(this.createSquareIcon($config.errorGutterIconColor));
      gutter.errorIconPathLight = this.vscodeUtils.svgToUri(this.createSquareIcon($config.light.errorGutterIconColor || $config.errorGutterIconColor));
      gutter.warningIconPath = this.vscodeUtils.svgToUri(this.createSquareIcon($config.warningGutterIconColor));
      gutter.warningIconPathLight = this.vscodeUtils.svgToUri(this.createSquareIcon($config.light.warningGutterIconColor || $config.warningGutterIconColor));
      gutter.infoIconPath = this.vscodeUtils.svgToUri(this.createSquareIcon($config.infoGutterIconColor));
      gutter.infoIconPathLight = this.vscodeUtils.svgToUri(this.createSquareIcon($config.light.infoGutterIconColor || $config.infoGutterIconColor));
      gutter.hintIconPath = this.vscodeUtils.svgToUri(this.createSquareIcon($config.hintGutterIconColor));
      gutter.hintIconPathLight = this.vscodeUtils.svgToUri(this.createSquareIcon($config.light.hintGutterIconPath || $config.hintGutterIconColor));
    } else if ($config.gutterIconSet === 'squareRounded') {
      gutter.errorIconPath = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon($config.errorGutterIconColor));
      gutter.errorIconPathLight = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon($config.light.errorGutterIconColor || $config.errorGutterIconColor));
      gutter.warningIconPath = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon($config.warningGutterIconColor));
      gutter.warningIconPathLight = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon($config.light.warningGutterIconColor || $config.warningGutterIconColor));
      gutter.infoIconPath = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon($config.infoGutterIconColor));
      gutter.infoIconPathLight = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon($config.light.infoGutterIconColor || $config.infoGutterIconColor));
      gutter.hintIconPath = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon($config.hintGutterIconColor));
      gutter.hintIconPathLight = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon($config.light.hintGutterIconPath || $config.hintGutterIconColor));
    } else if ($config.gutterIconSet === 'letter') {
      gutter.errorIconPath = this.vscodeUtils.svgToUri(this.createLetterIcon($config.errorGutterIconColor, 'E'));
      gutter.errorIconPathLight = this.vscodeUtils.svgToUri(this.createLetterIcon($config.light.errorGutterIconColor || $config.errorGutterIconColor, 'E'));
      gutter.warningIconPath = this.vscodeUtils.svgToUri(this.createLetterIcon($config.warningGutterIconColor, 'W'));
      gutter.warningIconPathLight = this.vscodeUtils.svgToUri(this.createLetterIcon($config.light.warningGutterIconColor || $config.warningGutterIconColor, 'W'));
      gutter.infoIconPath = this.vscodeUtils.svgToUri(this.createLetterIcon($config.infoGutterIconColor, 'I'));
      gutter.infoIconPathLight = this.vscodeUtils.svgToUri(this.createLetterIcon($config.light.infoGutterIconColor || $config.infoGutterIconColor, 'I'));
      gutter.hintIconPath = this.vscodeUtils.svgToUri(this.createLetterIcon($config.hintGutterIconColor, 'H'));
      gutter.hintIconPathLight = this.vscodeUtils.svgToUri(this.createLetterIcon($config.light.hintGutterIconPath || $config.hintGutterIconColor, 'H'));
    } else if ($config.gutterIconSet === 'emoji') {
      gutter.errorIconPath = this.vscodeUtils.svgToUri(this.createEmojiIcon($config.gutterEmoji.error));
      gutter.errorIconPathLight = this.vscodeUtils.svgToUri(this.createEmojiIcon($config.gutterEmoji.error));
      gutter.warningIconPath = this.vscodeUtils.svgToUri(this.createEmojiIcon($config.gutterEmoji.warning));
      gutter.warningIconPathLight = this.vscodeUtils.svgToUri(this.createEmojiIcon($config.gutterEmoji.warning));
      gutter.infoIconPath = this.vscodeUtils.svgToUri(this.createEmojiIcon($config.gutterEmoji.info));
      gutter.infoIconPathLight = this.vscodeUtils.svgToUri(this.createEmojiIcon($config.gutterEmoji.info));
      gutter.hintIconPath = this.vscodeUtils.svgToUri(this.createEmojiIcon($config.gutterEmoji.hint));
      gutter.hintIconPathLight = this.vscodeUtils.svgToUri(this.createEmojiIcon($config.gutterEmoji.hint));
    } else {
      gutter.errorIconPath = extensionContext.asAbsolutePath(`./img/${gutter.iconSet}/error-dark.svg`);
      gutter.errorIconPathLight = extensionContext.asAbsolutePath(`./img/${gutter.iconSet}/error-light.svg`);
      gutter.warningIconPath = extensionContext.asAbsolutePath(`./img/${gutter.iconSet}/warning-dark.svg`);
      gutter.warningIconPathLight = extensionContext.asAbsolutePath(`./img/${gutter.iconSet}/warning-light.svg`);
      gutter.infoIconPath = extensionContext.asAbsolutePath(`./img/${gutter.iconSet}/info-dark.svg`);
      gutter.infoIconPathLight = extensionContext.asAbsolutePath(`./img/${gutter.iconSet}/info-light.svg`);
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
  
    editor.setDecorations(this.decorations.decorationTypes.gutterError, decorationOptionsGutterError);
    editor.setDecorations(this.decorations.decorationTypes.gutterWarning, decorationOptionsGutterWarning);
    editor.setDecorations(this.decorations.decorationTypes.gutterInfo, decorationOptionsGutterInfo);
    editor.setDecorations(this.decorations.decorationTypes.gutterHint, decorationOptionsGutterHint);
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
