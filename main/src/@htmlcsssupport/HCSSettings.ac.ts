import * as vscode from "vscode";
import Path from "path";
import { HCSSetAutoValidation } from './enums';

export class HCSSettings {
  public getEnabledLanguages(): string[] {
    return vscode.workspace
      .getConfiguration("fd.css")
      .get<string[]>("enabledLanguages", ["html"]);
  }
  
  public getStyleSheets(scope: vscode.TextDocument): string[] {
    const path = Path.parse(scope.fileName);
  
    return vscode.workspace
      .getConfiguration("fd.css", scope)
      .get<string[]>("styleSheets", [])
      .map((glob) =>
        glob.replace(
          /\$\s*{\s*(fileBasenameNoExtension|fileBasename|fileExtname)\s*}/g,
          (match, variable) =>
            variable === "fileBasename"
              ? path.base
              : variable === "fileExtname"
              ? path.ext
              : path.name
        )
      );
  }
  
  public getAutoValidation(scope: vscode.TextDocument): HCSSetAutoValidation {
    return vscode.workspace
      .getConfiguration("fd.css", scope)
      .get<HCSSetAutoValidation>("autoValidation", HCSSetAutoValidation.NEVER);
  }
}
