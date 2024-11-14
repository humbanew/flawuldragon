"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const util_cjs_1 = require("./util.cjs");
let statusBar;
let window = vscode.window;
let statusBarItem;
let workspace = vscode.workspace;
function activate(context) {
    // Jetbrains Mono Font Extension Configs
    console.log(`Congratulations, your extension "${context.extension.packageJSON.displayName} - Jetbrains Mono Font installed!"`);
    (0, util_cjs_1.firstTimeActivation)(context);
    let activateCommand = vscode.commands.registerCommand("flawuldragon_jetbrainsmonofont.activate", () => (0, util_cjs_1.JBMActivation)(context));
    let deactivateCommand = vscode.commands.registerCommand("flawuldragon_jetbrainsmonofont.deactivate", () => (0, util_cjs_1.deactivateJBM)(context));
    context.subscriptions.push(activateCommand, deactivateCommand);
    // Todo Highlight Configs
    var timeout = null;
    var activeEditor = window.activeTextEditor;
    let isCaseSensitive, assembledData, decorationTypes, pattern, styleForRegExp, keywordsPattern;
    var workspaceState = context.workspaceState;
    var settings = workspace.getConfiguration("todohighlight");
    init(settings);
    context.subscriptions.push(vscode.commands.registerCommand("fd_todohighlight.toggleHighlight", function () {
        settings
            .update("isEnable", !settings.get("isEnable"), true)
            .then(function () {
            triggerUpdateDecorations();
        });
    }));
    context.subscriptions.push(vscode.commands.registerCommand("fd_todohighlight.listAnnotations", function () {
        if (keywordsPattern.trim()) {
            (0, util_cjs_1.searchAnnotations)(workspaceState, pattern, (err, annotations, annotationList = []) => (0, util_cjs_1.annotationsFound)(err, annotations, annotationList));
        }
        else {
            if (!assembledData)
                return;
            var availableAnnotationTypes = Object.keys(assembledData);
            availableAnnotationTypes.unshift("ALL");
            (0, util_cjs_1.chooseAnnotationType)(availableAnnotationTypes.map(type => ({ label: type, annotationType: type })))
                .then(function (annotationType) {
                if (!annotationType)
                    return;
                if (!annotationType)
                    return;
                var searchPattern = pattern;
                if (annotationType.annotationType != "ALL") {
                    annotationType.annotationType = (0, util_cjs_1.escapeRegExp)(annotationType.annotationType);
                    searchPattern = new RegExp(annotationType.annotationType, isCaseSensitive ? "g" : "gi");
                }
                (0, util_cjs_1.searchAnnotations)(workspaceState, searchPattern, (err, annotations, annotationList = []) => (0, util_cjs_1.annotationsFound)(err, annotations, annotationList));
            });
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("fd_todohighlight.showOutputChannel", function () {
        var annotationList = workspaceState.get("annotationList", []);
        (0, util_cjs_1.showOutputChannel)(annotationList);
    }));
    if (activeEditor) {
        triggerUpdateDecorations();
    }
    window.onDidChangeActiveTextEditor(function (editor) {
        activeEditor = editor;
        if (editor) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
    workspace.onDidChangeTextDocument(function (event) {
        if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
    workspace.onDidChangeConfiguration(function () {
        settings = workspace.getConfiguration("todohighlight");
        //NOTE: if disabled, do not re-initialize the data or we will not be able to clear the style immediatly via 'toggle highlight' command
        if (!settings.get("isEnable"))
            return;
        init(settings);
        triggerUpdateDecorations();
    }, null, context.subscriptions);
    function updateDecorations() {
        if (!activeEditor || !activeEditor.document) {
            return;
        }
        var text = activeEditor.document.getText();
        var mathes = {}, match;
        while ((match = pattern.exec(text))) {
            var startPos = activeEditor.document.positionAt(match.index);
            var endPos = activeEditor.document.positionAt(match.index + match[0].length);
            var decoration = {
                range: new vscode.Range(startPos, endPos)
            };
            var matchedValue = match[0];
            if (!isCaseSensitive) {
                matchedValue = matchedValue.toUpperCase();
            }
            if (mathes[matchedValue]) {
                mathes[matchedValue].push(decoration);
            }
            else {
                mathes[matchedValue] = [decoration];
            }
            if (keywordsPattern.trim() && !decorationTypes[matchedValue]) {
                decorationTypes[matchedValue] =
                    window.createTextEditorDecorationType(styleForRegExp);
            }
        }
        Object.keys(decorationTypes).forEach((v) => {
            if (!isCaseSensitive) {
                v = v.toUpperCase();
            }
            var rangeOption = settings.get("isEnable") && mathes[v] ? mathes[v] : [];
            var decorationType = decorationTypes[v];
            if (activeEditor) {
                activeEditor.setDecorations(decorationType, rangeOption);
            }
        });
    }
    function init(settings) {
        var customDefaultStyle = settings.get("defaultStyle");
        keywordsPattern = settings.get("keywordsPattern") || "";
        isCaseSensitive = settings.get("isCaseSensitive", true);
        if (!statusBarItem) {
            statusBarItem = (0, util_cjs_1.createStatusBarItem)();
            statusBarItem = (0, util_cjs_1.createStatusBarItem)();
        }
        const outputChannel = vscode.window.createOutputChannel("TodoHighlight");
        decorationTypes = {};
        if (keywordsPattern.trim()) {
            styleForRegExp = Object.assign({}, util_cjs_1.DEFAULT_STYLE, customDefaultStyle, {
                overviewRulerLane: vscode.OverviewRulerLane.Right
            });
            pattern = new RegExp(keywordsPattern, isCaseSensitive ? "g" : "gi");
        }
        else {
            assembledData = (0, util_cjs_1.getAssembledData)(settings.get("keywords") || [], customDefaultStyle, isCaseSensitive);
            if (assembledData != undefined) {
                Object.keys(assembledData).forEach((v) => {
                    if (!isCaseSensitive) {
                        v = v.toUpperCase();
                    }
                    var mergedStyle = Object.assign({}, {
                        overviewRulerLane: vscode.OverviewRulerLane.Right
                    }, assembledData ? assembledData[v] : {});
                    if (!mergedStyle.overviewRulerColor) {
                        // use backgroundColor as the default overviewRulerColor if not specified by the user setting
                        mergedStyle.overviewRulerColor = mergedStyle.backgroundColor;
                    }
                    decorationTypes[v] =
                        window.createTextEditorDecorationType(mergedStyle);
                });
                const patternString = Object.keys(assembledData)
                    .map((v) => {
                    return (0, util_cjs_1.escapeRegExp)(v);
                })
                    .join("|");
                pattern = new RegExp(patternString, "gi");
            }
        }
        pattern = new RegExp(pattern, "gi");
        if (isCaseSensitive) {
            pattern = new RegExp(pattern, "g");
        }
    }
    function triggerUpdateDecorations() {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(updateDecorations, 0);
    }
    // Flawuldragon Configs
    console.log("Flawuldragon is loaded!");
    const flawuldragonStatusbaritemId = "flawuldragon.extension.infos";
    context.subscriptions.push(vscode.commands.registerCommand(flawuldragonStatusbaritemId, () => {
        let viewPanel = vscode.window.createWebviewPanel("flawuldragon", "Flawuldragon Notes", vscode.ViewColumn.Two, {});
        viewPanel.title = "Flawuldragon Notes";
        viewPanel.iconPath = vscode.Uri.file(path.join(__dirname, "../", "assets", "icon.png"));
        viewPanel.webview.html = fs
            .readFileSync(path.join(__dirname, "../", "assets", "flawuldragon.html"))
            .toString();
        return 0;
    }));
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBar.text = `$(flawuldragon-on) FD`;
    statusBar.command = flawuldragonStatusbaritemId;
    statusBar.color = "darkblue";
    statusBar.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
    statusBar.tooltip = "Click to view Flawuldragon Notes";
    statusBar.show();
    context.subscriptions.push(statusBar);
    if (vscode.workspace.getConfiguration("flawuldragon").get("enable") === false) {
        console.warn("Flawuldragon is disabled. Enable it in your settings.");
        vscode.window.showWarningMessage("Flawuldragon is disabled. Enable it in your settings.");
        statusBar.text = `$(flawuldragon-off) The Flawuldragon`;
        statusBar.color = "darkred";
        statusBar.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
        return;
    }
}
function deactivate(context) {
    (0, util_cjs_1.deactivateJBM)(context);
}
