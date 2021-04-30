// this file just happens to be the one that handles showing the title screen
let ls_lfin = false;
let ts_lfin = false;

// gets a reference to the div that holds the minimap
const main_div = document.getElementById("minimap_div");

// used to create 2D arrays
function makeList (rc, cc) {
	let b = [];
	let l = [];
	for (let c = 0; c < cc; c ++) {
		l.push(null);
	}
	for (let r = 0; r < rc; r ++) {
		b.push(l);
	}
	return b;
}

// supporting class for the minimap
class Tile {
	constructor (x, y, c) {
		this.x = x;
		this.y = y;
		this.img = document.createElement("img");
		this.img.style = "--abs_x:"+x.toString()+";--abs_y:"+y.toString()+";";
		this.img.src = c;
		this.img.setAttribute("class", "map_tile");
		main_div.appendChild(this.img);
	}
	setValue (c) {
		this.img.src = c;
	}
}

// holds all relavent properties and sets the appearence of the minimap
class Minimap {
	// initializes the minimap and populates it
	constructor () {
		this.size = 5;
		this.board = makeList(this.size, this.size);
		for (let y = 0; y < this.size; y ++) {
			for (let x = 0; x < this.size; x ++) {
				this.board[y][x] = new Tile(x, y, "minimap/minimap_empty.png");
			}
		}
	}
	// sets a tile at a position
	setTile (x, y, c) {
		this.board[y][x].setValue(c);
	}
	// sets the appearence of the entire minimap
	load (tiles) {
		for (let y = 0; y < this.size; y ++) {
			for (let x = 0; x < this.size; x ++) {
				this.setTile(y, x, tiles[y][x]);
			}
		}
	}
}

// decodes ACSII art into a usable array of image source paths
class Decoder {
	constructor () {
		this.decoding = {"?":false," ":false,"0":false,"1":true};
	}
	decode (map_design) {
		let map = makeList(map_design.length, map_design[0].length);
		let final = makeList(map_design.length, map_design[0].length);
		for (let y = 0; y < map_design.length; y ++) {
			for (let x = 0; x < map_design[0].length; x ++) {
				map[y][x] = this.decoding[map_design[y][x]];
			}
		}
		for (let y = 0; y < map.length; y ++) {
			for (let x = 0; x < map[0].length; x ++) {
				//
			}
		}
	}
}

let minimap = new Minimap();
//let decoder = new Decoder();

const test_map_1 = ["  1  ",
					"  1  ",
					"  1  ",
					"  1  ",
					"  1  "];

//decoder.decode(test_map_1);

// closes the loading screen
function closeLoadingScreen () {
	document.getElementById("loading_screen").hidden = true;
	// stops the user from noticing a jump in animation progress
	execAfterDelay(startMusic,250);
}

function startMusic () {
	send("title_screen","O:IN,R:TS,M:start_music");
}

function onLoadHandler (e) {
	// checks to make sure that everything is loaded
	if (!ls_lfin || !ts_lfin) {
		return;
	}
	// closes the loading screen 4 seconds after everything finishes loading, this is so that the loading screen doesn't disappear as soon as it's finished loading
	execAfterDelay(closeLoadingScreen,4000);
}

// sets up the event listener
window.addEventListener("load", onLoadHandler);