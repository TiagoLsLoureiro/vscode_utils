import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { flatten } from '../flatTools';
import { folderUri, nameWithUnderscore } from '../helper';

export const singleXlslCommand = (customConsole: vscode.OutputChannel) => async () => {
	// The code you place here will be executed every time your command is executed
	// Display a message box to the user

	try {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		let doc = editor.document;
		let docUri = doc.uri;

		let parentFolder = folderUri(docUri);
		let newParent = nameWithUnderscore(parentFolder);

		const resultJson: Record<string, Record<string, string>> = {};

		// {
		// 	key : Record<lang, k>
		// }
		customConsole.appendLine(parentFolder.path);

		const fileList = await vscode.workspace.fs.readDirectory(parentFolder);

		let sheetName: string = '';

		for (const [name, type] of fileList) {
			if (type === vscode.FileType.File) {
				const match = name.split('.');

				const filePath = path.posix.join(parentFolder.path, name);
				const filePathUri = editor.document.uri.with({ path: filePath });

				customConsole.appendLine(' --> ' + name + ' ' + match[1] + ' ' + match[2]);

				sheetName = match[0];
				const countryIso = match[1];

				if (match[2] === 'json') {
					try {
						const jsonString = fs.readFileSync(filePath, 'utf8');
						// customConsole.appendLine('---' + JSON.stringify(JSON.parse(data), null, 4));

						const flattned = flatten(JSON.parse(jsonString));
						// customConsole.appendLine('flattned ' + JSON.stringify(flattned, null, 4));

						Object.entries(flattned).forEach(([key, value]: any) => {
							resultJson[key] = { ...resultJson[key], [countryIso]: value };
						});

						// customConsole.appendLine('. .  1 ' + JSON.stringify(resultJson, null, 4));
					} catch (err) {
						customConsole.appendLine('err ' + JSON.stringify(err));
					}

					vscode.window.showTextDocument(filePathUri, { viewColumn: vscode.ViewColumn.Beside });
				}
			}
		}

		// customConsole.appendLine('. . 2 ' + JSON.stringify(resultJson, null, 4));

		const rows = Object.entries(resultJson).map(([k, v]) => ({ key: k, ...v }));
		customConsole.appendLine(JSON.stringify(rows, null, 4));

		const worksheet = XLSX.utils.json_to_sheet(rows);

		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

		// Define the output file name
		const outputFileName = path.join(parentFolder.path, `${sheetName}.xlsx`);

		// Save the workbook to a file
		XLSX.writeFile(workbook, outputFileName);

		customConsole.appendLine(JSON.stringify(resultJson));

		vscode.workspace.fs
			.readDirectory(newParent)
			.then(([valueN, fileType]) => customConsole.appendLine(` - ${valueN}`));

		customConsole.appendLine(newParent.path);

		vscode.window.showInformationMessage('success');
	} catch (error) {
		vscode.window.showErrorMessage(JSON.stringify(error));
	}
};
