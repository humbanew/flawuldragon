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
exports.BracketPairColorizer = void 0;
const vscode = __importStar(require("vscode"));
class BracketPairColorizer {
    bracketPairColorizer_activate(context) {
        console.log('Flawuldragon - Bracket Pair Colorizer activated!');
        let disposable = vscode.commands.registerCommand('flawuldragon.bracket-pair-toggler.run', () => {
            const workspaceConfiguration = vscode.workspace.getConfiguration('editor.bracketPairColorization');
            const isEnabled = workspaceConfiguration.get('enabled');
            if (isEnabled === undefined) {
                const message = `Bracket Pair Colorization setting was not found`;
                return vscode.window.showErrorMessage(message);
            }
            workspaceConfiguration
                .update('enabled', !isEnabled, vscode.ConfigurationTarget.Global)
                .then(() => {
                const message = `Bracket Pair Colorization is ${!isEnabled ? 'enabled' : 'disabled'}`;
                vscode.window.showInformationMessage(message);
            }, () => {
                const message = `Error toggling Bracket Pair Colorization`;
                vscode.window.showErrorMessage(message);
            });
        });
        context.subscriptions.push(disposable);
    }
    bracketPairColorizer_desactivate() {
        console.log('Bracket Pair Colorizer deactivated!');
    }
}
exports.BracketPairColorizer = BracketPairColorizer;
