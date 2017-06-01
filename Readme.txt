README (Alexandre AUDA):

Ce présent README présente un aperçu global du projet ainsi que ses différentes fonctionnalités.
Pour plus de détails, veuillez consulter le « Rapport » qui vous permettra d’approfondir chacun des points évoqués ici.

I-Lancement du jeu:
Pour lancer le programme, il suffit de lancer une invite de node.js.
Maintenant, il s’agit de lancer le serveur node.js.

S’il s’agit de la première fois que vous lancez une invite de node.js, alors exécuter successivement les deux commandes suivantes :
-Exécuter la commande « npm install express » et attendre que l’installation se termine.
-Exécuter la commande « npm install socket.io » et attendre que l’installation se termine.
Ensuite, dans tous les cas :
-Tout d’abord, se placer à la racine du Projet
-Puis, saisissez la commande « node simpleChatServer.js »
-Le programme devrait se mettre en attente (pour l’éteindre, vous pouvez appuyer simultanément sur les touches CTRL+C: Attention, si vous éteignez le serveur le jeu ne pourra pas se lancer).
Pour lancer le jeu, ouvrez votre navigateur web préféré et saisissez l’URL http://localhost:8082.
Vous devriez donc obtenir une alerte vous demandant de saisir votre nom.
Une page d’accueil apparait alors, vous demandant de patienter quelques instants le temps que le jeu charge tous les composants dont il a besoin comme la connexion pour le chat ou encore les sons et les musiques de jeu.
Ainsi, vous devriez obtenir à ce stade, l’interface du jeu.

II- But du jeu:
Le but du jeu est de détruire les Invaders sans se faire toucher par leurs tirs ou par eux même. Pour accomplir votre mission, vous pourrez compter sur des étoiles d’énergies qui multiplieront vos chances de repousser une vague d’Invaders ainsi que vos chances de survie.

III- Déroulement d’une partie:
L’interface et l’utilisation du jeu est relativement intuitive.
Comme indiqué, vous pouvez commencer le jeu en appuyant indifféremment sur « Start » si vous jouez avec un Gamepad ou sur la barre d’espace du clavier.
Le texte explicatif en dessous du jeu, récapitule l’essentiel des commandes de jeu.
Les étoiles rouges vous donneront un avantage offensif certain en augmentant la cadence de vos tirs pendant un temps limité.
Les étoiles bleues en revanche, vous donneront un avantage défensif précieux en vous protégeant contre les attaques ennemies pendant un court laps de temps.
Pour plus d’information, veuillez-vous reporter sur le « Rapport » qui vous fournira de plus ample information.

IV-Passage de niveau:
Lorsque vous détruisez tous les Invaders d’un niveau, vous passez au niveau suivant. Vous devrez toutefois redoubler de vigilance et d’attention car plus vous augmenterez de niveau, plus les tirs des Invaders seront rapides et fréquents. De plus, leurs propres déplacements seront augmentés.

V-Fin du jeu:
Enfin, si votre vie tombe à 0 ou que vous touchez physiquement un Invader avec votre spaceship, vous avez perdu. Un menu indiquera votre score, votre niveau et une musique spécifique sera jouée. Vous pouvez alors recommencer le jeu en appuyant indifféremment sur la barre d’espace ou sur « Start » si vous utilisez un Gamepad.

ANNEXE:
Bibliographie:
https://www.edx.org/school/w3cx
http://mainline.i3s.unice.fr/HTML5slides/chapter5FR.html#1
https://www.sitepoint.com
http://miageprojet2.unice.fr/Intranet_de_Michel_Buffa/Cours_Web_2.0_%2f%2f_HTML5_%2f%2f_JS_2015-2015/TP_WebSockets_%2f%2f_Rabat_2014-2015
https://courses.edx.org/courses/course-v1:W3Cx+HTML5.2x+2T2016/info
https://github.com/dwmkerr
http://miageprojet2.unice.fr/Intranet_de_Michel_Buffa/Web_Sciences_2016-2017%2c_Master_1_IFI

