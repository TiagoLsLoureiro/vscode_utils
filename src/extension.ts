// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { flatten, unflatten } from './flatTools';
import { flatCommand } from './commands/flat';
import { unflatCommand } from './commands/unflat';
import { singleXlslCommand } from './commands/singlexlsx';
import { multiLocaleXlsxCommand } from './commands/multiLocaleXlsx';
import { readmultiLocaleXlsxCommand } from './commands/readMultiLocaleXlsx';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tiagotools" is now active!');

	const customConsole = vscode.window.createOutputChannel('Tiago Tools');

	customConsole.appendLine('tool started');

	let disposable;

	// ! Flat
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	disposable = vscode.commands.registerCommand('tiagotools.flat', flatCommand);

	context.subscriptions.push(disposable);
	// ! UNFLAT
	disposable = vscode.commands.registerCommand('tiagotools.unflat', unflatCommand);

	context.subscriptions.push(disposable);

	// ! XLSX
	disposable = vscode.commands.registerCommand('tiagotools.xlsx', singleXlslCommand(customConsole));

	context.subscriptions.push(disposable);

	// ! XLSX
	disposable = vscode.commands.registerCommand('tiagotools.xlsx2', multiLocaleXlsxCommand(customConsole));

	context.subscriptions.push(disposable);

	// ! XLSX READ
	disposable = vscode.commands.registerCommand(
		'tiagotools.readXlsltranslation',
		readmultiLocaleXlsxCommand(customConsole)
	);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
