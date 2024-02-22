import { Directive, HostListener, Self } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Directive({
  selector:  'form[formGroup]'
})
export class MarkformtoucheddirectiveDirective {
  constructor(@Self() private container: ControlContainer) { 
  }

  @HostListener('submit')
  onSubmit() {
   // this.container.control.markAllAsTouched();
  }

  
}
