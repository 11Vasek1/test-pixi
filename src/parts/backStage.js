import { generateHammer } from './hammer.js';
import { generateStairs } from './stair.js';
import { Container, filters, Sprite } from 'pixi.js';
import { generateMenu } from './menu.js';
import { generateDecor } from './decor.js';
import { generatePlant } from './plant.js';

const backStage = new Container();

export function blurifyBackStage() {
	const blur = new filters.BlurFilter(2);
	backStage.filters = [blur];
}

export function generateBackStage(textures) {
	const back = new Sprite(textures.back);

	backStage.addChild(back);

	const decor = generateDecor(textures);

	decor.book.position.set(800, 0);
	decor.sofa.position.set(100, 300);
	decor.globe.position.set(100, 100);
	decor.plantBack.position.set(1150, 160);
	decor.plantBack2.position.set(300, 0);
	decor.table.position.set(250, 180);
	decor.austin.position.set(600, 100);

	backStage.addChild(...Object.values(decor));

	const stairsContainer = generateStairs(textures.oldStair);
	const plant = generatePlant(textures.leafs, textures.pot);
	const hammer = generateHammer();
	const menu = generateMenu();

	stairsContainer.position.set(1338, 148);
	plant.position.set(1150, 400);
	hammer.position.set(1150, 450);
	menu.position.set(1150, 450);

	backStage.addChild(stairsContainer, plant, hammer, menu);

	return backStage;
}
