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
  selector: 'app-bankguarreport',
  templateUrl: './bankguarreport.component.html',
  styleUrls: ['./bankguarreport.component.css'],
})
export class BankguarreportComponent implements OnInit {
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
  bankGuarReportForm: FormGroup = this.formBuilder.group({
    exportType: ['PDF'],
    name: [''],
    Project: ['', Validators.required],
  });
  queryString = {
    Project: '',
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
        this.bankGuarReportForm.patchValue({
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
      this.bankGuarReportForm.patchValue({
        Project: parmsData.Project,
      });
      localStorage.removeItem('reportPayload');
    }
  }

  setReportValues() {
    // this.fetchCompanyCloseDate();
    this.bankGuarReportForm.patchValue({});
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
      this.bankGuarReportForm.reset();
      this.queryString = {
        Project: '',
      };
      this.bankGuarReportForm.patchValue({
        exportType: 'PDF',
      });
    }
  }

  onLeaveBuildingCode(val: any) {
    if (val) {
      this.queryString.Project = val;
    }
  }

  downloadReport(isprint: boolean) {
    if (this.bankGuarReportForm.valid) {
      this.loaderToggle = true;
      const Project: string = this.commonService.convertArryaToString(
        this.bankGuarReportForm.getRawValue().Project
      );
      console.log('Project', Project);
      let payload: any = {
        name: 'Engg_Rp_Bank_Guarantee_Details_new.rpt',
        exportType: 'PDF',
        isPrint: false,
        seqId: 1,
        reportParameters: {
          formname: 'FrmBank_Guarantee_Details',

          
          Project: this.commonService.convertArryaToString(
            this.bankGuarReportForm.get('Project')?.value 
          )
        }
      }
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
      }
    });
  }

  commonPdfReport(print: Boolean, res: any) {
    let filename = this._commonReport.getReportName();
    this.config.isLoading = false;
    this._service.exportReport(
      print,
      res,
      this.bankGuarReportForm.get('exportType')?.value,
      filename
    );
  }
}
