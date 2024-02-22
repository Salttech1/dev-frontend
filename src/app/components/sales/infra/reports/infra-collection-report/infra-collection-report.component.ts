import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import * as moment from 'moment';
import { finalize, switchMap, take } from 'rxjs';
import { SalesService } from 'src/app/services/sales/sales.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { Router } from '@angular/router';
import { DynapopService } from 'src/app/services/dynapop.service';
import * as commonConstant from '../../../../../../constants/commonconstant';

@Component({
  selector: 'app-infra-collection-report',
  templateUrl: './infra-collection-report.component.html',
  styleUrls: ['./infra-collection-report.component.css'],
})
export class InfraCollectionReportComponent implements OnInit {
  queryForm: FormGroup = new FormGroup(
    {
      exportType: new FormControl('PDF'),
      name: new FormControl<string>(
        'RptInfraCollectionReport.rpt',
        Validators.required
      ),
      bldgCode: new FormControl<string[]>([]),
      range: new FormGroup({
        FromDate: new FormControl<Date | null>(null),
        ToDate: new FormControl<Date | null>(null),
      }),
    },
    { validators: all() }
  );

  loaderToggle: boolean = false;
  formName!: string;
  url!: string;
  chargeCode!: string;

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    private _sales: SalesService,
    public _service: ServiceService,
    private router: Router,
    private _dynapop: DynapopService
  ) {}

  ngOnInit(): void {
    this.url =
      this.router.url.split('/')[this.router.url.split('/').length - 1];
    console.log('URL I', this.url);
    //     setTimeout(() => {
    //       this.url == 'auxidefaultersreport' ? this.queryForm.patchValue({chargeCode: 'AUXI'}) : this.queryForm.patchValue({chargeCode: 'INAP'})
    // }, 10);
    //this.url == 'auxidefaultersreport' ? this.queryForm.patchValue({chargeCode: 'AUXI'}) : this.queryForm.patchValue({chargeCode: 'INAP'})
    this.url == 'infracollectionreport'
      ? (this.chargeCode = 'INAP')
      : (this.chargeCode = 'AUXI');

    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = val.formName;
      },
    });
  }

  getReport(print: Boolean) {
    let from = this.queryForm.get('range')?.value.FromDate;
    let to = this.queryForm.get('range')?.value.ToDate;
    if (this.queryForm.valid) {
      if (
        this._service.printExcelChk(
          print,
          this.queryForm.get('exportType')?.value
        )
      ) {
        let payload: any = {
          name: this.queryForm.get('name')?.value,
          exportType: this.queryForm.get('exportType')?.value,
          isPrint: false,
          seqId: 1,
          reportParameters: {
            bldgCode: this.queryForm.get('bldgCode')?.value.length &&
              this.queryForm.get('bldgCode')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('bldgCode')?.value.join(`','`)}'`
              : `'ALL'`,

            // bldgCode: this.queryForm.get('bldgCode')?.value.length
            //   ? this.queryForm.get('bldgCode')?.value
            //   : ['ALL'],
            formname: "'" + this.formName + "'",
          },
        };

        if (from && to) {
          payload.reportParameters.FromDate = `${moment(from).format(
            'DD/MM/YYYY'
          )}`;
          payload.reportParameters.ToDate = `${moment(to).format(
            'DD/MM/YYYY'
          )}`;
        }

        if (
          this.queryForm.get('name')?.value == 'RptInfraCollectionReport.rpt'
        ) {
          payload.reportParameters['HeaderText1'] = "'D'";
          payload.reportParameters[
            'HeaderText2'
          ] = `'Infra Collection  Detail Report '`;
        }
        if (
          this.queryForm.get('name')?.value ==
          'RptInfraCollectionSummReport.rpt'
        ) {
          payload.reportParameters['HeaderText1'] = `'S'`;
          payload.reportParameters[
            'HeaderText2'
          ] = `' Infra Collection Summary Report'`;
        }
        if (
          this.queryForm.get('name')?.value ==
          'RptInfraCollectionCommReport.rpt'
        ) {
          payload.reportParameters['HeaderText1'] = `'C'`;
          payload.reportParameters[
            'HeaderText2'
          ] = `'Infra Collection Composite summary Report'`;
        }

        // payload.reportParameters['HeaderText3'] = `From ${moment(from).format(
        //   'DD/MM/YYYY'
        // )}'` + ` To ` + `'${moment(to).format(
        //   'DD/MM/YYYY'
        // )}'`;

        payload.reportParameters['HeaderText3'] = `'From ${moment(from).format(
          'DD/MM/YYYY'
        )} To ${moment(to).format('DD/MM/YYYY')}'`;

        console.log('PAYLOAD', payload);

        this.loaderToggle = true;
        this._commonReport
          .getParameterizedReportWithMultipleConditionAndParameter(payload)
          .pipe(
            take(1),
            // switchMap((res: any) => {
            // if (from && to) {
            //   payload.FromDate = moment(from).format('DD/MM/YYYY');
            //   payload.ToDate = moment(to).format('DD/MM/YYYY');
            // }

            // if (this.queryForm.get('showsplfields')?.value == 'Y') {
            //   payload.reportParameters['HeaderText2'] =
            //     "'" + this.queryForm.get('showsplfields')?.value + "'";
            // } else {
            //   payload.reportParameters['HeaderText2'] = "'" + '' + "'";
            // }

            // if (this.chargeCode == 'INAP') {
            //   payload.reportParameters['HeaderText3'] =
            //     "'" + ' Defaulters List (Infra)' + "'";
            // } else {
            //   payload.reportParameters['HeaderText3'] =
            //     "'" + ' Defaulters List (Auxiliary)' + "'";
            // }

            // }
            // ),

            finalize(() => (this.loaderToggle = false))
          )
          .subscribe({
            next: (res: any) => {
              this.commonPdfReport(print, res);
            },
          });
      }
    } else {
      this.toastr.showError('Please fill the form properly');
      this.queryForm.markAllAsTouched();
    }
  }

  commonPdfReport(print: Boolean, res: any) {
    let filename = this._commonReport.getReportName();
    this._service.exportReport(
      print,
      res,
      this.queryForm.get('exportType')?.value,
      filename
    );
  }

  resetForm() {
    this.queryForm.reset({
      exportType: 'PDF',
      name: 'RptInfraCollectionReport.rpt',
      bldgCode: [],
    });
    this.url =
      this.router.url.split('/')[this.router.url.split('/').length - 1];
    //    this.url == 'auxidefaultersreport' ? this.queryForm.patchValue({chargeCode: 'AUXI'}) : this.queryForm.patchValue({chargeCode: 'INAP'})
    this.url == 'infracollectionreport'
      ? (this.chargeCode = 'INAP')
      : (this.chargeCode = 'AUXI');
    setTimeout(function () {
      document.getElementById('party123')?.focus();
    }, 100);
  }
}

export function all() {
  return (g: AbstractControl) => {
    return g.get('bldgCode')?.value.length ? null : { atLeastOneFilter: true };
  };
}
