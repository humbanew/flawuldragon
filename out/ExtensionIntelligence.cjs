"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionIntelligence = void 0;
const vscode = require("vscode");
class ExtensionIntelligence {
    duplicateExtensions = [];
    activeIntelligence() {
        // get a list of extensions
        const extensions = vscode.extensions.all;
        this.duplicateExtensions;
    }
    desactiveIntelligence(extensions) {
        // reinstall the extensions
        extensions.forEach((extension) => {
            vscode.commands.executeCommand("workbench.extensions.installExtension", extension);
        });
    }
}
exports.ExtensionIntelligence = ExtensionIntelligence;
