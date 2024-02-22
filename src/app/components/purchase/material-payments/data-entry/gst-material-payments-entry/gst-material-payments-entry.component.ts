import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  debounceTime,
  finalize,
  map,
  merge,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';

import { MaterialPaymentsService } from 'src/app/services/purch/material-payments.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import * as commonConstant from '../../../../../../constants/commonconstant';
import { DynapopService } from 'src/app/services/dynapop.service';

@Component({
  selector: 'app-gst-material-payments-entry',
  templateUrl: './gst-material-payments-entry.component.html',
  styleUrls: ['./gst-material-payments-entry.component.css'],
})
export class GstMaterialPaymentsEntryComponent implements OnInit {
  qf!: FormGroup;
  loaderToggle: boolean = false;
  narrToggle: Boolean = false;
  gstBrkupToggle: Boolean = false;
  gstBrkup: any;

  errMsg: String[] = ['This is required', 'Invalid'];
  maxDate: Date = new Date();
  changesUnsubscribe = new Subject();

  billQuery: string = '';
  billDetailsToggle: boolean = true;
  paidBillsArr: any = [];
  billsDisabled: boolean = true;
  billDetails: any;
  billFlag: string = 'N';
  saveDisabled: boolean = true;

  matCodeQC = ``;
  matGrpQC = `mat_acmajor is Not Null and MAT_MATCODE = '****' AND MAT_ITEMCODE = '********' and (MAT_CLOSEDATE IS NULL OR MAT_CLOSEDATE = '${commonConstant.closeDate}')`;
  supQuery = `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '${commonConstant.closeDate}')`;

  constructor(
    private toastr: ToastrService,
    private _material: MaterialPaymentsService,
    private _dynaPop: DynapopService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.qf = this.fb.group(
      {
        partyCode: ['', Validators.required],
        bldgCode: ['', Validators.required],
        matGrp: ['', Validators.required],
        matCode: [{ value: [], disabled: true }],
        authtype: [
          ['N    ', 'Normal                        '],
          Validators.required,
        ],
        authdate: [moment(), Validators.required],
        authamount: [{ value: 0, disabled: true }],
        runningSer: [{ value: '', disabled: true }],
        lotno: [{ value: '', disabled: true }],
        bills: ['', Validators.required],
        expenstype: '',
        preparedby: '',
        remarks: [''],
        description: [''],
        advgranted: [{ value: 0, disabled: true }, Validators.min(0)],
        advadj: [{ value: null, disabled: true }],
        debsocyn: [{ value: '', disabled: true }],
        profinvno: '',
        profinvdt: '',
        advrecvoucherRequestBeanList: this.fb.array([]),
        authDRequestBeanList: this.fb.array([], validationAuthD()),
        narrItems: this.fb.array([], validationNarr()),
      },
      {
        validators: formValidation(),
      }
    );

    this.addFocus('supp');
    this.matGrpChg();
    this.authChg();
    this.codeChg();
    this.updateDebitType();
    this.updateAdvOsAmt();
  }

  // get bill & its query
  codeChg() {
    const reqControl = ['partyCode', 'bldgCode', 'matGrp', 'authtype'];
    merge(
      ...reqControl.map((name: any) => this.qf.get(name)?.valueChanges)
    ).subscribe((val) => {
      let pc = this.qf.get('partyCode')?.value?.[0];
      let bc = this.qf.get('bldgCode')?.value?.[0];
      let mc = this.qf.get('matGrp')?.value?.[0];
      let at = this.qf.get('authtype')?.value?.[0]?.[0]?.trim()?.toUpperCase();
      if (
        pc instanceof Object &&
        bc instanceof Object &&
        mc instanceof Object
      ) {
        this.getAdv();
        this.billQuery = `pblh_partycode = '${pc?.[0]?.trim()}' AND pblh_bldgcode  = '${bc?.[0]?.trim()}' AND pbld_matgroup  = '${mc?.[0]?.trim()}'`;

        if (at != 'C' && at != 'A') {
          this.qf.get('bills')?.enable();
          this.saveDisabled = true;
        } else {
          this.saveDisabled = false;
        }

        if (at != 'L' && at != 'R') {
          this.billQuery =
            this.billQuery +
            ' AND (pblh_authnum is null AND pblh_authdate is null)';
        } else {
          this.billQuery = this.billQuery + ' AND pblh_retainos > 0';
        }
      } else {
        this.qf.get('bills')?.setValue('');
        this.qf.get('bills')?.disable();
        this.billQuery = '';
      }
    });
  }

  // patch debit type when changed BldgCode
  updateDebitType() {
    this.qf.get('bldgCode')?.valueChanges.subscribe((val) => {
      if (val instanceof Object) {
        let buildingCode = { buildingCode: val?.[0]?.[0]?.trim() };
        this._material.fetchDebitType(buildingCode).subscribe({
          next: (res: any) => {
            res?.status
              ? this.qf.get('debsocyn')?.patchValue(res?.data)
              : this.qf.get('debsocyn')?.patchValue(null);
          },
        });
      }
    });
  }

  // update adv O/S amt based on adv adj
  updateAdvOsAmt() {
    this.qf
      .get('advadj')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => {
        this.getAdv();
      });
  }

  // subscribe to auth type valuechanges
  authChg() {
    this.qf.get('authtype')?.valueChanges.subscribe((val) => {
      console.log('authtype value', val);
      if (val instanceof Object) {
        let code = val[0][0]?.trim()?.toUpperCase();
        this.billFlag = code ?? '';
        this.getMatCode(this.qf.get('matGrp')?.value);
        this.authD.clear();
        this.qf.get('bills')?.setValue('');
        this.qf.get('advgranted')?.setValue(0);
        switch (code) {
          case 'A':
            this.getAdv();

            // Gst Brkup(hsn) & add rows
            this.gstBrkupToggle = true;
            this.items.clear();
            for (let i = 0; i < 3; i++) {
              this.addItem();
              this.watchForChanges();
            }

            this.qf.get('profinvno')?.setValidators(Validators.required);
            this.qf.get('profinvdt')?.setValidators(Validators.required);
            this.qf.get('remarks')?.setValidators(Validators.required);
            this.qf.get('bills')?.disable();
            this.qf.get('advgranted')?.disable();
            this.clearDescription();
            break;
          case 'C':
            this.resetA();
            this.getAdv();
            this.qf.get('bills')?.disable();
            this.qf.get('advgranted')?.enable();
            this.qf
              .get('advgranted')
              ?.setValidators([
                Validators.required,
                Validators.min(1),
                advReturn(),
              ]);
            this.qf.get('advgranted')?.updateValueAndValidity();
            this.qf.get('remarks')?.setValidators(Validators.required);
            this.clearDescription();
            break;
          case 'L':
            this.commNLR();
            this.clearDescription();
            break;
          case 'R':
            this.commNLR();
            // description required in R auth type
            this.qf.get('description')?.setValidators(Validators.required);
            this.qf.get('description')?.updateValueAndValidity();
            break;
          case 'N':
            this.commNLR();
            this.clearDescription();
            break;

          default: {
            this.resetA();
          }
        }
      }
    });
  }

  commNLR() {
    this.resetA();
    this.getAdv();
    this.qf.get('remarks')?.clearValidators();
    this.qf.controls['bills'].enable();
    this.qf.controls['advgranted'].disable();
  }

  clearDescription() {
    this.qf.controls['description'].clearValidators();
    this.qf.controls['description'].updateValueAndValidity();
  }

  //reset Gst Brkup
  resetA() {
    this.gstBrkupToggle = false;
    this.items.clear();
    this.qf.controls['profinvno'].clearValidators();
    this.qf.controls['profinvno'].updateValueAndValidity();
    this.qf.controls['profinvdt'].clearValidators();
    this.qf.controls['profinvdt'].updateValueAndValidity();
    this.qf.get('advgranted')?.setValidators(Validators.min(0));
  }

  matGrpChg() {
    this.qf.get('matGrp')?.valueChanges.subscribe((val) => {
      if (val instanceof Object) {
        this.narr(); // get Narration items on matGrp changes
        this.getMatCode(val);
      }
    });
  }

  // enable matcode based on matGroup & AuthType
  getMatCode(val: any) {
    let matCode = this.qf.get('matCode');
    let matGrpArr = ['MARB', 'GRAN', 'GRLS'];
    if (
      matGrpArr.includes(val?.[0]?.[0]?.trim()) &&
      (this.billFlag == 'A' || this.billFlag == 'C')
    ) {
      matCode?.enable();
      this.matCodeQC = `mat_level ='2' and mat_matgroup = '${val?.[0]?.[0]?.trim()}' and (mat_closedate IS NULL OR mat_closedate = '${
        commonConstant.coyCloseDate
      }')`;
    } else {
      matCode?.reset();
      matCode?.disable();
    }
  }

  get narrItems() {
    return this.qf.controls['narrItems'] as FormArray;
  }

  narrForm(): FormGroup {
    return this.fb.group({
      checked: false,
      srno: '',
      itemdesc: '',
    });
  }

  addNarr() {
    if (this.narrItems.valid) {
      this.narrToggle = false;
      this.addFocus('authType');
    }
  }

  get authD() {
    return this.qf.controls['authDRequestBeanList'] as FormArray;
  }

  authDForm(): FormGroup {
    return this.fb.group({
      suppbillno: ['', [Validators.required]],
      suppbilldt: ['', [Validators.required]],
      authamount: [0, [Validators.min(0)]],
      debitamt: [0, [Validators.min(0)]],
      authtdsamt: [0, [Validators.min(0)]],
      retainos: [0, [Validators.min(0)]],
      advadj: [0, [Validators.min(0)]],
      payamount: [0, [Validators.min(0)]],
      authqty: [0, [Validators.min(0)]],
      retainamt: [0, [Validators.min(0)]],
      retentionadj: [0, [Validators.min(0)]],
      billtype: [0, [Validators.min(0)]],
      ser: [0, [Validators.min(0)]],
      uom: [null, [Validators.min(0)]],
      relretamt: [0, [Validators.min(0)]],
      matcode: [null],
      omspurcyn: [''],
    });
  }

  get items() {
    return this.qf.controls['advrecvoucherRequestBeanList'] as FormArray;
  }

  itemForm(): FormGroup {
    return this.fb.group({
      hsnsaccode: ['', [Validators.required]],
      itemdesc: ['', [Validators.required]],
      amount: [0, [Validators.min(0)]],
      cgstamt: [0, [Validators.min(0)]],
      cgstperc: [0, [Validators.min(0)]],
      sgstamt: [0, [Validators.min(0)]],
      sgstperc: [0, [Validators.min(0)]],
      igstamt: [0, [Validators.min(0)]],
      igstperc: [0, [Validators.min(0)]],
      ugstamt: [0, [Validators.min(0)]],
      ugstperc: [0, [Validators.min(0)]],
    });
  }

  //add row in gst brkup
  addItem() {
    this.items.push(this.itemForm());
    this.watchForChanges();
  }

  //add row in gst brkup
  deleteItem(i: number) {
    this.items.removeAt(i);
    this.hsnsum();
    this.watchForChanges();
  }

  // subscribe to valuechanges in formArray
  watchForChanges() {
    // cleanup any prior subscriptions before re-establishing new ones
    this.changesUnsubscribe.next(null);

    merge(
      ...this.items.controls.map((control: AbstractControl, index: number) =>
        control.valueChanges.pipe(
          takeUntil(this.changesUnsubscribe),
          map((value) => ({ rowIndex: index, control: control, data: value }))
        )
      )
    ).subscribe((changes) => {
      this.getDescprition(changes);
      this.hsnsum();
    });
  }

  // setValue to hsn Code & description
  getDescprition(changes: any) {
    let hsn = this.items.controls[changes.rowIndex].get('hsnsaccode');

    // to avoid change loop, checked Object Type & length
    if (
      hsn?.value instanceof Object &&
      hsn.value[0] instanceof Object &&
      hsn.value[0]?.length != 1
    ) {
      this.items.controls[changes.rowIndex]
        .get('itemdesc')
        ?.setValue(hsn?.value[0]?.slice(1)[0], {
          emitEvent: false,
          onlySelf: true,
        });

      this.items.controls[changes.rowIndex]
        .get('hsnsaccode')
        ?.setValue(hsn?.value[0]?.slice(0, 1), {
          emitEvent: false,
          onlySelf: true,
        });

      this.getHsnTax(hsn, changes.rowIndex);
    }
  }

  getHsnTax(val: any, i: number) {
    let payload = {
      segment: commonConstant.segment.BLDG,
      adrPartySegment: commonConstant.segment.PARTY,
      adowner: this.qf.get('bldgCode')?.value?.[0]?.[0],
      adPartyType: commonConstant.AdType.LOC,
      adtype: commonConstant.AdType.LOC,
      hsncode: val?.value[0],
      partycode: this.qf.get('partyCode')?.value?.[0]?.[0],
      isUpdate: false,
      suppbilldt: moment(this.qf.get('authdate')?.value).format('DD/MM/YYYY'),
    };

    this._dynaPop.getGst(payload).subscribe({
      next: (res: any) => {
        this.items.controls[i]?.patchValue({
          cgstperc: res.data?.cgstperc ?? 0,
          sgstperc: res.data?.sgstperc ?? 0,
          igstperc: res.data?.igstperc ?? 0,
          ugstperc: res.data?.ugstperc ?? 0,
        });
        this.calcGST(i);
      },
    });
  }

  // calc total bill(hsn) & set in Advance Amt
  hsnsum() {
    let sum = 0;
    const hsnTable = this.qf.get('advrecvoucherRequestBeanList') as FormArray;
    const sumInput = ['amount', 'cgstamt', 'igstamt', 'sgstamt', 'ugstamt'];

    hsnTable.controls.forEach((control) => {
      Object.keys(control.value).forEach((key) => {
        sumInput.includes(key) ? (sum += control.value[key]) : '';
      });
      // console.log('sum', sum);
      this.qf.get('advgranted')?.setValue(parseFloat(sum.toFixed(2)));
    });
  }

  getInt(val: any, name: string) {
    return parseFloat(
      (val[name] > 0 ? (val[name] / 100) * val.amount : 0).toFixed(2)
    );
  }

  // calculate all gst in gst Brkup table on amt & gst percent change
  calcGST(i: number, name?: string) {
    let val = this.items.controls[i].value;
    let form = this.items.controls[i];

    if (val.amount > 0) {
      if (name) {
        switch (name) {
          case 'cgstperc':
            form.patchValue({
              cgstamt: this.getInt(val, 'cgstperc'),
            });
            break;
          case 'igstperc':
            form.patchValue({
              igstamt: this.getInt(val, 'igstperc'),
            });
            break;
          case 'sgstperc':
            form.patchValue({
              sgstamt: this.getInt(val, 'sgstperc'),
            });
            break;
          case 'ugstperc':
            form.patchValue({
              ugstamt: this.getInt(val, 'ugstperc'),
            });
            break;
        }
      } else {
        form.patchValue({
          cgstamt: this.getInt(val, 'cgstperc'),
          igstamt: this.getInt(val, 'igstperc'),
          sgstamt: this.getInt(val, 'sgstperc'),
          ugstamt: this.getInt(val, 'ugstperc'),
        });
      }
    }
  }

  // get narration items
  narr() {
    console.log('qf', this.qf.value);
    let matGrp = this.qf.get('matGrp');
    let bldgCode = this.qf.get('bldgCode');

    if (matGrp?.valid && bldgCode?.valid) {
      let payload = {
        matGrp: matGrp?.value[0][0],
        bldgCode: bldgCode?.value[0][0],
      };

      this.loaderToggle = true;
      this._material
        .getItems(payload)
        .pipe(
          take(1),
          finalize(() => (this.loaderToggle = false))
        )
        .subscribe({
          next: (res: any) => {
            if (res?.data?.length) {
              this.narrItems.clear();
              this.narrToggle = true;
              res.data.forEach((val: any, i: number) => {
                this.narrItems.push(
                  this.fb.group({
                    checked: i == 0 ? true : false,
                    srno: val.srno,
                    itemdesc: val.itemdesc,
                  })
                );
              });

              setTimeout(() => {
                this.addFocus('checkBox0');
              }, 50);
            } else {
              this.narrToggle = false;
              this.toastr.info(res?.message);
            }
          },
        });
    }
  }

  get authT() {
    return this.qf.get('authtype');
  }

  // get advance o/s amt
  getAdv() {
    let v = this.qf.getRawValue();
    let payload: any = {
      buildingCode: v.bldgCode?.[0]?.[0] ?? '',
      matGroup: v.matGrp?.[0]?.[0] ?? '',
      partyCode: v.partyCode?.[0]?.[0] ?? '',
    };

    if (v.advadj) payload['advanceAdjust'] = v.advadj;

    this._material
      .getAdvance(payload)
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          this.qf.patchValue({
            authamount: res.data ? parseFloat(res.data.toFixed(2)) : 0,
          });
        },
      });
  }

  // minus advance adjust from payamount
  patchPay(i: number) {
    if (
      this.authT?.value[0]?.[0]?.trim()?.toUpperCase() == 'N' &&
      this.qf.get('authamount')?.value > 0
    ) {
      const payVal = this.billDetails[i]?.payamount; // get inintal value of payamount
      const advAdj = this.authD.controls[i].get('advadj')?.value;
      this.authD.controls[i].patchValue({
        payamount: payVal - advAdj,
      });
      this.authD.updateValueAndValidity();
    }
  }

  save() {
    console.log('qureyform', this.qf);

    const authVal = this.authT?.value?.[0]?.[0]?.trim()?.toUpperCase();
    const hsnTable = this.qf.get('advrecvoucherRequestBeanList') as FormArray;

    switch (authVal) {
      case 'A':
        // Remove empty HSN row to avoid HSN required validation
        let indexToRemove: number[] = [];

        hsnTable.controls.forEach((control, index) => {
          if (!control.value.hsnsaccode) {
            indexToRemove.push(index);
          }
        });

        indexToRemove.reverse().forEach((index) => {
          hsnTable.removeAt(index);
        });

        this.hsnsum();
        break;
      case 'C':
        break;
      case 'N':
        break;
    }

    if (this.qf.valid) {
      let form = this.qf.getRawValue();

      // remove 'checked' key from object
      let sendNarr: { srno: string; itemdesc: string; matgroup: string }[] = [];
      this.narrItems.value?.forEach((val: any) => {
        let pushVal = {
          srno: val.srno,
          itemdesc: val.itemdesc,
          matgroup: form.matGrp?.[0]?.[0],
        };
        val.checked ? sendNarr.push(pushVal) : '';
      });

      let payload: any = {
        authHRequestBean: {
          partycode: form.partyCode?.[0]?.[0] ?? '',
          bldgcode: form.bldgCode?.[0]?.[0] ?? '',
          matgroup: form.matGrp?.[0]?.[0] ?? '',
          authtype: form.authtype?.[0]?.[0] ?? '',
          debsocyn: form.debsocyn?.[0]?.[0].trim() ?? '',
          authdate: moment(form.authdate).format('DD/MM/YYYY'),
          authamount: form.advgranted,
          advgranted: form.advgranted,
          payamount: form.advgranted,
          expenstype: form.expenstype?.toUpperCase(),
          preparedby: form.preparedby?.toUpperCase(),
          remarks: form.remarks,
          description: form.description,
          partycode2: form.advadj, // Added PartyCode2 as AdvAdj
        },
        authmatgroupnarrdtlRequestBeanList: sendNarr,
      };

      if (authVal == 'A') {
        // manipulate value for paylaod advrecvoucherRequestBeanList
        let item: any = form.advrecvoucherRequestBeanList.map(
          (val: any, i: number) => {
            val.itemdesc = val.itemdesc;
            val.hsnsaccode = val.hsnsaccode?.[0];
            val.profinvno = form.profinvno?.toUpperCase();
            val.bldgcode = form.bldgCode?.[0]?.[0] ?? '';
            val.matcertcode = form.matGrp?.[0]?.[0] ?? '';
            val.partycode = form.partyCode?.[0]?.[0] ?? '';
            val.authtype = form.authtype?.[0]?.[0] ?? '';
            val.authdate = moment(form.authdate).format('DD/MM/YYYY');
            val.profinvdt = moment(form.profinvdt).format('DD/MM/YYYY');
            val.lineno = i + 1;
            return val;
          }
        );

        payload['advrecvoucherRequestBeanList'] = item;
      }

      if (authVal == 'N' || authVal == 'L' || authVal == 'R') {
        let pa = payload.authHRequestBean;
        let billD = this.authD.getRawValue();
        console.log(billD);
        pa['totalBillamount'] = this.getsum(billD, 'authamount');
        pa['totalQuantity'] = this.getsum(billD, 'authqty');
        pa['totalTds'] = this.getsum(billD, 'authtdsamt');
        pa['totalAdvadjust'] = this.getsum(billD, 'advadj');
        pa['totalRetention'] = this.getsum(billD, 'retainamt');
        pa['totalRetAdvadjust'] = this.getsum(billD, 'retentionadj');
        pa['totalRelretamount'] = this.getsum(billD, 'relretamt');
        pa['totalPayamount'] = this.getsum(billD, 'payamount');
        pa['totalDebitamount'] = this.getsum(billD, 'debitamt');
        payload['authDRequestBeanList'] = billD;
      }

      // Added MatCode In Auth_H Request Bean And Auth_D Request bean list
      if (form.matCode?.[0]?.[0]) {
        payload.authHRequestBean['matcode'] = form.matCode?.[0]?.[0];
        if (authVal == 'N' || authVal == 'L' || authVal == 'R') {
          payload.authDRequestBeanList.forEach((val: any) => {
            val['matcode'] = form.matCode?.[0]?.[0];
          });
        }
      }
      console.log('payload', payload);

      //return;
      this.loaderToggle = true;
      this._material
        .addAdvance(payload)
        .pipe(
          finalize(() => {
            this.loaderToggle = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            console.log('resMat', res);

            if (res.status) {
              this.toastr.success(res.message, 'Success', {
                tapToDismiss: false,
                closeButton: true,
                timeOut: 10000,
              });

              this.reset();
            } else {
              this.toastr.error(
                res.message ?? 'Something went wrong',
                'Failed'
              );
            }
          },
        });
    } else {
      this.qf.markAllAsTouched();
    }
  }

  reset() {
    this.qf.reset({
      authtype: ['N    ', 'Normal                        '],
      authdate: moment(),
    });
    this.authD.clear();
    this.items.clear();
    this.paidBillsArr = [];
    this.billDetailsToggle = true;
    this.narrToggle = false;
    this.billsDisabled = true;
    this.billFlag = 'N';
    this.saveDisabled = true;
    this.addFocus('supp');
  }

  // add focus to elements by id
  addFocus(id: string) {
    this.renderer.selectRootElement(`#${id}`)?.focus();
  }

  // add focus to elements after it is rendered in DOM
  addFocusWithTimeOut(id: string) {
    setTimeout(() => {
      this.renderer.selectRootElement(`#${id}`)?.focus();
    }, 200);
  }

  add() {
    this.authD.clear();

    let addValid =
      this.qf.get('authtype')?.valid &&
      this.qf.get('bldgCode')?.valid &&
      this.qf.get('matGrp')?.valid &&
      this.qf.get('partyCode')?.valid &&
      this.qf.get('bills')?.valid;

    let f = this.qf.value;
    let payload = {
      authType: f.authtype?.[0]?.[0]?.trim(),
      bldgcode: f.bldgCode?.[0]?.[0]?.trim(),
      matgroup: f.matGrp?.[0]?.[0]?.trim(),
      partycode: f.partyCode?.[0]?.[0]?.trim(),
      suppbillno: f.bills,
    };

    if (addValid) {
      this._material
        .fetchBillDetail(payload)
        .pipe(
          take(1),
          finalize(() => (this.loaderToggle = false)),
          tap(() => (this.billsDisabled = true))
        )
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.billDetails = res.data;
              this.billsDisabled = false;
              this.authD.clear();
              // advance adjust validation & disable
              res.data.forEach((v: any, i: number) => {
                this.authD.push(this.authDForm());

                if (this.billFlag !== 'N') {
                  this.authD.controls[i].get('advadj')?.disable();
                  this.billFlag == 'R' || this.billFlag == 'L'
                    ? this.addFocusWithTimeOut('cell0-1') // focus on 1st row input
                    : '';
                } else if (this.billFlag == 'N') {
                  this.qf.getRawValue()?.authamount < 1
                    ? this.authD.controls[i].get('advadj')?.disable() // disable Advance adjust if Advance OS is less than 1
                    : this.addFocusWithTimeOut('cell0-2'); // focus on 1st row input
                }
              });

              this.qf.get('authDRequestBeanList')?.patchValue(res.data);

              res.message &&
                this.toastr.info(res.message, 'Info', {
                  timeOut: 8000,
                });
              let remarksArr: any = [];
              res.data.map((x: any) => {
                remarksArr.push(x.ser);
                this.qf.get('remarks')?.patchValue(remarksArr.join(','));
              });
              res?.extraData
                ? this.qf
                    .get('runningSer')
                    ?.patchValue(parseInt(res?.extraData))
                : this.qf.get('runningSer')?.patchValue(null);
              this.saveDisabled = false;

              this.qf.get('remarks')?.setValidators(Validators.required);
            } else {
              this.billDetails = [];
              this.billsDisabled = true;
              this.toastr.error(res.message ?? 'Somthing went wrong');
            }
          },
        });
    } else {
      this.qf.get('authtype')?.markAsTouched();
      this.qf.get('bldgCode')?.markAsTouched();
      this.qf.get('matGrp')?.markAsTouched();
      this.qf.get('partyCode')?.markAsTouched();
      this.qf.get('bills')?.markAsTouched();
    }
  }

  // get sum of any object property
  getsum(obj: any, prop: any) {
    let sum = obj?.reduce((acc: any, crr: any) => (acc += crr[prop]), 0);
    if (sum) {
      return sum;
    }
    return 0;
  }

  getPaidBill(e: any) {
    let f = this.qf.value;
    let sbn = f.bills instanceof Object && f.bills.length;
    let aT = f.authtype instanceof Object && f.authtype.length;
    let pc = this.qf.get('partyCode');
    let bc = this.qf.get('bldgCode');
    let mg = this.qf.get('matGrp');
    let payload: any = {
      bldgcode:
        f.bldgCode instanceof Object &&
        f?.bldgCode.length &&
        f?.bldgCode?.[0]?.[0],
      matgroup:
        f.matGrp instanceof Object && f?.matGrp.length && f?.matGrp?.[0]?.[0],
      partycode:
        f.partyCode instanceof Object &&
        f?.partyCode.length &&
        f?.partyCode?.[0]?.[0],
    };
    sbn && (payload.suppbillno = f.bills);
    aT && (payload.authType = f.authtype?.[0]?.[0]);

    if (pc?.valid && bc?.valid && mg?.valid) {
      this.billDetailsToggle = !this.billDetailsToggle;
      !this.billDetailsToggle && (this.loaderToggle = true);
      this.billDetailsToggle
        ? ((e.target.textContent = 'Paid Bills'),
          e.target.setAttribute('accesskey', 'p'))
        : ((e.target.textContent = 'Bills'),
          e.target.setAttribute('accesskey', 'b'));

      !this.billDetailsToggle &&
        this._material
          .fetchPaidBillDetail(payload)
          .pipe(
            take(1),
            finalize(() => (this.loaderToggle = false))
          )
          .subscribe({
            next: (res: any) => {
              if (res?.status) {
                this.paidBillsArr = res.data;
                this.paidBillsArr.length &&
                  this.paidBillsArr.map((res: any) => {
                    res.pblhSuppbilldt = moment(res?.pblhSuppbilldt).format(
                      'DD/MM/YYYY'
                    );
                  });
              } else {
                this.toastr.error(res.message);
                this.billDetailsToggle = !this.billDetailsToggle;
                this.billDetailsToggle
                  ? ((e.target.textContent = 'Paid Bills'),
                    e.target.setAttribute('accesskey', 'p'))
                  : ((e.target.textContent = 'Bills'),
                    e.target.setAttribute('accesskey', 'b'));
              }
            },
            error: (err: any) => {
              this.billDetailsToggle = !this.billDetailsToggle;
              this.billDetailsToggle
                ? ((e.target.textContent = 'Paid Bills'),
                  e.target.setAttribute('accesskey', 'p'))
                : ((e.target.textContent = 'Bills'),
                  e.target.setAttribute('accesskey', 'b'));
            },
          });
    } else {
      pc?.markAsTouched();
      bc?.markAsTouched();
      mg?.markAsTouched();
    }
  }

  updatePayAmt(index: number, formControl: FormControl) {
    let retailOS = this.authD.controls[index].value.retainos;
    let relRetAmt = this.authD.controls[index].value.relretamt;
    if (relRetAmt <= retailOS && relRetAmt >= 0) {
      formControl.setValue(this.authD.controls[index].value.relretamt);
    }
  }
}

export function formValidation() {
  return (group: AbstractControl) => {
    const partyCode = group.get('partyCode');
    const bldgCode = group.get('bldgCode');
    const matGrp = group.get('matGrp');
    const authtype = group.get('authtype');

    if (!partyCode || !bldgCode || !matGrp || !authtype) {
      return null;
    }

    // return if another validator has already found an error
    if (authtype?.['errors'] && !authtype?.['errors']?.['noPartyBldgMat']) {
      return null;
    }

    // set error on authtype if validation fails
    if (partyCode?.['value'] && bldgCode?.['value'] && matGrp?.['value']) {
      authtype!.setErrors(null);
    } else {
      authtype!.setErrors({ noPartyBldgMat: true });
    }

    return null;
  };
}

// type C Adv return amt cannot be greater than Adv OS amt
export function advReturn() {
  return (g: AbstractControl) => {
    let advReturnAmt = g.value ?? 0;
    let advOSAmt = g.root.get('authamount')?.value ?? 0;
    return advReturnAmt > advOSAmt ? { amtExceeds: true } : null;
  };
}

//atleast 1 narration checked validation
export function validationNarr() {
  return (group: AbstractControl) => {
    let grpExt = group.value?.length;
    // if formgroup does not exists
    if (!grpExt) {
      return null;
    }

    // set error on narr
    let check1 = group.value.some((val: any) => {
      return val.checked == true;
    });
    if (!check1) {
      return { noNarr: true };
    }

    // not more than 5
    let exdLen = group.value.reduce(
      (acc: any, crr: any) => (crr.checked ? acc + 1 : acc),
      0
    );

    return exdLen > 5 ? { exceedLength: true } : null;
  };
}

// Bill Details Validations
export function validationAuthD() {
  return (_g: AbstractControl) => {
    let g = _g.value;
    let at = _g.root.get('authtype')?.value?.[0]?.[0]?.trim();
    let advOs = _g.root.get('authamount')?.getRawValue();
    const negZero = { NegAmt: true, errMsg: 'Less than 1 not allowed' };
    const exceed = { retentionExceeds: true, errMsg: 'Exceeds Retention Amt' };

    g.length &&
      g.map((e: any, i: any) => {
        if (
          (at == 'L' && e?.relretamt > e?.retainos) ||
          (at == 'R' && e?.retentionadj > e?.retainos)
        ) {
          at == 'L' &&
            _g instanceof FormArray &&
            _g.controls[i].get('relretamt')?.setErrors(exceed);
          at == 'R' &&
            _g instanceof FormArray &&
            _g.controls[i].get('retentionadj')?.setErrors(exceed);
        }
        if (
          (at == 'L' && e?.relretamt <= 0) ||
          (at == 'R' && e?.retentionadj <= 0) ||
          (at == 'N' && e?.advadj < 0)
        ) {
          at == 'L' &&
            _g instanceof FormArray &&
            _g.controls[i].get('relretamt')?.setErrors(negZero);

          at == 'R' &&
            _g instanceof FormArray &&
            _g.controls[i].get('retentionadj')?.setErrors(negZero);

          at == 'N' &&
            _g instanceof FormArray &&
            _g.controls[i].get('advadj')?.setErrors(negZero);
        }

        // advance adj validation for authtpye N
        // 1. cannot be less than zero
        if (at == 'N' && advOs > 0) {
          if (advOs > 0 && _g instanceof FormArray) {
            // 2. cannot be more than bill amt
            if (e.authamount < e.advadj) {
              _g.controls[i].get('advadj')?.setErrors({
                exceedsBillAmount: true,
              });
            }

            let sum = _g.value?.reduce(
              (acc: any, crr: any) => (acc += crr['advadj']),
              0
            );

            // 3. sum cannot be more than Adv O/S
            if (sum > advOs) {
              _g.controls[i].get('advadj')?.setErrors({
                exceedsSum: true,
              });
            }
          }
          console.log('_g', _g.status);
        }
        if (at == 'N' && _g instanceof FormArray) {
          _g.controls[i].get('advadj')?.value ??
            _g.controls[i].get('advadj')?.patchValue(0);
        }
      });
    return null;
  };
}
