const max_save_files = 1;

const session = window.sessionStorage;
const local = window.localStorage;

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
	}
	populate (slot) {
		const p = slot.toString();
		this.setItem("name","");
		this.setItem("char","null");
		this.setItem("position","-1");
		this.setItem("unlocks","");
		this.setItem("acheivements","");
		this.setItem("inventory",repeatString(",null",10).slice(1));
		this.setItem("body","null,null,null");
		this.setItem("coins","0");
		this.setItem("shop","null,null,null");
		this.setItem("muted","false");
		this.setItem("story_inven","");
	}
	getItem (key) {
		return local.getItem("slot"+this.current_save.toString()+key);
	}
	setItem (key, value) {
		local.setItem("slot"+this.current_save.toString()+key,value);
	}
	format_item_list (lst) {
		const rarity_conversions = {"rnorm":"normal","rfine":"fine","rmagi":"magical","rmyth":"mythic","dev":"dev","empty":"empty"};
		let f = [];
		for (let i = 0; i < lst.length; i ++) {
			if (lst[i] !== null) {
				const rarity = rarity_conversions[lst[i][3]];
				console.log(rarity);
				if (rarity === "empty") {
					f.push("null");
				} else {
					const ind = loot_dict[rarity].indexOf(lst[i]);
					f.push([rarity,ind]);
				}
			} else {
				f.push("null");
			}
		}
		return f.join("|");
	}
	unpack_item_list (lst) {
		lst = lst.split("|");
		let f = [];
		for (let i = 0; i < lst.length; i ++) {
			if (lst[i] === "null") {
				f.push(null);
			} else {
				const data = lst[i].split(",");
				f.push(loot_dict[data[0]][Number(data[1])]);
			}
		}
		return f;
	}
	load_save (save) {
		// can't load a save slot that shouldn't exist
		if (save > max_save_files-1) {
			return;
		}
		// saves the current state before loading, ensures no progress is lost
		this.save();
		this.current_save = save;
		save = save.toString();
		console.log("loading save: "+save);
		// load muted
		sound_disabled = {"true":true,"false":false}[this.getItem("muted")];
		// load coins
		player_coins = Number(this.getItem("coins"));
		// load progress
		game.blockIndex = Number(this.getItem("position"));
		// load equipped
		const items = this.unpack_item_list(this.getItem("body"));
		const b = equipRunner.body_slots;
		if (items[0] === null) {
			b["sword"] = no_sword;
		} else {
			b["sword"] = items[0];
		}
		if (items[1] === null) {
			b["shield"] = no_shield;
		} else {
			b["shield"] = items[1];
		}
		if (items[2] === null) {
			b["armor"] = no_armor;
		} else {
			b["armor"] = items[2];
		}
		// load inventory
		equipRunner.inventory = this.unpack_item_list(this.getItem("inventory"));
		// load shop
		shopRunner.items = this.unpack_item_list(this.getItem("shop"));
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
			this.setItem("mute",sound_disabled.toString());
		}
		// save progress
		if (game.blockIndex !== this.last_position) {
			this.last_position = game.blockIndex;
			this.setItem("position",game.blockIndex.toString());
		}
		// save equipped
		const c_body = Object.entries(equipRunner.body_slots).join();
		if (c_body !== this.last_body) {
			this.last_inven = c_ibody;
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
	}
}

let save = new Save();