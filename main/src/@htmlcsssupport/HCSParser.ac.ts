// parser.ts
import lineColumn from "line-column";
import { HCSPsrStyle } from "./declares";
import { HCSPsrStyleType } from "./enums";

export class HCSParser {
  parse(text: string) {
    const selector =
      /([.#])(-?[_a-zA-Z\]+[\\!+_a-zA-Z0-9-]*)(?=[#.,()\s\[\]\^:*"'>=_a-zA-Z0-9-]*{[^}]*})/g;
    const styles: HCSPsrStyle[] = [];
    const lc = lineColumn(text, { origin: 0 });
    let match: any,
      lci: any,
      index: any,
      line = 0,
      col = 0;
    while ((match = selector.exec(text))) {
      index = match.index;
      lci = lc.fromIndex(index);
      if (lci) {
        line = lci.line;
        col = lci.col + 1;
      }
      styles.push({
        index,
        line,
        col,
        type: match[1] as HCSPsrStyleType,
        selector: match[2].replaceAll("\\", ""),
      });
    }
    return styles;
  }
}