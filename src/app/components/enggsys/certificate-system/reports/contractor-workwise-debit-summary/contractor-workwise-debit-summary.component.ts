import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { buttonsList } from 'src/app/shared/interface/common';

@Component({
  selector: 'app-contractor-workwise-debit-summary',
  templateUrl: './contractor-workwise-debit-summary.component.html',
  styleUrls: ['./contractor-workwise-debit-summary.component.css'],
})
export class ContractorWorkwiseDebitSummaryComponent implements OnInit {
  loaderToggle: boolean = false;
  config = {
    isLoading: false,
  };

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'print',
    'reset',
    'exit',
  ]);

  qf!: FormGroup;
  formName!: string;
  bldgSQ = `(bmap_closedate >= to_date('${moment().format(
    'DD.MM.yyyy'
  )}','dd.mm.yyyy') or bmap_closedate is null)`;
  conttorSQ = `par_partytype = 'E'`;

  constructor(
    private fb: FormBuilder,
    public _service: ServiceService,
    public commonReport: CommonReportsService,
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.qf = this.fb.group(
      {
        coy: [''],
        bldgCode: [''],
        workCode: [''],
        partyCode: [''],
      },
      {
        validators: filterAtLeastOne(),
      }
    );
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = val.formName;
      },
    });
  }

  buttonAction(event: string) {
    if (event === 'print') {
      this.getReport(true);
    } else if (event === 'exit') {
      this.router.navigateByUrl('/dashboard');
    } else if (event === 'reset') {
      this.qf.reset();
    }
  }

  getReport(print: Boolean) {
    if (this.qf.valid) {
      this.loaderToggle = true;
      let payload: any = {
        name: 'Engg_ContractorWorkwiseDebitSummary.rpt',
        isPrint: false,
        seqId: 1,
        chkdt: "'Y'",
        reportParameters: {
          formname: this.formName,
          StrPrmBldgCodes:
            this.qf.get('bldgCode')?.value.length &&
            this.qf.get('bldgCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('bldgCode')?.value.join(`','`)}'`
              : `'ALL'`,
          StrPrmPartyCodes:
            this.qf.get('partyCode')?.value.length &&
            this.qf.get('partyCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('partyCode')?.value.join(`','`)}'`
              : `'ALL'`,
          StrPrmWorkCodes:
            this.qf.get('workCode')?.value.length &&
            this.qf.get('workCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('workCode')?.value.join(`','`)}'`
              : `'ALL'`,
        },
      };

      console.log(payload, 'payload');
      this.commonReport
        .getParameterizedReport(payload)
        .pipe(
          take(1),
          finalize(() => {
            this.loaderToggle = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            if (res) {
              let filename = this.commonReport.getReportName();
              this._service.exportReport(print, res, 'PDF', filename);
            }
          },
          error: (error) => {
            this.config.isLoading = false;
          },
        });
      // this.config.isLoading = false;
    } else {
      this.qf.markAllAsTouched();
    }
  }
}

export function filterAtLeastOne(): ValidatorFn {
  return (g: AbstractControl): ValidationErrors | null => {
    let bc = g.get('bldgCode')?.value;
    let pc = g.get('partyCode')?.value;
    let wc = g.get('workCode')?.value;

    return !bc.length && !wc?.length && !pc?.length
      ? { atLeastOneFilter: true }
      : null;
  };
}
