import { Component } from '@angular/core';
import { NavController, App, LoadingController, NavParams } from "ionic-angular";
import { RegionService } from "../../pages/regions/region-service";
import { Constant } from "../../providers/constant";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Http, Response } from '@angular/http';
import { TitresComponent } from "../titres/titres";

/*
  Generated class for the Albums component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'albums',
  templateUrl: 'albums.html'
})
export class AlbumsComponent {
  albumsListe: any;
  idArtiste: number;
  ionViewDidEnter(): void {

  }

   constructor (
      public navCtrl: NavController,
      public app: App, 
      private _regionService:RegionService,
      public loadingCtrl: LoadingController,
      public http: Http, 
      public constant: Constant,
      public navParams: NavParams)
      {
        this.idArtiste = navParams.data;
        this.http.get(this.constant._API.baseUrl+'/artistes/'+this.idArtiste+'/albums')
        .timeout(5000)
        .retryWhen((err:any)=>err.delay(5000))
        .map((res:Response) => res.json())
        .subscribe((res:any)=>{
            console.log(res.data);
            this.albumsListe = res.data;
        },(err:any)=>{
            console.log(err)
        });
      }


       goToAlbumDetail(idAlbum: any) {
      // go to the region detail page
      // and pass in the session data
        this.navCtrl.push(TitresComponent, idAlbum);
    }
}
