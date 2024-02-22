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
  selector: 'app-lccertificatelist',
  templateUrl: './lccertificatelist.component.html',
  styleUrls: ['./lccertificatelist.component.css'],
})
export class LccertificatelistComponent implements OnInit {

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['download', 'print', 'reset', 'exit'])

  exportTypes = [
    { name: 'PDF', id: 'PDF' },
    { name: 'Excel (Report - Data Format)', id: 'EXCEL_REPORT_DATA_FORMAT' },
    { name: 'Excel (Template Format)', id: 'EXCEL_TEMPLATE_FORMAT' },
    // { name: 'One line', id: 'EXCEL_TEMPLATE_FORMAT' },
  ];

  loaderToggle: boolean = false;
  payLoad: any;
  fetchRequestAPI: any;

  Lccertificatelist: FormGroup = new FormGroup(
    {
      name: new FormControl('Engg_RP_LCCert_List.rpt'),
      isPrint: new FormControl(false),
      reportParameters: new FormGroup({
        exportType: new FormControl('PDF'),
        formname: new FormControl(''),
        bldgCode: new FormControl<string[]>([]),
        FromDate: new FormControl<Date | null>(new Date('01/01/1980')),
        UptoDate: new FormControl<Date | null>(new Date()),
        PartyCode: new FormControl<string[]>([]),
        WorkCode: new FormControl<string[]>([]),
        RecID: new FormControl<string[]>([]),
      }),
    }
    // { validators: all() }
  );

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private payreportsService: PayreportsService,
    private _dynapop: DynapopService,
    private commonService: CommonService,
    public _service: ServiceService
  ) { }

  ngOnInit(): void {
    this.GetDefaultValue();
    this.setFocus('Lccertificatelist_bldg')
  }

  buttonAction(event: string) {
    if (event == 'download') {
      this.getReport(false);
    }
    if (event == 'print') {
      this.getReport(true);
    }
    if (event == 'reset') {
      this.Lccertificatelist.reset();
      this.setFocus('Lccertificatelist_bldg')
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
    if (this.Lccertificatelist.valid) {
      this.loaderToggle = true;
      this.setReportValue();
      console.log('payload', this.payLoad);

      this.commonReportService
        .getParameterizedReport(this.payLoad)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.loaderToggle = false;
            let pdfFile = new Blob([res], { type: 'application/pdf' });
            let fileName = this.commonReportService.getReportName();

            this._service.exportReport(print, res, this.Lccertificatelist.get('reportParameters.exportType')?.value, fileName);
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
      name: 'Engg_RP_LCCert_List.rpt',
      isPrint: false,
      exportType: this.Lccertificatelist.controls['reportParameters'].get('exportType')?.value,
      reportParameters: {
        bldgCode: this.Lccertificatelist.controls['reportParameters']?.get(
          'bldgCode'
        )?.value
          ? "'" +
          this.commonService.convertArryaToString(
            this.Lccertificatelist.controls['reportParameters']?.get(
              'bldgCode'
            )?.value
          ) +
          "'"
          : "'ALL'",

        PartyCode: this.Lccertificatelist.controls['reportParameters']?.get(
          'PartyCode'
        )?.value
          ? "'" +
          this.commonService.convertArryaToString(
            this.Lccertificatelist.controls['reportParameters']?.get(
              'PartyCode'
            )?.value
          ) +
          "'"
          : `'ALL'`,
        RecID: this.Lccertificatelist.controls['reportParameters']?.get('RecID')
          ?.value
          ? "'" +
          this.commonService.convertArryaToString(
            this.Lccertificatelist.controls['reportParameters']?.get('RecID')
              ?.value
          ) +
          "'"
          : `'ALL'`,
        WorkCode: this.Lccertificatelist.controls['reportParameters']?.get(
          'WorkCode'
        )?.value
          ? "'" +
          this.commonService.convertArryaToString(
            this.Lccertificatelist.controls['reportParameters']?.get(
              'WorkCode'
            )?.value
          ) +
          "'"
          : `'ALL'`,

        FromDate:
          "'" +
          moment(
            this.Lccertificatelist.getRawValue().reportParameters.FromDate
          ).format('DD/MM/YYYY') +
          "'",
        UptoDate:
          "'" +
          moment(
            this.Lccertificatelist.getRawValue().reportParameters.UptoDate
          ).format('DD/MM/YYYY') +
          "'",
      },
    };
  }

  GetDefaultValue() {
    this.fetchRequestAPI = 'payrollreports/reportparameters';
    this.payreportsService.GetReportParameters().subscribe((res: any) => {
      if (res.status) {
        console.log(res.data);
        this.Lccertificatelist.patchValue({
          reportParameters: {
            bldgCode: res.data.bldgCode,
            PartyCode: res.data.PartyCode,
            RecID: res.data.RecID,
            WorkCode: res.data.WorkCode,
          },
        });
      }
    });
  }
}
export function all() {
  return (g: AbstractControl) => {
    return g.get('bldgCode')?.value.length ? null : { atLeastOneFilter: true };
    return g.get('PartyCode')?.value.length ? null : { atLeastOneFilter: true };
    return g.get('RecID')?.value.length ? null : { atLeastOneFilter: true };
    return g.get('WorkCode')?.value.length ? null : { atLeastOneFilter: true };
  };
}
