import { UtilsProvider } from './../../providers/utilsProvider';
import { ChatService } from './../../services/chat_service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, App, LoadingController, NavParams, ViewController } from "ionic-angular";
import { Http, Response } from '@angular/http';
import { Constant } from "../../providers/constant";
import { AngularFire } from "angularfire2";
import { SortByDatePipe } from "../../pipes/order-by-date";

@Component({
  selector: 'add-publication',
  templateUrl: 'add-publication.html',
  providers: [ChatService]
})
export class AddPublicationComponent {
  publicationForm: FormGroup;
  publicationList: any;
  loggedinUser: any;

  constructor (
    public navCtrl: NavController,
    public app: App, 
    public loadingCtrl: LoadingController,
    public http: Http,
    public chatService: ChatService,
    public utils: UtilsProvider,
    public constant: Constant,
    public viewCtrl:ViewController,
    public angularFire: AngularFire,
    public formBuilder: FormBuilder,
    public sortByDate: SortByDatePipe,
    public navParams: NavParams)
    {
      this.publicationForm = formBuilder.group({
          contenu: ['']
      });
    }
    add(){
    if (!this.publicationForm.valid) {
        console.log(this.publicationForm.value);
    } else {
        let data:any = {};

        this.utils.showLoading('');
        data.contenu = this.publicationForm.value.contenu;
        console.log(data);
        this.chatService.addPublication(data).subscribe(resp => {
            this.utils.loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
            this.utils.loader = undefined;  
            this.dismiss();

        }, error => {

            console.log(JSON.parse(error._body).error_description);
            let er = JSON.parse(error._body);
            this.utils.showMessage("Error", er.error_description, "Ok").present();
            this.utils.loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
            this.utils.loader = undefined;
        });
    }
    }
  
dismiss(data?: any) {
  // using the injected ViewController this page
  // can "dismiss" itself and pass back data
  this.viewCtrl.dismiss(data);
}
}