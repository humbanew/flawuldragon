/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { FDVanilla } from './components/vanilla/Vanilla';
import { FDAutoRCCTag } from './components/autorcctag/AutoRCCTag';
import { FDBracketGuides } from './components/bracketguides/BracketGuides';
import { activate as chActivate, deactivate as chDeactivate } from './components/colorhighlight/main';

// variáveis
const vanilla = new FDVanilla();
const autoCloseCompleteRenameTag = new FDAutoRCCTag();
const bracketguides = new FDBracketGuides();
const colorHightlight = {
	activate: chActivate,
	deactivate: chDeactivate
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	try {
		console.log('Congratulations, your extension "Flawuldragon" is now active!');

		// componentes
		vanilla.activate(context);
		autoCloseCompleteRenameTag.activate(context);
		bracketguides.activate(context);
		colorHightlight.activate(context);

		// comando de testes
		// comando de depuração
		let commandtest = vscode.commands.registerCommand("flawuldragon.helloWorld", () => {
			vscode.window.showInformationMessage("Hello World from next - a test function");
		});
		context.subscriptions.push(commandtest);
	} catch (error) {
		console.log('Flawuldragon Core Hub - Error: ' + error);
		vscode.window.showErrorMessage(
			'An error occurred while activating the Flawuldragon core hub: ' +
			error +
			'. Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)'
		);
		deactivate();
	}
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log("Flawuldragon deactivated!");
	vanilla.deactivate();
	autoCloseCompleteRenameTag.desactivate();
	bracketguides.desactivate();
	colorHightlight.deactivate();
}
