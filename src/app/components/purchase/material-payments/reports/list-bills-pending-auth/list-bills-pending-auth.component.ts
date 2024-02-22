import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';

import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';

@Component({
  selector: 'app-list-bills-pending-auth',
  templateUrl: './list-bills-pending-auth.component.html',
  styleUrls: ['./list-bills-pending-auth.component.css'],
})
export class ListBillsPendingAuthComponent implements OnInit {
  queryForm: FormGroup = new FormGroup({
    region: new FormControl<string[]>([],Validators.required),
    range: new FormGroup(
      {
        start: new FormControl<Date | null>(null, Validators.required),
        end: new FormControl<Date | null>(null, Validators.required),
      },
      Validators.required
    ),
    exportType: new FormControl('PDF')
  });

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
  }

  getReport(print: boolean) {
    console.log('queryForm', this.queryForm);
    let rg = this.queryForm.get('region')?.value;
    console.log(rg instanceof Object && rg.length && rg?.[0]?.[0], "rg");

    if (this.queryForm.valid) {
      if (this._service.printExcelChk(print, this.queryForm.get('exportType')?.value)) {
        let payload: Object = {
          name: 'BillsPendingAuth.rpt',
          isPrint: false,
          seqId: 1,
          exportType: this.queryForm.get('exportType')?.value,
          reportParameters: {
            fromDate: `'${moment(this.queryForm.get('range')?.value.start).format(
              'DD/MM/yyyy'
            )}'`,
            toDate: `'${moment(this.queryForm.get('range')?.value.end).format(
              'DD/MM/yyyy'
            )}'`,
            chkDate: "'Y'",
            formname: this.formName,
            region: rg instanceof Object && rg.length && rg?.[0]?.[0] ? rg?.[0]?.[0] : '',
          },
        };

        console.log('payload', payload);
        this.loaderToggle = true;
        this._commonReport
          .getTtxParameterizedReport(payload)
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
    } else {
      console.log('form', this.queryForm);

      this.toastr.showError('Please fill the form properly');
      this.queryForm.markAllAsTouched();
    }

  }

  resetForm(){
    this.queryForm.reset({
      exportType: 'PDF'
    })
  }

}
