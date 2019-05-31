var fs = require('fs');

//readFileSync
// console.log('A');
// var result = fs.readFileSync('/workspace/Nodejs/YoungMakerClub/hanchaa/syntax/sample.txt', 'utf8');
// console.log(result);
// console.log('C');

console.log('A');
fs.readFile('/workspace/Nodejs/YoungMakerClub/hanchaa/syntax/sample.txt', 'utf8', function(err, result){
	 console.log(result);
});
console.log('C');