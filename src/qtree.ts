import { Coords } from './tile';
import { seamask } from './defaults/seamask';

type QTreeN = QTree | null;
type QTSub = [QTreeN, QTreeN, QTreeN, QTreeN] | null;
interface QTree {
	sub: QTSub;
}

const fullSimbol = 'A'.charCodeAt(0);
const qtseamask = QTFromString(seamask, { pos: 0 });
const qtreedepth = Depth(qtseamask);
console.log(qtreedepth);

function QTFromString(s: string, o: { pos: number }): QTree {
	const code = s.charCodeAt(o.pos) - fullSimbol;
	o.pos++;
	const sub1 = code & 1 ? QTFromString(s, o) : null;
	const sub2 = code & 2 ? QTFromString(s, o) : null;
	const sub4 = code & 4 ? QTFromString(s, o) : null;
	const sub8 = code & 8 ? QTFromString(s, o) : null;
	const sub: QTSub = sub1 || sub2 || sub4 || sub8 ? [sub1, sub2, sub4, sub8] : null;
	return <QTree>{ sub };
}

function Depth(tree: QTreeN): number {
	let d = 0;
	if (tree?.sub) {
		for (let i = 0; i < 4; i++) {
			if (tree.sub[i] !== null) {
				const d1 = Depth(tree.sub[i]) + 1;
				if (d < d1) {
					d = d1;
				}
			}
		}
	}

	return d;
}

export enum TileType {
	Land = 'land',
	Mixed = 'mixed',
	Sea = 'sea',
}

export function QTreeCheckCoord(coord: Coords): TileType {
	let c = { ...coord };
	let deepest = false;
	if (qtreedepth <= coord.z) {
		deepest = true;
		const d = coord.z - qtreedepth;
		c = { x: coord.x >> d, y: coord.y >> d, z: qtreedepth };
	}

	return qTreeCheckCoord(qtseamask, c, deepest);
}

function qTreeCheckCoord(qt: QTreeN, c: Coords, deepest: boolean): TileType {
	if (qt === null) return TileType.Land;
	if (deepest && c.z === 0) return TileType.Mixed; // at the deepest tree level can be only mixed
	if (qt.sub === null) return TileType.Sea;
	if (c.z === 0) return TileType.Mixed;

	c.z--;
	const subx = (c.x >> c.z) & 1; // cut the coord's bit at level subz
	const suby = (c.y >> c.z) & 1;
	const ind = (suby << 1) | subx;
	return qTreeCheckCoord(qt.sub[ind], c, deepest);
}
