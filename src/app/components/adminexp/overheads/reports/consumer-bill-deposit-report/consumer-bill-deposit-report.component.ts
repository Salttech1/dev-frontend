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

@Component({
  selector: 'app-consumer-bill-deposit-report',
  templateUrl: './consumer-bill-deposit-report.component.html',
  styleUrls: ['./consumer-bill-deposit-report.component.css']
})
export class ConsumerBillDepositReportComponent implements OnInit {

  billTypeF1List: any;
  billTypeF1abc: any;
  ConnnoF1abc: any;
  billTypeColHeadings!: any[];
  ConnTableDataList: any;
  ConnColumnHeader: any;
  strohdh_connocode!: string;
  strohdh_conno!: string;
  strBilltype!: string;
  seqId!: string;
  Billtype!: string;
  StrHeadertext1!: string;
  StrHeadertext2!: string;
  StrHeadertext3!: string;
  billwiseconnFilter!: string;
  chkradiabutton!:string;
  comp: any;
  loaderToggle: boolean = false;
  disableBillTypeFlag: boolean = false;
  disableDateFlag: boolean = false;
  disableConsumerNo: boolean=false;
    
  constructor(
    private dynapop: DynapopService,
    private modalService: ModalService,
    private commonReportService: CommonReportsService,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private _service: ServiceService,
    private toastr: ToastrService,
    private rendered: Renderer2,
  ) {}

  //inlineRadioOptionschkbox
  ngOnInit(): void {
    this.createF1forBillType();
    
    this.reportSelection?.controls['inlineRadioOptions'].valueChanges.subscribe(
      (value) => {
        console.log("test Radio",value);
        this.chkradiabutton=value;
        this.setEnabledisableControl();
      }
    );
    this.focusField('billType');
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
    name: new FormControl(''),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),

    reportParameters: new FormGroup({
      billType: new FormControl<String | null>('', Validators.required),
      connectionNo: new FormControl<String | null>(''),
      frommonthyear: new FormControl<any>(moment()),
      endmonthyear: new FormControl<any>(moment()),
      HeaderText1: new FormControl(''),
      HeaderText2: new FormControl(''),
      HeaderText3: new FormControl(''),
      
      Billtype: new FormControl<String | null>(''),
      
    }),
  });
  reportSelection: FormGroup = new FormGroup({
    inlineRadioOptions: new FormControl(''),
    
  });

  //To add default focus on input field
  focusField(fieldId: any) {
    console.log("test");
    
    let el = document.getElementById(fieldId)
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  setEnabledisableControl() {
    if (this.chkradiabutton == 'option1') {
       this.disableDateFlag = true;
       this.disableConsumerNo=true;
       this.focusField('billType');
    } else if (this.chkradiabutton == 'option2') {
      this.disableDateFlag = false;
      this.disableConsumerNo=false;
      this.focusField('billType');
    } 
  }

  setReportParamters() {
    var currentYear = new Date();
    console.log(
      'this.reportSelection?.value.inlineRadioOptions',
      this.reportSelection?.value.inlineRadioOptions
    );
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
      console.log(moment(
        this.selectiondetails.controls['reportParameters'].get('endmonthyear')
          ?.value
      ).format('YYYYMM'));
        this.selectiondetails.patchValue({
          name: overheadfileconstants.overheadBillDetail,
          reportParameters: {
            Billtype: this.strBilltype,
            // frommonthyear: new FormControl<any>(moment()),
            // endmonthyear: new FormControl<any>(moment()),
            frommonthyear: moment(
              this.selectiondetails.controls['reportParameters'].get('frommonthyear')
                ?.value
            ).format('YYYYMM'),
            endmonthyear: moment(
              this.selectiondetails.controls['reportParameters'].get('endmonthyear')
                ?.value
            ).format('YYYYMM'),
            HeaderText1: this.StrHeadertext1,
            HeaderText2: this.StrHeadertext2,
            HeaderText3: 'test',
          },
        });
      } else if (this.reportSelection?.value.inlineRadioOptions == 'option2')
      {
        this.selectiondetails.patchValue({
          name: overheadfileconstants.overheadBillSummary,
          reportParameters: {
            Billtype: this.strBilltype,
            HeaderText1: this.StrHeadertext1,
            HeaderText2: this.StrHeadertext2,
            HeaderText3: 'test1',
          },
        });
      }
  }

  getReport(print: boolean) {
    this.loaderToggle = true;
    this.setReportParamters();
    this.commonReportService
      .getParameterizedReportWithMultipleConditionAndParameter(this.selectiondetails.value)
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
  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  validateInvalidFormat(event: any, id: any) {
    console.log(event.target.value)
    if (!moment(event.target.value, 'YYYY-MM', true).isValid()) {
      event.target.value = '';
      this.toastr.error("Invalid Month-Year")
      this.rendered.selectRootElement(`#${id}`)?.focus();
    }
    else{
        let startDate = moment(this.selectiondetails.get("reportParameters.frommonthyear")?.value).year()
        let endDate = moment(this.selectiondetails.get("reportParameters.endmonthyear")?.value).year();        
        if (startDate > endDate) {
          this.toastr.error("From Month-Year should be less than To Date")
          this.selectiondetails.get("reportParameters.endmonthyear")?.reset()
          this.rendered.selectRootElement(`#${id}`)?.focus()
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
