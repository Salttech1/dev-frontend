import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { finalize, take, tap } from 'rxjs';
import { DataEntryService } from 'src/app/services/purch/data-entry.service';

@Component({
  selector: 'app-purchase-bill-adjustment',
  templateUrl: './purchase-bill-adjustment.component.html',
  styleUrls: ['./purchase-bill-adjustment.component.css'],
})
export class PurchaseBillAdjustmentComponent implements OnInit {
  loaderToggle: boolean = false;
  disabledFlagRetrieve: boolean = false;
  disabledFlagBack: boolean = true;
  disabledFlagSave: boolean = true;
  entryTableData: any = [];
  navTab: string = 'itemGSTBreakUpDetails';

  purchaseBillAdjustment = new FormGroup({
    entry: new FormControl<string[]>([], Validators.required),
    partycode: new FormControl<string[]>([], Validators.required),
    coy: new FormControl<string | null>(
      { value: '', disabled: true },
      Validators.required
    ),
    bldgcode: new FormControl<string | null>(
      { value: '', disabled: true },
      Validators.required
    ),
    billtype: new FormControl({ value: '', disabled: true }),
    suppbill: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    suppBillDate: new FormControl({ value: '', disabled: true }),
    amount: new FormControl({ value: 0, disabled: true }, Validators.required),
    retention: new FormControl({ value: '0', disabled: true }),
    tdsperc: new FormControl({ value: '', disabled: true }),
    tdsamt: new FormControl({ value: '', disabled: true }),
    naration: new FormControl({ value: '', disabled: true }),
    partyGst: new FormControl({ value: '', disabled: true }),
    state: new FormControl({ value: '', disabled: true }),
    debitType: new FormControl({ value: '', disabled: true }),
    ceIndent: new FormControl({ value: '', disabled: true }),
    material: new FormControl<string | null>({ value: '', disabled: true }),
    level2: new FormControl({ value: '', disabled: true }),
    uom: new FormControl({ value: '', disabled: true }),
    quantity: new FormControl({ value: '0', disabled: true }),
    itemRate: new FormControl({ value: '', disabled: true }),
    value: new FormControl({ value: '', disabled: true }),
    tcsAmt: new FormControl({ value: '', disabled: true }),
    challan: new FormArray([]),
    itemDetailBreakUp: new FormArray([]),
  });

  fetchedPurchaseBill: any = false;
  addressFetchData: any;
  partySubId = `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '01/JAN/2050')`;
  billSubId = '';
  billTypeList: any;

  @ViewChild('partycode') partycode: ElementRef | undefined;

  constructor(
    private fb: FormBuilder,
    private _dataEntry: DataEntryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.purchaseBillAdjustment
      .get('partycode')
      ?.valueChanges.pipe(
        tap(() => {
          console.log('Tapval', this.purchaseBillAdjustment.get('partycode'));
          console.log(
            'party valid',
            this.purchaseBillAdjustment.controls['partycode']?.valid
          );
        })
      )
      .subscribe({
        next: (res: any) => {
          if (this.purchaseBillAdjustment.get('partycode')?.valid) {
            let party = res?.[0];
            if (party instanceof Object) {
              this.billSubId = `PBLH_PARTYCODE='${party[0]}'`;
            } else {
              this.billSubId = '';
            }
          } else {
            this.billSubId = '';
          }
        },
      });

    this.purchaseBillAdjustment.get('partycode')?.statusChanges.subscribe({
      next: (val) => {
        if (val == 'VALID') {
          // let party = this.purchaseBillAdjustment.get('partycode')?.value[0][0];
          // this.billSubId = `PBLH_PARTYCODE='${party}'`;
        } else {
          // this.partySubId = '';
          this.billSubId = '';
        }
        console.log('partyvalid', val);
      },
    });

    this.getBillType();
  }

  retrieve() {
    let entryVal = this.purchaseBillAdjustment.value.entry;
    if (entryVal?.length && this.purchaseBillAdjustment.get('entry')?.valid) {
      // MEHT B000237887 9ELT B000237868
      this.loaderToggle = true;

      let val = entryVal instanceof Object ? entryVal[0]?.[0] : entryVal;

      // return;
      this._dataEntry
        .fetchPurchaseBill(val, false)
        .pipe(
          take(1),
          finalize(() => (this.loaderToggle = false))
        )
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.fetchedPurchaseBill = res.data;
              this.setFetchedApiData(res.data);
              this.purchaseBillAdjustment.disable();
              this.setBillType();
            } else {
              this.toastr.error(res.message);
            }
          },
        });
    } else {
      this.purchaseBillAdjustment.markAsTouched();
    }
  }

  save() {
    let param: any = this.purchaseBillAdjustment.get('entry')?.value?.[0]?.[0];
    this._dataEntry
      .updatePurchBillAdjustement(param)
      .pipe(take(1))
      .subscribe(() => {
        this.toastr.success('Updated Successfully');
        this.back()
      });
  }

  setBillType() {
    let billVal = this.purchaseBillAdjustment.controls['billtype'];
    this.billTypeList.filter((val: any) => {
      val.id?.trim() == billVal.value?.trim()
        ? billVal.setValue(Object.values(val)?.toString())
        : billVal.setValue(billVal.value);
    });
  }

  getBillType() {
    this._dataEntry.getBillTypeList().subscribe({
      next: (res: any) => {
        if (res?.status) {
          this.billTypeList = res?.data;
        }
      },
    });
  }

  setFetchedApiData(val: any) {
    this.purchaseBillAdjustment.patchValue({
      coy: val?.coy?.trim(),
      amount: val?.amount,
      billtype: val?.billtype,
      bldgcode: val?.bldgcode?.trim(),
      partycode: val?.partycode?.trim(),
      suppBillDate: moment(val?.suppbilldt, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      retention: val?.retention,
      tdsperc: val?.tdsperc,
      tdsamt: val?.tdsamount,
      naration: val?.narration?.trim(),
      material: val?.pbillvatResponseBean[0]?.matgroup?.trim(),
      quantity: val?.pbilldResponseBean?.quantity,
      tcsAmt: val?.tcsamount,
      value: val?.amount,
      itemRate: val?.pbilldResponseBean?.derate,
      ceIndent: val?.pbilldResponseBean?.ceser?.trim(),
      debitType: val?.debsocyn?.trim(),
      uom: val?.pbilldResponseBean?.uom?.trim(),
      suppbill: val?.pbilldResponseBean?.suppbillno?.trim(),
      level2: val?.pbilldResponseBean?.matcode?.trim(),
      state: val?.addressResponseBean?.state?.trim(),
      partyGst: val?.partyResponseBean?.gstno?.trim(),
    });

    // patch challan
    this.challanFormArr.clear();
    val?.dcResponseBean?.forEach((v: any) =>
      this.challanFormArr.push(
        this.fb.group({
          dcno: v?.dcno,
          site: v?.site,
          userid: v?.userid,
          dcdate: moment(v.dcdate, ' DD/MM/YYYY'),
          entryno: v?.entryno,
          suppbill: v?.suppbill,
          suppcode: v?.suppcode,
          billdt: v?.billdt,
        })
      )
    );

    // patch Items
    this.itemBreakUpFormArr.clear();
    val?.pbillvatResponseBean?.forEach((v: any) => {
      this.itemBreakUpFormArr.push(this.itemDetailInitRows());
    });
    this.itemBreakUpFormArr?.patchValue(val?.pbillvatResponseBean);
  }

  get challanFormArr() {
    return this.purchaseBillAdjustment.get('challan') as FormArray;
  }

  get itemBreakUpFormArr() {
    return this.purchaseBillAdjustment.get('itemDetailBreakUp') as FormArray;
  }

  itemDetailInitRows() {
    return this.fb.group({
      lineno: [{ value: '1', disabled: true }],
      amount: [{ value: '0', disabled: true }],
      cgstamt: [{ value: '0', disabled: true }],
      cgstperc: [{ value: '0', disabled: true }],
      discountamt: [{ value: '0', disabled: true }],
      fotoamt: [{ value: '0', disabled: true }],
      hsncode: null,
      hsndesc: [{ value: '', disabled: true }],
      igstamt: [{ value: '0', disabled: true }],
      igstperc: [{ value: '0', disabled: true }],
      sgstamt: [{ value: '0', disabled: true }],
      sgstperc: [{ value: '0', disabled: true }],
      site: [{ value: '0', disabled: true }],
      taxableamt: [{ value: '0', disabled: true }],
      ugstamt: [{ value: '0', disabled: true }],
      ugstperc: [{ value: '0', disabled: true }],
      vatamount: [{ value: '0', disabled: true }],
      vatpercent: [{ value: '0', disabled: true }],
      matgroup: null,
    });
  }

  back() {
    this.purchaseBillAdjustment.controls['partycode'].enable();
    this.purchaseBillAdjustment.controls['entry'].enable();
    this.purchaseBillAdjustment.reset();
    this.billSubId = ''; // reset to avoid going in next bill entry dynapop queryConditon
    this.fetchedPurchaseBill = false;
    this.partycode?.nativeElement.focus();
  }
}
