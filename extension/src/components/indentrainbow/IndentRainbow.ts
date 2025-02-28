/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import * as vscode from "vscode";

/**
 * The `IndentRainbow` class provides functionality to visually indicate indentation levels in the active text editor
 * for a VSCode extension. It sets up various configurations, decorations, and event listeners to enhance the 
 * readability of code by highlighting indentation levels.
 * 
 * @class
 * @example
 * // Example usage:
 * const indentrainbow = new FDIndentRainbow();
 * indentrainbow.activate(context);
 */
export class FDIndentRainbow {
  // Variáveis
  // Create a decorator types that we use to decorate indent levels
  /**
   * An array to hold the decoration types.
   * This array is used to store different types of decorations.
   */
  protected static decorationTypes: any[] = [];

  /**
   * A static boolean property indicating whether the action should be performed.
   * Defaults to `false`.
   */
  protected static doIt = false;

  /**
   * A flag indicating whether the current instance should be cleared.
   */
  protected static clearMe = false;

  /**
   * Stores the current language identifier.
   * This is used to keep track of the language currently being processed or highlighted.
   */
  protected static currentLanguageId: any = null;

  /**
   * A flag to indicate whether all errors should be skipped.
   * When set to `true`, the system will bypass error handling.
   * Defaults to `false`.
   */
  protected static skipAllErrors = false;

  /**
   * A reference to the currently active text editor in the Visual Studio Code window.
   * This property is static and can be accessed without instantiating the class.
   */
  protected static activeEditor = vscode.window.activeTextEditor;

  // Error color gets shown when tabs aren't right,
  //  e.g. when you have your tabs set to 2 spaces but the indent is 3 spaces
  /**
   * The color used to highlight errors in the indentation rainbow.
   * This value is retrieved from the "indentRainbow" configuration in the workspace settings.
   * If the configuration is not set, it defaults to "rgba(128,32,32,0.3)".
   */
  protected static error_color =
    vscode.workspace.getConfiguration("fd.indentRainbow")["errorColor"] ||
    "rgba(128,32,32,0.3)";

  /**
   * A static property that defines the decoration type for error highlighting in the text editor.
   * It uses the `vscode.window.createTextEditorDecorationType` method to create a decoration type
   * with a background color specified by `this.error_color`.
   * 
   * @protected
   * @static
   */
  protected static error_decoration_type = vscode.window.createTextEditorDecorationType({
    backgroundColor: this.error_color,
  });

  /**
   * The color configuration for tab mix in the Indent Rainbow extension.
   * This value is retrieved from the user's workspace settings under the "indentRainbow" configuration.
   * If the "tabmixColor" setting is not defined, it defaults to an empty string.
   */
  protected static tabmix_color =
    vscode.workspace.getConfiguration("fd.indentRainbow")["tabmixColor"] || "";

  /**
   * A static property that holds a `TextEditorDecorationType` instance if `tabmix_color` is not an empty string.
   * The decoration type is created with a background color specified by `tabmix_color`.
   * If `tabmix_color` is an empty string, the property is set to `null`.
   */
  protected static tabmix_decoration_type =
    "" !== this.tabmix_color
      ? vscode.window.createTextEditorDecorationType({
          backgroundColor:this.tabmix_color,
        })
      : null;

  /**
   * An array of patterns used to ignore specific lines when applying the indent rainbow effect.
   * These patterns are retrieved from the "ignoreLinePatterns" configuration in the "indentRainbow" section
   * of the user's workspace settings. If no patterns are configured, an empty array is used by default.
   */
  protected static ignoreLinePatterns =
    vscode.workspace.getConfiguration("fd.indentRainbow")[
      "ignoreLinePatterns"
    ] || [];

  /**
   * A configuration setting that determines whether the indent rainbow colors
   * should be applied only to whitespace characters.
   * 
   * This setting is retrieved from the "indentRainbow" configuration in the
   * user's VSCode workspace settings. If the setting is not defined, it defaults
   * to `false`.
   */
  protected static colorOnWhiteSpaceOnly =
    vscode.workspace.getConfiguration("fd.indentRainbow")[
      "colorOnWhiteSpaceOnly"
    ] || false;

  /**
   * The style of the indent indicator.
   * 
   * This value is retrieved from the VS Code workspace configuration
   * under the "indentRainbow" section. If the configuration is not set,
   * it defaults to "classic".
   */
  protected static indicatorStyle =
    vscode.workspace.getConfiguration("fd.indentRainbow")["indicatorStyle"] ||
    "classic";

  /**
   * Retrieves the configuration value for the light indicator style line width from the
   * "indentRainbow" settings in the VS Code workspace configuration. If the configuration
   * value is not set, it defaults to 1.
   */
  protected static lightIndicatorStyleLineWidth =
    vscode.workspace.getConfiguration("fd.indentRainbow")[
      "lightIndicatorStyleLineWidth"
    ] || 1;

  // Colors will cycle through, and can be any size that you want
  /**
   * An array of RGBA color strings used for indent highlighting.
   * The colors are retrieved from the "indentRainbow" configuration in the workspace settings.
   * If the configuration is not set, a default set of colors is used.
   * 
   * Default colors:
   * - "rgba(255,255,64,0.07)" (light yellow)
   * - "rgba(127,255,127,0.07)" (light green)
   * - "rgba(255,127,255,0.07)" (light pink)
   * - "rgba(79,236,236,0.07)" (light cyan)
   */
  protected static colors = vscode.workspace.getConfiguration("fd.indentRainbow")[
    "colors"
  ] || [
    "rgba(255,255,64,0.07)",
    "rgba(127,255,127,0.07)",
    "rgba(255,127,255,0.07)",
    "rgba(79,236,236,0.07)",
  ];

  /**
   * A static property that holds a timeout identifier.
   * It can be a string, a number, or a NodeJS.Timeout object.
   * Initially set to 0.
   */
  protected static timeout: string | number | NodeJS.Timeout = 0;

  /**
   * Activates the Indent Rainbow feature for the VSCode extension.
   * This function sets up various configurations, decorations, and event listeners
   * to visually indicate indentation levels in the active text editor.
   *
   * @param {vscode.ExtensionContext} context - The context in which the extension is running.
   *
   * @throws Will throw an error if there is an issue during activation.
   *
   * Configuration options:
   * - `FDindentRainbow.errorColor`: Color for indicating indentation errors.
   * - `FDindentRainbow.tabmixColor`: Color for indicating mixed tab and space indentation.
   * - `FDindentRainbow.ignoreLinePatterns`: Array of regex patterns to ignore specific lines.
   * - `FDindentRainbow.colorOnWhiteSpaceOnly`: Boolean to color only whitespace.
   * - `FDindentRainbow.indicatorStyle`: Style of the indicator, either "classic" or "light".
   * - `FDindentRainbow.lightIndicatorStyleLineWidth`: Line width for the light indicator style.
   * - `FDindentRainbow.colors`: Array of colors to cycle through for indentation levels.
   * - `FDindentRainbow.ignoreErrorLanguages`: Array of languages to ignore indentation errors.
   * - `FDindentRainbow.includedLanguages`: Array of languages to include for indentation decoration.
   * - `FDindentRainbow.excludedLanguages`: Array of languages to exclude from indentation decoration.
   * - `FDindentRainbow.updateDelay`: Delay in milliseconds before updating decorations.
   *
   * Listens for:
   * - Active text editor changes to reconfigure and update decorations.
   * - Text document changes to update decorations.
   * - Configuration changes in the `indentRainbow` section to prompt for a window reload.
   */
  public activate(context: vscode.ExtensionContext) {
    try {
      console.log("Flawuldragon - Indent Rainbow activated!");
  
      // Loops through colors and creates decoration types for each one
      FDIndentRainbow.colors.forEach((color: any, index: number) => {
        if (FDIndentRainbow.indicatorStyle === "classic") {
          FDIndentRainbow.decorationTypes[index] = vscode.window.createTextEditorDecorationType({
            backgroundColor: color,
          });
        } else if (FDIndentRainbow.indicatorStyle === "light") {
          FDIndentRainbow.decorationTypes[index] = vscode.window.createTextEditorDecorationType({
            borderStyle: "solid",
            borderColor: color,
            borderWidth: `0 0 0 ${FDIndentRainbow.lightIndicatorStyleLineWidth}px`,
          });
        }
      });
  
      // loop through ignore regex strings and convert to valid RegEx's.
      FDIndentRainbow.ignoreLinePatterns.forEach((ignorePattern: string | RegExp, index: string | number) => {
        if (typeof ignorePattern === "string") {
          //parse the string for a regex
          var regParts = ignorePattern.match(/^\/(.*?)\/([gim]*)$/);
          if (regParts) {
            // the parsed pattern had delimiters and modifiers. handle them.
            FDIndentRainbow.ignoreLinePatterns[index] = new RegExp(regParts[1], regParts[2]);
          } else {
            // we got pattern string without delimiters
            FDIndentRainbow.ignoreLinePatterns[index] = new RegExp(ignorePattern);
          }
        }
      });
  
      if (FDIndentRainbow.activeEditor) {
        indentConfig();
      }
  
      if (FDIndentRainbow.activeEditor && checkLanguage()) {
        triggerUpdateDecorations();
      }
  
      vscode.window.onDidChangeActiveTextEditor(
        (editor) => {
          FDIndentRainbow.activeEditor = editor;
          if (editor) {
            indentConfig();
          }
  
          if (editor && checkLanguage()) {
            triggerUpdateDecorations();
          }
        },
        null,
        context.subscriptions,
      );
  
      vscode.workspace.onDidChangeTextDocument(
        (event) => {
          if (FDIndentRainbow.activeEditor) {
            indentConfig();
          }
  
          if (
            FDIndentRainbow.activeEditor &&
            event.document === FDIndentRainbow.activeEditor.document &&
            checkLanguage()
          ) {
            triggerUpdateDecorations();
          }
        },
        null,
        context.subscriptions,
      );
  
      function isEmptyObject(obj: any) {
        return Object.getOwnPropertyNames(obj).length === 0;
      }
  
      function indentConfig() {
        var skiplang =
          vscode.workspace.getConfiguration("fd.indentRainbow")[
            "ignoreErrorLanguages"
          ] || [];
        FDIndentRainbow.skipAllErrors = false;
        if (skiplang.length !== 0) {
          if (
            skiplang.indexOf("*") !== -1 ||
            skiplang.indexOf(FDIndentRainbow.currentLanguageId) !== -1
          ) {
            FDIndentRainbow.skipAllErrors = true;
          }
        }
      }
  
      function checkLanguage() {
        if (FDIndentRainbow.activeEditor) {
          if (FDIndentRainbow.currentLanguageId !== FDIndentRainbow.activeEditor.document.languageId) {
            var inclang =
              vscode.workspace.getConfiguration("fd.indentRainbow")[
                "includedLanguages"
              ] || [];
            var exclang =
              vscode.workspace.getConfiguration("fd.indentRainbow")[
                "excludedLanguages"
              ] || [];
  
              FDIndentRainbow.currentLanguageId = FDIndentRainbow.activeEditor.document.languageId;
              FDIndentRainbow.doIt = true;
            if (inclang.length !== 0) {
              if (inclang.indexOf(FDIndentRainbow.currentLanguageId) === -1) {
                FDIndentRainbow.doIt = false;
              }
            }
  
            if (FDIndentRainbow.doIt && exclang.length !== 0) {
              if (exclang.indexOf(FDIndentRainbow.currentLanguageId) !== -1) {
                FDIndentRainbow.doIt = false;
              }
            }
          }
        }
  
        if (FDIndentRainbow.clearMe && !FDIndentRainbow.doIt) {
          // Clear decorations when language switches away
          var decor: vscode.DecorationOptions[] = [];
          for (let decorationType of FDIndentRainbow.decorationTypes) {
            if (FDIndentRainbow.activeEditor) {
              FDIndentRainbow.activeEditor.setDecorations(decorationType, decor);
            }
          }
          FDIndentRainbow.clearMe = false;
        }
  
        indentConfig();
  
        return FDIndentRainbow.doIt;
      }
  
      function triggerUpdateDecorations() {
        if (FDIndentRainbow.timeout) {
          clearTimeout(FDIndentRainbow.timeout);
        }
        var updateDelay =
          vscode.workspace.getConfiguration("indentRainbow")["updateDelay"] ||
          100;
          FDIndentRainbow.timeout = setTimeout(updateDecorations, updateDelay);
      }

      function disableFeatures() {
        vscode.commands.registerCommand("flawuldragon.FDindentRainbow.deactivate", () => {
          FDIndentRainbow.decorationTypes.forEach((decorationType) => {
            decorationType.dispose();
          });
          FDIndentRainbow.error_decoration_type.dispose();
          FDIndentRainbow.tabmix_decoration_type && FDIndentRainbow.tabmix_decoration_type.dispose();
        });
      }
      disableFeatures();

      function enableFeatures() {
        vscode.commands.registerCommand("flawuldragon.FDindentRainbow.activate", () => {
          updateDecorations();
        });
      }
      enableFeatures();
  
      function updateDecorations() {
        if (!FDIndentRainbow.activeEditor) {
          return;
        }
        var regEx = /^[\t ]+/gm;
        var text = FDIndentRainbow.activeEditor.document.getText();
        var tabSizeRaw = FDIndentRainbow.activeEditor.options.tabSize;
        var tabSize = 4;
        if (tabSizeRaw !== "auto") {
          tabSize = tabSizeRaw !== undefined ? +tabSizeRaw : 4;
        }
        var tabs = " ".repeat(tabSize);
        const ignoreLines: number[] = [];
        let error_decorator: vscode.DecorationOptions[] = [];
        let tabmix_decorator: vscode.DecorationOptions[] = [];
        let decorators: vscode.DecorationOptions[][] = [];
        FDIndentRainbow.decorationTypes.forEach(() => {
          let decorator: vscode.DecorationOptions[] = [];
          decorators.push(decorator);
        });
  
        var match;
        var ignore;
  
        if (!FDIndentRainbow.skipAllErrors) {
          /**
           * Checks text against ignore regex patterns from config(or default).
           * stores the line positions of those lines in the ignoreLines array.
           */
          FDIndentRainbow.ignoreLinePatterns.forEach((ignorePattern: { exec: (arg0: string) => any; }) => {
            while ((ignore = ignorePattern.exec(text))) {
              const pos = FDIndentRainbow.activeEditor ? FDIndentRainbow.activeEditor.document.positionAt(ignore.index) : null;
              const line = pos && FDIndentRainbow.activeEditor ? FDIndentRainbow.activeEditor.document.lineAt(pos).lineNumber : 0;
              ignoreLines.push(line);
            }
          });
        }
  
        var re = new RegExp("\t", "g");
        let defaultIndentCharRegExp = null;
  
        while ((match = regEx.exec(text))) {
          const pos = FDIndentRainbow.activeEditor.document.positionAt(match.index);
          const line = FDIndentRainbow.activeEditor.document.lineAt(pos).lineNumber;
          let skip = FDIndentRainbow.skipAllErrors || ignoreLines.indexOf(line) !== -1; // true if the lineNumber is in ignoreLines.
          var thematch = match[0];
          var ma = match[0].replace(re, tabs).length;
          /**
           * Error handling.
           * When the indent spacing (as spaces) is not divisible by the tabsize,
           * consider the indent incorrect and mark it with the error decorator.
           * Checks for lines being ignored in ignoreLines array ( `skip` Boolran)
           * before considering the line an error.
           */
          if (!skip && ma % tabSize !== 0) {
            var startPos = FDIndentRainbow.activeEditor.document.positionAt(match.index);
            var endPos = FDIndentRainbow.activeEditor.document.positionAt(
              match.index + match[0].length,
            );
            var decoration = {
              range: new vscode.Range(startPos, endPos),
              hoverMessage: undefined as string | vscode.MarkdownString | undefined,
            };
            error_decorator.push(decoration);
          } else {
            var m = match[0];
            var l = m.length;
            var o = 0;
            var n = 0;
            while (n < l) {
              const s = n;
              var startPos = FDIndentRainbow.activeEditor.document.positionAt(match.index + n);
              if (m[n] === "\t") {
                n++;
              } else {
                n += tabSize;
              }
              if (FDIndentRainbow.colorOnWhiteSpaceOnly && n > l) {
                n = l;
              }
              var endPos = FDIndentRainbow.activeEditor.document.positionAt(match.index + n);
              var decoration = {
                range: new vscode.Range(startPos, endPos),
                hoverMessage: undefined as string | vscode.MarkdownString | undefined,
              };
              var sc = 0;
              var tc = 0;
              if (!skip && tabmix_decorator) {
                // counting (split is said to be faster than match()
                // only do it if we don't already skip all errors
                var tc = thematch.split("\t").length - 1;
                if (tc) {
                  // only do this if we already have some tabs
                  var sc = thematch.split(" ").length - 1;
                }
                // if we have (only) "spaces" in a "tab" indent file we
                // just ignore that, because we don't know if there
                // should really be tabs or spaces for indentation
                // If you (yes you!) know how to find this out without
                // infering this from the file, speak up :)
              }
              if (sc > 0 && tc > 0) {
                tabmix_decorator.push(decoration);
              } else {
                let decorator_index = o % decorators.length;
                decorators[decorator_index].push(decoration);
              }
              o++;
            }
          }
        }
        FDIndentRainbow.decorationTypes.forEach((decorationType, index) => {
          if (FDIndentRainbow.activeEditor) {
            FDIndentRainbow.activeEditor.setDecorations(decorationType, decorators[index]);
          }
        });
        FDIndentRainbow.activeEditor.setDecorations(FDIndentRainbow.error_decoration_type, error_decorator);
        FDIndentRainbow.tabmix_decoration_type &&
        FDIndentRainbow.activeEditor.setDecorations(FDIndentRainbow.tabmix_decoration_type, tabmix_decorator);
        FDIndentRainbow.clearMe = true;
      }
      /**
       * Listen for configuration change in indentRainbow section
       * When anything changes in the section, show a prompt to reload
       * VSCode window
       */
      vscode.workspace.onDidChangeConfiguration((configChangeEvent) => {
        if (configChangeEvent.affectsConfiguration("indentRainbow")) {
          const actions = ["Reload now", "Later"];
  
          vscode.window
            .showInformationMessage(
              "The VSCode window needs to reload for the changes to take effect. Would you like to reload the window now?",
              ...actions,
            )
            .then((action) => {
              if (action === actions[0]) {
                vscode.commands.executeCommand("workbench.action.reloadWindow");
              }
            });
        }
      });
    } catch (error) {
      console.error("Flawuldragon - Indent Rainbow error: ", error);
      vscode.window.showErrorMessage("An error occurred while activating the indent rainbow integration feature: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
      this.desactivate();
    } finally {}
  }

  /**
   * Deactivates the indent rainbow feature.
   *
   * This function is called when the extension is deactivated. It can be used to perform any necessary cleanup tasks.
   */
  public desactivate() {
    vscode.window.showInformationMessage("Indent Rainbow deactivated.");
    vscode.commands.executeCommand("flawuldragon.FDindentRainbow.deactivate");
  }
}
