function set_slot (src, index, rc, rot) {
	if (rot === undefined) {
		rot = 0;
	}
	const container = document.getElementById("shop_slots").children[index].children[0].children[0];
	container.className = "content "+rc;
	container.children[0].src = src;
	container.children[1].className = "fore1 display "+rc;
	container.children[2].className = "fore2 display "+rc;
	const styling = "transform:rotate("+rot.toString()+"deg);";
	container.children[1].style.cssText = styling;
	container.children[2].style.cssText = styling;
}

function update_item_info (args) {
	item_click = false;
	const container = document.getElementById("item_info_container");
	container.hidden = false;
	document.getElementById("item_info_name").textContent = args[0];
	document.getElementById("item_info_type").textContent = args[1];
	let rarity = undefined;
	try {
		rarity = {"rnorm":"Normal","rfine":"Fine","rmagi":"Magical","rmyth":"Mythical","dev":"Unobtainable"}[args[2]];
	} catch (err) {}
	rarity = (rarity === undefined) ? "Unobtainable" : rarity;
	document.getElementById("item_info_rarity").textContent = rarity;
	document.getElementById("item_info_atk").textContent = (args[3][0] === "-" ? args[3] : "+"+args[3]);
	document.getElementById("item_info_def").textContent = (args[4][0] === "-" ? args[4] : "+"+args[4]);
	document.getElementById("item_info_cha").textContent = (args[5][0] === "-" ? args[5] : "+"+args[5]);
	document.getElementById("item_info_shield").textContent = (args[6][0] === "-" ? args[6] : "+"+args[6]);
}