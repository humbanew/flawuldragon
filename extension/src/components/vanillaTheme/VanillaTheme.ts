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
  TFDVTHighlight,
  TFDVTMode,
  TFDVTTheme,
  VscodeColorTheme,
} from "./defines";
import { readFileSync } from "fs";

export class FDVanillaTheme {
  protected modeStatusBar: vscode.StatusBarItem | undefined;
  protected themeStatusBar: vscode.StatusBarItem | undefined;
  protected highlightThemeStatusBar: vscode.StatusBarItem | undefined;
  protected static JSONPath = __dirname.split("\\").slice(0, -1).join("\\") + "\\themes\\appearance\\dynamic-color-theme.json";
  protected static actualTheme: TFDVTTheme;
  protected static actualHighlight: TFDVTHighlight;
  protected static actualMode: TFDVTMode;
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
        "RI Visual Studio",
        "RI Visual Studio Blue",
      ])
      .then((selectedTheme) => {
        if (selectedTheme) {
          FDVanillaTheme.actualTheme = selectedTheme as TFDVTTheme;
          this.updateJSONThemeFile();
        }
      });

    // Status bar for dynamic theme switching
    this.themeStatusBar = Global.vanilla.dynamicTheme.statusBar.theme;
    this.themeStatusBar.command =
      Global.vanilla.dynamicTheme.comandos["dynamic-theme"];
    this.themeStatusBar.color = "gold";
    this.themeStatusBar.text = "TH";
    this.themeStatusBar.tooltip = "Switch Editor Theme";
    this.themeStatusBar.show();
  }

  protected configHighlightStatusBar() {
    vscode.window.showQuickPick([
      "Monokai",
      "Monokai Dimmed",
      "Bluloco",
      "Bluloco Italic",
      "Dracula",
      "Dracula Soft",
      "One Dark",
      "One Dark Vivid",
      "Original",
    ]).then((selectedHighlight) => {
      if (selectedHighlight) {
        FDVanillaTheme.actualHighlight = selectedHighlight as TFDVTHighlight;
        this.updateJSONThemeFile();
      }
    });

    // Status bar for dynamic highlight switching
    this.highlightThemeStatusBar =
      Global.vanilla.dynamicTheme.statusBar.highlight;
    this.highlightThemeStatusBar.command =
      Global.vanilla.dynamicTheme.comandos["dynamic-highlight"];
    this.highlightThemeStatusBar.color = "gold";
    this.highlightThemeStatusBar.text = "HL";
    this.highlightThemeStatusBar.tooltip = "Switch Editor Highlight";
    this.highlightThemeStatusBar.show();
  }

  protected configModeStatusBar() {
    vscode.window.showQuickPick(["Light", "Dark"]).then((selectedMode) => {
      if (selectedMode) {
        FDVanillaTheme.actualMode = selectedMode as TFDVTMode;
        this.updateJSONThemeFile();
      }
    });

    // Status bar for dynamic mode switching
    this.modeStatusBar = Global.vanilla.dynamicTheme.statusBar.mode;
    this.modeStatusBar.command =
      Global.vanilla.dynamicTheme.comandos["dynamic-mode"];
    this.modeStatusBar.color = "gold";
    this.modeStatusBar.text = "MD";
    this.modeStatusBar.tooltip = "Switch Editor Mode";
    this.modeStatusBar.show();
  }

  // NOTE: This function is a placeholder for updating the JSON theme file.
  protected updateJSONThemeFile() {
    // Implementation goes here
    FDVanillaTheme.actualJSON.name = "Flawuldragon Dynamic Theme";
    FDVanillaTheme.actualJSON.type = "dark";
    FDVanillaTheme.actualJSON.colors = {
      "editorBracketHighlight.foreground1": "#ffcc00",
      "editorBracketHighlight.foreground2": "#ffcc00",
      "editorBracketHighlight.foreground3": "#ffcc00",
      "editorBracketHighlight.foreground4": "#ffcc00",
      "editorBracketHighlight.foreground5": "#ffcc00",
      "editorBracketHighlight.foreground6": "#ffcc00",
    };
  }

  protected theme_advanced_circuits() {}
  protected theme_blueprint_paper() {}
  protected theme_humba01_design_style() {}
  protected theme_winter_day() {}
  protected theme_cappuccino() {}
  protected theme_red_velvet() {}
  protected theme_sunshine() {}
  protected theme_ri_visual_studio() {}
  protected theme_ri_visual_studio_blue() {}
  protected highlight_monokai() {}
  protected highlight_monokai_dimmed() {}
  protected highlight_bluloco() {}
  protected highlight_bluloco_italic() {}
  protected highlight_dracula() {}
  protected highlight_dracula_soft() {}
  protected highlight_one_dark() {}
  protected highlight_one_dark_vivid() {}
  protected highlight_original() {}

  public activate(context: vscode.ExtensionContext) {
    try {
      this.configThemeStatusBar();
      this.configHighlightStatusBar();
      this.configModeStatusBar();
  
      let switchThemeCommand = vscode.commands.registerCommand(
        Global.vanilla.dynamicTheme.comandos["dynamic-theme"],
        () => this.configThemeStatusBar()
      );
      let switchHighlightCommand = vscode.commands.registerCommand(
        Global.vanilla.dynamicTheme.comandos["dynamic-highlight"],
        () => this.configHighlightStatusBar()
      );
      let switchModeCommand = vscode.commands.registerCommand(
        Global.vanilla.dynamicTheme.comandos["dynamic-mode"],
        () => this.configModeStatusBar()
      );
      context.subscriptions.push(
        switchThemeCommand,
        switchHighlightCommand,
        switchModeCommand
      );
    } catch (error) {
      this.deactivate();
      console.error("Flawuldragon vanilla themes error: " + error);
      vscode.window.showErrorMessage(
        "An error occurred while activating the Flawuldragon vanilla themes: " +
          error +
          ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)"
      );
    } finally {}
  }

  public deactivate() {
    this.themeStatusBar?.dispose();
    this.highlightThemeStatusBar?.dispose();
    this.modeStatusBar?.dispose();
  }
}
