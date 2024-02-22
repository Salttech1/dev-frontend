import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { fileConstants } from 'src/constants/fileconstants';
import * as fileSaver from 'file-saver';
import { ServiceService } from 'src/app/services/service.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-policy-maturing-last-day',
  templateUrl: './policy-maturing-last-day.component.html',
  styleUrls: ['./policy-maturing-last-day.component.css'],
})
export class PolicyMaturingLastDayComponent implements OnInit {
  loaderToggle: boolean = false;

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private _service: ServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this._service.pageData.subscribe({
      next: (val) => {
        this.Policymaturinglastdayform.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
  }

  Policymaturinglastdayform = new FormGroup({
    name: new FormControl(fileConstants.admRPinsuranceMaturingPolicyToDay),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      month: new FormControl(''),
      StrLocMonthYear: new FormControl(''),
      fromDate: new FormControl(moment(), Validators.required),
    }),
  });

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  getReport(print: boolean) {
    if (this.Policymaturinglastdayform.valid) {
      let payload = {
        name: 'Adm_RP_insurance_MaturingPolicy.rpt',
        isPrint: false,
        reportParameters: {
          MatMonth: `${moment(
            this.Policymaturinglastdayform.get(
              'reportParameters.fromDate'
            )?.value
          ).format('YYYYMM')}`,
        },
      };

      console.log('pay', payload);
      // return;
      this.loaderToggle = true;
      this.commonReportService
        .getParameterizedReport(payload)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.loaderToggle = false;
            let pdfFile = new Blob([res], { type: 'application/pdf' });
            let fileName = this.commonReportService.getReportName();
            if (print) {
              const blobUrl = URL.createObjectURL(pdfFile);
              const Window = window.open(blobUrl, '_blank');
              Window?.print();
            } else {
              fileSaver.saveAs(pdfFile, fileName);
            }
          },
        });
    } else {
      this.toastr.error('Please fill the input properly');
      this.Policymaturinglastdayform.markAllAsTouched();
    }
  }
}
