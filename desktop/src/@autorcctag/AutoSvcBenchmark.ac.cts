import * as fs from 'node:fs';
import * as path from 'node:path';
import { AutoRenameTagService } from "./AutoRenameTagService.ac.cjs";

export class ARTSvcBenchmark {
  public file = fs
    .readFileSync(path.join(__dirname, '../../src/benchmark/file.txt'))
    .toString();

  public measure: any = (name: string, fn: any, runs: number) => {
    const NS_PER_MS = 1e6;
    const NS_PER_SEC = 1e9;
    const start = process.hrtime();
    for (let i = 0; i < runs; i++) {
      fn();
    }
    console.log(runs + ' runs');
    const elapsedTime = process.hrtime(start);
    const elapsedTimeMs =
      (elapsedTime[0] * NS_PER_SEC + elapsedTime[1]) / NS_PER_MS / runs;
    console.log(name + ' took ' + elapsedTimeMs + 'ms');
  };

  public exec() {
    this.measure(
      'rename',
      () => {
        AutoRenameTagService.prototype.doAutoRenameTag(
          this.file,
          0,
          '<htmll',
          '<html',
          'html'
        );
      },
      10
    ); //?

    this.measure(
      'nothing',
      () => {
        const whitespaceSet = new Set([' ', '\n', '\t', '\r', '\f']);
        let whitespaceCount = 0;
        for (let i = 0; i < this.file.length; i++) {
          const j = this.file[i];
          if (whitespaceSet.has(j)) {
            whitespaceCount++;
          }
        }
      },
      10
    ); //?
  }
}
