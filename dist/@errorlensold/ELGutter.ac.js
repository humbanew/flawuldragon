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
exports.ELGutter = void 0;
const vscode = __importStar(require("vscode"));
const ELDecorations_ac_js_1 = require("./ELDecorations.ac.js");
const ELVSCodeUtils_ac_js_1 = require("./ELVSCodeUtils.ac.js");
const ErrorLens_js_1 = require("./ErrorLens.js");
// gutter.ts
class ELGutter {
    decorations = new ELDecorations_ac_js_1.ELDecorations;
    vscodeUtils = new ELVSCodeUtils_ac_js_1.ELVSCodeUtils;
    fontFamily = '';
    /**
     * Set some defaults for gutter styles and return it.
     */
    getGutterStyles(extensionContext) {
        const gutter = {};
        gutter.iconSet = ErrorLens_js_1.$config.gutterIconSet;
        if (ErrorLens_js_1.$config.gutterIconSet === 'circle') {
            gutter.errorIconPath = this.vscodeUtils.svgToUri(this.createCircleIcon(ErrorLens_js_1.$config.errorGutterIconColor));
            gutter.errorIconPathLight = this.vscodeUtils.svgToUri(this.createCircleIcon(ErrorLens_js_1.$config.light.errorGutterIconColor || ErrorLens_js_1.$config.errorGutterIconColor));
            gutter.warningIconPath = this.vscodeUtils.svgToUri(this.createCircleIcon(ErrorLens_js_1.$config.warningGutterIconColor));
            gutter.warningIconPathLight = this.vscodeUtils.svgToUri(this.createCircleIcon(ErrorLens_js_1.$config.light.warningGutterIconColor || ErrorLens_js_1.$config.warningGutterIconColor));
            gutter.infoIconPath = this.vscodeUtils.svgToUri(this.createCircleIcon(ErrorLens_js_1.$config.infoGutterIconColor));
            gutter.infoIconPathLight = this.vscodeUtils.svgToUri(this.createCircleIcon(ErrorLens_js_1.$config.light.infoGutterIconColor || ErrorLens_js_1.$config.infoGutterIconColor));
            gutter.hintIconPath = this.vscodeUtils.svgToUri(this.createCircleIcon(ErrorLens_js_1.$config.hintGutterIconColor));
            gutter.hintIconPathLight = this.vscodeUtils.svgToUri(this.createCircleIcon(ErrorLens_js_1.$config.light.hintGutterIconPath || ErrorLens_js_1.$config.hintGutterIconColor));
        }
        else if (ErrorLens_js_1.$config.gutterIconSet === 'square') {
            gutter.errorIconPath = this.vscodeUtils.svgToUri(this.createSquareIcon(ErrorLens_js_1.$config.errorGutterIconColor));
            gutter.errorIconPathLight = this.vscodeUtils.svgToUri(this.createSquareIcon(ErrorLens_js_1.$config.light.errorGutterIconColor || ErrorLens_js_1.$config.errorGutterIconColor));
            gutter.warningIconPath = this.vscodeUtils.svgToUri(this.createSquareIcon(ErrorLens_js_1.$config.warningGutterIconColor));
            gutter.warningIconPathLight = this.vscodeUtils.svgToUri(this.createSquareIcon(ErrorLens_js_1.$config.light.warningGutterIconColor || ErrorLens_js_1.$config.warningGutterIconColor));
            gutter.infoIconPath = this.vscodeUtils.svgToUri(this.createSquareIcon(ErrorLens_js_1.$config.infoGutterIconColor));
            gutter.infoIconPathLight = this.vscodeUtils.svgToUri(this.createSquareIcon(ErrorLens_js_1.$config.light.infoGutterIconColor || ErrorLens_js_1.$config.infoGutterIconColor));
            gutter.hintIconPath = this.vscodeUtils.svgToUri(this.createSquareIcon(ErrorLens_js_1.$config.hintGutterIconColor));
            gutter.hintIconPathLight = this.vscodeUtils.svgToUri(this.createSquareIcon(ErrorLens_js_1.$config.light.hintGutterIconPath || ErrorLens_js_1.$config.hintGutterIconColor));
        }
        else if (ErrorLens_js_1.$config.gutterIconSet === 'squareRounded') {
            gutter.errorIconPath = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon(ErrorLens_js_1.$config.errorGutterIconColor));
            gutter.errorIconPathLight = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon(ErrorLens_js_1.$config.light.errorGutterIconColor || ErrorLens_js_1.$config.errorGutterIconColor));
            gutter.warningIconPath = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon(ErrorLens_js_1.$config.warningGutterIconColor));
            gutter.warningIconPathLight = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon(ErrorLens_js_1.$config.light.warningGutterIconColor || ErrorLens_js_1.$config.warningGutterIconColor));
            gutter.infoIconPath = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon(ErrorLens_js_1.$config.infoGutterIconColor));
            gutter.infoIconPathLight = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon(ErrorLens_js_1.$config.light.infoGutterIconColor || ErrorLens_js_1.$config.infoGutterIconColor));
            gutter.hintIconPath = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon(ErrorLens_js_1.$config.hintGutterIconColor));
            gutter.hintIconPathLight = this.vscodeUtils.svgToUri(this.createSquareRoundedIcon(ErrorLens_js_1.$config.light.hintGutterIconPath || ErrorLens_js_1.$config.hintGutterIconColor));
        }
        else if (ErrorLens_js_1.$config.gutterIconSet === 'letter') {
            gutter.errorIconPath = this.vscodeUtils.svgToUri(this.createLetterIcon(ErrorLens_js_1.$config.errorGutterIconColor, 'E'));
            gutter.errorIconPathLight = this.vscodeUtils.svgToUri(this.createLetterIcon(ErrorLens_js_1.$config.light.errorGutterIconColor || ErrorLens_js_1.$config.errorGutterIconColor, 'E'));
            gutter.warningIconPath = this.vscodeUtils.svgToUri(this.createLetterIcon(ErrorLens_js_1.$config.warningGutterIconColor, 'W'));
            gutter.warningIconPathLight = this.vscodeUtils.svgToUri(this.createLetterIcon(ErrorLens_js_1.$config.light.warningGutterIconColor || ErrorLens_js_1.$config.warningGutterIconColor, 'W'));
            gutter.infoIconPath = this.vscodeUtils.svgToUri(this.createLetterIcon(ErrorLens_js_1.$config.infoGutterIconColor, 'I'));
            gutter.infoIconPathLight = this.vscodeUtils.svgToUri(this.createLetterIcon(ErrorLens_js_1.$config.light.infoGutterIconColor || ErrorLens_js_1.$config.infoGutterIconColor, 'I'));
            gutter.hintIconPath = this.vscodeUtils.svgToUri(this.createLetterIcon(ErrorLens_js_1.$config.hintGutterIconColor, 'H'));
            gutter.hintIconPathLight = this.vscodeUtils.svgToUri(this.createLetterIcon(ErrorLens_js_1.$config.light.hintGutterIconPath || ErrorLens_js_1.$config.hintGutterIconColor, 'H'));
        }
        else if (ErrorLens_js_1.$config.gutterIconSet === 'emoji') {
            gutter.errorIconPath = this.vscodeUtils.svgToUri(this.createEmojiIcon(ErrorLens_js_1.$config.gutterEmoji.error));
            gutter.errorIconPathLight = this.vscodeUtils.svgToUri(this.createEmojiIcon(ErrorLens_js_1.$config.gutterEmoji.error));
            gutter.warningIconPath = this.vscodeUtils.svgToUri(this.createEmojiIcon(ErrorLens_js_1.$config.gutterEmoji.warning));
            gutter.warningIconPathLight = this.vscodeUtils.svgToUri(this.createEmojiIcon(ErrorLens_js_1.$config.gutterEmoji.warning));
            gutter.infoIconPath = this.vscodeUtils.svgToUri(this.createEmojiIcon(ErrorLens_js_1.$config.gutterEmoji.info));
            gutter.infoIconPathLight = this.vscodeUtils.svgToUri(this.createEmojiIcon(ErrorLens_js_1.$config.gutterEmoji.info));
            gutter.hintIconPath = this.vscodeUtils.svgToUri(this.createEmojiIcon(ErrorLens_js_1.$config.gutterEmoji.hint));
            gutter.hintIconPathLight = this.vscodeUtils.svgToUri(this.createEmojiIcon(ErrorLens_js_1.$config.gutterEmoji.hint));
        }
        else {
            gutter.errorIconPath = extensionContext.asAbsolutePath(`../../assets/errorLens/${gutter.iconSet}/error-dark.svg`);
            gutter.errorIconPathLight = extensionContext.asAbsolutePath(`../../assets/errorLens/${gutter.iconSet}/error-light.svg`);
            gutter.warningIconPath = extensionContext.asAbsolutePath(`../../assets/errorLens/${gutter.iconSet}/warning-dark.svg`);
            gutter.warningIconPathLight = extensionContext.asAbsolutePath(`../../assets/errorLens/${gutter.iconSet}/warning-light.svg`);
            gutter.infoIconPath = extensionContext.asAbsolutePath(`../../assets/errorLens/${gutter.iconSet}/info-dark.svg`);
            gutter.infoIconPathLight = extensionContext.asAbsolutePath(`../../assets/errorLens/${gutter.iconSet}/info-light.svg`);
        }
        // ──── User specified custom gutter path ─────────────────────
        if (ErrorLens_js_1.$config.errorGutterIconPath) {
            gutter.errorIconPath = ErrorLens_js_1.$config.errorGutterIconPath;
        }
        if (ErrorLens_js_1.$config.light.errorGutterIconPath || ErrorLens_js_1.$config.errorGutterIconPath) {
            gutter.errorIconPathLight = ErrorLens_js_1.$config.light.errorGutterIconPath || ErrorLens_js_1.$config.errorGutterIconPath;
        }
        if (ErrorLens_js_1.$config.warningGutterIconPath) {
            gutter.warningIconPath = ErrorLens_js_1.$config.warningGutterIconPath;
        }
        if (ErrorLens_js_1.$config.light.warningGutterIconPath || ErrorLens_js_1.$config.warningGutterIconPath) {
            gutter.warningIconPathLight = ErrorLens_js_1.$config.light.warningGutterIconColor || ErrorLens_js_1.$config.warningGutterIconPath;
        }
        if (ErrorLens_js_1.$config.infoGutterIconPath) {
            gutter.infoIconPath = ErrorLens_js_1.$config.infoGutterIconPath;
        }
        if (ErrorLens_js_1.$config.light.infoGutterIconPath || ErrorLens_js_1.$config.infoGutterIconPath) {
            gutter.infoIconPathLight = ErrorLens_js_1.$config.light.infoGutterIconColor || ErrorLens_js_1.$config.infoGutterIconPath;
        }
        if (ErrorLens_js_1.$config.hintGutterIconPath) {
            gutter.hintIconPath = ErrorLens_js_1.$config.hintGutterIconPath;
        }
        if (ErrorLens_js_1.$config.light.hintGutterIconPath || ErrorLens_js_1.$config.hintGutterIconPath) {
            gutter.hintIconPathLight = ErrorLens_js_1.$config.light.hintGutterIconColor || ErrorLens_js_1.$config.hintGutterIconPath;
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
    doUpdateGutterDecorations(editor, groupedDiagnostics) {
        const decorationOptionsGutterError = [];
        const decorationOptionsGutterWarning = [];
        const decorationOptionsGutterInfo = [];
        const decorationOptionsGutterHint = [];
        for (const key in groupedDiagnostics) {
            const groupedDiagnostic = groupedDiagnostics[key];
            const diagnostic = groupedDiagnostic[0];
            const severity = diagnostic.severity;
            const diagnosticDecorationOptions = {
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
                    if (ErrorLens_js_1.$config.gutterIconSet === 'circle' ||
                        ErrorLens_js_1.$config.gutterIconSet === 'square' ||
                        ErrorLens_js_1.$config.gutterIconSet === 'squareRounded' ||
                        ErrorLens_js_1.$config.gutterIconSet === 'letter' ||
                        ErrorLens_js_1.$config.gutterIconSet === 'emoji') {
                        decorationOptionsGutterHint.push(diagnosticDecorationOptions);
                    }
                    break;
                }
                default: { }
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
    createCircleIcon(color) {
        return `<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30"><circle cx="15" cy="15" r="7" fill="${this.escapeColor(color)}"/></svg>`;
    }
    /**
     * Create square gutter icons with different colors.
     */
    createSquareIcon(color, rx = 0) {
        return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" height="40" width="40"><g transform="translate(12, 12)"><rect width="16" height="16" rx="${rx}" fill="${this.escapeColor(color)}"/></g></svg>`;
    }
    /**
     * Create square gutter icons with rounded corners.
     */
    createSquareRoundedIcon(color) {
        return this.createSquareIcon(color, 3);
    }
    /**
     * Crate centered single letter icon.
     */
    createLetterIcon(color, letter) {
        this.fontFamily = this.fontFamily ? this.fontFamily : vscode.workspace.getConfiguration('editor').get('fontFamily') ?? '';
        return `<svg viewBox="-10 -6 20 10" xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill="${this.escapeColor(color)}"><text font-family="${this.fontFamily}" text-anchor="middle" dominant-baseline="middle">${letter}</text></svg>`;
    }
    createEmojiIcon(emojiSymbol) {
        this.fontFamily = this.fontFamily ? this.fontFamily : vscode.workspace.getConfiguration('editor').get('fontFamily') ?? '';
        return `<svg viewBox="-10 -6 20 10" xmlns='http://www.w3.org/2000/svg' width='16' height='16'><text font-family="${this.fontFamily}" text-anchor="middle" dominant-baseline="middle">${emojiSymbol}</text></svg>`;
    }
    /**
     * `%23` is encoded `#` sign (need it to work).
     */
    escapeColor(color) {
        return `%23${color.slice(1)}`;
    }
}
exports.ELGutter = ELGutter;
