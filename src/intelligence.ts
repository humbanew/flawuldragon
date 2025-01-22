import * as vscode from 'vscode';

class VExtensionIntelligence {
  public disableExtensions(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Disabling duplicated extensions...');
    vscode.commands.executeCommand('workbench.extensions.action.disableExtension', 'formulahendry.auto-close-tag');
    // formulahendry.auto-close-tag
  }

  public enableExtensions(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Enabling extensions...');
    vscode.commands.executeCommand('workbench.extensions.action.enableExtension', 'formulahendry.auto-close-tag');
  }
}
