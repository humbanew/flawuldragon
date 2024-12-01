import * as vscode from "vscode";

/**
 * The `IndentRainbow` class provides functionality to visually indicate indentation levels in the active text editor
 * for a VSCode extension. It sets up various configurations, decorations, and event listeners to enhance the 
 * readability of code by highlighting indentation levels.
 * 
 * @class
 * @example
 * // Example usage:
 * const indentrainbow = new IndentRainbow();
 * indentrainbow.indentRainbow_activate(context);
 */
export class IndentRainbow {

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
   * - `indentRainbow.errorColor`: Color for indicating indentation errors.
   * - `indentRainbow.tabmixColor`: Color for indicating mixed tab and space indentation.
   * - `indentRainbow.ignoreLinePatterns`: Array of regex patterns to ignore specific lines.
   * - `indentRainbow.colorOnWhiteSpaceOnly`: Boolean to color only whitespace.
   * - `indentRainbow.indicatorStyle`: Style of the indicator, either "classic" or "light".
   * - `indentRainbow.lightIndicatorStyleLineWidth`: Line width for the light indicator style.
   * - `indentRainbow.colors`: Array of colors to cycle through for indentation levels.
   * - `indentRainbow.ignoreErrorLanguages`: Array of languages to ignore indentation errors.
   * - `indentRainbow.includedLanguages`: Array of languages to include for indentation decoration.
   * - `indentRainbow.excludedLanguages`: Array of languages to exclude from indentation decoration.
   * - `indentRainbow.updateDelay`: Delay in milliseconds before updating decorations.
   *
   * Listens for:
   * - Active text editor changes to reconfigure and update decorations.
   * - Text document changes to update decorations.
   * - Configuration changes in the `indentRainbow` section to prompt for a window reload.
   */
  public indentRainbow_activate(context: vscode.ExtensionContext) {
    try {
      console.log("Flawuldragon - Indent Rainbow activated!");
      // Create a decorator types that we use to decorate indent levels
      let decorationTypes: any[] = [];
  
      let doIt = false;
      let clearMe = false;
      let currentLanguageId: any = null;
      let skipAllErrors = false;
  
      let activeEditor = vscode.window.activeTextEditor;
  
      // Error color gets shown when tabs aren't right,
      //  e.g. when you have your tabs set to 2 spaces but the indent is 3 spaces
      const error_color =
        vscode.workspace.getConfiguration("indentRainbow")["errorColor"] ||
        "rgba(128,32,32,0.3)";
      const error_decoration_type = vscode.window.createTextEditorDecorationType({
        backgroundColor: error_color,
      });
  
      const tabmix_color =
        vscode.workspace.getConfiguration("indentRainbow")["tabmixColor"] || "";
      const tabmix_decoration_type =
        "" !== tabmix_color
          ? vscode.window.createTextEditorDecorationType({
              backgroundColor: tabmix_color,
            })
          : null;
  
      const ignoreLinePatterns =
        vscode.workspace.getConfiguration("indentRainbow")[
          "ignoreLinePatterns"
        ] || [];
      const colorOnWhiteSpaceOnly =
        vscode.workspace.getConfiguration("indentRainbow")[
          "colorOnWhiteSpaceOnly"
        ] || false;
      const indicatorStyle =
        vscode.workspace.getConfiguration("indentRainbow")["indicatorStyle"] ||
        "classic";
      const lightIndicatorStyleLineWidth =
        vscode.workspace.getConfiguration("indentRainbow")[
          "lightIndicatorStyleLineWidth"
        ] || 1;
  
      // Colors will cycle through, and can be any size that you want
      const colors = vscode.workspace.getConfiguration("indentRainbow")[
        "colors"
      ] || [
        "rgba(255,255,64,0.07)",
        "rgba(127,255,127,0.07)",
        "rgba(255,127,255,0.07)",
        "rgba(79,236,236,0.07)",
      ];
  
      // Loops through colors and creates decoration types for each one
      colors.forEach((color: any, index: number) => {
        if (indicatorStyle === "classic") {
          decorationTypes[index] = vscode.window.createTextEditorDecorationType({
            backgroundColor: color,
          });
        } else if (indicatorStyle === "light") {
          decorationTypes[index] = vscode.window.createTextEditorDecorationType({
            borderStyle: "solid",
            borderColor: color,
            borderWidth: `0 0 0 ${lightIndicatorStyleLineWidth}px`,
          });
        }
      });
  
      // loop through ignore regex strings and convert to valid RegEx's.
      ignoreLinePatterns.forEach((ignorePattern: string | RegExp, index: string | number) => {
        if (typeof ignorePattern === "string") {
          //parse the string for a regex
          var regParts = ignorePattern.match(/^\/(.*?)\/([gim]*)$/);
          if (regParts) {
            // the parsed pattern had delimiters and modifiers. handle them.
            ignoreLinePatterns[index] = new RegExp(regParts[1], regParts[2]);
          } else {
            // we got pattern string without delimiters
            ignoreLinePatterns[index] = new RegExp(ignorePattern);
          }
        }
      });
  
      if (activeEditor) {
        indentConfig();
      }
  
      if (activeEditor && checkLanguage()) {
        triggerUpdateDecorations();
      }
  
      vscode.window.onDidChangeActiveTextEditor(
        (editor) => {
          activeEditor = editor;
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
          if (activeEditor) {
            indentConfig();
          }
  
          if (
            activeEditor &&
            event.document === activeEditor.document &&
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
          vscode.workspace.getConfiguration("indentRainbow")[
            "ignoreErrorLanguages"
          ] || [];
        skipAllErrors = false;
        if (skiplang.length !== 0) {
          if (
            skiplang.indexOf("*") !== -1 ||
            skiplang.indexOf(currentLanguageId) !== -1
          ) {
            skipAllErrors = true;
          }
        }
      }
  
      function checkLanguage() {
        if (activeEditor) {
          if (currentLanguageId !== activeEditor.document.languageId) {
            var inclang =
              vscode.workspace.getConfiguration("indentRainbow")[
                "includedLanguages"
              ] || [];
            var exclang =
              vscode.workspace.getConfiguration("indentRainbow")[
                "excludedLanguages"
              ] || [];
  
            currentLanguageId = activeEditor.document.languageId;
            doIt = true;
            if (inclang.length !== 0) {
              if (inclang.indexOf(currentLanguageId) === -1) {
                doIt = false;
              }
            }
  
            if (doIt && exclang.length !== 0) {
              if (exclang.indexOf(currentLanguageId) !== -1) {
                doIt = false;
              }
            }
          }
        }
  
        if (clearMe && !doIt) {
          // Clear decorations when language switches away
          var decor: vscode.DecorationOptions[] = [];
          for (let decorationType of decorationTypes) {
            activeEditor.setDecorations(decorationType, decor);
          }
          clearMe = false;
        }
  
        indentConfig();
  
        return doIt;
      }
  
      var timeout: string | number | NodeJS.Timeout = null;
      function triggerUpdateDecorations() {
        if (timeout) {
          clearTimeout(timeout);
        }
        var updateDelay =
          vscode.workspace.getConfiguration("indentRainbow")["updateDelay"] ||
          100;
        timeout = setTimeout(updateDecorations, updateDelay);
      }
  
      function updateDecorations() {
        if (!activeEditor) {
          return;
        }
        var regEx = /^[\t ]+/gm;
        var text = activeEditor.document.getText();
        var tabSizeRaw = activeEditor.options.tabSize;
        var tabSize = 4;
        if (tabSizeRaw !== "auto") {
          tabSize = +tabSizeRaw;
        }
        var tabs = " ".repeat(tabSize);
        const ignoreLines: number[] = [];
        let error_decorator: vscode.DecorationOptions[] = [];
        let tabmix_decorator: vscode.DecorationOptions[] = tabmix_decoration_type
          ? []
          : null;
        let decorators: vscode.DecorationOptions[][] = [];
        decorationTypes.forEach(() => {
          let decorator: vscode.DecorationOptions[] = [];
          decorators.push(decorator);
        });
  
        var match;
        var ignore;
  
        if (!skipAllErrors) {
          /**
           * Checks text against ignore regex patterns from config(or default).
           * stores the line positions of those lines in the ignoreLines array.
           */
          ignoreLinePatterns.forEach((ignorePattern: { exec: (arg0: string) => any; }) => {
            while ((ignore = ignorePattern.exec(text))) {
              const pos = activeEditor.document.positionAt(ignore.index);
              const line = activeEditor.document.lineAt(pos).lineNumber;
              ignoreLines.push(line);
            }
          });
        }
  
        var re = new RegExp("\t", "g");
        let defaultIndentCharRegExp = null;
  
        while ((match = regEx.exec(text))) {
          const pos = activeEditor.document.positionAt(match.index);
          const line = activeEditor.document.lineAt(pos).lineNumber;
          let skip = skipAllErrors || ignoreLines.indexOf(line) !== -1; // true if the lineNumber is in ignoreLines.
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
            var startPos = activeEditor.document.positionAt(match.index);
            var endPos = activeEditor.document.positionAt(
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
              var startPos = activeEditor.document.positionAt(match.index + n);
              if (m[n] === "\t") {
                n++;
              } else {
                n += tabSize;
              }
              if (colorOnWhiteSpaceOnly && n > l) {
                n = l;
              }
              var endPos = activeEditor.document.positionAt(match.index + n);
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
        decorationTypes.forEach((decorationType, index) => {
          activeEditor.setDecorations(decorationType, decorators[index]);
        });
        activeEditor.setDecorations(error_decoration_type, error_decorator);
        tabmix_decoration_type &&
          activeEditor.setDecorations(tabmix_decoration_type, tabmix_decorator);
        clearMe = true;
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
      this.indentRainbow_deactivate();
    } finally {}
  }

  /**
   * Deactivates the indent rainbow feature.
   *
   * This function is called when the extension is deactivated. It can be used to perform any necessary cleanup tasks.
   */
  public indentRainbow_deactivate() {
    vscode.window.showInformationMessage("Indent Rainbow deactivated.");
    // remove indent rainbow decorationType
    this.indentRainbow_activate.prototype.decorationTypes.forEach((decorationType: any) => {
      decorationType.dispose();
    });
  }
}
