import { Component, OnInit, Renderer2, ChangeDetectorRef,ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import { fileConstants } from 'src/constants/fileconstants';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import * as constant from '../../../../../../constants/constant'
import { ModalService } from 'src/app/services/modalservice.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import * as fileSaver from 'file-saver';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { HttpClient, HttpParams } from '@angular/common/http'

export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};


@Component({
  selector: 'app-createneftfile',
  templateUrl: './createneftfile.component.html',
  styleUrls: ['./createneftfile.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }
  ]
})
export class CreateneftfileComponent implements OnInit {

  compHeader!: any[];
  compData!: any;
  bringBackColumn!: number;
  coy_condition = "coy_fdyn='Y'";
  depositorTableData: any;
  deptColumnHeader!: any[];
  deptDyanPop!: string;
  neftData: any;
  depositorsList: string[] = [];
  datePipe = new DatePipe('en-US')
  neftPayload: any;
  loaderToggle: boolean = false;
  @ViewChild(F1Component) comp !:F1Component
  constructor(private dynapop: DynapopService, private rendered: Renderer2, private cdref: ChangeDetectorRef,
    private http: HttpClient, private toastr: ToasterapiService, private router: Router) { }

  ngOnInit(): void {
    this.getCompanyList();
    this.fetchNeftData();
    this.neftFileDetailForm.controls['companyName'].disable();
    this.rendered.selectRootElement(`#chqAlpha12321`)?.focus()
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
    console.log("DepositorID: ", this.depositorsList)
    console.log('CreateNeftFile Payload: ', this.neftFilePayload());
    if (!this.neftFileDetailForm.get('companyCode')?.value) {
      this.neftFileDetailForm.patchValue({
        companyName: ''
      })
    }
  }

  neftFilePayload() {
    this.neftPayload = {
      companyCode: this.neftFileDetailForm?.value.companyCode,
      fromDate: this.datePipe.transform(this.neftFileDetailForm?.value.fromDate, 'dd/MM/yyyy'),
      toDate: this.datePipe.transform(this.neftFileDetailForm?.value.toDate, 'dd/MM/yyyy'),
      companyBankAc: this.neftFileDetailForm?.value.coyBankAC,
      chequeNum: this.neftFileDetailForm?.value.chqNum,
      chequeAlpha: this.neftFileDetailForm?.value.chqAlpha,
      chequeDate: this.neftFileDetailForm?.value.chqDate,
      bankString: this.neftFileDetailForm?.value.BankStr,
      depositorsList: this.depositorsList

    };
    return this.neftPayload;
  }

  neftFileDetailForm = new FormGroup({
    companyCode: new FormControl('', Validators.required),
    // BankStr: new FormControl("not like 'PUNB'", Validators.required),
    BankStr: new FormControl(''),
    companyName: new FormControl(''),
    fromDate: new FormControl(),
    toDate: new FormControl(),
    coyBankAC: new FormControl(''),
    chqAlpha: new FormControl(''),
    chqNum: new FormControl(''),
    chqDate: new FormControl(''),
    depositorId: new FormControl()
  })


  fetchNeftData() {
    this.http.get(`${environment.API_URL}${constant.api_url.fetchNEFTDetails}`).pipe(take(1)).subscribe({
      next: (res: any) => {
        console.log("res",res);
        
        this.neftData = res.data;
        this.setNeftDataValue();
      },
      error: (err: any) => {
        console.log("Error: ", err)
     
      }
    })
  }

  setDepositorsList(depositData: any) {
    if (this.neftFileDetailForm?.value.depositorId == "" || this.neftFileDetailForm?.value.depositorId == null) {
      this.depositorsList = [];
      this.neftFileDetailForm.patchValue({depositorId: [] })
      this.neftFilePayload();
    } else {
        // this.depositorsList.push(depositData[i][0].trim());
      //   if (depositData?.length) {
      //     this.neftFileDetailForm.patchValue({depositorId: depositData.join(','),});
      // }
    }
  }
  getCompanyList() {
    this.neftFileDetailForm.patchValue({
      companyCode: 'UNIQ',
    })
    this.dynapop.getDynaPopListObj("COMPANY", "coy_fdyn='Y'").subscribe((res: any) => {
      this.compHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this.compData = res.data
      this.bringBackColumn = res.data.bringBackColumn
      this.setDefaultCompanyName();
    })
    this.getDepositorList(this.neftFileDetailForm?.value.companyCode)
  }

  setNeftDataValue() {
    this.neftFileDetailForm.patchValue({
      fromDate: new Date(this.neftData.fromDate?.split("/")[1] + "-" + this.neftData.fromDate?.split("/")[0] + "-" + this.neftData.fromDate.split("/")[2]),
      toDate: new Date(this.neftData.toDate?.split("/")[1] + "-" + this.neftData.toDate?.split("/")[0] + "-" + this.neftData.toDate.split("/")[2]),
      coyBankAC: this.neftData.coyBankAC,
      chqDate: this.neftData.toDate.replace(/\//gi, "")
    })
  }
  setDefaultCompanyName() {
    for (let i = 0; i < this.compData.dataSet.length; i++) {
      if (this.compData.dataSet[i][0].startsWith(this.neftFileDetailForm?.value.companyCode)) {
        this.neftFileDetailForm.patchValue({
          companyName: this.compData.dataSet[i][1].trim()
        })
      }
    }
  }

  getSelectedDepositor(e: any[]) {
    console.log("depositor",e);
    
    this.depositorsList = [];
    if (e?.length) {
      this.neftFileDetailForm.patchValue({
        depositorId: e.join(','),
      });
      this.depositorsList = this.neftFileDetailForm?.value.depositorId?.split(",")
    }
  }
  validateInvalidFormat(event: any, id: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = ""
      this.rendered.selectRootElement(`#${id}`)?.focus()
    }
    else{
      let startDate = moment(this.neftFileDetailForm.get("fromDate")?.value).format('YYYY-MM-DD')
      let endDate = moment(this.neftFileDetailForm.get("toDate")?.value).format('YYYY-MM-DD')
      if (moment(startDate).isAfter(endDate)) {
        this.toastr.showError("Please Enter Valid Date")
        this.neftFileDetailForm.get("toDate")?.reset()
        this.rendered.selectRootElement(`#${id}`)?.focus()
      }
  } 
  }

  updateCompanyList(compData: any) {
    if (compData && compData.length) {
      this.neftFileDetailForm.patchValue({
        companyName: compData[this.bringBackColumn].trim()
      })
    }
  }

  getDepositorList(companyCode: any) {
    this.deptDyanPop = `deptr_coy='${companyCode}'`
    this.dynapop.getDynaPopListObj("DEPOSITORS", `deptr_coy='${companyCode}'`)
      .subscribe((res: any) => {
        this.deptColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
        this.depositorTableData = res.data;
      })
  }


  exportReport() {
    if (this.neftFileDetailForm?.valid) {
      console.log("Before Download depositor",this.neftFileDetailForm?.value.depositorId);
      this.setDepositorsList(this.neftFileDetailForm?.value.depositorId);
      console.log("After Download depositor",this.neftFileDetailForm?.value.depositorId);
      this.loaderToggle = true;
      this.http.post(`${environment.API_URL}${constant.api_url.exportNeftReport}`, this.neftPayload, { responseType: 'blob' }).pipe(take(1)).subscribe({
        next: (res: any) => {
          this.loaderToggle = false
          let excelFile = new Blob([res], { type: 'xls' });
          // let filename = this.neftFileDetailForm?.value.companyCode?.trim()! + this.neftFileDetailForm?.value.chqNum + ".xls"
          let filename = this.neftFileDetailForm?.value.companyCode?.trim()! + moment(this.neftFileDetailForm.get("toDate")?.value).format('YYYYMMDD') + ".xls"
          fileSaver.saveAs(excelFile, filename);
        },
        error: (err: any) => {
          this.loaderToggle = false
        },
        complete: () => {
          this.loaderToggle = false
        }

      })
    }
    else {
      this.neftFileDetailForm.markAllAsTouched()
    }
  }

  handleQuitClick() {
    this.router.navigate(['/dashboard'])
  }
  updateOnChangeCompanyList(event: any) {
    const result = this.compData.dataSet.filter((s: any, i: any) => {
      if (this.compData.dataSet[i][0].trim() === event?.target?.value.toUpperCase()) {
        return this.compData.dataSet[i];
      }
      else {
        return null
      }
    })
    if (event?.target?.value) {
      if (result.length == 0) {
        this.neftFileDetailForm.patchValue({
         companyCode:''
        })
      }
      else {
        this.neftFileDetailForm.patchValue({
            companyName: result[0][1].trim()
        })
      }
    }
    if (event?.target?.value == '') {
      this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus()
    }
  }
}
