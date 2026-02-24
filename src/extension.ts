import * as vscode from 'vscode';
import { JumpMode } from './jump-mode';
import { scrollCurrentLine } from './scroll';

export function activate(context: vscode.ExtensionContext) {
	const jumpMode = new JumpMode();

	context.subscriptions.push(
		jumpMode,
		vscode.commands.registerCommand('navz.jump', () => jumpMode.activate()),
		vscode.commands.registerCommand('navz.jumpSelect', () => jumpMode.activate(true)),
		vscode.commands.registerCommand('navz.escape', () => jumpMode.exit()),
		vscode.commands.registerCommand('navz.scrollLineToCenter', () => scrollCurrentLine(vscode.TextEditorRevealType.InCenter)),
		vscode.commands.registerCommand('navz.scrollLineToTop', () => scrollCurrentLine(vscode.TextEditorRevealType.AtTop)),
	);
}

export function deactivate() {}
