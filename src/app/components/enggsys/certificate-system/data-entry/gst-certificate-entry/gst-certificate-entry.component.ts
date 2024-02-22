import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { take } from 'rxjs';
import { CertificateService } from 'src/app/services/enggsys/certificate.service';

@Component({
  selector: 'app-gst-certificate-entry',
  templateUrl: './gst-certificate-entry.component.html',
  styleUrls: ['./gst-certificate-entry.component.css'],
})
export class GstCertificateEntryComponent implements OnInit {
  qf: FormGroup = this.fb.group({
    demo: '',
    narrItems: this.fb.array([]),
    prev: this.fb.group({
      from: null,
      to: null,
    }),
    duration: this.fb.group({
      from: null,
      to: null,
    }),
    asstax: this.fb.group({
      from: null,
      to: null,
    }),
    advAdjusted: '',
    asstaxFrom: '',
    asstaxUpto: '',
    basicAmt: '',
    billAmount: '',
    billRef: '',
    bldgCode: '',
    buildingName: [{ value: '', disabled: true }],
    certAmount: '',
    certDate: '',
    certNum: '',
    certStatus: '',
    certType: '',
    cfCode: '',
    cfgGroup: '',
    cgstAmt: '',
    city: [{ value: '', disabled: true }],
    cityName: '',
    company: [{ value: '', disabled: true }],
    conAmount: '',
    contract: '',
    coy: '',
    debit: '',
    debitingParty: '',
    debitingReason: '',
    debSocYN: '',
    description: '',
    domain: '',
    durFrom: '',
    durTo: '',
    equipId: '',
    igstAmt: '',
    krishiCessAmt: '',
    krishiCessPerc: '',
    mainMatGroup: '',
    mainParty: '',
    mainRecId: '',
    mwctaxAmount: '',
    originator: '',
    partyCode: '',
    partyName: [{ value: '', disabled: true }],
    partyType: '',
    payAmount: '',
    panNo: [{ value: '', disabled: true }],
    payLocalDateTime: '',
    payRef: '',
    payTender: '',
    perDone: '',
    project: '',
    projectName: [{ value: '', disabled: true }],
    prop: '',
    proprietor: [{ value: '', disabled: true }],
    remarks: '',
    retained: '',
    revNum: '',
    runSer: '',
    serviceTaxAmt: '',
    serviceTaxPerc: '',
    sgstAmt: '',
    socId: '',
    swachhCessAmt: '',
    swachhCessPerc: '',
    taxLevel: '',
    tdsAmount: '',
    tdsSur: '',
    tPayment: '',
    transer: '',
    trips: '',
    ugstAmt: '',
    vatAmt: '',
    vatPerc: '',
    wing: '',
    workCode: '',
    workGroup: '',
    workName: [{ value: '', disabled: true }],
  });
  loaderToggle: boolean = false;
  bills: boolean = false;
  narration: boolean = false;
  certQueryCon = '';
  billQueryCon = '';

  constructor(
    private fb: FormBuilder,
    private _cert: CertificateService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.addFocus('recId');
    this.recIdChange();
  }

  // subcribe to value change in RecId
  recIdChange() {
    this.qf.get('contract')?.valueChanges.subscribe((val) => {
      console.log('contract', val);

      if (val instanceof Object) {
        // get last cert num by rec id
        this.getCertByRec(val[0]);

        // build queryCondition/subId for billNo.
        this.billQueryCon = `CBLH_CONTRACT = '${val[0]}'`;
        this.certQueryCon = `cert_contract = '${val[0]}'`;
      } else {
        this.billQueryCon = '';
        this.certQueryCon = '';
      }
    });
  }

  showBill() {
    this.bills = !this.bills;
  }

  showNarration() {
    this.narration = !this.narration;
  }

  retrieve() {
    console.log('num', this.qf.get('certNum')?.value);

    this._cert
      .getCertByNum(this.qf.get('certNum')?.value[0][0])
      .pipe(take(1))
      .subscribe((res: any) => {
        console.log('res', res);
        const {
          certificateDetailBean = '',
          certworknarrdtlResponseBeanList = [],
        } = {
          ...res.data,
        };

        this.qf.patchValue({
          ...certificateDetailBean,
          duration: {
            from: moment(certificateDetailBean.durFrom, 'YYYY-MM-DD'),
            to: moment(certificateDetailBean.durTo, 'YYYY-MM-DD'),
          },
          asstax: {
            from: moment(certificateDetailBean.asstaxFrom, 'YYYY-MM-DD'),
            to: moment(certificateDetailBean.asstaxUpto, 'YYYY-MM-DD'),
          },
        });

        certworknarrdtlResponseBeanList.forEach((val: any) => {
          this.narrItems.push(
            this.fb.group({
              checked: true,
              srno: val.srno,
              itemdesc: val.itemdesc,
            })
          );
        });

        this.narration = true;
      });
  }

  getCertByRec(rec: string) {
    this._cert.getCertByRec(rec).subscribe((res: any) => {
      console.log('certByRec', res);
      this.qf.get('certNum')?.setValue(res.data);
    });
  }

  get narrItems() {
    return this.qf.controls['narrItems'] as FormArray;
  }

  // add focus to elements by id
  addFocus(id: string) {
    this.renderer.selectRootElement(`#${id}`)?.focus();
  }
}
