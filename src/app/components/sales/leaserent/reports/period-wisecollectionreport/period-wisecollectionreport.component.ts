import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-period-wisecollectionreport',
  templateUrl: './period-wisecollectionreport.component.html',
  styleUrls: ['./period-wisecollectionreport.component.css']
})
export class PeriodWisecollectionreportComponent implements OnInit {
  loaderToggle: boolean = false;

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private _service: ServiceService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }
  periodwisecollectionform = new FormGroup({
    name: new FormControl('LsPeriodwiseColl.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      FromDate: new FormControl(null, [Validators.required]),
      ToDate: new FormControl(null, [Validators.required]),
    }),
  });

  getReport(print: boolean) {
    if (this.periodwisecollectionform.valid) {
      let FromDate = `'${this.periodwisecollectionform.controls['reportParameters'].get('FromDate')?.value}'`;
      let ToDate = `'${this.periodwisecollectionform.controls['reportParameters'].get('ToDate')?.value}'`;
      

      let payload: any = {
        name: 'LsPeriodwiseColl.rpt',
        isPrint: false,
        reportParameters: {
          formname: "'test'",
          FromDate: moment(FromDate).format('YYYY-MM-DD'),
          ToDate: moment(ToDate).format('YYYY-MM-DD'),
        },
        
      };

      console.log("payload",payload);
      

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

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  

}

}
