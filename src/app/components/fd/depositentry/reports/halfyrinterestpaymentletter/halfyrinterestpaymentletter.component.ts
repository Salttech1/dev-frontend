import { ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynapopService } from 'src/app/services/dynapop.service';
import * as fileSaver from 'file-saver';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { fileConstants } from 'src/constants/fileconstants';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { take } from 'rxjs';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant'
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
  selector: 'app-halfyrinterestpaymentletter',
  templateUrl: './halfyrinterestpaymentletter.component.html',
  styleUrls: ['./halfyrinterestpaymentletter.component.css'],
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
export class HalfyrinterestpaymentletterComponent implements OnInit {
  @ViewChild(F1Component) comp!: F1Component
  columnHeader!: any[];
  tableData: any;
  bringBackColumn!: number;
  depositorFromTableData: any;
  depositorFromColumnHeader!: any[]
  depositorUpToTableData: any;
  depositorUpToColumnHeader!: any
  coy_condition = "coy_fdyn='Y'"
  deptDyanPop!: string;
  loaderToggle: boolean = false;

  constructor(private dynapop: DynapopService, private router: Router,  private commonReportsService: CommonReportsService,private modalService: ModalService,
    private toastr: ToasterapiService, private renderer: Renderer2, private changeDetection: ChangeDetectorRef) { }

  halfYrInterestReportFormGroup = new FormGroup({ 
    coy: new FormControl('', Validators.required),
    companyName: new FormControl(),
    depFrom: new FormControl('', Validators.required),
    depTo: new FormControl('', Validators.required),
    chequeDate: new FormControl('', Validators.required),
  });



  ngOnInit(): void {
    this.getCompanyList();
  }

  ngAfterViewInit() {
    this.renderer.selectRootElement(this.comp.fo1.nativeElement)?.focus();
  }


  ngAfterContentChecked() {
    this.changeDetection.detectChanges()
    if (this.halfYrInterestReportFormGroup.get('coy')?.value == '') {
      this.halfYrInterestReportFormGroup.patchValue({

          companyName: ''
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

  updateCompanyList(compData: any) {
    if (compData !== undefined) {
      this.halfYrInterestReportFormGroup.patchValue({
          companyName: compData[this.bringBackColumn],
      })

      //get depositor list
      this.deptDyanPop = `deptr_coy='${compData[this.bringBackColumn - 1]}'`
      this.dynapop.getDynaPopListObj("DEPOSITORS", `deptr_coy='${compData[this.bringBackColumn - 1]}'`)
        .subscribe((res: any) => {
          this.depositorFromColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
          this.depositorUpToColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
          this.depositorFromTableData = res.data,
            this.depositorUpToTableData = res.data
        })
    }
  }

  updateOnChangeCompanyList(event: any) {
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
        this.halfYrInterestReportFormGroup.patchValue({
           coy: '' 
        })
      }
      else {
        this.halfYrInterestReportFormGroup.patchValue({
            companyName: result[0][1].trim()
        })
      }
    }
  }

  handleExit(){
    this.router.navigate(['/dashboard'])
  }

  getReport(print: boolean){
    if(this.halfYrInterestReportFormGroup?.valid){
      let reportPayload = {
        name: fileConstants.halfYrInterestLetter,
        seqId: (moment(this.halfYrInterestReportFormGroup.get('chequeDate')?.value).month() + 1)  ==  4 ? 1 : 2,
        isPrint : false,
        reportParameters: {
          CompanyCode : `'${this.halfYrInterestReportFormGroup.get('coy')?.value?.trim()}'`,
          DeptrFrom: `'${this.halfYrInterestReportFormGroup.get('depFrom')?.value?.trim()}'`,
          DeptrTo: `'${this.halfYrInterestReportFormGroup.get('depTo')?.value?.trim()}'`,
          UpToDate:  (moment(this.halfYrInterestReportFormGroup.get('chequeDate')?.value).month() + 1)  ==  4 ? 
          "31/03/".concat(moment(this.halfYrInterestReportFormGroup.get('chequeDate')?.value).year().toString()) :
          moment(this.halfYrInterestReportFormGroup.get('chequeDate')?.value).format('DD/MM/YYYY')
        }
      }
      this.loaderToggle = true;
      this.commonReportsService.getParameterizedReportWithCondition(reportPayload).pipe(take(1)).subscribe({
        next: (res: any) => {
          if (res?.type == 'application/json') {
            this.toastr.showError('No Records Found')
          }
          else {
            let pdf = new Blob([res], { type: "application/pdf" });
            let filename = this.commonReportsService.getReportName();
            if (print) {
              const blobUrl = URL.createObjectURL(pdf);
              const oWindow = window.open(blobUrl, '_blank');
              oWindow?.print();
            } else {
              fileSaver.saveAs(pdf, filename);
            }
          }
        },
        error: (err: any) => {
          this.loaderToggle = false
          console.log(err, "err");
        },
        complete: () => {
          this.loaderToggle = false
        }
      });
    }
    else{
      this.validationField();
      this.halfYrInterestReportFormGroup.markAllAsTouched();
    }
  }

  validationField() {
    if (this.halfYrInterestReportFormGroup.controls['coy'].errors && this.halfYrInterestReportFormGroup.controls['coy'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Invalid Company Code", this.renderer.selectRootElement(this.comp.fo1.nativeElement)?.focus(), "error")
    }
    else if (this.halfYrInterestReportFormGroup.controls['depFrom'].errors && this.halfYrInterestReportFormGroup.controls['depFrom'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Depositor From Code is required", (document.getElementById("depositorFromCode")?.childNodes[0] as HTMLInputElement)?.focus(), "error")
    }
    else if (this.halfYrInterestReportFormGroup.controls['depTo'].errors && this.halfYrInterestReportFormGroup.controls['depTo'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Depositor To Code is required", (document.getElementById("UpToCode")?.childNodes[0] as HTMLInputElement)?.focus(), "error")
    }
    else if (this.halfYrInterestReportFormGroup.controls['chequeDate'].errors && this.halfYrInterestReportFormGroup.controls['chequeDate'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Cheque Date is required ", this.renderer.selectRootElement("#chqDataField")?.focus(), "error")
    }
  }
}
