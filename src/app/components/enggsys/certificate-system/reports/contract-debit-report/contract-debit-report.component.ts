import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { buttonsList } from 'src/app/shared/interface/common';

@Component({
  selector: 'app-contract-debit-report',
  templateUrl: './contract-debit-report.component.html',
  styleUrls: ['./contract-debit-report.component.css'],
})
export class ContractDebitReportComponent implements OnInit {
  conditionId = 1;
  regionCode: any;
  multiCoy: boolean = true;
  isDisabledState: boolean = false;
  qf!: FormGroup;
  bldgQuery = ``;
  // qf: FormGroup = new FormGroup({
  //   bldgCode: new FormControl<string[]>([]),
  //   recId: new FormControl<string[]>([]),
  //   workCode: new FormControl<string[]>([]),
  //   authNo: new FormControl<string[]>([]),
  //   matGroup: new FormControl<string[]>([]),
  //   reportType: new FormControl<string | null>('Detail', Validators.required),
  //   reportName: new FormControl<string | null>(
  //     'ContractDebit',
  //     Validators.required
  //   ),
  //   asOnDate: new FormControl<Date | null>({ value: null, disabled: false }),
  //   ccdRange: new FormGroup(
  //     {
  //       start: new FormControl<Date | null>({ value: null, disabled: false }),
  //       end: new FormControl<Date | null>({ value: null, disabled: false }),
  //     },
  //     Validators.required
  //   ),
  //   exportType: new FormControl('PDF'),
  // });
  loaderToggle: boolean = false;
  config = {
    isLoading: false,
  };

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'print',
    'reset',
    'exit',
  ]);

  // qf!: FormGroup;
  formName!: string;
  bldgSQ = `(bmap_closedate >= to_date('${moment().format(
    'DD.MM.yyyy'
  )}','dd.mm.yyyy') or bmap_closedate is null)`;

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
        bldgCode: [''],
        recId: [''],
        workCode: [''],
        authNo: [''],
        matGroup: [''],
        reportType: [''],
        reportName: [''],
        asOnDate: [moment()],
        range: this.fb.group({
          fromDate: [null],
          toDate: [null]
        }),
      }
      //   {
      //     validators: filterAtLeastOne(),
      //   }
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

  disableField() {
    if (this.qf.get('reportName')?.value == 'AuthorisationDebit') {
      this.qf.get('authNo')?.enable(),
        this.qf.get('recId')?.disable(),
        this.qf.get('workCode')?.disable(),
        this.qf.get('matGroup')?.enable();
    } else {
      this.qf.get('authNo')?.disable(),
        this.qf.get('recId')?.enable(),
        this.qf.get('workCode')?.enable(),
        this.qf.get('matGroup')?.disable();
    }
  }

  disableOption() {
    if (this.qf.get('reportType')?.value == 'Detail') {
      this.isDisabledState = false;
    } else {
      this.isDisabledState = true;
    }
  }

  getReport(print: Boolean) {
    if (this.qf.valid) {
      let fromDt = this.qf.get('range.fromDate')?.value;
      let toDt = this.qf.get('range.toDate')?.value;
      let enteredOn = this.qf.get('asOnDate')?.value;
      this.loaderToggle = true;
      let payload: any = {
        isPrint: false,
        seqId: 1,
        reportParameters: {
          formname: this.formName,
          StrPrmBldgCode:
            this.qf.get('bldgCode')?.value.length &&
            this.qf.get('bldgCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('bldgCode')?.value.join(`','`)}'`
              : `'ALL'`,
          StrPrmWorkCode:
            this.qf.get('workCode')?.value.length &&
            this.qf.get('workCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('workCode')?.value.join(`','`)}'`
              : `'ALL'`,
          StrPrmContract:
            this.qf.get('recId')?.value.length &&
            this.qf.get('recId')?.value[0] != 'ALL'
              ? `'${this.qf.get('recId')?.value.join(`','`)}'`
              : `'ALL'`,
        },
      };
      if (!fromDt && !toDt) {
        fromDt = new Date('01/01/1956');
        toDt = new Date('01/01/1956');
      } else {
        payload.reportParameters.HEADERTEXT1 =
          'From ' +
          moment(fromDt).format('DD-MMM-YYYY') +
          ' to ' +
          moment(toDt).format('DD-MMM-YYYY');
      }
      if (!enteredOn) {
        enteredOn = new Date();
      } else {
        payload.reportParameters.HEADERTEXT1 =
          'Entered On ' + moment(enteredOn).format('DD-MMM-YYYY');
      }
      payload.reportParameters.DatPrmFromDate =
        moment(fromDt).format('DD-MMM-YYYY');
      payload.reportParameters.DatPrmUptoDate =
        moment(toDt).format('DD-MMM-YYYY');
      payload.reportParameters.DatPrmEnteredOn =
        moment(enteredOn).format('DD-MMM-YYYY');

      switch (this.qf.get('reportName')?.value) {
        case 'ContractDebit': {
          this.initialiseReportName(
            payload,
            'Engg_ContractDebit_Java.rpt',
            'Engg_ContractDebitSummary.rpt'
          );
          // switch (this.qf.get('reportType')?.value) {
          //   case 'Detail': {
          //     payload.name = 'Engg_ContractDebit.rpt';
          //     break;
          //   }
          //   case 'Summary': {
          //     payload.name = 'Engg_ContractDebitSummary.rpt';
          //     break;
          //   }
          // }
          break;
        }
        case 'AuthorisationDebit': {
          payload.name = 'Engg_ContractorWorkwiseDebitSummary.rpt';
          break;
        }
        case 'ContraContractDebit': {
          this.initialiseReportName(
            payload,
            'Engg_ContraContractDetails.rpt',
            'Engg_ContraContractSummary.rpt'
          );
          break;
          // switch (this.qf.get('reportType')?.value) {
          //   case 'Detail': {
          //     payload.name = 'Engg_ContraContractDetails.rpt';
          //     break;
          //   }
          //   case 'Summary': {
          //     payload.name = 'Engg_ContraContractSummary.rpt';
          //     break;
          //   }
          // }
        }
      }
      // if (this.qf.get('reportName')?.value == 'AuthorisationDebit') {
      //   payload.name = 'Engg_ContractorWorkwiseDebitSummary.rpt';
      // }

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

  initialiseReportName(
    payload: any,
    detailRptName: string,
    summaryRptName: string
  ) {
    switch (this.qf.get('reportType')?.value) {
      case 'Detail': {
        payload.name = detailRptName;
        break;
      }
      case 'Summary': {
        payload.name = summaryRptName;
        break;
      }
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
