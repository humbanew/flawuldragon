import * as fs from "node:fs";
import * as svg from "svgson";
import * as path from "node:path";
import * as vscode from "vscode";
import { fileURLToPath } from "node:url";
import { Theme } from "./IJBIThemes";

/**
 * The `JetbrainsIcons` class provides methods to manage and build JetBrains-themed icons for both light and dark themes.
 * It includes functionalities to retrieve icon paths, build themes, generate auto themes, and handle icon file operations.
 *
 * @class
 * @example
 * const jetbrainsIcons = new JetbrainsIcons();
 * jetbrainsIcons.jetbrainsIcons_activate(context);
 */
export class JetbrainsIcons {
  /**
   * The absolute path to the current module's file.
   * This is derived from the `import.meta.url` using the `fileURLToPath` function.
   */
  private __filename = fileURLToPath(require('url').pathToFileURL(__filename).toString());

  /**
   * The directory name of the current module's file.
   * This is equivalent to the `__dirname` global variable in Node.js.
   * It is determined using the `node_path.dirname` method on the current module's filename.
   */
  private __dirname = path.dirname(this.__filename);

  /**
   * The path to the build directory where the output icons will be stored.
   * This path is constructed by joining the current directory with the relative path "../out/icons".
   *
   * @private
   * @type {string}
   */
  private BUILD_DIR_PATH = path.join(this.__dirname, "../out/icons");

  /**
   * The path to the source directory containing theme icons.
   * This path is constructed by joining the current directory with the relative path to the icons directory.
   *
   * @private
   * @constant
   */
  private SRC_DIR_PATH = path.join(this.__dirname, "../themes/icons");

  /**
   * Retrieves the icon paths from the given theme.
   *
   * @param theme - The theme object containing icon definitions.
   * @param themePath - The base path to the theme directory. Defaults to an empty string.
   * @returns An array of strings representing the paths to the icons.
   */
  private jetbrainsIcons_getIconPaths(theme: Theme, themePath = ""): string[] {
    return Object.values(theme.iconDefinitions).map((iconDefinition) =>
      path.join(path.dirname(themePath), iconDefinition.iconPath),
    );
  }

  /**
   * Builds a theme by reading a theme configuration file, copying necessary icons, and writing the theme to a specified build path.
   *
   * @param themePath - The path to the theme configuration file.
   * @param buildPath - The path where the built theme and icons should be saved.
   *
   * This method performs the following steps:
   * 1. Reads and parses the theme configuration file from `themePath`.
   * 2. Retrieves the paths of the icons required by the theme.
   * 3. Creates the build directory at `buildPath` if it does not already exist.
   * 4. Writes the parsed theme configuration to a `theme.json` file in the build directory.
   * 5. Copies each icon to the corresponding location in the build directory, maintaining the relative directory structure.
   * 6. Logs a warning if any icon does not exist.
   */
  private jetbrainsIcons_buildTheme(themePath: string, buildPath: string) {
    const theme = JSON.parse(fs.readFileSync(themePath, "utf-8"));
    const iconPaths = this.jetbrainsIcons_getIconPaths(theme, themePath);

    fs.mkdirSync(buildPath, { recursive: true });

    fs.writeFileSync(
      path.join(buildPath, "theme.json"),
      JSON.stringify(theme, null, 4),
    );

    iconPaths.forEach((iconPath) => {
      if (!fs.existsSync(iconPath)) {
        console.warn(`Icon does not exist: ${iconPath}`);
        return;
      }

      const buildIconPath = path.join(
        buildPath,
        path.relative(path.dirname(themePath), iconPath),
      );

      fs.mkdirSync(path.dirname(buildIconPath), { recursive: true });
      fs.copyFileSync(iconPath, buildIconPath);
    });
  }

  /**
   * Removes the file extension from the given file name.
   *
   * @param fileName - The name of the file from which to remove the extension.
   * @returns The file name without its extension.
   */
  private jetbrainsIcons_removeExtension(fileName: string) {
    return path.basename(fileName, path.extname(fileName));
  }

  /**
   * Removes the suffix from a JetBrains icon file name.
   * 
   * This method first removes the file extension from the given file name,
   * then splits the resulting string by the underscore character ("_") and
   * returns the first part of the split string.
   * 
   * @param fileName - The name of the file from which to remove the suffix.
   * @returns The file name without its suffix.
   */
  private jetbrainsIcons_removeSuffix(fileName: string) {
    return this.jetbrainsIcons_removeExtension(fileName).split("_")[0];
  }

  /**
   * Retrieves the icon name from a given file name by removing its extension and suffix.
   *
   * @param fileName - The name of the file from which to extract the icon name.
   * @returns The icon name after removing the file extension and suffix.
   */
  private jetbrainsIcons_getIconName(fileName: string) {
    return this.jetbrainsIcons_removeSuffix(
      this.jetbrainsIcons_removeExtension(fileName),
    );
  }

  /**
   * Retrieves JetBrains icons for both light and dark themes.
   *
   * @param lightTheme - The theme object containing icon definitions for the light theme.
   * @param darkTheme - The theme object containing icon definitions for the dark theme.
   * @returns An object where each key is an icon definition key and the value is an object containing:
   *   - `light`: The parsed SVG node for the light theme icon, or `null` if not available.
   *   - `dark`: The parsed SVG node for the dark theme icon, or `null` if not available.
   *   - `iconName`: The name of the icon.
   */
  private jetbrainsIcons_getIcons(lightTheme: Theme, darkTheme: Theme) {
    const icons: {
      [key: string]: {
        light: svg.INode | null;
        dark: svg.INode | null;
        iconName: string;
      };
    } = {};

    const iconDefinitionsEntries = [
      ...Object.entries(lightTheme.iconDefinitions).map(
        ([iconDefinitionKey, iconDefinition]) =>
          [iconDefinitionKey, { ...iconDefinition, theme: "light" }] as const,
      ),
      ...Object.entries(darkTheme.iconDefinitions).map(
        ([iconDefinitionKey, iconDefinition]) =>
          [iconDefinitionKey, { ...iconDefinition, theme: "dark" }] as const,
      ),
    ];

    for (const [iconDefinitionKey, iconDefinition] of iconDefinitionsEntries) {
      if (!fs.existsSync(iconDefinition.iconPath)) {
        continue;
      }

      const iconName = this.jetbrainsIcons_getIconName(
        path.basename(iconDefinition.iconPath),
      );

      if (!icons[iconDefinitionKey]) {
        icons[iconDefinitionKey] = {
          light: null,
          dark: null,
          iconName,
        };
      }

      const iconSource = fs.readFileSync(iconDefinition.iconPath, {
        encoding: "utf8",
      });
      const iconAst = svg.parseSync(iconSource);

      icons[iconDefinitionKey][iconDefinition.theme] = iconAst;
    }

    return icons;
  }

  /**
   * Generates an SVG node that includes both light and dark mode icons.
   *
   * @param lightIcon - The SVG node representing the light mode icon.
   * @param darkIcon - The SVG node representing the dark mode icon, or null if not applicable.
   * @returns An SVG node that contains the light mode icon and optionally the dark mode icon,
   *          with appropriate CSS to switch between them based on the user's color scheme preference.
   */
  private jetbrainsIcons_getAutoIconAst(
    lightIcon: svg.INode,
    darkIcon: svg.INode | null,
  ): svg.INode {
    return {
      name: "svg",
      type: "element",
      value: "",
      attributes: lightIcon.attributes,
      children: [
        ...(darkIcon !== null
          ? [
              {
                name: "style",
                type: "element",
                value: "",
                attributes: {},
                children: [
                  {
                    name: "",
                    type: "text",
                    value:
                      ".dark { display: none; } .light { display: block; } @media (prefers-color-scheme: dark) { .dark { display: block; } .light { display: none; } }",
                    attributes: {},
                    children: [],
                  },
                ],
              },
            ]
          : []),
        {
          name: "g",
          type: "element",
          value: "",
          attributes: {
            class: "light",
          },
          children: lightIcon.children,
        },
        ...(darkIcon !== null
          ? [
              {
                name: "g",
                type: "element",
                value: "",
                attributes: {
                  class: "dark",
                },
                children: darkIcon.children,
              },
            ]
          : []),
      ],
    };
  }

  /**
   * Builds auto icons for JetBrains themes and saves them to the specified directory.
   *
   * @param lightTheme - The light theme configuration.
   * @param darkTheme - The dark theme configuration.
   * @param buildDirPath - The directory path where the icons will be saved.
   * @returns An object containing icon definitions with their respective paths.
   */
  private jetbrainsIcons_buildAutoIcons(
    lightTheme: Theme,
    darkTheme: Theme,
    buildDirPath: string,
  ) {
    const icons = this.jetbrainsIcons_getIcons(lightTheme, darkTheme);

    const iconDefinitions: { [key: string]: { iconPath: string } } = {};
    fs.mkdirSync(path.join(buildDirPath, "icons"), { recursive: true });

    for (const iconDefinitionKey in icons) {
      const icon = icons[iconDefinitionKey];
      let autoIcon: svg.INode;
      let iconRelativePath = `./icons/${icon.iconName}_auto.svg`;

      if (icon.light != null && icon.dark != null) {
        autoIcon = this.jetbrainsIcons_getAutoIconAst(icon.light, icon.dark);

        fs.writeFileSync(
          path.join(buildDirPath, iconRelativePath),
          svg.stringify(autoIcon),
        );
        iconDefinitions[iconDefinitionKey] = {
          iconPath: iconRelativePath,
        };
      }
    }

    return iconDefinitions;
  }

  /**
   * Adjusts the icon paths in the given theme by resolving them relative to the provided theme path.
   *
   * @param theme - The theme object containing icon definitions that need their paths fixed.
   * @param themePath - The file path to the theme, used to resolve the correct icon paths.
   * @returns The updated theme object with fixed icon paths.
   */
  private jetbrainsIcons_fixIconPaths(theme: Theme, themePath: string) {
    for (const iconDefinitionKey in theme.iconDefinitions) {
      const iconDefinition =
        theme.iconDefinitions[
          iconDefinitionKey as keyof typeof theme.iconDefinitions
        ];
      iconDefinition.iconPath = path.join(
        path.dirname(themePath),
        iconDefinition.iconPath,
      );
    }

    return theme;
  }

  /**
   * Generates an auto theme by combining light and dark themes for JetBrains icons.
   *
   * @param lightThemePath - The file path to the light theme JSON file.
   * @param darkThemePath - The file path to the dark theme JSON file.
   * @param buildDirPath - The directory path where the generated auto theme JSON file will be saved.
   *
   * This method reads the light and dark theme JSON files, fixes their icon paths,
   * and then combines them into a single auto theme. The combined theme includes
   * icon definitions, file, folder, folder names, file names, and file extensions
   * from both themes. The resulting auto theme is saved as a JSON file in the specified
   * build directory.
   */
  private jetbrainsIcons_generate2023AutoTheme(
    lightThemePath: string,
    darkThemePath: string,
    buildDirPath: string,
  ) {
    const lightTheme = this.jetbrainsIcons_fixIconPaths(
      JSON.parse(
        fs.readFileSync(lightThemePath, { encoding: "utf8" }),
      ) as Theme,
      lightThemePath,
    );
    const darkTheme = this.jetbrainsIcons_fixIconPaths(
      JSON.parse(fs.readFileSync(darkThemePath, { encoding: "utf8" })) as Theme,
      darkThemePath,
    );

    const autoTheme = {
      iconDefinitions: this.jetbrainsIcons_buildAutoIcons(
        lightTheme,
        darkTheme,
        buildDirPath,
      ),
      file: lightTheme.file,
      folder: lightTheme.folder,
      folderNames: {
        ...lightTheme.folderNames,
        ...darkTheme.folderNames,
      },
      fileNames: {
        ...lightTheme.fileNames,
        ...darkTheme.fileNames,
      },
      fileExtensions: {
        ...lightTheme.fileExtensions,
        ...darkTheme.fileExtensions,
      },
    };

    fs.mkdirSync(path.dirname(buildDirPath), { recursive: true });
    fs.writeFileSync(
      path.join(buildDirPath, "theme.json"),
      JSON.stringify(autoTheme, null, 4),
    );
  }

  /**
   * Activates the Jetbrains Icons extension by performing the following steps:
   * 
   * 1. Removes the existing build directory if it exists.
   * 2. Creates a new build directory.
   * 3. Builds the themes by copying source theme files to the build directory.
   * 4. Generates the 2023 auto theme by combining the light and dark theme files.
   * 
   * @param context - The VS Code extension context.
   */
  public jetbrainsIcons_activate(context: vscode.ExtensionContext) {
    try {
      console.log("Flawuldragon - Jetbrains Icons activated!");
      // Here is the mapping of the source theme directory to the build theme directory.
      //
      // assets/v1/theme-dark.json -> build/themes/v1/dark/theme-dark.json
      // assets/2023/theme-light.json -> build/themes/2023/light/theme-light.json
      // assets/2023/theme-dark.json -> build/themes/2023/dark/theme-dark.json
      // [GENERATED] -> build/themes/2023/auto/theme-auto.json
  
      // STEP 1: Remove existing build directory.
      if (fs.existsSync(this.BUILD_DIR_PATH)) {
        fs.rmSync(this.BUILD_DIR_PATH, { recursive: true });
      }
  
      // STEP 2: Create build directory.
      fs.mkdirSync(this.BUILD_DIR_PATH, { recursive: true });
  
      // STEP 3: Build themes.
      this.jetbrainsIcons_buildTheme(
        path.join(this.SRC_DIR_PATH, "v1", "theme-dark.json"),
        path.join(this.BUILD_DIR_PATH, "v1", "dark"),
      );
      this.jetbrainsIcons_buildTheme(
        path.join(this.SRC_DIR_PATH, "2023", "theme-light.json"),
        path.join(this.BUILD_DIR_PATH, "2023", "light"),
      );
      this.jetbrainsIcons_buildTheme(
        path.join(this.SRC_DIR_PATH, "2023", "theme-dark.json"),
        path.join(this.BUILD_DIR_PATH, "2023", "dark"),
      );
  
      // STEP 4: Generate 2023 auto theme.
      this.jetbrainsIcons_generate2023AutoTheme(
        path.join(this.SRC_DIR_PATH, "2023", "theme-light.json"),
        path.join(this.SRC_DIR_PATH, "2023", "theme-dark.json"),
        path.join(this.BUILD_DIR_PATH, "2023", "auto"),
      );
    } catch (error) {
      console.log("Flawuldragon - Jetbrains Icons error: " + error);
      vscode.window.showErrorMessage("An error occurred while activating the jetbrains icons integration feature: " + error + ". Contact the Humbanew support team for assistance. [Report the problem](https://github.com/humbanew/flawuldragon/discussions/categories/issues-and-bugs)");
      this.jetbrainsIcons_deactivate();
    }
  }

  /**
   * Deactivates Jetbrains icons.
   * 
   * This method currently does not perform any actions.
   * It is a placeholder for future implementation.
   */
  public jetbrainsIcons_deactivate() {
    vscode.window.showInformationMessage("Jetbrains Icons deactivated.");
  }
}
