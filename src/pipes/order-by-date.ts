import { PipeTransform, Pipe } from "@angular/core";

@Pipe({
  name: 'sort-by-date'
})
export class SortByDatePipe implements PipeTransform {
  transform(groupedItems: any, date: any): any {
    groupedItems.sort((a: any, b: any) => {
      if (a[date] < b[date]) {
        return -1;
      } else if (a[date] > b[date]) {
        return 1;
      } else {
        return 0;
      }
    });
    return groupedItems;
  }
}