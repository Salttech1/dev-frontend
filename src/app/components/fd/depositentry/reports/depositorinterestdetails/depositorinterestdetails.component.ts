import { ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { fileConstants } from 'src/constants/fileconstants';
import { CommonReportsService } from 'src/app/services/reports.service';
import { take } from 'rxjs';
import * as fileSaver from 'file-saver';
import { Router } from '@angular/router';
import * as constant from '../../../../../../constants/constant'
import { ModalService } from 'src/app/services/modalservice.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';

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
}

@Component({
  selector: 'app-depositorinterestdetails',
  templateUrl: './depositorinterestdetails.component.html',
  styleUrls: ['./depositorinterestdetails.component.css'],
  providers: [
    //   the above line required for date format
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      // useValue: 'en-GB' ,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }
    //   { provide: LOCALE_ID, useValue: "en-US" }, //replace "en-US" with your locale
    //otherProviders...
  ]
})
export class DepositorinterestdetailsComponent implements OnInit {
  bringBackColumn!: number;
  tableData: any
  columnHeader: any
  deptDyanPop!: string;
  deptColumnHeader: any
  depositorTableData: any
  coy_condition = "coy_fdyn='Y'"
  loaderToggle: boolean = false
  @ViewChild(F1Component) comp!:F1Component
  constructor(private dynapop: DynapopService, private toastr: ToasterapiService, private changeDetector: ChangeDetectorRef, private commonReportsService: CommonReportsService, private router: Router, private rendered: Renderer2, private modalService: ModalService) { }

  ngOnInit(): void {
    this.getCompanyList()
  }

  ngAfterViewInit(){
    this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus()
  }

  depositorInterestDetailForm = new FormGroup({
    name: new FormControl(fileConstants.depositorInterestDetail),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      CoyName: new FormControl('', Validators.required),
      CompanyName: new FormControl(),
      DepId: new FormControl('', Validators.required),
      DepositorName: new FormControl(),
      FromDate: new FormControl('', Validators.required),
      ToDate: new FormControl('', Validators.required),
      IntFrom: new FormControl(),
      IntUpto: new FormControl()
    })
  })

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
    this.depositorInterestDetailForm.patchValue({
      reportParameters:
      {
        IntFrom: moment(this.depositorInterestDetailForm.get("reportParameters.FromDate")?.value).format("DD/MM/YYYY"),
        IntUpto: moment(this.depositorInterestDetailForm.get("reportParameters.ToDate")?.value).format("DD/MM/YYYY")
      }
    })
    if(this.depositorInterestDetailForm.controls['reportParameters'].get('CoyName')?.value == ''){
      this.depositorInterestDetailForm.patchValue({
        reportParameters:
        {
          CompanyName:''
        }
      })
    }
    if(this.depositorInterestDetailForm.controls['reportParameters'].get('DepId')?.value == ''){
      this.depositorInterestDetailForm.patchValue({
        reportParameters:
        {
          DepositorName:''
        }
      })
    }
  }

  getCompanyList() {
    this.dynapop.getDynaPopListObj("COMPANY", "coy_fdyn='Y'").subscribe((res: any) => {
      this.columnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this.tableData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }

  updateListControl(val: any, formControl: any) {
    if (val !== undefined) {
      formControl.setValue(val[this.bringBackColumn])
    }
  }

  updateCompanyList(compData: any) {
    if (compData !== undefined) {
      this.depositorInterestDetailForm.patchValue({
        reportParameters:
        {
          CompanyName: compData[this.bringBackColumn],

        }
      })
      //get depositor list
      this.deptDyanPop = `deptr_coy='${compData[this.bringBackColumn - 1]}'`
      this.dynapop.getDynaPopListObj("DEPOSITORS", `deptr_coy='${compData[this.bringBackColumn - 1]}'`)
        .subscribe((res: any) => {
          this.deptColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
          this.depositorTableData = res.data
        })
    }
  }

  updateLoaderFlag(event: any) {
    this.loaderToggle = event
  }

  dateValidation() {
    let startDate = moment(this.depositorInterestDetailForm.get("reportParameters.FromDate")?.value).format('YYYY-MM-DD')
    let endDate = moment(this.depositorInterestDetailForm.get("reportParameters.ToDate")?.value).format('YYYY-MM-DD')
    if (moment(startDate).isAfter(endDate)) {
      this.toastr.showError("Please Enter Valid Date")
      this.depositorInterestDetailForm.get("reportParameters.ToDate")?.reset()
    }
    // if (moment(this.depositorInterestDetailForm.get("reportParameters.FromDate")?.value).format('YYYY') == moment(this.depositorInterestDetailForm.get("reportParameters.ToDate")?.value).format('YYYY')) {
    //   if (moment(this.depositorInterestDetailForm.get("reportParameters.ToDate")?.value).format('MM') < moment(this.depositorInterestDetailForm.get("reportParameters.FromDate")?.value).format('MM')) {
    //     this.toastr.showError("Please Enter valid To Date")
    //     this.depositorInterestDetailForm.patchValue({
    //       reportParameters: {
    //         ToDate: ''
    //       }
    //     })
    //   }
    // }
    // if (moment(this.depositorInterestDetailForm.get("reportParameters.FromDate")?.value).format('YYYY') > moment(this.depositorInterestDetailForm.get("reportParameters.ToDate")?.value).format('YYYY')) {
    //   this.toastr.showError("Please select valid Year for From Date")
    //   this.depositorInterestDetailForm.patchValue({
    //     reportParameters: {
    //       FromDate: ''
    //     }
    //   })
    // }

  }

  getReport(print: boolean) {
    if (this.depositorInterestDetailForm.valid) {
      this.depositorInterestDetailForm.value.isPrint = false
      this.loaderToggle = true
      this.commonReportsService.getParameterizedReport(this.depositorInterestDetailForm.value).pipe(take(1)).subscribe({
        next: (res: any) => {
          this.loaderToggle = false
          let pdf = new Blob([res], { type: "application/pdf" });
          let filename = this.commonReportsService.getReportName();
          if (print) {
            const blobUrl = URL.createObjectURL(pdf);
            const oWindow = window.open(blobUrl, '_blank');
            oWindow?.print();
          } else {
            fileSaver.saveAs(pdf, filename);
          }
        } ,
        error: (err: any) => {
          this.loaderToggle = false
        },
        complete:()=>{
          this.loaderToggle = false
        }
      })
    }
    else {
      this.validationFields()
      this.depositorInterestDetailForm.markAllAsTouched()
    }
  }

  print() {
    if (this.depositorInterestDetailForm.valid) {
      this.depositorInterestDetailForm.value.isPrint = true
      this.loaderToggle = true
      this.commonReportsService.getParameterizedPrintReport(this.depositorInterestDetailForm.value).pipe(take(1)).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.loaderToggle = false
            this.toastr.showSuccess(res.message)
          }
          else {
            this.loaderToggle = false
            this.toastr.showError(res.message)
          }
        },
        error: (err: any) => {
          this.loaderToggle = false
        },
      })
    }
    else {
      this.validationFields()
      this.depositorInterestDetailForm.markAllAsTouched()
    }
  }
  handleExit() {
    this.router.navigate(['/dashboard'])
  }

  validationFields() {
    if (this.depositorInterestDetailForm.controls['reportParameters'].controls['CoyName'].errors && this.depositorInterestDetailForm.controls['reportParameters'].controls['CoyName'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "company code is Required", (document.getElementById('companyCode')?.childNodes[0] as HTMLInputElement)?.focus(), "error")
    }
    else if (this.depositorInterestDetailForm.controls['reportParameters'].controls['DepId'].errors && this.depositorInterestDetailForm.controls['reportParameters'].controls['DepId'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Depositor Code is Required", (document.getElementById('depositorCode')?.childNodes[0] as HTMLInputElement)?.focus(), "error")
    }
    else if (this.depositorInterestDetailForm.controls['reportParameters'].controls['FromDate'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "From Date is Required", this.rendered.selectRootElement("#fromDateField")?.focus(), "error")
    }
    else if (this.depositorInterestDetailForm.controls['reportParameters'].controls['ToDate'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "To Date is Required", this.rendered.selectRootElement("#toDateField")?.focus(), "error")
    }
  }

  updateOnChangeCompanyList(event:any) {
    console.log("tabledata", this.tableData);
    const result = this.tableData.dataSet.filter((s: any, i: any) => {
      if (this.tableData.dataSet[i][0].trim() === event?.target?.value.toUpperCase()) {
        return this.tableData.dataSet[i];
      }
      else {
        return null
      }
    })
    if (event?.target?.value) {
      if (result.length == 0) {
        this.depositorInterestDetailForm.patchValue({
          reportParameters: { CoyName: '' }
        })
      }
      else {
        this.depositorInterestDetailForm.patchValue({
          reportParameters: {
            CompanyName: result[0][1].trim()
          }
        })
      }
    }
  }
  updateDepositorList() {
    this.deptDyanPop = `deptr_coy='${this.depositorInterestDetailForm.controls['reportParameters'].get('CoyName')?.value}'`
    this.dynapop.getDynaPopListObj("DEPOSITORS", `deptr_coy='${this.depositorInterestDetailForm.controls['reportParameters'].get('CoyName')?.value}'`)
      .subscribe((res: any) => {
        this.deptColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
        this.depositorTableData = res.data
      })
  }

  updateDepositorOnChange(event:any) {
    const result = this.depositorTableData.dataSet.filter((s: any, i: any) => {
      if (this.depositorTableData.dataSet[i][0].trim() === event?.target?.value.toUpperCase()) {
        return this.depositorTableData.dataSet[i];
      }
      else {
        return null
      }
    })
    if (event?.target?.value) {
      if (result.length == 0) {
        this.depositorInterestDetailForm.patchValue({
          reportParameters: { DepId: '' }
        })
      }
      else {
        this.depositorInterestDetailForm.patchValue({
          reportParameters: {
            DepositorName: result[0][1].trim()
          }
        })
      }
    }
  }
}
