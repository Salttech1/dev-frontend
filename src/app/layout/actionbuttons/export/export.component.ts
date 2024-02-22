import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import * as fileSaver from 'file-saver';
import { HttpStatusCode,HttpResponse, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { ToasterapiService } from 'src/app/services/toasterapi.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
  disabledFlag!:Boolean
  @Input() getExportFormGroup!:FormGroup
  @Output()loaderFlag=new EventEmitter<boolean>(false)
 
  constructor(private actionService:ActionservicesService,private reportService:CommonReportsService,private toastr:ToasterapiService) { }

  ngOnInit(): void {
    this.actionService.isExportActionFlag.subscribe((res:any)=>{
      this.disabledFlag=res
    })
  }

  getReportName(){
    var month:any = new Date().getMonth()+1
    if(month < 10 ){ month = "0"+ month}
      return `${sessionStorage.getItem('lastLevel')?.toLowerCase().replace(/\s/g, '')}_${new Date().getFullYear()}${month}${new Date().getDate()}${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
  }

  exportData(){
    console.log("formgroup",this.getExportFormGroup)
    if(this.getExportFormGroup.valid){
      this.getExportFormGroup.value.isPrint = false
      this.loaderFlag.emit(true)
      this.reportService.getParameterizedReport(this.getExportFormGroup.value).subscribe((res:any)=>{
            this.loaderFlag.emit(false)
            let pdf = new Blob([res], { type: "application/pdf" });
            let filename =  this.getReportName();
            fileSaver.saveAs(pdf, filename);
      },
      (error:HttpErrorResponse)=>{
        if(error.status===404){     
          console.log("error")
          this.loaderFlag.emit(false)
          this.toastr.showError("No Records Found")
        }
      })
   }
    else{
      this.getExportFormGroup.markAllAsTouched()
    }
  }

}
