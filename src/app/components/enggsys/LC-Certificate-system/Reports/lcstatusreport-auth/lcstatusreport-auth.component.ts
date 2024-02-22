import { DynapopService } from 'src/app/services/dynapop.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl,} from '@angular/forms';
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
  selector: 'app-lcstatusreport-auth',
  templateUrl: './lcstatusreport-auth.component.html',
  styleUrls: ['./lcstatusreport-auth.component.css'],
})
export class LcstatusreportAuthComponent implements OnInit {

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

  LcstatusreportAuth: FormGroup = new FormGroup(
    {
      name: new FormControl('Engg_Rp_StatusofLCAuthorisations.rpt'),
      isPrint: new FormControl(false),
      reportParameters: new FormGroup({
        exportType: new FormControl('PDF'),
        formname: new FormControl(''),
        StrPrmBldgCode: new FormControl<string[]>([]),
        StrPrmDurFrom: new FormControl<Date | null>(new Date('01/01/1980')),
        StrPrmDurUpto: new FormControl<Date | null>(new Date()),
        StrPrmPartyCode: new FormControl<string[]>([]),
        StrPrmMatGroup: new FormControl<string[]>([]),
      }),
    }
    // { validators: all() }
  );

  HeaderTxt1!: string;
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
    this.HeaderTxt1 = 'Status of LC Authorisations ';
    this.setFocus('LcstatusreportAuth_bldg')
  }

  buttonAction(event: string){
    if (event == 'download') {
      this.getReport(false);
    }
    if (event == 'print') {
      this.getReport(true);
    }
    if (event == 'reset') {
      this.LcstatusreportAuth.reset();
      this.setFocus('LcstatusreportAuth_bldg')
    }
    if (event == 'exit') {
      this.router.navigate(['/dashboard']);
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

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  getReport(print: boolean) {
    console.log('fromvalue', this.LcstatusreportAuth.value);
    if (this.LcstatusreportAuth.valid) {
      this.loaderToggle = true;
      this.setReportValue();
      console.log('payload', this.payLoad); //FOR DEBUG

      if (
        this.payLoad.reportParameters.StrPrmDurFrom != 'Invalid date' &&
        this.payLoad.reportParameters.StrPrmDurUpto != 'Invalid date'
      ) {
        this.payLoad.reportParameters.HeaderText1 =
          'Status of LC Authorisations ' +
          ' for the period ' +
          moment(
            this.LcstatusreportAuth.getRawValue().reportParameters.StrPrmDurFrom
          ).format('DD/MM/YYYY') +
          ' - ' +
          moment(
            this.LcstatusreportAuth.getRawValue().reportParameters.StrPrmDurUpto
          ).format('DD/MM/YYYY');
      } else if (
        this.payLoad.reportParameters.StrPrmDurFrom == 'Invalid date' &&
        this.payLoad.reportParameters.StrPrmDurUpto != 'Invalid date'
      ) {
        this.payLoad.reportParameters.StrPrmDurFrom =
        moment(
          new Date('01/01/1980')
        ).format('DD/MM/YYYY');
        this.payLoad.reportParameters.HeaderText1 =
          'Status of LC Authorisations ' +
          ' for the period Beginning - ' +
          moment(
            this.LcstatusreportAuth.getRawValue().reportParameters.StrPrmDurUpto
          ).format('DD/MM/YYYY');
      } else if (
        this.payLoad.reportParameters.StrPrmDurFrom != 'Invalid date' &&
        this.payLoad.reportParameters.StrPrmDurUpto == 'Invalid date'
      ) {
        this.payLoad.reportParameters.StrPrmDurUpto =
        moment(
          new Date()
        ).format('DD/MM/YYYY');
        this.payLoad.reportParameters.HeaderText1 =
          'Status of LC Authorisations ' +
          ' for the period ' +
          moment(
            this.LcstatusreportAuth.getRawValue().reportParameters.StrPrmDurFrom
          ).format('DD/MM/YYYY') +
          ' - Today';
      } else if (
        this.payLoad.reportParameters.StrPrmDurFrom == 'Invalid date' &&
        this.payLoad.reportParameters.StrPrmDurUpto == 'Invalid date'
      ) {
        this.payLoad.reportParameters.StrPrmDurFrom =
        moment(
          new Date('01/01/1980')
        ).format('DD/MM/YYYY');
        this.payLoad.reportParameters.StrPrmDurUpto =
        moment(
          new Date()
        ).format('DD/MM/YYYY');
        this.payLoad.reportParameters.HeaderText1 =
          'Status of LC Authorisations ' +
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

            this._service.exportReport(print, res, this.LcstatusreportAuth.controls['reportParameters'].get('exportType')?.value ,fileName)
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
      name: 'Engg_Rp_StatusofLCAuthorisations.rpt',
      isPrint: false,
      exportType: this.LcstatusreportAuth.controls['reportParameters'].get('exportType')?.value,
      reportParameters: {
        StrPrmBldgCode: this.LcstatusreportAuth.controls[
          'reportParameters'
        ]?.get('StrPrmBldgCode')?.value
          ? "'" +
            this.commonService.convertArryaToString(
              this.LcstatusreportAuth.controls['reportParameters']?.get(
                'StrPrmBldgCode'
              )?.value
            ) +
            "'"
          : "'ALL'",

        StrPrmPartyCode: this.LcstatusreportAuth.controls[
          'reportParameters'
        ]?.get('StrPrmPartyCode')?.value
          ? "'" +
            this.commonService.convertArryaToString(
              this.LcstatusreportAuth.controls['reportParameters']?.get(
                'StrPrmPartyCode'
              )?.value
            ) +
            "'"
          : `'ALL'`,
        StrPrmMatGroup: this.LcstatusreportAuth.controls[
          'reportParameters'
        ]?.get('StrPrmMatGroup')?.value
          ? "'" +
            this.commonService.convertArryaToString(
              this.LcstatusreportAuth.controls['reportParameters']?.get(
                'StrPrmMatGroup'
              )?.value
            ) +
            "'"
          : `'ALL'`,

        StrPrmDurFrom: moment(
          this.LcstatusreportAuth.getRawValue().reportParameters.StrPrmDurFrom
        ).format('DD/MM/YYYY'),
        StrPrmDurUpto: moment(
          this.LcstatusreportAuth.getRawValue().reportParameters.StrPrmDurUpto
        ).format('DD/MM/YYYY'),
        HeaderText1:
          this.HeaderTxt1 +
          moment(
            this.LcstatusreportAuth.getRawValue().reportParameters.StrPrmDurUpto
          ).format('DD/MM/YYYY'),
      },
    };
  }

  GetDefaultValue() {
    this.fetchRequestAPI = 'payrollreports/reportparameters';
    this.payreportsService.GetReportParameters().subscribe((res: any) => {
      if (res.status) {
        console.log(res.data);
        this.LcstatusreportAuth.patchValue({
          reportParameters: {
            StrPrmBldgCode: res.data.StrPrmBldgCode,
            StrPrmPartyCode: res.data.StrPrmPartyCode,
            StrPrmMatGroup: res.data.StrPrmMatGroup,
          },
        });
      }
    });
  }
}
export function all() {
  return (g: AbstractControl) => {
    return g.get('StrPrmBldgCode')?.value.length
      ? null
      : { atLeastOneFilter: true };
    return g.get('StrPrmPartyCode')?.value.length
      ? null
      : { atLeastOneFilter: true };
    return g.get('StrPrmMatGroup')?.value.length
      ? null
      : { atLeastOneFilter: true };
  };
}
