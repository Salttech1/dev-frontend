import { HttpParams } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { VehicleexpService } from 'src/app/services/adminexp/vehicleexp.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-excess-km-run-report',
  templateUrl: './excess-km-run-report.component.html',
  styleUrls: ['./excess-km-run-report.component.css'],
})
export class ExcessKmRunReportComponent implements OnInit {
  loaderToggle: boolean = false;

  constructor(
    private router: Router,
    private _service: ServiceService,
    private vehicleExpService: VehicleexpService,
    private commonReportService: CommonReportsService,
    private toastr: ToastrService,
    private rendered: Renderer2
  ) {}

  ngOnInit(): void {
    setTimeout(function () {
      document.getElementById('fromDateField')?.focus();
    }, 100);
    this._service.pageData.subscribe({
      next: (val) => {
        this.ExcessKmRunSelectionform.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
    this.getNum1OnClass('PETR', 'RATE', 'petrol');
    this.getNum1OnClass('DESL', 'RATE', 'diesel');
  }

  ExcessKmRunSelectionform = new FormGroup({
    name: new FormControl('ExcessKmRunReport.rpt'),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    conditionId: new FormControl(1),
    isdisposed: new FormControl(false),

    reportParameters: new FormGroup({
      formname: new FormControl(''),
      head: new FormControl(''),
      Frmdate: new FormControl<Date | null>(null, Validators.required),
      Todate: new FormControl<Date | null>(null, Validators.required),
      TxtFromDate: new FormControl<String>(''),
      TxtToDate: new FormControl<String>(''),
      FromDate: new FormControl(''),
      ToDate: new FormControl(''),
      petrol: new FormControl<number>(0, [
        Validators.required,
        Validators.min(1),
        Validators.maxLength(1),
      ]),
      diesel: new FormControl<number>(0, [
        Validators.required,
        Validators.min(1),
        Validators.maxLength(1),
      ]),
    }),
  });

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  validateInvalidFormat(event: any, id: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.toastr.error('Please Enter Valid Date');
      this.rendered.selectRootElement(`#${id}`)?.focus();
    } else {
      let startDate = moment(
        this.ExcessKmRunSelectionform.get('reportParameters.Frmdate')?.value
      ).format('YYYY-MM-DD');
      let endDate = moment(
        this.ExcessKmRunSelectionform.get('reportParameters.Todate')?.value
      ).format('YYYY-MM-DD');
      console.log(endDate);
      if (moment(startDate).isAfter(endDate)) {
        this.toastr.error('To Date Should not be Less than From Date');
        this.ExcessKmRunSelectionform.get('reportParameters.Todate')?.reset();
        this.rendered.selectRootElement(`#${id}`)?.focus();
      } else {
        let startMonth =
          moment(
            this.ExcessKmRunSelectionform.get('reportParameters.Frmdate')?.value
          ).month() + 1;
        let endMonth = moment(
          this.ExcessKmRunSelectionform.get('reportParameters.Todate')?.value
        ).month()
          ? moment(
              this.ExcessKmRunSelectionform.get('reportParameters.Todate')
                ?.value
            ).month() + 1
          : 0;
        console.log('endMoth', endMonth);
        if (!(startMonth == endMonth) && endMonth! - 0) {
          this.toastr.error('From Date and To Date Month Should be Same');
          this.ExcessKmRunSelectionform.get('reportParameters.Todate')?.reset();
          this.rendered.selectRootElement(`#${id}`)?.focus();
        } else {
          let startYear = moment(
            this.ExcessKmRunSelectionform.get('reportParameters.Frmdate')?.value
          ).year();
          let endYear = moment(
            this.ExcessKmRunSelectionform.get('reportParameters.Todate')?.value
          ).year()
            ? moment(
                this.ExcessKmRunSelectionform.get('reportParameters.Todate')
                  ?.value
              ).year()
            : 0;
          if (!(startYear == endYear) && endYear! - 0) {
            this.toastr.error('From Date and To Date Year Should be Same');
            this.ExcessKmRunSelectionform.get(
              'reportParameters.Todate'
            )?.reset();
            this.rendered.selectRootElement(`#${id}`)?.focus();
          }
        }
      }
    }
  }

  // /fetch-num1-by-class-and-id
  getNum1OnClass(Class: string, id: string, controlName: any) {
    this.vehicleExpService
      .fetchNum1ByClassAndId(Class, id)
      .subscribe((res: any) => {
        if (res.status) {
          console.log(controlName);
          this.ExcessKmRunSelectionform.controls.reportParameters
            .get(controlName)
            ?.patchValue(res.data);
        }
      });
  }

  getReport(print: boolean) {
    if (this.ExcessKmRunSelectionform.valid) {
      this.loaderToggle = true;
      this.setReportValues();
      this.commonReportService
        .getTtxParameterizedReport(this.ExcessKmRunSelectionform.value)
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
      console.log(" this.ExcessKmRunSelectionform",  this.ExcessKmRunSelectionform?.value)
      this.toastr.error('Please fill the input properly');
      this.ExcessKmRunSelectionform.markAllAsTouched();
    }
  }

  setReportValues() {
    // this.fetchCompanyCloseDate();
    this.ExcessKmRunSelectionform.patchValue({
      reportParameters: {
        TxtFromDate: moment(
          this.ExcessKmRunSelectionform.controls['reportParameters'].controls[
            'Frmdate'
          ].value,
          'YYYY-MM-DD'
        ).format('DD/MM/YYYY'),
        TxtToDate: moment(
          this.ExcessKmRunSelectionform.controls['reportParameters'].controls[
            'Todate'
          ].value,
          'YYYY-MM-DD'
        ).format('DD/MM/YYYY'),
        petrol:
          this.ExcessKmRunSelectionform.controls['reportParameters'].controls[
            'petrol'
          ].value,
        diesel:
          this.ExcessKmRunSelectionform.controls['reportParameters'].controls[
            'diesel'
          ].value,
        FromDate: `'${moment(
          this.ExcessKmRunSelectionform.controls['reportParameters'].controls[
            'Frmdate'
          ].value,
          'YYYY-MM-DD'
        ).format('DD/MM/YYYY')}'`,
        ToDate: `'${moment(
          this.ExcessKmRunSelectionform.controls['reportParameters'].controls[
            'Todate'
          ].value,
          'YYYY-MM-DD'
        ).format('DD/MM/YYYY')}'`,
      },
    });
  }
}
