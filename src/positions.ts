import * as vscode from 'vscode';

export interface WordPosition {
	line: number;
	character: number;
}

export function findWordPositions(editor: vscode.TextEditor): WordPosition[] {
	const positions: WordPosition[] = [];

	for (const range of editor.visibleRanges) {
		for (let lineNum = range.start.line; lineNum <= range.end.line; lineNum++) {
			const line = editor.document.lineAt(lineNum);
			for (const match of line.text.matchAll(/[a-zA-Z_\u00C0-\u017F][a-zA-Z0-9_\u00C0-\u017F]*/g)) {
				positions.push({ line: lineNum, character: match.index });
			}
		}
	}

	return positions;
}
