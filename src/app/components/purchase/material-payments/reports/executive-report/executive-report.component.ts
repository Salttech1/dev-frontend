import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { finalize, switchMap, take } from 'rxjs';
import { PurchService } from 'src/app/services/purch/purch.service';
import { CommonReportsService } from 'src/app/services/reports.service';

import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';

@Component({
  selector: 'app-executive-report',
  templateUrl: './executive-report.component.html',
  styleUrls: ['./executive-report.component.css']
})
export class ExecutiveReportComponent implements OnInit {
  queryForm: FormGroup = new FormGroup({
    partyCode: new FormControl<string[]>(['ALL']),
    coyCode: new FormControl<string[]>([], Validators.required),
    bldgCode: new FormControl<string[]>(['ALL']),
    matGroup: new FormControl<string[]>(['ALL']),
    name: new FormControl<string>('CoyWise', Validators.required),
    report: new FormControl<string>('Detail', Validators.required),
    Remarks: new FormControl<string | null>(''),
    range: new FormGroup({
      suppBillFromDate: new FormControl<Date | null>(null),
      suppBillToDate: new FormControl<Date | null>(null),
    }),
  });

  loaderToggle: boolean = false;
  formName!: string;

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    private _purch: PurchService,
    private _service: ServiceService
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
  }

}
