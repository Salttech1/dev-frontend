import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { api_url } from 'src/constants/constant';
import { PDFDocument } from 'pdf-lib';


@Component({
  selector: 'app-bill-generation',
  templateUrl: './bill-generation.component.html',
  styleUrls: ['./bill-generation.component.css'],
})
export class BillGenerationComponent implements OnInit {
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'view',
    'print',
    'process',
    'export',
    'back',
    'exit',
  ]);
  tableHeadersList: Array<any> = [
    { name: 'Bill Number', key: 'billNumber' },
    { name: 'Owner ID', key: 'ownerId' },
    { name: 'Month', key: 'month' },
    { name: 'Bill Date', key: 'billDate' },
    { name: 'Bill From Date', key: 'billFromDate' },
    { name: 'Bill To Date', key: 'billToDate' },
    { name: 'Bill Amount', key: 'billAmount' },
    { name: 'Bill Arrears', key: 'billArrears' },
    { name: 'Interest', key: 'interest' },
    { name: 'Intrest Arrears', key: 'interestArrears' },
    { name: 'Admin', key: 'admin' },
    { name: 'CGST', key: 'cgst' },
    { name: 'SGST', key: 'sgst' },
    { name: 'IGST', key: 'igst' },
    { name: 'CGST%', key: 'cgstPerc' },
    { name: 'SGST%', key: 'sgstPerc' },
    { name: 'IGST%', key: 'igstPerc' },
    { name: 'INVOICE NO', key: 'invoiceNumber' },
    { name: 'IRN NO', key: 'd' },
  ];
  tableData: any = {};
  pdfBlobList: any = []

  billForm = this.fb.group({
    ownerIdFrom: ['', Validators.required],
    ownerIdTo: [''],
    chargeCode: [this.getChargeCode()],
    billDate: [new Date(), Validators.required],
    billType: [this.getBillType()],
  });

  exportTypes = [
    { name: 'PDF', id: 'PDF' },
    { name: 'Excel (Report - Data Format)', id: 'EXCEL_REPORT_DATA_FORMAT' },
    { name: ' Excel (Template Format)', id: 'EXCEL_TEMPLATE_FORMAT' },
  ];

  config: any = {
    isLoading: false,
    pdfView: false,
    page: 1,
    totalPages: 0,
    src: '',
    storedViewBlob: '',
    exportType: 'PDF'

  };

  pdfView: boolean = false;


  constructor(
    private commonService: CommonService,
    private router: Router,
    private http: HttpRequestService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _commonReport: CommonReportsService,
    public _service: ServiceService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.buttonsList = this.commonService.getButtonsByIds([
      'view',
      'print',
      'process',
      'export',
      'back',
      'exit',
    ]);

    this.commonService.enableDisableButtonsByIds(
      ['print', 'export', 'view'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['process', 'exit', 'back'],
      this.buttonsList,
      false
    );
  }

  // action buttons method listen
  buttonAction(event: string) {
    if (event == 'view') {
      // this.addSessionId();
      this.viewBill();
    } else if (event == 'exit') {
      this.router.navigateByUrl('/dashboard');
    } else if (event == 'process') {
      this.getBillInfo();

    } else if (event == 'back') {
      this.resetData();
    } else if (event == 'print') {
      // this.commonPdfReport(true, this.config.storedViewBlob);
      this.addSessionId()

    } else if (event == 'export') {
      this.commonPdfReport(false, this.config.storedViewBlob);
    }
  }

  getChargeCode() {
    const url =
      this.router.url.split('/')[this.router.url.split('/').length - 1];
    if (
      url === 'auxibillgenerationgstfirst' ||
      url === 'auxibillgenerationgstnormal'
    ) {
      return 'AUXI';
    } else {
      return 'INAP';
    }
  }
  getBillType() {
    const url = this.router.url.includes('first');
    if (url) {
      return 'F';
    } else {
      return 'N';
    }
  }

  getBillInfo() {


    if (this.billForm.valid) {
      let payload = {
        ownerIdFrom: this.commonService
          .convertArryaToString(this.billForm.value.ownerIdFrom)
          .trimEnd(),
        ownerIdTo: this.billForm.value.ownerIdTo?.trimEnd(),
        chargeCode: this.billForm.value.chargeCode,
        // billRecDate: this.billForm.value.billDate,
        billDate: moment(this.billForm.value.billDate).format('DD/MM/YYYY'),
        billType: this.billForm.value.billType,
      };

      this.config.isLoading = true;
      this.http
        .request('post', api_url.getBillGenration, payload, null)
        .subscribe(
          {
            next: (res: any) => {
              this.config.isLoading = false
              if (res.result == "failed") {
                this.toastr.error(res.message)
              } else {

                this.tableData = res;
                console.log("table data", this.tableData);

                this.commonService.enableDisableButtonsByIds(
                  ['process'],
                  this.buttonsList,
                  true
                );
                this.commonService.enableDisableButtonsByIds(
                  ['view'],
                  this.buttonsList,
                  false
                );

              }



            },
            error: (error: any) => {
              this.config.isLoading = false;
            },

          });
    } else {
      this.toastr.error('Please complete all the required fields.');
    }
  }

  // on click view
  viewBill(isDownload?: boolean) {
    this.config.isLoading = true
    let parms = {
      chargeCode: this.router.url.includes('auxi') ? 'AUXI' : 'INAP',
      billType: this.router.url.includes('normal') ? 'N' : 'F',
      sessionId: this.tableData.sessionId,
    }
    this.http
      .request('post', api_url.viewBillGeneration, this.tableData, parms)
      .subscribe(
        {
          next: (res: any) => {
            this.downloadReport(true)
            this.config.isLoading = false;

          },
          error: (error: any) => {
            this.config.isLoading = false;
          },
        })
  }


  addSessionId() {
    this.config.isLoading = true
    let parms = {
      chargeCode: this.router.url.includes('auxi') ? 'AUXI' : 'INAP',
      billType: this.router.url.includes('normal') ? 'N' : 'F',
      sessionId: this.tableData.sessionId,
    }
    this.http
      .request('post', api_url.addBillGeneration, this.tableData, parms)
      .subscribe(
        {
          next: (res: any) => {

            if (res.result == "failed") {
              this.toastr.error(res.message)
            } else {
              
              // this.commonPdfReport(true, this.config.storedViewBlob);
              this.downloadReport(true, true)
            }

            this.config.isLoading = false;
          },
          error: (error: any) => {
            this.config.isLoading = false;
          },
        })
  }
  deleteSessionId() {
    if (this.tableData.sessionId) {


      let parms = {
        billNum: this.tableData.billNumber,
        sessionId: this.tableData.sessionId,
      }
      this.http
        .request('delete', api_url.deleteBillGeneration, null, parms)
        .subscribe((res: any) => {

        })

    }
  }

  downloadReport(isPrint: boolean, isPrintClick?: boolean) {
    this.config.isLoading = true;
    if (this._service.printExcelChk(isPrint, 'PDF')) {

      const ownerName = this.commonService
        .convertArryaToString(this.billForm.value.ownerIdFrom)
        .trimEnd()

      var rptName = ''
      var HeaderText1 = ''
      var HeaderText2 = ''
      var HeaderText3 = ''

      const flatOwnerList = ["ORHBBF0000B", "ORHCCF0000C", "ORHDDF0000D", "ORHEEF0000E", "ORHFFF0000F", "ORHGGF0000G", "ORHHHF0000H", "ORCA F0000", "ORC3 F0000", "ORC4 F0000", "ORC5 F0000"]
      const bldgCode = ["OPCA", "OPCB", "OPLL", "OPCK", "OM21", "OM04", "OPSC", "OPSD", "OPSE", "ORC3", "OMCL", "OPCJ", "OPCI", "OPCH", "OPCG", "OPCF", "OPCC", "OPCD", "OPS1", "OPSB"]



      if (this.router.url.includes('first')) {
        rptName = "rpt_FirstInfraQtrBill-GST.rpt"
      } else {
        flatOwnerList.forEach(item => {
          if (ownerName.includes(item)) {
            rptName = "rpt_OPCAOPCBInfraQtrBill-GST.rpt"
          }
        });
        bldgCode?.forEach(item => {
          if (this.tableData?.buildingCode.includes(item)) {
            rptName = "rpt_OPCAOPCBInfraQtrBill-GST.rpt"
          }
        });
        if (rptName == '') {
          // rptName = "rpt_InfraQtrBill.rpt"
          rptName = "rpt_OPCAOPCBInfraQtrBill-GST.rpt"
          HeaderText3 = 'none'
        }
      }





      if (this.tableData.buildingCode == 'OMCL') {
        HeaderText1 = this.tableData.companyName + " Interface Club Maint. A/c."
      } else {
        HeaderText1 = this.tableData.companyName
        HeaderText2 = this.tableData.companyName
      }



      let payload: any = {
        name: rptName,
        isPrint: false,
        seqId: 1,
        reportParameters: {
          HeaderText1: HeaderText1,
          HeaderText2: HeaderText2,
          HeaderText3: HeaderText3,
          SessID: this.tableData.sessionId,
          // SessID: "502269",
        },
      };


      console.log("rpt", rptName);



      console.log("final payload", payload);

      if (isPrintClick) {
        this.MultiPrintReport(payload, isPrint, isPrintClick)
      } else {
        if (HeaderText3 == 'none') {
          delete payload.reportParameters.HeaderText3
          this.MultiPrintReport(payload, isPrint)
          // this.PrintReport(payload, isPrint)
        } else {
          this.MultiPrintReport(payload, isPrint)
        }
      }




    }


  }



  MultiPrintReport(payload: any, isPrint: boolean, isPrintClick?: boolean) {
    this.pdfBlobList = []
    this.config.isLoading = true
    payload.reportParameters.HeaderText3 = "ORIGINAL FOR RECIPIENT"

    this._commonReport.getParameterizedReport(payload).subscribe({
      next: (res) => {
        if (res) {
          this.pdfBlobList.push(res)

          // this.commonPdfReport(true,res)

          this.config.isLoading = false;
          payload.reportParameters.HeaderText3 = "DUPLICATE FOR SUPPLIER"

          if (payload.name == "rpt_OPCAOPCBInfraQtrBill-GST.rpt") {

            const url = window.URL.createObjectURL(res);

            this.config.storedViewBlob = res

            this.config.src = url;

            this.config.pdfView = true
            this.config.isLoading = false

            this.commonService.enableDisableButtonsByIds(
              ['view', 'process'],
              this.buttonsList,
              true
            );
            this.commonService.enableDisableButtonsByIds(
              ['print', 'export'],
              this.buttonsList,
              false
            )

            if (isPrintClick) {
              this.commonPdfReport(true, this.config.storedViewBlob);
            }
          } else {
            this._commonReport.getParameterizedReport(payload).subscribe({
              next: (res) => {
                if (res) {
                  this.pdfBlobList.push(res)

                  console.log("pdf blobg list", this.pdfBlobList);



                  this._service.mergeBlobsToPdf(this.pdfBlobList).then((mergedPdfBlob: Blob) => {

                    this.pdfView = true;

                    let pdfFile = new Blob([mergedPdfBlob], { type: 'application/pdf' });

                    const url = window.URL.createObjectURL(pdfFile);

                    this.config.storedViewBlob = pdfFile

                    this.config.src = url;

                    this.config.pdfView = true
                    this.config.isLoading = false

                    this.commonService.enableDisableButtonsByIds(
                      ['view', 'process'],
                      this.buttonsList,
                      true
                    );
                    this.commonService.enableDisableButtonsByIds(
                      ['print', 'export'],
                      this.buttonsList,
                      false
                    );

                    if (isPrintClick) {
                      this.commonPdfReport(true, this.config.storedViewBlob);
                    }



                  });
                  this.config.isLoading = false;
                }
              },
              error: (error) => {
                this.config.isLoading = false;
              },
            });

          }
        }
      },
      error: (error) => {
        this.config.isLoading = false;
      },
    });
  }


  // print report from api
  PrintReport(payload: any, isPrint: boolean) {
    this._commonReport.getParameterizedReport(payload).subscribe({
      next: (res) => {
        if (res) {
          // this.deleteSessionId();
          this.commonPdfReport(isPrint, res);
          this.config.isLoading = false;
        }
      },
      error: (error) => {
        this.config.isLoading = false;
      },
    });
  }

  // download the file
  commonPdfReport(print: Boolean, res: any) {
    let filename = this._commonReport.getReportName();
    this.config.isLoading = false;
    this.deleteSessionId()

    this._service.exportReport(print, res, this.config.exportType, filename);

  }



  nextPage() {
    this.config.page++;
  }

  prevPage() {
    this.config.page--;
  }

  afterLoadComplete(pdfData: any) {
    this.config.totalPages = pdfData.numPages;
    this.config.isLoading = false;
  }


  resetData() {
    this.billForm.reset();

    this.billForm.patchValue({
      chargeCode: this.getChargeCode(),
      billDate: new Date(),
      billType: this.getBillType(),
    })

    this.init();

    this.tableData = {}

    this.config.pdfView = false
  }

  onLeaveFlatOwnerFrom(val: string) {

    let payload = {
      ownerIdFrom: this.commonService
        .convertArryaToString(this.billForm.value.ownerIdFrom)
        .trimEnd(),
      ownerIdTo: this.billForm.value.ownerIdTo?.trimEnd(),
      chargeCode: this.billForm.value.chargeCode,
      billType: this.billForm.value.billType,
    };

    this.http.request('post', api_url.fetchBillGenerationNextBillDate, payload).subscribe(
      {
        next: (res: any) => {

          this.billForm.controls.ownerIdTo.setValue(val);
          if (res.result == "success") {
            this.billForm.get('billDate')?.setValue(new Date(res.nextBillDate))
            // this.billForm.get('billDate')?.setValue(new Date('01/07/2023'))
          } else {

            this.billForm.get('billDate')?.setValue(new Date())
          }


        },

      })

  }
}
