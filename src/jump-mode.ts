import * as vscode from "vscode";
import { assignCodes } from "./codes";
import {
  DecorationState,
  applyDecorations,
  clearDecorations,
  filterDecorations,
} from "./decorations";
import { findWordPositions } from "./positions";

const LETTER_RE = /^[a-z]$/;

const enum State {
  Inactive,
  Showing,
  FirstTyped,
}

interface ActiveJump {
  editor: vscode.TextEditor;
  decorState: DecorationState;
  firstKey: string;
  selectAnchor: vscode.Position | null;
}

export class JumpMode implements vscode.Disposable {
  private state = State.Inactive;
  private activeJump: ActiveJump | null = null;
  private typeDisposable: vscode.Disposable | null = null;

  activate(select = false): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    if (this.state !== State.Inactive) {
      this.exit();
    }

    const positions = findWordPositions(editor);
    if (positions.length === 0) {
      return;
    }

    const codeMap = assignCodes(positions);
    const decorState = applyDecorations(editor, codeMap);
    const selectAnchor = select ? editor.selection.anchor : null;

    this.activeJump = { editor, decorState, firstKey: "", selectAnchor };
    this.state = State.Showing;
    vscode.commands.executeCommand("setContext", "navz.jumpMode", true);

    try {
      this.typeDisposable = vscode.commands.registerCommand(
        "type",
        (args: { text: string }) => this.handleType(args),
      );
    } catch {
      vscode.window.showWarningMessage(
        'navz: Cannot intercept keyboard — another extension may conflict with the "type" command.',
      );
      this.exit();
    }
  }

  exit(): void {
    if (this.activeJump) {
      clearDecorations(this.activeJump.editor, this.activeJump.decorState);
      this.activeJump = null;
    }

    this.typeDisposable?.dispose();
    this.typeDisposable = null;

    this.state = State.Inactive;
    vscode.commands.executeCommand("setContext", "navz.jumpMode", false);
  }

  dispose(): void {
    this.exit();
  }

  private handleType(args: { text: string }): void {
    if (this.state === State.Inactive || !this.activeJump) {
      return;
    }

    const key = args.text.toLowerCase();

    if (this.state === State.Showing) {
      if (!LETTER_RE.test(key)) {
        this.exit();
        return;
      }
      this.activeJump.firstKey = key;
      this.state = State.FirstTyped;
      filterDecorations(
        this.activeJump.editor,
        this.activeJump.decorState,
        key,
      );
      return;
    }

    if (this.state === State.FirstTyped) {
      if (!LETTER_RE.test(key)) {
        this.exit();
        return;
      }
      const code = this.activeJump.firstKey + key;
      const position = this.activeJump.decorState.codeMap.get(code);
      if (position) {
        const pos = new vscode.Position(position.line, position.character);
        const anchor = this.activeJump.selectAnchor ?? pos;
        this.activeJump.editor.selection = new vscode.Selection(anchor, pos);
        this.activeJump.editor.revealRange(
          new vscode.Range(pos, pos),
          vscode.TextEditorRevealType.InCenterIfOutsideViewport,
        );
      }
      this.exit();
    }
  }
}
