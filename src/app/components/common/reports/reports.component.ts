import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize, Subscription, switchMap, take, timer } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit, OnDestroy {
  reportsData!: any[];
  loader: boolean = false;
  subscription!: Subscription;

  constructor(
    private _CommonReport: CommonReportsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getReportStatus();
  }

  getReportStatus() {
    this.subscription = timer(0, 5000)
      .pipe(switchMap(() => this._CommonReport.getReport()))
      .subscribe((res: any) => {
        this.reportsData = res.data;
      });
  }

  downloadReport(report: any) {
    this.loader = true;
    this._CommonReport
      .downloadReport(report.id)
      .pipe(
        take(1),
        finalize(() => (this.loader = false))
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            let file = new Blob();
            let name = '';
            const time = moment().format('YYYYMMDD_HH_mm_ss');
            switch (report?.exportType) {
              case 'PDF':
                file = new Blob([res], { type: 'application/pdf' });
                name = report.reportName + time + '.pdf';
                break;
              case 'EXCEL':
                file = new Blob([res], { type: 'application/csv' });
                name = report.reportName + time + '.xls';
            }

            fileSaver.saveAs(file, name);
          }
        },
      });
  }

  deleteReport(report: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this report!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader = true;
        this._CommonReport
          .deleteReport(report.id)
          .pipe(
            take(1),
            finalize(() => (this.loader = false))
          )
          .subscribe({
            next: () => {
              this.toastr.success('Report Deleted Successfully', 'Deleted');
              this.loader = true;
              this._CommonReport
                .getReport()
                .pipe(
                  take(1),
                  finalize(() => (this.loader = false))
                )
                .subscribe((res: any) => {
                  this.reportsData = res.data;
                });
            },
          });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
