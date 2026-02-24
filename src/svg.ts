import * as vscode from 'vscode';

export interface SvgTheme {
	bg: string;
	fg: string;
}

export const darkActiveTheme: SvgTheme = { bg: '#FFCA28', fg: '#1a1a1a' };
export const lightActiveTheme: SvgTheme = { bg: '#1565C0', fg: '#FFFFFF' };
export const darkDimmedTheme: SvgTheme = { bg: '#555555', fg: '#999999' };
export const lightDimmedTheme: SvgTheme = { bg: '#CCCCCC', fg: '#666666' };

const svgCache = new Map<string, vscode.Uri>();

export function getCodeUri(code: string, fontSize: number, theme: SvgTheme): vscode.Uri {
	const key = `${code}:${fontSize}:${theme.bg}`;
	let uri = svgCache.get(key);
	if (!uri) {
		uri = buildUri(code, fontSize, theme);
		svgCache.set(key, uri);
	}
	return uri;
}

function buildUri(code: string, fontSize: number, theme: SvgTheme): vscode.Uri {
	const w = fontSize + 6;
	const h = fontSize + 2;
	const textSize = Math.max(fontSize - 2, 8);

	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
		`<rect width="${w}" height="${h}" rx="2" fill="${theme.bg}"/>` +
		`<text x="${w / 2}" y="${Math.ceil(h / 2)}" ` +
		`font-family="monospace" font-size="${textSize}" font-weight="bold" ` +
		`fill="${theme.fg}" text-anchor="middle" dominant-baseline="central">${code}</text>` +
		`</svg>`;

	return vscode.Uri.parse('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
}

export function clearSvgCache(): void {
	svgCache.clear();
}
