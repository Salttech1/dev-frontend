import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import * as moment from 'moment';
import { ServiceService } from 'src/app/services/service.service';
import * as commonConstant from '../../../../../../constants/commonconstant';
import { CommonReportsService } from 'src/app/services/reports.service';
import { finalize, switchMap, take } from 'rxjs';
import { Router } from '@angular/router';
import { CertificateService } from 'src/app/services/enggsys/certificate.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-list-of-interim-certificate-report',
  templateUrl: './list-of-interim-certificate-report.component.html',
  styleUrls: ['./list-of-interim-certificate-report.component.css'],
})
export class ListOfInterimCertificateReportComponent implements OnInit {
  loaderToggle: boolean = false;
  qf!: FormGroup;
  sessId!: string | null;
  formName!: string;
  bldgSQ = `(bmap_closedate >= to_date('${moment().format(
    'DD.MM.yyyy'
  )}','dd.mm.yyyy') or bmap_closedate is null)`;
  conttorSQ = `par_partytype = 'E'`;

  constructor(
    private fb: FormBuilder,
    private toastr: ToasterapiService,
    public _service: ServiceService,
    public commonReport: CommonReportsService,
    public commonService: CommonService,
    public _enggService: CertificateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.qf = this.fb.group({
      bldgCode: [''],
      recId: [''],
      workCode: [''],
      contractor: [''],
      range: this.fb.group({
        periodFrom: [null],
        periodTo: [null],
      }),
    });
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
  }

  getReport(print: Boolean) {
    this.sessId = null;
    if (this.qf.valid) {
      {
        let sessionPayload: any = {
          bldgCode:
            this.qf.get('bldgCode')?.value.length &&
            this.qf.get('bldgCode')?.value[0] != 'ALL'
              ? this.qf.get('bldgCode')?.value.join(`','`)
              : ``,
          workCode:
            this.qf.get('workCode')?.value.length &&
            this.qf.get('workCode')?.value[0] != 'ALL'
              ? this.qf.get('workCode')?.value.join(`','`)
              : ``,
          contractor:
            this.qf.get('contractor')?.value.length &&
            this.qf.get('contractor')?.value[0] != 'ALL'
              ? this.qf.get('contractor')?.value.join(`','`)
              : ``,
          // contractor: this.qf.get('contractor')?.value[0],
        };

        console.log('sessionPayload', sessionPayload);
        this.loaderToggle = true;
        this._enggService
          .getListOfInterimCertificateTempTableData(sessionPayload)
          .pipe(
            take(1),
            switchMap((res: any) => {
              console.log('sess', res);

              // get report name based, BldgMatwise does not have Detail report hence if condition
              let payload: any = {
                name: 'LstOfIntCertf.rpt',
                isPrint: false,
                seqId: 1,
                conditionId: 1,
                reportParameters: {
                  sesId: res?.data,
                  formname: this.formName,
                },
              };
              this.sessId = res.data; // This is used to delete processed rows from temp table

              console.log('PAYLOAD', payload);

              return this.commonReport.getTtxParameterizedReportWithCondition(
                payload
              );
            }),
            finalize(() => (this.loaderToggle = false))
          )
          .subscribe({
            next: (res: any) => {
              this.commonPdfReport(print, res);
              // delete session id API CALL
              this.delSessId();
            },
          });
      }
    } else {
      this.toastr.showError('Please fill the form properly');
      this.qf.markAllAsTouched();
    }
  }

  commonPdfReport(print: Boolean, res: any) {
    let filename = this.commonReport.getReportName();
    this._service.exportReport(
      print,
      res,
      this.qf.get('exportType')?.value,
      filename
    );
  }

  delSessId() {
    if (this.sessId) {
      this.commonService
        .deleteSessionId('temp_lp_lstofinterimpay', 'sesid', this.sessId)
        .pipe(
          take(1),
          finalize(() => {
            this.loaderToggle = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            if (res.status) {
            } else {
              this.toastr.showError(res.message);
            }
          },
        });
    }
  }

  resetForm() {
    this.qf.reset({
      exportType: 'PDF',
      report: 'Detail',
      custType: 'ALL',
      name: 'RptOutgoingDefaulterList.rpt',
      osAmtYN: '2',
      showsplfields: 'Y',
      bldgCode: [],
      wing: [],
      ownerId: [],
      osAmt: 0,
      cutOffDate: new Date(),
    });
    setTimeout(function () {
      document.getElementById('bldgCode')?.focus();
    }, 100);
  }
}
