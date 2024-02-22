import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[cellNavi]',
})
export class CellNaviDirective {
  @Input() cellNavi!: any; // developer defined Id
  constructor() {}

  @HostListener('keydown', ['$event'])
  navigate(e: KeyboardEvent) {
    let currEl = (e.target as HTMLElement)?.id;

    // run listen event only if id startsWith defined Id else return
    if (!currEl.startsWith(this.cellNavi)) return;

    let currRow: any = currEl.split('-'); // split id from 'i' to get RowID & input El no.
    let nextRow: any = currRow[0].slice(this.cellNavi.length) * 1;

    // prevent input number to incremrnt & decrement on ArrowUp/Down
    e.key == 'ArrowDown' || e.key == 'ArrowUp' ? e?.preventDefault() : '';

    // incremrnt & decrement RowId/Count on ArrowUp/Down
    e.key == 'ArrowDown' ? nextRow++ : e.key == 'ArrowUp' ? nextRow-- : '';

    let nextElId = this.cellNavi + nextRow + '-' + currRow[1]; // make Id of next focus Element
    document.getElementById(nextElId)?.focus();
  }
}
