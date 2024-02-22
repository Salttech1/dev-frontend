import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { CollectionsService } from 'src/app/services/sales/collections.service';
import { ServiceService } from 'src/app/services/service.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { GroupcomString } from 'src/app/shared/interface/engsys';

@Component({
  selector: 'app-groupwisecompositereport',
  templateUrl: './groupwisecompositereport.component.html',
  styleUrls: ['./groupwisecompositereport.component.css']
})
export class GroupwisecompositereportComponent implements OnInit {
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

  exportTypes = [
    { name: 'PDF', id: 'PDF' },
    { name: 'Excel (Report - Data Format)', id: 'EXCEL_REPORT_DATA_FORMAT' },
    { name: ' Excel (Template Format)', id: 'EXCEL_TEMPLATE_FORMAT' },
  ];

  queryString: GroupcomString = {
    bldgCode: '',
  };

  constructor( private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    public _service: ServiceService,
    private route: ActivatedRoute,
    private http: HttpRequestService,
    private _commonReport: CommonReportsService,
    private Collectionchallanervice: CollectionsService) { }

    url: string = '';
  groupwiseCompositeReportForm: FormGroup = this.formBuilder.group({
    exportType: ['PDF'],
    name: [''],
    bldgCode: [' ', Validators.required],
  });

  ngOnInit(): void {}

  getDataFromParms() {
    var parmsData: any = localStorage.getItem('reportPayload');
    if (parmsData) {
      parmsData = JSON.parse(parmsData);
      this.groupwiseCompositeReportForm.patchValue({
        bldgCode: parmsData.bldgCode,
      });
      localStorage.removeItem('reportPayload');
    }
  }

  buttonAction(event: string) {
    if (event === 'download') {
      this.downloadReport(false);
    } else if (event === 'print') {
      this.downloadReport(true);
    } else if (event === 'exit') {
      this.router.navigateByUrl('/dashboard');
    } else if (event === 'reset') {
      this.groupwiseCompositeReportForm.patchValue({
        exportType: 'PDF',
      });
    }
  }
  downloadReport(isPrint: boolean) {
    if (this.groupwiseCompositeReportForm.valid) {
      const bldgCode: string = this.commonService.convertArryaToString(
        this.groupwiseCompositeReportForm.getRawValue().bldgCode
      );
      let payload: any = {
        name:'Engg_GroupwiseCompositeReport.rpt',
        exportType: 'PDF',
        isPrint: false,
        seqId: 1,
        reportParameters: {
          // ownerid: this.commonService.convertArryaToString(
          //   this.groupwiseCompositeReportForm.get('ownerid')?.value
          // ),
          formname: '',

          StrPrmBldgCode:
            this.commonService.convertArryaToString(
              this.groupwiseCompositeReportForm.get('bldgCode')?.value
            )
        },
      };
      this.PrintReport(payload, isPrint);
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
      this.groupwiseCompositeReportForm.get('exportType')?.value,
      filename
    );
  }

}
