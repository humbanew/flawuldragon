import { IARCCTSvcHSScannerFast } from './declares';
import { EARCCTSvcHSScannerStateFast } from './enums.cjs';
export declare class ARTSvcHtmlScanner {
    /**
     * For these chars code can be ambiguous, e.g.
     * `<div class="<button class="></div>"</button>`
     * Here, the button start tag can be interpreted as a class
     * or the closing div tag can be interpreted as a class.
     * In case of quotes we always skip.
     *
     * This is in contrast to chars that cannot be skipped, e.g. when
     * going forward and encountering `-->` we cannot go further
     * because we would go outside of the comment but when going
     * forward and encountering `"` we can go forward until
     * the next quote.
     *
     */
    quotes: Set<string>;
    /**
     * HTML tag name (explaining the regex)
     *
     * This regex is for the name of the html tag
     * E.g. we want to match "div" inside "<div>"
     *
     * ^  ### start
     * [:\w]  ### ":" or character or digit
     * ((?![>\/])[\S])  ### everything except closing brackets
     */
    htmlTagNameRE: RegExp;
    /**
     * Empty html tag, e.g. `< ></>`
     */
    htmlTagNameEmptyRE: RegExp;
    /**
     * Html attribute name (explaining the regex)
     *
     * This regex is for html attribute names,
     * E.g. we want to match "class" in "<div class="center">"
     *
     * ^  ### start
     *   [^\s"'>/=]*  ### any anything that isn't whitespace, ", ', >, / or =
     */
    htmlAttributeNameRE: RegExp;
    /**
     * Html attribute value (explaining the regex)
     *
     * ^  ### start
     *   [^\s"'`=<>/]+  ### no whitespace, double quotes, single quotes, back quotes, "=", "<", ">" and "/"
     */
    htmlAttributeValueRE: RegExp;
    position: number;
    private source;
    private length;
    private matchingTagPairs;
    private nonQuoteMatchingTagPairs;
    constructor(source: string, position: number, matchingTagPairs: readonly [string, string][]);
    eos(): boolean;
    getSource(): string;
    goTo(position: number): void;
    goBack(n: number): void;
    advance(n: number): void;
    private goToEnd;
    private goBackToUntilChars;
    goBackUntilEitherChar(chars: string[], skipQuotes: boolean, isReact: boolean): boolean;
    advanceUntilEitherChar(chars: string[], skipQuotes: boolean, isReact: boolean): boolean;
    peekLeft(n?: number): string;
    previousChars(n: number): string;
    peekRight(n?: number): string;
    advanceIfRegExp(regex: RegExp): string | undefined;
    private advanceUntilChars;
    createScannerFast({ input, initialOffset, initialState, matchingTagPairs }: {
        input: string;
        initialOffset: number;
        initialState: EARCCTSvcHSScannerStateFast;
        matchingTagPairs: readonly [string, string][];
    }): IARCCTSvcHSScannerFast;
}
//# sourceMappingURL=AutoSvcHtmlScanner.ac.d.cts.map