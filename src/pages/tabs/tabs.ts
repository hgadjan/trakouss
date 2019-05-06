import { Component, ChangeDetectorRef, Input } from '@angular/core';

import { NavParams, NavController, Events } from 'ionic-angular';

import { RegionPage } from '../regions/regions';
import { ChatsComponent } from "../../components/chats/chats";
import { MediatorProvider } from "../../providers/mediatorProvider";
import { GlobalStatictVar } from "../../shared/interfaces";
import { LogProvider } from "../../providers/logProvider";
import { PublicationPage } from "../../components/publication/publication";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = PublicationPage;
  tab2Root: any = ChatsComponent;
  tab3Root: any = RegionPage; 
  
  mySelectedIndex: number;


  @Input()
  newMsgCount: number = 0;
  @Input()
  headerColor = 'dark';

  constructor(
    public navCtrl: NavController, 
    public medProvid: MediatorProvider, 
    public events: Events, 
    public logProvid: LogProvider, 
    public changeDetectionRef: ChangeDetectorRef,
    navParams:NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;

    events.subscribe(GlobalStatictVar.NOTIFICATION_EVENT, (notify:any) => {
      this.logProvid.log('notify: ' + notify);
      if (notify) {
        this.newMsgCount++;
      } else {
        this.newMsgCount--;
      }
      this.changeDetectionRef.detectChanges();
    });

    events.subscribe(GlobalStatictVar.ONLINE_EVENT, () => {

      this.logProvid.log('channnnnnnnnnnnnnnnnnnnnn');
      this.headerColor = 'secondary';
    });
    events.subscribe(GlobalStatictVar.OFFLINE_EVENT, () => {

      this.logProvid.log('mmmmmmmmmmmmmmmmmmmmmmmmchannnnnnnnnnnnnnnnnnnnnn');
      this.headerColor = 'dark';
    });
  }

}
