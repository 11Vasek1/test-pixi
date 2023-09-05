import { Application } from 'pixi.js';
import { canvas } from './canvas';

export const app = new Application({
	view: canvas,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	antiAliasing: true,
	resizeTo: window,
	backgroundColor: 0x000000,
});
