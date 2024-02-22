import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import * as commonConstant from '../../../../../../constants/commonconstant';


@Component({
  selector: 'app-list-suppliers',
  templateUrl: './list-suppliers.component.html',
  styleUrls: ['./list-suppliers.component.css']
})
export class ListSuppliersComponent implements OnInit {
  party_condition = `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '${commonConstant.coyCloseDate}')`
  queryForm: FormGroup = new FormGroup({
    matCode: new FormControl<string[] | string>([], Validators.required),
    partyCode: new FormControl<string[] | string>(['ALL']),
    formname: new FormControl<string>('ListofSuppliers.rpt'),
    exportType: new FormControl('PDF')
  });

  loaderToggle: boolean = false;
  formName!: string;

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    public _service: ServiceService,
    private el: ElementRef
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

    if (this.queryForm.valid) {
      if (this._service.printExcelChk(print, this.queryForm.get('exportType')?.value)) {
        this.loaderToggle = true;
        let payload: Object = {
          name: 'ListofSuppliers.rpt',
          isPrint: false,
          seqId: 1,
          conditionId: 1,
          exportType: this.queryForm.get('exportType')?.value,
          reportParameters: {
            matCode:
              this.queryForm.get('matCode')?.value &&
                this.queryForm.get('matCode')?.value[0] != 'ALL'
                ? `'${this.queryForm.get('matCode')?.value.join(`','`)}'`
                : `'ALL'`,
            partyCode:
              this.queryForm.get('partyCode')?.value &&
                this.queryForm.get('partyCode')?.value[0] != 'ALL'
                ? `'${this.queryForm.get('partyCode')?.value.join(`','`)}'`
                : `'ALL'`,
            formname: this.formName,
          },
        };

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
                this._service.exportReport(print, res, this.queryForm.get('exportType')?.value, filename)
              }
            },
          });
      }
    } else {
      console.log('form', this.queryForm);
      this.toastr.showError('Please fill the form properly');
      this._service.setFocusField(this.queryForm.controls, this.el.nativeElement)
    }
  }

  resetForm(){
    this.queryForm.reset({
      exportType: 'PDF',
      formname: 'ListofSuppliers.rpt',
      partyCode: ['ALL']
    })
    setTimeout(function() {
      document.getElementById("matcode123")?.focus();
   }, 100);
  }
}

