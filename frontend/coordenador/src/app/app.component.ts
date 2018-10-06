import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'coordenador';

  private ws = new WebSocket('ws://localhost:4207/teste');

  public requests = [];
  public coordinator = null;

  constructor() {
    const self = this;
    this.ws.onopen = function() {};

    this.ws.onmessage = function(dt: any) {
      if (dt) {
        debugger
        const request = JSON.parse(dt.data);
        if (request.coodenador) {
          self.coordinator = request.coordinator;
          self.blockRequest(dt);
        }
      }
    };
  }

  private blockRequest(request: any) {
    const time = this.getRndInteger(5, 15);
    this.requests.push({id: request.data.id, time: time});
    setTimeout(() => {
      this.ws.send(request);
    }, time);
  }

  private getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
