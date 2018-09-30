const WebSocketServer = require('ws').Server;

const stack = [];

const wss = new WebSocketServer({port: 4206});
LOOK = false;

wss.on('connection', function(ws) {
  setInterval(function () {
    if (!LOOK) {
      LOOK = true;
      send(ws);
    }
  }, 500);
  dead(ws);
  ws.on('message', function incoming(data) {
    console.log(data);
    stack.push(data);
  });
});

function send(ws) {
  const requestString = stack.shift();
  if (requestString) {
    const time = getRndInteger(5, 15) * 1000;
    console.log(`levará ${time}`);
    setInterval(() => {
      console.log('Irá processar');
      console.log(`Processando ${requestString}`);
      if (requestString) {
        const request = JSON.parse(requestString);
        request.status = 1;
        ws.send(JSON.stringify(request));
        LOOK = false;
        console.log('Concluido');
      }
    }, time);
  }
}

function dead(ws) {
  setInterval(() => {
    console.log(`Coordenador morreu`);
    stack.forEach(requestString => {
      const request = JSON.parse(requestString);
      if (request.status === 0) {
        request.status = 2;
        ws.send(JSON.stringify(request));
      }
    });
    stack = [];
  }, 60000);  
}


function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}