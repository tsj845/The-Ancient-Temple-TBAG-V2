let player_coins = 0;
let stick_durability = 2;

function randrange (min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}

function choice (lst) {
	return lst[randrange(0, lst.length)];
}

class Entity {
	constructor () {
		this.health = 10;
		this.def = 0;
		this.att = 0;
		this.cha = 0;
		this.abs = 0;
		this.tempD = 0;
		this.tempA = 0;
		this.tempC = 0;
		this.dodge = 1;
		this.maxHealth = 10;
		this.is_player = false;
		this.type = "null";
		this.special_attack_counter = 0
	}
	get_stat (stat_name) {
		// const eq = equipRunner.get_stat_boosts()[{"attack":0,"defend":1,"charisma":2,"shield":3,"health":0}[stat_name]];
		// console.log(eq);
		switch (stat_name) {
			case "health":
				return this.health;
			case "attack":
				return this.tempA+this.att;
			case "defend":
				return this.tempD+this.def;
			case "charisma":
				return this.tempC+this.cha;
			case "shield":
				return this.abs;
		}
		return 0;
	}
	setStats (stats) {
		this.health = stats["h"];
		this.maxHealth = stats["h"];
		this.def = stats["d"];
		this.att = stats["a"];
		this.cha = stats["c"];
		this.abs = stats["s"];
	}
	getChaRedux () {
		const cha = this.cha + this.tempC;
		if (cha >= 5) {
			return Math.min(cha, 10);
		}
		return 0;
	}
	takeDamage (raw) {
		if (!(Math.random() >= this.dodge)) {
			raw = raw - Math.ceil((raw*(Math.min(this.def+this.tempD,15)*5)+this.getChaRedux())/100);
			// console.log(raw, "refined damage", this.is_player);
			if (this.abs > 0) {
				if (this.abs > raw) {
					this.abs -= raw;
					return raw;
				} else {
					raw -= this.abs;
					this.abs = 0;
				}
			}
			this.health -= raw;
			return raw;
		}
		this.tempD = 0;
		return 0;
	}
	getLHBonus () {
		return 20 * ((this.health/this.maxHealth)*100 <= 30);
	}
	isPersuaded (cha) {
		if (this.cha === -1) {
			return false;
		}
		// console.log(cha);
		if (cha >= 10) {
			return true;
		}
		if (cha < 0) {
			return false;
		}
		return Math.floor(Math.random()*100) > 100-(cha*5+this.getLHBonus());
	}
}

const mobs = {
	"test":[
		{"h":1,"d":0,"a":0,"c":0,"s":0},
		"John, but really really evil",
		"sprites/enemies/bosses/book.png",
		2,
	],
	"statue":[
		{"h":20,"a":4,"d":4,"c":0,"s":0},
		"Mysterious Statue",
		"sprites/enemies/basic/statue.png",
		0,
	],
	"book":[
		{"h":17,"d":1,"a":4,"c":0,"s":6},
		"Book of the Seas",
		"sprites/enemies/bosses/book.png",
		-1,
	],
	"dragonfruit":[
		{"h":33,"d":4,"a":3,"c":0,"s":10},
		"Dragonfruit",
		"sprites/chars/dragonfruit.gif",
		2,
	],
	"slime":[
		{"h":5,"d":0,"a":1,"c":0,"s":0},
		"Slime",
		"sprites/c2sprites/tiles/enemies/tile_enemy.png",
		0,
	],
	"wolf":[
		{"h":10,"d":2,"a":5,"c":-1,"s":0},
		"Wolf",
		"sprites/c2sprites/tiles/enemies/tile_enemy.png",
		0,
	],
	"skeleton":[
		{"h":10,"d":0,"a":3,"c":2,"s":0},
		"Skeleton",
		"sprites/c2sprites/tiles/enemies/tile_enemy.png",
		0,
	],
	"zombie":[
		{"h":7,"d":0,"a":2,"c":-1,"s":0},
		"Zombie",
		"sprites/c2sprites/tiles/enemies/tile_enemy.png",
		0,
	],
};

const player = new Entity();
player.is_player = true;
player.setStats({"h":20,"d":1,"a":1,"c":1,"s":0});

function endFight () {
	combatRunner.end();
}

function enTurn () {
	combatRunner.takeEnemyTurn();
}

class CombatRunner {
	constructor () {
		this.enemy = new Entity();
		this.enName = "undefined";
		this.enemyLevel = 0;
		this.over = false;
		this.turn = false;
		this.player_won = true;
		this.operations = [];
		this.timekeep = [];
	}
	getArmorBonus (stat_name) {
		return equipRunner.get_stat_boosts()[{"attack":0,"defend":1,"charisma":2,"shield":3}[stat_name]];
	}
	getLoot () {
		switch (this.enemyLevel) {
			case -1:
				return [75,[0,0,0]];
			case 0:
				return [randrange(10,51),[7,3,0]];
			case 1:
				return [randrange(50,91),[0,8,2]];
			case 2:
				return [randrange(115,181),[0,0,10]];
			case 3:
				return [300,[0,0,0]];
			default:
				// console.log("invalid enemy level: ", this.enemyLevel);
				return [0,[0,0,0]];
		}
	}
    end () {
		if (!this.over) {
			return;
		}
		player.abs = 0;
		player.health = player.maxHealth;
		update_combat();
		if (this.player_won) {
			if (equipRunner.body_slots["sword"][0] === "Coin On A Stick") {
				stick_durability -= 1;
				if (stick_durability === 0) {
					player_coins += 50000;
					equipRunner.body_slots["sword"] = no_sword;
				}
			}
			// console.log("player won");
			// handle enemy loot
			const loot = this.getLoot();
			let drops = [];
			player_coins += loot[0];
			console.log("Loot:\n", loot);
			document.getElementById("coin_count").children[1].textContent = player_coins.toString();
			const d1 = Math.floor(Math.random() * 10);
			const d2 = Math.floor(Math.random() * 10);
			const d3 = Math.floor(Math.random() * 10);
			if (d1 < loot[1][0]) {
				drops.push(choice(loot_dict["normal"]));
			}
			if (d2 < loot[1][1]) {
				drops.push(choice(loot_dict["fine"]));
			}
			if (d2 < loot[1][2]) {
				drops.push(choice(loot_dict["magical"]));
			}
			if (this.enemyLevel === 3) {
				drops.push(loot_dict["mythic"][this.enName]);
			}
			console.log("Drops\n",drops);
		} else {
			// handle player losses
			// put the player before the fight
			game.blockIndex -= 2;
		}
		document.getElementById("combat_screen").hidden = true;
		game.endInteraction();
	}
	start (args) {
		player.abs += this.getArmorBonus("shield");
		send("combat_screen","O:IN,R:CB,M:#combat_dialog?text=START BATTLE!;O:IN,R:CB,M:#combat_enemy_img?src="+args[4]+";O:IN,R:CB,M:#shield_stat?text="+player.abs.toString());
		this.enemy.setStats(args[2]);
		this.enName = args[3];
		document.getElementById("combat_screen").hidden = false;
		this.over = false;
		this.turn = true;
		this.player_won = true;
		this.enemyLevel = args[5];
		send("combat_screen","O:IN,R:CB,M:#enemy_health?html_attr=max:="+this.enemy.maxHealth.toString()+";O:IN,R:CB,M:#enemy_health?html_attr=value:="+this.enemy.maxHealth.toString()+";O:IN,R:CB,M:#en_shield_1?html_attr=max:="+this.enemy.abs.toString()+";O:IN,R:CB,M:#en_shield_1?html_attr=value:="+this.enemy.abs.toString());
		if (this.enemy.abs > 0) {
			send("combat_screen","O:IN,R:CB,M:#en_shield_1?hidden=false");
		} else {
			send("combat_screen","O:IN,R:CB,M:#en_shield_1?hidden=true");
		}
	}
	checkDead () {
		if (this.enemy.health+this.enemy.abs <= 0) {
			this.over = true;
		}
		if (player.health <= 0) {
			this.over = true;
		}
	}
	choice (cid) {
		// console.log(cid, typeof cid, "combat choice", this.turn);
		if (!this.turn) {
			return;
			send("combat_screen","O:IN,R:CB,M:#combat_dialog?text=BEGIN BATTLE!");
		}
		this.turn = false;
		let dmg = 0;
		if (cid === 0) {
			// player chose to attack
			dmg = this.enemy.takeDamage(player.get_stat("attack"));
			// console.log(dmg);
			send("combat_screen","O:IN,R:CB,M:#combat_dialog?text=You attacked the enemy! You dealt "+dmg.toString()+" damage!");
		} else if (cid === 1) {
			// player chose to defend
			player.tempD = player.def;
			send("combat_screen","O:IN,R:CB,M:#combat_dialog?text=You defended yourself! You reduced the enemy's damage this turn!");
		} else if (cid === 2) {
			let pr = 1;
			if (this.enemyLevel === 2) {
				pr = 2;
			} else if (this.enemyLevel === 3) {
				pr = 4;
			}
			// player chose to persuade
			if (this.enemy.isPersuaded(Math.round((player.get_stat("charisma"))/pr))) {
				send("combat_screen","O:IN,R:CB,M:#combat_dialog?text=You successfully persuaded the enemy to join you!");
				this.enemy.health = 0;
				this.enemy.abs = 0;
			} else {
				send("combat_screen","O:IN,R:CB,M:#combat_dialog?text=You attempted to persuade the enemy, but they wouldn't listen to you!");
			}
		} else if (cid === 3) {
			// player chose to flee
			send("combat_screen","O:IN,R:CB,M:#combat_dialog?text=You ran away... :(");
			player.health = 0;
			this.player_won = false;
		}
		update_combat();
		send("combat_screen","O:IN,R:CB,M:#enemy_health?html_attr=value:="+this.enemy.health.toString()+";O:IN,R:CB,M:#en_shield_1?html_attr=value:="+this.enemy.abs.toString());
		this.checkDead();
		if (!this.over) {
			this.operations.push("et");
		} else {
			this.operations.push("ef");
		}
		this.timekeep.push(execAfterDelay(function(){combatRunner.doOp()}, 2500));
	}
	click () {
		console.log("click");
		if (this.operations.length > 0) {
			this.doOp();
		}
	}
	doOp () {
		const op = this.operations[0];
		this.operations.splice(0,1);
		clearTimeout(this.timekeep[0]);
		this.timekeep.splice(0,1);
		if (op === "et") {
			if (!this.over) {
				this.takeEnemyTurn();
			}
		} else if (this.over) {
			for (let i = 0; i < this.timekeep.length; i ++) {
				clearInterval(this.timekeep[i]);
			}
			this.operations = [];
			this.timekeep = [];
			this.end();
		}
	}
	takeEnemyTurn () {
		if (this.turn) {
			return;
		}
		this.enemy.special_attack_counter += 1;
		this.enemy.special_attack_counter = this.enemy.special_attack_counter % 3;
		let mult = (this.enemy.special_attack_counter === 0 ? 3 : 1);
		if (player.tempD >= player.def) {player.tempD -= player.def;mult = 1}
		const dmg = player.takeDamage(this.enemy.att*mult);
		update_combat();
		send("combat_screen","O:IN,R:CB,M:#combat_dialog?text="+this.enName+(mult>1?" did a special attack!":" attacked you!")+" It dealt you "+dmg.toString()+" damage!");
		this.checkDead();
		if (!this.over) {
			this.turn = true;
		} else {
			this.player_won = false;
			execAfterDelay(endFight, 2500);
		}
	}
}

const combatRunner = new CombatRunner();

document.getElementById("combat_screen").addEventListener("click", combatRunner.click);