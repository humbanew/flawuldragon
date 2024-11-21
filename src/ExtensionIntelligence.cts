import * as vscode from "vscode";

interface ExtensionIncorporatedList {
  "ColorHighlight": null;
  "DateTime": null;
  "FileSize": null;
  "IndentRainbow": null;
  "JetbrainsIcons": null;
  "JetbrainsMono": null;
  "TodoHighlight": null;
}

export class ExtensionIntelligence {

  private duplicateExtensions: string[] = [];

  public activeIntelligence() {
    // get a list of extensions
    const extensions = vscode.extensions.all;
    this.duplicateExtensions;
  }

  public desactiveIntelligence(extensions: string[]) {
    // reinstall the extensions
    extensions.forEach((extension) => {
      vscode.commands.executeCommand("workbench.extensions.installExtension", extension); 
    });
  }

}
