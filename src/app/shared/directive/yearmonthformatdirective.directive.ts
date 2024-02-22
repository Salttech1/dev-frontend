import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const FORMAT = {
    parse: {
        dateInput: 'YYYYMM',
    },
    display: {
        dateInput: 'YYYYMM',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Directive({
  selector: '[appYearmonthformatdirective]',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: FORMAT },
],
})
export class YearmonthformatdirectiveDirective {

  constructor() { }

}
