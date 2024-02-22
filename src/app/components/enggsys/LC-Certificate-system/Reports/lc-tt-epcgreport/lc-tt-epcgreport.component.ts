import { DynapopService } from 'src/app/services/dynapop.service';
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
  selector: 'app-lc-tt-epcgreport',
  templateUrl: './lc-tt-epcgreport.component.html',
  styleUrls: ['./lc-tt-epcgreport.component.css']
})
export class LcTtEpcgreportComponent implements OnInit {

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

  LcTtEpcgreport: FormGroup = new FormGroup(
    {
      name: new FormControl('Engg_RP_LCTTEPCG_REPORT.rpt'),
      isPrint: new FormControl(false),
      reportParameters: new FormGroup({
        exportType: new FormControl('PDF'),
        formname: new FormControl(''),
        StrPrmBldgCode: new FormControl<string[]>([]),
        StrPrmFromDate: new FormControl<Date | null>(new Date('01/01/1980')),
        StrPrmUptoDate: new FormControl<Date | null>(new Date()),
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
    this.setFocus('LcTtEpcgreport_bldg');
  }

  buttonAction(event: string) {
    if (event == 'download') {
      this.getReport(false);
    }
    if (event == 'print') {
      this.getReport(true);
    }
    if (event == 'reset') {
      this.LcTtEpcgreport.reset();
      this.setFocus('LcTtEpcgreport_bldg')
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

  getReport(print: boolean) {
    console.log('fromvalue', this.LcTtEpcgreport.value);
    if (this.LcTtEpcgreport.valid) {
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

            this._service.exportReport(print, res, this.LcTtEpcgreport.get('reportParameters.exportType')?.value, fileName);

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
    } else {
      this.toastr.error('Please fill the input properly');
    }
  }

  setReportValue() {
    this.payLoad = {
      name: 'Engg_RP_LCTTEPCG_REPORT.rpt',
      isPrint: false,
      exportType : this.LcTtEpcgreport.getRawValue().reportParameters.exportType,
      reportParameters: {
        // StrPrmBldgCode: this.queryForm.get('StrPrmBldgCode')?.value.length &&
        // this.queryForm.get('StrPrmBldgCode')?.value[0] != 'ALL'
        // ? `'${this.queryForm.get('StrPrmBldgCode')?.value.join(`','`)}'`
        // : `'ALL'`,
        // StrPrmBldgCode:
        //   this.LcTtEpcgreport.controls['reportParameters']?.get('StrPrmBldgCode')
        //     ?.value.length &&
        //   this.LcTtEpcgreport.controls['reportParameters']?.get('StrPrmBldgCode')
        //     ?.value[0] != 'ALL'
        //     ? `'${this.LcTtEpcgreport.controls['reportParameters']
        //         ?.get('StrPrmBldgCode')
        //         ?.value.join(`','`)}'`
        //     : `'ALL'`,
        StrPrmBldgCode: this.LcTtEpcgreport.controls['reportParameters']?.get(
          'StrPrmBldgCode'
        )?.value
          ? "'" +
          this.commonService.convertArryaToString(
            this.LcTtEpcgreport.controls['reportParameters']?.get(
              'StrPrmBldgCode'
            )?.value
          ) +
          "'"
          : "'ALL'",
        StrPrmFromDate:
          "'" +
          moment(
            this.LcTtEpcgreport.getRawValue().reportParameters.StrPrmFromDate
          ).format('DD/MM/YYYY') +
          "'",
        StrPrmUptoDate:
          "'" +
          moment(
            this.LcTtEpcgreport.getRawValue().reportParameters.StrPrmUptoDate
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
        this.LcTtEpcgreport.patchValue({
          reportParameters: {
            StrPrmBldgCode: res.data.StrPrmBldgCode,
          },
        });
      }
    });
  }
}
export function all() {
  return (g: AbstractControl) => {
    return g.get('StrPrmBldgCode')?.value.length ? null : { atLeastOneFilter: true };
  };
}
