import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  // ValidationErrors,
  // ValidatorFn,
  Validators,
} from '@angular/forms';
// import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { finalize, switchMap, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
// import * as commonConstant from '../../../../../../constants/commonconstant';
// import { SalesService } from 'src/app/services/sales/sales.service';
// import { DynapopService } from 'src/app/services/dynapop.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-monthwise-collection-report',
  templateUrl: './monthwise-collection-report.component.html',
  styleUrls: ['./monthwise-collection-report.component.css'],
})
export class MonthwiseCollectionReportComponent implements OnInit {
  queryForm: FormGroup = new FormGroup(
    {
      exportType: new FormControl('PDF'),
      name: new FormControl<string>(
        'Rpt_OutgoingMonthlyCollRpt.rpt',
        Validators.required
      ),
      bldgCode: new FormControl<string[]>([], [Validators.required]),
      wing: new FormControl<string[]>([]),
      flatNum: new FormControl<string[]>([]),
      range: new FormGroup({
        FromDate: new FormControl<Date | null>(null),
        ToDate: new FormControl<Date | null>(null),
      }),
    },
    { validators: all() }
  );

  loaderToggle: boolean = false;
  formName!: string;
  // url!: string;
  // chargeCode!: string;
  // bldgCodeFilter = '';
  // bldgCodeWingFilter = '';

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    // private _sales: SalesService,
    public _service: ServiceService,
    private router: Router,
    // private _dynapop: DynapopService
  ) {}

  ngOnInit(): void {
    // this.url =
    //   this.router.url.split('/')[this.router.url.split('/').length - 1];
    // console.log('URL I', this.url);
    // this.url == 'monthwisecollectionreport';

    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = val.formName;
      },
    });
    setTimeout(function () {
      document.getElementById('bldgCode')?.focus();
    }, 100);
 
    // this.queryForm.get('bldgCode')?.valueChanges.subscribe({
    //   next: (res: any) => {
    //     if (res) {
    //       let bldg = res;
    //       this.bldgCodeFilter = `FLAT_bldgcode IN ('${bldg.join("','")}')`;
    //       this.bldgCodeWingFilter = `FLAT_bldgcode IN ('${bldg.join(
    //         "','"
    //       )}') AND flat_wing `;
    //     }
    //   },
    // });

    // this.queryForm.get('wing')?.valueChanges.subscribe({
    //   next: (res: any) => {
    //     if (res) {
    //       let wings = res;
    //       this.bldgCodeWingFilter =
    //         this.bldgCodeWingFilter + ` IN ('${wings.join("','")}')`;
    //     }
    //   },
    // });
  }

  subidBldgcode?: string;
  subidBldgcodeAndWing?: string = '';

  setSubidBldgcode() {
    if (
      this.queryForm.get('bldgCode')?.value.length > 0
    ){
    this.subidBldgcode =
      "flat_bldgcode='" +
      this.queryForm.get('bldgCode')?.value[0][0].trim() +
      "'";
    console.log(this.subidBldgcode);
    console.log(this.queryForm.get('bldgCode')?.value[0][0].trim());
    }
  }

  setSubidBldgcodeAndWing() {
    let wing: string | undefined;
    if (
      this.queryForm.get('wing')?.value.length == 0
    ) {
      this.subidBldgcodeAndWing = this.subidBldgcode; 
    } else {
      this.subidBldgcodeAndWing =
        this.subidBldgcode +
        " and flat_wing='" +
        this.queryForm.get('wing')?.value?.[0][0] +
        "'";
    }
    console.log('wingandbldgcode', this.subidBldgcodeAndWing);
  }

  getReport(print: Boolean) {
    let from = this.queryForm.get('range')?.value.FromDate;
    let to = this.queryForm.get('range')?.value.ToDate;
    if (this.queryForm.valid) {
      if (
        this._service.printExcelChk(
          print,
          this.queryForm.get('exportType')?.value
        )
      ) {
        // let bldg: String =  "'" + this.queryForm.get('bldgCode')?.value.length &&
        // this.queryForm.get('bldgCode')?.value[0] != 'ALL'
        //   ? `'${this.queryForm.get('bldgCode')?.value[0][0]}'`
        //   : `'ALL'` + "'"
        let payload: any = {
          name: this.queryForm.get('name')?.value,
          exportType: this.queryForm.get('exportType')?.value,
          isPrint: false,
          seqId: 1,
          reportParameters: {
            bldgCode:
            "'" + this.queryForm.get('bldgCode')?.value.length &&
              this.queryForm.get('bldgCode')?.value[0] != 'ALL'
                ? `'${this.queryForm.get('bldgCode')?.value[0][0]}'`
                : `'ALL'` + "'",
            // wing:
            // this.queryForm.get('wing')?.value.length &&
            //   this.queryForm.get('wing')?.value[0] != 'ALL'
            //     ? "'" + `'${this.queryForm.get('wing')?.value[0][0]}'` + "'"
            //     : `'ALL'`,
            wing:
            this.queryForm.get('wing')?.value.length &&
              this.queryForm.get('wing')?.value[0] != 'ALL'
                ? `'${this.queryForm.get('wing')?.value[0][0]}'`
                : `'ALL'`,
            flatNum:
              this.queryForm.get('flatNum')?.value.length &&
              this.queryForm.get('flatNum')?.value[0] != 'ALL'
                ? `'${this.queryForm.get('flatNum')?.value.join(`','`)}'`
                : `'ALL'`,
            formname: "'" + this.formName + "'",
          },
        };
        if (from && to) {
          payload.reportParameters.FromDate = `${moment(from).format(
            'DD/MM/YYYY'
          )}`;
          payload.reportParameters.ToDate = `${moment(to).format(
            'DD/MM/YYYY'
          )}`;
        }
        else {
          // payload.reportParameters.FromDate = 
        }
        console.log('PAYLOAD', payload);
        // console.log('bldgCodeFilter', this.bldgCodeFilter);
        // console.log('bldgCodeWingFilter', this.bldgCodeWingFilter);

        this.loaderToggle = true;
        this._commonReport
          .getParameterizedReportWithMultipleConditionAndParameter(payload)
          .pipe(
            take(1),
            finalize(() => (this.loaderToggle = false))
          )
          .subscribe({
            next: (res: any) => {
              if (res) {
                this.commonPdfReport(print, res);
              } else {
                this.toastr.showError('No Data Found');
              }
            },
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
      name: 'Rpt_OutgoingMonthlyCollRpt.rpt',
      bldgCode: [],
      wing: [],
      flatNum: [],
    });
    // this.url =
    //   this.router.url.split('/')[this.router.url.split('/').length - 1];
    //    this.url == 'auxidefaultersreport' ? this.queryForm.patchValue({chargeCode: 'AUXI'}) : this.queryForm.patchValue({chargeCode: 'INAP'})
    // this.url == 'outgoinginframonthwisereport'
    //   ? (this.chargeCode = 'INAP')
    //   : (this.chargeCode = 'AUXI');
    setTimeout(function () {
      document.getElementById('bldgCode')?.focus();
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
