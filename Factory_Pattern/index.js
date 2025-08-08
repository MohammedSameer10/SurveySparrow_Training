
class FootballPlayer {
  describe() {
    console.log("I am a football player");
  }
}
class Winger extends FootballPlayer {
  describe() {
    console.log("I dribble.");
  }
}

class Attacking_Midfeilder extends FootballPlayer {
  describe() {
    console.log("I make play.");
  }
}

class Striker extends FootballPlayer {
  describe() {
    console.log("I score goals.");
  }
}

class FootballPlayerFactory {
  static createPlayer(position) {
    switch(position) {
      case "Winger":
        return new Winger();
      case "Attacking_Midfeilder":
        return new Attacking_Midfeilder();
      case "Striker":
        return new Striker();
      default:
        throw new Error("Maybe a cricketer: " , position);
    }
  }
}

const player1 = FootballPlayerFactory.createPlayer("Winger");
const player3 = FootballPlayerFactory.createPlayer("Attacking_Midfeilder");
const player2 = FootballPlayerFactory.createPlayer("Striker");
player1.describe(); 
player2.describe(); 
player3.describe(); 
