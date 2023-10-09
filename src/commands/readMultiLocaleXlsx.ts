import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { flatten } from '../flatTools';
import { folderUri, getDocumentWorkspaceFolder, nameWithUnderscore } from '../helper';
import { FileType } from 'vscode';

export const readmultiLocaleXlsxCommand = (customConsole: vscode.OutputChannel) => async () => {
	customConsole.appendLine('readmultiLocaleXlsxCommand');
	customConsole.appendLine(`-1- ${JSON.stringify(vscode.window.activeNotebookEditor, null, 3)}`);
	customConsole.appendLine(`--- ${JSON.stringify(vscode.window.tabGroups.activeTabGroup.activeTab?.input, null, 3)}`);

	customConsole.appendLine(`-3- ${vscode.window.visibleTextEditors}`);

	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	let doc = editor.document;
	let docUri = doc.uri;
	customConsole.appendLine(` doc ${docUri.path}`);
	const workbook = XLSX.readFile(docUri.path);

	customConsole.appendLine(`${workbook.SheetNames.join('.')}`);
};
