import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray,
  AsyncValidatorFn,
  ValidationErrors,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { DynapopService } from 'src/app/services/dynapop.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import * as constant from '../../../../../../constants/constant';
import { ModalService } from 'src/app/services/modalservice.service';
import * as moment from 'moment';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { Observable, map, of, take } from 'rxjs';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { DebitNoteService } from '../../debit-note.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';

export const MY_DATE_FORMAT = {
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

@Component({
  selector: 'app-gst-debit-notes-entry',
  templateUrl: './gst-debit-notes-entry.component.html',
  styleUrls: ['./gst-debit-notes-entry.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class GstDebitNotesEntryComponent implements OnInit {
  datePipe = new DatePipe('en-US');
  gstDebitNoteDetails: boolean = false;
  @ViewChild(F1Component) comp!: F1Component;
  disableAdd: boolean = false;
  disableRetrieve: boolean = false;
  isDataUpdated: boolean = false;
  isDataAdded: boolean = false;
  disableSave: boolean = false;
  debitNoteTableData: any;
  origDebitAmnt: Number = 0;
  origTranAmnt: Number = 0;
  suppBillData: any;
  loaderToggle: boolean = false;
  uomData: any;
  partyData: any;
  dataName: any;
  isAddClicked: boolean = false;
  isRetrieveClicked: boolean = false;
  isSuppBillSelected: boolean = false;
  itemsDebitNoteWiseArray: any = [];
  isDataRecieved: boolean = false;
  showTable: boolean = false;
  dbnotehRequestBean: any;
  initialDebitNoteQuantity: any = 0;
  total: number = 0;
  totalFoto: number = 0;
  totalTaxable: number = 0;
  totalDiscount: number = 0;
  totalTds: number = 0;
  totalCgst: number = 0;
  totalSgst: number = 0;
  totalIgst: number = 0;
  totalUgst: number = 0;
  constructor(
    private dynapop: DynapopService,
    private rendered: Renderer2,
    private debitNoteService: DebitNoteService,
    private el: ElementRef,
    private modalService: ModalService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private cderf: ChangeDetectorRef,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalComponent>,
  ) {}

  ngOnInit(): void {
    this.getDebitNotesList();
    this.getParties();
    this.getUOMData();
  }

  ngAfterViewInit() {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus();
  }

  checkIsDbnoteValid(event: any) {
    if ((event! = undefined && event.lenght > 0)) {
      this.disableAdd = true;
    }
  }

  ngAfterContentChecked() {
    this.cderf.detectChanges();
    this.generateDebitNotePayload();
    console.log("Debit Note Payload: ", this.dbnotehRequestBean)
  }

  gstDebitNotesEntryForm = new FormGroup({
    debitNote: new FormControl('', Validators.required),
    debitNoteDate: new FormControl(new Date(), [validateDebitNoteDate()]),
    prop: new FormControl(''),
    party: new FormControl('S'),
    partyName: new FormControl('Supplier'),
    suppbillno: new FormControl('', [
      Validators.required,
      Validators.maxLength(16),
    ]),
    suppbilldt: new FormControl(),
    partycode: new FormControl('', Validators.required),
    partyCodeName: new FormControl(''),
    billtype: new FormControl(''),
    dnAmount: new FormControl('', [Validators.required]),
    project: new FormControl(''),
    bldgcode: new FormControl(''),
    projectName: new FormControl(''),
    tdsPercent: new FormControl('', Validators.maxLength(4)),
    tdsamount: new FormControl('', Validators.maxLength(12)),
    coy: new FormControl(''),
    companyName: new FormControl(''),
    narration: new FormControl(''),
    dequantity: new FormControl(0),
    amount: new FormControl(0, Validators.maxLength(9)),
    description1: new FormControl('', Validators.maxLength(50)),
    description2: new FormControl('', Validators.maxLength(50)),
    description3: new FormControl('', Validators.maxLength(50)),
    description4: new FormControl('', Validators.maxLength(50)),
    description5: new FormControl('', Validators.maxLength(50)),
    matgroup: new FormControl(''),
    matGroupName: new FormControl(''),
    matcode: new FormControl(''),
    matCodeName: new FormControl(''),
    uom: new FormControl('', [Validators.maxLength(10)], [this.validateUOM()]),
    rate: new FormControl(0),
    itemsDebitNoteWiseArray: new FormArray([
      this.fb.group({
        lineno: new FormControl<string | null>('1'),
        matgroup: new FormControl<string>(''),
        hsncode: new FormControl<string>(''),
        hsndesc: new FormControl<string>(''),
        discountamt: new FormControl<string>('0'),
        fotoamt: new FormControl<string>('0'),
        uom: new FormControl<string>('', Validators.maxLength(10)),
        quantity: new FormControl('0', Validators.maxLength(10)),
        rate: new FormControl<string>('', Validators.maxLength(10)),
        amount: new FormControl<string>('0'),
        sgstperc: new FormControl<string>('0'),
        sgstamt: new FormControl<string>('0'),
        taxableamt: new FormControl<string>('0'),
        ugstamt: new FormControl<string>('0'),
        ugstperc: new FormControl<string>('0'),
        vatamount: new FormControl<string>('0'),
        vatpercent: new FormControl<string>('0'),
        cgstperc: new FormControl<string>('0'),
        cgstamt: new FormControl<string>('0'),
        igstperc: new FormControl<string>('0'),
        igstamt: new FormControl<string>('0'),
        ser: new FormControl<string>(''),
      }),
    ]),
  });

  get itemBreakUpFormArr() {
    return this.gstDebitNotesEntryForm.get(
      'itemsDebitNoteWiseArray'
    ) as FormArray;
  }
  itemDetailInitRows() {
    return this.fb.group({
      matgroup: new FormControl<string>(''),
      hsncode: new FormControl<string>(''),
      hsndesc: new FormControl<string>(''),
      discountamt: new FormControl<string>('0'),
      fotoamt: new FormControl<string>('0'),
      uom: new FormControl<string>('', Validators.maxLength(10)),
      quantity: new FormControl('0', Validators.maxLength(10)),
      rate: new FormControl<string>('', Validators.maxLength(10)),
      amount: new FormControl<string>('0'),
      sgstperc: new FormControl<string>('0'),
      sgstamt: new FormControl<string>('0'),
      taxableamt: new FormControl<string>('0'),
      ugstamt: new FormControl<string>('0'),
      ugstperc: new FormControl<string>('0'),
      vatamount: new FormControl<string>('0'),
      vatpercent: new FormControl<string>('0'),
      cgstperc: new FormControl<string>('0'),
      cgstamt: new FormControl<string>('0'),
      igstperc: new FormControl<string>('0'),
      igstamt: new FormControl<string>('0'),
    });
  }

  validateUOM(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.value) {
        return this.debitNoteService
          .checkIsUOMValid(
            this.gstDebitNotesEntryForm.controls.matgroup?.value,
            control.value.trim()
          )
          .pipe(
            map((res: any) => {
              return res.status
                ? null
                : { validateUom: true, validateUomMsg: res.message };
            })
          );
      }
      return of(null);
    };
  }
  generateDebitNotePayload() {
    let dbnotevatRequestsData: any[] = [];
    for (
      let i = 0;
      i <
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.value.length;
      i++
    ) {
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.value[
        i
      ].lineno = `${i + 1}`;
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.value[
        i
      ].ser = `${this.gstDebitNotesEntryForm.controls.debitNote.value}`;
      if (
        Number(
          this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.value[i]
            .amount
        ) != 0
      ) {
        dbnotevatRequestsData.push(
          this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.value[i]
        );
      }
    }
    this.dbnotehRequestBean = {
      prop: this.gstDebitNotesEntryForm.get('prop')?.value,
      coy: this.gstDebitNotesEntryForm.get('coy')?.value,
      bldgcode: this.gstDebitNotesEntryForm.get('bldgcode')?.value,
      dbnoteser: this.gstDebitNotesEntryForm.get('debitNote')?.value,
      project: this.gstDebitNotesEntryForm.get('project')?.value,
      billtype: this.gstDebitNotesEntryForm.get('billtype')?.value,
      partytype: this.gstDebitNotesEntryForm.get('party')?.value,
      partycode: this.gstDebitNotesEntryForm.get('partycode')?.value,
      transer: this.gstDebitNotesEntryForm.get('debitNote')?.value,
      date: this.datePipe.transform(
        this.gstDebitNotesEntryForm.get('debitNoteDate')?.value,
        'dd/MM/yyyy'
      ),
      description1: this.gstDebitNotesEntryForm.get('description1')?.value,
      description2: this.gstDebitNotesEntryForm.get('description2')?.value,
      description3: this.gstDebitNotesEntryForm.get('description3')?.value,
      description4: this.gstDebitNotesEntryForm.get('description4')?.value,
      description5: this.gstDebitNotesEntryForm.get('description5')?.value,
      suppbillno: this.gstDebitNotesEntryForm.get('suppbillno')?.value,
      suppbilldt: this.datePipe.transform(
        this.gstDebitNotesEntryForm.get('suppbilldt')?.value,
        'dd/MM/yyyy'
      ),
      amount: Number(this.gstDebitNotesEntryForm.get('amount')?.value),
      narration: this.gstDebitNotesEntryForm.get('narration')?.value,
      // tdsamount: Number(this.gstDebitNotesEntryForm.get('tdsPercent')?.value) > 0 && this.gstDebitNotesEntryForm.get('billtype')?.value?.trim() == 'M' ? Number(this.gstDebitNotesEntryForm.get('tdsamount')?.value) + 1 : Number(this.gstDebitNotesEntryForm.get('tdsamount')?.value),
      tdsamount: Number(this.gstDebitNotesEntryForm.get('tdsPercent')?.value) > 0 && this.gstDebitNotesEntryForm.get('billtype')?.value?.trim() == 'M' ? Number(this.totalTds) + 1 : Number(this.totalTds),
      tdsperc: Number(this.gstDebitNotesEntryForm.get('tdsPercent')?.value),
      omspurcyn: 'N',
      origDbAmnt: this.origDebitAmnt,
      origTranAmnt: this.origTranAmnt,
      dbnotedRequests: [
        {
          amount: Number(this.gstDebitNotesEntryForm.get('amount')?.value),
          lineno: Number(1),
          matcode: this.gstDebitNotesEntryForm.get('matcode')?.value,
          matgroup: this.gstDebitNotesEntryForm.get('matgroup')?.value,
          partycode: this.gstDebitNotesEntryForm.get('partycode')?.value,
          quantity: Number(
            this.gstDebitNotesEntryForm.get('dequantity')?.value
          ),
          dequantity: Number(
            this.gstDebitNotesEntryForm.get('dequantity')?.value
          ),
          suppbillno: this.gstDebitNotesEntryForm.get('suppbillno')?.value,
          dbnoteser: this.gstDebitNotesEntryForm.get('debitNote')?.value,
          uom: this.gstDebitNotesEntryForm.get('uom')?.value
            ? this.gstDebitNotesEntryForm.get('uom')?.value
            : '',
          deuom: this.gstDebitNotesEntryForm.get('uom')?.value
            ? this.gstDebitNotesEntryForm.get('uom')?.value
            : '',
          number: Number(0),
          // rate: Number(this.gstDebitNotesEntryForm.get('rate')?.value),
          // derate: Number(this.gstDebitNotesEntryForm.get('rate')?.value),
          rate: this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.at(0)?.value.rate ?  Number(this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.at(0)?.value.rate) : 0,
          derate: this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.at(0)?.value.rate ?  Number(this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.at(0)?.value.rate) : 0
        },
      ],
      dbnotevatRequests: dbnotevatRequestsData,
    };
    console.log("tdsamount: ", this.dbnotehRequestBean.tdsamount);

    return this.dbnotehRequestBean;
  }

  getDebitNotesList() {
    this.dynapop.getDynaPopListObj('DEBITNOTES', '').subscribe((res: any) => {
      this.debitNoteTableData = res.data;
    });
  }

  getSupplierBills() {
    this.dynapop
      .getDynaPopListObj(
        'BILLS',
        "pblh_partycode = '" +
          this.gstDebitNotesEntryForm.get('partycode')?.value?.trim() +
          "'"
      )
      .subscribe((res: any) => {
        this.suppBillData = res.data;
      });
  }

  getUOMData() {
    this.dynapop.getDynaPopListObj('ITEMUOM', '').subscribe((res: any) => {
      this.uomData = res.data;
    });
  }

  getParties() {
    this.dynapop.getDynaPopListObj('SUPPLIERS', '').subscribe((res: any) => {
      this.partyData = res.data;
    });
  }

  focusField(fieldId: any) {
    setTimeout(() => {
      this.rendered
        .selectRootElement(
          document.getElementById(fieldId)?.childNodes[0] as HTMLInputElement
        )
        ?.focus();
    }, 100);
  }

  focusTest(id: any) {
    setTimeout(function () {
      document.getElementById(id)?.focus();
    }, 100);
  }

  getDataName(
    dynapopId: any,
    searchText: any,
    query: any,
    controlName: string
  ) {
    this.dynapop
      .getDynaPopSearchListObj(dynapopId, query, searchText)
      .subscribe((res: any) => {
        this.gstDebitNotesEntryForm
          .get(controlName)
          ?.setValue(
            res.data.dataSet.length != 0 ? res.data.dataSet[0][1].trim() : ''
          );
      });
  }

  updatePartyList(supplierData: any, bringBackColumn: any) {
    this.gstDebitNotesEntryForm.patchValue({
      partyCodeName: supplierData?.[bringBackColumn]?.trim(),
      partycode: supplierData?.[0]?.trim(),
    });
    this.getSupplierBills();
    this.gstDebitNotesEntryForm?.controls.dnAmount.markAsUntouched();
    this.focusField('suppBill234');
  }

  intializeAddOrRetrieve() {
    this.gstDebitNoteDetails = true;
    this.gstDebitNotesEntryForm.get('debitNote')?.disable();
    this.gstDebitNotesEntryForm.get('debitNoteDate')?.disable();
  }

  handleRetrieveClick() {
    if (this.gstDebitNotesEntryForm.get('debitNote')?.valid) {
      this.retrieveDebitNotesData(
        this.gstDebitNotesEntryForm.get('debitNote')?.value?.trim()
      );
    } else {
      this.gstDebitNotesEntryForm.get('debitNote')?.markAsTouched();
      this.rendered.selectRootElement(this.comp?.fo1.nativeElement)?.focus();
    }
  }

  handleSaveClick() {
    //this.saveValidationCheck();
    this.isRetrieveClicked ? this.updateDebitNote() : this.saveDebitNote();
  }

  updateDebitNote() {
    if (this.saveValidationCheck()) {
      this.generateDebitNotePayload();
      this.loaderToggle = true;
      this.debitNoteService
        .updateDebitNote(this.dbnotehRequestBean)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.loaderToggle = false;
              this.isDataUpdated = true;
              this.openDialog(
                constant.ErrorDialog_Title,
                '',
                false,
                'info',
                res.message
              );
              this.dialogRef.afterClosed().subscribe((res: any) => {
                this.rendered
                  .selectRootElement(this.comp.fo1.nativeElement)
                  ?.focus();
                  this.back();
              });
            }
          },
          error: () => {
            this.loaderToggle = false;
          },
          complete: () => {},
        });
    }
  }

  saveDebitNote() {
    if (this.saveValidationCheck() && this.gstDebitNotesEntryForm.valid) {
      this.generateDebitNotePayload();
      this.loaderToggle = true;
      this.debitNoteService
        .addDebitNote(this.dbnotehRequestBean)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.loaderToggle = false;
            if (res.status) {
              this.isDataAdded = true;
              this.openDialog(
                constant.ErrorDialog_Title,
                '',
                false,
                'info',
                res.message
              );
              this.dialogRef.afterClosed().subscribe((res: any) => {
                this.rendered
                  .selectRootElement(this.comp.fo1.nativeElement)
                  ?.focus();
                  this.back();
              });
            }
          },
          error: () => {
            this.loaderToggle = false;
          },
          complete: () => {},
        });
    }
  }

  retrieveDebitNotesData(serialNo: any) {
    this.debitNoteService.fetchDebitNoteDataBySerialNo(serialNo).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.isRetrieveClicked = true;
          this.isAddClicked = false;
          this.isDataRecieved = true;
          this.intializeAddOrRetrieve();
          if (res.message != '') {
            this.showErrorDialog(
              constant.ErrorDialog_Title,
              res.message,
              'error',
              false,
              res.data[0]
            );

            if (res.message.startsWith('P')) {
              this.gstDebitNotesEntryForm.get('tdsPercent')?.disable();
              this.gstDebitNotesEntryForm.get('tdsamount')?.disable();
              this.focusInputs('dnAmount123124');
            } else {
              this.disableSave = true;
              this.gstDebitNotesEntryForm.get('tdsPercent')?.disable();
              this.gstDebitNotesEntryForm.get('tdsamount')?.disable();
              this.gstDebitNotesEntryForm.get('dnAmount')?.disable();
            }
          } else {
            this.gstDebitNotesEntryForm.get('tdsPercent')?.disable();
            this.gstDebitNotesEntryForm.get('tdsamount')?.disable();
            this.setRetrievedData(res.data[0]);
          }
        } else {
          this.toastr.error('Invalid Debit Note Number');
          this.gstDebitNotesEntryForm.controls.debitNote.reset();
          this.gstDebitNotesEntryForm.get('debitNote')?.markAsTouched();
          this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus();
        }
      },
      error: () => {},
      complete: () => {},
    });
  }

  checkIsItemQuantityValid(index: any) {
    if (
      Number(
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ].get('quantity')?.value
      ) > Number(this.gstDebitNotesEntryForm.get('dequantity')?.value)
    ) {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Enter Item Quantity less than or equal to debite note quantity',
        'error'
      );
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]
        .get('quantity')
        ?.patchValue('');
    } else {
      if (
        Number(
          this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
            index
          ].get('quantity')?.value
        ) != 0
      ) {
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ]
          .get('amount')
          ?.patchValue(
            (
              Number(
                this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
                  index
                ].get('quantity')?.value
              ) *
              Number(
                this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
                  index
                ].get('rate')?.value
              )
            )
              .toFixed(2)
              .toString()
          );
      }

      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]
        .get('taxableamt')
        ?.patchValue(
          (
            Number(
              this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
                index
              ].get('amount')?.value
            ) -
            Number(
              this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
                index
              ].get('discountamt')?.value
            )
          )
            .toFixed(2)
            .toString()
        );
      this.triggerCalculateGst(index);
    }
  }

  setAmount(index: any) {
    if (
      this.gstDebitNotesEntryForm.controls.amount?.value! <
      Number(
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ].get('taxableamt')?.value
      )
    ) {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Enter Taxable Amount less than or equal to Debite Note Amount',
        'error'
      );
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]
        .get('taxableamt')
        ?.patchValue(
          this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
            index
          ].get('amount')?.value!
        );
    } else {
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]
        .get('amount')
        ?.patchValue(
          (
            Number(
              this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
                index
              ].get('taxableamt')?.value
            ) +
            Number(
              this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
                index
              ].get('discountamt')?.value
            )
          )
            .toFixed(2)
            .toString()
        );
      this.triggerCalculateGst(index);
    }
  }

  checkIsRateValid(index: any) {
    if (
      Number(
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ].get('rate')?.value!
      ) > 0
    ) {
      let amount = (
        Number(
          this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
            index
          ].get('rate')?.value!
        ) *
        Number(
          this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
            index
          ].get('quantity')?.value
        )
      )
        .toFixed(2)
        .toString();
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]
        .get('amount')
        ?.patchValue(amount);
      if (Number(amount) > 0) {
        this.calcTaxableAmt(
          index,
          this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
            index
          ].get('amount')?.value,
          this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
            index
          ].get('discountamt')?.value
        );
      } else {
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ]
          .get('taxableamt')
          ?.patchValue(`${amount}`);
      }
    }
  }

  checkIsItemAmountValid(index: any) {
    let itemAmount: any = Number(
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ].get('amount')?.value
    );
    if (itemAmount > Number(this.gstDebitNotesEntryForm.get('amount')?.value)) {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Enter Item Amount less than or equal to debite note amount',
        'error'
      );
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]
        .get('amount')
        ?.patchValue('');
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]
        .get('taxableamt')
        ?.patchValue('0');
    } else {
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]
        .get('taxableamt')
        ?.patchValue(itemAmount.toFixed(2).toString());
      this.triggerCalculateGst(index);
      //this.calcTaxableAmt(index, this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[index].get('amount')?.value, this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[index].get('discountamt')?.value)
    }
  }

  calcTaxableAmt(index: number, itemAmount: any, discount: any) {
    if (parseFloat(discount) >= 0 && parseFloat(itemAmount) > 0) {
      if (parseFloat(discount) < parseFloat(itemAmount)) {
        let taxAmount = (Number(itemAmount) - Number(discount)).toFixed(2);
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ]
          .get('taxableamt')
          ?.patchValue(`${taxAmount}`);
        // whenever itemchange calculate gst
        this.triggerCalculateGst(index);
      } else {
        let taxAmount = (Number(itemAmount) - Number(0)).toFixed(2);
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ]
          .get('taxableamt')
          ?.patchValue(`${taxAmount}`);
        this.toastr.error(
          'discount cannot be greater than or equal to item amount'
        );
        this.triggerCalculateGst(index);
      }
    }
  }

  triggerCalculateGst(index: number) {
    this.calcGST(
      'CGST',
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['cgstperc'],
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ].get('taxableamt')?.value,
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['cgstamt'],
      'cgstpercId'
    );
    this.calcGST(
      'SGST',
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['sgstperc'],
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ].get('taxableamt')?.value,
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['sgstamt'],
      'sgstpercId'
    );
    this.calcGST(
      'IGST',
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['igstperc'],
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ].get('taxableamt')?.value,
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['igstamt'],
      'igstpercId'
    );
    this.calcGST(
      'UGST',
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['ugstperc'],
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ].get('taxableamt')?.value,
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['ugstamt'],
      'ugstpercId'
    );
  }

  checkValidDiscountAmount(index: any) {
    let discCellId =  'input[id="'+"cell"+index+-"6" + '"]' 
    if (
      Number(
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ].get('discountamt')?.value
      ) >=
      Number(
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ].get('amount')?.value
      )
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Discount amount cannot be greater or equal to Item amount',
        this.el.nativeElement
        .querySelector('input[id="cell0-6"]')
        ?.focus(),
        'error'
      );
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]
        .get('discountamt')
        ?.patchValue('0');
       
    } else {
      this.calcTaxableAmt(
        index,
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ].get('amount')?.value,
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ].get('discountamt')?.value
      );
    }
  }

  checkIsDNAmountValid() {
    if (
      Number(this.gstDebitNotesEntryForm.get('dnAmount')?.value) == 0 ||
      Number(this.gstDebitNotesEntryForm.get('dnAmount')?.value) < 0
    ) {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Debit Amount cannot be less than or equal to zero...',
        'error'
      );
      this.gstDebitNotesEntryForm.patchValue({
        dnAmount: '',
      });
    } else {
      this.debitAmountyValid();
    }
  }

  checkIsEnteredAmountValid() {
    if (
      Number(this.gstDebitNotesEntryForm.get('amount')?.value) == 0 ||
      Number(this.gstDebitNotesEntryForm.get('amount')?.value) < 0
    ) {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'DN Amount cannot be <=0..',
        'info'
      );
      let amountVal  = Number(this.gstDebitNotesEntryForm.get('dnAmount')?.value).toFixed(2)
      this.gstDebitNotesEntryForm.patchValue({
        amount: Number(amountVal),
      });
    } else {
      //this.triggerCalculateGst(index)
    }
  }

  checkIsFotoAmountValid(index: any) {
    if (
      Number(
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ].get('fotoamt')?.value
      ) > Number(this.gstDebitNotesEntryForm.controls.amount.value)
    ) {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Enter Freight/Octroi/Transport/Other Chgs. Amount less than or equal to Debit Note  Amount.',
        'error'
      );
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]
        .get('fotoamt')
        ?.patchValue('0');
    }
  }

  fetchCompanyProprietor(companyCode: any) {
    this.debitNoteService
      .getPropByCompanyCode(companyCode)
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          this.gstDebitNotesEntryForm.controls.prop.patchValue(
            res.data.propCode
          );
        },
        error: () => {},
        complete: () => {},
      });
  }

  setRetrievedData(data: any) {
    let dbnoteVatData = this.isRetrieveClicked
      ? data.dbnotevatResponses
      : data.pbillvatResponseBean;
    (this.origDebitAmnt =
      this.isRetrieveClicked && data.amount != undefined ? data.amount : 0),
      (this.origTranAmnt =
        this.isRetrieveClicked && data.tdsamount != undefined
          ? data.tdsamount
          : 0),
      (this.initialDebitNoteQuantity = 0);
    this.gstDebitNotesEntryForm.patchValue({
      partycode: data.partycode,
      suppbillno: this.isRetrieveClicked
        ? data.suppbillno
        : this.gstDebitNotesEntryForm.get('suppbillno')?.value?.trim(),
      suppbilldt:
        data.suppbilldt != undefined
          ? new Date(
              `${data.suppbilldt.split('/')[1]}-` +
                `${data.suppbilldt.split('/')[0]}-` +
                `${data.suppbilldt.split('/')[2]}`
            )
          : '',
      dnAmount: this.isRetrieveClicked ? data.amount : '',
      project: data.project,
      bldgcode: data.bldgcode,
      coy: data.coy,
      description1: data.description1,
      description2: data.description2,
      description3: data.description3,
      description4: data.description4 != undefined ? data.description4 : '',
      description5: data.description5,
      narration: this.isRetrieveClicked ? data.narration : '',
      tdsamount: this.isSuppBillSelected ? '' : data.tdsamount,
      tdsPercent: data.tdsperc != undefined ? data.tdsperc : '0',
      matcode: this.isRetrieveClicked
        ? data.dbnotedResponses != undefined
          ? data.dbnotedResponses[0].matcode
          : ''
        : data.pbilldResponseBean.matcode,
      matgroup: this.isRetrieveClicked
        ? data.dbnotedResponses != undefined
          ? data.dbnotedResponses[0].matgroup
          : ''
        : data.pbilldResponseBean.matgroup,
      amount: this.isRetrieveClicked
        ? data.dbnotedResponses != undefined
          ? data.dbnotedResponses[0].amount
          : 0
        : 0,
      dequantity: this.isRetrieveClicked
        ? data.dbnotedResponses != undefined
          ? data.dbnotedResponses[0].quantity
          : 0
        : 0,
      uom: this.isRetrieveClicked
        ? data.dbnotedResponses != undefined
          ? data.dbnotedResponses[0].deuom
          : ''
        : data.pbillvatResponseBean ? data.pbillvatResponseBean[0].uom : '' ,
      billtype: data.billtype,
    });
    this.fetchCompanyProprietor(data.coy.trim());

    for (var i = 0; i < dbnoteVatData?.length; i++) {
      dbnoteVatData?.length - 1 == i
        ? ''
        : this.itemBreakUpFormArr.push(this.itemDetailInitRows());
      dbnoteVatData[i].amount = this.isRetrieveClicked
        ? dbnoteVatData[i].amount
        : '0.0';
      dbnoteVatData[i].taxableamt = this.isRetrieveClicked
        ? dbnoteVatData[i].taxableamt
        : '0.0';
      dbnoteVatData[i].cgstamt = this.isRetrieveClicked
        ? dbnoteVatData[i].cgstamt
        : '0.0';
      dbnoteVatData[i].sgstamt = this.isRetrieveClicked
        ? dbnoteVatData[i].sgstamt
        : '0.0';
      dbnoteVatData[i].igstamt = this.isRetrieveClicked
        ? dbnoteVatData[i].igstamt
        : '0.0';
      dbnoteVatData[i].ugstamt = this.isRetrieveClicked
        ? dbnoteVatData[i].ugstamt
        : '0.0';
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.patchValue(
        dbnoteVatData
      );
    }
    this.initialDebitNoteQuantity = this.isRetrieveClicked
      ? data.dbnotedResponses != undefined
        ? data.dbnotedResponses[0].quantity
        : 0
      : 0;
    this.getDataName(
      'SUPPLIERS',
      this.gstDebitNotesEntryForm.get('partycode')?.value?.trim(),
      '',
      'partyCodeName'
    );
    this.getDataName(
      'BUILDINGS',
      this.gstDebitNotesEntryForm.get('bldgcode')?.value?.trim(),
      '',
      'projectName'
    );
    this.getDataName(
      'COMPANY',
      this.gstDebitNotesEntryForm.get('coy')?.value?.trim(),
      '',
      'companyName'
    );
    this.getDataName(
      'MATGROUPS',
      this.gstDebitNotesEntryForm.get('matgroup')?.value?.trim(),
      '',
      'matGroupName'
    );
    this.getDataName(
      'MATCODES',
      this.gstDebitNotesEntryForm.get('matcode')?.value?.trim(),
      '',
      'matCodeName'
    );
    if (this.isRetrieveClicked) {
      this.gstDebitNotesEntryForm.get('suppbillno')?.disable();

      this.gstDebitNotesEntryForm.get('partycode')?.disable();
      this.gstDebitNotesEntryForm.patchValue({
        debitNoteDate: new Date(
          `${data.date.split('/')[1]}-` +
            `${data.date.split('/')[0]}-` +
            `${data.date.split('/')[2]}`
        ),
      });
    }
    if (this.isSuppBillSelected) {
      for (const index1 in this.gstDebitNotesEntryForm.controls
        .itemsDebitNoteWiseArray.controls) {
        // 'field' is a string
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index1
        ]
          .get('discountamt')
          ?.patchValue('0');
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index1
        ]
          .get('fotoamt')
          ?.patchValue('0');
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index1
        ]
          .get('quantity')
          ?.patchValue('0');
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index1
        ]
          .get('amount')
          ?.patchValue('0');
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index1
        ]
          .get('sgstamt')
          ?.patchValue('0');
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index1
        ]
          .get('taxableamt')
          ?.patchValue('0');
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index1
        ]
          .get('sgstamt')
          ?.patchValue('0');
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index1
        ]
          .get('ugstamt')
          ?.patchValue('0');
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index1
        ]
          .get('ugstperc')
          ?.patchValue('0');
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index1
        ]
          .get('vatamount')
          ?.patchValue('0');
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index1
        ]
          .get('vatpercent')
          ?.patchValue('0');
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index1
        ]
          .get('cgstamt')
          ?.patchValue('0');
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index1
        ]
          .get('igstperc')
          ?.patchValue('0');
        this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index1
        ]
          .get('igstamt')
          ?.patchValue('0');
      }
    }
    this.focusInputs('dnAmount123124');
    if (
      data.dbnotevatResponses != undefined ||
      data.pbillvatResponseBean != undefined
    ) {
      this.showTable = true;
    }
  }

  calculateDebitAmntTDS() {
    let debitAmntTDS =
      (Number(this.gstDebitNotesEntryForm.get('dnAmount')?.value) *
        Number(this.gstDebitNotesEntryForm.get('tdsPercent')?.value)) /
      100;
    this.gstDebitNotesEntryForm
      .get('tdsamount')
      ?.patchValue(Math.round(debitAmntTDS).toString());
  }

  calcGST(
    message: string,
    formControlSource: FormControl,
    textableAmt: any,
    formControl: FormControl,
    id: string
  ) {
    if (formControlSource.value <= 100) {
      let roundVal: any =
        parseFloat(textableAmt) * (parseFloat(formControlSource.value) / 100);
      formControl.setValue(parseFloat(roundVal).toFixed(2));
    } else {
      formControlSource.setValue(0), formControl.setValue(0);
      this.rendered.selectRootElement(`#${id}`).focus();
      this.toastr.error(`${message} % cannot be greater than 100`);
    }
  }

  focusOnInputField(inputId: any) {
    this.focusInputs(inputId);
  }

  quantityValid() {
    this.debitNoteService
      .checkIsQuantityValid(
        this.gstDebitNotesEntryForm.controls.partycode.value?.trim(),
        this.gstDebitNotesEntryForm.controls.suppbillno.value?.trim(),
        this.gstDebitNotesEntryForm.controls.debitNote.value?.trim(),
        this.gstDebitNotesEntryForm.controls.dequantity.value,
        this.gstDebitNotesEntryForm.controls.amount.value
      )
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          if (res.status && res.message != undefined) {
            this.modalService.showErrorDialog(
              constant.ErrorDialog_Title,
              res.message,
              'warning'
            );
          }
          if (!res.status && res.message != undefined) {
            this.gstDebitNotesEntryForm.patchValue({
              dequantity: 0,
            });
            if (res.status && res.data != undefined) {
              this.gstDebitNotesEntryForm.get('rate')?.patchValue(res.data);
            }
            this.modalService.showErrorDialogCallBack(
              constant.ErrorDialog_Title,
              res.message,
              this.el.nativeElement
                .querySelector('input[id="quantity123"]')
                ?.focus(),
              'info'
            );
          }
        },
        error: () => {},
        complete: () => {},
      });
  }

  patchAmountValue(event: any) {
    this.gstDebitNotesEntryForm.patchValue({
      amount: Number(event.target.value)
    });
  }

  debitAmountyValid() {
    this.debitNoteService
      .checkIsDebitAmountValid(
        this.gstDebitNotesEntryForm.controls.partycode.value?.trim(),
        this.gstDebitNotesEntryForm.controls.suppbillno.value?.trim(),
        this.gstDebitNotesEntryForm.controls.amount.value
      )
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          if (!res.status) {
            this.modalService.showErrorDialogCallBack(
              constant.ErrorDialog_Title,
              res.message,
              this.el.nativeElement
                .querySelector('input[id="dnAmount123124"]')
                ?.focus(),
              'error'
            );
            this.gstDebitNotesEntryForm.patchValue({
              dnAmount: '',
            });
          } else {
            let amtFrt: any = this.gstDebitNotesEntryForm.get('dnAmount')?.value;
            this.gstDebitNotesEntryForm.patchValue({
              dnAmount: parseFloat(amtFrt).toFixed(2),
            });
            this.gstDebitNotesEntryForm.patchValue({
              amount: Number(
                this.gstDebitNotesEntryForm.get('dnAmount')?.value
              ),
            });
            let billType =  this.gstDebitNotesEntryForm?.controls.billtype.value?.trim();
            console.log("Bill Zt", billType)
            if(billType != 'T'){
              this.gstDebitNotesEntryForm.get('tdsPercent')?.disable();
              this.gstDebitNotesEntryForm.get('tdsamount')?.disable();
            }
            else{
              this.gstDebitNotesEntryForm?.get('uom')?.disable();
              this.gstDebitNotesEntryForm?.get('dequantity')?.disable();
              this.gstDebitNotesEntryForm?.get('amount')?.disable();
            }
            this.focusInputs('narration123');
          }
        },
        error: () => {},
        complete: () => {},
      });
  }

  focusInputs(id: any) {
    setTimeout(() => {
      let focusElement3 = document.getElementById(id) as HTMLElement;
      this.rendered.selectRootElement(focusElement3).focus();
    }, 100);
  }

  handleAddClick() {
    this.isAddClicked = true;
    this.isRetrieveClicked = false;
    this.focusField('partyCode');
    this.gstDebitNotesEntryForm.get('debitNote')?.markAsUntouched();
    this.intializeAddOrRetrieve();
  }

  validateInvalidFormat(id: any, event: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Invalid Debit Note date.',
        this.rendered.selectRootElement(`#${id}`)?.focus(),
        'error'
      );
    }
  }

  saveValidationCheck() {
    let total: number = 0;
    this.totalFoto = 0;
    this.totalTds = 0;
    this.totalDiscount= 0;
    this.totalTaxable = 0;
    

    let totalDifference: number = 0;
    for (
      let i = 0;
      i <
      this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.value.length;
      i++
    ) {
      total +=
        parseFloat(
          `${this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.taxableamt}`
        ) +
        parseFloat(
          `${this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.fotoamt}`
        ) +
        parseFloat(
          `${this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.cgstamt}`
        ) +
        parseFloat(
          `${this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.sgstamt}`
        ) +
        parseFloat(
          `${this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.igstamt}`
        ) +
        parseFloat(
          `${this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.ugstamt}`
        );
      this.totalFoto += parseFloat(
        `${this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.fotoamt}`
      );
      this.totalDiscount += parseFloat(
        `${this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.discountamt}`
      );
      this.totalTaxable += parseFloat(
        `${this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.taxableamt}`
      );
      this.totalCgst += parseFloat(
        `${this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.cgstamt}`
      );
      this.totalSgst += parseFloat(
        `${this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.sgstamt}`
      );
      this.totalIgst += parseFloat(
        `${this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.igstamt}`
      );
      this.totalUgst += parseFloat(
        `${this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.ugstamt}`
      );
      }
    this.total = Number(total.toFixed(2));
    this.totalFoto = Number(this.totalFoto.toFixed(2));
    this.totalTaxable = Number(this.totalTaxable.toFixed(2));
    this.totalDiscount = Number(this.totalDiscount.toFixed(2));
    this.totalTds =
    ((this.totalTaxable + this.totalFoto - this.totalDiscount) *
      Number(this.gstDebitNotesEntryForm.get('tdsPercent')?.value)) /
    100;
  this.gstDebitNotesEntryForm
    .get('tdsamount')
    ?.patchValue(Math.round(this.totalTds).toString());
    totalDifference =
      parseFloat(`${this.gstDebitNotesEntryForm.get('amount')?.value}`) - total;

    if (Math.round(totalDifference) != 0) {
      let erroMessage =
        'Total of Taxable Amt + FOTO Amt + GST Amt in Tax details Grid = ' +
        this.total +
        ' not tallying with Main Debit Note Amt = ' +
        this.gstDebitNotesEntryForm.controls.amount.value +
        '....please enter correct details....';
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        erroMessage,
        this.el.nativeElement
          .querySelector('input[id="dnAmount123124"]')
          ?.focus(),
        'error'
      );
      return false;
    } else {
      return true;
    }
  }

  checkSupplierBill(event: any) {
    if (event[0] != undefined) {
      this.debitNoteService.checkSuppBillForDebitNote(this.gstDebitNotesEntryForm.get('partycode')?.value ,event[0]).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.isSuppBillSelected = true;
            if (res.message) {
              this.showErrorDialog(
                constant.ErrorDialog_Title,
                res.message,
                'info',
                false,
                res.data
              );
            } else {
              this.setRetrievedData(res.data);
            }
            this.gstDebitNotesEntryForm?.get('uom')?.enable();
            this.gstDebitNotesEntryForm?.get('dequantity')?.enable();
            this.gstDebitNotesEntryForm?.get('amount')?.enable();
            this.gstDebitNotesEntryForm.get('tdsPercent')?.enable();
            this.gstDebitNotesEntryForm.get('tdsamount')?.enable();
          } else {
            if (res.message) {
              this.modalService.showErrorDialogCallBack(
                constant.ErrorDialog_Title,
                res.message,
                this.el.nativeElement
                  .querySelector('[ng-reflect-name="suppBill234"] > input')
                  ?.focus(),
                'info'
              );
            }
            this.gstDebitNotesEntryForm.patchValue({
              suppbillno: '',
              dequantity: 0,
              amount: 0,
            });
          }
        },
        error: () => {},
        complete: () => {},
      });
    }
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  back() {
    this.isAddClicked = false;
    this.isRetrieveClicked = false;
    this.gstDebitNotesEntryForm.get('debitNote')?.enable();
    this.gstDebitNotesEntryForm.get('debitNoteDate')?.enable();
    this.gstDebitNotesEntryForm.get('suppbillno')?.enable();
    this.gstDebitNotesEntryForm.get('tdsPercent')?.enable();
    this.gstDebitNotesEntryForm.get('tdsamount')?.enable();
    this.gstDebitNotesEntryForm.get('dnAmount')?.enable();
    this.gstDebitNotesEntryForm.get('partycode')?.enable();
    this.gstDebitNotesEntryForm.reset();
    this.gstDebitNotesEntryForm.controls.itemsDebitNoteWiseArray.clear();
    this.itemBreakUpFormArr.push(this.itemDetailInitRows());
    this.gstDebitNoteDetails = false;
    this.isDataRecieved = false;
    this.isSuppBillSelected = false;
    this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus();
    this.gstDebitNotesEntryForm.patchValue({
      debitNoteDate: new Date(),
      party: 'S',
      partyName: 'Supplier',
      dnAmount: '0.00',
    });
    this.disableAdd = false;
    this.disableRetrieve = false;
    this.disableSave = false;
    this.showTable = false;
    this.isDataUpdated = false;
    this.isDataAdded = false;
    this.getDebitNotesList();
  }

  handleBackClick() {
    this.showErrorDialog(
      constant.ErrorDialog_Title,
      'Data not saved. Do you want to exit?',
      'question',
      true,
      ''
    );
  }

  disableButton() {
    if (this.gstDebitNotesEntryForm.get('debitNote')?.value) {
      this.disableAdd = true;
    } else {
      this.disableRetrieve = true;
      this.gstDebitNotesEntryForm.get('debitNote')?.markAsUntouched();
    }
  }

  showErrorDialog(
    titleVal: any,
    message: string,
    type: string,
    confirmationDialog: boolean,
    data: any
  ) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: '',
        type: type,
        confirmationDialog: confirmationDialog,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (confirmationDialog && result) {
        this.back();
      } else if (confirmationDialog && !result) {
        this.el.nativeElement
          .querySelector('input[id="dnAmount123124"]')
          ?.focus();
      } else {
        if (this.isDataUpdated || this.isDataAdded) {
          this.back();
        }
        if (!confirmationDialog && (!result || result == undefined)) {
          if (
            (this.isSuppBillSelected || this.isDataRecieved) &&
            result == undefined &&
            !this.isDataUpdated &&
            !this.isDataAdded
          ) {
            this.setRetrievedData(data);
          }
        }
      }
    });
  }

  openDialog(
    titleVal: any,
    templateField: any,
    isF1PressedFlag: boolean,
    type: string | null,
    msg: string
  ) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        isF1Pressed: isF1PressedFlag,
        title: titleVal,
        message: msg,
        template: templateField,
        type: type,
      },
    });
    this.dialogRef = dialogRef;
  }
  
}


export function validateDebitNoteDate(): ValidatorFn {
  return (_control: AbstractControl): ValidationErrors | null => {
    if (_control.value) {
      if (moment(_control.value).isSameOrBefore(new Date())) return null;
      return { dateValidation: true };
    }
    return null;
  };
}
