import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { DynapopService } from 'src/app/services/dynapop.service';

@Component({
  selector: 'app-checklist-negoagmtdates',
  templateUrl: './checklist-negoagmtdates.component.html',
  styleUrls: ['./checklist-negoagmtdates.component.css']
})
export class ChecklistNegoagmtdatesComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;
  wingcondition = '';
  wingTableData: any = [];
  bldgWingCode: any ;
    
  checklistnegoagmtdates: FormGroup = new FormGroup({
    name: new FormControl('ChkListNegoAmtDatesReport.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      rbUnitType: new FormControl('F'),
      rbSortOpt: new FormControl(''),
      pBldgCode: new FormControl(''),
      pWings: new FormControl(''),
    }),
  });

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService,
    private rendered: Renderer2,
    private dynapop: DynapopService,        
  ) {}


   ngOnInit(): void {

    this.checklistnegoagmtdates.get('reportParameters')
    ?.get('pBldgCode')
    ?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          let coy = res;
          this.bldgWingCode = ` flat_bldgcode = '` + this.checklistnegoagmtdates.get('reportParameters')?.get('pBldgCode')?.value[0][0] + `'` ;
          //console.log("bldgcode ->",this.bldgWingCode);
        }
      },
    });

  }

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }

  getReport(print: boolean) {
    console.log("fromvalue",this.checklistnegoagmtdates.value);    
    if (this.checklistnegoagmtdates.valid) {

      this.loaderToggle = true;
      this.setReportValue();
      console.log("payload",this.payLoad);    //FOR DEBUG

      this.commonReportService
        .getParameterizedReport(this.payLoad)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.loaderToggle = false;
            let pdfFile = new Blob([res], { type: 'application/pdf' });
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
            this.loaderToggle = false;
          },
          complete: () => {
            this.loaderToggle = false;
          },
        });
    } else {
      this.toastr.error('Please fill the input properly');
    }
  }

  setReportValue() {

    let sort_by = "" ;
    let pOptionalWhere = "" ;

    switch  (this.checklistnegoagmtdates.controls['reportParameters']?.get('rbSortOpt')?.value) {
      case "Nego Date":
        sort_by = "to_char(ch_anegolet,'yyyymmdd')";
        break;
      case "Stamp Duty":
        sort_by = "to_char(ch_astamp,'yyyymmdd')";
        break;
      case "Agreement Date":
        sort_by = "to_char(CH_AAGREE1,'yyyymmdd')";
        break;
      case "Registration":
        sort_by = "to_char(ch_aregistry,'yyyymmdd')";
        break;
      case "Possession":
        sort_by = "to_char(ch_aposses,'yyyymmdd')";
        break;
      default:
        sort_by = "fown_bldgcode, fown_wing, flat_flatnum";
        break;
    }

    let pWingcode = this.checklistnegoagmtdates.get('reportParameters')?.get('pWings')?.value  ? " and flat_wing in ('" + this.checklistnegoagmtdates.get('reportParameters')?.get('pWings')?.value + "')" : "";
    switch  (this.checklistnegoagmtdates.controls['reportParameters']?.get('rbUnitType')?.value) {
      case "F":
        pOptionalWhere = " and flat_accomtype  <> 'C'" + pWingcode ;
        break;
      case "P":
        pOptionalWhere = " and flat_accomtype  = 'C'" + pWingcode ;        
        break;
      case "A":
        pOptionalWhere = " " + pWingcode ;        
        break;
    }

    this.payLoad = {
      name: 'ChkListNegoAmtDatesReport.rpt',
      isPrint: false,
      reportParameters: {
        pBldgCode: `${this.checklistnegoagmtdates.controls['reportParameters']?.get('pBldgCode')?.value[0][0]}` ,
        pOptionalWhere,
        sort_by
      }
    } ;

  }

 }
