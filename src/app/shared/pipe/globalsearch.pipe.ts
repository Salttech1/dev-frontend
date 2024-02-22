import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'globalsearch'
})
export class GlobalsearchPipe implements PipeTransform {

  transform(items: any[], indexCust:number,searchText: string):any {
    debugger
    if (!items) {
      console.log(
        "inside"
      )
    return [];
      }
     if (!searchText) {
      return items;
    }
    return items.filter(singleItem =>{
      debugger
      console.log(singleItem,searchText)
      return singleItem[indexCust].trim().toLowerCase().includes(searchText.toLowerCase())
    }
      
    );

}
}
