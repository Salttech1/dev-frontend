import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';
import * as commonConstant from '../../../../../../constants/commonconstant';
import { ServiceService } from 'src/app/services/service.service';
import { fileConstants } from 'src/constants/fileconstants';
import { Router } from '@angular/router';
import { CommonReportsService } from 'src/app/services/reports.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { merge, take } from 'rxjs';
import { ToasterapiService } from 'src/app/services/toasterapi.service';

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
  selector: 'app-cheque-wise-bills-report',
  templateUrl: './cheque-wise-bills-report.component.html',
  styleUrls: ['./cheque-wise-bills-report.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class ChequeWiseBillsReportComponent implements OnInit {
  compHeader!: any[];
  compData!: any;
  columnHeader!: any[];
  buildingData!: any;
  buildingColumnHeader!: any[];
  supplierData!: any;
  supplierColumnHeader!: any[];
  chqNoData!: any;
  chqNoColumnHeader!: any[];
  bringBackColumn!: number;
  readonlyAttr: boolean = true;
  supplier_condition = '';
  bldg_condition = '';
  chqno_condition = '';
  loaderToggle: boolean = false;
  datePipe = new DatePipe('en-US');
  formName: any ;
  constructor(
    public _service: ServiceService,
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToasterapiService
  ) {}

  ngOnInit(): void {
    this.cheqNoCondition();
    setTimeout(function () {
      document.getElementById('company4')?.focus();
    }, 100);
  }

  cheqNoCondition() {
    let mgc = this.chequeWiseBillSectionForm
      .get('reportParameters')
      ?.get('suppCode');
    let mc = this.chequeWiseBillSectionForm
      .get('reportParameters')
      ?.get('chqNo');
    mgc?.valueChanges.subscribe((val: any) => {
      mc?.setValue(null);
      let blgCode = this.chequeWiseBillSectionForm.controls[
        'reportParameters'
      ].get('buildingCode')?.value
        ? this.chequeWiseBillSectionForm.controls['reportParameters']
            .get('buildingCode')
            ?.value[0][0]?.trim()
        : 'ALL';
      let coyCode = this.chequeWiseBillSectionForm.controls[
        'reportParameters'
      ].get('coyCode')?.value
        ? this.chequeWiseBillSectionForm.controls['reportParameters']
            .get('coyCode')
            ?.value[0][0]?.trim()
        : 'ALL';
      let suppCpde = this.chequeWiseBillSectionForm.controls[
        'reportParameters'
      ].get('suppCode')?.value
        ? this.chequeWiseBillSectionForm.controls['reportParameters']
            .get('suppCode')
            ?.value[0][0]?.trim()
        : 'ALL';
      this.chqno_condition = `('ALL' IN  ('${coyCode}') OR pblh_coy in ('${coyCode}')) AND  ('ALL' IN  ('${blgCode}') OR pblh_bldgcode in ('${blgCode}')) AND ('ALL' IN  ('${suppCpde}') OR pblh_partycode in ('${suppCpde}'))`;
    });
  }

  chequeWiseBillSectionForm: FormGroup = new FormGroup(
    {
      name: new FormControl(fileConstants.chequeWiseBills),
      conditionId: new FormControl(1),
      seqId: new FormControl(1),
      isPrint: new FormControl(false),
      exportType: new FormControl('PDF'),
      dateRange: new FormGroup({
        from: new FormControl<Date | null>(null),
        to: new FormControl<Date | null>(null),
      }),
      reportParameters: new FormGroup({
        coyCode: new FormControl<string[] | string>(''),
        TxtCoyCode: new FormControl(''),
        companyName: new FormControl(''),
        buildingCode: new FormControl<string[] | string>(''),
        TxtBldgCode: new FormControl(''),
        buildingName: new FormControl(''),
        TxtSuppCode: new FormControl(''),
        suppCode: new FormControl<string[] | string>(''),
        supplierName: new FormControl(''),
        chqNo: new FormControl<string[] | string>(''),
        TxtChqNo: new FormControl(''),
        TxtChqDtFrm: new FormControl(''),
        TxtChqDtTo: new FormControl(''),
        chqFromDate: new FormControl(''),
        chqToDate: new FormControl(''),
        FromDate: new FormControl(''),
        ToDate: new FormControl(''),
        formname: new FormControl(''),
        coyCloseDate: new FormControl(''),
      }),
    },
    {
      validators: filterAtLeastOne(),
    }
  );

  setReportParamValues() {
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`
        this.chequeWiseBillSectionForm.patchValue({
          reportParameters: {
            formname:  this.formName,
          },
        });
      },
    });
    this.chequeWiseBillSectionForm.patchValue({
      conditionId: this.setConditionId(),
      reportParameters: {
        coyCloseDate: commonConstant.coyCloseDate,
        TxtBldgCode: this.chequeWiseBillSectionForm.controls[
          'reportParameters'
        ].get('buildingCode')?.value
          ? this.chequeWiseBillSectionForm.controls['reportParameters']
              .get('buildingCode')
              ?.value[0][0]?.trim()
          : 'ALL',
        TxtCoyCode: this.chequeWiseBillSectionForm.controls[
          'reportParameters'
        ].get('coyCode')?.value
          ? this.chequeWiseBillSectionForm.controls['reportParameters']
              .get('coyCode')
              ?.value[0][0]?.trim()
          : 'ALL',
        TxtSuppCode: this.chequeWiseBillSectionForm.controls[
          'reportParameters'
        ].get('suppCode')?.value
          ? this.chequeWiseBillSectionForm.controls['reportParameters']
              .get('suppCode')
              ?.value[0][0]?.trim()
          : 'ALL',
        TxtChqNo: this.chequeWiseBillSectionForm.controls[
          'reportParameters'
        ].get('chqNo')?.value
          ? this.chequeWiseBillSectionForm.controls['reportParameters']
              .get('chqNo')
              ?.value[0][0]?.trim()
          : 'ALL',
        TxtChqDtFrm: this.datePipe.transform(
          this.chequeWiseBillSectionForm.controls['dateRange'].get('from')
            ?.value,
          'dd/MM/yyyy'
        ),
        TxtChqDtTo: this.datePipe.transform(
          this.chequeWiseBillSectionForm.controls['dateRange'].get('to')?.value,
          'dd/MM/yyyy'
        ),
        FromDate: this.chequeWiseBillSectionForm.controls['dateRange'].get(
          'from'
        )?.value
          ? `'${this.datePipe.transform(
              this.chequeWiseBillSectionForm.controls['dateRange'].get('from')
                ?.value,
              'dd/MM/yyyy'
            )}'`
          : `''`,
        ToDate: this.chequeWiseBillSectionForm.controls['dateRange'].get('to')
          ?.value
          ? `'${this.datePipe.transform(
              this.chequeWiseBillSectionForm.controls['dateRange'].get('to')
                ?.value,
              'dd/MM/yyyy'
            )}'`
          : `''`,
      },
    });
  }

  setConditionId() {
    if (
      this.chequeWiseBillSectionForm.controls['dateRange'].get('from')?.value &&
      this.chequeWiseBillSectionForm.controls['dateRange'].get('to')?.value
    ) {
      return 1;
    } else {
      return 2;
    }
  }

  getReport(print: boolean) {
    if (this.chequeWiseBillSectionForm?.valid) {
      if (
        this._service.printExcelChk(
          print,
          this.chequeWiseBillSectionForm.get('exportType')?.value!
        )
      ) {
        this.loaderToggle = true;
        this.setReportParamValues();
        this.commonReportService
          .getTtxParameterizedReportWithCondition(
            this.chequeWiseBillSectionForm.value
          )
          .pipe(take(1))
          .subscribe({
            next: (res: any) => {
              this.loaderToggle = false;
              let filename = this.commonReportService.getReportName();
              this._service.exportReport(
                print,
                res,
                this.chequeWiseBillSectionForm.get('exportType')?.value!,
                filename
              );
            },
            error: (err: any) => {
              this.loaderToggle = false;
              setTimeout(function () {
                document.getElementById('company4')?.focus();
              }, 100);
            },
          });
      }
    } else {
      this.chequeWiseBillSectionForm.markAllAsTouched();
      this.toastr.showError('Atleast Once Criteria has to be specified');
      setTimeout(function () {
        document.getElementById('company4')?.focus();
      }, 100);
    }
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  resetForm(){
    this.chequeWiseBillSectionForm.reset({
      name: fileConstants.chequeWiseBills,
      seqId: 1,
      conditionId: 1,
      isPrint: false,
      exportType: 'PDF',
      reportParameters:{
        printAdress: false,
        formname: this.formName
      }
    })
    setTimeout(function () {
      document.getElementById('company4')?.focus();
    }, 100);
  }
}

export function filterAtLeastOne(): ValidatorFn {
  return (g: AbstractControl): ValidationErrors | null => {
    return !g.get('reportParameters')?.get('coyCode')?.value?.length &&
      !g.get('reportParameters')?.get('buildingCode')?.value?.length &&
      !g.get('reportParameters')?.get('suppCode')?.value?.length &&
      !g.get('reportParameters')?.get('chqNo')?.value?.length &&
      !g.get('dateRange')?.get('from')?.value &&
      !g.get('entryRange')?.get('to')?.value
      ? { atLeastOneFilter: true }
      : null;
  };
}
