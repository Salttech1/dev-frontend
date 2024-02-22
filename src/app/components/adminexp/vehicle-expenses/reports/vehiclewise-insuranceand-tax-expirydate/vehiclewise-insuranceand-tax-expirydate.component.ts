import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { fileConstants } from 'src/constants/fileconstants';
import * as fileSaver from 'file-saver';
import { ServiceService } from 'src/app/services/service.service';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehiclewise-insuranceand-tax-expirydate',
  templateUrl: './vehiclewise-insuranceand-tax-expirydate.component.html',
  styleUrls: ['./vehiclewise-insuranceand-tax-expirydate.component.css']
})
export class VehiclewiseInsuranceandTaxExpirydateComponent implements OnInit {
  loaderToggle: boolean = false;

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private _service: ServiceService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this._service.pageData.subscribe({
      next: (val) => {
        this.VehInsTaxSelectionform.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
  }

  VehInsTaxSelectionform = new FormGroup({
    name: new FormControl(fileConstants.vehicleInsTaxExpiryDate),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      month: new FormControl(''),
      StrLocMonthYear: new FormControl(''),
      fromDate: new FormControl(moment(),Validators.required) 
    })
  })

  handleExitClick(){
    this.router.navigate(['/dashboard'])
  }

  getReport(print: boolean){
    if (this.VehInsTaxSelectionform.valid){
    this.loaderToggle = true;
    this.setReportValues();
    this.commonReportService.getTtxParameterizedReport(this.VehInsTaxSelectionform.value).pipe(take(1)).subscribe({
      next: (res: any) => {
        this.loaderToggle = false
        let pdfFile = new Blob([res], { type: "application/pdf" });
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
          this.loaderToggle = false
         },
        complete: () => {
          this.loaderToggle = false
        }
    })
  } else {
    this.toastr.error('Please fill the input properly')
  }
}

setReportValues() {
  this.VehInsTaxSelectionform.patchValue({
    reportParameters: {
      StrLocMonthYear: moment(this.VehInsTaxSelectionform.get('reportParameters.fromDate')?.value).format('MMYYYY'),
      month: `'${moment(this.VehInsTaxSelectionform.get('reportParameters.fromDate')?.value).format('MMMMYYYY')}'`,


    },
  });
}

chosenMonthHandler(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, dateCtrl: any) {
  if (!dateCtrl?.valid) {
    this.VehInsTaxSelectionform.patchValue({
      reportParameters: {
        fromDate: normalizedMonthAndYear
      }
    })
  }
  const ctrlValue: any = dateCtrl?.value
  ctrlValue?.month(normalizedMonthAndYear?.month());
  ctrlValue?.year(normalizedMonthAndYear?.year())
  dateCtrl?.setValue(ctrlValue)
  datepicker.close();
}

}
