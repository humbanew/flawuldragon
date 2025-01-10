"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
exports.activationPrompt = activationPrompt;
const vscode = __importStar(require("vscode"));
const AutoRCCTag_js_1 = require("./@autorcctag/AutoRCCTag.js");
const FileSize_js_1 = require("./@filesize/FileSize.js");
const IndentRainbow_js_1 = require("./@indentrainbow/IndentRainbow.js");
const JetbrainsMono_js_1 = require("./@jetbrainsmono/JetbrainsMono.js");
const PomodoroClock_js_1 = require("./@pomodoroclock/PomodoroClock.js");
const ThemeSwitch_js_1 = require("./@themeswitch/ThemeSwitch.js");
const TodoHighlight_js_1 = require("./@todohighlight/TodoHighlight.js");
const Vanilla_js_1 = require("./@vanilla/Vanilla.js");
const vanilla = new Vanilla_js_1.Vanilla();
// const vanillaExtInt = new VExtensionIntelligence();
const jetbrainsmono = new JetbrainsMono_js_1.JetbrainsMono();
const filesize = new FileSize_js_1.FileSize();
const todohighlight = new TodoHighlight_js_1.TodoHighlight();
const indentrainbow = new IndentRainbow_js_1.IndentRainbow();
const pomodoroclock = new PomodoroClock_js_1.PomodoroClock();
const themeswitch = new ThemeSwitch_js_1.ThemeSwitch();
const autorrctag = new AutoRCCTag_js_1.AutoRCCTag();
/**
 * Activates the extension.
 *
 * This function is called when the extension is activated. It is used to set up
 * any necessary state or register commands, providers, etc.
 *
 * @param context - The context in which the extension is activated. This provides
 * access to the extension's global state, subscriptions, and other utilities.
 */
function activate(context) {
    try {
        console.log('Flawuldragon - Core Hub activated!');
        vanilla.vanilla_activate(context);
        jetbrainsmono.jetbrainsMono_activate(context);
        jetbrainsmono.jetbrainsMono_firstTimeActivation(context);
        filesize.filesize_activate(context);
        todohighlight.todoHighlight_activate(context);
        indentrainbow.indentRainbow_activate(context);
        pomodoroclock.pomodoroClock_activate(context);
        themeswitch.themeSwitch_activate(context);
        autorrctag.autoRCCTag_activate(context);
    }
    catch (error) {
        console.log('Flawuldragon Core Hub - Error: ' + error);
        vscode.window.showErrorMessage('An error occurred while activating the Flawuldragon core hub: ' +
            error +
            '. Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)');
        deactivate(context);
    }
    finally { }
}
/**
 * Deactivates the extension.
 *
 * This function is called when the extension is deactivated. It can be used to
 * perform any necessary cleanup tasks.
 *
 * @param context - The context in which the extension is running.
 */
function deactivate(context) {
    vanilla.vanilla_desactivate();
    jetbrainsmono.jetbrainsMono_desactivate(context);
    filesize.filesize_desactivate();
    todohighlight.todoHighlight_desactivate();
    indentrainbow.indentRainbow_desactivate();
    pomodoroclock.pomodoroClock_desactivate();
    themeswitch.themeSwitch_desactivate();
    autorrctag.autoRCCTag_desactivate();
}
/**
 * Activates the JetBrains Mono prompt within the given VS Code extension context.
 *
 * @param context - The VS Code extension context in which the activation prompt is triggered.
 */
function activationPrompt(context) {
    jetbrainsmono.jetbrainsMono_activationPrompt(context);
}
