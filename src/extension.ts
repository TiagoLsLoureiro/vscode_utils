// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { flatten, unflatten } from './flatTools';

const replaceText = (newContent: string) => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	const selection = editor.selection;
	if (selection && !selection.isEmpty) {
		const selectionRange = new vscode.Range(
			selection.start.line,
			selection.start.character,
			selection.end.line,
			selection.end.character
		);
		const highlighted = editor.document.getText(selectionRange);

		editor.edit((builder) => {
			builder.replace(selectionRange, newContent);
		});
	}
};
const getSelectionText = (): string => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return '';
	}

	const selection = editor.selection;
	if (selection && !selection.isEmpty) {
		const selectionRange = new vscode.Range(
			selection.start.line,
			selection.start.character,
			selection.end.line,
			selection.end.character
		);
		const highlighted = editor.document.getText(selectionRange);

		return highlighted;
	}
	return '';
};

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
	disposable = vscode.commands.registerCommand('tiagotools.flat', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		const selectedText = getSelectionText();

		try {
			const objectResult = JSON.parse(selectedText);

			replaceText(JSON.stringify(flatten(objectResult), null, 2));

			vscode.window.showInformationMessage('success');
		} catch (error) {
			vscode.window.showErrorMessage(JSON.stringify(error));
		}
	});

	context.subscriptions.push(disposable);
	// ! UNFLAT
	disposable = vscode.commands.registerCommand('tiagotools.unflat', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		const selectedText = getSelectionText();

		try {
			const objectResult = JSON.parse(selectedText);

			replaceText(JSON.stringify(unflatten(objectResult), null, 2));

			vscode.window.showInformationMessage('success');
		} catch (error) {
			vscode.window.showErrorMessage(JSON.stringify(error));
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
