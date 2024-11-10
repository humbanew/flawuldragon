import * as path from "node:path";
export function getIconPaths(theme, themePath = "") {
    return Object.values(theme.iconDefinitions).map((iconDefinition) => path.join(path.dirname(themePath), iconDefinition.iconPath));
}
