import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'requests';

  public requestList = [];
  public coordenador = null;
  private token = 1;
  private ws = new WebSocket('ws://localhost:4206/teste');

  ngOnInit() {
    const self = this;
    this.ws.onopen = function () {
      self.requestList.push({id: self.requestList.length, status: 0, token: self.token, time: 0});
      self.requestList.forEach((request) => {
        self.ws.send(JSON.stringify(request));
      });
    };
    this.ws.onmessage = function(dt) {
      if (dt.data === 'dead') {
        self.requestList.forEach((req) => {
          if (req.status !== 1) {
            req.status = 2;
          }
        });
        self.coordenador = 'Coordenador morreu';
      } else if (dt.data.includes('coordenador')) {
        self.coordenador = 'Requisição: ' + JSON.parse(dt.data).coordenador;
      } else {
        const request = JSON.parse(dt.data);
        self.requestList.forEach((req) => {
          if (req.token   === request.token && req.status !== 2) {
            req.status = request.status;
            req.time = request.time / 1000;
          }
        });
      }
    };
    this.ws.onclose = function () {
      alert('close');
    };
    this.send();
    this.create();
  }

  private send() {
    setTimeout(() => {
      const request = this.requestList[this.getRndInteger(0, this.requestList.length)];
      request.token = this.token;
      this.token++;
      request.status = 0;
      request.time = 0;
      this.ws.send(JSON.stringify(request));
      this.send();
    }, this.getRndInteger(10, 25) * 1000);
  }

  private create() {
    setTimeout(() => {
      const request = {id: this.requestList.length, status: 0, token: this.token, time: 0};
      this.token++;
      request.status = 0;
      this.requestList.push(request);
      this.ws.send(JSON.stringify(request));
      this.create();
    }, 40000);
  }

  private getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }


  public getStatus(status) {
    switch (status) {
      case 0:
        return 'Aguardando';
      case 1:
        return 'Concluido';
      case 2:
        return 'Erro';
      default:
        return 'Pendente';
    }
  }
}
