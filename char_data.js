	// holds data about characters
const char1 = ["sprites/chars/character.png", "Raisin:\nHuge boost to ATK stat (+4)\n\n\nRaisin comes from a village of great warriors! She has been fighting since she was two years old.",5,2,1];
const char2 = ["sprites/chars/character2.png", "Strawberry:\nHuge boost to CHA stat (+4)\n\n\nStrawberry doesn't know where she came from! She woke up one day in the woods and has lived there ever since.",2,1,5];
const char3 = ["sprites/chars/character3.png", "Madeleine:\nHuge boost to DEF stat (+4)\nMedium boost to ATK stat (+2)\n\nMadeleine comes from a country far to the east! She is incredibly agile.",4,5,1];
// promo characters
const pastry_char = ["sprites/chars/pastry.gif","Pastry:\nUnworldly boost to CHA stat (+7)\nMedium boost to ATK stat (+2)\nMedium boost to DEF stat (+2)\n\nPastry is the most skilled sorceress in the world. Her power of persuasion is unbeatable! But right now, she has to get to class.",2,2,7];
const raspberry_char = ["sprites/chars/raspberry.gif","Rasperry:\nIDK man, this is just a placeholder",0,0,0];
const dragon_fruit_char = ["sprites/chars/dragonfruit.gif","Dragonfruit:\nGigantic boost to ATK stat (+6)\nGigantic boost to ATK stat (+6)\nGigantic boost to CHA stat (+6)\n\nThe legendary paragon Dragonfruit, guardian of the forest, has risen once more! She is the pinnacle of attack, defense, and kindness. No one can parallel her skill! ",6,6,6];
const italian_ice_char = ["sprites/chars/italianice.png","Italian Ice:\nMassive boost to ATK stat (+5)\nMedium boost to ATK stat (+2)\nHuge boost to CHA stat (+4)\n\nItalian Ice comes from Crystallia, far in the north! She is quite adept at both persuading her enemies with money and attacking them with ice.",5,2,4];
const jellyfrog_char = ["sprites/chars/jellyfrog.png","Jelly Frog:\nGigantic boost to DEF stat (+7)\nLarge boost to ATK stat (+3)\n\nJelly Frog comes from the jungle! She is a master of speed, and dodges everything thrown at her.",3,6,0];
const sunrise_char = ["sprites/chars/sunrise.png","Sunrise:\nGigantic boost to DEF stat (+6)\nMedium boost to ATK stat (+2)\nSmall boost to CHA stat (+1)\n\nSunrise is the first of the two guards of Dragonfruit! She is a bulwark on the battlefield, and although hit by many blows, she never falters!",2,6,1];
const sunset_char = ["sprites/chars/sunset.png","Sunset:\nGigantic boost to ATK stat (+6)\nMedium boost to DEF stat (+2)\nTiny boost to CHA stat (+1)\n\nSunset is the second of the two guards of Dragonfruit! She is a blazing dragon on the battlefield, and tears through her enemies with terrifying efficiency!",6,2,1];
const kaguya_char = ["sprites/chars/kaguya.png","Kaguya:\nGigantic boost to DEF stat (+6)\nGigantic boost to CHA stat (+6)\n\nKaguya is the priestess of the merpeople. She is a conscientuous objector to battle, unless it is absolutely necessary. She tries to persuade her enemies with everything she's got.",0,6,6];
// latte is unobtainable until CH. 2, when you get her for free at a cutscene
const latte_char = ["sprites/chars/companion.png","Latte:\nMassive boost to ATK stat (+5)\nMassive boost to CHA stat (+5)\nTiny boost to DEF stat (+1)\n\nLatte has been wandering the labyrinth for a long while now, searching for the monster that murdered all of her students except for Pastry. She has promised the spirits of her students that she will slay the Demonbream, or die trying.",5,1,5];

// list of characters that can be obtained in gacha
const promo_char_lst = [pastry_char,raspberry_char,jellyfrog_char,italian_ice_char,dragon_fruit_char,sunrise_char,sunset_char,kaguya_char,latte_char];

// list of characters that the user can select at the start of the game
let char_lst = [char1, char2, char3];


function unlockChar (args) {
	console.log(args);
	const ind = Number(args[0]);
	if (char_lst.indexOf(promo_char_lst[ind]) !== -1) {
		return;
	}
	char_lst.push(promo_char_lst[ind]);
	// trigger save
}