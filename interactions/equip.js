const no_sword = ["empty","","sword","empty",0,0,0,0];
const no_shield = ["empty","","shield","empty",0,0,0,0];
const no_armor = ["empty","","armor","empty",0,0,0,0];

class EquipRunner {
	constructor () {
		this.inventory = [loot_dict["normal"][0], loot_dict["normal"][1], loot_dict["normal"][2], loot_dict["normal"][3], loot_dict["dev"][0]];
		this.body_slots = {"sword":no_sword,"shield":no_shield,"armor":no_armor};
	}
	get_stat_boosts () {
		let lst = [0,0,0,0];
		const keys = Object.keys(this.body_slots);
		for (let i1 = 0; i1 < keys.length; i1 ++) {
			const key = keys[i1];
			for (let i = 4; i < 8; i ++) {
				lst[i-4] = lst[i-4] + this.body_slots[key][i];
			}
		}
		return lst;
	}
	update_inventory () {
		for (let i = 0; i < this.inventory.length; i ++) {
			// console.log(i);
			const item = this.inventory[i];
			if (item === null) {
				send("equip_screen","O:IN,R:EQ,M:=,"+i.toString()+",empty");
			} else {
				send("equip_screen","O:IN,R:EQ,M:="+item[1]+","+i.toString()+","+item[3]+","+item[8].toString());
			}
		}
	}
	format_item_info (data) {
		return data[0]+"+"+data[2]+"+"+data[3]+"+"+data[4].toString()+"+"+data[5].toString()+"+"+data[6].toString()+"+"+data[7].toString();
	}
	slot_click (args) {
		// console.log("slot click args: ", args);
		const slot = Number(args[0]);
		const data = this.inventory[slot];
		if (data === null) {
			return;
		}
		const outbound = this.format_item_info(data);
		// console.log("INFO:\n",outbound);
		send("equip_screen","O:IN,R:EQ,M:^"+outbound);
	}
	equip_item (args) {
		// console.log("equip item args: ", args);
		const slot = Number(args[0]);
		if ([null, undefined].includes(this.inventory[slot])) {
			return;
		}
		const data = this.inventory[slot];
		const type = data[2].toLowerCase();
		let ind = "";
		try {
			ind = {"sword":"0","shield":"1","armor":"2"}[type];
		} catch (err) {
			return;
		}
		this.inventory[slot] = null;
		if (this.body_slots[type][3] !== "empty") {
			this.inventory[slot] = this.body_slots[type];
			const item = this.inventory[slot];
			player.att -= item[4];
			player.def -= item[5];
			player.cha -= item[6];
			send("equip_screen","O:IN,R:EQ,M:="+item[1]+","+slot.toString()+","+item[3]+","+item[8].toString());
		} else {
			this.inventory.splice(slot,1);
			this.inventory.push(null);
			this.update_inventory();
			// send("equip_screen","O:IN,R:EQ,M:+,"+slot.toString()+",empty,0");
		}
		this.body_slots[type] = data;
		player.att += data[4];
		player.def += data[5];
		player.cha += data[6];
		let out = [ind,data[1],data[3],data[8].toString()];
		send("equip_screen","O:IN,R:EQ,M:&"+out.join("|"));
	}
	open () {
		game.disabled = true;
		game.interaction = true;
		document.getElementById("equip_screen").hidden = false;
		this.update_inventory();
	}
	close () {
		document.getElementById("equip_screen").hidden = true;
		game.interaction = false;
		game.disabled = false;
		update_combat();
	}
}

let equipRunner = new EquipRunner();