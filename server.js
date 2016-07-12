var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

// add body to todos array and add id field to todonextid and then add one to it so it incrments each time one is added

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Todo API Root');
});

app.get('/todos', function(req, res){
  res.json(todos);
});

app.get('/todos/:id', function(req, res){
  var todoId = parseInt(req.params.id, 10);
  var matchedToDo;

  todos.forEach(function (todo) {
    if (todo.id === todoId){
      matchedToDo = todo;
    }
  });

  if (matchedToDo) {
    res.json(matchedToDo);
  } else {
    res.status(404).send();
  }
});

app.post('/todos', function (req, res) {
  var body = req.body;

  // add id field
  body.id = todoNextId++;
  // push body into array
  todos.push(body);

  res.json(body);
});

app.listen(PORT, function(){
  console.log('Express listening on port: ' + PORT);
});