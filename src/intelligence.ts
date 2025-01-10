import * as vscode from 'vscode';

class VExtensionIntelligence {
  public disableExtensions() {
    console.log("Flawuldragon - Vanilla Extension Intelligence enabled!");
    // desabilita as extensoes duplicadas
    /**
     * [Auto Close Tag]
     * Publisher 	Jun Han
     * Unique Identifier 	formulahendry.auto-close-tag
     *
     * [Auto Rename Tag]
     * Publisher 	Jun Han
     * Unique Identifier 	formulahendry.auto-rename-tag
     * 
     * [Toggle Bracket Guides]
     * Publisher	TGO Systems	
     * Unique Identifier	TGOSystems.togglebracketguides
     * 
     * [Color Highlight]
     * Publisher	Sergii N	
     * Unique Identifier	naumovs.color-highlight
     *
     * [Filesize]
     * Publisher 	Wei_ds
     * Unique Identifier 	wei_ds.filesize
     *
     * [Indent Rainbow]
     * Publisher 	oderwat
     * Unique Identifier 	oderwat.indent-rainbow
     *
     * [Jetbrains Mono Font Pack]
     * Publisher 	Narasima Pandiyan
     * Unique Identifier 	NarasimaPandiyan.jetbrainsmono
     *
     * [Pomodoro Clock]
     * Publisher 	jackluson
     * Unique Identifier 	jackluson.pomodoro-clock
     *
     * [Theme Switch]
     * Publisher 	Wei Wang
     * Unique Identifier 	weiiwang.theme-switch
     *
     * [Todo Highlight]
     * Publisher 	Wayou Liu
     * Unique Identifier 	wayou.vscode-todo-highlight
     *
     * [Fluent Icons]
     * Publisher 	Miguel Solorio
     * Unique Identifier 	miguelsolorio.fluent-icons
     *
     * [Visual Studio Icons v1]
     * Publisher 	Jordan Lowe
     * Unique Identifier 	jtlowe.vscode-icon-theme
     *
     * [Visual Studio Icons v2]
     * Publisher 	vigan-abd
     * Unique Identifier 	vigan-abd.vscode-icon-v2
     *
     * [Visual Studio Icons Classic]
     * Publisher 	jez9999
     * Unique Identifier 	jez9999.vsclassic-icon-theme
     *
     * [Visual Studio Code Icons]
     * Publisher 	VSCode Icons Team
     * Unique Identifier 	vscode-icons-team.vscode-icons
     *
     * [Datapack Icons Minecraft]
     * Publisher 	FuncFusion
     * Unique Identifier 	SuperAnt.mc-dp-icons
     *
     */
    vscode.workspace.getConfiguration().get('installedExtensions');
    let toDisableExtensions = [
      'formulahendry.auto-close-tag',
      'formulahendry.auto-rename-tag',
      'wei_ds.filesize',
      'oderwat.indent-rainbow',
      'NarasimaPandiyan.jetbrainsmono',
      'jackluson.pomodoro-clock',
      'weiiwang.theme-switch',
      'wayou.vscode-todo-highlight',
      'miguelsolorio.fluent-icons',
      'jtlowe.vscode-icon-theme',
      'vigan-abd.vscode-icon-v2',
      'jez9999.vsclassic-icon-theme',
      'vscode-icons-team.vscode-icons',
      'SuperAnt.mc-dp-icons'
    ];
    toDisableExtensions.forEach((extension) => {
      vscode.commands.executeCommand(
        'workbench.extensions.disableExtension',
        extension
      );
    });
    vscode.window.showInformationMessage("Some extensions are being deactivated during Flawuldragon execution, when you want to disable the extension, the deactivated extensions will be reactivated again on your workspace.");
  }

  public renableExtensions() {
    let toEnableExtensions = [
      'formulahendry.auto-close-tag',
      'formulahendry.auto-rename-tag',
      'wei_ds.filesize',
      'oderwat.indent-rainbow',
      'NarasimaPandiyan.jetbrainsmono',
      'jackluson.pomodoro-clock',
      'weiiwang.theme-switch',
      'wayou.vscode-todo-highlight',
      'miguelsolorio.fluent-icons',
      'jtlowe.vscode-icon-theme',
      'vigan-abd.vscode-icon-v2',
      'jez9999.vsclassic-icon-theme',
      'vscode-icons-team.vscode-icons',
      'SuperAnt.mc-dp-icons'
    ];
    toEnableExtensions.forEach((extension) => {
      vscode.commands.executeCommand(
        'workbench.extensions.enableExtension',
        extension
      );
    });
    vscode.window.showInformationMessage("Their extensions disabled by Flawuldragon are being reactivated in their workspace.");
  }
}
