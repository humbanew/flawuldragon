"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
var path = require("path");
var mocha_1 = require("mocha");
var glob_1 = require("glob");
function run() {
    // Create the mocha test
    var mocha = new mocha_1.default({
        ui: 'tdd',
        color: true
    });
    var testsRoot = path.resolve(__dirname, '..');
    return new Promise(function (c, e) {
        (0, glob_1.default)('**/**.test.js', { cwd: testsRoot }, function (err, files) {
            if (err) {
                return e(err);
            }
            // Add files to the test suite
            files.forEach(function (f) { return mocha.addFile(path.resolve(testsRoot, f)); });
            try {
                // Run the mocha test
                mocha.run(function (failures) {
                    if (failures > 0) {
                        e(new Error("".concat(failures, " tests failed.")));
                    }
                    else {
                        c();
                    }
                });
            }
            catch (err) {
                console.error(err);
                e(err);
            }
        });
    });
}
