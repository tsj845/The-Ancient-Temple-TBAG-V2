function add_slot (src, background, border, rarity_class) {
	if (background === undefined) {
		background = "black";
	}
	if (border === undefined) {
		border = "white";
	}
	if (rarity_class === undefined) {
		rarity_class = "rnorm";
	}
	const d1 = document.createElement("div");
	d1.setAttribute("class", "table_item");
	const d2 = document.createElement("div");
	d2.style = "background:"+border+";";
	d1.appendChild(d2);
	const d3 = document.createElement("div");
	d3.setAttribute("class", "content "+rarity_class);
	const d4 = document.createElement("div");
	d4.setAttribute("class", "fore1 display "+rarity_class);
	const d5 = document.createElement("div");
	d5.setAttribute("class", "fore2 display "+rarity_class);
	const img = document.createElement("img");
	img.src = src;
	d3.appendChild(img);
	d3.appendChild(d4);
	d3.appendChild(d5);
	d2.appendChild(d3);
	document.getElementById("inventory").appendChild(d1);
	// const oc = "slot_click("+(document.getElementById("inventory").children.length-1).toString()+")";
	const v = document.getElementById("inventory").children.length-1;
	d1.addEventListener("click",function(){slot_click(v)});
}

function set_slot (src, index, rc, rot) {
	if (rot === undefined) {
		rot = 0;
	}
	const container = document.getElementById("inventory").children[index].children[0].children[0];
	container.className = "content "+rc;
	container.children[0].src = src;
	container.children[1].className = "fore1 display "+rc;
	container.children[2].className = "fore2 display "+rc;
	const styling = "transform:rotate("+rot.toString()+"deg);";
	container.children[1].style.cssText = styling;
	container.children[2].style.cssText = styling;
}

function update_equipped (slot, src, rc, rot) {
	if (rot === undefined) {
		rot = "0";
	}
	const container = document.getElementById("equip_slots").children[Number(slot)].children[0].children[0].children[0];
	container.className = "content "+rc;
	container.children[0].src = src;
	container.children[1].className = "fore1 display "+rc;
	container.children[2].className = "fore2 display "+rc;
	const styling = "transform:rotate("+rot+"deg);";
	container.children[1].style.cssText = styling;
	container.children[2].style.cssText = styling;
}

function remove_slot () {
	const inven = document.getElementById("inventory");
	inven.removeChild(inven.children[inven.children.length-1]);
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

let current_tab = 1;

const tabids = ["items", "equipment"];

function _switch_tab (n) {
	if (n === current_tab) {
		return;
	}
	document.getElementById(tabids[current_tab]).hidden = true;
	document.getElementById(tabids[n]).hidden = false;
	current_tab = n;
}