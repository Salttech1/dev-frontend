import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import * as constant from '../../../../../../constants/constant';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ModalService } from 'src/app/services/modalservice.service';
import { environment } from 'src/environments/environment';
import {
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { finalize, take } from 'rxjs';
import * as moment from 'moment';
import { HtmlParser } from '@angular/compiler';
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

@Component({
  selector: 'app-interesttaxentry',
  templateUrl: './interesttaxentry.component.html',
  styleUrls: ['./interesttaxentry.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class InteresttaxentryComponent implements OnInit {
  depositorTableData: any;
  recieptTableData: any;
  compHeader!: any[];
  recieptColumnHeader!: any[];
  deptColumnHeader!: any[];
  compData: any;
  columnHeader!: any[];
  tableData: any;
  bringBackColumn!: number;
  deptDyanPop!: string;
  recieptDyanPop!: string;
  coy_condition = "coy_fdyn='Y'";
  isRetreiveClicked: boolean = false;
  datePipe = new DatePipe('en-US');
  readonlyAttr = true;
  depintData!: any;
  fetchTaxEntryUrl: any;
  showList: boolean = true;
  showAdd: boolean = false;
  showPrint: boolean = true;
  showExit: boolean = true;
  showBack: boolean = false;
  showRetrieve: boolean = true;
  showDelete: boolean = false;
  showSave: boolean = false;
  showEdit: boolean = true;
  entryIndexVal: any;
  indexOfFromDate: number = 0;
  dataSize: number = 0;
  taxEntryData: any[] = [];
  taxEntryUpdatePayload: any;
  recieptNumArray: any[] = [];
  oldChqNumArray: any[] = [];
  loader: boolean = false;
  disableSave: boolean = false;
  isAllDataValid: boolean = false;
  startYear:any;
  endYear: any;
  @ViewChild(F1Component) comp!: F1Component;

  constructor(
    private dynapop: DynapopService,
    private http: HttpClient,
    private renderer: Renderer2,
    private modalService: ModalService,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToasterapiService,
    private rendered: Renderer2,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {
    this.getCompanyList();
  }

  taxDetailInitRows() {
    return this.fb.group({
      interestFromDate: new FormControl(Validators.required),
      interestToDate: new FormControl(Validators.required),
      interest: new FormControl<Number>(0),
      tds: new FormControl<Number>(0, Validators.required),
      chqnum: new FormControl<string>('', Validators.required),
      transer: new FormControl<string>('', Validators.required),
      intfrom: new FormControl<string>(''),
      intupto: new FormControl<string>(''),
      isAdd: new FormControl()
    });
  }

  taxEntrySectionForm = new FormGroup({
    companyCode: new FormControl<string | null>('', Validators.required),
    companyName: new FormControl<string | null>({ value: '', disabled: true }),
    depositorId: new FormControl<string | null>('', Validators.required),
    depositorName: new FormControl<string | null>({
      value: '',
      disabled: true,
    }),
    recieptNum: new FormControl<string | null>('', Validators.required),
    isValid: new FormControl<Boolean>(false),
    taxEntryData: new FormArray<FormGroup>([]),

  });

  taxEntryPayload() {
    this.setFormattedDateForInterest();
    this.taxEntryUpdatePayload = {
      coy: this.taxEntrySectionForm?.getRawValue().companyCode,
      depositorId: this.taxEntrySectionForm?.getRawValue().depositorId,
      receiptNum: this.taxEntrySectionForm?.getRawValue().recieptNum,
      userid: sessionStorage.getItem('userName'),
      depintBeanList: this.taxEntrySectionForm.controls.taxEntryData?.value.filter((value) => 
       ((Number(moment(value.interestToDate).format('Y')) >=this.startYear && Number(moment(value.interestToDate).format('Y')) <=this.endYear) || value.isAdd))
    };
    return this.taxEntryUpdatePayload;
  }

  setFormattedDateForInterest(){
    let taxData = this.taxEntrySectionForm.controls.taxEntryData?.value
    taxData.forEach( (v) => {
      v.intfrom = moment(v.interestFromDate).format('DD/MM/YYYY')
      v.intupto = moment(v.interestToDate).format('DD/MM/YYYY')
    })
  }

  getCompanyList() {
    this.dynapop
      .getDynaPopListObj('COMPANY', "coy_fdyn='Y'")
      .subscribe((res: any) => {
        this.compHeader = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.compData = res.data;
        this.bringBackColumn = res.data.bringBackColumn;
      });
  }

  updateCompanyList(compData: any) {
    this.taxEntrySectionForm.patchValue({
      companyName: compData[this.bringBackColumn].trim(),
    });
    this.getDepositorList(compData[this.bringBackColumn - 1]);
  }

  getDepositorList(companyCode: any) {
    this.deptDyanPop = `deptr_coy='${companyCode}'`;
    this.dynapop
      .getDynaPopListObj('DEPOSITORS', `deptr_coy='${companyCode}'`)
      .subscribe((res: any) => {
        this.deptColumnHeader = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.depositorTableData = res.data;
      });
  }

  ngAfterViewInit(): void {
    this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus(); //To add default focus on input field
  }

  focusDepInterest(index: any) {
    setTimeout(() => {
      let focusElement3 = document.getElementById(
        'intfrom_' + index
      );
      focusElement3 && this.renderer.selectRootElement(focusElement3).focus();
    }, 100);
  }

  updateDepositorList(depData: any) {
    this.taxEntrySectionForm.patchValue({
      depositorName: depData[this.bringBackColumn].trim(),
    });
    this.getRecieptNumbers();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getDateFormatt(data: any) {
    return new Date(data);
  }

  updateRecieptNumArray(data: any) {
    for (let i = 0; i < data.length; i++) {
      this.recieptNumArray.push(data[i][0].trim());
    }
  }

  updateReciept(data: any) {
    this.fetchTaxEntryUrl =
      constant.api_url.depintFetchInterestTaxEntry +
      '?coy=' +
      this.taxEntrySectionForm?.getRawValue().companyCode?.toString().trim() +
      '&depositorId=' +
      this.taxEntrySectionForm?.getRawValue().depositorId?.trim() +
      '&receiptNum=' +
      data[0]?.toString().trim();
  }

  getRecieptNumbers() {
    this.recieptDyanPop =
      `dep_coy='${this.taxEntrySectionForm?.getRawValue().companyCode}'` +
      ` AND dep_depositor='${this.taxEntrySectionForm?.getRawValue().depositorId}'`;
    this.dynapop
      .getDynaPopListObj('FDRECEIPTNUM ', this.recieptDyanPop)
      .subscribe((res: any) => {
        this.recieptColumnHeader = [res.data.colhead1, res.data.colhead2];
        this.recieptTableData = res.data;
        this.recieptNumArray = [];
        this.updateRecieptNumArray(res.data.dataSet);
      });
  }

  //set focus if empty transer or transer starts with P
  setFocusIndex() {
    for (let i = 0; i < this.depintData.length; i++) {
      if (
        this.depintData[i].transer?.startsWith('P') ||
        !this.depintData[i].transer
      ) {
        this.focusDepInterest(i);
        break;
      }
    }
  }

  retreiveTaxEntryDetails() {
    if (this.taxEntrySectionForm.valid) {
      if (this.recieptTableData.dataSet.length == 0) {
        this.showErrorDialog(
          constant.ErrorDialog_Title,
          'Invalid Receipt number.',
          'error'
        );
        this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus();
      } else if (
        !(
          this.recieptNumArray.indexOf(
            this.taxEntrySectionForm?.getRawValue().recieptNum?.trim()
          ) > -1
        )
      ) {
        this.showErrorDialog(
          constant.ErrorDialog_Title,
          'Invalid Receipt number.',
          'error'
        );
        this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus();
      } else {
        this.fetchTaxEntryUrl =
          constant.api_url.depintFetchInterestTaxEntry +
          '?coy=' +
          this.taxEntrySectionForm?.getRawValue().companyCode?.toString().trim() +
          '&depositorId=' +
          this.taxEntrySectionForm?.getRawValue().depositorId?.trim() +
          '&receiptNum=' +
          this.taxEntrySectionForm?.getRawValue().recieptNum?.trim();
        this.loader = true;
        this.http
          .get(`${environment.API_URL}${this.fetchTaxEntryUrl}`)
          .pipe(
            take(1),
            finalize(() => {
              this.loader = false;
            })
          )
          .subscribe({
            next: (res: any) => {
              if (res.data) {
                this.depintData = res.data;
                this.dataSize = this.depintData.length;
                this.isRetreiveClicked = true;
                this.showAdd = true;
                this.showBack = true;
                this.showDelete = true;
                this.showSave = true;
                this.showRetrieve = false;
                this.showEdit = false;
                this.showList = false;
                this.showPrint = false;
                this.showExit = false;
                this.disableSave = false;
                this.entryIndexVal = this.depintData.length - 1;
                res.data.forEach(function (data:any){
                  data.isAdd = false;
                })
                this.setAccoutinyYear(res.data[res.data?.length - 1])
                this.setRetrieveData(res.data);
                //added disable
                //this.taxEntrySectionForm.disable();
                this.taxEntrySectionForm.controls.companyCode.disable();
                this.taxEntrySectionForm.controls.depositorId.disable();
                this.taxEntrySectionForm.controls.recieptNum.disable();
               this.setFocusIndex();
              } else {
                this.isRetreiveClicked = true;
                this.showAdd = true;
                this.showBack = true;
                this.showDelete = true;
                this.showSave = true;
                this.showRetrieve = false;
                this.showEdit = false;
                this.showList = false;
                this.showPrint = false;
                this.showExit = false;
                this.disableSave = false;
              }
            },
            error: () => {
              this.toastr.showError('Something went wrong');
              this.loader = false;
            },
          });
      }
    } else {
      this.toastr.showError('Please fill the form properly');
      this.taxEntrySectionForm.markAllAsTouched();
    }
  }

  checkIsDataEditable(startYear: any, endYear: any, uptoDateYear: any): boolean{
    
    console.log("Upto Date Year: ", uptoDateYear)
      if(uptoDateYear >= startYear && uptoDateYear <= endYear){
        return false;
      }
      else{
        return true;
      }
  }

  setAccoutinyYear(data: any){
    console.log("Testing", data?.intupto);
    
    let month = moment(data?.intupto, 'DD/MM/YYYY').format('M');
    let year = moment(data?.intupto, 'DD/MM/YYYY').format('Y');
    if(Number(month) >=1 && Number(month)<=3){
      this.startYear = Number(year)  -1;
      this.endYear = Number(year);
    }
    else{
      this.startYear = Number(year);
      this.endYear = Number(year) + 1;
    }
    console.log("StartYear: ", this.startYear)
    console.log("End Year: ", this.endYear)
  }

  setRetrieveData(fetchedApiData: any){
    for (var i = 0; i < fetchedApiData?.length; i++) {
      let disable = this.checkIsDataEditable(this.startYear, this.endYear, Number(moment(fetchedApiData[fetchedApiData?.length-1]?.intupto, 'DD/MM/YYYY').format('Y')))
      fetchedApiData[i].interestFromDate = moment(fetchedApiData[i]?.intfrom, 'DD/MM/YYYY').format('YYYY-MM-DD')
      fetchedApiData[i].interestToDate = moment(fetchedApiData[i]?.intupto, 'DD/MM/YYYY').format('YYYY-MM-DD')
      this.taxEntrySectionForm.controls.taxEntryData.push(this.fb.group({
        interestFromDate: new FormControl({value: fetchedApiData[i].interestFromDate, disabled: disable}, Validators.required),
        interestToDate: new FormControl( {value: fetchedApiData[i].interestToDate, disabled : disable }, Validators.required),
        interest: new FormControl<Number>({value: fetchedApiData[i].interest, disabled: disable }),
        tds: new FormControl<Number>({value: fetchedApiData[i].tds, disabled: disable}, Validators.required),
        chqnum: new FormControl<string>({value: fetchedApiData[i].chqnum, disabled: disable}, Validators.required),
        transer: new FormControl<string>({ value: fetchedApiData[i].transer, disabled: disable}, Validators.required),
        intfrom: new FormControl<string>({ value: fetchedApiData[i].intfrom, disabled: disable}),
        intupto: new FormControl<string>({ value: fetchedApiData[i].intupto, disabled: disable}),
        isAdd: new FormControl(false),
        oldChequeNum:new FormControl<string>(fetchedApiData[i].chqnum),
      }))
    }
  }

  get taxEntryDataForm() {
    return this.taxEntrySectionForm.get("taxEntryData") as FormArray;
  }

  addRow(){
    this.taxEntryDataForm.push(this.taxDetailInitRows())
    let length = this.taxEntryDataForm.length - 1;
    setTimeout(() => {
      let focusElement3 = document.getElementById(
        'intfrom_' + length
      ) as HTMLElement;
      this.renderer.selectRootElement(focusElement3).focus();
    }, 100);
    let uptoDate = moment(this.taxEntrySectionForm.controls.taxEntryData.at(length-1).get('interestToDate')?.value).add(1,'days');
    this.taxEntrySectionForm.controls.taxEntryData.at(length).get('interestFromDate')?.patchValue(uptoDate);
    this.taxEntrySectionForm.controls.taxEntryData.at(length).get('isAdd')?.patchValue(true);
    console.log(this.taxEntrySectionForm.controls.taxEntryData.value);
    
  }

  
  validateInvalidFormat(event: any, id: any, message: string,index:any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, event.target.value == null ? "Date is Required" : message, this.rendered.selectRootElement(`#${id+index}`)?.focus() ,"error")
    }
    else{
      let startDate = moment(this.taxEntrySectionForm.controls.taxEntryData.at(index).get('interestFromDate')?.value).format('YYYY-MM-DD')
      let endDate = moment(this.taxEntrySectionForm.controls.taxEntryData.at(index).get('interestToDate')?.value).format('YYYY-MM-DD')
      if (moment(startDate).isAfter(endDate)) {
        this.toastr.showError("Interest From Date Cannot be greater than upto Date")
        this.taxEntrySectionForm.controls.taxEntryData.at(index).get('interestToDate')?.reset()
        this.rendered.selectRootElement(`#${id+index}`)?.focus()
      }
    }
  }

  deleteRow(index: any){
    if(index > this.dataSize -1 || this.dataSize == 0){
      this.taxEntryDataForm.removeAt(index)
      setTimeout(() => {
        let focusElement3 = document.getElementById(
          'intfrom_' + (index-1)
        ) as HTMLElement;
        this.renderer.selectRootElement(focusElement3).focus();
      }, 100);
    }
    else{
      this.modalService.showErrorDialog(constant.ErrorDialog_Title, "This Rows cannot be deleted", "info")
    }
 
  }

  resetFormArray() {
    this.taxEntrySectionForm.controls.taxEntryData.clear();
  }

  checkIsCheckNumberEntered(index: any){
    let idString = 'input[id="chqnum_'+index+'"]'
    let cheqNum = this.taxEntryDataForm.at(index)?.get("chqnum")?.value;
    if(cheqNum == "" || cheqNum == null){
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Cheque Number Cannot be left blank", 
      this.el.nativeElement.querySelector(idString)?.focus()
      , "error")
    }
  }

  handleBackClick() {
    this.isRetreiveClicked = false;
    this.showAdd = false;
    this.showBack = false;
    this.showDelete = false;
    this.showSave = false;
    this.showRetrieve = true;
    this.showEdit = true;
    this.showList = true;
    this.showPrint = true;
    this.showExit = true;
    this.resetFormArray();
    this.taxEntrySectionForm.reset();
    this.taxEntrySectionForm.enable();
    this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus();
  }

  checkIsAmountValid(event: any, message: any) {
    if (event.target.value == '' || event.target.value == null) {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        message + ' Ammount cannot be left blank.',
        'error'
      );
    }
  }

  fetchInterestAndTDS(index : any){
    if(this.taxEntryDataForm.at(index).get("isAdd")?.value){
      let params = new HttpParams()
      .set("coy", this.taxEntrySectionForm?.controls.companyCode?.value!)
      .set("depositorId",this.taxEntrySectionForm?.controls.depositorId?.value!)
      .set("fromdate", moment(this.taxEntrySectionForm.controls.taxEntryData.at(index).get('interestFromDate')?.value).format('DD/MM/YYYY'))
      .set("receiptNum", this.taxEntrySectionForm?.controls.recieptNum?.value!)
      .set("todate", moment(this.taxEntrySectionForm.controls.taxEntryData.at(index).get('interestToDate')?.value).format('DD/MM/YYYY'))
      this.http
      .get(
        `${environment.API_URL}${constant.api_url.fetchInterestAndTDS}`,
        {params}
      ).pipe(
        take(1),
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res.status) {
            this.taxEntrySectionForm.controls.taxEntryData.at(index).get('interest')?.patchValue(res.data.interest);
            this.taxEntrySectionForm.controls.taxEntryData.at(index).get('tds')?.patchValue(res.data.tds);
           
          } else {
            this.modalService.showErrorDialog(
              constant.ErrorDialog_Title,
              res.message,
              'error'
            );
          }
        },
        error: () => {
        },
      });
    } 
  }

  updateTaxEntry() {
    if(this.taxEntryDataForm?.valid){
      this.loader = true;
      this.disableSave = true;
      this.http
        .put(
          `${environment.API_URL}${constant.api_url.updateTaxEntryData}`,
          this.taxEntryPayload()
        ).pipe(
          take(1),
          finalize(() => {
            this.loader = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.showErrorDialog(
                constant.ErrorDialog_Title,
                res.message,
                'info'
              );
            } else {
              let idString = 'input[id="transer_'+res.data+'"]'
              this.modalService.showErrorDialogCallBack(
                constant.ErrorDialog_Title, res.message, this.el.nativeElement.querySelector(idString)?.focus(),
                "error");
              this.disableSave = false;
            }
          },
          error: () => {
            this.disableSave = false;
          },
        });
    }   
    else{
      this.taxEntryDataForm.markAllAsTouched();
    }  
  }

  checkIsReadable(index: any) {
    if(!this.taxEntryDataForm.at(index)?.get('isAdd')?.value){
      let data = this.taxEntryDataForm.at(index)?.get('transer')?.value;
      if (data?.startsWith('D')) {
        return true;
      } else {
        return false;
      }
    }
    else{
      return false;
    }
   
  }

  resetFormArrayOnError(){
    for(let i =0; i < this.taxEntrySectionForm.controls.taxEntryData.length; i++){
      if(this.taxEntrySectionForm.controls.taxEntryData.at(i).get("isAdd")){
        this.taxEntrySectionForm.controls.taxEntryData.at(i).reset();
      }
    }
  }

  showErrorDialog(titleVal: any, message: string, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: '',
        type: type,
      },
    });
    dialogRef.afterOpened().subscribe(() => {
      console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      this.handleBackClick();
    });
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }
}
