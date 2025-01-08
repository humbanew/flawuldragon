import * as vscode from "vscode";
import { ITHKeyword, ITHAnnotationType, ITHConfig, ITHErrorHandler, ITHAnnotation, ITHAnnotationsFoundError, ITHAnnotations } from "./declares";
/**
 * The `TodoHighlight` class provides functionality to highlight and manage TODO annotations within a Visual Studio Code workspace.
 * It includes methods to search for annotations, display them in the output channel, and manage the status bar item.
 *
 * @class
 * @example
 * // Example usage:
 * const todohighlight = new TodoHighlight();
 * todohighlight.todohighlight_activate(context);
 */
export declare class TodoHighlight {
    /**
     * A reference to the VS Code window object with additional custom properties.
     *
     * @property {boolean} [processing] - Indicates if a process is currently running.
     * @property {boolean} [manuallyCancel] - Indicates if a process was manually cancelled.
     * @property {vscode.OutputChannel} [outputChannel] - A custom output channel for logging.
     */
    protected window: typeof vscode.window & {
        processing?: boolean;
        manuallyCancel?: boolean;
        outputChannel?: vscode.OutputChannel;
    };
    /**
     * The default icon used for the todo highlight.
     *
     * @default "$(checklist)"
     */
    protected defaultIcon: string;
    /**
     * Represents the icon for a zap action.
     * The icon is defined using a string that corresponds to a specific symbol.
     *
     * @default "$(zap)"
     */
    protected zapIcon: string;
    /**
     * The default message to be displayed.
     *
     * @default "0"
     */
    protected defaultMsg: string;
    /**
     * A status bar item to display the current status of TODOs.
     * This item is used to provide quick information and actions related to TODOs in the editor.
     */
    protected todoStatusBarItem: vscode.StatusBarItem;
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
     */
    protected DEFAULT_KEYWORDS: {
        "TODO:": {
            text: string;
            color: string;
            backgroundColor: string;
            overviewRulerColor: string;
        };
        "FIXME:": {
            text: string;
            color: string;
            backgroundColor: string;
            overviewRulerColor: string;
        };
        "NOTE:": {
            text: string;
            color: string;
            backgroundColor: string;
            overviewRulerColor: string;
        };
        "HACK:": {
            text: string;
            color: string;
            backgroundColor: string;
            overviewRulerColor: string;
        };
        "BUG:": {
            text: string;
            color: string;
            backgroundColor: string;
            overviewRulerColor: string;
        };
        "IDEA:": {
            text: string;
            color: string;
            backgroundColor: string;
            overviewRulerColor: string;
        };
        "REVIEW:": {
            text: string;
            color: string;
            backgroundColor: string;
            overviewRulerColor: string;
        };
        "QUESTION:": {
            text: string;
            color: string;
            backgroundColor: string;
            overviewRulerColor: string;
        };
        "EXAMPLE:": {
            text: string;
            color: string;
            backgroundColor: string;
            overviewRulerColor: string;
        };
        "TEST:": {
            text: string;
            color: string;
            backgroundColor: string;
            overviewRulerColor: string;
        };
    };
    /**
     * The default style configuration for highlighting TODO items.
     *
     * @property {string} color - The text color for the highlight.
     * @property {string} backgroundColor - The background color for the highlight.
     */
    protected DEFAULT_STYLE: {
        color: string;
        backgroundColor: string;
    };
    /**
     * Assembles and returns a dictionary of keywords with their associated styles.
     *
     * @param keywords - An array of keywords to be highlighted. Each keyword can be a string or an object implementing the ITHKeyword interface.
     * @param customDefaultStyle - A custom style object to be applied to the keywords.
     * @param isCaseSensitive - A boolean indicating whether the keyword matching should be case sensitive.
     * @returns A dictionary where the keys are the keywords and the values are the corresponding styled keyword objects.
     */
    protected todoHighlight_getAssembledData(keywords: ITHKeyword[], customDefaultStyle: any, isCaseSensitive: boolean): {
        [key: string]: ITHKeyword;
    };
    /**
     * Prompts the user to choose an annotation type from the available options.
     *
     * @param availableAnnotationTypes - An array of available annotation types to choose from.
     * @returns A promise that resolves to the selected annotation type or undefined if no selection was made.
     */
    protected todoHighlight_chooseAnnotationType(availableAnnotationTypes: ITHAnnotationType[]): Thenable<ITHAnnotationType | undefined>;
    /**
     * Generates a string representation of the given configuration paths.
     *
     * @param config - The configuration paths, which can be either an array of strings or a single string.
     * @returns A string representation of the configuration paths. If the input is an array, the paths are joined with commas and enclosed in curly braces. If the input is a string, it is returned as is. If the input is neither, an empty string is returned.
     */
    protected todoHighlight_getPathes(config: ITHConfig | string): string;
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
    protected todoHighlight_searchAnnotations(workspaceState: vscode.Memento, pattern: RegExp, callback: {
        (err: any, annotations: any, annotationList: any): void;
        (err: any, annotations: any, annotationList: any): void;
        (arg0: {
            message: string;
        }, arg1: {}, arg2: any[]): void;
    }): void;
    /**
     * Searches for annotations in a given file and updates the provided annotations and annotationList.
     *
     * @param file - The TextDocument to search for annotations.
     * @param annotations - An object where the keys are file paths and the values are arrays of ITHAnnotation.
     * @param annotationList - A list of all annotations found.
     * @param regexp - The regular expression to match annotations in the file.
     */
    protected todoHighlight_searchAnnotationInFile(file: vscode.TextDocument, annotations: {
        [key: string]: ITHAnnotation[];
    }, annotationList: ITHAnnotation[], regexp: RegExp): void;
    /**
     * Handles the event when annotations are found.
     *
     * @param err - The error object if an error occurred, otherwise null.
     * @param annotations - The annotations object containing the found annotations.
     * @param annotationList - The list of individual annotations found.
     */
    protected todoHighlight_annotationsFound(err: ITHAnnotationsFoundError, annotations: ITHAnnotations, annotationList: ITHAnnotation[]): void;
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
    protected todoHighlight_showOutputChannel(data: ITHAnnotation[]): void;
    /**
     * Extracts the content of a line starting from the first occurrence of a match.
     *
     * @param lineText - The text of the line to extract content from.
     * @param match - An array containing the match information, where the first element is the matched string.
     * @returns The substring of the line starting from the first occurrence of the match to the end of the line.
     */
    protected todoHighlight_getContent(lineText: string, match: any[]): string;
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
    protected todoHighlight_getLocationInfo(fileInUri: string, pathWithoutFile: string, lineText: string | any[], line: number, match: any[]): {
        uri: string;
        absPath: string;
        relativePath: string;
        startCol: number;
        endCol: number;
    };
    /**
     * Creates a status bar item for the Todo Highlight extension.
     *
     * This status bar item is positioned on the left side of the status bar with a priority of 98.
     * It displays a default icon and message, and provides a tooltip and command for listing annotations.
     * The background color of the status bar item is set to a warning theme color.
     */
    protected todoHighlight_createStatusBarItem(numNotations?: number): vscode.StatusBarItem;
    /**
     * Handles errors for the TodoHighlight component.
     *
     * @param err - The error object implementing the ITHErrorHandler interface.
     * @protected
     */
    protected todoHighlight_errorHandler(err: ITHErrorHandler): void;
    /**
     * Updates the status message of the todo status bar item.
     *
     * @param icon - The icon to display in the status bar item.
     * @param msg - The message to display in the status bar item.
     * @param tooltip - The tooltip to display when hovering over the status bar item. Can be a string or a `vscode.MarkdownString`.
     */
    protected todoHighlight_setStatusMsg(icon: string, msg: string, tooltip: string | vscode.MarkdownString): void;
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
    protected todoHighlight_escapeRegExp(s: string): string;
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
    todoHighlight_activate(context: vscode.ExtensionContext): void;
    /**
     * Deactivates the todo highlight feature by disposing of the status bar item and output channel if they exist.
     *
     * This method checks if the `todoStatusBarItem` and `outputChannel` are defined, and if so, disposes of them to clean up resources.
     */
    todoHighlight_desactivate(): void;
}
//# sourceMappingURL=TodoHighlight.d.cts.map