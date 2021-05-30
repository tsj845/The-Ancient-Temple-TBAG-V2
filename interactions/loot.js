const loot_dict = {"normal":[["Rusted Sword","sprites/equipment/swords/rustedsword.png","Sword","rnorm",1,0,0,0,-90],["Traveler's Sword","sprites/equipment/swords/travelersword.png", "Sword","rnorm",2,0,0,0,-90],["Traveler's Shield","sprites/equipment/shields/travelershield.png", "Shield","rnorm",0,2,0,0,0],["Traveler's Garb","sprites/equipment/armor/travelergarb.png", "Armor","rnorm",0,0,2,0,0]],"fine":[["Knight's Sword","sprites/equipment/swords/knightsword.png","Sword","rfine",3,0,0,0,-90]],"magical":[["Golden Scimitar","sprites/equipment/swords/goldenscimitar.png","Sword","rmagi",5,0,0,0,-90]],"mythic":[["Ludociel Fang","sprites/equipment/swords/ludocielfang.png","Sword","rmyth",900,0,0,0,0],["Mythic Shield","sprites/equipment/shields/etmanenki.png","Shield","rmyth",0,900,0,0,0],["Mythic Armor","sprites/equipment/armor/garmentsofthehero.png","Armor","rmyth",0,0,900,0,0]],"dev":[["Debug Stick","sprites/chars/shopvendor.png","Sword","dev",9999,9999,9999,9999,0]]};

const unlockable_equipment = [];

function unlock (index) {
	const item = unlockable[index];
	const ind = equipRunner.inventory.indexOf(null);
	if (ind === -1) {
		equipRunner.inventory.push(item);
	} else {
		equipRunner.inventory[ind] = item;
	}
}

/**
 * for equipment, put it in the loot dict, follow format:
 * 
 * ["name","image path","slot","rarity","attack bonus"(number),"defense bonus"(number),"charisma bonus"(number),"shield bonus"(number)]
**/