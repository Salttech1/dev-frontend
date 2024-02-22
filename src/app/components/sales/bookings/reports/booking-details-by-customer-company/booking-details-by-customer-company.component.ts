import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { buttonsList } from 'src/app/shared/interface/common';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-booking-details-by-customer-company',
  templateUrl: './booking-details-by-customer-company.component.html',
  styleUrls: ['./booking-details-by-customer-company.component.css'],
})
export class BookingDetailsByCustomerCompanyComponent implements OnInit {
  config = {
    isLoading: false,
  };

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'download',
    'print',
    'reset',
    'exit',
  ]);

  ReportCriteria: FormGroup = this.formBuilder.group({
    custCoy: '',
  });

  loaderToggle: boolean = false;

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    public _service: ServiceService,
    private _commonReport: CommonReportsService
  ) {}

  ngOnInit(): void {}

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
      let payload: any = {
        name: 'BkDetByCustomer.rpt',
        exportType: 'PDF',
        isPrint: false,
        seqId: 1,
        reportParameters: {
          custCoy: this.ReportCriteria.get('custCoy')?.value[0][0]?.trimEnd(),
          formname: "'FrmBkingDetByCustCoyLBRC'",
        },
      };
      this.PrintReport(payload, isPrint);
      this.config.isLoading = false;
    }
  }

  PrintReport(payload: any, isPrint: boolean) {
    this._commonReport.getTtxParameterizedReport(payload).subscribe({
      next: (res: any) => {
        this.loaderToggle = false;
        let pdfFile = new Blob([res], { type: 'application/pdf' });
        let fileName = this._commonReport.getReportName();
        if (isPrint) {
          const blobUrl = URL.createObjectURL(pdfFile);
          const oWindow = window.open(blobUrl, '_blank');
          // oWindow?.print();
        } else {
          fileSaver.saveAs(pdfFile, fileName);
        }
      },
      error: (error) => {
        this.config.isLoading = false;
      },
    });
  }

  // PrintReport(payload: any, isPrint: boolean) {
  //   this._commonReport.getTtxParameterizedPrintReport(payload).subscribe({
  //     next: (res) => {
  //       if (res) {
  //         this.commonPdfReport(isPrint, res);
  //       }
  //     },
  //     error: (error) => {
  //       this.config.isLoading = false;
  //     },
  //   });
  // }

  // commonPdfReport(print: Boolean, res: any) {
  //   let filename = this._commonReport.getReportName();
  //   this.config.isLoading = false;
  //   this._service.exportReport(print, res, 'PDF', filename);
  // }
}
