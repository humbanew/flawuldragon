import * as vscode from "vscode";
import { DayJS } from "./DayJS.dependency";

export class DateTime extends DayJS {
  public datetime_activate(context: vscode.ExtensionContext) {}
  public datetime_deactivate() {}
}
