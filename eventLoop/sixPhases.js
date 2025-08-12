const fs = require('fs');
const net = require('net');

console.log('Start');

setTimeout(() => {
  console.log('1. Timers phase: setTimeout callback');
}, 0);

const server = net.createServer((socket) => {
  console.log('2. Pending Callbacks phase: TCP server connection callback');
  socket.end();
});

server.listen(0, () => {
  const client = net.createConnection(server.address().port);
});

fs.readFile(__filename, () => {
  console.log('4. Poll phase: fs.readFile callback');

  setImmediate(() => {
    console.log('5. Check phase: setImmediate callback');
  });
});



server.on('close', () => {
  console.log('6. Close Callbacks phase: server closed');
});

setTimeout(() => {
  server.close();
}, 100);

console.log('End');
