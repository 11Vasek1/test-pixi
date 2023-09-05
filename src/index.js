import { eventBus } from './eventBus.js';
import { showHammer, hideHammer, moveHammer } from './parts/hammer.js';
import { EVENT_TYPES, PHASE_TYPES } from './constants.js';
import { changeStairs } from './parts/stair.js';
import { Assets, Container, Graphics } from 'pixi.js';
import { app } from './app.js';
import { showMenu, changeActiveButton } from './parts/menu.js';
import { generateFinal, showFinal } from './parts/final.js';
import { generateButton } from './parts/button.js';
import { state } from './state.js';
import gsap from 'gsap';
import { generateLogo } from './parts/decor.js';
import { blurifyBackStage, generateBackStage } from './parts/backStage.js';
import { jumpPlant } from './parts/plant.js';
import { images, backgroundImages } from './images.js';

const DURATION_HAMMER_APPEAR = 3000;

loadImages();
createEventBus();
addMouseInteraction();

async function loadImages() {
	addImagesFromGlossary(images);
	addImagesFromGlossary(backgroundImages);

	Assets.backgroundLoad(Object.keys(backgroundImages));

	const textures = await Assets.load(Object.keys(images));
	eventBus.raiseEvent(EVENT_TYPES.START, { textures });
}

function addImagesFromGlossary(images) {
	for (const key in images) {
		if (Object.hasOwnProperty.call(images, key)) {
			const imgSrc = images[key];
			Assets.add(key, imgSrc);
		}
	}
}

function createEventBus() {
	eventBus.subscribe(EVENT_TYPES.START, showStage);

	eventBus.subscribe(EVENT_TYPES.SHOW_HAMMER, showHammer);

	eventBus.subscribe(EVENT_TYPES.HAMMER_CLICK, hideHammer);
	eventBus.subscribe(EVENT_TYPES.HAMMER_CLICK, showMenu);

	eventBus.subscribe(EVENT_TYPES.STAIRS_CLICK, changeActiveButton);
	eventBus.subscribe(EVENT_TYPES.STAIRS_CLICK, changeStairs);

	eventBus.subscribe(EVENT_TYPES.STAIR_FALL, jumpPlant);

	eventBus.subscribe(EVENT_TYPES.OK_BUTTON_CLICK, showFinal);
	eventBus.subscribe(EVENT_TYPES.OK_BUTTON_CLICK, () => {
		state.phase = PHASE_TYPES.FINISH;
	});
	eventBus.subscribe(EVENT_TYPES.OK_BUTTON_CLICK, blurifyBackStage);
}

async function showStage({ textures }) {
	constructStage(textures);
	await animateStage();
	setTimeout(() => {
		eventBus.raiseEvent(EVENT_TYPES.SHOW_HAMMER);
	}, DURATION_HAMMER_APPEAR);
}

function constructStage(textures) {
	const backStage = generateBackStage(textures);

	const mainContainer = new Container();

	mainContainer.addChild(backStage);

	const final = generateFinal(textures.back);
	const button = generateButton(textures.button);
	const logo = generateLogo(textures);

	button.position.set(textures.back.width / 2, textures.back.height - 80);
	logo.position.set(10, 10);

	mainContainer.addChild(final, button, logo);

	app.stage.addChild(mainContainer);

	const scale = scaleStage(mainContainer, textures.back);
	hideOverflow(mainContainer, textures.back, scale);
}

function hideOverflow(mainContainer, { width, height }, scale) {
	const mask = new Graphics();
	mask.beginFill(0x000000, 1);
	mask.drawRect(
		mainContainer.x,
		mainContainer.y,
		width * scale,
		height * scale
	);
	mask.endFill();
	mainContainer.mask = mask;
}

function scaleStage(cont, { width, height }) {
	const scale = Math.min(
		app.screen.width / width,
		app.screen.height / height
	);
	cont.scale.set(scale);

	const x = (app.screen.width - width * scale) / 2;
	const y = (app.screen.height - height * scale) / 2;

	cont.position.set(x, y);

	return scale;
}

async function animateStage() {
	gsap.from(app.stage, {
		alpha: 0,
		duration: 0.5,
		ease: 'power1.inOut',
	});
}

function addMouseInteraction() {
	const mousePos = {
		x: 0,
		y: 0,
	};

	app.stage.interactive = true;
	app.stage.on('pointermove', (event) => {
		mousePos.x = event.globalX;
		mousePos.y = event.globalY;
	});
	app.ticker.add((delta) => {
		moveHammer(mousePos, delta);
	});
}
