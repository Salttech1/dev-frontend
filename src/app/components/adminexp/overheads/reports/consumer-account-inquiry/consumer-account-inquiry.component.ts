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
import  * as constant from '../../../../../../constants/constant'
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { overheadfileconstants } from 'src/app/components/adminexp/overheads/overheadfileconstants';
import { OverheadsService } from 'src/app/services/adminexp/overheads.service';
import { ServiceService } from 'src/app/services/service.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { take } from 'rxjs';
import { fileConstants } from 'src/constants/fileconstants';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-consumer-account-inquiry',
  templateUrl: './consumer-account-inquiry.component.html',
  styleUrls: ['./consumer-account-inquiry.component.css']
})
export class ConsumerAccountInquiryComponent implements OnInit {

  billTypeF1List: any;
  billTypeF1abc: any;
  ConnnoF1abc: any;
  billTypeColHeadings!: any[];
  
  locationF1List: any;
  locationF1abc: any;
  locationColHeadings!: any[];
  meternoF1List:any;
  meternoF1abc:any;
  meternoColHeadings!: any[];

  ConnTableDataList: any;
  ConnColumnHeader: any;
  strohdh_connocode!: string;
  strohdh_conno!: string;
  strBilltype!: string;
  strmeterconncode!: string;
  seqId!: string;
  comp: any;
  Billtype!: string;
  billwiseconnFilter!: string;
  chkradiabutton!:string;
  chkvacantFlat:boolean=false;
  loaderToggle: boolean = false;
  rendered: any;
  disableBillTypeFlag: boolean = true;
  disableConsumerNoFlag: boolean = true;
  disableAccountnoflag:boolean=true;
  disableLocationFlag:boolean=true;
  disableMeterNoFlag: boolean=true; 
  fetchcolumn!: string;
  tableName!: string;
  ColumnName!: string;
  ColumnValue!: string; 
  
  constructor(
    private dynapop: DynapopService,
    private modalService: ModalService,
    private commonReportService: CommonReportsService,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private _service: ServiceService,
    private toastr: ToastrService,
    private overheadsService: OverheadsService,
    private dialog: MatDialog
    
  ) {}

  //inlineRadioOptionschkbox
  ngOnInit(): void {
    this.createF1forBillType();
    this.createF1forLocation();
    this.createF1forMeterNo()
    //this.focusField();
    this.reportSelection?.controls['inlineRadioOptions'].valueChanges.subscribe(
      (value) => {
        console.log("test Radio",value);
        this.chkradiabutton=value;
        this.setEnabledisableControl();
      }
    );
   
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

  createF1forMeterNo()
  {
    this.dynapop.getDynaPopListObj('METERNO', '').subscribe((res: any) => {
      this.meternoColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.meternoF1List = res.data;
      this.meternoF1abc = res.data.bringBackColumn;
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
  displayConnocodeFromMeterdynapop(e:any)
  {
    this.strmeterconncode=e[2]?.trim();
  }
  selectiondetails = new FormGroup({
    name: new FormControl(''),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),

    reportParameters: new FormGroup({
      billType: new FormControl<String | null>('', Validators.required),
      connectionNo: new FormControl<String | null>(''),
      accountno:new FormControl<String | null>(''),
      Billtype: new FormControl<String | null>(''),
      location: new FormControl(''),
      meterno:new FormControl<String | null>(''),
      
    }),
  });
  reportSelection: FormGroup = new FormGroup({
    inlineRadioOptions: new FormControl(''),
  });

  //To add default focus on input field
  // focusField() {
  //   //Below getElementById should be unique id in every component
  //   let el = document.getElementById('billType')
  //     ?.childNodes[0] as HTMLInputElement;
  //   el?.focus();
  // }
  
  showErrorDialog(titleVal:any , message: string, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose:true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: "",
        type: type
      },
    });
    dialogRef.afterOpened().subscribe(()=>{
       console.log("Dialog Opened")
    })
    
  }

  setLocationEnableDisable()
  {
    if (this.chkvacantFlat==true){
      console.log("inside chk");
      this.disableLocationFlag = true;
    }
  }
  setEnabledisableControl() {
    if (this.chkradiabutton == 'option1') {
      this.disableBillTypeFlag = true;
      this.disableConsumerNoFlag = false;
      this.disableAccountnoflag=true;
      this.disableLocationFlag=false;
      this.disableMeterNoFlag=false;  
    } else if (this.chkradiabutton == 'option2') {
      this.disableBillTypeFlag = true;
      this.disableConsumerNoFlag = true;
      this.disableAccountnoflag=false;
      this.disableLocationFlag=false;
      this.disableMeterNoFlag=false;  
    } else if (this.chkradiabutton == 'option3') {
      this.disableBillTypeFlag = false;
      this.disableConsumerNoFlag = false;
      this.disableAccountnoflag=false;
      this.disableLocationFlag=false;
      this.disableMeterNoFlag=true;  
    } else if (this.chkradiabutton == 'option4') {
      this.disableBillTypeFlag = true;
      this.disableConsumerNoFlag = false;
      this.disableAccountnoflag=false;
      this.disableLocationFlag=true;
      this.disableMeterNoFlag=false;  
    } 
  }

  setReportParamters() {
    var currentYear = new Date();
    console.log(
      'this.reportSelection?.value.inlineRadioOptions',
      this.reportSelection?.value.inlineRadioOptions
    );

    if (this.reportSelection?.value.inlineRadioOptions == 'option4') {
      this.selectiondetails.patchValue({
        name: overheadfileconstants.consumerLocationwiseInquiry,
        reportParameters: {
          Billtype: this.strBilltype,
        },
      });
    }  
  }

  
  dispalySingleValueFromTable()
  {
    if (this.reportSelection?.value.inlineRadioOptions == 'option1') 
    {
      this.fetchcolumn="ohdh_conno";
      this.tableName="overheadcons";
      this.ColumnName="ohdh_connocode";
      this.ColumnValue=this.strohdh_connocode;

      this.overheadsService
        .retriveSingleValuefromTable(this.fetchcolumn,this.tableName,this.ColumnName,this.ColumnValue)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            console.log('res.data', res.data);
            
            if (res.data) {
              this.showErrorDialog(constant.ErrorDialog_Title, "For consumer " + 
              this.strohdh_conno + "Account Number is  -->  "+ res.data , "info");
            } else {
              this.toastr.error('Record Not  Found');
            }
          },
        });
    }
    else if (this.reportSelection?.value.inlineRadioOptions == 'option2') 
    {
      this.fetchcolumn="ohdh_consumerNo";
      this.tableName="overheadcons";
      this.ColumnName="ohdh_conno";
      this.ColumnValue=this.strohdh_conno;
      console.log("inside option 2");
      
      this.overheadsService
        .retriveSingleValuefromTable(this.fetchcolumn,this.tableName,this.ColumnName,this.ColumnValue)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            console.log('res.data', res.data);
            if (res.data) {
              this.showErrorDialog(constant.ErrorDialog_Title, "for Account #  " + 
              this.strohdh_conno + " Currosponding consumer # ---> "+ res.data , "Info");
            } else {
              this.toastr.error('Record Not  Found');
            }
          },
        });
    }
    else if (this.reportSelection?.value.inlineRadioOptions == 'option3') 
    {
      this.fetchcolumn="ohdh_conno";
      this.tableName="overheadcons";
      this.ColumnName="ohdh_connocode";
      this.ColumnValue=this.strmeterconncode;
      console.log("inside option 3");
      
      this.overheadsService
        .retriveSingleValuefromTable(this.fetchcolumn,this.tableName,this.ColumnName,this.ColumnValue)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            console.log('res.data', res.data);
            if (res.data) {
              this.showErrorDialog(constant.ErrorDialog_Title, "For This Meter No " + 
               " consumer No is -----> "+ res.data , "Info");
            } else {
              this.toastr.error('Record Not  Found');
            }
          },
        });
    }
    else{
      this.getReport(false);
    }
    
  }
    
  getReport(print: boolean) {
    this.loaderToggle = true;
    this.setReportParamters();
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
  handleExitClick() {
    this.router.navigate(['/dashboard']);
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
