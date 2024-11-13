"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlawuldragonTreeView = exports.FlawuldragonTreeItem = void 0;
const vscode = require("vscode");
class FlawuldragonTreeItem extends vscode.TreeItem {
    label;
    collapsibleState;
    command;
    constructor(label, collapsibleState, command) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.tooltip = `${this.label}`;
    }
    iconPath = {
        light: "",
        dark: ""
    };
    contextValue = "flawuldragon";
}
exports.FlawuldragonTreeItem = FlawuldragonTreeItem;
class FlawuldragonTreeView {
    context;
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    constructor(context) {
        this.context = context;
    }
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        return Promise.resolve([
            new FlawuldragonTreeItem("Flawuldragon", vscode.TreeItemCollapsibleState.None, {
                command: "flawuldragon.extension.infos",
                title: "Flawuldragon"
            })
        ]);
    }
}
exports.FlawuldragonTreeView = FlawuldragonTreeView;
