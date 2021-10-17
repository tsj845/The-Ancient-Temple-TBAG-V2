let lfins = [0,0,0,0,0,0];

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
const locs = {"LS":"loading_screen","CB":"combat_screen", "SH":"shop_screen","EQ":"equip_screen", "PS":"promo_screen", "GS":"gacha_screen"};

// established origin, used to block incoming messages from other origins
let est_or = null;

// sends a message to one of the iframes
function send (location, message) {
	if (!location.includes("screen")) {
		location = locs[location];
	}
	document.getElementById(location).contentWindow.postMessage(message,"*");
}

function runerror_invalid_origin (fname, o) {
	throw ("ERROR, VALID FUNC NAME, INVALID ORIGN: "+fname+", "+o);
}

// handles messages sent to the main window
function interperet_message (raw_message) {
	// get the intended recipient, allows for messages to be forwarded so that one iframe can communicate with another
	const r = raw_message.slice(raw_message.indexOf("R:")+2,raw_message.indexOf(",M"));
	// gets the origin of the message, used for sending responses
	const o = raw_message.slice(2,raw_message.indexOf(",R"));
	// gets the actual message
	let m = raw_message.slice(raw_message.indexOf("M:")+2);
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
						lfins[3] = 1;
						document.getElementById("equip_screen").hidden = true;
					case "PS":
						lfins[4] = 1;
						document.getElementById("promo_screen").hidden = true;
					case "GS":
						lfins[5] = 1;
						document.getElementById("gacha_screen").hidden = true;
				}
				// checks if the title screen should be displayed
				onLoadHandler();
				break;
			case "close":
				switch (o) {
					case "EQ":
						equipRunner.close();
						break;
					case "SH":
						shopRunner.close();
						break;
					case "GS":
						gachaRunner.close();
						break;
					case "PS":
						close_promo();
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
								runerror_invalid_origin(fname, o);
								return;
							}
							equipRunner.slot_click(args);
							return;
						case "EQRUN.EQITEM":
							if (o !== "EQ") {
								runerror_invalid_origin(fname, o);
								return;
							}
							equipRunner.equip_item(args);
							return;
						case "SHRUN.SLOTCLICK":
							if (o !== "SH") {
								runerror_invalid_origin(fname, o);
								return;
							}
							shopRunner.slot_click(args);
							return;
						case "SHRUN.SHBUY":
							if (o !== "SH") {
								runerror_invalid_origin(fname, o);
								return;
							}
							shopRunner.buy_item(args);
							return;
						case "CHAR.UNLOCK":
							if (o !== "PS") {
								runerror_invalid_origin(fname, o);
								return;
							}
							unlockChar(args);
							return;
						default:
							throw ("ERROR, INVALID FUNC NAME: "+fname);
							return;
					}
				}
		}
	} else {
		// else forward it to the intended recipient
		send(locs[r],raw_message);
	}
}

function receive (event) {
	if (est_or !== null) {
		if (event.origin !== est_or) {
			throw ("invalid message origin: " + event.origin);
			return;
		}
	}
	const raw_messages = event.data;
	if (raw_messages.includes(";")) {
		const messages = raw_messages.split(";");
		messages.forEach(function(elem){interperet_message(elem)});
	} else {
		interperet_message(raw_messages);
	}
}

// adds a listener
window.addEventListener("message", receive);

// throws an error if there was a messageerror
window.addEventListener("messageerror",function () {throw ("error receiving message for main screen")})

// these two functions are modified versions of an MDN example on the javascript await keyword
// supporting function for execAfterDelay
// async function resolveAfterDelay (delay) {
// 	return new Promise(resolve => {
// 		setTimeout(() => {
// 			resolve(delay);
// 		}, delay);
// 	});
// }

// used to create a time.sleep equivalent
function execAfterDelay (f, d) {
	// await resolveAfterDelay(d);
	// f();
	return setTimeout(f, d);
}

// sets up the event listener
window.addEventListener("load", onLoadHandler);

function exec (l,code) {
	const command = "O:IN,R:"+l+",M:!send('O:CB,R:IN,M:$'+String("+code+"))";
	send(locs[l],command);
}