var NwBuilder = require('nw-builder');
var innoSetup = require("innosetup-compiler")
var gulp = require('gulp');
var fs = require('fs');

gulp.task('package', function () {
    var nw = new NwBuilder({
        //any folders or subfolders added to the muon app need to be add here aswell
        files: [
            "package.json", 
            "main.js",
            "index.html", 
            "./views/*", 
            "./js/*",
            "./libs/*",
            "./images/*",
            "./audio/*",
            "./videos/*",
            "./font/**/**",
            "./css/*",
            "./controllers/*"
        ], // use the glob format
        platforms: ['win','osx'],
        version: '0.12.3',
        winIco: "./images/muonIcon.ico"
    });

    //Log stuff you want

    nw.on('log',  console.log);

    // Build returns a promise
    nw.build().then(function () {
       console.log('copy ffmpegsumo.so for osx') ;
       fs.createReadStream('./installer/ffmpegsumo.so').pipe(fs.createWriteStream('./build/Muon/osx64/Muon.app/Contents/Frameworks/nwjs Framework.framework/Libraries/ffmpegsumo.so'));

       console.log('packaging done, creating installer');
       var inno = new innoSetup("./installer/setup.iss", {
            gui: false,
            verbose: true
        }, function(error) {
            if(error)
                console.log(error)
        });
       
    }).catch(function (error) {
        console.error(error);
    });
});