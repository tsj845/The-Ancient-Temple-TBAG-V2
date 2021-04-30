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