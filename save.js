const max_save_files = 3;

// const local = document.getElementById("external-saves").contentWindow.localStorage;
const local = window.localStorage;

// window.localStorage.clear();

if (!local.getItem("muted")) {
	local.setItem("unlocks","");
	local.setItem("acheivements","");
	local.setItem("muted","false");
}

function repeatString (string, times) {
	let f = "";
	for (let i = 0; i < times; i ++) {
		f += string;
	}
	return f;
}

class Save {
	constructor () {
		this.current_save = 0;
		this.last_body = Object.entries(equipRunner.body_slots).join();
		this.last_inven = equipRunner.inventory.join();
		this.last_coins = 0;
		this.last_shop = shopRunner.items.join();
		this.last_mute = false;
		this.last_position = -1;
		this.last_story_inven = game.inventory;
		this.last_unlocked = 3;
		this.last_fname = game.fname;
	}
	sc2 () {
		this.setItem("chapter", "1");
		this.save();
	}
	populate (slot) {
		if (slot > max_save_files-1) {
			return;
		}
		this.save();
		game.chapter = 0;
		this.current_save = slot;
		this.setItem("chapter", "0");
		this.setItem("name","");
		this.setItem("char","0");
		this.setItem("position","-1");
		this.setItem("inventory",repeatString("|null",10).slice(1));
		this.setItem("body","null|null|null");
		this.setItem("coins","0");
		this.setItem("shop","");
		this.setItem("story_inven","");
		this.setItem("story-file", "option");
		this.setItem("cbgmusic", "audios/silence.mp3|0|true");
		execAfterDelay(function(){save.load_save(slot,true)},250);
	}
	getItem (key, is_global) {
		is_global = (is_global === undefined) ? false : is_global;
		const prefix = (is_global) ? "" : "slot"+this.current_save.toString();
		return local.getItem(prefix+key);
	}
	setItem (key, value, is_global) {
		is_global = (is_global === undefined) ? false : is_global;
		const prefix = (is_global) ? "" : "slot"+this.current_save.toString();
		local.setItem(prefix+key,value);
	}
	format_item_list (lst) {
		const rarity_conversions = {"rnorm":"normal","rfine":"fine","rmagi":"magical","rmyth":"mythic","dev":"dev","empty":"empty"};
		let f = [];
		for (let i = 0; i < lst.length; i ++) {
			if (lst[i] !== null) {
				const rarity = rarity_conversions[lst[i][3]];
				// console.log(rarity);
				if (rarity === "empty") {
					f.push("null");
				} else {
					const ind = loot_dict[rarity].indexOf(lst[i]);
					f.push(rarity+","+ind.toString());
				}
			} else {
				f.push("null");
			}
		}
		return f.join("|");
	}
	unpack_item_list (lst) {
		// console.log(lst);
		if (lst === "") {
			return [];
		}
		lst = lst.split("|");
		// console.log(lst);
		let f = [];
		for (let i = 0; i < lst.length; i ++) {
			// console.log(lst[i], i);
			if (lst[i] === "null") {
				f.push(null);
			} else {
				const data = lst[i].split(",");
				f.push(loot_dict[data[0]][Number(data[1])]);
			}
		}
		return f;
	}
	load_save (save, a, save_prog) {
		if (game_running) {
			document.getElementById("save_menu").close();
		} else {
			game_running = true;
			document.getElementById("l1m-sl-menu").close();
			document.getElementById("l1m").close();
		}
		if (!Boolean(a)) {
			// can't load a save slot that shouldn't exist
			if (save > max_save_files-1) {
				return;
			}
			// saves the current state before loading, ensures no progress is lost
			this.save();
			this.current_save = save;
		} else if (!Boolean(save_prog)) {
			document.getElementById("main_cover").hidden = true;
			game.disabled = false;
			game.bad_file = false;
			game.interaction = false;
			game.new_game_startup();
			first_choice = false;
			this.current_save = save;
			return;
		}
		this.current_save = save;
		save = save.toString();
		// console.log("loading save: "+save);
		// load muted
		sound_disabled = {"true":true,"false":false}[this.getItem("muted",true)];
		// load background music
		const bgm_data = this.getItem("cbgmusic").split("|");
		game.c_sound.src = bgm_data[0];
		game.c_sound.currentTime = Number(bgm_data[1]);
		game.c_sound.loop = {"true":true,"false":false}[bgm_data[2]];
		if (!sound_disabled) {
			game.c_sound.play();
		}
		// load name
		name_text.textContent = this.getItem("name");
		// load coins
		player_coins = Number(this.getItem("coins"));
		// load chapter
		game.chapter = Number(this.getItem("chapter"));
		// load progress
		if (game.chapter === 0) {
			game.load(this.getItem("story-file"));
			game.blockIndex = Math.max(Number(this.getItem("position"))-1,-1);
		} else if (game.chapter === 1) {
			// has the game switch the UI to chapter two
			game.start_chapter_2(true);
			// sets player and chunk coordinates
			const packed = this.getItem("position").split("|");
			const nx = Number(packed[0]);
			const ny = Number(packed[1]);
			const ncx = (nx-(nx%renderer.board_size))/renderer.board_size;
			const ncy = (ny-(ny%renderer.board_size))/renderer.board_size;
			game.px = nx;
			game.py = ny;
			game.cx = ncx;
			game.cy = ncy;
			// loads inventory
			equipRunner.story_iven = this.getItem("c2in").split("|");
			// removes invalid item
			if (equipRunner.story_iven[0] === "") {
				equipRunner.story_iven.splice(0, 1);
			}
			// loads altered level layout
			let layout = [];
			const unalt = this.getItem("c2cl").split("|");
			for (let i = 0; i < unalt.length; i ++) {
				layout.push(unalt[i].split(","));
			}
			renderer.temp_layout = layout;
			game.c2_layout = layout;
			// loads labels
			const labels = this.getItem("c2lab").split("\xa8");
			const ldata = this.getItem("c2dat").split("\xa8");
			let flab = {};
			let fdat = {};
			// unpacks labels
			for (let i = 0; i < labels.length; i ++) {
				const pack = labels[i].split(",");
				flab[pack[0]] = Number(pack[1]);
			}
			// unpacks label data
			for (let i = 0; i < ldata.length; i ++) {
				let fd = [];
				const lst = ldata[i].split(":")[1].split("\xa9");
				for (let i2 = 0; i2 < lst.length; i2 ++) {
					let fd2 = lst[i2].split(",");
					// checks if a value is a number
					for (let i = 0; i < fd2.length; i ++) {
						const n = Number(fd2[i]);
						fd2[i] = n.toString() === "NaN" ? fd2[i] : n;
					}
					fd.push(fd2);
				}
				fdat[Number(ldata[i].split(":")[0])] = fd;
			}
			// sets labels and label data
			game.labels = flab;
			game.ldata = fdat;
			// renders updates
			renderer.render_chunk(ncx, ncy);
			renderer.set_player_position(nx, ny);
		}
		// hide text input
		game.hideInput();
		// update text
		game.interaction = false;
		if (!a || save_prog) {
			game.disabled = false;
			game.inType = 1;
			game.progress();
		}
		game.bad_file = false;
		// load character
		char = Number(this.getItem("char"));
		player.setStats({"h":20,"a":char_lst[char][2],"d":char_lst[char][3],"c":char_lst[char][4],"s":0});
		// load equipped
		const items = this.unpack_item_list(this.getItem("body"));
		const b = equipRunner.body_slots;
		if (items[0] === null) {
			b["sword"] = no_sword;
		} else {
			b["sword"] = items[0];
			player.att += items[0][4];
			player.def += items[0][5];
			player.cha += items[0][6];
			player.shield += items[0][7];
		}
		if (items[1] === null) {
			b["shield"] = no_shield;
		} else {
			b["shield"] = items[1];
			player.att += items[1][4];
			player.def += items[1][5];
			player.cha += items[1][6];
			player.shield += items[1][7];
		}
		if (items[2] === null) {
			b["armor"] = no_armor;
		} else {
			b["armor"] = items[2];
			player.att += items[2][4];
			player.def += items[2][5];
			player.cha += items[2][6];
			player.shield += items[2][7];
		}
		// update visual stats
		update_combat();
		// load inventory
		equipRunner.inventory = this.unpack_item_list(this.getItem("inventory"));
		// load shop
		shopRunner.items = this.unpack_item_list(this.getItem("shop"));
		// load promo chars
		const l = this.getItem("unlocks",true).split("|");
		for (let i = 0; i < l.length; i ++) {
			char_lst.push(promo_char_lst[Number(l[i])]);
		}
		if (!a || save_prog) {
			char_selected = true;
		}
	}
	save () {
		// saved coins
		if (player_coins != this.last_coins) {
			this.last_coins = player_coins;
			this.setItem("coins",player_coins.toString());
		}
		// save muted
		if (sound_disabled !== this.last_mute) {
			this.last_mute = sound_disabled;
			this.setItem("mute",sound_disabled.toString(),true);
		}
		// save background music
		this.setItem("cbgmusic", [game.c_sound.src,game.c_sound.currentTime,game.c_sound.loop].join("|"));
		// save chapter
		this.setItem("chapter", game.chapter.toString());
		// save progress
		if (game.chapter === 0) {
			if (game.blockIndex !== this.last_position) {
				this.last_position = game.blockIndex;
				this.setItem("position",game.blockIndex.toString());
			}
			if (game.fname !== this.last_fname) {
				this.last_fname = game.fname;
				this.setItem("story-file", game.fname);
			}
		} else if (game.chapter === 1) {
			// saves player position
			this.setItem("position", game.px.toString()+"|"+game.py.toString());
			// saves inventory
			this.setItem("c2in", equipRunner.story_iven.join("|"));
			// saves altered level layout
			let layout = [];
			for (let i = 0; i < renderer.temp_layout.length; i ++) {
				layout.push(renderer.temp_layout[i].join(","));
			}
			this.setItem("c2cl", layout.join("|"));
			// saves labels
			let labels = [];
			let ldata = [];
			const lkes = Object.keys(game.labels);
			for (let i = 0; i < lkes.length; i ++) {
				labels.push(lkes[i]+","+game.labels[lkes[i]]);
			}
			// saves label data
			const dkes = Object.keys(game.ldata);
			for (let i = 0; i < dkes.length; i ++) {
				const dat = game.ldata[dkes[i]]
				let fd = [];
				for (let i2 = 0; i2 < dat.length; i2 ++) {
					fd.push(dat[i2].join(","));
				}
				ldata.push(dkes[i]+":"+dat.join("\xa9"));
			}
			this.setItem("c2lab", labels.join("\xa8"));
			this.setItem("c2dat", ldata.join("\xa8"));
		}
		// save equipped
		const c_body = Object.entries(equipRunner.body_slots).join();
		if (c_body !== this.last_body) {
			this.last_inven = c_body;
			const b = equipRunner.body_slots;
			this.setItem("body",this.format_item_list([b["sword"],b["shield"],b["armor"]]));
		}
		// save inventory
		if (equipRunner.inventory.join() !== this.last_inven) {
			this.last_inven = equipRunner.inventory.join();
			this.setItem("inventory",this.format_item_list(equipRunner.inventory));
		}
		// save shop
		if (shopRunner.items.join() !== this.last_shop) {
			this.last_shop = shopRunner.items.join();
			this.setItem("shop",this.format_item_list(shopRunner.items));
		}
		// save unlocked chars
		if (char_lst.length !== this.last_unlocked) {
			this.last_unlocked = char_lst.length;
			let l = [];
			for (let i = 3; i < char_lst.length; i ++) {
				l.push(promo_char_lst.indexOf(char_lst[i]));
			}
			this.setItem("unlocked",l.join("|"),true);
		}
	}
}

let save = new Save();

function loadsave (slot) {
	document.getElementById("load_save_dialog").close();
	const s = save.current_save;
	save.current_save = slot-1;
	if (!save.getItem("name")) {
		save.current_save = s;
		// console.log(slot);
		return;
	}
	save.current_save = s;
	document.getElementById("save_menu").close();
	first_choice = false;
	save.load_save(slot-1, true, true);
	document.getElementById("main_cover").hidden = true;
}

function newgame (slot) {
	document.getElementById("overwrite_save_confirm").close();
	document.getElementById("new_game_dialog").close();
	save.populate(slot-1);
}

function confirm_ng (slot) {
	document.getElementById("overwrite_save_confirm").showModal();
	chosen_slot = slot;
}

let chosen_slot = 0;