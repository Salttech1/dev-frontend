import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { fileConstants } from 'src/constants/fileconstants';
import * as fileSaver from 'file-saver';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ServiceService } from 'src/app/services/service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicle-history',
  templateUrl: './vehicle-history.component.html',
  styleUrls: ['./vehicle-history.component.css']
})
export class VehicleHistoryComponent implements OnInit {
  loaderToggle: boolean = false;

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router, private _service: ServiceService,
    private toastr: ToastrService,
    private rendered: Renderer2,
  ) { }

  ngOnInit(): void {
    setTimeout(function() {
      document.getElementById("fromDateField")?.focus();
   }, 100);
    this._service.pageData.subscribe({
      next: (val) => {
        this.VehHistorySelectionform.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
            
          },
        });
      },
    });
  }

  VehHistorySelectionform = new FormGroup({
    name: new FormControl(fileConstants.vehicleHistory),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    conditionId: new FormControl(1),
    isdisposed: new FormControl(false),
    
    reportParameters: new FormGroup({
      formname: new FormControl(''), 
      head: new FormControl(''),
      Frmdate: new FormControl('',Validators.required),
      ToDate: new FormControl('',Validators.required),
      TxtFrmDate: new FormControl<String>(''),
      TxtToDate: new FormControl<String>(''),
    })
  })

  checkBoxToggle(event: any) {
    if (event.key === "Enter") {
      event.preventDefault()
      event.target.checked ? event.target.checked = false : event.target.checked = true
    }
  }

  handleExitClick(){
    this.router.navigate(['/dashboard'])
  }

  getReport(print: boolean){
    if (this.VehHistorySelectionform.valid){
    this.loaderToggle = true;
    let dispose = this.VehHistorySelectionform.get('isdisposed')?.value;
    console.log(dispose)
    dispose ? this.VehHistorySelectionform.patchValue({conditionId : 2}) : this.VehHistorySelectionform.patchValue({conditionId : 1})
    // debugger
    this.setReportValues()
    this.commonReportService.getTtxParameterizedReportWithCondition(this.VehHistorySelectionform.value).pipe(take(1)).subscribe({
      next: (res: any) => {
        console.log("res",res);
        
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
    })
  } else {
    this.toastr.error('Please fill the input properly')
  }

  }

  validateInvalidFormat(event: any, id: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.toastr.error("Please Enter Valid Date")
      this.rendered.selectRootElement(`#${id}`)?.focus();
    }
    else{
        let startDate = moment(this.VehHistorySelectionform.get("reportParameters.Frmdate")?.value).format('YYYY-MM-DD')
        let endDate = moment(this.VehHistorySelectionform.get("reportParameters.ToDate")?.value).format('YYYY-MM-DD')
        console.log(endDate)
        if (moment(startDate).isAfter(endDate)) {
          this.toastr.error("To Date Should not be Less than From Date")
          this.VehHistorySelectionform.get("reportParameters.ToDate")?.reset()
          this.rendered.selectRootElement(`#${id}`)?.focus()
        }
    } 
  }


  setReportValues() {
    // this.fetchCompanyCloseDate();
    this.VehHistorySelectionform.patchValue({
      reportParameters: {
        TxtFrmDate: moment(this.VehHistorySelectionform.controls['reportParameters'].controls['Frmdate'].value,'YYYY-MM-DD').format('DD/MM/YYYY'),
        TxtToDate: moment(this.VehHistorySelectionform.controls['reportParameters'].controls['ToDate'].value,'YYYY-MM-DD').format('DD/MM/YYYY'),
        head: `'For Period ${moment(this.VehHistorySelectionform.controls['reportParameters'].controls['Frmdate'].value,'YYYY-MM-DD').format('DD/MM/YYYY')} To ${moment(this.VehHistorySelectionform.controls['reportParameters'].controls['ToDate'].value,'YYYY-MM-DD').format('DD/MM/YYYY')}'`
      },
    });
  }

}
