import { Component, OnInit, Renderer2 } from '@angular/core';
import { finalize, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CollectionsService } from 'src/app/services/sales/collections.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { FormControl, FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { CommonService } from 'src/app/services/common.service';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { buttonsList } from 'src/app/shared/interface/common';


@Component({
  selector: 'app-dinshawcollectionreport',
  templateUrl: './dinshawcollectionreport.component.html',
  styleUrls: ['./dinshawcollectionreport.component.css']
})
export class DinshawcollectionreportComponent implements OnInit {
  loaderToggle: boolean = false;
  config = {
    isLoading: false,
  };
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
    setTimeout(function() {
      document.getElementById("fromDateField")?.focus();
   }, 100);
    this._service.pageData.subscribe({
      next: (val) => {
        this.dinshawCollectionForm.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
            
          },
        });
      },
    });
    this.getDataFromParms();
  }

  dinshawCollectionForm: FormGroup = new FormGroup({
    bldgCode: new FormControl<string[]>([]),
    wing: new FormControl<string[]>([]),
    name: new FormControl<string>('Bldgwise', Validators.required),
    report: new FormControl<boolean>(false, Validators.required),
    exportType: new FormControl('PDF'),
    UsrFrmDt: new FormControl<Date | null>(null, Validators.required),
    UsrToDt: new FormControl<Date | null>(null, Validators.required),
    
  });
  getDataFromParms() {
    var parmsData: any = localStorage.getItem('reportPayload');
    if (parmsData) {
      parmsData = JSON.parse(parmsData);
      this.dinshawCollectionForm.patchValue({
        bldgcode: parmsData.bldgcode,
        blgdName: parmsData.blgdName,
        wing: parmsData.wing,
        flatNum: parmsData.flatNum,
      });
      localStorage.removeItem('reportPayload');
    }
  }

  validateInvalidFormat(event: any, id: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.toastr.error("Please Enter Valid Date")
      this.rendered.selectRootElement(`#${id}`)?.focus();
    }
    else{
        let startDate = moment(
          this.dinshawCollectionForm.get("reportParameters.UsrFrmDt")?.value
          ).format('YYYY-MM-DD')
        let endDate = moment(
          this.dinshawCollectionForm.get("reportParameters.UsrToDt")?.value
          ).format('YYYY-MM-DD')
        console.log(endDate);
        if (moment(startDate).isAfter(endDate)) {
          this.toastr.error("To Date Should not be Less than From Date")
          this.dinshawCollectionForm.get("reportParameters.ToDate")?.reset()
          this.rendered.selectRootElement(`#${id}`)?.focus()
        }else {
          let startMonth =
            moment(
              this.dinshawCollectionForm.get('reportParameters.Frmdate')?.value
            ).month() + 1;
          let endMonth = moment(
            this.dinshawCollectionForm.get('reportParameters.Todate')?.value
          ).month()
            ? moment(
                this.dinshawCollectionForm.get('reportParameters.Todate')
                  ?.value
              ).month() + 1
            : 0;
          console.log('endMoth', endMonth);
          if (!(startMonth == endMonth) && endMonth! - 0) {
            this.toastr.error('From Date and To Date Month Should be Same');
            this.dinshawCollectionForm.get('reportParameters.Todate')?.reset();
            this.rendered.selectRootElement(`#${id}`)?.focus();
          } else {
            let startYear = moment(
              this.dinshawCollectionForm.get('reportParameters.Frmdate')?.value
            ).year();
            let endYear = moment(
              this.dinshawCollectionForm.get('reportParameters.Todate')?.value
            ).year()
              ? moment(
                  this.dinshawCollectionForm.get('reportParameters.Todate')
                    ?.value
                ).year()
              : 0;
            if (!(startYear == endYear) && endYear! - 0) {
              this.toastr.error('From Date and To Date Year Should be Same');
              this.dinshawCollectionForm.get(
                'reportParameters.Todate'
              )?.reset();
              this.rendered.selectRootElement(`#${id}`)?.focus();
            }
          }
        }
    } 
  }

  checkBoxToggle(event: any) {
    if (event.key === "Enter") {
      event.preventDefault()
      event.target.checked ? event.target.checked = false : event.target.checked = true
    }
  }
 

  getReport(print: Boolean) {
    if (this.dinshawCollectionForm.valid) {
      if (this._service.printExcelChk(print, this.dinshawCollectionForm.get('exportType')?.value)) {
        this.loaderToggle = true;
        let payload: any = {
          name: 'DinshawCollection.rpt',
          isPrint: false,
          seqId: 1,
          conditionId: this.conditionId,
          exportType: this.dinshawCollectionForm.get('exportType')?.value,
          reportParameters: {
              bldgCode: this.dinshawCollectionForm.get('bldgCode')?.value.length &&
              this.dinshawCollectionForm.get('bldgCode')?.value[0] != 'ALL'
              ? `'${this.dinshawCollectionForm.get('bldgCode')?.value.join(`','`)}'`
              : `'ALL'`,
              wing: this.dinshawCollectionForm.get('wing')?.value.length &&
              this.dinshawCollectionForm.get('wing')?.value[0] != 'ALL'
              ? `'${this.dinshawCollectionForm.get('wing')?.value.join(`','`)}'`
              : `'ALL'`,

              Footer:this.dinshawCollectionForm.get('report')?.value ? "'Footer'" : '',
            formname: this.formName,
          },
        };
        console.log(payload, "payload");

        (this.conditionId == 1) && (payload.reportParameters.bldgCode = '', payload.reportParameters.wing = '')

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
                this._service.exportReport(print, res, this.dinshawCollectionForm.get('exportType')?.value, filename)
              }
            },
          });
      }
    }
    else {
      this.toastr.show('Please fill the form properly');
      this.dinshawCollectionForm.markAllAsTouched();
    }
  }

  resetForm(){
    this.dinshawCollectionForm.reset({
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



