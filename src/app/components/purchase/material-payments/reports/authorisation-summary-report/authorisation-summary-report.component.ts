import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';

import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import * as commonConstant from '../../../../../../constants/commonconstant';

@Component({
  selector: 'app-authorisation-summary-report',
  templateUrl: './authorisation-summary-report.component.html',
  styleUrls: ['./authorisation-summary-report.component.css'],
})
export class AuthorisationSummaryReportComponent implements OnInit {
  conditionId = 1
  regionCode: any
  multiCoy: boolean = true
  bldgQuery = ``
  party_condition = `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '${commonConstant.coyCloseDate}')`
  queryForm: FormGroup = new FormGroup({
    partyCode: new FormControl<string[]>([]),
    coy: new FormControl<string[]>([]),
    misProjCode: new FormControl<string[]>([]),
    bldgCode: new FormControl<string[]>([]),
    matGroup: new FormControl<string[]>([]),
    name: new FormControl<string | null>('MatWise', Validators.required),
    Remarks: new FormControl<string | null>(''),
    bldgRegion: new FormControl<string | null>(''),
    authRange: new FormGroup(
      {
        start: new FormControl<Date | null>({ value: null, disabled: false }),
        end: new FormControl<Date | null>({ value: null, disabled: false }),
      },
      Validators.required
    ),
    exportType: new FormControl('PDF')
  }, formValid());

  loaderToggle: boolean = false;
  formName!: string;

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    public _service: ServiceService
  ) { }

  ngOnInit(): void {
    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
    this.queryForm.get('bldgRegion')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          this.regionCode = !!res.length && res[0][0];
        }
      },
    })
    this.queryForm.get('misProjCode')?.valueChanges.subscribe({
      next: (res: any) => {
        res ? (this.bldgQuery = `bldg_misproject in('${this.queryForm.get('misProjCode')?.value?.join("','")}')`) : this.bldgQuery = ``
      }
    })
    this.queryForm.get('coy')?.valueChanges.subscribe({
      next: (res: any) => {
        !this.multiCoy && res ? (this.bldgQuery = `bldg_coy in('${this.queryForm.get('coy')?.value[0][0]?.trim()}')`) : this.bldgQuery = ``
      }
    })
  }

  setConditionId() {
    let start = this.queryForm.controls['authRange']?.get('start')?.value;
    let end = this.queryForm.controls['authRange']?.get('end')?.value;
    // console.log((this.queryForm.get('name')?.value != '5BldgWise'),"0000", this.queryForm.get('name')?.value);
    //  console.log(!this.queryForm.get('coy')?.value.length, !this.queryForm.get('misProjCode')?.value.length, !this.queryForm.get('partyCode')?.value.length, !this.queryForm.get('bldgCode')?.value.length, !this.queryForm.get('matGroup')?.value.length, this.queryForm.get('bldgRegion')?.value, (!start || !end));
    if (this.queryForm.get('name')?.value != '5BldgWise' && this.queryForm.get('name')?.value != '5BldgWise(qtyareaengg)' && this.queryForm.get('name')?.value != 'CoyBldgWiseConsumption') {
      if (!this.queryForm.get('coy')?.value.length && !this.queryForm.get('misProjCode')?.value.length && !this.queryForm.get('partyCode')?.value.length && !this.queryForm.get('bldgCode')?.value.length && !this.queryForm.get('matGroup')?.value.length && !this.queryForm.get('bldgRegion')?.value && (!start || !end)) {
        this.conditionId = 1
      }
      else if (start && end) {
        this.conditionId = 2
      }
      else if (!start || !end) {
        this.conditionId = 3
      }
    }
    else if (this.queryForm.get('name')?.value == '5BldgWise' || this.queryForm.get('name')?.value != '5BldgWise(qtyareaengg)') {
      if (start && end) {
        this.conditionId = 1
      }
      else if (!start || !end) {
        this.conditionId = 2
      }
    }
  }

  clearField() {
    let resetField = ['coy', 'bldgCode', 'misProjCode', 'partyCode', 'matGroup', 'bldgRegion', 'Remarks'];
    this.queryForm.get('authRange')?.reset()
    resetField.forEach(element => {
      this.queryForm.get(`${element}`)?.patchValue('')
    });
 
  }

  disableField() {
    // if (this.queryForm.get('name')?.value == 'SuppWise' || this.queryForm.get('name')?.value == 'MatSuppWise' || this.queryForm.get('name')?.value == 'BldgMatWise') {
    //   this.queryForm.enable()
    //   this.queryForm.get('bldgRegion')?.disable(); this.queryForm.get('misProjCode')?.disable();
    //   this.queryForm.get('bldgRegion')?.patchValue(''); this.queryForm.get('misProjCode')?.patchValue([]);
    // }
    if (this.queryForm.get('name')?.value == 'CoyBldgWiseConsumption') {
      this.queryForm.disable(),
        this.clearField(),
        this.queryForm.get('coy')?.enable(),
        this.queryForm.get('bldgCode')?.enable(),
        this.queryForm.get('name')?.enable(),
        this.queryForm.get('exportType')?.enable(),
        this.multiCoy = false
    }
    else {
      this.queryForm.enable()
      this.queryForm.get('coy')?.patchValue('')
      this.multiCoy = true
    }
  }

  setOrderByCoyBldgConsum() {
    let orderBy: any = []
    if (!this.multiCoy) {
      if (this.queryForm.get('bldgCode')?.value.length) {
        for (let i = 0; i < this.queryForm.get('bldgCode')?.value.length; i++) {
          orderBy.push(this.queryForm.get('bldgCode')?.value[i])
          orderBy.push(`${i + 1}`)
        }
        return `order by Decode(BLDG_CODE,'${orderBy.join(`','`)}')`
      }
      else {
        return "ORDER BY ' ',BLDG_CODE, BLDG_NAME, BLDG_AREAENGG "
      }
    }
    return
  }

  getReport(print: boolean) {
    this.setConditionId()
    let start = this.queryForm.controls['authRange']?.get('start')?.value;
    let end = this.queryForm.controls['authRange']?.get('end')?.value;
    if (this.queryForm.valid) {
      console.log(this.queryForm.get('bldgRegion')?.value);
      
      if (this._service.printExcelChk(print, this.queryForm.get('exportType')?.value)) {
        this.loaderToggle = true
        let payload: any = {
          name: (this.queryForm.get('name')?.value == '5BldgWise' || this.queryForm.get('name')?.value == '5BldgWise(qtyareaengg)') ? `${this.queryForm.get('name')?.value}.rpt` : `AuthSumm-${this.queryForm.get('name')?.value}.rpt`,
          seqId: 1,
          conditionId: !this.multiCoy ? 1 : this.conditionId,
          isPrint: false,
          exportType: this.queryForm.get('exportType')?.value,
          reportParameters: {
            coyCloseDate: "01/01/2050",
            coy: this.queryForm.get('coy')?.value.length &&
              this.queryForm.get('coy')?.value[0] != 'ALL'
              ? !this.multiCoy ? `'${this.queryForm.get('coy')?.value[0][0]}'` : `'${this.queryForm.get('coy')?.value.join(`','`)}'`
              : `'ALL'`,
            formname: this.formName,
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
            region: this.queryForm.get('bldgRegion')?.value.length
              ? `'${this.regionCode?.trim()}'`
              : `'ALL'`,
            Period: (start && end) ? `'Authorisation Date From ${moment(start).format('DD/MM/YYYY')} To ${moment(end).format('DD/MM/YYYY')}'` : '',
            misProjCode: this.queryForm.get('misProjCode')?.value.length &&
              this.queryForm.get('misProjCode')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('misProjCode')?.value.join(`','`)}'`
              : `'ALL'`,
            Remark: `'${this.queryForm.get('Remarks')?.value}'`
          },
        }
        if (start && end) {
          payload.reportParameters.authFromDate = moment(start).format('DD.MM.YYYY'),
            payload.reportParameters.authToDate = moment(end).format('DD.MM.YYYY')
        }
        if (!this.multiCoy) {
          payload.reportParameters.orderBy = `${this.setOrderByCoyBldgConsum()}`
        }
        console.log(payload);
        this.queryForm.get('name')?.value != 'BldgMatSuppWise' && this._commonReport
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
        // timeout issue coming for this need to handle on background
        this.queryForm.get('name')?.value == 'BldgMatSuppWise' && this._commonReport
          .getTtxParameterizedReportWithCondition(payload)
          .pipe(take(1), finalize(() => (this.loaderToggle = false)))
          .subscribe({
            next: (res: any) => {
              if (res) {
                let filename = this._commonReport.getReportName();
                this._service.exportReport(print, res, this.queryForm.get('exportType')?.value, filename)
              }
              // res?.status ? this.toastr.showSuccess(`${res.message} Please Go To Report Page.`) : this.toastr.showSuccess(`${res.message}`)
            },
          });
      }
    }
    else {
      this.queryForm.markAllAsTouched()
    }
  }

  
  resetForm(){
    this.queryForm.reset({
    name:'MatWise',
     isPrint: false,
     exportType: 'PDF',
     misProjCode: {value: [], disabled: false},
     partyCode: {value: [], disabled: false},
     Remarks: {value : '', disabled: false},
     bldgRegion: {value : '', disabled: false},
     matGroup :  {value: [], disabled: false},
     authRange:
      {
        start: { value: null, disabled: false },
        end: { value: null, disabled: false },
      }
    })
    setTimeout(function() {
      document.getElementById("company4")?.focus();
   }, 100);
  }
}
export function formValid(): ValidatorFn {
  return (_control: AbstractControl): ValidationErrors | null => {
    if (_control.root.get('name')?.value == '5BldgWise' || _control.root.get('name')?.value == '5BldgWise(qtyareaengg)') {
      if (!_control.root.get('bldgCode')?.value.length) {
        _control.root.get('bldgCode')?.setErrors({ "bldgReq": true, "errMsg": "Building code cannot be left blank" })
      }
      else {
        _control.root.get('bldgCode')?.value.length > 5 && _control.root.get('bldgCode')?.setErrors({ "maxBldgCode": true, "errMsg": "Select Only 5 Building" })
      }
    }
    return null
  };
}