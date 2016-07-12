var express = require('express');
var bodyParser = require('body-parser')
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;


app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Todo API Root');
});

app.get('/todos', function(req, res){
  res.json(todos);
});

app.get('/todos/:id', function(req, res){
  var todoId = parseInt(req.params.id, 10);
  var matchedToDo = _.findWhere(todos, {id: todoId});

  if (matchedToDo) {
    res.json(matchedToDo);
  } else {
    res.status(404).send();
  }
});

app.post('/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed');
  body.description = body.description.trim();

  if (!_.isBoolean(body.completed) || !_.isString(body.description) || !body.description){
    return res.status(400).send();
  }

  body.id = todoNextId++;
  todos.push(body);

  res.json(body);
});

app.delete('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedToDo = _.findWhere(todos, {id: todoId});
  todos = _.without(todos, matchedToDo);

  if (matchedToDo) {
    res.json(matchedToDo);
  } else {
    res.status(404).json({"Error": "No todo found with that id"});
  }
});

app.put('/todos/:id', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {};
  var todoId = parseInt(req.params.id, 10);
  var matchedToDo = _.findWhere(todos, {id: todoId});

  if (!matchedToDo) {
    return res.status(404).send();
  }

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')){
    return res.status(400).send();
  } else {
    //Never provided attr, no problem here
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length) {
    body.description = body.description.trim();
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')){
    return res.status(400).send();
  }

  _.extend(matchedToDo, validAttributes)
  res.json(matchedToDo);


});


app.listen(PORT, function(){
  console.log('Express listening on port: ' + PORT);
});