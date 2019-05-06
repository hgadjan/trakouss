import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { AngularFire } from "angularfire2";
import { Login } from "../login/login";

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
}) 

export class TutorialPage {
  showSkip = true;

	@ViewChild('slides') slides: Slides;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public storage: Storage,
    public angularFire: AngularFire
  ) { }

  startApp() {
     this.angularFire.auth.subscribe(auth => {
      console.log(auth);
      if (auth) {
        this.navCtrl.push(TabsPage).then(() => {
          this.storage.set('hasSeenTutorial', 'true');
        })
      } else {
        this.navCtrl.push(Login).then(() => {
          this.storage.set('hasSeenTutorial', 'true');
        })
      }
    });
  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

	ionViewWillEnter() {
		this.slides.update();
	}

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
