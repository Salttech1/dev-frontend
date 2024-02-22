import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { error } from 'jquery';

import * as moment from 'moment';
import { finalize, Observable, Subject, take } from 'rxjs';
import { PurchService } from 'src/app/services/purch/purch.service';

@Component({
  selector: 'app-bill-details-enquires',
  templateUrl: './bill-details-enquires.component.html',
  styleUrls: ['./bill-details-enquires.component.css'],
})
export class BillDetailsEnquiresComponent implements OnInit {
  queryForm: FormGroup = new FormGroup({
    name: new FormControl<string>('Bill'),
    billNo: new FormControl<string[]>({ value: [], disabled: true }),
    challanNo: new FormControl<string[]>({ value: [], disabled: true }),
    challanDate: new FormControl<string>(''),
    matGroup: new FormControl<string[]>([]),
    matCode: new FormControl<string[]>({ value: [], disabled: true }),
    itemCode: new FormControl<string[]>({ value: [], disabled: true }),
    suppCode: new FormControl<string[]>([], Validators.required),
  });

  loaderToggle: boolean = false;
  formName!: string;
  disableRetrieve: boolean = false;
  suppCodeId: string = '';
  @ViewChild('billDetailsForm') billDetailsForm!: NgForm;

  vatDetail: any = [];
  billDebitNoteDetail: any = [];
  billChallanDetail: any = [];
  challanDetail: any = [];
  itemDetail: any = [];
  subMatGrp: string = '';
  subMatCode: string = '';

  constructor(private _purch: PurchService, private renderer: Renderer2) {}
  ngOnInit(): void {
    this.queryForm.get('suppCode')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res?.length) {
          let party = res[0][0] ?? '';
          let radio = this.queryForm.get('name')?.value;

          switch (radio) {
            case 'Bill': {
              this.suppCodeId = `PBLH_PARTYCODE='${party}'`;
              break;
            }
            case 'Bill-Challan': {
              this.suppCodeId = `PBLH_PARTYCODE='${party}'`;
              break;
            }
            case 'Challan': {
              this.suppCodeId = `DCP_SUPPCODE='${party}'`;
              break;
            }

            default: {
              this.suppCodeId = '';
            }
          }

          if (res[0] instanceof Object) {
            this.queryForm.controls['billNo'].enable();
            this.queryForm.controls['challanNo'].enable();
          }
        } else {
          this.queryForm.controls['billNo'].disable();
          this.queryForm.controls['challanNo'].disable();
        }
      },
    });

    this.queryForm.get('name')?.valueChanges.subscribe({
      next: (val) => {
        console.log('radio', val);
        this.queryForm.get('billNo')?.reset();
        this.queryForm.get('challanNo')?.reset();
        this.queryForm.get('challanDate')?.reset();
        this.queryForm.get('matGroup')?.reset();
        this.queryForm.get('matCode')?.reset();
        this.queryForm.get('itemCode')?.reset();
        this.queryForm.get('suppCode')?.reset();

        this.billDebitNoteDetail = [];
        this.vatDetail = [];
        this.billChallanDetail = [];
        this.challanDetail = [];
        this.itemDetail = [];

        switch (val) {
          case 'Bill-Challan':
          case 'Bill':
            this.queryForm.get('billNo')?.setValidators(Validators.required);
            this.queryForm.get('suppCode')?.setValidators(Validators.required);
            this.queryForm.get('challanNo')?.clearValidators();
            this.queryForm.get('matGroup')?.clearValidators();
            this.queryForm.updateValueAndValidity();
            break;
          case 'Challan':
            this.queryForm.get('billNo')?.clearValidators();
            this.queryForm.get('suppCode')?.setValidators(Validators.required);
            this.queryForm.get('matGroup')?.clearValidators();
            this.queryForm.get('challanNo')?.setValidators(Validators.required);
            this.queryForm.updateValueAndValidity();
            break;
          case 'Item':
            this.queryForm.get('billNo')?.clearValidators();
            this.queryForm.get('suppCode')?.clearValidators();
            this.queryForm.get('challanNo')?.clearValidators();
            this.queryForm.get('matGroup')?.setValidators(Validators.required);
            this.queryForm.updateValueAndValidity();
        }
      },
    });

    const mtGrp = this.queryForm.controls['matGroup']?.valueChanges;
    const mtCode = this.queryForm.controls['matCode']?.valueChanges;

    mtGrp.subscribe({
      next: (val) => {
        if (val instanceof Object) {
          let mat = val[0][0] ?? '';
          this.subMatGrp = `mat_matgroup = '${mat}'`;
          this.queryForm.controls['matCode'].enable();
        } else {
          this.queryForm.controls['matCode'].disable();
        }
        this.itemDetail = [];
        this.queryForm.controls['matCode'].setValue('');
        this.queryForm.controls['itemCode'].setValue('');
        this.queryForm.controls['itemCode'].disable();
      },
    });

    mtCode.subscribe({
      next: (val) => {
        if (val instanceof Object && val.length) {
          let mat = val[0][0] ?? '';
          let matGp = this.queryForm.get('matGroup')?.value;
          matGp = matGp ? matGp[0][0] : '';
          if (matGp) {
            this.subMatCode = `MAT_MATGROUP = '${matGp}' AND MAT_MATCODE = '${mat}'`;
          } else {
            this.subMatCode = '';
          }
          this.queryForm.controls['itemCode'].enable();
        } else {
          this.queryForm.controls['itemCode'].disable();
        }
        this.itemDetail = [];
        this.queryForm.controls['itemCode'].setValue('');
      },
    });
  }

  getReport(print: boolean) {
    console.log('queryForm', this.queryForm);

    if (this.queryForm.valid) {
      this.disableRetrieve = true;
      let payLoad = {
        radioButton: this.queryForm.get('name')?.value,
        suppCode: this.queryForm.get('suppCode')?.value?.length
          ? this.queryForm.get('suppCode')?.value[0][0] ?? ''
          : '',
        billNo: this.queryForm.get('billNo')?.value?.length
          ? this.queryForm.get('billNo')?.value[0][0] ?? ''
          : '',
        challanNo: this.queryForm.get('challanNo')?.value?.length
          ? this.queryForm.get('challanNo')?.value[0][0] ?? ''
          : '',
        itemCode: this.queryForm.get('itemCode')?.value?.length
          ? this.queryForm.get('itemCode')?.value[0][0] ?? ''
          : '',
        matCode: this.queryForm.get('matCode')?.value?.length
          ? this.queryForm.get('matCode')?.value[0][0] ?? ''
          : '',
        matGroup: this.queryForm.get('matGroup')?.value?.length
          ? this.queryForm.get('matGroup')?.value[0][0] ?? ''
          : '',
      };
      this.loaderToggle = true;
      this._purch
        .getBilldetails(payLoad)
        .pipe(
          take(1),
          finalize(() => {
            this.loaderToggle = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            console.log('res', res);
            let radio = this.queryForm.get('name')?.value;

            if (radio == 'Bill') {
              let val = res?.data?.billDetailEnquiryResponseBean;

              this.billDetailsForm?.setValue({
                bldgName: val?.bldgName ?? '',
                partyName: val?.partyName ?? '',
                coyName: val?.coyName ?? '',
                suppbilldt: moment(val?.suppbilldt).format('DD/MM/YYYY') ?? '',
                grpName: val?.grpName ?? '',
                quantity: val?.quantity ?? '',
                amount: val?.amount ?? '',
                retention: val?.retention ?? '',
                ser: val?.ser ?? '',
                authnum: val?.authnum ?? '',
                ceser: val?.ceser ?? '',
                suppbillno: val?.suppbillno ?? '',
                billtype: val?.billtype ?? '',
                uom: val?.uom ?? '',
                rate: val?.rate ?? '',
                advanceadj: val?.advanceadj ?? '',
                authdate: moment(val?.authdate).format('DD/MM/YYYY') ?? '',
                bankcode: val?.bankcode ?? '',
                datePaid: val?.datePaid ?? '',
                paidAmt: val?.paidAmt ?? '',
                chequeno: val?.chequeno ?? '',
                paidref: val?.paidref ?? '',
                tdschalno: val?.tdschalno ?? '',
                tdschaldt: val?.tdschaldt ?? '',
                tdsbankcode: val?.tdsbankcode ?? '',
                tdcertdt: val?.tdcertdt ?? '',
                hundnum: val?.hundnum ?? '',
                hundpartycode: val?.hundpartycode ?? '',
                hundpartytype: val?.hundpartytype ?? '',
                hunddocnum: val?.hunddocnum ?? '',
                hunddoctser: val?.hunddoctser ?? '',
                hundpayamt: val?.hundpayamt ?? '',
                hundbank: val?.hundbank ?? '',
                coyNamehundi: val?.coyNamehundi ?? '',
              });

              this.vatDetail = val?.vatDetailResponseBean ?? [];
              this.billDebitNoteDetail =
                val?.billDebitNoteDetailResponseBean ?? [];
            } else if (radio == 'Bill-Challan') {
              this.billChallanDetail =
                res?.data?.billChallanDetailResponseBeanList ?? [];
            } else if (radio == 'Challan') {
              this.challanDetail =
                res?.data?.billChallanDetailResponseBeanList ?? [];

              this.queryForm.controls['challanDate'].setValue(
                moment(this.challanDetail[0]?.dcdate).format('DD/MM/yyyy')
              );
            } else if (radio == 'Item') {
              this.itemDetail = res?.data?.itemRateDetailResponseBeanList ?? [];

              // this.dtElement?.dtInstance?.then((dtInstance: DataTables.Api) => {
              //   dtInstance.destroy(true);
              // });

              // this.dtOptions = {
              //   destroy: true,
              //   pagingType: 'simple_numbers',
              //   lengthChange: false,
              //   ordering: false,
              //   scrollY: '40vh',
              //   scrollCollapse: false,
              //   columns: [
              //     {
              //       title: 'Party',
              //       data: 'partyName',
              //     },
              //     {
              //       title: 'Order Date',
              //       data: 'date',
              //     },
              //     {
              //       title: 'Rate',
              //       data: 'rate',
              //     },
              //     {
              //       title: 'Sales Tax %',
              //       data: 'stper',
              //     },
              //     {
              //       title: 'Excise %',
              //       data: 'exciseper',
              //     },
              //     {
              //       title: 'Discount %',
              //       data: 'discper',
              //     },
              //   ],
              //   data: this.itemDetail,
              // };

              // this.dtTrigger.next(this.dtOptions);
            }
          },
          error:(error:any) => {
            this.disableRetrieve = false;
          }
        });
    } else {
      this.queryForm.markAllAsTouched();
    }
  }
  addFocusWithTimeOut(id: string) {
    setTimeout(() => {
      let focusElement3 = document.getElementById(id) as HTMLElement;
      this.renderer.selectRootElement(focusElement3).focus();
    }, 200);
  }

  handleBackClick(){
    this.disableRetrieve = false;
    this.queryForm.get('name')?.setValue('Bill');
    this.billDetailsForm?.reset();
    this.addFocusWithTimeOut('supplierCode');
  }
}
