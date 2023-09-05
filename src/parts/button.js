import gsap from 'gsap';
import { Sprite } from 'pixi.js';

const SCALE = 1.1;
const DURATION = 1;

export function generateButton(texture) {
	const button = new Sprite(texture);
	button.anchor.set(0.5, 0.5);

	const tl = gsap.timeline({ repeat: -1, yoyo: true });

	tl.to(button.scale, {
		x: SCALE,
		y: SCALE,

		duration: DURATION,

		ease: 'power1.inOut',
	});

	return button;
}
