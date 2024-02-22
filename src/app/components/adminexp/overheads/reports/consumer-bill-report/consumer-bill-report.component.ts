import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { overheadfileconstants } from 'src/app/components/adminexp/overheads/overheadfileconstants';
import { ServiceService } from 'src/app/services/service.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { take } from 'rxjs';
import { fileConstants } from 'src/constants/fileconstants';

// export const MY_DATE_FORMAT = {
//   parse: {
//     dateInput: 'DD/MM/YYYY',
//   },
//   display: {
//     dateInput: 'DD/MM/YYYY',
//     monthYearLabel: 'MMMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//     yearMonthLabel: 'YYYYMM',
//   },
// };

@Component({
  selector: 'app-consumer-bill-report',
  templateUrl: './consumer-bill-report.component.html',
  styleUrls: ['./consumer-bill-report.component.css'],
  // providers: [
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE],
  //   },
  //   { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  // ],
})
export class ConsumerBillReportComponent implements OnInit {
  billTypeF1List: any;
  billTypeF1abc: any;
  ConnnoF1abc: any;
  billTypeColHeadings!: any[];
  locationF1List: any;
  locationF1abc: any;
  locationColHeadings!: any[];
  ConnTableDataList: any;
  ConnColumnHeader: any;
  strohdh_connocode!: string;
  strohdh_conno!: string;
  strBilltype!: string;
  StrDatewiseReportName!: string;
  //seqId!: number;
  Billtype!: string;
  StrHeadertext1!: string;
  StrHeadertext2!: string;
  StrHeadertext3!: string;
  billwiseconnFilter!: string;
  chkradiabutton!: string;
  chkvacantFlat: boolean = false;
  comp: any;
  loaderToggle: boolean = false;
  vacantflag: boolean = false;

  disableBillTypeFlag: boolean = false;
  disableDateFlag: boolean = true;
  disableYearMonthFlag: boolean = true;
  disableLocationFlag: boolean = true;
  disableConsumerNoFlag: boolean = true;
  disableFromFlag: boolean = true;
  disableToflag: boolean = true;

  constructor(
    private dynapop: DynapopService,
    private modalService: ModalService,
    private commonReportService: CommonReportsService,
    private router: Router,
    private rendered: Renderer2,
    private cdref: ChangeDetectorRef,
    private _service: ServiceService,
    private toastr: ToastrService
  ) {}

  //inlineRadioOptionschkbox
  ngOnInit(): void {
    this.createF1forBillType();
    this.createF1forLocation();
    //this.focusField();
    this._service.pageData.subscribe({
      next: (val) => {
        this.selectiondetails.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
    this.reportSelection?.controls['inlineRadioOptions'].valueChanges.subscribe(
      (value) => {
        console.log('test Radio', value);
        this.chkradiabutton = value;
        this.setEnabledisableControl();
      }
    );
    this.reportSelection?.controls[
      'inlineRadioOptionschkbox'
    ].valueChanges.subscribe((value1) => {
      this.chkvacantFlat = value1;
      this.setLocationEnableDisable();
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  createF1forBillType() {
    this.dynapop.getDynaPopListObj('OVERHEADS', '').subscribe((res: any) => {
      this.billTypeColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.billTypeF1List = res.data;
      this.billTypeF1abc = res.data.bringBackColumn;
    });
  }
  createF1forLocation() {
    this.dynapop.getDynaPopListObj('CONSITE', '').subscribe((res: any) => {
      this.locationColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.locationF1List = res.data;
      this.locationF1abc = res.data.bringBackColumn;
    });
  }

  displayBillType(e: any) {
    this.strBilltype = e[0];

    this.billwiseconnFilter = `Ohdh_billtype='${this.strBilltype}'`;
    this.dynapop
      .getDynaPopListObj('CONSUMERNO', `Ohdh_billtype='${this.strBilltype}'`)
      .subscribe((res: any) => {
        this.ConnColumnHeader = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.ConnTableDataList = res.data;
        this.ConnnoF1abc = res.data.bringBackColumn;
      });
  }

  displayConncode(e: any) {
    this.strohdh_connocode = e[1]?.trim();
    this.strohdh_conno = e[0]?.trim();
  }

  selectiondetails = new FormGroup({
    //name: new FormControl(overheadfileconstants.conbillteldatewisedtls),
    name: new FormControl(''),
    seqId: new FormControl(''),
    isPrint: new FormControl(false),

    reportParameters: new FormGroup({
      billType: new FormControl<String | null>('', Validators.required),
      bilentdateField: new FormControl(moment()),
      billperiod: new FormControl(moment()),
      connectionNo: new FormControl<String | null>(''),
      fromYear: new FormControl<any>(moment()),
      toYear: new FormControl<any>(moment()),
      prvBillYear: new FormControl(''),
      billenterdate: new FormControl(''),
      curryearmonth: new FormControl(''),
      prvyearmonth: new FormControl(''),
      HeaderText1: new FormControl(''),
      HeaderText2: new FormControl(''),
      Billtype: new FormControl<String | null>(''),
      location: new FormControl(''),
      formname: new FormControl(''),
      frommonthyear: new FormControl(''),
      endmonthyear: new FormControl(''),
    }),
  });
  reportSelection: FormGroup = new FormGroup({
    inlineRadioOptions: new FormControl(''),
    inlineRadioOptionschkbox: new FormControl(''),
  });

  ///To add default focus on input field
  focusField(fieldId: any) {
    let el = document.getElementById(fieldId)
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  setLocationEnableDisable() {
    if (this.chkvacantFlat == true) {
      console.log('inside chk');
      this.disableLocationFlag = true;
      this.disableYearMonthFlag = true;
    } else {
      this.disableLocationFlag = false;
      this.disableYearMonthFlag = false;
    }
  }
  setEnabledisableControl() {
    if (this.chkradiabutton == 'option1') {
      // this.disableBillTypeFlag = false;
      //this.selectiondetails.controls["reportParameters"].controls["bilentdateField"].disable();

      this.disableDateFlag = false;
      // this.disableYearMonthFlag = false;
      // this.disableLocationFlag = false;
      this.setLocationEnableDisable();
      this.disableConsumerNoFlag = false;
      this.disableFromFlag = false;
      this.disableToflag = false;
      this.focusField('billType');
    } else if (this.chkradiabutton == 'option2') {
      this.disableDateFlag = false;
      this.disableYearMonthFlag = false;
      this.disableLocationFlag = false;
      this.disableConsumerNoFlag = true;
      this.disableFromFlag = true;
      this.disableToflag = true;
      this.focusField('billType');
    } else if (this.chkradiabutton == 'option3') {
      this.disableDateFlag = false;
      this.disableYearMonthFlag = false;
      this.disableLocationFlag = true;
      this.disableConsumerNoFlag = false;
      this.disableFromFlag = false;
      this.disableToflag = false;
      this.focusField('billType');
    } else if (this.chkradiabutton == 'option4') {
      this.disableDateFlag = false;
      this.disableYearMonthFlag = false;
      this.disableLocationFlag = false;
      this.disableConsumerNoFlag = false;
      this.disableFromFlag = false;
      this.disableToflag = false;
      this.focusField('billType');
    } else if (this.chkradiabutton == 'option5') {
      this.disableDateFlag = false;
      this.disableYearMonthFlag = true;
      this.disableLocationFlag = false;
      this.disableConsumerNoFlag = true;
      this.disableFromFlag = false;
      this.disableToflag = false;
      this.focusField('billType');
    }
    else if (this.chkradiabutton == 'option6') {
      this.disableDateFlag = false;
      this.disableYearMonthFlag = true;
      this.disableLocationFlag = false;
      this.disableConsumerNoFlag = false;
      this.disableFromFlag = false;
      this.disableToflag = false;
      this.focusField('billType');
    }
  }

  setReportParamters() {
    var currentYear = new Date();
    console.log(
      'this.reportSelection?.value.inlineRadioOptions',
      this.reportSelection?.value.inlineRadioOptions
    );
    console.log(
      'this.reportSelection?.value.inlineRadioOptionschkbox',
      this.reportSelection?.value.inlineRadioOptionschkbox
    );

    this.vacantflag = this.reportSelection?.value.inlineRadioOptionschkbox;
    if (this.strBilltype == 'E') {
      this.StrHeadertext1 = 'Electricity Bill Record';
      this.StrHeadertext2 = 'ACCOUNT NO :';
    } else if (this.strBilltype == 'W') {
      this.StrHeadertext1 = 'Water Supply Bill Record';
      this.StrHeadertext2 = 'CONNECTION NO :';
    } else if (this.strBilltype == 'T') {
      this.StrHeadertext1 = 'Telephone Bill Record';
      this.StrHeadertext2 = 'TELEPHONE NO :';
    } else if (this.strBilltype == 'G') {
      this.StrHeadertext1 = 'Gas Charges Bill Record';
      this.StrHeadertext2 = ' CONNECTION NO :';
    }

    if (this.reportSelection?.value.inlineRadioOptions == 'option1') {
      console.log('this.vacantflag', this.vacantflag);
      console.log('inside datewise');
      console.log('this.strBilltype', this.strBilltype);

      if (this.strBilltype.trim() == 'E') {
        console.log('test');

        if (this.vacantflag == true) {
          this.StrDatewiseReportName =
            overheadfileconstants.vacantflatdatewisedtls;
          this.selectiondetails.patchValue({
            name: this.StrDatewiseReportName,
            seqId: '1',
            
            reportParameters: {
              Billtype: this.strBilltype.trim(),
              billType: this.strBilltype.trim(),
              curryearmonth: moment(
                this.selectiondetails.controls['reportParameters'].get('billperiod')
                  ?.value
              ).format('YYYYMM'),
              location:this.selectiondetails.controls['reportParameters'].get('location')
              ?.value,
              HeaderText1: this.StrHeadertext1,
            },
          });
          console.log('inside vacant');
        } else {
          this.StrDatewiseReportName =
            overheadfileconstants.conbilldatewisedtls;
          this.selectiondetails.patchValue({
            name: this.StrDatewiseReportName,
            seqId: '1',
            reportParameters: {
              Billtype: this.strBilltype.trim(),
              billType: this.strBilltype.trim(),
              prvBillYear: '01/JAN/' + (currentYear.getFullYear() - 1),
              billenterdate: moment(currentYear).format('DD/MMM/YYYY'),
              prvyearmonth: currentYear.getFullYear() - 1 + '01',
              HeaderText1: this.StrHeadertext1,
            },
          });
        }
      } else {
        if (this.vacantflag == true) {
          this.StrDatewiseReportName =
            overheadfileconstants.vacantflatdatewisedtls;
        } else {
          this.StrDatewiseReportName =
            overheadfileconstants.ConbillElecDatewiseDtls;
        }
        this.selectiondetails.patchValue({
          //name: overheadfileconstants.conbillteldatewisedtls,
          name: this.StrDatewiseReportName,
          seqId: '1',
          reportParameters: {
            Billtype: this.strBilltype.trim(),
            billType: this.strBilltype.trim(),
            prvBillYear: '01/JAN/' + (currentYear.getFullYear() - 1),
            billenterdate: moment(currentYear).format('DD/MMM/YYYY'),
            prvyearmonth: currentYear.getFullYear() - 1 + '01',
            HeaderText1: this.StrHeadertext1,
          },
        });
      }
    } else if (this.reportSelection?.value.inlineRadioOptions == 'option2') {
      this.selectiondetails.patchValue({
        name: overheadfileconstants.ConbillElecDatewiseDtls,
        seqId: '1',
        reportParameters: {
          Billtype: this.strBilltype,
          HeaderText1: this.StrHeadertext1,
          fromYear: moment(
            this.selectiondetails.controls['reportParameters'].get('fromYear')
              ?.value
          ).format('YYYY'),
          toYear: moment(
            this.selectiondetails.controls['reportParameters'].get('toYear')
              ?.value
          ).format('YYYY'),
        },
      });
    } else if (this.reportSelection?.value.inlineRadioOptions == 'option3') {
      this.selectiondetails.patchValue({
        name: overheadfileconstants.Conbillsummary,
        seqId: '1',
        reportParameters: {
          Billtype: this.strBilltype,
          HeaderText1: this.StrHeadertext1,
        },
      });
    } else if (this.reportSelection?.value.inlineRadioOptions == 'option4') {
      this.selectiondetails.patchValue({
        name: overheadfileconstants.ConDateWiseDeposite,
        seqId: '1',
        reportParameters: {
          Billtype: this.strBilltype,
          frommonthyear: moment(currentYear).format('YYYY') + '01',
          endmonthyear: moment(currentYear).format('YYYYMM'),
          billenterdate: moment(currentYear).format('DD/MMM/YYYY'),
        },
      });
    }
    else if (this.reportSelection?.value.inlineRadioOptions == 'option5') {
      console.log('this.strohdh_conno', this.strohdh_conno);
      console.log('this.strohdh_connocode', this.strohdh_connocode);

      this.selectiondetails.patchValue({
        name: overheadfileconstants.consumerWiseBillDetail,
        seqId: '1',
        reportParameters: {
          Billtype: this.strBilltype,
          connectionNo: this.strohdh_connocode,
          curryearmonth: moment(
            this.selectiondetails.controls['reportParameters'].get('billperiod')
              ?.value
          ).format('YYYYMM'),
        },
      });
    }
    else if (this.reportSelection?.value.inlineRadioOptions == 'option6') {
      console.log('this.strohdh_conno', this.strohdh_conno);
      console.log('this.strohdh_connocode', this.strohdh_connocode);

      this.selectiondetails.patchValue({
        name: overheadfileconstants.overheadLocationwiseReport,
        seqId: '1',
        reportParameters: {
          Billtype: this.strBilltype,
          curryearmonth: moment(
            this.selectiondetails.controls['reportParameters'].get('billperiod')
              ?.value
          ).format('YYYYMM'),
        },
      });
    }
  }

  getReport(print: boolean) {
    this.loaderToggle = true;
    console.log('getReport');

    this.setReportParamters();
    // if (this.reportSelection?.value.inlineRadioOptions == 'option1' || this.reportSelection?.value.inlineRadioOptions == 'option1')
    // {
    //   this.commonReportService
    //    .getParameterizedReportWithMultipleConditionAndParameter(this.selectiondetails.value)
    //   .pipe(take(1))
    //   .subscribe({
    //     next: (res: any) => {
    //       console.log('REesult ', res);
    //       this.loaderToggle = false;
    //       let pdfFile = new Blob([res], { type: 'application/pdf' });
    //       let fileName = this.commonReportService.getReportName();
    //       console.log('PDF FILE: ', pdfFile);
    //       if (print) {
    //         const blobUrl = URL.createObjectURL(pdfFile);
    //         const oWindow = window.open(blobUrl, '_blank');
    //         oWindow?.print();
    //       } else {
    //         fileSaver.saveAs(pdfFile, fileName);
    //       }
    //     },
    //     error: (err: any) => {
    //       this.loaderToggle = false;
    //       this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus();
    //     },
    //   });
    // }
    // else
    // {
    console.log('this.selectiondetails.value', this.selectiondetails.value);
    if (this.reportSelection?.value.inlineRadioOptions == 'option6')
    {
      this.commonReportService
      .getParameterizedReport(this.selectiondetails.value)
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          console.log('REesult ', res);
          this.loaderToggle = false;
          let pdfFile = new Blob([res], { type: 'application/pdf' });
          let fileName = this.commonReportService.getReportName();
          console.log('PDF FILE: ', pdfFile);
          if (print) {
            const blobUrl = URL.createObjectURL(pdfFile);
            const oWindow = window.open(blobUrl, '_blank');
            oWindow?.print();
          } else {
            fileSaver.saveAs(pdfFile, fileName);
          }
        },
        error: (err: any) => {
          this.loaderToggle = false;
          this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus();
        },
      });
    }
    else
    {
      this.commonReportService
      .getParameterizedReportWithCondition(this.selectiondetails.value)
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          console.log('REesult ', res);
          this.loaderToggle = false;
          let pdfFile = new Blob([res], { type: 'application/pdf' });
          let fileName = this.commonReportService.getReportName();
          console.log('PDF FILE: ', pdfFile);
          if (print) {
            const blobUrl = URL.createObjectURL(pdfFile);
            const oWindow = window.open(blobUrl, '_blank');
            oWindow?.print();
          } else {
            fileSaver.saveAs(pdfFile, fileName);
          }
        },
        error: (err: any) => {
          this.loaderToggle = false;
          this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus();
        },
      });
    }
    
    //}
  }
  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  validateInvalidFormat(event: any, id: any) {
    console.log('event.target.value', event.target.value);

    if (!moment(event.target.value, 'YYYY', true).isValid()) {
      event.target.value = '';
      this.toastr.error('Invalid Year');
      this.rendered.selectRootElement(`#${id}`)?.focus();
    } else {
      let startDate = moment(
        this.selectiondetails.get('reportParameters.fromYear')?.value
      ).year();
      let endDate = moment(
        this.selectiondetails.get('reportParameters.toYear')?.value
      ).year();
      if (startDate > endDate) {
        this.toastr.error('From Year should be less than To Date');
        this.selectiondetails.get('reportParameters.toYear')?.reset();
        this.rendered.selectRootElement(`#${id}`)?.focus();
      }
    }
  }

  chosenMonthHandler(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>,
    dateCtrl: any
  ) {
    //debugger
    if (!dateCtrl?.valid) {
      dateCtrl?.setValue(normalizedMonthAndYear);
    }
    const ctrlValue: any = dateCtrl?.value;
    //ctrlValue?.month(normalizedMonthAndYear?.month());
    ctrlValue?.year(normalizedMonthAndYear?.year());
    dateCtrl?.setValue(ctrlValue);
    console.log(dateCtrl, 'strlValue');
    console.log(
      this.selectiondetails.get('reportParameters.billperiod')?.value
    );

    datepicker.close();
  }
}
