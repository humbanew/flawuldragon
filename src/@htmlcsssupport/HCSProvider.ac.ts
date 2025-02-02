import * as vscode from "vscode";
import { HCSPsrStyleType } from "./enums";
import { HCSPsrStyle } from "./declares";
import { HCSParser } from "./HCSParser.ac.js";
import { HCSSettings } from "./HCSSettings.ac.js";

export class HCSProvider implements vscode.CompletionItemProvider, vscode.DefinitionProvider {
  public start = new vscode.Position(0, 0);
  public cache = new Map<string, HCSPsrStyle[]>();

  private get isRemote() {
    return /^https?:\/\//i;
  }

  private get wordRange() {
    return /[_a-zA-Z0-9-]+/;
  }

  private get canComplete() {
    return /(id|class|className|[.#])\s*[=:]?\s*(["'])(?:.(?!\2))*$/is;
  }

  private async fetch(url: string) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return res.text();
      }
      throw new Error(res.statusText);
    } catch (error) {
      vscode.window.showErrorMessage(`Fetching ${url} failed. ${error}`);
    }
    return "";
  }

  private async getRemote(name: string) {
    let styles = this.cache.get(name);
    if (!styles) {
      const content = await this.fetch(name);
      styles = HCSParser.prototype.parse(content);
      this.cache.set(name, styles);
    }
    return styles;
  }

  private async getLocal(uri: vscode.Uri) {
    const name = uri.toString();
    let styles = this.cache.get(name);
    if (!styles) {
      const content = await vscode.workspace.fs.readFile(uri);
      styles = HCSParser.prototype.parse(content.toString());
      this.cache.set(name, styles);
    }
    return styles;
  }

  private getRelativePattern(folder: vscode.WorkspaceFolder, glob: string) {
    return new vscode.RelativePattern(folder, glob);
  }

  private async getStyles(document: vscode.TextDocument) {
    const styles = new Map<string, HCSPsrStyle[]>();
    const folder = vscode.workspace.getWorkspaceFolder(document.uri);
    const globs = HCSSettings.prototype.getStyleSheets(document);

    for (const glob of globs) {
      if (this.isRemote.test(glob)) {
        styles.set(glob, await this.getRemote(glob));
      } else if (folder) {
        const files = await vscode.workspace.findFiles(
          this.getRelativePattern(folder, glob)
        );
        for (const file of files) {
          styles.set(file.toString(), await this.getLocal(file));
        }
      }
    }
    styles.set(document.uri.toString(), HCSParser.prototype.parse(document.getText()));
    return styles;
  }

  private async getCompletionMap(document: vscode.TextDocument, type: HCSPsrStyleType) {
    const map = new Map<string, vscode.CompletionItem>();
    const styles = await this.getStyles(document);

    for (const value of styles.values()) {
      for (const style of value) {
        if (style.type === type) {
          const item = new vscode.CompletionItem(
            style.selector,
            style.type === HCSPsrStyleType.ID
              ? vscode.CompletionItemKind.Value
              : vscode.CompletionItemKind.Enum
          );
          map.set(style.selector, item);
        }
      }
    }
    return map;
  }

  private async getCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    type: HCSPsrStyleType
  ) {
    const range = document.getWordRangeAtPosition(position, this.wordRange);
    const map = await this.getCompletionMap(document, type);
    const items = [];

    for (const item of map.values()) {
      item.range = range;
      items.push(item);
    }
    return items;
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
    const range = new vscode.Range(this.start, position);
    const text = document.getText(range);
    const match = this.canComplete.exec(text);

    return new Promise((resolve, reject) =>
      match && !token.isCancellationRequested
        ? resolve(
            this.getCompletionItems(
              document,
              position,
              match[1] === "id" ? HCSPsrStyleType.ID : HCSPsrStyleType.CLASS
            )
          )
        : reject()
    );
  }

  private async getDefinitions(document: vscode.TextDocument, position: vscode.Position) {
    const range = document.getWordRangeAtPosition(position, this.wordRange);
    const styles = await this.getStyles(document);
    const selector = document.getText(range);
    const locations: vscode.Location[] = [];

    for (const entry of styles) {
      if (!this.isRemote.test(entry[0])) {
        entry[1]
          .filter((style) => style.selector === selector)
          .forEach((style) =>
            locations.push(
              new vscode.Location(
                vscode.Uri.parse(entry[0]),
                new vscode.Position(style.line, style.col)
              )
            )
          );
      }
    }
    return locations;
  }

  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {
    const range = new vscode.Range(this.start, position);
    const text = document.getText(range);
    const match = this.canComplete.exec(text);

    return new Promise((resolve, reject) =>
      match && !token.isCancellationRequested
        ? resolve(this.getDefinitions(document, position))
        : reject()
    );
  }

  async validate(document: vscode.TextDocument) {
    const findSelector = /([^(\[{}\])\s]+)(?![^(\[{]*[}\])])/gi;
    const findAttribute = /(class|className)\s*[=:]\s*(["'])(.*?)\2/gis;
    const diagnostics: vscode.Diagnostic[] = [];
    const map = await this.getCompletionMap(document, HCSPsrStyleType.CLASS);
    const text = document.getText();

    let attribute, offset, value, anchor, end, start;

    while ((attribute = findAttribute.exec(text))) {
      offset =
        findAttribute.lastIndex -
        attribute[3].length +
        attribute[3].indexOf(attribute[2]);

      while ((value = findSelector.exec(attribute[3]))) {
        if (!map.has(value[1])) {
          anchor = findSelector.lastIndex + offset;
          end = document.positionAt(anchor);
          start = document.positionAt(anchor - value[1].length);

          diagnostics.push(
            new vscode.Diagnostic(
              new vscode.Range(start, end),
              `CSS selector '${value[1]}' not found.`,
              vscode.DiagnosticSeverity.Warning
            )
          );
        }
      }
    }
    return diagnostics;
  }
  
  public clear() {
    vscode.window.showInformationMessage(`Style sheets cache cleared: ${this.cache.size}`);
    this.cache.clear();
  }
  
  public invalidate(name: string) {
    this.cache.delete(name);
  }
}
