import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTabfocus]'
})
export class TabfocusDirective {

  constructor(private el:ElementRef) { }

  ngOnInit(){
  
  }

  @HostListener('keydown.Tab', ['$event'])
    handleTabFunc(event: KeyboardEvent) {
      let test = this.el.nativeElement
      console.log("tab",test.getAttribute('value'))
    }

}
