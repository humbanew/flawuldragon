/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import { TFDColorPalette, VscodeColorTheme } from "./defines";

const theme_color_advanced_circuits: TFDColorPalette = {
    "1": "#34744d",
    "2": "#2f6845",
    "3": "#2a5d3e",
    "4": "#245136",
  },
  theme_color_blueprint_paper: TFDColorPalette = {
    "1": "#192c64",
    "2": "#16285a",
    "3": "#142350",
    "4": "#111f46",
  },
  theme_color_humba01_design_style: TFDColorPalette = {
    "1": "#25038d",
    "2": "#21037f",
    "3": "#1e0271",
    "4": "#1a0263",
  },
  theme_color_winter_day: TFDColorPalette = {
    "1": "#632f3f",
    "2": "#592a39",
    "3": "#4f2632",
    "4": "#45212c",
  },
  theme_color_cappuccino: TFDColorPalette = {
    "1": "#66553b",
    "2": "#5c4c35",
    "3": "#52442f",
    "4": "#473c29",
  },
  theme_color_red_velvet: TFDColorPalette = {
    "1": "#741a24",
    "2": "#681720",
    "3": "#5d151d",
    "4": "#511219",
  },
  theme_color_sunshine: TFDColorPalette = {
    "1": "#6e4028",
    "2": "#633a24",
    "3": "#583320",
    "4": "#4d2d1c",
  },
  theme_color_midnight: TFDColorPalette = {
    "1": "#091d3b",
    "2": "#081a35",
    "3": "#07172f",
    "4": "#061429",
  };

export const THEME_ADVANCED_CIRCUITS = (): VscodeColorTheme["colors"] => {
    return {
      "editor.background": theme_color_advanced_circuits["1"],
      "activityBar.activeBorder": "#ffffff",
      "activityBar.background": theme_color_advanced_circuits["3"],
      "activityBar.border": theme_color_advanced_circuits["2"],
      "activityBar.foreground": "#D7D7D7",
      "activityBar.inactiveForeground": "#868686",
      "activityBarBadge.background": theme_color_advanced_circuits["1"],
      "activityBarBadge.foreground": "#FFFFFF",
      "badge.background": "#616161",
      "badge.foreground": "#F8F8F8",
      "button.background": theme_color_advanced_circuits["1"],
      "button.border": "#FFFFFF12",
      "button.foreground": "#FFFFFF",
      "editor.lineHighlightBackground": theme_color_advanced_circuits["2"],
      "button.hoverBackground": theme_color_advanced_circuits["1"],
      "button.secondaryBackground": theme_color_advanced_circuits["4"],
      "button.secondaryForeground": "#CCCCCC",
      "button.secondaryHoverBackground": theme_color_advanced_circuits["4"],
      "chat.slashCommandBackground": "#26477866",
      "chat.slashCommandForeground": "#85B6FF",
      "chat.editedFileForeground": "#E2C08D",
      "checkbox.background": theme_color_advanced_circuits["4"],
      "checkbox.border": theme_color_advanced_circuits["4"],
      "debugToolBar.background": theme_color_advanced_circuits["3"],
      descriptionForeground: "#9D9D9D",
      "dropdown.background": theme_color_advanced_circuits["4"],
      "dropdown.border": theme_color_advanced_circuits["4"],
      "dropdown.foreground": "#CCCCCC",
      "dropdown.listBackground": theme_color_advanced_circuits["1"],
      "list.hoverBackground": theme_color_advanced_circuits["1"],
      "list.activeSelectionBackground": theme_color_advanced_circuits["1"],
      "list.inactiveSelectionBackground":
        theme_color_advanced_circuits["1"] + "cc",
      "editor.findMatchBackground": "#9E6A03",
      "editor.foreground": "#ffffff",
      "editorGroup.border": "#FFFFFF17",
      "editorGroupHeader.tabsBackground": theme_color_advanced_circuits["3"],
      "editorGroupHeader.tabsBorder": theme_color_advanced_circuits["2"],
      "editorGutter.addedBackground": "#2EA043",
      "editorGutter.deletedBackground": "#F85149",
      "editorGutter.modifiedBackground": "#ffffff",
      "editorLineNumber.activeForeground": "#CCCCCC",
      "editorLineNumber.foreground": "#6E7681",
      "editorOverviewRuler.border": "#010409",
      "editorWidget.background": theme_color_advanced_circuits["1"],
      errorForeground: "#F85149",
      focusBorder: theme_color_advanced_circuits["1"],
      foreground: "#CCCCCC",
      "icon.foreground": "#CCCCCC",
      "input.background": theme_color_advanced_circuits["4"],
      "input.border": theme_color_advanced_circuits["4"],
      "input.foreground": "#CCCCCC",
      "input.placeholderForeground": "#989898",
      "inputOption.activeBackground": theme_color_advanced_circuits["1"] + "82",
      "inputOption.activeBorder": theme_color_advanced_circuits["1"],
      "keybindingLabel.foreground": "#CCCCCC",
      "menu.background": theme_color_advanced_circuits["1"],
      "menu.selectionBackground": theme_color_advanced_circuits["1"],
      "notificationCenterHeader.background": theme_color_advanced_circuits["1"],
      "notificationCenterHeader.foreground": "#CCCCCC",
      "notifications.background": theme_color_advanced_circuits["1"],
      "notifications.border": theme_color_advanced_circuits["2"],
      "notifications.foreground": "#CCCCCC",
      "panel.background": theme_color_advanced_circuits["3"],
      "panel.border": theme_color_advanced_circuits["2"],
      "panelInput.border": theme_color_advanced_circuits["2"],
      "panelTitle.activeBorder": theme_color_advanced_circuits["1"],
      "panelTitle.activeForeground": "#CCCCCC",
      "panelTitle.inactiveForeground": "#9D9D9D",
      "peekViewEditor.background": theme_color_advanced_circuits["1"],
      "peekViewEditor.matchHighlightBackground":
        theme_color_advanced_circuits["1"] + "66",
      "peekViewResult.background": theme_color_advanced_circuits["1"],
      "peekViewResult.matchHighlightBackground":
        theme_color_advanced_circuits["1"] + "66",
      "pickerGroup.border": theme_color_advanced_circuits["4"],
      "progressBar.background": theme_color_advanced_circuits["1"],
      "quickInput.background": theme_color_advanced_circuits["4"],
      "quickInput.foreground": "#CCCCCC",
      "settings.dropdownBackground": theme_color_advanced_circuits["4"],
      "settings.dropdownBorder": theme_color_advanced_circuits["4"],
      "settings.headerForeground": "#FFFFFF",
      "settings.modifiedItemIndicator":
        theme_color_advanced_circuits["1"] + "66",
      "sideBar.background": theme_color_advanced_circuits["3"],
      "sideBar.border": theme_color_advanced_circuits["2"],
      "sideBar.foreground": "#CCCCCC",
      "sideBarSectionHeader.background": theme_color_advanced_circuits["3"],
      "sideBarSectionHeader.border": theme_color_advanced_circuits["2"],
      "sideBarSectionHeader.foreground": "#CCCCCC",
      "sideBarTitle.foreground": "#CCCCCC",
      "statusBar.border": theme_color_advanced_circuits["2"],
      "statusBar.debuggingBackground": theme_color_advanced_circuits["1"],
      "statusBar.debuggingForeground": "#FFFFFF",
      "statusBar.focusBorder": theme_color_advanced_circuits["1"],
      "statusBar.noFolderBackground": theme_color_advanced_circuits["1"],
      "statusBarItem.focusBorder": theme_color_advanced_circuits["1"],
      "statusBarItem.prominentBackground": "#6E768166",
      "tab.activeBackground": theme_color_advanced_circuits["1"],
      "tab.activeBorder": theme_color_advanced_circuits["1"],
      "tab.activeBorderTop": theme_color_advanced_circuits["1"],
      "tab.activeForeground": "#FFFFFF",
      "tab.selectedBorderTop": "#6caddf",
      "tab.border": theme_color_advanced_circuits["2"],
      "tab.hoverBackground": theme_color_advanced_circuits["1"],
      "tab.inactiveBackground": theme_color_advanced_circuits["3"],
      "tab.inactiveForeground": "#9D9D9D",
      "tab.unfocusedActiveBorder": theme_color_advanced_circuits["1"],
      "tab.unfocusedActiveBorderTop": theme_color_advanced_circuits["2"],
      "tab.unfocusedHoverBackground": theme_color_advanced_circuits["1"],
      "terminal.foreground": "#ffffff",
      "terminal.tab.activeBorder": theme_color_advanced_circuits["1"],
      "textBlockQuote.background": theme_color_advanced_circuits["2"],
      "textBlockQuote.border": "#616161",
      "textCodeBlock.background": theme_color_advanced_circuits["2"],
      "textLink.activeForeground": "#4daafc",
      "textLink.foreground": "#4daafc",
      "textPreformat.foreground": "#D0D0D0",
      "textPreformat.background": theme_color_advanced_circuits["4"],
      "textSeparator.foreground": theme_color_advanced_circuits["4"],
      "titleBar.activeBackground": theme_color_advanced_circuits["3"],
      "titleBar.activeForeground": "#CCCCCC",
      "titleBar.border": theme_color_advanced_circuits["2"],
      "titleBar.inactiveBackground": theme_color_advanced_circuits["1"],
      "titleBar.inactiveForeground": "#9D9D9D",
      "welcomePage.tileBackground": theme_color_advanced_circuits["2"],
      "welcomePage.progress.foreground": theme_color_advanced_circuits["1"],
      "widget.border": theme_color_advanced_circuits["4"],
      "statusBar.background": "#000000",
      "statusBar.foreground": "#FFFFFF",
      "statusBarItem.remoteBackground": "#000000",
      "statusBarItem.remoteForeground": "#FFFFFF",
      "editorBracketHighlight.foreground1": "#7200cf",
      "editorBracketHighlight.foreground2": "#9216f7",
      "editorBracketHighlight.foreground3": "#a332ff",
      "editorBracketHighlight.foreground4": "#b04fff",
      "editorBracketHighlight.foreground5": "#c075fd",
      "editorBracketHighlight.foreground6": "#d8acfc",
    };
  },
  THEME_BLUEPRINT_PAPER = (): VscodeColorTheme["colors"] => {
    return {
      "editor.background": theme_color_blueprint_paper["1"],
      "activityBar.activeBorder": "#ffffff",
      "activityBar.background": theme_color_blueprint_paper["3"],
      "activityBar.border": theme_color_blueprint_paper["2"],
      "activityBar.foreground": "#D7D7D7",
      "activityBar.inactiveForeground": "#868686",
      "activityBarBadge.background": theme_color_blueprint_paper["1"],
      "activityBarBadge.foreground": "#FFFFFF",
      "badge.background": "#616161",
      "badge.foreground": "#F8F8F8",
      "button.background": theme_color_blueprint_paper["1"],
      "button.border": "#FFFFFF12",
      "button.foreground": "#FFFFFF",
      "editor.lineHighlightBackground": theme_color_blueprint_paper["2"],
      "button.hoverBackground": theme_color_blueprint_paper["1"],
      "button.secondaryBackground": theme_color_blueprint_paper["4"],
      "button.secondaryForeground": "#CCCCCC",
      "button.secondaryHoverBackground": theme_color_blueprint_paper["4"],
      "chat.slashCommandBackground": "#26477866",
      "chat.slashCommandForeground": "#85B6FF",
      "chat.editedFileForeground": "#E2C08D",
      "checkbox.background": theme_color_blueprint_paper["4"],
      "checkbox.border": theme_color_blueprint_paper["4"],
      "debugToolBar.background": theme_color_blueprint_paper["3"],
      descriptionForeground: "#9D9D9D",
      "dropdown.background": theme_color_blueprint_paper["4"],
      "dropdown.border": theme_color_blueprint_paper["4"],
      "dropdown.foreground": "#CCCCCC",
      "dropdown.listBackground": theme_color_blueprint_paper["1"],
      "list.hoverBackground": theme_color_blueprint_paper["1"],
      "list.activeSelectionBackground": theme_color_blueprint_paper["1"],
      "list.inactiveSelectionBackground":
        theme_color_blueprint_paper["1"] + "cc",
      "editor.findMatchBackground": "#9E6A03",
      "editor.foreground": "#ffffff",
      "editorGroup.border": "#FFFFFF17",
      "editorGroupHeader.tabsBackground": theme_color_blueprint_paper["3"],
      "editorGroupHeader.tabsBorder": theme_color_blueprint_paper["2"],
      "editorGutter.addedBackground": "#2EA043",
      "editorGutter.deletedBackground": "#F85149",
      "editorGutter.modifiedBackground": "#ffffff",
      "editorLineNumber.activeForeground": "#CCCCCC",
      "editorLineNumber.foreground": "#6E7681",
      "editorOverviewRuler.border": "#010409",
      "editorWidget.background": theme_color_blueprint_paper["1"],
      errorForeground: "#F85149",
      focusBorder: theme_color_blueprint_paper["1"],
      foreground: "#CCCCCC",
      "icon.foreground": "#CCCCCC",
      "input.background": theme_color_blueprint_paper["4"],
      "input.border": theme_color_blueprint_paper["4"],
      "input.foreground": "#CCCCCC",
      "input.placeholderForeground": "#989898",
      "inputOption.activeBackground": theme_color_blueprint_paper["1"] + "82",
      "inputOption.activeBorder": theme_color_blueprint_paper["1"],
      "keybindingLabel.foreground": "#CCCCCC",
      "menu.background": theme_color_blueprint_paper["1"],
      "menu.selectionBackground": theme_color_blueprint_paper["1"],
      "notificationCenterHeader.background": theme_color_blueprint_paper["1"],
      "notificationCenterHeader.foreground": "#CCCCCC",
      "notifications.background": theme_color_blueprint_paper["1"],
      "notifications.border": theme_color_blueprint_paper["2"],
      "notifications.foreground": "#CCCCCC",
      "panel.background": theme_color_blueprint_paper["3"],
      "panel.border": theme_color_blueprint_paper["2"],
      "panelInput.border": theme_color_blueprint_paper["2"],
      "panelTitle.activeBorder": theme_color_blueprint_paper["1"],
      "panelTitle.activeForeground": "#CCCCCC",
      "panelTitle.inactiveForeground": "#9D9D9D",
      "peekViewEditor.background": theme_color_blueprint_paper["1"],
      "peekViewEditor.matchHighlightBackground":
        theme_color_blueprint_paper["1"] + "66",
      "peekViewResult.background": theme_color_blueprint_paper["1"],
      "peekViewResult.matchHighlightBackground":
        theme_color_blueprint_paper["1"] + "66",
      "pickerGroup.border": theme_color_blueprint_paper["4"],
      "progressBar.background": theme_color_blueprint_paper["1"],
      "quickInput.background": theme_color_blueprint_paper["4"],
      "quickInput.foreground": "#CCCCCC",
      "settings.dropdownBackground": theme_color_blueprint_paper["4"],
      "settings.dropdownBorder": theme_color_blueprint_paper["4"],
      "settings.headerForeground": "#FFFFFF",
      "settings.modifiedItemIndicator": theme_color_blueprint_paper["1"] + "66",
      "sideBar.background": theme_color_blueprint_paper["3"],
      "sideBar.border": theme_color_blueprint_paper["2"],
      "sideBar.foreground": "#CCCCCC",
      "sideBarSectionHeader.background": theme_color_blueprint_paper["3"],
      "sideBarSectionHeader.border": theme_color_blueprint_paper["2"],
      "sideBarSectionHeader.foreground": "#CCCCCC",
      "sideBarTitle.foreground": "#CCCCCC",
      "statusBar.border": theme_color_blueprint_paper["2"],
      "statusBar.debuggingBackground": theme_color_blueprint_paper["1"],
      "statusBar.debuggingForeground": "#FFFFFF",
      "statusBar.focusBorder": theme_color_blueprint_paper["1"],
      "statusBar.noFolderBackground": theme_color_blueprint_paper["1"],
      "statusBarItem.focusBorder": theme_color_blueprint_paper["1"],
      "statusBarItem.prominentBackground": "#6E768166",
      "tab.activeBackground": theme_color_blueprint_paper["1"],
      "tab.activeBorder": theme_color_blueprint_paper["1"],
      "tab.activeBorderTop": theme_color_blueprint_paper["1"],
      "tab.activeForeground": "#FFFFFF",
      "tab.selectedBorderTop": "#6caddf",
      "tab.border": theme_color_blueprint_paper["2"],
      "tab.hoverBackground": theme_color_blueprint_paper["1"],
      "tab.inactiveBackground": theme_color_blueprint_paper["3"],
      "tab.inactiveForeground": "#9D9D9D",
      "tab.unfocusedActiveBorder": theme_color_blueprint_paper["1"],
      "tab.unfocusedActiveBorderTop": theme_color_blueprint_paper["2"],
      "tab.unfocusedHoverBackground": theme_color_blueprint_paper["1"],
      "terminal.foreground": "#ffffff",
      "terminal.tab.activeBorder": theme_color_blueprint_paper["1"],
      "textBlockQuote.background": theme_color_blueprint_paper["2"],
      "textBlockQuote.border": "#616161",
      "textCodeBlock.background": theme_color_blueprint_paper["2"],
      "textLink.activeForeground": "#4daafc",
      "textLink.foreground": "#4daafc",
      "textPreformat.foreground": "#D0D0D0",
      "textPreformat.background": theme_color_blueprint_paper["4"],
      "textSeparator.foreground": theme_color_blueprint_paper["4"],
      "titleBar.activeBackground": theme_color_blueprint_paper["3"],
      "titleBar.activeForeground": "#CCCCCC",
      "titleBar.border": theme_color_blueprint_paper["2"],
      "titleBar.inactiveBackground": theme_color_blueprint_paper["1"],
      "titleBar.inactiveForeground": "#9D9D9D",
      "welcomePage.tileBackground": theme_color_blueprint_paper["2"],
      "welcomePage.progress.foreground": theme_color_blueprint_paper["1"],
      "widget.border": theme_color_blueprint_paper["4"],
      "statusBar.background": "#000000",
      "statusBar.foreground": "#FFFFFF",
      "statusBarItem.remoteBackground": "#000000",
      "statusBarItem.remoteForeground": "#FFFFFF",
      "editorBracketHighlight.foreground1": "#7200cf",
      "editorBracketHighlight.foreground2": "#9216f7",
      "editorBracketHighlight.foreground3": "#a332ff",
      "editorBracketHighlight.foreground4": "#b04fff",
      "editorBracketHighlight.foreground5": "#c075fd",
      "editorBracketHighlight.foreground6": "#d8acfc",
    };
  },
  THEME_HUMBA01_DESIGN_STYLE = (): VscodeColorTheme["colors"] => {
    return {
      "editor.background": theme_color_humba01_design_style["1"],
      "activityBar.activeBorder": "#ffffff",
      "activityBar.background": theme_color_humba01_design_style["3"],
      "activityBar.border": theme_color_humba01_design_style["2"],
      "activityBar.foreground": "#D7D7D7",
      "activityBar.inactiveForeground": "#868686",
      "activityBarBadge.background": theme_color_humba01_design_style["1"],
      "activityBarBadge.foreground": "#FFFFFF",
      "badge.background": "#616161",
      "badge.foreground": "#F8F8F8",
      "button.background": theme_color_humba01_design_style["1"],
      "button.border": "#FFFFFF12",
      "button.foreground": "#FFFFFF",
      "editor.lineHighlightBackground": theme_color_humba01_design_style["2"],
      "button.hoverBackground": theme_color_humba01_design_style["1"],
      "button.secondaryBackground": theme_color_humba01_design_style["4"],
      "button.secondaryForeground": "#CCCCCC",
      "button.secondaryHoverBackground": theme_color_humba01_design_style["4"],
      "chat.slashCommandBackground": "#26477866",
      "chat.slashCommandForeground": "#85B6FF",
      "chat.editedFileForeground": "#E2C08D",
      "checkbox.background": theme_color_humba01_design_style["4"],
      "checkbox.border": theme_color_humba01_design_style["4"],
      "debugToolBar.background": theme_color_humba01_design_style["3"],
      descriptionForeground: "#9D9D9D",
      "dropdown.background": theme_color_humba01_design_style["4"],
      "dropdown.border": theme_color_humba01_design_style["4"],
      "dropdown.foreground": "#CCCCCC",
      "dropdown.listBackground": theme_color_humba01_design_style["1"],
      "list.hoverBackground": theme_color_humba01_design_style["1"],
      "list.activeSelectionBackground": theme_color_humba01_design_style["1"],
      "list.inactiveSelectionBackground":
        theme_color_humba01_design_style["1"] + "cc",
      "editor.findMatchBackground": "#9E6A03",
      "editor.foreground": "#ffffff",
      "editorGroup.border": "#FFFFFF17",
      "editorGroupHeader.tabsBackground": theme_color_humba01_design_style["3"],
      "editorGroupHeader.tabsBorder": theme_color_humba01_design_style["2"],
      "editorGutter.addedBackground": "#2EA043",
      "editorGutter.deletedBackground": "#F85149",
      "editorGutter.modifiedBackground": "#ffffff",
      "editorLineNumber.activeForeground": "#CCCCCC",
      "editorLineNumber.foreground": "#6E7681",
      "editorOverviewRuler.border": "#010409",
      "editorWidget.background": theme_color_humba01_design_style["1"],
      errorForeground: "#F85149",
      focusBorder: theme_color_humba01_design_style["1"],
      foreground: "#CCCCCC",
      "icon.foreground": "#CCCCCC",
      "input.background": theme_color_humba01_design_style["4"],
      "input.border": theme_color_humba01_design_style["4"],
      "input.foreground": "#CCCCCC",
      "input.placeholderForeground": "#989898",
      "inputOption.activeBackground":
        theme_color_humba01_design_style["1"] + "82",
      "inputOption.activeBorder": theme_color_humba01_design_style["1"],
      "keybindingLabel.foreground": "#CCCCCC",
      "menu.background": theme_color_humba01_design_style["1"],
      "menu.selectionBackground": theme_color_humba01_design_style["1"],
      "notificationCenterHeader.background":
        theme_color_humba01_design_style["1"],
      "notificationCenterHeader.foreground": "#CCCCCC",
      "notifications.background": theme_color_humba01_design_style["1"],
      "notifications.border": theme_color_humba01_design_style["2"],
      "notifications.foreground": "#CCCCCC",
      "panel.background": theme_color_humba01_design_style["3"],
      "panel.border": theme_color_humba01_design_style["2"],
      "panelInput.border": theme_color_humba01_design_style["2"],
      "panelTitle.activeBorder": theme_color_humba01_design_style["1"],
      "panelTitle.activeForeground": "#CCCCCC",
      "panelTitle.inactiveForeground": "#9D9D9D",
      "peekViewEditor.background": theme_color_humba01_design_style["1"],
      "peekViewEditor.matchHighlightBackground":
        theme_color_humba01_design_style["1"] + "66",
      "peekViewResult.background": theme_color_humba01_design_style["1"],
      "peekViewResult.matchHighlightBackground":
        theme_color_humba01_design_style["1"] + "66",
      "pickerGroup.border": theme_color_humba01_design_style["4"],
      "progressBar.background": theme_color_humba01_design_style["1"],
      "quickInput.background": theme_color_humba01_design_style["4"],
      "quickInput.foreground": "#CCCCCC",
      "settings.dropdownBackground": theme_color_humba01_design_style["4"],
      "settings.dropdownBorder": theme_color_humba01_design_style["4"],
      "settings.headerForeground": "#FFFFFF",
      "settings.modifiedItemIndicator":
        theme_color_humba01_design_style["1"] + "66",
      "sideBar.background": theme_color_humba01_design_style["3"],
      "sideBar.border": theme_color_humba01_design_style["2"],
      "sideBar.foreground": "#CCCCCC",
      "sideBarSectionHeader.background": theme_color_humba01_design_style["3"],
      "sideBarSectionHeader.border": theme_color_humba01_design_style["2"],
      "sideBarSectionHeader.foreground": "#CCCCCC",
      "sideBarTitle.foreground": "#CCCCCC",
      "statusBar.border": theme_color_humba01_design_style["2"],
      "statusBar.debuggingBackground": theme_color_humba01_design_style["1"],
      "statusBar.debuggingForeground": "#FFFFFF",
      "statusBar.focusBorder": theme_color_humba01_design_style["1"],
      "statusBar.noFolderBackground": theme_color_humba01_design_style["1"],
      "statusBarItem.focusBorder": theme_color_humba01_design_style["1"],
      "statusBarItem.prominentBackground": "#6E768166",
      "tab.activeBackground": theme_color_humba01_design_style["1"],
      "tab.activeBorder": theme_color_humba01_design_style["1"],
      "tab.activeBorderTop": theme_color_humba01_design_style["1"],
      "tab.activeForeground": "#FFFFFF",
      "tab.selectedBorderTop": "#6caddf",
      "tab.border": theme_color_humba01_design_style["2"],
      "tab.hoverBackground": theme_color_humba01_design_style["1"],
      "tab.inactiveBackground": theme_color_humba01_design_style["3"],
      "tab.inactiveForeground": "#9D9D9D",
      "tab.unfocusedActiveBorder": theme_color_humba01_design_style["1"],
      "tab.unfocusedActiveBorderTop": theme_color_humba01_design_style["2"],
      "tab.unfocusedHoverBackground": theme_color_humba01_design_style["1"],
      "terminal.foreground": "#ffffff",
      "terminal.tab.activeBorder": theme_color_humba01_design_style["1"],
      "textBlockQuote.background": theme_color_humba01_design_style["2"],
      "textBlockQuote.border": "#616161",
      "textCodeBlock.background": theme_color_humba01_design_style["2"],
      "textLink.activeForeground": "#4daafc",
      "textLink.foreground": "#4daafc",
      "textPreformat.foreground": "#D0D0D0",
      "textPreformat.background": theme_color_humba01_design_style["4"],
      "textSeparator.foreground": theme_color_humba01_design_style["4"],
      "titleBar.activeBackground": theme_color_humba01_design_style["3"],
      "titleBar.activeForeground": "#CCCCCC",
      "titleBar.border": theme_color_humba01_design_style["2"],
      "titleBar.inactiveBackground": theme_color_humba01_design_style["1"],
      "titleBar.inactiveForeground": "#9D9D9D",
      "welcomePage.tileBackground": theme_color_humba01_design_style["2"],
      "welcomePage.progress.foreground": theme_color_humba01_design_style["1"],
      "widget.border": theme_color_humba01_design_style["4"],
      "statusBar.background": "#000000",
      "statusBar.foreground": "#FFFFFF",
      "statusBarItem.remoteBackground": "#000000",
      "statusBarItem.remoteForeground": "#FFFFFF",
      "editorBracketHighlight.foreground1": "#7200cf",
      "editorBracketHighlight.foreground2": "#9216f7",
      "editorBracketHighlight.foreground3": "#a332ff",
      "editorBracketHighlight.foreground4": "#b04fff",
      "editorBracketHighlight.foreground5": "#c075fd",
      "editorBracketHighlight.foreground6": "#d8acfc",
    };
  },
  THEME_WINTER_DAY = (): VscodeColorTheme["colors"] => {
    return {
      "editor.background": theme_color_winter_day["1"],
      "activityBar.activeBorder": "#ffffff",
      "activityBar.background": theme_color_winter_day["3"],
      "activityBar.border": theme_color_winter_day["2"],
      "activityBar.foreground": "#D7D7D7",
      "activityBar.inactiveForeground": "#868686",
      "activityBarBadge.background": theme_color_winter_day["1"],
      "activityBarBadge.foreground": "#FFFFFF",
      "badge.background": "#616161",
      "badge.foreground": "#F8F8F8",
      "button.background": theme_color_winter_day["1"],
      "button.border": "#FFFFFF12",
      "button.foreground": "#FFFFFF",
      "editor.lineHighlightBackground": theme_color_winter_day["2"],
      "button.hoverBackground": theme_color_winter_day["1"],
      "button.secondaryBackground": theme_color_winter_day["4"],
      "button.secondaryForeground": "#CCCCCC",
      "button.secondaryHoverBackground": theme_color_winter_day["4"],
      "chat.slashCommandBackground": "#26477866",
      "chat.slashCommandForeground": "#85B6FF",
      "chat.editedFileForeground": "#E2C08D",
      "checkbox.background": theme_color_winter_day["4"],
      "checkbox.border": theme_color_winter_day["4"],
      "debugToolBar.background": theme_color_winter_day["3"],
      descriptionForeground: "#9D9D9D",
      "dropdown.background": theme_color_winter_day["4"],
      "dropdown.border": theme_color_winter_day["4"],
      "dropdown.foreground": "#CCCCCC",
      "dropdown.listBackground": theme_color_winter_day["1"],
      "list.hoverBackground": theme_color_winter_day["1"],
      "list.activeSelectionBackground": theme_color_winter_day["1"],
      "list.inactiveSelectionBackground": theme_color_winter_day["1"] + "cc",
      "editor.findMatchBackground": "#9E6A03",
      "editor.foreground": "#ffffff",
      "editorGroup.border": "#FFFFFF17",
      "editorGroupHeader.tabsBackground": theme_color_winter_day["3"],
      "editorGroupHeader.tabsBorder": theme_color_winter_day["2"],
      "editorGutter.addedBackground": "#2EA043",
      "editorGutter.deletedBackground": "#F85149",
      "editorGutter.modifiedBackground": "#ffffff",
      "editorLineNumber.activeForeground": "#CCCCCC",
      "editorLineNumber.foreground": "#6E7681",
      "editorOverviewRuler.border": "#010409",
      "editorWidget.background": theme_color_winter_day["1"],
      errorForeground: "#F85149",
      focusBorder: theme_color_winter_day["1"],
      foreground: "#CCCCCC",
      "icon.foreground": "#CCCCCC",
      "input.background": theme_color_winter_day["4"],
      "input.border": theme_color_winter_day["4"],
      "input.foreground": "#CCCCCC",
      "input.placeholderForeground": "#989898",
      "inputOption.activeBackground": theme_color_winter_day["1"] + "82",
      "inputOption.activeBorder": theme_color_winter_day["1"],
      "keybindingLabel.foreground": "#CCCCCC",
      "menu.background": theme_color_winter_day["1"],
      "menu.selectionBackground": theme_color_winter_day["1"],
      "notificationCenterHeader.background": theme_color_winter_day["1"],
      "notificationCenterHeader.foreground": "#CCCCCC",
      "notifications.background": theme_color_winter_day["1"],
      "notifications.border": theme_color_winter_day["2"],
      "notifications.foreground": "#CCCCCC",
      "panel.background": theme_color_winter_day["3"],
      "panel.border": theme_color_winter_day["2"],
      "panelInput.border": theme_color_winter_day["2"],
      "panelTitle.activeBorder": theme_color_winter_day["1"],
      "panelTitle.activeForeground": "#CCCCCC",
      "panelTitle.inactiveForeground": "#9D9D9D",
      "peekViewEditor.background": theme_color_winter_day["1"],
      "peekViewEditor.matchHighlightBackground":
        theme_color_winter_day["1"] + "66",
      "peekViewResult.background": theme_color_winter_day["1"],
      "peekViewResult.matchHighlightBackground":
        theme_color_winter_day["1"] + "66",
      "pickerGroup.border": theme_color_winter_day["4"],
      "progressBar.background": theme_color_winter_day["1"],
      "quickInput.background": theme_color_winter_day["4"],
      "quickInput.foreground": "#CCCCCC",
      "settings.dropdownBackground": theme_color_winter_day["4"],
      "settings.dropdownBorder": theme_color_winter_day["4"],
      "settings.headerForeground": "#FFFFFF",
      "settings.modifiedItemIndicator": theme_color_winter_day["1"] + "66",
      "sideBar.background": theme_color_winter_day["3"],
      "sideBar.border": theme_color_winter_day["2"],
      "sideBar.foreground": "#CCCCCC",
      "sideBarSectionHeader.background": theme_color_winter_day["3"],
      "sideBarSectionHeader.border": theme_color_winter_day["2"],
      "sideBarSectionHeader.foreground": "#CCCCCC",
      "sideBarTitle.foreground": "#CCCCCC",
      "statusBar.border": theme_color_winter_day["2"],
      "statusBar.debuggingBackground": theme_color_winter_day["1"],
      "statusBar.debuggingForeground": "#FFFFFF",
      "statusBar.focusBorder": theme_color_winter_day["1"],
      "statusBar.noFolderBackground": theme_color_winter_day["1"],
      "statusBarItem.focusBorder": theme_color_winter_day["1"],
      "statusBarItem.prominentBackground": "#6E768166",
      "tab.activeBackground": theme_color_winter_day["1"],
      "tab.activeBorder": theme_color_winter_day["1"],
      "tab.activeBorderTop": theme_color_winter_day["1"],
      "tab.activeForeground": "#FFFFFF",
      "tab.selectedBorderTop": "#6caddf",
      "tab.border": theme_color_winter_day["2"],
      "tab.hoverBackground": theme_color_winter_day["1"],
      "tab.inactiveBackground": theme_color_winter_day["3"],
      "tab.inactiveForeground": "#9D9D9D",
      "tab.unfocusedActiveBorder": theme_color_winter_day["1"],
      "tab.unfocusedActiveBorderTop": theme_color_winter_day["2"],
      "tab.unfocusedHoverBackground": theme_color_winter_day["1"],
      "terminal.foreground": "#ffffff",
      "terminal.tab.activeBorder": theme_color_winter_day["1"],
      "textBlockQuote.background": theme_color_winter_day["2"],
      "textBlockQuote.border": "#616161",
      "textCodeBlock.background": theme_color_winter_day["2"],
      "textLink.activeForeground": "#4daafc",
      "textLink.foreground": "#4daafc",
      "textPreformat.foreground": "#D0D0D0",
      "textPreformat.background": theme_color_winter_day["4"],
      "textSeparator.foreground": theme_color_winter_day["4"],
      "titleBar.activeBackground": theme_color_winter_day["3"],
      "titleBar.activeForeground": "#CCCCCC",
      "titleBar.border": theme_color_winter_day["2"],
      "titleBar.inactiveBackground": theme_color_winter_day["1"],
      "titleBar.inactiveForeground": "#9D9D9D",
      "welcomePage.tileBackground": theme_color_winter_day["2"],
      "welcomePage.progress.foreground": theme_color_winter_day["1"],
      "widget.border": theme_color_winter_day["4"],
      "statusBar.background": "#000000",
      "statusBar.foreground": "#FFFFFF",
      "statusBarItem.remoteBackground": "#000000",
      "statusBarItem.remoteForeground": "#FFFFFF",
      "editorBracketHighlight.foreground1": "#7200cf",
      "editorBracketHighlight.foreground2": "#9216f7",
      "editorBracketHighlight.foreground3": "#a332ff",
      "editorBracketHighlight.foreground4": "#b04fff",
      "editorBracketHighlight.foreground5": "#c075fd",
      "editorBracketHighlight.foreground6": "#d8acfc"
    };
  },
  THEME_CAPPUCCINO = (): VscodeColorTheme["colors"] => {
    return {
      "editor.background": theme_color_cappuccino["1"],
      "activityBar.activeBorder": "#ffffff",
      "activityBar.background": theme_color_cappuccino["3"],
      "activityBar.border": theme_color_cappuccino["2"],
      "activityBar.foreground": "#D7D7D7",
      "activityBar.inactiveForeground": "#868686",
      "activityBarBadge.background": theme_color_cappuccino["1"],
      "activityBarBadge.foreground": "#FFFFFF",
      "badge.background": "#616161",
      "badge.foreground": "#F8F8F8",
      "button.background": theme_color_cappuccino["1"],
      "button.border": "#FFFFFF12",
      "button.foreground": "#FFFFFF",
      "editor.lineHighlightBackground": theme_color_cappuccino["2"],
      "button.hoverBackground": theme_color_cappuccino["1"],
      "button.secondaryBackground": theme_color_cappuccino["4"],
      "button.secondaryForeground": "#CCCCCC",
      "button.secondaryHoverBackground": theme_color_cappuccino["4"],
      "chat.slashCommandBackground": "#26477866",
      "chat.slashCommandForeground": "#85B6FF",
      "chat.editedFileForeground": "#E2C08D",
      "checkbox.background": theme_color_cappuccino["4"],
      "checkbox.border": theme_color_cappuccino["4"],
      "debugToolBar.background": theme_color_cappuccino["3"],
      descriptionForeground: "#9D9D9D",
      "dropdown.background": theme_color_cappuccino["4"],
      "dropdown.border": theme_color_cappuccino["4"],
      "dropdown.foreground": "#CCCCCC",
      "dropdown.listBackground": theme_color_cappuccino["1"],
      "list.hoverBackground": theme_color_cappuccino["1"],
      "list.activeSelectionBackground": theme_color_cappuccino["1"],
      "list.inactiveSelectionBackground": theme_color_cappuccino["1"] + "cc",
      "editor.findMatchBackground": "#9E6A03",
      "editor.foreground": "#ffffff",
      "editorGroup.border": "#FFFFFF17",
      "editorGroupHeader.tabsBackground": theme_color_cappuccino["3"],
      "editorGroupHeader.tabsBorder": theme_color_cappuccino["2"],
      "editorGutter.addedBackground": "#2EA043",
      "editorGutter.deletedBackground": "#F85149",
      "editorGutter.modifiedBackground": "#ffffff",
      "editorLineNumber.activeForeground": "#CCCCCC",
      "editorLineNumber.foreground": "#6E7681",
      "editorOverviewRuler.border": "#010409",
      "editorWidget.background": theme_color_cappuccino["1"],
      errorForeground: "#F85149",
      focusBorder: theme_color_cappuccino["1"],
      foreground: "#CCCCCC",
      "icon.foreground": "#CCCCCC",
      "input.background": theme_color_cappuccino["4"],
      "input.border": theme_color_cappuccino["4"],
      "input.foreground": "#CCCCCC",
      "input.placeholderForeground": "#989898",
      "inputOption.activeBackground": theme_color_cappuccino["1"] + "82",
      "inputOption.activeBorder": theme_color_cappuccino["1"],
      "keybindingLabel.foreground": "#CCCCCC",
      "menu.background": theme_color_cappuccino["1"],
      "menu.selectionBackground": theme_color_cappuccino["1"],
      "notificationCenterHeader.background": theme_color_cappuccino["1"],
      "notificationCenterHeader.foreground": "#CCCCCC",
      "notifications.background": theme_color_cappuccino["1"],
      "notifications.border": theme_color_cappuccino["2"],
      "notifications.foreground": "#CCCCCC",
      "panel.background": theme_color_cappuccino["3"],
      "panel.border": theme_color_cappuccino["2"],
      "panelInput.border": theme_color_cappuccino["2"],
      "panelTitle.activeBorder": theme_color_cappuccino["1"],
      "panelTitle.activeForeground": "#CCCCCC",
      "panelTitle.inactiveForeground": "#9D9D9D",
      "peekViewEditor.background": theme_color_cappuccino["1"],
      "peekViewEditor.matchHighlightBackground":
        theme_color_cappuccino["1"] + "66",
      "peekViewResult.background": theme_color_cappuccino["1"],
      "peekViewResult.matchHighlightBackground":
        theme_color_cappuccino["1"] + "66",
      "pickerGroup.border": theme_color_cappuccino["4"],
      "progressBar.background": theme_color_cappuccino["1"],
      "quickInput.background": theme_color_cappuccino["4"],
      "quickInput.foreground": "#CCCCCC",
      "settings.dropdownBackground": theme_color_cappuccino["4"],
      "settings.dropdownBorder": theme_color_cappuccino["4"],
      "settings.headerForeground": "#FFFFFF",
      "settings.modifiedItemIndicator": theme_color_cappuccino["1"] + "66",
      "sideBar.background": theme_color_cappuccino["3"],
      "sideBar.border": theme_color_cappuccino["2"],
      "sideBar.foreground": "#CCCCCC",
      "sideBarSectionHeader.background": theme_color_cappuccino["3"],
      "sideBarSectionHeader.border": theme_color_cappuccino["2"],
      "sideBarSectionHeader.foreground": "#CCCCCC",
      "sideBarTitle.foreground": "#CCCCCC",
      "statusBar.border": theme_color_cappuccino["2"],
      "statusBar.debuggingBackground": theme_color_cappuccino["1"],
      "statusBar.debuggingForeground": "#FFFFFF",
      "statusBar.focusBorder": theme_color_cappuccino["1"],
      "statusBar.noFolderBackground": theme_color_cappuccino["1"],
      "statusBarItem.focusBorder": theme_color_cappuccino["1"],
      "statusBarItem.prominentBackground": "#6E768166",
      "tab.activeBackground": theme_color_cappuccino["1"],
      "tab.activeBorder": theme_color_cappuccino["1"],
      "tab.activeBorderTop": theme_color_cappuccino["1"],
      "tab.activeForeground": "#FFFFFF",
      "tab.selectedBorderTop": "#6caddf",
      "tab.border": theme_color_cappuccino["2"],
      "tab.hoverBackground": theme_color_cappuccino["1"],
      "tab.inactiveBackground": theme_color_cappuccino["3"],
      "tab.inactiveForeground": "#9D9D9D",
      "tab.unfocusedActiveBorder": theme_color_cappuccino["1"],
      "tab.unfocusedActiveBorderTop": theme_color_cappuccino["2"],
      "tab.unfocusedHoverBackground": theme_color_cappuccino["1"],
      "terminal.foreground": "#ffffff",
      "terminal.tab.activeBorder": theme_color_cappuccino["1"],
      "textBlockQuote.background": theme_color_cappuccino["2"],
      "textBlockQuote.border": "#616161",
      "textCodeBlock.background": theme_color_cappuccino["2"],
      "textLink.activeForeground": "#4daafc",
      "textLink.foreground": "#4daafc",
      "textPreformat.foreground": "#D0D0D0",
      "textPreformat.background": theme_color_cappuccino["4"],
      "textSeparator.foreground": theme_color_cappuccino["4"],
      "titleBar.activeBackground": theme_color_cappuccino["3"],
      "titleBar.activeForeground": "#CCCCCC",
      "titleBar.border": theme_color_cappuccino["2"],
      "titleBar.inactiveBackground": theme_color_cappuccino["1"],
      "titleBar.inactiveForeground": "#9D9D9D",
      "welcomePage.tileBackground": theme_color_cappuccino["2"],
      "welcomePage.progress.foreground": theme_color_cappuccino["1"],
      "widget.border": theme_color_cappuccino["4"],
      "statusBar.background": "#000000",
      "statusBar.foreground": "#FFFFFF",
      "statusBarItem.remoteBackground": "#000000",
      "statusBarItem.remoteForeground": "#FFFFFF",
      "editorBracketHighlight.foreground1": "#7200cf",
      "editorBracketHighlight.foreground2": "#9216f7",
      "editorBracketHighlight.foreground3": "#a332ff",
      "editorBracketHighlight.foreground4": "#b04fff",
      "editorBracketHighlight.foreground5": "#c075fd",
      "editorBracketHighlight.foreground6": "#d8acfc",
    };
  },
  THEME_RED_VELVET = (): VscodeColorTheme["colors"] => {
    return {
      "editor.background": theme_color_red_velvet["1"],
      "activityBar.activeBorder": "#ffffff",
      "activityBar.background": theme_color_red_velvet["3"],
      "activityBar.border": theme_color_red_velvet["2"],
      "activityBar.foreground": "#D7D7D7",
      "activityBar.inactiveForeground": "#868686",
      "activityBarBadge.background": theme_color_red_velvet["1"],
      "activityBarBadge.foreground": "#FFFFFF",
      "badge.background": "#616161",
      "badge.foreground": "#F8F8F8",
      "button.background": theme_color_red_velvet["1"],
      "button.border": "#FFFFFF12",
      "button.foreground": "#FFFFFF",
      "editor.lineHighlightBackground": theme_color_red_velvet["2"],
      "button.hoverBackground": theme_color_red_velvet["1"],
      "button.secondaryBackground": theme_color_red_velvet["4"],
      "button.secondaryForeground": "#CCCCCC",
      "button.secondaryHoverBackground": theme_color_red_velvet["4"],
      "chat.slashCommandBackground": "#26477866",
      "chat.slashCommandForeground": "#85B6FF",
      "chat.editedFileForeground": "#E2C08D",
      "checkbox.background": theme_color_red_velvet["4"],
      "checkbox.border": theme_color_red_velvet["4"],
      "debugToolBar.background": theme_color_red_velvet["3"],
      descriptionForeground: "#9D9D9D",
      "dropdown.background": theme_color_red_velvet["4"],
      "dropdown.border": theme_color_red_velvet["4"],
      "dropdown.foreground": "#CCCCCC",
      "dropdown.listBackground": theme_color_red_velvet["1"],
      "list.hoverBackground": theme_color_red_velvet["1"],
      "list.activeSelectionBackground": theme_color_red_velvet["1"],
      "list.inactiveSelectionBackground": theme_color_red_velvet["1"] + "cc",
      "editor.findMatchBackground": "#9E6A03",
      "editor.foreground": "#ffffff",
      "editorGroup.border": "#FFFFFF17",
      "editorGroupHeader.tabsBackground": theme_color_red_velvet["3"],
      "editorGroupHeader.tabsBorder": theme_color_red_velvet["2"],
      "editorGutter.addedBackground": "#2EA043",
      "editorGutter.deletedBackground": "#F85149",
      "editorGutter.modifiedBackground": "#ffffff",
      "editorLineNumber.activeForeground": "#CCCCCC",
      "editorLineNumber.foreground": "#6E7681",
      "editorOverviewRuler.border": "#010409",
      "editorWidget.background": theme_color_red_velvet["1"],
      errorForeground: "#F85149",
      focusBorder: theme_color_red_velvet["1"],
      foreground: "#CCCCCC",
      "icon.foreground": "#CCCCCC",
      "input.background": theme_color_red_velvet["4"],
      "input.border": theme_color_red_velvet["4"],
      "input.foreground": "#CCCCCC",
      "input.placeholderForeground": "#989898",
      "inputOption.activeBackground": theme_color_red_velvet["1"] + "82",
      "inputOption.activeBorder": theme_color_red_velvet["1"],
      "keybindingLabel.foreground": "#CCCCCC",
      "menu.background": theme_color_red_velvet["1"],
      "menu.selectionBackground": theme_color_red_velvet["1"],
      "notificationCenterHeader.background": theme_color_red_velvet["1"],
      "notificationCenterHeader.foreground": "#CCCCCC",
      "notifications.background": theme_color_red_velvet["1"],
      "notifications.border": theme_color_red_velvet["2"],
      "notifications.foreground": "#CCCCCC",
      "panel.background": theme_color_red_velvet["3"],
      "panel.border": theme_color_red_velvet["2"],
      "panelInput.border": theme_color_red_velvet["2"],
      "panelTitle.activeBorder": theme_color_red_velvet["1"],
      "panelTitle.activeForeground": "#CCCCCC",
      "panelTitle.inactiveForeground": "#9D9D9D",
      "peekViewEditor.background": theme_color_red_velvet["1"],
      "peekViewEditor.matchHighlightBackground":
        theme_color_red_velvet["1"] + "66",
      "peekViewResult.background": theme_color_red_velvet["1"],
      "peekViewResult.matchHighlightBackground":
        theme_color_red_velvet["1"] + "66",
      "pickerGroup.border": theme_color_red_velvet["4"],
      "progressBar.background": theme_color_red_velvet["1"],
      "quickInput.background": theme_color_red_velvet["4"],
      "quickInput.foreground": "#CCCCCC",
      "settings.dropdownBackground": theme_color_red_velvet["4"],
      "settings.dropdownBorder": theme_color_red_velvet["4"],
      "settings.headerForeground": "#FFFFFF",
      "settings.modifiedItemIndicator": theme_color_red_velvet["1"] + "66",
      "sideBar.background": theme_color_red_velvet["3"],
      "sideBar.border": theme_color_red_velvet["2"],
      "sideBar.foreground": "#CCCCCC",
      "sideBarSectionHeader.background": theme_color_red_velvet["3"],
      "sideBarSectionHeader.border": theme_color_red_velvet["2"],
      "sideBarSectionHeader.foreground": "#CCCCCC",
      "sideBarTitle.foreground": "#CCCCCC",
      "statusBar.border": theme_color_red_velvet["2"],
      "statusBar.debuggingBackground": theme_color_red_velvet["1"],
      "statusBar.debuggingForeground": "#FFFFFF",
      "statusBar.focusBorder": theme_color_red_velvet["1"],
      "statusBar.noFolderBackground": theme_color_red_velvet["1"],
      "statusBarItem.focusBorder": theme_color_red_velvet["1"],
      "statusBarItem.prominentBackground": "#6E768166",
      "tab.activeBackground": theme_color_red_velvet["1"],
      "tab.activeBorder": theme_color_red_velvet["1"],
      "tab.activeBorderTop": theme_color_red_velvet["1"],
      "tab.activeForeground": "#FFFFFF",
      "tab.selectedBorderTop": "#6caddf",
      "tab.border": theme_color_red_velvet["2"],
      "tab.hoverBackground": theme_color_red_velvet["1"],
      "tab.inactiveBackground": theme_color_red_velvet["3"],
      "tab.inactiveForeground": "#9D9D9D",
      "tab.unfocusedActiveBorder": theme_color_red_velvet["1"],
      "tab.unfocusedActiveBorderTop": theme_color_red_velvet["2"],
      "tab.unfocusedHoverBackground": theme_color_red_velvet["1"],
      "terminal.foreground": "#ffffff",
      "terminal.tab.activeBorder": theme_color_red_velvet["1"],
      "textBlockQuote.background": theme_color_red_velvet["2"],
      "textBlockQuote.border": "#616161",
      "textCodeBlock.background": theme_color_red_velvet["2"],
      "textLink.activeForeground": "#4daafc",
      "textLink.foreground": "#4daafc",
      "textPreformat.foreground": "#D0D0D0",
      "textPreformat.background": theme_color_red_velvet["4"],
      "textSeparator.foreground": theme_color_red_velvet["4"],
      "titleBar.activeBackground": theme_color_red_velvet["3"],
      "titleBar.activeForeground": "#CCCCCC",
      "titleBar.border": theme_color_red_velvet["2"],
      "titleBar.inactiveBackground": theme_color_red_velvet["1"],
      "titleBar.inactiveForeground": "#9D9D9D",
      "welcomePage.tileBackground": theme_color_red_velvet["2"],
      "welcomePage.progress.foreground": theme_color_red_velvet["1"],
      "widget.border": theme_color_red_velvet["4"],
      "statusBar.background": "#000000",
      "statusBar.foreground": "#FFFFFF",
      "statusBarItem.remoteBackground": "#000000",
      "statusBarItem.remoteForeground": "#FFFFFF",
      "editorBracketHighlight.foreground1": "#7200cf",
      "editorBracketHighlight.foreground2": "#9216f7",
      "editorBracketHighlight.foreground3": "#a332ff",
      "editorBracketHighlight.foreground4": "#b04fff",
      "editorBracketHighlight.foreground5": "#c075fd",
      "editorBracketHighlight.foreground6": "#d8acfc",
    };
  },
  THEME_SUNSHINE = (): VscodeColorTheme["colors"] => {
    return {
      "editor.background": theme_color_sunshine["1"],
      "activityBar.activeBorder": "#ffffff",
      "activityBar.background": theme_color_sunshine["3"],
      "activityBar.border": theme_color_sunshine["2"],
      "activityBar.foreground": "#D7D7D7",
      "activityBar.inactiveForeground": "#868686",
      "activityBarBadge.background": theme_color_sunshine["1"],
      "activityBarBadge.foreground": "#FFFFFF",
      "badge.background": "#616161",
      "badge.foreground": "#F8F8F8",
      "button.background": theme_color_sunshine["1"],
      "button.border": "#FFFFFF12",
      "button.foreground": "#FFFFFF",
      "editor.lineHighlightBackground": theme_color_sunshine["2"],
      "button.hoverBackground": theme_color_sunshine["1"],
      "button.secondaryBackground": theme_color_sunshine["4"],
      "button.secondaryForeground": "#CCCCCC",
      "button.secondaryHoverBackground": theme_color_sunshine["4"],
      "chat.slashCommandBackground": "#26477866",
      "chat.slashCommandForeground": "#85B6FF",
      "chat.editedFileForeground": "#E2C08D",
      "checkbox.background": theme_color_sunshine["4"],
      "checkbox.border": theme_color_sunshine["4"],
      "debugToolBar.background": theme_color_sunshine["3"],
      descriptionForeground: "#9D9D9D",
      "dropdown.background": theme_color_sunshine["4"],
      "dropdown.border": theme_color_sunshine["4"],
      "dropdown.foreground": "#CCCCCC",
      "dropdown.listBackground": theme_color_sunshine["1"],
      "list.hoverBackground": theme_color_sunshine["1"],
      "list.activeSelectionBackground": theme_color_sunshine["1"],
      "list.inactiveSelectionBackground": theme_color_sunshine["1"] + "cc",
      "editor.findMatchBackground": "#9E6A03",
      "editor.foreground": "#ffffff",
      "editorGroup.border": "#FFFFFF17",
      "editorGroupHeader.tabsBackground": theme_color_sunshine["3"],
      "editorGroupHeader.tabsBorder": theme_color_sunshine["2"],
      "editorGutter.addedBackground": "#2EA043",
      "editorGutter.deletedBackground": "#F85149",
      "editorGutter.modifiedBackground": "#ffffff",
      "editorLineNumber.activeForeground": "#CCCCCC",
      "editorLineNumber.foreground": "#6E7681",
      "editorOverviewRuler.border": "#010409",
      "editorWidget.background": theme_color_sunshine["1"],
      errorForeground: "#F85149",
      focusBorder: theme_color_sunshine["1"],
      foreground: "#CCCCCC",
      "icon.foreground": "#CCCCCC",
      "input.background": theme_color_sunshine["4"],
      "input.border": theme_color_sunshine["4"],
      "input.foreground": "#CCCCCC",
      "input.placeholderForeground": "#989898",
      "inputOption.activeBackground": theme_color_sunshine["1"] + "82",
      "inputOption.activeBorder": theme_color_sunshine["1"],
      "keybindingLabel.foreground": "#CCCCCC",
      "menu.background": theme_color_sunshine["1"],
      "menu.selectionBackground": theme_color_sunshine["1"],
      "notificationCenterHeader.background": theme_color_sunshine["1"],
      "notificationCenterHeader.foreground": "#CCCCCC",
      "notifications.background": theme_color_sunshine["1"],
      "notifications.border": theme_color_sunshine["2"],
      "notifications.foreground": "#CCCCCC",
      "panel.background": theme_color_sunshine["3"],
      "panel.border": theme_color_sunshine["2"],
      "panelInput.border": theme_color_sunshine["2"],
      "panelTitle.activeBorder": theme_color_sunshine["1"],
      "panelTitle.activeForeground": "#CCCCCC",
      "panelTitle.inactiveForeground": "#9D9D9D",
      "peekViewEditor.background": theme_color_sunshine["1"],
      "peekViewEditor.matchHighlightBackground":
        theme_color_sunshine["1"] + "66",
      "peekViewResult.background": theme_color_sunshine["1"],
      "peekViewResult.matchHighlightBackground":
        theme_color_sunshine["1"] + "66",
      "pickerGroup.border": theme_color_sunshine["4"],
      "progressBar.background": theme_color_sunshine["1"],
      "quickInput.background": theme_color_sunshine["4"],
      "quickInput.foreground": "#CCCCCC",
      "settings.dropdownBackground": theme_color_sunshine["4"],
      "settings.dropdownBorder": theme_color_sunshine["4"],
      "settings.headerForeground": "#FFFFFF",
      "settings.modifiedItemIndicator": theme_color_sunshine["1"] + "66",
      "sideBar.background": theme_color_sunshine["3"],
      "sideBar.border": theme_color_sunshine["2"],
      "sideBar.foreground": "#CCCCCC",
      "sideBarSectionHeader.background": theme_color_sunshine["3"],
      "sideBarSectionHeader.border": theme_color_sunshine["2"],
      "sideBarSectionHeader.foreground": "#CCCCCC",
      "sideBarTitle.foreground": "#CCCCCC",
      "statusBar.border": theme_color_sunshine["2"],
      "statusBar.debuggingBackground": theme_color_sunshine["1"],
      "statusBar.debuggingForeground": "#FFFFFF",
      "statusBar.focusBorder": theme_color_sunshine["1"],
      "statusBar.noFolderBackground": theme_color_sunshine["1"],
      "statusBarItem.focusBorder": theme_color_sunshine["1"],
      "statusBarItem.prominentBackground": "#6E768166",
      "tab.activeBackground": theme_color_sunshine["1"],
      "tab.activeBorder": theme_color_sunshine["1"],
      "tab.activeBorderTop": theme_color_sunshine["1"],
      "tab.activeForeground": "#FFFFFF",
      "tab.selectedBorderTop": "#6caddf",
      "tab.border": theme_color_sunshine["2"],
      "tab.hoverBackground": theme_color_sunshine["1"],
      "tab.inactiveBackground": theme_color_sunshine["3"],
      "tab.inactiveForeground": "#9D9D9D",
      "tab.unfocusedActiveBorder": theme_color_sunshine["1"],
      "tab.unfocusedActiveBorderTop": theme_color_sunshine["2"],
      "tab.unfocusedHoverBackground": theme_color_sunshine["1"],
      "terminal.foreground": "#ffffff",
      "terminal.tab.activeBorder": theme_color_sunshine["1"],
      "textBlockQuote.background": theme_color_sunshine["2"],
      "textBlockQuote.border": "#616161",
      "textCodeBlock.background": theme_color_sunshine["2"],
      "textLink.activeForeground": "#4daafc",
      "textLink.foreground": "#4daafc",
      "textPreformat.foreground": "#D0D0D0",
      "textPreformat.background": theme_color_sunshine["4"],
      "textSeparator.foreground": theme_color_sunshine["4"],
      "titleBar.activeBackground": theme_color_sunshine["3"],
      "titleBar.activeForeground": "#CCCCCC",
      "titleBar.border": theme_color_sunshine["2"],
      "titleBar.inactiveBackground": theme_color_sunshine["1"],
      "titleBar.inactiveForeground": "#9D9D9D",
      "welcomePage.tileBackground": theme_color_sunshine["2"],
      "welcomePage.progress.foreground": theme_color_sunshine["1"],
      "widget.border": theme_color_sunshine["4"],
      "statusBar.background": "#000000",
      "statusBar.foreground": "#FFFFFF",
      "statusBarItem.remoteBackground": "#000000",
      "statusBarItem.remoteForeground": "#FFFFFF",
      "editorBracketHighlight.foreground1": "#7200cf",
      "editorBracketHighlight.foreground2": "#9216f7",
      "editorBracketHighlight.foreground3": "#a332ff",
      "editorBracketHighlight.foreground4": "#b04fff",
      "editorBracketHighlight.foreground5": "#c075fd",
      "editorBracketHighlight.foreground6": "#d8acfc",
    };
  },
  THEME_MIDNIGHT = (): VscodeColorTheme["colors"] => {
    return {
      "editor.background": theme_color_midnight["1"],
      "activityBar.activeBorder": "#ffffff",
      "activityBar.background": theme_color_midnight["3"],
      "activityBar.border": theme_color_midnight["2"],
      "activityBar.foreground": "#D7D7D7",
      "activityBar.inactiveForeground": "#868686",
      "activityBarBadge.background": theme_color_midnight["1"],
      "activityBarBadge.foreground": "#FFFFFF",
      "badge.background": "#616161",
      "badge.foreground": "#F8F8F8",
      "button.background": theme_color_midnight["1"],
      "button.border": "#FFFFFF12",
      "button.foreground": "#FFFFFF",
      "editor.lineHighlightBackground": theme_color_midnight["2"],
      "button.hoverBackground": theme_color_midnight["1"],
      "button.secondaryBackground": theme_color_midnight["4"],
      "button.secondaryForeground": "#CCCCCC",
      "button.secondaryHoverBackground": theme_color_midnight["4"],
      "chat.slashCommandBackground": "#26477866",
      "chat.slashCommandForeground": "#85B6FF",
      "chat.editedFileForeground": "#E2C08D",
      "checkbox.background": theme_color_midnight["4"],
      "checkbox.border": theme_color_midnight["4"],
      "debugToolBar.background": theme_color_midnight["3"],
      descriptionForeground: "#9D9D9D",
      "dropdown.background": theme_color_midnight["4"],
      "dropdown.border": theme_color_midnight["4"],
      "dropdown.foreground": "#CCCCCC",
      "dropdown.listBackground": theme_color_midnight["1"],
      "list.hoverBackground": theme_color_midnight["1"],
      "list.activeSelectionBackground": theme_color_midnight["1"],
      "list.inactiveSelectionBackground": theme_color_midnight["1"] + "cc",
      "editor.findMatchBackground": "#9E6A03",
      "editor.foreground": "#ffffff",
      "editorGroup.border": "#FFFFFF17",
      "editorGroupHeader.tabsBackground": theme_color_midnight["3"],
      "editorGroupHeader.tabsBorder": theme_color_midnight["2"],
      "editorGutter.addedBackground": "#2EA043",
      "editorGutter.deletedBackground": "#F85149",
      "editorGutter.modifiedBackground": "#ffffff",
      "editorLineNumber.activeForeground": "#CCCCCC",
      "editorLineNumber.foreground": "#6E7681",
      "editorOverviewRuler.border": "#010409",
      "editorWidget.background": theme_color_midnight["1"],
      errorForeground: "#F85149",
      focusBorder: theme_color_midnight["1"],
      foreground: "#CCCCCC",
      "icon.foreground": "#CCCCCC",
      "input.background": theme_color_midnight["4"],
      "input.border": theme_color_midnight["4"],
      "input.foreground": "#CCCCCC",
      "input.placeholderForeground": "#989898",
      "inputOption.activeBackground": theme_color_midnight["1"] + "82",
      "inputOption.activeBorder": theme_color_midnight["1"],
      "keybindingLabel.foreground": "#CCCCCC",
      "menu.background": theme_color_midnight["1"],
      "menu.selectionBackground": theme_color_midnight["1"],
      "notificationCenterHeader.background": theme_color_midnight["1"],
      "notificationCenterHeader.foreground": "#CCCCCC",
      "notifications.background": theme_color_midnight["1"],
      "notifications.border": theme_color_midnight["2"],
      "notifications.foreground": "#CCCCCC",
      "panel.background": theme_color_midnight["3"],
      "panel.border": theme_color_midnight["2"],
      "panelInput.border": theme_color_midnight["2"],
      "panelTitle.activeBorder": theme_color_midnight["1"],
      "panelTitle.activeForeground": "#CCCCCC",
      "panelTitle.inactiveForeground": "#9D9D9D",
      "peekViewEditor.background": theme_color_midnight["1"],
      "peekViewEditor.matchHighlightBackground":
        theme_color_midnight["1"] + "66",
      "peekViewResult.background": theme_color_midnight["1"],
      "peekViewResult.matchHighlightBackground":
        theme_color_midnight["1"] + "66",
      "pickerGroup.border": theme_color_midnight["4"],
      "progressBar.background": theme_color_midnight["1"],
      "quickInput.background": theme_color_midnight["4"],
      "quickInput.foreground": "#CCCCCC",
      "settings.dropdownBackground": theme_color_midnight["4"],
      "settings.dropdownBorder": theme_color_midnight["4"],
      "settings.headerForeground": "#FFFFFF",
      "settings.modifiedItemIndicator": theme_color_midnight["1"] + "66",
      "sideBar.background": theme_color_midnight["3"],
      "sideBar.border": theme_color_midnight["2"],
      "sideBar.foreground": "#CCCCCC",
      "sideBarSectionHeader.background": theme_color_midnight["3"],
      "sideBarSectionHeader.border": theme_color_midnight["2"],
      "sideBarSectionHeader.foreground": "#CCCCCC",
      "sideBarTitle.foreground": "#CCCCCC",
      "statusBar.border": theme_color_midnight["2"],
      "statusBar.debuggingBackground": theme_color_midnight["1"],
      "statusBar.debuggingForeground": "#FFFFFF",
      "statusBar.focusBorder": theme_color_midnight["1"],
      "statusBar.noFolderBackground": theme_color_midnight["1"],
      "statusBarItem.focusBorder": theme_color_midnight["1"],
      "statusBarItem.prominentBackground": "#6E768166",
      "tab.activeBackground": theme_color_midnight["1"],
      "tab.activeBorder": theme_color_midnight["1"],
      "tab.activeBorderTop": theme_color_midnight["1"],
      "tab.activeForeground": "#FFFFFF",
      "tab.selectedBorderTop": "#6caddf",
      "tab.border": theme_color_midnight["2"],
      "tab.hoverBackground": theme_color_midnight["1"],
      "tab.inactiveBackground": theme_color_midnight["3"],
      "tab.inactiveForeground": "#9D9D9D",
      "tab.unfocusedActiveBorder": theme_color_midnight["1"],
      "tab.unfocusedActiveBorderTop": theme_color_midnight["2"],
      "tab.unfocusedHoverBackground": theme_color_midnight["1"],
      "terminal.foreground": "#ffffff",
      "terminal.tab.activeBorder": theme_color_midnight["1"],
      "textBlockQuote.background": theme_color_midnight["2"],
      "textBlockQuote.border": "#616161",
      "textCodeBlock.background": theme_color_midnight["2"],
      "textLink.activeForeground": "#4daafc",
      "textLink.foreground": "#4daafc",
      "textPreformat.foreground": "#D0D0D0",
      "textPreformat.background": theme_color_midnight["4"],
      "textSeparator.foreground": theme_color_midnight["4"],
      "titleBar.activeBackground": theme_color_midnight["3"],
      "titleBar.activeForeground": "#CCCCCC",
      "titleBar.border": theme_color_midnight["2"],
      "titleBar.inactiveBackground": theme_color_midnight["1"],
      "titleBar.inactiveForeground": "#9D9D9D",
      "welcomePage.tileBackground": theme_color_midnight["2"],
      "welcomePage.progress.foreground": theme_color_midnight["1"],
      "widget.border": theme_color_midnight["4"],
      "statusBar.background": "#000000",
      "statusBar.foreground": "#FFFFFF",
      "statusBarItem.remoteBackground": "#000000",
      "statusBarItem.remoteForeground": "#FFFFFF",
      "editorBracketHighlight.foreground1": "#7200cf",
      "editorBracketHighlight.foreground2": "#9216f7",
      "editorBracketHighlight.foreground3": "#a332ff",
      "editorBracketHighlight.foreground4": "#b04fff",
      "editorBracketHighlight.foreground5": "#c075fd",
      "editorBracketHighlight.foreground6": "#d8acfc",
    };
  },
  HIGHLIGHT_VISUAL_STUDIO_CODE = (): VscodeColorTheme["tokenColors"] => {
    return [
      {
        name: "Function declarations",
        scope: [
          "entity.name.function",
          "support.function",
          "support.constant.handlebars",
          "source.powershell variable.other.member",
          "entity.name.operator.custom-literal", // See https://en.cppreference.com/w/cpp/language/user_literal
        ],
        settings: {
          foreground: "#DCDCAA",
        },
      },
      {
        name: "Types declaration and references",
        scope: [
          "support.class",
          "support.type",
          "entity.name.type",
          "entity.name.namespace",
          "entity.other.attribute",
          "entity.name.scope-resolution",
          "entity.name.class",
          "storage.type.numeric.go",
          "storage.type.byte.go",
          "storage.type.boolean.go",
          "storage.type.string.go",
          "storage.type.uintptr.go",
          "storage.type.error.go",
          "storage.type.rune.go",
          "storage.type.cs",
          "storage.type.generic.cs",
          "storage.type.modifier.cs",
          "storage.type.variable.cs",
          "storage.type.annotation.java",
          "storage.type.generic.java",
          "storage.type.java",
          "storage.type.object.array.java",
          "storage.type.primitive.array.java",
          "storage.type.primitive.java",
          "storage.type.token.java",
          "storage.type.groovy",
          "storage.type.annotation.groovy",
          "storage.type.parameters.groovy",
          "storage.type.generic.groovy",
          "storage.type.object.array.groovy",
          "storage.type.primitive.array.groovy",
          "storage.type.primitive.groovy",
        ],
        settings: {
          foreground: "#4EC9B0",
        },
      },
      {
        name: "Types declaration and references, TS grammar specific",
        scope: [
          "meta.type.cast.expr",
          "meta.type.new.expr",
          "support.constant.math",
          "support.constant.dom",
          "support.constant.json",
          "entity.other.inherited-class",
          "punctuation.separator.namespace.ruby",
        ],
        settings: {
          foreground: "#4EC9B0",
        },
      },
      {
        name: "Control flow / Special keywords",
        scope: [
          "keyword.control",
          "source.cpp keyword.operator.new",
          "keyword.operator.delete",
          "keyword.other.using",
          "keyword.other.directive.using",
          "keyword.other.operator",
          "entity.name.operator",
        ],
        settings: {
          foreground: "#C586C0",
        },
      },
      {
        name: "Variable and parameter name",
        scope: [
          "variable",
          "meta.definition.variable.name",
          "support.variable",
          "entity.name.variable",
          "constant.other.placeholder", // placeholders in strings
        ],
        settings: {
          foreground: "#9CDCFE",
        },
      },
      {
        name: "Constants and enums",
        scope: ["variable.other.constant", "variable.other.enummember"],
        settings: {
          foreground: "#4FC1FF",
        },
      },
      {
        name: "Object keys, TS grammar specific",
        scope: ["meta.object-literal.key"],
        settings: {
          foreground: "#9CDCFE",
        },
      },
      {
        name: "CSS property value",
        scope: [
          "support.constant.property-value",
          "support.constant.font-name",
          "support.constant.media-type",
          "support.constant.media",
          "constant.other.color.rgb-value",
          "constant.other.rgb-value",
          "support.constant.color",
        ],
        settings: {
          foreground: "#CE9178",
        },
      },
      {
        name: "Regular expression groups",
        scope: [
          "punctuation.definition.group.regexp",
          "punctuation.definition.group.assertion.regexp",
          "punctuation.definition.character-class.regexp",
          "punctuation.character.set.begin.regexp",
          "punctuation.character.set.end.regexp",
          "keyword.operator.negation.regexp",
          "support.other.parenthesis.regexp",
        ],
        settings: {
          foreground: "#CE9178",
        },
      },
      {
        scope: [
          "constant.character.character-class.regexp",
          "constant.other.character-class.set.regexp",
          "constant.other.character-class.regexp",
          "constant.character.set.regexp",
        ],
        settings: {
          foreground: "#d16969",
        },
      },
      {
        scope: ["keyword.operator.or.regexp", "keyword.control.anchor.regexp"],
        settings: {
          foreground: "#DCDCAA",
        },
      },
      {
        scope: "keyword.operator.quantifier.regexp",
        settings: {
          foreground: "#d7ba7d",
        },
      },
      {
        scope: ["constant.character", "constant.other.option"],
        settings: {
          foreground: "#569cd6",
        },
      },
      {
        scope: "constant.character.escape",
        settings: {
          foreground: "#d7ba7d",
        },
      },
      {
        scope: "entity.name.label",
        settings: {
          foreground: "#C8C8C8",
        },
      },
    ];
  },
  HIGHLIGHT_MONOKAI = (): VscodeColorTheme["tokenColors"] => {
    return [
      {
        settings: {
          foreground: "#F8F8F2",
        },
      },
      {
        scope: [
          "meta.embedded",
          "source.groovy.embedded",
          "string meta.image.inline.markdown",
          "variable.legacy.builtin.python",
        ],
        settings: {
          foreground: "#F8F8F2",
        },
      },
      {
        name: "Comment",
        scope: "comment",
        settings: {
          foreground: "#88846f",
        },
      },
      {
        name: "String",
        scope: "string",
        settings: {
          foreground: "#E6DB74",
        },
      },
      {
        name: "Template Definition",
        scope: [
          "punctuation.definition.template-expression",
          "punctuation.section.embedded",
        ],
        settings: {
          foreground: "#F92672",
        },
      },
      {
        name: "Reset JavaScript string interpolation expression",
        scope: ["meta.template.expression"],
        settings: {
          foreground: "#F8F8F2",
        },
      },
      {
        name: "Number",
        scope: "constant.numeric",
        settings: {
          foreground: "#AE81FF",
        },
      },
      {
        name: "Built-in constant",
        scope: "constant.language",
        settings: {
          foreground: "#AE81FF",
        },
      },
      {
        name: "User-defined constant",
        scope: "constant.character, constant.other",
        settings: {
          foreground: "#AE81FF",
        },
      },
      {
        name: "Variable",
        scope: "variable",
        settings: {
          fontStyle: "",
          foreground: "#F8F8F2",
        },
      },
      {
        name: "Keyword",
        scope: "keyword",
        settings: {
          foreground: "#F92672",
        },
      },
      {
        name: "Storage",
        scope: "storage",
        settings: {
          fontStyle: "",
          foreground: "#F92672",
        },
      },
      {
        name: "Storage type",
        scope: "storage.type",
        settings: {
          fontStyle: "italic",
          foreground: "#66D9EF",
        },
      },
      {
        name: "Class name",
        scope:
          "entity.name.type, entity.name.class, entity.name.namespace, entity.name.scope-resolution",
        settings: {
          fontStyle: "underline",
          foreground: "#A6E22E",
        },
      },
      {
        name: "Inherited class",
        scope: "entity.other.inherited-class",
        settings: {
          fontStyle: "italic underline",
          foreground: "#A6E22E",
        },
      },
      {
        name: "Function name",
        scope: "entity.name.function",
        settings: {
          fontStyle: "",
          foreground: "#A6E22E",
        },
      },
      {
        name: "Function argument",
        scope: "variable.parameter",
        settings: {
          fontStyle: "italic",
          foreground: "#ff633c",
        },
      },
      {
        name: "Tag name",
        scope: "entity.name.tag",
        settings: {
          fontStyle: "",
          foreground: "#F92672",
        },
      },
      {
        name: "Tag attribute",
        scope: "entity.other.attribute-name",
        settings: {
          fontStyle: "",
          foreground: "#A6E22E",
        },
      },
      {
        name: "Library function",
        scope: "support.function",
        settings: {
          fontStyle: "",
          foreground: "#66D9EF",
        },
      },
      {
        name: "Library constant",
        scope: "support.constant",
        settings: {
          fontStyle: "",
          foreground: "#66D9EF",
        },
      },
      {
        name: "Library class/type",
        scope: "support.type, support.class",
        settings: {
          fontStyle: "italic",
          foreground: "#66D9EF",
        },
      },
      {
        name: "Library variable",
        scope: "support.other.variable",
        settings: {
          fontStyle: "",
        },
      },
      {
        name: "Invalid",
        scope: "invalid",
        settings: {
          fontStyle: "",
          foreground: "#F44747",
        },
      },
      {
        name: "Invalid deprecated",
        scope: "invalid.deprecated",
        settings: {
          foreground: "#F44747",
        },
      },
      {
        name: "JSON String",
        scope: "meta.structure.dictionary.json string.quoted.double.json",
        settings: {
          foreground: "#CFCFC2",
        },
      },
      {
        name: "diff.header",
        scope: "meta.diff, meta.diff.header",
        settings: {
          foreground: "#75715E",
        },
      },
      {
        name: "diff.deleted",
        scope: "markup.deleted",
        settings: {
          foreground: "#F92672",
        },
      },
      {
        name: "diff.inserted",
        scope: "markup.inserted",
        settings: {
          foreground: "#A6E22E",
        },
      },
      {
        name: "diff.changed",
        scope: "markup.changed",
        settings: {
          foreground: "#E6DB74",
        },
      },
      {
        scope: "constant.numeric.line-number.find-in-files - match",
        settings: {
          foreground: "#AE81FFA0",
        },
      },
      {
        scope: "entity.name.filename.find-in-files",
        settings: {
          foreground: "#E6DB74",
        },
      },
      {
        name: "Markup Quote",
        scope: "markup.quote",
        settings: {
          foreground: "#F92672",
        },
      },
      {
        name: "Markup Lists",
        scope: "markup.list",
        settings: {
          foreground: "#E6DB74",
        },
      },
      {
        name: "Markup Styling",
        scope: "markup.bold, markup.italic",
        settings: {
          foreground: "#66D9EF",
        },
      },
      {
        name: "Markup Inline",
        scope: "markup.inline.raw",
        settings: {
          fontStyle: "",
          foreground: "#ff633c",
        },
      },
      {
        name: "Markup Headings",
        scope: "markup.heading",
        settings: {
          foreground: "#A6E22E",
        },
      },
      {
        name: "Markup Setext Header",
        scope: "markup.heading.setext",
        settings: {
          foreground: "#A6E22E",
          fontStyle: "bold",
        },
      },
      {
        name: "Markup Headings",
        scope: "markup.heading.markdown",
        settings: {
          fontStyle: "bold",
        },
      },
      {
        name: "Markdown Quote",
        scope: "markup.quote.markdown",
        settings: {
          fontStyle: "italic",
          foreground: "#75715E",
        },
      },
      {
        name: "Markdown Bold",
        scope: "markup.bold.markdown",
        settings: {
          fontStyle: "bold",
        },
      },
      {
        name: "Markdown Link Title/Description",
        scope:
          "string.other.link.title.markdown,string.other.link.description.markdown",
        settings: {
          foreground: "#AE81FF",
        },
      },
      {
        name: "Markdown Underline Link/Image",
        scope:
          "markup.underline.link.markdown,markup.underline.link.image.markdown",
        settings: {
          foreground: "#E6DB74",
        },
      },
      {
        name: "Markdown Emphasis",
        scope: "markup.italic.markdown",
        settings: {
          fontStyle: "italic",
        },
      },
      {
        scope: "markup.strikethrough",
        settings: {
          fontStyle: "strikethrough",
        },
      },
      {
        name: "Markdown Punctuation Definition Link",
        scope: "markup.list.unnumbered.markdown, markup.list.numbered.markdown",
        settings: {
          foreground: "#f8f8f2",
        },
      },
      {
        name: "Markdown List Punctuation",
        scope: ["punctuation.definition.list.begin.markdown"],
        settings: {
          foreground: "#A6E22E",
        },
      },
      {
        scope: "token.info-token",
        settings: {
          foreground: "#6796e6",
        },
      },
      {
        scope: "token.warn-token",
        settings: {
          foreground: "#ff633c",
        },
      },
      {
        scope: "token.error-token",
        settings: {
          foreground: "#f44747",
        },
      },
      {
        scope: "token.debug-token",
        settings: {
          foreground: "#b267e6",
        },
      },
      {
        name: "this.self",
        scope: "variable.language",
        settings: {
          foreground: "#ff633c",
        },
      },
    ];
  },
  HIGHLIGHT_BLULOCO = (): VscodeColorTheme["tokenColors"] => {
    return [
      {
        name: "Source",
        scope: "source",
        settings: {
          foreground: "#abb2bf",
        },
      },
      {
        name: "Text",
        scope: "comment.unused.elixir",
        settings: {
          foreground: "#abb2bf",
        },
      },
      {
        name: "Modules",
        scope: [
          "entity.name.namespace",
          "entity.name.module",
          "entity.name.type.module",
        ],
        settings: {
          foreground: "#FF839B",
        },
      },
      {
        name: "Label",
        scope: ["variable.other.label", "entity.name.function.decorator"],
        settings: {
          foreground: "#50acae",
        },
      },
      {
        name: "Comments",
        scope: [
          "comment",
          "punctuation.definition.comment",
          "comment.block.documentation punctuation.definition",
          "string.comment",
          "comment.block.documentation",
          "comment.block",
        ],
        settings: {
          foreground: "#636d83",
        },
      },
      {
        name: "Doc Comment Keywords",
        scope: [
          "comment.block.documentation variable",
          "keyword.other.documentation",
          "storage.type.class.jsdoc",
          "comment.block variable.parameter",
          "keyword.other.phpdoc",
          "comment.block.documentation entity.name.type",
          "meta.other.type.phpdoc support class",
        ],
        settings: {
          foreground: "#7c8495",
        },
      },
      {
        name: "Punctuation",
        scope: [
          "punctuation.comma",
          "punctuation.semi",
          "punctuation.definition.variable",
          "punctuation.definition.parameters",
          "punctuation.definition.array",
          "punctuation.definition.function",
          "punctuation.brace",
          "punctuation.terminator.statement",
          "punctuation.delimiter.object.comma",
          "punctuation.definition.entity",
          "punctuation.definition",
          "punctuation.definition.string.begin.markdown",
          "punctuation.definition.string.end.markdown",
          "punctuation.separator.key-value",
          "punctuation.separator.dictionary",
          "punctuation.terminator",
          "punctuation.delimiter.comma",
          "punctuation.separator.comma",
          "punctuation.accessor",
          "punctuation.separator.array",
          "punctuation.section",
          "punctuation.section.property-list.begin.bracket.curly",
          "punctuation.section.property-list.end.bracket.curly",
          "punctuation.separator.statement",
          "punctuation.section.array.elixir",
          "punctuation.separator.object.elixir",
          "punctuation.section.embedded.elixir",
          "punctuation.section.function.elixir",
          "punctuation.section.scope.elixir",
          "punctuation.separator.parameter",
          "meta.brace.round",
          "meta.brace.square",
          "meta.brace.curly",
          "constant.name.attribute.tag.pug",
          "punctuation.section.embedded",
          "punctuation.separator.method",
          "punctuation.separator",
          "punctuation.other.comma",
          "punctuation.bracket",
          "punctuation.brackets",
          "keyword.control.ternary",
          "string.interpolated.pug",
          "support.function.interpolation.sass",
          "punctuation.parenthesis.begin",
          "punctuation.parenthesis.end",
          "punctuation.operation.graphql",
          "punctuation.colon.graphql",
          "constant.character.format.placeholder.other.python",
          "punctuation.description",
          "punctuation",
        ],
        settings: {
          foreground: "#7a82da",
        },
      },
      {
        name: "Delimiters",
        scope: "none",
        settings: {
          foreground: "#abb2bf",
        },
      },
      {
        name: "Operators",
        scope: "keyword.operator",
        settings: {
          foreground: "#7a82da",
        },
      },
      {
        name: "Keywords",
        scope: [
          "keyword",
          "keyword.operator.expression",
          "keyword.operator.type.asserts",
          "variable.language",
          "keyword.other.special-method.elixir",
          "meta.control.flow",
          "meta.separator.grain",
        ],
        settings: {
          foreground: "#10b1fe",
        },
      },
      {
        name: "Primitive Type",
        scope: "support.type.primitive",
        settings: {
          foreground: "#10b1fe",
        },
      },
      {
        name: "Variables",
        scope: [
          "variable",
          "source.elixir.embedded.source",
          "string source.groovy",
          "string meta.embedded.line.ruby",
        ],
        settings: {
          foreground: "#abb2bf",
        },
      },
      {
        name: "Functions",
        scope: [
          "entity.name.function",
          "meta.require",
          "support.function.any-method",
          "meta.function-call",
          "meta.method-call",
          "variable.function",
        ],
        settings: {
          foreground: "#3fc56b",
        },
      },
      {
        name: "Classes",
        scope: [
          "support.class",
          "entity.name.class",
          "entity.name.type.class",
          "meta.class.instance",
          "meta.class.inheritance",
          "entity.other.inherited-class",
          "entity.name.type",
          "variable.other.constant.elixir",
          "storage.type.haskell",
          "support.type.graphql",
          "support.type.enum.graphql",
        ],
        settings: {
          foreground: "#ff6480",
        },
      },
      {
        name: "Methods",
        scope: "keyword.other.special-method",
        settings: {
          foreground: "#3fc56b",
        },
      },
      {
        name: "Storage",
        scope: ["storage", "constant.language"],
        settings: {
          foreground: "#10b1fe",
        },
      },
      {
        name: "Support",
        scope: "support.function",
        settings: {
          foreground: "#3fc56b",
        },
      },
      {
        name: "Strings, Inherited Class",
        scope: [
          "string",
          "punctuation.definition.string",
          "support.constant.property-value",
          "string.quoted.double.shell",
          "support.function.variable.quoted.single.elixir",
          "storage.type.string",
        ],
        settings: {
          foreground: "#f9c859",
        },
      },
      {
        name: "Integers",
        scope: ["constant.numeric", "variable.other.anonymous.elixir"],
        settings: {
          foreground: "#ff78f8",
        },
      },
      {
        name: "Floats",
        scope: "none",
        settings: {
          foreground: "#ff78f8",
        },
      },
      {
        name: "Boolean",
        scope: "none",
        settings: {
          foreground: "#10b1fe",
        },
      },
      {
        name: "Constants",
        scope: [
          "constant",
          "variable.other.constant",
          "punctuation.definition.constant",
          "constant.other.symbol",
          "constant.language.symbol",
          "support.constant",
          "support.variable.magic.python",
          "variable.other.enummember",
        ],
        settings: {
          foreground: "#9f7efe",
        },
      },
      {
        name: "Tags",
        scope: ["entity.name.tag", "punctuation.definition.tag"],
        settings: {
          foreground: "#3691ff",
        },
      },
      {
        name: "Attribute IDs",
        scope: ["entity.other.attribute-name", "string.unquoted.alias.graphql"],
        settings: {
          foreground: "#ff936a",
        },
      },
      {
        name: "Selector",
        scope: "meta.selector",
        settings: {
          foreground: "#7a82da",
        },
      },
      {
        name: "Values",
        scope: "none",
        settings: {
          foreground: "#ff78f8",
        },
      },
      {
        name: "Headings",
        scope: [
          "markup.heading",
          "punctuation.definition.heading",
          "entity.name.section",
          "markup.heading.setext",
        ],
        settings: {
          fontStyle: "",
          foreground: "#f9c859",
        },
      },
      {
        name: "Units",
        scope: "keyword.other.unit",
        settings: {
          foreground: "#f9c859",
        },
      },
      {
        name: "Bold",
        scope: ["markup.bold", "punctuation.definition.bold"],
        settings: {
          fontStyle: "bold",
          foreground: "#ff6480",
        },
      },
      {
        name: "Italic",
        scope: ["markup.italic", "punctuation.definition.italic"],
        settings: {
          fontStyle: "italic",
          foreground: "#ff936a",
        },
      },
      {
        name: "Strikethrough",
        scope: ["markup.strikethrough", "punctuation.definition.strikethrough"],
        settings: {
          foreground: "#636d83",
          fontStyle: "strikethrough",
        },
      },
      {
        name: "Strikethrough Italic",
        scope: [
          "markup.strikethrough markup.italic",
          "markup.strikethrough markup.italic punctuation.definition.italic",
        ],
        settings: {
          foreground: "#636d83",
          fontStyle: "italic strikethrough",
        },
      },
      {
        name: "Strikethrough Bold",
        scope: [
          "markup.strikethrough markup.bold",
          "markup.strikethrough markup.bold punctuation.definition.bold",
        ],
        settings: {
          foreground: "#636d83",
          fontStyle: "bold strikethrough",
        },
      },
      {
        name: "Code",
        scope: "markup.raw.inline",
        settings: {
          foreground: "#f9c859",
        },
      },
      {
        name: "Link Text",
        scope: "string.other.link",
        settings: {
          foreground: "#3691ff",
        },
      },
      {
        name: "Link Url",
        scope: "meta.link",
        settings: {
          foreground: "#10b1fe",
        },
      },
      {
        name: "Lists",
        scope: "beginning.punctuation.definition.list",
        settings: {
          foreground: "#ce9887",
        },
      },
      {
        name: "Quotes",
        scope: "markup.quote",
        settings: {
          foreground: "#9f7efe",
        },
      },
      {
        name: "Separator",
        scope: "meta.separator",
        settings: {
          foreground: "#abb2bf",
        },
      },
      {
        name: "Inserted",
        scope: "markup.inserted",
        settings: {
          foreground: "#3fc56b",
        },
      },
      {
        name: "Deleted",
        scope: "markup.deleted",
        settings: {
          foreground: "#ff6480",
        },
      },
      {
        name: "Changed",
        scope: "markup.changed",
        settings: {
          foreground: "#10b1fe",
        },
      },
      {
        name: "Regular Expressions",
        scope: "string.regexp",
        settings: {
          foreground: "#f9c859",
        },
      },
      {
        name: "Escape Characters",
        scope: ["constant.character.escape", "constant.other.character-class"],
        settings: {
          foreground: "#ff936a",
        },
      },
      {
        name: "Embedded",
        scope: "variable.interpolation",
        settings: {
          foreground: "#10b1fe",
        },
      },
      {
        name: "Illegal",
        scope: "invalid",
        settings: {
          foreground: "#fc2f52",
        },
      },
      {
        name: "New Operator",
        scope: "keyword.operator.new",
        settings: {
          foreground: "#10b1fe",
        },
      },
      {
        name: "Css ID",
        scope: "entity.other.attribute-name.id",
        settings: {
          foreground: "#ff6480",
        },
      },
      {
        name: "Function Parameters",
        scope: "meta.function-call.arguments",
        settings: {
          foreground: "#abb2bf",
        },
      },
      {
        name: "Object Properties",
        scope: [
          "meta.object-literal.key",
          "meta.object.member",
          "variable.other.property",
          "variable.other.object.property",
          "support.variable.property",
          "variable.object.property",
          "support.type.property-name",
          "meta.property-name",
          "entity.name.tag.yaml",
          "constant.other.key",
          "constant.other.object.key.js",
          "string.unquoted.label.js",
          "support.type.map.key",
          "variable.graphql",
          "entity.name.grain",
          "entity.other.grain",
        ],
        settings: {
          foreground: "#ce9887",
        },
      },
      {
        name: "Markup Code",
        scope: [
          "markup.inline.raw",
          "markup.fenced_code.block",
          "markup.raw.block",
        ],
        settings: {
          foreground: "#ce9887",
        },
      },
      {
        name: "Markup Link Image",
        scope: "markup.underline.link.image",
        settings: {
          foreground: "#3fc56b",
        },
      },
      {
        name: "Variable Parameter",
        scope: [
          "variable.parameter",
          "parameter.variable.function.elixir",
          "variable.other.block.ruby",
        ],
        settings: {
          foreground: "#8bcdef",
        },
      },
      {
        name: "Type Primitive",
        scope: ["support.type.primitive", "support.type.builtin"],
        settings: {
          foreground: "#10b1fe",
        },
      },
      {
        name: "BASH: Command Substitution",
        scope: "string.interpolated.dollar.shell",
        settings: {
          foreground: "#ff6480",
        },
      },
      {
        name: "BASH: Math Operation",
        scope: "string.other.math.shell",
        settings: {
          foreground: "#3691ff",
        },
      },
      {
        name: "BASH: Substitution",
        scope: [
          "punctuation.definition.string.begin.shell",
          "punctuation.definition.string.end.shell",
        ],
        settings: {
          foreground: "#7a82da",
        },
      },
      {
        name: "CSV Rainbow 4",
        scope: "comment.rainbow4",
        settings: {
          foreground: "#ce9887",
        },
      },
      {
        name: "CSV Rainbow 9",
        scope: "markup.bold.rainbow9",
        settings: {
          foreground: "#9f7efe",
          fontStyle: "",
        },
      },
      {
        name: "CSV Rainbow 10",
        scope: "invalid.rainbow10",
        settings: {
          foreground: "#ff936a",
        },
      },
    ];
  },
  HIGHLIGHT_DRACULA = (): VscodeColorTheme["tokenColors"] => {
    return [
      {
        scope: ["emphasis"],
        settings: {
          fontStyle: "italic",
        },
      },
      {
        scope: ["strong"],
        settings: {
          fontStyle: "bold",
        },
      },
      {
        scope: ["header"],
        settings: {
          foreground: "#BD93F9",
        },
      },
      {
        scope: ["meta.diff", "meta.diff.header"],
        settings: {
          foreground: "#6272A4",
        },
      },
      {
        scope: ["markup.inserted"],
        settings: {
          foreground: "#50FA7B",
        },
      },
      {
        scope: ["markup.deleted"],
        settings: {
          foreground: "#FF5555",
        },
      },
      {
        scope: ["markup.changed"],
        settings: {
          foreground: "#FFB86C",
        },
      },
      {
        scope: ["invalid"],
        settings: {
          foreground: "#FF5555",
          fontStyle: "underline italic",
        },
      },
      {
        scope: ["invalid.deprecated"],
        settings: {
          foreground: "#F8F8F2",
          fontStyle: "underline italic",
        },
      },
      {
        scope: ["entity.name.filename"],
        settings: {
          foreground: "#F1FA8C",
        },
      },
      {
        scope: ["markup.error"],
        settings: {
          foreground: "#FF5555",
        },
      },
      {
        name: "Underlined markup",
        scope: ["markup.underline"],
        settings: {
          fontStyle: "underline",
        },
      },
      {
        name: "Bold markup",
        scope: ["markup.bold"],
        settings: {
          fontStyle: "bold",
          foreground: "#FFB86C",
        },
      },
      {
        name: "Markup headings",
        scope: ["markup.heading"],
        settings: {
          fontStyle: "bold",
          foreground: "#BD93F9",
        },
      },
      {
        name: "Markup italic",
        scope: ["markup.italic"],
        settings: {
          foreground: "#F1FA8C",
          fontStyle: "italic",
        },
      },
      {
        name: "Bullets, lists (prose)",
        scope: [
          "beginning.punctuation.definition.list.markdown",
          "beginning.punctuation.definition.quote.markdown",
          "punctuation.definition.link.restructuredtext",
        ],
        settings: {
          foreground: "#8BE9FD",
        },
      },
      {
        name: "Inline code (prose)",
        scope: ["markup.inline.raw", "markup.raw.restructuredtext"],
        settings: {
          foreground: "#50FA7B",
        },
      },
      {
        name: "Links (prose)",
        scope: ["markup.underline.link", "markup.underline.link.image"],
        settings: {
          foreground: "#8BE9FD",
        },
      },
      {
        name: "Link text, image alt text (prose)",
        scope: [
          "meta.link.reference.def.restructuredtext",
          "punctuation.definition.directive.restructuredtext",
          "string.other.link.description",
          "string.other.link.title",
        ],
        settings: {
          foreground: "#FF79C6",
        },
      },
      {
        name: "Blockquotes (prose)",
        scope: ["entity.name.directive.restructuredtext", "markup.quote"],
        settings: {
          foreground: "#F1FA8C",
          fontStyle: "italic",
        },
      },
      {
        name: "Horizontal rule (prose)",
        scope: ["meta.separator.markdown"],
        settings: {
          foreground: "#6272A4",
        },
      },
      {
        name: "Code blocks",
        scope: [
          "fenced_code.block.language",
          "markup.raw.inner.restructuredtext",
          "markup.fenced_code.block.markdown punctuation.definition.markdown",
        ],
        settings: {
          foreground: "#50FA7B",
        },
      },
      {
        name: "Prose constants",
        scope: ["punctuation.definition.constant.restructuredtext"],
        settings: {
          foreground: "#BD93F9",
        },
      },
      {
        name: "Braces in markdown headings",
        scope: [
          "markup.heading.markdown punctuation.definition.string.begin",
          "markup.heading.markdown punctuation.definition.string.end",
        ],
        settings: {
          foreground: "#BD93F9",
        },
      },
      {
        name: "Braces in markdown paragraphs",
        scope: [
          "meta.paragraph.markdown punctuation.definition.string.begin",
          "meta.paragraph.markdown punctuation.definition.string.end",
        ],
        settings: {
          foreground: "#F8F8F2",
        },
      },
      {
        name: "Braces in markdown blockquotes",
        scope: [
          "markup.quote.markdown meta.paragraph.markdown punctuation.definition.string.begin",
          "markup.quote.markdown meta.paragraph.markdown punctuation.definition.string.end",
        ],
        settings: {
          foreground: "#F1FA8C",
        },
      },
      {
        name: "User-defined class names",
        scope: ["entity.name.type.class", "entity.name.class"],
        settings: {
          foreground: "#8BE9FD",
          fontStyle: "normal",
        },
      },
      {
        name: "this, super, self, etc.",
        scope: [
          "keyword.expressions-and-types.swift",
          "keyword.other.this",
          "variable.language",
          "variable.language punctuation.definition.variable.php",
          "variable.other.readwrite.instance.ruby",
          "variable.parameter.function.language.special",
        ],
        settings: {
          foreground: "#BD93F9",
          fontStyle: "italic",
        },
      },
      {
        name: "Inherited classes",
        scope: ["entity.other.inherited-class"],
        settings: {
          fontStyle: "italic",
          foreground: "#8BE9FD",
        },
      },
      {
        name: "Comments",
        scope: [
          "comment",
          "punctuation.definition.comment",
          "unused.comment",
          "wildcard.comment",
        ],
        settings: {
          foreground: "#6272A4",
        },
      },
      {
        name: "JSDoc-style keywords",
        scope: [
          "comment keyword.codetag.notation",
          "comment.block.documentation keyword",
          "comment.block.documentation storage.type.class",
        ],
        settings: {
          foreground: "#FF79C6",
        },
      },
      {
        name: "JSDoc-style types",
        scope: ["comment.block.documentation entity.name.type"],
        settings: {
          foreground: "#8BE9FD",
          fontStyle: "italic",
        },
      },
      {
        name: "JSDoc-style type brackets",
        scope: [
          "comment.block.documentation entity.name.type punctuation.definition.bracket",
        ],
        settings: {
          foreground: "#8BE9FD",
        },
      },
      {
        name: "JSDoc-style comment parameters",
        scope: ["comment.block.documentation variable"],
        settings: {
          foreground: "#FFB86C",
          fontStyle: "italic",
        },
      },
      {
        name: "Constants",
        scope: ["constant", "variable.other.constant"],
        settings: {
          foreground: "#BD93F9",
        },
      },
      {
        name: "Constant escape sequences",
        scope: [
          "constant.character.escape",
          "constant.character.string.escape",
          "constant.regexp",
        ],
        settings: {
          foreground: "#FF79C6",
        },
      },
      {
        name: "HTML tags",
        scope: ["entity.name.tag"],
        settings: {
          foreground: "#FF79C6",
        },
      },
      {
        name: "CSS attribute parent selectors ('&')",
        scope: ["entity.other.attribute-name.parent-selector"],
        settings: {
          foreground: "#FF79C6",
        },
      },
      {
        name: "HTML/CSS attribute names",
        scope: ["entity.other.attribute-name"],
        settings: {
          foreground: "#50FA7B",
          fontStyle: "italic",
        },
      },
      {
        name: "Function names",
        scope: [
          "entity.name.function",
          "meta.function-call.object",
          "meta.function-call.php",
          "meta.function-call.static",
          "meta.method-call.java meta.method",
          "meta.method.groovy",
          "support.function.any-method.lua",
          "keyword.operator.function.infix",
        ],
        settings: {
          foreground: "#50FA7B",
        },
      },
      {
        name: "Function parameters",
        scope: [
          "entity.name.variable.parameter",
          "meta.at-rule.function variable",
          "meta.at-rule.mixin variable",
          "meta.function.arguments variable.other.php",
          "meta.selectionset.graphql meta.arguments.graphql variable.arguments.graphql",
          "variable.parameter",
        ],
        settings: {
          fontStyle: "italic",
          foreground: "#FFB86C",
        },
      },
      {
        name: "Decorators",
        scope: [
          "meta.decorator variable.other.readwrite",
          "meta.decorator variable.other.property",
        ],
        settings: {
          foreground: "#50FA7B",
          fontStyle: "italic",
        },
      },
      {
        name: "Decorator Objects",
        scope: ["meta.decorator variable.other.object"],
        settings: {
          foreground: "#50FA7B",
        },
      },
      {
        name: "Keywords",
        scope: ["keyword", "punctuation.definition.keyword"],
        settings: {
          foreground: "#FF79C6",
        },
      },
      {
        name: 'Keyword "new"',
        scope: ["keyword.control.new", "keyword.operator.new"],
        settings: {
          fontStyle: "bold",
        },
      },
      {
        name: "Generic selectors (CSS/SCSS/Less/Stylus)",
        scope: ["meta.selector"],
        settings: {
          foreground: "#FF79C6",
        },
      },
      {
        name: "Language Built-ins",
        scope: ["support"],
        settings: {
          fontStyle: "italic",
          foreground: "#8BE9FD",
        },
      },
      {
        name: "Built-in magic functions and constants",
        scope: [
          "support.function.magic",
          "support.variable",
          "variable.other.predefined",
        ],
        settings: {
          fontStyle: "regular",
          foreground: "#BD93F9",
        },
      },
      {
        name: "Built-in functions / properties",
        scope: ["support.function", "support.type.property-name"],
        settings: {
          fontStyle: "regular",
        },
      },
      {
        name: "Separators (key/value, namespace, inheritance, pointer, hash, slice, etc)",
        scope: [
          "constant.other.symbol.hashkey punctuation.definition.constant.ruby",
          "entity.other.attribute-name.placeholder punctuation",
          "entity.other.attribute-name.pseudo-class punctuation",
          "entity.other.attribute-name.pseudo-element punctuation",
          "meta.group.double.toml",
          "meta.group.toml",
          "meta.object-binding-pattern-variable punctuation.destructuring",
          "punctuation.colon.graphql",
          "punctuation.definition.block.scalar.folded.yaml",
          "punctuation.definition.block.scalar.literal.yaml",
          "punctuation.definition.block.sequence.item.yaml",
          "punctuation.definition.entity.other.inherited-class",
          "punctuation.function.swift",
          "punctuation.separator.dictionary.key-value",
          "punctuation.separator.hash",
          "punctuation.separator.inheritance",
          "punctuation.separator.key-value",
          "punctuation.separator.key-value.mapping.yaml",
          "punctuation.separator.namespace",
          "punctuation.separator.pointer-access",
          "punctuation.separator.slice",
          "string.unquoted.heredoc punctuation.definition.string",
          "support.other.chomping-indicator.yaml",
          "punctuation.separator.annotation",
        ],
        settings: {
          foreground: "#FF79C6",
        },
      },
      {
        name: "Brackets, braces, parens, etc.",
        scope: [
          "keyword.operator.other.powershell",
          "keyword.other.statement-separator.powershell",
          "meta.brace.round",
          "meta.function-call punctuation",
          "punctuation.definition.arguments.begin",
          "punctuation.definition.arguments.end",
          "punctuation.definition.entity.begin",
          "punctuation.definition.entity.end",
          "punctuation.definition.tag.cs",
          "punctuation.definition.type.begin",
          "punctuation.definition.type.end",
          "punctuation.section.scope.begin",
          "punctuation.section.scope.end",
          "punctuation.terminator.expression.php",
          "storage.type.generic.java",
          "string.template meta.brace",
          "string.template punctuation.accessor",
        ],
        settings: {
          foreground: "#F8F8F2",
        },
      },
      {
        name: "Variable interpolation operators",
        scope: [
          "meta.string-contents.quoted.double punctuation.definition.variable",
          "punctuation.definition.interpolation.begin",
          "punctuation.definition.interpolation.end",
          "punctuation.definition.template-expression.begin",
          "punctuation.definition.template-expression.end",
          "punctuation.section.embedded.begin",
          "punctuation.section.embedded.coffee",
          "punctuation.section.embedded.end",
          "punctuation.section.embedded.end source.php",
          "punctuation.section.embedded.end source.ruby",
          "punctuation.definition.variable.makefile",
        ],
        settings: {
          foreground: "#FF79C6",
        },
      },
      {
        name: "Keys (serializable languages)",
        scope: [
          "entity.name.function.target.makefile",
          "entity.name.section.toml",
          "entity.name.tag.yaml",
          "variable.other.key.toml",
        ],
        settings: {
          foreground: "#8BE9FD",
        },
      },
      {
        name: "Dates / timestamps (serializable languages)",
        scope: ["constant.other.date", "constant.other.timestamp"],
        settings: {
          foreground: "#FFB86C",
        },
      },
      {
        name: "YAML aliases",
        scope: ["variable.other.alias.yaml"],
        settings: {
          fontStyle: "italic underline",
          foreground: "#50FA7B",
        },
      },
      {
        name: "Storage",
        scope: [
          "storage",
          "meta.implementation storage.type.objc",
          "meta.interface-or-protocol storage.type.objc",
          "source.groovy storage.type.def",
        ],
        settings: {
          fontStyle: "regular",
          foreground: "#FF79C6",
        },
      },
      {
        name: "Types",
        scope: [
          "entity.name.type",
          "keyword.primitive-datatypes.swift",
          "keyword.type.cs",
          "meta.protocol-list.objc",
          "meta.return-type.objc",
          "source.go storage.type",
          "source.groovy storage.type",
          "source.java storage.type",
          "source.powershell entity.other.attribute-name",
          "storage.class.std.rust",
          "storage.type.attribute.swift",
          "storage.type.c",
          "storage.type.core.rust",
          "storage.type.cs",
          "storage.type.groovy",
          "storage.type.objc",
          "storage.type.php",
          "storage.type.haskell",
          "storage.type.ocaml",
        ],
        settings: {
          fontStyle: "italic",
          foreground: "#8BE9FD",
        },
      },
      {
        name: "Generics, templates, and mapped type declarations",
        scope: [
          "entity.name.type.type-parameter",
          "meta.indexer.mappedtype.declaration entity.name.type",
          "meta.type.parameters entity.name.type",
        ],
        settings: {
          foreground: "#FFB86C",
        },
      },
      {
        name: "Modifiers",
        scope: ["storage.modifier"],
        settings: {
          foreground: "#FF79C6",
        },
      },
      {
        name: "RegExp string",
        scope: [
          "string.regexp",
          "constant.other.character-class.set.regexp",
          "constant.character.escape.backslash.regexp",
        ],
        settings: {
          foreground: "#F1FA8C",
        },
      },
      {
        name: "Non-capture operators",
        scope: ["punctuation.definition.group.capture.regexp"],
        settings: {
          foreground: "#FF79C6",
        },
      },
      {
        name: "RegExp start and end characters",
        scope: [
          "string.regexp punctuation.definition.string.begin",
          "string.regexp punctuation.definition.string.end",
        ],
        settings: {
          foreground: "#FF5555",
        },
      },
      {
        name: "Character group",
        scope: ["punctuation.definition.character-class.regexp"],
        settings: {
          foreground: "#8BE9FD",
        },
      },
      {
        name: "Capture groups",
        scope: ["punctuation.definition.group.regexp"],
        settings: {
          foreground: "#FFB86C",
        },
      },
      {
        name: "Assertion operators",
        scope: [
          "punctuation.definition.group.assertion.regexp",
          "keyword.operator.negation.regexp",
        ],
        settings: {
          foreground: "#FF5555",
        },
      },
      {
        name: "Positive lookaheads",
        scope: ["meta.assertion.look-ahead.regexp"],
        settings: {
          foreground: "#50FA7B",
        },
      },
      {
        name: "Strings",
        scope: ["string"],
        settings: {
          foreground: "#F1FA8C",
        },
      },
      {
        name: "String quotes (temporary vscode fix)",
        scope: [
          "punctuation.definition.string.begin",
          "punctuation.definition.string.end",
        ],
        settings: {
          foreground: "#E9F284",
        },
      },
      {
        name: "Property quotes (temporary vscode fix)",
        scope: [
          "punctuation.support.type.property-name.begin",
          "punctuation.support.type.property-name.end",
        ],
        settings: {
          foreground: "#8BE9FE",
        },
      },
      {
        name: "Docstrings",
        scope: [
          "string.quoted.docstring.multi",
          "string.quoted.docstring.multi.python punctuation.definition.string.begin",
          "string.quoted.docstring.multi.python punctuation.definition.string.end",
          "string.quoted.docstring.multi.python constant.character.escape",
        ],
        settings: {
          foreground: "#6272A4",
        },
      },
      {
        name: "Variables and object properties",
        scope: [
          "variable",
          "constant.other.key.perl",
          "support.variable.property",
          "variable.other.constant.js",
          "variable.other.constant.ts",
          "variable.other.constant.tsx",
        ],
        settings: {
          foreground: "#F8F8F2",
        },
      },
      {
        name: "Destructuring / aliasing reference name (LHS)",
        scope: [
          "meta.import variable.other.readwrite",
          "meta.variable.assignment.destructured.object.coffee variable",
        ],
        settings: {
          fontStyle: "italic",
          foreground: "#FFB86C",
        },
      },
      {
        name: "Destructuring / aliasing variable name (RHS)",
        scope: [
          "meta.import variable.other.readwrite.alias",
          "meta.export variable.other.readwrite.alias",
          "meta.variable.assignment.destructured.object.coffee variable variable",
        ],
        settings: {
          fontStyle: "normal",
          foreground: "#F8F8F2",
        },
      },
      {
        name: "GraphQL keys",
        scope: ["meta.selectionset.graphql variable"],
        settings: {
          foreground: "#F1FA8C",
        },
      },
      {
        name: "GraphQL function arguments",
        scope: ["meta.selectionset.graphql meta.arguments variable"],
        settings: {
          foreground: "#F8F8F2",
        },
      },
      {
        name: "GraphQL fragment name (definition)",
        scope: ["entity.name.fragment.graphql", "variable.fragment.graphql"],
        settings: {
          foreground: "#8BE9FD",
        },
      },
      {
        name: "Edge cases (foreground color resets)",
        scope: [
          "constant.other.symbol.hashkey.ruby",
          "keyword.operator.dereference.java",
          "keyword.operator.navigation.groovy",
          "meta.scope.for-loop.shell punctuation.definition.string.begin",
          "meta.scope.for-loop.shell punctuation.definition.string.end",
          "meta.scope.for-loop.shell string",
          "storage.modifier.import",
          "punctuation.section.embedded.begin.tsx",
          "punctuation.section.embedded.end.tsx",
          "punctuation.section.embedded.begin.jsx",
          "punctuation.section.embedded.end.jsx",
          "punctuation.separator.list.comma.css",
          "constant.language.empty-list.haskell",
        ],
        settings: {
          foreground: "#F8F8F2",
        },
      },
      {
        name: 'Shell variables prefixed with "$" (edge case)',
        scope: ["source.shell variable.other"],
        settings: {
          foreground: "#BD93F9",
        },
      },
      {
        name: "Powershell constants mistakenly scoped to `support`, rather than `constant` (edge)",
        scope: ["support.constant"],
        settings: {
          fontStyle: "normal",
          foreground: "#BD93F9",
        },
      },
      {
        name: "Makefile prerequisite names",
        scope: ["meta.scope.prerequisites.makefile"],
        settings: {
          foreground: "#F1FA8C",
        },
      },
      {
        name: "SCSS attibute selector strings",
        scope: ["meta.attribute-selector.scss"],
        settings: {
          foreground: "#F1FA8C",
        },
      },
      {
        name: "SCSS attribute selector brackets",
        scope: [
          "punctuation.definition.attribute-selector.end.bracket.square.scss",
          "punctuation.definition.attribute-selector.begin.bracket.square.scss",
        ],
        settings: {
          foreground: "#F8F8F2",
        },
      },
      {
        name: "Haskell Pragmas",
        scope: ["meta.preprocessor.haskell"],
        settings: {
          foreground: "#6272A4",
        },
      },
      {
        name: "Log file error",
        scope: ["log.error"],
        settings: {
          foreground: "#FF5555",
          fontStyle: "bold",
        },
      },
      {
        name: "Log file warning",
        scope: ["log.warning"],
        settings: {
          foreground: "#F1FA8C",
          fontStyle: "bold",
        },
      },
    ];
  },
  HIGHLIGHT_ONE_DARK = (): VscodeColorTheme["tokenColors"] => {
    return [
      {
        name: "Chalky",
        scope: [
          "entity.name.type",
          "entity.other.inherited-class",
          "keyword.other.type",
          "punctuation.definition.annotation",
          "storage.modifier.import",
          "storage.modifier.package",
          "storage.type.annotation",
          "storage.type.built-in",
          "storage.type.generic",
          "storage.type.java",
          "storage.type.groovy",
          "storage.type.primitive",
          "support.class",
          "support.other.namespace",
          "support.type",
          "variable.language.this",
        ],
        settings: { foreground: "#e5c07b" },
      },
      {
        name: "Coral",
        scope: [
          "constant.other.character-class",
          "entity.name.tag",
          "heading",
          "meta.object-literal.key",
          "punctuation.definition.list.begin.markdown",
          "punctuation.definition.list.end.markdown",
          "punctuation.definition.template-expression",
          "punctuation.section.embedded",
          "support.type.property-name",
          "variable.object.property",
          "variable.other.enummember",
        ],
        settings: { foreground: "#e06c75" },
      },
      {
        name: "Cyan",
        scope: [
          "constant.character.escape",
          "keyword.operator",
          "markup.underline.link",
          "string.regexp",
          "string.url",
        ],
        settings: { foreground: "#56b6c2" },
      },
      {
        name: "Malibu",
        scope: [
          "entity.name.function",
          "entity.other.attribute-name.id.css",
          "meta.function-call.generic",
          "string.other.link",
          "support.function",
          "variable.language.super",
        ],
        settings: { foreground: "#61afef" },
      },
      {
        name: "Ivory",
        scope: [
          "meta.brace",
          "punctuation.accessor",
          "punctuation.definition.block",
          "punctuation.separator",
          "support.type.property-name.css",
        ],
        settings: { foreground: "#abb2bf" },
      },
      {
        name: "Sage",
        scope: [
          "markup.inline",
          "markup.quote",
          "source.ini",
          "string.other.link.description",
          "string",
        ],
        settings: { foreground: "#98c379" },
      },
      {
        name: "Stone",
        scope: ["comment"],
        settings: { foreground: "#444444" },
      },
      {
        name: "Violet",
        scope: [
          "keyword.operator.new",
          "keyword",
          "markup.italic",
          "punctuation.definition.block.tag",
          "storage.modifier",
          "storage.type",
        ],
        settings: { foreground: "#c678dd" },
      },
      {
        name: "Whiskey",
        scope: [
          "constant",
          "entity.other.attribute-name",
          "keyword.operator.quantifier.regexp",
          "markup.bold",
          "support.constant",
          "variable.other.constant",
          "variable.parameter",
        ],
        settings: { foreground: "#d19a66" },
      },
      {
        name: "Always italic",
        scope: ["markup.quote", "markup.italic"],
        settings: { fontStyle: "italic" },
      },
      {
        name: "Always bold",
        scope: ["heading", "markup.bold"],
        settings: { fontStyle: "bold" },
      },
    ];
  },
  HIGHLIGHT_ICEBERG = (): VscodeColorTheme["tokenColors"] => {
    return [
		{
			"scope": "comment",
			"settings": {
				"foreground": "#6b7089"
			}
		},
		{
			"scope": [
				"constant",
				"support.constant"
			],
			"settings": {
				"foreground": "#a093c7"
			}
		},
		{
			"scope": "entity.other.attribute-name",
			"settings": {
				"foreground": "#a093c7"
			}
		},
		{
			"scope": "entity.name.class",
			"settings": {
				"foreground": "#c6c8d1"
			}
		},
		{
			"scope": "entity.name.function",
			"settings": {
				"foreground": "#c6c8d1"
			}
		},
		{
			"scope": "entity.name.section",
			"settings": {
				"foreground": "#e2a478"
			}
		},
		{
			"scope": "entity.name.tag",
			"settings": {
				"foreground": "#84a0c6"
			}
		},
		{
			"scope": [
				"keyword",
				"keyword.operator.expression",
				"keyword.operator.new"
			],
			"settings": {
				"foreground": "#84a0c6"
			}
		},
		{
			"scope": "keyword.control.at-rule, keyword.control.content",
			"settings": {
				"foreground": "#b4be82"
			}
		},
		{
			"scope": "keyword.function",
			"settings": {
				"foreground": "#84a0c6"
			}
		},
		{
			"scope": "keyword.operator",
			"settings": {
				"foreground": "#c6c8d1"
			}
		},
		{
			"scope": "keyword.other.unit",
			"settings": {
				"foreground": "#a093c7"
			}
		},
		{
			"scope": "markup.bold",
			"settings": {
				"fontStyle": "bold",
				"foreground": "#d2d4de"
			}
		},
		{
			"scope": "markup.fenced_code.block",
			"settings": {
				"foreground": "#6b7089"
			}
		},
		{
			"scope": "markup.inline.raw.string",
			"settings": {
				"foreground": "#a093c7"
			}
		},
		{
			"scope": "meta.link",
			"settings": {
				"foreground": "#89b8c2"
			}
		},
		{
			"scope": "meta.brace.square",
			"settings": {
				"foreground": "#c6c8d1"
			}
		},
		{
			"scope": [
				"entity.name.function.method",
				"markup.heading",
				"meta.definition.method"
			],
			"settings": {
				"foreground": "#e2a478"
			}
		},
		{
			"scope": "meta.object-literal.key",
			"settings": {
				"foreground": "#84a0c6"
			}
		},
		{
			"scope": "meta.tag.attributes",
			"settings": {
				"foreground": "#a093c7"
			}
		},
		{
			"scope": "meta.tag.sgml.doctype",
			"settings": {
				"foreground": "#6b7089"
			}
		},
		{
			"scope": "meta.type.annotation",
			"settings": {
				"foreground": "#b4be82"
			}
		},
		{
			"scope": "punctuation.definition.template-expression",
			"settings": {
				"foreground": "#b4be82"
			}
		},
		{
			"scope": "punctuation.definition.block",
			"settings": {
				"foreground": "#c6c8d1"
			}
		},
		{
			"scope": "punctuation.definition.tag",
			"settings": {
				"foreground": "#84a0c6"
			}
		},
		{
			"scope": "storage",
			"settings": {
				"foreground": "#84a0c6"
			}
		},
		{
			"scope": "storage.type.function",
			"settings": {
				"foreground": "#84a0c6"
			}
		},
		{
			"scope": "string",
			"settings": {
				"foreground": "#89b8c2"
			}
		},
		{
			"scope": "support",
			"settings": {
				"foreground": "#84a0c6"
			}
		},
		{
			"scope": "support.type.property-name",
			"settings": {
				"foreground": "#84a0c6"
			}
		},
		{
			"scope": "variable.language.this",
			"settings": {
				"foreground": "#b4be82"
			}
		},
		{
			"scope": "text",
			"settings": {
				"foreground": "#c6c8d1"
			}
		},
		{
			"scope": "meta.diff.header",
			"settings": {
				"foreground": "#84a0c6"
			}
		},
		{
			"scope": "meta.diff.range",
			"settings": {
				"foreground": "#89b8c2"
			}
		},
		{
			"scope": "entity.other.attribute-name.class.css, entity.other.attribute-name.parent-selector-suffix.css",
			"settings": {
				"foreground": "#c6c8d1"
			}
		},
		{
			"scope": "markup.deleted.diff",
			"settings": {
				"foreground": "#e27878"
			}
		},
		{
			"scope": "markup.inserted.diff",
			"settings": {
				"foreground": "#b4be82"
			}
		},
		{
			"scope": "support.type.class.flowtype",
			"settings": {
				"foreground": "#b4be82"
			}
		},
		{
			"scope": "punctuation.definition.block.tag.jsdoc",
			"settings": {
				"foreground": "#b4be82"
			}
		},
		{
			"scope": "storage.type.class.jsdoc",
			"settings": {
				"foreground": "#b4be82"
			}
		},
		{
			"scope": "variable.other.jsdoc",
			"settings": {
				"foreground": "#c6c8d1"
			}
		},
		{
			"scope": "entity.name.import.go",
			"settings": {
				"foreground": "#89b8c2"
			}
		},
		{
			"scope": "markup.underline.link",
			"settings": {
				"foreground": "#84a0c6"
			}
		},
		{
			"scope": "keyword.other.important.scss",
			"settings": {
				"foreground": "#e2a478"
			}
		},
		{
			"scope": "variable.interpolation.scss",
			"settings": {
				"foreground": "#b4be82"
			}
		},
		{
			"scope": "variable.scss",
			"settings": {
				"foreground": "#89b8c2"
			}
		}
	];
  },
  SEMANTIC_TOKEN_COLORS = (): VscodeColorTheme["semanticTokenColors"] => {
    return {
      newOperator: "#C586C0",
      stringLiteral: "#ce9178",
      customLiteral: "#DCDCAA",
      numberLiteral: "#b5cea8",
    };
  };

const THEME_BIG_BANG = () => {}
,THEME_SUBLIME = () => {}
,THEME_SOLDMETAL = () => {}
,THEME_ROYALE = () => {};
const HIGHLIGHT_BLULOCO_ITALIC = () => {}
,HIGHLIGHT_DRACULA_SOFT = () => {} 
,HIGHLIGHT_MONOKAI_DIMMED = () => {} 
,HIGHLIGHT_ONE_DARK_VIVID = () => {} 
,HIGHLIGHT_ABSENT = () => {} 
,HIGHLIGHT_ALLURE = () => {}
,HIGHLIGHT_ARSTOTZKA = () => {}
,HIGHLIGHT_AZURE = () => {}
,HIGHLIGHT_BANNER = () => {}
,HIGHLIGHT_BLINK = () => {}
,HIGHLIGHT_BOLD = () => {}
,HIGHLIGHT_BOXUK = () => {}
,HIGHLIGHT_BRAVE = () => {}
,HIGHLIGHT_CARBONIGHT = () => {}
,HIGHLIGHT_CHOCOLATE = () => {}
,HIGHLIGHT_CODECOURSE = () => {}
,HIGHLIGHT_COFFEE = () => {}
,HIGHLIGHT_COMRADE = () => {}
,HIGHLIGHT_CRACKPOT = () => {}
,HIGHLIGHT_CRISP = () => {}
,HIGHLIGHT_DARE = () => {}
,HIGHLIGHT_DARKSIDE = () => {}
,HIGHLIGHT_DOWNPOUR = () => {}
,HIGHLIGHT_EARTHSONG = () => {}
,HIGHLIGHT_FODDER = () => {}
,HIGHLIGHT_FRANTIC = () => {}
,HIGHLIGHT_FRESHCUT = () => {}
,HIGHLIGHT_FRICTION = () => {}
,HIGHLIGHT_FRONTIER = () => {}
,HIGHLIGHT_GITHUB = () => {}
,HIGHLIGHT_GLANCE = () => {}
,HIGHLIGHT_GLOOM = () => {}
,HIGHLIGHT_GLOWFISH = () => {}
,HIGHLIGHT_GOLDFISH = () => {}
,HIGHLIGHT_GRUNGE = () => {}
,HIGHLIGHT_HALFLIFE = () => {}
,HIGHLIGHT_HAWAII = () => {}
,HIGHLIGHT_HEROKU = () => {}
,HIGHLIGHT_HIVE = () => {}
,HIGHLIGHT_HORIZON = () => {}
,HIGHLIGHT_HUB = () => {}
,HIGHLIGHT_HYRULE = () => {}
,HIGHLIGHT_ICEBERG_TWO = () => {}
,HIGHLIGHT_ISOTOPE = () => {}
,HIGHLIGHT_JEWEL = () => {}
,HIGHLIGHT_JINGLE = () => {}
,HIGHLIGHT_JOKER = () => {}
,HIGHLIGHT_JUICY = () => {}
,HIGHLIGHT_JUMPER = () => {}
,HIGHLIGHT_KEEN = () => {}
,HIGHLIGHT_KIWI = () => {}
,HIGHLIGHT_LARACASTS = () => {}
,HIGHLIGHT_LARAVEL = () => {}
,HIGHLIGHT_LAVENDER = () => {}
,HIGHLIGHT_LEGACY = () => {}
,HIGHLIGHT_LICHEN = () => {}
,HIGHLIGHT_LOYAL = () => {}
,HIGHLIGHT_MAUVE = () => {}
,HIGHLIGHT_MELLOW = () => {}
,HIGHLIGHT_MINTCHOC = () => {}
,HIGHLIGHT_MONZO = () => {}
,HIGHLIGHT_MORASS = () => {}
,HIGHLIGHT_MUD = () => {}
,HIGHLIGHT_NEWTON = () => {}
,HIGHLIGHT_OTAKON = () => {}
,HIGHLIGHT_OVERFLOW = () => {}
,HIGHLIGHT_PASTEL = () => {}
,HIGHLIGHT_PATRIOT = () => {}
,HIGHLIGHT_PEACOCK = () => {}
,HIGHLIGHT_PEACOCKS_IN_SPACE = () => {}
,HIGHLIGHT_PEEL = () => {}
,HIGHLIGHT_PENITENT = () => {}
,HIGHLIGHT_PIGGY = () => {}
,HIGHLIGHT_PLEASURE = () => {}
,HIGHLIGHT_POTPOURRI = () => {}
,HIGHLIGHT_PRIME = () => {}
,HIGHLIGHT_RAINBOW = () => {}
,HIGHLIGHT_REBELLION = () => {}
,HIGHLIGHT_REVELATION = () => {}
,HIGHLIGHT_SCORCH = () => {}
,HIGHLIGHT_SERVICE = () => {}
,HIGHLIGHT_SHREK = () => {}
,HIGHLIGHT_SLATE = () => {}
,HIGHLIGHT_SLIME = () => {}
,HIGHLIGHT_SNAPPY = () => {}
,HIGHLIGHT_SOLARFLARE = () => {}
,HIGHLIGHT_SOUP = () => {}
,HIGHLIGHT_SOURLICK = () => {}
,HIGHLIGHT_SPEARMINT = () => {}
,HIGHLIGHT_SPITFIRE = () => {}
,HIGHLIGHT_STACK = () => {}
,HIGHLIGHT_STASIS = () => {}
,HIGHLIGHT_STEALTH = () => {}
,HIGHLIGHT_STORM = () => {}
,HIGHLIGHT_SUPER = () => {}
,HIGHLIGHT_TAME = () => {}
,HIGHLIGHT_TETRA = () => {}
,HIGHLIGHT_TICKLE = () => {}
,HIGHLIGHT_TONIC = () => {}
,HIGHLIGHT_TRIBAL = () => {}
,HIGHLIGHT_TRON = () => {}
,HIGHLIGHT_TURNIP = () => {}
,HIGHLIGHT_TWEED = () => {}
,HIGHLIGHT_USERSCAPE = () => {}
,HIGHLIGHT_VEGETABLE = () => {}
,HIGHLIGHT_VIOLACEOUS = () => {}
,HIGHLIGHT_VISION = () => {}
,HIGHLIGHT_VOLATILE = () => {}
,HIGHLIGHT_WARLOCK = () => {}
,HIGHLIGHT_WASTE = () => {}
,HIGHLIGHT_YITZCHOK = () => {}
,HIGHLIGHT_YULE = () => {}
,HIGHLIGHT_ZACKS = () => {};
