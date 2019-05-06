import { NgModule, ErrorHandler } from '@angular/core';

import { ChartsModule } from 'ng2-charts';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen'

import { ConferenceApp } from './app.component';
//Mes pages
import { RegionPage } from '../pages/regions/regions';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { AlbumsComponent } from "../components/albums/albums";
import { TitresComponent } from "../components/titres/titres";
import { ChatsComponent } from "../components/chats/chats";
import { MessagesComponent } from "../components/messages/messages";
import { ChatsOperation } from "../components/chats/chats_operation";
 

import { ForgotPassword } from "../pages/forgot-password/forgot-password";
import { Login } from "../pages/login/login";
import { Signup } from "../pages/signup/signup";

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';
import { Database } from '../providers/db-provider/database';
import { Constant } from '../providers/constant';



import { AuthProvicer } from '../providers/authProvicer';
import { UtilsProvider } from '../providers/utilsProvider';
import { OnlineProvider } from '../providers/onlineProvider';
import { BackendProvider } from '../providers/backendProvider';
import { MediatorProvider } from '../providers/mediatorProvider';
import { LogProvider } from '../providers/logProvider';
import { SqlStorage } from '../shared/SqlStorage';


import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { PublicationPage } from "../components/publication/publication";
import { AddPublicationComponent } from "../components/add-publication/add-publication";

import { EmojiProvider } from '../providers/emoji';
import { EmojiPickerComponent } from "../components/emoji-picker/emoji-picker";
import { ProgressBarComponent } from "../components/progressbar/progress-bar";

import { IonicAudioModule, WebAudioProvider, defaultAudioProviderFactory, CordovaMediaProvider } from 'ionic-audio';
import { SortByDatePipe } from "../pipes/order-by-date";
import { GroupeBy } from "../pipes/groupe-by";
import { LogPage } from "../pages/log-page/log-page";


export function myCustomAudioProviderFactory() {
  return (window.hasOwnProperty('cordova')) ? new CordovaMediaProvider() : new WebAudioProvider();
}

export const firebaseConfig = {
    apiKey: "AIzaSyAfR9xZNB0SBtAXrDgmXOparHjej19N0xc",
    authDomain: "blazing-fire-5226.firebaseapp.com",
    databaseURL: "https://blazing-fire-5226.firebaseio.com",
    projectId: "blazing-fire-5226",
    storageBucket: "blazing-fire-5226.appspot.com",
    messagingSenderId: "790710294832"
  };

const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    ConferenceApp,
    RegionPage,
    TabsPage,
    TutorialPage,
    AlbumsComponent,
    TitresComponent,
    ChatsComponent,
    MessagesComponent,
    EmojiPickerComponent,
    ProgressBarComponent,
    PublicationPage,
    AddPublicationComponent,

    ChatsOperation,
    Login,
    Signup,
    ForgotPassword,
    LogPage
   ],
  imports: [
    ChartsModule,
    IonicModule.forRoot(ConferenceApp),
		IonicStorageModule.forRoot(),
    IonicAudioModule.forRoot(defaultAudioProviderFactory),
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    RegionPage,
    TabsPage,
    TutorialPage,
    AlbumsComponent,
    TitresComponent,
    ChatsComponent,
    MessagesComponent,
    PublicationPage,
    AddPublicationComponent,
    EmojiPickerComponent,
    ChatsOperation,
    Login,
    Signup,
    ForgotPassword,
    LogPage
  ],
  
  providers: [
    SortByDatePipe,
    GroupeBy,
    LogPage,
    SplashScreen,ConferenceData, UserData, Database, Constant,EmojiProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler }, AuthProvicer, UtilsProvider, SqlStorage, Storage,
  MediatorProvider, OnlineProvider, BackendProvider, LogProvider]
})
export class AppModule {
  
}
