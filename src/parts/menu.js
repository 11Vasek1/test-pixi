import gsap from 'gsap';
import { Assets, Container, Sprite } from 'pixi.js';
import { EVENT_TYPES, PHASE_TYPES } from '../constants';
import { eventBus } from '../eventBus';
import { state } from '../state';
import { generateButton } from './stairButton';

const container = new Container();
let buttons = [];

let okButton;

const DUR = 0.05;
const DUR_OK_SHOW = 0.25;
const SCALE = 0.97;

const RADIUS = 350;
const DELTA_ANGLE = 30;
const START_ANGLE = 2 * DELTA_ANGLE;

export function generateMenu() {
	return container;
}

export async function showMenu() {
	await generateButtons();
	animateMenuAppear();
}

async function generateButtons() {
	const assets = await Assets.load([
		'buttonIcon1',
		'buttonIcon2',
		'buttonIcon3',
		'buttonBack',
		'buttonBackChoosen',
	]);
	buttons = [assets.buttonIcon1, assets.buttonIcon2, assets.buttonIcon3].map(
		(stair, i) => {
			const button = generateButton(
				stair,
				i,
				assets.buttonBack,
				assets.buttonBackChoosen
			);

			const angle = (Math.PI * (START_ANGLE - i * DELTA_ANGLE)) / 180;

			const y = -RADIUS * Math.cos(angle);
			const x = -RADIUS * Math.sin(angle);

			button.position.set(x, y);

			return button;
		}
	);

	buttons.forEach((button) => container.addChild(button));
}

function animateMenuAppear() {
	const tl = gsap.timeline();

	const DELAY = 0.1;
	const DUR = 0.35;
	const ease = 'back.out(2)';

	buttons.forEach((button, i) => {
		tl.from(
			button.scale,
			{
				x: 0,
				y: 0,
				duration: DUR,
				ease,
			},
			`${DELAY * i}`
		);

		tl.from(
			button.position,
			{
				x: 0,
				y: 0,
				duration: DUR,
				ease,
			},
			'<'
		);
	});
}

export function changeActiveButton({ number }) {
	animateActiveButton(number);
	if (state.oldActiveButtonIndex !== null) {
		animateOldActiveButton();
	}
	changeOkPosition(number);
	state.oldActiveButtonIndex = number;
}

function animateActiveButton(number) {
	const button = buttons[number];

	const activeBackground = button.getChildByName('buttonBackChoosen', true);

	const tl = gsap.timeline();
	tl.to(button.scale, {
		x: SCALE,
		y: SCALE,
		duration: DUR,
	});

	tl.to(
		button.scale,
		{
			x: 1,
			y: 1,
			duration: DUR,
		},
		`+=${DUR}`
	);

	tl.fromTo(
		activeBackground.scale,
		{ x: 0, y: 0 },
		{ x: 1, y: 1, duration: DUR },
		2 * DUR
	);
}

function animateOldActiveButton() {
	const button = buttons[state.oldActiveButtonIndex];
	const activeBackground = button.getChildByName('buttonBackChoosen', true);

	gsap.fromTo(
		activeBackground.scale,
		{ x: 1, y: 1 },
		{ x: 0, y: 0, duration: DUR, ease: 'circ.in' }
	);
}

async function changeOkPosition(number) {
	if (!okButton) {
		await generateOkButton();
	} else {
		removeOkButton();
	}
	setTimeout(() => {
		addOkButton(number);
	}, 2 * DUR * 1000);
}

async function generateOkButton() {
	const button = await Assets.load('okButton');

	okButton = new Sprite(button);

	okButton.anchor.set(0.5, 0);

	okButton.interactive = true;
	okButton.on('pointertap', () => {
		if (state.phase === PHASE_TYPES.START) {
			eventBus.raiseEvent(EVENT_TYPES.OK_BUTTON_CLICK);
		}
	});
}

function removeOkButton() {
	const oldButton = buttons[state.oldActiveButtonIndex];

	const okButtonContainer = oldButton.getChildByName('okButtonContainer');

	gsap.fromTo(
		okButtonContainer.scale,
		{
			x: 1,
			y: 1,
		},
		{
			x: 0,
			y: 0,
			duration: 2 * DUR,
			ease: 'circ.in',
			onComplete:
				okButtonContainer.removeChildren.bind(okButtonContainer),
		}
	);
}

function addOkButton(number) {
	const button = buttons[number];

	const okButtonContainer = button.getChildByName('okButtonContainer');
	okButtonContainer.addChild(okButton);

	gsap.fromTo(
		okButtonContainer.scale,
		{
			x: 0,
			y: 0,
		},
		{
			x: 1,
			y: 1,
			duration: DUR_OK_SHOW,
		}
	);
}
