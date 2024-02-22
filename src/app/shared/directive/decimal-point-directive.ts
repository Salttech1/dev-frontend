import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
export interface DialogData {
  decPlaces?: string;
  isNegative?: boolean
}

@Directive({
  selector: '[decimalPoint]'
})
export class DecimalPointDirective implements OnInit{
  @Input() decimalPoint!: DialogData;
  sub: Subscription | undefined;
  private regex!: RegExp;
  // Allow decimal numbers and negative values
 
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(private el: ElementRef,  public ngControl: NgControl,) {
  }

  
  ngOnInit(): void {
    this.ngControl.valueChanges?.subscribe(() => {
    });
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if(!this.decimalPoint.isNegative && event.key == "-"){
      event.preventDefault();
    }
    if(this.decimalPoint.isNegative && event.key == "-"){
      if(this.el.nativeElement.value.includes("-")){
        event.preventDefault();
      }
    }
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    if(this.decimalPoint.isNegative){
      this.regex = this.decimalPoint.decPlaces == '0' ? new RegExp(/^-?[0-9]*[^-]$/) : new RegExp('^-?\\d*\\.?\\d{0,'+this.decimalPoint.decPlaces+'}$','g');
    }
    else{
      this.regex = this.decimalPoint.decPlaces == '0' ? new RegExp(/^[0-9]+$/) : new RegExp('^\\d*\\.?\\d{0,'+this.decimalPoint.decPlaces+'}$','g');
    }
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    console.log("Next:", next)
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}