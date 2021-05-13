const no_sword = ["empty","","sword","normal",0,0,0,0];
const no_shield = ["empty","","shield","normal",0,0,0,0];
const no_armor = ["empty","","armor","normal",0,0,0,0];

class EquipRunner {
	constructor () {
		this.inventory = [loot_dict["normal"][0], null, null, null];
		this.body_slots = {"sword":no_sword,"shield":no_shield,"armor":no_armor};
	}
	update_inventory () {
		for (let i = 0; i < this.inventory.length; i ++) {
			const item = this.inventory[i];
			if (item === null) {
				send("equip_screen","O:IN,R:EQ,M:=,"+i.toString()+",empty");
			} else {
				send("equip_screen","O:IN,R:EQ,M:="+item[1]+","+i.toString()+","+item[3]);
			}
		}
	}
	format_item_info (data) {
		return data[0]+";"+data[2]+";"+data[3]+";"+data[4].toString()+";"+data[5].toString()+";"+data[6].toString()+";"+data[7].toString();
	}
	slot_click (args) {
		console.log(args);
		const slot = Number(args[0]);
		const data = this.inventory[slot];
		if (data === null) {
			return;
		}
		const outbound = this.format_item_info(data);
		console.log("INFO:\n",outbound);
		send("equip_screen","O:IN,R:EQ,M:^"+outbound);
	}
	open () {
		game.disabled = true;
		game.interaction = true;
		document.getElementById("equip_screen").hidden = false;
	}
	close () {
		document.getElementById("equip_screen").hidden = true;
		game.interaction = false;
		game.disabled = false;
	}
}

let equipRunner = new EquipRunner();