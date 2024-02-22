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
  selector: 'app-billprinting',
  templateUrl: './billprinting.component.html',
  styleUrls: ['./billprinting.component.css']
})
export class BillprintingComponent implements OnInit {
  loaderToggle: boolean = false;

  constructor(
    private router: Router,
    private _service: ServiceService,
    private vehicleExpService: VehicleexpService,
    private commonReportService: CommonReportsService,
    private toastr: ToastrService,
    private rendered: Renderer2
  ) { }



 

  ngOnInit(): void {
  }

  billprintingform = new FormGroup({
    name: new FormControl('LeaseRentBill.rpt'),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    conditionId: new FormControl(1),
    isdisposed: new FormControl(false),

    reportParameters: new FormGroup({
      formname: new FormControl('test'),
      TxtFrom: new FormControl(''),
      Txtto: new FormControl(''),
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
        this.billprintingform.get('reportParameters.Frmdate')?.value
      ).format('YYYY-MM-DD');
      let endDate = moment(
        this.billprintingform.get('reportParameters.Txtto')?.value
      ).format('YYYY-MM-DD');
      console.log(endDate);
      if (moment(startDate).isAfter(endDate)) {
        this.toastr.error('To Date Should not be Less than From Date');
        this.billprintingform.get('reportParameters.Txtto')?.reset();
        this.rendered.selectRootElement(`#${id}`)?.focus();
      } else {
        let startMonth =
          moment(
            this.billprintingform.get('reportParameters.Frmdate')?.value
          ).month() + 1;
        let endMonth = moment(
          this.billprintingform.get('reportParameters.Txtto')?.value
        ).month()
          ? moment(
              this.billprintingform.get('reportParameters.Txtto')
                ?.value
            ).month() + 1
          : 0;
        console.log('endMoth', endMonth);
        if (!(startMonth == endMonth) && endMonth! - 0) {
          this.toastr.error('From Date and To Date Month Should be Same');
          this.billprintingform.get('reportParameters.Txtto')?.reset();
          this.rendered.selectRootElement(`#${id}`)?.focus();
        } else {
          let startYear = moment(
            this.billprintingform.get('reportParameters.Frmdate')?.value
          ).year();
          let endYear = moment(
            this.billprintingform.get('reportParameters.Txtto')?.value
          ).year()
            ? moment(
                this.billprintingform.get('reportParameters.Txtto')
                  ?.value
              ).year()
            : 0;
          if (!(startYear == endYear) && endYear! - 0) {
            this.toastr.error('From Date and To Date Year Should be Same');
            this.billprintingform.get(
              'reportParameters.Txtto'
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
          this.billprintingform.controls.reportParameters
            .get(controlName)
            ?.patchValue(res.data);
        }
      });
  }

  getReport(print: boolean) {
    if (this.billprintingform.valid) {
      this.loaderToggle = true;
      this.setReportValues();

        let test={
        "name": "LeaseRentBill.rpt",
        "isPrint": false,
        "seqId": 1,
        "conditionId": 1,
        "isdisposed": false,
        "reportParameters": {
          "formname": "test",
          "TxtFrom": "' '",
          "Txtto": "' '"
        }
      }
      this.commonReportService
        .getTtxParameterizedReport(test)
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
      console.log(" this.billprintingform",  this.billprintingform?.value)
      this.toastr.error('Please fill the input properly');
      this.billprintingform.markAllAsTouched();
    }
  }

  setReportValues() {
    // this.fetchCompanyCloseDate();
    this.billprintingform.patchValue({
      reportParameters: {
       
        TxtFrom: `'${moment(
          this.billprintingform.controls['reportParameters'].controls[
            'TxtFrom'
          ].value,
          'YYYY-MM-DD'
        ).format('DD/MM/YYYY')}'`,
        Txtto: `'${moment(
          this.billprintingform.controls['reportParameters'].controls[
            'Txtto'
          ].value,
          'YYYY-MM-DD'
        ).format('DD/MM/YYYY')}'`,
      },
    });
  }
}
