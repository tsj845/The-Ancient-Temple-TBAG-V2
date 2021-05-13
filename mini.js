// gets a reference to the div that holds the minimap
const main_div = document.getElementById("minimap_div");

// used to create 2D arrays 
function makeList (rc, cc) {
	let b = [];
	for (let r = 0; r < rc; r ++) {
		let l = [];
		for (let c = 0; c < cc; c ++) {
			l.push(null);
		}
		b.push(l);
	}
	return b;
}

// supporting class for the minimap
function setUpImg (x, y) {
	img = document.createElement("img");
	img.style = "--abs_x:"+x.toString()+";--abs_y:"+y.toString()+";";
	img.src = "minimap/minimap_empty.png";
	img.setAttribute("class", "map_tile");
	main_div.appendChild(img);
	return img;
}

// holds all relavent properties and sets the appearence of the minimap
class Minimap {
	// initializes the minimap and populates it
	constructor () {
		this.size = 5;
		this.board = makeList(this.size, this.size);
		for (let y = 0; y < this.size; y ++) {
			for (let x = 0; x < this.size; x ++) {
				this.board[y][x] = setUpImg(x,y);//new Tile(x, y, "minimap/minimap_empty.png");
			}
		}
	}
	// sets a tile at a position
	setTile (x, y, c) {
		this.board[y][x].src = c;
	}
	// sets the appearence of the entire minimap
	load (tiles) {
		for (let y = 0; y < this.size; y ++) {
			for (let x = 0; x < this.size; x ++) {
				this.setTile(x, y, tiles[y][x]);
			}
		}
	}
}

// decodes UNICODE characters into a usable array of image source paths
class Decoder {
	constructor () {
		this.hallway_decoding = {"─":"minimap/minimap_h_hall.png","│":"minimap/minimap_v_hall.png","┘":"minimap/minimap_lu_corner.png","┐":"minimap/minimap_ld_corner.png","└":"minimap/minimap_ru_corner.png","┌":"minimap/minimap_rd_corner.png","┴":"minimap/minimap_t_lru.png","┤":"minimap/minimap_t_lud.png","┬":"minimap/minimap_t_lrd.png","├":"minimap/minimap_t_rud.png","┼":"minimap/minimap_cross.png"," ":"minimap/minimap_empty.png"};
	}
	decode (map_design) {
		console.log("\x1b[38;2;255;155;0mSTART DECODE\x1b[39m\n");
		let final = makeList(map_design.length, map_design[0].length);
		for (let y = 0; y < map_design.length; y ++) {
			for (let x = 0; x < map_design[0].length; x ++) {
				final[y][x] = this.hallway_decoding[map_design[y][x]];
			}
		}
		return final;
	}
}

let minimap = new Minimap();
let decoder = new Decoder();

const test_map_1 = ["  │  ",
					"  │  ",
					"  └┐ ",
					"  ┌┘ ",
					"  │  "];

const f = decoder.decode(test_map_1);