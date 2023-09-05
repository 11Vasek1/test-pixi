import { Sprite } from 'pixi.js';

export function generateDecor({ plantBack, book, globe, table, sofa, austin }) {
	const decor = {
		plantBack: new Sprite(plantBack),
		plantBack2: new Sprite(plantBack),
		book: new Sprite(book),
		globe: new Sprite(globe),
		table: new Sprite(table),
		sofa: new Sprite(sofa),
		austin: new Sprite(austin),
	};

	return decor;
}

export function generateLogo({ logo }) {
	return new Sprite(logo);
}
