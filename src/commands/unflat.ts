import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { flatten, unflatten } from '../flatTools';
import { getSelectionText, replaceText } from '../helper';

export const unflatCommand =  async () => {
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
}