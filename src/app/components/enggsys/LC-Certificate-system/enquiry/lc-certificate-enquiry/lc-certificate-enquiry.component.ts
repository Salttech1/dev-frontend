import { MatDialog } from '@angular/material/dialog';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';

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
  selector: 'app-lc-certificate-enquiry',
  templateUrl: './lc-certificate-enquiry.component.html',
  styleUrls: ['./lc-certificate-enquiry.component.css']
})
export class LcCertificateEnquiryComponent implements OnInit {

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

  lcCertificateForm: FormGroup = new FormGroup(
    {
      name: new FormControl('Engg_EN_LCCerttatus.rpt'),
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
    this.setFocus('lcCertificateForm_bldg')
  }

  buttonAction(event: string) {
    if (event == 'download') {
      this.getReport(false);
    }
    if (event == 'print') {
      this.getReport(true);
    }
    if (event == 'reset') {
      this.lcCertificateForm.reset();
      this.setFocus('lcCertificateForm_bldg')
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
    if (this.lcCertificateForm.valid) {
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

            this._service.exportReport(print, res, this.lcCertificateForm.get('reportParameters.exportType')?.value, fileName);
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
      name: 'Engg_EN_LCCerttatus.rpt',
      isPrint: false,
      exportType: this.lcCertificateForm.controls['reportParameters'].get('exportType')?.value,
      reportParameters: {
        bldgCode: this.lcCertificateForm.controls['reportParameters']?.get(
          'bldgCode'
        )?.value
          ? "'" +
          this.commonService.convertArryaToString(
            this.lcCertificateForm.controls['reportParameters']?.get(
              'bldgCode'
            )?.value
          ) +
          "'"
          : "'ALL'",

        PartyCode: this.lcCertificateForm.controls['reportParameters']?.get(
          'PartyCode'
        )?.value
          ? "'" +
          this.commonService.convertArryaToString(
            this.lcCertificateForm.controls['reportParameters']?.get(
              'PartyCode'
            )?.value
          ) +
          "'"
          : `'ALL'`,
        RecID: this.lcCertificateForm.controls['reportParameters']?.get('RecID')
          ?.value
          ? "'" +
          this.commonService.convertArryaToString(
            this.lcCertificateForm.controls['reportParameters']?.get('RecID')
              ?.value
          ) +
          "'"
          : `'ALL'`,
        WorkCode: this.lcCertificateForm.controls['reportParameters']?.get(
          'WorkCode'
        )?.value
          ? "'" +
          this.commonService.convertArryaToString(
            this.lcCertificateForm.controls['reportParameters']?.get(
              'WorkCode'
            )?.value
          ) +
          "'"
          : `'ALL'`,

        FromDate:
          "'" +
          moment(
            this.lcCertificateForm.getRawValue().reportParameters.FromDate
          ).format('DD/MM/YYYY') +
          "'",
        UptoDate:
          "'" +
          moment(
            this.lcCertificateForm.getRawValue().reportParameters.UptoDate
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
        this.lcCertificateForm.patchValue({
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
