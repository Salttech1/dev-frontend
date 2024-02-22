import { Component, OnInit, Renderer2 } from '@angular/core';
import { buttonsList } from 'src/app/shared/interface/common';
import { CommonService } from 'src/app/services/common.service';
import { auxiQueryString } from 'src/app/shared/interface/sales';
import { FormControl, FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { DynaPopConstant } from 'src/constants/dyna-pop-constant';
import { CollectionsService } from 'src/app/services/sales/collections.service';
import { api_url } from 'src/constants/constant';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import * as fileSaver from 'file-saver';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { extendObjWithFn } from '@syncfusion/ej2-angular-grids';


@Component({
  selector: 'app-flatdetails',
  templateUrl: './flatdetails.component.html',
  styleUrls: ['./flatdetails.component.css']
})
export class FlatdetailsComponent implements OnInit {
  flatDetailForm: FormGroup = new FormGroup({
    bldgCode: new FormControl<string[]>([]),
    wing: new FormControl<string[]>([]),
    flatNum: new FormControl<string[]>([]),
    name: new FormControl<string>('Bldgwise', Validators.required),
    report: new FormControl<boolean>(false, Validators.required),
    exportType: new FormControl('PDF')
  });
  loaderToggle: boolean = false;
  formName!: string;
  conditionId: number = 0;


  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    public _service: ServiceService,
    private http: HttpRequestService,
    private _commonReport: CommonReportsService,
    private collectionsService:CollectionsService,
    private commonReportService: CommonReportsService,
    private toastr: ToastrService,
    private rendered: Renderer2,
  ) { }

  ngOnInit(): void {
    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
  }
 

  getReport(print: Boolean) {
    if (this.flatDetailForm.valid) {
      if (this._service.printExcelChk(print, this.flatDetailForm.get('exportType')?.value)) {
        this.loaderToggle = true;
        let payload: any = {
          name: 'FlatDetails.rpt',
          isPrint: false,
          seqId: 1,
          conditionId: this.conditionId,
          exportType: this.flatDetailForm.get('exportType')?.value,
          reportParameters: {
              bldgCode: this.flatDetailForm.get('bldgCode')?.value.length &&
              this.flatDetailForm.get('bldgCode')?.value[0] != 'ALL'
              ? `'${this.flatDetailForm.get('bldgCode')?.value.join(`','`)}'`
              : `'ALL'`,
              wing: this.flatDetailForm.get('wing')?.value.length &&
              this.flatDetailForm.get('wing')?.value[0] != 'ALL'
              ? `'${this.flatDetailForm.get('wing')?.value.join(`','`)}'`
              : `'ALL'`,
              flatNum: this.flatDetailForm.get('flatNum')?.value.length &&
              this.flatDetailForm.get('flatNum')?.value[0] != 'ALL'
              ? `'${this.flatDetailForm.get('flatNum')?.value.join(`','`)}'`
              : `'ALL'`,
            formname: this.formName,
          },
        };
        console.log(payload, "payload");

        (this.conditionId == 1) && (payload.reportParameters.bldgCode = '', payload.reportParameters.wing = '', payload.reportParameters.flatNum = '')

        this._commonReport
          .getTtxParameterizedReportWithCondition(payload)
          .pipe(
            take(1),
            finalize(() => (this.loaderToggle = false))
          )
          .subscribe({
            next: (res: any) => {
              if (res) {
                let filename = this._commonReport.getReportName();
                this._service.exportReport(print, res, this.flatDetailForm.get('exportType')?.value, filename)
              }
            },
          });
      }
    }
    else {
      this.toastr.show('Please fill the form properly');
      this.flatDetailForm.markAllAsTouched();
    }
  }

  resetForm(){
    this.flatDetailForm.reset({
      name:'Bldgwise',
     exportType: 'PDF',
    })
    setTimeout(function() {
      document.getElementById("bldgCode")?.focus();
   }, 100);
  }
}

// export function filterAtLeastOne(): ValidatorFn {
//   return (g: AbstractControl): ValidationErrors | null => {
//     return (!g.get('bldgCode')?.value?.length && 
//     !g.get('wing')?.value?.length && 
//     !g.get('flatNum')?.value?.length) ? { atLeastOneFilter: true } : null
//   };
// }




