// import { finalize, switchMap, take } from 'rxjs';
// import { SalesService } from 'src/app/services/sales/sales.service';
// import { ServiceService } from 'src/app/services/service.service';
// import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { DynapopService } from 'src/app/services/dynapop.service';
// import * as commonConstant from '../../../../../../constants/commonconstant';

import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-lcstatusreport-cert',
  templateUrl: './lcstatusreport-cert.component.html',
  styleUrls: ['./lcstatusreport-cert.component.css']
})
export class LcstatusreportCertComponent implements OnInit {

  buttonsList : Array<buttonsList> = this.commonService.getButtonsByIds(['download', 'print', 'reset', 'exit'])

  exportTypes = [
    { name: 'PDF', id: 'PDF' },
    { name: 'Excel (Report - Data Format)', id: 'EXCEL_REPORT_DATA_FORMAT' },
    { name: 'Excel (Template Format)', id: 'EXCEL_TEMPLATE_FORMAT' },
    // { name: 'One line', id: 'EXCEL_TEMPLATE_FORMAT' },
  ];

  loaderToggle: boolean = false;
  payLoad: any;
  fetchRequestAPI: any;

  LcstatusreportCert: FormGroup = new FormGroup(
    {
      name: new FormControl('Engg_Rp_StatusofLCCertificates.rpt'),
      isPrint: new FormControl(false),
      reportParameters: new FormGroup({
        exportType: new FormControl('PDF'),
        formname: new FormControl(''),
        StrPrmBldgCodes: new FormControl<string[]>([]),
        StrPrmWorkcode: new FormControl<string[]>([]),
        StrPrmPartyCode: new FormControl<string[]>([]),
        StrPrmDurFrom: new FormControl<Date | null>(new Date('01/01/1980')),
        StrPrmDurUpto: new FormControl<Date | null>(new Date()),
      }),
    }
    // { validators: all() }
  );

  HeaderText1!: string;
  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private payreportsService: PayreportsService,
    private _dynapop: DynapopService,
    private commonService: CommonService,
    public _service: ServiceService
  ) {}

  ngOnInit(): void {
    this.GetDefaultValue();
    this.HeaderText1 = 'Status of LC Certificates As On ';
    this.setFocus('lcStatusReport_bldg');
  }

  buttonAction(event: String){
    if (event == 'download') {
      this.getReport(false);
    }
    if (event == 'print') {
      this.getReport(true);
    }
    if (event == 'reset') {
      this.LcstatusreportCert.reset();
      this.setFocus('lcStatusReport_bldg');
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
    if (this.LcstatusreportCert.valid) {
      this.loaderToggle = true;
      this.setReportValue();
      console.log('payload', this.payLoad);

      if (
        this.payLoad.reportParameters.StrPrmDurFrom != 'Invalid date' &&
        this.payLoad.reportParameters.StrPrmDurUpto != 'Invalid date'
      ) {
        this.payLoad.reportParameters.HeaderText1 =
          'Status of LC Certificates ' +
          ' for the period ' +
          moment(
            this.LcstatusreportCert.getRawValue().reportParameters.StrPrmDurFrom
          ).format('DD/MM/YYYY') +
          ' - ' +
          moment(
            this.LcstatusreportCert.getRawValue().reportParameters.StrPrmDurUpto
          ).format('DD/MM/YYYY');
      } else if (
        this.payLoad.reportParameters.StrPrmDurFrom == 'Invalid date' &&
        this.payLoad.reportParameters.StrPrmDurUpto != 'Invalid date'
      ) {
        this.payLoad.reportParameters.StrPrmDurFrom =
        moment(
          new Date('01/01/1980')
        ).format('YYYY-MM-DD');
        this.payLoad.reportParameters.HeaderText1 =
          'Status of LC Certificates ' +
          ' for the period Beginning - ' +
          moment(
            this.LcstatusreportCert.getRawValue().reportParameters.StrPrmDurUpto
          ).format('DD/MM/YYYY');
      } else if (
        this.payLoad.reportParameters.StrPrmDurFrom != 'Invalid date' &&
        this.payLoad.reportParameters.StrPrmDurUpto == 'Invalid date'
      ) {
        this.payLoad.reportParameters.StrPrmDurUpto =
        moment(
          new Date()
        ).format('YYYY-MM-DD');
        this.payLoad.reportParameters.HeaderText1 =
          'Status of LC Certificates ' +
          ' for the period ' +
          moment(
            this.LcstatusreportCert.getRawValue().reportParameters.StrPrmDurFrom
          ).format('DD/MM/YYYY') +
          ' - Today';
      } else if (
        this.payLoad.reportParameters.StrPrmDurFrom == 'Invalid date' &&
        this.payLoad.reportParameters.StrPrmDurUpto == 'Invalid date'
      ) {
        this.payLoad.reportParameters.StrPrmDurFrom =
        moment(
          new Date('01/01/1980')
        ).format('YYYY-MM-DD');
        this.payLoad.reportParameters.StrPrmDurUpto =
        moment(
          new Date()
        ).format('YYYY-MM-DD');
        this.payLoad.reportParameters.HeaderText1 =
          'Status of LC Certificates ' +
          ' As On ' +

            this.payLoad.reportParameters.StrPrmDurUpto;
      }

      this.commonReportService
        .getParameterizedReport(this.payLoad)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.loaderToggle = false;
            let pdfFile = new Blob([res], { type: 'application/pdf' });
            let fileName = this.commonReportService.getReportName();

            this._service.exportReport(print, res, this.LcstatusreportCert?.controls['rereportParameters'].get('exportType')?.value, fileName)
          },
          error: (err: any) => {
            this.loaderToggle = false;
          },
          complete: () => {
            this.loaderToggle = false;
          },
        });
    } else {
      this.toastr.error('Please fill the input properly');
    }
  }

  setReportValue() {
    this.payLoad = {
      name: 'Engg_Rp_StatusofLCCertificates.rpt',
      isPrint: false,
      exportType: this.LcstatusreportCert.controls['rereportParameters'].get('exportType')?.value,
      reportParameters: {
        StrPrmBldgCodes: this.LcstatusreportCert.controls['reportParameters']?.get(
          'StrPrmBldgCodes'
        )?.value
          ? "'" +
            this.commonService.convertArryaToString(
              this.LcstatusreportCert.controls['reportParameters']?.get(
                'StrPrmBldgCodes'
              )?.value
            ) +
            "'"
          : "'ALL'",

        StrPrmPartyCode: this.LcstatusreportCert.controls['reportParameters']?.get(
          'StrPrmPartyCode'
        )?.value
          ? "'" +
            this.commonService.convertArryaToString(
              this.LcstatusreportCert.controls['reportParameters']?.get(
                'StrPrmPartyCode'
              )?.value
            ) +
            "'"
          : `'ALL'`,
        StrPrmWorkcode: this.LcstatusreportCert.controls['reportParameters']?.get(
          'StrPrmWorkcode'
        )?.value
          ? "'" +
            this.commonService.convertArryaToString(
              this.LcstatusreportCert.controls['reportParameters']?.get(
                'StrPrmWorkcode'
              )?.value
            ) +
            "'"
          : `'ALL'`,

        StrPrmDurFrom:

          moment(
            this.LcstatusreportCert.getRawValue().reportParameters.StrPrmDurFrom
          ).format('YYYY-MM-DD') ,
        StrPrmDurUpto:

          moment(
            this.LcstatusreportCert.getRawValue().reportParameters.StrPrmDurUpto
          ).format('YYYY-MM-DD')
          ,
          HeaderText1:this.HeaderText1 + moment(
            this.LcstatusreportCert.getRawValue().reportParameters.StrPrmDurUpto
          ).format('DD/MM/YYYY'),

      },
    };
  }

  GetDefaultValue() {
    this.fetchRequestAPI = 'payrollreports/reportparameters';
    this.payreportsService.GetReportParameters().subscribe((res: any) => {
      if (res.status) {
        console.log(res.data);
        this.LcstatusreportCert.patchValue({
          reportParameters: {
            StrPrmBldgCodes: res.data.StrPrmBldgCodes,
            StrPrmPartyCode: res.data.StrPrmPartyCode,
            StrPrmWorkcode: res.data.StrPrmWorkcode,
          },
        });
      }
    });
  }
}
export function all() {
  return (g: AbstractControl) => {
    return g.get('StrPrmBldgCodes')?.value.length ? null : { atLeastOneFilter: true };
    return g.get('StrPrmPartyCode')?.value.length ? null : { atLeastOneFilter: true };
    return g.get('StrPrmWorkcode')?.value.length ? null : { atLeastOneFilter: true };
  };
}
