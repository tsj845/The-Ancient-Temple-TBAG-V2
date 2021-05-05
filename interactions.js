let player_coins = 0;

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
		if (Math.random() >= this.dodge) {
			raw = raw - Math.ceil((raw*(Math.min(this.def+this.tempD,15)*5)+this.getChaRedux())/100);
			console.log(raw, "refined damage");
			if (this.abs > 0) {
				if (this.abs > raw) {
					this.abs -= raw;
					return;
				} else {
					raw -= this.abs;
					this.abs = 0;
				}
			}
			this.health -= raw;
		}
		this.tempD = 0;
	}
	getLHBonus () {
		return 20 * ((this.health/this.maxHealth)*100 <= 30);
	}
	isPersuaded (cha) {
		if (cha >= 10) {
			return true;
		}
		if (cha < 0) {
			return false;
		}
		return Math.floor(Math.random()*100) > 100-(cha*5+this.getLHBonus());
	}
}

const mobs = {"test":[{"h":20,"d":1,"a":1,"c":1,"s":0},"default test mob","sprites/enemies/book.png",0],"statue":[{"h":10,"a":2,"d":4,"c":0,"s":0},"guardian statue","sprites/enemies/statue.png",10]};

const player = new Entity();
player.setStats({"h":20,"d":1,"a":5,"c":1,"s":0});

class CombatRunner {
	constructor () {
		this.enemy = new Entity();
		this.enName = "undefined";
		this.over = false;
		this.turn = false;
		this.player_won = true;
		this.coin_drops = 0;
	}
	end () {
		if (this.player_won) {
			// handle enemy loot
			player_coins += this.coin_drops;
		} else {
			// handle player losses
		}
		document.getElementById("combat_screen").hidden = false;
		game.endInteraction();
	}
	start (args) {
		this.enemy.setStats(args[2]);
		this.enName = args[3];
		send("combat_screen","O:IN,R:CB,M:#combat_enemy_img?src="+args[4]);
		document.getElementById("combat_screen").hidden = false;
		this.over = false;
		this.turn = true;
		this.player_won = true;
		this.coin_drops = args[5];
		send("combat_screen","O:IN,R:CB,M:#enemy_health?html_attr=max:="+this.enemy.maxHealth.toString());
		send("combat_screen","O:IN,R:CB,M:#enemy_health?html_attr=value:="+this.enemy.maxHealth.toString());
	}
	checkDead () {
		if (this.enemy.health <= 0) {
			this.over = true;
		}
		if (player.health <= 0) {
			this.over = true;
		}
	}
	fightEnd () {
		document.getElementById("combat_screen").hidden = true;
		execAfterDelay(this.end, 2500);
	}
	choice (cid) {
		console.log(cid, "combat choice", this.turn);
		if (!this.turn) {
			return;
		}
		this.turn = false;
		if (cid === 0) {
			// player chose to attack
			this.enemy.takeDamage(player.att+5);
		} else if (cid === 1) {
			// player chose to defend
			player.tempD = player.def;
		} else if (cid === 2) {
			// player chose to persuade
			if (this.enemy.isPersuaded(player.cha+player.tempC)) {
				this.enemy.health = 0;
			}
		} else if (cid === 3) {
			// player chose to flee
		}
		update_combat();
		this.checkDead();
		if (!this.over) {
			this.takeEnemyTurn();
		}
	}
	takeEnemyTurn () {
		if (this.turn) {
			return;
		}
		player.takeDamage(this.enemy.att);
		update_combat();
		this.checkDead();
		if (!this.over) {
			this.turn = true;
		} else {
			this.player_won = false;
		}
	}
}

const combatRunner = new CombatRunner();