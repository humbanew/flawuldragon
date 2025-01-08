export declare class AutoRenameTagService {
    tagsThatAreSelfClosingInHtml: Set<string>;
    EMPTY_SET: Set<string>;
    tagsThatAreSelfClosing: {
        [languageId: string]: Set<string>;
    };
    isSelfClosingTagInLanguage: (languageId: string) => (tagName: string) => boolean;
    matchingTagPairs: {
        [languageId: string]: [string, string][];
    };
    getMatchingTagPairs: (languageId: string) => [string, string][];
    doAutoRenameTag: (text: string, offset: number, newWord: string, oldWord: string, languageId: string) => {
        startOffset: number;
        endOffset: number;
        tagName: string;
    } | undefined;
}
//# sourceMappingURL=AutoRenameTagService.ac.d.cts.map