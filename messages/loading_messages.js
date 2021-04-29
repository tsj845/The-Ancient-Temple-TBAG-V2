function send (message) {
	window.parent.postMessage(message, "*");
}

function receive (event) {
	console.log(event.origin, event.data);
	const raw_message = event.data;
	const m = raw_message.slice(raw_message.indexOf("M:")+2);
	switch (m) {
		case "resp":
			return;
		default:
			return;
	}
}

window.addEventListener("message", receive);

window.addEventListener("messageerror",function () {console.error("error receiving message for loading screen")})