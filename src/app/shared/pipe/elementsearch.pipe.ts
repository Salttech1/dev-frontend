import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'elementsearch'
})
export class ElementsearchPipe implements PipeTransform {
  transform(items: any[], indexCust: number, searchText: string,table:any):any {
    
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
      console.log(singleItem,searchText)
      return singleItem[indexCust].trim().toLowerCase().includes(searchText.toLowerCase())
     // return singleItem[indexCust].search(searchText).draw()
    }
      
    );
  }
}
