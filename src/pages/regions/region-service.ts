import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import { Constant } from '../../providers/constant';
import { Database } from '../../providers/db-provider/database';

@Injectable()
export class RegionService {
  private table:string = "region";

    constructor(public http: Http, public constant: Constant, private sql:Database) {
      
    }

    sync(){
        
        var data = new Observable((observer:any)=>{
        var self = this;
            this.sql.getLastSync2(this.table,'').subscribe((lastSync)=>{
                console.log('============',lastSync)
                observer.next(self.getRegionsByApi(lastSync));
            });
        })
        return data;
    }
    
    getRegionsByApi(date:any) {

        var self = this;
       return this.http.get(this.constant._API.baseUrl+'/artistes')
        .timeout(5000)
        .retryWhen(err=>err.delay(5000))
        .map((res:Response) => res.json())
        .subscribe((res:any)=>{
            console.log(res);
            res.data.forEach(function(data:any,key:any){
                self.sql.InsertJsonToDb(self.table,data)
            });
        },(err:any)=>{
            console.log(err)
        });
    }

    getAll(): Observable<any> {
        var table:any[] = [];
       this.sql.query("select * from "+this.table, []).then(data => {
          if (data.res.rows.length > 0) {
            console.log(data.res.rows)
            var len = data.res.rows.length;
             
              for(var i = 0; i < len; i = i + 1) {
                  table[i] = data.res.rows.item(i);
              }
          }
          
      }).catch((err) =>{
            this.sync();
      });
      return Observable.of(table);
    }


    getAllArtistes(): Observable<any> {
         var table:any[] = [];
          var self = this;
       this.http.get(this.constant._API.baseUrl+'/artistes')
        .timeout(5000)
        .retryWhen(err=>err.delay(5000))
        .map((res:Response) => res.json())
        .subscribe((res:any)=>{
            console.log(res);
            table = res;
            // res.forEach(function(data:any,key:any){
            //     table.push(data);
            // });
        },(err:any)=>{
            console.log(err)
        });


      return Observable.of(table);
    }
   

}
