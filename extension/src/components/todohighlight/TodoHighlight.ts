/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as vscode from "vscode";
import * as os from "os";
import { ITHKeyword, ITHAnnotationType, ITHConfig, ITHErrorHandler, ITHAnnotation, ITHAnnotationsFoundError, ITHAnnotations } from "./declares";
import { Global } from "../globalDefs";
import { IVFDInterruptor } from "../vanilla/defines";

/**
 * The `TodoHighlight` class provides functionality to highlight and manage TODO annotations within a Visual Studio Code workspace.
 * It includes methods to search for annotations, display them in the output channel, and manage the status bar item.
 *
 * @class
 * @example
 * // Example usage:
 * const todohighlight = new FDTodoHighlight();
 * todohighlight.activate(context);
 */
export class FDTodoHighlight {
  /**
   * A reference to the VS Code window object with additional custom properties.
   *
   * @property {boolean} [processing] - Indicates if a process is currently running.
   * @property {boolean} [manuallyCancel] - Indicates if a process was manually cancelled.
   * @property {vscode.OutputChannel} [outputChannel] - A custom output channel for logging.
   */
  protected window = vscode.window as typeof vscode.window & {
    processing?: boolean;
    manuallyCancel?: boolean;
    outputChannel?: vscode.OutputChannel;
  };

  /**
   * The default icon used for the todo highlight.
   *
   * @default "$(checklist)"
   */
  protected defaultIcon = "$(checklist)";

  /**
   * Represents the icon for a zap action.
   * The icon is defined using a string that corresponds to a specific symbol.
   *
   * @default "$(zap)"
   */
  protected zapIcon = "$(zap)";

  /**
   * The default message to be displayed.
   *
   * @default "0"
   */
  protected defaultMsg = "0";

  /**
   * A status bar item to display the current status of TODOs.
   * This item is used to provide quick information and actions related to TODOs in the editor.
   */
  protected todoStatusBarItem!: vscode.StatusBarItem;

  /**
   * A collection of default keywords used for highlighting TODO comments in the code.
   * Each keyword is associated with a specific text, color, background color, and overview ruler color.
   *
   * @property {Object} DEFAULT_KEYWORDS - The default keywords for highlighting.
   * @property {Object} DEFAULT_KEYWORDS.TODO - Configuration for "TODO:" keyword.
   * @property {string} DEFAULT_KEYWORDS.TODO.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.TODO.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.TODO.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.TODO.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.FIXME - Configuration for "FIXME:" keyword.
   * @property {string} DEFAULT_KEYWORDS.FIXME.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.FIXME.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.FIXME.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.FIXME.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.NOTE - Configuration for "NOTE:" keyword.
   * @property {string} DEFAULT_KEYWORDS.NOTE.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.NOTE.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.NOTE.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.NOTE.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.HACK - Configuration for "HACK:" keyword.
   * @property {string} DEFAULT_KEYWORDS.HACK.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.HACK.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.HACK.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.HACK.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.BUG - Configuration for "BUG:" keyword.
   * @property {string} DEFAULT_KEYWORDS.BUG.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.BUG.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.BUG.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.BUG.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.IDEA - Configuration for "IDEA:" keyword.
   * @property {string} DEFAULT_KEYWORDS.IDEA.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.IDEA.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.IDEA.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.IDEA.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.REVIEW - Configuration for "REVIEW:" keyword.
   * @property {string} DEFAULT_KEYWORDS.REVIEW.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.REVIEW.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.REVIEW.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.REVIEW.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.QUESTION - Configuration for "QUESTION:" keyword.
   * @property {string} DEFAULT_KEYWORDS.QUESTION.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.QUESTION.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.QUESTION.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.QUESTION.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.EXAMPLE - Configuration for "EXAMPLE:" keyword.
   * @property {string} DEFAULT_KEYWORDS.EXAMPLE.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.EXAMPLE.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.EXAMPLE.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.EXAMPLE.overviewRulerColor - The color for the overview ruler.
   *
   * @property {Object} DEFAULT_KEYWORDS.TEST - Configuration for "TEST:" keyword.
   * @property {string} DEFAULT_KEYWORDS.TEST.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.TEST.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.TEST.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.TEST.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.REFACTOR - Configuration for "REFACTOR:" keyword.
   * @property {string} DEFAULT_KEYWORDS.REFACTOR.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.REFACTOR.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.REFACTOR.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.REFACTOR.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.OPTIMIZE - Configuration for "OPTIMIZE:" keyword.
   * @property {string} DEFAULT_KEYWORDS.OPTIMIZE.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.OPTIMIZE.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.OPTIMIZE.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.OPTIMIZE.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.DEPRECATED - Configuration for "DEPRECATED:" keyword.
   * @property {string} DEFAULT_KEYWORDS.DEPRECATED.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.DEPRECATED.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.DEPRECATED.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.DEPRECATED.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.INFO - Configuration for "INFO:" keyword.
   * @property {string} DEFAULT_KEYWORDS.INFO.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.INFO.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.INFO.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.INFO.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.WARNING - Configuration for "WARNING:" keyword.
   * @property {string} DEFAULT_KEYWORDS.WARNING.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.WARNING.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.WARNING.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.WARNING.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.ERROR - Configuration for "ERROR:" keyword.
   * @property {string} DEFAULT_KEYWORDS.ERROR.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.ERROR.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.ERROR.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.ERROR.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.SUCCESS - Configuration for "SUCCESS:" keyword.
   * @property {string} DEFAULT_KEYWORDS.SUCCESS.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.SUCCESS.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.SUCCESS.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.SUCCESS.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.FAILURE - Configuration for "FAILURE:" keyword.
   * @property {string} DEFAULT_KEYWORDS.FAILURE.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.FAILURE.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.FAILURE.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.FAILURE.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.0% - Configuration for "0%:" keyword.
   * @property {string} DEFAULT_KEYWORDS.0%.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.0%.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.0%.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.0%.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.25% - Configuration for "25%:" keyword.
   * @property {string} DEFAULT_KEYWORDS.25%.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.25%.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.25%.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.25%.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.50% - Configuration for "50%:" keyword.
   * @property {string} DEFAULT_KEYWORDS.50%.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.50%.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.50%.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.50%.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.75% - Configuration for "75%:" keyword.
   * @property {string} DEFAULT_KEYWORDS.75%.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.75%.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.75%.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.75%.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.100% - Configuration for "100%:" keyword.
   * @property {string} DEFAULT_KEYWORDS.100%.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.100%.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.100%.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.100%.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.INTEGER - Configuration for "INTEGER:" keyword.
   * @property {string} DEFAULT_KEYWORDS.INTEGER.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.INTEGER.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.INTEGER.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.INTEGER.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.FLOAT - Configuration for "FLOAT:" keyword.
   * @property {string} DEFAULT_KEYWORDS.FLOAT.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.FLOAT.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.FLOAT.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.FLOAT.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.STRING - Configuration for "STRING:" keyword.
   * @property {string} DEFAULT_KEYWORDS.STRING.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.STRING.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.STRING.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.STRING.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.BOOLEAN - Configuration for "BOOLEAN:" keyword.
   * @property {string} DEFAULT_KEYWORDS.BOOLEAN.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.BOOLEAN.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.BOOLEAN.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.BOOLEAN.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.ARRAY - Configuration for "ARRAY:" keyword.
   * @property {string} DEFAULT_KEYWORDS.ARRAY.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.ARRAY.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.ARRAY.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.ARRAY.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.OBJECT - Configuration for "OBJECT:" keyword.
   * @property {string} DEFAULT_KEYWORDS.OBJECT.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.OBJECT.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.OBJECT.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.OBJECT.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.FUNCTION - Configuration for "FUNCTION:" keyword.
   * @property {string} DEFAULT_KEYWORDS.FUNCTION.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.FUNCTION.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.FUNCTION.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.FUNCTION.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.CLASS - Configuration for "CLASS:" keyword.
   * @property {string} DEFAULT_KEYWORDS.CLASS.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.CLASS.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.CLASS.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.CLASS.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.INTERFACE - Configuration for "INTERFACE:" keyword.
   * @property {string} DEFAULT_KEYWORDS.INTERFACE.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.INTERFACE.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.INTERFACE.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.INTERFACE.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.TYPE - Configuration for "TYPE:" keyword.
   * @property {string} DEFAULT_KEYWORDS.TYPE.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.TYPE.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.TYPE.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.TYPE.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.ENUM - Configuration for "ENUM:" keyword.
   * @property {string} DEFAULT_KEYWORDS.ENUM.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.ENUM.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.ENUM.backgroundColor - The background color.
   * 
   * @property {Object} DEFAULT_KEYWORDS.CONSTANT - Configuration for "CONSTANT:" keyword.
   * @property {string} DEFAULT_KEYWORDS.CONSTANT.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.CONSTANT.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.CONSTANT.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.CONSTANT.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.VARIABLE - Configuration for "VARIABLE:" keyword.
   * @property {string} DEFAULT_KEYWORDS.VARIABLE.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.VARIABLE.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.VARIABLE.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.VARIABLE.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.PROPERTY - Configuration for "PROPERTY:" keyword.
   * @property {string} DEFAULT_KEYWORDS.PROPERTY.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.PROPERTY.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.PROPERTY.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.PROPERTY.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.METHOD - Configuration for "METHOD:" keyword.
   * @property {string} DEFAULT_KEYWORDS.METHOD.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.METHOD.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.METHOD.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.METHOD.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.EVENT - Configuration for "EVENT:" keyword.
   * @property {string} DEFAULT_KEYWORDS.EVENT.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.EVENT.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.EVENT.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.EVENT.overviewRulerColor - The color for the overview ruler.
   * 
   * @property {Object} DEFAULT_KEYWORDS.TEMPLATE - Configuration for "TEMPLATE:" keyword.
   * @property {string} DEFAULT_KEYWORDS.TEMPLATE.text - The text to highlight.
   * @property {string} DEFAULT_KEYWORDS.TEMPLATE.color - The text color.
   * @property {string} DEFAULT_KEYWORDS.TEMPLATE.backgroundColor - The background color.
   * @property {string} DEFAULT_KEYWORDS.TEMPLATE.overviewRulerColor - The color for the overview ruler.
   */
  protected DEFAULT_KEYWORDS = {
    "TODO:": {
      text: "TODO:",
      color: "#fff",
      backgroundColor: "#ffbd2a",
      overviewRulerColor: "rgba(255,189,42,0.8)",
    },
    "FIXME:": {
      text: "FIXME:",
      color: "#fff",
      backgroundColor: "#f06292",
      overviewRulerColor: "rgba(240,98,146,0.8)",
    },
    "NOTE:": {
      text: "NOTE:",
      color: "#fff",
      backgroundColor: "#4caf50",
      overviewRulerColor: "rgba(76,175,80,0.8)",
    },
    "HACK:": {
      text: "HACK:",
      color: "#fff",
      backgroundColor: "#ff5722",
      overviewRulerColor: "rgba(255,87,34,0.8)",
    },
    "BUG:": {
      text: "BUG:",
      color: "#fff",
      backgroundColor: "#f44336",
      overviewRulerColor: "rgba(244,67,54,0.8)",
    },
    "IDEA:": {
      text: "IDEA:",
      color: "#fff",
      backgroundColor: "#2196f3",
      overviewRulerColor: "rgba(33,150,243,0.8)",
    },
    "REVIEW:": {
      text: "REVIEW:",
      color: "#fff",
      backgroundColor: "#673ab7",
      overviewRulerColor: "rgba(103,58,183,0.8)",
    },
    "QUESTION:": {
      text: "QUESTION:",
      color: "#fff",
      backgroundColor: "#9c27b0",
      overviewRulerColor: "rgba(156,39,176,0.8)",
    },
    "EXAMPLE:": {
      text: "EXAMPLE:",
      color: "#fff",
      backgroundColor: "#00bcd4",
      overviewRulerColor: "rgba(0,188,212,0.8)",
    },
    "TEST:": {
      text: "TEST:",
      color: "#fff",
      backgroundColor: "#009688",
      overviewRulerColor: "rgba(0,150,136,0.8)",
    },
    "REFACTOR:": {
      text: "REFACTOR:",
      color: "#fff",
      backgroundColor: "#ff113a",
      overviewRulerColor: "rgba(255,17,58,0.8)",
    },
    "OPTIMIZE:": {
      text: "OPTIMIZE:",
      color: "#fff",
      backgroundColor: "#ff9800",
      overviewRulerColor: "rgba(255,152,0,0.8)",
    },
    "DEPRECATED:": {
      text: "DEPRECATED:",
      color: "#fff",
      backgroundColor: "#795548",
      overviewRulerColor: "rgba(121,85,72,0.8)",
    },
    "INFO:": {
      text: "INFO:",
      color: "#fff",
      backgroundColor: "#607d8b",
      overviewRulerColor: "rgba(96,125,139,0.8)",
    },
    "WARNING:": {
      text: "WARNING:",
      color: "#fff",
      backgroundColor: "#ff4421",
      overviewRulerColor: "rgba(255,68,33,0.8)",
    },
    "ERROR:": {
      text: "ERROR:",
      color: "#fff",
      backgroundColor: "#f44336",
      overviewRulerColor: "rgba(244,67,54,0.8)",
    },
    "SUCCESS:": {
      text: "SUCCESS:",
      color: "#fff",
      backgroundColor: "#4caf50",
      overviewRulerColor: "rgba(76,175,80,0.8)",
    },
    "FAILURE:": {
      text: "FAILURE:",
      color: "#fff",
      backgroundColor: "#ff0000",
      overviewRulerColor: "rgba(255,0,0,0.8)",
    },
    "0%:": {
      text: "0%:",
      color: "#fff",
      backgroundColor: "#000000",
      overviewRulerColor: "rgba(0,0,0,0.8)",
    },
    "25%:": {
      text: "25%:",
      color: "#fff",
      backgroundColor: "#121212",
      overviewRulerColor: "rgba(18,18,18,0.8)",
    },
    "50%:": {
      text: "50%:",
      color: "#fff",
      backgroundColor: "#242424",
      overviewRulerColor: "rgba(36,36,36,0.8)",
    },
    "75%:": {
      text: "75%:",
      color: "#fff",
      backgroundColor: "#363636",
      overviewRulerColor: "rgba(54,54,54,0.8)",
    },
    "100%:": {
      text: "100%:",
      color: "#fff",
      backgroundColor: "#484848",
      overviewRulerColor: "rgba(72,72,72,0.8)",
    },
    "INTEGER:": {
      text: "INTEGER:",
      color: "#fff",
      backgroundColor: "#0000ff",
      overviewRulerColor: "rgba(0,0,255,0.8)",
    },
    "FLOAT:": {
      text: "FLOAT:",
      color: "#fff",
      backgroundColor: "#00ff00",
      overviewRulerColor: "rgba(0,255,0,0.8)",
    },
    "STRING:": {
      text: "STRING:",
      color: "#fff",
      backgroundColor: "#ff340f",
      overviewRulerColor: "rgba(255,52,15,0.8)",
    },
    "BOOLEAN:": {
      text: "BOOLEAN:",
      color: "#fff",
      backgroundColor: "#ff00ff",
      overviewRulerColor: "rgba(255,0,255,0.8)",
    },
    "ARRAY:": {
      text: "ARRAY:",
      color: "#fff",
      backgroundColor: "#33321d",
      overviewRulerColor: "rgba(51,50,29,0.8)",
    },
    "OBJECT:": {
      text: "OBJECT:",
      color: "#fff",
      backgroundColor: "#144dff",
      overviewRulerColor: "rgba(20,77,255,0.8)",
    },
    "FUNCTION:": {
      text: "FUNCTION:",
      color: "#fff",
      backgroundColor: "#2388ff",
      overviewRulerColor: "rgba(35,136,255,0.8)",
    },
    "CLASS:": {
      text: "CLASS:",
      color: "#fff",
      backgroundColor: "#a3551d",
      overviewRulerColor: "rgba(163,85,29,0.8)",
    },
    "INTERFACE:": {
      text: "INTERFACE:",
      color: "#fff",
      backgroundColor: "#ff8a00",
      overviewRulerColor: "rgba(255,138,0,0.8)",
    },
    "TYPE:": {
      text: "TYPE:",
      color: "#fff",
      backgroundColor: "#aafa1a",
      overviewRulerColor: "rgba(170,250,26,0.8)",
    },
    "ENUM:": {
      text: "ENUM:",
      color: "#fff",
      backgroundColor: "#1a5513",
      overviewRulerColor: "rgba(26,85,19,0.8)",
    },
    "CONSTANT:": {
      text: "CONSTANT:",
      color: "#fff",
      backgroundColor: "#1187ff",
      overviewRulerColor: "rgba(17,135,255,0.8)",
    },
    "VARIABLE:": {
      text: "VARIABLE:",
      color: "#fff",
      backgroundColor: "#000011",
      overviewRulerColor: "rgba(0,0,17,0.8)",
    },
    "PROPERTY:": {
      text: "PROPERTY:",
      color: "#fff",
      backgroundColor: "#654432",
      overviewRulerColor: "rgba(101,68,50,0.8)",
    },
    "METHOD:": {
      text: "METHOD:",
      color: "#fff",
      backgroundColor: "#38af30",
      overviewRulerColor: "rgba(56,175,48,0.8)",
    },
    "EVENT:": {
      text: "EVENT:",
      color: "#fff",
      backgroundColor: "#DF3F8F",
      overviewRulerColor: "rgba(223,63,143,0.8)",
    },
    "TEMPLATE:": {
      text: "TEMPLATE:",
      color: "#fff",
      backgroundColor: "#FFA500",
      overviewRulerColor: "rgba(255,165,0,0.8)",
    },
  };

  /**
   * The default style configuration for highlighting TODO items.
   *
   * @property {string} color - The text color for the highlight.
   * @property {string} backgroundColor - The background color for the highlight.
   */
  protected DEFAULT_STYLE = {
    color: "#2196f3",
    backgroundColor: "#ffeb3b",
  };

  /**
   * Assembles and returns a dictionary of keywords with their associated styles.
   *
   * @param keywords - An array of keywords to be highlighted. Each keyword can be a string or an object implementing the ITHKeyword interface.
   * @param customDefaultStyle - A custom style object to be applied to the keywords.
   * @param isCaseSensitive - A boolean indicating whether the keyword matching should be case sensitive.
   * @returns A dictionary where the keys are the keywords and the values are the corresponding styled keyword objects.
   */
  protected getAssembledData(
    keywords: ITHKeyword[],
    customDefaultStyle: any,
    isCaseSensitive: boolean,
  ) {
    var result: { [key: string]: ITHKeyword } = {};
    keywords.forEach((v) => {
      v = typeof v == "string" ? { text: v } : v;
      var text = v?.text;
      v = Object?.assign(
        {},
        this.DEFAULT_KEYWORDS[text as keyof typeof this.DEFAULT_KEYWORDS],
        v,
      );

      if (!isCaseSensitive) {
        text = text?.toUpperCase();
      }

      if (
        text == "TODO:" ||
        text == "FIXME:" ||
        text == "NOTE:" ||
        text == "HACK:" ||
        text == "BUG:" ||
        text == "IDEA:" ||
        text == "REVIEW:" ||
        text == "QUESTION:" ||
        text == "EXAMPLE:" ||
        text == "TEST:" ||
        text == "REFACTOR:" ||
        text == "OPTIMIZE:" ||
        text == "DEPRECATED:" ||
        text == "INFO:" ||
        text == "WARNING:" ||
        text == "ERROR:" ||
        text == "SUCCESS:" ||
        text == "FAILURE:" ||
        text == "0%:" ||
        text == "25%:" ||
        text == "50%:" ||
        text == "75%:" ||
        text == "100%:" ||
        text == "INTEGER:" ||
        text == "FLOAT:" ||
        text == "STRING:" ||
        text == "BOOLEAN:" ||
        text == "ARRAY:" ||
        text == "OBJECT:" ||
        text == "FUNCTION:" ||
        text == "CLASS:" ||
        text == "INTERFACE:" ||
        text == "TYPE:" ||
        text == "ENUM:" ||
        text == "CONSTANT:" ||
        text == "VARIABLE:" ||
        text == "PROPERTY:" ||
        text == "METHOD:" ||
        text == "EVENT:" ||
        text == "TEMPLATE:"
      ) {
        v = Object?.assign({}, this.DEFAULT_KEYWORDS[text], v);
      }
      result[text] = Object?.assign(
        {},
        this.DEFAULT_STYLE,
        customDefaultStyle,
        v,
      );
    });

    Object?.keys(this.DEFAULT_KEYWORDS).forEach((v) => {
      if (!result[v]) {
        result[v] = Object?.assign(
          {},
          this.DEFAULT_STYLE,
          customDefaultStyle,
          this.DEFAULT_KEYWORDS[v as keyof typeof this.DEFAULT_KEYWORDS],
        );
      }
    });

    return result;
  }

  /**
   * Prompts the user to choose an annotation type from the available options.
   *
   * @param availableAnnotationTypes - An array of available annotation types to choose from.
   * @returns A promise that resolves to the selected annotation type or undefined if no selection was made.
   */
  protected chooseAnnotationType(
    availableAnnotationTypes: ITHAnnotationType[],
  ): Thenable<ITHAnnotationType | undefined> {
    return this.window.showQuickPick(availableAnnotationTypes, {});
  }

  // get the include/exclude config
  /**
   * Generates a string representation of the given configuration paths.
   *
   * @param config - The configuration paths, which can be either an array of strings or a single string.
   * @returns A string representation of the configuration paths. If the input is an array, the paths are joined with commas and enclosed in curly braces. If the input is a string, it is returned as is. If the input is neither, an empty string is returned.
   */
  protected getPathes(config: ITHConfig | string): string {
    return Array.isArray(config)
      ? "{" + config.join(",") + "}"
      : typeof config === "string"
      ? config
      : "";
  }

  /**
   * Searches for annotations in the workspace based on the provided pattern and invokes the callback with the results.
   *
   * @param workspaceState - The state of the workspace, used to store the annotation list.
   * @param pattern - The regular expression pattern to search for annotations.
   * @param callback - The callback function to be invoked with the search results.
   *   - `err`: An error object if an error occurred, otherwise null.
   *   - `annotations`: An object containing the found annotations.
   *   - `annotationList`: A list of all found annotations.
   */
  protected searchAnnotations(
    workspaceState: vscode.Memento,
    pattern: RegExp,
    callback: {
      (err: any, annotations: any, annotationList: any): void;
      (err: any, annotations: any, annotationList: any): void;
      (arg0: { message: string }, arg1: {}, arg2: any[]): void;
    },
  ) {
    var settings = vscode.workspace.getConfiguration("fd.todohighlight");
    var includePattern = this.getPathes(
      settings.get("include") || "{**/*}",
    );
    var excludePattern = this.getPathes(
      settings.get("exclude") || "{**/*}",
    );
    var limitationForSearch = settings.get("maxFilesForSearch", 5120);

    var statusMsg = ` Searching...`;

    this.window.processing = true;

    this.setStatusMsg(this.zapIcon, statusMsg, "Status message");

    vscode.workspace
      .findFiles(includePattern, excludePattern, limitationForSearch)
      .then(
        function (files) {
          if (!files || files.length === 0) {
            callback({ message: "No files found" }, "", "");
            return;
          }

          var totalFiles: number = files.length,
            progress: number = 0,
            times: number = 0,
            annotations: { [key: string]: any[] } = {},
            annotationList: any[] = [];

          function file_iterated() {
            times++;
            progress = Math.floor((times / totalFiles) * 100);

            FDTodoHighlight.prototype.setStatusMsg(
              FDTodoHighlight.prototype.zapIcon,
              progress + "% " + statusMsg,
              "Status message",
            );

            if (
              times === totalFiles ||
              FDTodoHighlight.prototype.window.manuallyCancel
            ) {
              FDTodoHighlight.prototype.window.processing = true;
              workspaceState.update("annotationList", annotationList);
              callback("", annotations, annotationList);
            }
          }

          for (var i = 0; i < totalFiles; i++) {
            vscode.workspace.openTextDocument(files[i]).then(
              function (file) {
                FDTodoHighlight.prototype.searchAnnotationInFile(
                  file,
                  annotations,
                  annotationList,
                  pattern,
                );
                file_iterated();
              },
              function (err) {
                FDTodoHighlight.prototype.errorHandler(err);
                file_iterated();
              },
            );
          }
        },
        function (err) {
          FDTodoHighlight.prototype.errorHandler(err);
        },
      );
  }

  /**
   * Searches for annotations in a given file and updates the provided annotations and annotationList.
   *
   * @param file - The TextDocument to search for annotations.
   * @param annotations - An object where the keys are file paths and the values are arrays of ITHAnnotation.
   * @param annotationList - A list of all annotations found.
   * @param regexp - The regular expression to match annotations in the file.
   */
  protected searchAnnotationInFile(
    file: vscode.TextDocument,
    annotations: { [key: string]: ITHAnnotation[] },
    annotationList: ITHAnnotation[],
    regexp: RegExp,
  ) {
    const fileInUri = file.uri.toString();
    const pathWithoutFile = fileInUri.substring(7, fileInUri.length);

    for (let line = 0; line < file.lineCount; line++) {
      const lineText = file.lineAt(line).text;
      const match = lineText.match(regexp);
      if (match !== null) {
        if (!annotations.hasOwnProperty(pathWithoutFile)) {
          annotations[pathWithoutFile] = [];
        }
        let content = this.getContent(lineText, match);
        if (content.length > 500) {
          content = content.substring(0, 500)?.trim() + "...";
        }
        const locationInfo = this.getLocationInfo(
          fileInUri,
          pathWithoutFile,
          lineText,
          line,
          match,
        );

        const annotation: ITHAnnotation = {
          uri: locationInfo.uri,
          label: content,
          detail: locationInfo.relativePath,
          lineNum: line,
          fileName: locationInfo.absPath,
          startCol: locationInfo.startCol,
          endCol: locationInfo.endCol,
        };
        annotationList.push(annotation);
        annotations[pathWithoutFile].push(annotation);
      }
    }
  }

  /**
   * Handles the event when annotations are found.
   *
   * @param err - The error object if an error occurred, otherwise null.
   * @param annotations - The annotations object containing the found annotations.
   * @param annotationList - The list of individual annotations found.
   */
  protected annotationsFound(
    err: ITHAnnotationsFoundError,
    annotations: ITHAnnotations,
    annotationList: ITHAnnotation[],
  ) {
    if (err) {
      console.log("todohighlight err:", err);
      this.setStatusMsg(
        this.defaultIcon,
        this.defaultMsg,
        "Status message",
      );
      return;
    }

    const resultNum = annotationList.length;
    const tooltip = resultNum + " result(s) found";
    this.setStatusMsg(
      this.defaultIcon,
      resultNum.toString(),
      tooltip,
    );
    this.showOutputChannel(annotationList);
  }

  /**
   * Displays the output channel with the provided annotation data.
   *
   * @param data - An array of annotation data to be displayed in the output channel.
   *
   * The function performs the following steps:
   * 1. Clears the output channel if it exists.
   * 2. If no data is provided, shows an information message indicating no results.
   * 3. Retrieves the configuration settings for "todohighlight".
   * 4. Iterates over the annotation data and formats the output based on the platform (Windows, macOS, or Linux).
   * 5. Appends the formatted annotation data to the output channel.
   * 6. Displays the output channel.
   *
   * The annotation data includes:
   * - `uri`: The URI of the file.
   * - `lineNum`: The line number of the annotation.
   * - `startCol`: The starting column of the annotation.
   * - `label`: The label or description of the annotation.
   *
   * The function also handles toggling the URI format based on the configuration settings.
   */
  protected showOutputChannel(data: ITHAnnotation[]) {
    if (!this.window.outputChannel) return;
    this.window.outputChannel.clear();

    if (data.length === 0) {
      this.window.showInformationMessage("No results");
      return;
    }

    var settings = vscode.workspace.getConfiguration("todohighlight");
    var toggleURI = settings.get("toggleURI", false);

    interface AnnotationData {
      uri: string;
      lineNum: number;
      startCol: number;
      label: string;
    }

    data.forEach(function (v: AnnotationData, i: number, a: AnnotationData[]) {
      // due to an issue of vscode(https://github.com/Microsoft/vscode/issues/586), in order to make file path clickable within the output channel,the file path differs from platform
      const patternA = "#" + (i + 1) + "\t" + v.uri + "#" + (v.lineNum + 1);
      const patternB =
        "#" +
        (i + 1) +
        "\t" +
        v.uri +
        ":" +
        (v.lineNum + 1) +
        ":" +
        (v.startCol + 1);
      const patterns = [patternA, patternB];

      //for windows and mac
      let patternType = 0;
      if (os.platform && os.platform() === "linux") {
        // for linux
        patternType = 1;
      }

      if (toggleURI) {
        //toggle the pattern
        patternType = +!patternType;
      }
      if (FDTodoHighlight.prototype.window.outputChannel) {
        FDTodoHighlight.prototype.window.outputChannel.appendLine(
          patterns[patternType],
        );
        FDTodoHighlight.prototype.window.outputChannel.appendLine(
          "\t" + v.label + "\n",
        );
      }
    });
    this.window.outputChannel.show();
  }

  /**
   * Extracts the content of a line starting from the first occurrence of a match.
   *
   * @param lineText - The text of the line to extract content from.
   * @param match - An array containing the match information, where the first element is the matched string.
   * @returns The substring of the line starting from the first occurrence of the match to the end of the line.
   */
  protected getContent(lineText: string, match: any[]) {
    return lineText.substring(lineText.indexOf(match[0]), lineText.length);
  }

  /**
   * Retrieves location information for a highlighted TODO item.
   *
   * @param fileInUri - The URI of the file containing the TODO item.
   * @param pathWithoutFile - The path of the file without the file name.
   * @param lineText - The text of the line containing the TODO item.
   * @param line - The line number of the TODO item.
   * @param match - The match array containing the TODO item.
   * @returns An object containing the URI, absolute path, relative path, start column, and end column of the TODO item.
   */
  protected getLocationInfo(
    fileInUri: string,
    pathWithoutFile: string,
    lineText: string | any[],
    line: number,
    match: any[],
  ) {
    var rootPath =
      (vscode.workspace.workspaceFolders &&
        vscode.workspace.workspaceFolders[0].uri.fsPath) + "/";
    var outputFile = pathWithoutFile.replace(rootPath, "");
    var startCol = lineText.indexOf(match[0]);
    var endCol = lineText.length;
    var location = outputFile + " " + (line + 1) + ":" + (startCol + 1);

    return {
      uri: fileInUri,
      absPath: pathWithoutFile,
      relativePath: location,
      startCol: startCol,
      endCol: endCol,
    };
  }

  /**
   * Creates a status bar item for the Todo Highlight extension.
   *
   * This status bar item is positioned on the left side of the status bar with a priority of 98.
   * It displays a default icon and message, and provides a tooltip and command for listing annotations.
   * The background color of the status bar item is set to a warning theme color.
   */
  protected createStatusBarItem(numNotations?: number) {
    let todoHighlightStatusBarItem = Global.todoHighlight.statusBar.posicao;
    if(numNotations == 0) {
      todoHighlightStatusBarItem.text = this.defaultIcon + " " + this.defaultMsg;
    } else {
      todoHighlightStatusBarItem.text = this.defaultIcon + " " + numNotations;
    }
    todoHighlightStatusBarItem.tooltip = "Number of available annotations";
    todoHighlightStatusBarItem.command = "flawuldragon.todohighlight.listAnnotations";
    todoHighlightStatusBarItem.color = "gold";
    todoHighlightStatusBarItem.show();
    this.todoStatusBarItem = todoHighlightStatusBarItem;
    return todoHighlightStatusBarItem;
  }

  /**
   * Handles errors for the TodoHighlight component.
   *
   * @param err - The error object implementing the ITHErrorHandler interface.
   * @protected
   */
  protected errorHandler(err: ITHErrorHandler): void {
    this.window.processing = true;
    this.setStatusMsg(
      this.defaultIcon,
      this.defaultMsg,
      "Status message",
    );
    console.log("todohighlight err:", err);
  }

  /**
   * Updates the status message of the todo status bar item.
   *
   * @param icon - The icon to display in the status bar item.
   * @param msg - The message to display in the status bar item.
   * @param tooltip - The tooltip to display when hovering over the status bar item. Can be a string or a `vscode.MarkdownString`.
   */
  protected setStatusMsg(
    icon: string,
    msg: string,
    tooltip: string | vscode.MarkdownString,
  ) {
    if (this.todoStatusBarItem) {
      this.todoStatusBarItem.text = `${icon} ${msg}` || "";
      if (tooltip) {
        this.todoStatusBarItem.tooltip = tooltip || "";
      }
      this.todoStatusBarItem.show();
    }
  }

  /**
   * Escapes special characters in a string to be used in a regular expression.
   *
   * This method takes a string and replaces characters that have special meaning
   * in regular expressions (such as `-`, `/`, `\`, `^`, `$`, `*`, `+`, `?`, `.`, `(`, `)`, `|`, `[`, `]`, `{`, and `}`)
   * with their escaped counterparts.
   *
   * @param s - The string to escape.
   * @returns The escaped string, safe to use in a regular expression.
   */
  protected escapeRegExp(s: string) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  /**
   * Activates the TodoHighlight extension.
   *
   * @param context - The extension context provided by VSCode.
   *
   * This function initializes the TodoHighlight extension, sets up the necessary configurations,
   * and registers commands for toggling highlights, listing annotations, and showing the output channel.
   * It also sets up event listeners for changes in the active text editor, text document, and configuration.
   *
   * The function uses the following interfaces:
   * - `AssembledData`: Represents the assembled decoration data.
   * - `DecorationTypes`: Represents the decoration types.
   *
   * The function performs the following tasks:
   * - Initializes variables and settings.
   * - Defines helper functions for updating decorations and initializing the extension.
   * - Registers commands for toggling highlights, listing annotations, and showing the output channel.
   * - Sets up event listeners for changes in the active text editor, text document, and configuration.
   * - Triggers the update of decorations if an active editor is present.
   */
  public activate(context: vscode.ExtensionContext) {
    try {
      console.log("Flawuldragon - TodoHighlight activated");

      var timeout: NodeJS.Timeout | undefined = undefined;
      var activeEditor = this.window.activeTextEditor;
      interface AssembledData {
        [key: string]: vscode.DecorationRenderOptions;
      }
  
      interface DecorationTypes {
        [key: string]: vscode.TextEditorDecorationType;
      }
  
      let isCaseSensitive: boolean,
        assembledData: AssembledData,
        decorationTypes: DecorationTypes,
        pattern: RegExp,
        styleForRegExp: vscode.DecorationRenderOptions,
        keywordsPattern: string;
      var workspaceState = context.workspaceState;
  
      var settings = vscode.workspace.getConfiguration("todohighlight");
  
      let triggerUpdateDecorations = () => {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(updateDecorations, 0);
      };
  
      let updateDecorations = () => {
        if (!activeEditor || !activeEditor.document) {
          return;
        }
  
        var text = activeEditor.document.getText();
        var mathes: { [key: string]: vscode.DecorationOptions[] } = {},
          match;
        while ((match = pattern.exec(text))) {
          var startPos = activeEditor.document.positionAt(match.index);
          var endPos = activeEditor.document.positionAt(
            match.index + match[0].length,
          );
          var decoration = {
            range: new vscode.Range(startPos, endPos),
          };
  
          var matchedValue = match[0];
          if (!isCaseSensitive) {
            matchedValue = matchedValue.toUpperCase();
          }
  
          if (mathes[matchedValue]) {
            mathes[matchedValue].push(decoration);
          } else {
            mathes[matchedValue] = [decoration];
          }
  
          if (keywordsPattern?.trim() && !decorationTypes[matchedValue]) {
            decorationTypes[matchedValue] =
              vscode.window.createTextEditorDecorationType(styleForRegExp);
          }
        }
  
        Object.keys(decorationTypes).forEach((v) => {
          if (!isCaseSensitive) {
            v = v.toUpperCase();
          }
          var rangeOption =
            settings.get("isEnable") && mathes[v] ? mathes[v] : [];
          var decorationType = decorationTypes[v];
          if (activeEditor) {
            activeEditor.setDecorations(decorationType, rangeOption);
          }
        });
      };
  
      let init = (settings: vscode.WorkspaceConfiguration) => {
        var customDefaultStyle = settings.get("defaultStyle") || {};
        keywordsPattern = settings.get("keywordsPattern") || "";
        isCaseSensitive = settings.get("isCaseSensitive", true);
        const outputChannel = vscode.window.createOutputChannel(
          "Flawuldragon TodoHighlight",
        );
  
        decorationTypes = {};
  
        if (keywordsPattern.trim()) {
          styleForRegExp = Object?.assign(
            {},
            this.DEFAULT_STYLE,
            customDefaultStyle,
            {
              overviewRulerLane: vscode.OverviewRulerLane.Right,
            },
          );
          pattern = new RegExp(keywordsPattern, isCaseSensitive ? "g" : "gi");
        } else {
          const keywords = settings.get("keywords");
          assembledData = this.getAssembledData(
            Array.isArray(keywords) ? keywords : [],
            customDefaultStyle,
            isCaseSensitive,
          );
          if (!this.todoStatusBarItem) {
            this.todoStatusBarItem = this.createStatusBarItem(Object.keys(assembledData).length);
          }
  
          if (assembledData != undefined) {
            Object.keys(assembledData).forEach((v) => {
              if (!isCaseSensitive) {
                v = v.toUpperCase();
              }
  
              var mergedStyle = Object?.assign(
                {},
                {
                  overviewRulerLane: vscode.OverviewRulerLane.Right,
                },
                assembledData ? assembledData[v] : {},
              );
  
              if (!mergedStyle.overviewRulerColor) {
                // use backgroundColor as the default overviewRulerColor if not specified by the user setting
                mergedStyle.overviewRulerColor = mergedStyle.backgroundColor;
              }
  
              decorationTypes[v] =
                this.window.createTextEditorDecorationType(mergedStyle);
            });
  
            const patternString = Object.keys(assembledData)
              .map((v) => {
                return this.escapeRegExp(v);
              })
              .join("|");
            pattern = new RegExp(patternString, "gi");
          }
        }
  
        pattern = new RegExp(pattern, "gi");
        if (isCaseSensitive) {
          pattern = new RegExp(pattern, "g");
        }
      };
  
      context.subscriptions.push(
        vscode.commands.registerCommand(
          Global.todoHighlight.comandos["toggle-highlight"],
          () => {
            settings
              .update("isEnable", !settings.get("isEnable"), true)
              .then(() => {
                triggerUpdateDecorations();
              });
          },
        ),
      );
  
      context.subscriptions.push(
        vscode.commands.registerCommand(
          Global.todoHighlight.comandos["list-annotations"],
          () => {
            if (keywordsPattern?.trim()) {
              this.searchAnnotations(
                workspaceState,
                pattern,
                (err, annotations, annotationList = []) =>
                  this.annotationsFound(
                    err,
                    annotations,
                    annotationList,
                  ),
              );
            } else {
              if (!assembledData) return;
              var availableAnnotationTypes = Object.keys(assembledData);
              availableAnnotationTypes.unshift("ALL");
              interface AnnotationType {
                annotationType: string;
              }
  
              interface SearchPattern {
                searchPattern: RegExp;
              }
  
              this.chooseAnnotationType(
                availableAnnotationTypes.map((type) => ({
                  label: type,
                  annotationType: type,
                })),
              ).then(function (annotationType) {
                if (!annotationType) return;
                if (!annotationType) return;
                var searchPattern: SearchPattern["searchPattern"] = pattern;
                if (annotationType.annotationType != "ALL") {
                  annotationType.annotationType =
                    new FDTodoHighlight().escapeRegExp(
                      annotationType.annotationType,
                    );
                  searchPattern = new RegExp(
                    annotationType.annotationType,
                    isCaseSensitive ? "g" : "gi",
                  );
                }
                new FDTodoHighlight().searchAnnotations(
                  workspaceState,
                  searchPattern,
                  (err, annotations, annotationList = []) =>
                    new FDTodoHighlight().annotationsFound(
                      err,
                      annotations,
                      annotationList,
                    ),
                );
              });
            }
          },
        ),
      );
  
      context.subscriptions.push(
        vscode.commands.registerCommand(
          Global.todoHighlight.comandos["output-panel"],
          () => {
            var annotationList = workspaceState.get("annotationList", []);
            new FDTodoHighlight().showOutputChannel(annotationList);
          },
        ),
      );

      const statusBarCommand = Global.todoHighlight.comandos["status-bar"];
      const interruptor: IVFDInterruptor = { on: true, off: false };
      vscode.commands.registerCommand(statusBarCommand, () => {
        if (interruptor.on == true) {
          this.todoStatusBarItem.hide();
          interruptor.on = false;
          interruptor.off = true;
        } else {
          this.todoStatusBarItem.show();
          interruptor.on = true;
          interruptor.off = false;
        }
      });
  
      if (activeEditor) {
        triggerUpdateDecorations();
      }
  
      vscode.window.onDidChangeActiveTextEditor(
        function (editor) {
          activeEditor = editor;
          if (editor) {
            triggerUpdateDecorations();
          }
        },
        "",
        context.subscriptions,
      );
  
      vscode.workspace.onDidChangeTextDocument(
        function (event) {
          if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations();
          }
        },
        "",
        context.subscriptions,
      );
  
      vscode.workspace.onDidChangeConfiguration(
        function () {
          settings = vscode.workspace.getConfiguration("fd.todohighlight");
          if (!settings.get("isEnable")) return;
          // NOTE: if disabled, do not re-initialize the data or we will not be able to clear the style immediatly via 'toggle highlight' command
          init(settings);
          triggerUpdateDecorations();
        },
        "",
        context.subscriptions,
      );
  
      init(settings);
    } catch (error) {
      console.error("Flawuldragon - TODO Highlight error: " + error);
      vscode.window.showErrorMessage("An error occurred while activating the TODO Highlight integration: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
      this.desactivate();
    } finally {}
  }

  /**
   * Deactivates the todo highlight feature by disposing of the status bar item and output channel if they exist.
   *
   * This method checks if the `todoStatusBarItem` and `outputChannel` are defined, and if so, disposes of them to clean up resources.
   */
  public desactivate() {
    if (this.todoStatusBarItem) {
      this.todoStatusBarItem.dispose();
    }
    if (this.window.outputChannel) {
      this.window.outputChannel.dispose();
    }
  }
}
