import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { flatten } from '../flatTools';
import { folderUri, getDocumentWorkspaceFolder, nameWithUnderscore } from '../helper';
import { FileType } from 'vscode';

export const multiLocaleXlsxCommand = (customConsole: vscode.OutputChannel) => async () => {
	const projectRootFolder = getDocumentWorkspaceFolder() ?? '';
	const appName = projectRootFolder.split('/').pop();

	const projectLocaleFolder = `${projectRootFolder}/public/locales`;

	let parentFolder = vscode.Uri.file(projectLocaleFolder);
	customConsole.appendLine(parentFolder.toString());

	const fileList = await vscode.workspace.fs.readDirectory(parentFolder);

	const workbook = XLSX.utils.book_new();

	for (const [namespace, type] of fileList) {
		if (type === FileType.Directory) {
			customConsole.appendLine(` -> translation Namepsace ${namespace}`);

			const fileList2 = await vscode.workspace.fs.readDirectory(
				vscode.Uri.file(`${projectLocaleFolder}/${namespace}`)
			);

			const nameSpaceTranslationsMap: Record<string, Record<string, string>> = {};

			for (const [fileName, type] of fileList2) {
				const splitted = fileName.split('.');

				if (splitted[2] === 'json') {
					const countryIso = splitted[1];
					const jsonFilePath = path.join(projectLocaleFolder, namespace, fileName);
					customConsole.appendLine(`### ${jsonFilePath}`);
					try {
						const jsonString = fs.readFileSync(jsonFilePath, 'utf8');
						// customConsole.appendLine('---' + JSON.stringify(JSON.parse(data), null, 2));

						const flattned = flatten(JSON.parse(jsonString));
						// customConsole.appendLine('flattned ' + JSON.stringify(flattned, null, 2));

						Object.entries(flattned).forEach(([key, value]: any) => {
							nameSpaceTranslationsMap[key] = { ...nameSpaceTranslationsMap[key], [countryIso]: value };
						});

						// customConsole.appendLine('. .  1 ' + JSON.stringify(resultJson, null, 2));
					} catch (err) {
						customConsole.appendLine('err ' + JSON.stringify(err));
					}
				}
			}

			const worksheetRows: any[] = Object.entries(nameSpaceTranslationsMap).map(([k, v]) => ({ key: k, ...v }));
			const worksheet = XLSX.utils.json_to_sheet(worksheetRows);

			XLSX.utils.book_append_sheet(workbook, worksheet, namespace);
			customConsole.appendLine('- - -> ' + fileList2.map(([a, b]) => a).join(', '));
		}
	}

	// Define the output file name
	const outputFileName = path.join(projectLocaleFolder, `${appName}-translations.xlsx`);

	customConsole.appendLine(projectRootFolder.split('/').pop() + ' == before save ');
	// Save the workbook to a file
	XLSX.writeFile(workbook, outputFileName);
};
