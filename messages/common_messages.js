// most of this is the same as with the index_messages.js
let est_or = null;

function send (message) {
	window.parent.postMessage(message, "*");
}

function getType (av) {
	let type = av.slice(av.indexOf(":"+1));
	av = av.slice(0,av.indexOf(":"));
	type = type.toLowerCase();
	console.log(type, av);
	switch (type) {
		case "string":
			break;
		case "number":
			av = Number(av);
			break;
		case "object":
			eval("av="+av);
			break;
		case "bool":
			const bc = av;
			av = {"true":true,"false":false}[av];
			if (av === undefined) {
				av = Boolean(bc);
			}
			break;
		default:
			break;
	}
	return av;
}

// follows same basic format as with the indes_messages.js but without forwarding capabilities
function interperet_message (raw_message) {
	// send("O:CON,R:IN,M:$"+raw_message);
	const m = raw_message.slice(raw_message.indexOf("M:")+2);
	switch (m) {
		case "resp":
			return;
		case "init":
			// send("O:EQ,R:IN,M:$INIT MESSAGE FOR "+raw_message.slice(raw_message.indexOf("R:")+2,raw_message.indexOf("M:")));
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
				// console.log(sel, val);
				if (sel === "src") {
					elem.src = val;
				} else if (sel === "text") {
					elem.textContent = val;
				} else if (sel === "hidden") {
					const v = {"true":true,"false":false}[val];
					elem.hidden = v;
					// console.log(v, elem.hidden);
				} else if (sel === "html_attr") {
					const attr = val.slice(0,val.indexOf(":="));
					let av = val.slice(val.indexOf(":=")+2);
					if (av.includes(":")) {
						av = getType(av);
					}
					// console.log(av, typeof av, "av log");
					elem[attr] = av;
					// console.log(attr, av);
				}
			}else if (m[0] === "!") {
				eval(m.slice(1));
			} else {
				spec_mess(m);
			}
			return;
	}
}

function receive (event) {
	if (est_or !== null) {
		if (event.origin !== est_or) {
			throw ("invalid message origin: " + event.origin);
			return;
		}
	}
	//console.log(event.origin, event.data);
	const raw_messages = event.data;
	if (raw_messages.includes(";")) {
		const messages = raw_messages.split(";");
		messages.forEach(function(elem){interperet_message(elem)});
	} else {
		interperet_message(raw_messages);
	}
}

// sets up the event listeners
window.addEventListener("message", receive);

window.addEventListener("messageerror",function () {console.error("error receiving message for loading screen")})

// these two functions are modified versions of an MDN example on the javascript await keyword
// supporting function for execAfterDelay
async function resolveAfterDelay (delay) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(delay);
		}, delay);
	});
}

// used to create a time.sleep equivalent
async function execAfterDelay (f, d) {
	await resolveAfterDelay(d);
	f();
}