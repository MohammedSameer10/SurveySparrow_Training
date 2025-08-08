
import {csvData1,csvData2} from './csvMimic.js'
function* csvToJsonGenerator(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    const data = lines[i].split(",");
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[j];
    }
    yield obj;  
  }
}

const csvData = csvData1;


const generator = csvToJsonGenerator(csvData);
const jsonArray = [];

let result = generator.next();
while (!result.done) {
  const player = result.value;
  console.log(result);
  player.goals = Number(player.goals);
  jsonArray.push(player);
  result = generator.next();  
}
console.log(result);

console.log(jsonArray);
