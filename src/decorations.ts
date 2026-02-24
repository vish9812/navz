import * as vscode from 'vscode';
import { CodeMap } from './codes';
import {
	SvgTheme,
	darkActiveTheme,
	lightActiveTheme,
	darkDimmedTheme,
	lightDimmedTheme,
	getCodeUri,
} from './svg';

export interface DecorationState {
	decorationType: vscode.TextEditorDecorationType;
	codeMap: CodeMap;
	fontSize: number;
	isDark: boolean;
}

interface Themes {
	active: SvgTheme;
	dimmed: SvgTheme;
}

function getThemes(isDark: boolean): Themes {
	return isDark
		? { active: darkActiveTheme, dimmed: darkDimmedTheme }
		: { active: lightActiveTheme, dimmed: lightDimmedTheme };
}

function buildDecorationOptions(
	codeMap: CodeMap,
	fontSize: number,
	theme: SvgTheme,
	filterFirstKey?: string
): vscode.DecorationOptions[] {
	const iconWidth = fontSize + 6;
	const iconHeight = fontSize + 2;
	const margin = `0px 0px 0px -${iconWidth - 2}px`;
	const options: vscode.DecorationOptions[] = [];

	for (const [code, pos] of codeMap) {
		if (filterFirstKey !== undefined && !code.startsWith(filterFirstKey)) {
			continue;
		}
		const svgUri = getCodeUri(code, fontSize, theme);
		options.push({
			range: new vscode.Range(pos.line, pos.character, pos.line, pos.character),
			renderOptions: {
				after: {
					contentIconPath: svgUri,
					margin,
					width: `${iconWidth}px`,
					height: `${iconHeight}px`,
				},
			},
		});
	}

	return options;
}

export function applyDecorations(editor: vscode.TextEditor, codeMap: CodeMap): DecorationState {
	const isDark = vscode.window.activeColorTheme.kind !== vscode.ColorThemeKind.Light;
	const fontSize = Math.round(
		vscode.workspace.getConfiguration('editor').get<number>('fontSize') ?? 14
	);

	const decorationType = vscode.window.createTextEditorDecorationType({
		rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
	});

	const { active } = getThemes(isDark);
	const options = buildDecorationOptions(codeMap, fontSize, active);
	editor.setDecorations(decorationType, options);

	return { decorationType, codeMap, fontSize, isDark };
}

export function filterDecorations(
	editor: vscode.TextEditor,
	state: DecorationState,
	firstKey: string
): void {
	const { active, dimmed } = getThemes(state.isDark);
	const { codeMap, fontSize, decorationType } = state;

	const iconWidth = fontSize + 6;
	const iconHeight = fontSize + 2;
	const margin = `0px 0px 0px -${iconWidth - 2}px`;

	const options: vscode.DecorationOptions[] = [];

	for (const [code, pos] of codeMap) {
		const theme = code.startsWith(firstKey) ? active : dimmed;
		const svgUri = getCodeUri(code, fontSize, theme);
		options.push({
			range: new vscode.Range(pos.line, pos.character, pos.line, pos.character),
			renderOptions: {
				after: {
					contentIconPath: svgUri,
					margin,
					width: `${iconWidth}px`,
					height: `${iconHeight}px`,
				},
			},
		});
	}

	editor.setDecorations(decorationType, options);
}

export function clearDecorations(editor: vscode.TextEditor, state: DecorationState): void {
	editor.setDecorations(state.decorationType, []);
	state.decorationType.dispose();
}
