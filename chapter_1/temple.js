const temple_file_lines = [["head", "TEMPLE"],"You walk in through the doors of the temple. You are in a long and wide hallway, the walls of which appear to be actually made of water! Every now and then, the water is illuminated by the light of a pale pink orb. You can see the shapes of turtles, fish, and other sea life swimming around in the water. At the end of the room, there's another door, in front of which floats a book. However, the walls are intriguing -- should you look at them first? It won't take much time at all...", ["option", ["investigate walls", "read book"], ["INWALLPATH", "BOOKPATH"]],["label","INWALLPATH"],"You decide to take a closer look at the walls, which are indeed made out of water! How interesting! You reach out to touch one of the pink orbs, which comes away and floats in your hand. Always a good idea to have some illumination!", "You got the LUMEN ORB.", ["label","BOOKPATH"],"The book floats up to you as you walk toward it. It appears to be in characters of a language you don't know ,but as you take it in your hands, the letters rearrange themselves, and it reads, \"Welcome to the Temple of Kaguya, traveler. I am the last vestiges of the merpeople. May I tell you my story?\"","\"Long ago, the merpeople were a thriving population. We lived in all the seas of the world, and happily coexisted with humans. But, with no warning, an ancient, monstrous beast rose from the ocean floor, and wreaked havoc among our people. Almost all of us died, and those who did not hurriedly built this temple for our link to the gods, the priestess Kaguya. Unfortunately, the Demonbream saw her as a threat to its power, and took up residence inside our own temple, with Kaguya as its prisoner. You must help her, for without her, every last one of the merpeople shall fall!\"",["label","ACCEPTCHOICE"],"Accept the quest?",["option", ["yes", "no"], ["ACCEPTPATH", "DENYPATH"]],["label","DENYPATH"],"You have better things to do with your time. Like sitting and doing absolutely nothing as you starve to death, for example, because it's not like you can do anything else here. . .","Hint from the devs: If you want to play a story game, don't say NO to the main quest of the entire game. Now, GET OUT OF HERE. (you died)",["goto","ACCEPTCHOICE"],["label","ACCEPTPATH"],"You accept the quest! After all, haven't you always wanted to be a hero? The book rearranges its letters once more. \"Thank you, most kind traveler. Beyond this door lies a sprawling maze of traps and trials that the Demonbream with its great and terrible power has created. Once you cross through that door, I can no longer help you. I would also suggest finding a weapon with which you can fight with! I will give you a rusted sword, which is the only thing I have, but there are surely better weapons in his lair. Find one!...","...Because you must learn how to fight, I will give you a trial before you enter this door. Defeat my statue, and I will know that you are strong enough to have a chance to save Kaguya. Have at you!\"", ["sound", "boss_theme_1"], "BOSS APPROACHING", "It's time for a boss fight! Would you like a tutorial?",["option", ["yes", "no"], ["COMBATTUTORIALPATH","FIGHTSTART"]],["label","COMBATTUTORIALPATH"],"You will always have 3 options -- defend, attack, or persuade!", "Defending is what you do when it looks like they are going to attack. Attacking is what you do when they are hanging back. Persuade is something you can do when they are very, VERY low on HP to gain their allegiance!",["label","FIGHTSTART"],"BEGIN!","\"Have at you!\" Mystic Book approaches! It looks like it is going to attack!",["option", ["attack", "defend", "persuade"], ["ATT1", "DEF1", "PER1"]],["label","ATT1"],"You died! Oh no!",["goto","FIGHTSTART"],["label","DEF1"],"That was the right thing to do! You block the hit, stunning the book!",["goto","COMBATCHOICE2"],["label","PER1"],"Why... would you do that?","Haha, no, you died.",["goto","FIGHTSTART"],["label","COMBATCHOICE2"],"\"Have at you!\" Mystic Book approaches! It looks like it is hanging back!",["option", ["attack", "defend", "persuade"], ["ATT2", "DEF2", "PER2"]],["label","ATT2"],"That was the right thing to do! You land a stunning blow on the book, which skitters backward!",["goto","COMBATCHOICE3"],["label","DEF2"],"That was stupid. You tried to defend yourself, and the book, seeing how utterly stupid you were, unleashed its true power and threw you off the edge of the bridge into the water below.",["goto","FIGHTSTART"],["label","PER2"],". . . Why? It isn't weak . . . Yeah, the Devs killed you because that was annoying. Don't do that next time.",["goto","FIGHTSTART"],["label","COMBATCHOICE3"],"\"Argh. . .\" Mystic Book approaches! It looks very, very weak...",["pgoto","route=-1",["SECRET","NON_SECRET"]],["label","NON_SECRET"],["option", ["attack", "defend", "persuade"],["ATT3", "DEF3", "PER3"]],["label","SECRET"],["option", ["attack", "defend", "persuade", "???@&*#ff00ff"],["ATT3", "DEF3", "PER3", "???"]],["label","ATT3"],"That was... a good thing to do!", "You struck the book with all your might! The book split in half.", ["sound", "youwin"], "BOSS BATTLE WON!","Your route has changed to the DESTRUCTION ROUTE.",["goto","FIGHTEND2"],["label","DEF3"],"Why?","Why did you do that?","You're dead. You shouldn't be playing story games.",["goto","FIGHTSTART"],["label","???"],"You whisper a word in the language of the Ancients, and your blade glows with light. A single strike severs the book in two, burning the pages into nothing.", ["sound", "namey"], ["goto", "FIGHTEND?"],["label","PER3"],"That was a good thing to do! \"You are most certainly wise,\" says the book.","Book is now loyal to you!", ["sound", "youwin"], "BOSS BATTLE WON!", "Your route has changed to the PURE ROUTE.","\"That was a strong hit. . . Weakening me to the point of that with a single blow shows your strength. You must save Kaguya!\"","The doors swing open. You walk forward into the unknown, determined with hope already to save a person you don't know. . .",["goto","CONTENTEND"],["label","FIGHTEND2"],"The doors swing open. You walk forward into the unknown, determined with furious anger to save a person you don't know. . .", ["goto", "CONTENTEND"], ["label","FIGHTEND?"], ["sound", "youwin"], "BOSS BATTLE WON!", ["sound", "namey"], "Welcome. It's surprising that you've made it back here; no one but you has ever been here twice. ", "It is also most intriguing that you realized that that 'book' was your enemy all along . . . Everyone in this temple is your enemy except that Priestess girl, Sun Li. But you know that already.", "I presume that you go to save her, anyway? Yes. . . That's the type of person you are. Your soul is pure.", "Now that you have been here a second time, it is inevitable that you are here a third. However, you won't be able to get here without the Kaguya girl.", "You have a weapon powerful enough to destroy that fish in a single strike. After you kill it, we shall speak again. There is something you are destined to do that you cannot do without the girl.", "I will see you again. . . soon. Goodbye.", "Clouds fill your vision, and then you are in front of the temple doors again. With a single swipe of your blade, they shatter, and you walk through the broken archway, determined with awoken power to save a person you don't know.", ["label", "CONTENTEND"], "End of CHAPTER 1", ["chapter","2","labyrinth1"]];

const temple_file_inven = [];

const temple_file = {"lines":temple_file_lines, "inven":temple_file_inven};