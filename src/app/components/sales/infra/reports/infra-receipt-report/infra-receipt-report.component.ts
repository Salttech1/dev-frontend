import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';

import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import * as moment from 'moment';
import { finalize, switchMap, take } from 'rxjs';
import { SalesService } from 'src/app/services/sales/sales.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { Router } from '@angular/router';
import { DynapopService } from 'src/app/services/dynapop.service';
import * as commonConstant from '../../../../../../constants/commonconstant';

@Component({
  selector: 'app-infra-receipt-report',
  templateUrl: './infra-receipt-report.component.html',
  styleUrls: ['./infra-receipt-report.component.css']
})
export class InfraReceiptReportComponent implements OnInit {
  queryForm: FormGroup = new FormGroup(
    {
      exportType: new FormControl('PDF'),
      name: new FormControl<string>(
        'RptNormalInfraReceipt.rpt',
        Validators.required
      ),
      bldgcode: new FormControl<string[]>([], [Validators.required]),
      wing: new FormControl<string[]>([]),
      flatNum: new FormControl<string[]>([]),
      recnum: new FormControl<string[]>([]),
    },
    { validators: all() }
  );

  loaderToggle: boolean = false;
  formName!: string;
  url!: string;
  auxi_inap!: string;
  ownerid!: string;
  HeaderText1!: string;
  HeaderText2!: string;
  HeaderText3!: string;
  receiptType!: string;
  UsrLabel2!: string;
  bldgCodeFilter = '';
  bldgCodeWingFilter = '';
  bldgCodeWingFlatFilter = '';

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    private _sales: SalesService,
    public _service: ServiceService,
    private router: Router,
    private _dynapop: DynapopService
  ) {}

  ngOnInit(): void {
    this.url =
      this.router.url.split('/')[this.router.url.split('/').length - 1];
    console.log('URL I', this.url);
    //     setTimeout(() => {
    //       this.url == 'auxidefaultersreport' ? this.queryForm.patchValue({auxi_inap: 'AUXI'}) : this.queryForm.patchValue({auxi_inap: 'INAP'})
    // }, 10);
    //this.url == 'auxidefaultersreport' ? this.queryForm.patchValue({auxi_inap: 'AUXI'}) : this.queryForm.patchValue({auxi_inap: 'INAP'})
    this.url == 'infrareceiptreprintnormal'
      ? (this.auxi_inap = 'INAP')
      : (this.auxi_inap = 'AUXI');
      this.url == 'infrareceiptreprintfirst'
      ? (this.auxi_inap = 'INAP')
      : (this.auxi_inap = 'AUXI');
      this.url == 'auxiliaryreceiptreportfirst'
      ? (this.auxi_inap = 'AUXI')
      : (this.auxi_inap = 'INAP');
      this.url == 'auxiliaryreceiptreportnormal'
      ? (this.auxi_inap = 'AUXI')
      : (this.auxi_inap = 'INAP');
      
      this.HeaderText1 = 'HeaderText1';
      this.HeaderText2 = 'HeaderText2';
      this.HeaderText3 = 'HeaderText3';
      this.url == 'infrareceiptreprintnormal'
      ? (this.receiptType = 'N')
      : (this.receiptType = 'F');
      this.url == 'infrareceiptreprintfirst'
      ? (this.receiptType = 'F')
      : (this.receiptType = 'N');
      this.url == 'auxiliaryreceiptreportfirst'
      ? (this.receiptType = 'F')
      : (this.receiptType = 'N');
      this.url == 'auxiliaryreceiptreportnormal'
      ? (this.receiptType = 'N')
      : (this.receiptType = 'F');


      this.url == 'infrareceiptreprintnormal'
      ? (this.UsrLabel2 = 'NORMAL INFRA')
      : (this.UsrLabel2 = 'FIRST INFRA');
      this.url == 'infrareceiptreprintfirst'
      ? (this.UsrLabel2 = 'FIRST INFRA')
      : (this.UsrLabel2 = 'NORMAL INFRA');
      this.url == 'auxiliaryreceiptreportfirst'
      ? (this.UsrLabel2 = 'FIRST AUXILIARY')
      : (this.UsrLabel2 = 'NORMAL AUXILIARY');
      this.url == 'auxiliaryreceiptreportnormal'
      ? (this.UsrLabel2 = 'NORMAL AUXILIARY')
      : (this.UsrLabel2 = 'FIRST AUXILIARY');

      // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = val.formName;
      },
    });

    this.queryForm.get('bldgcode')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          let bldg = res;
          this.bldgCodeFilter = `FLAT_bldgcode IN ('${bldg.join("','")}')`;
          this.bldgCodeWingFilter = `FLAT_bldgcode IN ('${bldg.join(
            "','"
          )}') AND flat_wing `;
          this.bldgCodeWingFlatFilter = `inf_bldgcode IN ('${bldg.join(
            "','"
          )}') AND inf_wing `;
          this.ownerid = `${bldg.join(
            ""
          )}`;
          this.ownerid = `${bldg.join(
            ""
          )}`;
        }
      },
    });

    this.queryForm.get('wing')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          let wings = res;
          this.bldgCodeWingFilter =
            this.bldgCodeWingFilter + ` IN ('${wings.join("','")}')`;
            this.bldgCodeWingFlatFilter =
            this.bldgCodeWingFlatFilter + ` IN ('${wings.join(
              "','"
              )}') AND inf_flatnum `;
              this.ownerid = this.ownerid.trim();
              this.ownerid =
              this.ownerid + `${wings.join(
                ""
                )}`;
          }
        console.log('CC1', this.bldgCodeWingFlatFilter);
      },
    });

    this.queryForm.get('flatNum')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          console.log('CC2', this.bldgCodeWingFlatFilter);
          let flats = res;
            this.bldgCodeWingFlatFilter =
            this.bldgCodeWingFlatFilter + ` IN ('${flats.join("','")}')`;
            this.ownerid = this.ownerid.trim();
            this.ownerid =
            this.ownerid + `${flats.join("")}`;
        }
      },
    });
  }
  
  getReport(print: Boolean) {
    if (this.queryForm.valid) {
      if (
        this._service.printExcelChk(
          print,
          this.queryForm.get('exportType')?.value
        )
      ) {
        let payload: any = {
          name: this.queryForm.get('name')?.value,
          exportType: this.queryForm.get('exportType')?.value,
          isPrint: false,
          seqId: 1,
          reportParameters: {
            // HeaderText1: `'${this.HeaderText1}'`,
            // HeaderText2: `'${this.HeaderText2}'`,
            // HeaderText3: `'${this.HeaderText3}'`,
            HeaderText1:this.HeaderText1,
            HeaderText2:this.HeaderText2,
            HeaderText3:this.HeaderText3,

        recnum:
            this.queryForm.get('recnum')?.value.length &&
            this.queryForm.get('recnum')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('recnum')?.value.join(`','`)}'`
              : `'ALL'`,
            bldgcode:
              this.queryForm.get('bldgcode')?.value.length &&
              this.queryForm.get('bldgcode')?.value[0] != 'ALL'
                ? `'${this.queryForm.get('bldgcode')?.value.join(`','`)}'`
                : `'ALL'`,
            wing:
              this.queryForm.get('wing')?.value.length &&
              this.queryForm.get('wing')?.value[0] != 'ALL'
                ? `'${this.queryForm.get('wing')?.value.join(`','`)}'`
                : `'ALL'`,
            flatNum:
              this.queryForm.get('flatNum')?.value.length &&
              this.queryForm.get('flatNum')?.value[0] != 'ALL'
                ? `'${this.queryForm.get('flatNum')?.value.join(`','`)}'`
                : `'ALL'`,
            ownerid:`'${this.ownerid}'`,
                auxi_inap: `'${this.auxi_inap}'`,
                // formname: "'" + this.formName + "'",
          },
        };

        console.log('PAYLOAD', payload);
        console.log('bldgCodeFilter', this.bldgCodeFilter);
        console.log('bldgCodeWingFilter', this.bldgCodeWingFilter);
        console.log('bldgCodeWingFlatFilter', this.bldgCodeWingFlatFilter);

        this.loaderToggle = true;
        this._commonReport
          .getParameterizedReport(payload)
          .pipe(
            take(1),
            finalize(() => (this.loaderToggle = false))
          )
          .subscribe({
            next: (res: any) => {
              if( res ){
                this.commonPdfReport(print, res);
              }
              else {
                this.toastr.showError('No Data Found');
              }
            },
//             error: (err: any) => {
//               this.loaderToggle = false;
// //              this.toastr.showError('No Data Found');
//             },
//             complete: () => {
//               this.loaderToggle = false;
//             },
          });
      }
    } else {
      this.toastr.showError('Please fill the form properly');
      this.queryForm.markAllAsTouched();
    }
  }

  commonPdfReport(print: Boolean, res: any) {
    let filename = this._commonReport.getReportName();
    this._service.exportReport(
      print,
      res,
      this.queryForm.get('exportType')?.value,
      filename
    );
  }

  resetForm() {
    this.queryForm.reset({
      exportType: 'PDF',
      name: 'RptNormalInfraReceipt.rpt',
      bldgcode: [],
      wing: [],
      flatNum: [],
      recnum: [],
    });
    this.url =
      this.router.url.split('/')[this.router.url.split('/').length - 1];
    //    this.url == 'auxidefaultersreport' ? this.queryForm.patchValue({auxi_inap: 'AUXI'}) : this.queryForm.patchValue({auxi_inap: 'INAP'})
    this.url == 'infrareceiptreprintnormal'
      ? (this.auxi_inap = 'INAP')
      : (this.auxi_inap = 'AUXI');
      this.url == 'infrareceiptreprintfirst'
      ? (this.auxi_inap = 'INAP')
      : (this.auxi_inap = 'AUXI');
      this.url == 'auxiliaryreceiptreportfirst'
      ? (this.auxi_inap = 'AUXI')
      : (this.auxi_inap = 'INAP');
      this.url == 'auxiliaryreceiptreportnormal'
      ? (this.auxi_inap = 'AUXI')
      : (this.auxi_inap = 'INAP');
      this.HeaderText1 = '';
      this.HeaderText2 = '';
      this.HeaderText3 = '';
      this.receiptType = '';
      this.UsrLabel2 = '';
      this.bldgCodeFilter = '';
      this.bldgCodeWingFilter = '';
      this.bldgCodeWingFlatFilter = '';
        setTimeout(function () {
      document.getElementById('party123')?.focus();
    }, 100);
  }
}

export function all() {
  return (g: AbstractControl) => {
    return g.get('bldgcode')?.value.length ? null : { atLeastOneFilter: true };
    //    return g.get('wing')?.value.length ? null : { atLeastOneFilter: true };
    //    return g.get('flatNum')?.value.length ? null : { atLeastOneFilter: true };
  };
}
