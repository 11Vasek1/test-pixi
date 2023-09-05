import { Container, Sprite } from 'pixi.js';
import { PHASE_TYPES, EVENT_TYPES } from '../constants';
import { eventBus } from '../eventBus';
import { state } from '../state';

export function generateButton(
	stairTexture,
	i,
	buttonBackTexture,
	buttonBackChoosenTexture
) {
	const button = new Container();

	const { buttonBox, width, height } = generateButtonBox(
		stairTexture,
		buttonBackTexture,
		buttonBackChoosenTexture,
		i
	);

	buttonBox.position.set(-width / 2, -height / 2);

	const okButtonContainer = new Container();
	okButtonContainer.position.set(0, height / 2 - 24);
	okButtonContainer.name = 'okButtonContainer';

	button.addChild(buttonBox);
	button.addChild(okButtonContainer);

	return button;
}

function generateButtonBox(
	stairTexture,
	buttonBackTexture,
	buttonBackChoosenTexture,
	i
) {
	const buttonBox = new Container();

	const stair = new Sprite(stairTexture);
	const buttonBack = new Sprite(buttonBackTexture);
	const buttonBackChoosen = new Sprite(buttonBackChoosenTexture);

	const width = buttonBack.width;
	const height = buttonBack.height;

	buttonBackChoosen.scale.set(0);
	buttonBackChoosen.anchor.set(0.5);
	buttonBackChoosen.position.set(width / 2, height / 2);
	buttonBackChoosen.name = 'buttonBackChoosen';

	buttonBox.addChild(buttonBack);
	buttonBox.addChild(buttonBackChoosen);
	buttonBox.addChild(stair);

	buttonBox.interactive = true;

	buttonBox.on('pointertap', (event) => {
		if (
			i != state.oldActiveButtonIndex &&
			state.phase === PHASE_TYPES.START
		) {
			eventBus.raiseEvent(EVENT_TYPES.STAIRS_CLICK, { number: i });
		}
	});

	return { buttonBox, width, height };
}
