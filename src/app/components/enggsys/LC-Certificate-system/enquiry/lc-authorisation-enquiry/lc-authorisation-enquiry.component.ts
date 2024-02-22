// import { finalize, switchMap, take } from 'rxjs';
// import { SalesService } from 'src/app/services/sales/sales.service';
// import { ServiceService } from 'src/app/services/service.service';
// import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
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
  selector: 'app-lc-authorisation-enquiry',
  templateUrl: './lc-authorisation-enquiry.component.html',
  styleUrls: ['./lc-authorisation-enquiry.component.css']
})
export class LcAuthorisationEnquiryComponent implements OnInit {

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

  lcAuthorisationForm: FormGroup = new FormGroup(
    {
      name: new FormControl('Engg_EN_LCAuthtatus.rpt'),
      isPrint: new FormControl(false),
      reportParameters: new FormGroup({
        exportType: new FormControl('PDF'),
        formname: new FormControl(''),
        bldgCode: new FormControl<string[]>([]),
        FromDate: new FormControl<Date | null>(new Date('01/01/1980')),
        UptoDate: new FormControl<Date | null>(new Date()),
        PartyCode: new FormControl<string[]>([]),
        MatGroup: new FormControl<string[]>([]),
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
  ) {}

  ngOnInit(): void {
    this.GetDefaultValue();
    this.setFocus('lcAuthorisationForm_bldg');
  }

  buttonAction(event: string){
    if (event == 'download') {
      this.getReport(false);
    }
    if (event == 'ptint') {
      this.getReport(true);
    }
    if (event == 'reset') {
      this.lcAuthorisationForm.reset();
      this.setFocus('lcAuthorisationForm_bldg');
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
    console.log('fromvalue', this.lcAuthorisationForm.value);
    if (this.lcAuthorisationForm.valid) {
      this.loaderToggle = true;
      this.setReportValue();
      console.log('payload', this.payLoad); //FOR DEBUG

      this.commonReportService
        .getParameterizedReport(this.payLoad)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.loaderToggle = false;
            let pdfFile = new Blob([res], { type: 'application/pdf' });
            let fileName = this.commonReportService.getReportName();

            this._service.exportReport(print, res, this.lcAuthorisationForm.controls['reportParameters'].get('exportType')?.value ,fileName)
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
      name: 'Engg_EN_LCAuthtatus.rpt',
      isPrint: false,
      exportType : this.lcAuthorisationForm.controls['reportParameters'].get('exportType')?.value,
      reportParameters: {
        bldgCode: this.lcAuthorisationForm.controls['reportParameters']?.get(
          'bldgCode'
        )?.value
          ? "'" +
            this.commonService.convertArryaToString(
              this.lcAuthorisationForm.controls['reportParameters']?.get(
                'bldgCode'
              )?.value
            ) +
            "'"
          : "'ALL'",

        PartyCode: this.lcAuthorisationForm.controls['reportParameters']?.get(
          'PartyCode'
        )?.value
          ? "'" +
            this.commonService.convertArryaToString(
              this.lcAuthorisationForm.controls['reportParameters']?.get(
                'PartyCode'
              )?.value
            ) +
            "'"
          : `'ALL'`,
        MatGroup: this.lcAuthorisationForm.controls['reportParameters']?.get(
          'MatGroup'
        )?.value
          ? "'" +
            this.commonService.convertArryaToString(
              this.lcAuthorisationForm.controls['reportParameters']?.get(
                'MatGroup'
              )?.value
            ) +
            "'"
          : `'ALL'`,

        FromDate:
          "'" +
          moment(
            this.lcAuthorisationForm.getRawValue().reportParameters.FromDate
          ).format('DD/MM/YYYY') +
          "'",
        UptoDate:
          "'" +
          moment(
            this.lcAuthorisationForm.getRawValue().reportParameters.UptoDate
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
        this.lcAuthorisationForm.patchValue({
          reportParameters: {
            bldgCode: res.data.bldgCode,
            PartyCode: res.data.PartyCode,
            MatGroup: res.data.MatGroup,
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
    return g.get('MatGroup')?.value.length ? null : { atLeastOneFilter: true };
  };
}

