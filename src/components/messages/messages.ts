import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, App, LoadingController, NavParams, Content, TextInput } from "ionic-angular";
import { Constant } from "../../providers/constant";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Http, Response } from '@angular/http';
import { UserData } from "../../providers/user-data";
import { GroupeBy } from "../../pipes/groupe-by";
import * as Moment from 'moment';
import { MediatorProvider } from "../../providers/mediatorProvider";
import { AngularFire } from "angularfire2";

declare var $:any;
/*
  Generated class for the Messages component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'messages',
  templateUrl: 'messages.html',
  providers: [GroupeBy]
})
export class MessagesComponent {
  _isOpenEmojiPicker: boolean;
  autoScroller: MutationObserver;
  messagesDayGroups: any = [];
  loadingMessages: boolean;
  scrollOffset = 0;
  user: any;
  messages: any = [];
  chat: any;
  message: any = '';
  refreshRef: any;
  lastID:number = 0;


   constructor (
      public navCtrl: NavController,
      public app: App, 
      public loadingCtrl: LoadingController,
      public http: Http, 
      public constant: Constant,
      private el: ElementRef,
      public groupBy: GroupeBy,
      public userData: UserData,
      public medProvid: MediatorProvider,
      public angularFire: AngularFire,
      public navParams: NavParams){
      console.log(navParams.data);
        this.chat = navParams.data;
      }


  @ViewChild(Content) chatContainer: Content;
  @ViewChild('chat_input') messageInput: TextInput;
  
      ngOnInit():void {
        // this.autoScroller = this.autoScroll();
    

        this.angularFire.auth.subscribe(auth => {
          this.user = {
            uid: auth.uid,
            name: auth.auth.displayName,
            photo: auth.auth.photoURL
          }; 

            let self = this;
            this.loadMessages();
            setTimeout(function(){
              self.refreshMessages();
            },1000);
        })


      }
      ionViewDidEnter() {
        this.scrollChat();
      }
      
      scrollChat() {
        let self = this;
        setTimeout(() => {
            if (self.chatContainer.scrollToBottom) {
                self.chatContainer.scrollToBottom();
            }
        }, 400)
      }

       _focus() {
        this._isOpenEmojiPicker = false;
        this.chatContainer.resize();
        this.scrollChat();
    }

    switchEmojiPicker() {
        this._isOpenEmojiPicker = !this._isOpenEmojiPicker;
        if (!this._isOpenEmojiPicker) {
            this.messageInput.setFocus();
        }
        this.chatContainer.resize();
        this.scrollChat();
    }

      // autoScroll(): MutationObserver {
      //   const autoScroller = new MutationObserver(this.scrollDown.bind(this));

      //   autoScroller.observe(this.messagesList, {
      //     childList: true,
      //     subtree: true
      //   });

      //   return autoScroller;
      // }

      // scrollDown(): void {
      //   // Don't scroll down if messages subscription is being loaded
      //   if (this.loadingMessages) {
      //     return;
      //   }

      //   // Scroll down and apply specified offset
      //   this.scroller.scrollTop = this.scroller.scrollHeight - this.scrollOffset;
      //   // Zero offset for next invocation
      //   this.scrollOffset = 0;
      // }


      private get messagesPageContent(): Element {
        return this.el.nativeElement.querySelector('.messages-page-content');
      }

      private get messagesList(): Element {
        return this.messagesPageContent.querySelector('.messages');
      }

      // private get scroller(): Element {
      //   return this.messagesList.querySelector('.scroll-content');
      // }

      // scrollToBottom(cls: any) {
      //     $('.chat-list').scrollTop($('.msg_container_topic ul li').last().position().top + $('.msg_container_topic ul li').last().height())
      //     // console.log($('.' + cls + ' ul li').last().position());
      //     // $('.' + cls).scrollTop($('.' + cls + ' ul li').last().position().top + $('.' + cls + ' ul li').last().height());
      // }

      loadMessages(){
        let t = this;
        let isEven = false;
        let loading = this.loadingCtrl.create({
            content: `Loading...`,
            duration: 10000
        });
        loading.present();
        
        this.http.get(this.constant._API.baseUrl+'/chat_rooms/'+this.chat.chat_room_id+'/messages')
        .timeout(10000)
        .map((data: any) => {
             data = JSON.parse(data._body).data;
             console.log(data);  
            if(data.messages.length > 0){
              this.messages = data.messages;
              this.lastID = this.messages[this.messages.length-1].message_id;
              
              return this.mapMessages(this.messages);
            }
            return [];
       
      }).subscribe((res:any) => {
            console.log(res);
            loading.dismiss();
            this.messagesDayGroups = res;
            let self = this;
            setTimeout(()=>{
              self.scrollChat();
            })
        })
    
      }


 onInputKeypress({ keyCode }: KeyboardEvent): void {
    if (keyCode === 13) {
      //this.sendTextMessage();
    }
  }

      sendTextMessage(){
        if (!this._isOpenEmojiPicker) {
            this.messageInput.setFocus();
        }
        if (!this.message) {
          return;
        }
        console.log(this.message);

         
      
        let t = this;
        var data = {'uid':this.user.uid,'message':this.message};
        this.message = '';
        this.http.post(this.constant._API.baseUrl+'/chat_rooms/'+this.chat.chat_room_id+'/message',JSON.stringify(data))
          .retryWhen((err:any)=>err.delay(10000))
          .map((res:Response) => res.json())
          .subscribe((res:any)=>{
              console.log(res);
              this.message = '';
          },(err:any)=>{
              console.log(err)
          });;
      }


      refreshMessages(){

          let self = this;
          this.refreshRef = setInterval(function(){
           
          let gcount = self.messagesDayGroups.length - 1;
          let l = 0;
          if(gcount>=0){
            let mcount = self.messagesDayGroups[gcount].messages.value.length-1;
            let l = 0;
            if(mcount>=0){
              
              l = self.messagesDayGroups[gcount].messages.value[mcount].message_id;
            }
            
          }else{
            gcount = 0;
            self.messagesDayGroups[gcount] = {
              messages:{
                value: []
              }
            };
            
          }
          self.http.get(self.constant._API.baseUrl+'/chat_rooms/'+self.chat.chat_room_id+'/messages?l='+self.lastID)
            .timeout(10000)
            .retryWhen((err:any)=>err.delay(10000))
            .map((data: any) => {
                data = JSON.parse(data._body).data;
                console.log(data);
                let messages:any = [];
                if(data.messages.length > 0){
                  messages = data.messages;
                  
                  self.lastID = data.messages[data.messages.length-1].message_id;
                  console.log('les ids',data.messages[data.messages.length-1])
                  return self.mapMessages(messages);
                }
                return [];
          }).subscribe((res:any) => {
              if(res.length>0){
                console.log(res[0]);
                res[0].messages.value.forEach((message:any) => {
                  self.messagesDayGroups[gcount].messages.value.push(message);
                  setTimeout(function(){
                      self.scrollChat();
                  },100)
                });
              }
          })
        },1000)
      }


      mapMessages(messages:any){
         const format = 'D MMMM Y';

        // Compose missing data that we would like to show in the view
        messages.forEach((message:any,index:number) => {
          message.ownership = this.user.uid == message.user.uid ? 'mine' : 'other';
          message.jour = Moment(message.created_at).format(format);
          message.type = 'text';
          return message;
        });

        // Group by creation day
        const groupedMessages:any = this.groupBy.transform(messages, 'jour');
        console.log(groupedMessages);
        // Transform dictionary into an array since Angular's view engine doesn't know how
        // to iterate through it
        return Object.keys(groupedMessages).map((timestamp: string) => {
            console.log(groupedMessages[timestamp]);
          return {
            timestamp: groupedMessages[timestamp].key,
            messages: groupedMessages[timestamp],
            today: Moment().format(format) === timestamp
          };
        });

      }



      
      ionViewWillLeave() {
        console.log("leaving page");
        window.clearInterval(this.refreshRef)
      }
}
