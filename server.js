var express = require('express');
//middleware 
var bodyParser = require('body-parser');

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
app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    // itterate over todo's array find the match 
    var matchedToDo;
    todos.forEach(function(todo){
        if (todoId === todo.id){
            matchedToDo = todo;
        }
    });
    
    if (matchedToDo) {
        res.json(matchedToDo);
    } else {
        res.status(404).send();
    }
    //res.send('Asking for todo with id of ' + req.params.id);
});

//POST /todos/
app.post('/todos', function(req, res){
    var body = req.body;
    // add body id, and increment
    body.id = todoNextId++;
     todos.push(body);
    
    console.log('description: ' + body.description);
   
    res.json(body);
});

// add body to todos array. 

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});
