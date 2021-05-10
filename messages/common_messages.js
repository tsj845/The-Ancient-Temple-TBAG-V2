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
			if (m[0] === "#") {
				const elem = document.getElementById(m.slice(1,m.indexOf("?")))
				const s = m.slice(m.indexOf("?")+1);
				const sel = s.slice(0,s.indexOf("="));
				const val = s.slice(s.indexOf("=")+1);
				console.log(sel, val);
				if (sel === "src") {
					elem.src = val;
				} else if (sel === "text") {
					elem.textContent = val;
				} else if (sel === "html_attr") {
					const attr = val.slice(0,val.indexOf(":="));
					const av = val.slice(val.indexOf(":=")+2);
					elem[attr] = av;
					console.log(attr, av);
				}
			}else if (m[0] === "!") {
				eval(m.slice(1));
			} else {
				spec_mess(m);
			}
	}
}

// sets up the event listeners
window.addEventListener("message", receive);

window.addEventListener("messageerror",function () {console.error("error receiving message for loading screen")})