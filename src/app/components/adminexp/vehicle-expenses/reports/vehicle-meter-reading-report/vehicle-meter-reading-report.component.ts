import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-vehicle-meter-reading-report',
  templateUrl: './vehicle-meter-reading-report.component.html',
  styleUrls: ['./vehicle-meter-reading-report.component.css']
})
export class VehicleMeterReadingReportComponent implements OnInit {

  loaderToggle: boolean = false;
  accYear!: string;
  formname!: any;

  VehicleMeterReadingRep: FormGroup = new FormGroup({
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    name: new FormControl<string>('VehicleKmsRun.rpt', Validators.required),
    TxtAccYear: new FormControl('',[Validators.required, Validators.minLength(9), Validators.pattern("^[0-9]{4}[\-]{1}[0-9]{4}$"), yearRange()]),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      fromyear:new FormControl(''),
      toyear:new FormControl(''),
    }),
  });
  
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private _service: ServiceService,
    private commonReportService: CommonReportsService,
  ) { }

  ngOnInit(): void {
    this.setAccountingYear();
    this._service.pageData.subscribe({
      next: (val) => {
        this.formname = `${val.formName}`;
        this.VehicleMeterReadingRep.patchValue({
          reportParameters: {
            formname: `${val.formName}`,
          },
        });
      },
    });
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  setAccountingYear() {
    if (new Date().getMonth() + 1 >= 4) {
      this.VehicleMeterReadingRep.patchValue({
        TxtAccYear: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString(),
      });
      this.accYear =  new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString() ;
    } else {
      this.VehicleMeterReadingRep.patchValue({
        TxtAccYear: (new Date().getFullYear() - 1).toString() + '-' + new Date().getFullYear().toString(),
      });
      this.accYear =  (new Date().getFullYear() - 1).toString() + '-' + new Date().getFullYear().toString();
    }
  }

  getReport(print: boolean) {
    console.log('form',this.VehicleMeterReadingRep)
    if (this.VehicleMeterReadingRep.valid){
    this.loaderToggle = true;
    this.setReportValues();

    this.commonReportService
    .getParameterizedReport(this.VehicleMeterReadingRep.value)
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
      this.toastr.error('Please fill the input properly')
    
    }
  }

  setReportValues() {
      this.VehicleMeterReadingRep.patchValue({
        reportParameters: {
 
          fromyear : `${this.VehicleMeterReadingRep.get('TxtAccYear')?.value?.split("-")[0]}` ,
          toyear : `${this.VehicleMeterReadingRep.get('TxtAccYear')?.value?.split("-")[1]}`,
        },
      });
      console.log("------->",this.VehicleMeterReadingRep);
  }

}

export function yearRange(): ValidatorFn {
  return (_control: AbstractControl): ValidationErrors | null => {
    let yearVal = _control.value
    let firstFourCharacter = yearVal.slice(0, 4)
    let secondFourCharacter = yearVal.slice(5, 9)
    if (secondFourCharacter > firstFourCharacter && secondFourCharacter - firstFourCharacter == 1) {
      return null
    }
    return { 'yearVal': true }

  };

}
