import { Component, OnInit, ChangeDetectorRef, AfterViewInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { take } from 'rxjs';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { fileConstants } from 'src/constants/fileconstants';
import * as constant from '../../../../../../constants/constant'
import { ModalService } from 'src/app/services/modalservice.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';

@Component({
  selector: 'app-coveringletterformaturityrenewal',
  templateUrl: './coveringletterformaturityrenewal.component.html',
  styleUrls: ['./coveringletterformaturityrenewal.component.css']
})
export class CoveringletterformaturityrenewalComponent implements OnInit, AfterViewInit {
  loaderToggle: boolean = false;
  bringBackColumn!: number;
  tableData: any
  columnHeader: any
  transferTableData: any
  transferColumnHeader: any
  coy_condition = "coy_fdyn='Y'"
  transNoCondition!: string
  @ViewChild(F1Component) comp!:F1Component
  constructor(private actionService: ActionservicesService, private changeRef: ChangeDetectorRef, private dynapop: DynapopService, private router: Router, private commonReportsService: CommonReportsService, private toastr: ToasterapiService, private rendered: Renderer2, private modalService: ModalService) { }

  ngOnInit(): void { this.getCompanyList() }

  ngAfterViewInit(): void {
   this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus()
  }
     
  ngAfterContentChecked() {
    this.changeRef.detectChanges()
    this.actionService.getExportActionFlag(false)
    this.actionService.commonFlagCheck(true, true, true, false, true, true, true, true, false, true, true)
    if(this.coveringLettersForMatRenForm.controls['reportParameters'].get('CoyCode')?.value == ''){
      this.coveringLettersForMatRenForm.patchValue({
        reportParameters:{
          CoyName:''
        }
      })
    }
  }

  coveringLettersForMatRenForm = new FormGroup({
    name: new FormControl(fileConstants.coveringLetter),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      CoyCode: new FormControl('', Validators.required),
      CoyName: new FormControl(),
      TranserNo: new FormControl('', Validators.required),
      Maturity_Renewal: new FormControl('R', Validators.required),
    })
  })

  getCompanyList() {
    this.dynapop.getDynaPopListObj("COMPANY", "coy_fdyn='Y'").subscribe((res: any) => {
      this.columnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this.tableData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }

  getTranserList(coyCodeText: any) {
    this.transNoCondition = `acth_coy = '${coyCodeText.trim()}' AND acth_trantype in('PF') and acth_transer like 'P%' and acth_partycode like '${coyCodeText.trim()}%'`
    this.dynapop.getDynaPopListObj('TRANSER', `acth_coy = '${coyCodeText.trim()}' AND acth_trantype in('PF') and acth_transer like 'P%' and acth_partycode like '${coyCodeText.trim()}%'`).subscribe((res: any) => {
      this.transferColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this.transferTableData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }

  updateCompanyList(compData: any) {
    if (compData !== undefined) {
      this.coveringLettersForMatRenForm.patchValue({
        reportParameters:
          { CoyName: compData[this.bringBackColumn], }
      })
      this.getTranserList(`${compData[this.bringBackColumn - 1]}`)
    }
    
  }
  updateTranserList(){
    this.getTranserList(`${this.coveringLettersForMatRenForm?.controls['reportParameters']?.get('CoyCode')?.value}`)
  }
  
  updateTranserListOnChange(event:any){
    if(event?.target?.value){
      this.dynapop.getDynaPopSearchListObj('TRANSER', `acth_coy = '${this.coveringLettersForMatRenForm?.controls['reportParameters']?.get('CoyCode')?.value?.trim()}' AND acth_trantype in('PF') and acth_transer like 'P%' and acth_partycode like '${this.coveringLettersForMatRenForm?.controls['reportParameters']?.get('CoyCode')?.value?.trim()}%'`, event?.target?.value).subscribe((res: any) => {
        if (res.data.dataSet.length == 0) {
           this.coveringLettersForMatRenForm.patchValue({
            reportParameters:{
              TranserNo:''
            }
           })
        }
        
      })
    }
  }

  optionSelect(letterOtion: any) {
    // if(event.value =="depositDetails"){
    //   this.detailsITEntryForm.patchValue({name:fileConstants.depositDetail})
    // }
    // else if(event.value =="interestDetils"){
    //   this.detailsITEntryForm.patchValue({name:fileConstants.interestDetail})
    // }
  }

  updateLoaderFlag(event: any) {
    this.loaderToggle = event
  }

  getReport(print: boolean) {
    if (this.coveringLettersForMatRenForm.valid) {
      this.coveringLettersForMatRenForm.value.isPrint = false
      this.loaderToggle = true
      this.commonReportsService.getParameterizedReport(this.coveringLettersForMatRenForm.value).pipe(take(1)).subscribe({
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
        },
        error: (err: any) => {
          this.loaderToggle = false
        },
      })
    }
    else {
      this.validationFields()
      this.coveringLettersForMatRenForm.markAllAsTouched()
    }
  }

  print() {
    if (this.coveringLettersForMatRenForm.valid) {
      this.coveringLettersForMatRenForm.value.isPrint = true
      this.loaderToggle = true
      this.commonReportsService.getParameterizedPrintReport(this.coveringLettersForMatRenForm.value).pipe(take(1)).subscribe({
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
      this.coveringLettersForMatRenForm.markAllAsTouched()
    }
  }
  handleExit() {
    this.router.navigate(['/dashboard'])
  }

  validationFields() {
    if (this.coveringLettersForMatRenForm.controls['reportParameters'].controls['CoyCode'].errors && this.coveringLettersForMatRenForm.controls['reportParameters'].controls['CoyCode'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "company code is Required", (document.getElementById('companyCode')?.childNodes[0] as HTMLInputElement)?.focus(), "error")
    }
    else if (this.coveringLettersForMatRenForm.controls['reportParameters'].controls['TranserNo'].errors && this.coveringLettersForMatRenForm.controls['reportParameters'].controls['TranserNo'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Transer No is Required", (document.getElementById('transerNo')?.childNodes[0] as HTMLInputElement)?.focus(), "error")
    }
    else if (this.coveringLettersForMatRenForm.controls['reportParameters'].controls['Maturity_Renewal'].errors && this.coveringLettersForMatRenForm.controls['reportParameters'].controls['Maturity_Renewal'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Covering Letter option is required", "", "error")
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
        this.coveringLettersForMatRenForm.patchValue({
          reportParameters: { CoyCode: '' }
        })
      }
      else {
        this.coveringLettersForMatRenForm.patchValue({
          reportParameters: {
            CoyName: result[0][1].trim()
          }
        })
      }
    }
    // for (let i = 0; i < this.tableData.dataSet.length; i++) {
    //   if (this.tableData.dataSet[i][0].startsWith(this.coveringLettersForMatRenForm?.value?.reportParameters?.CoyCode)) {
    //     this.coveringLettersForMatRenForm.patchValue({
    //       reportParameters: {
    //         CoyName: this.tableData.dataSet[i][1].trim()
    //       }
    //     })
    //   }
    // }
    this.getTranserList(`${this.coveringLettersForMatRenForm?.value?.reportParameters?.CoyCode}`)
  }

  
}
