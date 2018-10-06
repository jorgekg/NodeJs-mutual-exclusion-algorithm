import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'requests';

  public requestList = [];
  public requests = [];
  public coordinator = null;

  private wssConnect = new WebSocket('ws://localhost:4206/teste');
  private wssTransfer = new WebSocket('ws://localhost:4207/teste');

  ngOnInit() {
    this.wssConnect.onmessage = (data: any) => {
      if (data && data.data !== 'dead') {
        const request = JSON.parse(data.data);
        if (!request.coordenador) {
          this.requestList.forEach(req => {
            if (req.token === request.token) {
              req.id = request.id;
            }
          });
        }
        if (this.requestList.length === 1) {
          this.send();
        }
      } else {
        this.requestList.forEach((req) => {
          if (req.status === 0 || req.status === 1) {
            req.status = 3;
          }
        });
      }
    };
    this.wssTransfer.onmessage = (data: any) => {
      if (data) {
        const request = JSON.parse(data.data);
        if (!request.coordenador) {
          this.requestList.forEach(req => {
            if (req.id === request.data.id) {
              req.status = request.data.status;
            }
          });
        } else {
          this.coordinator = request.coordinator;
          this.blockRequest(request);
        }
      }
    };
    this.create();
  }

  private blockRequest(request: any) {
    const time = this.getRndInteger(5, 15) * 1000;
    this.requests.push({id: request.data.data.id, time: time, status: 2});
    setTimeout(() => {
      request.data.data.status = 2;
      this.requests.push(request.data);
      this.wssTransfer.send(JSON.stringify(request));
    }, time);
  }

  private send() {
    const self = this;
    this.wssTransfer.onopen = function() {
      self.sendToken();
    };
    setInterval(() => {
      this.sendToken();
    }, this.getRndInteger(10, 25) * 1000);
  }

  private sendToken() {
    const sendsQty = this.getRndInteger(0, this.requestList.length);
    const sends = [];
    for (let i = 0; i <= sendsQty; i++) {
      const requestId = this.getRndInteger(0, this.requestList.length);
      if (sends.length === 0 || !sends.filter((sd) => sd !== requestId)) {
        sends.push(requestId);
        const request = this.requestList[requestId];
        request.status = 1;
        this.wssTransfer.send(JSON.stringify(request));
      }
    }
  }

  private create() {
    const self = this;
    this.wssConnect.onopen = function() {
      self.createToken();
    };
    setInterval(() => {
      this.createToken();
    }, 40000);
  }

  private createToken() {
    const request = {token: this.requestList.length.toString(), status: 0};
    this.requestList.push(request);
    this.wssConnect.send(request.token);
  }

  private getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }


  public getStatus(status) {
    switch (status) {
      case 0:
        return 'Criado';
      case 1:
        return 'Enviando...';
      case 2:
        return 'Sucesso';
      default:
        return 'Erro';
    }
  }
}
