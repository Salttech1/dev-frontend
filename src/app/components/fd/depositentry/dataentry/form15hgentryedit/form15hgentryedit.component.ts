import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import { environment } from 'src/environments/environment';
import * as constant from '../../../../../../constants/constant';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/services/modalservice.service';
import { finalize, pipe, take } from 'rxjs';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { ServiceService } from 'src/app/services/service.service';

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
  selector: 'app-form15hgentryedit',
  templateUrl: './form15hgentryedit.component.html',
  styleUrls: ['./form15hgentryedit.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class Form15hgentryeditComponent implements OnInit {
  compHeader!: any[];
  compData!: any;
  depositorTableData: any;
  deptDyanPop: any;
  deptColumnHeader!: any[];
  quaterColumnHeader!: any[];
  quaterData!: any;
  columnHeader!: any[];
  bringBackColumn!: number;
  coy_condition = "coy_fdyn='Y'";
  quarter_condition = '';
  isRetreiveClicked: boolean = false;
  isAddClicked: boolean = false;
  isDeleteClicked: boolean = false;
  showSave: boolean = false;
  form15hgdetails: any;
  datePipe = new DatePipe('en-US');
  form15hgPayloadData: any;
  enableBack: boolean = true;
  isDepositorSelected: boolean = false;
  startDate!: any;
  endDate!: any;
  isDataPresent: any;
  declarationDate: any;
  isDataAdded: boolean = false;
  isDataDeleted: boolean = false;
  isDataRetrieved: boolean = false;
  isDepositorPresent: boolean = true;
  readonlyAttr: boolean = true;
  loader: boolean = false;

  constructor(
    private dynapop: DynapopService,
    private http: HttpClient,
    private renderer: Renderer2,
    private cdref: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private modalService:ModalService,
    private toastr:ToasterapiService
  ) {}

  ngOnInit(): void {
    this.getCompanyList();
    this.getQuaterList();
    this.setCurrentQuarter();
    this.setAccountingYear();
    // this.form15hgSectionEntryForm.get('companyName')?.disable();
    // this.form15hgSectionEntryForm.get('quaterName')?.disable();
    this.focusDepositorField();
  }

  focusDepositorField() {
    setTimeout(() => {
      let focusElement3 = document.getElementById('depositor12')
        ?.childNodes[0] as HTMLElement;
      this.renderer.selectRootElement(focusElement3).focus();
    }, 100);
  }

  focusCompanyField() {
    setTimeout(() => {
      let focusElement3 = document.getElementById('company4')
        ?.childNodes[0] as HTMLElement;
      this.renderer.selectRootElement(focusElement3).focus();
    }, 100);
  }

  focusAssesYearField() {
    setTimeout(() => {
      this.renderer
        .selectRootElement(document.getElementById('test123') as HTMLInputElement)?.focus();
    }, 100);
  }

  scrollPage(height: number) {
    window.scrollTo(0, height);
  }

  checkIsDepositorSelected() {
    this.isDepositorSelected = true;
    if (
      this.form15hgSectionEntryForm?.value.depositorId == '' ||
      this.form15hgSectionEntryForm?.value.depositorId == null
    ) {
      // this.form15hgSectionEntryForm.patchValue({
      //   formType: 'H',
      // });
      this.isDepositorSelected = false;
      // this.showErrorDialog(
      //   constant.ErrorDialog_Title,
      //   'Invalid depositor title',
      //   'error',
      //   false
      // );
      return ;
    } else {
      this.setDepositorName();
      this.isDepositorSelected = true;
      return true;
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
    this.generateForm15hgPayload();
  }

  generateForm15hgPayload() {
    this.form15hgPayloadData = {
      userid: sessionStorage.getItem('userName'),
      uniqueid: this.form15hgDetailsForm?.value.uniqueid,
      assessyear: this.form15hgDetailsForm?.value.assessyear,
      estimatedIncome: this.form15hgDetailsForm?.value.estimatedIncome,
      estimatedtotIncome: this.form15hgDetailsForm?.value.estimatedtotIncome,
      totalFormFiled: this.form15hgDetailsForm?.value.totalFormFiled,
      incomeFormFiled: this.form15hgDetailsForm?.value.incomeFormFiled,
      assessedyn: this.form15hgDetailsForm?.value.assessedyn,
      amtincomepaid: this.form15hgDetailsForm?.value.amtincomepaid,
      fifteenhg: this.form15hgSectionEntryForm?.value.formType,
      dateIncomePaid: this.setStringFormattedDate(
        this.form15hgDetailsForm?.value.dateIncomePaid
      ),
      datedeclReceived: this.setStringFormattedDate(
        this.form15hgDetailsForm?.value.datedeclReceived
      ),
      quarter: this.form15hgSectionEntryForm?.value.quaterId?.trim(),
      depositor: this.form15hgSectionEntryForm?.value.depositorId,
      acyear: this.form15hgSectionEntryForm?.value.acyear,
      coy: this.form15hgSectionEntryForm?.value.companyCode,
    };
    return this.form15hgPayloadData;
  }

  form15hgSectionEntryForm = new FormGroup({
    companyCode: new FormControl(''),
    companyName: new FormControl(''),
    acyear: new FormControl(''),
    depositorId: new FormControl('',  Validators.required),
    depositorName: new FormControl(''),
    quaterId: new FormControl(''),
    quaterName: new FormControl(''),
    formType: new FormControl('H'),
  });

  form15hgDetailsForm = new FormGroup({
    uniqueid: new FormControl(''),
    assessyear: new FormControl('', Validators.maxLength(4)),
    estimatedIncome: new FormControl(),
    estimatedtotIncome: new FormControl(),
    totalFormFiled: new FormControl(),
    incomeFormFiled: new FormControl(),
    assessedyn: new FormControl(''),
    amtincomepaid: new FormControl(),
    dateIncomePaid: new FormControl(),
    datedeclReceived: new FormControl(),
  });

  handleRetrieveClick() {
      this.isRetreiveClicked = true;
      this.retrieveFormDetails(false);
  }
  getCompanyList() {
    this.form15hgSectionEntryForm.patchValue({
      companyCode: 'UNIQ',
    });
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
        this.setDefaultCompanyName();
        this.getDepositorList(this.form15hgSectionEntryForm?.value.companyCode);
      });
  }

  setAccountingYear() {
    if (new Date().getMonth() + 1 >= 4) {
      this.form15hgSectionEntryForm.patchValue({
        acyear:
            (new Date().getFullYear()).toString() +
             ( new Date().getFullYear() +  1 ).toString(),
      });
    }
    else{
      this.form15hgSectionEntryForm.patchValue({
        acyear:  (new Date().getFullYear() - 1).toString() +
        new Date().getFullYear().toString()
      })
    }
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

  updateCompanyList(compData: any) {
    this.form15hgSectionEntryForm.patchValue({
      companyName: compData[this.bringBackColumn].trim(),
    });
  }
  updateDepositorList(depData: any) {
    this.form15hgSectionEntryForm.patchValue({
      depositorName: depData[this.bringBackColumn].trim(),
    });
  }

  handleSaveClick() {
      if (this.isRetreiveClicked ) {
        this.updateForm15hgDetails();
      }
      if (this.isAddClicked) {
        this.addForm15hg();
      }
      if (this.isDeleteClicked) {
        this.showErrorDialog(
          'Confirmation',
          'Are you sure to delete this row from database?',
          'question',
          true
        );
        }
  }

  updateForm15hgDetails() {
    this.loader = true;
    this.showSave = false;
    console.log("Update Called")
    this.http
      .put(
        `${environment.API_URL}${constant.api_url.updateForm15hgDetails}`,
        this.form15hgPayloadData
      ).pipe(
        take(1),
        finalize(() => {
          this.loader = false;
        })
      ) .subscribe({
        next: (res:any) => {
          this.showErrorDialog(
            constant.ErrorDialog_Title,
            res.message,
            res.status ? 'info' : 'error',
            false
          );
        },
        error: () => {
          this.showSave = true;
        },
      });
  }

  setDefaultCompanyName() {
    console.log('Company Data', this.compData);
    for (let i = 0; i < this.compData.dataSet.length; i++) {
      if (
        this.compData.dataSet[i][0].startsWith(
          this.form15hgSectionEntryForm?.value.companyCode
        )
      ) {
        this.form15hgSectionEntryForm.patchValue({
          companyName: this.compData.dataSet[i][1].trim(),
        });
      }
    }
  }

  getQuaterList() {
    this.dynapop.getDynaPopListObj('FDTDSQ', '').subscribe((res: any) => {
      console.log('Result ', res.data.colhead1);
      this.quaterColumnHeader = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.quaterData = res.data;
      this.bringBackColumn = res.data.bringBackColumn;
      this.setCurrentQuarter();
    });
  }

  setDepositorName() {
    console.log('Data: ', this.depositorTableData.dataSet);
    for (let i = 0; i < this.depositorTableData.dataSet.length; i++) {
      if (
        this.depositorTableData.dataSet[i][0].startsWith(
          this.form15hgSectionEntryForm?.value.depositorId
        )
      ) {
        this.form15hgSectionEntryForm.patchValue({
          depositorName: this.depositorTableData.dataSet[i][1],
        });
      }
    }
  }

  updateQuarter() {
    this.setQuarterName(this.form15hgSectionEntryForm?.value.quaterId);
  }

  retrieveFormDetails(isAddClicked: boolean) {

    this.updateQuarter();
    this.focusAssesYearField();
    this.form15hgdetails = [];
    this.isDataRetrieved = false;
    this.form15hgDetailsForm.reset();
    if (this.checkIsDepositorSelected()) {
      if (
        this.form15hgSectionEntryForm?.value.depositorName == null ||
        this.form15hgSectionEntryForm?.value.depositorName == ''
      ) {
        this.setDepositorName();
      }

      if(!this.isAddClicked){
        this.loader = true;
      this.http
        .get(`${environment.API_URL}${constant.api_url.fetchForm15hgDetails}`, {
          params: this.setRequestParams(),
        })
        .pipe(
          take(1),
          finalize(() => {
            this.loader = false;
          })
        )
        .subscribe({
          next: (res:any) => {
            if (res.status) {
              this.form15hgdetails = res.data[0];
              this.showSave = true;
              this.enableBack = false;
              this.setRetreivedData();
              this.fetchDepositor15hg();
              this.isDataRetrieved = true;
              if (isAddClicked) {
                this.resetButtuons();
              }
            }
            if (!res.status && !isAddClicked) {
              this.showErrorDialog('No Data', res.message, 'error', false);
            }
          },
          error: () => {
          },});
      }
    }
  }
  setCurrentQuarter() {
    let currentMonth = new Date().getMonth() + 1;
    let currentQuarter: string = '';
    if (currentMonth >= 4 && currentMonth <= 6) {
      currentQuarter = 'Q1';
    }
    if (currentMonth >= 7 && currentMonth <= 9) {
      currentQuarter = 'Q2';
    }
    if (currentMonth >= 10 && currentMonth <= 12) {
      currentQuarter = 'Q3';
    }
    if (currentMonth >= 1 && currentMonth <= 3) {
      currentQuarter = 'Q4';
    }
    this.form15hgSectionEntryForm.patchValue({
      quaterId: currentQuarter,
    });
    this.setQuarterName(this.form15hgSectionEntryForm?.value.quaterId);
  }

  setRetreivedData() {
    this.form15hgDetailsForm.patchValue({
      uniqueid: this.form15hgdetails?.uniqueid,
      assessyear: this.form15hgdetails?.assessyear,
      estimatedIncome: this.form15hgdetails?.estimatedIncome,
      estimatedtotIncome: this.form15hgdetails?.estimatedtotIncome,
      totalFormFiled: this.form15hgdetails?.totalFormFiled,
      incomeFormFiled: this.form15hgdetails?.incomeFormFiled,
      assessedyn: this.form15hgdetails?.assessedyn,
      amtincomepaid: this.form15hgdetails?.amtincomepaid,
      // dateIncomePaid: this.getFormattedDate(
      //   this.form15hgdetails?.dateIncomePaid
      // ),
      dateIncomePaid:  this.form15hgdetails?.dateIncomePaid,
      datedeclReceived: this.getFormattedDate(
        this.form15hgdetails?.datedeclReceived
      ),
    });
  }

  setAddData(data: any) {
    this.form15hgDetailsForm.patchValue({
      uniqueid: data?.uniqueid,
      amtincomepaid: data?.amtincomepaid,
      dateIncomePaid: new Date(data?.dateIncomePaid),
      datedeclReceived: this.getFormattedDate(this.declarationDate),
      assessedyn: 'N',
    });
  }

  handleAddClick() {
      this.isAddClicked = true
    if (this.checkIsDepositorSelected()) {
      this.retrieveFormDetails(true);
      if (this.form15hgdetails.length == 0) {
        this.fetchForm15hgAddData();
      }
    }
    
  }

  addForm15hg() {
    this.isDataAdded = false;
    this.loader = true;
    this.showSave = false;
    console.log("Add Form15hgCalled")
    this.http
      .post(
        `${environment.API_URL}${constant.api_url.addForm15hg}`,
        this.form15hgPayloadData
      ).pipe(
        take(1),
        finalize(() => {
          this.loader = false;
        })
      ).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.showErrorDialog(
              constant.ErrorDialog_Title,
              res.message,
              'info',
              false
            );
            this.isDataAdded = true;
          } else {
            this.showErrorDialog(
              constant.ErrorDialog_Title,
              res.message,
              'error',
              false
            );
            this.showSave = true;
          }
        },
        error: () => {
          this.showSave = true;
        },
      });
  }
  fetchDepositor15hg() {
    let params = new HttpParams()
      .set(
        'depositorId',
        `${this.form15hgSectionEntryForm?.get('depositorId')?.value}`
      )
      .set(
        'companyCode',
        `${this.form15hgSectionEntryForm?.get('companyCode')?.value}`
      );
    this.http
      .get(`${environment.API_URL}${constant.api_url.form15hgdepositor}`, {
        params: params,
      })
      .subscribe((res: any) => {
        if (res.status) {
          if (res.data.tds15gyn == 'Y') {
            this.form15hgSectionEntryForm.patchValue({
              formType: 'G',
            });
          } else {
            this.form15hgSectionEntryForm.patchValue({
              formType: 'H',
            });
          }
        }
      });
  }

  fetchForm15hgAddData() {
    this.http
      .get(
        `${environment.API_URL}${constant.api_url.fetchForm15hgAddDetails}`,
        {
          params: this.setRequestParams()
        }
      ).
      pipe(take(1)).subscribe({
        next:(res:any)=>{
        if (res.status) {
          this.setAddData(res.data);
          this.showSave = true;
          this.isAddClicked = true;
          this.enableBack = false;
          this.isRetreiveClicked = false;
          this.form15hgSectionEntryForm.patchValue({
            formType:res.data.form15hg
          })
        }
        else{
          this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title,res.message,(document.getElementById("depositor12")?.childNodes[0] as HTMLInputElement)?.focus(),"error")
          this.form15hgSectionEntryForm.patchValue({
            depositorId:'',
            depositorName:''
          })
          this.showSave = false;
          this.isAddClicked = false;
          this.enableBack = true;
          this.isRetreiveClicked = true;
        }
      },
      error:(res:any)=>{
        this.toastr.showError("something went wrong")
      }
      });
  }

  handleDeleteClick() {
      this.retrieveFormDetails(false);
    this.isDeleteClicked = true;    
  }
  deleteForm15hg() {
    this.isDataDeleted = false;
    this.loader = true;
    this.showSave = false;
    this.http
      .delete(`${environment.API_URL}${constant.api_url.deleteForm15hg}`, {
        params: this.setRequestParams(),
      })
      .pipe(
        take(1),
        finalize(() => {
          this.loader = false;
        })
      ).subscribe({
        next: (res:any) => {
          this.showErrorDialog(
            constant.ErrorDialog_Title,
            res.message,
            res.status ? 'info' : 'error',
            false
          );
          this.isDataDeleted = res.status;
        },
        error: () => {
        },
      });
  }

  setRequestParams() {
    let params = new HttpParams()
      .set(
        'depositorId',
        `${this.form15hgSectionEntryForm?.get('depositorId')?.value}`
      )
      .set(
        'companyCode',
        `${this.form15hgSectionEntryForm?.get('companyCode')?.value}`
      )
      .set(
        'accountYear',
        `${this.form15hgSectionEntryForm?.get('acyear')?.value}`
      )
      .set(
        'quater',
        `${this.form15hgSectionEntryForm?.get('quaterId')?.value}`
      );
    return params;
  }
  setQuarterName(quarterCode: any) {
    let currentYear = new Date().getFullYear();
    let currentQuarterName: string = '';
    if (quarterCode.startsWith('Q1')) {
      currentQuarterName = 'First Quarter';
      this.declarationDate = '04-01-' + currentYear.toString();
    }
    if (quarterCode.startsWith('Q2')) {
      currentQuarterName = 'Second Quarter';
      this.declarationDate = '07-01-' + currentYear.toString();
    }
    if (quarterCode.startsWith('Q3')) {
      currentQuarterName = 'Third Quarter';
      this.declarationDate = '10-01-' + currentYear.toString();
    }
    if (quarterCode.startsWith('Q4')) {
      currentQuarterName = 'Fourth Quarter';
      if (new Date().getMonth() + 1 > 3) {
        this.declarationDate = '01-01-' + (currentYear + 1).toString();
      } else {
        this.declarationDate = '01-01-' + currentYear.toString();
      }
    }
    this.form15hgSectionEntryForm.patchValue({
      quaterName: currentQuarterName,
    });
  }

  getFormattedDate(stringDate: any) {
    return new Date(
      `${stringDate.split('/')[2]}-${stringDate.split('/')[1]}-${
        stringDate.split('/')[0]
      }`
    );
  }

  setStringFormattedDate(date: any) {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  handleBackClick() {
      this.resetButtuons();
      // this.form15hgSectionEntryForm.get('companyName')?.disable();
      // this.form15hgSectionEntryForm.get('quaterName')?.disable();
      this.form15hgSectionEntryForm.patchValue({
        depositorId:'',
        depositorName:''
      })
  }

  resetButtuons() {
    this.isRetreiveClicked = false;
    this.isAddClicked = false;
    this.isDeleteClicked = false;
    this.showSave = false;
    this.enableBack = true;
    this.focusDepositorField();
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  showErrorDialog(
    titleVal: any,
    message: string,
    type: string,
    confirmationDialog: boolean
  ) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: '',
        type: type,
        confirmationDialog: confirmationDialog,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('Result: ', result);
      if (result && this.isDeleteClicked) {
        this.deleteForm15hg();
      }
      if (result || result == undefined) {
        if (this.isDataAdded || this.isDataDeleted || this.isDataRetrieved) {
          this.resetButtuons();
          this.form15hgSectionEntryForm.patchValue({
            depositorId:'',
            depositorName:''
          })
        }
      } else if (!this.isDepositorSelected) {
        this.focusDepositorField();
        this.form15hgSectionEntryForm.patchValue({
          depositorId:'',
          depositorName:''
        })
      }
    });
  }
}
