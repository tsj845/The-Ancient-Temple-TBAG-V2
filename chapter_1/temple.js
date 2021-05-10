const temple_file_lines = [["head", "TEMPLE"], ["sound", "adventure2"], "You walk in through the doors of the temple. You are in a long and wide hallway, the walls of which appear to be actually made of water! Every now and then, the water is illuminated by the light of a pale pink orb. You can see the shapes of turtles, fish, and other sea life swimming around in the water. At the end of the room, there's another door, in front of which floats a book. However, the walls are intriguing -- should you look at them first? It won't take much time at all...", ["option", ["investigate walls", "read book"], ["INWALLPATH", "BOOKPATH"]],["label","INWALLPATH"],"You decide to take a closer look at the walls, which are indeed made out of water! How interesting! You reach out to touch one of the pink orbs, which comes away and floats in your hand. Always a good idea to have some illumination!", "You got the LUMEN ORB.", ["label","BOOKPATH"],"The book floats up to you as you walk toward it. It appears to be in characters of a language you don't know ,but as you take it in your hands, the letters rearrange themselves, and it reads, \"Welcome to the Temple of Kaguya, traveler. I am the last vestiges of the merpeople. May I tell you my story?\"","\"Long ago, the merpeople were a thriving population. We lived in all the seas of the world, and happily coexisted with humans. But, with no warning, an ancient, monstrous beast rose from the ocean floor, and wreaked havoc among our people. Almost all of us died, and those who did not hurriedly built this temple for our link to the gods, the priestess Kaguya. Unfortunately, the Demonbream saw her as a threat to its power, and took up residence inside our own temple, with Kaguya as its prisoner. You must help her, for without her, every last one of the merpeople shall fall!\"",["label","ACCEPTCHOICE"],"Accept the quest?",["option", ["yes", "no"], ["ACCEPTPATH", "DENYPATH"]],["label","DENYPATH"],"You have better things to do with your time. Like sitting and doing absolutely nothing as you starve to death, for example, because it's not like you can do anything else here. . .","Hint from the devs: If you want to play a story game, don't say NO to the main quest of the entire game. Now, GET OUT OF HERE. (you died)",["goto","ACCEPTCHOICE"],["label","ACCEPTPATH"],"You accept the quest! After all, haven't you always wanted to be a hero? The book rearranges its letters once more. \"Thank you, most kind traveler. Beyond this door lies a sprawling maze of traps and trials that the Demonbream with its great and terrible power has created. Once you cross through that door, I can no longer help you. I would also suggest finding a better weapon with which you can fight with! That rusted sword of yours is nowhere near strong enough to even cut the Demonbream's flesh.","I do not know how strong you are, so I will give you a trial before you enter this door. Defeat me, and I will know that you are strong enough to have a chance to save Kaguya. Have at you!\"", ["sound", "battle"], ["interaction", "combat", "book"], ["label", "CONTENTEND"], ["sound", "youwin"], "BOSS BATTLE WON!", "'...You are... most powerful,' the book says slowly. It moves aside for you, and you walk through the now-open doors, determined to save a person you've never met.", "End of CHAPTER 1"];//, ["chapter","2","labyrinth1"]];

const temple_file_inven = [];

const temple_file = {"lines":temple_file_lines, "inven":temple_file_inven};