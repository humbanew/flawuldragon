/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

export const enum EARCCTSvcHSTokenTypeFast {
  StartCommentTag, // "<--" part of "<!-- this is a comment -->"
  Comment, // " this is a comment " part of "<!-- this is a comment -->"
  EndCommentTag, // "-->" part of "<!-- this is a comment -->"
  StartTagOpen, // "<" part of "<html>"
  StartTagClose, // ">" part of "<html>"
  StartTagSelfClose, // "/>" part of "<input />"
  StartTag, // "input" part of "<input>"
  EndTagOpen, // "<" part of "</html>"
  EndTagClose, // ">" part of "</html>"
  EndTag, // "html" part of </html>
  AttributeName, // "class" part of "<div class="center">"
  AttributeValue, // "center" part of "<div class="center">"
  Content, // "this is text" part of "<p>this is text</p>"
  EOS, // end of stream
  DelimiterAssign, // "=" part of "<div class="center">
  Unknown, // anything that doesn't make sense, e.g. ";" in "i <length;"
  WhiteSpace
}

export const enum EARCCTSvcHSScannerStateFast {
  WithinContent,
  AfterOpeningStartTag,
  AfterOpeningEndTag,
  WithinStartTag,
  WithinEndTag,
  WithinComment,
  AfterAttributeName,
  BeforeAttributeValue
}
