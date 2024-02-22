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
import { DynapopService } from 'src/app/services/dynapop.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';

export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-user-wise-bills',
  templateUrl: './user-wise-bills.component.html',
  styleUrls: ['./user-wise-bills.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class UserWiseBillsComponent implements OnInit {
  queryForm: FormGroup = new FormGroup({
    userName: new FormControl<string | null>(''),
    exportType:new FormControl('PDF'),
    range: new FormGroup(
      {
        start: new FormControl<Date | null>(null, Validators.required),
        end: new FormControl<Date | null>(null, Validators.required),
      },
      Validators.required
    ),
  });

  users: any;
  usersColumns: any;
  formName: String = '';
  loaderToggle: boolean = false;

  constructor(
    private dynapop: DynapopService,
    private toastr: ToasterapiService,
    private commonReportService: CommonReportsService,
    public _service: ServiceService
  ) {}

  ngOnInit(): void {
    this.getItemList();

    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
  }

  getItemList() {
    this.dynapop.getDynaPopListObj('USERS', '').subscribe((res: any) => {
      this.users = res.data;
      this.usersColumns = [
        res?.data?.colhead1,
        res?.data?.colhead2,
        res?.data?.colhead3,
        res?.data?.colhead4,
        res?.data?.colhead5,
      ];
    });
  }

  getSelectedItem(e: any[]) {
    if (e?.length) {
      this.queryForm.patchValue({
        userName: e[0],
      });
    }
  }

  getReport(print: Boolean) {
    if (this.queryForm.valid) {
      if (this._service.printExcelChk(print,  this.queryForm.get('exportType')?.value)) {
      let payload: any = {
        name: 'NoBillsDBAuth.rpt',
        isPrint: false,
         exportType: this.queryForm.get('exportType')?.value,
        seqId: this.queryForm.get('userName')?.value ? 2 : 1,
        reportParameters: {
          fromDate: `'${moment(this.queryForm.get('range')?.value.start).format(
            'DD/MM/yyyy'
          )}'`,
          toDate: `'${moment(this.queryForm.get('range')?.value.end).format(
            'DD/MM/yyyy'
          )}'`,
          formname: this.formName,
         
        },
      };

      if (this.queryForm.get('userName')?.value) {
        payload.reportParameters['userName'] =
          this.queryForm.get('userName')?.value;
      }

      console.log('pa', payload);
      this.loaderToggle = true;
      this.commonReportService
        .getTtxParameterizedReport(payload)
        .pipe(
          take(1),
          finalize(() => (this.loaderToggle = false))
        )
        .subscribe({
          next: (res: any) => {
            if (res) {
            let filename = this.commonReportService.getReportName();
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
}
}
