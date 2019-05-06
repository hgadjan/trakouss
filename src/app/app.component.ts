
import { Component, ViewChild } from '@angular/core';

import { MenuController, Nav, Platform, Events } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { RegionPage } from '../pages/regions/regions';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';

import { UserData } from '../providers/user-data';
import { ConferenceData } from '../providers/conference-data';
import { RegionService } from '../pages/regions/region-service';
import { Database } from '../providers/db-provider/database';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { StatusBar } from "ionic-native";

// import { LoginPage } from "../components/login/login";
import { SignupPage } from "../components/signup/signup";
import { AngularFire } from "angularfire2";
import { MediatorProvider } from "../providers/mediatorProvider";
import { Login } from "../pages/login/login";
import { UtilsProvider } from "../providers/utilsProvider";
import { Signup } from "../pages/signup/signup";

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.template.html',
  providers:[RegionService,Database,LocalNotifications]
})
export class ConferenceApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'Résultats', component: TabsPage, tabComponent: RegionPage, icon: 'calendar' },
    ]; 


    
  loggedInPages: PageInterface[] = [
    { title: 'Logout', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Login', component: Login, icon: 'log-in' },
    { title: 'Signup', component: Signup, icon: 'person-add' }
  ];
   

  rootPage: any;

  constructor( 
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    public confData: ConferenceData,
    public storage: Storage,
    public _SplashScreen: SplashScreen,
    public _RegionService:RegionService,
    public _Database:Database,
    private localNotifications:LocalNotifications,
    public utils: UtilsProvider,
    
    public angularFire: AngularFire, public medProvid: MediatorProvider
  ) {

	    //medProvid.initLocaleDB();
      this.intialize();
      this.listenToLoginEvents();
  }

  intialize() {
    this.utils.showLoading('Loading...');

     // Check if the user has already seen the tutorial
    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
            this.angularFire.auth.subscribe(auth => {
              console.log(auth);
              this.utils.loader.dismiss().catch((err:any)=>{

              });
              if (auth) {
                this.rootPage = TabsPage;
              } else {
                this.rootPage = Login;
              }
            });

        } else {
 
          this.rootPage = TutorialPage;
          this.utils.loader.dismiss();
          //this._Database._tryInit();
        }
        this.platformReady()
      })


    // decide which menu items should be hidden by current login status stored in local storage
    // this.userData.hasLoggedIn().then((hasLoggedIn) => {
    //   if (hasLoggedIn) {
    //     this.rootPage = TabsPage;
    //   } else {
    //     this.rootPage = LoginPage;
    //   }

    //   this.enableMenu(hasLoggedIn === true);
    // });


    
  }

  openPage(page: PageInterface) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      this.nav.setRoot(page.component, { tabIndex: page.index });
    } else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this.userData.logout();
      }, 1000);
    }
  }

  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });

    this.events.subscribe('music:playing', (data:any) => {
      console.log('musique is play',data);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this._SplashScreen.hide();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
    });
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().component === page.component) {
      return 'primary';
    }
    return;
  }
}
