import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { fileConstants } from 'src/constants/fileconstants';
import * as moment from 'moment';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-monthwise-detail-vehicle-expense-report',
  templateUrl: './monthwise-detail-vehicle-expense-report.component.html',
  styleUrls: ['./monthwise-detail-vehicle-expense-report.component.css'],
})
export class MonthwiseDetailVehicleExpenseReportComponent implements OnInit {
  loaderToggle: boolean = false;
  accYear!: string;
  styyyy!: number;
  endyyyy!: number;

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private _service: ServiceService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.setAccountingYear();
    this._service.pageData.subscribe({
      next: (val) => {
        this.MthDetExpRep.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
  }

  MthDetExpRep = new FormGroup({
    name: new FormControl(fileConstants.VehMthDetExpRep),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    conditionId: new FormControl(1),
  

    reportParameters: new FormGroup({
      formname: new FormControl(''),
      TxtAccYear: new FormControl('',[Validators.required, Validators.minLength(9), Validators.pattern("^[0-9]{4}[\-]{1}[0-9]{4}$"), yearRange()]),
      reportOption:new FormControl('detail'),
      isdisposed: new FormControl(false),
      currstdate: new FormControl(''),
      currenddate: new FormControl(''),
      styyyymm:new FormControl(''),
      endyyyymm:new FormControl(''),
      FY_yyyy_yyyy_3 :new FormControl(''),
      FY_yyyy_yyyy_2 :new FormControl(''),
      FY_yyyy_yyyy_1 :new FormControl(''),
      currstyyyymm :new FormControl(''),
      currendyyyymm :new FormControl(''),
      Yr1:new FormControl(''),
      Yr2:new FormControl(''),
      Year1:new FormControl(''),
      Year2:new FormControl(''),
      Year3:new FormControl(''),
    }),
  });

  checkBoxToggle(event: any) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.target.checked
        ? (event.target.checked = false)
        : (event.target.checked = true);
    }
  }

  getReport(print: boolean) {
    if (this.MthDetExpRep.valid){
    this.loaderToggle = true;
    let dispose = this.MthDetExpRep.get('isdisposed')?.value;
    console.log(dispose);
    dispose
      ? this.MthDetExpRep.patchValue({ conditionId: 2 })
      : this.MthDetExpRep.patchValue({ conditionId: 1 });
    // debugger
    this.setReportValues();
    this.commonReportService
      .getTtxParameterizedReportWithCondition(this.MthDetExpRep.value)
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

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  setAccountingYear() {
    if (new Date().getMonth() + 1 >= 4) {
      this.MthDetExpRep.patchValue({
        reportParameters: {
          TxtAccYear: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString(),
        },
      });
      this.accYear =  new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString() ;
    } else {
      this.MthDetExpRep.patchValue({
        reportParameters: {
          TxtAccYear: (new Date().getFullYear() - 1).toString() + '-' + new Date().getFullYear().toString(),
        },
      });
      this.accYear =  (new Date().getFullYear() - 1).toString() + '-' + new Date().getFullYear().toString();
    }
  }

  setReportValues() {
    // let repoption = this.MthDetExpRep.controls['reportParameters'].get('reportOption')?.value;
    
    // repoption == 'detail'? this.MthDetExpRep.controls.name.patchValue('VehMonthwiseRpt.rpt')  : this.MthDetExpRep.controls.name.patchValue('VehMonthwiseSummRpt.rpt');
      this.styyyy = Number(this.MthDetExpRep.controls['reportParameters'].get('TxtAccYear')?.value?.split("-")[0])
      this.endyyyy =  Number(this.MthDetExpRep.controls['reportParameters'].get('TxtAccYear')?.value?.split("-")[1])
      this.MthDetExpRep.patchValue({
        name : this.MthDetExpRep.controls['reportParameters'].get('reportOption')?.value == 'detail' ?  'VehMonthwiseRpt.rpt' :   'VehMonthwiseSummRpt.rpt',
        reportParameters: {
          currstdate : "01/04/" + this.MthDetExpRep.controls['reportParameters'].get('TxtAccYear')?.value?.split("-")[0],
          currenddate : "31/03/" + this.MthDetExpRep.controls['reportParameters'].get('TxtAccYear')?.value?.split("-")[1],
          styyyymm : `${this.styyyy - 3}04` , //201904
          endyyyymm :  `${this.styyyy }03` , //202203
          FY_yyyy_yyyy_3 : `${this.styyyy - 3}-${this.endyyyy - 3}`, //2019-2020
          Year3 : `'${this.styyyy - 3}-${this.endyyyy - 3}'`,
          FY_yyyy_yyyy_2 : `${this.styyyy - 2}-${this.endyyyy - 2}`, //2020-2021
          Year2 : `'${this.styyyy - 2}-${this.endyyyy - 2}'`,
          FY_yyyy_yyyy_1 : `${this.styyyy - 1}-${this.endyyyy - 1}`, //2021-2022
          Year1 : `'${this.styyyy - 1}-${this.endyyyy - 1}'`,
          currstyyyymm : `${this.styyyy}04`, //202204
          currendyyyymm : `${this.endyyyy}03`,  //202303
  
          Yr1 : `'${this.MthDetExpRep.controls['reportParameters'].get('TxtAccYear')?.value?.split("-")[0]}'` ,
          Yr2 : `'${this.MthDetExpRep.controls['reportParameters'].get('TxtAccYear')?.value?.split("-")[1]}'`,
        },
      });
      console.log("------->",this.MthDetExpRep);
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
