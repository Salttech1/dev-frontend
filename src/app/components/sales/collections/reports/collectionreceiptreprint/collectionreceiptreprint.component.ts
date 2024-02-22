import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { CollectionsService } from 'src/app/services/sales/collections.service';
import { ServiceService } from 'src/app/services/service.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { CollQueryString } from 'src/app/shared/interface/sales';
import { api_url } from 'src/constants/constant';
import { DynaPopConstant } from 'src/constants/dyna-pop-constant';

@Component({
  selector: 'app-collectionreceiptreprint',
  templateUrl: './collectionreceiptreprint.component.html',
  styleUrls: ['./collectionreceiptreprint.component.css']
})
export class CollectionreceiptreprintComponent implements OnInit {

  loaderToggle: boolean = false;
  // accYear!: string;
  formname!: any;

  config = {
    isLoading: false,
  };
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'download',
    'print',
    'reset',
    'exit',
  ]);

  receiptTypes = [
    { name: 'Voucher Print', id: 'voucher' },
    { name: 'Receipt Print', id: 'receipt' },
  ];

  exportTypes = [
    { name: 'PDF', id: 'PDF' },
    { name: 'Excel (Report - Data Format)', id: 'EXCEL_REPORT_DATA_FORMAT' },
    { name: ' Excel (Template Format)', id: 'EXCEL_TEMPLATE_FORMAT' },
  ];

  queryString: CollQueryString = {
    bldCode: '',
    wingCode: '',
    flatNo: '',
    finalString: '',
    getFlatNumber: '',
    getWing: '',
    getReceiptNum: ''
  };
  CollectionsService: any;

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    public _service: ServiceService,
    private route: ActivatedRoute,
    private http: HttpRequestService,
    private _commonReport: CommonReportsService,
    private Collectionchallanervice: CollectionsService
  ) {}

  url: string = '';
  createReportForm: FormGroup = this.formBuilder.group({
    exportType: ['PDF'],
    name: [''],
    printType: [this.receiptTypes[1]['id'], Validators.required],
    bldgcode: [' ', Validators.required],
    blgdName: [{ value: '', disabled: true }],
    ownerName: [' ', Validators.required],
    wing: [''],
    flatNum: ['', Validators.required],
    recnum: ['', Validators.required],
    receiptType: [''],
  });

  ngOnInit(): void {
    this.getDataFromParms();
  }

  getDataFromParms() {
    var parmsData: any = localStorage.getItem('reportPayload');
    if (parmsData) {
      parmsData = JSON.parse(parmsData);
      this.createReportForm.patchValue({
        bldgcode: parmsData.bldgcode,
        blgdName:parmsData.blgdName,
        wing:parmsData.wing,
        flatNum:parmsData.flatNum,
        recnum: parmsData.recnum,
      });
      localStorage.removeItem('reportPayload');
    }
  }
   // list action buttons method
   buttonAction(event: string) {
    if (event === 'download') {
      this.getGstFlag(false);
    } else if (event === 'print') {
      this.getGstFlag(true);
    } else if (event === 'exit') {
      this.router.navigateByUrl('/dashboard');
    } else if (event === 'reset') {
      this.createReportForm.reset();
      this.queryString = {
        bldCode: '',
        wingCode: '',
        flatNo: '',
        finalString: '',
        getFlatNumber: '',
        getWing: '',
        getReceiptNum: '',
      };
      this.createReportForm.patchValue({
        printType: this.receiptTypes[1].id,
        exportType: 'PDF',
        HeaderText1: 'HeaderText1',
        HeaderText2: 'HeaderText2',
        HeaderText3: 'HeaderText3',
      });
    }
  }

  onLeaveBuildingCode(val: any) {
    this.queryString.bldCode = val;
    this.queryString.getWing =
      DynaPopConstant.BldCode + "'" + this.queryString.bldCode + "'";

    this.queryString.finalString = '';
    this.queryString.getReceiptNum = '';
    this.queryString.getFlatNumber = '';
  }
  onLeaveWingCode(val: any) {
    if (val) {
      this.queryString.wingCode = val;
      this.queryString.getFlatNumber =
        DynaPopConstant.BldCode +
        "'" +
        this.queryString.bldCode +
        "'" +
        DynaPopConstant.and +
        DynaPopConstant.wingCode +
        "'" +
        this.queryString.wingCode +
        "'";
    }
  }
  onLeaveFlatNum(val: any) {
    if (val) {
      this.queryString.flatNo = val;

      this.queryString.getReceiptNum =
        DynaPopConstant.inf_bldgcode +
        "'" +
        this.queryString.bldCode +
        "'" +
        DynaPopConstant.and +
        DynaPopConstant.inf_wing +
        "'" +
        (this.queryString.wingCode ? this.queryString.wingCode : ' ') +
        "'" +
        DynaPopConstant.and +
        DynaPopConstant.inf_flatnum +
        "'" +
        val +
        "'" +
        DynaPopConstant.and +
        DynaPopConstant.inf_chargecode +
        this.CollectionsService.getChargeCode();
    }
  }

  // getReportTypeOnDemand(reportType:string){

  // }

  // downloadReport(isPrint: boolean) {
  //   if (this.createReportForm.valid) {
  //     const invoiceNumber: string = this.commonService.convertArryaToString(
  //       this.createReportForm.getRawValue().invoiceno
  //     );
  //     console.log('invoice numner', invoiceNumber);

  //     let payload: any = {
  //       name: invoiceNumber.includes('BS')
  //         ? 'CollectionInvoice-BS.rpt'
  //         : 'CollectionInvoice-TX.rpt',
  //       exportType: 'PDF',
  //       isPrint: false,
  //       seqId: 1,
  //       reportParameters: {
  //         formname: '',
  //           recnum: 
  //           "'" +
  //           this.commonService.convertArryaToString(
  //             this.createReportForm.get('recnum')?.value
  //           ) +
  //           "'",
  //           bldgcode: this.commonService.convertArryaToString(
  //             this.createReportForm.get('bldgcode')?.value
  //           ),

  //           flatnum: this.createReportForm.get('flatNum')?.value
  //             ? this.commonService.convertArryaToString(
  //                 this.createReportForm.get('flatNum')?.value
  //               )
  //             : 'ALL',
  //             wing: this.createReportForm.get('wing')?.value
  //             ?this.commonService.convertArryaToString(
  //               this.createReportForm.get('wing')?.value
  //             )
  //             :'All',
  //       },
  //     };
  //     this.PrintReport(payload, isPrint);
  //     this.config.isLoading = false;
  //   }
  // }

   //download report
   downloadReport(isPrint: boolean, isGstFlag: boolean) {
    if (this.createReportForm.valid) {
      this.config.isLoading = true;
      if (
        this._service.printExcelChk(
          isPrint,
          this.createReportForm.get('exportType')?.value
        )
      ) {
        let payload: any = {
          name: isGstFlag
          ? 'RptCollectionReceiptNew_first-gst.rpt'
          : 'RptCollectionReceiptNew_first.rpt',
          exportType: this.createReportForm.get('exportType')?.value,
          isPrint: false,
          seqId: 1,
          reportParameters: {
            HeaderText1: this.createReportForm.get('HeaderText1')?.value,
            HeaderText2: this.createReportForm.get('HeaderText2')?.value,
            HeaderText3: this.createReportForm.get('HeaderText3')?.value,
            recnum: this.commonService.convertArryaToString(
              this.createReportForm.get('recnum')?.value
            ),
            bldgcode: this.commonService.convertArryaToString(
              this.createReportForm.get('bldgcode')?.value
            ),

            flatnum: this.createReportForm.get('flatNum')?.value
              ? this.commonService.convertArryaToString(
                  this.createReportForm.get('flatNum')?.value
                )
              : 'ALL',
            ownerid: '',
            auxi_inap: this.createReportForm.get('auxi_inap')?.value,
          },
        };

        const wingValue = this.createReportForm.get('wing')?.value;
        const trimmedWingValue = wingValue
          ? this.commonService.convertArryaToString(wingValue).trimEnd()
          : ' ';
        const result = trimmedWingValue || ' ';

        payload.reportParameters.wing = result;
        payload.reportParameters.ownerid = (
          payload.reportParameters.bldgcode +
          payload.reportParameters.wing +
          payload.reportParameters.flatnum
        ).trimEnd();

        payload.reportParameters.flatnum?.trimEnd();

        if (this.url.includes('normal')) {
          this.getAdvanceFlag(payload, isGstFlag, isPrint);
        } else {
          this.getCarParks(payload, isPrint);
        }
      } else {
        this.config.isLoading = false;
      }
    }
  }

  getGstFlag(isPrint: boolean) {
    let obj = {
      recNum: this.commonService
        .convertArryaToString(this.createReportForm.get('recnum')?.value)
        .trimEnd(),
    };

    if (this.createReportForm.valid) {
      this.http.request('get', api_url.getGSTFlag, null, obj).subscribe({
        next: (res: any) => {
          this.downloadReport(isPrint, res.data === 'Y' ? true : false);
        },
        error: (error: any) => {
          this.config.isLoading = false;
        },
      });
    }
  }

  getCarParks(payload: any, isPrint: boolean) {
    let parms = {
      bldgCode: payload.reportParameters.bldgcode,
      wing: payload.reportParameters.wing,
      flatNo: payload.reportParameters.flatnum,
    };
    this.http.request('get', api_url.getCarParks, null, parms).subscribe({
      next: (res: any) => {
        const excludedKeys = ['HeaderText1', 'HeaderText2', 'HeaderText3'];
        payload.reportParameters =
          this.commonService.addSingleQuotationForString(
            excludedKeys,
            payload.reportParameters
          );

        payload.reportParameters.HeaderText3 = res.data;

        payload.name.includes('RptFirstInfraReceipt')
          ? delete payload.reportParameters.HeaderText2
          : '';
        this.PrintReport(payload, isPrint);
      },
      error: (error: any) => {
        this.config.isLoading = false;
      },
    });
  }

  getRPTName(){

  }

  getAdvanceFlag(payload: any, isGstFlag: boolean, isPrint: boolean) {
    let getAdvanceCheck = {
      bldgCode: payload.reportParameters.bldgcode,
      wing:
        payload.reportParameters.wing == ' '
          ? ''
          : payload.reportParameters.wing,
      flatNo: payload.reportParameters.flatnum,
      recNum: payload.reportParameters.recnum,
      gstYN: isGstFlag ? 'Y' : 'N',
    };

    this.http
      .request('get', api_url.getAdvanceFlag, null, getAdvanceCheck)
      .subscribe({
        next: (res: any) => {
          payload.reportParameters.HeaderText1 = res.data[0];
          payload.reportParameters.HeaderText2 = res.data[1];

          this.getCarParks(payload, isPrint);
        },
        error: (error: any) => {
          this.config.isLoading = false;
        },
      });
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
      this.createReportForm.get('exportType')?.value,
      filename
    );
  }
}
