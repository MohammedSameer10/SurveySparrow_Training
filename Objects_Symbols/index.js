
const id = Symbol("sam");

const user = {
  name: "Sameer",
  age: 20,

  [id]: 12345,

  greet() {
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
  }
};

user.greet(); 
 
console.log("Direct symbol access:", user.id); 
console.log("id ", user[id]); 
console.log("All symbol properties:", Object.getOwnPropertySymbols(user));
