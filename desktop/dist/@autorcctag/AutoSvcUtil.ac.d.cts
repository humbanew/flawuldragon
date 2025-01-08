import { IARCCTSvcHSScannerFast } from './declares';
export declare class ARTSvcUtil {
    getIndent: (source: string, startOffset: number) => number;
    getNextClosingTagName: (scanner: IARCCTSvcHSScannerFast, initialOffset: number, isSelfClosingTag: (tagName: string) => boolean, isReact?: boolean) => {
        tagName: string;
        offset: number;
        seenRightAngleBracket: boolean;
        indent: number;
    } | undefined;
    getPreviousOpeningTagName: (scanner: IARCCTSvcHSScannerFast, initialOffset: number, isSelfClosingTag: (tagName: string) => boolean, isReact: boolean) => {
        tagName: string;
        offset: number;
        seenRightAngleBracket: boolean;
        indent: number;
    } | undefined;
}
//# sourceMappingURL=AutoSvcUtil.ac.d.cts.map