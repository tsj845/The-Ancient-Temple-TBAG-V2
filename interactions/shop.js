class ShopRunner {
	constructor () {
		this.items = [loot_dict["normal"][0],null,null];
	}
	update_items () {
		for (let i = 0; i < this.items.length; i ++) {
			// console.log(i);
			const item = this.items[i];
			if (item === null) {
				send("shop_screen","O:IN,R:SH,M:=,"+i.toString()+",empty");
			} else {
				send("shop_screen","O:IN,R:SH,M:="+item[1]+","+i.toString()+","+item[3]+","+item[8].toString());
			}
		}
	}
	buy_item (args) {
		const slot = Number(args[0]);
		const index = equipRunner.inventory.indexOf(null);
		// makes sure that there is room in the player's inventory
		if (index === -1) {
			// TODO: give feedback to user
			return;
		}
		// not enough money to buy item
		if (player_coins < 10) {
			return;
		}
		// pay
		player_coins -= 10;
		equipRunner.inventory[index] = this.items[slot];
		this.items[slot] = null;
		this.update_items();
		// TODO: save game after purchase
	}
	slot_click (args) {
		const slot = Number(args[0]);
		// checks to make sure the slot both exists and is occupied
		if ([null, undefined].includes(this.items[slot])) {
			return;
		}
		const data = this.items[slot];
		const outbound = equipRunner.format_item_info(data);
		send("shop_screen","O:IN,R:SH,M:^"+outbound);
	}
	open () {
		if (!char_selected) {
			return;
		}
		game.disabled = true;
		game.interaction = true;
		document.getElementById("shop_screen").hidden = false;
		send("shop_screen","O:IN,R:SH,M:#coin_count?text="+player_coins.toString());
		this.update_items();
	}
	close () {
		game.disabled = false;
		game.interaction = false;
		document.getElementById("shop_screen").hidden = true;
	}
}

let shopRunner = new ShopRunner();