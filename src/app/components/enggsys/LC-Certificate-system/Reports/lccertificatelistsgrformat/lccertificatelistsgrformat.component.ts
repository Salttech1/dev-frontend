import { DynapopService } from 'src/app/services/dynapop.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-lccertificatelistsgrformat',
  templateUrl: './lccertificatelistsgrformat.component.html',
  styleUrls: ['./lccertificatelistsgrformat.component.css']
})
export class LccertificatelistsgrformatComponent implements OnInit {

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['download', 'print', 'reset', 'exit'])

  exportTypes = [
    { name: 'PDF', id: 'PDF' },
    { name: 'Excel (Report - Data Format)', id: 'EXCEL_REPORT_DATA_FORMAT' },
    { name: ' Excel (Template Format)', id: 'EXCEL_TEMPLATE_FORMAT' },
  ];

  loaderToggle: boolean = false;
  payLoad: any;
  fetchRequestAPI: any;

  Lccertificatelistsgrformat: FormGroup = new FormGroup(
    {
      name: new FormControl('Engg_RP_LCCert_SGRList.rpt'),
      isPrint: new FormControl(false),
      reportParameters: new FormGroup({
        exportType: new FormControl('PDF'),
        formname: new FormControl('Engg_RP_LCCert_SGRList.rpt'),
        BldgCode: new FormControl<string[]>([]),
        FromDate: new FormControl<Date | null>(new Date('01/01/1980')),
        UptoDate: new FormControl<Date | null>(new Date()),


      }),
    }
    // { validators: all() }
  );

  constructor(
    // private commonReportService: CommonReportsService,
    private _commonReport: CommonReportsService,

    private router: Router,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private payreportsService: PayreportsService,
    private _dynapop: DynapopService,
    private commonService: CommonService,
    public _service: ServiceService,

  ) { }

  ngOnInit(): void {
    this.GetDefaultValue();
    this.setFocus('lcCertificate_bldg')
  }

  buttonAction(event: String) {
    if (event == 'download') {
      this.getReport(false);
      // this.excelReport(false);
    }
    if (event == 'print') {
      this.getReport(true);
      // this.excelReport(true);
    }
    if (event == 'reset') {
      this.Lccertificatelistsgrformat.reset();
      this.setFocus('lcCertificate_bldg')
    }
    if (event == 'exit') {
      this.router.navigateByUrl('/dashboard')
    }
  }

  setFocus(id: string) {
    // Method to set focus to object on form
    setTimeout(() => {
      this.renderer.selectRootElement(`#${id}`).focus();
    }, 100);
  }

  focusById(id: string) {
    this.renderer.selectRootElement(`#${id}`)?.focus();
  }

  getReport(print: boolean) {
    // console.log('fromvalue', this.Lccertificatelistsgrformat.value);
    if (this.Lccertificatelistsgrformat.valid) {
      this.loaderToggle = true;
      this.setReportValue();
      console.log('payload', this.payLoad); //FOR DEBUG

      this._commonReport
        .getParameterizedReport(this.payLoad)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.loaderToggle = false;
            let pdfFile = new Blob([res], { type: 'application/pdf' });
            let fileName = this._commonReport.getReportName();


            this._service.exportReport(
              print,
              res,
              this.Lccertificatelistsgrformat.get('reportParameters.exportType')?.value,
              fileName
            );
            // if (print) {
            //   const blobUrl = URL.createObjectURL(pdfFile);
            //   const oWindow = window.open(blobUrl, '_blank');
            //   oWindow?.print();
            // } else {
            //   fileSaver.saveAs(pdfFile, fileName);
            // }
          },
          error: (err: any) => {
            this.loaderToggle = false;
          },
          complete: () => {
            this.loaderToggle = false;
          },
        });
    }
    else {
      this.toastr.error('Please fill the input properly');
    }
  }

  setReportValue() {
    this.payLoad = {
      name: 'Engg_RP_LCCert_SGRList.rpt',
      isPrint: false,
      exportType:this.Lccertificatelistsgrformat.getRawValue().reportParameters.exportType,
      reportParameters: {
        // BldgCode: this.queryForm.get('BldgCode')?.value.length &&
        // this.queryForm.get('BldgCode')?.value[0] != 'ALL'
        // ? `'${this.queryForm.get('BldgCode')?.value.join(`','`)}'`
        // : `'ALL'`,
        // BldgCode:
        //   this.Lccertificatelistsgrformat.controls['reportParameters']?.get('BldgCode')
        //     ?.value.length &&
        //   this.Lccertificatelistsgrformat.controls['reportParameters']?.get('BldgCode')
        //     ?.value[0] != 'ALL'
        //     ? `'${this.Lccertificatelistsgrformat.controls['reportParameters']
        //         ?.get('BldgCode')
        //         ?.value.join(`','`)}'`
        //     : `'ALL'`,
        BldgCode: this.Lccertificatelistsgrformat.controls['reportParameters']?.get(
          'BldgCode'
        )?.value
          ? "'" +
          this.commonService.convertArryaToString(
            this.Lccertificatelistsgrformat.controls['reportParameters']?.get(
              'BldgCode'
            )?.value
          ) +
          "'"
          : "'ALL'",
        FromDate:
          "'" +
          moment(
            this.Lccertificatelistsgrformat.getRawValue().reportParameters.FromDate
          ).format('DD/MM/YYYY') +
          "'",
        UptoDate:
          "'" +
          moment(
            this.Lccertificatelistsgrformat.getRawValue().reportParameters.UptoDate
          ).format('DD/MM/YYYY') +
          "'",
      },
    };
  }

  GetDefaultValue() {
    this.fetchRequestAPI = 'payrollreports/reportparameters';
    this.payreportsService.GetReportParameters().subscribe((res: any) => {
      if (res.status) {
        // console.log(res.data);
        this.Lccertificatelistsgrformat.patchValue({
          reportParameters: {
            BldgCode: res.data.BldgCode,
          },
        });
      }
    });
  }
}

export function all() {
  return (g: AbstractControl) => {
    return g.get('BldgCode')?.value.length ? null : { atLeastOneFilter: true };
  };
}
