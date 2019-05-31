var testFolder = '/workspace/Nodejs/YoungMakerClub/hanchaa/data';
var fs = require('fs');

fs.readdir(testFolder, function(error, filelist){
	console.log(filelist);
});