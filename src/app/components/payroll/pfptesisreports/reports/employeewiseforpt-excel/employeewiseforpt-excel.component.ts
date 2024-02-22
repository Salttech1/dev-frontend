import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'YYYYMM',
  },
  display: {
    dateInput: 'YYYYMM',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
}


@Component({
  selector: 'app-employeewiseforpt-excel',
  templateUrl: './employeewiseforpt-excel.component.html',
  styleUrls: ['./employeewiseforpt-excel.component.css'],
  providers: [
    //   the above line required for date format
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }
  ]
})
export class EmployeewiseforptExcelComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  // hotelPropYN: any ;
  empTypeVisible: boolean = false;
  fetchRequestAPI: any;

  employeewiseforptexcel = new FormGroup({
    name: new FormControl(''),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PCompany: new FormControl<String[]>([], Validators.required),
      PDept: new FormControl<String[]>([]),
      PEmpCode: new FormControl<String[]>([]),
      PSalType: new FormControl<String[]>([]),  
      PPayMonth: new FormControl('', Validators.required),
      PPayDate: new FormControl(''),
      PEmpType: new FormControl(''),            
      // PEmpType: new FormControl({value:'',disabled:true}),      
    }),
  });

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService,
    private rendered: Renderer2,
    private payreportsService: PayreportsService,
  ) {}

  ngOnInit(): void {
    this.GetDefaultValue();
  }


  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }


  exportReport() {
    if (this.employeewiseforptexcel?.valid) {
      this.loaderToggle = true;
      let coyCodes  = `${this.employeewiseforptexcel.controls['reportParameters']?.get('PCompany')?.value?.[0][0]}` ;
      let deptCodes = this.employeewiseforptexcel.controls['reportParameters']?.get('PDept')?.value?.length !== 0
                    ? `'${this.employeewiseforptexcel.controls['reportParameters']?.get('PDept')?.value?.join("','")}'`
                    : '' ;
      let empCodes  = this.employeewiseforptexcel.controls['reportParameters']?.get('PEmpCode')?.value?.length !== 0
                    ? `'${this.employeewiseforptexcel.controls['reportParameters']?.get('PEmpCode')?.value?.join("','")}'` 
                    : '' ;
      let salTypes = this.employeewiseforptexcel.controls['reportParameters']?.get('PSalType')?.value?.length !== 0
                    ? `'${this.employeewiseforptexcel.controls['reportParameters']?.get('PSalType')?.value?.join("','")}'` 
                    : '' ;
      let payMonth  = `${this.employeewiseforptexcel.controls['reportParameters']?.get('PPayMonth')?.value}` 
                    ? `${moment(this.employeewiseforptexcel.controls['reportParameters']?.get('PPayMonth')?.value).format('YYYYMM')}` 
                    : '' ;
      let payDate   = this.employeewiseforptexcel.controls['reportParameters']?.get('PPayDate')?.value 
                      ? `'${moment(this.employeewiseforptexcel.controls['reportParameters']?.get('PPayDate')?.value).format('DD/MM/YYYY')}'` 
                      : '' ;
      // let hotelPropYN = 'Y' // to change later
      let empType  = this.employeewiseforptexcel.controls['reportParameters']?.get('PEmpType')?.value?.length !== 0 
                      ? `${this.employeewiseforptexcel.controls['reportParameters']?.get('PEmpType')?.value}`
                      : '' ;

      // console.log("var",deptCodes);      
      // console.log("value of Dept",this.employeewisemonthlysummaryexcel.controls['reportParameters']?.get('PDept')?.value) ;

      console.log("Pay Month ", payMonth);
      this.payreportsService.CreateEmpMonthlySummaryPTFile(coyCodes,deptCodes,empCodes,salTypes,payMonth,payDate,empType).subscribe( {
        next: (res) => {
            this.loaderToggle = false
            let excelFile = new Blob([res], { type: 'xls' });
                // FEHO MthSumPT202306.xls
          let filename = coyCodes + 'MthSumPT' +  payMonth + ".xls"
          console.log("filename ", filename);
          fileSaver.saveAs(excelFile, filename);
        },
        error: (error) => {
              if (error.status == 400) {
                this.loaderToggle = false
                this.toastr.error('Something went wrong 400');
              } else {
                this.loaderToggle = false
                this.toastr.error('Something went wrong not 400');
              }
            },
      });        
    }
    else {
      this.employeewiseforptexcel.markAllAsTouched()
    }
  }

  getReport(print: boolean) {
    console.log("fromvalue",this.employeewiseforptexcel.value);  
    if (this.employeewiseforptexcel.valid) {

      this.loaderToggle = true;
      console.log("payload",this.payLoad);    //FOR DEBUG

      this.commonReportService
        .getParameterizedReport(this.payLoad)
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

GetDefaultValue(){
  this.employeewiseforptexcel.patchValue({
    reportParameters: {
    PPayMonth: `${moment(Date()).format('YYYY')}${moment(Date()).format('MM')}`
    }
    
 })
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      this.empTypeVisible = res.data.hotelYN == "Y" ?  true : false ;
      console.log("resdata",res.data.hotelYN);      
      console.log("a",this.empTypeVisible);
      this.employeewiseforptexcel.patchValue({
        reportParameters: {
          // PPayMonth: moment(res.data.frompaymonth.substring(0, 4)+'-'+res.data.frompaymonth.substring(4, 6)+'-'+'01','YYYY-MM-DD').format('YYYYMM')
        PPayMonth: res.data.frompaymonth
        }
        
     })
     console.log("-->paymonth",moment(res.data.frompaymonth.substring(0, 4)+'-'+res.data.frompaymonth.substring(4, 6)+'-'+'01','YYYY-MM-DD').format('YYYYMM'));
     
    }
  });
  }

  chosenMonthHandler(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, dateCtrl: any) {
    console.log("normalizedMonthAndYear",normalizedMonthAndYear.month());
    
    if (!dateCtrl?.valid) {
      this.employeewiseforptexcel.patchValue({
        reportParameters: {
          PPayMonth: normalizedMonthAndYear.format('YYYYMM')
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
