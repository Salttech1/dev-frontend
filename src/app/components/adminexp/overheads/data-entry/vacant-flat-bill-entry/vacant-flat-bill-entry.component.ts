import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { OverheadsService } from 'src/app/services/adminexp/overheads.service';
import * as XLSX from 'xlsx';
import { lastValueFrom, take } from 'rxjs';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-vacant-flat-bill-entry',
  templateUrl: './vacant-flat-bill-entry.component.html',
  styleUrls: ['./vacant-flat-bill-entry.component.css'],
})
export class VacantFlatBillEntryComponent implements OnInit, AfterViewInit {
  billTypeF1List: any;
  billTypeColHeadings!: any[];
  billTypeF1abc: any;
  strBilltype!: string;
  countValue!: any[];
  billwiseconnFilter!: string;
  ConnColumnHeader: any;
  ConnTableDataList: any;
  ConnnoF1abc: any;
  fileUploaded!: File;
  storeData: any;
  worksheet: any;
  filelist: any;
  title = 'Xlxread';
  file!: File;
  arrayBuffer: any;
  ConnBillData!: any[];
  dtOptions: DataTables.Settings = {};
  initialMode: Boolean = true;
  httpClient: any;
  disableSave: boolean = true;

  constructor(
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private cdref: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: ModalService,
    private dialog: MatDialog,
    private el: ElementRef,
    private renderer: Renderer2,
    private overheadsService: OverheadsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createF1forBillType();
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      responsive: true,
      lengthChange: false,
    };
    //this.renderer.listen(document, 'keydown.meta.k', handler)
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  connectionSelection: FormGroup = new FormGroup({
    billType: new FormControl<String | null>('', Validators.required),
    filepath: new FormControl<String | null>('', Validators.required),
  });
  // @HostListener('document:keydown.meta.k')

  //To add default focus on input field
  focusField() {
    //Below getElementById should be unique id in every component
    let el = document.getElementById('billType')
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }
  ngAfterViewInit(): void {
    this.focusField();
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
      //console.log('String test', this.billTypeF1List);
      this.billTypeF1abc = res.data.bringBackColumn;
    });
  }
  //convert table data to json file
  insertBilltypeInexcellist() {
    this.filelist.forEach((v: any) => {
      v.billType = this.connectionSelection.get('billType')?.value?.trim();
      console.log('v data', v);
    });
    return this.filelist;
  }
  calcCGSTSGST(index:any)
  {
    // let debitAmnt = this.contractDebitEntryForm.controls.contractDebitWiseArray.controls[index].get('debitamount')?.value
    // if(Number(debitAmnt) >0){
    //   this.contractDebitEntryForm.controls.contractDebitWiseArray.controls[index].get('debitamount')?.setValue(
    //     Number(debitAmnt).toFixed(2));
    // }
    
  }
  saveOverheadBill() {
    let userid = sessionStorage.getItem('userName');
    console.log('save from file', this.filelist);
    console.log(
      'this.connectionSelection.valid',
      this.connectionSelection.valid
    );
    //if (this.connectionSelection.valid) {
    console.log('TEST');
    let savePayload = {
      userid: sessionStorage.getItem('userName'),
      overheadconsExcelRequestBean: this.insertBilltypeInexcellist(),
    };
    console.log('savePayload', savePayload);

    this.overheadsService.addExcelOverheadBill(savePayload).subscribe({
      next: (res) => {
        if (res.status) {
          this.modalService.showErrorDialogCallBack(
            'Overhead Bill Inserted',
            res['message'],
            this.handleBackClick(),
            'info'
          );
          //this.handleBackClick();
        } else {
          if (!res.status) {
            this.modalService.showErrorDialogCallBack(
              'Overhead Excel import',
              res['message'],
              this.handleBackClick(),
              'info'
            );
            //this.handleBackClick();
          }
        }
      },
    });
    console.log('save', savePayload);
    //}
  }

  // async addBillRecordsinGrid() {
  //   console.log('this.file', this.file);
  //   if (this.connectionSelection?.valid) {
  //     let fileReader = new FileReader();
  //     fileReader.readAsArrayBuffer(this.file);
  //     fileReader.onload = (e) => {
  //       this.arrayBuffer = fileReader.result;
  //       var data = new Uint8Array(this.arrayBuffer);
  //       var arr = new Array();
  //       for (var i = 0; i != data.length; ++i)
  //         arr[i] = String.fromCharCode(data[i]);
  //       var bstr = arr.join('');
  //       var workbook = XLSX.read(bstr, { type: 'binary' });
  //       var first_sheet_name = workbook.SheetNames[0];
  //       var worksheet = workbook.Sheets[first_sheet_name];
  //       this.filelist = XLSX.utils.sheet_to_json(worksheet, { raw: false });
  //       console.log('this.filelistaddbill', this.filelist);
  //       var index = this.filelist?.length;
  //       console.log("index",index);

  //       for (var i = 0; i < this.filelist.length; i++) {
  //         //var billperiod: String=this.filelist[i].BillPeriod;
  //         if (this.filelist[i].BillPeriod == ' ') {
  //           var billdate = this.filelist[i].BillDate;
  //           this.filelist[i].BillPeriod = moment(
  //             new Date(moment(new Date(billdate)).format('DD/MM/YYYY'))
  //           ).format('YYYYMM');
  //         }
  //         this.filelist[i].cgst = 0;
  //         this.filelist[i].sgst = 0;
  //       }
  //     };
  //     this.disableSave = false;
  //     this.connectionSelection.disable();
  //     //console.log('add file', this.filelist);
  //   } else {
  //     this.toastr.error('Please Fill Form Correctly');
  //   }

  // }

  async addBillRecordsinGrid() {
    console.log('this.file', this.file);
    if (this.connectionSelection?.valid) {
      let po1 = await new Promise<boolean>((resolve, reject) => {
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(this.file);
        fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();
          for (var i = 0; i != data.length; ++i)
            arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join('');
          var workbook = XLSX.read(bstr, { type: 'binary' });
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          this.filelist = XLSX.utils.sheet_to_json(worksheet, { raw: false });

          if (fileReader.readyState == 2) {
            console.log('11111');
            resolve(true);
          } else {
            reject(false);
          }
        };

        console.log('fileReader', fileReader);
        console.log('fileReader1', fileReader.readyState);
      });

      if (po1) {
        console.log('2222');
        this.funcValidateGrid();
        this.disableSave = false;
        this.connectionSelection.disable();
      } else {
        this.toastr.error('Please enter Proper Excel File');
      }
      console.log('add file', this.filelist);
    }
  }

  funcCheckConsumerExist(ConsumerNumber: string) {
    let counter = 1;
    this.overheadsService
      .getOverheadConsumerExist(ConsumerNumber)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          //console.log("inside excel",res);
          if (!res.status) {
            console.log('inside max', res);
            counter++;
            console.log('counter for loop', counter);
            this.modalService.showErrorDialog(
              'Overhead detail ',
              'Consumer No Not exist',
              'info'
            );
            //return counter;
          }
        },
      });
    return counter;
  }
  funcValidateGrid() {
    console.log('this.filelist.length', this.filelist?.length);
    console.log('this.filelist data ', this.filelist);
    for (var i = 0; i < this.filelist.length; i++) {
      // chk positive value enter in bill amt,pay amt,unit consume
      let counter = 0;
      //console.log("cgst amt in grid",this.filelist[i].cgst);
      
      if (
        this.filelist[i].BillAmount < 0 ||
        this.filelist[i].TotalPayable < 0 ||
        this.filelist[i].Unitconsumed < 0
      ) {
        this.modalService.showErrorDialog(
          'Overhead detail ',
          'Please enter Positive Value In Excel',
          'info'
        );
        counter++;
        
      }
      if (counter != 0) {
        this.handleBackClick();
        break;
        
      }

      //if (this.filelist[i].BillPeriod != '') {
      //console.log('counter1', counter);
      //let counter1=0;
      //var ConsumerNumber = this.filelist[i].ConsumerNumber;
      //console.log("ConsumerNumber",ConsumerNumber);
      // this.overheadsService
      //   .getOverheadConsumerExist(ConsumerNumber)
      //   .pipe(take(1))
      //   .subscribe({
      //     next: (res) => {
      //       //console.log("inside excel",res);
      //       if (!res.status) {
      //         console.log('inside max', res);
      //         counter++;
      //         console.log('counter', counter);
      //         this.modalService.showErrorDialog(
      //           'Overhead detail ',
      //           'Consumer No Not exist',
      //           'info'
      //         );
      //       }

      //     },
      //   });
      // if (counter != 0) {
      //   break;
      // }
      //counter1=this.funcCheckConsumerExist(ConsumerNumber);
      //console.log("inside funcCheckConsumerExist counter",counter1);
    }
  }

  addfile(event: any) {
    this.file = event.target.files[0];
  }
  handleBackClick() {
    this.connectionSelection.enable();
    this.filelist = '';
    this.connectionSelection.reset();
    this.disableSave = true;
    this.focusField();
    this.file = {} as File;
  }
  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }
}
