import { DynapopService } from 'src/app/services/dynapop.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { CommonService } from 'src/app/services/common.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-notreconciledtransactionsreport',
  templateUrl: './notreconciledtransactionsreport.component.html',
  styleUrls: ['./notreconciledtransactionsreport.component.css']
})

export class NotreconciledtransactionsreportComponent implements OnInit {

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['download', 'print', 'reset', 'exit'])

  exportTypes = [
    { name: 'PDF', id: 'PDF' },
    { name: 'Excel (Report - Data Format)', id: 'EXCEL_REPORT_DATA_FORMAT' },
    { name: 'Excel (Template Format)', id: 'EXCEL_TEMPLATE_FORMAT' },
    // { name: 'One line', id: 'EXCEL_FORMAT' },
  ];

  loaderToggle: boolean = false;
  payLoad: any;
  fetchRequestAPI: any;

  Notreconciledtransactionsreport: FormGroup = new FormGroup(
    {
      name: new FormControl(' '),
      isPrint: new FormControl(false),
      reportParameters: new FormGroup({
        exportType: new FormControl('PDF'),
        formname: new FormControl(''),
        // prmCoy: new FormControl<string[]>([]),
      }),
    },
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
    // this.setFocus('pendingLc_bldg')
  }

  buttonAction(event: string) {
    if (event == 'download') {
      this.getReport(false);
    }
    if (event == 'print') {
      this.getReport(true);
    }
    if (event == 'reset') {
      this.resetNotreconciledtransactionsreport();
      // this.setFocus('pendingLc_bldg')
    }
    if (event == 'exit') {
      this.router.navigateByUrl('/dashboard')
    }
  }


  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  resetNotreconciledtransactionsreport() {
    this.Notreconciledtransactionsreport.reset();
    // this.setFocus('pendingLc_bldg')
  }


  getReport(print: boolean) {
    console.log("fromvalue", this.Notreconciledtransactionsreport.value);
    if (this.Notreconciledtransactionsreport.valid) {

      this.loaderToggle = true;
      this.setReportValue();
      console.log("payload", this.payLoad);    //FOR DEBUG

      this.commonReportService
        .getParameterizedReport(this.payLoad)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.loaderToggle = false;
            let pdfFile = new Blob([res], { type: 'application/pdf' });
            let fileName = this.commonReportService.getReportName();
            if (print) {
              const blobUrl = URL.createObjectURL(pdfFile);
              const oWindow = window.open(blobUrl, '_blank');
              oWindow?.print();
            } else {
              fileSaver.saveAs(pdfFile, fileName);
            }
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

  setFocus(id: string) {
    // Method to set focus to object on form
    setTimeout(() => {
      this.renderer.selectRootElement(`#${id}`).focus();
    }, 100);
  }

  focusById(id: string) {
    this.renderer.selectRootElement(`#${id}`)?.focus();
  }

  setReportValue() {
    this.payLoad = {
      name: 'rpt_Non_Reconciled_Txn.rpt',
      isPrint: false,
      reportParameters: {
        // prmCoy: "'ALL'"

      }
    };
  }

  GetDefaultValue() {
    this.fetchRequestAPI = 'payrollreports/reportparameters';
    this.payreportsService.GetReportParameters().subscribe((res: any) => {
      if (res.status) {
        console.log(res.data);
        this.Notreconciledtransactionsreport.patchValue({
          reportParameters: {
            // prmCoy: "'ALL'"
          }
        })
      }
    });
  }
}
export function all() {
  return (g: AbstractControl) => {
    return g.get('prmCoy')?.value.length ? null : { atLeastOneFilter: true };
  };
}