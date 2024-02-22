import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { buttonsList } from 'src/app/shared/interface/common';

@Component({
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.css'],
})
export class BookingReportComponent implements OnInit {
  // maxDate = new Date(); // use for future date disabled
  config = {
    isLoading: false,
  };
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'download',
    'print',
    'reset',
    'exit',
  ]);

  ReportCriteria: FormGroup = this.fb.group({
    reportType: ['detail'],
    bookingDate: this.fb.group({
      fromDate: [null, [Validators.required]],
      toDate: [null, Validators.required],
    }),
    custType: [''],
  });

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private _commonReport: CommonReportsService,
    public _service: ServiceService
  ) {}

  ngOnInit(): void {}

  // list action buttons method
  buttonAction(event: string) {
    if (event === 'download') {
      this.downloadReport(false);
    } else if (event === 'print') {
      this.downloadReport(true);
    } else if (event === 'exit') {
      this.router.navigateByUrl('/dashboard');
    } else if (event === 'reset') {
      this.ReportCriteria.reset();
    }
  }

  downloadReport(isPrint: boolean) {
    if (this.ReportCriteria.valid) {
      const reportChoice: string = this.ReportCriteria.getRawValue().reportType;
     
      let payload: any = {
        name: reportChoice.includes('detail')
          ? 'Web_Bookingreport_Detail.rpt'
          : 'Web_Bookingreport_Concise.rpt',
        exportType: 'PDF',
        isPrint: false,
        seqId: 1,
        reportParameters: {
          fromDate: this.ReportCriteria.getRawValue().bookingDate.fromDate
            ? moment(
                this.ReportCriteria.getRawValue().bookingDate.fromDate
              ).format('YYYY-MM-DD')
            : '',
          toDate: this.ReportCriteria.getRawValue().bookingDate.toDate
            ? moment(
                this.ReportCriteria.getRawValue().bookingDate.toDate
              ).format('YYYY-MM-DD')
            : '',

          custType: this.ReportCriteria.getRawValue().custType ? "'N'" : '',   //N means Only NRI
        },
      };
      this.PrintReport(payload, isPrint);
      this.config.isLoading = false;
    }
  }

  PrintReport(payload: any, isPrint: boolean) {
    this._commonReport.getParameterizedReport(payload).subscribe({
      next: (res) => {
        if (res) {
          this.commonPdfReport(isPrint, res);
        }
      },
      error: (error) => {
        this.config.isLoading = false;
      },
    });
  }

  commonPdfReport(print: Boolean, res: any) {
    let filename = this._commonReport.getReportName();
    this.config.isLoading = false;
    this._service.exportReport(print, res, 'PDF', filename);
  }
 
}
