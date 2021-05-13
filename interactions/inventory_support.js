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
	send("O:EQ,R:IN,M:$rarity_class="+rarity_class);
	const d1 = document.createElement("div");
	d1.setAttribute("class", "table_item");
	const d2 = document.createElement("div");
	d2.style = "background:"+border+";";
	d1.appendChild(d2);
	const d3 = document.createElement("div");
	/*d3.style = "background:"+background+";";*/
	d3.setAttribute("class", "content "+rarity_class);
	const d4 = document.createElement("div");
	d4.setAttribute("class", "fore1 display "+rarity_class);
	const d5 = document.createElement("div");
	d5.setAttribute("class", "fore2 display "+rarity_class);
	send("O:EQ,R:IN,M:$d4c="+d4.getAttribute("class")+", d5c="+d5.getAttribute("class"));
	const img = document.createElement("img");
	img.src = src;
	d3.appendChild(img);
	d3.appendChild(d4);
	d3.appendChild(d5);
	d2.appendChild(d3);
	document.getElementById("inventory").appendChild(d1);
	d3.setAttribute("onclick","slot_click("+(document.getElementById("inventory").children.length-1).toString()+")");
}

function set_slot (src, index, rc, rot) {
	if (rot === undefined) {
		rot = 0;
	}
	const container = document.getElementById("inventory").children[index].children[0].children[0];
	container.setAttribute("class", "content "+rc);
	container.children[0].src = src;
	container.children[1].setAttribute("class", "fore1 display "+rc);
	container.children[2].setAttribute("class", "fore2 display "+rc);
	container.children[1].style.cssText = "transform:rotate("+rot.toString()+"deg);";
	container.children[2].style.cssText = "transform:rotate("+rot.toString()+"deg);";
}

function remove_slot () {
	const inven = document.getElementById("inventory");
	inven.removeChild(inven.children[inven.children.length-1]);
}

function update_item_info (args) {
	//
}