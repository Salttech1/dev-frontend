import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[upperCase]',

})
export class UpperCaseDirective {
  constructor(public ngControl: NgControl) { }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    this.ngControl.control?.setValue(event?.target?.value.toUpperCase());
  }

}
