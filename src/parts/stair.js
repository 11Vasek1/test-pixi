import { Sprite, Container, Assets } from 'pixi.js';
import gsap from 'gsap';
import { eventBus } from '../eventBus';
import { EVENT_TYPES } from '../constants';

const newStairs = [null, null, null];

const positionOrigin = [1719 / 2171, 497 / 2493];

const stairsContainer = new Container();

export function generateStairs(texture) {
	const mainContainer = new Container();

	const oldStair = new Sprite(texture);

	stairsContainer.x = -positionOrigin[0] * oldStair.width;
	stairsContainer.y = -positionOrigin[1] * oldStair.height;

	stairsContainer.addChild(oldStair);

	mainContainer.addChild(stairsContainer);

	return mainContainer;
}

export async function changeStairs({ number }) {
	removeChild();
	const stair = await addNewStair(number);
	animateStair(stair);
}

function removeChild() {
	stairsContainer.removeChildren();
}
async function addNewStair(index) {
	let stair = newStairs[index];

	if (stair === null) {
		const texture = await Assets.load(`stair${index + 1}`);

		newStairs[index] = new Sprite(texture);

		stair = newStairs[index];
	}

	stairsContainer.addChild(stair);

	return stair;
}
function animateStair(stair) {
	gsap.fromTo(
		stair,
		{
			y: -30,
		},
		{
			y: 0,
			duration: 0.5,
			ease: 'power2.in',
			onComplete: () => {
				eventBus.raiseEvent(EVENT_TYPES.STAIR_FALL);
			},
		}
	);

	gsap.fromTo(
		stair,
		{
			alpha: 0,
		},
		{
			alpha: 1,
			duration: 0.5,
			ease: 'power3.out',
		}
	);
}
