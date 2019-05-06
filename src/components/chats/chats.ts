import { Component } from '@angular/core';
import { NavController, App, LoadingController, NavParams } from "ionic-angular";
import { RegionService } from "../../pages/regions/region-service";
import { Constant } from "../../providers/constant";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Http, Response } from '@angular/http';
import { MessagesComponent } from "../messages/messages";
import { MediatorProvider } from "../../providers/mediatorProvider";
import { User } from "../../shared/interfaces";
import { AngularFire } from "angularfire2";
import { ChatsOperation } from "./chats_operation";
import { SortByDatePipe } from "../../pipes/order-by-date";


/*
  Generated class for the Chats component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/

@Component({
  selector: 'chats',
  templateUrl: 'chats.html',
  providers: [SortByDatePipe]
})
export class ChatsComponent {
  first: any = true;
  userToken: any;
  loggedinUser: any;
  chatsListe: any;
  chatLoadInterval: any;

  

  ngOnInit(): void {
  
    
  }

   constructor (
      public navCtrl: NavController,
      public app: App, 
      private _regionService:RegionService,
      public loadingCtrl: LoadingController,
      public http: Http, 
      public constant: Constant, 
      public medProvid: MediatorProvider,
      public angularFire: AngularFire,
      public sortByDate: SortByDatePipe,
      public navParams: NavParams)
      {
        let self = this;
        setTimeout(()=>{
          self.loadChats();
        },500)
        this.first = false;
      }


      ionViewDidEnter() {
        console.log('entreer chat')

        let self = this;
        setTimeout(()=>{
          self.loadChats();
        },500)
        this.chatLoadInterval = setInterval(()=>{
          self.loadChats();
        },3000)
      }

    ionViewDidLoad() {
      //we only need this call for one time when view loaded to cach
      this.angularFire.auth.subscribe(auth => {
        this.loggedinUser = auth; 
        console.log(this.loggedinUser);
      })

     
      //this.scrollChat();
    }

    loadChats(){
      let loading = this.loadingCtrl.create({
        content: `Loading...`,
          duration: 10000
        });
        if(this.first)
          loading.present();

        this.http.get(this.constant._API.baseUrl+'/chat_rooms?uid='+this.loggedinUser.uid)
          .timeout(10000)
          .retryWhen((err:any)=>err.delay(10000))
          .map((res:Response) => {
            let data = res.json();
            console.log(data);
            loading.dismiss();
            return this.sortByDate.transform(data.data,'-lastMsgDate');;
          })
          .subscribe((res:any)=>{
              console.log(res);
              this.chatsListe = res;
          },(err:any)=>{
              console.log(err)
              loading.dismiss();
          });
    
    }
    
        goToChatMessages(chat: any) {
          // go to the region detail page
          // and pass in the session data
            this.navCtrl.push(MessagesComponent, chat);
        }

        openAddChat(){
          this.navCtrl.push(ChatsOperation);
        }

        isToday(date:any) {
          let today = new Date();
          let chatDate = new Date(date);
          if (today.getFullYear() === chatDate.getFullYear() && today.getMonth() === chatDate.getMonth() && today.getDate() === chatDate.getDate()) {
            return true;
          } else {
            return false;
          }
        }
      
        isYesterday(date:any) {
          let todayDate = new Date();
          let chatDate = new Date(date);
          if (todayDate.getFullYear() === chatDate.getFullYear() && todayDate.getMonth() === chatDate.getMonth()) {
            if (todayDate.getDate() - chatDate.getDate() == 1) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        }

        ionViewWillLeave() {
          console.log("leaving page")
          console.log(window.clearInterval(this.chatLoadInterval));
        }
}
