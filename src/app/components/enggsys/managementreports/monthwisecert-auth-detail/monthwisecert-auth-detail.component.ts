import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonReportsService } from 'src/app/services/reports.service';

import { ServiceService } from 'src/app/services/service.service';
import * as moment from 'moment';
import { DynaPopConstant } from 'src/constants/dyna-pop-constant';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
@Component({
  selector: 'app-monthwisecert-auth-detail',
  templateUrl: './monthwisecert-auth-detail.component.html',
  styleUrls: ['./monthwisecert-auth-detail.component.css'],
})
export class MonthwisecertAuthDetailComponent implements OnInit {
  loaderToggle: boolean = false;
  config = {
    isLoading: false,
  };
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'download',
    'print',
    'reset',
    'exit',
  ]);
  exportTypes = [
    { name: 'PDF', id: 'PDF' },
    { name: 'Excel (Report - Data Format)', id: 'EXCEL_REPORT_DATA_FORMAT' },
    { name: ' Excel (Template Format)', id: 'EXCEL_TEMPLATE_FORMAT' },
  ];

  url: string = '';
  monthWiseCertAuthDetailForm: FormGroup = this.formBuilder.group({
    exportType: ['PDF'],
    name: [''],
    BldgCodes: ['', Validators.required],
    blgdName: [{ value: '', disabled: true }],
    StartDate: [''],
    EndDate: [''],
  });
  queryString = {
    BldgCodes: '',
  };

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    public _service: ServiceService,
    private http: HttpRequestService,
    private _commonReport: CommonReportsService,
    private commonReportService: CommonReportsService,
    private toastr: ToastrService,
    private rendered: Renderer2
  ) {}

  ngOnInit(): void {
    setTimeout(function () {
      document.getElementById('StartDateField')?.focus();
    }, 100);
    this._service.pageData.subscribe({
      next: (val) => {
        this.monthWiseCertAuthDetailForm.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
    this.getDataFromParms();
  }

  //get record for defaul
  getDataFromParms() {
    var parmsData: any = localStorage.getItem('reportPayload');
    if (parmsData) {
      parmsData = JSON.parse(parmsData);
      this.monthWiseCertAuthDetailForm.patchValue({
        BldgCodes: parmsData.BldgCodes,
        StartDate: parmsData.StartDate,
        EndDate: parmsData.EndDate,
      });
      localStorage.removeItem('reportPayload');
    }
  }
  validateInvalidFormat(event: any, id: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.toastr.error('Please Enter Valid Date');
      this.rendered.selectRootElement(`#${id}`)?.focus();
    } else {
      let startDate = moment(
        this.monthWiseCertAuthDetailForm.get('reportParameters.StartDate')?.value
      ).format('YYYY-MM-DD');
      let endDate = moment(
        this.monthWiseCertAuthDetailForm.get('reportParameters.EndDate')?.value
      ).format('YYYY-MM-DD');
      console.log(endDate);
      if (moment(startDate).isAfter(endDate)) {
        this.toastr.error('To Date Should not be Less than From Date');
        this.monthWiseCertAuthDetailForm
          .get('reportParameters.EndDate')
          ?.reset();
        this.rendered.selectRootElement(`#${id}`)?.focus();
      }
    }
  }

  setReportValues() {
    // this.fetchCompanyCloseDate();
    this.monthWiseCertAuthDetailForm.patchValue({});
  }

  // list action buttons method
  buttonAction(event: string) {
    if (event === 'download') {
      this.downloadReport(false);
    } else if (event === 'print') {
      this.downloadReport(true);
    } else if (event === 'exit') {
      this.router.navigateByUrl('/dashboard');
    } else if (event === 'reset') {
      this.monthWiseCertAuthDetailForm.reset();
      this.queryString = {
        BldgCodes: '',
      };
      this.monthWiseCertAuthDetailForm.patchValue({
        exportType: 'PDF',
        HeaderText1: 'HeaderText1',
        HeaderText2: 'HeaderText2',
        HeaderText3: 'HeaderText3',
      });
    }
  }

  onLeaveBuildingCode(val: any) {
    if (val) {
      this.queryString.BldgCodes = val;
    }
  }

  downloadReport(isprint: boolean) {
    if (this.monthWiseCertAuthDetailForm.valid) {
      this.loaderToggle = true;
      const BldgCodes: string = this.commonService.convertArryaToString(
        this.monthWiseCertAuthDetailForm.getRawValue().BldgCodes
      );
      let payload: any = {
        name: 'MonthWiseCertAuthSum.rpt',
        exportType: 'PDF',
        isPrint: false,
        seqId: 1,
        reportParameters: {
          BldgCodes: this.commonService.convertArryaToString(
            "'" + this.monthWiseCertAuthDetailForm.get('BldgCodes')?.value + "'" 
          ),
          StartDate: moment(
            this.monthWiseCertAuthDetailForm.get('StartDate')?.value
          ).format('YYYY-MM-DD'),
          EndDate: moment(
            this.monthWiseCertAuthDetailForm.get('EndDate')?.value
          ).format('YYYY-MM-DD'),
          formname: 'FrmMonthWiseCertAuthSum',
        },
      };
      this.PrintReport(payload, isprint);
      this.config.isLoading = false;
    }
  }
  PrintReport(payload: any, isPrint: boolean) {
    this._commonReport.getParameterizedReport(payload).subscribe({
      next: (res) => {
        if (res) {
          this.commonPdfReport(isPrint, res);
        }
      },
      error: (error) => {
        this.config.isLoading = false;
      },
    });
  }

  commonPdfReport(print: Boolean, res: any) {
    let filename = this._commonReport.getReportName();
    this.config.isLoading = false;
    this._service.exportReport(
      print,
      res,
      this.monthWiseCertAuthDetailForm.get('exportType')?.value,
      filename
    );
  }
}
