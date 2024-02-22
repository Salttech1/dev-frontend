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
  selector: 'app-certauthoutstandingreport',
  templateUrl: './certauthoutstandingreport.component.html',
  styleUrls: ['./certauthoutstandingreport.component.css'],
})
export class CertauthoutstandingreportComponent implements OnInit {
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
  certAuthOutstandingForm: FormGroup = this.formBuilder.group({
    exportType: ['PDF'],
    name: [''],
    reportOption: [''],
    reportOption2: [''],
    bldgcodes: ['', Validators.required],
    blgdName: [{ value: '', disabled: true }],
    frmDate: [''],
    toDate: [''],
  });
  queryString = {
    bldgCode: '',
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
      document.getElementById('fromDateField')?.focus();
    }, 100);
    this._service.pageData.subscribe({
      next: (val) => {
        this.certAuthOutstandingForm.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
    this.getDataFromParms();
  }

  checkBoxToggle(event: any) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.target.checked
        ? (event.target.checked = false)
        : (event.target.checked = true);
    }
  }

  //get record for defaul
  getDataFromParms() {
    var parmsData: any = localStorage.getItem('reportPayload');
    if (parmsData) {
      parmsData = JSON.parse(parmsData);
      this.certAuthOutstandingForm.patchValue({
        bldgcodes: parmsData.bldgcode,
        blgdName: parmsData.blgdName,
        wing: parmsData.wing,
        flatNum: parmsData.flatNum,
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
        this.certAuthOutstandingForm.get('reportParameters.Frmdate')?.value
      ).format('YYYY-MM-DD');
      let endDate = moment(
        this.certAuthOutstandingForm.get('reportParameters.ToDate')?.value
      ).format('YYYY-MM-DD');
      console.log(endDate);
      if (moment(startDate).isAfter(endDate)) {
        this.toastr.error('To Date Should not be Less than From Date');
        this.certAuthOutstandingForm.get('reportParameters.ToDate')?.reset();
        this.rendered.selectRootElement(`#${id}`)?.focus();
      }
    }
  }

  setReportValues() {
    // this.fetchCompanyCloseDate();
    this.certAuthOutstandingForm.patchValue({});
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
      this.certAuthOutstandingForm.reset();
      this.queryString = {
        bldgCode: '',
      };
      this.certAuthOutstandingForm.patchValue({
        exportType: 'PDF',
        HeaderText1: 'HeaderText1',
        HeaderText2: 'HeaderText2',
        HeaderText3: 'HeaderText3',
      });
    }
  }

  onLeaveBuildingCode(val: any) {
    if (val) {
      this.queryString.bldgCode = val;
    }
  }

  downloadReport(isprint: boolean) {
    if (this.certAuthOutstandingForm.valid) {
      this.loaderToggle = true;
      const bldgcode: string = this.commonService.convertArryaToString(
        this.certAuthOutstandingForm.getRawValue().bldgcodes
      );
      console.log('bldgcode', bldgcode);
      let payload: any = {
        name: this.getRptName(),
        exportType: 'PDF',
        isPrint: false,
        seqId: 1,
        reportParameters: {
          formname: 'CertAuthOutstandingForm',
          BldgCodes: this.commonService.convertArryaToString(
            this.certAuthOutstandingForm.get('bldgcodes')?.value
          ),
          fromdate: moment(
            this.certAuthOutstandingForm.get('fromdate')?.value
          ).format('YYYY-MM-DD'),
          uptodate: moment(
            this.certAuthOutstandingForm.get('uptodate')?.value
          ).format('YYYY-MM-DD'),
        },
      };

    payload.name.includes('Summary.rpt')?delete payload.reportParameters.BldgCodes :''
      this.PrintReport(payload, isprint);
      this.config.isLoading = false;
    }
  }

  getRptName() {
    let rep1 = this.certAuthOutstandingForm.get('reportOption')?.value;
    let rep2 = this.certAuthOutstandingForm.get('reportOption2')?.value;

    if (rep1 == 'cert' && rep2 == 'detail') {
      return 'Engg_RP_OS_CertDetail.rpt';
    } else if (rep1 == 'cert' && rep2 == 'summ') {
      return 'Engg_RP_OS_CertSummary.rpt';
    } else if (rep1 == 'auth' && rep2 == 'detail') {
      return 'Engg_RP_OS_AuthDetail.rpt';
    } else if (rep1 == 'auth' && rep2 == 'summ') {
      return 'Engg_RP_OS_AuthSummary.rpt';
    } else {
      return 'error';
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
      this.certAuthOutstandingForm.get('exportType')?.value,
      filename
    );
  }
}
