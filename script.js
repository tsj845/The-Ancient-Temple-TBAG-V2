let sound_disabled = false;
let in_title = true;
let in_loading = false;

const main_dict = {"chapter_1/option":option_file, "chapter_1/temple":temple_file, "chapter_2/labyrinth1":labyrinth_file_1};

const main_input = document.getElementById("text_input");
const name_text = document.getElementById("name_text");
const prompt_label = document.getElementById("prompt_label");
const inp_container = document.getElementById("input_container");
const prompt_options = document.getElementById("options");
const con_out = document.getElementById("main_output");
const header = document.getElementById("header_text");
const context_img = document.getElementById("context_img");

function gameprint(text) {
	con_out.textContent = text;
}

class Game {
	constructor () {
		this.blockIndex = -1;
		this.fname = "chapter_1/option";
		this.chapter = 1;
		this.playerName = "";
		this.inType = 0;
		this.inventory = {};
		this.paths = {"route":"0"};
		this.disabled = true;
		this.lines = [];
		this.labels = {};
		this.gotos = [];
		this.bad_file = false;
		this.interaction = false;
		this.is_dev = false;
		this.c_sound = null;
	}
	firstPass () {
		for (let i = 0; i < this.lines.length; i ++) {
			const line = this.lines[i];
			//console.log(line);
			if (typeof line === "string") {
				continue;
			} else {
				const control = line[0];
				//console.log(control);
				if (control === "label") {
					this.labels[line[1]] = i;
				}
			}
		}
	}
	load (name, position) {
		this.bad_file = true;
		this.blockIndex = -1;
		this.fname = name;
		//console.log(this.fname, main_dict[this.fname]);
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
	goto (line) {
		//console.log(line);
		if (typeof line === "string") {
			if (line in this.labels) {
				this.blockIndex = this.labels[line];
			} else {
				throw "goto failed, name: " + line;
			}
		}
	}
	createColored (text) {
		let parts = text.split("@&*");
		const s = document.createElement("span");
		s.style.color = parts[1];
		s.textContent = parts[0];
		return s;
	}
	prompt (keys, values) {
		//console.log("prompt");
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
	startInteraction (args) {
		this.interaction = true;
	}
	progress () {
		if (this.disabled || this.bad_file) {
			return;
		}
		this.blockIndex += 1;
		if (this.blockIndex >= this.lines.length) {
			console.log("EOF");
			this.bad_file = true;
		} else {
			this.inerperet();
		}
	}
	inerperet () {
		const line = this.lines[this.blockIndex];
		//console.log(typeof line);
		if (typeof line === "string") {
			gameprint(line);
		} else {
			const control = line[0];
			if (control === "label") {
				//
			} else if (control === "head") {
				header.textContent = line[1];
			} else if (control === "chapter") {
				this.chapter = Number(line[1]);
				this.load("chapter_"+this.chapter.toString()+"/"+line[2]);
			} else if (control === "option") {
				this.prompt(line[1], line[2]);
				return;
			} else if (control === "sound") {
				const elem = document.getElementById(line[1]);
				if (elem !== null) {
					if (this.c_sound !== null) {
						this.c_sound.pause()
					}
					this.c_sound = elem;
					if (!sound_disabled) {
						elem.play();
					}
				} else {
					console.log("audio element does not exist, given name: ", line[1]);
				}
			} else if (control === "img") {
				//console.log(line[1]);
				//console.log("hello????");
				context_img.src = line[1];
			} else if (control === "inventory") {
				this.inventory[line[1]] = line[2];
			} else if (control === "gcond") {
				let parts = line[1].split("=");
				if (this.inventory[parts[0]] === parts[1]) {
					this.goto(line[2][0]);
				} else {
					this.goto(line[2][1]);
				}
			} else if (control === "goto") {
				this.goto(line[1]);
			} else if (control === "location") {
				const fname = "chapter_"+this.chapter.toString()+"/"+line[1];
				this.load(fname);
				return;
			} else if (control === "path") {
				this.paths[line[1]] = line[2];
			} else if (control === "pgoto") {
				let parts = line[1].split("=");
				console.log(parts);
				if (this.paths[parts[0]] === parts[1]) {
					this.goto(line[2][0]);
				} else {
					this.goto(line[2][1]);
				}
			} else if (control === "interaction") {
				this.startInteraction(line);
				return;
			}
			this.progress();
		}
		if (typeof this.lines[this.blockIndex+1] === "object") {
			if (this.lines[this.blockIndex+1][0] === "option") {
				this.progress();
				return;
			}
		}
	}
	handleKeyPress (key) {
		if (key === "Escape") {
			document.getElementById("main_menu").showModal();
		} else {
			this.progress();
		}
	}
	unlock () {
		this.disabled = false;
	}
	handleTextInput (value) {
		//console.log(this.inType);
		//console.log("change");
		let good_input = false;
		if (this.inType === 0) {
			this.playerName = value;
			if (value === "independence") {
				name_text.textContent = independance_text;
			} else if (value === "namey || value === "GLaDOS" || value === "Sun Li") {
				name_text.textContent = "Sun Li";
					this.is_dev = true;
    		} else if (value === "god yeet") {
				name_text.textContent = "demonic screeching";
				this.is_stupid_person = true;
			} else {
				name_text.textContent = value;
			}
			this.inType = 1;
			good_input = true;
		} else if (this.inType === 1) {
			//console.log(value, value.length);
			if (Number(value).toString() !== "NaN") {
				const fn = Number(value)-1;
				if (fn > -1 && fn < this.gotos.length) {
					this.goto(this.gotos[fn]);
					good_input = true;
				}
			}
		}
		main_input.value = "";
		if (good_input) {
			prompt_options.replaceChildren();
			inp_container.hidden = true;
			this.disabled = false;
			this.progress();
		}
	}
	stopSounds () {
		if (this.c_sound !== null) {
			this.c_sound.pause();
		}
	}
	startSounds () {
		if (this.c_sound !== null) {
			this.c_sound.play();
		}
	}
}

let game = new Game();
game.load("chapter_1/option");

function handleTextInput (e) {
	game.handleTextInput(e.target.value);
}

main_input.addEventListener("change", handleTextInput);

function keyPress (e) {
	if (e.toString() !== "[object KeyboardEvent]") {
		return;
	}
	const key = e.code.toString();
	if (in_title) {
		document.getElementById("title_screen").hidden = true;
		in_title = false;
	} else if (in_loading) {
		document.getElementById("loading_screen").hidden = true;
		in_loading = false;
	} else {
		game.handleKeyPress(key);
	}
}

document.addEventListener("keydown", keyPress);

function toggleAudio () {
	const img = document.getElementById("mute_sounds_2");
	sound_disabled = !sound_disabled;
	if (sound_disabled) {
		game.stopSounds();
	} else {
		game.startSounds();
	}
	img.setAttribute("class", (sound_disabled ? "mute_checked" : "mute_unchecked"));
}

function open_menu () {
	console.log("open_menu");
	document.getElementById('main_menu').showModal();
}

document.getElementById("mute_sounds_2").addEventListener("click",toggleAudio);