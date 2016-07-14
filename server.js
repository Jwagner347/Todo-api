var express = require('express');
var bodyParser = require('body-parser')
var _ = require('underscore');
var db = require('./db.js')

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;


app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Todo API Root');
});

app.get('/todos', function(req, res){
  var queryParams = req.query;
  var filteredTodos = todos;

  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    filteredTodos = _.where(filteredTodos, {"completed": true})
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    filteredTodos = _.where(filteredTodos, {"completed": false})
  }

  if (queryParams.hasOwnProperty('q') && queryParams.q.length) {
    filteredTodos = _.filter(filteredTodos, function (todo) {
      return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase) > -1;
    });
  }

  res.json(filteredTodos);
});

app.get('/todos/:id', function(req, res){
  var todoId = parseInt(req.params.id, 10);
  
  db.todo.findById(todoId).then(function (todo) {
    if (!!todo) {
      res.json(todo.toJSON());
    } else {
      res.status(404).send();
    }
  })
  .catch(function (e) {
    res.status(500).send();
  });
});

app.post('/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed');
  body.description = body.description.trim();

  db.todo.create(body)
  .then(function (todo) {
    res.json(todo.toJSON());
  })
  .catch(function (e) {
    res.status(400).json(e);
  });
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

db.sequelize.sync().then(function () {
  app.listen(PORT, function(){
    console.log('Express listening on port: ' + PORT);
  });
});
