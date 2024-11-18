"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoHighlight = void 0;
const vscode = require("vscode");
const os = require("os");
class TodoHighlight {
    window = vscode.window;
    defaultIcon = "$(checklist)";
    zapIcon = "$(zap)";
    defaultMsg = "0";
    static todoStatusBarItem;
    DEFAULT_KEYWORDS = {
        "TODO:": {
            text: "TODO:",
            color: "#fff",
            backgroundColor: "#ffbd2a",
            overviewRulerColor: "rgba(255,189,42,0.8)",
        },
        "FIXME:": {
            text: "FIXME:",
            color: "#fff",
            backgroundColor: "#f06292",
            overviewRulerColor: "rgba(240,98,146,0.8)",
        },
        "NOTE:": {
            text: "NOTE:",
            color: "#fff",
            backgroundColor: "#4caf50",
            overviewRulerColor: "rgba(76,175,80,0.8)",
        },
        "HACK:": {
            text: "HACK:",
            color: "#fff",
            backgroundColor: "#ff5722",
            overviewRulerColor: "rgba(255,87,34,0.8)",
        },
        "BUG:": {
            text: "BUG:",
            color: "#fff",
            backgroundColor: "#f44336",
            overviewRulerColor: "rgba(244,67,54,0.8)",
        },
        "IDEA:": {
            text: "IDEA:",
            color: "#fff",
            backgroundColor: "#2196f3",
            overviewRulerColor: "rgba(33,150,243,0.8)",
        },
        "REVIEW:": {
            text: "REVIEW:",
            color: "#fff",
            backgroundColor: "#673ab7",
            overviewRulerColor: "rgba(103,58,183,0.8)",
        },
        "QUESTION:": {
            text: "QUESTION:",
            color: "#fff",
            backgroundColor: "#9c27b0",
            overviewRulerColor: "rgba(156,39,176,0.8)",
        },
        "EXAMPLE:": {
            text: "EXAMPLE:",
            color: "#fff",
            backgroundColor: "#00bcd4",
            overviewRulerColor: "rgba(0,188,212,0.8)",
        },
        "TEST:": {
            text: "TEST:",
            color: "#fff",
            backgroundColor: "#009688",
            overviewRulerColor: "rgba(0,150,136,0.8)",
        },
    };
    DEFAULT_STYLE = {
        color: "#2196f3",
        backgroundColor: "#ffeb3b",
    };
    todoHighlight_getAssembledData(keywords, customDefaultStyle, isCaseSensitive) {
        var result = {};
        keywords.forEach((v) => {
            v = typeof v == "string" ? { text: v } : v;
            var text = v.text;
            v = Object.assign({}, this.DEFAULT_KEYWORDS[text], v);
            if (!isCaseSensitive) {
                text = text.toUpperCase();
            }
            if (text == "TODO:" ||
                text == "FIXME:" ||
                text == "NOTE:" ||
                text == "HACK:" ||
                text == "BUG:" ||
                text == "IDEA:" ||
                text == "REVIEW:" ||
                text == "QUESTION:" ||
                text == "EXAMPLE:" ||
                text == "TEST:") {
                v = Object.assign({}, this.DEFAULT_KEYWORDS[text], v);
            }
            result[text] = Object.assign({}, this.DEFAULT_STYLE, customDefaultStyle, v);
        });
        Object.keys(this.DEFAULT_KEYWORDS).forEach((v) => {
            if (!result[v]) {
                result[v] = Object.assign({}, this.DEFAULT_STYLE, customDefaultStyle, this.DEFAULT_KEYWORDS[v]);
            }
        });
        return result;
    }
    todoHighlight_chooseAnnotationType(availableAnnotationTypes) {
        return this.window.showQuickPick(availableAnnotationTypes, {});
    }
    // get the include/exclude config
    todoHighlight_getPathes(config) {
        return Array.isArray(config)
            ? "{" + config.join(",") + "}"
            : typeof config === "string"
                ? config
                : "";
    }
    todoHighlight_searchAnnotations(workspaceState, pattern, callback) {
        var settings = vscode.workspace.getConfiguration("todohighlight");
        var includePattern = this.todoHighlight_getPathes(settings.get("include") || "{**/*}");
        var excludePattern = this.todoHighlight_getPathes(settings.get("exclude") || "{**/*}");
        var limitationForSearch = settings.get("maxFilesForSearch", 5120);
        var statusMsg = ` Searching...`;
        this.window.processing = true;
        this.todoHighlight_setStatusMsg(this.zapIcon, statusMsg, "Status message");
        vscode.workspace
            .findFiles(includePattern, excludePattern, limitationForSearch)
            .then(function (files) {
            if (!files || files.length === 0) {
                callback({ message: "No files found" }, "", "");
                return;
            }
            var totalFiles = files.length, progress = 0, times = 0, annotations = {}, annotationList = [];
            function file_iterated() {
                times++;
                progress = Math.floor((times / totalFiles) * 100);
                TodoHighlight.prototype.todoHighlight_setStatusMsg(TodoHighlight.prototype.zapIcon, progress + "% " + statusMsg, "Status message");
                if (times === totalFiles ||
                    TodoHighlight.prototype.window.manuallyCancel) {
                    TodoHighlight.prototype.window.processing = true;
                    workspaceState.update("annotationList", annotationList);
                    callback("", annotations, annotationList);
                }
            }
            for (var i = 0; i < totalFiles; i++) {
                vscode.workspace.openTextDocument(files[i]).then(function (file) {
                    TodoHighlight.prototype.todoHighlight_searchAnnotationInFile(file, annotations, annotationList, pattern);
                    file_iterated();
                }, function (err) {
                    TodoHighlight.prototype.todoHighlight_errorHandler(err);
                    file_iterated();
                });
            }
        }, function (err) {
            TodoHighlight.prototype.todoHighlight_errorHandler(err);
        });
    }
    todoHighlight_searchAnnotationInFile(file, annotations, annotationList, regexp) {
        const fileInUri = file.uri.toString();
        const pathWithoutFile = fileInUri.substring(7, fileInUri.length);
        for (let line = 0; line < file.lineCount; line++) {
            const lineText = file.lineAt(line).text;
            const match = lineText.match(regexp);
            if (match !== null) {
                if (!annotations.hasOwnProperty(pathWithoutFile)) {
                    annotations[pathWithoutFile] = [];
                }
                let content = this.todoHighlight_getContent(lineText, match);
                if (content.length > 500) {
                    content = content.substring(0, 500).trim() + "...";
                }
                const locationInfo = this.todoHighlight_getLocationInfo(fileInUri, pathWithoutFile, lineText, line, match);
                const annotation = {
                    uri: locationInfo.uri,
                    label: content,
                    detail: locationInfo.relativePath,
                    lineNum: line,
                    fileName: locationInfo.absPath,
                    startCol: locationInfo.startCol,
                    endCol: locationInfo.endCol,
                };
                annotationList.push(annotation);
                annotations[pathWithoutFile].push(annotation);
            }
        }
    }
    todoHighlight_annotationsFound(err, annotations, annotationList) {
        if (err) {
            console.log("todohighlight err:", err);
            this.todoHighlight_setStatusMsg(this.defaultIcon, this.defaultMsg, "Status message");
            return;
        }
        const resultNum = annotationList.length;
        const tooltip = resultNum + " result(s) found";
        this.todoHighlight_setStatusMsg(this.defaultIcon, resultNum.toString(), tooltip);
        this.todoHighlight_showOutputChannel(annotationList);
    }
    todoHighlight_showOutputChannel(data) {
        if (!this.window.outputChannel)
            return;
        this.window.outputChannel.clear();
        if (data.length === 0) {
            this.window.showInformationMessage("No results");
            return;
        }
        var settings = vscode.workspace.getConfiguration("todohighlight");
        var toggleURI = settings.get("toggleURI", false);
        data.forEach(function (v, i, a) {
            // due to an issue of vscode(https://github.com/Microsoft/vscode/issues/586), in order to make file path clickable within the output channel,the file path differs from platform
            const patternA = "#" + (i + 1) + "\t" + v.uri + "#" + (v.lineNum + 1);
            const patternB = "#" +
                (i + 1) +
                "\t" +
                v.uri +
                ":" +
                (v.lineNum + 1) +
                ":" +
                (v.startCol + 1);
            const patterns = [patternA, patternB];
            //for windows and mac
            let patternType = 0;
            if (os.platform && os.platform() === "linux") {
                // for linux
                patternType = 1;
            }
            if (toggleURI) {
                //toggle the pattern
                patternType = +!patternType;
            }
            if (TodoHighlight.prototype.window.outputChannel) {
                TodoHighlight.prototype.window.outputChannel.appendLine(patterns[patternType]);
                TodoHighlight.prototype.window.outputChannel.appendLine("\t" + v.label + "\n");
            }
        });
        this.window.outputChannel.show();
    }
    todoHighlight_getContent(lineText, match) {
        return lineText.substring(lineText.indexOf(match[0]), lineText.length);
    }
    todoHighlight_getLocationInfo(fileInUri, pathWithoutFile, lineText, line, match) {
        var rootPath = (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri.fsPath) + "/";
        var outputFile = pathWithoutFile.replace(rootPath, "");
        var startCol = lineText.indexOf(match[0]);
        var endCol = lineText.length;
        var location = outputFile + " " + (line + 1) + ":" + (startCol + 1);
        return {
            uri: fileInUri,
            absPath: pathWithoutFile,
            relativePath: location,
            startCol: startCol,
            endCol: endCol,
        };
    }
    todoHighlight_createStatusBarItem() {
        let todoHighlightStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98);
        todoHighlightStatusBarItem.text = this.defaultIcon + this.defaultMsg;
        todoHighlightStatusBarItem.tooltip = "List annotations";
        todoHighlightStatusBarItem.command = "fd_todohighlight.showOutputChannel";
        todoHighlightStatusBarItem.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
        todoHighlightStatusBarItem.show();
        TodoHighlight.todoStatusBarItem = todoHighlightStatusBarItem;
        return todoHighlightStatusBarItem;
    }
    todoHighlight_errorHandler(err) {
        this.window.processing = true;
        this.todoHighlight_setStatusMsg(this.defaultIcon, this.defaultMsg, "Status message");
        console.log("todohighlight err:", err);
    }
    todoHighlight_setStatusMsg(icon, msg, tooltip) {
        if (TodoHighlight.todoStatusBarItem) {
            TodoHighlight.todoStatusBarItem.text = `${icon} ${msg}` || "";
            if (tooltip) {
                TodoHighlight.todoStatusBarItem.tooltip = tooltip || "";
            }
            TodoHighlight.todoStatusBarItem.show();
        }
    }
    todoHighlight_escapeRegExp(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    todoHighlight_activate(context) {
        var timeout = null;
        var activeEditor = this.window.activeTextEditor;
        let isCaseSensitive, assembledData, decorationTypes, pattern, styleForRegExp, keywordsPattern;
        var workspaceState = context.workspaceState;
        var settings = vscode.workspace.getConfiguration("todohighlight");
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
                TodoHighlight.prototype.todoHighlight_searchAnnotations(workspaceState, pattern, (err, annotations, annotationList = []) => TodoHighlight.prototype.todoHighlight_annotationsFound(err, annotations, annotationList));
            }
            else {
                if (!assembledData)
                    return;
                var availableAnnotationTypes = Object.keys(assembledData);
                availableAnnotationTypes.unshift("ALL");
                TodoHighlight.prototype.todoHighlight_chooseAnnotationType(availableAnnotationTypes.map(type => ({ label: type, annotationType: type })))
                    .then(function (annotationType) {
                    if (!annotationType)
                        return;
                    if (!annotationType)
                        return;
                    var searchPattern = pattern;
                    if (annotationType.annotationType != "ALL") {
                        annotationType.annotationType = TodoHighlight.prototype.todoHighlight_escapeRegExp(annotationType.annotationType);
                        searchPattern = new RegExp(annotationType.annotationType, isCaseSensitive ? "g" : "gi");
                    }
                    TodoHighlight.prototype.todoHighlight_searchAnnotations(workspaceState, searchPattern, (err, annotations, annotationList = []) => TodoHighlight.prototype.todoHighlight_annotationsFound(err, annotations, annotationList));
                });
            }
        }));
        context.subscriptions.push(vscode.commands.registerCommand("fd_todohighlight.showOutputChannel", function () {
            var annotationList = workspaceState.get("annotationList", []);
            TodoHighlight.prototype.todoHighlight_showOutputChannel(annotationList);
        }));
        if (activeEditor) {
            triggerUpdateDecorations();
        }
        vscode.window.onDidChangeActiveTextEditor(function (editor) {
            activeEditor = editor;
            if (editor) {
                triggerUpdateDecorations();
            }
        }, "", context.subscriptions);
        vscode.workspace.onDidChangeTextDocument(function (event) {
            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations();
            }
        }, "", context.subscriptions);
        vscode.workspace.onDidChangeConfiguration(function () {
            settings = vscode.workspace.getConfiguration("todohighlight");
            //NOTE: if disabled, do not re-initialize the data or we will not be able to clear the style immediatly via 'toggle highlight' command
            if (!settings.get("isEnable"))
                return;
            init(settings);
            triggerUpdateDecorations();
        }, "", context.subscriptions);
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
                        vscode.window.createTextEditorDecorationType(styleForRegExp);
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
            var customDefaultStyle = settings.get("defaultStyle") || {};
            keywordsPattern = settings.get("keywordsPattern") || "";
            isCaseSensitive = settings.get("isCaseSensitive", true);
            if (!TodoHighlight.todoStatusBarItem) {
                TodoHighlight.todoStatusBarItem = TodoHighlight.prototype.todoHighlight_createStatusBarItem();
            }
            const outputChannel = vscode.window.createOutputChannel("Flawuldragon TodoHighlight");
            decorationTypes = {};
            if (keywordsPattern.trim()) {
                styleForRegExp = Object.assign({}, TodoHighlight.prototype.DEFAULT_STYLE, customDefaultStyle, {
                    overviewRulerLane: vscode.OverviewRulerLane.Right
                });
                pattern = new RegExp(keywordsPattern, isCaseSensitive ? "g" : "gi");
            }
            else {
                const keywords = settings.get("keywords");
                assembledData = TodoHighlight.prototype.todoHighlight_getAssembledData(Array.isArray(keywords) ? keywords : [], customDefaultStyle, isCaseSensitive);
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
                            TodoHighlight.prototype.window.createTextEditorDecorationType(mergedStyle);
                    });
                    const patternString = Object.keys(assembledData)
                        .map((v) => {
                        return TodoHighlight.prototype.todoHighlight_escapeRegExp(v);
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
    }
    todoHighlight_desactivate() {
        if (TodoHighlight.todoStatusBarItem) {
            TodoHighlight.todoStatusBarItem.dispose();
        }
        if (this.window.outputChannel) {
            this.window.outputChannel.dispose();
        }
    }
}
exports.TodoHighlight = TodoHighlight;
