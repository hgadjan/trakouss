import { Component } from '@angular/core';
import { NavController, App, LoadingController, NavParams, ViewController, ModalController } from "ionic-angular";
import { Http, Response } from '@angular/http';
import { Constant } from "../../providers/constant";
import { AngularFire } from "angularfire2";
import { SortByDatePipe } from "../../pipes/order-by-date";
import { AddPublicationComponent } from '../add-publication/add-publication';

@Component({
  selector: 'page-publication',
  templateUrl: 'publication.html'
})
export class PublicationPage {
  first: any = true;
  publicationLoadInterval: number;
  publicationList: any;
  loggedinUser: any;

  constructor (
    public navCtrl: NavController,
    public app: App, 
    public loadingCtrl: LoadingController,
    public http: Http, 
    public constant: Constant, 
    public angularFire: AngularFire,
    public sortByDate: SortByDatePipe,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public navParams: NavParams)
    {
      this.angularFire.auth.subscribe(auth => {
      setTimeout(()=>{
        this.loadPublications();
      },1000)
    });
   
    }

    openAddPublication(){
      let modal = this.modalCtrl.create(AddPublicationComponent);
      modal.present();
      
      modal.onWillDismiss((data: any[]) => {
        this.loadPublications();
        if (data) {
          console.log(data);
        }
      });
    }

    ionViewDidEnter() {
      console.log('entreer chat')
      
    }

    ionViewDidLoad() {
      //we only need this call for one time when view loaded to cach
      this.angularFire.auth.subscribe(auth => {
        this.loggedinUser = auth; 
        this.publicationLoadInterval = setInterval(()=>{
          this.loadPublications();
        },3000)
      })

      this.first = false;
    }

  loadPublications(){
    let loading = this.loadingCtrl.create({
      content: `Loading...`,
        duration: 10000
      });
      if(this.first)
        loading.present();

      this.http.get(this.constant._API.baseUrl+'/publications')
        .timeout(10000)
        .retryWhen((err:any)=>err.delay(10000))
        .map((res:Response) => {
          let data = res.json();
          console.log(data);

          return this.sortByDate.transform(data.data,'-created_at');;
        })
        .subscribe((res:any)=>{
            console.log(res);
            this.publicationList = res;
            loading.dismiss();
        },(err:any)=>{
            console.log(err)
        });
  
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
    console.log(window.clearInterval(this.publicationLoadInterval));
  }
}