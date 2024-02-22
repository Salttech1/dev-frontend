import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { DataEntryService } from 'src/app/services/purch/data-entry.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';

@Component({
  selector: 'app-material-payment-status',
  templateUrl: './material-payment-status.component.html',
  styleUrls: ['./material-payment-status.component.css'],
})
export class MaterialPaymentStatusComponent implements OnInit {
  party_condition = " par_partytype='S' and par_closedate='01-JAN-2050' ";
  blgCode: any;
  materialCode: any;
  suppCode: any;
  authFromDate: any;
  authCodes: any;
  authType: any;
  authToDate: any;
  isDataRecieved: any;
  materialStatusEnquiryData: any[] = [];
  initialFormValue: any;
  materialStatusForm: FormGroup = new FormGroup(
    {
      exportType: new FormControl('PDF'),
      multiSelect: new FormControl<boolean>(false),
      buildingCode: new FormControl<string[] | string>([]),
      materialCode: new FormControl<string[] | string>([]),
      suppCode: new FormControl<string[] | string>([]),
      authNos: new FormControl<string[] | string>([]),
      authType: new FormControl<string[] | string>([]),
      range: new FormGroup(
        {
          authFrom: new FormControl<Date | null>(null),
          authTo: new FormControl<Date | null>(null),
        },
        Validators.required
      ),
    },
    {
      validators: filterAtLeastOne(),
    }
  );

  loaderToggle: boolean = false;
  formName!: string;
  dtOptions: any;
  exportType: any = 'PDF';
  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    public _service: ServiceService,
    private dataEntryService: DataEntryService
  ) {}

  ngOnInit(): void {
    setTimeout(function () {
      document.getElementById('bldgCode123')?.focus();
    }, 100);
    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
    this.dtOptions = {
      pageLength: 10,
      processing: false,
      lengthChange: false,
      deferRender: false,
      bPaginate: true,
      bInfo: false,
      columnDefs: [
        {
          targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          orderable: false,
        },
      ],
    };
    this.resetValues();
  }

  resetValues() {
    let multiSelect = this.materialStatusForm.get('multiSelect');
    multiSelect?.valueChanges.subscribe((val: any) => {
      this.materialStatusForm.get('buildingCode')?.setValue(null);
      this.materialStatusForm.get('materialCode')?.setValue(null);
      this.materialStatusForm.get('suppCode')?.setValue(null);
      this.materialStatusForm.get('authNos')?.setValue(null);
      this.materialStatusForm.get('authType')?.setValue(null);
      this.materialStatusForm.get('range.authFrom')?.setValue(null);
      this.materialStatusForm.get('range.authTo')?.setValue(null);
      setTimeout(function () {
        document.getElementById('bldgCode123')?.focus();
      }, 100);
    });
  }

  tblSearch(inputid: string, tblName: string) {
    $(`#${inputid}`).on('keyup', (event: any) => {
      $(`#${tblName}`).DataTable().search(event?.target.value).draw();
    });
  }

  setRequestParamValues() {
    this.blgCode =
      this.materialStatusForm.get('buildingCode')?.value.length &&
      this.materialStatusForm.get('buildingCode')?.value[0] != 'ALL'
        ? this.materialStatusForm.get('multiSelect')?.value
          ? `'${this.materialStatusForm
              .get('buildingCode')
              ?.value.join(`','`)}'`
          : `'${this.materialStatusForm
              .get('buildingCode')
              ?.value[0][0].trim()}'`
        : `'ALL'`;
    this.materialCode =
      this.materialStatusForm.get('materialCode')?.value &&
      this.materialStatusForm.get('materialCode')?.value.length &&
      this.materialStatusForm.get('materialCode')?.value[0] != 'ALL'
        ? this.materialStatusForm.get('multiSelect')?.value
          ? `'${this.materialStatusForm
              .get('materialCode')
              ?.value.join(`','`)}'`
          : `'${this.materialStatusForm
              .get('materialCode')
              ?.value[0][0].trim()}'`
        : `'ALL'`;
    this.suppCode =
      this.materialStatusForm.get('suppCode')?.value &&
      this.materialStatusForm.get('suppCode')?.value.length &&
      this.materialStatusForm.get('suppCode')?.value[0] != 'ALL'
        ? this.materialStatusForm.get('multiSelect')?.value
          ? `'${this.materialStatusForm.get('suppCode')?.value.join(`','`)}'`
          : `'${this.materialStatusForm.get('suppCode')?.value[0][0].trim()}'`
        : `'ALL'`;
    this.authType =
      this.materialStatusForm.get('authType')?.value &&
      this.materialStatusForm.get('authType')?.value.length &&
      this.materialStatusForm.get('authType')?.value[0] != 'ALL'
        ? this.materialStatusForm.get('multiSelect')?.value
          ? `'${this.materialStatusForm.get('authType')?.value.join(`','`)}'`
          : `'${this.materialStatusForm.get('authType')?.value[0][0].trim()}'`
        : `'ALL'`;
    this.authCodes =
      this.materialStatusForm.get('authNos')?.value &&
      this.materialStatusForm.get('authNos')?.value.length &&
      this.materialStatusForm.get('authNos')?.value[0] != 'ALL'
        ? this.materialStatusForm.get('multiSelect')?.value
          ? `'${this.materialStatusForm.get('authNos')?.value.join(`','`)}'`
          : `'${this.materialStatusForm.get('authNos')?.value[0][0].trim()}'`
        : `'ALL'`;
    (this.authFromDate = this.materialStatusForm.get('range.authFrom')?.value
      ? `${moment(this.materialStatusForm.get('range.authFrom')?.value).format(
          'DD/MM/YYYY'
        )}`
      : ''),
      (this.authToDate = this.materialStatusForm.get('range.authTo')?.value
        ? `${moment(this.materialStatusForm.get('range.authTo')?.value).format(
            'DD/MM/YYYY'
          )}`
        : '');
  }

  retrieveData() {
    this.setRequestParamValues();
    if (this.materialStatusForm?.valid) {
      this.loaderToggle = true;
      this.dataEntryService
        .fetchMateriaPaymentStatusEnquiry(
          this.blgCode,
          this.materialCode,
          this.suppCode,
          this.authCodes,
          this.authType,
          this.authFromDate,
          this.authToDate
        )
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.materialStatusEnquiryData = res.data;
              this.loaderToggle = false;
              this.isDataRecieved = true;
            } else {
              this.toastr.showError(res.message);
              this.back();
              this.loaderToggle = false;
            }
          },
          complete: () => {},
          error: () => {
            this.loaderToggle = false;
          },
        });
    } else {
      this.materialStatusForm.markAllAsTouched();
      this.toastr.showError('Atleast Once Criteria has to be specified');
      setTimeout(function () {
        document.getElementById('bldgCode123')?.focus();
      }, 100);
    }
  }

  getReport(print: boolean) {
    if (this._service.printExcelChk(print, this.exportType)) {
      let payLoadData = {
        name: 'PassAuthEnq.rpt',
        isPrint: false,
        seqId: 1,
        exportType: this.exportType,
        conditionId:
          this.materialStatusForm.get('range.authFrom')?.value &&
          this.materialStatusForm.get('range.authTo')?.value
            ? 1
            : 2,
        reportParameters: {
          bldgCode: this.blgCode,
          partyCode: this.suppCode,
          matGroup: this.materialCode,
          authNum: this.authCodes,
          authType: this.authType,
          authFromDate: this.authFromDate,
          authToDate: this.authToDate,
          formname: this.formName,
        },
      };
      this.loaderToggle = true;
      this._commonReport
        .getTtxParameterizedReportWithCondition(payLoadData)
        .pipe(
          take(1),
          finalize(() => (this.loaderToggle = false))
        )
        .subscribe({
          next: (res: any) => {
            if (res) {
              let filename = this._commonReport.getReportName();
              this._service.exportReport(print, res, this.exportType, filename);
            }
          },
        });
    }
  }

  back() {
    this.materialStatusForm.reset();
    this.materialStatusForm.patchValue({
      buildingCode: '',
      materialCode: '',
      suppCode: '',
      authNos: '',
      authType: '',
      exportType: 'PDF',
      multiSelect: false,
    });
    this.isDataRecieved = false;
    setTimeout(function () {
      document.getElementById('bldgCode123')?.focus();
    }, 100);
  }
}

export function filterAtLeastOne(): ValidatorFn {
  return (g: AbstractControl): ValidationErrors | null => {
    return !g.get('buildingCode')?.value?.length &&
      !g.get('materialCode')?.value?.length &&
      !g.get('suppCode')?.value?.length &&
      !g.get('authNos')?.value?.length
      ? { atLeastOneFilter: true }
      : null;
  };
}
