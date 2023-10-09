import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { unflatten } from '../flatTools';

export const readmultiLocaleXlsxCommand = (customConsole: vscode.OutputChannel) => async () => {
	customConsole.appendLine('readmultiLocaleXlsxCommand');
	customConsole.appendLine(`-1- ${JSON.stringify(vscode.window.activeNotebookEditor, null, 3)}`);
	customConsole.appendLine(`--- ${JSON.stringify(vscode.window.tabGroups.activeTabGroup.activeTab?.input, null, 3)}`);

	const tab: vscode.Tab | undefined = vscode.window.tabGroups.activeTabGroup.activeTab;

	customConsole.appendLine('--' + (!tab || tab.input));
	if (!tab || !(tab.input as any)?.uri) {
		customConsole.appendLine('-- exit');
		return;
	}

	const filePath = (tab.input as any).uri.fsPath;

	const workbook2 = XLSX.readFile(filePath);

	const workSheetNames = workbook2.SheetNames;

	customConsole.appendLine(`Table Sheets : ${workbook2.SheetNames.join(', ')}`);
	workSheetNames.forEach((sheetName) => {
		customConsole.appendLine(` === [Table Sheet: ${sheetName}]`);

		const workSheet = workbook2.Sheets[sheetName];

		const rawData = XLSX.utils.sheet_to_json<Record<string, string>>(workSheet);

		// customConsole.appendLine(`${JSON.stringify(rawData)}`);

		const languages = Object.keys(rawData[0]);

		customConsole.appendLine(`KEYS => ${languages}`);

		languages.forEach((lang) => {
			if (lang === 'key') {
				return;
			}

			customConsole.appendLine(`=> ${lang}`);
			customConsole.appendLine(lang);

			const languageObject = rawData.reduce<any>((acc, entries: any) => {
				acc[entries.key] = entries[lang] ?? 'WIP';

				return acc;
			}, {});

			const folderPath = `${path.dirname(filePath)}/${sheetName}`;

			if (!fs.existsSync(folderPath)) {
				fs.mkdirSync(folderPath, { recursive: true });
			}

			fs.writeFileSync(
				`${folderPath}/${sheetName}.${lang}.json`,
				JSON.stringify(unflatten(languageObject), null, '\t')
			);
		});
	});

	customConsole.appendLine('--');
};
