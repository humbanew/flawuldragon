"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARTBenchmarkService = void 0;
const path = require("path");
const fs = require("fs");
class ARTBenchmarkService {
    file = fs
        .readFileSync(path.join(__dirname, './i_art/file.txt'))
        .toString();
    measure = (name, fn, runs) => {
        const NS_PER_MS = 1e6;
        const NS_PER_SEC = 1e9;
        const start = process.hrtime();
        for (let i = 0; i < runs; i++) {
            fn();
        }
        console.log(runs + ' runs');
        const elapsedTime = process.hrtime(start);
        const elapsedTimeMs = (elapsedTime[0] * NS_PER_SEC + elapsedTime[1]) / NS_PER_MS / runs;
        console.log(name + ' took ' + elapsedTimeMs + 'ms');
    };
    activateMeasure() {
        this.measure('rename', () => {
            // arrumar aqui (propriedade da classe principal service)
            // this.doAutoRenameTag(file, 0, '<htmll', '<html', 'html');
        }, 10); //?
        this.measure('nothing', () => {
            const whitespaceSet = new Set([' ', '\n', '\t', '\r', '\f']);
            let whitespaceCount = 0;
            for (let i = 0; i < this.file.length; i++) {
                const j = this.file[i];
                if (whitespaceSet.has(j)) {
                    whitespaceCount++;
                }
            }
        }, 10); //?
    }
}
exports.ARTBenchmarkService = ARTBenchmarkService;
