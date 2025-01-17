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
exports.ELDecorationsAlign = void 0;
const vscode = __importStar(require("vscode"));
const ELExtUtils_ac_js_1 = require("./ELExtUtils.ac.js");
// decorations/align.ts
class ELDecorationsAlign {
    getMarginForAlignment({ start, end, message, minimumMargin, visualLineLength }) {
        let margin = 0;
        if (start) {
            margin = start <= visualLineLength ? 0 : start - visualLineLength;
        }
        else if (end) {
            const charDiff = end - message.length - visualLineLength;
            margin = charDiff < 0 ? 0 : charDiff;
        }
        return margin < minimumMargin ? minimumMargin : margin;
    }
    getStyleForAlignment({ isMultilineDecoration, alignmentKind, textLine, indentSize, indentStyle, minVisualLineLength, minimumMargin, problemMessage, start, end }) {
        let range;
        let styleStr = '';
        const visualLineLength = ELExtUtils_ac_js_1.ELExtUtils.prototype.getVisualLineLength(textLine, indentSize, indentStyle);
        let marginChar = minimumMargin + minVisualLineLength - visualLineLength;
        if (isMultilineDecoration) {
            // TODO: implement alignment for multiline decoration
        }
        else {
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
            range = new vscode.Range(textLine.range.start, textLine.range.start);
            styleStr = `position:fixed;left:${marginChar + visualLineLength}ch;padding:0;margin:0`;
        }
        else {
            range = new vscode.Range(textLine.range.start.line, textLine.range.end.character, textLine.range.start.line, textLine.range.end.character);
            styleStr = `margin:0 0 0 ${marginChar >= 0 ? marginChar : 0}ch`;
        }
        return {
            range,
            styleStr,
        };
    }
}
exports.ELDecorationsAlign = ELDecorationsAlign;
