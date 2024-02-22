import { DynapopService } from 'src/app/services/dynapop.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl,} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-Lcauthorisationlistsgrformatsgrformat',
  templateUrl: './Lcauthorisationlistsgrformat.component.html',
  styleUrls: ['./Lcauthorisationlistsgrformat.component.css']
})
export class LcauthorisationlistsgrformatComponent implements OnInit {

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

  Lcauthorisationlistsgrformat: FormGroup = new FormGroup(
    {
      name: new FormControl('Engg_RP_LCAuth_SGRList.rpt'),
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
    this.setFocus('Lcauthorisationlistsgrformat_bldg');
  }

  buttonAction(event: string){
    if (event == 'download') {
      this.getReport(false);
    }
    if (event == 'print') {
      this.getReport(true);
    }
    if (event == 'reset') {
      this.Lcauthorisationlistsgrformat.reset();
      this.setFocus('Lcauthorisationlistsgrformat_bldg');
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
    console.log('fromvalue', this.Lcauthorisationlistsgrformat.value);
    if (this.Lcauthorisationlistsgrformat.valid) {
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

            this._service.exportReport(print, res, this.Lcauthorisationlistsgrformat.controls['reportParameters'].get('exportType')?.value ,fileName)
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
      name: 'Engg_RP_LCAuth_SGRList.rpt',
      isPrint: false,
      exportType: this.Lcauthorisationlistsgrformat.controls['reportParameters'].get('exportType')?.value,
      reportParameters: {
        StrPrmBldgCode: this.Lcauthorisationlistsgrformat.controls['reportParameters']?.get(
          'StrPrmBldgCode'
        )?.value
          ? "'" +
            this.commonService.convertArryaToString(
              this.Lcauthorisationlistsgrformat.controls['reportParameters']?.get(
                'StrPrmBldgCode'
              )?.value
            ) +
            "'"
          : "'ALL'",
        StrPrmFromDate:
          "'" +
          moment(
            this.Lcauthorisationlistsgrformat.getRawValue().reportParameters.StrPrmFromDate
          ).format('DD/MM/YYYY') +
          "'",
        StrPrmUptoDate:
          "'" +
          moment(
            this.Lcauthorisationlistsgrformat.getRawValue().reportParameters.StrPrmUptoDate
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
        this.Lcauthorisationlistsgrformat.patchValue({
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
