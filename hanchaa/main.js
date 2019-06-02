var express = require('express');
var app = express();
var fs = require('fs');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');

app.use(bodyParser.urlencoded({extended:false}));
app.use(compression());
app.use(function(request, response, next){
	fs.readdir('./data', function(error, filelist){
		request.list = filelist;
		next();
	});
});

app.get('/', function(request, response){

	var title = 'Welcome';
	var description ='Hello, Node.js';

	var list = template.list(request.list);

	var html = template.HTML(title, list,
		`<h2>${title}</h2>${description}`,
		`<a href="/create">create</a>`
	);

	response.send(html);
});

app.get('/page/:pageId', function(request, response){
	var title = request.params.pageId;
	fs.readFile(`./data/${title}`, 'utf8', function(err, description){
		var sanitizedTitle = sanitizeHtml(title);
		var sanitizedDescription = sanitizeHtml(description, {allowedTags:['h1']});

		var list = template.list(request.list);

		var html = template.HTML(sanitizedTitle, list,
			`<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
			`<a href="/create">create</a>
			 <a href="/update/${sanitizedTitle}">update</a>
			 <form action="/delete_process" method="post">
				<input type="hidden" name="id" value="${sanitizedTitle}"}>
				<input type="submit" value="delete">
			</form>
		`);

		response.send(html);
	});
});

app.get('/create', function(request, response){
	var title = 'create';

	var list = template.list(request.list);

	var html = template.HTML(title, list, `
		<form action="/create_process" method="post">
			<p>
				<input type="text" name = "title" placeholder="title">
			</p>
			<p>
				<textarea name = "description" placeholder="description"></textarea>
			</p>
			<p>
				<input type="submit">
			</p>
		</form>`, '');
	response.send(html);
});

app.post('/create_process', function(request, response){	
	var post = request.body;
	var title = path.parse(post.title).base;
	var description = post.description;

	fs.writeFile(`./data/${title}`, description, 'utf8', function(err){
		response.redirect(`/page/${title}`);
	});
});

app.get('/update/:pageId', function(request, response){
	var title = request.params.pageId;

	fs.readFile(`./data/${title}`, 'utf8', function(err, description){
		var list = template.list(request.list);

		var html =template.HTML(title, list,
		   `<form action="/update_process" method="post">
			<input type="hidden" name="id" value="${title}">
			<p>
				<input type="text" name = "title" placeholder="title" value="${title}">
			</p>
			<p>
				<textarea name = "description" placeholder="description">${description}</textarea>
			</p>
			<p>
				<input type="submit">
			</p>
			</form>`,
			`<a href="/create">create</a> <a href="/update/${title}">update</a>`);
		response.send(html);
	});
});

app.post('/update_process', function(request, response){
	var post = request.body;
	var id = post.id;
	var title = path.parse(post.title).base;
	var description = post.description;

	fs.rename(`./data/${id}`, `./${title}`, function(error){
		fs.writeFile(`./data/${title}`, description, 'utf8', function(err){
			response.redirect(`/page/${title}`);
		});
	});
});

app.post('/delete_process', function(request, response){
	var post = request.body;
	var id = post.id;

	fs.unlink(`./data/${id}`, function(error){
		response.redirect('/');
	});
});

app.listen(3000, function(){
	console.log('Example app listening on port 3000');
});