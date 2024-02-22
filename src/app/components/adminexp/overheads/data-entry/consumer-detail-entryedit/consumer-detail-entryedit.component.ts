import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { range, Subject, take } from 'rxjs';
import { OverheadsService } from 'src/app/services/adminexp/overheads.service';
import * as moment from 'moment';
import { ServiceService } from 'src/app/services/service.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';

@Component({
  selector: 'app-consumer-detail-entryedit',
  templateUrl: './consumer-detail-entryedit.component.html',
  styleUrls: ['./consumer-detail-entryedit.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
  ],
})
export class ConsumerDetailEntryeditComponent implements OnInit {
  ConnTableDataList: any;
  billwiseconnFilter!: string;
  strBilltype!: string;
  strohdh_connocode!: string;
  strohdh_conno!: string;
  ConnColumnHeader: any;
  ConnMeterData!: any[];
  BillTypArr!: any[];
  ConnCodeArr!: any[];
  fetchvalueArray!: any[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  tranMode: String = '';
  ohdhconno: String = '';
  overHeadConsRequestData: any;
  overheadmeterResponseBeanList: any = [];
  overheadmeterResponseBean: any = [];
  pipe: any;
  ohdhvacantflatyn: String = '';
  insertUpdateDelete: String = '';
  insertUpdateMode: String = '';
  meternoOld: String = '';
  vacantFlatYNFlag: String = '';
  disabledFlagAdd: boolean = false;
  disabledFlagRetrieve: boolean = false;
  insertDeleteRow: boolean = true;
  disableFlagDelete: boolean = false;
  disabledFlagSave: boolean = false;
  disableControlflag: boolean = false;
  disabledFlagBack: boolean = true;
  disabledFlagExit: boolean = false;
  visibleformcontrol: boolean = false;
  recordExistorNot: boolean = false;
  isChecked: boolean = false;
  visibleConnectionSelection: boolean = false;
  @ViewChild(F1Component) comp!: F1Component;

  connectionSelection: FormGroup = new FormGroup({
    billType: new FormControl<String | null>('', Validators.required),

    connectionNo: new FormControl<String | null>('', Validators.required),
    ohdhconnocode: new FormControl<String[] | null>({
      value: [],
      disabled: false,
    }),
  });

  connectionform = new FormGroup({
    ohdhconsumerno: new FormControl<String | null>({
      value: '',
      disabled: true,
    }),
    ohdhbillcoy: new FormControl<String | null>({ value: '', disabled: false }),
    ohdhbldgcode: new FormControl<String | null>({
      value: '',
      disabled: false,
    }),

    ohdhdepositeamt: new FormControl<number>(0, [Validators.maxLength(10)]),

    ohdhflatnum: new FormControl<String | null>({ value: '', disabled: false }),
    ohdhload: new FormControl<String | null>({ value: '', disabled: false }),
    ohdhlocation: new FormControl<String | null>({
      value: '',
      disabled: false,
    }),
    ohdhpaycoy: new FormControl<String | null>({ value: '', disabled: false }),
    ohdhstatus: new FormControl<String | null>(
      { value: '', disabled: false },
      conditionalValue()
    ),
    ohdhtmpmeteryn: new FormControl<String | null>({
      value: '',
      disabled: false,
    }),
    ohdhvacantflatyn: new FormControl<String | null>({
      value: '',
      disabled: false,
    }),

    itemDetailBreakUp: new FormArray([this.itemDetailInitRows()]),
    itemDetailDeleteBreakUp: new FormArray([]),
  });

  ngOnInit(): void {
    //this.createF1forBillType();
    setTimeout(function () {
      document.getElementById('billType')?.focus();
    }, 100);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
    };
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  ngAfterViewInit(): void {
    //this.focusField();
    this.comp?.fo1?.nativeElement?.focus();
  }
  //To add default focus on input field
  focusField() {
    //Below getElementById should be unique id in every component
    let el = document.getElementById('billType')
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  disablecontrol()
  {
    this.connectionform.get('ohdhbillcoy')?.disable();
    this.connectionform.get('ohdhpaycoy')?.disable();
  }
  enableControl()
  {
    this.connectionform.get('ohdhbillcoy')?.enable();
    this.connectionform.get('ohdhpaycoy')?.enable();

  }

  itemDetailInitRows() {
    return this.fb.group({
      connocode: new FormControl<string | null>({ value: '', disabled: true }),
      meterno: new FormControl<string>('', [
        Validators.maxLength(15),
        Validators.required,
      ]),
      meternoOld: new FormControl<string>('', [Validators.maxLength(15)]),
      insertUpdateMode: new FormControl<string>('N', [Validators.maxLength(1)]),
    });
  }

  get itemBreakUpFormArr() {
    return this.connectionform.get('itemDetailBreakUp') as FormArray;
  }
  get itemBreakupDeleteFormArr() {
    return this.connectionform.get('itemDetailDeleteBreakUp') as FormArray;
  }

  validateRowInsert(rowIndex: number) {
    if (
      this.itemBreakUpFormArr.controls[rowIndex].get('meterno')?.value ==
        null ||
      this.itemBreakUpFormArr.controls[rowIndex].get('meterno')?.value.trim() ==
        ''
    ) {
      this.insertDeleteRow = false;
    } else {
      this.insertDeleteRow = true;
    }
  }

  addrow(rowIndex: any) {
    //console.log("test");
    this.validateRowInsert(rowIndex);
    console.log('this.insertDeleteRow', this.insertDeleteRow);

    if (this.insertDeleteRow == true) {
      this.itemBreakUpFormArr.push(this.itemDetailInitRows());
      console.log('inside Addrow', this.strohdh_connocode);
      console.log('rowIndex', rowIndex);

      this.itemBreakUpFormArr.controls[rowIndex + 1]
        .get('connocode')
        ?.setValue(this.strohdh_connocode.trim());
      this.insertUpdateMode = 'N';
    }
  }

  deleterow(rowIndex: any) {
    console.log('rowindex', rowIndex);
    this.deleteFormArr(rowIndex);
  }

  // deleteAllrow(){
  //   for (let i = 1; i < this.itemBreakUpFormArr.length; i++) {
  //     this.itemBreakUpFormArr.removeAt(i);
  //   }
  // }

  deleteFormArr(DeleteRowIndex: any) {
    //console.log("this.itemBreakUpFormArr.length",this.itemBreakUpFormArr.length);
    console.log(
      'before this.itemBreakupDeleteFormArr',
      this.itemBreakupDeleteFormArr.length
    );
    for (let i = 1; i < this.itemBreakUpFormArr.length; i++) {
      if (DeleteRowIndex == i) {
        this.itemBreakupDeleteFormArr.push(this.itemBreakUpFormArr.at(i));
        this.itemBreakUpFormArr.controls[i]
          .get('insertUpdateMode')
          ?.setValue('D');

        this.itemBreakUpFormArr.removeAt(i);
      }
    }
  }

  constructor(
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private cdref: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: ModalService,
    private router: Router,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private overheadsService: OverheadsService,
    private fb: FormBuilder,
    //private _service:ServiceService,
    private service: ServiceService,
    private el: ElementRef
  ) {}

  displayConnDetailForm(res: any) {
    console.log('inside patch', res);
    this.connectionform.patchValue({
      // consumerNo: res?.ohdhconno,
      ohdhbillcoy: res?.ohdhbillcoy,
      ohdhpaycoy: res?.ohdhpaycoy,
      ohdhlocation: res?.ohdhlocation,
      ohdhload: res?.ohdhload,
      ohdhdepositeamt: res?.ohdhdepositeamt,
      ohdhbldgcode: res?.ohdhbldgcode,
      ohdhflatnum: res?.ohdhflatnum,
      ohdhstatus: res?.ohdhstatus,
      ohdhvacantflatyn: res?.ohdhvacantflatyn,
    });
    console.log('this.ohdhvacantflatyn', this.ohdhvacantflatyn);

    if (this.ohdhvacantflatyn == 'Y') {
      this.isChecked = true;
    }
  }

  addOverheadConsDetails() {
    this.checkOverheadConsumerExist();
    console.log('test add');

    //if (this.connectionSelection?.valid) {
    console.log('inside add');

    this.tranMode = 'A';
    this.strohdh_connocode = '';
    this.actionDisabledEnabledButtons(true, true, true, false, false);
    this.visibleformcontrol = true;
    //this.disableControlflag = false;
    this.enableControl();
    this.strohdh_conno = this.ConnCodeArr.toString();
    this.connectionSelection.disable();
    //}
  }
  ChkConnectionbillExist() {
    console.log('inside bill chk');
    console.log('this.strohdh_connocode', this.strohdh_connocode.trim());
    //this.strohdh_conno.trim()
    this.overheadsService
      // .getConsumerBillExistInOverhead(this.connectionSelection.get('ohdhconnocode')?.value instanceof Object ?
      // this.connectionSelection.get('ohdhconnocode')?.value[0][0].trim() :
      // this.connectionSelection.get('ohdhconnocode')?.value.trim() )

      .getConsumerBillExistInOverhead(this.strohdh_connocode.trim())
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          console.log('data count', res);
          let strLocBillcount = res;
          console.log('strLocBillcount', strLocBillcount);

          if (strLocBillcount > 0) {
            console.log('inside count');

            //ohdhbillcoy: new FormControl<String | null>({ value: '', disabled: false }),
            //this.connectionform.get('ohdhbillcoy')?.enable=false;
            //this.disableControlflag = true;
            this.disablecontrol();
            
          } else {
            console.log("insdide else");
            
            this.enableControl();
          }
        },
      });
  }
  checkOverheadConsumerExist() {
    this.overheadsService
      //.getOverheadConsumerExist(this.strohdh_connocode)
      .getOverheadConsumerExist(
        this.connectionSelection.get('ohdhconnocode')?.value instanceof Object
          ? this.connectionSelection.get('ohdhconnocode')?.value[0][0].trim()
          : this.connectionSelection.get('ohdhconnocode')?.value.trim()
      )
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          console.log('data', res);
          if (!res.status) {
            this.recordExistorNot = true;
            this.modalService.showErrorDialogCallBack(
              'Overhead detail ',
              res['message'],
              this.el.nativeElement
                .querySelector('input[id="billType"]')
                ?.focus(),
              'info'
            );
            this.back();
          } else {
            this.tranMode = 'A';
            console.log('this.tranMode ', this.tranMode);

            this.strohdh_connocode = '';
            this.actionDisabledEnabledButtons(true, true, true, false, false);
            this.visibleformcontrol = true;
            //this.disableControlflag = false;
            this.enableControl();
            this.strohdh_conno = this.ConnCodeArr.toString();
            this.connectionSelection.disable();
            this.connectionform.patchValue({
              ohdhstatus: '',
              ohdhdepositeamt: 0,
            });
          }
        },
      });
  }
  retriveOverheadConDetails() {
    this.tranMode = 'R';
    console.log('this.strohdh_connocode', this.strohdh_connocode);
    console.log('tedst');
    this.ChkConnectionbillExist();
    this.retriveconnDatadetails();
    console.log('inside Retrive mode', this.tranMode);
    this.actionDisabledEnabledButtons(true, true, true, false, false);
    this.visibleConnectionSelection = true;
    console.log('this.visibleformcontrol', this.visibleformcontrol);
    this.visibleformcontrol = true;
    this.connectionSelection.get('billType')?.disable();
    this.connectionSelection.disable();
  }

  fetchFirstelementvaluefromObject(
    prameterValue: any,
    paramIndex: number,
    positionparamIndex: number
  ) {
    //console.log("prameterValue",prameterValue);

    if (typeof prameterValue == 'undefined' || prameterValue == '') {
      return '';
    } else {
      this.fetchvalueArray = prameterValue;
      return this.fetchvalueArray[paramIndex][positionparamIndex];
    }
  }

  patchoverheadMeterData() {
    this.overheadmeterResponseBean = this.saveMeterDataInArrayList();
    console.log(
      'this.saveDeleteMeterDataInArrayList()',
      this.saveDeleteMeterDataInArrayList()
    );
    let deleteArrayList = this.saveDeleteMeterDataInArrayList();
    //test=test.overheadmeterRequestBeanList;
    deleteArrayList.map((deleteRecord: any) => {
      this.overheadmeterResponseBean.push(deleteRecord);
    });

    //this.overheadmeterResponseBean = this.overheadmeterResponseBean && this.saveDeleteMeterDataInArrayList();
    console.log('overheadmeterResponseBean', this.overheadmeterResponseBean);
  }

  overHeadConsPayLoadData() {
    let userid = sessionStorage.getItem('userName');
    let ohdhuserid = sessionStorage.getItem('userName');
    this.overHeadConsRequestData = {
      ohdhbilltype: this.fetchFirstelementvaluefromObject(
        this.connectionSelection.get('billType')?.value,
        0,
        0
      )?.trim(),

      //ohdhconnocode: this.connectionSelection.get('ohdhconnocode')?.value,
      ohdhconnocode: this.strohdh_connocode
        ? this.strohdh_connocode.trim()
        : '',
      ohdhconno: this.strohdh_conno.trim(),

      ohdhbillcoy: this.fetchFirstelementvaluefromObject(
        this.connectionform.get('ohdhbillcoy')?.value
          ? this.connectionform.get('ohdhbillcoy')?.value
          : '',
        0,
        0
      )?.trim(),
      ohdhbldgcode: this.fetchFirstelementvaluefromObject(
        this.connectionform.get('ohdhbldgcode')?.value
          ? this.connectionform.get('ohdhbldgcode')?.value
          : '',
        0,
        0
      )?.trim(),

      ohdhlocation: this.fetchFirstelementvaluefromObject(
        this.connectionform.get('ohdhlocation')?.value
          ? this.connectionform.get('ohdhlocation')?.value
          : '',
        0,
        0
      )?.trim(),
      ohdhpaycoy: this.fetchFirstelementvaluefromObject(
        this.connectionform.get('ohdhpaycoy')?.value
          ? this.connectionform.get('ohdhpaycoy')?.value
          : '',
        0,
        0
      )?.trim(),

      ohdhflatnum: this.fetchFirstelementvaluefromObject(
        this.connectionform.get('ohdhflatnum')?.value
          ? this.connectionform.get('ohdhflatnum')?.value
          : '',
        0,
        0
      )?.trim(),
      ohdhload: this.connectionform.get('ohdhload')?.value,
      ohdhstatus: this.connectionform.get('ohdhstatus')?.value,
      ohdhdepositeamt: this.connectionform.get('ohdhdepositeamt')?.value,
      ohdhuserid,
      ohdhvacantflatyn: this.ohdhvacantflatyn,
      connectionNo: this.connectionform.get('ohdhconnocode')?.value,
      ohdhconsumerno: this.strohdh_conno,
      overheadmeterRequestBeanList: this.overheadmeterResponseBean,
    };
    console.log('this.overHeadConsRequestData', this.overHeadConsRequestData);

    return this.overHeadConsRequestData;
  }
  callMyFunction(e: any) {
    // var element = $(e.currentTarget);
    // var name = element.parent().find('#name');
    // var id = element.parent().find('#id');
    console.log('inside CALL MY FUNCTION');
    this.onSubmitForm();
  }
  onSubmitForm() {
    console.log('inside on submit form');
    console.log(
      "this.connectionform.get('ohdhbillcoy')",
      this.connectionform.get('ohdhbillcoy')?.invalid
    );
    this.service.setFocusField(
      this.connectionform.controls,
      this.el.nativeElement
    );
  }

  // setFocusControlsArray(formControls:any){
  //   for (let i = 0; i < formControls.length; i++) {
  //     for (const key of Object.keys(formControls[i].controls)) {
  //       if (formControls[i].controls[key].invalid) {
  //         //el.querySelector('[id="' + key + '_' + i + '"]')?.focus();
  //         formControls[i].controls[key].errors && this.toasterService.error(`${formControls[i].controls[key].errors.errMsg}`)
  //         break;
  //       }
  //     }
  //   }
  // }

  saveMeterDataInArrayList() {
    let newArr = [];

    for (
      let i = 0;
      i < this.connectionform.controls.itemDetailBreakUp.value.length;
      i++
    ) {
      //newArr.push(this.connectionform.controls.itemDetailBreakUp.value[i])
      newArr.push(
        this.connectionform.controls.itemDetailBreakUp.getRawValue()[i]
      );
    }
    this.overheadmeterResponseBeanList = JSON.parse(JSON.stringify(newArr));
    let _controlArr: string[] = ['connocode', 'meterno', 'meternoOld'];
    this.overheadmeterResponseBeanList.map((key: any, index: any) => {
      _controlArr.map((ckey: any) => {
        //this.overheadmeterResponseBeanList[index][ckey] = parseFloat(key[ckey]);
        this.overheadmeterResponseBeanList[index][ckey] = key[ckey];
      });
    });
    console.log(this.overheadmeterResponseBeanList);
    return this.overheadmeterResponseBeanList;
  }
  saveDeleteMeterDataInArrayList() {
    let newArr: never[] = [];
    for (
      let i = 0;
      i < this.connectionform.controls.itemDetailDeleteBreakUp.value.length;
      i++
    ) {
      //newArr.push(this.connectionform.controls.itemDetailDeleteBreakUp.value[i])
      newArr.push(
        this.connectionform.controls.itemDetailDeleteBreakUp.getRawValue()[i]
      );
    }
    this.overheadmeterResponseBeanList = JSON.parse(JSON.stringify(newArr));
    let _controlArr: string[] = ['connocode', 'meterno', 'meternoOld'];
    this.overheadmeterResponseBeanList.map((key: any, index: any) => {
      _controlArr.map((ckey: any) => {
        //this.overheadmeterResponseBeanList[index][ckey] = parseFloat(key[ckey]);
        this.overheadmeterResponseBeanList[index][ckey] = key[ckey];
      });
    });
    console.log(this.overheadmeterResponseBeanList);
    return this.overheadmeterResponseBeanList;
    //console.log(newArr, "newArr");
  }

  getvacantflag(e: any) {
    // console.log('e', e);
    if (e.target.checked) {
      this.ohdhvacantflatyn = 'Y';
    } else {
      this.ohdhvacantflatyn = 'N';
    }
    console.log('sup', this.ohdhvacantflatyn);
  }

  saveOverheadDetails() {
    this.onSubmitForm();
    console.log('inside save payload', this.connectionform);
    for (
      let i = 0;
      i < this.connectionform.controls.itemDetailBreakUp.value.length;
      i++
    ) {
      // console.log(
      //   'this.connectionform.controls.itemDetailBreakUp.value[i]',
      //   this.connectionform.controls.itemDetailBreakUp.value[i].meterno?.at(i)

      // );
      if (
        this.itemBreakUpFormArr.controls[i].get('meterno')?.value == null ||
        this.itemBreakUpFormArr.controls[i].get('meterno')?.value.trim() == ''
      ) {
        this.toastr.error('Please enter Meter No');
      } else {
        this.patchoverheadMeterData();
        if (this.ohdhvacantflatyn == '') {
          this.ohdhvacantflatyn = 'N';
        }
        //if (this.connectionform.valid) {

        //console.log('form', this.billEntryform);
        let savePayload = {
          ...this.overHeadConsPayLoadData(),
        };
        console.log('save', savePayload);

        if (this.tranMode == 'A') {
          console.log('save mode flag ', this.tranMode);
          console.log('savePayload insert ', savePayload);
          this.overheadsService.addOverheadConsDetails(savePayload).subscribe({
            next: (res) => {
              //console.log('save res', res);
              if (res.status) {
                this.modalService.showErrorDialog(
                  'Overhead connection detail Inserted',
                  res['message'],
                  'info'
                );
              }
            },
          });
        } else if (this.tranMode == 'R') {
          console.log('inside Rerive save', this.tranMode);
          console.log('savePayload insert ', savePayload);

          this.overheadsService.updateOverheadcon(savePayload).subscribe({
            next: (res) => {
              //console.log('save res', res);
              if (res.status) {
                this.modalService.showErrorDialogCallBack(
                  'Overhead connection detail updated',
                  res['message'],
                  this.el.nativeElement
                    .querySelector('input[id="billType"]')
                    ?.focus(),
                  'info'
                );
              }
            },
          });
        }
        this.back();
        //}
        //}
      }
    }
  }

  retriveconnDatadetails() {
    this.actionService.getReterieveClickedFlagUpdatedValue(true);
    console.log('this.strohdh_connocode', this.strohdh_connocode);
    if (this.strohdh_connocode) {
      console.log('inside retrive');
      //this.connectionform.markAllAsTouched();
      this.overheadsService
        .getOverheadConsDetails(this.strohdh_connocode)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res.data) {
              for (
                var i = 0;
                i < res.data.overheadmeterResponseBeanList?.length;
                i++
              ) {
                res.data.overheadmeterResponseBeanList?.length - 1 == i
                  ? ''
                  : this.itemBreakUpFormArr.push(this.itemDetailInitRows());
                this.connectionform.controls.itemDetailBreakUp.patchValue(
                  res.data.overheadmeterResponseBeanList
                );
              }
              // this.ConnMeterData = res.data.overheadmeterResponseBeanList;
              // console.log('this.ConnMeterData', this.ConnMeterData);
              console.log(
                'res.data.overheadmeterResponseBeanList',
                res.data.overheadmeterResponseBeanList
              );
              this.displayConnDetailForm(res.data);
            } else {
              this.toastr.error('Record Not  Found for this connection');
            }
          },
        });
    }
  }

  findBillType(e: any) {
    this.BillTypArr = this.connectionSelection.get('billType')?.value;
    this.billwiseconnFilter = `ohdh_billtype='${this.BillTypArr[0]?.[0]}'`;
    this.strBilltype = this.BillTypArr[0]?.[0];
    this.strohdh_conno = '';
    this.strohdh_connocode = '';
  }
  findConncodeCode(e: any) {
    this.ConnCodeArr = this.connectionSelection.get('ohdhconnocode')?.value;
    this.strohdh_connocode = this.ConnCodeArr[0]?.[1];
    this.strohdh_conno = this.ConnCodeArr[0]?.[0];
    // console.log("this.strohdh_connocode",this.strohdh_connocode);
    // console.log("this.strohdh_conno",this.strohdh_conno);
  }

  // action
  actionDisabledEnabledButtons(
    isAddFlag: boolean,
    isRetrieveFlag: boolean,
    isDelete: boolean,
    isSaveFlag: boolean,
    isBack: boolean
  ) {
    this.disabledFlagAdd = isAddFlag;
    this.disabledFlagRetrieve = isRetrieveFlag;
    this.disabledFlagSave = isSaveFlag;
    this.disableFlagDelete = isDelete;
    this.disabledFlagBack = isBack;
  }
  back() {
    console.log('inside Back');
    this.connectionSelection.reset();
    this.connectionform.reset();
    this.ConnMeterData = [];

    this.connectionform.controls.itemDetailBreakUp.clear();
    this.connectionform.controls.itemDetailDeleteBreakUp.clear();
    this.itemBreakUpFormArr.push(this.itemDetailInitRows());
    this.itemBreakupDeleteFormArr.clear();

    this.actionDisabledEnabledButtons(false, false, false, true, true);
    this.visibleformcontrol = false;
    this.visibleConnectionSelection = true;
    this.connectionSelection.enable();
    this.focusField();
    setTimeout(function () {
      document.getElementById('billType')?.focus();
    }, 100);
  }
  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }
}
export function conditionalValue(): ValidatorFn {
  return (_control: AbstractControl): ValidationErrors | null => {
    console.log('_control.value', _control.value);
    if (_control.value != null) {
      let statusValue = _control.value.trim();
      if (statusValue && statusValue.toUpperCase() != 'H') {
        return { statusValue: true };
      }
    }
    return null;
  };
}
