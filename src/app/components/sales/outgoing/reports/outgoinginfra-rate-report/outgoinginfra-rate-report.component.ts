import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { finalize, switchMap, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-outgoinginfra-rate-report',
  templateUrl: './outgoinginfra-rate-report.component.html',
  styleUrls: ['./outgoinginfra-rate-report.component.css']
})
export class OutgoinginfraRateReportComponent implements OnInit {

  queryForm: FormGroup = new FormGroup(
    {
      exportType: new FormControl('PDF'),
      name: new FormControl<string>(
        'FrmOutGoingInfraRateReport.rpt',
        Validators.required
      ),
      bldgCode: new FormControl<string[]>([], [Validators.required]),
    },
    { validators: all() }
  );

  loaderToggle: boolean = false;
  formName!: string;

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    public _service: ServiceService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = val.formName;
      },
    });
    setTimeout(function () {
      document.getElementById('bldgCode')?.focus();
    }, 100);
 
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
            FOWN_BLDGCODE:
            this.queryForm.get('bldgCode')?.value[0][0]
          },
        };
 
        console.log('PAYLOAD', payload);

        this.loaderToggle = true;
        this._commonReport
          .getParameterizedReport(payload)
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
      name: 'FrmOutGoingInfraRateReport.rpt',
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
