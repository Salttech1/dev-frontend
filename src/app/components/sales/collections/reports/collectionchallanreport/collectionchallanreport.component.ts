import { Component, OnInit } from '@angular/core';
import { buttonsList } from 'src/app/shared/interface/common';
import { CommonService } from 'src/app/services/common.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { DynaPopConstant } from 'src/constants/dyna-pop-constant';
import { CollectionsService } from 'src/app/services/sales/collections.service';
import { api_url } from 'src/constants/constant';
import { yearRange } from 'src/app/components/fd/depositentry/reports/yearlyinteresttdsdetails/yearlyinteresttdsdetails.component';
import { CollQueryString } from 'src/app/shared/interface/sales';

@Component({
  selector: 'app-collectionchallanreport',
  templateUrl: './collectionchallanreport.component.html',
  styleUrls: ['./collectionchallanreport.component.css'],
})
export class CollectionchallanreportComponent implements OnInit {
  academicYears: string[] = [];
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
    { name: 'Receipt Print', id: 'receipt' },
  ];
  exportTypes = [
    { name: 'PDF', id: 'PDF' },
    { name: 'Excel (Report - Data Format)', id: 'EXCEL_REPORT_DATA_FORMAT' },
    { name: ' Excel (Template Format)', id: 'EXCEL_TEMPLATE_FORMAT' },
  ];

  // dynomo query string for relational data
  queryString: CollQueryString = {
    bldCode: '',
    wingCode: '',
    flatNo: '',
    finalString: '',
    getFlatNumber: '',
    getWing: '',
    getReceiptNum: '',
  };

  url: string = '';
  collectionchallanreportForm: FormGroup = this.formBuilder.group({
    exportType: ['PDF'],
    name: [''],
    printType: [this.receiptTypes[1]['id'], Validators.required],
    bldgcode: ['', Validators.required],
    blgdName: [{ value: '', disabled: true }],
    wing: [''],
    flatNum: ['', Validators.required],
    ownerName: [{ value: '', disabled: true }],
    recnum: ['', Validators.required],
    receiptType: [''],
    auxi_inap: [''],
    Rbx_Acc_All: [''],
    Rbx_Acc_Recd: [''],
    Rbx_IT_Recd: [''],
    Rbx_IT_NotRecd: [''],
    Rbx_IT_All:[''],
    Rbx_Acc_NotRecd:[''],
    isdisposed:[''],
    userLable: [''],
    HeaderText1: ['HeaderText1'],
    HeaderText2: ['HeaderText2'],
    HeaderText3: ['HeaderText3'],
  });

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

  ngOnInit(): void {
    // this.init();
    this.getDataFromParms();
    this.populateAcademicYears();
  }

  //get record for defaul
  getDataFromParms() {
    var parmsData: any = localStorage.getItem('reportPayload');
    if (parmsData) {
      parmsData = JSON.parse(parmsData);
      this.collectionchallanreportForm.patchValue({
        bldgcode: parmsData.bldgcode,
        blgdName: parmsData.blgdName,
        wing: parmsData.wing,
        flatNum: parmsData.flatNum,
        ownerName: parmsData.ownerName,
        recnum: parmsData.recnum,
      });
      localStorage.removeItem('reportPayload');
    }
  }

  // init() {
  //   this.url =
  //     this.router.url.split('/')[this.router.url.split('/').length - 1];

  //   this.getReportTypeOnDemand('receipt');

  //   this.collectionchallanreportForm
  //     .get('printType')
  //     ?.valueChanges.subscribe((val: any) => {
  //       this.getReportTypeOnDemand(val);
  //     });

  //   this.collectionchallanreportForm.statusChanges.subscribe((status: any) => {
  //     this.commonService.enableDisableButtonsByIds(
  //       ['download', 'print'],
  //       this.buttonsList,
  //       status === 'INVALID' ? true : false
  //     );
  //   });
  // }

  // list action buttons method
  buttonAction(event: string) {
    if (event === 'download') {
      this.getGstFlag(false);
    } else if (event === 'print') {
      this.getGstFlag(true);
    } else if (event === 'exit') {
      this.router.navigateByUrl('/dashboard');
    } else if (event === 'reset') {
      this.collectionchallanreportForm.reset();
      this.queryString = {
        bldCode: '',
        wingCode: '',
        flatNo: '',
        finalString: '',
        getFlatNumber: '',
        getWing: '',
        getReceiptNum: '',
      };
      this.collectionchallanreportForm.patchValue({
        printType: this.receiptTypes[1].id,
        exportType: 'PDF',
        HeaderText1: 'HeaderText1',
        HeaderText2: 'HeaderText2',
        HeaderText3: 'HeaderText3',
      });
    }
  }

  
  checkBoxToggle(event: any) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.target.checked
        ? (event.target.checked = false)
        : (event.target.checked = true);
    }
  }
  populateAcademicYears() {
    let lngyear: number = 2009;
    const currentYear: number = new Date().getFullYear();

    this.academicYears.push(' '); // Add an empty option

    for (let i = 0; i < 26; i++) {
      this.academicYears.push(`${lngyear}-${lngyear + 1}`);
      lngyear++;
      if (lngyear > currentYear + 2) {
        break;
      }
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
        this.Collectionchallanervice.getChargeCode();
    }
  }

  funcMakewhereClause(Bldgcode: string, Wing: string, Flatno: string) {
    let strheadertext1: string = '';
    let Strquery: string='';
    let strquery_coll: string = ' ';

    if (Bldgcode !== '') {
      Strquery = ` and chalh_bldgcode in (${Bldgcode}) `;
      strheadertext1 = ` Building: ${Bldgcode}`;
    }

    if (Wing !== '') {
      Strquery = ` and chalh_wing in (${Wing}) `;
      strheadertext1 += ` Wing: ${Wing}`;
    }

    if (Flatno !== '') {
      Strquery = ` and chalh_flatnum in (${Flatno}) `;
      strheadertext1 += ` Unit No: ${Flatno}`;
    }

    // Assuming Strquery and strquery_coll are defined and have values
     strquery_coll = Strquery.replace('/chalh/g', 'coll');
    strquery_coll = strquery_coll.replace(/and/, ' ').trim();

    if (this.collectionchallanreportForm.getRawValue().Rbx_Acc_All) {
      // No action needed for Rbx_Acc_All
    } else if (this.collectionchallanreportForm.getRawValue().Rbx_Acc_Recd) {
      Strquery = " and chalh_f16recvdac = 'Y' ";
      strheadertext1 += ' F16Recvd Accounts Dept = Y ';
    } else if (this.collectionchallanreportForm.getRawValue().Rbx_Acc_NotRecd) {
      Strquery = " and chalh_f16recvdac = 'N' ";
      strheadertext1 += ' F16Recvd Accounts Dept = N ';
    }

    // Assuming Rbx_IT_All, Rbx_IT_Recd, and Rbx_IT_NotRecd are defined and have values
    if (this.collectionchallanreportForm.getRawValue().Rbx_IT_All) {
      // No action needed for Rbx_IT_All
    } else if (this.collectionchallanreportForm.getRawValue().Rbx_IT_Recd) {
      Strquery = " and chalh_f16recvdit = 'Y' ";
      strheadertext1 += ' F16Recvd IT Dept = Y ';
    } else if (this.collectionchallanreportForm.getRawValue().Rbx_IT_NotRecd) {
      Strquery = " and chalh_f16recvdit = 'N' ";
      strheadertext1 += ' F16Recvd IT Dept = N ';
    }

    // Assuming Cbx_assyear is defined and has a value
    if (this.collectionchallanreportForm.getRawValue().AcademicYear.value.trim() !== '') {
      Strquery = ` and chalh_assyear = '${this.collectionchallanreportForm.getRawValue().AcademicYear.value.trim()}' `;
      strheadertext1 += ` Assessment Year: ${this.collectionchallanreportForm.getRawValue().AcademicYear.value.trim()}`;
    }

    // Assuming Strquery is defined and has a value
    Strquery = Strquery.replace(/and/, ' ').trim();

    return Strquery.trim();
  }

  // // on navigation report type change
  // getReportTypeOnDemand(reportType: string) {
  //   // if auxi report
  //   if (
  //     this.url === 'auxiliaryreceiptreportfirst' ||
  //     this.url === 'auxiliaryreceiptreportnormal'
  //   ) {
  //     this.collectionchallanreportForm.get('auxi_inap')?.setValue('AUXI');
  //     // set receipt type
  //     if (this.url === 'auxiliaryreceiptreportfirst') {
  //       this.collectionchallanreportForm.get('receiptType')?.setValue('F');
  //       this.collectionchallanreportForm.get('name')?.setValue('RptFirstInfraReceipt.rpt');
  //       this.collectionchallanreportForm.get('userLable')?.setValue('FIRST AUXILIARY');
  //     } else {
  //       this.collectionchallanreportForm.get('receiptType')?.setValue('N');
  //       this.collectionchallanreportForm
  //         .get('name')
  //         ?.setValue('RptNormalInfraReceipt.rpt');
  //       this.collectionchallanreportForm.get('userLable')?.setValue('NORMAL AUXILIARY');
  //     }
  //   } else {
  //     this.collectionchallanreportForm.get('auxi_inap')?.setValue('INAP');
  //     // set receipt type
  //     if (this.url === 'infrareceiptreprintfirst') {
  //       this.collectionchallanreportForm.get('receiptType')?.setValue('F');
  //       this.collectionchallanreportForm.get('userLable')?.setValue('FIRST INFRA');
  //       this.collectionchallanreportForm.get('name')?.setValue('RptFirstInfraReceipt.rpt');
  //     } else {
  //       this.collectionchallanreportForm
  //         .get('name')
  //         ?.setValue('RptNormalInfraReceipt.rpt');
  //       this.collectionchallanreportForm.get('receiptType')?.setValue('N');
  //       this.collectionchallanreportForm.get('userLable')?.setValue('NORMAL INFRA');
  //     }
  //   }

  //   reportType === 'voucher'
  //     ? this.collectionchallanreportForm.get('name')?.setValue('Rpt_infra_voucher.rpt')
  //     : '';
  // }

  //download report
  downloadReport(isPrint: boolean, isGstFlag: boolean) {
    if (this.collectionchallanreportForm.valid) {
      this.config.isLoading = true;
      if (
        this._service.printExcelChk(
          isPrint,
          this.collectionchallanreportForm.get('exportType')?.value
        )
      ) {
        const strQuery=this.funcMakewhereClause('ADVG','A','F103')

        console.log("stry query",strQuery);
        
        let payload: any = {
          name: isGstFlag
            ? this.collectionchallanreportForm
                .get('name')
                ?.value.replace('.rpt', 'FrmCollectTdsChallan_Report.rpt')
            : this.collectionchallanreportForm.get('name')?.value,
          exportType: this.collectionchallanreportForm.get('exportType')?.value,
          isPrint: false,
          seqId: 1,
          reportParameters: {
            strWherClause:this.funcMakewhereClause('ADVG','A','F103'),
            HeaderText1: this.collectionchallanreportForm.get('HeaderText1')?.value,
            HeaderText2: this.collectionchallanreportForm.get('HeaderText2')?.value,
            HeaderText3: this.collectionchallanreportForm.get('HeaderText3')?.value,

            bldgcode: this.commonService.convertArryaToString(
              this.collectionchallanreportForm.get('bldgcode')?.value
            ),

            flatnum: this.collectionchallanreportForm.get('flatNum')?.value
              ? this.commonService.convertArryaToString(
                  this.collectionchallanreportForm.get('flatNum')?.value
                )
              : 'ALL',
          
          },
        };
        const wingValue = this.collectionchallanreportForm.get('wing')?.value;
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
        .convertArryaToString(this.collectionchallanreportForm.get('recnum')?.value)
        .trimEnd(),
    };

    if (this.collectionchallanreportForm.valid) {
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
      this.collectionchallanreportForm.get('exportType')?.value,
      filename
    );
  }}
