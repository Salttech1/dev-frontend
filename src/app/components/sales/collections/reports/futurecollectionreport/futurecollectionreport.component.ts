import { Component, OnInit, Renderer2 } from '@angular/core';
import { buttonsList } from 'src/app/shared/interface/common';
import { CommonService } from 'src/app/services/common.service';
import { auxiQueryString } from 'src/app/shared/interface/sales';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { DynaPopConstant } from 'src/constants/dyna-pop-constant';
import { CollectionsService } from 'src/app/services/sales/collections.service';
import { api_url } from 'src/constants/constant';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { take } from 'rxjs';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-futurecollectionreport',
  templateUrl: './futurecollectionreport.component.html',
  styleUrls: ['./futurecollectionreport.component.css']
})
export class FuturecollectionreportComponent implements OnInit {
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
  receiptTypes = [
    { name: 'LoanCompanies', id: 'LoanCompanies' },
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
  futureCollectionForm: FormGroup = this.formBuilder.group({
    exportType: ['PDF'],
    name: [''],
    printType: [this.receiptTypes[0]['id'], Validators.required],
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
    frmDate :[''],
    toDate :[''],
});





  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    public _service: ServiceService,
    private http: HttpRequestService,
    private _commonReport: CommonReportsService,
    private collectionsService:CollectionsService,
    private commonReportService: CommonReportsService,
    private toastr: ToastrService,
    private rendered: Renderer2,
  ) { }

  ngOnInit(): void {
    setTimeout(function() {
      document.getElementById("fromDateField")?.focus();
   }, 100);
    this._service.pageData.subscribe({
      next: (val) => {
        this.futureCollectionForm.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
            
          },
        });
      },
    });
    this.getDataFromParms();
  }

  checkBoxToggle(event: any) {
    if (event.key === "Enter") {
      event.preventDefault()
      event.target.checked ? event.target.checked = false : event.target.checked = true
    }
  }

  //get record for defaul
  getDataFromParms() {
    var parmsData: any = localStorage.getItem('reportPayload');
    if (parmsData) {
      parmsData = JSON.parse(parmsData);
      this.futureCollectionForm.patchValue({
        bldgcode: parmsData.bldgcode,
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
      this.toastr.error("Please Enter Valid Date")
      this.rendered.selectRootElement(`#${id}`)?.focus();
    }
    else{
        let startDate = moment(this.futureCollectionForm.get("reportParameters.Frmdate")?.value).format('YYYY-MM-DD')
        let endDate = moment(this.futureCollectionForm.get("reportParameters.ToDate")?.value).format('YYYY-MM-DD')
        console.log(endDate)
        if (moment(startDate).isAfter(endDate)) {
          this.toastr.error("To Date Should not be Less than From Date")
          this.futureCollectionForm.get("reportParameters.ToDate")?.reset()
          this.rendered.selectRootElement(`#${id}`)?.focus()
        }
    } 
  }

  setReportValues() {
    // this.fetchCompanyCloseDate();
    this.futureCollectionForm.patchValue({
    });
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
      this.futureCollectionForm.reset();
      this.queryString = {
        bldCode: '',
        wingCode: '',
        flatNo: '',
        finalString: '',
        getFlatNumber: '',
        getWing: '',
        getReceiptNum: '',
      };
      this.futureCollectionForm.patchValue({
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

  getReport(print: boolean){
    if (this.futureCollectionForm.valid){
    this.loaderToggle = true;
    let dispose = this.futureCollectionForm.get('isdisposed')?.value;
    console.log(dispose)
    dispose ? this.futureCollectionForm.patchValue({conditionId : 2}) : this.futureCollectionForm.patchValue({conditionId : 1})
    // debugger
    this.setReportValues()
    this.commonReportService.getParameterizedReport(this.futureCollectionForm.value).pipe(take(1)).subscribe({
      next: (res: any) => {
        this.loaderToggle = false
        let pdfFile = new Blob([res], { type: "application/pdf" });
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
          this.loaderToggle = false
         },
        complete: () => {
          this.loaderToggle = false
        }
    })
  } else {
    this.toastr.error('Please fill the input properly')
  }

  }


  getGstFlag(isPrint: boolean) {
    let obj = {
      recNum: this.commonService
        .convertArryaToString(this.futureCollectionForm.get('recnum')?.value)
        .trimEnd(),
    };
  }
}