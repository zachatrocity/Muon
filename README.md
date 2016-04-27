# Muon
Senior Capstone Project - A simple fairly simple game built with nw.js and angular. The minimum supported resolution is 1360x768

#Installer/Demo
You can find the installer and the demo [here](http://www.zachatrocity.com/muon)

NOTE: Expect long load times in the web version, this game is built as a desktop app not a web game.

#Screenshots
<img src="https://raw.githubusercontent.com/zachatrocity/Muon/master/images/board.PNG" width="500">
<img src="https://raw.githubusercontent.com/zachatrocity/Muon/master/images/newgame.PNG" width="500">

#To Build
- Install node.js on your computer (we used version 4.2.4)
- Download nw.js version 12.3 (http://nwjs.io/)
- Extract nw.js on your c: drive and name the folder nw
- in the app directory run `npm install`
- run `nw` in the project directory
- NOTE: In order to enable mp4 playback you will need to replace ffmpegsumo.dll, see the [nw.js wiki](https://github.com/nwjs/nw.js/wiki/Using-MP3-&-MP4-(H.264)-using-the--video--&--audio--tags.)

#to package/make installer
- run `gulp package` (if this gives you error an error run npm install -g gulp then re-run `gulp package`)


#Libraries Used
- [nw.js](http://nwjs.io/) 
- [Angular](https://angularjs.org/) 
- [cloak.js](https://incompl.github.io/cloak/) for the networking layer
- [d3.js](https://d3js.org/) for a pseudo-physics engine
- [howler.js](https://github.com/goldfire/howler.js/) for playing audio
- [nw-builder](https://github.com/nwjs/nw-builder) for deploying the game
- [InnoSetup](http://www.jrsoftware.org/isinfo.php) for the windows installer
- [node-innosetup-compiler](https://github.com/felicienfrancois/node-innosetup-compiler) for compiling the inno setup script in a gulp process

#Created By:
- [Zach Russell](https://github.com/zachatrocity) - Architecture/Networking/Team Lead
- [Jacob Maurier](https://github.com/jmaurier) - AI/Design
- [Jordan Merrick](https://github.com/jmerrick94) - UI/UX/Design
- [Tyler Apgar](https://github.com/trapgar) - GameCore

