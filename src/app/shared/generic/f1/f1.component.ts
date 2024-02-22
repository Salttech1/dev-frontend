import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Renderer2,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as constant from '../../../../constants/constant';
import { ModalComponent } from '../modal/modal.component';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';

@Component({
  selector: 'app-f1',
  templateUrl: './f1.component.html',
  styleUrls: ['./f1.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => F1Component),
      multi: true,
    },
  ],
})
export class F1Component implements OnInit {
  @Input() formControlName: string = '';
  @Input() placeholder: string = '';
  @Input() inputcls: string = '';
  @Input() type: string = 'text';
  @Input() disabledVal!: boolean;
  @Input() inputVal: any = '';
  @Input() titleValue: string = '';
  @Input() colHeader: any;
  @Input() tableData: any;
  @Input() inputBBC: any;
  @Input() maxlength!: string;
  @Input() dynaPopId!: string;
  @Input() queryConditon: string = '';
  @Input() fieldDynamic!: number;
  @Input() errorMessage!: string;
  @Input() multiSelect: string = 'single';
  @Input() formControlEnable: boolean = true;
  @Input() readOnly: boolean = false;
  @Input() searchDynaPopList: boolean = true;
  @Input() triggerUpperCase: boolean = true;
  @Output() updatedSelectedValue = new EventEmitter();
  @Output() sendFieldValueChange = new EventEmitter();
  @Input() isF1PressedFlag: boolean = true;
  @Input() errModalShow: boolean = true;
  @Output() focusTrigger = new EventEmitter();
  @Output() modalClosedTrigger = new EventEmitter<[]>();
  @ViewChild('TableListContainer') TableListContainer!: TemplateRef<any>;
  @ViewChild('fo1', { read: ElementRef }) fo1!: ElementRef<HTMLInputElement>;
  control!: AbstractControl<any>;
  currentField: any;
  isDataFound: boolean = false;
  fieldLoaderDisplay: boolean = false;
  test: any;
  dialogReference:any
  // handle double click for mobile responsive

  constructor(
    private controlContainer: ControlContainer,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private dynapop: DynapopService,
    private modalService: ModalService
  ) {}

  writeValue(input: string): void {
    this.currentField = input;
  }
  registerOnChange(fn: any): void {
    this.onChanges = fn;
  }
  registerOnTouched(fn: any): void {}

  ngOnInit(): void {
    if (this.controlContainer && this.formControlName) {
      this.control = this.controlContainer.control?.get(
        this.formControlName
      ) as FormControl;
    }
  }
  touchtime = 0;
  viewModalDialog(titleVal: any) {
    if (this.touchtime == 0) {
      // set first click
      this.touchtime = new Date().getTime();
    }
    else {
      // compare first click to this click and see if they occurred within double click threshold
      if (((new Date().getTime()) - this.touchtime) < 800) {
        // double click occurred
        this.fieldLoaderDisplay = true;
        this.openDialog(titleVal, this.isF1PressedFlag, '');
        this.touchtime = 0;
      } else {
        // not a double click so set as a new first click
        this.touchtime = new Date().getTime();
      }
    }
  }

  openDialog(titleVal: any, f1Pressed: boolean, message: string) {
    // this.fieldLoaderDisplay = true
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: f1Pressed,
        title: titleVal,
        message: message,
        template: this.TableListContainer,
      },
    });
    this.dialogReference = dialogRef
    dialogRef.afterOpened().subscribe(() => {
      this.fieldLoaderDisplay = false;
      console.log('open dialog', this.tableData);
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.modalClosedTrigger.emit(this.tableData);
    });
  }

  updatedRowData(newData: any) {
    this.currentField = newData[this.inputBBC - 1];
    this.updatedSelectedValue.emit(newData);
  }

  searchTextDataBind(
    dynaPopId: string,
    queryConditon: string,
    searchField: string,
    errorMessage: string
  ) {
    this.test = [];
    if (queryConditon == undefined) {
      this.queryConditon = '';
    }
    if (searchField) {
      this.searchDynaPopList && this.dynapop
        .getDynaPopSearchListObj(dynaPopId, queryConditon, searchField)
        .subscribe((res: any) => {
          if (res.data.dataSet.length == 0) {
            this.fo1?.nativeElement?.focus();
            this.currentField = null;
            this.errModalShow && this.showErrorDialog(errorMessage);
            this.updatedSelectedValue.emit([]);
          }
          this.updatedSelectedValue.emit(res.data.dataSet[0]);
        });
    }
  }

  showErrorDialog(message: any) {
    this.modalService.showErrorDialog(
      constant.ErrorDialog_Title,
      message,
      'error'
    );
  }
  @HostListener('keydown.F1', ['$event'])
  onF1KeyPress(event: KeyboardEvent) {
    event.preventDefault();
    this.fieldLoaderDisplay = true;
    this.openDialog(this.titleValue, true, '');
  }

  @HostListener('keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    this.searchTextDataBind(
      this.dynaPopId,
      this.queryConditon,
      this.currentField,
      this.errorMessage
    );
  }

  @HostListener('keydown.Tab', ['$event'])
  handleKeyDownTab(event: KeyboardEvent) {
    if (this.multiSelect == 'single') {
      this.searchTextDataBind(
        this.dynaPopId,
        this.queryConditon,
        this.currentField,
        this.errorMessage
      );
      if (this.test == undefined) {
        event.preventDefault();
      }
    }
  }

  updateFieldValue(event:any) {
    this.sendFieldValueChange.emit(event);
  }

  focusF1Field(e: any) {
    this.focusTrigger.emit();
  }

  // for ngModel formControldisabled
  get value() {
    return this.currentField;
  }
  set value(v: string) {
    if (v !== this.currentField) {
      this.currentField = v;
      this.onChanges(v);
    }
  }
  onChanges(_: any) {}
  // close Modal
  closeModal(){
    this.dialogReference.close()
  }
}
