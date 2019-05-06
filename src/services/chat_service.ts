import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Http, Response } from '@angular/http';
import { Constant } from "../providers/constant";
import { AngularFire } from "angularfire2";

@Injectable()
export class ChatService {
    loggedinUser: any;

  constructor(
    public events: Events,
    public storage: Storage,
      public http: Http, 
      public constant: Constant,
      public angularFire: AngularFire,
  ) {

    this.angularFire.auth.subscribe(auth => {
        this.loggedinUser = auth; 
      })

  }


  loadContact(){
    return this.http.get(this.constant._API.baseUrl+'/users')
    .timeout(10000)
    .retryWhen((err:any)=>err.delay(10000))
    .map((res:Response) => res.json())
  }

  searchContact(key:String){
    return this.http.get(this.constant._API.baseUrl+'/users?keyword='+key)
    .timeout(10000)
    .retryWhen((err:any)=>err.delay(10000))
    .map((res:Response) => res.json())
  }

  initPrivateChat(userUid:String){
      let user = {'to':userUid,'from':this.loggedinUser.uid};
    return this.http.post(this.constant._API.baseUrl+'/private_chat',JSON.stringify(user))
    .timeout(10000)
    .retryWhen((err:any)=>err.delay(10000))
    .map((res:Response) => res.json())
  }

  addPublication(data:any){
    data.user = this.loggedinUser.uid;
    
    return this.http.post(this.constant._API.baseUrl+'/publications',JSON.stringify(data))
    .timeout(10000)
    .retryWhen((err:any)=>err.delay(10000))
    .map((res:Response) => res.json())
  }

}