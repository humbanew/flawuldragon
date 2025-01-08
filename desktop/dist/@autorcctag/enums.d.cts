export declare const enum EARCCTSvcHSTokenTypeFast {
    StartCommentTag = 0,// "<--" part of "<!-- this is a comment -->"
    Comment = 1,// " this is a comment " part of "<!-- this is a comment -->"
    EndCommentTag = 2,// "-->" part of "<!-- this is a comment -->"
    StartTagOpen = 3,// "<" part of "<html>"
    StartTagClose = 4,// ">" part of "<html>"
    StartTagSelfClose = 5,// "/>" part of "<input />"
    StartTag = 6,// "input" part of "<input>"
    EndTagOpen = 7,// "<" part of "</html>"
    EndTagClose = 8,// ">" part of "</html>"
    EndTag = 9,// "html" part of </html>
    AttributeName = 10,// "class" part of "<div class="center">"
    AttributeValue = 11,// "center" part of "<div class="center">"
    Content = 12,// "this is text" part of "<p>this is text</p>"
    EOS = 13,// end of stream
    DelimiterAssign = 14,// "=" part of "<div class="center">
    Unknown = 15,// anything that doesn't make sense, e.g. ";" in "i <length;"
    WhiteSpace = 16
}
export declare const enum EARCCTSvcHSScannerStateFast {
    WithinContent = 0,
    AfterOpeningStartTag = 1,
    AfterOpeningEndTag = 2,
    WithinStartTag = 3,
    WithinEndTag = 4,
    WithinComment = 5,
    AfterAttributeName = 6,
    BeforeAttributeValue = 7
}
//# sourceMappingURL=enums.d.cts.map