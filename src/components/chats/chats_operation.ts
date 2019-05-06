import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { NavParams, NavController, Events } from 'ionic-angular';
import { GlobalStatictVar } from '../../shared/interfaces';
import { App, LoadingController } from 'ionic-angular';
// import { Conversation } from '../conversation/conversation';
import { Chat } from '../../shared/interfaces';
import { MediatorProvider } from '../../providers/mediatorProvider';
import { LogProvider } from '../../providers/logProvider';

import { OnlineProvider } from '../../providers/onlineProvider';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ChatService } from "../../services/chat_service";
import { AngularFire } from "angularfire2";
import { MessagesComponent } from "../messages/messages";
@Component({
  selector: 'page-operation-chat',
  templateUrl: 'chats_operation.html',
  providers: [ChatService]
})
export class ChatsOperation {
    loggedinUser: any;
    searchKey: any = '';
    UsersListe: any =  [];
    defaultPhoto: String = 'assets/img/teaser.png';

    constructor (
        public navCtrl: NavController,
        public app: App, 
        public loadingCtrl: LoadingController,
        public _chatService: ChatService,
        public angularFire: AngularFire,
        public navParams: NavParams)
        {
        
       
        }

        ngOnInit(): void {
            this.angularFire.auth.subscribe(auth => {
                this.loggedinUser = auth; 
              })
            this.loadUsers();
              
        }

    loadUsers(){
        let loading = this.loadingCtrl.create({
          content: `Loading...`,
            duration: 10000
          });
          loading.present();
  
            this._chatService.loadContact()
            .subscribe((res:any)=>{
                console.log(res);
                // this.UsersListe = res.data;
                res.data.forEach((u:any) => {
                    console.log(u.uid+'==='+this.loggedinUser.uid);
                    if(u.uid !== this.loggedinUser.uid){
                        this.UsersListe.push(u);
                    }
                });
                loading.dismiss().catch((err:any)=>{

                });
            },(err:any)=>{
                console.log(err)
            });
      
      }


    search(event: any) {
        this._chatService.searchContact(this.searchKey)
        .subscribe((res:any)=>{
            console.log(res);
            this.UsersListe = [];
            res.data.forEach((u:any) => {
                console.log(u.uid+'==='+this.loggedinUser.uid);
                if(u.uid !== this.loggedinUser.uid){
                    this.UsersListe.push(u);
                }
            });
        },(err:any)=>{
            console.log(err)
        });
    }
   

    initchat(user:any){ 
        this._chatService.initPrivateChat(user.uid)
        .subscribe((res:any)=>{
            console.log(res);
            if(res.error == false && res.data){
                let chat = res.data;
                this.navCtrl.push(MessagesComponent, chat);
            }
            
        },(err:any)=>{
            console.log(err)
        });
    }


}
