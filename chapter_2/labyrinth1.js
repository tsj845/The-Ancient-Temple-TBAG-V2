// to format a part of help text as a key surrond the section that you want formated with this character: "¨"

// level layout
const lab1_tile_map = [
	"WWWWWWWWWWWWWWW",
	"WIPPWWPPPWWWNWW",
	"WPPPDPPIPWWWPWW",
	"WPPPWWPPPWWWCWW",
	"WWDWWWWWWWWWPWW",
	"WWPWWWWWWWWWDWW",
	"WWPWWWWWWWWWPWW",
	"WWIPTWWWWWTPPWW",
	"WWWWWWWWWWWWWWW",
	"WWWWWWWWWWWWWWW",
	"WWWWWWWWWWWWWWW",
	"WPPTWWPPTWWPPTW",
	"WPPTWWPPTWWPPTW",
	"WPPTWWPPTWWPPTW",
	"WWWWWWWWWWWWWWW",
];

// labels
const lab1_label_map = [
	"1,1,0",
	"2,4,1",
	"2,7,2",
	"4,2,3",
	"7,2,4",
	"5,12,5",
	"7,4,6",
	"7,10,7",
	"3,12,8",
	"11,3,9",
	"12,3,10",
	"13,3,11",
	"11,8,12",
	"12,8,13",
	"13,8,14",
	"11,13,15",
	"12,13,16",
	"13,13,17",
];

// meta data
const lab1_data_map = {
	0:[[3,"key",1],[2,"P"]],
	1:[[1,"d"]],
	2:[[3,"key",3],[2,"P"]],
	3:[[1,"d"]],
	4:[[3,"key",5],[2,"P"]],
	5:[[1,"d"]],
	6:[[5,"1|12"]],
	7:[[5,"4|7"]],
	8:[[6,"statue","P"],[4,"sprites/c2sprites/tiles/key.png"]],
	9:[[5,"2|7"]],
	10:[[5,"2|7"]],
	11:[[5,"6|12"]],
	12:[[5,"2|7"]],
	13:[[5,"11|12"]],
	14:[[5,"2|7"]],
	15:[[5,"10|7"]],
	16:[[5,"2|7"]],
	17:[[5,"2|7"]],
};

// level data
const lab1_data = {
	// header
	"head":"LABYRINTH",
	// level layout
	"content":lab1_tile_map,
	// sounds
	"sounds":{
		"ambient-music":[],
		"ambient-sfx":[],
	},
	// sprite mapping
	"sprite-mapping":{
		"N":"sprites/c2sprites/tiles/portal.png",
		"E":"sprites/empty.png",
		"S":"sprites/empty.png",
		"W":"sprites/wall_1.png",
		"P":"sprites/empty.png",
		"D":"sprites/c2sprites/tiles/door_closed.png",
		"d":"sprites/c2sprites/tiles/door_open.png",
		"I":"sprites/c2sprites/tiles/key.png",
		"T":"sprites/c2sprites/tiles/active_portal.png",
		"t":"sprites/c2sprites/tiles/inactive_portal.png",
		"C":"sprites/c2sprites/tiles/enemies/tile_enemy.png",
	},
	// tile mapping
	"game-mapping":{
		"N":-1,
		"E":1,
		"W":1,
		"P":0,
		"D":2,
		"d":3,
		"I":4,
		"T":5,
		"t":6,
		"C":7,
	},
	// labels
	"labels":lab1_label_map,
	// meta data
	"l-data":lab1_data_map,
	// board size
	"chunk-size":5,
	// maximum horizontal chunk coordinate
	"x-dim":2,
	// maximum vertical chunk coordinate
	"y-dim":2,
	// start x
	"s-x":2,
	// start y
	"s-y":2,
	// help text
	"help":{
		"0,0":"use arrow keys or WASD to move, press space to pick up items",
		"0,1":"use ¨space¨ to activate teleporters"
	},
};