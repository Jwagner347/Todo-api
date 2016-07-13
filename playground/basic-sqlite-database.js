var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1, 250]
    }
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

sequelize.sync().then(function () {
  console.log('Everything is synced');

// fetch todo by id, if find, print to screen using tojson, if not then console.log to do not found.
  Todo.findById(2).then(function (todo) {
    if (todo) {
      console.log('I found it!')
      console.log(todo.toJSON());
    } else {
      console.log('todo not found');
    }
  });

  // Todo.create({
  //   description: 'Take out trash',
  // }).then(function (todo) {
  //   return Todo.create({
  //     description: 'Clean office'
  //   });
  // }).then(function () {
  //   // return Todo.findById(1);
  //   return Todo.findAll({
  //     where: {
  //       description: {
  //         $like: '%Office%'
  //       }
  //     }
  //   })
  // }).then(function (todos) {
  //   if (todos){
  //     todos.forEach(function (todos) {
  //       console.log(todos.toJSON());
  //     });
  //   } else {
  //     console.log('no todo found');
  //   }
  // })
  // .catch(function (e) {
  //   console.log(e);
  // });
});