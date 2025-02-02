import * as vscode from 'vscode';
import { HCSSettings } from './HCSSettings.ac.js';
import { HCSProvider } from './HCSProvider.ac.js';
import { HCSSetAutoValidation } from './enums.js';
import { constants } from '../constants.js';

/**
 * The `HtmlCssSupport` class provides support for HTML and CSS within the Visual Studio Code environment.
 * It includes methods for validating documents, managing diagnostics, and activating/deactivating the extension.
 * 
 * @remarks
 * This class utilizes the `HCSProvider` for providing HTML and CSS support and the `HCSSettings` for retrieving
 * configuration settings. It registers various providers and event listeners to enable functionality such as
 * auto-validation on document save, open, and change events.
 *
 * @class
 * @example
 * // Example usage:
 * const htmlCssSupport = new HtmlCssSupport();
 * htmlCssSupport.htmlCssSupport_activate(context);
 */
export class HtmlCssSupport {

  /**
   * A protected property that holds the list of enabled languages.
   * This property is initialized using the `getEnabledLanguages` method
   * from the `HCSSettings` prototype.
   */
  protected enabledLanguages = HCSSettings.prototype.getEnabledLanguages();

  /**
   * A collection of diagnostics for the current language service.
   * This is used to store and manage validation messages for the code.
   */
  protected validations = vscode.languages.createDiagnosticCollection();

  /**
   * An instance of HCSProvider used to provide HTML and CSS support.
   * This provider is protected and can be accessed within the class and its subclasses.
   */
  protected provider = new HCSProvider();

  /**
   * Validates the given document based on the specified validation type.
   * 
   * @param document - The document to be validated.
   * @param type - The type of validation to be performed. If undefined, the default validation type is used.
   * 
   * @remarks
   * This method checks if the document's language is supported for validation. If supported, it retrieves the 
   * auto-validation setting for the document. Depending on the validation type, it either sets or deletes the 
   * validation result for the document.
   * 
   * @returns A promise that resolves when the validation is complete.
   */
  protected async htmlCssSupport_validate(
    document: vscode.TextDocument,
    type: HCSSetAutoValidation | undefined
  ) {
    if (this.enabledLanguages.includes(document.languageId)) {
      const validation = HCSSettings.prototype.getAutoValidation(document);
      if (!type || type === validation) {
        this.validations.set(document.uri, await this.provider.validate(document));
      } else if (validation !== HCSSetAutoValidation.ALWAYS) {
        this.validations.delete(document.uri);
      }
    }
  }
  
  /**
   * Activates the HTML CSS Support extension.
   * 
   * This method registers various providers and event listeners to enable HTML and CSS support
   * within the Visual Studio Code environment. It also registers commands for validation and clearing
   * validation results.
   * 
   * @param context - The context in which the extension is activated.
   * @returns A promise that resolves when the initial validation command is executed.
   */
  public htmlCssSupport_activate(context: vscode.ExtensionContext) {
    console.log("Flawuldragon - HTML CSS Support is activate!");

    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(this.enabledLanguages, this.provider, " "),
      vscode.languages.registerDefinitionProvider(this.enabledLanguages, this.provider),
      vscode.workspace.onDidSaveTextDocument(async (document) => {
        HCSProvider.prototype.invalidate(document.uri.toString());
        await this.htmlCssSupport_validate(document, HCSSetAutoValidation.SAVE);
      }),
      vscode.workspace.onDidOpenTextDocument(async (document) => {
        await this.htmlCssSupport_validate(document, HCSSetAutoValidation.ALWAYS);
      }),
      vscode.workspace.onDidChangeTextDocument(async (event) => {
        if (event.contentChanges.length > 0) {
          await this.htmlCssSupport_validate(event.document, HCSSetAutoValidation.ALWAYS);
        }
      }),
      vscode.workspace.onDidCloseTextDocument((document) => {
        this.validations.delete(document.uri);
      }),
      vscode.commands.registerCommand(
        constants.commands.htmlCssSupport.release.fdHtmlCssSupportValidate,
        async (type: HCSSetAutoValidation | undefined) => {
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            await this.htmlCssSupport_validate(editor.document, type);
          }
        }
      ),
      vscode.commands.registerCommand(constants.commands.htmlCssSupport.release.fdHtmlCssSupportClear, () => HCSProvider.prototype.clear())
    );
  
    return vscode.commands.executeCommand<void>(
      constants.commands.htmlCssSupport.release.fdHtmlCssSupportValidate,
      HCSSetAutoValidation.ALWAYS
    );
  }

  /**
   * Deactivates the HTML CSS Support.
   * Logs a message indicating that the HTML CSS Support is being deactivated.
   */
  public htmlCssSupport_desactivate() {
    console.log("Deactivating HTML CSS Support");
  }

}
