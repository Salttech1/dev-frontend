import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { finalize, switchMap, take } from 'rxjs';
import { PurchService } from 'src/app/services/purch/purch.service';
import { CommonReportsService } from 'src/app/services/reports.service';

import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import * as commonConstant from '../../../../../../constants/commonconstant';

@Component({
  selector: 'app-outstanding-advance-and-retention-report',
  templateUrl: './outstanding-advance-and-retention-report.component.html',
  styleUrls: ['./outstanding-advance-and-retention-report.component.css']
})
export class OutstandingAdvanceAndRetentionReportComponent implements OnInit {
  party_condition = `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '${commonConstant.coyCloseDate}')`
  regionCode: any
  queryForm: FormGroup = new FormGroup({
    partyCode: new FormControl<string[]>([]),
    coyCode: new FormControl<string[]>([]),
    bldgCode: new FormControl<string[]>([]),
    matGroup: new FormControl<string[]>([]),
    name: new FormControl<string>('advancedOut', Validators.required),
    bldgExcl: new FormControl<string[]>([]),
    bldgReg: new FormControl<string | null>(null),
    exportType: new FormControl('PDF')
  }, {
    validators: filterAtLeastOne()
  });

  loaderToggle: boolean = false;
  formName!: string;
  selectedPeople: any
  excluBldgList: any = []
  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    private _purch: PurchService,
    public _service: ServiceService,
    private dynapop: DynapopService,

  ) { }

  ngOnInit(): void {
    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
    this.queryForm.get('bldgReg')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          this.regionCode = res[0][0];
        }
      },
    })
    this.fetchExclBldg()
    this.fetchDynapopExclBldg()
  }

  fetchExclBldg() {
    this._purch.fetchExcludBldg().subscribe({
      next: (res: any) => {
        this.queryForm.get('bldgExcl')?.patchValue(res.data.split(','))
      }
    })
  }

  fetchDynapopExclBldg() {
    this.dynapop.getDynaPopListObj('BUILDINGS', ``).subscribe({
      next: (res: any) => {
        console.log(res.data.dataSet);
        this.excluBldgList = res.data.dataSet
      }
    })
  }

  getReport(print: Boolean) {
    if (this.queryForm.valid) {
      if (this._service.printExcelChk(print, this.queryForm.get('exportType')?.value)) {
        this.loaderToggle = true
        let payLoad: Object = {
          exportType: this.queryForm.get('exportType')?.value,
          bldgCode: this.queryForm.get('bldgCode')?.value.length
            ? this.queryForm.get('bldgCode')?.value
            : ['ALL'],
          coy: this.queryForm.get('coyCode')?.value.length &&
            this.queryForm.get('coyCode')?.value[0] != 'ALL'
            ? this.queryForm.get('coyCode')?.value
            : ['ALL'],
          exclude: this.queryForm.get('bldgExcl')?.value.length &&
            this.queryForm.get('bldgExcl')?.value[0] != 'ALL'
            ? this.queryForm.get('bldgExcl')?.value
            : ['ALL'],
          formname: this.formName,
          matCode: this.queryForm.get('matGroup')?.value.length &&
            this.queryForm.get('matGroup')?.value[0] != 'ALL'
            ? this.queryForm.get('matGroup')?.value
            : ['ALL'],
          partyCode: this.queryForm.get('partyCode')?.value.length &&
            this.queryForm.get('partyCode')?.value[0] != 'ALL'
            ? this.queryForm.get('partyCode')?.value
            : ['ALL'],
          radioButton: this.queryForm.get('name')?.value == 'retentionOut' ? true : false,
          region: this.queryForm.get('bldgReg')?.value
            ? [`${this.regionCode?.trim()}`]
            : ['ALL'],
        }
        console.log(payLoad, "payLoad");
        this._purch
          .outstandingAdvRetReport(payLoad)
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
      this.queryForm.markAllAsTouched();
      this.toastr.showError('Please fill the form properly');
    }
  }

  resetForm(){
    this.queryForm.reset({
    name:'advancedOut',
     exportType: 'PDF',
    })
    setTimeout(function() {
      document.getElementById("building123")?.focus();
   }, 100);
   this.fetchExclBldg();
  }
}

export function filterAtLeastOne(): ValidatorFn {
  return (g: AbstractControl): ValidationErrors | null => {
    return (!g.get('bldgCode')?.value?.length && !g.get('matGroup')?.value?.length && !g.get('partyCode')?.value?.length && !g.get('coyCode')?.value?.length && !g.get('bldgExcl')?.value?.length) ? { atLeastOneFilter: true } : null
  };
}
