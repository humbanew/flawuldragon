import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { fdDefinicoes } from "../definicoes";

export function flawuldragonNotes(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand(fdDefinicoes.comandoFlawuldragonNotes, () => {
    let notes = vscode.window.createWebviewPanel("flawuldragon", "Flawuldragon Notes", vscode.ViewColumn.One, { enableForms: true, enableScripts: true });
    notes.title = 'Flawuldragon Notes';
    notes.iconPath = vscode.Uri.file(
      path.join(__dirname, '../', 'assets', 'icon.png')
    );
    notes.webview.html = fs
      .readFileSync(
        path.join(__dirname, '../', 'assets', 'pages', 'flawuldragon.html')
      )
      .toString();
    context.subscriptions.push(notes);
    return 0;
  });

	// flawuldragon notes
	let statusBarItem = fdDefinicoes.posicaoStatusBarItemFlawuldragonNotes;
	statusBarItem.text = "$(flawuldragon-badge) Notes";
	statusBarItem.show();
	statusBarItem.tooltip = "The Flawuldragon's Notes";
	statusBarItem.command = fdDefinicoes.comandoFlawuldragonNotes;
	statusBarItem.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
	// statusBarItems
	context.subscriptions.push(statusBarItem);
}
