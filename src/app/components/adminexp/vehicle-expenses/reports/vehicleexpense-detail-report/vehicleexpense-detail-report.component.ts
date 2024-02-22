import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynapopService } from 'src/app/services/dynapop.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { fileConstants } from 'src/constants/fileconstants';
import { take } from 'rxjs';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicleexpense-detail-report',
  templateUrl: './vehicleexpense-detail-report.component.html',
  styleUrls: ['./vehicleexpense-detail-report.component.css']
})
export class VehicleexpenseDetailReportComponent implements OnInit {

  @ViewChild(F1Component) initFocus!: F1Component;
  
  loaderToggle: boolean = false;
  VehnumColHeadings!: any[];
  VehnumF1List: any;
  VehnumF1Bbc: any;

  constructor(
    private dynapop: DynapopService,
    private _service: ServiceService,
    private rendered: Renderer2,
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.createF1DataForWorkCode();
    this.VehnumSelectionform.controls['reportParameters'].controls['vehownerdesc'].disable();
    this._service.pageData.subscribe({
      next: (val) => {
        this.VehnumSelectionform.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
  }

  ngAfterViewInit(): void {
    this.rendered.selectRootElement(this.initFocus.fo1.nativeElement).focus();
  }

  VehnumSelectionform = new FormGroup({
    name: new FormControl(fileConstants.vehicleExpenseDetail),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      TxtVehicleNo: new FormControl<String>('',Validators.required),
      vehownerdesc: new FormControl<String>(''),
    })
  })

  createF1DataForWorkCode() {
    // Method to create F1 for Workcode List
    this.dynapop.getDynaPopListObj('VEHNUM', '').subscribe((res: any) => {
      this.VehnumColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.VehnumF1List = res.data;
      this.VehnumF1Bbc = res.data.bringBackColumn;
    });
  }

  getDescForVehnumdesc(e: any) {
    // Used this method in html to initialise workcodedesc after selecting value from F1
    if (e.length) {
      this.VehnumSelectionform.patchValue({
       reportParameters :{
        vehownerdesc: e[1],
       }
      
      });
    }
  }

  handleExitClick(){
    this.router.navigate(['/dashboard'])
  }

  getReport(print: boolean){
    if (this.VehnumSelectionform.valid){
    this.loaderToggle = true;
    this.commonReportService.getTtxParameterizedReport(this.VehnumSelectionform.value).pipe(take(1)).subscribe({
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
    })
  } else {
    this.toastr.error('Please fill the input properly')
    this.rendered.selectRootElement(this.initFocus.fo1.nativeElement).focus();
  }
  }

}
