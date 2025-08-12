class DataFormatter {
  constructor(dataString) {
    this.dataString = dataString;
  }
  format() {
    throw new Error("format() must be implemented");
  }
  display() {
    console.log(this.format());
  }
}
class CustomArrayFormatter extends DataFormatter {
  format() {
    return this.dataString.split(',');
  }
}
class CustomJSONFormatter extends DataFormatter {
  format() {
    const obj = {};
    this.dataString.split(',').forEach(pair => {
      let [key, value] = pair.split(':').map(s => s.trim());
      if (value === "true") value = true;
      else if (value === "false") value = false;
      else if (!isNaN(value)) value = Number(value);
      obj[key] = value;
    });
    return JSON.stringify(obj, null, 2);
  }
}
const inputArray = "name,john,age,29,active,true";
const inputJSON = "name: john, age: 29, active: true";
const arrayFormatter = new CustomArrayFormatter(inputArray);
const jsonFormatter = new CustomJSONFormatter(inputJSON);
arrayFormatter.display(); 
jsonFormatter.display();

