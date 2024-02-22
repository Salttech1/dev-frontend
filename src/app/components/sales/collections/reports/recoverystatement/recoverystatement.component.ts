import { Component, OnInit } from '@angular/core';
import { buttonsList } from 'src/app/shared/interface/common';
import { CommonService } from 'src/app/services/common.service';
import { auxiQueryString } from 'src/app/shared/interface/sales';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { DynaPopConstant } from 'src/constants/dyna-pop-constant';
import { CollectionsService } from 'src/app/services/sales/collections.service';
import { api_url } from 'src/constants/constant';

@Component({
  selector: 'app-recoverystatement',
  templateUrl: './recoverystatement.component.html',
  styleUrls: ['./recoverystatement.component.css']
})
export class RecoverystatementComponent implements OnInit {

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
    { name: 'Parking', id: 'Parking' },
    { name: 'Flats', id: 'Flats' },
      { name: 'All', id: 'All' },
  ];
  exportTypes = [
    { name: 'PDF', id: 'PDF' },
    { name: 'Excel (Report - Data Format)', id: 'EXCEL_REPORT_DATA_FORMAT' },
    { name: ' Excel (Template Format)', id: 'EXCEL_TEMPLATE_FORMAT' },
  ];
   // dynomo query string for relational data
   queryString: auxiQueryString = {
    bldCode: '',
    wingCode: '',
    flatNo: '',
    finalString: '',
    getFlatNumber: '',
    getWing: '',
    getReceiptNum: '',
  };

  url: string = '';
  recoveryStatementForm: FormGroup = this.formBuilder.group({
    exportType: ['PDF'],
    name: [''],
    printType: [this.receiptTypes[1]['id'], Validators.required],
    bldgcode: ['', Validators.required],
    blgdName: [{ value: '', disabled: true }],
    wing: [''],
    flatNum: ['', Validators.required],
    ownerName: [''],
    receiptType: [''],
    auxi_inap: [''],
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
    private http: HttpRequestService,
    private _commonReport: CommonReportsService,
    private collectionsService:CollectionsService
  ) { }

  ngOnInit(): void {
    this.getDataFromParms();
  }

  //get record for defaul
  getDataFromParms() {
    var parmsData: any = localStorage.getItem('reportPayload');
    if (parmsData) {
      parmsData = JSON.parse(parmsData);
      this.recoveryStatementForm.patchValue({
        bldgcode: parmsData.bldgcode,
        blgdName: parmsData.blgdName,
        wing: parmsData.wing,
        flatNum: parmsData.flatNum,
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
      this.recoveryStatementForm.reset();
      this.queryString = {
        bldCode: '',
        wingCode: '',
        flatNo: '',
        finalString: '',
        getFlatNumber: '',
        getWing: '',
        getReceiptNum: '',
      };
      this.recoveryStatementForm.patchValue({
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
        this.collectionsService.getChargeCode();
    }
  }


  getGstFlag(isPrint: boolean) {
    let obj = {
      recNum: this.commonService
        .convertArryaToString(this.recoveryStatementForm.get('recnum')?.value)
        .trimEnd(),
    };
  }
}
