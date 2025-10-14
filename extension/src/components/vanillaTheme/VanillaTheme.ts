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
    "actual-highlight-statusbar-text": FDVanillaTheme.actualSetupConfig["actual-highlight-statusbar-text"] as string,
    "actual-highlight-statusbar-tooltip": FDVanillaTheme.actualSetupConfig["actual-highlight-statusbar-tooltip"] as string,
  }

  protected configThemeStatusBar() {
    vscode.window
      .showQuickPick([
        "$(advanced-circuits-dynamic-theme-icon) Advanced Circuits",
        "$(blueprint-paper-dynamic-theme-icon) Blueprint Paper",
        "$(humba01s-design-style-dynamic-theme-icon) Humba01 Design Style",
        "$(winter-day-dynamic-theme-icon) Winter Day",
        "$(cappuccino-dynamic-theme-icon) Cappuccino",
        "$(red-velvet-dynamic-theme-icon) Red Velvet",
        "$(sunshine-dynamic-theme-icon) Sunshine",
        "$(midnight-dynamic-theme-icon) Midnight",
        "$(big-bang-dynamic-theme-icon) Big Bang",
        "$(sublime-dynamic-theme-icon) Sublime",
        "$(sold-metal-dynamic-theme-icon) Sold Metal",
        "$(royale-dynamic-theme-icon) Royale",
        "$(carmesim-dynamic-theme-icon) Carmesim",
        "$(warped-dynamic-theme-icon) Warped",
        "$(mystical-dynamic-theme-icon) Mystical",
        "$(quartz-dynamic-theme-icon) Quartz",
        "$(electric-dynamic-theme-icon) Electric",
        "$(bubblegun-dynamic-theme-icon) Bubblegun",
        "$(deep-florest-dynamic-theme-icon) Deep Florest",
        "$(carrot-dynamic-theme-icon) Carrot"
      ])
      .then((selectedTheme) => {
        if (selectedTheme) {
          let Text, Tooltip;
          switch (selectedTheme) {
            case "$(advanced-circuits-dynamic-theme-icon) Advanced Circuits":
              selectedTheme = "Advanced Circuits";
              Text = "$(advanced-circuits-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Advanced Circuits";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(blueprint-paper-dynamic-theme-icon) Blueprint Paper":
              selectedTheme = "Blueprint Paper";
              Text = "$(blueprint-paper-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Blueprint Paper";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(humba01s-design-style-dynamic-theme-icon) Humba01 Design Style":
              selectedTheme = "Humba01 Design Style";
              Text = "$(humba01s-design-style-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Humba01 Design Style";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(winter-day-dynamic-theme-icon) Winter Day":
              selectedTheme = "Winter Day";
              Text = "$(winter-day-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Winter Day";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(cappuccino-dynamic-theme-icon) Cappuccino":
              selectedTheme = "Cappuccino";
              Text = "$(cappuccino-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Cappuccino";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(red-velvet-dynamic-theme-icon) Red Velvet":
              selectedTheme = "Red Velvet";
              Text = "$(red-velvet-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Red Velvet";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(sunshine-dynamic-theme-icon) Sunshine":
              selectedTheme = "Sunshine";
              Text = "$(sunshine-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Sunshine";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(midnight-dynamic-theme-icon) Midnight":
              selectedTheme = "Midnight";
              Text = "$(midnight-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Midnight";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(big-bang-dynamic-theme-icon) Big Bang":
              selectedTheme = "Big Bang";
              Text = "$(big-bang-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Big Bang";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(sublime-dynamic-theme-icon) Sublime":
              selectedTheme = "Sublime";
              Text = "$(sublime-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Sublime";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(sold-metal-dynamic-theme-icon) Sold Metal":
              selectedTheme = "Sold Metal";
              Text = "$(sold-metal-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Sold Metal";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(royale-dynamic-theme-icon) Royale":
              selectedTheme = "Royale";
              Text = "$(royale-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Royale";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(carmesim-dynamic-theme-icon) Carmesim":
              selectedTheme = "Carmesim";
              Text = "$(carmesim-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Carmesim";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(warped-dynamic-theme-icon) Warped":
              selectedTheme = "Warped";
              Text = "$(warped-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Warped";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(mystical-dynamic-theme-icon) Mystical":
              selectedTheme = "Mystical";
              Text = "$(mystical-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Mystical";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(quartz-dynamic-theme-icon) Quartz":
              selectedTheme = "Quartz";
              Text = "$(quartz-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Quartz";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(electric-dynamic-theme-icon) Electric":
              selectedTheme = "Electric";
              Text = "$(electric-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Electric";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(bubblegun-dynamic-theme-icon) Bubblegun":
              selectedTheme = "Bubblegun";
              Text = "$(bubblegun-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Bubblegun";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(deep-florest-dynamic-theme-icon) Deep Florest":
              selectedTheme = "Deep Florest";
              Text = "$(deep-florest-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Deep Florest";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(carrot-dynamic-theme-icon) Carrot":
              selectedTheme = "Carrot";
              Text = "$(carrot-dynamic-theme-icon) TH";
              Tooltip = "Switch Editor Theme | Actual: Carrot";
              this.themeStatusBar.text = Text;
              this.themeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-theme"] = selectedTheme as TFDVTTheme;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-theme-statusbar-tooltip"] = Tooltip;
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
        "$(visual-studio-code-dynamic-highlight-icon) Visual Studio Code",
        "$(monokai-dynamic-highlight-icon) Monokai",
        "$(bluloco-dynamic-highlight-icon) Bluloco",
        "$(dracula-dynamic-highlight-icon) Dracula",
        "$(one-dark-dynamic-highlight-icon) One Dark",
        "$(iceberg-dynamic-highlight-icon) Iceberg",
        "$(bluloco-italic-dynamic-highlight-icon) Bluloco Italic",
        "$(dracula-soft-dynamic-highlight-icon) Dracula Soft",
        "$(monokai-dimmed-dynamic-highlight-icon) Monokai Dimmed",
        "$(one-dark-vivid-dynamic-highlight-icon) One Dark Vivid"
      ])
      .then((selectedHighlight) => {
        if (selectedHighlight) {
          let Text, Tooltip;
          switch (selectedHighlight) {
            case "$(visual-studio-code-dynamic-highlight-icon) Visual Studio Code":
              selectedHighlight = "Visual Studio Code";
              Text = "$(visual-studio-code-dynamic-highlight-icon) HL";
              Tooltip = "Switch Editor Highlight | Actual: Visual Studio Code";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(monokai-dynamic-highlight-icon) Monokai":
              selectedHighlight = "Monokai";
              Text = "$(monokai-dynamic-highlight-icon) HL";
              Tooltip = "Switch Editor Highlight | Actual: Monokai";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(bluloco-dynamic-highlight-icon) Bluloco":
              selectedHighlight = "Bluloco";
              Text = "$(bluloco-dynamic-highlight-icon) HL";
              Tooltip = "Switch Editor Highlight | Actual: Bluloco";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(dracula-dynamic-highlight-icon) Dracula":
              selectedHighlight = "Dracula";
              Text = "$(dracula-dynamic-highlight-icon) HL";
              Tooltip = "Switch Editor Highlight | Actual: Dracula";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(one-dark-dynamic-highlight-icon) One Dark":
              selectedHighlight = "One Dark";
              Text = "$(one-dark-dynamic-highlight-icon) HL";
              Tooltip = "Switch Editor Highlight | Actual: One Dark";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(iceberg-dynamic-highlight-icon) Iceberg":
              selectedHighlight = "Iceberg";
              Text = "$(iceberg-dynamic-highlight-icon) HL";
              Tooltip = "Switch Editor Highlight | Actual: Iceberg";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(bluloco-italic-dynamic-highlight-icon) Bluloco Italic":
              selectedHighlight = "Bluloco Italic";
              Text = "$(bluloco-italic-dynamic-highlight-icon) HL";
              Tooltip = "Switch Editor Highlight | Actual: Bluloco Italic";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(dracula-soft-dynamic-highlight-icon) Dracula Soft":
              selectedHighlight = "Dracula Soft";
              Text = "$(dracula-soft-dynamic-highlight-icon) HL";
              Tooltip = "Switch Editor Highlight | Actual: Dracula Soft";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(monokai-dimmed-dynamic-highlight-icon) Monokai Dimmed":
              selectedHighlight = "Monokai Dimmed";
              Text = "$(monokai-dimmed-dynamic-highlight-icon) HL";
              Tooltip = "Switch Editor Highlight | Actual: Monokai Dimmed";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
              writeFileSync(
                __dirname + "/setupThemeConfig.json",
                JSON.stringify(FDVanillaTheme.dynamicSetupThemeConfig, null, 2),
                "utf-8"
              );
              break;
            case "$(one-dark-vivid-dynamic-highlight-icon) One Dark Vivid":
              selectedHighlight = "One Dark Vivid";
              Text = "$(one-dark-vivid-dynamic-highlight-icon) HL";
              Tooltip = "Switch Editor Highlight | Actual: One Dark Vivid";
              this.highlightThemeStatusBar.text = Text;
              this.highlightThemeStatusBar.tooltip = Tooltip;
              FDVanillaTheme.dynamicThemeConfig["actual-highlight"] = selectedHighlight as TFDVTHighlight;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-text"] = Text;
              FDVanillaTheme.dynamicSetupThemeConfig["actual-highlight-statusbar-tooltip"] = Tooltip;
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
