import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'elementsearch'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], indexCust: number, searchText: string):any {
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

    // return items.map(([value, items]) =>
    //     !value ? items : items.filter((x:any) => x[indexCust].toLowerCase().includes(value))
    //   )


  }

}
