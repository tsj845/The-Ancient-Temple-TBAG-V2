let player_coins = 0;

function randrange(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
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
		//console.log("you idiot, now you gonna die");
		if (!(Math.random() >= this.dodge)) {
			//console.log("yeet! you yoted yourself and ran the dodge mechanic! yote yeet yate!");
			raw = raw - Math.ceil((raw*(Math.min(this.def+this.tempD,15)*5)+this.getChaRedux())/100);
			console.log(raw, "refined damage");
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
		if (cha >= 10) {
			return true;
		}
		if (cha < 0) {
			return false;
		}
		return Math.floor(Math.random()*100) > 100-(cha*5+this.getLHBonus());
	}
}

const mobs = {"test":[{"h":10,"d":0,"a":1,"c":0,"s":0},"John, but really really evil","sprites/enemies/bosses/book.png",-1],"statue":[{"h":15,"a":4,"d":4,"c":0,"s":0},"Mysterious Statue","sprites/enemies/basic/statue.png",0], "book":[{"h":17,"d":1,"a":4,"c":0,"s":4},"Book of the Seas","sprites/enemies/bosses/book.png",-1]};

const player = new Entity();
player.setStats({"h":20,"d":1,"a":5,"c":1,"s":0});

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
	}
	getLoot () {
		switch (this.enemyLevel) {
			case -1:
				return [0,[]];
			case 0:
				return [randrange(10,51),[]];
			case 1:
				return [randrange(50,91),[]];
			case 2:
				return [randrange(115,181),[]];
			case 3:
				return [300,[]];
			default:
				console.log("invalid enemy level: ", this.enemyLevel);
				return;
		}
	}
    end () {
		if (!this.over) {
			return;
		}
		player.health = player.maxHealth;
		update_combat();
		if (this.player_won) {
			console.log("player won");
			// handle enemy loot
			console.log("Loot:\n", this.getLoot());
		} else {
			// handle player losses
			// put the player before the fight
			game.blockIndex -= 2;
		}
		document.getElementById("combat_screen").hidden = true;
		game.endInteraction();
	}
	start (args) {
		send("combat_screen","O:IN,R:CB,M:#combat_dialog?text=START BATTLE!");
		this.enemy.setStats(args[2]);
		this.enName = args[3];
		send("combat_screen","O:IN,R:CB,M:#combat_enemy_img?src="+args[4],false);
		document.getElementById("combat_screen").hidden = false;
		this.over = false;
		this.turn = true;
		this.player_won = true;
		this.enemyLevel = args[5];
		send("combat_screen","O:IN,R:CB,M:#enemy_health?html_attr=max:="+this.enemy.maxHealth.toString(),false);
		send("combat_screen","O:IN,R:CB,M:#enemy_health?html_attr=value:="+this.enemy.maxHealth.toString(),false);
	}
	checkDead () {
		if (this.enemy.health <= 0) {
			this.over = true;
		}
		if (player.health <= 0) {
			this.over = true;
		}
	}
	choice (cid) {
		console.log(cid, typeof cid, "combat choice", this.turn);
		if (!this.turn) {
			return;
			send("combat_screen","O:IN,R:CB,M:#combat_dialog?text=BEGIN BATTLE!");
		}
		this.turn = false;
		let dmg = 0;
		if (cid === 0) {
			// player chose to attack
			dmg = this.enemy.takeDamage(player.att);
			console.log(dmg);
			send("combat_screen","O:IN,R:CB,M:#combat_dialog?text=You attacked the enemy! You dealt "+dmg.toString()+" damage!");
		} else if (cid === 1) {
			// player chose to defend
			player.tempD = player.def;
			send("combat_screen","O:IN,R:CB,M:#combat_dialog?text=You defended yourself! You reduced the enemy's damage this turn!");
		} else if (cid === 2) {
			// player chose to persuade
			if (this.enemy.isPersuaded(player.cha+player.tempC)) {
				send("combat_screen","O:IN,R:CB,M:#combat_dialog?text=You successfully persuaded the enemy to join you!");
				this.enemy.health = 0;
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
		send("combat_screen","O:IN,R:CB,M:#enemy_health?html_attr=value:="+this.enemy.health.toString());
		this.checkDead();
		if (!this.over) {
			execAfterDelay(enTurn, 2500);
		} else {
			execAfterDelay(endFight, 2500);
		}

	}
	takeEnemyTurn () {
		if (this.turn) {
			return;
		}
		const dmg = player.takeDamage(this.enemy.att);
		update_combat();
		send("combat_screen","O:IN,R:CB,M:#combat_dialog?text="+this.enName+" attacked you! It dealt you "+dmg.toString()+" damage!");
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
