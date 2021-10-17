// multiplier for cost based on attack increase
const a_cost_mult = 1.25;
// multiplier for cost based on defense increase
const d_cost_mult = 1.5;
// multiplier for cost based on charisma increase
const c_cost_mult = 2;
// multiplier for cost based on shield increase
const s_cost_mult = 3.75;


class ShopRunner {
	constructor () {
		this.items = [];
		this.max_items = 5;
	}
	generate_items () {
		if (this.items.length >= this.max_items) {
			return;
		}
		for (let i = 0; i < randrange(1,this.max_items-this.items.length); i ++) {
			this.items.push(choice(loot_dict[choice(["normal","fine","magical"])]));
		}
		// trigger save
	}
	// displays items and their stats
	update_items () {
		let f = [];
		for (let i = 0; i < this.items.length; i ++) {
			f.push(this.items[i][0]);
		}
		send("shop_screen","O:IN,R:SH,M:%"+f.join("|"));
	}
	// calculates the price of an item
	get_price (data) {
		// multiplier for item type
		const type_cost = {"sword":2,"shield":1.5,"armor":1}[data[2].toLowerCase()];
		// multiplier for item rarity
		const rarity_multiplier = {"rnorm":1,"rfine":2,"rmagi":3,"rmyth":10,"dev":1}[data[3]];
		// cost of stats boosted by item
		const stat_cost = (data[4]*a_cost_mult) + (data[5]*d_cost_mult) + (data[6]*c_cost_mult) + (data[7]*s_cost_mult);
		// returns calculated price
		return Math.round((stat_cost*type_cost)+rarity_multiplier);
	}
	// buys an item
	buy_item (args) {
		// gets the item that was clicked
		const slot = Number(args[0]);
		// gets the index of the first "null" value in the inventory
		const index = equipRunner.inventory.indexOf(null);
		// makes sure that there is room in the player's inventory
		if (index === -1) {
			// TODO: give feedback to user
			return;
		}
		// calculates the item's price
		const price = this.get_price(this.items[slot]);
		console.log(price);
		// not enough money to buy item
		if (player_coins < price) {
			return;
		}
		player_coins -= price;
		// updates the coin counters
		document.getElementById("coin_count").children[1].textContent = player_coins.toString();
		send("shop_screen","O:IN,R:SH,M:#coin_count?text="+player_coins.toString());
		// adds the item to the inventory
		equipRunner.inventory[index] = this.items[slot];
		// removes the item from the shop
		this.items.splice(slot,1);
		// updates the shop to display the items
		this.update_items();
		// TODO: save game after purchase
	}
	// handles a slot being clicked
	slot_click (args) {
		// gets the slot
		const slot = Number(args[0]);
		// checks to make sure the slot both exists and is occupied
		if ([null, undefined].includes(this.items[slot])) {
			return;
		}
		// gets the item data
		const data = this.items[slot];
		// formats the item data
		let outbound = equipRunner.format_item_info(data);
		// appends the item's calculated price to the info
		outbound += "+"+this.get_price(data).toString()+"+"+data[1];
		// updates the item info
		send("shop_screen","O:IN,R:SH,M:^"+outbound);
	}
	// opens the shop
	open () {
		// makes sure the player has selected a character
		if (!char_selected) {
			return;
		}
		const shop_theme = document.getElementById("shop_theme");
		// starts theme from the beginning
		shop_theme.currentTime = 0;
		if (!sound_disabled) {
			shop_theme.play();
		}
		// stocks the shop for the first time when there are no items
		if (this.items.join("") === "") {
			this.generate_items();
		}
		// prevents the game from continuing in the background
		game.disabled = true;
		game.interaction = true;
		// shows the shop screen
		document.getElementById("shop_screen").hidden = false;
		// updates the coin counter and selects the first slot
		send("shop_screen","O:IN,R:SH,M:#coin_count?text="+player_coins.toString()+";O:IN,R:SH,M:&");
		// updates the items
		this.update_items();
	}
	// closes the shop
	close () {
		// allows the game to continue
		game.disabled = false;
		game.interaction = false;
		// hides the shop screen
		document.getElementById("shop_screen").hidden = true;
		document.getElementById("shop_theme").pause();
		if (!sound_disabled) {
			game.c_sound.play();
		}
		// updates player coins
		document.getElementById("coin_count").children[1].textContent = player_coins.toString();
	}
}

// initializes the shop
let shopRunner = new ShopRunner();