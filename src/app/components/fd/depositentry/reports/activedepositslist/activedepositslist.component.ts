import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import * as constant from '../../../../../../constants/constant';
import { take } from 'rxjs';
import * as fileSaver from 'file-saver';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { fileConstants } from 'src/constants/fileconstants';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { ServiceService } from 'src/app/services/service.service';

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
  selector: 'app-activedepositslist',
  templateUrl: './activedepositslist.component.html',
  styleUrls: ['./activedepositslist.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class ActivedepositslistComponent implements OnInit {
  @ViewChild(F1Component) comp!: F1Component;
  compHeader!: any[];
  compData!: any;
  columnHeader!: any[];
  bringBackColumn!: number;
  coy_condition = "coy_fdyn='Y'";
  loaderToggle: boolean = false;
  datePipe = new DatePipe('en-Us');

  constructor(
    private rendered: Renderer2,
    private dynapop: DynapopService,
    private router: Router,
    private _service: ServiceService,
    private modalService: ModalService,
    private commonReportService: CommonReportsService,
    private toastr: ToasterapiService,
    private changeDetectRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getCompanyList();
    this.activeDepositListForm.controls['reportParameters'].controls[
      'companyName'
    ].disable();

    this._service.pageData.subscribe({
      next: (val) => {
        this.activeDepositListForm.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
  }

  ngAfterContentChecked() {
    if (
      this.activeDepositListForm?.controls['reportParameters']?.get('coy')
        ?.value == ''
    ) {
      this.activeDepositListForm.patchValue({
        reportParameters: {
          companyName: '',
        },
      });
    }
  }

  activeDepositListForm = new FormGroup({
    name: new FormControl(fileConstants.activeDepositList),
    seqId: new FormControl(1),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      coy: new FormControl('', Validators.required),
      h1: new FormControl(''),
      h2: new FormControl("'" + 'Active Depositors List' + "'"),
      h3: new FormControl(''),
      companyName: new FormControl(''),
      reportAsOnDate: new FormControl('', Validators.required),
      DtpAsOnDate: new FormControl(''),
      formname: new FormControl(''),
    }),
  });

  ngAfterViewInit(): void {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus(); //To add default focus on input field
  }

  setReportValues() {
    this.activeDepositListForm.patchValue({
      reportParameters: {
        h1: `'${
          this.activeDepositListForm.controls['reportParameters']?.get(
            'companyName'
          )?.value
        }'`,
        DtpAsOnDate: this.datePipe.transform(
          this.activeDepositListForm.value.reportParameters?.reportAsOnDate,
          'dd/MM/yyyy'
        ),
        h3: `'  As on: ${this.datePipe.transform(
          this.activeDepositListForm.value.reportParameters?.reportAsOnDate,
          'dd/MM/yyyy'
        )}'`,
      },
    });
  }
  getCompanyList() {
    this.dynapop
      .getDynaPopListObj('COMPANY', "coy_fdyn='Y'")
      .subscribe((res: any) => {
        this.compHeader = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.compData = res.data;
        this.bringBackColumn = res.data.bringBackColumn;
      });
  }

  getReport(print: boolean) {
    if (this.validateFields()) {
      this.setReportValues();
      this.loaderToggle = true;
      this.commonReportService
        .getTtxParameterizedReport(this.activeDepositListForm.value)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res?.type == 'application/json') {
              this.loaderToggle = false;
              this.toastr.showError('No Records Found');
            } else {
              this.loaderToggle = false;
              let pdfFile = new Blob([res], { type: 'application/pdf' });
              let fileName = this.commonReportService.getReportName();
              if (print) {
                const blobUrl = URL.createObjectURL(pdfFile);
                const oWindow = window.open(blobUrl, '_blank');
                oWindow?.print();
              } else {
                fileSaver.saveAs(pdfFile, fileName);
              }
            }
          },
          error: (err: any) => {
            this.loaderToggle = false;
          },
          complete: () => {
            this.loaderToggle = false;
          },
        });
    }
  }

  print() {
    this.setReportValues();
    if (this.activeDepositListForm.valid) {
      this.activeDepositListForm.value.isPrint = true;
      this.loaderToggle = true;
      this.commonReportService
        .getTtxParameterizedPrintReport(this.activeDepositListForm.value)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.loaderToggle = false;
              this.toastr.showSuccess(res.message);
            } else {
              this.toastr.showError(res.message);
            }
          },
          error: (err: any) => {
            this.loaderToggle = false;
          },
          complete: () => {
            this.loaderToggle = false;
          },
        });
    } else {
      this.validateFields();
    }
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }
  updateCompanyList(compData: any) {
    this.activeDepositListForm.patchValue({
      reportParameters: {
        companyName: compData[this.bringBackColumn].trim(),
        h1: compData[this.bringBackColumn].trim(),
      },
    });
  }

  validateInvalidFormat(event: any, id: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.rendered.selectRootElement(`#${id}`)?.focus();
    }
  }

  focusField(fieldId: any) {
    let el = document.getElementById(fieldId)
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  setCompanyName() {
    for (let i = 0; i < this.compData.dataSet.length; i++) {
      if (
        this.compData.dataSet[i][0].startsWith(
          this.activeDepositListForm?.value.reportParameters?.coy
        )
      ) {
        this.activeDepositListForm.patchValue({
          reportParameters: {
            companyName: this.compData.dataSet[i][1].trim(),
          },
        });
      }
    }
  }

  validateFields() {
    if (
      this.activeDepositListForm.value.reportParameters?.coy == '' ||
      this.activeDepositListForm.value.reportParameters?.coy == null
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Company code cannot be left blank',
        this.focusField('company4'),
        'error'
      );
      return false;
    } else if (
      this.activeDepositListForm.value.reportParameters?.reportAsOnDate == '' ||
      this.activeDepositListForm.value.reportParameters?.reportAsOnDate == null
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Invalid as on date',
        this.rendered.selectRootElement('#asDateField')?.focus(),
        'error'
      );
      return false;
    } else {
      return true;
    }
  }
}
