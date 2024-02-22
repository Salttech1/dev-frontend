import { Component, OnInit , ViewChild, Renderer2, ChangeDetectorRef, HostListener} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';
import  * as constant from '../../../../../../constants/constant';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { fileConstants } from 'src/constants/fileconstants';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { take } from 'rxjs';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-mailinglistofdepositorandbroker',
  templateUrl: './mailinglistofdepositorandbroker.component.html',
  styleUrls: ['./mailinglistofdepositorandbroker.component.css']
})
export class MailinglistofdepositorandbrokerComponent implements OnInit {
  compHeader!: any[];
  compData!: any;
  columnHeader!: any[];
  bringBackColumn!: number;
  coy_condition="coy_fdyn='Y'";
  isDepositorSelected: boolean = true;
  isBrokerSelected: boolean = false;
  depositorTableData: any;
  deptColumnHeader!: any[];
  deptDyanPop!:string;
  loaderToggle: boolean = false;
  isViewClicked: boolean = false;
  initialSectionFormValue: any;
  brokerColumnHeader!: any[];
  brokerTableDate: any;
  broker_condition = ""

  @ViewChild(F1Component) comp!: F1Component;
  @ViewChild('formDirective') private formDirective!: NgForm;
  constructor(private dynapop: DynapopService, private modalService: ModalService, 
    private toastr: ToasterapiService,
    private commonReportService:CommonReportsService,
    private rendered: Renderer2, private changeDetectorRef: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.getCompanyList();
    this.initialSectionFormValue = this.mailDepositorAndBrokerSectionForm?.value;
    this.mailDepositorAndBrokerSectionForm.controls['reportParameters'].controls['companyName']?.disable();
  }

  ngAfterViewInit(): void {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus(); //To add default focus on input field
  }

  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  changeTypeSelection(event: any){
    if(event.target.value == 'D'){
      this.isDepositorSelected = true;
      this.isBrokerSelected = false;
    }
    else{
      this.isDepositorSelected = false;
      this.isBrokerSelected = true;
    }
    this.formDirective.resetForm();
    this.mailDepositorAndBrokerSectionForm.patchValue({
      name: fileConstants.mailingDepositorAndBroker,
      isPrint: false,
      seqId: event.target.value == 'D' ? 1 : 2,
      reportParameters:{
        listType: event.target.value,
        TxtTo: ''
      }    
    })
    this.focusField('company4');
  }

  mailDepositorAndBrokerSectionForm = new FormGroup({
    name: new FormControl(fileConstants.mailingDepositorAndBroker),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    reportParameters: new FormGroup({
      companyName: new FormControl(''),
      TxtCoyCode: new FormControl('', Validators.required),
      TxtFrom: new FormControl('',Validators.required),
      TxtTo: new FormControl('', Validators.required),
      listType: new FormControl('D'),

    }
    )
  })

  focusField(fieldId: any) {
    let el = document.getElementById(fieldId)?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  updateBrokerList(event: any){

  }

  updateCompanyList(compData: any){
    this.mailDepositorAndBrokerSectionForm.patchValue({
      reportParameters:{
        companyName:compData[this.bringBackColumn].trim()
      } 
    })
    if(this.mailDepositorAndBrokerSectionForm?.value.reportParameters?.listType == 'B'){
      this.getBrokersList();
    }
    else{
      this.getDepositorList(compData);
    } 
  }

  getDepositorList(compData: any){
    this.deptDyanPop = `deptr_coy='${compData[this.bringBackColumn - 1]}'`
    this.dynapop.getDynaPopListObj("DEPOSITORS",`deptr_coy='${compData[this.bringBackColumn - 1]}'`)
    .subscribe((res:any)=>{
     this.deptColumnHeader=[res.data.colhead1,res.data.colhead2,res.data.colhead3,res.data.colhead4,res.data.colhead5]
     this.depositorTableData = res.data
   })
  }
  updateFromDepositor(val:any){
    console.log("Comapny Called")
    this.mailDepositorAndBrokerSectionForm.patchValue({
      reportParameters :{
        TxtFrom: val[0].toString(),
      } 
    })
  }

  print(){
    if (this.mailDepositorAndBrokerSectionForm.valid) {
      this.mailDepositorAndBrokerSectionForm.value.isPrint = true
      this.loaderToggle = true
      this.commonReportService.getTtxParameterizedPrintReport(this.mailDepositorAndBrokerSectionForm.value).pipe(take(1)).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.loaderToggle = false
            this.toastr.showSuccess(res.message)
          }
          else {
            this.toastr.showError(res.message)
          }
        },
        error: (err: any) => {
          this.loaderToggle = false
        },
        complete: () => {
          this.loaderToggle = false
        }
      })
    }
    else {
      this.validateFields();
    }
  }

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }
  
  updateToDepositor(val:any){
    console.log("Comapny Called")
    this.mailDepositorAndBrokerSectionForm.patchValue({
      reportParameters : {
        TxtTo: val[0].toString()
      }
      
    })
  }

  getCompanyList(){
    this.dynapop.getDynaPopListObj("COMPANY","coy_fdyn='Y'").subscribe((res:any)=>{
      this.compHeader=[res.data.colhead1,res.data.colhead2,res.data.colhead3,res.data.colhead4,res.data.colhead5]
      this.compData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }

  
getBrokersList(){
  this.broker_condition = "brok_code LIKE " + "'" + this.mailDepositorAndBrokerSectionForm.value.reportParameters?.TxtCoyCode?.trim() + "%" + "'" 
  console.log("Broker Condition: ", this.broker_condition)
  this.dynapop.getDynaPopListObj("BROKERS",this.broker_condition)
  .subscribe((res:any)=>{
    this.brokerColumnHeader=[res.data.colhead1,res.data.colhead2]
    this.brokerTableDate = res.data
  })
}

getReport(print:boolean){
    if(this.validateFields()){
      this.loaderToggle = true;
      this.mailDepositorAndBrokerSectionForm.value.isPrint = false
      this.commonReportService.getTtxParameterizedReport(this.mailDepositorAndBrokerSectionForm.value).pipe(take(1)).subscribe({
        next: (res: any) => {
          this.loaderToggle = false
          let pdfFile = new Blob([res], { type: "application/pdf" });
          let fileName = this.commonReportService.getReportName();
          if (print) {
            const blobUrl = URL.createObjectURL(pdfFile);
            const oWindow = window.open(blobUrl, '_blank');
            oWindow?.print();
          } else {
            fileSaver.saveAs(pdfFile, fileName);
          }
        },
        error: (err: any) => {
          this.loaderToggle = false
        },
        complete: () => {
          this.loaderToggle = false
        }
      }
  
      )}
  }


  validateFields(){
    if(this.mailDepositorAndBrokerSectionForm.value.reportParameters?.TxtCoyCode == '' || this.mailDepositorAndBrokerSectionForm.value.reportParameters?.TxtCoyCode == null){
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Company Code cannot be left blank", this.focusField('company4'), "error");
      return false;
    }
    if(this.isDepositorSelected){
      if(this.mailDepositorAndBrokerSectionForm.value.reportParameters?.TxtFrom  == ''   || this.mailDepositorAndBrokerSectionForm.value.reportParameters?.TxtFrom  == null){
        this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "From Depositor Must Be Selected", this.focusField('depositor4'), "error");
        return false;
      }
      if(Number(this.mailDepositorAndBrokerSectionForm.value.reportParameters?.TxtFrom ) > Number(this.mailDepositorAndBrokerSectionForm.value.reportParameters?.TxtTo )){
        this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "From Depositor code cannot be greater than to depositor's code",this.focusField('depositor41'), "error");
        return false;
      }
      else{
        return true;
      }
    }
    if(this.isBrokerSelected){
      if(this.mailDepositorAndBrokerSectionForm.value.reportParameters?.TxtCoyCode == '' ||  this.mailDepositorAndBrokerSectionForm.value.reportParameters?.TxtCoyCode == null){
        this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Company Code cannot be left blank", this.focusField('company4'), "error");
        return false;
      }
      if(this.mailDepositorAndBrokerSectionForm.value.reportParameters?.TxtFrom  == '' || this.mailDepositorAndBrokerSectionForm.value.reportParameters?.TxtFrom  == null){
        this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "From Broker Must Be Selected", this.focusField('broker4'), "error");
        return false;
      }
      if(this.mailDepositorAndBrokerSectionForm.value.reportParameters?.TxtFrom > this.mailDepositorAndBrokerSectionForm.value.reportParameters?.TxtTo!){
        this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "From Broker code cannot be greater than to broker's code",this.focusField('broker41'), "error");
        return false;
      }
      else{
        return true;
      }
    }
    else{
      return true;
    }
  }
}
