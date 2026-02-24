import { WordPosition } from './positions';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const MAX_CODES = 676; // 26 × 26

export type CodeMap = Map<string, WordPosition>;

export function assignCodes(positions: WordPosition[]): CodeMap {
	const map: CodeMap = new Map();
	const limit = Math.min(positions.length, MAX_CODES);

	for (let i = 0; i < limit; i++) {
		const first = LETTERS[Math.floor(i / 26)];
		const second = LETTERS[i % 26];
		map.set(first + second, positions[i]);
	}

	return map;
}
