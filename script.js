// if the sound is disabled
let sound_disabled = false;
let badPerson = false;
let special_keys = ["Tab","MetaLeft","AltLeft","AltRight","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","ControlLeft","ControlRight","ShiftLeft","ShiftRight","CapsLock"];

// main dictionairy of level names to level data
const main_dict = {"chapter_1/option":option_file, "chapter_1/temple":temple_file, "chapter_2/labyrinth1":labyrinth_file_1};

// a lot of references to everything related to the playing of the game
const main_input = document.getElementById("text_input");
const name_text = document.getElementById("name_text");
const prompt_label = document.getElementById("prompt_label");
const inp_container = document.getElementById("input_container");
const prompt_options = document.getElementById("options");
const con_out = document.getElementById("main_output");
const header = document.getElementById("header_text");
const context_img = document.getElementById("context_img");

// puts text on the screen
function gameprint(text) {
	con_out.textContent = text;
}

// don't at me about this
class Game {
	constructor () {
		// the position of the interpreter in the level data
		this.blockIndex = -1;
		// the name of the level
		this.fname = "chapter_1/option";
		// the current chapter, a prefix so that levels in different chapters can have the same name
		this.chapter = 1;
		// the name the player choses for themselves
		this.playerName = "";
		// stores what type of information the user is entering
		this.inType = 0;
		// just an inventory
		this.inventory = {};
		// you know that this sort of game has different routes
		this.paths = {"route":"0"};
		// represents if the user should be allowed to progress
		this.disabled = true;
		// the lines in the giant array of level data
		this.lines = [];
		// the first version of this (in python) didn't have labels, it was really difficult to properly navigate the level data
		this.labels = {};
		// each choice has two or more locations to jump to, this stores them
		this.gotos = [];
		// stores if the interpereter has run out of lines, if true then it can't progress as this would cause an index error
		this.bad_file = false;
		// stores if the user is in an interaction
		this.interaction = false;
		// shhh, secrets
		this.is_dev = false;
		// the sound that is currently playing, used for background music
		this.c_sound = null;
	}
	// runs through all of the lines and finds every label and where it is, used for everything from gotos to where a user should go based on their route
	firstPass () {
		for (let i = 0; i < this.lines.length; i ++) {
			const line = this.lines[i];
			if (typeof line === "string") {
				continue;
			} else {
				const control = line[0];
				if (control === "label") {
					this.labels[line[1]] = i;
				}
			}
		}
	}
	// sets up the game to run a level, position is used to set where the interpereter should start at
	load (name, position) {
		this.bad_file = true;
		this.blockIndex = -1;
		this.fname = name;
		this.lines = main_dict[this.fname]["lines"];
		this.labels = {};
		const n_inven = main_dict[this.fname]["inven"];
		this.inventory = {};
		for (let i = 0; i < n_inven.length; i ++) {
			this.inventory[n_inven[i][0]] = n_inven[i][1];
		}
		this.gotos.splice(0, this.gotos.length);
		this.firstPass();
		if (this.inType === 1) {
			this.disabled = false;
		}
		this.bad_file = false;
		this.progress();
		if (position !== undefined) {
			this.blockIndex = position;
		}
	}
	// just goes to a label
	goto (line) {
		if (typeof line === "string") {
			if (line in this.labels) {
				this.blockIndex = this.labels[line];
			} else {
				throw "goto failed, name: " + line;
			}
		}
	}
	// support function for colored text
	createColored (text) {
		let parts = text.split("@&*");
		const s = document.createElement("span");
		s.style.color = parts[1];
		s.textContent = parts[0];
		return s;
	}
	// prompts the user to make a choice
	prompt (keys, values) {
		inp_container.hidden = false;
		prompt_label.textContent = "Enter selection: ";
		for (let i = 0; i < keys.length; i ++) {
			const op = keys[i];
			let child = op;
			if (keys.includes("") && keys[keys.length-1] === "") {
				if (i < keys.length-2) {
					child += ", ";
				}
			} else if (i < keys.length-1) {
				child += ", ";
			}
			if (op.includes("@&*")) {
				child = this.createColored(op);
			}
			prompt_options.append(child);
		}
		this.gotos = values;
		main_input.focus();
		this.disabled = true;
	}
	// starts an interaction
	startInteraction (args) {
		this.disabled = true;
		this.interaction = true;
		switch (args[1]) {
			case "combat":
				if (!["battle","boss"].includes(this.c_sound.getAttribute("id"))) {
					if (!sound_disabled) {
						this.c_sound.pause();
						this.c_sound = document.getElementById("battle");
						this.c_sound.currentTime = 0;
						this.c_sound.play();
					}
				}
				combatRunner.start(args);
			default:
				return;
		}
	}
	// exits an interaction
	endInteraction () {
		this.disabled = false;
		this.interaction = false;
		this.progress();
	}
	// advances the game
	progress () {
		if (this.disabled || this.bad_file) {
			return;
		}
		this.blockIndex += 1;
		if (this.blockIndex >= this.lines.length) {
			console.log("EOF");
			this.bad_file = true;
		} else {
			this.interperet();
		}
	}
	// decodes and executes the current line
	interperet () {
		const line = this.lines[this.blockIndex];
		// if the line is just a string then show it to the user
		if (typeof line === "string") {
			gameprint(line);
		} else {
			// otherwise, it's something that gets input moves the user around or changes the look of the game
			const control = line[0];
			switch (control) {
				case "label":
					break;
				case "head":
					header.textContent = line[1];
					break;
				case "chapter":
					this.chapter = Number(line[1]);
					this.load("chapter_"+this.chapter.toString()+"/"+line[2]);
					break;
				case "option":
					this.prompt(line[1], line[2]);
					return;
				case "sound":
					if (sound_disabled) {
						break;
					}
					const elem = document.getElementById(line[1]);
					if (elem !== null) {
						if (this.c_sound !== null) {
							this.c_sound.pause()
						}
						this.c_sound = elem;
						if (!sound_disabled) {
							console.log(elem.currentTime);
							elem.currentTime = 0;
							elem.play();
						}
					} else {
						console.log("audio element does not exist, given name: ", line[1]);
					}
					break;
				case "sfx":
					if (sound_disabled) {
						break;
					}
					console.log(document.getElementById(line[1]).currentTime);
					document.getElementById(line[1]).currentTime = 0;
					document.getElementById(line[1]).play();
					break;
				case "img":
					context_img.src = line[1];
					break;
				case "inventory":
					this.inventory[line[1]] = line[2];
					break;
				case "gcond":
					let parts_l = line[1].split("=");
					if (this.inventory[parts_l[0]] === parts_l[1]) {
						this.goto(line[2][0]);
					} else {
						this.goto(line[2][1]);
					}
					break;
				case "goto":
					this.goto(line[1]);
					break;
				case "location":
					const fname = "chapter_"+this.chapter.toString()+"/"+line[1];
					this.load(fname);
					return;
				case "path":
					this.paths[line[1]] = line[2];
					break;
				case "pgoto":
					let parts = line[1].split("=");
					if (this.paths[parts[0]] === parts[1]) {
						this.goto(line[2][0]);
					} else {
						this.goto(line[2][1]);
					}
					break;
				case "interaction":
					let args = line.slice(0);
					if (line[1] === "combat") {
						if (typeof line[2] === "string") {
							args = ["interaction", "combat"];
							const t = mobs[line[2]];
							args.push(t[0]);
							args.push(t[1]);
							args.push(t[2]);
							args.push(t[3]);
						}
					}
					console.log(args);
					this.startInteraction(args);
					return;
			}
			this.progress();
		}
		// if the next line is an option, then show it
		if (typeof this.lines[this.blockIndex+1] === "object") {
			if (this.lines[this.blockIndex+1][0] === "option") {
				this.progress();
				return;
			}
		}
	}
	// handles key presses
	handleKeyPress (key) {
		if (key === "Escape") {
			document.getElementById("main_menu").showModal();
		} else if (!special_keys.includes(key)) {
			if (in_title) {
				close_title_screen();
				main_input.textContent = "";
			} else {
				this.progress();
			}
		}
	}
	showPortalUI () {
		// coming soon
	}
	// handles text that the user inputs
	handleTextInput (value) {
		// if the input is valid
		let good_input = false;
		// if the input is for the name
		if (this.inType === 0) {
			this.playerName = value;
			// be careful with this one
			if (value === "independence") {
				name_text.textContent = independance_text;
			// these are secrets you can stop looking at them now
			} else if (value === "namey" || value === "GLaDOS" || value === "Sun Li") {
				name_text.textContent = "Sun Li";
					this.is_dev = true;
    		} else if (value === "god yeet") {
				name_text.textContent = "demonic screeching";
				this.is_stupid_person = true;
			} else if (value === "JOHN") {
				name_text.textContent = "ERROR";
				badPerson = true;
			} else if (value === "Chell") {
				name_text.textContent = "chell";
				this.showPortalUI();
				this.is_dev = true;
			} else {
				name_text.textContent = value;
			}
			this.inType = 1;
			//good_input = true;
			// shows the character select screen
			const cs = document.getElementById("char_select");
			console.log(cs);
			cs.showModal();
			// shows character information
			displayChar();
		// handles input for choices
		} else if (this.inType === 1) {
			if (Number(value).toString() !== "NaN") {
				const fn = Number(value)-1;
				if (fn > -1 && fn < this.gotos.length) {
					this.goto(this.gotos[fn]);
					good_input = true;
				}
			}
		}
		// gets rid of the text the user entered
		main_input.value = "";
		// if the input was valid then progress
		if (good_input) {
			this.hideInput();
		}
	}
	hideInput () {
		prompt_options.replaceChildren();
		inp_container.hidden = true;
		this.disabled = false;
		this.progress();
	}
	// stops the background music if it's playing
	stopSounds () {
		if (this.c_sound !== null) {
			this.c_sound.pause();
		}
	}
	// starts the background music if it's playing
	startSounds () {
		if (this.c_sound !== null) {
			this.c_sound.play();
		}
	}
}

// initializes the game
let game = new Game();
// loads the starting level
game.load("chapter_1/option");

// event handler for text the user has entered
function handleTextInput (e) {
	game.handleTextInput(e.target.value);
}

// sets up the event listener
main_input.addEventListener("change", handleTextInput);

// event handler for key presses
function keyPress (e) {
	// got this weird error once involving autocomplete sending a non-keyboard event to the keydown event listener, now I don't take chances
	if (e.toString() !== "[object KeyboardEvent]") {
		return;
	}
	// gets the key code
	const key = e.code.toString();
	// sends the key code to the game
	game.handleKeyPress(key);
}

// sets up the event listener
document.addEventListener("keydown", keyPress);

// toggles the audio if the user mutes or unmutes it
function toggleAudio () {
	// changes the sprite for the custom button
	const img = document.getElementById("mute_sounds_2");
	sound_disabled = !sound_disabled;
	if (sound_disabled) {
		game.stopSounds();
	} else {
		game.startSounds();
	}
	img.setAttribute("class", (sound_disabled ? "mute_checked" : "mute_unchecked"));
}

// adds the event listener for the custom button
document.getElementById("mute_sounds_2").addEventListener("click",toggleAudio);