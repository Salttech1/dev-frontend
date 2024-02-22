import { Component, OnInit, Renderer2, ViewChild  } from '@angular/core';
import { FormGroup , FormControl} from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { environment } from 'src/environments/environment';
import { HttpClient , HttpParams} from '@angular/common/http';
import  * as constant from '../../../../../../constants/constant';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-yearendprocessing',
  templateUrl: './yearendprocessing.component.html',
  styleUrls: ['./yearendprocessing.component.css']
})
export class YearendprocessingComponent implements OnInit {

  compHeader!: any[];
  compData!: any;
  columnHeader!: any[];
  bringBackColumn!: number;
  coy_condition="coy_fdyn='Y'";
  loaderToggle: boolean = false;
  fromDate: any;
  uptoDate: any;
  disableProcess : boolean = false;
  @ViewChild(F1Component) comp!: F1Component;
  constructor(private dynapop: DynapopService, private renderer: Renderer2, private modalService: ModalService,
    private http: HttpClient, private dialog: MatDialog, private toastr: ToasterapiService,private router:Router) { }

  ngOnInit(): void {
    this.getCompanyList();
    this.setAccountingYear();
    this.yearEndProcessSectionForm.get('companyName')?.disable()
 
    this.yearEndProcessSectionForm.patchValue({
      processOption: 'I'
    })
  }

  ngAfterViewInit(): void {
    this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus(); //To add default focus on input field
  }

  yearEndProcessSectionForm = new FormGroup({
    companyCode: new FormControl(''),
    companyName: new FormControl(''),
    acyear: new FormControl(''),
    processOption: new FormControl('')
  })

  updateCompanyList(compData: any){
    this.yearEndProcessSectionForm.patchValue({
      companyName:compData[this.bringBackColumn].trim()
    })
  }

  focusField(fieldId: any) {
    let el = document.getElementById(fieldId)?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  getCompanyList(){
    this.dynapop.getDynaPopListObj("COMPANY","coy_fdyn='Y'").subscribe((res:any)=>{
      this.compHeader=[res.data.colhead1,res.data.colhead2,res.data.colhead3,res.data.colhead4,res.data.colhead5]
      this.compData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }

  setAccountingYear(){
    if((new Date().getMonth() + 1) >=4){
      this.yearEndProcessSectionForm.patchValue({
        acyear:(new Date().getFullYear()).toString() + "-" + (new Date().getFullYear() + 1).toString() 

      })
    }

    else{
      this.yearEndProcessSectionForm.patchValue({
        acyear:  (new Date().getFullYear() - 1).toString() + "-" +
        new Date().getFullYear().toString()
      })
    }

  }

  process(){
    if(this.validateData()){
      this.setFromAndToDate();
      this.loaderToggle = true;
      this.disableProcess = true;
      let params = new  HttpParams()
      .set("companyCode", `${this.yearEndProcessSectionForm?.get("companyCode")?.value}`)
      .set("fromDate", this.fromDate)
      .set("uptoDate", this.uptoDate)
      this.http.put(`${environment.API_URL}${this.setProcessAPIUrl()}`,{}, {params: params}).pipe(
        take(1),
        finalize(() => {
          this.loaderToggle = false;
        })
      ).subscribe({
        next: (res: any) => {
          this.loaderToggle = false
            if(res.status){
              this.showDialog(constant.ErrorDialog_Title, res.message, "info")
            }
        },
        error: (err: any) => {
          this.disableProcess = false;
        }})
    }   
  }

  setFromAndToDate(){
    console.log("AccYear" , this.yearEndProcessSectionForm.value.acyear)
    this.fromDate = "01/04/" + this.yearEndProcessSectionForm?.value.acyear?.split("-")[0]
    this.uptoDate = "31/03/" + this.yearEndProcessSectionForm?.value.acyear?.split("-")[1]
  }

  setProcessAPIUrl(){
    if(this.yearEndProcessSectionForm?.value.processOption == 'I' || this.yearEndProcessSectionForm?.value.processOption == 'R'){
       return constant.api_url.processInitialiseYTD
    }
    else{
      return constant.api_url.processRecalculateBrokerYTD
    }
  }

  handleBackClick(){
    this.yearEndProcessSectionForm.reset();
    this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus();
    this.disableProcess = false;
    this.ngOnInit();
  }

  handleReset(){
    this.yearEndProcessSectionForm.reset();
    this.renderer.selectRootElement(this.comp.fo1.nativeElement)?.focus()
    this.ngOnInit();
  }

  validateData(){
    if((this.yearEndProcessSectionForm.value.companyCode == "" || this.yearEndProcessSectionForm.value.companyCode == null) || 
    (this.yearEndProcessSectionForm.value.acyear == "" || this.yearEndProcessSectionForm.value.acyear == null)
    ){
      this.modalService.showErrorDialogCallBack("Error", "You have not selected options correctly", this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus(),"error");
      return false;
    }
   else{
    return true;
   }
  }

  showDialog(titleVal:any , message: string, type: string) {
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
    dialogRef.afterClosed().subscribe((result:any) => {
      console.log(result)
      this.handleBackClick();
    });
  }

  handleExit() {
    this.router.navigate(['/dashboard']);
  }
}
