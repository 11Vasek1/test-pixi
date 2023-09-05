const glossary = {};

function subscribe(eventName, callback) {
	const eventCallbacks = glossary[eventName];

	if (!eventCallbacks) {
		glossary[eventName] = [];
	}

	glossary[eventName].push(callback);
}

function raiseEvent(eventName, data) {
	const eventCallbacks = glossary[eventName];

	if (!eventCallbacks) {
		return;
	}

	eventCallbacks.forEach((callback) => callback(data));
}

export const eventBus = {
	subscribe,
	raiseEvent,
};
