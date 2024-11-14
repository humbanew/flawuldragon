"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_STYLE = exports.DEFAULT_KEYWORDS = exports.defaultMsg = exports.zapIcon = exports.defaultIcon = exports.workspace = exports.window = exports.os = exports.JBMActivationPrompt = void 0;
exports.dirOpen = dirOpen;
exports.JBMActivation = JBMActivation;
exports.firstTimeActivation = firstTimeActivation;
exports.deactivateJBM = deactivateJBM;
exports.getAssembledData = getAssembledData;
exports.chooseAnnotationType = chooseAnnotationType;
exports.getPathes = getPathes;
exports.searchAnnotations = searchAnnotations;
exports.searchAnnotationInFile = searchAnnotationInFile;
exports.annotationsFound = annotationsFound;
exports.showOutputChannel = showOutputChannel;
exports.getContent = getContent;
exports.getLocationInfo = getLocationInfo;
exports.createStatusBarItem = createStatusBarItem;
exports.errorHandler = errorHandler;
exports.setStatusMsg = setStatusMsg;
exports.escapeRegExp = escapeRegExp;
const vscode = require("vscode");
const path = require("path");
const defaultSettings_cjs_1 = require("./defaultSettings.cjs");
// Jetbrains Mono Font Extension Configs
const showDialog = vscode.window.showInformationMessage;
const JBMPath = (context) => path.resolve(context.extensionPath, "JetBrainsMono");
const updateUserSettings = (settings, remove = false) => Object.entries(settings).forEach(([key, value]) => vscode.workspace
    .getConfiguration()
    .update(key, remove ? undefined : value, vscode.ConfigurationTarget.Global));
function dirOpen(dirPath) {
    let command = "";
    switch (process.platform) {
        case "darwin":
            command = "open";
            break;
        case "win32":
            command = "explorer";
            break;
        default:
            command = "xdg-open";
            break;
    }
    return require("child_process").exec(`${command} ${dirPath}`);
}
function JBMActivation(context) {
    const JBMAddress = JBMPath(context);
    updateUserSettings(defaultSettings_cjs_1.defaultSettings);
    dirOpen(JBMAddress);
    showDialog(`${context.extension.packageJSON.displayName} - Jetbrains Mono Font is activated!`);
    showDialog(`Important Note - Don't forget to install fonts! Font Directory will open, once you have manually installed fonts, restart VSCODE - ${JBMAddress}`);
}
const JBMActivationPrompt = (context) => showDialog("Activate JetBrains Mono Font for Flawuldragon?", "Yes", "No").then((value) => value === "Yes"
    ? JBMActivation(context)
    : showDialog("You can activate JetBrains Mono later by running 'JetBrainsMono' or 'JBM' in command palette."));
exports.JBMActivationPrompt = JBMActivationPrompt;
function firstTimeActivation(context) {
    const version = context.extension.packageJSON.version ?? "1.0.0";
    const previousVersion = context.globalState.get(context.extension.id);
    if (previousVersion === version)
        return;
    JBMActivation(context);
    context.globalState.update(context.extension.id, version);
}
function deactivateJBM(context) {
    // context.globalState.update(context.extension.id, undefined);
    updateUserSettings(defaultSettings_cjs_1.defaultSettings, true);
    showDialog(`${context.extension.packageJSON.displayName} is deactivated!`);
}
// Todo Highlight Extension Configs
exports.os = require("os");
exports.window = vscode.window;
exports.workspace = vscode.workspace;
exports.defaultIcon = "$(checklist)";
exports.zapIcon = "$(zap)";
exports.defaultMsg = "0";
exports.DEFAULT_KEYWORDS = {
    "TODO:": {
        text: "TODO:",
        color: "#fff",
        backgroundColor: "#ffbd2a",
        overviewRulerColor: "rgba(255,189,42,0.8)"
    },
    "FIXME:": {
        text: "FIXME:",
        color: "#fff",
        backgroundColor: "#f06292",
        overviewRulerColor: "rgba(240,98,146,0.8)"
    }
};
exports.DEFAULT_STYLE = {
    color: "#2196f3",
    backgroundColor: "#ffeb3b"
};
function getAssembledData(keywords, customDefaultStyle, isCaseSensitive) {
    var result = {};
    keywords.forEach((v) => {
        v = typeof v == 'string' ? { text: v } : v;
        var text = v.text;
        v = Object.assign({}, exports.DEFAULT_KEYWORDS[text], v);
        if (!isCaseSensitive) {
            text = text.toUpperCase();
        }
        if (text == 'TODO:' || text == 'FIXME:') {
            v = Object.assign({}, exports.DEFAULT_KEYWORDS[text], v);
        }
        result[text] = Object.assign({}, exports.DEFAULT_STYLE, customDefaultStyle, v);
    });
    Object.keys(exports.DEFAULT_KEYWORDS).forEach((v) => {
        if (!result[v]) {
            result[v] = Object.assign({}, exports.DEFAULT_STYLE, customDefaultStyle, exports.DEFAULT_KEYWORDS[v]);
        }
    });
    return result;
}
function chooseAnnotationType(availableAnnotationTypes) {
    return exports.window.showQuickPick(availableAnnotationTypes, {});
}
function getPathes(config) {
    return Array.isArray(config)
        ? '{' + config.join(',') + '}'
        : (typeof config === 'string' ? config : '');
}
function searchAnnotations(workspaceState, pattern, callback) {
    var settings = exports.workspace.getConfiguration('todohighlight');
    var includePattern = getPathes(settings.get('include') || '{**/*}');
    var excludePattern = getPathes(settings.get('exclude') || '{**/*}');
    var limitationForSearch = settings.get('maxFilesForSearch', 5120);
    var statusMsg = ` Searching...`;
    exports.window.processing = true;
    setStatusMsg(exports.zapIcon, statusMsg, "Status message");
    exports.workspace.findFiles(includePattern, excludePattern, limitationForSearch).then(function (files) {
        if (!files || files.length === 0) {
            callback({ message: 'No files found' }, undefined, undefined);
            return;
        }
        var totalFiles = files.length, progress = 0, times = 0, annotations = {}, annotationList = [];
        function file_iterated() {
            times++;
            progress = Math.floor(times / totalFiles * 100);
            setStatusMsg(exports.zapIcon, progress + '% ' + statusMsg, "Status message");
            if (times === totalFiles || exports.window.manuallyCancel) {
                exports.window.processing = true;
                workspaceState.update('annotationList', annotationList);
                callback(null, annotations, annotationList);
            }
        }
        for (var i = 0; i < totalFiles; i++) {
            exports.workspace.openTextDocument(files[i]).then(function (file) {
                searchAnnotationInFile(file, annotations, annotationList, pattern);
                file_iterated();
            }, function (err) {
                errorHandler(err);
                file_iterated();
            });
        }
    }, function (err) {
        errorHandler(err);
    });
}
function searchAnnotationInFile(file, annotations, annotationList, regexp) {
    const fileInUri = file.uri.toString();
    const pathWithoutFile = fileInUri.substring(7, fileInUri.length);
    for (let line = 0; line < file.lineCount; line++) {
        const lineText = file.lineAt(line).text;
        const match = lineText.match(regexp);
        if (match !== null) {
            if (!annotations.hasOwnProperty(pathWithoutFile)) {
                annotations[pathWithoutFile] = [];
            }
            let content = getContent(lineText, match);
            if (content.length > 500) {
                content = content.substring(0, 500).trim() + '...';
            }
            const locationInfo = getLocationInfo(fileInUri, pathWithoutFile, lineText, line, match);
            const annotation = {
                uri: locationInfo.uri,
                label: content,
                detail: locationInfo.relativePath,
                lineNum: line,
                fileName: locationInfo.absPath,
                startCol: locationInfo.startCol,
                endCol: locationInfo.endCol
            };
            annotationList.push(annotation);
            annotations[pathWithoutFile].push(annotation);
        }
    }
}
function annotationsFound(err, annotations, annotationList) {
    if (err) {
        console.log('todohighlight err:', err);
        setStatusMsg(exports.defaultIcon, exports.defaultMsg, "Status message");
        return;
    }
    const resultNum = annotationList.length;
    const tooltip = resultNum + ' result(s) found';
    setStatusMsg(exports.defaultIcon, resultNum.toString(), tooltip);
    showOutputChannel(annotationList);
}
function showOutputChannel(data) {
    if (!exports.window.outputChannel)
        return;
    exports.window.outputChannel.clear();
    if (data.length === 0) {
        exports.window.showInformationMessage('No results');
        return;
    }
    var settings = exports.workspace.getConfiguration('todohighlight');
    var toggleURI = settings.get('toggleURI', false);
    data.forEach(function (v, i, a) {
        // due to an issue of vscode(https://github.com/Microsoft/vscode/issues/586), in order to make file path clickable within the output channel,the file path differs from platform
        const patternA = '#' + (i + 1) + '\t' + v.uri + '#' + (v.lineNum + 1);
        const patternB = '#' + (i + 1) + '\t' + v.uri + ':' + (v.lineNum + 1) + ':' + (v.startCol + 1);
        const patterns = [patternA, patternB];
        //for windows and mac
        let patternType = 0;
        if (exports.os.platform && exports.os.platform() === "linux") {
            // for linux
            patternType = 1;
        }
        if (toggleURI) {
            //toggle the pattern
            patternType = +!patternType;
        }
        if (exports.window.outputChannel) {
            exports.window.outputChannel.appendLine(patterns[patternType]);
            exports.window.outputChannel.appendLine('\t' + v.label + '\n');
        }
    });
    exports.window.outputChannel.show();
}
function getContent(lineText, match) {
    return lineText.substring(lineText.indexOf(match[0]), lineText.length);
}
;
function getLocationInfo(fileInUri, pathWithoutFile, lineText, line, match) {
    var rootPath = exports.workspace.rootPath + '/';
    var outputFile = pathWithoutFile.replace(rootPath, '');
    var startCol = lineText.indexOf(match[0]);
    var endCol = lineText.length;
    var location = outputFile + ' ' + (line + 1) + ':' + (startCol + 1);
    return {
        uri: fileInUri,
        absPath: pathWithoutFile,
        relativePath: location,
        startCol: startCol,
        endCol: endCol
    };
}
;
function createStatusBarItem() {
    var statusBarItem = exports.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarItem.text = exports.defaultIcon + exports.defaultMsg;
    statusBarItem.tooltip = 'List annotations';
    statusBarItem.command = 'fd_todohighlight.showOutputChannel';
    return statusBarItem;
}
;
function errorHandler(err) {
    exports.window.processing = true;
    setStatusMsg(exports.defaultIcon, exports.defaultMsg, "Status message");
    console.log('todohighlight err:', err);
}
function setStatusMsg(icon, msg, tooltip) {
    if (exports.window.statusBarItem) {
        exports.window.statusBarItem.text = `${icon} ${msg}` || '';
        if (tooltip) {
            exports.window.statusBarItem.tooltip = tooltip || '';
        }
        exports.window.statusBarItem.show();
    }
}
function escapeRegExp(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
