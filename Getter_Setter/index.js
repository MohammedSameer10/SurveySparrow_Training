class FootballPlayer {
    #name;
  constructor(name, position) {
    this.#name = name;         
  }
  getName() {
    return this.#name;
  }
  setName(newName) {
    this.#name=newName;
  }

}
const player1 = new FootballPlayer("Messi", "Winger");
console.log(player1.getName());       
player1.setName("Ronaldo");
console.log(player1.getName())
//private feilds cat be set directly
// console.log(player1.#name);
// player1.#name="sameeer";



//function getter settter

function FootballPlayer1(name) {
  let _name = name;
  return {
    getName() {
      return _name;
    },
    setName(newName) {
     _name = newName;
    },
  };
}

const player2 = FootballPlayer1("Messi");

console.log(player2.getName());     
player2.setName("Ronaldo");
console.log(player2.getName());     

console.log(player2._name);


