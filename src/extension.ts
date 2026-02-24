import * as vscode from 'vscode';
import { JumpMode } from './jump-mode';

export function activate(context: vscode.ExtensionContext) {
	const jumpMode = new JumpMode();

	context.subscriptions.push(
		jumpMode,
		vscode.commands.registerCommand('jumpz.jump', () => jumpMode.activate()),
		vscode.commands.registerCommand('jumpz.jumpSelect', () => jumpMode.activate(true)),
		vscode.commands.registerCommand('jumpz.escape', () => jumpMode.exit())
	);
}

export function deactivate() {}
