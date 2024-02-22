import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { finalize, merge, switchMap, take } from 'rxjs';
import { PurchService } from 'src/app/services/purch/purch.service';
import { CommonReportsService } from 'src/app/services/reports.service';

import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import * as commonConstant from '../../../../../../constants/commonconstant';

@Component({
  selector: 'app-party-and-buildingwise-bills',
  templateUrl: './party-and-buildingwise-bills.component.html',
  styleUrls: ['./party-and-buildingwise-bills.component.css']
})
export class PartyAndBuildingwiseBillsComponent implements OnInit {
  party_condition = `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '${commonConstant.coyCloseDate}')`
  queryForm: FormGroup = new FormGroup({
    partyCode: new FormControl<string[]>([]),
    coyCode: new FormControl<string[]>([]),
    bldgCode: new FormControl<string[]>([]),
    suppBillNo: new FormControl<string[]>([]),
    matGroup: new FormControl<string[]>([]),
    range: new FormGroup({
      suppBillFromDate: new FormControl<Date | null>(null),
      suppBillToDate: new FormControl<Date | null>(null),
    }),
    entryDateRange: new FormGroup({
      from: new FormControl<Date | null>(null),
      to: new FormControl<Date | null>(null),
    }),
    exportType: new FormControl('PDF')
  }, {
    // validators: filterAtLeastOne()
  });
  supBillNoId = `pblh_partycode IN ('') AND pblh_bldgcode IN ('')`
  loaderToggle: boolean = false;
  formName!: string;
  conditionId: number = 0;

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    private _purch: PurchService,
    public _service: ServiceService
  ) { }

  ngOnInit(): void {
    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
    this.updateSuppBillNo()
  }

  updateSuppBillNo() {
    const reqControl = ['partyCode', 'bldgCode'];
    merge(
      ...reqControl.map((name: any) => this.queryForm.get(name)?.valueChanges)
    ).subscribe((val: any) => {
      this.queryForm.get('suppBillNo')?.setValue([]);
      let pc = this.queryForm.get('partyCode')?.value;
      let bc = this.queryForm.get('bldgCode')?.value;
      this.supBillNoId = `pblh_partycode IN ('${pc instanceof Object ? pc?.join("','") : ''}') AND pblh_bldgcode IN ('${bc instanceof Object ? bc?.join("','") : ''}')`

    })
  }

  setConditionId() {
    if (!this.queryForm.get('partyCode')?.value && !this.queryForm.get('coyCode')?.value && !this.queryForm.get('bldgCode')?.value && !this.queryForm.get('suppBillNo')?.value && !this.queryForm.get('matGroup')?.value && !this.queryForm.controls['range'].get('suppBillFromDate')?.value && !this.queryForm.controls['range'].get('suppBillToDate')?.value && !this.queryForm.controls['entryDateRange'].get('from')?.value && !this.queryForm.controls['entryDateRange'].get('to')?.value) {
      this.conditionId = 1;
    }
    else if (this.queryForm.controls['entryDateRange'].get('from')?.value && this.queryForm.controls['entryDateRange'].get('to')?.value && this.queryForm.controls['range'].get('suppBillFromDate')?.value && this.queryForm.controls['range'].get('suppBillToDate')?.value) {
      this.conditionId = 2
    }
    else if (!this.queryForm.controls['entryDateRange'].get('from')?.value && !this.queryForm.controls['entryDateRange'].get('to')?.value && !this.queryForm.controls['range'].get('suppBillFromDate')?.value && !this.queryForm.controls['range'].get('suppBillToDate')?.value) {
      this.conditionId = 3
    }
    else if (!this.queryForm.controls['entryDateRange'].get('from')?.value && !this.queryForm.controls['entryDateRange'].get('to')?.value && this.queryForm.controls['range'].get('suppBillFromDate')?.value && this.queryForm.controls['range'].get('suppBillToDate')?.value) {
      this.conditionId = 4
    }
    else if (this.queryForm.controls['entryDateRange'].get('from')?.value && this.queryForm.controls['entryDateRange'].get('to')?.value && !this.queryForm.controls['range'].get('suppBillFromDate')?.value && !this.queryForm.controls['range'].get('suppBillToDate')?.value) {
      this.conditionId = 5
    }
  }

  getReport(print: Boolean) {
    this.setConditionId()
    if (this.queryForm.valid) {
      if (this._service.printExcelChk(print, this.queryForm.get('exportType')?.value)) {
        this.loaderToggle = true;
        let payload: any = {
          name: 'PartyWiseBillSumm.rpt',
          isPrint: false,
          seqId: 1,
          conditionId: this.conditionId,
          exportType: this.queryForm.get('exportType')?.value,
          reportParameters: {
            coy: this.queryForm.get('coyCode')?.value.length &&
              this.queryForm.get('coyCode')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('coyCode')?.value.join(`','`)}'`
              : `'ALL'`,
            suppBillNo: this.queryForm.get('suppBillNo')?.value.length &&
              this.queryForm.get('suppBillNo')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('suppBillNo')?.value.join(`','`)}'`
              : `'ALL'`,
            bldgCode: this.queryForm.get('bldgCode')?.value.length &&
              this.queryForm.get('bldgCode')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('bldgCode')?.value.join(`','`)}'`
              : `'ALL'`,
            partyCode: this.queryForm.get('partyCode')?.value.length &&
              this.queryForm.get('partyCode')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('partyCode')?.value.join(`','`)}'`
              : `'ALL'`,
            matGroup: this.queryForm.get('matGroup')?.value.length &&
              this.queryForm.get('matGroup')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('matGroup')?.value.join(`','`)}'`
              : `'ALL'`,
            entryFromDate: `${moment(this.queryForm.controls['entryDateRange'].get('from')?.value).format('DD/MM/YYYY')}`,
            entryToDate: `${moment(this.queryForm.controls['entryDateRange'].get('to')?.value).format('DD/MM/YYYY')}`,
            billFromDate: `${moment(this.queryForm.controls['range'].get('suppBillFromDate')?.value).format('DD/MM/YYYY')}`,
            billToDate: `${moment(this.queryForm.controls['range'].get('suppBillToDate')?.value).format('DD/MM/YYYY')}`,
            formname: this.formName,
          },
        };
        console.log(payload, "payload");

        (this.conditionId == 1) && (payload.reportParameters.coy = "", payload.reportParameters.suppBillNo = '', payload.reportParameters.bldgCode = '', payload.reportParameters.matGroup = '', payload.reportParameters.partyCode = '')

        this._commonReport
          .getTtxParameterizedReportWithCondition(payload)
          .pipe(
            take(1),
            finalize(() => (this.loaderToggle = false))
          )
          .subscribe({
            next: (res: any) => {
              if (res) {
                let filename = this._commonReport.getReportName();
                this._service.exportReport(print, res, this.queryForm.get('exportType')?.value, filename)
              }
            },
          });
      }
    }
    else {
      this.toastr.showError('Please fill the form properly');
      this.queryForm.markAllAsTouched();
    }
  }

  resetForm(){
    this.queryForm.reset({
     exportType: 'PDF',
    })
    setTimeout(function() {
      document.getElementById("partyCode123")?.focus();
   }, 100);
  }
}

export function filterAtLeastOne(): ValidatorFn {
  return (g: AbstractControl): ValidationErrors | null => {
    return (!g.get('bldgCode')?.value?.length && !g.get('matGroup')?.value?.length && !g.get('partyCode')?.value?.length && !g.get('coyCode')?.value?.length && !g.get('suppBillNo')?.value?.length) ? { atLeastOneFilter: true } : null
  };
}
