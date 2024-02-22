import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCommonAutoFocus]',
})
export class CommonAutoFocusDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.renderer.selectRootElement(this.el.nativeElement).focus();
  }
}
