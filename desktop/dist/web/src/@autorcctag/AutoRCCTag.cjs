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
exports.AutoRCCTag = void 0;
const vscode = __importStar(require("vscode"));
const AutoCloseTag_ac_cjs_1 = require("./AutoCloseTag.ac.cjs");
const AutoRenameTag_ac_cjs_1 = require("./AutoRenameTag.ac.cjs");
class AutoRCCTag {
    autoCloseTag = new AutoCloseTag_ac_cjs_1.AutoCloseTag();
    autoRenameTag = new AutoRenameTag_ac_cjs_1.AutoRenameTag();
    autoRCCTag_activate(context) {
        try {
            this.autoCloseTag.activate(context);
            this.autoRenameTag.activate(context);
        }
        catch (error) {
            console.error("Flawuldragon - Auto Rename Close Complete Tag error: " + error);
            vscode.window.showErrorMessage("An error occurred while activating the auto rename close complete tag integration feature: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
            this.autoRCCTag_desactivate();
        }
        finally { }
    }
    autoRCCTag_desactivate() {
        this.autoCloseTag.deactivate();
    }
}
exports.AutoRCCTag = AutoRCCTag;
