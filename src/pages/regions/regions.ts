import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController,LoadingController, App } from 'ionic-angular';
import { RegionService } from './region-service';
import { CarouselConfig } from 'ng2-bootstrap';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Http, Response } from '@angular/http';
import { Constant } from "../../providers/constant";
import { AlbumsComponent } from "../../components/albums/albums";


@Component({
  selector: 'page-regions',
  templateUrl: 'regions.html',
  providers: [RegionService, {provide: CarouselConfig, useValue: {interval: 1500, noPause: true}}]
})

export class RegionPage{
 
  ionViewDidEnter(): void {
      
  }



  
  regions:any[];
  artistesListe:any[];
  data:Observable<any>;
    constructor (
      public navCtrl: NavController,
      public app: App, 
      private _regionService:RegionService,
      public loadingCtrl: LoadingController,
      public http: Http, public constant: Constant)
      {
        let loading = this.loadingCtrl.create({
          content: `Loading...`,
          duration: 10000
      }); 
      loading.present();
        this.http.get(this.constant._API.baseUrl+'/artistes')
        .timeout(10000)
        .retryWhen((err:any)=>err.delay(10000))
        .map((res:Response) => res.json())
        .subscribe((res:any)=>{
            console.log(res.data);
            this.artistesListe = res.data;
            loading.dismiss();
        },(err:any)=>{
            console.log(err)
        });
     
      }



  //   ionViewDidLoad() {
  //     this.app.setTitle('Regions');
  //   }

    goToArtisteDetail(idArtiste: any) {
      // go to the region detail page
      // and pass in the session data
      this.navCtrl.push(AlbumsComponent, idArtiste);
    }




 
}