var person = {
  name: "Jeff",
  age: 21
}

// function updatePerson(obj) {
//   // obj = {
//   //   name: "Jeff",
//   //   age: 24
//   // }
//   // obj.age = 24;
// }

// updatePerson(person);
// console.log(person);

var myArray = [15, 37];

function addGrade(array) {
  array = [15, 37, 42];
}


function addGradeNewValue(array) {
  array.push(42);
  debugger;
}

addGradeNewValue(myArray)
console.log(myArray)