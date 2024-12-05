"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlawuldragonCommandsKeys = void 0;
const vscode = require("vscode");
const Vanilla_cjs_1 = require("./Vanilla.cjs");
class FlawuldragonCommandsKeys {
    vanillaSrcs = Vanilla_cjs_1.Vanilla.prototype.statusBars;
    vanillaCoreStatusBar(context) {
        // flawuldragon development notes status bar item
        if (this.vanillaSrcs.flawuldragonStatusBar) {
            this.vanillaSrcs.flawuldragonStatusBar.text = `$(flawuldragon-on) FD`;
            this.vanillaSrcs.flawuldragonStatusBar.command =
                this.vanillaSrcs.ids.flawuldragonStatusbaritemId;
            this.vanillaSrcs.flawuldragonStatusBar.color = "darkblue";
            this.vanillaSrcs.flawuldragonStatusBar.backgroundColor =
                new vscode.ThemeColor("statusBarItem.warningBackground");
            this.vanillaSrcs.flawuldragonStatusBar.tooltip =
                "Click to view Flawuldragon Notes";
            this.vanillaSrcs.flawuldragonStatusBar.show();
            context.subscriptions.push(this.vanillaSrcs.flawuldragonStatusBar);
        }
    }
    vanillaDateTimeStatusBar() { }
}
exports.FlawuldragonCommandsKeys = FlawuldragonCommandsKeys;
