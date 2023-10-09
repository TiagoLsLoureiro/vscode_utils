import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { flatten, unflatten } from './flatTools';

export const replaceText = (newContent: string) => {
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
export const getSelectionText = (): string => {
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

export function getDocumentWorkspaceFolder(): string | undefined {
	const fileName = vscode.window.activeTextEditor?.document.fileName;
	return vscode.workspace.workspaceFolders
		?.map((folder) => folder.uri.fsPath)
		.filter((fsPath) => fileName?.startsWith(fsPath))[0];
}

export function folderUri(uri: vscode.Uri) {
	let uriPath = uri.fsPath;
	return vscode.Uri.file(path.dirname(uriPath));
}

export function nameWithUnderscore(uri: vscode.Uri) {
	let uriPath = uri.fsPath;
	return vscode.Uri.file(path.join(path.dirname(uriPath), '_' + path.basename(uriPath)));
}
