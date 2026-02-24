# jumpz

Jump instantly to any visible word in your editor using two keystrokes.

Type a two-letter code to move your cursor directly to any word on screen — no mouse, no repeated arrow keys.

## How it works

1. Press `Alt+Enter` to activate jump mode
2. Two-letter labels appear on every word in the visible area
3. Type the first letter — non-matching labels dim, confirming your input
4. Type the second letter — cursor jumps to that word instantly

Press `Escape` at any point to cancel.

## Commands & keybindings

| Command | Keybinding | Description |
|---------|-----------|-------------|
| `jumpz.jump` | `Alt+Enter` | Jump cursor to a word |
| `jumpz.jumpSelect` | `Alt+Shift+Enter` | Select text from cursor to a word |
| `jumpz.escape` | `Escape` | Exit jump mode |

All keybindings only activate when the editor is focused and jump mode is (or isn't) active — they won't interfere with normal editing.

## Select mode

`Alt+Shift+Enter` works the same as jump, but extends the selection from your current cursor position to the target word. If you already have a selection, the existing anchor is preserved and only the active end moves.

## Known limitations

- Up to 676 words can be labeled at once (26×26 codes: `aa`–`zz`). On very long lines or large viewports this limit may be reached.
- Conflicts with extensions that also override the `type` command (e.g. some Vim emulators). jumpz will show a warning and exit gracefully if this happens.

## Release notes

### 0.0.1

Initial release.
