import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant';
import * as commonConstant from '../../../../../../constants/commonconstant';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { fileConstants } from 'src/constants/fileconstants';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { DatePipe } from '@angular/common';
import { ServiceService } from 'src/app/services/service.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToastrService } from 'ngx-toastr';

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
  selector: 'app-company-wise-purchases',
  templateUrl: './company-wise-purchases.component.html',
  styleUrls: ['./company-wise-purchases.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class CompanyWisePurchasesComponent implements OnInit {
  @ViewChild(F1Component) comp!: F1Component;
  compHeader!: any[];
  compData!: any;
  columnHeader!: any[];
  projectHeader!: any[];
  projectData!: any;
  projectColumnHeader!: any[];
  buildingData!: any;
  buildingColumnHeader!: any[];
  supplierData!: any;
  supplierColumnHeader!: any[];
  matGroupData!: any;
  matGroupColumnHeader!: any[];
  matCodeData!: any;
  matCodeColumnHeader!: any[];
  billTypeData!: any;
  billTypeColumnHeader!: any[];
  bringBackColumn!: number;
  readonlyAttr: boolean = true;
  supplier_condition = '';
  bldg_condition = '';
  proj_condition = '';
  matGroups_condition = `mat_level ='1' and (mat_closedate IS NULL OR mat_closedate = '01/JAN/2050')`;
  matCode_condition = '';
  billType_condition = '';
  loaderToggle: boolean = false;
  datePipe = new DatePipe('en-US');


  constructor(
    private rendered: Renderer2,
    private modalService: ModalService,
    public _service: ServiceService,
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    setTimeout(function () {
      document.getElementById('company4')?.focus();
    }, 100);
  }

  focusField(fieldId: any) {
    let el = document.getElementById(fieldId)
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  companyWisePurchaseSectionForm: FormGroup = new FormGroup({
    name: new FormControl(fileConstants.companyWisePurchase),
    conditionId: new FormControl(1),
    seqId: new FormControl(1),
    exportType: new FormControl('PDF'),
    isPrint: new FormControl(false),
    entryRange: new FormGroup({
      from: new FormControl<Date | null>(null),
      to: new FormControl<Date | null>(null),
    }),
    billRange: new FormGroup({
      from: new FormControl<Date | null>(null),
      to: new FormControl<Date | null>(null),
    }),
    reportParameters: new FormGroup(
      {
        companyCode: new FormControl<string[] | string>(''),
        coy: new FormControl(''),
        companyName: new FormControl(''),
        projectCode: new FormControl<string[] | string>(''),
        project: new FormControl(''),
        projectName: new FormControl(''),
        buildCode: new FormControl<string[] | string>(''),
        bldgCode: new FormControl(''),
        buildingName: new FormControl(''),
        suppCode: new FormControl<string[] | string>(''),
        partyCode: new FormControl(''),
        supplierName: new FormControl(''),
        matGroupCode: new FormControl<string[] | string>(''),
        matGroup: new FormControl(''),
        matGroupName: new FormControl(''),
        matCode: new FormControl<string[] | string>(''),
        materialCode: new FormControl(''),
        materialCodeName: new FormControl(''),
        bill: new FormControl<string[] | string>(''),
        billType: new FormControl(''),
        billTypeName: new FormControl(''),
        supplierFromDate: new FormControl(),
        suppBillFromDate: new FormControl(''),
        suppBillToDate: new FormControl(''),
        supplierToDate: new FormControl(),
        entryToDate: new FormControl(''),
        entryReportToDate: new FormControl(),
        entryFromDate: new FormControl(''),
        entryReportFromDate: new FormControl(),
        closeDate: new FormControl(''),
        formname: new FormControl(''),
      }
    ),
  },
  {
    validators: filterAtLeastOne(),
  });

  setReportValues() {
    this.setFormName();
    this.setConditionValue();
    console.log(
      this.companyWisePurchaseSectionForm.controls['reportParameters'].get(
        'bill'
      )?.value
    );
    this.companyWisePurchaseSectionForm.patchValue({
      reportParameters: {
        coy: this.companyWisePurchaseSectionForm.controls[
          'reportParameters'
        ].get('companyCode')?.value
          ? this.companyWisePurchaseSectionForm.controls['reportParameters']
              .get('companyCode')
              ?.value[0][0]?.trim()
          : 'ALL',
        project: this.companyWisePurchaseSectionForm.controls[
          'reportParameters'
        ].get('projectCode')?.value
          ? this.companyWisePurchaseSectionForm.controls['reportParameters']
              .get('projectCode')
              ?.value[0][0]?.trim()
          : 'ALL',
        bldgCode: this.companyWisePurchaseSectionForm.controls[
          'reportParameters'
        ].get('buildCode')?.value
          ? this.companyWisePurchaseSectionForm.controls['reportParameters']
              .get('buildCode')
              ?.value[0][0]?.trim()
          : 'ALL',
        billType: this.companyWisePurchaseSectionForm.controls[
          'reportParameters'
        ].get('bill')?.value
          ? this.companyWisePurchaseSectionForm.controls['reportParameters']
              .get('bill')
              ?.value[0][0]?.trim()
          : 'ALL',
        matGroup: this.companyWisePurchaseSectionForm.controls[
          'reportParameters'
        ].get('matGroupCode')?.value
          ? this.companyWisePurchaseSectionForm.controls['reportParameters']
              .get('matGroupCode')
              ?.value[0][0]?.trim()
          : 'ALL',
        partyCode: this.companyWisePurchaseSectionForm.controls[
          'reportParameters'
        ].get('suppCode')?.value
          ? this.companyWisePurchaseSectionForm.controls['reportParameters']
              .get('suppCode')
              ?.value[0][0]?.trim()
          : 'ALL',
        materialCode: this.companyWisePurchaseSectionForm.controls[
          'reportParameters'
        ].get('matCode')?.value
          ? this.companyWisePurchaseSectionForm.controls['reportParameters']
              .get('suppCode')
              ?.value[0][0]?.trim()
          : 'ALL',
        suppBillFromDate: this.companyWisePurchaseSectionForm.controls[
          'billRange'
        ].get('from')?.value
          ? this.datePipe.transform(
              this.companyWisePurchaseSectionForm.controls['billRange'].get(
                'from'
              )?.value,
              'dd/MM/yyyy'
            )
          : '',
        suppBillToDate: this.companyWisePurchaseSectionForm.controls[
          'billRange'
        ].get('to')?.value
          ? this.datePipe.transform(
              this.companyWisePurchaseSectionForm.controls['billRange'].get(
                'to'
              )?.value,
              'dd/MM/yyyy'
            )
          : '',
        entryFromDate: this.companyWisePurchaseSectionForm.controls[
          'entryRange'
        ].get('from')?.value
          ? this.datePipe.transform(
              this.companyWisePurchaseSectionForm.controls['entryRange'].get(
                'from'
              )?.value,
              'dd/MM/yyyy'
            )
          : '',
        entryToDate: this.companyWisePurchaseSectionForm.controls[
          'entryRange'
        ].get('to')?.value
          ? this.datePipe.transform(
              this.companyWisePurchaseSectionForm.controls['entryRange'].get(
                'to'
              )?.value,
              'dd/MM/yyyy'
            )
          : '',
        closeDate: commonConstant.coyCloseDate,
      },
    });
  }

  getReport(print: boolean) {
    if (this.companyWisePurchaseSectionForm?.valid) {
      if (
        this._service.printExcelChk(
          print,
          this.companyWisePurchaseSectionForm.get('exportType')?.value!
        )
      ) {
        this.loaderToggle = true;
        this.setReportValues();
        this.commonReportService
          .getTtxParameterizedReportWithCondition(
            this.companyWisePurchaseSectionForm.value
          )
          .pipe(take(1))
          .subscribe({
            next: (res: any) => {
              console.log('REesult ', res);
              this.loaderToggle = false;
              let filename = this.commonReportService.getReportName();
              this._service.exportReport(
                print,
                res,
                this.companyWisePurchaseSectionForm.get('exportType')?.value!,
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
      this.companyWisePurchaseSectionForm.markAllAsTouched();
      this.toastr.error('Atleast Once Criteria has to be specified');
      setTimeout(function () {
        document.getElementById('companyCode')?.focus();
      }, 100);
    }
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  setFormName() {
    this._service.pageData.subscribe({
      next: (val) => {
        this.companyWisePurchaseSectionForm.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
  }

  setConditionValue() {
    let conditiionVal = 0;
    if (
      this.companyWisePurchaseSectionForm.controls['billRange'].get('from')
        ?.value &&
      this.companyWisePurchaseSectionForm.controls['billRange'].get('to')
        ?.value &&
      !(
        this.companyWisePurchaseSectionForm.controls['entryRange'].get('from')
          ?.value &&
        this.companyWisePurchaseSectionForm.controls['entryRange'].get('to')
          ?.value
      )
    ) {
      conditiionVal = 3;
    } else if (
      this.companyWisePurchaseSectionForm.controls['billRange'].get('from')
        ?.value &&
      this.companyWisePurchaseSectionForm.controls['billRange'].get('to')
        ?.value &&
      this.companyWisePurchaseSectionForm.controls['entryRange'].get('from')
        ?.value &&
      this.companyWisePurchaseSectionForm.controls['entryRange'].get('to')
        ?.value
    ) {
      conditiionVal = 1;
    } else if (
      !(
        this.companyWisePurchaseSectionForm.controls['billRange'].get('from')
          ?.value &&
        this.companyWisePurchaseSectionForm.controls['billRange'].get('to')
          ?.value
      ) &&
      this.companyWisePurchaseSectionForm.controls['entryRange'].get('from')
        ?.value &&
      this.companyWisePurchaseSectionForm.controls['entryRange'].get('to')
        ?.value
    ) {
      conditiionVal = 2;
    } else {
      conditiionVal = 4;
    }
    this.companyWisePurchaseSectionForm.patchValue({
      conditionId: conditiionVal,
    });
  }

  checkIsDataValid() {
    if (
      this.companyWisePurchaseSectionForm.controls['reportParameters'].get(
        'suppBillFromDate'
      )?.value != '' &&
      (this.companyWisePurchaseSectionForm.controls['reportParameters'].get(
        'suppBillToDate'
      )?.value == null ||
        this.companyWisePurchaseSectionForm.controls['reportParameters'].get(
          'suppBillToDate'
        )?.value == '')
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Invalid Bill To Date.',
        this.rendered.selectRootElement(`#toDateField`)?.focus(),
        'error'
      );
      this.companyWisePurchaseSectionForm.patchValue({
        reportParameters: {
          suppBillToDate: '',
        },
      });
      return false;
    } else if (
      this.companyWisePurchaseSectionForm.controls['reportParameters'].get(
        'entryFromDate'
      )?.value != '' &&
      (this.companyWisePurchaseSectionForm.controls['reportParameters'].get(
        'entryToDate'
      )?.value == null ||
        this.companyWisePurchaseSectionForm.controls['reportParameters'].get(
          'entryToDate'
        )?.value == '')
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Invalid Entry To Date.',
        this.rendered.selectRootElement(`#entryToField`)?.focus(),
        'error'
      );
      this.companyWisePurchaseSectionForm.patchValue({
        reportParameters: {
          entryToDate: '',
        },
      });
      return false;
    } else {
      return true;
    }
  }

  resetForm(){
    this.companyWisePurchaseSectionForm.reset({
    name: fileConstants.companyWisePurchase,
     conditionId: 1,
     seqId: 1,
     isPrint: false,
     exportType: 'PDF',
    })
    setTimeout(function() {
      document.getElementById("company4")?.focus();
   }, 100);
  }
}

export function filterAtLeastOne(): ValidatorFn {
  return (g: AbstractControl): ValidationErrors | null => {
    return !g.get('reportParameters')?.get('companyCode')?.value?.length &&
      !g.get('reportParameters')?.get('projectCode')?.value?.length &&
      !g.get('reportParameters')?.get('buildCode')?.value?.length &&
      !g.get('reportParameters')?.get('suppCode')?.value?.length &&
      !g.get('reportParameters')?.get('matGroupCode')?.value?.length &&
      !g.get('reportParameters')?.get('matCode')?.value?.length &&
      !g.get('reportParameters')?.get('bill')?.value?.length &&
      !g.get('entryRange')?.get('from')?.value &&
      !g.get('entryRange')?.get('to')?.value &&
      !g.get('billRange')?.get('from')?.value &&
      !g.get('billRange')?.get('from')?.value
      ? { atLeastOneFilter: true }
      : null;
  };
}
