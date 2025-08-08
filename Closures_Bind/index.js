//closure
function makeCounter() {
  let count = 0; 
  return function() {
    count++;
    return count;
  };
}
const counter = makeCounter();
console.log(counter());
console.log(counter()); 


//bind
const obj = {
  name: "Sameer",
  introduction() {
    console.log("Hello i am " + this.name);
  }
};

obj.introduction(); 

const withoutBind = obj.introduction;
withoutBind();

const withBind = obj.introduction.bind({name:'Mohammedsameeer_s'});
withBind(); 

