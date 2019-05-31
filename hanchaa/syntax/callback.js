// function a(){
// 	console.log('A');
// }
var a = function(){
	console.log('A');
};


function slowfunc(call){
	call();	
}

slowfunc(a);