import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import * as moment from 'moment';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { fileConstants } from 'src/constants/fileconstants';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { take } from 'rxjs';
import * as fileSaver from 'file-saver';
import * as constant from '../../../../../../constants/constant';
import { ServiceService } from 'src/app/services/service.service';

export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'YYYYMM',
  },
  display: {
    dateInput: 'YYYYMM',
    monthYearLabel: 'YYYYMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYYMM',
  },
};

@Component({
  selector: 'app-projectedmaturitiesreport',
  templateUrl: './projectedmaturitiesreport.component.html',
  styleUrls: ['./projectedmaturitiesreport.component.css'],
  providers: [
    // the above line required for date format
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class ProjectedmaturitiesreportComponent implements OnInit {
  columnHeader: any;
  tableData: any;
  bringBackColumn!: number;
  loaderToggle = false;
  coy_condition = "coy_fdyn='Y'";
  @ViewChild(F1Component) comp!: F1Component;
  constructor(
    private dynapop: DynapopService,
    private router: Router,
    private rendered: Renderer2,
    private changeDetection: ChangeDetectorRef,
    private _service: ServiceService,
    private commonReportService: CommonReportsService,
    private modalService: ModalService,
    private toastr: ToasterapiService
  ) {}

  projectedMaturitiesReportForm = new FormGroup({
    name: new FormControl(fileConstants.PromiseRejectedMaturitiesReport),
    seqId: new FormControl(1),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      TxtCompanyCd: new FormControl('', Validators.required),
      upToDate: new FormControl(moment(), Validators.required),
      companyName: new FormControl(),
      h1: new FormControl(),
      h2: new FormControl("'List of Deposits Maturing in '"),
      h3: new FormControl(),
      Fromdate: new FormControl(),
      Todate: new FormControl(),
      formname: new FormControl(''),
    }),
  });

  ngOnInit(): void {
    this.getCompanyList();
    //this.onLoadSetCurrentYearMonth()
    this._service.pageData.subscribe({
      next: (val) => {
        this.projectedMaturitiesReportForm.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
  }

  ngAfterViewInit() {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus();
  }

  setFromToDate() {
    let upToDateValue = `${moment(
      this.projectedMaturitiesReportForm.get('reportParameters.upToDate')?.value
    ).format('YYYYMM')}`;
    let monthYear = `${upToDateValue.slice(0, 4)}-${upToDateValue.slice(4)}`;
    this.projectedMaturitiesReportForm.patchValue({
      reportParameters: {
        Fromdate: `01/${upToDateValue.slice(4)}/${upToDateValue.slice(0, 4)}`,
        Todate: `${moment(
          `${monthYear}`,
          'YYYY-MM'
        ).daysInMonth()}/${upToDateValue.slice(4)}/${upToDateValue.slice(
          0,
          4
        )}`,
      },
    });
  }

  setH1() {
    this.projectedMaturitiesReportForm.patchValue({
      reportParameters: {
        h1: `'${
          this.projectedMaturitiesReportForm.get('reportParameters.companyName')
            ?.value
        }'`,
      },
    });
  }

  setH3() {
    let h3String = `${moment(
      this.projectedMaturitiesReportForm.get('reportParameters.upToDate')?.value
    ).format('YYYYMM')}`;
    let getMonthName: any = `${h3String.slice(4)}`;
    this.projectedMaturitiesReportForm.patchValue({
      reportParameters: {
        h3: `'${moment(`${getMonthName}`, 'M').format(
          'MMMM'
        )} ${h3String?.slice(0, 4)}'`,
      },
    });
  }

  ngAfterContentChecked() {
    this.changeDetection.detectChanges();
    console.log(
      moment(
        this.projectedMaturitiesReportForm.get('reportParameters.upToDate')
          ?.value
      ).format('YYYYMM')
    );
    this.resetField();
    this.setFromToDate();
  }

  resetField() {
    if (
      this.projectedMaturitiesReportForm.controls['reportParameters']?.get(
        'TxtCompanyCd'
      )?.value == ''
    ) {
      this.projectedMaturitiesReportForm.patchValue({
        reportParameters: {
          companyName: '',
        },
      });
    }
  }

  getCompanyList() {
    this.dynapop
      .getDynaPopListObj('COMPANY', "coy_fdyn='Y'")
      .subscribe((res: any) => {
        this.columnHeader = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.tableData = res.data;
        this.bringBackColumn = res.data.bringBackColumn;
      });
  }

  updateListControl(val: any, formControl: any) {
    formControl.setValue(val[this.bringBackColumn]);
  }

  getReport(print: boolean) {
    this.setH1();
    this.setH3();
    console.log(this.projectedMaturitiesReportForm?.value);
    if (this.projectedMaturitiesReportForm?.valid) {
      this.projectedMaturitiesReportForm.value.isPrint = false;
      this.loaderToggle = true;
      this.commonReportService
        .getTtxParameterizedReport(this.projectedMaturitiesReportForm?.value)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res?.type == 'application/json') {
              this.toastr.showError('No Records Found');
            } else {
              let pdf = new Blob([res], { type: 'application/pdf' });
              let filename = this.commonReportService.getReportName();
              if (print) {
                const blobUrl = URL.createObjectURL(pdf);
                const oWindow = window.open(blobUrl, '_blank');
                oWindow?.print();
              } else {
                fileSaver.saveAs(pdf, filename);
              }
            }
          },
          error: (err: any) => {
            this.loaderToggle = false;
          },
          complete: () => {
            this.loaderToggle = false;
          },
        });
    } else {
      this.validationField();
      this.projectedMaturitiesReportForm.markAllAsTouched();
    }
  }
  print() {
    this.setH1();
    this.setH3();
    if (this.projectedMaturitiesReportForm?.valid) {
      this.projectedMaturitiesReportForm.value.isPrint = true;
      this.loaderToggle = true;
      this.commonReportService
        .getTtxParameterizedPrintReport(
          this.projectedMaturitiesReportForm?.value
        )
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.loaderToggle = false;
              this.toastr.showSuccess(res.message);
            } else {
              this.loaderToggle = false;
              this.toastr.showError(res.message);
            }
          },
          error: (err: any) => {
            this.loaderToggle = false;
          },
          complete: () => {
            this.loaderToggle = false;
          },
        });
    } else {
      this.validationField();
      this.projectedMaturitiesReportForm.markAllAsTouched();
    }
  }
  handleExit() {
    this.router.navigate(['/dashboard']);
  }
  updateCompanyList(compData: any) {
    if (compData !== undefined) {
      this.projectedMaturitiesReportForm.patchValue({
        reportParameters: {
          companyName: compData[this.bringBackColumn],
        },
      });
    }
  }
  updateOnChangeCompanyList(event: any) {
    console.log('tabledata', this.tableData);
    const result = this.tableData.dataSet.filter((s: any, i: any) => {
      if (
        this.tableData.dataSet[i][0].trim() ===
        event?.target?.value.toUpperCase()
      ) {
        return this.tableData.dataSet[i];
      } else {
        return null;
      }
    });
    if (event?.target?.value) {
      if (result.length == 0) {
        this.projectedMaturitiesReportForm.patchValue({
          reportParameters: { TxtCompanyCd: '' },
        });
      } else {
        this.projectedMaturitiesReportForm.patchValue({
          reportParameters: {
            companyName: result[0][1].trim(),
          },
        });
      }
    }
    if (event?.target?.value == '') {
      this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus();
    }
  }
  // onLoadSetCurrentYearMonth(){
  //   this.projectedMaturitiesReportForm.patchValue({
  //     reportParameters:{
  //       upToDate:moment(`${new Date().getFullYear()}-${new Date().getMonth()+1}`)
  //     }
  //   })
  // }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue: any =
      this.projectedMaturitiesReportForm.value?.reportParameters?.upToDate;
    ctrlValue.year(normalizedYear.year());
    this.projectedMaturitiesReportForm.patchValue({
      reportParameters: {
        upToDate: ctrlValue,
      },
    });
    console.log(ctrlValue);
  }

  chosenMonthHandler(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>,
    dateCtrl: any
  ) {
    if (!dateCtrl?.valid) {
      this.projectedMaturitiesReportForm.patchValue({
        reportParameters: {
          upToDate: normalizedMonthAndYear,
        },
      });
    }
    const ctrlValue: any = dateCtrl?.value;
    ctrlValue?.month(normalizedMonthAndYear?.month());
    ctrlValue?.year(normalizedMonthAndYear?.year());
    dateCtrl?.setValue(ctrlValue);
    datepicker.close();

    //  console.log(dateCtrl?.value);

    //console.log("ctrlValue",ctrlValue);
    // this.projectedMaturitiesReportForm.patchValue({
    //   reportParameters:{
    //     upToDate:ctrlValue
    //   }
    // })
  }

  validationField() {
    if (
      this.projectedMaturitiesReportForm.controls['reportParameters'].controls[
        'TxtCompanyCd'
      ].errors &&
      this.projectedMaturitiesReportForm.controls['reportParameters'].controls[
        'TxtCompanyCd'
      ].errors?.['required']
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Company Code is Required',
        this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus(),
        'error'
      );
    } else if (
      this.projectedMaturitiesReportForm.controls['reportParameters'].controls[
        'upToDate'
      ].errors &&
      this.projectedMaturitiesReportForm.controls['reportParameters'].controls[
        'upToDate'
      ].errors?.['required']
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'UpTo Date is Required',
        this.rendered.selectRootElement('#upToDateField')?.focus(),
        'error'
      );
    }
  }
}
