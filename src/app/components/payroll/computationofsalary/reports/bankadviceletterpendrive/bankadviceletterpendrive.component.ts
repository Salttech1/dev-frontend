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
  selector: 'app-bankadviceletterpendrive',
  templateUrl: './bankadviceletterpendrive.component.html',
  styleUrls: ['./bankadviceletterpendrive.component.css'],
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
export class BankadviceletterpendriveComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  // hotelPropYN: any ;
  empTypeVisible: boolean = false;
  fetchRequestAPI: any;
  companyCode = '';

  bankadviceletterpendrive = new FormGroup({
    name: new FormControl('PYRL_BankAdvice.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      rbOptions: new FormControl<String>('',Validators.required), 
      pCoy: new FormControl('', Validators.required),
      pSalType: new FormControl<String[]>([]),  
      pPayMonth: new FormControl('', Validators.required),
      pBankCode: new FormControl(''),
      AllPaymentsYN: new FormControl(''), 
      PPayDate: new FormControl(''),
      pEmpType: new FormControl(''),            
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
    this.bankadviceletterpendrive.get('reportParameters')
    ?.get('pCoy')
    ?.valueChanges?.subscribe({
      next: (res: any) => {
        if (res) {
          let coy = res;
          this.companyCode  = `epba_company = '${coy[0][0]}'` ;
          console.log("this.coy", this.companyCode );          
        }
      },
    });

  }

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }

  exportReport() {
    if (this.bankadviceletterpendrive?.valid) {
      this.loaderToggle = true;
      let coyCodes  = `${this.bankadviceletterpendrive.controls['reportParameters']?.get('pCoy')?.value?.[0][0]}` ;
      let salTypes = this.bankadviceletterpendrive.controls['reportParameters']?.get('pSalType')?.value?.length !== 0
                    ? `'${this.bankadviceletterpendrive.controls['reportParameters']?.get('pSalType')?.value?.join("','")}'` 
                    : '' ;
      let payMonth  = `${this.bankadviceletterpendrive.controls['reportParameters']?.get('pPayMonth')?.value}` 
                    ? `${moment(this.bankadviceletterpendrive.controls['reportParameters']?.get('pPayMonth')?.value).format('YYYYMM')}` 
                    : '' ;
      let payDate   = this.bankadviceletterpendrive.controls['reportParameters']?.get('PPayDate')?.value 
                      ? `'${moment(this.bankadviceletterpendrive.controls['reportParameters']?.get('PPayDate')?.value).format('DD/MM/YYYY')}'` 
                      : '' ;
      // let hotelPropYN = 'Y' // to change later
      let bankCode  = this.bankadviceletterpendrive.controls['reportParameters']?.get('pBankCode')?.value?.length !== 0 
                      ? `${this.bankadviceletterpendrive.controls['reportParameters']?.get('pBankCode')?.value}`
                      : '' ;
      let empType  = this.bankadviceletterpendrive.controls['reportParameters']?.get('pEmpType')?.value?.length !== 0 
                      ? `${this.bankadviceletterpendrive.controls['reportParameters']?.get('pEmpType')?.value}`
                      : '' ;

      // console.log("var",deptCodes);      
      // console.log("value of Dept",this.employeewisemonthlysummaryexcel.controls['reportParameters']?.get('PDept')?.value) ;

      console.log("Pay Month ", payMonth);
      this.payreportsService.CreateBankAdviceFile(coyCodes,salTypes,payMonth,payDate,bankCode,empType).subscribe( {
        next: (res) => {
            this.loaderToggle = false
            let excelFile = new Blob([res], { type: 'xls' });
                // FEHO BankAdvice202306.xls
          let filename = coyCodes + 'BankAdvice' +  payMonth + ".xls"
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
      this.bankadviceletterpendrive.markAllAsTouched()
    }
  }

  getReport(print: boolean) {

    //rbreportoptions : this.esicform5.controls['reportParameters']?.get('rbYear')?.value == 'F' ? `${this.esicform5.controls['reportParameters']?.get('PYear')?.value}` + '04' : `${this.esicform5.controls['reportParameters']?.get('PYear')?.value}` + '10',
    console.log("fromvalue",this.bankadviceletterpendrive.value);  
    if (this.bankadviceletterpendrive.valid) {

      this.loaderToggle = true;
      this.setReportValue();
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

  setReportValue() {

    console.log("OPT",this.bankadviceletterpendrive.controls['reportParameters'].get('rbOptions')?.value) ;
    if (this.bankadviceletterpendrive.controls['reportParameters'].get('rbOptions')?.value == 'Letter' ) {

      this.payLoad = {
        name: 'PYRL_BankAdvice_Letter.rpt',
        isPrint: false,
        reportParameters: {
          pBankCode: `${this.bankadviceletterpendrive.controls['reportParameters']?.get('pBankCode')?.value?.[0][0].trim()}`,        
          pCoy: `${this.bankadviceletterpendrive.controls['reportParameters']?.get('pCoy')?.value?.[0][0].trim()}`,
          pEmpType:  this.bankadviceletterpendrive.controls['reportParameters']?.get('pEmpType')?.value?.length !== 0 
                      ? `'${this.bankadviceletterpendrive.controls['reportParameters']?.get('pEmpType')?.value}'`
                      : `'ALL'`, 
          pPayMonth: `${moment(this.bankadviceletterpendrive.controls['reportParameters']?.get('pPayMonth')?.value).format('YYYYMM')}`,         
          pSalType: `${this.bankadviceletterpendrive.controls['reportParameters']?.get('pSalType')?.value?.join("','")}`,
          PPayDate: `ALL`        
          //pPayDate: `${moment(this.bankadviceletterpendrive.controls['reportParameters']?.get('PPayDate')?.value, 'DD/MM/YYYY').format('YYYY-MM-DD')}`                  
        }
      } ;
    } else if (this.bankadviceletterpendrive.controls['reportParameters'].get('rbOptions')?.value == 'Advice' )  {
      this.payLoad = {
        name: 'PYRL_BankAdvice.rpt',
        isPrint: false,
        reportParameters: {
          pBankCode: `'${this.bankadviceletterpendrive.controls['reportParameters']?.get('pBankCode')?.value?.[0][0].trim()}'`,        
          pCoy: `'${this.bankadviceletterpendrive.controls['reportParameters']?.get('pCoy')?.value?.[0][0].trim()}'`,
          pEmpType:  this.bankadviceletterpendrive.controls['reportParameters']?.get('pEmpType')?.value?.length !== 0 
                      ? `'${this.bankadviceletterpendrive.controls['reportParameters']?.get('pEmpType')?.value}'`
                      : `'ALL'`, 
          pPayMonth: `${moment(this.bankadviceletterpendrive.controls['reportParameters']?.get('pPayMonth')?.value).format('YYYYMM')}`,         
          pSalType: `'${this.bankadviceletterpendrive.controls['reportParameters']?.get('pSalType')?.value?.join("','")}'`
          //PPayDate: `${moment(this.bankadviceletterpendrive.controls['reportParameters']?.get('PPayDate')?.value, 'DD/MM/YYYY').format('YYYY-MM-DD')}`,        
        }
      } ;

    } else if (this.bankadviceletterpendrive.controls['reportParameters'].get('rbOptions')?.value == 'PenDrive' )  {
      this.payLoad = {
        name: 'pendrive code to come here',
        isPrint: false,
        reportParameters: {
          pBankCode: `'${this.bankadviceletterpendrive.controls['reportParameters']?.get('pBankCode')?.value?.[0][0].trim()}'`,        
          pCoy: `'${this.bankadviceletterpendrive.controls['reportParameters']?.get('pCoy')?.value?.[0][0].trim()}'`,
          pEmpType:  this.bankadviceletterpendrive.controls['reportParameters']?.get('pEmpType')?.value?.length !== 0 
                      ? `'${this.bankadviceletterpendrive.controls['reportParameters']?.get('pEmpType')?.value}'`
                      : `'ALL'`, 
          pPayMonth: `${moment(this.bankadviceletterpendrive.controls['reportParameters']?.get('pPayMonth')?.value).format('YYYYMM')}`,         
          pSalType: `'${this.bankadviceletterpendrive.controls['reportParameters']?.get('pSalType')?.value?.join("','")}'`
          //PPayDate: `${moment(this.bankadviceletterpendrive.controls['reportParameters']?.get('PPayDate')?.value, 'DD/MM/YYYY').format('YYYY-MM-DD')}`,        
        }
      } ;

    }
  }

GetDefaultValue(){
  this.bankadviceletterpendrive.patchValue({
    reportParameters: {
    pPayMonth: `${moment(Date()).format('YYYY')}${moment(Date()).format('MM')}`
    }
 })
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      this.empTypeVisible = res.data.hotelYN == "Y" ?  true : false ;
      console.log("resdata",res.data.hotelYN);      
      console.log("a",this.empTypeVisible);
      this.bankadviceletterpendrive.patchValue({
        reportParameters: {
          // PPayMonth: moment(res.data.frompaymonth.substring(0, 4)+'-'+res.data.frompaymonth.substring(4, 6)+'-'+'01','YYYY-MM-DD').format('YYYYMM')
        pPayMonth: res.data.frompaymonth
        }
     })
     console.log("-->paymonth",moment(res.data.frompaymonth.substring(0, 4)+'-'+res.data.frompaymonth.substring(4, 6)+'-'+'01','YYYY-MM-DD').format('YYYYMM'));
     
    }
  });
  }

  chosenMonthHandler(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, dateCtrl: any) {
    console.log("normalizedMonthAndYear",normalizedMonthAndYear.month());
    
    if (!dateCtrl?.valid) {
      this.bankadviceletterpendrive.patchValue({
        reportParameters: {
          pPayMonth: normalizedMonthAndYear.format('YYYYMM')
        }
      })
    }
    const ctrlValue: any = dateCtrl?.value
    ctrlValue?.month(normalizedMonthAndYear?.month());
    ctrlValue?.year(normalizedMonthAndYear?.year())
    dateCtrl?.setValue(ctrlValue)
    datepicker.close();
  }

  checkBoxToggle(event: any) {
    if (event.key === "Enter") {
      event.preventDefault()
      event.target.checked ? event.target.checked = false : event.target.checked = true
    }
  }

}
