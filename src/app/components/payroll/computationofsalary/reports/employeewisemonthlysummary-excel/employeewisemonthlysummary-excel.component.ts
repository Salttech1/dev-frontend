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
  selector: 'app-employeewisemonthlysummary-excel',
  templateUrl: './employeewisemonthlysummary-excel.component.html',
  styleUrls: ['./employeewisemonthlysummary-excel.component.css'],
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

export class EmployeewisemonthlysummaryExcelComponent implements OnInit {
  loaderToggle: boolean = false;
  payLoad: any ;
  // hotelPropYN: any ;
  empTypeVisible: boolean = false;
  fetchRequestAPI: any;

  employeewisemonthlysummaryexcel = new FormGroup({
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
    if (this.employeewisemonthlysummaryexcel?.valid) {
      this.loaderToggle = true;
      let coyCodes  = `${this.employeewisemonthlysummaryexcel.controls['reportParameters']?.get('PCompany')?.value?.[0][0]}` ;
      let deptCodes = this.employeewisemonthlysummaryexcel.controls['reportParameters']?.get('PDept')?.value?.length !== 0
                    ? `'${this.employeewisemonthlysummaryexcel.controls['reportParameters']?.get('PDept')?.value?.join("','")}'`
                    : '' ;
      let empCodes  = this.employeewisemonthlysummaryexcel.controls['reportParameters']?.get('PEmpCode')?.value?.length !== 0
                    ? `'${this.employeewisemonthlysummaryexcel.controls['reportParameters']?.get('PEmpCode')?.value?.join("','")}'` 
                    : '' ;
      let salTypes = this.employeewisemonthlysummaryexcel.controls['reportParameters']?.get('PSalType')?.value?.length !== 0
                    ? `'${this.employeewisemonthlysummaryexcel.controls['reportParameters']?.get('PSalType')?.value?.join("','")}'` 
                    : '' ;
      let payMonth  = `${this.employeewisemonthlysummaryexcel.controls['reportParameters']?.get('PPayMonth')?.value}` ;
      let payDate   = this.employeewisemonthlysummaryexcel.controls['reportParameters']?.get('PPayDate')?.value 
                      ? `'${moment(this.employeewisemonthlysummaryexcel.controls['reportParameters']?.get('PPayDate')?.value).format('DD/MM/YYYY')}'` 
                      : '' ;
      // let hotelPropYN = 'Y' // to change later
      let empType  = this.employeewisemonthlysummaryexcel.controls['reportParameters']?.get('PEmpType')?.value?.length !== 0 
                      ? `${this.employeewisemonthlysummaryexcel.controls['reportParameters']?.get('PEmpType')?.value}`
                      : '' ;

      // console.log("var",deptCodes);      
      // console.log("value of Dept",this.employeewisemonthlysummaryexcel.controls['reportParameters']?.get('PDept')?.value) ;

      this.payreportsService.CreateEmpMonthlySummaryFile(coyCodes,deptCodes,empCodes,salTypes,payMonth,payDate,empType).subscribe( {
        next: (res) => {
            this.loaderToggle = false
            console.log("res", res);
            let excelFile = new Blob([res], { type: 'xls' });
            console.log("res 2", res);            
                // PF-Month202306_FEHO.xls
          let filename = 'MthSum' +  payMonth + ".xls"
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
      this.employeewisemonthlysummaryexcel.markAllAsTouched()
    }
  }

  getReport(print: boolean) {
    console.log("fromvalue",this.employeewisemonthlysummaryexcel.value);  
    if (this.employeewisemonthlysummaryexcel.valid) {

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
  this.employeewisemonthlysummaryexcel.patchValue({
    reportParameters: {
    PPayMonth: `${moment(Date()).format('YYYY')}${moment(Date()).format('MM')}`
    }
    
 })
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      this.empTypeVisible = res.data.hotelYN == "Y" ?  true : false ;
      console.log("resdata",res.data.hotelYN);      
      console.log("a",this.empTypeVisible);
      this.employeewisemonthlysummaryexcel.patchValue({
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
      this.employeewisemonthlysummaryexcel.patchValue({
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
