import { Component, SimpleChanges, ChangeDetectorRef, OnChanges } from '@angular/core';
import { NavController, App, LoadingController, NavParams, Events } from "ionic-angular";
import { RegionService } from "../../pages/regions/region-service";
import { Constant } from "../../providers/constant";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Http, Response } from '@angular/http';
import { AudioProvider, IAudioTrack, ITrackConstraint } from 'ionic-audio';
import { Subject } from "@angular/core/src/facade/async";

/*
  Generated class for the Titres component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
  
@Component({
  selector: 'titres',
  templateUrl: 'titres.html'
})
export class TitresComponent {
  currentIndex: number = 0;

  selectedTrack: any;
  allTracks: IAudioTrack[];
  artiste: any;
  albumTitresListe: any = [];
  idAlbum: any;
  progressInterval: any;

  
  ionViewDidEnter():void {
     
   
  }

   constructor (
      public navCtrl: NavController,
      public app: App, 
      private _regionService:RegionService,
      public loadingCtrl: LoadingController,
      public http: Http, 
      public events: Events,
      public constant: Constant,
      private _audioProvider: AudioProvider,
      private _cdRef: ChangeDetectorRef,
      public navParams: NavParams)
      {
        this.idAlbum = navParams.data;
        this.http.get(this.constant._API.baseUrl+'/album/'+this.idAlbum+'/titres')
        .timeout(5000)
        .retryWhen((err:any)=>err.delay(5000))
        .map((res:Response) => res.json())
        .subscribe((res:any)=>{
            console.log(res);
            //this.albumTitresListe = res.data.titres;
            this.artiste = res.data.artiste;
            res.data.titres.forEach((titre:any) => {

              let t = {
                src: titre.url_titre,
                artist: 'John Mayer',
                title: titre.libele_titre,
                art: titre.image_titre,
                created_at: titre.created_at,
                preload: 'metadata'
              };
              this.albumTitresListe.push(t);
            });
            // if(this.albumTitresListe.length>0){
            //   this.currentTrack = this.albumTitresListe[0];
            // }
        },(err:any)=>{
            console.log(err)
        });
   
 
      } 

     

      playSelectedTrack(audio:IAudioTrack,index:number) {
        // use AudioProvider to control selected track 
        let id = 0;
        if(this.selectedTrack){
          id = this.selectedTrack.id;
        }
        this._audioProvider.stop(id); 
        this.currentIndex = index;
        this.selectedTrack = audio;
        console.log(this.currentIndex);
        this._audioProvider.play(this.selectedTrack.id);
      }
      
      pauseSelectedTrack(audio:IAudioTrack) {
         // use AudioProvider to control selected track 
         this._audioProvider.pause(this.selectedTrack.id);
      } 

      nextTrack() {

        let index = this.currentIndex;
        // this._audioProvider.stop(this.selectedTrack.id);
        index >= this.albumTitresListe.length - 1 ? index = 0 : index++;
        this.playSelectedTrack(this.albumTitresListe[index],index);
      }

      prevTrack(){
        
  
          let index = this.currentIndex;
          // this._audioProvider.stop(this.selectedTrack.id);
          index > 0 ? index-- : index = this.albumTitresListe.length - 1;
          this.playSelectedTrack(this.albumTitresListe[index],index);
  
      }
       

      stopSelectedTrack(audio:IAudioTrack) {
        // use AudioProvider to control selected track 
        this._audioProvider.stop(this.selectedTrack);
        this.selectedTrack = null;
        this.currentIndex = 0;
     }
             
      onTrackFinished(track: any) {
        console.log('Track finished', track)
        this._audioProvider.stop(track.id);
      } 







      ionViewWillLeave() {
       this._audioProvider.stop();
      }






        

}
