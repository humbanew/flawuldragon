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
exports.BracketGuides = void 0;
const vscode = __importStar(require("vscode"));
const constants_js_1 = require("../constants.js");
class BracketGuides {
    bracketGuides_activate(context) {
        try {
            console.log('Flawuldragon - Toggle Bracket Guides is now active!');
            let disposable = vscode.commands.registerCommand(constants_js_1.constants.commands.bracketguides.release.fdBracketGuides, () => {
                const config = vscode.workspace.getConfiguration();
                const currentValue = config.get('editor.guides.bracketPairs');
                let newValue;
                let message;
                if (currentValue === true) {
                    newValue = 'active';
                    message = 'Bracket pairs guides set to active!';
                }
                else if (currentValue === 'active') {
                    newValue = false;
                    message = 'Bracket pairs guides disabled!';
                }
                else {
                    newValue = true;
                    message = 'Bracket pairs guides enabled!';
                }
                // Update the setting
                config.update('editor.guides.bracketPairs', newValue, vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage(message);
            });
            context.subscriptions.push(disposable);
        }
        catch (error) {
            console.error("Flawuldragon - Bracket Guides error: " + error);
            vscode.window.showErrorMessage("An error occurred while activating the bracket guides integration feature: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
            this.bracketGuides_desactivate();
        }
        finally { }
    }
    bracketGuides_desactivate() {
        console.log('Flawuldragon - Toggle Bracket Guides is now inactive!');
    }
}
exports.BracketGuides = BracketGuides;
