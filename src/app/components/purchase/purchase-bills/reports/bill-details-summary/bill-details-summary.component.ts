import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';

import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import * as commonConstant from '../../../../../../constants/commonconstant';

@Component({
  selector: 'app-bill-details-summary',
  templateUrl: './bill-details-summary.component.html',
  styleUrls: ['./bill-details-summary.component.css'],
})
export class BillDetailsSummaryComponent implements OnInit {
  suppQuery = `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '${commonConstant.coyCloseDate}')`;
  queryForm: FormGroup = new FormGroup({
    coy: new FormControl<string[]>(['ALL']),
    bldgCode: new FormControl<string[]>([]),
    partyCode: new FormControl<string[]>(['ALL']),
    matGroup: new FormControl<string[]>(['ALL']),
    name: new FormControl<string>('Coy', Validators.required),
    report: new FormControl<string>('Detail', Validators.required),
    transportBillType: new FormControl<string | null>(''),
    Remark: new FormControl<string | null>(''),
    exportType: new FormControl('PDF'),
    range: new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    }),
    entry: new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    }),
  });

  loaderToggle: boolean = false;
  formName!: string;

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    public _service: ServiceService
  ) {}

  ngOnInit(): void {
    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
  }

  getReport(print: Boolean) {
    console.log('queryForm', this.queryForm);

    if (this.queryForm.valid) {
      if (
        this._service.printExcelChk(
          print,
          this.queryForm.get('exportType')?.value
        )
      ) {
        let from = this.queryForm.get('range')?.value.start;
        let to = this.queryForm.get('range')?.value.end;
        let entryfrom = this.queryForm.get('entry')?.value.start;
        let entryto = this.queryForm.get('entry')?.value.end;

        // get conditionId as per billdate & entrydate
        let conditionId =
          from && to && entryfrom && entryto //if all dates id 1
            ? 1
            : entryfrom && entryto //if entry date id 4
            ? 4
            : from && to //if bill date id 3
            ? 3
            : 2; //if no dates id 2

        // manipulate report name as required in payload but not for last 3 report
        let name = this.queryForm.get('name')?.value;

        // get h2, it is displayed in pdf header to be sent in the payload
        let h2 = '';
        let report =
          this.queryForm.get('report')?.value == 'Detail'
            ? 'Detail'
            : 'Summary';
        h2 =
          name == 'Coy'
            ? `'Bills ${report} - Company wise'`
            : name == 'Supplier'
            ? `'Bills ${report} - Supplier wise'`
            : name == 'Material'
            ? `'Bills ${report} - Material wise'`
            : name == 'MatSupplier'
            ? `'Bills ${report} - Material / Supplier wise'`
            : name == 'Bldg'
            ? `'Bills ${report} - Building wise'`
            : name == 'Pb_BldgMatWise'
            ? `'Bills ${report} - Building / Material wise'`
            : name == 'BldgMatSupp'
            ? `'Bills ${report} - Building / Material /Supplier wise'`
            : name == 'SpecialMatBillSumm'
            ? `'Bills Summary - Specific Material'`
            : `'Bill Detail and Summary Reports'`;

        // ...continue manipulate report name
        let rptConStr = this.queryForm.get('report')?.value;
        if ((name == 'Supplier' || name == 'Material') && report == 'Detail') {
          rptConStr = 'Details';
        }

        //billdetsumm_mod.rpt  &&
        let matDetailName = '';
        if (name == 'MatSupplier' && rptConStr == 'Detail') {
          matDetailName = 'billdetsumm_mod.rpt';
        } else {
          name =
            name == 'SpecialMatBillSumm' ||
            name == 'Pb_BldgMatWise' ||
            name == 'BldgMatSupp'
              ? `${name}.rpt`
              : `${name}${rptConStr}.rpt`;
        }

        /* get transportBillType, due to 1 odd radio btn 'Specific Material-wise',
      below condition checked on the basis of name also */
        let transportBillType = this.queryForm.get('transportBillType')?.value;
        transportBillType =
          name != 'SpecialMatBillSumm.rpt' && transportBillType == 'exclude'
            ? `and  pblh_billtype <> 'T'`
            : name !== 'SpecialMatBillSumm.rpt' && transportBillType == 'only'
            ? `and  pblh_billtype = 'T'`
            : name == 'SpecialMatBillSumm.rpt' && transportBillType == 'exclude'
            ? `and  pj_billtype <> 'T'`
            : name == 'SpecialMatBillSumm.rpt' && transportBillType == 'only'
            ? `and  pj_billtype = 'T'`
            : '';

        let payload: any = {
          name:
            name == 'MatSupplier' && rptConStr == 'Detail'
              ? matDetailName
              : name,
          seqId: 1,
          conditionId: conditionId,
          exportType: this.queryForm.get('exportType')?.value,
          reportParameters: {
            coy:
              this.queryForm.get('coy')?.value &&
              this.queryForm.get('coy')?.value[0] != 'ALL'
                ? `'${this.queryForm.get('coy')?.value.join(`','`)}'`
                : `'ALL'`,
            bldgCode:
              this.queryForm.get('bldgCode')?.value &&
              this.queryForm.get('bldgCode')?.value[0] != 'ALL'
                ? `'${this.queryForm.get('bldgCode')?.value.join(`','`)}'`
                : `'ALL'`,
            matGroup:
              this.queryForm.get('matGroup')?.value &&
              this.queryForm.get('matGroup')?.value[0] != 'ALL'
                ? `'${this.queryForm.get('matGroup')?.value.join(`','`)}'`
                : `'ALL'`,
            partyCode:
              this.queryForm.get('partyCode')?.value &&
              this.queryForm.get('partyCode')?.value[0] != 'ALL'
                ? `'${this.queryForm.get('partyCode')?.value.join(`','`)}'`
                : `'ALL'`,
            closeDate: '01/01/2050',
            h2:
              this.queryForm.get('name')?.value == 'MatSupplier' &&
              rptConStr == 'Detail'
                ? ''
                : h2,
            transportBillType: transportBillType,
            formname:
              this.queryForm.get('name')?.value == 'MatSupplier' &&
              rptConStr == 'Detail'
                ? ''
                : this.formName,
            Remark: `'${this.queryForm.get('Remark')?.value}'`,
          },
          isPrint: false,
        };

        if (from && to) {
          payload.reportParameters.billFromDate = `'${moment(from).format(
            'DD/MM/YYYY'
          )}'`;
          payload.reportParameters.billToDate = `'${moment(to).format(
            'DD/MM/YYYY'
          )}'`;
        }

        if (entryfrom && entryto) {
          payload.reportParameters.entryFromDate = `'${moment(entryfrom).format(
            'DD/MM/YYYY'
          )}'`;
          payload.reportParameters.entryToDate = `'${moment(entryto).format(
            'DD/MM/YYYY'
          )}'`;
        }

        console.log('payload', payload);
        // return;

        this.loaderToggle = true;
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
                this._service.exportReport(
                  print,
                  res,
                  this.queryForm.get('exportType')?.value,
                  filename
                );
              }
            },
          });
      }
    } else {
      this.toastr.showError('Please fill the form properly');
      this.queryForm.markAllAsTouched();
    }
  }

  
  resetForm(){
    this.queryForm.reset({
      name: 'Coy',
      coy:['ALL'],
      partyCode:['ALL'],
      matGroup: ['ALL'],
      exportType: 'PDF',
      report: 'Detail',
      bldgCode: [],
      transportBillType: '',
      Remark: ''
    })
    setTimeout(function() {
      document.getElementById("supplier123")?.focus();
   }, 100);
  }
}
