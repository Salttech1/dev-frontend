import { Component, OnInit, Renderer2 } from '@angular/core';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { finalize, switchMap, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { OutgoingService } from 'src/app/services/sales/outgoing.service';
import { SalesService } from 'src/app/services/sales/sales.service';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-msmepartiesreport',
  templateUrl: './msmepartiesreport.component.html',
  styleUrls: ['./msmepartiesreport.component.css'],
})
export class MsmepartiesreportComponent implements OnInit {
  loaderToggle: boolean = false;
  formname!: any;

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private _service: ServiceService,
    private toastr: ToastrService,
    private rendered: Renderer2
  ) {}

  ngOnInit(): void {
   
  }

  msmeReport = new FormGroup({
    name: new FormControl('MSMEPartyWiseReports.rpt'),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    conditionId: new FormControl(1),

    reportParameters: new FormGroup({
      formname: new FormControl(''),
      head: new FormControl(''),
      SecID: new FormControl(''),
      Fromdate: new FormControl<Date | null>(null, Validators.required),
      ToDate: new FormControl<Date | null>(null, Validators.required),
      TxtFrmDate: new FormControl<String>(''),
      TxtToDate: new FormControl<String>(''),
      txtCompanyCode: new FormControl<String[]>([]),
    }),
  });

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  getReport(print: boolean) {
    if (this.msmeReport.valid) {
      this.loaderToggle = true;
      let reval =
        this.msmeReport.controls['reportParameters']?.get(
          'txtCompanyCode'
        )?.value;
      this.loaderToggle = true;

      let trimval = reval?.map((val) => val.toString().trim());
      let PartyDet = {
        name: 'MSMEPartyWiseReports.rpt',
        isPrint: false,
        seqId: 1,
        conditionId: this.msmeReport.controls['reportParameters']?.get(
          'txtCompanyCode'
        )?.value?.length
          ? 1
          : 2,
        reportParameters: {
          SecID: '',
          formname: this.formname,
          txtCompanyCode: `${trimval?.join(`','`)}`,
          TxtFromDate: moment(
            this.msmeReport.controls['reportParameters'].controls['Fromdate']
              .value,
            'YYYY-MM-DD'
          ).format('DD/MM/YYYY'),
          TxtToDate: moment(
            this.msmeReport.controls['reportParameters'].controls['ToDate']
              .value,
            'YYYY-MM-DD'
          ).format('DD/MM/YYYY'),
          Fromdate: `'${moment(
            this.msmeReport.controls['reportParameters'].controls['Fromdate']
              .value,
            'YYYY-MM-DD'
          ).format('DD/MM/YYYY')}'`,
          ToDate: `'${moment(
            this.msmeReport.controls['reportParameters'].controls['ToDate']
              .value,
            'YYYY-MM-DD'
          ).format('DD/MM/YYYY')}'`,
        },
      };
      this.commonReportService
        .getParameterizedReport(PartyDet)
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

  validateInvalidFormat(event: any, id: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.toastr.error('Please Enter Valid Date');
      this.rendered.selectRootElement(`#${id}`)?.focus();
    } else {
      let startDate = moment(
        this.msmeReport.get('reportParameters.Fromdate')?.value
      ).format('YYYY-MM-DD');
      let endDate = moment(
        this.msmeReport.get('reportParameters.ToDate')?.value
      ).format('YYYY-MM-DD');
      console.log(endDate);
      if (moment(startDate).isAfter(endDate)) {
        this.toastr.error('To Date Should not be Less than From Date');
        this.msmeReport.get('reportParameters.ToDate')?.reset();
        this.rendered.selectRootElement(`#${id}`)?.focus();
      }
    }
  }
}
