import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import { fileConstants } from 'src/constants/fileconstants';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import * as constant from '../../../../../../constants/constant';
import * as commonConstant from '../../../../../../constants/commonconstant';
import { ModalService } from 'src/app/services/modalservice.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import * as fileSaver from 'file-saver';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  selector: 'app-interestpaymentregister-print',
  templateUrl: './interestpaymentregister-print.component.html',
  styleUrls: ['./interestpaymentregister-print.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class InterestpaymentregisterPrintComponent implements OnInit {
  compHeader!: any[];
  compData!: any;
  columnHeader!: any[];
  bringBackColumn!: number;
  coy_condition = "coy_fdyn='Y'";
  loaderToggle: boolean = false;
  companyCloseDate: any;
  pdfFile: any;
  fileName: any;
  @ViewChild(F1Component) comp!: F1Component;
  datePipe = new DatePipe('en-US');
  constructor(
    private dynapop: DynapopService,
    private rendered: Renderer2,
    private modalService: ModalService,
    private commonReportService: CommonReportsService,
    private toastr: ToasterapiService,
    private router: Router,
    private http: HttpClient,
    private _service: ServiceService
  ) {}

  ngOnInit(): void {
    this.getCompanyList();
    this.interestPaymentRegisterForm.controls['reportParameters'].controls[
      'companyName'
    ].disable();

    this._service.pageData.subscribe({
      next: (val) => {
        this.interestPaymentRegisterForm.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
  }

  ngAfterViewInit(): void {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus(); //To add default focus on input field
  }

  interestPaymentRegisterForm = new FormGroup({
    name: new FormControl(fileConstants.interestPaymentRegister),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    reportParameters: new FormGroup({
      TxtCompanyCd: new FormControl('', Validators.required),
      companyName: new FormControl(''),
      reportInterestToDate: new FormControl('', Validators.required),
      reportInterestFromDate: new FormControl('', Validators.required),
      h1: new FormControl(''),
      h2: new FormControl(''),
      h3: new FormControl(''),
      interestUptoDate: new FormControl(''),
      interestFromDate: new FormControl(''),
      coyCloseDate: new FormControl(''),
      formname: new FormControl(''),
    }),
  });

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

  setReportValues() {
    // this.fetchCompanyCloseDate();
    this.interestPaymentRegisterForm.patchValue({
      reportParameters: {
        h2: `'${
          this.interestPaymentRegisterForm.controls['reportParameters']?.get(
            'companyName'
          )?.value
        }'`,
        h1: `'Interest Payment Register'`,
        h3: `'Calculate Upto : ${this.datePipe.transform(
          this.interestPaymentRegisterForm.controls['reportParameters']
            .controls['reportInterestToDate'].value,
          'dd/MM/yyyy'
        )}'`,
        interestFromDate: this.datePipe.transform(
          this.interestPaymentRegisterForm.controls['reportParameters']
            .controls['reportInterestFromDate'].value,
          'dd/MM/yyyy'
        ),
        interestUptoDate: this.datePipe.transform(
          this.interestPaymentRegisterForm.controls['reportParameters']
            .controls['reportInterestToDate'].value,
          'dd/MM/yyyy'
        ),
        coyCloseDate: commonConstant.coyCloseDate
      },
    });
  }

  updateCompanyList(compData: any) {
    this.interestPaymentRegisterForm.patchValue({
      reportParameters: {
        companyName: compData[this.bringBackColumn].trim(),
      },
    });
  }

  validateInvalidFormat(event: any, id: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.rendered.selectRootElement(`#${id}`)?.focus();
    }
    else{
        let startDate = moment(this.interestPaymentRegisterForm.get("reportParameters.reportInterestFromDate")?.value).format('YYYY-MM-DD')
        let endDate = moment(this.interestPaymentRegisterForm.get("reportParameters.reportInterestToDate")?.value).format('YYYY-MM-DD')
        if (moment(startDate).isAfter(endDate)) {
          this.toastr.showError("Please Enter Valid Date")
          this.interestPaymentRegisterForm.get("reportParameters.reportInterestToDate")?.reset()
          this.rendered.selectRootElement(`#${id}`)?.focus()
        }
    } 
  }

  getReport(print: boolean) {
    if (this.validationFields()) {
      this.loaderToggle = true;
      this.setReportValues();
      this.commonReportService
        .getTtxParameterizedReport(this.interestPaymentRegisterForm.value)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
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
          },
          error: (err: any) => {
            this.loaderToggle = false;
            this.rendered
              .selectRootElement(this.comp.fo1.nativeElement)
              .focus();
          },
        });
    }
  }

  print() {
    this.setReportValues();
    if (this.interestPaymentRegisterForm.valid) {
      this.interestPaymentRegisterForm.value.isPrint = true;
      this.loaderToggle = true;
      this.commonReportService
        .getTtxParameterizedPrintReport(this.interestPaymentRegisterForm.value)
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
      this.validationFields();
    }
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  setCompanyName() {
    for (let i = 0; i < this.compData.dataSet.length; i++) {
      if (
        this.compData.dataSet[i][0].startsWith(
          this.interestPaymentRegisterForm?.value.reportParameters?.TxtCompanyCd
        )
      ) {
        this.interestPaymentRegisterForm.patchValue({
          reportParameters: {
            companyName: this.compData.dataSet[i][1].trim(),
          },
        });
      }
    }
  }

  fetchCompanyCloseDate() {
    let params = new HttpParams().set(
      'companyCode',
      this.interestPaymentRegisterForm.controls['reportParameters']?.get(
        'TxtCompanyCd'
      )?.value!
    );
    this.http
      .get(`${environment.API_URL}${constant.api_url.fetchCompanyCloseDate}`, {
        params: params,
      })
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          this.interestPaymentRegisterForm.patchValue({
            reportParameters: {
              coyCloseDate: res.data,
            },
          });
        },
        error: (err: any) => {},
      });
  }

  validationFields() {
    if (
      this.interestPaymentRegisterForm.controls['reportParameters'].controls[
        'TxtCompanyCd'
      ].errors &&
      this.interestPaymentRegisterForm.controls['reportParameters'].controls[
        'TxtCompanyCd'
      ].errors?.['required']
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Company code cannot be left blank',
        this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus(),
        'error'
      );
      return false;
    } else if (
      this.interestPaymentRegisterForm.controls['reportParameters'].controls[
        'reportInterestFromDate'
      ].errors &&
      this.interestPaymentRegisterForm.controls['reportParameters'].controls[
        'reportInterestFromDate'
      ].errors?.['required']
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Interest From Date is Required',
        this.rendered.selectRootElement('#formDateField')?.focus(),
        'error'
      );
      return false;
    } else if (
      this.interestPaymentRegisterForm.controls['reportParameters'].controls[
        'reportInterestToDate'
      ].errors &&
      this.interestPaymentRegisterForm.controls['reportParameters'].controls[
        'reportInterestToDate'
      ].errors?.['required']
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Interest To Date is Required',
        this.rendered.selectRootElement('#toDateField')?.focus(),
        'error'
      );
      return false;
    } else if (
      this.interestPaymentRegisterForm.controls['reportParameters'].controls[
        'reportInterestFromDate'
      ].value! >
      this.interestPaymentRegisterForm.controls['reportParameters'].controls[
        'reportInterestToDate'
      ].value!
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'From Date should be less then To Date',
        this.rendered.selectRootElement('#toDateField')?.focus(),
        'error'
      );
      this.interestPaymentRegisterForm.patchValue({
        reportParameters: {
          reportInterestToDate: '',
        },
      });
      return false;
    } else {
      return true;
    }
  }
}
