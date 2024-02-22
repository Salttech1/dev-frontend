import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {
  disabledFlag!:Boolean
  @Input() getPrintFormGroup!:FormGroup
  @Output()loaderFlag=new EventEmitter<boolean>(false)
  constructor(private actionService:ActionservicesService,private reportService:CommonReportsService,private tostr:ToasterapiService) { }

  ngOnInit(): void {
    this.actionService.isPrintActionFlag.subscribe((res:any)=>{
      this.disabledFlag = res
    
    })
  }

  printData(){
    if(this.getPrintFormGroup.valid){
      this.getPrintFormGroup.value.isPrint = true
      this.loaderFlag.emit(true)
      this.reportService.getParameterizedPrintReport(this.getPrintFormGroup.value).subscribe((res:any)=>{
        if(res.status){
          this.loaderFlag.emit(false)
          this.tostr.showSuccess(res.message)
        }
        else {
          this.tostr.showError(res.message)
        }
      
      })
    }
    else{
      this.getPrintFormGroup.markAllAsTouched()
    }
  
  }
}
