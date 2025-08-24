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
import { FDErrorLens } from './components/errorlens/ErrorLens';
import { FDFileSize } from './components/filesize/FileSize';
import { FDHtmlCssSupport } from './components/htmlcsssupport/HtmlCssSupport';
import { FDIndentRainbow } from './components/indentrainbow/IndentRainbow';
import { FDCustomFonts } from './components/customfonts/CustomFonts';
import { FDPomodoroClock } from './components/pomodoroclock/PomodoroClock';
import { FDTakeabreak } from './components/takeabreak/Takeabreak';
import { FDThemeSwitch } from './components/themeswitch/ThemeSwitch';
import { FDTodoHighlight } from './components/todohighlight/TodoHighlight';
import { FDVanillaTheme } from './components/vanillaTheme/VanillaTheme';

// variáveis
const vanilla = new FDVanilla();
const vanillaThemes = new FDVanillaTheme();
const autoCloseCompleteRenameTag = new FDAutoRCCTag();
const bracketGuides = new FDBracketGuides();
const colorHightlight = {
	activate: chActivate,
	deactivate: chDeactivate
}
const errorLens = new FDErrorLens();
const filesize = new FDFileSize();
const htmlCssSupport = new FDHtmlCssSupport();
const indentRainbow = new FDIndentRainbow();
const customFonts = new FDCustomFonts();
const pomodoroClock = new FDPomodoroClock();
const takeabreak = new FDTakeabreak();
const themeSwitch = new FDThemeSwitch();
const todoHighlight = new FDTodoHighlight();

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	try {
		console.log('Congratulations, your extension "Flawuldragon" is now active!');

		// componentes
		vanilla.activate(context);
		vanillaThemes.activate(context);
		autoCloseCompleteRenameTag.activate(context);
		bracketGuides.activate(context);
		colorHightlight.activate(context);
		errorLens.activate(context);
		filesize.activate(context);
		htmlCssSupport.activate(context);
		indentRainbow.activate(context);
		customFonts.activate(context);
		customFonts.firstTimeActivation(context);
		pomodoroClock.activate(context);
		takeabreak.activate(context);
		themeSwitch.activate(context);
		todoHighlight.activate(context);

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
		deactivate(context);
	}
}

// This method is called when your extension is deactivated
export function deactivate(context: vscode.ExtensionContext) {
	console.log("Flawuldragon deactivated!");
	vanilla.deactivate();
	vanillaThemes.deactivate();
	autoCloseCompleteRenameTag.desactivate();
	bracketGuides.desactivate();
	colorHightlight.deactivate();
	errorLens.desactivate();
	filesize.desactivate();
	htmlCssSupport.desactivate();
	indentRainbow.desactivate();
	customFonts.desactivate(context);
	pomodoroClock.desactivate();
	takeabreak.desactivate();
	themeSwitch.desactivate();
	todoHighlight.desactivate();
}
