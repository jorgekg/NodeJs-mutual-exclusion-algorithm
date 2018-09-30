import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'requests';

  public requestList = [];
  private token = 1;
  private ws = new WebSocket('ws://localhost:4206/teste');

  ngOnInit() {
    const self = this;
    this.ws.onopen = function () {
      self.requestList.push({id: self.requestList.length, status: 3, token: self.token});
      self.requestList.forEach((request) => {
        self.ws.send(JSON.stringify(request));
      });
    };
    this.ws.onmessage = function(dt) {
      const request = JSON.parse(dt.data);
      self.requestList.forEach((req) => {
        if (req.token === request.token) {
          req.status = request.status;
        }
      });
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
      this.ws.send(JSON.stringify(request));
      this.send();
    }, this.getRndInteger(10, 25) * 1000);
  }

  private create() {
    setTimeout(() => {
      this.requestList.push({id: this.requestList.length + 1, status: 0});
      this.create();
    }, 10000);
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
