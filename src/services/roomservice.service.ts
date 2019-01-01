import { Injectable } from '@angular/core';
import { FoxConnect } from 'foxconnect';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomserviceService {
  private foxConnect: FoxConnect;

  constructor() {
    this.foxConnect = new FoxConnect({
      awsAccessKey: environment.accessKey,
      awsIotHost: environment.awsIot,
      awsRegion: environment.awsRegion,
      awsSecretKey: environment.secretKey,
      signalServer: environment.signalServer,
      clientId: `${Math.floor(Math.random() * 1000000 + 1)}`
    });
  }
}
