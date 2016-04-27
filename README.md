# Muon
Senior Capstone Project - A simple fairly simple game built with nw.js and angular.

#Installer
You can find the installer [here](http://www.zachatrocity.com/muon)

#Demo
Check out the [demo](http://www.zachatrocity.com/muon) NOTE: Expect long load times in the web version, this game is built as a desktop app not a web game.

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
- [howler.js]() for playing audio


#Created By:
- [Zach Russell](https://github.com/zachatrocity)
- [Jacob Maurier](https://github.com/jmaurier)
- [Jordan Merrick](https://github.com/jmerrick94)
- [Tyler Apgar](https://github.com/trapgar)

