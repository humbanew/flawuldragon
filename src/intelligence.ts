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
     * [Color Highlight with decimals]
     * Publisher	ps-george	
     * Unique Identifier	ps-george.color-highlight-decimals
     * 
     * [Color Highlight-fork]
     * Publisher	Michael K. Scholz	
     * Unique Identifier	mikekscholz.color-highlight-fork
     * 
     * [ErrorLens]
     * Publisher	Alexander	
     * Unique Identifier	usernamehw.errorlens
     * 
     * [ErrorLens Alt]
     * Publisher	Phil Hindle	
     * Unique Identifier	PhilHindle.errorlens
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
     * [Jetbrains Icons Pack]
     * Publisher	Chad Adams	
     * Unique Identifier	chadalen.vscode-jetbrains-icon-theme	
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
     * [Datapack Icons Minecraft]
     * Publisher 	FuncFusion
     * Unique Identifier 	SuperAnt.mc-dp-icons
     * 
     * [Carbon Product Icons]
     * Publisher	Alyx Z	
     * Unique Identifier	alyxz.icons-carbon-tweaked
     *
     * [Jetbrains IDEA Product Icon Theme]
     * Publisher	ardonplay	
     * Unique Identifier	ardonplay.jetbrains-idea-product-icon-theme
     * 
     * [Charmed Icons]
     * Publisher	littensy	
     * Unique Identifier	littensy.charmed-icons
     * 
     * [Nomo Dark Icon Theme Extended]
     * Publisher	be5invis	
     * Unique Identifier	be5invis.vscode-icontheme-nomo-dark
     * 
     * [Nomo Dark macOS Icon Theme]
     * Publisher	Tobias Punke	
     * Unique Identifier	Gaulomatic.vscode-icontheme-nomo-dark-macos
     * 
     * [Nomo Light Icon Theme Extended]
     * Publisher	MicroHobby	
     * Unique Identifier	microhobby.nomo-light-extended
     * 
     * [VSCode Great Icons]
     * Publisher	Emmanuel Béziat
     * Unique Identifier	emmanuelbeziat.vscode-great-icons
     * 
     * [VSCode Icons Mac]
     * Publisher	Wayou Liu	
     * Unique Identifier	wayou.vscode-icons-mac
     * 
     * [VSCode Icons]
     * Publisher	VSCode Icons Team	
     * Unique Identifier	vscode-icons-team.vscode-icons
     * 
     * [Sakai Icons]
     * Publisher	Sakai	
     * Unique Identifier	Sakai.sakai-icons
     * 
     * [MaterialIconic Product Icons]
     * Publisher	nyxb	
     * Unique Identifier	nyxb.materialiconic-product-icons	
     * 
     * [VS2022 Icons]
     * Publisher	RespectMathias	
     * Unique Identifier	RespectMathias.VS2022-Icons
     * 
     * [CS Symbols Icons]
     * Publisher	FreeIdom	
     * Unique Identifier	FreeIdom.cs-symbols	
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
