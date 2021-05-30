// which character is being viewed
let char = 0;

// reference to the preview image
const cpre = document.getElementById("char_preview");
// reference to the description text holder
const cdes = document.getElementById("char_description");

// displays the currently viewed character
function displayChar () {
	cpre.src = char_lst[char][0];
	const lines = char_lst[char][1].split("\n");
	cdes.replaceChildren();
	for (let i = 0; i < lines.length; i ++) {
		cdes.append(lines[i]);
		cdes.append(document.createElement("br"));
	}
}

// goes to the previous character
function p_char () {
	char -= 1;
	if (char === -1) {
		char += char_lst.length;
	}
	displayChar();
}

// goes to the next character
function n_char () {
	char += 1;
	if (char === char_lst.length) {
		char = 0;
	}
	displayChar();
}

// selects a character
function s_char () {
	document.getElementById("char_select").close();
	document.getElementById("char_display").src = char_lst[char][0];
	player.setStats({"h":20,"a":char_lst[char][2],"d":char_lst[char][3],"c":char_lst[char][4],"s":0});
	if (badPerson) {
		player.cha = -9999;
	}
	game.hideInput();
	update_combat();
	send("combat_screen","O:IN,R:CB,M:#combat_player_img?src="+char_lst[char][0]);
	send("equip_screen","O:IN,R:EQ,M:#character_img?src="+char_lst[char][0]);
	char_selected = true;
}

// updates stats and images
function update_combat () {
	const att = player.get_stat("attack").toString()+"/10";
	const def = player.get_stat("defend").toString()+"/10";
	const cha = player.get_stat("charisma").toString()+"/10";
	const health = player.get_stat("health").toString()+"/20";
	send("combat_screen","O:IN,R:CB,M:#att_stat?text="+att+";O:IN,R:CB,M:#def_stat?text="+def+";O:IN,R:CB,M:#per_stat?text="+cha+";O:IN,R:CB,M:#health_stat?text="+health+";O:IN,R:CB,M:#shield_stat?text="+player.abs.toString());
	document.getElementById("att_stat").textContent = att;
	document.getElementById("def_stat").textContent = def;
	document.getElementById("per_stat").textContent = cha;
	document.getElementById("health_stat").textContent = health;
	document.getElementById("shield_stat").textContent = player.abs.toString();
}

document.getElementById("char_select").addEventListener("open",displayChar);