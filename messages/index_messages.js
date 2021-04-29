const locs = {"LS":"loading_screen","TS":"title_screen"};

let est_or = null;

function send (location, message) {
	document.getElementById(location).contentWindow.postMessage(message,"*");
}

function receive (event) {
	if (est_or !== null) {
		if (event.origin !== est_or) {
			return;
		}
	}
	console.log(event.origin, event.data);
	const raw_message = event.data;
	const r = raw_message.slice(raw_message.indexOf("R:")+2,raw_message.indexOf(",M"));
	const o = raw_message.slice(2,raw_message.indexOf(",R"));
	const m = raw_message.slice(raw_message.indexOf("M:")+2);
	console.log(o, r, m);
	if (r === "IN") {
		switch (m) {
			case "resp":
				return;
			case "init":
				if (est_or === null) {
					est_or = event.origin;
				}
				send(locs[o],"O:IN,R:"+o+"M:init");
				return;
			case "lfin":
				if (o === "LS") {
					ls_lfin = true;
					onLoadHandler();
				}
		}
		send(locs[o],"O:IN,R:"+o+",M:resp");
	} else {
		send(locs[r],raw_message);
	}
}

window.addEventListener("message", receive);

window.addEventListener("messageerror",function () {console.error("error receiving message for main screen")})