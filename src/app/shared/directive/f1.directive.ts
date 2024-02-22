import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NgControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, of, Subscription, switchMap } from 'rxjs';
import { DynapopService } from 'src/app/services/dynapop.service';
import { F1PopupComponent } from '../generic/f1-popup/f1-popup.component';
import { ModalComponent } from '../generic/modal/modal.component';

export interface DialogData {
  id: string; // main dynapop Id
  subId: string; // query condition
  des?: number; // bring back column
  search?: boolean; // stop typing search if false
  fill?: number; // if 1 set only code
  loader?: boolean; // to show loader
  multi?: boolean; // Multi-Select if true
  err?: boolean; // stop error if false
  separate?: boolean; // stop error if false
  value?: any; // input value
  formData?: FormControl; // passing the form data to change the sub value or readonly input field
  isSingleValue?: boolean; // state for maintaining or shoing single value
  index?: number; // state for maintaining or shoing single value
  multiValue?: [];
  isErrorPopup: boolean
}

@Directive({
  selector: '[f1]',
})
export class F1Directive implements OnInit, AfterViewInit {
  @Input() f1!: DialogData;
  val!: any[];
  sub: Subscription | undefined;
  dialogRef: any;
  touchtime = 0;
  constructor(
    public dialog: MatDialog,
    public ngControl: NgControl,
    private dynapop: DynapopService,
    private renderer: Renderer2,
    private el: ElementRef,
    private dailog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (!this.f1?.multi && this.f1?.search != false) {
      this.getBySearch();
    }

    this.f1.value = this.ngControl.value;
    this.ngControl.valueChanges?.subscribe((val) => {
      this.f1.value = val;
    });
    this.clear();
    this.insertF1Icons();
  }

  //add arrow buttons to F1 inputs
  insertF1Icons() {
    const divElement = this.renderer.createElement('div');
    this.renderer.addClass(divElement, 'form-group');
    this.renderer.addClass(divElement, 'f1-arrow-btn');
    this.renderer.setStyle(divElement, 'border', '1px solid #ccc');

    const isMultiInput = this.hasTwoInputFields(this.renderer
      .parentNode(this.el.nativeElement));

    isMultiInput
      ? ''
      : this.renderer.setStyle(
        divElement,
        'border-radius',
        '1px 11px 11px 1px'
      );


    const imgElement = this.renderer.createElement('img');
    this.renderer.setAttribute(
      imgElement,
      'src',
      '/assets/images/down-arrow.png'
    );
    this.renderer.addClass(imgElement, 'mt-2');
    this.renderer.addClass(imgElement, 'custom-img-class');
    this.renderer.addClass(imgElement, 'cursor-pointer');
    // Set the title attribute
    this.renderer.setAttribute(imgElement, 'title', 'F1');
    this.renderer.appendChild(divElement, imgElement);
    this.renderer
      .parentNode(this.el.nativeElement)
      .insertBefore(divElement, this.el.nativeElement.nextSibling);
  }

  hasTwoInputFields(element: HTMLElement): boolean {
    const inputFields = element.querySelectorAll('input');
    return inputFields.length === 2;
  }

  ngAfterViewInit() {
    // Get the height of the input element
    const inputHeight = this.el.nativeElement.offsetHeight;
    // Set the height of the <div> element to match the input element's height
    const divElement = this.el.nativeElement.nextSibling;
    if (inputHeight == 0) {
      const formControlElement = document.querySelector('.form-control');
      if (formControlElement) {
        // Get the computed height of the element
        const computedStyle = window.getComputedStyle(formControlElement);
        const height = computedStyle.getPropertyValue('height');
        this.renderer.setStyle(divElement, 'height', height + 'px');
      }
    } else {
      this.renderer.setStyle(divElement, 'height', inputHeight + 'px');
    }
  }

  // sets loader class for dynapop search api
  @HostBinding('class.loading') isLoading: boolean = false;

  // open f1/table popup
  @HostListener('click', ['$event'])
  @HostListener('keydown.F1', ['$event'])
  inputEvent(e: any) {
    e?.preventDefault();
    // if event was on input element
    if (e.type == 'keydown') {
      this.openF1(e);
    } else if (e.type == 'click') {
      if (this.touchtime == 0) {
        // set first click
        this.touchtime = new Date().getTime();
      } else {
        // compare first click to this click and see if they occurred within double click threshold
        if (new Date().getTime() - this.touchtime < 800) {
          // double click occurred
          this.openF1(e);
          this.touchtime = 0;
        } else {
          // not a double click so set as a new first click
          this.touchtime = new Date().getTime();
        }
      }
    }
  }

  openF1(e: any) {
    e?.preventDefault();

    // if event was on input element
    if (e.target.nodeName == 'INPUT') {
      this.dialogRef = this.dialog.open(F1PopupComponent, {
        data: this.f1,
      });
      this.onDialogClose();
    }
  }

  // restrict to type in multi select
  clear() {
    this.ngControl.control?.valueChanges.subscribe(() => {
      if (
        this.f1?.multi &&
        !(this.ngControl.control?.value instanceof Object)
      ) {
        this.ngControl.control?.setValue('', { emitEvent: false });
      }
    });
  }

  // get selected value when popup is closed
  onDialogClose() {
    this.dialogRef.beforeClosed().subscribe((v: any) => {
      this.setVal(v);
    });
  }

  // call dynapop search api
  getBySearch() {
    this.sub = this.ngControl.valueChanges
      ?.pipe(
        debounceTime(500),
        switchMap((txt: any) => {
          let searchPara = {
            dynaPopId: this.f1.id,
            queryConditon: this.f1.subId ?? '',
            searchText: txt,
          };

          let insta = txt instanceof Object; // to avoid search api hit after value fetched
          if (txt && this.f1.search != false && !insta) {
            // set loader class
            this.isLoading = this.f1?.loader ?? true;

            return this.dynapop.getDynaPopBySearch(searchPara);
          } else {
            // return empty Observable to avoid empty valueChange error
            return of();
          }
        })
      )
      .subscribe((v: any) => {
        this.isLoading = false;
        this.setVal({
          value: v?.data?.dataSet,
          bbc: v?.data?.bringBackColumn,
        });
      });
  }

  setVal(v: any) {
    let val: any = [];
    // set value
    if (v?.value?.length) {
      if (this.f1?.multi) {
        // push bringbackColumn in multi select
        v?.value.forEach((vv: any) => {
          val.push(vv[v.bbc - 1]);
        });
      } else {
        // set value as per des
        val = [[v.value[0]?.[v.bbc - 1], v.value[0]?.[this.f1?.des ?? 1]]];

        // set only code
        if (this.f1.fill == 1) {
          val = [val[0]?.[0]];
        } else {
          // if (this.f1?.separate != false) {
          //   let v2 = '  |  ' + val[0]?.[1];
          //   val[0][1] = v2;
          // }
        }
      }

      if (this.f1?.formData) {
        this.f1?.index
          ? this.f1.formData?.setValue(v.value[0][this.f1?.index])
          : this.f1.formData?.setValue(val[0][1]);

        this.f1?.index ? '' : val[0].splice(1, 1);

        this.ngControl.control?.setValue(val);
      }
      if (this.f1?.multiValue) {
        this.f1.multiValue.map((item: any) => {
          item.name?.setValue(v.value[0][item.index]);
        });

        val[0].splice(1, 1);

        this.ngControl.control?.setValue(val);
      } else {
        if (this.f1.isSingleValue) {
          val[0].splice(1, 1);
          this.ngControl.control?.setValue(val);
        } else {
          this.ngControl.control?.setValue(val);
        }
      }
    }

    // set & delete error
    if (
      this.f1?.err != false &&
      !(this.ngControl.control?.value instanceof Object) &&
      !this.f1.multi
    ) {
      let err: any = this.ngControl.control?.errors;
      const nerr = { notFound: true };
      let aerr = err ? Object.assign(err, nerr) : nerr;
      this.ngControl.control?.setErrors(aerr);
    } else if (this.ngControl.hasError('notFound')) {
      delete this.ngControl?.control?.errors?.['notFound'];
    }
  }

  @HostListener('keydown.TAB', ['$event.target'])
  onBlur(target: any): void {
    const parentElement = this.el.nativeElement.parentNode.querySelector('span');
    var companyName = ''
    if (parentElement) {

      companyName = parentElement.textContent.trim();
    } else {
      companyName = "code";

    }
    if (this.f1.isErrorPopup) {
      if (this.ngControl.hasError('notFound')) {

        this.showErrorFieldDialog(
          'K-Raheja ERP',
          'Invalid ' + companyName,
          'error'
        );
      }
    }

  }


  showErrorFieldDialog(titleVal: any, message: string, type: string) {
    const dialogRef = this.dailog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: '',
        type: type,
      },
    });
    dialogRef.afterOpened().subscribe(() => {
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.el.nativeElement.focus();
    });
  }
}
