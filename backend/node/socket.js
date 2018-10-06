const WebSocketServer = require('ws').Server;

const stack = [];

const wssConnection = new WebSocketServer({ port: 4206 });
const wssTransfer = new WebSocketServer({ port: 4207 });
LOOK = false;
COORDENADOR = null;

const index = 1;

wssConnection.on('connection', function (ws) {
  ws.on('message', function incoming(data) {
    if (data) {
      this.index++;
      const req = {
        token: data,
        id: data
      };
      console.log(`Criando nova requisição ${JSON.stringify(req)}`);
      ws.send(JSON.stringify(req));
    }
  });
});

wssTransfer.on('connection', function (ws) {
  ws.on('message', function incoming(data) {
    if (data) {
      console.log(`nova transferencia: ${data}`);
      const request = JSON.parse(data);
      if (request.coordenador) {
        LOOK = false;
        ws.send(JSON.stringify(request.data));
      } else {
        stack.push(request);
      }
    }
  });
  sendCoordinator(ws);
});

function sendCoordinator(ws) {
  setInterval(() => {
    console.log(stack.length + '-' + this.LOOK);
    if (!this.LOOK) {
      this.LOOK = true;
      try {
        if (stack.length > 0) {
          const data = stack.shift();
          console.log(`processando a request: ${data}`);
          ws.send(JSON.stringify({ coordenador: true, data: { data } }));
        } else {
          this.LOOK = false;
        }
      } catch (err) {
        console.log('Coordenador morreu');
      }
    }
  }, 500);
}


setInterval(() => {
  this.COORDENADOR = null;
  this.stack = [];
}, 60000);
