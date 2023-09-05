import { Sprite, Container, Assets, Graphics } from 'pixi.js';
import gsap from 'gsap';
import { EVENT_TYPES } from '../constants';
import { eventBus } from '../eventBus';

const container = new Container();
let sprite;
let marker;

const hammerState = {
	angle: 0,
	velocity: 0,
};

const kMouse = 5000; //mouse
const kSpring = 3; //spring
const kViscosity = 0.3; //velocity

const kTime = 50;

const DUR = 0.2;
export function generateHammer() {
	return container;
}

export async function showHammer() {
	await addTexture();
	addMarker();
	animate();
	addHandler();
}

function addMarker() {
	marker = new Graphics();
	marker.beginFill(0xff0000, 0);
	marker.drawCircle(0, 0, 5);
	marker.endFill();
	marker.position.y = -100;

	container.addChild(marker);
}

export function hideHammer() {
	gsap.to(container.scale, {
		x: 0,
		y: 0,
		duration: DUR,
		onComplete: container.removeChildren.bind(container),
	});
}

export function moveHammer(mousePos, delta) {
	if (!!sprite) {
		const hammerPos = getHammerPos();
		recalculateHammerState(hammerPos, mousePos, delta);
		changeAngle();
	}
}

function getHammerPos() {
	return marker.getGlobalPosition();
}

function recalculateHammerState(hammerPos, mousePos, delta) {
	const dx = hammerPos.x - mousePos.x;
	const dy = hammerPos.y - mousePos.y;

	const realDistance = Math.sqrt(
		Math.pow(hammerPos.x - mousePos.x, 2) +
			Math.pow(hammerPos.y - mousePos.y, 2)
	);

	const MIN_DISTANCE = 50;

	const distance = realDistance < MIN_DISTANCE ? MIN_DISTANCE : realDistance;

	const force = calculateMouseForce(dx, dy, distance);

	const acceleration =
		force - kSpring * hammerState.angle - kViscosity * hammerState.velocity;

	hammerState.velocity =
		hammerState.velocity + (acceleration * delta) / kTime;
	hammerState.angle =
		hammerState.angle + (hammerState.velocity * delta) / kTime;
}

function calculateMouseForce(dx, dy, distance) {
	if (distance > 300) {
		return 0;
	}

	const c = Math.cos(hammerState.angle);
	const s = Math.sin(hammerState.angle);
	const matrix = [c, s, s, c];

	const dotRotated = multiplyMatrixVector(matrix, [dx, dy]);

	const direction = dotRotated[1] / Math.abs(dotRotated[1]);

	const force =
		(direction *
			(kMouse * Math.sin(Math.atan(dotRotated[0] / dotRotated[1])))) /
		Math.pow(distance, 2);

	return force;
}

function changeAngle() {
	container.rotation = -hammerState.angle;
}

export function handleMouseMove() {}

async function addTexture() {
	const texture = await Assets.load('hammer');
	sprite = new Sprite(texture);

	sprite.anchor.set(0.5, 1);

	container.addChild(sprite);
}

function animate() {
	gsap.fromTo(
		sprite,
		{
			alpha: 0,
		},
		{
			alpha: 1,
			duration: 0.5,
		}
	);
}

function addHandler() {
	sprite.interactive = true;
	sprite.on('pointertap', (event) => {
		eventBus.raiseEvent(EVENT_TYPES.HAMMER_CLICK);
	});
}

function multiplyMatrixVector(m, v) {
	return [v[0] * m[0] - v[1] * m[1], v[0] * m[2] + v[1] * m[3]];
}
