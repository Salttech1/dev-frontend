import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as constant from '../../../../../../constants/constant';
import * as moment from 'moment';
import { ModalService } from 'src/app/services/modalservice.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MaterialPaymentsService } from 'src/app/services/purch/material-payments.service';
import { ServiceService } from 'src/app/services/service.service';
import { finalize, merge, of, switchMap, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export interface reportList {
  print: Boolean;
  name: String;
  blob: Blob;
  type: String;
}

@Component({
  selector: 'app-lccertificateprinting',
  templateUrl: './lccertificateprinting.component.html',
  styleUrls: ['./lccertificateprinting.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class LccertificateprintingComponent implements OnInit {
  matPayForm: FormGroup = new FormGroup(
    {
      reportParameters: new FormGroup({
        authTo: new FormControl<string[] | string>(''),
        authFrom: new FormControl<string[] | string>('', Validators.required),
        unprintAuth: new FormControl(true),
        authFromDate: new FormControl(),
        authToDate: new FormControl(),
        range: new FormGroup(
          {
            start: new FormControl<Date | null>(null),
            end: new FormControl<Date | null>(null),
          },
          Validators.required
        ),
      }),
    },
    {
      validators: formValidation(),
    }
  );

  loaderToggle: boolean = false;
  formName!: string;
  disableFields: boolean = true;
  pdfView: boolean = false;
  page: number = 1;
  totalPages: number = 0;
  src = '';
  btnArr: any = [true, false, false, false, false, true]; // view, download,pntCompleted,print,back,exit
  storedViewBlob: any = null;
  fetchSessIdPayload: any = '';
  authNCon = ``;
  minDate = new Date();
  filesList: reportList[] = [];

  constructor(
    private modalService: ModalService,
    private rendered: Renderer2,
    private router: Router,
    private toastr: ToastrService,
    private _material: MaterialPaymentsService,
    private _service: ServiceService
  ) {
    (window as any).pdfWorkerSrc = 'assets/js/pdf.worker.min.js';
  }

  ngOnInit(): void {
    this.edFields(false);
    this.getAuthNumQuery();
    this.updateAuthTo();
    this.updateauthToDate();
  }

  updateauthToDate() {
    let fromDt = this.matPayForm.get('reportParameters.authFromDate');
    let toDt = this.matPayForm.get('reportParameters.authToDate')?.value;
    this.minDate = moment(toDt).toDate();
    fromDt?.valueChanges.subscribe((val: any) => {
      if (val) {
        this.minDate = moment(val).toDate();
      }
    });
  }

  getAuthNumQuery() {
    const reqControl: any = ['authFromDate', 'authToDate'];
    merge(
      ...reqControl.map(
        (name: any) =>
          this.matPayForm.get(`reportParameters.${name}`)?.valueChanges
      )
    ).subscribe((val: any) => {
      let fromDt = this.matPayForm.get('reportParameters.authFromDate')?.value;
      let toDt = this.matPayForm.get('reportParameters.authToDate')?.value;
      if (fromDt && toDt) {
        this.authNCon = `auth_authdate between '${moment(fromDt).format(
          'DD/MM/YYYY'
        )}' and '${moment(toDt).format('DD/MM/YYYY')}'`;
      }
    });
  }

  updateAuthTo() {
    this.matPayForm
      .get('reportParameters.authFrom')
      ?.valueChanges.subscribe((val: any) => {
        let af = this.matPayForm.get('reportParameters.authFrom')?.value;
        console.log(val);
        if (val)
          [
            val instanceof Object &&
              this.matPayForm.get('reportParameters.authTo')?.setValue(af),
          ];
        else {
          this.matPayForm.get('reportParameters.authTo')?.setValue(null);
        }
      });
  }

  getReport(print: boolean) {
    this._service.exportReport(print, this.storedViewBlob, 'PDF', 'MatPrint');
    if (print) {
      this.btnArr[2] = true;
      this.btnArr[3] = true;
    } else {
      this.btnArr[2] = true;
      this.btnArr[1] = false;
    }
  }

  enableFields(event: any) {
    event.target.checked ? this.edFields(false) : this.edFields(true);
  }

  edFields(enableFlag: any) {
    let fields = ['authTo', 'authFrom', 'authToDate', 'authFromDate'];
    if (enableFlag) {
      fields.forEach((val) => {
        this.matPayForm.get('reportParameters')?.get(val)?.reset(),
          this.matPayForm.get('reportParameters')?.get(val)?.enable();
      });
      setTimeout(() => {
        this.rendered.selectRootElement('#fromDateField')?.focus();
      }, 100);
    } else {
      fields.forEach((val) => {
        this.matPayForm.get('reportParameters')?.get(val)?.reset(),
          this.matPayForm.get('reportParameters')?.get(val)?.disable();
      });
    }
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  validateInvalidFormat(event: any, id: any, message: string) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        message,
        this.rendered.selectRootElement(`#${id}`)?.focus(),
        'error'
      );
    } else {
      let startDate = moment(
        this.matPayForm.get('reportParameters.authFromDate')?.value
      ).format('YYYY-MM-DD');
      let endDate = moment(
        this.matPayForm.get('reportParameters.authToDate')?.value
      ).format('YYYY-MM-DD');
      if (moment(startDate).isAfter(endDate)) {
        this.toastr.error(
          'Authorisation From date cannot be greater than upto date'
        );
        this.matPayForm.get('reportParameters.authToDate')?.reset();
        this.rendered.selectRootElement(`#${id}`)?.focus();
      }
    }
  }

  fetchSessionIdData(sessPayload: any) {
    this.loaderToggle = true;
    this._material
      .fetchSessId(sessPayload)
      .pipe(
        take(1),
        switchMap((res: any) => {
          if (res.status) {
            this.fetchSessIdPayload = {
              sessionId: res.data.sessionId,
              serList: res.data.authNumList,
            };
            return this._material.getMergedPdf(res.data);
          } else {
            this.toastr.error(res.message);
            this.rendered.selectRootElement('#provisionEntry')?.focus();
            return of();
          }
        }),
        finalize(() => {
          this.loaderToggle = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          this.pdfView = true;
          this.storedViewBlob = null;
          this.storedViewBlob = res;
          let pdfFile = new Blob([res], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(pdfFile);
          this.src = url;
          this.btnArr = [false, true, false, true, true, false]; // view, download,pntCompleted,print,back,exit
        },
      });
  }

  view() {
    let mp = this.matPayForm;
    let pa = this.matPayForm?.get('reportParameters.unprintAuth')?.value;
    let adtf = this.matPayForm?.get('reportParameters.authFromDate')?.value;
    let adtt = this.matPayForm?.get('reportParameters.authToDate')?.value;
    let anof = this.matPayForm?.get('reportParameters.authFrom')?.value;
    let anot = this.matPayForm?.get('reportParameters.authTo')?.value;
    //payload for session
    let sessPayload: any = {
      isUnprintedAuths: pa,
    };
    if (!pa && adtf && adtt) {
      (sessPayload.authDateFrom = moment(adtf).format('DD/MM/YYYY')),
        (sessPayload.authDateTo = moment(adtt).format('DD/MM/YYYY'));
    }
    if (!pa && anof) {
      sessPayload.authNumberFrom = anof instanceof Object && anof?.[0];
      let _anot = anot instanceof Object && anot.length;
      !_anot
        ? (sessPayload.authNumberTo = anof instanceof Object && anof?.[0])
        : (sessPayload.authNumberTo = anot?.[0]);
    }

    if (pa) {
      this.fetchSessionIdData(sessPayload);
    } else {
      if (mp.valid) {
        this.fetchSessionIdData(sessPayload);
      } else {
        mp.markAllAsTouched();
        setTimeout(() => {
          this.rendered.selectRootElement('#authFId')?.focus();
        }, 100);
      }
    }
  }

  back() {
    this.pdfView = false;
    this.page = 1;
    this.totalPages = 0;
    this.btnArr = [true, false, false, false, false, true]; // view, download,pntCompleted,print,back,exit
    this.storedViewBlob = null;
    this.src = '';
    this.authNCon = ``;
    this.matPayForm.get('reportParameters.unprintAuth')?.setValue(true);
    this.edFields(false);

    // delete temp file
    this._material
      .deleteTemp(this.fetchSessIdPayload)
      .pipe(take(1))
      .subscribe(() => {
        this.fetchSessIdPayload = null;
      });
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.loaderToggle = false;
  }

  printCompleted() {
    this.loaderToggle = true;
    this._material
      .printCompleted(this.fetchSessIdPayload)
      .pipe(
        take(1),
        finalize(() => {
          this.loaderToggle = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastr.success(res.message, 'Success', {
              disableTimeOut: true,
              tapToDismiss: false,
              closeButton: true,
            });
            this.back();
          } else {
            this.toastr.error(res.message);
          }
        },
      });
  }
}

export function formValidation() {
  return (g: AbstractControl) => {
    const af = g.get('reportParameters.authFrom')?.value;
    const at = g.get('reportParameters.authTo')?.value;
    if (af && at) {
      let _af = af instanceof Object && af?.[0]?.[0];
      let _at = at instanceof Object && at?.[0]?.[0];
      if (_af > _at) {
        g.get('reportParameters.authTo')?.setErrors({ maxNumber: true });
      }
    }
    return null;
  };
}
