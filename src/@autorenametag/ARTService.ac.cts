import { ARTHTMLScannerService } from "./ARTHTMLScannerService.ac.cjs";
import { EARTSScannerStateFast } from "./EARTSScannerStateFast.cjs";

export class ARTService {
  public doAutoRenameTag: (
    text: string,
    offset: number,
    newWord: string,
    oldWord: string,
    languageId: string
  ) =>
    | {
        startOffset: number;
        endOffset: number;
        tagName: string;
      }
    | undefined = (text, offset, newWord, oldWord, languageId) => {
    const matchingTagPairs = this.getMatchingTagPairs(languageId);
    const isSelfClosingTag = this.isSelfClosingTagInLanguage(languageId);
    const isReact =
      languageId === 'javascript' ||
      languageId === 'typescript' ||
      languageId === 'javascriptreact' ||
      languageId === 'typescriptreact';
    const scanner = ARTHTMLScannerService.call.prototype.createScannerFast({
      input: text,
      initialOffset: 0,
      initialState: EARTSScannerStateFast.WithinContent,
      matchingTagPairs
    });
    if (newWord.startsWith('</')) {
      scanner.stream.goTo(offset);
      const tagName = newWord.slice(2);
      const oldTagName = oldWord.slice(2);
      if (oldTagName.startsWith('script') || oldTagName.startsWith('style')) {
        const tag = `<${oldTagName}`;
        let i = scanner.stream.position;
        let found = false;
        while (i--) {
          if (text.slice(i).startsWith(tag)) {
            found = true;
            break;
          }
        }
        if (!found) {
          return undefined;
        }
        return {
          startOffset: i + 1,
          endOffset: i + 1 + oldTagName.length,
          tagName
        };
      }
      const parent =
        ARTHTMLScannerService.call.prototype.getPreviousOpeningTagName(
          scanner,
          scanner.stream.position,
          isSelfClosingTag,
          isReact
        );
      if (!parent) {
        return undefined;
      }
      if (parent.tagName === tagName) {
        return undefined;
      }
      if (parent.tagName !== oldTagName) {
        return undefined;
      }
      if (!parent.seenRightAngleBracket) {
        return undefined;
      }
      const startOffset = parent.offset;
      const endOffset = parent.offset + parent.tagName.length;
      return {
        startOffset,
        endOffset,
        tagName
      };
    } else {
      scanner.stream.goTo(offset + 1);
      const tagName = newWord.slice(1);
      const oldTagName = oldWord.slice(1);
      if (oldTagName.startsWith('script') || oldTagName.startsWith('style')) {
        const hasAdvanced = scanner.stream.advanceUntilEitherChar(
          ['>'],
          true,
          isReact
        );
        if (!hasAdvanced) {
          return undefined;
        }
        const match = text
          .slice(scanner.stream.position)
          .match(new RegExp(`</${oldTagName}`));
        if (!match) {
          return undefined;
        }
        const index = match.index as number;
        return {
          startOffset: scanner.stream.position + index + 2,
          endOffset: scanner.stream.position + index + 2 + oldTagName.length,
          tagName
        };
      }
      const hasAdvanced = scanner.stream.advanceUntilEitherChar(
        ['<', '>'],
        true,
        isReact
      );
      // if start tag is not closed, return undefined
      if (scanner.stream.peekRight(0) === '<') {
        return undefined;
      }
      if (!hasAdvanced) {
        return undefined;
      }
      if (scanner.stream.peekLeft(1) === '/') {
        return undefined;
      }
      const possibleEndOfStartTag = scanner.stream.position;
      // check if we might be at an end tag
      while (scanner.stream.peekLeft(1).match(/[a-zA-Z\-\:]/)) {
        scanner.stream.goBack(1);
        if (scanner.stream.peekLeft(1) === '/') {
          return undefined;
        }
      }
      scanner.stream.goTo(possibleEndOfStartTag);
      scanner.stream.advance(1);
      const nextClosingTag =
        ARTHTMLScannerService.call.prototype.getNextClosingTagName(
          scanner,
          scanner.stream.position,
          isSelfClosingTag,
          isReact
        );
      if (!nextClosingTag) {
        return undefined;
      }
      if (nextClosingTag.tagName === tagName) {
        return undefined;
      }
      if (nextClosingTag.tagName !== oldTagName) {
        return undefined;
      }
      const previousOpenTag =
        ARTHTMLScannerService.call.prototype.getPreviousOpeningTagName(
          scanner,
          offset,
          isSelfClosingTag,
          isReact
        );

      if (
        previousOpenTag &&
        previousOpenTag.tagName === oldTagName &&
        previousOpenTag.indent === nextClosingTag.indent
      ) {
        return undefined;
      }

      const startOffset = nextClosingTag.offset;
      const endOffset = nextClosingTag.offset + nextClosingTag.tagName.length;

      return {
        startOffset,
        endOffset,
        tagName
      };
    }
  };

  // const testCase = {
  //   text: '<div>\n  <di>\n  <div></div>\n</div>',
  //   offset: 8,
  //   newWord: '<di',
  //   oldWord: '<div'
  // };
  // doAutoRenameTag(
  //   testCase.text,
  //   testCase.offset,
  //   testCase.newWord,
  //   testCase.oldWord,
  //   'html'
  // ); //?

  // doAutoRenameTag(
  //   `<div>
  //   <div>
  //   <div></div>
  // </div>`,
  //   9,
  //   '<span',
  //   '<div',
  //   'html'
  // ); //?

  public matchingTagPairs: { [languageId: string]: [string, string][] } = {
    css: [
      ['/*', '*/'],
      ['"', '"'],
      ["'", "'"]
    ],
    ejs: [['<%', '%>']],
    ruby: [
      ['<%=', '%>'],
      ['"', '"'],
      ["'", "'"]
    ],
    html: [
      ['<!--', '-->'],
      ['"', '"'],
      ["'", "'"],
      ['<style', '</style>'],
      ['<script', '</script'],
      ['<%=', '%>'] // support for html-webpack-plugin
    ],
    markdown: [
      ['<!--', '-->'],
      ['"', '"'],
      ["'", "'"],
      ['```', '```'],
      ['<?', '?>']
    ],
    marko: [
      ['<!--', '-->'],
      ['${', '}'],
      ['<html-comment>', '</html-comment>']
    ],
    nunjucks: [
      ['{%', '%}'],
      ['{{', '}}'],
      ['{#', '#}']
    ],
    plaintext: [
      ['<!--', '-->'],
      ['"', '"'],
      ["'", "'"]
    ],
    php: [
      ['<!--', '-->'],
      ['<?', '?>'],
      ['"', '"'],
      ["'", "'"]
    ],
    javascript: [
      ['<!--', '-->'],
      ['{/*', '*/}'],
      ["'", "'"],
      ['"', '"'],
      ['`', '`']
    ],
    javascriptreact: [
      ['{/*', '*/}'],
      ["'", "'"],
      ['"', '"'],
      ['`', '`']
    ],
    mustache: [['{{', '}}']],
    razor: [
      ['<!--', '-->'],
      ['@{', '}'],
      ['"', '"'],
      ["'", "'"]
    ],
    svelte: [
      ['<!--', '-->'],
      ['"', '"'],
      ["'", "'"]
    ],
    svg: [
      ['<!--', '-->'],
      ['"', '"'],
      ["'", "'"]
    ],
    typescript: [
      ['<!--', '-->'],
      ['{/*', '*/}'],
      ["'", "'"],
      ['"', '"'],
      ['`', '`']
    ],
    typescriptreact: [
      ['{/*', '*/}'],
      ["'", "'"],
      ['"', '"'],
      ['`', '`']
    ],
    twig: [
      ['<!--', '-->'],
      ['"', '"'],
      ["'", "'"],
      ['{{', '}}'],
      ['{%', '%}']
    ],
    volt: [
      ['{#', '#}'],
      ['{%', '%}'],
      ['{{', '}}']
    ],
    vue: [
      ['<!--', '-->'],
      ['"', '"'],
      ["'", "'"],
      ['{{', '}}']
    ],
    xml: [
      ['<!--', '-->'],
      ['"', '"'],
      ["'", "'"],
      ['<?', '?>']
    ]
  };

  public getMatchingTagPairs: (languageId: string) => [string, string][] =
    languageId =>
      this.matchingTagPairs[languageId] || this.matchingTagPairs['html'];

  public tagsThatAreSelfClosingInHtml: Set<string> = new Set([
    'area',
    'base',
    'br',
    'col',
    'command',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'menuitem',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
  ]);

  public EMPTY_SET: Set<string> = new Set();

  public tagsThatAreSelfClosing: { [languageId: string]: Set<string> } = {
    css: this.tagsThatAreSelfClosingInHtml,
    ejs: this.tagsThatAreSelfClosingInHtml,
    ruby: this.tagsThatAreSelfClosingInHtml,
    html: this.tagsThatAreSelfClosingInHtml,
    markdown: this.tagsThatAreSelfClosingInHtml,
    marko: this.tagsThatAreSelfClosingInHtml,
    nunjucks: this.tagsThatAreSelfClosingInHtml,
    plaintext: this.tagsThatAreSelfClosingInHtml,
    php: this.tagsThatAreSelfClosingInHtml,
    javascript: this.tagsThatAreSelfClosingInHtml,
    javascriptreact: this.EMPTY_SET,
    mustache: this.tagsThatAreSelfClosingInHtml,
    razor: this.tagsThatAreSelfClosingInHtml,
    svelte: this.tagsThatAreSelfClosingInHtml,
    svg: this.EMPTY_SET,
    typescript: this.tagsThatAreSelfClosingInHtml,
    typescriptreact: this.EMPTY_SET,
    twig: this.tagsThatAreSelfClosingInHtml,
    volt: this.tagsThatAreSelfClosingInHtml,
    vue: this.EMPTY_SET,
    xml: this.EMPTY_SET
  };

  public isSelfClosingTagInLanguage: (
    languageId: string
  ) => (tagName: string) => boolean = languageId => tagName =>
    (
      this.tagsThatAreSelfClosing[languageId] ||
      this.tagsThatAreSelfClosing['html']
    ).has(tagName);
}
