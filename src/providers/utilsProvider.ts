import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';



@Injectable()
export class UtilsProvider {

    loader: any;

    constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController) { }

    showMessage(title:any, message:any, buttonText:any) {
        console.log(message);
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: [buttonText]
        });
        return alert;
    }

    showLoading(msg:any) {
        this.loader = this.loadingCtrl.create({
            spinner: 'bubbles',
            content: msg,
            dismissOnPageChange: true
        });
        this.loader.present();
    }


    showError(errorMsg:any) {
        let prompt = this.alertCtrl.create({
            title: 'Fail',
            subTitle: errorMsg,
            buttons: ['OK']
        });
        prompt.present();
    }

}