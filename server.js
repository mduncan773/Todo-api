var express = require('express');
//middleware 
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

// parse any json that comes in 
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res){
    res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
    
    // itterate over todo's array find the match 
//    var matchedToDo;
//    todos.forEach(function(todo){
//        if (todoId === todo.id){
//            matchedToDo = todo;
//        }
//    });
    
	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
    //res.send('Asking for todo with id of ' + req.params.id);
});

//POST /todos/ pulur of action name
app.post('/todos', function(req, res){
    // _.pick (only keep valid data)
	var body = _.pick(req.body, 'description', 'completed');
    
    // if no data, bad data, wrong is provided 
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}
    
    // set body.description should be trimed value. do not include spaces
    body.description = body.description.trim();
        
    // add body id, and increment
    body.id = todoNextId++;
    todos.push(body);
    
    console.log('description: ' + body.description);
   
    res.json(body);
});

// add body to todos array. 

// delete by id url  todos/:id

app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo) {
		res.status(404).json({"error": "no todo found with that id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});

//PUT /todos/:id
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});
app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});



