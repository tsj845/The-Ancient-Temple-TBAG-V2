// same as loading_messages.js but without the code to receive the index for the picked background as the title screen is the one that generates it
let est_or = null;

function send (message) {
	window.parent.postMessage(message, "*");
}

function receive (event) {
	if (est_or !== null) {
		if (event.origin !== est_or) {
			return;
		}
	}
	console.log(event.origin, event.data);
	const raw_message = event.data;
	const m = raw_message.slice(raw_message.indexOf("M:")+2);
	switch (m) {
		case "resp":
			return;
		case "init":
			if (est_or === null) {
				est_or = event.origin;
			}
			return;
		// starts the music
		case "start_music":
			start_music();
		default:
			return;
	}
}

// sets up the event listeners
window.addEventListener("message", receive);

window.addEventListener("messageerror",function () {console.error("error receiving message for title screen")})