import * as vscode from 'vscode';

export function scrollCurrentLine(revealType: vscode.TextEditorRevealType) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) { return; }
	editor.revealRange(editor.selection, revealType);
}
