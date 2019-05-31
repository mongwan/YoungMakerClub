var fs = require('fs');
fs.readFile('/workspace/Nodejs/YoungMakerClub/hanchaa/nodejs/sample.txt', 'utf8', function(err, data){
	console.log(data);
});