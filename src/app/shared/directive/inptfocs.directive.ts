import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[inputfocus]',
})
export class InptfocsDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @Input() set inputfocus(condition: boolean) {
    if (condition) {
      this.renderer.selectRootElement(this.el.nativeElement).focus();
    }
  }
}
