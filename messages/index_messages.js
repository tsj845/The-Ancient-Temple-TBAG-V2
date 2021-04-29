const locs = {"LS":"loading_screen","TS":"title_screen"};

function send (location, message) {
	document.getElementById(location).contentWindow.postMessage(message,"*");
}

function receive (event) {
	console.log(event.origin, event.data);
	const raw_message = event.data;
	const r = raw_message.slice(raw_message.indexOf("R:")+2,raw_message.indexOf(",M"));
	const o = raw_message.slice(2,raw_message.indexOf(",R"));
	const m = raw_message.slice(raw_message.indexOf("M:")+2);
	console.log(o, r, m);
	if (r === "IN") {
		if (m === "resp") {
			return;
		}
		send(locs[o],"O:IN,R:"+o+",M:resp");
	} else {
		send(locs[r],raw_message);
	}
}

window.addEventListener("message", receive);

window.addEventListener("messageerror",function () {console.error("error receiving message for main screen")})