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
  selector: 'app-outgoing-infra-monthwise',
  templateUrl: './outgoing-infra-monthwise.component.html',
  styleUrls: ['./outgoing-infra-monthwise.component.css'],
})
export class OutgoingInfraMonthwiseComponent implements OnInit {
  queryForm: FormGroup = new FormGroup(
    {
      exportType: new FormControl('PDF'),
      name: new FormControl<string>(
        'FrmOutGoingInfraMonthwiseReport.rpt',
        Validators.required
      ),
      bldgCode: new FormControl<string[]>([], [Validators.required]),
      wing: new FormControl<string[]>([]),
      flatNum: new FormControl<string[]>([]),
    },
    { validators: all() }
  );

  loaderToggle: boolean = false;
  formName!: string;
  url!: string;
  chargeCode!: string;
  bldgCodeFilter = '';
  bldgCodeWingFilter = '';

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
    //       this.url == 'auxidefaultersreport' ? this.queryForm.patchValue({chargeCode: 'AUXI'}) : this.queryForm.patchValue({chargeCode: 'INAP'})
    // }, 10);
    //this.url == 'auxidefaultersreport' ? this.queryForm.patchValue({chargeCode: 'AUXI'}) : this.queryForm.patchValue({chargeCode: 'INAP'})
    this.url == 'outgoinginframonthwisereport'
      ? (this.chargeCode = 'INAP')
      : (this.chargeCode = 'AUXI');

    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = val.formName;
      },
    });

    this.queryForm.get('bldgCode')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          let bldg = res;
          this.bldgCodeFilter = `FLAT_bldgcode IN ('${bldg.join("','")}')`;
          this.bldgCodeWingFilter = `FLAT_bldgcode IN ('${bldg.join(
            "','"
          )}') AND flat_wing `;
        }
      },
    });

    this.queryForm.get('wing')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          let wings = res;
          this.bldgCodeWingFilter =
            this.bldgCodeWingFilter + ` IN ('${wings.join("','")}')`;
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
            bldgCode:
              this.queryForm.get('bldgCode')?.value.length &&
              this.queryForm.get('bldgCode')?.value[0] != 'ALL'
                ? `'${this.queryForm.get('bldgCode')?.value.join(`','`)}'`
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
            formname: "'" + this.formName + "'",
          },
        };

        console.log('PAYLOAD', payload);
        console.log('bldgCodeFilter', this.bldgCodeFilter);
        console.log('bldgCodeWingFilter', this.bldgCodeWingFilter);

        this.loaderToggle = true;
        this._commonReport
          .getParameterizedReportWithMultipleConditionAndParameter(payload)
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
      name: 'FrmOutGoingInfraMonthwiseReport.rpt',
      bldgCode: [],
      wing: [],
      flatNum: [],
    });
    this.url =
      this.router.url.split('/')[this.router.url.split('/').length - 1];
    //    this.url == 'auxidefaultersreport' ? this.queryForm.patchValue({chargeCode: 'AUXI'}) : this.queryForm.patchValue({chargeCode: 'INAP'})
    this.url == 'outgoinginframonthwisereport'
      ? (this.chargeCode = 'INAP')
      : (this.chargeCode = 'AUXI');
    setTimeout(function () {
      document.getElementById('party123')?.focus();
    }, 100);
  }
}

export function all() {
  return (g: AbstractControl) => {
    return g.get('bldgCode')?.value.length ? null : { atLeastOneFilter: true };
    //    return g.get('wing')?.value.length ? null : { atLeastOneFilter: true };
    //    return g.get('flatNum')?.value.length ? null : { atLeastOneFilter: true };
  };
}
