const fs = require('fs');

fs.readFile(__filename, () => {
  setImmediate(() => {
    console.log('setImmediate inside I/O callback');
  });

  setTimeout(() => {
    console.log('setTimeout 0ms inside I/O callback');
  }, 0);
});
