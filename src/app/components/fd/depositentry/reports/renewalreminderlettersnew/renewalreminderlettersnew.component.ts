import { Component, OnInit, ChangeDetectorRef, Renderer2, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { fileConstants } from 'src/constants/fileconstants';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import * as fileSaver from 'file-saver';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import * as constant from '../../../../../../constants/constant'
import { ModalService } from 'src/app/services/modalservice.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

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
  selector: 'app-renewalreminderlettersnew',
  templateUrl: './renewalreminderlettersnew.component.html',
  styleUrls: ['./renewalreminderlettersnew.component.css'],
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
export class RenewalreminderlettersnewComponent implements OnInit {
  monthDateField!: string
  currentDate!: string
  bringBackColumn!: number;
  tableData: any
  columnHeader: any
  coy_condition = "coy_fdyn='Y'"
  loaderToggle: boolean = false
  @ViewChild(F1Component) comp!: F1Component
  constructor(private dynapop: DynapopService, private actionService: ActionservicesService, private changeRef: ChangeDetectorRef, private router: Router, private commonReportsService: CommonReportsService, private toastr: ToasterapiService, private rendered: Renderer2, private modalService: ModalService) { }

  ngOnInit(): void {
    this.getCompanyList()
    this.monthDate()
  }
  ngAfterViewInit(): void {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus()
  }

  renewalReminderLettersForm = new FormGroup({
    name: new FormControl(fileConstants.renewalReminderLetterNew),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      Coy: new FormControl('', Validators.required),
      matLetterDate: new FormControl(new Date(), Validators.required),
      LetterDate: new FormControl(),
      MatDateField: new FormControl(moment(), Validators.required),
      companyName: new FormControl(''),
      MatDate:new FormControl()
    })
  })


  monthDate() {
    this.monthDateField = `${moment(new Date()).format('YYYY')}${moment(new Date()).format('MM')}`
    return this.monthDateField
  }

  ngAfterContentChecked() {
    this.changeRef.detectChanges()
    if (this.renewalReminderLettersForm.get("reportParameters.matLetterDate")?.value !== null) {
      this.renewalReminderLettersForm.patchValue({
        reportParameters: {
          LetterDate: `${moment(this.renewalReminderLettersForm.get("reportParameters.matLetterDate")?.value).format('DD/MM/YYYY')}`
        }
      })
    }
    else {
      this.renewalReminderLettersForm.patchValue({
        reportParameters: {
          LetterDate: null
        }
      })
    }
    this.actionService.commonFlagCheck(true, true, true, false, true, true, true, true, false, true, true)
    console.log("mat date" ,this.renewalReminderLettersForm.controls['reportParameters']?.get('MatDateField')?.value?.format('YYYMM'));
    this.renewalReminderLettersForm.patchValue({
      reportParameters:{
          MatDate: `${this.renewalReminderLettersForm.get('reportParameters.MatDateField')?.value?.format('YYYYMM')}`
      }
    })
  }


  updateDate(event: any) {

  }

  getCompanyList() {
    this.dynapop.getDynaPopListObj("COMPANY", "coy_fdyn='Y'").subscribe((res: any) => {
      this.columnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this.tableData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }

  updateLoaderFlag(event: any) {
    this.loaderToggle = event
  }

  getReport(print: boolean) {
    if (this.renewalReminderLettersForm.valid) {
      this.renewalReminderLettersForm.value.isPrint = false
      this.loaderToggle = true
      this.commonReportsService.getParameterizedReport(this.renewalReminderLettersForm.value).pipe(take(1)).subscribe({
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
        }
        ,
        error: (err: any) => {
          this.loaderToggle = false
        },
      })
    }
    else {
      this.validationFields()
      this.renewalReminderLettersForm.markAllAsTouched()
    }
  }

  print() {
    if (this.renewalReminderLettersForm.valid) {
      this.renewalReminderLettersForm.value.isPrint = true
      this.loaderToggle = true
      this.commonReportsService.getParameterizedPrintReport(this.renewalReminderLettersForm.value).pipe(take(1)).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.loaderToggle = false
            this.toastr.showSuccess(res.message)
          }
          else {
            this.toastr.showError(res.message)
          }
        }
        ,
        error: (err: any) => {
          this.loaderToggle = false
        },
      })
    }
    else {
      this.validationFields()
      this.renewalReminderLettersForm.markAllAsTouched()
    }
  }
  handleExit() {
    this.router.navigate(['/dashboard'])
  }
  validationFields() {
    if (this.renewalReminderLettersForm.controls['reportParameters'].controls['Coy'].errors && this.renewalReminderLettersForm.controls['reportParameters'].controls['Coy'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Company Code  is Required", (document.getElementById('companyCode')?.childNodes[0] as HTMLInputElement)?.focus(), "error")
    }
    else if (this.renewalReminderLettersForm.controls['reportParameters'].controls['matLetterDate'].errors && this.renewalReminderLettersForm.controls['reportParameters'].controls['matLetterDate'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Letter Date is Required", this.rendered.selectRootElement("#matLetterDateField")?.focus(), "error")
    }
    else if (this.renewalReminderLettersForm.controls['reportParameters'].controls['MatDateField'].errors && this.renewalReminderLettersForm.controls['reportParameters'].controls['MatDateField'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Month is required", this.rendered.selectRootElement("#matDateField")?.focus(), "error")
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
      console.log(result);

      if (result.length == 0) {
        this.renewalReminderLettersForm.patchValue({
          reportParameters: { Coy: '' }
        })
      }
      else {
        this.renewalReminderLettersForm.patchValue({
          reportParameters: { Coy: result[0][0].trim() }
        })
      }
    }
  }
  updateCompanyList(compData: any) {
    if (compData !== undefined) {
      this.renewalReminderLettersForm.patchValue({
        reportParameters:
          { companyName: compData[this.bringBackColumn], }
      })
    }

  }

  chosenMonthHandler(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, dateCtrl: any) {
    if (!dateCtrl?.valid) {
      this.renewalReminderLettersForm.patchValue({
        reportParameters: {
          MatDateField: normalizedMonthAndYear
        }
      })
    }
    const ctrlValue: any = dateCtrl?.value
    ctrlValue?.month(normalizedMonthAndYear?.month());
    ctrlValue?.year(normalizedMonthAndYear?.year())
    dateCtrl?.setValue(ctrlValue)
    datepicker.close();

    //  console.log(dateCtrl?.value);

    //console.log("ctrlValue",ctrlValue);
    // this.projectedMaturitiesReportForm.patchValue({
    //   reportParameters:{
    //     upToDate:ctrlValue
    //   }
    // })

  }
}
