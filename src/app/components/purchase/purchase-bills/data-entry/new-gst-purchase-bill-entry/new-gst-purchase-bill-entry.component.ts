import {
  Component,
  OnInit,
  AfterContentChecked,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Renderer2,
  Input,
  OnChanges,
  HostListener,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { DataEntryService } from 'src/app/services/purch/data-entry.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import {
  finalize,
  map,
  merge,
  observable,
  Observable,
  of,
  Subject,
  switchMap,
  take,
} from 'rxjs';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant';
import { formatCurrency, formatNumber } from '@angular/common';
import { ServiceService } from 'src/app/services/service.service';
import * as commonConstant from '../../../../../../constants/commonconstant';
import { PurchService } from 'src/app/services/purch/purch.service';
import { MaterialPaymentsService } from 'src/app/services/purch/material-payments.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-gst-purchase-bill-entry',
  templateUrl: './new-gst-purchase-bill-entry.component.html',
  styleUrls: ['./new-gst-purchase-bill-entry.component.css'],
})
export class NewGstPurchaseBillEntryComponent implements OnInit {
  entryTableData: any = [];
  tableData: any = [];
  buildingTableData: any = [];
  partyTableData: any = [];
  debitTypeTableData: any = [];
  materialTableData: any = [];
  level2TableData: any = [];
  hsnTableData: any = [];
  uomTableData: any = [];
  loaderToggle: boolean = false;
  dtOptions: any;
  purchaseBillDetailsContainer: boolean = false;
  modalTitle: any = 'K Raheja ERP';
  bldg_condition = '';
  party_condition = `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '${commonConstant.coyCloseDate}')`;
  debito_condition = `ent_class = 'DEBIT'`;
  matGroups_condition = `mat_level ='1' and (mat_closedate IS NULL OR mat_closedate = '${commonConstant.coyCloseDate}')`;
  level2_condition = '';
  fetchedPurchaseBill: any = [];
  disabledFlagBack: boolean = true;
  disabledFlagAddRow: boolean = true;
  disabledFlagAdd: boolean = false;
  disabledFlagRetrieve: boolean = false;
  disabledFlagSave: boolean = true;
  templateRef: any;
  filterSetF1Array: any = [];
  billTypeDataList = [];
  clickTrigger = '';
  addressFetchData: any = [];
  total: number = 0;
  totalFoto: number = 0;
  totalCgst: number = 0;
  totalSgst: number = 0;
  totalIgst: number = 0;
  totalUgst: number = 0;
  headerAmt: number = 0;
  // for append table row creating object
  isPartyGst: boolean = false;
  uomQuery = '';
  navTab = 'itemGSTBreakUpDetails';
  @ViewChild('GstDetailsPopup') GstDetailsPopup!: ElementRef;
  @ViewChild('GstAddressDetails') GstAddressDetails!: ElementRef;
  @ViewChild('saveValidationPopUp') saveValidationPopUp!: ElementRef;
  @ViewChild(F1Component) comp!: F1Component;
  @ViewChild('partyId') partyId!: F1Component;
  @ViewChild('companyCode') companyCode!: F1Component;
  @ViewChild('hsncode') hsncode!: F1Component;
  @Input() receivedAddressList!: FormGroup;
  @Input() cityValueChangeFlag: boolean = false;
  dcRequestSavedArray: any = [];
  pbillvatRequestBeanArray: any = [];
  isRoundOffExist: boolean = false;
  entryQueryCondition = '';
  maxDate = new Date();
  coyQuery = `coy_active = 'Y'`;
  disabledVal = true
  fetchPartyAdd:boolean=true
  noDataStr:string=''
  constructor(
    public router: Router,
    private dynapop: DynapopService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalComponent>,
    private cderf: ChangeDetectorRef,
    private rendered: Renderer2,
    private dataEntryService: DataEntryService,
    private toasterService: ToastrService,
    public _actionService: ActionservicesService,
    private modalService: ModalService,
    private fb: FormBuilder,
    private el: ElementRef,
    private service: ServiceService,
    private _material:MaterialPaymentsService
  ) { }

  purchaseBillEntryForm = new FormGroup(
    {
      partyFilter: new FormControl<string | null>(null, [
        Validators.maxLength(12),
      ]),
      partyFilterName: new FormControl<string | null>({
        value: '',
        disabled: true,
      }),
      entry: new FormControl<string | null>(null, [
        Validators.required,
        Validators.maxLength(10),
      ]),
      company: new FormControl<string | null>('', [
        Validators.required,
        Validators.maxLength(5),
      ]),
      companyName: new FormControl<string | null>({
        value: '',
        disabled: true,
      }),
      building: new FormControl<string | null>('', [
        Validators.required,
        Validators.maxLength(4),
      ]),
      buildingName: new FormControl<string | null>({
        value: '',
        disabled: true,
      }),
      party: new FormControl<string | null>(null, [
        Validators.required,
        Validators.maxLength(12),
      ]),
      partyName: new FormControl<string | null>({ value: '', disabled: true }),
      billType: new FormControl('M', {
        asyncValidators: this.billTypeValid('party'),
      }),
      suppbill: new FormControl('', [
        Validators.required,
        Validators.maxLength(16),
      ]),
      suppBillDate: new FormControl(
        '',
        [Validators.required, validateSuppDtFuture()],
        this.supplierDateValidation()
      ),
      amount: new FormControl('0', [
        Validators.required,
        Validators.maxLength(12),
      ]),
      retention: new FormControl('0', Validators.maxLength(15)),
      tdsperc: new FormControl({ value: '', disabled: true }),
      tdsamt: new FormControl({ value: '', disabled: true }),
      naration: new FormControl('', Validators.maxLength(50)),
      partyGst: new FormControl({ value: '', disabled: true }),
      state: new FormControl({ value: '', disabled: true }),
      stateName: new FormControl({ value: '', disabled: true }),
      debitType: new FormControl(
        {value:'',disabled:true},
        [Validators.maxLength(8)],
        [this.debitTypeValid()]
      ),
      debitName: new FormControl({ value: '', disabled: true }),
      ceIndent: new FormControl('', Validators.maxLength(17)),
      material: new FormControl<string | null>('', [
        Validators.required,
        Validators.maxLength(5),
      ]),
      materialName: new FormControl<string | null>({
        value: '',
        disabled: true,
      }),
      level2: new FormControl('', Validators.maxLength(5)),
      level2Name: new FormControl({ value: '', disabled: true }),
      uom: new FormControl(
        '',
        [Validators.maxLength(10)],
        [this.validateUOM()]
      ),
      quantity: new FormControl('0', Validators.maxLength(16)),
      itemRate: new FormControl({ value: '0', disabled: true }),
      value: new FormControl({ value: '', disabled: true }),
      tcsAmt: new FormControl('0', Validators.maxLength(12)),
      challan: new FormArray([this.initRows()], challanDateValidation()),
      itemDetailBreakUp: new FormArray(
        [this.itemDetailInitRows()],
        itemBreakUpValidation()
      ),
    },
    { validators: retentionVal() }
  );

  partyPurchaseBillFormGroup = new FormGroup({
    gstno: new FormControl('', [
      Validators.maxLength(15),
      Validators.minLength(15),
      Validators.pattern(
        '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
      ),
    ]),
    vatnum: new FormControl(''),
    tinnum: new FormControl(''),
    rcnum: new FormControl(''),
    today: new FormControl(),
    city: new FormControl(),
    partycode: new FormControl(),
    partytype: new FormControl(),
    pmtacnum: new FormControl(),
  });

  ngOnChanges() {
    this.getReceiveAddressData(this);
  }

  ngOnInit(): void {
    this.getParty();
    this.dataEntryService.getBillTypeList().subscribe({
      next: (res: any) => {
        if (res?.status) {
          this.billTypeDataList = res?.data;
        }
      },
    });
    this.updateChallanDt();
    this.updateDebitType()
  }

  updateChallanDt() {
    let sbd = this.purchaseBillEntryForm.get('suppBillDate');
    sbd?.valueChanges.subscribe((val: any) => {
      if (val) {
        // suppBillDate change challan Date validation will work.
        this.maxDate = moment(val).toDate();
      }
    });
  }

  // patch debit type when changed BldgCode
  updateDebitType() {
    this.purchaseBillEntryForm.get('building')?.valueChanges.subscribe((val:any) => {
      if (val?.length == 4) {
        let buildingCode = { buildingCode: val.trim().toUpperCase() };
        this._material.fetchDebitType(buildingCode).subscribe({
          next: (res: any) => {
            res?.status
              ? this.purchaseBillEntryForm.get('debitType')?.patchValue(res?.data)
              : this.purchaseBillEntryForm.get('debitType')?.patchValue(null);
              this.searchTextDataBind(
                'DEBITTO',
                this.debito_condition,
                this.purchaseBillEntryForm.controls['debitType'],
                null,
                this.purchaseBillEntryForm.controls['debitName'],
                'errMsgdebiType'
              );
          },
        });
      }
    });
  }

  getF1Load() {
    this.getCompanyList();
    this.getdebitType();
    this.getMaterial();
    this.getHSN();
  }

  resetDebit() {
    this.purchaseBillEntryForm.get('debitType')?.reset();
    this.purchaseBillEntryForm.get('debitName')?.reset();
  }

  getReceiveAddressData($event: any) {
    this.receivedAddressList = $event;
  }

  updateCityFieldValueChange(event: boolean) {
    this.cityValueChangeFlag = event;
  }
  ngAfterContentChecked() {
    this.cderf.detectChanges();
    this.savePartyAddPayLoad();
    this.resetF1Field();
  }

  updateToday() {
    this.partyPurchaseBillFormGroup.patchValue({
      today: moment(new Date()).format('DD/MM/YYYY HH:MM:SS'),
    });
  }
  updatePartyFilter(val: any, formControl: FormControl, bbc: any) {
    if (val != undefined) {
      formControl.setValue(val[bbc]);
      this.getEntry(val[0]?.trim());
    }
  }
  getBuildingList(bldgCoy: any) {
    this.bldg_condition = `bldg_coy='${bldgCoy?.trim()}' and (bldg_closedate is null OR bldg_closedate = '${commonConstant.coyCloseDate
      }')`;
    this.dynapop
      .getDynaPopListObj('BUILDINGS', `${this.bldg_condition}`)
      .subscribe({
        next: (res: any) => {
          this.buildingTableData = res.data;
        },
      });
  }
  updateCompanyList(compData: any, bringBackColumnVal: any) {
    if (compData != undefined) {
      this.purchaseBillEntryForm.patchValue({
        companyName: compData[bringBackColumnVal],
      });
      //get Building list
      this.getBuildingList(compData[0]);
      compData[0] && this.calculateTDS();
    }
  }

  ChangePartyCode(e:any){
    setTimeout(()=>{
      e.target.value &&
      this.fetchPartyList(e.target.value?.trim(), true)
    },100)
  }

  setParyCode() {
    !this.purchaseBillEntryForm.get('party')?.value &&
      this.purchaseBillEntryForm.get('partyFilter')?.value &&
      (this.purchaseBillEntryForm
        .get('party')
        ?.patchValue(this.purchaseBillEntryForm.controls['partyFilter'].value),
        this.purchaseBillEntryForm
          .get('partyName')
          ?.patchValue(
            this.purchaseBillEntryForm.controls['partyFilterName'].value
          ),
        this.fetchPartyList(
          this.purchaseBillEntryForm.get('party')?.value,
          true
        ));
  }

  fetchPartyList(partyCode: any, flagShowPopup: boolean) {
    console.log("partycode",partyCode);
    
    let resPartyAddress: any;
    this.dataEntryService
      .fetchPartyWiseList(partyCode)
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          resPartyAddress = res;
        },
        complete: () => {
          if (resPartyAddress?.status) {
            this.partyPurchaseBillFormGroup.reset();
            this.partyPurchaseBillFormGroup.patchValue({
              ...resPartyAddress?.data?.partyResponseBean,
            });
            this._actionService.getAddFlagUpdatedValue(false);
            this._actionService.getReterieveClickedFlagUpdatedValue(true);
            this.addressFetchData = resPartyAddress?.data?.addressResponseBean;
            //flagShowPopup && this.openDialog(this.modalTitle, this.GstDetailsPopup, true, null, "")
            this.fetchGstDetailPopUp(
              resPartyAddress?.data?.partyResponseBean?.gstno,
              flagShowPopup,
              resPartyAddress?.extraData
            );
            //resPartyAddress?.data?.partyResponseBean?.gstno ? this.isPartyGst = true : this.isPartyGst = false
            this.fieldSet(this.addressFetchData?.state);
            if (resPartyAddress?.data?.partyResponseBean?.supptype) {
              this.billTypeDataList.filter((billTypeVal: any) => {
                if (
                  billTypeVal.id?.trim() ==
                  resPartyAddress?.data?.partyResponseBean?.supptype?.trim()
                )
                  this.purchaseBillEntryForm
                    .get('billType')
                    ?.setValue(`${billTypeVal.id?.trim()}`);
                if (
                  resPartyAddress?.data?.partyResponseBean?.supptype?.trim() ==
                  'B'
                )
                  this.purchaseBillEntryForm.get('billType')?.setValue('M');
              });
            } else {
              this.purchaseBillEntryForm.get('billType')?.setValue('M');
            }
            this.partyPurchaseBillFormGroup.patchValue({
              partycode: resPartyAddress?.data?.partyResponseBean?.partycode,
              partytype: resPartyAddress?.data?.partyResponseBean?.partytype,
            });
            this.changeBillType(
              this.purchaseBillEntryForm.get('billType')?.value
            );
            flagShowPopup &&
              this.purchaseBillEntryForm.get('material')?.reset();
            flagShowPopup &&
              this.purchaseBillEntryForm.controls.challan.value.forEach(
                (ele: any, index: any) =>
                  this.purchaseBillEntryForm.controls.challan instanceof
                  FormArray &&
                  this.purchaseBillEntryForm.controls.challan.controls[index]
                    .get('dcno')
                    ?.patchValue(null)
              );
            flagShowPopup && this.resetItemBreakUp();
          }
          else{
            // if there are no address for party 
            this.fetchPartyAdd = false
            this.noDataStr = resPartyAddress.message
            flagShowPopup && this.openDialog(this.modalTitle, this.GstAddressDetails, true, null, resPartyAddress.extraData);
            this.dialogRef.afterClosed().subscribe((res: any) => {
              location.reload();
            })
          }
        },
      });
  }

  fetchGstDetailPopUp(gstNo: any, flagShowPopup: boolean, gstChk: string) {
    console.log(!gstNo, gstNo);
    if (!gstNo) {
      // if gstNo is empty, call gst Detail empty msg in popup
      this.isPartyGst = false;
      flagShowPopup &&
        this.openDialog(this.modalTitle, this.GstDetailsPopup, true, null, '');
    } else {
      this.isPartyGst = true;
      if (gstChk.toLowerCase() == 'true') {
        flagShowPopup &&
          this.openDialog(
            this.modalTitle,
            this.GstDetailsPopup,
            true,
            null,
            ''
          );
      }
    }
  }

  resetItemBreakUp() {
    for (let i = 0; i < this.itemBreakUpFormArr.controls.length; i++) {
      if (
        this.itemBreakUpFormArr.controls[i]?.value?.hsncode?.trim() ==
        'ROUNDOFFS'
      ) {
        this.isRoundOffExist = false;
      }
    }
    let _controlArr = [
      'amount',
      'cgstamt',
      'cgstperc',
      'discountamt',
      'fotoamt',
      'igstamt',
      'igstperc',
      'sgstamt',
      'sgstperc',
      'taxableamt',
      'ugstamt',
      'ugstperc',
    ];
    this.purchaseBillEntryForm.controls.itemDetailBreakUp.value.map(
      (key: any, index: any) => {
        _controlArr.map((ckey: any) => {
          this.purchaseBillEntryForm.controls.itemDetailBreakUp instanceof
            FormArray &&
            this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[
              index
            ]
              .get('hsncode')
              ?.patchValue(null);
          this.purchaseBillEntryForm.controls.itemDetailBreakUp instanceof
            FormArray &&
            this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[
              index
            ]
              .get(ckey)
              ?.patchValue('0');
        });
      }
    );
    this.purchaseBillEntryForm.get('party')?.enable();
  }

  updatePartyList(event: any, bringBackColumnVal: any) {
    if (event != undefined || event?.length) {
      this.purchaseBillEntryForm.patchValue({
        partyName: event[bringBackColumnVal],
      });
      this.purchaseBillEntryForm.patchValue({ partyFilter: event[0] });
      event[0] && this.fetchPartyList(event[0], false);
    }
  }

  ngAfterViewInit() {
    this.templateRef = this.GstDetailsPopup;
    this.comp?.fo1?.nativeElement?.focus();
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

  getCompanyList() {
    this.dynapop
      .getDynaPopListObj('COMPANY', this.coyQuery)
      .subscribe((res: any) => {
        this.tableData = res.data;
      });
  }

  gstEnterYes() {
    this.dialog.closeAll();
    this.modalTitle = 'Sales Tax & Party Address';
    this.openDialog(this.modalTitle, this.GstAddressDetails, true, null, '');
  }

  getEntry(party: any) {
    this.entryQueryCondition = `PBLH_PARTYCODE='${party}'`;
    this.purchaseBillEntryForm.get('partyFilter')?.value &&
      this.dynapop
        .getDynaPopListObj('BILLENTNO', this.entryQueryCondition)
        .subscribe((res: any) => {
          this.entryTableData = res.data;
        });
  }

  getParty() {
    this.dynapop
      .getDynaPopListObj(
        'PARTYCODE',
        `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '${commonConstant.coyCloseDate}')`
      )
      .subscribe((res: any) => {
        this.partyTableData = res.data;
      });
  }
  getdebitType() {
    this.dynapop
      .getDynaPopListObj('DEBITTO', `ent_class = 'DEBIT'`)
      .subscribe((res: any) => {
        this.debitTypeTableData = res.data;
      });
  }
  getMaterial() {
    this.dynapop
      .getDynaPopListObj(
        'MATGROUPS',
        `mat_level ='1' and (mat_closedate IS NULL OR mat_closedate = '${commonConstant.coyCloseDate}')`
      )
      .subscribe((res: any) => {
        this.materialTableData = res.data;
      });
  }
  getUOM(matgroup: any) {
    this.uomQuery = `UOM_MATGROUP = '${matgroup?.trim()}'`;
    this.dynapop
      .getDynaPopListObj('ITEMUOM', `UOM_MATGROUP = '${matgroup?.trim()}'`)
      .subscribe((res: any) => {
        this.uomTableData = res.data;
      });
  }
  getLevel2(material: any) {
    this.level2_condition = `mat_level ='2' and mat_matgroup = '${material?.trim()}' and (mat_closedate IS NULL OR mat_closedate = '${commonConstant.coyCloseDate
      }')`;
    this.dynapop
      .getDynaPopListObj(
        'MATCODES',
        `mat_level ='2' and mat_matgroup = '${material?.trim()}' and (mat_closedate IS NULL OR mat_closedate = '${commonConstant.coyCloseDate
        }')`
      )
      .subscribe({
        next: (res: any) => {
          this.level2TableData = res.data;
        },
      });
  }
  getHSN() {
    this.dynapop.getDynaPopListObj('HSNSAC', ``).subscribe((res: any) => {
      this.hsnTableData = res.data;
    });
  }

  focusFieldEntry() {
    this.rendered.selectRootElement(this.comp?.fo1.nativeElement)?.focus();
    this.purchaseBillEntryForm.get('entry')?.reset();
  }
  updateListControl(
    val: any,
    formControl: FormControl,
    bringBackColumnVal: any
  ) {
    if (val != undefined) {
      formControl.setValue(val[bringBackColumnVal]);
    }
  }

  get challanFormArr() {
    return this.purchaseBillEntryForm.get('challan') as FormArray;
  }
  initRows() {
    return this.fb.group({
      dcno: new FormControl<string | null>(
        null,
        [Validators.maxLength(16)],
        [this.validateChallanDetail()]
      ),
      site: new FormControl<string | null>(sessionStorage.getItem('site')),
      userid: new FormControl<string>(''),
      challanDate: new FormControl<string | null>(null),
      dcdate: new FormControl(),
      entryno: new FormControl(),
      suppbill: new FormControl(),
      suppcode: new FormControl(),
      billdt: new FormControl(),
    });
  }

  get itemBreakUpFormArr() {
    return this.purchaseBillEntryForm.get('itemDetailBreakUp') as FormArray;
  }
  itemDetailInitRows() {
    return this.fb.group({
      lineno: new FormControl<string | null>('1'),
      amount: new FormControl<string>('0', [Validators.maxLength(15)]),
      cgstamt: new FormControl<string>('0', [Validators.maxLength(12)]),
      cgstperc: new FormControl<string>('0', [Validators.maxLength(6)]),
      discountamt: new FormControl<string>('0', [Validators.maxLength(12)]),
      fotoamt: new FormControl<string>('0', [Validators.maxLength(12)]),
      hsncode: new FormControl<string | null>(null, Validators.maxLength(15)),
      hsndesc: new FormControl<string>(''),
      igstamt: new FormControl<string>('0', [Validators.maxLength(12)]),
      igstperc: new FormControl<string>('0', [Validators.maxLength(6)]),
      sgstamt: new FormControl<string>('0', [Validators.maxLength(12)]),
      sgstperc: new FormControl<string>('0', [Validators.maxLength(6)]),
      site: new FormControl<string>('0'),
      taxableamt: new FormControl<string>('0', Validators.maxLength(15)),
      ugstamt: new FormControl<string>('0', [Validators.maxLength(12)]),
      ugstperc: new FormControl<string>('0', [Validators.maxLength(6)]),
      vatamount: new FormControl<string>('0'),
      vatpercent: new FormControl<string>('0'),
      matgroup: new FormControl<string | null>(null),
      matcode: new FormControl<string | null>(null),
    });
  }

  deleteFormArr(idx: number, flagVal: boolean) {
    flagVal
      ? this.itemBreakUpFormArr.removeAt(idx)
      : this.challanFormArr.removeAt(idx);
  }

  add() {
    this.getF1Load();
    this.purchaseBillDetailsContainer = true;
    this.purchaseBillEntryForm.get('entry')?.disable();
    this.purchaseBillEntryForm.get('partyFilter')?.disable();
    for (let i = 1; i < 5; i++) {
      this.challanFormArr.push(this.initRows());
    }
    this.setActionButtonsFlag(true, true, false, false, false);
    for (let i = 1; i < 5; i++) {
      this.itemBreakUpFormArr.push(this.itemDetailInitRows());
      this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[i]
        .get('lineno')
        ?.patchValue(`${i + 1}`);
    }
    this.clickTrigger = 'A';
    this._actionService.getAddFlagUpdatedValue(true);
    this._actionService.getReterieveClickedFlagUpdatedValue(false);
    //commented code below as priya does not want default today as supp bill dt
    // this.purchaseBillEntryForm.patchValue({
    //   suppBillDate: moment(new Date()).format('YYYY-MM-DD'),
    // });
    setTimeout(() => {
      this.companyCode?.fo1.nativeElement?.focus();
    }, 500);
  }
  retrieve() {
    //this.purchaseBillEntryForm.get('entry')?.valid
    if (this.purchaseBillEntryForm.get('entry')?.valid) {
      this.getF1Load();
      this.loaderToggle = true;
      this.dataEntryService
        .fetchPurchaseBill(this.purchaseBillEntryForm.get('entry')?.value, true)
        .pipe(
          take(1),
          finalize(() => {
            this.loaderToggle = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.purchaseBillEntryForm.get('entry')?.disable();
              this.purchaseBillEntryForm.get('partyFilter')?.disable();
              this.purchaseBillDetailsContainer = true;
              this.clickTrigger = 'R';
              this.fetchedPurchaseBill = res.data;
              this.addressFetchData =
                this.fetchedPurchaseBill?.addressResponseBean;
              this.setFetchedApiData(this.fetchedPurchaseBill);
              this.setActionButtonsFlag(true, true, false, false, false);
              this._actionService.getAddFlagUpdatedValue(false);
              this._actionService.getReterieveClickedFlagUpdatedValue(true);
              setTimeout(() => {
                this.companyCode?.fo1.nativeElement?.focus();
              }, 500);
            } else {
              this.focusFieldEntry();
              this.toasterService.error(res.message);
            }
          },
        });
    } else {
      this.purchaseBillEntryForm.get('entry')?.markAsTouched();
      this.rendered.selectRootElement(this.comp?.fo1.nativeElement)?.focus();
    }
  }

  // setF1Data(dataSet: any, formControlCode: any, formControl: any) {
  //   dataSet.filter((itemId: any) => {
  //     if (itemId[0]?.trim() == formControlCode?.value?.trim()) {
  //       formControl.setValue(itemId[1])
  //     }
  //   })
  // }

  setChallanDt(i: any) {
    console.log(i);
    if (i == 0) {
      // set challan date of first row , when focus out of challan no of first row
      let sdt = this.purchaseBillEntryForm.get('suppBillDate')?.value;
      let cd0 = this.purchaseBillEntryForm.controls.challan.controls[0]
        .get('challanDate');
      if (!cd0?.value) {
        cd0?.patchValue(`${moment(sdt).format('YYYY-MM-DD')}`);
      }
    }
  }

  setFetchedApiData(fetchedApiData: any) {
    this.purchaseBillEntryForm.patchValue({
      company: fetchedApiData?.coy?.trim(),
      amount: fetchedApiData?.amount,
      billType: fetchedApiData?.billtype,
      building: fetchedApiData?.bldgcode?.trim(),
      party: fetchedApiData?.partycode?.trim(),
      partyFilter: fetchedApiData?.partycode?.trim(),
      entry: fetchedApiData?.pbilldResponseBean?.ser,
      suppBillDate: moment(fetchedApiData?.suppbilldt, 'DD/MM/YYYY').format(
        'YYYY-MM-DD'
      ),
      retention: fetchedApiData?.retention,
      tdsperc: fetchedApiData?.tdsperc,
      tdsamt: fetchedApiData?.tdsamount,
      naration: fetchedApiData?.narration?.trim(),
      material:
        fetchedApiData?.pbillvatResponseBean?.length &&
        fetchedApiData?.pbillvatResponseBean[0]?.matgroup?.trim(),
      quantity: fetchedApiData?.pbilldResponseBean?.dequantity,
      tcsAmt: fetchedApiData?.tcsamount,
      value: fetchedApiData?.amount,
      itemRate: fetchedApiData?.pbilldResponseBean?.derate,
      ceIndent: fetchedApiData?.pbilldResponseBean?.ceser?.trim(),
      debitType: fetchedApiData?.debsocyn?.trim(),
      uom: fetchedApiData?.pbilldResponseBean?.deuom?.trim(),
      suppbill: fetchedApiData?.pbilldResponseBean?.suppbillno?.trim(),
      level2: fetchedApiData?.pbilldResponseBean?.matcode?.trim(),
    });
    this.partyPurchaseBillFormGroup.patchValue({
      ...fetchedApiData?.partyResponseBean,
    });
    this.searchTextDataBind(
      'COMPANY',
      '',
      this.purchaseBillEntryForm.controls['company'],
      null,
      this.purchaseBillEntryForm.controls['companyName'],
      'errMsgCompany'
    );
    this.searchTextDataBind(
      'PARTYCODE',
      this.party_condition,
      this.purchaseBillEntryForm.controls['party'],
      null,
      this.purchaseBillEntryForm.controls['partyName'],
      'errMsgParty'
    );
    this.searchTextDataBind(
      'DEBITTO',
      this.debito_condition,
      this.purchaseBillEntryForm.controls['debitType'],
      null,
      this.purchaseBillEntryForm.controls['debitName'],
      'errMsgdebiType'
    );
    this.searchTextDataBind(
      'MATGROUPS',
      this.matGroups_condition,
      this.purchaseBillEntryForm.controls['material'],
      null,
      this.purchaseBillEntryForm.controls['materialName'],
      'errMsgMaterial'
    );
    this.searchTextDataBind(
      'BUILDINGS',
      `bldg_coy='${this.purchaseBillEntryForm.get('company')?.value?.trim()}'`,
      this.purchaseBillEntryForm.controls['building'],
      null,
      this.purchaseBillEntryForm.controls['buildingName'],
      'errMsgBuilding'
    );
    this.searchTextDataBind(
      'MATCODES',
      `mat_level ='2' and mat_matgroup = '${this.purchaseBillEntryForm
        .get('material')
        ?.value?.trim()}' and (mat_closedate IS NULL OR mat_closedate = '${commonConstant.coyCloseDate
      }')`,
      this.purchaseBillEntryForm.controls['level2'],
      null,
      this.purchaseBillEntryForm.controls['level2Name'],
      'errMsgLevel2'
    );
    this.getBuildingList(
      this.purchaseBillEntryForm.get('company')?.value?.trim()
    );
    this.getLevel2(this.purchaseBillEntryForm.get('material')?.value?.trim());
    this.fieldSet(this.addressFetchData?.state);
    if (
      fetchedApiData?.dcResponseBean &&
      fetchedApiData?.dcResponseBean?.length
    ) {
      for (var i = 0; i < fetchedApiData?.dcResponseBean?.length; i++) {
        fetchedApiData.dcResponseBean[i].challanDate = moment(
          fetchedApiData?.dcResponseBean[i]?.dcdate,
          'DD/MM/YYYY'
        ).format('YYYY-MM-DD');
        fetchedApiData?.dcResponseBean?.length - 1 == i
          ? ''
          : this.challanFormArr.push(this.initRows());
        this.purchaseBillEntryForm.controls.challan.patchValue(
          fetchedApiData?.dcResponseBean
        );
      }
    }
    if (
      fetchedApiData?.pbillvatResponseBean &&
      fetchedApiData?.pbillvatResponseBean?.length
    ) {
      for (var i = 0; i < fetchedApiData?.pbillvatResponseBean?.length; i++) {

        fetchedApiData?.pbillvatResponseBean?.length - 1 == i
          ? ''
          : this.itemBreakUpFormArr.push(this.itemDetailInitRows());
        this.purchaseBillEntryForm.controls.itemDetailBreakUp.patchValue(
          fetchedApiData?.pbillvatResponseBean
        );
        if (
          fetchedApiData?.pbillvatResponseBean[i]?.hsncode?.trim() ==
          'ROUNDOFFS'
        ) {
          // this.purchaseBillEntryForm.get('party')?.disable()
          //  this.purchaseBillEntryForm.get('suppBillDate')?.disable()
          this.isRoundOffExist = true;
        }
      }
    }
  }

  fieldSet(stateData: any) {
    this.purchaseBillEntryForm.get('state')?.reset();
    this.purchaseBillEntryForm.get('stateName')?.reset();
    this.dynapop
      .getDynaPopSearchListObj('STATES', ``, stateData)
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          this.purchaseBillEntryForm.patchValue({
            state: stateData,
            stateName: res.data.dataSet[0][1],
          });
        },
      });
  }

  resetFormArray() {
    this.purchaseBillEntryForm.controls.challan.clear();
    this.challanFormArr.push(this.initRows());
    this.purchaseBillEntryForm.controls.itemDetailBreakUp.clear();
    this.itemBreakUpFormArr.push(this.itemDetailInitRows());
  }

  back() {
    this.purchaseBillEntryForm.get('entry')?.enable();
    this.purchaseBillEntryForm.get('partyFilter')?.enable();
    this.purchaseBillEntryForm.get('party')?.enable();
    this.purchaseBillEntryForm.get('suppBillDate')?.enable();
    this.purchaseBillEntryForm.reset();
    this.setBillDetailValues(true);
    this.purchaseBillEntryForm.get('billType')?.patchValue('M');
    this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus();
    this.setActionButtonsFlag(false, false, true, true, true);
    this.purchaseBillDetailsContainer = false;
    this.resetFormArray();
    this.isRoundOffExist = false;
  }
  setActionButtonsFlag(
    add: boolean,
    retrieve: boolean,
    addRow: boolean,
    back: boolean,
    save: boolean
  ) {
    this.disabledFlagAddRow = addRow;
    this.disabledFlagBack = back;
    this.disabledFlagRetrieve = retrieve;
    this.disabledFlagAdd = add;
    this.disabledFlagSave = save;
  }

  addRow() {
    // Added Focus Code For Add Row for Both Tabs
    if (this.navTab == 'itemGSTBreakUpDetails') {
      let max;
      this.itemBreakUpFormArr.push(this.itemDetailInitRows());
      setTimeout(() => {
        this.el.nativeElement.querySelector('#hsncode_' + (this.itemBreakUpFormArr?.length - 1) + ' > input')?.focus();
        //this.rendered.selectRootElement('#hsncode_'.concat((this.itemBreakUpFormArr?.length-1).toString()))?.focus();
      }, 100);
    } else if (this.navTab == 'challandetails') {
      this.challanFormArr.push(this.initRows());
      setTimeout(() => {
        this.rendered.selectRootElement('#cell1'.concat((this.challanFormArr?.length - 1).toString()) + "-1")?.focus();
      }, 100); ``

    }
  }

  deleteRow(rowIndex: any, lineNo: any) {
    if (this.navTab == 'itemGSTBreakUpDetails') {
      if (
        this.itemBreakUpFormArr.controls[rowIndex]?.value?.hsncode?.trim() ==
        'ROUNDOFFS'
      ) {
        this.isRoundOffExist = false;
        this.purchaseBillEntryForm.get('party')?.enable();
        this.purchaseBillEntryForm.get('suppBillDate')?.enable();
      }
      this.itemBreakUpFormArr.length > 1
        ? this.deleteFormArr(rowIndex, true)
        : this.toasterService.error(
          'Atleast One Row must be present in Item / GST BreakUp table'
        );
    } else if (this.navTab == 'challandetails') {
      this.deleteFormArr(rowIndex, false);
    }
  }

  setField() {
    for (
      var i = 0;
      i < this.purchaseBillEntryForm.controls.challan.value.length;
      i++
    ) {
      this.purchaseBillEntryForm.controls.challan.value[i].challanDate
        ? (this.purchaseBillEntryForm.controls.challan.value[i].dcdate = moment(
          this.purchaseBillEntryForm.controls.challan.value[i].challanDate
        ).format('DD/MM/YYYY'))
        : (this.purchaseBillEntryForm.controls.challan.value[i].dcdate = null);
      this.purchaseBillEntryForm.controls.challan.value[i].entryno =
        this.purchaseBillEntryForm.get('entry')?.value?.trim();
      this.purchaseBillEntryForm.controls.challan.value[i].suppbill =
        this.purchaseBillEntryForm.get('suppbill')?.value?.trim();
      this.purchaseBillEntryForm.controls.challan.value[i].suppcode =
        this.purchaseBillEntryForm.get('party')?.value?.trim();
      this.purchaseBillEntryForm.controls.challan.value[i].billdt = moment(
        this.purchaseBillEntryForm.get('suppBillDate')?.value
      ).format('DD/MM/YYYY');
    }
    console.log(this.purchaseBillEntryForm.controls.challan.value, 'setField');
  }

  saveFilterRow() {
    let newArr = [];
    for (
      let i = 0;
      i < this.purchaseBillEntryForm.controls.challan.value.length;
      i++
    ) {
      if (
        this.purchaseBillEntryForm.controls.challan.value[i].challanDate &&
        this.purchaseBillEntryForm.controls.challan.value[i].dcno
      )
        this.dcRequestSavedArray.push(
          this.purchaseBillEntryForm.controls.challan.value[i]
        );
    }
    for (
      let i = 0;
      i < this.purchaseBillEntryForm.controls.itemDetailBreakUp.value.length;
      i++
    ) {
      if (
        this.purchaseBillEntryForm.controls.itemDetailBreakUp.value[i]
          .hsncode &&
        this.purchaseBillEntryForm.controls.itemDetailBreakUp.value[i]
          .taxableamt
      ) {
        this.purchaseBillEntryForm.controls.itemDetailBreakUp.value[
          i
        ].lineno = `${i + 1}`;
        (this.purchaseBillEntryForm.controls.itemDetailBreakUp.value[
          i
        ].matgroup = this.purchaseBillEntryForm.get('material')?.value),
          (this.purchaseBillEntryForm.controls.itemDetailBreakUp.value[
            i
          ].matcode = this.purchaseBillEntryForm.get('level2')?.value),
          newArr.push(
            this.purchaseBillEntryForm.controls.itemDetailBreakUp.value[i]
          ); //MatCode was not previously set
      }
    }
    this.pbillvatRequestBeanArray = JSON.parse(JSON.stringify(newArr));
    let _controlArr: string[] = [
      'lineno',
      'amount',
      'cgstamt',
      'cgstperc',
      'discountamt',
      'fotoamt',
      'igstamt',
      'igstperc',
      'sgstamt',
      'sgstperc',
      'taxableamt',
      'ugstamt',
      'ugstperc',
    ];
    this.pbillvatRequestBeanArray.map((key: any, index: any) => {
      _controlArr.map((ckey: any) => {
        this.pbillvatRequestBeanArray[index][ckey] = parseFloat(key[ckey]);

      });
    });
  }

  payLoadSavePurchaseBillEntry() {
    this.saveFilterRow();
    return {
      amount: parseFloat(`${this.purchaseBillEntryForm.get('amount')?.value}`),
      billtype: this.purchaseBillEntryForm.get('billType')?.value,
      bldgcode: this.purchaseBillEntryForm.get('building')?.value,
      coy: this.purchaseBillEntryForm.get('company')?.value,
      date: moment(
        this.purchaseBillEntryForm.get('suppBillDate')?.value
      ).format('DD/MM/YYYY'),
      narration: this.purchaseBillEntryForm.get('naration')?.value,
      partycode: this.purchaseBillEntryForm.get('party')?.value,
      project: this.purchaseBillEntryForm.get('building')?.value,
      prop: this.purchaseBillEntryForm.get('company')?.value,
      retention: parseFloat(
        `${this.purchaseBillEntryForm.get('retention')?.value}`
      ),
      suppbilldt: moment(
        this.purchaseBillEntryForm.get('suppBillDate')?.value
      ).format('DD/MM/YYYY'),
      tcsamount: parseFloat(
        `${this.purchaseBillEntryForm.get('tcsAmt')?.value}`
      ),
      tdsamount: parseFloat(
        `${this.purchaseBillEntryForm.get('tdsamt')?.value}`
      ),
      tdsperc: parseFloat(
        `${this.purchaseBillEntryForm.get('tdsperc')?.getRawValue()}`
      ),
      debsocyn: this.purchaseBillEntryForm.get('debitType')?.getRawValue()?.trim(),
      suppbillno: this.purchaseBillEntryForm.get('suppbill')?.value,
      partytype: this.partyPurchaseBillFormGroup.get('partytype')?.value,
      isUpdate: this.clickTrigger == 'R' ? true : false,
      ser: this.purchaseBillEntryForm.get('entry')?.value,
      state: this.purchaseBillEntryForm.get('state')?.getRawValue(),
      omspurcyn: 'N',
      pbilldRequestBean: {
        bldgcode: this.purchaseBillEntryForm.get('building')?.value,
        suppbilldt: moment(
          this.purchaseBillEntryForm.get('suppBillDate')?.value
        ).format('DD/MM/YYYY'),
        amount: parseFloat(
          `${this.purchaseBillEntryForm.get('amount')?.value}`
        ),
        ser: this.purchaseBillEntryForm.get('entry')?.getRawValue(),
        suppbillno: this.purchaseBillEntryForm.get('suppbill')?.value,
        rate: parseFloat(
          `${this.purchaseBillEntryForm.get('itemRate')?.getRawValue()}`
        ),
        derate: parseFloat(
          `${this.purchaseBillEntryForm.get('itemRate')?.getRawValue()}`
        ),
        quantity: parseFloat(
          `${this.purchaseBillEntryForm.get('quantity')?.getRawValue()}`
        ),
        dequantity: parseFloat(
          `${this.purchaseBillEntryForm.get('quantity')?.getRawValue()}`
        ),
        dbqty: 0,
        grnln: 0,
        poln: 0,
        indln: 0,
        ceIndent: this.purchaseBillEntryForm.get('ceIndent')?.value,
        uom: this.purchaseBillEntryForm.get('uom')?.value,
        deuom: this.purchaseBillEntryForm.get('uom')?.value,
        partycode: this.purchaseBillEntryForm.get('party')?.value,
        lineno: 1,
        matgroup: this.purchaseBillEntryForm.get('material')?.value?.trim(),
        matgroupname: this.purchaseBillEntryForm
          .get('materialName')
          ?.value?.trim(),
        matcode: this.purchaseBillEntryForm.get('level2')?.value?.trim(),
        ceser: this.purchaseBillEntryForm.get('ceIndent')?.value,
      },
      pbillvatRequestBean: this.pbillvatRequestBeanArray,
      dcRequestBean: this.dcRequestSavedArray,
      partyRequestBean: this.partyPurchaseBillFormGroup.value,
      addressRequestBean: this.receivedAddressList?.value.addressResponseBean,
    };
  }
  setGstField() {
    if (!this.purchaseBillEntryForm.get('partyGst')?.getRawValue()) {
      for (
        let i = 0;
        i < this.purchaseBillEntryForm.controls.itemDetailBreakUp.value.length;
        i++
      ) {
        this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[i]
          .get('cgstperc')
          ?.patchValue('0');
        this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[i]
          .get('cgstamt')
          ?.patchValue('0');
        this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[i]
          .get('igstperc')
          ?.patchValue('0');
        this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[i]
          .get('igstamt')
          ?.patchValue('0');
        this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[i]
          .get('ugstperc')
          ?.patchValue('0');
        this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[i]
          .get('ugstamt')
          ?.patchValue('0');
      }
    }
  }

  setRoundOffField(index: number, totalDifference: number) {
    this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[index]
      .get('hsncode')
      ?.patchValue('ROUNDOFFS');
    this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[index]
      .get('amount')
      ?.patchValue(`${totalDifference.toFixed(2)}`);
    this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[index]
      .get('taxableamt')
      ?.patchValue(`${totalDifference.toFixed(2)}`);
    this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[index]
      .get('hsndesc')
      ?.patchValue('ROUNDOFF');
  }

  itemGstBreakUpTab() {
    this.navTab = 'itemGSTBreakUpDetails';
    setTimeout(() => {
      this.rendered.selectRootElement('#hsncode_0 > input')?.focus();
    }, 100);
  }
  challanDetailTab() {
    this.navTab = 'challandetails';
    this.rendered.selectRootElement('#cell10-1')?.focus();
  }
  focusChanllanTab() {
    this.el.nativeElement.querySelector('[href="#challandetails"]')?.focus();
  }

  saveValidationCheck() {
    this.setGstField();
    let total = 0;
    let totalDifference: number = 0;
    this.totalFoto = 0;
    this.totalCgst = 0;
    this.totalSgst = 0;
    this.totalIgst = 0;
    this.totalUgst = 0;
    for (
      let i = 0;
      i < this.purchaseBillEntryForm.controls.itemDetailBreakUp.value.length;
      i++
    ) {
      total +=
        parseFloat(
          `${this.purchaseBillEntryForm.controls.itemDetailBreakUp?.value[i]?.fotoamt}`
        ) +
        parseFloat(
          `${this.purchaseBillEntryForm.controls.itemDetailBreakUp?.value[i]?.cgstamt}`
        ) +
        parseFloat(
          `${this.purchaseBillEntryForm.controls.itemDetailBreakUp?.value[i]?.sgstamt}`
        ) +
        parseFloat(
          `${this.purchaseBillEntryForm.controls.itemDetailBreakUp?.value[i]?.igstamt}`
        ) +
        parseFloat(
          `${this.purchaseBillEntryForm.controls.itemDetailBreakUp?.value[i]?.ugstamt}`
        ) +
        parseFloat(
          `${this.purchaseBillEntryForm.controls.itemDetailBreakUp?.value[i]?.taxableamt}`
        );
      this.totalFoto += parseFloat(
        `${this.purchaseBillEntryForm.controls.itemDetailBreakUp?.value[i]?.fotoamt}`
      );
      this.totalCgst += parseFloat(
        `${this.purchaseBillEntryForm.controls.itemDetailBreakUp?.value[i]?.cgstamt}`
      );
      this.totalSgst += parseFloat(
        `${this.purchaseBillEntryForm.controls.itemDetailBreakUp?.value[i]?.sgstamt}`
      );
      this.totalIgst += parseFloat(
        `${this.purchaseBillEntryForm.controls.itemDetailBreakUp?.value[i]?.igstamt}`
      );
      this.totalUgst += parseFloat(
        `${this.purchaseBillEntryForm.controls.itemDetailBreakUp?.value[i]?.ugstamt}`
      );
      total = parseFloat(total.toFixed(2));
    }
    this.total = total;
    this.headerAmt =
      parseFloat(`${this.purchaseBillEntryForm.get('amount')?.value}`) -
      parseFloat(`${this.purchaseBillEntryForm.get('tcsAmt')?.value}`);
    totalDifference = this.headerAmt - this.total;
    if (parseFloat(`${this.purchaseBillEntryForm.get('amount')?.value}`) == 0) {
      this.toasterService.error('Amount cannot be 0');
      this.rendered.selectRootElement('#amountVal')?.focus();
      return false;
    }
    if (totalDifference != 0) {
      this.openDialog(
        'FrmPurchaseBill_New',
        this.saveValidationPopUp,
        true,
        null,
        ''
      );
      this.dialogRef.afterClosed().subscribe((res: any) => {
        this.el.nativeElement
          .querySelector('[href="#itemGSTBreakUpDetails"]')
          ?.click();
        if (
          totalDifference >= -5 &&
          totalDifference <= 5 &&
          totalDifference != 0
        ) {
          for (let i = 0; i < this.itemBreakUpFormArr.controls.length; i++) {
            if (!this.itemBreakUpFormArr.controls[i].value.hsncode) {
              // remove row where hsncode not there
              this.itemBreakUpFormArr.controls.splice(i, 1);
              i = -1;
            }
          }
          if (!this.isRoundOffExist) {
            this.itemBreakUpFormArr.push(this.itemDetailInitRows());
            this.setRoundOffField(
              this.itemBreakUpFormArr.length - 1,
              totalDifference
            );
            this.isRoundOffExist = true;
            //  this.purchaseBillEntryForm.get('party')?.disable()
          }
          for (let i = 0; i < this.itemBreakUpFormArr.controls.length; i++) {
            if (
              this.itemBreakUpFormArr.controls[i]?.value?.hsncode?.trim() ==
              'ROUNDOFFS'
            ) {
              this.setRoundOffField(i, totalDifference);
              //  this.purchaseBillEntryForm.get('party')?.disable()
              // this.purchaseBillEntryForm.get('suppBillDate')?.disable()
            }
          }
        }
        setTimeout(() => {
          this.rendered.selectRootElement('#amountVal')?.focus();
        }, 200)
      });
      return false;
    }
    console.log(typeof total, total, totalDifference);
    return true;
  }

  save() {
    this.setField();
    if (this.purchaseBillEntryForm.valid) {
      if (this.saveValidationCheck()) {
        this.disabledFlagSave = true;
        this.loaderToggle = true;
        this.dataEntryService
          .savePurchaseBillEntry(this.payLoadSavePurchaseBillEntry())
          .pipe(
            take(1),
            finalize(() => {
              this.loaderToggle = false;
            })
          )
          .subscribe({
            next: (res: any) => {
              if (res.status) {
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
              } else {
                this.disabledFlagSave = false;
                if (res?.data?.isLogicNote || res?.data?.isFinalBill) {
                  this.purchaseBillEntryForm.get('party')?.enable();
                  this.purchaseBillEntryForm.get('partyFilter')?.enable();
                  this.modalService.showErrorDialogCallBack(
                    constant.ErrorDialog_Title,
                    res.message,
                    this.partyId?.fo1.nativeElement?.focus(),
                    'error'
                  );
                  this.purchaseBillEntryForm.patchValue({
                    party: '',
                    partyName: '',
                    state: '',
                    stateName: '',
                    partyGst: '',
                    partyFilter: '',
                    partyFilterName: '',
                  });
                }
                if (res?.data?.isDebitType) {
                  this.modalService.showErrorDialogCallBack(
                    constant.ErrorDialog_Title,
                    res.message,
                    this.el.nativeElement
                      .querySelector('[ng-reflect-name="debitType"] > input')
                      ?.focus(),
                    'error'
                  );
                }
              }
            },
            error: (err: any) => {
              this.disabledFlagSave = false;
            },
          });
      }
    } else {
      this.purchaseBillEntryForm.markAllAsTouched();
      this.service.setFocusField(
        this.purchaseBillEntryForm.controls,
        this.el.nativeElement
      );
      this.setFocusControlsArray(
        this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls
      );
      this.setFocusControlsArray(
        this.purchaseBillEntryForm.controls.challan.controls
      );
    }
    this.dcRequestSavedArray = [];
    this.pbillvatRequestBeanArray = [];
  }
  setFocusControlsArray(formControls: any) {
    for (let i = 0; i < formControls.length; i++) {
      for (const key of Object.keys(formControls[i].controls)) {
        if (formControls[i].controls[key].invalid) {
          //el.querySelector('[id="' + key + '_' + i + '"]')?.focus();
          formControls[i].controls[key].errors &&
            (formControls[i].controls[key].errors.errMsg
              ? this.toasterService.error(
                `${formControls[i].controls[key].errors.errMsg}`
              )
              : this.toasterService.error('Please Fill Form Properly'));
          break;
        }
      }
    }
  }

  supplierBillExist(event: any) {
    if (event.target.value) {
      let response: any;
      this.dataEntryService
        .supplierNoCheck(
          event.target.value?.trim(),
          `${this.purchaseBillEntryForm.get('party')?.value}`
        )
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            response = res;
          },
          complete: () => {
            if (!response.status) {
              this.modalService.showErrorDialogCallBack(
                constant.ErrorDialog_Title,
                response.message,
                this.rendered.selectRootElement('#suppBill')?.focus(),
                'error'
              );
              event.target.value = null;
            }
          },
        });
    }
  }

  updateMaterial(
    event: any,
    bringBackColumn: any,
    formControl: any,
    errmsg: any,
    setFlag: boolean
  ) {
    if (event && event.length) {
      formControl.setValue(event[bringBackColumn]);
      this.getLevel2(event[0]);
      this.getUOM(event[0].trim());
      setFlag && this.setUomByMat(event[0].trim());
    }
  }
  setBillDetailValues(flagDetail: any) {
    let fieldArr = ['uom', 'quantity']; // call api with setDetail Value
    for (let i = 0; i < fieldArr.length; i++) {
      flagDetail
        ? this.purchaseBillEntryForm.get(fieldArr[i])?.enable()
        : this.purchaseBillEntryForm.get(fieldArr[i])?.disable();
      !flagDetail && this.purchaseBillEntryForm.get(fieldArr[i])?.reset();
    }
  }

  setUomByMat(matGroup: any) {
    this.dataEntryService
      .fetchUOM(
        matGroup,
        moment(this.purchaseBillEntryForm.get('suppBillDate')?.value).format(
          'DD/MM/YYYY'
        ),
        this.purchaseBillEntryForm.get('billType')?.value
      )
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          if (res?.status) {
            this.purchaseBillEntryForm.patchValue({
              uom: res?.data?.uom,
              quantity: res?.data?.qty,
              itemRate: res?.data?.rate,
            });
            res?.data?.level2
              ? this.purchaseBillEntryForm.get('level2')?.enable()
              : this.purchaseBillEntryForm.get('level2')?.disable();
            this.setBillDetailValues(res?.data?.setBillDetailValues);
          }
        },
      });
  }

  triggerCalculateGst(index: number) {
    this.calcGST(
      'CGST',
      this.purchaseBillEntryForm?.controls?.itemDetailBreakUp?.controls[index]
        ?.controls['cgstperc'],
      this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[index].get(
        'taxableamt'
      )?.value,
      this.purchaseBillEntryForm?.controls?.itemDetailBreakUp?.controls[index]
        ?.controls['cgstamt'],
      'cell' + index + '-6'
    );
    this.calcGST(
      'SGST',
      this.purchaseBillEntryForm?.controls?.itemDetailBreakUp?.controls[index]
        ?.controls['sgstperc'],
      this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[index].get(
        'taxableamt'
      )?.value,
      this.purchaseBillEntryForm?.controls?.itemDetailBreakUp?.controls[index]
        ?.controls['sgstamt'],
      'cell' + index + '-6'
    );
    this.calcGST(
      'IGST',
      this.purchaseBillEntryForm?.controls?.itemDetailBreakUp?.controls[index]
        ?.controls['igstperc'],
      this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[index].get(
        'taxableamt'
      )?.value,
      this.purchaseBillEntryForm?.controls?.itemDetailBreakUp?.controls[index]
        ?.controls['igstamt'],
      'cell' + index + '-10'
    );
    this.calcGST(
      'UGST',
      this.purchaseBillEntryForm?.controls?.itemDetailBreakUp?.controls[index]
        ?.controls['ugstperc'],
      this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[index].get(
        'taxableamt'
      )?.value,
      this.purchaseBillEntryForm?.controls?.itemDetailBreakUp?.controls[index]
        ?.controls['ugstamt'],
      'cell' + index + '-12'
    );
  }

  calcTaxableAmt(index: number, itemAmount: any, discount: any) {
    console.log('itemAmount', !itemAmount);
    if (parseFloat(discount) < parseFloat(itemAmount)) {
      this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[index]
        .get('taxableamt')
        ?.patchValue(`${parseFloat(itemAmount) - parseFloat(discount)}`);
      // whenever itemchange calculate gst
      this.triggerCalculateGst(index);
    } else {
      this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[index]
        .get('discountamt')
        ?.patchValue('0');
      this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[index]
        .get('taxableamt')
        ?.patchValue(`${parseFloat(itemAmount) - parseFloat('0')}`);
      this.toasterService.error('discount cannot be greater than item amount');
      this.triggerCalculateGst(index);
    }
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
      this.toasterService.error(`${message} % cannot be greater than 100`);
    }
  }

  savePartyAddPayLoad() {
    if (this.cityValueChangeFlag) {
      this.updateToday();
    }
    this.partyPurchaseBillFormGroup.patchValue({
      city: this.receivedAddressList?.controls['addressResponseBean'].value
        .city,
    });
    let partyBean: any = {
      partyRequestBean: this.partyPurchaseBillFormGroup.value,
      addressRequestBean: this.receivedAddressList?.value.addressResponseBean,
      gstValdiationBean: {
        state: this.receivedAddressList?.value.addressResponseBean?.state,
        gstNumber: this.partyPurchaseBillFormGroup?.value?.gstno,
        panCardNumber: this.partyPurchaseBillFormGroup.value?.pmtacnum,
      },
    };

    // if (this.partyPurchaseBillFormGroup.value?.pmtacnum) {
    //   partyBean.gstValdiationBean['panCardNumber'] =
    //     this.partyPurchaseBillFormGroup.value?.pmtacnum;
    // }

    // if (this.partyPurchaseBillFormGroup.value?.gstno) {
    //   partyBean.gstValdiationBean['gstNumber'] =
    //     this.partyPurchaseBillFormGroup.value.gstno;
    // }

    return partyBean;
  }

  savePartyAdress() {
    if (
      this.partyPurchaseBillFormGroup.valid &&
      this.receivedAddressList.valid
    ) {
      this.dataEntryService
        .savePartyAddress(this.savePartyAddPayLoad())
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.modalService.showErrorDialogCallBack(
                constant.ErrorDialog_Title,
                res.message,
                this.billTypeFocus(),
                'info'
              );
              this.dialogRef.close();
              this.fieldSet(
                this.savePartyAddPayLoad().addressRequestBean.state
              ); // patch state and statename
            } else {
              this.modalService.showErrorDialog(
                constant.ErrorDialog_Title,
                res.message,
                'info'
              );
            }
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 400) {
              this.disabledFlagSave = false
              console.log("error", error.error.errors[0].defaultMessage)
              this.modalService.showErrorDialog(constant.ErrorDialog_Title, error.error.errors[0].defaultMessage, "error")
              // this.toastr.showError(error.error.errors[0].defaultMessage)
            }
          },
        });
    } else {
      this.partyPurchaseBillFormGroup.markAllAsTouched();
      this.receivedAddressList.markAllAsTouched();
    }
  }
  @ViewChild('billTypeSelect') billTypeSelect!: ElementRef;
  billTypeFocus() {
    this.billTypeSelect?.nativeElement?.focus();
  }

  changeBillType(event: any) {
    if (
      this.purchaseBillEntryForm.get('billType')?.value == 'T' ||
      this.purchaseBillEntryForm.get('billType')?.value == 'W'
    ) {
      this.purchaseBillEntryForm.patchValue({
        uom: null,
        itemRate: '0',
        quantity: '0',
      });
      this.purchaseBillEntryForm.get('uom')?.disable();
      this.purchaseBillEntryForm.get('quantity')?.disable();
    } else {
      this.purchaseBillEntryForm.get('uom')?.enable();
      this.purchaseBillEntryForm.get('quantity')?.enable();
    }
    this.calculateTDS();
  }

  billTypeValid(data: any): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.root?.get(data)?.value) {
        return this.dataEntryService
          .checkBillTypeValid(
            control.root?.get(data)?.value?.trim(),
            control.value.trim()
          )
          .pipe(
            map((res: any) => {
              console.log('async', res);
              // if res is true, username exists, return true
              return res.status ? null : { billTypeValid: true };
              // NB: Return null if there is no error
            })
          );
      }
      return of(null);
    };
  }

  debitTypeValid(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.value) {
        return this.dataEntryService
          .checkDebitTypeValid(
            control.root?.get('building')?.value?.trim(),
            control.value
          )
          .pipe(
            map((res: any) => {
              console.log('async', res);

              // if res is true, username exists, return true
              return res.status ? null : { debitTypeValid: true };
              // NB: Return null if there is no error
            })
          );
      }
      return of(null);
    };
  }
  validateUOM(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.value) {
        return this.dataEntryService
          .validateUomDetail(control.value.trim())
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
  resetF1Field() {
    !this.purchaseBillEntryForm.get('material')?.value &&
      (this.level2TableData = null);
    !this.purchaseBillEntryForm.get('material')?.value &&
      this.purchaseBillEntryForm.get('level2')?.patchValue(null);
    let setFieldArr = [
      { code: 'company', value: 'companyName' },
      { code: 'building', value: 'buildingName' },
      { code: 'party', value: 'partyName' },
      { code: 'material', value: 'materialName' },
      { code: 'debitType', value: 'debitName' },
      { code: 'level2', value: 'level2Name' },
      { code: 'partyFilter', value: 'partyFilterName' },
    ];
    for (let i = 0; i < setFieldArr.length; i++) {
      !this.purchaseBillEntryForm.get(setFieldArr[i].code)?.value &&
        this.purchaseBillEntryForm.get(setFieldArr[i].value)?.patchValue(null);
    }
    this.itemBreakUpFormArr.controls.forEach((element: any) => {
      !element.controls.hsncode.value &&
        element.controls.hsndesc.patchValue(null);
    });
    this.purchaseBillEntryForm.controls['partyName'].value &&
      this.purchaseBillEntryForm
        .get('partyFilterName')
        ?.patchValue(
          `${this.purchaseBillEntryForm.controls['partyName'].value}`
        );
  }

  calculateTDS() {
    let amtSum: number = 0;
    this.itemBreakUpFormArr.controls.forEach(e => {
      console.log(e.get('amount')?.value, "e");
      amtSum += parseFloat(e.get('amount')?.value) + parseFloat(e.get('fotoamt')?.value)
    });
let sdt = this.purchaseBillEntryForm.get('suppBillDate')?.value ?
moment(this.purchaseBillEntryForm.get('suppBillDate')?.value).format(
  'DD/MM/YYYY' 
) : moment(new Date()).format(
  'DD/MM/YYYY' 
);

    if (
      this.purchaseBillEntryForm.get('company')?.value &&
      this.purchaseBillEntryForm.get('party')?.value
    ) {
      console.log("suppbilldateK",this.purchaseBillEntryForm.get('suppBillDate')?.value );
      console.log("suppbilldateK1",sdt );
      this.dataEntryService
        .calculateTds(
          sdt,
          amtSum.toFixed(2),
          this.purchaseBillEntryForm.get('billType')?.value?.trim(),
          this.purchaseBillEntryForm.get('party')?.value?.trim(),
          this.purchaseBillEntryForm.get('company')?.value?.trim()
        )
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.purchaseBillEntryForm.patchValue({
                tdsperc: res?.data?.tdsPercentage,
                tdsamt: res?.data?.tdsAmount,
              });
            } else {
              this.modalService.showErrorDialog(
                constant.ErrorDialog_Title,
                res.message,
                'error'
              );
            }
          },
        });
    }
  }

  supplierDateValidation(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.value) {
        return this.dataEntryService
          .validateSuppbillDt(moment(control.value).format('DD/MM/YYYY'))
          .pipe(
            map((res: any) => {
              return res.status
                ? null
                : {
                  validateSuppbillDt: true,
                  validateSuppbillMsg: res.message,
                };
            })
          );
      }
      return of(null);
    };
  }
  validateChallanDetail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.value) {
        return this.dataEntryService
          .validateChallanDetail(
            control.value,
            control.root.get('party')?.value?.trim(),
            control.root.get('entry')?.value,
            moment(control.root.get('suppBillDate')?.value).format('DD/MM/YYYY')
          )
          .pipe(
            map((res: any) => {
              return res.status
                ? null
                : { validateChallanDetail: true, errMsg: res.message };
            })
          );
      }
      return of(null);
    };
  }
  setItemQuantity() {
    let amtFrt: any = this.purchaseBillEntryForm.get('amount')?.value;
    let qtyFrtVal: any = this.purchaseBillEntryForm.get('quantity')?.value;
    this.purchaseBillEntryForm.patchValue({
      amount: parseFloat(amtFrt).toFixed(2),
    });
    this.purchaseBillEntryForm.patchValue({
      quantity: parseFloat(qtyFrtVal).toFixed(3),
    });
    parseFloat(`${this.purchaseBillEntryForm.get('quantity')?.value}`) > 0 &&
      parseFloat(`${this.purchaseBillEntryForm.get('amount')?.value}`) > 0
      ? this.dataEntryService
        .validateUomConversionRate(
          `${this.purchaseBillEntryForm.get('material')?.value?.trim()}`,
          `${this.purchaseBillEntryForm.get('uom')?.value?.trim()}`,
          parseFloat(`${this.purchaseBillEntryForm.get('amount')?.value}`),
          parseFloat(`${this.purchaseBillEntryForm.get('quantity')?.value}`)
        )
        .pipe(take(1))
        .subscribe({
          next: (res: any) =>
            res.status &&
            this.purchaseBillEntryForm
              .get('itemRate')
              ?.patchValue(`${res.data?.toFixed(2)}`),
        })
      : this.purchaseBillEntryForm.get('itemRate')?.patchValue(`0`);
  }

  searchTextDataBind(
    dynaPopId: any,
    queryConditon: any,
    searchField: FormControl,
    errorMessage: any,
    formControl: FormControl | null,
    errMsgId: string
  ) {
    searchField?.value?.trim() &&
      this.dynapop
        .getDynaPopSearchListObj(dynaPopId, queryConditon, searchField?.value)
        .subscribe((res: any) => {
          if (res.data.dataSet.length == 0) {
            this.toasterService.error(errorMessage);
            searchField?.setValue(null);
          } else {
            formControl && formControl.setValue(res.data.dataSet[0][1]);
            searchField?.setValue(res.data.dataSet[0][0]);
          }
        });
  }

  fetchGstPerc(index: any) {
    let isUpdate;
    setTimeout(() => {
      this.clickTrigger == 'A' ? (isUpdate = false) : (isUpdate = true);
      let payload: any = {
        adowner: this.purchaseBillEntryForm.get('building')?.value,
        segment: commonConstant.segment.BLDG,
        adrPartySegment: commonConstant.segment.PARTY,
        adPartyType: commonConstant.AdType.LOC,
        adtype: commonConstant.AdType.LOC,
        hsncode:
          this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[index]
            .value?.hsncode,
        partycode: this.purchaseBillEntryForm.get('party')?.value,
        suppbilldt: moment(
          this.purchaseBillEntryForm.get('suppBillDate')?.value
        ).format('DD/MM/YYYY'),
        ser: `${this.purchaseBillEntryForm.get('entry')?.value}`,
        isUpdate: isUpdate,
      };

      this.purchaseBillEntryForm.get('party')?.value &&
        this.purchaseBillEntryForm.get('suppBillDate')?.value &&
        this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[index]
          .value?.hsncode &&
        this.dynapop.getGst(payload).subscribe({
          next: (res: any) => {
            console.log(res);
            this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[
              index
            ]
              .get('hsndesc')
              ?.patchValue(res?.data?.description);
            this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[
              index
            ]
              .get('cgstperc')
              ?.patchValue(res?.data?.cgstperc);
            this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[
              index
            ]
              .get('sgstperc')
              ?.patchValue(res?.data?.sgstperc);
            this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[
              index
            ]
              .get('igstperc')
              ?.patchValue(res?.data?.igstperc);
            this.purchaseBillEntryForm.controls.itemDetailBreakUp.controls[
              index
            ]
              .get('ugstperc')
              ?.patchValue(res?.data?.ugstperc);
            this.triggerCalculateGst(index);
          },
        });
    }, 10);
  }

  formatChk(e: any, i: number) {
    if (!moment(e.target.value, 'yyyy-MM-dd', true).isValid()) {
      this.purchaseBillEntryForm.controls.challan.controls[i].controls['challanDate'].setValue(null)
    }
  }

  navigate(e: KeyboardEvent, i: number) {
    let nextRow: any = i;
    e.key == 'ArrowDown'
      ? nextRow++
      : e.key == 'ArrowUp' && nextRow > 0
      ? nextRow--
      : '';

    let nextElId = 'hsncode_' + nextRow;

    // Get the parent element
    const parentElement = document.getElementById(nextElId);

    // Find the child input element inside the parent element
    const childInputElement = parentElement?.getElementsByTagName('input')[0];
    childInputElement &&
      this.rendered.selectRootElement(childInputElement)?.focus();
  }
}

export function validateSuppDtFuture(): ValidatorFn {
  return (_control: AbstractControl): ValidationErrors | null => {
    if (_control.value) {
      if (moment(_control.value).isBefore(new Date())) return null;
      return { dateValidation: true };
    }
    return null;
  };
}
export function retentionVal(): ValidatorFn {
  return (_control: AbstractControl): ValidationErrors | null => {
    let fieldSet = [
      'amount',
      'tcsAmt',
      'quantity',
      'retention',
      'tdsperc',
      'tdsamt',
      'itemRate',
    ];
    _control.get('retention')?.value &&
      parseFloat(_control.get('retention')?.value) >=
      parseFloat(_control.get('amount')?.value) &&
      _control.get('retention')?.value > 0
      ? _control.get('retention')?.setErrors({ retentionValidation: true })
      : _control.get('retention')?.setErrors(null);
    _control.get('tcsAmt')?.value &&
      parseFloat(_control.get('tcsAmt')?.value) >=
      parseFloat(_control.get('amount')?.value) &&
      _control.get('tcsAmt')?.value > 0
      ? _control.get('tcsAmt')?.setErrors({ tcsAmtValidation: true })
      : _control.get('tcsAmt')?.setErrors(null);
    for (let i = 0; i < fieldSet.length; i++) {
      !_control.get(`${fieldSet[i]}`)?.value &&
        _control.get(fieldSet[i])?.patchValue('0');
    }
    return null;
  };
}

export function challanDateValidation(): ValidatorFn {
  return (_control: AbstractControl): { [key: string]: any } | null => {
    for (let i = 0; i < _control.value.length; i++) {
      moment(_control.value[i].challanDate).isAfter(
        moment(_control.root.get('suppBillDate')?.value)
      ) &&
        _control instanceof FormArray &&
        _control.controls[i].get('challanDate')?.setErrors({
          challanDtValFn: true,
          errMsg: 'challan Date cannot be greater than bill Date',
        });
      _control.value[i].dcno &&
        !_control.value[i].challanDate &&
        _control instanceof FormArray &&
        _control.controls[i].get('challanDate')?.setErrors({
          challanDtRequired: true,
          errMsg: 'Challan Date is Required',
        });
      _control.value[i].challanDate &&
        !_control.value[i].dcno &&
        _control instanceof FormArray &&
        _control.controls[i]
          .get('dcno')
          ?.setErrors({ dcnoRequired: true, errMsg: 'Challan is Required' });
      if (!_control.value[i].challanDate && !_control.value[i].dcno) {
        _control instanceof FormArray &&
          _control.controls[i].get('dcno')?.setErrors(null);
        _control instanceof FormArray &&
          _control.controls[i].get('challanDate')?.setErrors(null);
      }
    }
    return null;
  };
}

export function itemBreakUpValidation(): ValidatorFn {
  return (_control: AbstractControl): { [key: string]: any } | null => {
    for (let i = 0; i < _control.value.length; i++) {
      !_control.value[i].hsncode &&
        parseFloat(_control.value[i].amount) !== parseFloat('0')
        ? _control instanceof FormArray &&
        _control.controls[i]
          .get('hsncode')
          ?.setErrors({ hsncodeRequired: true, errMsg: 'Hsn Required' })
        : _control instanceof FormArray &&
        _control.controls[i].get('hsncode')?.setErrors(null);
    }
    let _controlArr = [
      'amount',
      'cgstamt',
      'cgstperc',
      'discountamt',
      'fotoamt',
      'igstamt',
      'igstperc',
      'sgstamt',
      'sgstperc',
      'taxableamt',
      'ugstamt',
      'ugstperc',
    ];
    _control.value.map((key: any, index: any) => {
      _controlArr.map((ckey: any) => {
        !_control.value[index][ckey] &&
          _control instanceof FormArray &&
          _control.controls[index].get(ckey)?.patchValue('0');
      });
    });
    return null;
  };
}
