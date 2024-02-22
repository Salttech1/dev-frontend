import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';

import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';

@Component({
  selector: 'app-bills-debit-notes-edit',
  templateUrl: './bills-debit-notes-edit.component.html',
  styleUrls: ['./bills-debit-notes-edit.component.css'],
})
export class BillsDebitNotesEditComponent implements OnInit {
  queryForm: FormGroup = new FormGroup({
    exportType:new FormControl('PDF'),
    userName: new FormControl<string[]>([]),
    name: new FormControl<string>('BillsList.rpt', Validators.required),
    range: new FormGroup(
      {
        start: new FormControl<Date | null>(null, Validators.required),
        end: new FormControl<Date | null>(null, Validators.required),
      },
      Validators.required
    ),
  });

  loaderToggle: boolean = false;
  formName!: string;

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    public _service: ServiceService
  ) {}

  ngOnInit(): void {
    // get formname from pagedata Observable to send later in payload
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
  }

  getReport(print: Boolean) {
    if (this.queryForm.valid) {
      if (this._service.printExcelChk(print,  this.queryForm.get('exportType')?.value)) {
      let payload: Object = {
        name: this.queryForm.get('name')?.value,
        isPrint: false,
        seqId: 1,
        exportType: this.queryForm.get('exportType')?.value,
        conditionId: this.queryForm.get('userName')?.value.length ? 1 : 2,
        reportParameters: {
          fromDate: `'${moment(this.queryForm.get('range')?.value.start).format(
            'DD/MM/yyyy'
          )}'`,
          toDate: `'${moment(this.queryForm.get('range')?.value.end).format(
            'DD/MM/yyyy'
          )}'`,
          closeDate: '01/01/2050',
          formname: this.formName,
          userName: this.queryForm.get('userName')?.value.length
            ? this.queryForm.get('userName')?.value[0][0]
            : '',
           
        },
      };

      console.log('payload', payload);

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
              this._service.exportReport(print, res, this.queryForm.get('exportType')?.value, filename)
            }
          },
        });
    }} else {
      console.log('form', this.queryForm);

      this.toastr.showError('Please fill the form properly');
      this.queryForm.markAllAsTouched();
    }
  }

  resetForm(){
    this.queryForm.reset({
      name: 'BillsList.rpt',
      exportType: 'PDF',
      report: 'Detail'
    })
  }
}
