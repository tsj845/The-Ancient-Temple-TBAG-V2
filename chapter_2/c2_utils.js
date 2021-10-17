// the tiles that make up the game
const c2_game_tiles = document.getElementById("c2-game-tiles");
// player image
const player_img = c2_game_tiles.children[0];
// help text
const c2_help_text = document.getElementById("c2-help-text");

// contains constants and utility functions
class C2UTILS {
	constructor () {
		// list of tile ids considered solid
		this.solids = [1, 2];
		// list of tile ids considered items
		this.items = [4];
		// list of tile ids that support meta data
		this.supportmeta = [2, 4, 5];
		// IMPORTANT: a mapping may contain any custom set of keys and sprites but EVERY mapping MUST HAVE the key value "E":"sprites/empty.png", this is used to add padding to chunks which would otherwise be too small, and, if missing, could result in the game not being able to function in chapter two
		// initial sprite mapping for the renderer
		this.em_mapping = {
			"E":"sprites/empty.png",
		};
	}
	// sets help text
	set_help (text) {
		// clears old text
		c2_help_text.replaceChildren();
		// splits text into blocks every second block will be inside a <kbd> element
		let raw = text.split("¨");
		// stores if this block should be in a <kbd> element
		let kbd = true;
		// loops over blocks
		for (let i = 0; i < raw.length; i ++) {
			// checks that this block has text in it
			if (raw[i].length === 0) {
				continue;
			}
			// toggles the kbd variable
			kbd = !kbd;
			// creates a span
			const e = document.createElement("span");
			// checks if this block should be in a <kbd> element
			if (kbd) {
				// creates a kbd
				const e2 = document.createElement("kbd");
				// sets text
				e2.textContent = raw[i];
				// adds the kbd to the span
				e.appendChild(e2);
			} else {
				// sets text
				e.textContent = raw[i];
			}
			// adds the span to the help text
			c2_help_text.appendChild(e);
		}
	}
}

const c2utils = new C2UTILS();

let sx = 0;
let sy = 0;
let ex = 0;
let ey = 0;
let dx = 0;
let dy = 0;

let phstop = false;

// repeats a string the specified number of times
function ppos_rs (s, n) {
	let f = "";
	for (let i = 0; i < n; i ++) {
		f += s;
	}
	return f;
}

// does reliable division by powers of 10
function ppos_hfix (n, l) {
	// pads n to correct length
	n = n.toString();
	if (n.length < l) {
		n = ppos_rs("0", l-n.length) + n;
	}
	let n2 = [];
	// adds decimal
	for (let p = 0; p < Math.min(n.length,l); p ++) {
		// adds decimal at index 1
		if (p === 1) {
			n2.push(".");
		}
		n2.push(n[p]);
	}
	// joins n2 to a single string
	n = n2.join("");
	// checks that things havn't gone wrong
	if (n === "Infinity") {
		phstop = true;
	}
	// returns the modified value of n
	return Number(n);
}

// does a move
function ppos_helper () {
	if (phstop) {
		return;
	}
	const l = 3;
	sx += dx;
	sy += dy;
	// console.log(sx);
	// gets sx / 100
	ix = ppos_hfix(sx, l);
	// gets sy / 100
	iy = ppos_hfix(sy, l);
	player_img.style.cssText = "--x:"+ix+";--y:"+iy+";";
	// console.log(sx, sy, ex, ey, dx, dy);
	let finished = false;
	// checks if the move is complete or if the program has overshot the target
	if (sx === ex && sy === ey) {
		finished = true;
	} else if (dx > 0 && sx > ex) {
		dx = 0;
		sx = ex;
	} else if (dx < 0 && sx < ex) {
		dx = 0;
		sx = ex;
	} else if (dy > 0 && sy > ey) {
		dy = 0;
		sy = ey;
	} else if (dy < 0 && sy < ey) {
		dy = 0;
		sy = ey;
	}
	if (finished) {
		game.movelock = false;
		game.move_end();
		return;
	}
	// if the move is not complete wait 5 milliseconds and run this function again
	setTimeout(ppos_helper, 5);
}

// handles rendering in chapter two
class C2RENDERER {
	constructor () {
		// the size of the tile grid
		this.board_size = null;
		// sprite mapping
		this.mapping = c2utils.em_mapping;
		// temporary layout
		this.temp_layout = null;
		// chunk coordinates
		this.cx = 0;
		this.cy = 0;
		// help text
		this.help_text = {};
	}
	// sets a tile to the specified value
	set_tile (x, y, v) {
		// sets tile
		this.temp_layout[y][x] = v;
		// re-renders the chunk to display the tile
		this.render_chunk(this.cx, this.cy);
	}
	// moves the player smoothly between two positions
	move_player (ox, oy, x, y) {
		// the decimal place being modified
		const inc = 100;
		// start x
		sx = (ox%this.board_size)*inc;
		// start y
		sy = (oy%this.board_size)*inc;
		// end x
		ex = (x%this.board_size)*inc;
		// end y
		ey = (y%this.board_size)*inc;
		// delta x
		dx = (sx !== ex ? (sx < ex ? 1 : -1) : 0);
		// delta y
		dy = (sy !== ey ? (sy < ey ? 1 : -1) : 0);
		// console.log(sx, sy, ex, ey, dx, dy);
		// start move
		ppos_helper();
	}
	// sets the player position without smoothing
	set_player_position (x, y) {
		player_img.style.cssText = "--x:"+(x%this.board_size).toString()+";--y:"+(y%this.board_size).toString()+";";
	}
	// resizes the tile grid
	_resize_board (size) {
		// sets internal board size
		this.board_size = size;
		// clears old tiles
		c2_game_tiles.replaceChildren();
		// updates the size css property
		c2_game_tiles.style.cssText = "--size:"+size.toString()+";";
		// fills the board
		for (let y = 0; y < size; y ++) {
			for (let x = 0; x < size; x ++) {
				// creates image
				const img = document.createElement("img");
				// sets class
				img.className = "c2-board-img";
				// sets position
				img.style.cssText = "--x:"+x.toString()+";--y:"+y.toString()+";";
				// adds image to the board
				c2_game_tiles.appendChild(img);
			}
		}
		// adds player image
		c2_game_tiles.appendChild(player_img);
	}
	// splits level data
	_split_data (data) {
		let l = [];
		for (let y = 0; y < data.length; y ++) {
			l.push(data[y].split(""));
		}
		return l;
	}
	// loads level
	load_level (data) {
		if (game.__EMSTOP) {
			return;
		}
		// gets chunk size
		const csize = data["chunk-size"];
		// temporary layout, changes to this layout are not permanent and can be reverted by reloading the level
		this.temp_layout = this._split_data(data["content"]);
		// sprite mapping
		const mapping = data["sprite-mapping"];
		// resizes the tile grid is needed
		if (csize !== this.board_size) {
			this._resize_board(csize);
		}
		// sets internal sprite mapping
		this.mapping = mapping;
		// gets help text
		const ht = data["help"];
		if (ht !== undefined) {
			this.help_text = ht;
		}
		// has the game run its level loading function
		game.set_level_data(data);
	}
	// renders the specified chunk
	render_chunk (chx, chy) {
		if (game.__EMSTOP) {
			return;
		}
		// sets chunk coordinates
		this.cx = chx;
		this.cy = chy;
		let helptext = this.help_text[chx+","+chy];
		helptext = (helptext === undefined ? "" : helptext);
		c2utils.set_help(helptext);
		// gets chunk size
		const chunk_size = this.board_size;
		// loops over images in the tile grid
		for (let y = 0; y < chunk_size; y ++) {
			for (let x = 0; x < chunk_size; x ++) {
				// stores if the tile should use the image source provided by sprite mapping or if the source should be retreived from meta data
				let defaultsrc = true;
				// checks if the tile has meta data
				if (game.labels[(y+chy*chunk_size)+"|"+(x+chx*chunk_size)] !== undefined) {
					// stores image source
					let src = "";
					// gets meta data
					const list = game.ldata[game.labels[(y+chy*chunk_size)+"|"+(x+chx*chunk_size)]];
					// loops over meta data
					for (let i = 0; i < list.length; i ++) {
						// checks if the meta data is an image source to use
						if (list[i][0] === 4) {
							// sets source
							src = list[i][1];
							// ensures the source isn't overridden by the default source
							defaultsrc = false;
							break;
						}
					}
					// sets image source
					c2_game_tiles.children[y*chunk_size+x].src = src
				}
				// if the source provided by sprite mapping should be used
				if (defaultsrc) {
					// sets image source
					c2_game_tiles.children[y*chunk_size+x].src = this.mapping[this.temp_layout[y+this.cy*chunk_size][x+this.cx*chunk_size]];
				}
			}
		}
	}
}

const renderer = new C2RENDERER();