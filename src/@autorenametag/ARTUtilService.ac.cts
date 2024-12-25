import { EARTSScannerStateFast } from "./EARTSScannerStateFast.cjs";
import { EARTSTokenTypeFast } from "./EARTSTokenTypeFast.cjs";
import { IARTSScannerFast } from "./IARTSScannerFast";

export class ARTUtilService {
  public getIndent = (source: string, startOffset: number) => {
    let indent = 0;
    while (indent <= startOffset && source[startOffset - indent] !== '\n') {
      indent++;
    }
    return indent;
  };

  public getNextClosingTagName: (
    scanner: IARTSScannerFast,
    initialOffset: number,
    isSelfClosingTag: (tagName: string) => boolean,
    isReact?: boolean
  ) =>
    | {
        tagName: string;
        offset: number;
        seenRightAngleBracket: boolean;
        indent: number;
      }
    | undefined = (
    scanner,
    initialOffset,
    isSelfClosingTag,
    isReact = false
  ) => {
    let offset = initialOffset;
    let nextClosingTagName: string | undefined;
    let stack: string[] = [];
    let seenRightAngleBracket = false;
    let i = 0;
    scanner.stream.goTo(offset);
    do {
      const hasFoundChar = scanner.stream.advanceUntilEitherChar(
        ['<', '>'],
        false,
        isReact
      );
      if (!hasFoundChar) {
        return undefined;
      }
      const char = scanner.stream.peekRight();
      if (!['<', '>'].includes(char)) {
        return undefined;
      }
      if (char === '<') {
        if (scanner.stream.peekRight(1) === '/') {
          scanner.stream.advance(2);
          offset = scanner.stream.position;
          scanner.state = EARTSScannerStateFast.AfterOpeningEndTag;
          const token = scanner.scan();
          if (token !== EARTSTokenTypeFast.EndTag) {
            return undefined;
          }
          const tokenText = scanner.getTokenText();
          if (stack.length) {
            const top = stack.pop();
            if (top !== tokenText) {
              // TODO
              // console.log(scanner.stream.position);
              // console.log(top);
              // console.log(tokenText);
              // console.error('no');
              return undefined;
            }
            continue;
          }
          nextClosingTagName = tokenText;
          if (nextClosingTagName !== undefined) {
            break;
          }
        }

        scanner.stream.advance(1);
        scanner.state = EARTSScannerStateFast.AfterOpeningStartTag;
        const token = scanner.scan();
        if (token !== EARTSTokenTypeFast.StartTag) {
          return undefined;
        }
        const tokenText = scanner.getTokenText();
        if (isSelfClosingTag(tokenText)) {
          scanner.stream.advanceUntilEitherChar(['>'], true, isReact);
          scanner.stream.advance(1);
          continue;
        }
        stack.push(tokenText);
        continue;
      } else {
        if (scanner.stream.peekRight(1) === '') {
          return undefined;
        }
        // don't go outside of comment when inside
        if (scanner.stream.previousChars(2) === '--') {
          return undefined;
        }
        if (scanner.stream.peekLeft(1) === '/') {
          const charBefore = scanner.stream.peekLeft(2);
          if (!/[\s"'\}]/.test(charBefore)) {
            const codeBefore = scanner.stream
              .getSource()
              .slice(0, scanner.stream.position);
            if (/href=[^\s]+$/.test(codeBefore)) {
              scanner.stream.advance(1);
              continue;
            }
          }
          if (stack.length === 0) {
            return undefined;
          }
          stack.pop();
          scanner.stream.advance(1);
          continue;
        }
        scanner.stream.advance(1);
      }
    } while (true);

    const startOffset = offset;
    const indent = this.getIndent(scanner.stream.getSource(), startOffset - 3);

    return {
      tagName: nextClosingTagName,
      offset,
      seenRightAngleBracket,
      indent
    };
  };

  // getNextClosingTagName(
  //   createScannerFast({
  //     input: `<div>
  //   <div>
  //   <div></div>
  // </div>`,
  //     initialOffset: 0,
  //     initialState: ScannerStateFast.AfterOpeningEndTag,
  //     matchingTagPairs: getMatchingTagPairs('javascriptreact')
  //   }),
  //   12,
  //   () => false,
  //   true
  // ); //?

  public getPreviousOpeningTagName: (
    scanner: IARTSScannerFast,
    initialOffset: number,
    isSelfClosingTag: (tagName: string) => boolean,
    isReact: boolean
  ) =>
    | {
        tagName: string;
        offset: number;
        seenRightAngleBracket: boolean;
        indent: number;
      }
    | undefined = (scanner, initialOffset, isSelfClosingTag, isReact) => {
    let offset = initialOffset + 1;
    let parentTagName: string | undefined;
    let stack: string[] = [];
    let seenRightAngleBracket = false;
    let selfClosing = false;
    outer: do {
      scanner.stream.goTo(offset - 2);
      const hasFoundChar = scanner.stream.goBackUntilEitherChar(
        ['<', '>'],
        false,
        isReact
      );
      if (!hasFoundChar) {
        return undefined;
      }
      const char = scanner.stream.peekLeft(1);
      if (!['<', '>'].includes(char)) {
        return undefined;
      }
      if (char === '>') {
        if (scanner.stream.peekLeft(2) === '/') {
          selfClosing = true;
        }
        seenRightAngleBracket = true;
        scanner.stream.goBack(1);
        scanner.stream.goBackUntilEitherChar(['<'], true, isReact);
        offset = scanner.stream.position;
      }
      // push closing tags onto the stack
      if (scanner.stream.peekRight() === '/') {
        offset = scanner.stream.position;
        scanner.stream.advance(1);
        scanner.state = EARTSScannerStateFast.AfterOpeningEndTag;
        scanner.scan();
        const token = scanner.getTokenText();
        if (token === '') {
          offset = scanner.stream.position - 1;
          continue;
        }
        stack.push(scanner.getTokenText());
        continue;
      }
      offset = scanner.stream.position;
      scanner.state = EARTSScannerStateFast.AfterOpeningStartTag;
      const token = scanner.scan();
      if (token !== EARTSTokenTypeFast.StartTag) {
        return undefined;
      }
      const tokenText = scanner.getTokenText();
      if (selfClosing) {
        selfClosing = false;
        continue;
      }
      if (isSelfClosingTag(tokenText)) {
        continue;
      }
      // pop closing tags from the tags
      inner: while (stack.length) {
        let top = stack.pop();
        if (top === tokenText) {
          continue outer;
        }
        if (isSelfClosingTag(top!)) {
          continue inner;
        }
        return undefined;
      }

      parentTagName = tokenText;
      if (parentTagName !== undefined) {
        break;
      }
    } while (true);

    const indent = this.getIndent(scanner.stream.getSource(), offset - 2);
    return {
      tagName: parentTagName,
      offset,
      seenRightAngleBracket,
      indent
    };
  };

  // getPreviousOpeningTagName(
  //   createScannerFast({
  //     input: `if $variable < 0 {

  // }
  // $table .= '</>';`,
  //     initialOffset: 35,
  //     initialState: ScannerStateFast.WithinContent,
  //     matchingTagPairs: getMatchingTagPairs('javascriptreact')
  //   }),
  //   35,
  //   () => false,
  //   true
  // ); //?
}
