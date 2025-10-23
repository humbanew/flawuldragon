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
  IFDDynamicSetupThemeConfig,
  IFDDynamicThemeConfig,
  TFDVTHighlight,
  TFDVTTheme,
  IVscodeColorTheme,
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
  THEME_BIG_BANG,
  THEME_SUBLIME,
  THEME_SOLDMETAL,
  THEME_ROYALE,
  THEME_CARMESIM,
  THEME_WARPED,
  THEME_MYSTICAL,
  THEME_QUARTZ,
  THEME_ELECTRIC,
  THEME_BUBBLEGUN,
  THEME_DEEP_FLOREST,
  THEME_CARROT,
  HIGHLIGHT_BLULOCO_ITALIC,
  HIGHLIGHT_DRACULA_SOFT,
  HIGHLIGHT_MONOKAI_DIMMED,
  HIGHLIGHT_ONE_DARK_VIVID,
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
  protected static actualSetupConfig = JSON.parse(
    readFileSync(__dirname + "/setupThemeConfig.json", "utf-8")
  );
  protected static actualJSON: IVscodeColorTheme = JSON.parse(
    readFileSync(FDVanillaTheme.JSONPath, "utf-8")
  );
  protected static dynamicThemeConfig: IFDDynamicThemeConfig = {
    "actual-theme": FDVanillaTheme.actualConfig["actual-theme"] as TFDVTTheme,
    "actual-highlight": FDVanillaTheme.actualConfig["actual-highlight"] as TFDVTHighlight,
  }
  protected static dynamicSetupThemeConfig: IFDDynamicSetupThemeConfig = {
    "actual-theme-statusbar-text": FDVanillaTheme.actualSetupConfig["actual-theme-statusbar-text"] as string,
    "actual-theme-statusbar-tooltip": FDVanillaTheme.actualSetupConfig["actual-theme-statusbar-tooltip"] as string,
    "actual-theme-statusbar-color": FDVanillaTheme.actualSetupConfig["actual-theme-statusbar-color"] as string,
    "actual-highlight-statusbar-text": FDVanillaTheme.actualSetupConfig["actual-highlight-statusbar-text"] as string,
    "actual-highlight-statusbar-tooltip": FDVanillaTheme.actualSetupConfig["actual-highlight-statusbar-tooltip"] as string,
    "actual-highlight-statusbar-color": FDVanillaTheme.actualSetupConfig["actual-highlight-statusbar-color"] as string,
  }

  protected configThemeStatusBar() {
    vscode.window
      .showQuickPick([
        "$(fd-color-theme) Advanced Circuits",
        "$(fd-color-theme) Blueprint Paper",
        "$(fd-color-theme) Humba01 Design Style",
        "$(fd-color-theme) Winter Day",
        "$(fd-color-theme) Cappuccino",
        "$(fd-color-theme) Red Velvet",
        "$(fd-color-theme) Sunshine",
        "$(fd-color-theme) Midnight",
        "$(fd-color-theme) Big Bang",
        "$(fd-color-theme) Sublime",
        "$(fd-color-theme) Sold Metal",
        "$(fd-color-theme) Royale",
        "$(fd-color-theme) Carmesim",
        "$(fd-color-theme) Warped",
        "$(fd-color-theme) Mystical",
        "$(fd-color-theme) Quartz",
        "$(fd-color-theme) Electric",
        "$(fd-color-theme) Bubblegun",
        "$(fd-color-theme) Deep Florest",
        "$(fd-color-theme) Carrot"
      ])
      .then((selectedTheme) => {
        if (selectedTheme) {
          let Text, Tooltip, Color;
          switch (selectedTheme) {
            case "$(fd-color-theme) Advanced Circuits":
              selectedTheme = "Advanced Circuits";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Advanced Circuits";
              Color = "#34744d";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Blueprint Paper":
              selectedTheme = "Blueprint Paper";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Blueprint Paper";
              Color = "#192c64";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Humba01 Design Style":
              selectedTheme = "Humba01 Design Style";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Humba01 Design Style";
              Color = "#25038d";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Winter Day":
              selectedTheme = "Winter Day";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Winter Day";
              Color = "#632f3f";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Cappuccino":
              selectedTheme = "Cappuccino";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Cappuccino";
              Color = "#66553b";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Red Velvet":
              selectedTheme = "Red Velvet";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Red Velvet";
              Color = "#741a24";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Sunshine":
              selectedTheme = "Sunshine";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Sunshine";
              Color = "#6e4028";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Midnight":
              selectedTheme = "Midnight";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Midnight";
              Color = "#091d3b";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Big Bang":
              selectedTheme = "Big Bang";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Big Bang";
              Color = "#194465";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Sublime":
              selectedTheme = "Sublime";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Sublime";
              Color = "#191b1f";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Sold Metal":
              selectedTheme = "Sold Metal";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Sold Metal";
              Color = "#373737";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Royale":
              selectedTheme = "Royale";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Royale";
              Color = "#2e59d7";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Carmesim":
              selectedTheme = "Carmesim";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Carmesim";
              Color = "#ac2121";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Warped":
              selectedTheme = "Warped";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Warped";
              Color = "#007892";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Mystical":
              selectedTheme = "Mystical";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Mystical";
              Color = "#49007d";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Quartz":
              selectedTheme = "Quartz";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Quartz";
              Color = "#9c7a84";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Electric":
              selectedTheme = "Electric";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Electric";
              Color = "#af7800";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Bubblegun":
              selectedTheme = "Bubblegun";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Bubblegun";
              Color = "#7d032a";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Deep Florest":
              selectedTheme = "Deep Florest";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Deep Florest";
              Color = "#2b6300";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-color-theme) Carrot":
              selectedTheme = "Carrot";
              Text = "$(fd-color-theme) TH";
              Tooltip = "Switch Editor Theme | Actual: Carrot";
              Color = "#b94202";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              this.themeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case undefined:
              break;
          }
          this.updateJSONThemeFile(selectedTheme as TFDVTTheme, undefined);
        }
      });
  }

  protected configHighlightStatusBar() {
    vscode.window
      .showQuickPick([
        "$(fd-highlight) Visual Studio Code",
        "$(fd-highlight) Monokai",
        "$(fd-highlight) Bluloco",
        "$(fd-highlight) Dracula",
        "$(fd-highlight) One Dark",
        "$(fd-highlight) Iceberg",
        "$(fd-highlight) Bluloco Italic",
        "$(fd-highlight) Dracula Soft",
        "$(fd-highlight) Monokai Dimmed",
        "$(fd-highlight) One Dark Vivid"
      ])
      .then((selectedHighlight) => {
        if (selectedHighlight) {
          let Text, Tooltip, Color;
          switch (selectedHighlight) {
            case "$(fd-highlight) Visual Studio Code":
              selectedHighlight = "Visual Studio Code";
              Text = "$(fd-highlight) HL";
              Tooltip = "Switch Editor Highlight | Actual: Visual Studio Code";
              Color = "#b9836d";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              this.highlightThemeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-highlight) Monokai":
              selectedHighlight = "Monokai";
              Text = "$(fd-highlight) HL";
              Tooltip = "Switch Editor Highlight | Actual: Monokai";
              Color = "#a9e335";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              this.highlightThemeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-highlight) Bluloco":
              selectedHighlight = "Bluloco";
              Text = "$(fd-highlight) HL";
              Tooltip = "Switch Editor Highlight | Actual: Bluloco";
              Color = "#1e9cfe";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              this.highlightThemeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-highlight) Dracula":
              selectedHighlight = "Dracula";
              Text = "$(fd-highlight) HL";
              Tooltip = "Switch Editor Highlight | Actual: Dracula";
              Color = "#fe75d2";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              this.highlightThemeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-highlight) One Dark":
              selectedHighlight = "One Dark";
              Text = "$(fd-highlight) HL";
              Tooltip = "Switch Editor Highlight | Actual: One Dark";
              Color = "#e6c27e";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              this.highlightThemeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-highlight) Iceberg":
              selectedHighlight = "Iceberg";
              Text = "$(fd-highlight) HL";
              Tooltip = "Switch Editor Highlight | Actual: Iceberg";
              Color = "#b7c1ca";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              this.highlightThemeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-highlight) Bluloco Italic":
              selectedHighlight = "Bluloco Italic";
              Text = "$(fd-highlight) HL";
              Tooltip = "Switch Editor Highlight | Actual: Bluloco Italic";
              Color = "#60b9ff";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              this.highlightThemeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-highlight) Dracula Soft":
              selectedHighlight = "Dracula Soft";
              Text = "$(fd-highlight) HL";
              Tooltip = "Switch Editor Highlight | Actual: Dracula Soft";
              Color = "#ffade5";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              this.highlightThemeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-highlight) Monokai Dimmed":
              selectedHighlight = "Monokai Dimmed";
              Text = "$(fd-highlight) HL";
              Tooltip = "Switch Editor Highlight | Actual: Monokai Dimmed";
              Color = "#bbe663";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              this.highlightThemeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(fd-highlight) One Dark Vivid":
              selectedHighlight = "One Dark Vivid";
              Text = "$(fd-highlight) HL";
              Tooltip = "Switch Editor Highlight | Actual: One Dark Vivid";
              Color = "#eeb13c";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              this.highlightThemeStatusBar.color = Color;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-color"] = Color;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
          }
          this.updateJSONThemeFile(undefined, selectedHighlight as TFDVTHighlight);
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
      case "Big Bang":
        FDVanillaTheme.actualJSON.colors = THEME_BIG_BANG();
        break;
      case "Sublime":
        FDVanillaTheme.actualJSON.colors = THEME_SUBLIME();
        break;
      case "Sold Metal":
        FDVanillaTheme.actualJSON.colors = THEME_SOLDMETAL();
        break;
      case "Royale":
        FDVanillaTheme.actualJSON.colors = THEME_ROYALE();
        break;
      case "Carmesim":
        FDVanillaTheme.actualJSON.colors = THEME_CARMESIM();
        break;
      case "Warped":
        FDVanillaTheme.actualJSON.colors = THEME_WARPED();
        break;
      case "Mystical":
        FDVanillaTheme.actualJSON.colors = THEME_MYSTICAL();
        break;
      case "Quartz":
        FDVanillaTheme.actualJSON.colors = THEME_QUARTZ();
        break;
      case "Electric":
        FDVanillaTheme.actualJSON.colors = THEME_ELECTRIC();
        break;
      case "Bubblegun":
        FDVanillaTheme.actualJSON.colors = THEME_BUBBLEGUN();
        break;
      case "Deep Florest":
        FDVanillaTheme.actualJSON.colors = THEME_DEEP_FLOREST();
        break;
      case "Carrot":
        FDVanillaTheme.actualJSON.colors = THEME_CARROT();
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
      case "Bluloco Italic":
        FDVanillaTheme.actualJSON.tokenColors = HIGHLIGHT_BLULOCO_ITALIC();
        break;
      case "Dracula Soft":
        FDVanillaTheme.actualJSON.tokenColors = HIGHLIGHT_DRACULA_SOFT();
        break;
      case "Monokai Dimmed":
        FDVanillaTheme.actualJSON.tokenColors = HIGHLIGHT_MONOKAI_DIMMED();
        break;
      case "One Dark Vivid":
        FDVanillaTheme.actualJSON.tokenColors = HIGHLIGHT_ONE_DARK_VIVID();
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
    let text = FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"];
    let tooltip = FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"];
    this.themeStatusBar.text = text;
    this.themeStatusBar.tooltip = tooltip;
    this.highlightThemeStatusBar.show();

    // Status bar for dynamic highlight switching
    this.highlightThemeStatusBar.command =
      Global.vanilla.dynamicTheme.comandos["dynamic-highlight"];
    this.highlightThemeStatusBar.color = "gold";
    this.highlightThemeStatusBar.text = FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"];
    this.highlightThemeStatusBar.tooltip = FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"];
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
