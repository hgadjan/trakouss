import { Injectable } from '@angular/core';



@Injectable()
export class LogProvider {


    logArray: any[] = new Array();
    constructor() { }

    log(logMsg:any) {
        console.log(logMsg)
        this.logArray.push(logMsg);
    }


}