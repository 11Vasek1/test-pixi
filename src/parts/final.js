import gsap from 'gsap';
import { Assets, Container, Graphics, Sprite } from 'pixi.js';

const container = new Container();

const DURATION = 0.5;

const dimentions = {
	width: 0,
	height: 0,
};

export function generateFinal({ width, height }) {
	dimentions.width = width;
	dimentions.height = height;

	return container;
}

export async function showFinal() {
	const back = addBack();
	animateBack(back);
	const image = await addImage();
	animateImage(image);
}

function addBack() {
	const back = new Graphics();
	back.beginFill(0x000000, 0.4);
	back.drawRect(0, 0, dimentions.width, dimentions.height);
	back.endFill();

	container.addChild(back);

	return back;
}

function animateBack(back) {
	gsap.from(back, {
		alpha: 0,
		duration: DURATION,
	});
}

async function addImage() {
	const texture = await Assets.load('final');
	const sprite = new Sprite(texture);
	sprite.anchor.set(0.5, 0);
	sprite.position.set(dimentions.width / 2, 53);
	container.addChild(sprite);

	return sprite;
}

function animateImage(image) {
	const y = image.position.y;

	gsap.set(image, {
		alpha: 0,
	});

	gsap.to(image, {
		alpha: 1,
		delay: DURATION,
		duration: DURATION,
	});

	gsap.from(image.position, {
		y: y + 50,
		delay: DURATION,
		duration: DURATION,
	});
}
