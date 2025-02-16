// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { flawuldragonNotes } from './flawuldragon_notes';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "Flawuldragon" is now active!');

	// comando de testes
	let commandtest = vscode.commands.registerCommand("flawuldragon.helloWorld", () => {
		vscode.window.showInformationMessage("Hello World from next - a test function");
	});
	
	// flawuldragon notes
	flawuldragonNotes(context);
	let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	statusBarItem.text = "$(flawuldragon-badge) Notes";
	statusBarItem.show();
	statusBarItem.tooltip = "The Flawuldragon's Notes";
	statusBarItem.command = "flawuldragon.notes";
	statusBarItem.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
	// statusBarItems
	context.subscriptions.push(statusBarItem);

	// commands
	context.subscriptions.push(commandtest);
}

// This method is called when your extension is deactivated
export function deactivate() {}
