"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeSwitch = void 0;
const vscode = require("vscode");
class ThemeSwitch {
    context;
    switch;
    config;
    darkTheme;
    lightTheme;
    themeSwitch_context(context) {
        this.context = context;
        this.config = vscode.workspace.getConfiguration();
        this.themeSwitch_Initialize();
    }
    themeSwitch_Initialize() {
        // convert old theming settings
        const oldDark = this.config.get('themeswitch.nightTheme');
        if (oldDark && this.config.get('workbench.preferredDarkColorTheme') !== oldDark) {
            this.config.update('workbench.preferredDarkColorTheme', oldDark, true);
            this.config.update('themeswitch.nightTheme', undefined, true);
        }
        const oldLight = this.config.get('themeswitch.dayTheme');
        if (oldLight && this.config.get('workbench.preferredLightColorTheme') !== oldLight) {
            this.config.update('workbench.preferredLightColorTheme', oldLight, true);
            this.config.update('themeswitch.dayTheme', undefined, true);
        }
        this.themeSwitch_getTheme();
        // switch to the dark theme
        this.themeSwitch_registerCommand('flawuldragon.themeswitch.darktheme', () => {
            if (!this.darkTheme) {
                // TODO: dropdown to select a theme
                return vscode.window.showInformationMessage('You have not yet selected a preferred dark theme.');
            }
            this.config.update('workbench.colorTheme', this.darkTheme, true);
        });
        // switch to the light theme
        this.themeSwitch_registerCommand('flawuldragon.themeswitch.lighttheme', () => {
            if (!this.lightTheme) {
                // TODO: dropdown to select a theme
                return vscode.window.showInformationMessage('You have not yet selected a preferred light theme.');
            }
            this.config.update('workbench.colorTheme', this.lightTheme, true);
        });
        // toggle between the themes
        this.themeSwitch_registerCommand('flawuldragon.themeswitch.toggle', () => {
            if (!this.lightTheme || !this.darkTheme) {
                // TODO: dropdown to select a theme
                return vscode.window.showInformationMessage('You have not yet selected a preferred light and/or dark theme.');
            }
            const colorTheme = this.config.get('workbench.colorTheme');
            if (!colorTheme)
                return this.themeSwitch_fallbackToTheme();
            switch (colorTheme) {
                case this.darkTheme: {
                    this.config.update('workbench.colorTheme', this.lightTheme, true);
                    break;
                }
                case this.lightTheme: {
                    this.config.update('workbench.colorTheme', this.darkTheme, true);
                    break;
                }
                default: {
                    vscode.window.showQuickPick([
                        'Dark Theme',
                        'Light Theme',
                        'Neither'
                    ], {
                        canPickMany: false,
                        placeHolder: 'The theme you are currently using is not your preferred light or dark theme, would you like to make it one?'
                    }).then(async (v) => {
                        switch (v) {
                            case 'Dark Theme': {
                                await this.config.update('workbench.preferredDarkColorTheme', colorTheme, true);
                                break;
                            }
                            case 'Light Theme': {
                                await this.config.update('workbench.preferredLightColorTheme', colorTheme, true);
                                break;
                            }
                        }
                        this.themeSwitch_getTheme();
                        this.themeSwitch_fallbackToTheme();
                    });
                }
            }
        });
        this.themeSwitch_update();
    }
    themeSwitch_destroy() {
        this.switch?.dispose?.();
    }
    themeSwitch_configUpdate(ev) {
        this.themeSwitch_getTheme();
        ev.affectsConfiguration('themeswitch.priority') && this.themeSwitch_update(true);
    }
    themeSwitch_fallbackToTheme() {
        const theme = this.config.get('themeswitch.toggleDefaultDark', true) ? this.darkTheme : this.lightTheme;
        this.config.update('workbench.colorTheme', theme, true);
    }
    // update the statusbar item
    themeSwitch_update(force = false) {
        // create the switch if it does not already exist
        if (this.switch === undefined || force) {
            this.switch?.dispose?.();
            this.switch = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
            this.switch.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
            this.switch.command = 'flawuldragon.themeswitch.toggle';
            this.switch.text = '$(color-mode)';
            this.switch.tooltip = 'Switch theme';
            this.context.subscriptions.push(this.switch);
        }
        this.switch.show();
    }
    themeSwitch_getTheme() {
        this.config = vscode.workspace.getConfiguration();
        this.darkTheme = this.config.get('workbench.preferredDarkColorTheme');
        this.lightTheme = this.config.get('workbench.preferredLightColorTheme');
    }
    themeSwitch_registerCommand(uri, callback) {
        this.context.subscriptions.push(vscode.commands.registerCommand(uri, callback));
    }
    themeSwitch_activate(context) {
        try {
            this.themeSwitch_context(context);
            vscode.workspace.onDidChangeConfiguration(e => {
                this.themeSwitch_configUpdate(e);
            });
        }
        catch (error) {
            console.log("Flawuldragon - ThemeSwitch - Error: " + error);
            vscode.window.showErrorMessage("An error occurred while activating the Flawuldragon ThemeSwitch: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
        }
        finally { }
    }
    themeSwitch_desactivate() {
        this.themeSwitch_destroy();
    }
}
exports.ThemeSwitch = ThemeSwitch;
