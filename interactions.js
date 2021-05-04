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
	}
	setStats (stats) {
		this.health = stats["h"];
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
			console.log(raw);
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
	isPersuaded (cha) {
		if (cha >= 10) {
			return true;
		}
		if (cha < 0) {
			return false;
		}
		return Math.floor(Math.random()*100) > 100-(cha*5+20);
	}
}

const mobs = {"test":[{"h":10,"d":1,"a":1,"c":1,"s":0},"default test mob","sprites/enemies/book.png"]};

const player = new Entity();
player.setStats({"h":20,"d":1,"a":5,"c":1,"s":0});

class CombatRunner {
	constructor () {
		this.enemy = new Entity();
		this.enName = "undefined";
		this.over = false;
		this.turn = false;
	}
	end (player_won) {
		if (player_won) {
			// handle enemy loot
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
		}
	}
}

const combatRunner = new CombatRunner();