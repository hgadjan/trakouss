import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the GroupeBy pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'groupe-by'
})
@Injectable()
export class GroupeBy {
  /*
    Takes a value and makes it lowercase.
   */
  transform(value: Array<any>, field: any): Array<any>  {
   const groupedObj = value.reduce((prev, cur)=> {
      if(!prev[cur[field]]) {
        prev[cur[field]] = [cur];
      } else {
        prev[cur[field]].push(cur);
      }
      return prev;
    }, {});
    return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));

  }
}
