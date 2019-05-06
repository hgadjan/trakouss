import * as firebase from 'firebase';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { MediatorProvider } from '../providers/mediatorProvider';
import { User, GlobalStatictVar } from '../shared/interfaces';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import { LogProvider } from '../providers/logProvider';


const MESSAGES_REF: string = '/messages';
const USERS_REF: string = '/users';
const CHATS_REF: string = '/chats';
const CHATSROOM_REF: string = '/chats_room';
const CONTACT_REF: string = '/contacts';

@Injectable()
export class OnlineProvider {

  connectionRef: any;
  loggedinUser: User;

  constructor(public http: Http, private angularFire: AngularFire, public events: Events, public logProvid: LogProvider) {
  }

  initConnectionStatus() {
    this.connectionRef = this.angularFire.database.object('.info/connected', { preserveSnapshot: true });
    this.connectionRef.subscribe((snapshot:any) => {
      if (snapshot.val() === true) {
        this.logProvid.log('Database connected!');
        this.events.publish(GlobalStatictVar.ONLINE_EVENT);
        this.initLoggedinUser();
      } else {
        this.logProvid.log('Database disConnected!');
        this.events.publish(GlobalStatictVar.OFFLINE_EVENT);
      }
    });
  }

  createAccount(user: User) {
    return this.angularFire.auth.createUser({ email: user.email, password: user.password });
  };

  login(user: User) {
    return this.angularFire.auth.login({ email: user.email, password: user.password });
  }

  initLoggedinUser() {
    var user = firebase.auth().currentUser;
    this.logProvid.log('onlinePro::initLoggedinUser:: ' + user);
    if (!user) {
      return;
    }

    var self = this;
    let uid = firebase.auth().currentUser.uid;
    this.logProvid.log('loggedin uid: ' + uid);

    let userRef = this.angularFire.database.object(`${USERS_REF}/${uid}`, { preserveSnapshot: true });
    userRef.subscribe(snapshot => {
      console.log(snapshot);
      let value = snapshot.val();
      self.loggedinUser = {
        uid: value.uid,
        username: value.username,
        email: value.email,
        photo: value.photo
      }
      this.events.publish(GlobalStatictVar.ONLINE_USER_EVENT, self.loggedinUser);
    });
  }

  updateUser(user: User) {
    let currentUserRef = this.angularFire.database.object(`${USERS_REF}/${user.uid}`);
    currentUserRef.set({
      id: user.id,
      uid: user.uid,
      username: user.username,
      email: user.email,
      photo: user.photo
    });

    let onlineUser = firebase.auth().currentUser;

    onlineUser.updateProfile({
      displayName: user.username,
      photoURL: user.photo
    }).then(function () {
    }, function (error) {
    });
  }

  getUsers() {
    return this.angularFire.database.list(USERS_REF, { preserveSnapshot: true });
  }

  filterUsersByName(username:any) {
    return this.angularFire.database.list(USERS_REF, {
      query: {
        orderByChild: 'username',
        startAt: username,
      }, preserveSnapshot: true
    });
  }

  //get user information { just for test }
  getUser(uid:any) {
    return firebase.database().ref(`${USERS_REF}/${uid}`);
  }

  createChat(message:any) {
    let currentUserRef = this.angularFire.database.list(`${CHATS_REF}/${message.to}/${message.from}`);
    return currentUserRef.push(message);
  }

  sendMessage(message:any) {
    let currentUserRef = this.angularFire.database.list(`${CHATS_REF}/${message.to}/${message.from}`);
    return currentUserRef.push(message);
  }

  updateMessageStatus(key:any, message:any, newStatus:any) {
    let currentUserRef = this.angularFire.database.object(`${CHATS_REF}/${message.to}/${message.from}/${key}`);
    currentUserRef.update({ status: newStatus });
  }

  //Mesages queries
  getUserMessagesRef(uid:any) {
    return firebase.database().ref(`${CHATS_REF}/${uid}`);
  }

  getChatRoom(chat:any) {
    let chatRef = firebase.database().ref(`${CHATSROOM_REF}`).push();
    chat.id = chatRef.key;
    chatRef.set(chat);
  }

  getUnReadMessagesRef(uid:any, uid2:any) {
    return firebase.database().ref(`${CHATS_REF}/${uid}/${uid2}`).orderByChild('status').equalTo(GlobalStatictVar.MSG_STATUS_UN_READ);
  }

  //END of messages queries
  addContact(uid:any, user:any) {
    let currentUserRef = this.angularFire.database.list(`${CONTACT_REF}/${uid}`);
    currentUserRef.push({
      uid: user.uid,
      username: user.username,
      email: user.email,
      photo: user.photo
    });
  }

  ngOnDestroy() {
    if (this.connectionRef) {
      this.connectionRef.unsubscribe();
    }
  }
}
