class GachaRunner {
	constructor () {
		// do setup in here
	}
	open () {
		// anything that needs to happen when opened
		// prevents the game from continuing in the background
		game.disabled = true;
		game.interaction = true;
		// pauses the current background music
		game.c_sound.pause();
		// plays the gacha theme
		const gacha_battle_theme = document.getElementById("gacha_battle_theme");
		// starts theme from the beginning
		gacha_battle_theme.currentTime = 0;
		if (!sound_disabled) {
			gacha_battle_theme.play();
		}
		// shows the gacha screen
		document.getElementById("gacha_screen").hidden = false;
		document.getElementById("l1m").close();
		document.getElementById("main_cover").hidden = true;
	}
	close () {
		// anything that needs to happen when closed
		// allows the game to continue
		game.disabled = false;
		game.interaction = false;
		// pauses the gacha theme
		document.getElementById("gacha_battle_theme").pause();
		// resumes the current background music
		if (!sound_disabled) {
			game.c_sound.play();
		}
		// hides the gacha screen
		document.getElementById("gacha_screen").hidden = true;
		document.getElementById("l1m").showModal();
		document.getElementById("main_cover").hidden = false;
	}
}

const gachaRunner = new GachaRunner();