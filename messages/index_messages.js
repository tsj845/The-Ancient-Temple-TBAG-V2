let ls_lfin = false;
let ts_lfin = false;
let cb_lfin = false;

// closes the loading screen
function closeLoadingScreen () {
	document.getElementById("loading_screen").hidden = true;
	// stops the user from noticing a jump in animation progress
	execAfterDelay(startMusic,/*250*/0);
}

function startMusic () {
	send("title_screen","O:IN,R:TS,M:start_music");
}

function onLoadHandler (e) {
	// checks to make sure that everything is loaded
	if (!ls_lfin || !ts_lfin || !cb_lfin) {
		return;
	}
	// closes the loading screen 4 seconds after everything finishes loading, this is so that the loading screen doesn't disappear as soon as it's finished loading
	execAfterDelay(closeLoadingScreen,/*4000*/0);
}

// used to get the id of the iframe that a message was sent from
const locs = {"LS":"loading_screen","TS":"title_screen","CB":"combat_screen"};

// established origin, used to block incoming messages from other origins
let est_or = null;

// sends a message to one of the iframes
function send (location, message) {
	document.getElementById(location).contentWindow.postMessage(message,"*");
}

// handles messages sent to the main window
function receive (event) {
	if (est_or !== null) {
		if (event.origin !== est_or) {
			throw ("invalid message origin: " + event.origin);
			return;
		}
	}
	console.log(event.origin, event.data);
	const raw_message = event.data;
	// get the intended recipient, allows for messages to be forwarded so that one iframe can communicate with another
	const r = raw_message.slice(raw_message.indexOf("R:")+2,raw_message.indexOf(",M"));
	// gets the origin of the message, used for sending responses
	const o = raw_message.slice(2,raw_message.indexOf(",R"));
	// gets the actuall message
	const m = raw_message.slice(raw_message.indexOf("M:")+2);
	console.log(o, r, m);
	// if the intended recipient of the message is the main window
	if (r === "IN") {
		// does things based on what the message is
		switch (m) {
			// ignore it if it's a response
			case "resp":
				return;
			// if the message is "init" reply with another "init" message and if needed, set the est_or variable
			case "init":
				if (est_or === null) {
					est_or = event.origin;
				}
				send(locs[o],"O:IN,R:"+o+"M:init");
				return;
			// sent when an iframe finishes loading its contents
			case "lfin":
				// sets a variable based on which iframe sent the message
				if (o === "LS") {
					ls_lfin = true;
				} else if (o === "CB") {
					cb_lfin = true;
					document.getElementById("combat_screen").hidden = true;
				} else {
					ts_lfin = true;
				}
				// checks if the title screen should be displayed
				onLoadHandler();
				break;
			case "ERROR":
				throw ("ERROR message sent from: " + o);
				break;
			default:
				if (m[0] === "@") {
					if (m.slice(1,m.indexOf("?")) === "combat") {
						combatRunner.choice(Number(m.slice(m.indexOf("?")+1)));
					}
				}
		}
		// sends a response
		send(locs[o],"O:IN,R:"+o+",M:resp");
	} else {
		// else forward it to the intended recipient
		send(locs[r],raw_message);
	}
}

// adds a listener
window.addEventListener("message", receive);

// throws an error if there was a messageerror
window.addEventListener("messageerror",function () {throw ("error receiving message for main screen")})

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

// sets up the event listener
window.addEventListener("load", onLoadHandler);

function exec (code) {
	const command = "O:IN,R:CB,M:!send('O:CB,R:IN,M:'+String("+code+"))";
	console.log(command);
	send("combat_screen",command);
}