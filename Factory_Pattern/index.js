
class JSONParser {
  parse(str) {
    return JSON.parse(str);
  }
  stringify(obj) {
    return JSON.stringify(obj);
  }
}

class CSVParser {
  parse(str) {
    return str.split("\n").map(row => row.split(","));
  }
  stringify(arr) {
    return arr.map(row => row.join(",")).join("\n");
  }
}

class ParserFactory {
  static createParser(format) {
    switch (format.toLowerCase()) {
      case "json":
        return new JSONParser();
      case "csv":
        return new CSVParser();
      default:
        throw new Error(`Unknown parser type: ${format}`);
    }
  }
}

const jsonParser = ParserFactory.createParser("json");
console.log(jsonParser.parse('{"name":"Sameer"}')); 
console.log(jsonParser.stringify({ name: "Sameer" }));
const csvParser = ParserFactory.createParser("csv");
console.log(csvParser.parse("a,b,c\n1,2,3"));
console.log(csvParser.stringify([['a','b'], ['1','2']]));

