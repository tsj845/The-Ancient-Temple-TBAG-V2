// most of this is the same as with the index_messages.js
let est_or = null;

function send (message) {
	window.parent.postMessage(message, "*");
}

// follows same basic format as with the indes_messages.js but without forwarding capabilities
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
		// used to sync background images for the title and loading screens
		default:
			if (m[0] === "!") {
				eval(m.slice(1));
			} else {
				spec_mess(m);
			}
	}
}

// sets up the event listeners
window.addEventListener("message", receive);

window.addEventListener("messageerror",function () {console.error("error receiving message for loading screen")})