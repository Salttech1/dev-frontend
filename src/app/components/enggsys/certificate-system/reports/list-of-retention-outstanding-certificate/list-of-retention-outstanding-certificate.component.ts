import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import * as commonConstant from '../../../../../../constants/commonconstant';
import { CommonService } from 'src/app/services/common.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-of-retention-outstanding-certificate',
  templateUrl: './list-of-retention-outstanding-certificate.component.html',
  styleUrls: ['./list-of-retention-outstanding-certificate.component.css'],
})
export class ListOfRetentionOutstandingCertificateComponent implements OnInit {
  loaderToggle: boolean = false;
  formName!: string;
  reportType!: string;
  bldgSQ = `(bmap_closedate >= to_date('${moment().format(
    'DD.MM.yyyy'
  )}','dd.mm.yyyy') or bmap_closedate is null)`;
  conttorSQ = `par_partytype = 'E'`;
  url!: string;
  exclBldgCodes!: string;
  qf: FormGroup = new FormGroup({
    bldgCode: new FormControl(''),
    misProject: new FormControl(''),
    coy: new FormControl(''),
    city: new FormControl(''),
    workCode: new FormControl(''),
    partyCode: new FormControl(''),
    exclBldgCode: new FormControl(''),
    chkBldgwise: new FormControl<boolean>(false),
  });

  constructor(
    private fb: FormBuilder,
    public _service: ServiceService,
    public commonReport: CommonReportsService,
    public commonService: CommonService,
    private toastr: ToasterapiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // To initialise report type (Whether user has clicked on Advance O/s or Retention O/s Option in menu)
    this.url =
      this.router.url.split('/')[this.router.url.split('/').length - 1];
    this.url == 'listofadvanceoutstanding'
      ? (this.reportType = 'A')
      : (this.reportType = 'R');
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
  }

  ngDoCheck() {
    if (this.reportType == 'A') {
      //Fetch list of Buildings to exclude from report
      this.fetchExclBldgCodesFromEntity('ENGG', 'EXCBL');
    }
  }

  getReport(print: Boolean) {
    if (this.qf.valid) {
      this.loaderToggle = true;
      let payload: any = {
        isPrint: false,
        seqId: 1,
        conditionId: 1,
        reportParameters: {
          bldgCode:
            this.qf.get('bldgCode')?.value.length &&
            this.qf.get('bldgCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('bldgCode')?.value.join(`','`)}'`
              : `'ALL'`,
          misProject:
            this.qf.get('misProject')?.value.length &&
            this.qf.get('misProject')?.value[0] != 'ALL'
              ? `'${this.qf.get('misProject')?.value.join(`','`)}'`
              : `'ALL'`,
          workCode:
            this.qf.get('workCode')?.value.length &&
            this.qf.get('workCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('workCode')?.value.join(`','`)}'`
              : `'ALL'`,
          coy:
            this.qf.get('coy')?.value.length &&
            this.qf.get('coy')?.value[0] != 'ALL'
              ? `'${this.qf.get('coy')?.value.join(`','`)}'`
              : `'ALL'`,
          city:
            this.qf.get('city')?.value instanceof Object &&
            this.qf.get('city')?.value[0] != 'ALL'
              ? `'${this.qf.get('city')?.value?.[0]?.[0]?.trim()}%'`
              : `'%'`,
          partyCode:
            this.qf.get('partyCode')?.value.length &&
            this.qf.get('partyCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('partyCode')?.value?.join(`','`).trim()}'`
              : `'ALL'`,
          formname: this.formName,
        },
      };
      if (this.reportType == 'A') {
        payload.name = this.qf.get('chkBldgwise')?.value
          ? 'Lp_AdvanceOutStd_List - Bldgwise.rpt'
          : 'Lp_AdvanceOutStd_List.rpt';
      } else {
        payload.name = 'Lp_Retention_OutStd_Cert.rpt';
      }
      console.log(payload, 'payload');
      this.commonReport
        .getTtxParameterizedReportWithCondition(payload)
        .pipe(
          take(1),
          finalize(() => {
            this.loaderToggle = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            if (res) {
              let filename = this.commonReport.getReportName();
              this._service.exportReport(print, res, 'PDF', filename);
            }
          },
        });
    }
  }

  fetchExclBldgCodesFromEntity(entClass: string, entId: string) {
    if (this.reportType == 'A') {
      this.commonService
        .fetchChar1FromEntity(entClass, entId, " AND ent_char1 <> '00000'")
        .subscribe((res: any) => {
          if (res.status) {
            this.qf.controls['exclBldgCode'].patchValue(res.data);
            this.qf.controls['exclBldgCode'].setValue(res.data);
            console.log(
              'exclBldgCode = ',
              this.qf.controls['exclBldgCode'].value
            );
            console.log('exclBldgCodes = ', res.data);
          } else {
            this.toastr.showError(res.message);
          }
        });
    }
  }
}
