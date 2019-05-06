import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Http, Response } from '@angular/http';
import { Constant } from "./constant";

@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
    public events: Events,
    public storage: Storage,
      public http: Http, 
      public constant: Constant,
  ) {}

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(username: string, password: string) {

    var data = {'login':username,'password':password};

    return this.http.post(this.constant._API.baseUrl+'/user/login',JSON.stringify(data))
        .timeout(5000)
        .map((res:Response) => res.json());
  };

  signup(username: string): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    //this.setUsername(username);
    this.events.publish('user:signup');
  };

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.events.publish('user:logout');
  };

  setUser(user: string): void {
    this.storage.set('user', JSON.stringify(user));
  };

  getUser(): Promise<string> {
    return this.storage.get('user').then((value) => {
      return JSON.parse(value);
    });
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };
}
