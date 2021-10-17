const illuminated_lines = [["head","AD-SHAHAIRA"], ["img","sprites/env/adshahaira.png"], "However, you remember something that gives you hope and that is the orb that is resting in your pocket. You pull it out, and it flares into light, showing your location into clear relief.", ["sound", "namey"], "You are in a circular room, with 8 doors leading from the room. Without a lamp, it would be impossible to see the details on each of the doors. Investigating leads you to see that while 7 doors are marked with the sigil of a corpse, the 8th has a torch. It seems an easy decision, but what if that door is the only one that leads to death? What will you do? Which will you choose?", ["label", "CHOICE1"], ["option",["The Torch","The Body"],["TORCHPATH","INSTADEATH"]], ["label", "INSTADEATH"], "You've decided that the torch archway looks a little bit frightening, and you've never liked fire much. You think that going into a hallway marked with a corpse is a smarter option than one with a torch. Definitely a good idea!", "You walk confidently through the door, feeling that your choice was the right one. The moment your foot crosses the threshold, you hear a noise that chills you to your bones. A whispering, in a language that you don't know. You try to back up, but there's only stone behind you. You see nothing. Your orb is gone.", "You run forward but feel like you are going nowhere. You feel like you are falling upwards, in every direction at the same time. Then, there is nothing. You are... not.", "You died!", ["goto", "CHOICE1"], ["label", "TORCHPATH"], ["img","sprites/env/carvedhall.png"], ["head", "HALL OF CARVINGS"], "You are quite confident that going down a hallway which is marked with a corpse is a terrible idea. Since you have to go somewhere, you decide that the arch with the torch is the option that you are willing to take.","You walk under the arch and tense your shoulders, but nothing comes flying out at you, which is relieving. The hallway is long, and holding up your orb to the walls reveals carvings of people with horns and the bodies of horses doing different things; like battling winged demons, hunting, or sleeping. One picture stands out to you.", "It is the picture of a centaur with long, reddish-pink hair and a pair of gleaming golden horns. This picture is far bigger than the rest, and seems to... move with you, somehow.", "Suddenly, you hear a massive crack, and in front of you, a shard of light flies just past your face, barely missing you. You're instantly alert, and you jump back, unsheathing your sword. You hear a clopping that sounds like hooves, and something you never expected to see appears before you.", "It is the picture that you just noticed, but real, and standing before you, a look of total despair on its face.", '"... Why are you here? Why do you invade this lost place?", the centaur says. You are not exactly sure how to respond, but you tell it what happened to you, from the beginning. At the end of your tale, the expression of the centaur has changed from despair to an expression of all-encompassing anger.', '"I have been trapped in this prison for thousands of years. You tell me the Onitai still lives?", it says with fury. "I will not let it live. It has destroyed my people and my home, and apparently my sister as well."', '"I was so sure... But it is of no matter. I cannot leave this place except with a fang of Ludociel, and the chances of one falling into this place from Midgard are disparagingly low," she says. "You told me that your goal is to destroy the... Demonbream, as you call it. If you truly wish to do that, you must leave this place."', '"I can cut a path out for you, but I cannot leave myself. If I do this for you, you must do something for me. What I will ask of you is... perhaps even harder than the quest which you set out to complete. I would ask you to steal one of the fangs of Ludociel," she states.', 'You do not know exactly who Ludociel is, but from the way the centaur speaks of it, you believe that it is not something which is to be trifled with. "Promise me that if I cut you out of here, you will do the same for me." You need to get out of here, and the Centaur blocks your path. Is it the right choice to let her out? She has been trapped here for thousands of years, and she looks extremely powerful. Would letting her out be a good idea? However, one thing you know is that you need to kill the Demonbream. You saw what it looked like, and you felt its fury. If it is not destroyed, you fear it will destroy not only the merpeople but also your home and your people as well. What do you do?',["option",["Agree","Disagree"],["AGREE","DISAGREE"]], ["label", "AGREE"], 'The expression of sadness and anger melts away from the face of the centaur, replaced by one of such happiness that it instantly makes you feel like you made the right decision. "Thank you... so much. I believe that I owe you something in return for this other than leaving this place. I will give you my name," the centaur says. "My name is... Dragonfruit. At least, that was my name. May I know yours?" You tell her your name. "An interesting name... I have not heard that in a long while," Dragonfruit muses.', '"Anyway, I shall cut your path out. Also, I believe that you need a stronger weapon, and thus, once you have gone through the gap I cut, I shall throw my spear to you. About Ludociel, I highly suggest that you prepare yourself before attemtping to take one of his fangs; he is like nothing you have ever fought before," Dragonfruit tells you. You look down the hallway past her, because as you are about to leave, your curiosity has been piqued. What is this place? Why is it here? What happened to her people?', 'Dragonfruit takes her golden spear, and raises it above her head. With a shrill clang of metal on stone, she slams it into the wall. A beam of light springs from the wall, and then two. Four. A multitude of beams break away from the wall, and your vision goes white as you feel yourself falling forward.',  ["head", "LABYRINTH"], ["sound", "adventure2"], ["img", "sprites/env/temple.png"], 'You slam into the ground for the second time that day, and find yourself lying on the faintly-tinged blue ground in front of the door where you spoke to the book so long ago.', 'You get to your feet, brushing the dust and dirt from your clothes, and pick up the golden spear that is embedded in the ground before you. Now, you have two tasks. You are determined to slay the Demonbream and free the merpeople, and you are determined to free the centaur who let you out.', 'You obtained the DRAGONKEY.',["goto", "contentEND"], ["label", "DISAGREE"], 'You tell her no. Why would you help her? She even had the audacity to shoot an arrow at you before. Her face falls once again into that expression of despair, and although you tell yourself you made the right choice, you feel like you might have not. "I do not feel that I have the right to restrict you from leaving this place. I merely wished to be free of this place, after my thousands of years."', '"If you truly wish to leave without helping me, I will let you. That is to say, if you can bring me to my knees, I shall give you my spear, which will allow you to break free from this place, the Ad-Shahaira. Let us battle with honor.', ["sound", "gacha"], 'EX BOSS APPROACHING', ["interaction", "combat", "dragonfruit"], ["sound", "silence"], ["sfx", "youwin"], 'EX BOSS BATTLE WON!', ["sound", "namey"], '"... It seems that you have bested me. Or at least, you have bested my vestige. After all, this body is not at all as powerful as my original one. But a deal is a deal, and so here you go."', 'You obtained the DRAGONKEY.', 'With a shrill clang of metal on stone, you slam it into the wall. A beam of light springs from the wall, and then two. Four. A multitude of beams break away from the wall, and your vision goes white as you feel yourself falling forward.', ["head", "LABYRINTH"], ["sound", "adventure3"], ["img", "sprites/env/temple.png"], 'You slam into the ground for the second time that day, and find yourself lying on the faintly-tinged blue ground in front of the door where you spoke to the book so long ago.', 'You get to your feet, brushing the dust and dirt from your clothes, and pick up the golden spear that is embedded in the ground before you. You are determined with raging anger to slay the Demonbream, and with that, you walk forward into the labyrinth.',["label", "contentEND"], "END of CHAPTER 0"];

const illuminated_file_inven = [];

const illuminated_file = {"lines":illuminated_lines, "inven":illuminated_file_inven};