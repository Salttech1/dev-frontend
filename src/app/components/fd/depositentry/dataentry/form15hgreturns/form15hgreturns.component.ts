import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { environment } from 'src/environments/environment';
import * as constant from '../../../../../../constants/constant'
import { Router } from '@angular/router';

@Component({
  selector: 'app-form15hgreturns',
  templateUrl: './form15hgreturns.component.html',
  styleUrls: ['./form15hgreturns.component.css']
})
export class Form15hgreturnsComponent implements OnInit {

  compHeader!: any[];
  compData!: any;
  columnHeader!: any[];
  bringBackColumn!: number;
  coy_condition = "coy_fdyn='Y'";
  quaterColumnHeader!: any[];
  quaterData!: any;
  quarter_condition = "";
  loaderToggle: boolean = false;
  readonlyAttr: boolean = true;

  constructor(private dynapop: DynapopService, private http: HttpClient,
    private toastr: ToasterapiService, private router: Router, private changeDetectRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.getCompanyList();
    this.setAccountingYear();
    this.getQuaterList();
    this.setCurrentQuarter();
    // this.form15hgReturnsSectionForm.get('companyName')?.disable()
    // this.form15hgReturnsSectionForm.get('quaterName')?.disable()
  }

  ngAfterContentChecked() {
    this.changeDetectRef.detectChanges()
    if (this.form15hgReturnsSectionForm.get('companyCode')?.value == '') {
      this.form15hgReturnsSectionForm.patchValue({
        companyName: ''
      })
    }
    if (this.form15hgReturnsSectionForm.get('quaterId')?.value == '') {
      this.form15hgReturnsSectionForm.patchValue({
        quaterName: ''
      })
    }
  }

  form15hgReturnsSectionForm = new FormGroup({
    companyCode: new FormControl('', Validators.required),
    companyName: new FormControl(''),
    acyear: new FormControl('', Validators.required),
    depositorId: new FormControl(''),
    depositorName: new FormControl(''),
    quaterId: new FormControl('', Validators.required),
    quaterName: new FormControl(''),
    formType: new FormControl('H')
  })

  updateCompanyList(compData: any) {
    if (compData && compData.length) {
      this.form15hgReturnsSectionForm.patchValue({
        companyName: compData[this.bringBackColumn].trim()
      })
    }
    else {
      this.form15hgReturnsSectionForm.patchValue({
        companyName: ''
      })
    }
  }

  getCompanyList() {
    this.form15hgReturnsSectionForm.patchValue({
      companyCode: 'UNIQ',
    })
    this.dynapop.getDynaPopListObj("COMPANY", "coy_fdyn='Y'").subscribe((res: any) => {
      this.compHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this.compData = res.data
      this.bringBackColumn = res.data.bringBackColumn
      this.setDefaultCompanyName();
    })
  }

  setDefaultCompanyName() {
    console.log("Company Data", this.compData)
    for (let i = 0; i < this.compData.dataSet.length; i++) {
      if (this.compData.dataSet[i][0].startsWith(this.form15hgReturnsSectionForm?.value.companyCode)) {
        this.form15hgReturnsSectionForm.patchValue({
          companyName: this.compData.dataSet[i][1].trim()
        })
      }
    }
  }

  getQuaterList() {
    this.dynapop.getDynaPopListObj("FDTDSQ", "").subscribe((res: any) => {
      console.log("Result ", res.data.colhead1)
      this.quaterColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this.quaterData = res.data
      this.bringBackColumn = res.data.bringBackColumn
      this.setCurrentQuarter();
    })
  }

  setCurrentQuarter() {
    let currentMonth = new Date().getMonth() + 1;
    let currentQuarter: string = ""
    if (currentMonth >= 4 && currentMonth <= 6) {
      currentQuarter = 'Q1'
    }
    if (currentMonth >= 7 && currentMonth <= 9) {
      currentQuarter = 'Q2'
    }
    if (currentMonth >= 10 && currentMonth <= 12) {
      currentQuarter = 'Q3'
    }
    if (currentMonth >= 1 && currentMonth <= 3) {
      currentQuarter = 'Q4'
    }
    this.form15hgReturnsSectionForm.patchValue({
      quaterId: currentQuarter,
    })
    this.setQuarterName(this.form15hgReturnsSectionForm?.value.quaterId)
  }

  setQuarterName(quarterCode: any) {
    console.log(quarterCode, "quarterCode");
    let currentQuarterName: string = '';
    if (quarterCode.startsWith('Q1')) {
      currentQuarterName = "First Quarter"
    }
    if (quarterCode.startsWith('Q2')) {
      currentQuarterName = "Second Quarter"
    }
    if (quarterCode.startsWith('Q3')) {
      currentQuarterName = "Third Quarter"
    }
    if (quarterCode.startsWith('Q4')) {
      currentQuarterName = "Fourth Quarter"
    }
    this.form15hgReturnsSectionForm.patchValue({
      quaterName: currentQuarterName
    })
  }

  setAccountingYear() {
    if ((new Date().getMonth() + 1) >= 4) {
      this.form15hgReturnsSectionForm.patchValue({
        acyear:(new Date().getFullYear()).toString() + (new Date().getFullYear() + 1).toString()
      })
    }
    else{
      this.form15hgReturnsSectionForm.patchValue({
        acyear: (new Date().getFullYear() - 1).toString() + (new Date().getFullYear()).toString()
      })
    }
  }

  updateQuarter(event: any) {
    // this.setQuarterName(this.form15hgReturnsSectionForm?.value.quaterId)
    if (event && event.length) {
      this.setQuarterName(event[0])
    }
    else {
      this.form15hgReturnsSectionForm.patchValue({
        quaterId: ''
      })
    }
    console.log(!this.form15hgReturnsSectionForm?.value.quaterId);
  }

  exportFormApiCall(params: any,fileName:any) {
    this.http.get(`${environment.API_URL}${constant.api_url.generateForm15hgReturnsFile}`, { params: params, responseType: 'blob' }).subscribe({
      next: (res: any) => {
        this.loaderToggle = false
        let excelFile = new Blob([res], { type: 'xls' });
        let filename = this.getFileName(fileName);
        fileSaver.saveAs(excelFile, filename);
      },
      error: (err: any) => {
        this.loaderToggle = false
      }
    })
  }


  exportForm15hgReturns() {
    if (this.form15hgReturnsSectionForm?.valid) {
      this.loaderToggle = true
      let params = new HttpParams()
        .set("companyCode", `${this.form15hgReturnsSectionForm?.get("companyCode")?.value}`)
        .set("accountYear", `${this.form15hgReturnsSectionForm?.get("acyear")?.value}`)
        .set("quater", `${this.form15hgReturnsSectionForm?.get("quaterId")?.value}`)
        .set("fifteenhg", `${this.form15hgReturnsSectionForm?.get("formType")?.value}`)
        .set("isIncomeDetails", false)
      this.exportFormApiCall(params,this.form15hgReturnsSectionForm?.get("companyCode")?.value?.trim())
      params.keys().forEach(function (key) {
        if (key == 'isIncomeDetails') {
          params = params.set('isIncomeDetails', true);
        }
      });
      this.exportFormApiCall(params,'Income_Details');
    }
    else {
      this.form15hgReturnsSectionForm.markAllAsTouched()
    }
  }

  getFileName(fileNameStart:any) {
    let fileName = fileNameStart
      + "_15" + this.form15hgReturnsSectionForm?.get("formType")?.value
      + "_" + this.form15hgReturnsSectionForm?.get("quaterId")?.value?.trim() + ".xls"
    return fileName;
  }

  handleQuit() {
    this.router.navigate(['/dashboard']);
  }

  updateListControl(val: any, formControl: any) {
    if (val != undefined) { formControl.setValue(val[this.bringBackColumn]) }
  }
}
