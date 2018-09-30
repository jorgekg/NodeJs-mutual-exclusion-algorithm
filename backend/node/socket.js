const WebSocketServer = require('ws').Server;

const stack = [];

const wss = new WebSocketServer({port: 4206});
LOOK = false;
COORDENADOR = null;

wss.on('connection', function(ws) {
  setInterval(function () {
    if (!LOOK) {
      LOOK = true;
      send(ws);
    }
  }, 500);
  dead(ws);
  ws.on('message', function incoming(data) {
    stack.push(data);
  });
});

function send(ws) {
  if (stack.length > 0) {
    const requestString = stack.shift();
    if (requestString) {
      const time = getRndInteger(5, 15) * 1000;
      setInterval(() => {
        if (requestString) {
          const request = JSON.parse(requestString);
          if (!COORDENADOR) {
            COORDENADOR = request.id;
            ws.send(JSON.stringify({coordenador: COORDENADOR}));
          }
          request.status = 1;
          request.time = time;
          ws.send(JSON.stringify(request));
          LOOK = false;
        }
      }, time);
    }
  }
}

function dead(ws) {
  setInterval(() => {
    COORDENADOR = null;
    ws.send('dead');
  }, 60000);  
}


function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}