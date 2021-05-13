let lfins = [0,0,0,0];

// closes the loading screen
function closeLoadingScreen () {
	document.getElementById("loading_screen").hidden = true;
	// stops the user from noticing a jump in animation progress
	execAfterDelay(startMusic,250);
}

function startMusic () {
	start_title_music();
}

function onLoadHandler (e) {
	// checks to make sure that everything is loaded
	let total = 0;
	for (let i = 0; i < lfins.length; i ++) {
		total += lfins[i];
	}
	if (total < lfins.length) {
		return;
	}
	// closes the loading screen 4 seconds after everything finishes loading, this is so that the loading screen doesn't disappear as soon as it's finished loading
	execAfterDelay(closeLoadingScreen,2000);
}

// used to get the id of the iframe that a message was sent from
const locs = {"LS":"loading_screen","CB":"combat_screen", "SH":"shop_screen","EQ":"equip_screen"};

// established origin, used to block incoming messages from other origins
let est_or = null;

// sends a message to one of the iframes
function send (location, message) {
	if (!location.includes("screen")) {
		location = locs[location];
	}
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
	//console.log(event.origin, event.data);
	const raw_message = event.data;
	// get the intended recipient, allows for messages to be forwarded so that one iframe can communicate with another
	const r = raw_message.slice(raw_message.indexOf("R:")+2,raw_message.indexOf(",M"));
	// gets the origin of the message, used for sending responses
	const o = raw_message.slice(2,raw_message.indexOf(",R"));
	// gets the actual message
	let m = raw_message.slice(raw_message.indexOf("M:")+2);
	//console.log(o, r, m);
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
				console.log("INIT message from "+o);
				send(locs[o],"O:IN,R:"+o+",M:init");
				if (o === "LS") {
					send("loading_screen","O:IN,R:LS,M:index="+index.toString());
				}
				return;
			// sent when an iframe finishes loading its contents
			case "lfin":
				// sets a variable based on which iframe sent the message
				switch (o) {
					case "LS":
						lfins[0] = 1;
					case "CB":
						lfins[1] = 1;
						document.getElementById("combat_screen").hidden = true;
					case "SH":
						lfins[2] = 1;
						document.getElementById("shop_screen").hidden = true;
					case "EQ":
						//console.log("EQ LFIN");
						lfins[3] = 1;
						document.getElementById("equip_screen").hidden = true;
				}
				// checks if the title screen should be displayed
				onLoadHandler();
				break;
			case "close":
				switch (o) {
					case "EQ":
						equipRunner.close();
						break;
				}
				return;
			case "ERROR":
				throw ("ERROR message sent from: " + o);
				break;
			default:
				if (m[0] === "@") {
					if (m.slice(1,m.indexOf("?")) === "combat") {
						combatRunner.choice(Number(m.slice(m.indexOf("?")+1)));
					}
				} else if (m[0] === "$") {
					console.log(m.slice(1));
				} else if (m[0] === "*") {
					const fname = m.slice(1,m.indexOf("-"));
					m = m.slice(m.indexOf("-")+1);
					const args = m.split(",");
					switch (fname) {
						case "EQRUN.SLOTCLICK":
							if (o !== "EQ") {
								throw ("ERROR, VALID FUNC NAME, INVALID ORIGN: "+fname+", "+o);
								return;
							}
							equipRunner.slot_click(args);
							return;
						default:
							throw ("ERROR, INVALID FUNC NAME: "+fname);
							return;
					}
				}
		}
		// sends a response
		//send(locs[o],"O:IN,R:"+o+",M:resp");
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

function exec (l,code) {
	const command = "O:IN,R:CB,M:!send('O:CB,R:IN,M:$'+String("+code+"))";
	console.log(command);
	send(locs[l],command);
}