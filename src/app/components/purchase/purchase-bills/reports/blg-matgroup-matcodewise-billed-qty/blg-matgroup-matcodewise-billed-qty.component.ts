import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  Validators,
} from '@angular/forms';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { fileConstants } from 'src/constants/fileconstants';
import { CommonReportsService } from 'src/app/services/reports.service';
import { take } from 'rxjs';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { ModalService } from 'src/app/services/modalservice.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/services/service.service';
export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-blg-matgroup-matcodewise-billed-qty',
  templateUrl: './blg-matgroup-matcodewise-billed-qty.component.html',
  styleUrls: ['./blg-matgroup-matcodewise-billed-qty.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class BlgMatgroupMatcodewiseBilledQtyComponent implements OnInit {
  @ViewChild(F1Component) comp!: F1Component;
  loaderToggle: boolean = false;
  buildingData!: any;
  matGroupData!: any;
  matCodeData!: any;
  supplierData!: any;
  bldg_condition = '';
  bringBackColumn!: number;
  matGroups_condition = `mat_matgroup in (select ent_id from entity where ent_class = 'LEVL2')`;
  matCode_condition = '';
  supplier_condition = "par_partytype = 'S'";
  datePipe = new DatePipe('en-US');
  constructor(
    private router: Router,
    private dialog: MatDialog,
    public _service: ServiceService,
    private commonReportService: CommonReportsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    setTimeout(function () {
      document.getElementById('suppCode123')?.focus();
    }, 100);
    this.matCodeQuery();
  }

  matCodeQuery() {
    let mgc = this.bldgMatGroupMatCodeWiseSectionForm
      .get('reportParameters')
      ?.get('matGroupCode');
    let mc = this.bldgMatGroupMatCodeWiseSectionForm
      .get('reportParameters')
      ?.get('matcode');
    mgc?.valueChanges.subscribe((val: any) => {
      mc?.setValue(null);
      this.matCode_condition = `mat_matgroup IN ('${
        val ? val instanceof Object && val.join(`','`).trim() : ''
      }')`;
    });
  }

  // ngAfterViewInit(): void {
  //   this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus(); //To add default focus on input field
  // }

  bldgMatGroupMatCodeWiseSectionForm: FormGroup = new FormGroup({
    name: new FormControl(fileConstants.matCodeMatWiseBilledQty),
    seqId: new FormControl(1),
    isPrint: new FormControl(false),
    exportType: new FormControl('PDF'),
    report: new FormControl<string>('Detail', Validators.required),
    dateRange: new FormGroup({
      from: new FormControl<Date | null>(null),
      to: new FormControl<Date | null>(null),
    }),
    reportParameters: new FormGroup({
      buildingCode: new FormControl<string[] | string>(''),
      bldgCode: new FormControl(''),
      matGroup: new FormControl(''),
      matGroupCode: new FormControl<string[] | string>(''),
      matCode: new FormControl(''),
      matcode: new FormControl<string[] | string>(''),
      partyCode: new FormControl(''),
      partycode: new FormControl<string[] | string>(''),
      suppBillFromDate: new FormControl(''),
      suppBillToDate: new FormControl(''),
      reportToDate: new FormControl(''),
      reportFromDate: new FormControl(''),
      HeaderText2: new FormControl(''),
      HeaderText3: new FormControl(''),
      printAdress: new FormControl(false),
      HeaderText1: new FormControl(''),
    }),
  },{
    validators: filterAtLeastOne(),
  });

  setReportParamValues() {
    let formVal = this.bldgMatGroupMatCodeWiseSectionForm.value;

    if (formVal.report == 'Detail') {
      formVal.name =  fileConstants.matCodeMatWiseBilledQtyDet;
      console.log('reporttype0', formVal.report,fileConstants.matCodeMatWiseBilledQtyDet,formVal.name);
    }
    if (formVal.report == 'Summ') {
      formVal.name =  fileConstants.matCodeMatWiseBilledQty;
      console.log('reporttype1', formVal.report,fileConstants.matCodeMatWiseBilledQty,formVal.name);
    }

    console.log('reporttype2', formVal.report);
    this.bldgMatGroupMatCodeWiseSectionForm.patchValue({
      seqId: this.setConditionId(),
      name: formVal.name,

      reportParameters: {
        bldgCode:
          formVal.reportParameters.buildingCode &&
          formVal.reportParameters.buildingCode.length
            ? `'${formVal.reportParameters.buildingCode.join(`','`).trim()}'`
            : `'ALL'`,
        matCode:
          formVal.reportParameters.matcode &&
          formVal.reportParameters.matcode.length
            ? `'${formVal.reportParameters.matcode.join(`','`).trim()}'`
            : `'ALL'`,
        matGroup:
          formVal.reportParameters.matGroupCode &&
          formVal.reportParameters.matGroupCode.length
            ? `'${formVal.reportParameters.matGroupCode.join(`','`).trim()}'`
            : `'ALL'`,
        partyCode:
          formVal.reportParameters.partycode &&
          formVal.reportParameters.partycode.length
            ? `'${formVal.reportParameters.partycode.join(`','`).trim()}'`
            : `'ALL'`,
        HeaderText1: `'Y'`,
        suppBillFromDate: 
        this.bldgMatGroupMatCodeWiseSectionForm.controls['dateRange'].get(
          'from'
        )?.value != null &&
        this.bldgMatGroupMatCodeWiseSectionForm.controls['dateRange'].get(
          'from'
        )?.value != ''
          ? `${this.datePipe.transform(
              this.bldgMatGroupMatCodeWiseSectionForm.controls[
                'dateRange'
              ].get('from')?.value,
              'dd/MM/yyyy'
            )}`
          : ``,
          suppBillToDate: 
        this.bldgMatGroupMatCodeWiseSectionForm.controls['dateRange'].get(
          'to'
        )?.value != null &&
        this.bldgMatGroupMatCodeWiseSectionForm.controls['dateRange'].get(
          'to'
        )?.value != ''
          ? `${this.datePipe.transform(
              this.bldgMatGroupMatCodeWiseSectionForm.controls[
                'dateRange'
              ].get('to')?.value,
              'dd/MM/yyyy'
            )}`
          : ``,
        HeaderText3:
          this.bldgMatGroupMatCodeWiseSectionForm.controls['dateRange'].get(
            'to'
          )?.value != null &&
          this.bldgMatGroupMatCodeWiseSectionForm.controls['dateRange'].get(
            'to'
          )?.value != ''
            ? `'${this.datePipe.transform(
                this.bldgMatGroupMatCodeWiseSectionForm.controls[
                  'dateRange'
                ].get('to')?.value,
                'dd/MM/yyyy'
              )}'`
            : `''`,
        HeaderText2:
          this.bldgMatGroupMatCodeWiseSectionForm.controls['dateRange'].get(
            'from'
          )?.value != null &&
          this.bldgMatGroupMatCodeWiseSectionForm.controls['dateRange'].get(
            'from'
          )?.value != ''
            ? `'${this.datePipe.transform(
                this.bldgMatGroupMatCodeWiseSectionForm.controls[
                  'dateRange'
                ].get('from')?.value,
                'dd/MM/yyyy'
              )}'`
            : `''`,
      },
    });
  }

  getReport(print: boolean) {
    if (this.bldgMatGroupMatCodeWiseSectionForm?.valid) {
      if (
        this._service.printExcelChk(
          print,
          this.bldgMatGroupMatCodeWiseSectionForm.get('exportType')?.value
        )
      ) {
        this.loaderToggle = true;
        this.setReportParamValues();
        this.commonReportService
          .getParameterizedReportWithCondition(
            this.bldgMatGroupMatCodeWiseSectionForm.value
          )
          .pipe(take(1))
          .subscribe({
            next: (res: any) => {
              this.loaderToggle = false;
              let filename = this.commonReportService.getReportName();
              this._service.exportReport(
                print,
                res,
                this.bldgMatGroupMatCodeWiseSectionForm.get('exportType')
                  ?.value,
                filename
              );
            },
            error: (err: any) => {
              this.loaderToggle = false;
              setTimeout(function () {
                document.getElementById('suppCode123')?.focus();
              }, 100);
            },
          });
      }
      
    } else {
      this.bldgMatGroupMatCodeWiseSectionForm.markAllAsTouched();
      setTimeout(function () {
        document.getElementById('suppCode123')?.focus();
      }, 100);
      this.toastr.error('Select atleast one filter condition');
    }
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  public get passwordsGroup(): FormGroup {
    return this.bldgMatGroupMatCodeWiseSectionForm.get(
      'reportParameters'
    ) as FormGroup;
  }

  checkSelection() {
    let isAnyFieldSeclectd: boolean = false;
    for (const field in this.passwordsGroup.controls) {
      // 'field' is a string
      const controlValue =
        this.bldgMatGroupMatCodeWiseSectionForm.controls[
          'reportParameters'
        ].get(field)?.value;
      if (controlValue == '' || controlValue == null) {
        isAnyFieldSeclectd = false;
      } else {
        isAnyFieldSeclectd = true;
        break;
      }
    }
    return isAnyFieldSeclectd;
  }

  setConditionId() {
    if (
      this.bldgMatGroupMatCodeWiseSectionForm.controls['dateRange'].get('from')
        ?.value &&
      this.bldgMatGroupMatCodeWiseSectionForm.controls['dateRange'].get('to')
        ?.value
    ) {
      return 1;
    } else {
      return 2;
    }
  }

  showDialog(titleVal: any, message: string, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: '',
        type: type,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      setTimeout(function () {
        document.getElementById('suppCode123')?.focus();
      }, 100);
    });
  }

  resetForm(){
    this.bldgMatGroupMatCodeWiseSectionForm.reset({
      name: fileConstants.matCodeMatWiseBilledQty,
      seqId: 1,
      isPrint: false,
      exportType: 'PDF',
      report: 'Detail',
      reportParameters:{
        printAdress: false
      }
    })
    setTimeout(function() {
      document.getElementById("suppCode123")?.focus();
   }, 100);
  }
}

export function filterAtLeastOne(): ValidatorFn {
  return (g: AbstractControl): ValidationErrors | null => {
    console.log(g);
    return !g.get('buildingCode')?.value?.length &&
      !g.get('reportParameters')?.get('matGroupCode')?.value?.length &&
      !g.get('reportParameters')?.get('matcode')?.value?.length &&
      !g.get('reportParameters')?.get('partycode')?.value?.length &&
      !g.get('reportParameters')?.get('matGroupCode')?.value?.length &&
      !g.get('dateRange')?.get('from')?.value &&
      !g.get('dateRange')?.get('to')?.value
      ? { atLeastOneFilter: true }
      : null;
  };
}
