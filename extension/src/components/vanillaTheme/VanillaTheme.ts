/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as vscode from "vscode";
import { Global } from "../globalDefs";
import {
  TFDDynamicThemeConfig,
  TFDVTHighlight,
  TFDVTTheme,
  VscodeColorTheme,
} from "./defines";
import { readFileSync, writeFileSync } from "fs";
import {
  HIGHLIGHT_BLULOCO,
  HIGHLIGHT_DRACULA,
  HIGHLIGHT_MONOKAI,
  HIGHLIGHT_ONE_DARK,
  HIGHLIGHT_ICEBERG,
  HIGHLIGHT_VISUAL_STUDIO_CODE,
  SEMANTIC_TOKEN_COLORS,
  THEME_ADVANCED_CIRCUITS,
  THEME_BLUEPRINT_PAPER,
  THEME_CAPPUCCINO,
  THEME_HUMBA01_DESIGN_STYLE,
  THEME_MIDNIGHT,
  THEME_RED_VELVET,
  THEME_SUNSHINE,
  THEME_WINTER_DAY,
} from "./constants";

export class FDVanillaTheme {
  protected themeStatusBar: vscode.StatusBarItem =
    Global.vanilla.dynamicTheme.statusBar.theme;
  protected highlightThemeStatusBar: vscode.StatusBarItem =
    Global.vanilla.dynamicTheme.statusBar.highlight;
  protected static JSONPath =
    __dirname.split("\\").slice(0, -1).join("\\") +
    "\\themes\\appearance\\dynamic-color-theme.json";
  protected static actualConfig = JSON.parse(
    readFileSync(__dirname + "/themeConfig.json", "utf-8")
  );
  protected static actualJSON: VscodeColorTheme = JSON.parse(
    readFileSync(FDVanillaTheme.JSONPath, "utf-8")
  );

  protected configThemeStatusBar() {
    vscode.window
      .showQuickPick([
        "Advanced Circuits",
        "Blueprint Paper",
        "Humba01 Design Style",
        "Winter Day",
        "Cappuccino",
        "Red Velvet",
        "Sunshine",
        "Midnight",
      ])
      .then((selectedTheme) => {
        if (selectedTheme) {
          let actualTheme = selectedTheme as TFDVTTheme;
          this.updateJSONThemeFile(actualTheme, undefined);
        }
      });
  }

  protected configHighlightStatusBar() {
    vscode.window
      .showQuickPick([
        "Visual Studio Code",
        "Monokai",
        "Bluloco",
        "Dracula",
        "One Dark",
        "Iceberg",
      ])
      .then((selectedHighlight) => {
        if (selectedHighlight) {
          let actualHighlight = selectedHighlight as TFDVTHighlight;
          this.updateJSONThemeFile(undefined, actualHighlight);
        }
      });
  }

  // NOTE: This function is a placeholder for updating the JSON theme file.
  protected updateJSONThemeFile(
    theme?: TFDVTTheme,
    highlight?: TFDVTHighlight
  ) {
    // Implementation goes here
    FDVanillaTheme.actualJSON.name = "Flawuldragon Dynamic Theme";
    FDVanillaTheme.actualJSON.type = "dark";
    FDVanillaTheme.actualJSON.semanticHighlighting = true;
    FDVanillaTheme.actualJSON.semanticTokenColors = SEMANTIC_TOKEN_COLORS();

    vscode.window.showWarningMessage(
      'The options of theme and highlight will only be applied if the "Flawuldragon Dynamic Theme" is selected as the current theme. Please select it to see the changes applied.'
    );

    switch (theme) {
      case "Advanced Circuits":
        FDVanillaTheme.actualJSON.colors = THEME_ADVANCED_CIRCUITS();
        break;
      case "Blueprint Paper":
        FDVanillaTheme.actualJSON.colors = THEME_BLUEPRINT_PAPER();
        break;
      case "Humba01 Design Style":
        FDVanillaTheme.actualJSON.colors = THEME_HUMBA01_DESIGN_STYLE();
        break;
      case "Winter Day":
        FDVanillaTheme.actualJSON.colors = THEME_WINTER_DAY();
        break;
      case "Cappuccino":
        FDVanillaTheme.actualJSON.colors = THEME_CAPPUCCINO();
        break;
      case "Red Velvet":
        FDVanillaTheme.actualJSON.colors = THEME_RED_VELVET();
        break;
      case "Sunshine":
        FDVanillaTheme.actualJSON.colors = THEME_SUNSHINE();
        break;
      case "Midnight":
        FDVanillaTheme.actualJSON.colors = THEME_MIDNIGHT();
        break;
      case undefined:
        break;
    }
    switch (highlight) {
      case "Visual Studio Code":
        FDVanillaTheme.actualJSON.tokenColors = HIGHLIGHT_VISUAL_STUDIO_CODE();
        break;
      case "Monokai":
        FDVanillaTheme.actualJSON.tokenColors = HIGHLIGHT_MONOKAI();
        break;
      case "Bluloco":
        FDVanillaTheme.actualJSON.tokenColors = HIGHLIGHT_BLULOCO();
        break;
      case "Dracula":
        FDVanillaTheme.actualJSON.tokenColors = HIGHLIGHT_DRACULA();
        break;
      case "One Dark":
        FDVanillaTheme.actualJSON.tokenColors = HIGHLIGHT_ONE_DARK();
        break;
      case "Iceberg":
        FDVanillaTheme.actualJSON.tokenColors = HIGHLIGHT_ICEBERG();
        break;
      case undefined:
        break;
    }

    if (theme) {
      FDVanillaTheme.actualConfig["actual-theme"] = theme;
    }
    if (highlight) {
      FDVanillaTheme.actualConfig["actual-highlight"] = highlight;
    }

    writeFileSync(
      FDVanillaTheme.JSONPath,
      JSON.stringify(FDVanillaTheme.actualJSON, null, 2),
      "utf-8"
    );

    writeFileSync(
      __dirname + "/themeConfig.json",
      JSON.stringify(FDVanillaTheme.actualConfig, null, 2),
      "utf-8"
    );

    vscode.commands.executeCommand('workbench.action.reloadWindow');
  }

  protected statusBarItens(): void {
    // Status bar for dynamic theme switching
    this.themeStatusBar.command =
      Global.vanilla.dynamicTheme.comandos["dynamic-theme"];
    this.themeStatusBar.color = "gold";
    this.themeStatusBar.text = "TH";
    this.themeStatusBar.tooltip = "Switch Editor Theme";
    this.highlightThemeStatusBar.show();

    // Status bar for dynamic highlight switching
    this.highlightThemeStatusBar.command =
      Global.vanilla.dynamicTheme.comandos["dynamic-highlight"];
    this.highlightThemeStatusBar.color = "gold";
    this.highlightThemeStatusBar.text = "HL";
    this.highlightThemeStatusBar.tooltip = "Switch Editor Highlight";
    this.themeStatusBar.show();
  }

  public activate(context: vscode.ExtensionContext) {
    try {
      this.statusBarItens();

      let switchThemeCommand = vscode.commands.registerCommand(
        Global.vanilla.dynamicTheme.comandos["dynamic-theme"],
        () => this.configThemeStatusBar()
      );
      let switchHighlightCommand = vscode.commands.registerCommand(
        Global.vanilla.dynamicTheme.comandos["dynamic-highlight"],
        () => this.configHighlightStatusBar()
      );
      context.subscriptions.push(switchThemeCommand, switchHighlightCommand);
    } catch (error) {
      this.deactivate();
      console.error("Flawuldragon vanilla themes error: " + error);
      vscode.window.showErrorMessage(
        "An error occurred while activating the Flawuldragon vanilla themes: " +
          error +
          ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)"
      );
    } finally {
    }
  }

  public deactivate() {
    this.themeStatusBar?.dispose();
    this.highlightThemeStatusBar?.dispose();
  }
}
