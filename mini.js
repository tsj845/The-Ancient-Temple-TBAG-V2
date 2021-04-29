console.log("mini.js L1");

const main_div = document.getElementById("minimap_div");

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

function lhl (l1, l2) {
	return l1.includes(l2);
	l2 = l2.toString();
	for (let i = 0; i < l1.length; i ++) {
		if (l1[i].toString() === l2) {
			return true;
		}
	}
	return false;
}

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

class Minimap {
	constructor () {
		this.size = 5;
		this.board = makeList(this.size, this.size);
		for (let y = 0; y < this.size; y ++) {
			for (let x = 0; x < this.size; x ++) {
				this.board[y][x] = new Tile(x, y, /*"#ffffff88"*/"minimap/minimap_empty.png");
			}
		}
		//console.log(this.board[0][0].img.complete);
		//while (!this.board[0][0].completed) {}
	}
	setTile (x, y, c) {
		this.board[y][x].setValue(c);
	}
	load (tiles) {
		for (let y = 0; y < this.size; y ++) {
			for (let x = 0; x < this.size; x ++) {
				this.setTile(y, x, tiles[y][x]);
			}
		}
	}
}

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

function onLoadHandler (e) {
	document.getElementById("loading_screen").hidden = true;
	document.getElementById("text_input").focus();
	document.getElementById("title_screen").contentWindow.postMessage("start_music","*");
}

window.addEventListener("load", onLoadHandler);