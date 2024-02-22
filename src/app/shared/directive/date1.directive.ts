import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NgControl,
} from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

export const DATE_MONTH_YEAR_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Directive({
  selector: '[appDate1]',
  providers: [
    //   the above line required for date format
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_MONTH_YEAR_FORMAT },
  ],
})
export class Date1Directive {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: InputEvent): void {
    const input =
      this.el.nativeElement.tagName == 'DIV'
        ? this.el.nativeElement.querySelector('input')
        : (this.el.nativeElement as HTMLInputElement);

    let inputValue = input.value;

    // Remove non-numeric characters
    inputValue = inputValue?.replace(/\D/g, '');

    if (inputValue?.length > 2) {
      inputValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
    }

    if (inputValue?.length > 5) {
      inputValue = inputValue.slice(0, 5) + '/' + inputValue.slice(5);
    }

    if (inputValue?.length > 10) {
      // Restrict the year to four digits
      inputValue = inputValue.slice(0, 10);
    }

    input.value = inputValue;
  }
}
