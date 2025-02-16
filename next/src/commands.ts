import * as vscode from "vscode";

export function Teste() {
  return vscode.commands.registerCommand("next.helloWorld2", () => {
    vscode.window.showInformationMessage("Hello World from next - a test function");
  });
}
