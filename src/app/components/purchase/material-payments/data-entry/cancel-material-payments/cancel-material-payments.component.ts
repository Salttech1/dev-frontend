import { Component , OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'src/app/services/modalservice.service';
import { DataEntryService } from 'src/app/services/purch/data-entry.service';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';

@Component({
  selector: 'app-cancel-material-payments',
  templateUrl: './cancel-material-payments.component.html',
  styleUrls: ['./cancel-material-payments.component.css'],
})
export class CancelMaterialPaymentsComponent implements OnInit {

  bldg_condition = '';
  isDataRecieved : boolean = false;
  cancelMaterialPaymentForm : FormGroup = new FormGroup({
    partyCode: new FormControl('', Validators.required),
    buildingCode: new FormControl('', Validators.required),
    matGroup: new FormControl('', Validators.required),
  })
  queryForm: FormGroup = new FormGroup({
    userName: new FormControl<string[]>([], Validators.required),
    name: new FormControl<string | null>('', Validators.required),
    report: new FormControl<string>('BillsList.rpt', Validators.required),
    range: new FormGroup(
      {
        start: new FormControl<Date | null>(null, Validators.required),
        end: new FormControl<Date | null>(null, Validators.required),
      },
      Validators.required
    ),
  });

  loaderToggle: boolean = false;
  formName!: string;
  dtOptions!: any;
  headerOptions!: any;
  authData: any[] = [];
  testSelect: boolean = false;
  test: boolean =  true;
  detailRowClicked: any;
  headerRowClicked: any;
  isHeaderClicked: boolean = false;
  isHeaderDataRecieved: boolean = false;
  isDetailsClicked: boolean = true;
  authHeaderData: any[] =[];
  selectedAuthNum : any;
  selectedAuthTranser: any;
  selectedAuthStatus: any;
  cancelMaterialPaymentRequestBeanList: any[]= [];
  disableUpdate: boolean = true;


  constructor(
    private toastr: ToastrService,
    private dataEntryService: DataEntryService,
    private modalService: ModalService,
    private dialog: MatDialog,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    // get formname from pagedata Observable
    setTimeout(function() {
      document.getElementById("suppCode123")?.focus();
   }, 100);
   this.dtOptions = {
    pageLength: 10,
    processing: false,
    lengthChange: false,
    deferRender: false,
    bPaginate: true,
    bInfo: false,
    scrollY: '50vh',
    ordering: false,
    columnDefs: [ {
      "targets": [0,1,2,3,4,5,6,7,8,9],
      "orderable": false
      } ]
    
    //order: [[1, 'asc']]
  }

  this.headerOptions = {
    //   pageLength: 10,
       processing: false,
       lengthChange: false,
       deferRender: false,
      // bPaginate: true,
       bInfo: false,
       scrollY: '50vh',
       ordering: false,
       columnDefs: [ {
         "targets": [],
         "orderable": false
         } ],
      order: [[4, 'asc']]
     }

  }



  focusInputs(id: any) {
    setTimeout(() => {
      let focusElement3 = document.getElementById(id) as HTMLElement;
      this.renderer.selectRootElement(focusElement3).focus();
    }, 100);
  }

  retrieveAuthHeader(){
    if(this.cancelMaterialPaymentForm.valid){

      this.loaderToggle = true;
      let matGroupStr = this.cancelMaterialPaymentForm.get('matGroup')?.value instanceof Object ?
      this.cancelMaterialPaymentForm.get('matGroup')?.value[0][0].toString().trim() : this.cancelMaterialPaymentForm.get('matGroup')?.value.toUpperCase().toString().trim()
      this.dataEntryService.fetchAuthorisationDetailsByPartyAndBuildingAndMatGroup(this.cancelMaterialPaymentForm.get('partyCode')?.value[0][0].toString().trim(), 
      this.cancelMaterialPaymentForm.get('buildingCode')?.value[0][0].toString().trim(), matGroupStr).subscribe({
        next: (res: any) => {
          this.loaderToggle = false;
            if(res.status){
              console.log("Result : ", res.data)
              this.isDataRecieved = true;
              this.isHeaderClicked = true;
              this.authData = res.data;
              this.authData.forEach(function (data){
                 data.isSelected = false;
              })
              this.detailRowClicked = 0;
              this.selectedAuthNum = this.authData[0].authnum;
              this.cancelMaterialPaymentForm.get('partyCode')?.disable();
              this.cancelMaterialPaymentForm.get('buildingCode')?.disable();
              this.cancelMaterialPaymentForm.get('matGroup')?.disable();
              this.disableUpdate = false;
              this.focusInputs("activeChkBox_0");
            }
            else{
              this.showDialog("K Raheja Error", res.message, "info")
            }
         },
         complete: () =>{

         },
         error: () =>{
          this.loaderToggle = false;
         }
      })
    }
    else{
      this.cancelMaterialPaymentForm.markAllAsTouched();
      this.setFocusOnValidation();
    }
  }

  onEnterTriggerCheckedCount(event: any, data: any, index: any) {
      event.target.checked ? event.target.checked = false : event.target.checked = true
      this.authData[index].isSelected = event.target.checked
    
  }

  back(){
    this.cancelMaterialPaymentForm.reset();
    setTimeout(function() {
      document.getElementById("suppCode123")?.focus();
   }, 100);
   this.isDataRecieved = false;
   this.disableUpdate  = true;
   this.isHeaderClicked = false;
   this.isHeaderDataRecieved = false;
   this.isDetailsClicked = true;
   this.authData = [];
   this.authHeaderData = [];
   this.cancelMaterialPaymentForm.get('partyCode')?.enable();
   this.cancelMaterialPaymentForm.get('buildingCode')?.enable();
   this.cancelMaterialPaymentForm.get('matGroup')?.enable();
   this.detailRowClicked = 0;
   this.headerRowClicked = 0;
   this.selectedAuthNum = '';
   this.selectedAuthTranser = '';
   this.selectedAuthStatus = ''

  }

  changeDetailTableRowColor(idx: any) { 
    if(this.detailRowClicked === idx) this.detailRowClicked = -1;
    else this.detailRowClicked = idx;
    this.selectedAuthNum = this.authData[idx].authnum;
    this.selectedAuthTranser = this.authData[idx].transer ? this.authData[idx].transer : '';
    this.selectedAuthStatus = this.authData[idx].authstatus,
    this.checkIsAuthValidForCancelation(!this.authData[idx].isSelected);
    this.authData[idx].isSelected = !this.authData[idx].isSelected;   
  }

  changeHeaderTableRowColor(idx: any) { 
    if(this.headerRowClicked === idx) this.headerRowClicked = -1;
    else this.headerRowClicked = idx;
    console.log("Index:", idx)
  }
  
  tblSearch(inputid: string, tblName: string) {
    $(`#${inputid}`).on("keyup", (event: any) => {
      $(`#${tblName}`).DataTable().search(event?.target.value).draw();
    })
  }

  getHeaderDetails(){
    this.isDetailsClicked = false;
    this.isHeaderClicked = false;
    this.loaderToggle = true;
    this.dataEntryService.fetchAuthorisationDetailsByAuthNum(this.selectedAuthNum).subscribe({
      next: (res: any) => {
        this.loaderToggle = false;
        if(res.status){
          this.authHeaderData = res.data;
          this.isHeaderDataRecieved = true;
          this.headerRowClicked =  0
        }
        else{
          this.modalService.showErrorDialog("K Raheja Error", res.message, "info")
          this.backToDetailsPage();
        }
      },
      complete: () =>{

      },
      error: () =>{
        this.loaderToggle = false;
      }
    })
  
  }

  checkIsAuthValidForCancelation(validate: boolean){
    if(validate){
      this.dataEntryService.checkIsAuthorisationValid(this.selectedAuthTranser, this.selectedAuthStatus).subscribe({
        next: (res: any) => {
          if(res.status){
            
          }
          else{
            this.toastr.warning(res.message, '',  {
              disableTimeOut: true,
              tapToDismiss: false,
              closeButton: true,
            });
          }
         
        },
        complete: () =>{
  
        },
        error: () =>{
  
        }
      })
    }   
  }

  cancelMaterialPayment(){
    let cancelMaterialBeanRequestList: any[] = this.authData.filter((value) => value.isSelected )
    if(cancelMaterialBeanRequestList?.length > 0){
      this.disableUpdate = true;
      this.loaderToggle = true;
      this.dataEntryService.cancelMaterialPayment(cancelMaterialBeanRequestList).subscribe({
        next: (res: any) => {
          this.loaderToggle = false;
          if(res.status){
            this.showDialog(
              'Cancel Material Payment',
              res.message,
              'info'
            )
            // this.toastr.success(res.message, 'Success', {
            //   disableTimeOut: true,
            //   tapToDismiss: false,
            //   closeButton: true,
            // });
            // this.back();
          }
          else{
            this.toastr.error(res.message)
          }
        },
        complete: () =>{
  
        },
        error: () =>{
          this.loaderToggle =false;
          this.disableUpdate = false;
         
        }
      })
    }
   else{
    this.toastr.info("Please Select atleast one Authorisation", '', {
      disableTimeOut: true,
      tapToDismiss: false,
      closeButton: true,
    });
   }
  }

  setFocusOnValidation(){
    if(!this.cancelMaterialPaymentForm.get('partyCode')?.value.length){
      setTimeout(function() {
        document.getElementById("suppCode123")?.focus();
     }, 100);
    }
    else if(!this.cancelMaterialPaymentForm.get('buildingCode')?.value.length){
      setTimeout(function() {
        document.getElementById("building123")?.focus();
     }, 100);
    }
    else if(!this.cancelMaterialPaymentForm.get('matGroup')?.value.length){
      setTimeout(function() {
        document.getElementById("matGroup123")?.focus();
     }, 100);
    }

  }

  backToDetailsPage(){
    this.isDetailsClicked = true;
    this.isHeaderClicked = true;
    this.isHeaderDataRecieved = false;
  }

  showDialog(
    titleVal: any,
    message: string,
    type: string
  ) {
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
    dialogRef.afterClosed().subscribe((result: any) => {
      this.back();
      
    });
  }
}
