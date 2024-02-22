
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynapopService } from 'src/app/services/dynapop.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import  * as constant from '../../../../../../constants/constant';
import { environment } from 'src/environments/environment';
import { CommonReportsService } from 'src/app/services/reports.service';
import * as fileSaver from 'file-saver';
import { fileConstants } from 'src/constants/fileconstants';
import { take } from 'rxjs';
import { ServiceService } from 'src/app/services/service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicleexpense-workcodewise',
  templateUrl: './vehicleexpense-workcodewise.component.html',
  styleUrls: ['./vehicleexpense-workcodewise.component.css']
})
export class VehicleexpenseWorkcodewiseComponent implements OnInit {

  @ViewChild(F1Component) initFocus!: F1Component;
  
  WorkcodewiseSelectionform = new FormGroup({
    name: new FormControl(fileConstants.vehicleWorkCodeWise),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    reportParameters: new FormGroup({
    formname: new FormControl(''),
    TxtWorkCode: new FormControl<String>('',Validators.required),
    workcodedesc: new FormControl<String>(''),
    }
   )
  })
  
  loaderToggle: boolean =false;
  WorkcodeColHeadings!: any[];
  WorkcodeF1List: any;
  WorkcodeF1Bbc: any;
  

  constructor(
    private dynapop: DynapopService,
    private router: Router,
    private commonReportService: CommonReportsService,
    private _service: ServiceService,
    private rendered: Renderer2,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.createF1DataForWorkCode();
    this.WorkcodewiseSelectionform.controls['reportParameters'].controls['workcodedesc'].disable();
    this._service.pageData.subscribe({
      next: (val) => {
        this.WorkcodewiseSelectionform.patchValue({
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

  createF1DataForWorkCode() {
    // Method to create F1 for Workcode List
    this.dynapop.getDynaPopListObj('VEHWORK', '').subscribe((res: any) => {
      this.WorkcodeColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.WorkcodeF1List = res.data;
      this.WorkcodeF1Bbc = res.data.bringBackColumn;
    });
  }

  getDescForworkcodedesc(e: any) {
    // Used this method in html to initialise workcodedesc after selecting value from F1
    if (e.length) {
      this.WorkcodewiseSelectionform.patchValue({
       reportParameters :{
        workcodedesc: e[1],
       }
      
      });
    }
  }

  handleExitClick(){
    this.router.navigate(['/dashboard'])
  }

  getReport(print: boolean){
    if (this.WorkcodewiseSelectionform.valid){
      this.loaderToggle = true;
      this.commonReportService.getTtxParameterizedReport(this.WorkcodewiseSelectionform.value).pipe(take(1)).subscribe({
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
      )}else{
        this.toastr.error('Please fill the input properly')
        this.rendered.selectRootElement(this.initFocus.fo1.nativeElement).focus();
      }
    }
  }


