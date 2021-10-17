// if user isn't playing
let game_running = false;

// if the sound is disabled
let sound_disabled = false;
let badPerson = false;
let first_choice = false;
let special_keys = ["Tab","MetaLeft","AltLeft","AltRight","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","ControlLeft","ControlRight","ShiftLeft","ShiftRight","CapsLock"];

// main dictionairy of level names to level data for chapter one
const main_dict = {"option":option_file, "temple":temple_file,"s_lab_illuminated":illuminated_file,"s_lab_unilluminated":unilluminated_file};

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
		// stores if the game has had a fatal error and is now stopped
		this.__EMSTOP = false;
		// the position of the interpreter in the level data
		this.blockIndex = -1;
		// the name of the level
		this.fname = "option";
		// the current chapter, a prefix so that levels in different chapters can have the same name
		this.chapter = 0;
		// the name the player choses for themselves
		this.playerName = "";
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
		// the currently playing sfx
		this.c_sfx = document.getElementById("game-sfx-audio");
		// the sound that is currently playing, used for background music
		this.c_sound = document.getElementById("game-music-audio");
		// ambient background music
		this.ambient_music = [];
		// ambient background sfx
		this.ambient_sfx = [];
		// playing ambient
		this.playing_ambient = false;
		// mapping for the game to use in chapter two
		this.c2_mapping = c2utils.standard_mapping_lab_back;
		// layout
		this.c2_layout = null;
		// player position
		this.px = 0;
		this.py = 0;
		// current chunk
		this.cx = 0;
		this.cy = 0;
		// number of chunks
		this.xcc = 0;
		this.ycc = 0;
		// tile data (chapter two)
		this.ldata = null;
		// on teleport (chapter two)
		this.ontele = false;
		// teleport position (chapter two)
		this.tx = 0;
		this.ty = 0;
		// saved sound src and time
		this.ncomsrc = "";
		this.ncomtime = 0;
		// player source (chapter two)
		this.playersrc = "";
		// lock player input during movement (chapter two)
		this.movelock = false;
	}
	// set player image
	load_player_img (animation) {
		if (this.playersrc === "") {
			player_img.src = "sprites/goawaylol.gif";
		} else {
			player_img.src = "sprites/c2sprites/chars/"+this.playersrc.split(".")[0]+"/"+animation+this.playersrc.split(".")[1];
		}
	}
	// starts playing the ambient background music
	play_ambient () {
		if (this.ambient_music.length > 0) {
			this.playing_ambient = true;
			this.c_sound.pause();
			this.c_sound.currentTime = 0;
			this.c_sound.src = this.ambient_music[0];
			if (!sound_disabled) {
				this.c_sound.play();
			}
		}
	}
	// sets the value of a tile in the current chunk
	set_tile_value (x, y, v) {
		// checks that there is a chunk
		if (this.c2_layout === null) {
			return;
		}
		this.c2_layout[y][x] = v;
		renderer.set_tile(x, y, v);
	}
	// performs an action
	action () {
		// checks that the game is in chapter two
		if (this.chapter !== 1) {
			return;
		}
		// tile id of the current tile
		const t = this.c2_mapping[this.c2_layout[this.py][this.px]];
		// portal to chapter three
		if (t === -1) {
			// console.log("chapter 3");
			return;
		}
		// checks for label data
		const ind = this.py.toString()+"|"+this.px.toString();
		if (!(ind in this.labels)) {
			return;
		}
		// gets label data
		const l = this.labels[ind];
		const d = this.ldata[l];
		// console.log(t, ind, l, d);
		// the tile to replace this tile with
		let replace = null;
		// loops over the label data
		for (let i = 0; i < d.length; i ++) {
			const p = d[i];
			// interperets the label data
			if (p[0] === 2) {
				// sets the replacement tile
				replace = p[1];
			} else if (p[0] === 3) {
				// adds an item to the inventory
				equipRunner.story_iven.push([p[1],p[2]].join());
			} else if (p[0] === 5) {
				// sets player position
				this.px = Number(p[1].split("|")[0]);
				this.py = Number(p[1].split("|")[1]);
				const ncx = (this.px-(this.px%renderer.board_size))/renderer.board_size;
				const ncy = (this.py-(this.py%renderer.board_size))/renderer.board_size;
				if (ncx !== this.cx || ncy !== this.cy) {
					this.cy = ncy;
					this.cx = ncx;
					renderer.render_chunk(this.cx, this.cy);
				}
				renderer.set_player_position(this.px, this.py);
			}
		}
		// replaces the tile
		if (replace !== null) {
			this.set_tile_value(this.px, this.py, replace);
		}
	}
	// sets level data
	set_level_data (data) {
		// sets sound data
		const sound_data = data["sounds"];
		this.ambient_music = sound_data["ambient-music"];
		this.ambient_sfx = sound_data["ambient-sfx"];
		// sets header text
		header.textContent = data["head"];
		// sets layout data
		this.xcc = data["x-dim"];
		this.ycc = data["y-dim"];
		this.c2_mapping = data["game-mapping"];
		// plays ambient background music
		this.play_ambient();
		// chunk size
		const cs = data["chunk-size"];
		// spawn position
		const sx = data["s-x"];
		const sy = data["s-y"];
		// sets chunk coordinates
		this.cx = (sx-(sx%cs))/cs;
		this.cy = (sy-(sy%cs))/cs;
		// sets layout
		this.c2_layout = data["content"];
		// converts strings into lists
		for (let y = 0; y < this.c2_layout.length; y ++) {
			this.c2_layout[y] = this.c2_layout[y].split("");
		}
		// sets player position
		renderer.set_player_position(sx, sy);
		this.px = sx;
		this.py = sy;
		// sets labels
		const lablst = data["labels"];
		// sets label data
		this.ldata = data["l-data"];
		this.labels = {};
		for (let i = 0; i < lablst.length; i ++) {
			const l = lablst[i];
			this.labels[l.split(",")[0]+"|"+l.split(",")[1]] = Number(l.split(",")[2]);
		}
	}
	// reactivates a teleporter
	reactivate_teleport (x, y) {
		this.set_tile_value(x, y, "T");
	}
	move_end () {
		this.load_player_img("idle");
	}
	// moves the player
	move_player (x, y) {
		if (this.__EMSTOP) {
			return;
		}
		// checks for invalid movement directions
		if (x === y || (x !== 0 && y !== 0)) {
			// console.log("invalid move direction");
			return;
		}
		// gets the position of the tile the player is moving to
		let nx = this.px + x;
		let ny = this.py + y;
		// checks for the player moving out of bounds
		if (nx < 0 || nx >= this.c2_layout[0].length || ny < 0 || ny >= this.c2_layout.length) {
			// console.log("out of bounds");
			return;
		}
		let nstt = true;
		// checks if the tile the player is moving to is a teleporter
		if (this.c2_mapping[this.c2_layout[ny][nx]] === 5) {
			nstt = false;
			// console.log("teleport");
			// gets the portal destination
			// const d = this.ldata[this.labels[ny+"|"+nx]][0][1];
			// nx = Number(d.split("|")[0]);
			// ny = Number(d.split("|")[1]);
			// checks that the destination tile is a teleporter
			// if (this.c2_mapping[this.c2_layout[ny][nx]] === 5) {
			// 	// deactivates the portal
			// 	this.set_tile_value(nx, ny, "t");
			// 	// sets the player position
			// 	this.ontele = true;
			// 	this.tx = nx;
			// 	this.ty = ny;
			// }
			// console.log(d);
		}
		// calculates the chunk coordinates of the tile the player is moving to
		const ncx = (nx-(nx%renderer.board_size))/renderer.board_size;
		const ncy = (ny-(ny%renderer.board_size))/renderer.board_size;
		// gets the tile id of the tile
		const bh = this.c2_mapping[this.c2_layout[ny][nx]];
		// checks if the tile the player is moving to is solid
		if (c2utils.solids.includes(bh)) {
			// console.log("obstacle");
			// checks if the tile is a closed door
			if (bh === 2) {
				// checks that the door has a label
				const id = ny.toString()+"|"+nx.toString();
				if (id in this.labels) {
					// gets the label
					const lv = this.labels[id];
					// checks for the correct key in the players inventory
					const iind = equipRunner.story_iven.indexOf("key,"+lv.toString());
					// console.log(iind);
					if (iind !== -1) {
						// removes the key from the inventory
						equipRunner.story_iven.splice(iind, 1);
						// replaces the tile
						this.set_tile_value(nx, ny, this.ldata[lv][0][1]);
					}
				}
			}
			return;
		}
		// reactivates the teleporter
		if (this.ontele && nstt) {
			this.ontele = false;
			setTimeout(function(){game.reactivate_teleport(game.tx, game.ty)}, 500);
		}
		// checks if the player has moved to another chunk
		if (ncx !== this.cx || ncy !== this.cy) {
			renderer.render_chunk(ncx, ncy);
			this.cx = ncx;
			this.cy = ncy;
			renderer.set_player_position(nx, ny);
		} else {
			// sets player position
			if (this.px-x > this.px) {
				this.load_player_img("walk_left");
			} else if (this.px-x < this.px) {
				this.load_player_img("walk_right");
			} else if (this.py-y > this.py) {
				this.load_player_img("walk_up");
			} else if (this.py-y < this.py) {
				this.load_player_img("walk_down");
			}
			renderer.move_player(this.px, this.py, nx, ny);
			this.movelock = true;
		}
		this.px = nx;
		this.py = ny;
		// checks if the tile is an enemy tile
		if (this.c2_mapping[this.c2_layout[ny][nx]] === 7) {
			// gets label data
			const data = this.ldata[this.labels[ny+"|"+nx]][0];
			let args = ["", "combat", ...mobs[data[1]]];
			// deletes the label
			delete this.labels[this.py+"|"+this.px];
			// replaces the tile
			this.set_tile_value(nx, ny, data[2]);
			// starts combat
			this.startInteraction(args);
		}
	}
	reset_chapter_1 () {
		this.inventory = [];
		con_out.hidden = false;
		inp_container.hidden = false;
		context_img.hidden = false;
		c2_game_tiles.hidden = true;
		c2_help_text.hidden = true;
	}
	// starts the second chapter
	start_chapter_2 (v) {
		this.chapter = 1;
		this.inventory = [];
		con_out.hidden = true;
		inp_container.hidden = true;
		context_img.hidden = true;
		c2_game_tiles.hidden = false;
		c2_help_text.hidden = false;
		renderer.load_level(lab1_data);
		renderer.render_chunk(this.cx, this.cy);
		if (v === undefined) {
			save.sc2();
		}
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
		if (this.__EMSTOP || this.chapter !== 0) {
			return;
		}
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
		if (this.__EMSTOP) {
			return;
		}
		if (typeof line === "string") {
			if (line in this.labels) {
				// console.log(line);
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
		if (this.__EMSTOP || this.chapter !== 0) {
			return;
		}
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
		if (this.__EMSTOP) {
			return;
		}
		this.disabled = true;
		this.interaction = true;
		switch (args[1]) {
			case "combat":
				let wrong_music = true;
				const battle_music = ["battle","bossfight"];
				const id = this.c_sound.src;
				wrong_music = battle_music.indexOf(id) === -1;
				if (wrong_music) {
					if (!sound_disabled) {
						this.c_sound.pause();
						this.ncomsrc = this.c_sound.src;
						this.ncomtime = this.c_sound.currentTime;
						this.c_sound.src = "audios/bossfight.mp3";
						this.c_sound.currentTime = 0;
						this.c_sound.play();
					}
				} else {
					this.ncomsrc = null;
				}
				combatRunner.start(args);
			default:
				return;
		}
	}
	// exits an interaction
	endInteraction () {
		if (this.__EMSTOP) {
			return;
		}
		this.disabled = false;
		this.interaction = false;
		if (!sound_disabled && this.ncomsrc !== null) {
			this.c_sound.pause();
			this.c_sound.src = this.ncomsrc;
			this.c_sound.currentTime = this.ncomtime;
			this.c_sound.play();
		}
		if (this.chapter !== 1) {
			this.progress();
		}
	}
	// advances the game
	progress () {
		if (this.__EMSTOP || this.chapter !== 0) {
			return;
		}
		if (this.disabled || this.bad_file) {
			return;
		}
		this.blockIndex += 1;
		if (this.blockIndex >= this.lines.length) {
			// console.log("EOF");
			this.bad_file = true;
		} else {
			// restocks the shop occasionally
			shopRunner.generate_items();
			this.interperet();
		}
	}
	// decodes and executes the current line
	interperet () {
		if (this.__EMSTOP || this.chapter !== 0) {
			return;
		}
		const line = this.lines[this.blockIndex];
		// console.log(this.blockIndex, line);
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
				case "next":
					this.start_chapter_2();
					return;
				case "option":
					this.prompt(line[1], line[2]);
					return;
				case "sound":
					if (sound_disabled) {
						break;
					}
					let sound_src = line[1];
					if (sound_src.indexOf("audios/") === -1) {
						sound_src = "audios/"+sound_src;
					}
					if (sound_src.indexOf(".") === -1) {
						sound_src += ".mp3"
					}
					if (this.c_sound !== null) {
						this.c_sound.pause()
					}
					this.c_sound.currentTime = 0;
					this.c_sound.src = sound_src;
					// this.c_sound = elem;
					if (!sound_disabled) {
						this.c_sound.play()
						// elem.currentTime = 0;
						// elem.play();
					}
					break;
				case "sfx":
					if (sound_disabled) {
						break;
					}
					let sfx_id = line[1];
					if (sfx_id.indexOf("audios/sfx/") === -1) {
						sfx_id = "audios/sfx/"+sfx_id;
					}
					if (sfx_id.indexOf(".")) {
						sfx_id += ".mp3";
					}
					this.c_sfx.src = sfx_id;
					this.c_sfx.currentTime = 0;
					if (!sound_disabled) {
						this.c_sfx.play();
					}
					break;
				case "img":
					context_img.src = line[1];
					break;
				case "inventory":
					this.inventory[line[1]] = line[2];
					// console.log(this.inventory);
					break;
				case "gcond":
					let parts_l = line[1].split("=");
					// console.log(parts_l, this.inventory[parts_l[0]]);
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
					this.load(line[1]);
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
							args = ["interaction", "combat", ...mobs[line[2]]];
						}
					}
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
	// handles key presses in chapter two
	hKPC2 (key) {
		if (this.__EMSTOP) {
			return;
		}
		if (this.interaction || this.disabled || this.movelock) {
			return;
		}
		if (key === "Escape") {
			document.getElementById("save_menu").showModal();
			return;
		}
		if (key === "Space") {
			this.action();
			return;
		}
		if (key === "KeyA") {
			key = "ArrowLeft";
		} else if (key === "KeyW") {
			key = "ArrowUp";
		} else if (key === "KeyD") {
			key = "ArrowRight";
		} else if (key === "KeyS") {
			key = "ArrowDown";
		}
		if (special_keys.includes(key) && key.indexOf("Arrow") === -1) {
			return;
		}
		switch (key) {
			case "ArrowLeft":
				this.move_player(-1, 0);
				break;
			case "ArrowRight":
				this.move_player(1, 0);
				break;
			case "ArrowUp":
				this.move_player(0, -1)
				break;
			case "ArrowDown":
				this.move_player(0, 1);
				break;
			default:
				return;
		}
	}
	// handles key presses
	handleKeyPress (key) {
		if (this.__EMSTOP) {
			return;
		}
		// checks if the player is in chapter two
		if (this.chapter === 1) {
			this.hKPC2(key);
			return;
		}
		if (key === "Escape") {
			document.getElementById("save_menu").showModal();
			return;
		}
		if (!special_keys.includes(key)) {
			if (in_title) {
				close_title_screen();
				main_input.textContent = "";
				this.interaction = true;
				this.disabled = true;
				this.bad_file = true;
				document.getElementById("main_cover").hidden = false;
				// document.getElementById("save_menu").showModal();
				document.getElementById("l1m").showModal();
				first_choice = true;
			} else if (char_selected) {
				this.progress();
			}
		}
	}
	// handles text that the user inputs
	handleTextInput (value) {
		if (this.__EMSTOP) {
			return;
		}
		// check if the player is in chapter two (currently not needed)
		// if (this.chapter === 1) {
		// 	this.hTIC2(value);
		// }
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
				name_text.textContent = "The Stupider Dev";
				badPerson = true;
			} else {
				name_text.textContent = value;
			}
			save.setItem("name", value);
			this.inType = 1;
			// shows the character select screen
			const cs = document.getElementById("char_select");
			cs.showModal();
			// shows character information
			displayChar();
			// hides the name input
			document.getElementById("name_input").close();
			// saves
			// save.save();
			// allows the game to start
			this.disabled = false;
		// handles input for choices
		} else if (this.inType === 1) {
			if (Number(value).toString() !== "If you see this there is a problem and you need to fix the problem") {
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
	new_game_startup () {
		if (this.__EMSTOP) {
			return;
		}
		// prevents the game from progressing while the user is entering their name
		this.disabled = true;
		this.inType = 0;
		this.reset_chapter_1();
		document.getElementById("name_input").showModal();
	}
	// provides a way to stop the game and alert the user in the event that any error thrown because of a mismatch between expected data and actual data given to any part of the game, notably the renderer for chapter two receiving an invalid chunk
	errorStop () {
		this.__EMSTOP = true;
		alert("a fatal error has occured");
	}
}

// initializes the game
let game = new Game();
// loads the starting level
game.load("option");

function name_entered (e) {
	if (e.toString() !== "[object KeyboardEvent]") {
		return;
	}
	if (e.code.toString() !== "Enter" || document.getElementById("name-enterer").value.length === 0) {
		return;
	}
	game.handleTextInput(document.getElementById("name-enterer").value);
	document.getElementById("name-enterer").value = "";
}

// stuff
document.getElementById("name-enterer").addEventListener("keyup",name_entered);

// event handler for text the user has entered
function handleTextInput (e) {
	if (e.toString() !== "[object KeyboardEvent]") {
		return;
	}
	if (e.code.toString() !== "Enter" || main_input.value.length === 0) {
		return;
	}
	game.handleTextInput(main_input.value);
}

// sets up the event listener
main_input.addEventListener("keyup", handleTextInput);

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
	sound_disabled = !sound_disabled;
	if (sound_disabled) {
		game.stopSounds();
	} else {
		game.startSounds();
	}
}

function open_promo () {
	// prevents the game from continuing in the background
	game.disabled = true;
	game.interaction = true;
	// shows the promo screen
	document.getElementById("promo_screen").hidden = false;
	document.getElementById("l1m").close();
	document.getElementById("main_cover").hidden = true;
}

function close_promo () {
	// allows the game to continue
	game.disabled = false;
	game.interaction = false;
	// hides the promo screen
	document.getElementById("promo_screen").hidden = true;
	document.getElementById("l1m").showModal();
	document.getElementById("main_cover").hidden = false;
}