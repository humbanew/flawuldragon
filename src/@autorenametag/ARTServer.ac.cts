import { codeFrameColumns } from '@babel/code-frame';
import 'source-map-support/register';
import * as fs from 'fs';
import { TextDocumentSyncKind } from 'vscode-languageclient/node';
import {
  Connection,
  RequestType as RequestTypeServer,
  TextDocuments
} from 'vscode-languageserver';
import { createConnection } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { ARTService } from './ARTService.ac.cjs';
import { IARTSParams } from './IARTSParams';
import { IARTSResult } from './IARTSResult';


export class ARTServer {
  public autoRenameTagRequestType = new RequestTypeServer<
    IARTSParams,
    IARTSResult[],
    any
  >('$/auto-rename-tag');

  public NULL_AUTO_RENAME_TAG_RESULT: IARTSResult[] = [];

  public autoRenameTag: (
    documents: TextDocuments<TextDocument>
  ) => (params: IARTSParams) => Promise<IARTSResult[]> =
    documents =>
    async ({ textDocument, tags }) => {
      await new Promise(r => setTimeout(r, 20));
      const document = documents.get(textDocument.uri);
      if (!document) {
        return this.NULL_AUTO_RENAME_TAG_RESULT;
      }
      if (textDocument.version !== document.version) {
        return this.NULL_AUTO_RENAME_TAG_RESULT;
      }
      const text = document.getText();
      const results: IARTSResult[] = tags
        .map(tag => {
          const result = ARTService.call.prototype.doAutoRenameTag(
            text,
            tag.offset,
            tag.word,
            tag.oldWord,
            document.languageId
          );
          if (!result) {
            return result;
          }
          (result as any).originalOffset = tag.offset;
          (result as any).originalWord = tag.word;
          return result as IARTSResult;
        })
        .filter(Boolean) as IARTSResult[];
      return results;
    };

  public handleError: (error: Error) => void = error => {
    console.error(error.stack);
    const lines = error.stack?.split('\n') || [];
    let file = lines[1];
    if (file) {
      let match = file.match(/\((.*):(\d+):(\d+)\)$/);
      if (!match) {
        match = file.match(/at (.*):(\d+):(\d+)$/);
      }
      if (match) {
        const [_, path, line, column] = match;
        const rawLines = fs.readFileSync(path, 'utf-8');
        const location = {
          start: {
            line: parseInt(line),
            column: parseInt(column)
          }
        };

        const result = codeFrameColumns(rawLines, location);
        console.log('\n' + result + '\n');
      }
    }
    let relevantStack = (error as Error).stack?.split('\n').slice(1).join('\n');
    if (relevantStack?.includes('at CallbackList.invoke')) {
      relevantStack = relevantStack.slice(
        0,
        relevantStack.indexOf('at CallbackList.invoke')
      );
    }
    console.log(relevantStack);
  };

  public useConnectionConsole: (
    connection: Connection,
    { trace }: { trace?: boolean }
  ) => (method: 'log' | 'info' | 'error') => (...args: any[]) => void =
    (connection, { trace = false } = {}) =>
    method =>
    (...args) => {
      if (trace) {
        const stack = new Error().stack || '';
        let file = stack.split('\n')[2];
        file = file.slice(file.indexOf('at') + 'at'.length, -1);
        const match = file.match(/(.*):(\d+):(\d+)$/);
        if (match) {
          const [_, path, line, column] = match;
          connection.console[method]('at ' + path + ':' + line);
        }
      }
      const stringify: (arg: any) => string = arg => {
        if (arg && arg.toString) {
          if (arg.toString() === '[object Promise]') {
            return JSON.stringify(arg);
          }
          if (arg.toString() === '[object Object]') {
            return JSON.stringify(arg);
          }
          return arg;
        }
        return JSON.stringify(arg);
      };
      connection.console[method](args.map(stringify).join(''));
    };

  /**
   * Enables better stack traces for errors and logging.
   */
  public enableBetterErrorHandlingAndLogging: (connection: Connection) => void =
    connection => {
      const connectionConsole = this.useConnectionConsole(connection, {
        trace: false
      });
      console.log = connectionConsole('log');
      console.info = connectionConsole('info');
      console.error = connectionConsole('error');
      process.on('uncaughtException', this.handleError);
      process.on('unhandledRejection', this.handleError);
    };

  public connection = createConnection();
  public documents = new TextDocuments(TextDocument);

  public handleRequest: <Params, Result>(
    fn: (params: Params) => Result
  ) => (params: Params) => Result = fn => params => {
    try {
      return fn(params);
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  };

  public constructor() {
    this.enableBetterErrorHandlingAndLogging(this.connection);

    this.connection.onInitialize(() => ({
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental
      }
    }));

    this.connection.onInitialized(() => {
      console.log('Auto Rename Tag has been initialized.');
    });

    this.connection.onRequest(
      this.autoRenameTagRequestType,
      this.handleRequest(this.autoRenameTag(this.documents))
    );

    this.documents.listen(this.connection);
    this.connection.listen();
  }
}
