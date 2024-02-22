import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { Router } from '@angular/router';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import * as moment from 'moment';
import { data } from 'jquery';

@Component({
  selector: 'app-annexure2',
  templateUrl: './annexure2.component.html',
  styleUrls: ['./annexure2.component.css'],
})
export class Annexure2Component implements OnInit {
  initialMode: Boolean = true;
  queryForm: FormGroup = new FormGroup(
    {
      exportType: new FormControl('PDF'),
      name: new FormControl<string>('FrmAnnexure.rpt', Validators.required),
      proprietor: new FormControl<string[]>([], [Validators.required]),
      company: new FormControl<string[]>([], [Validators.required]),
      bldgCode: new FormControl<string[]>([], [Validators.required]),
      range: new FormGroup({
        FromDate: new FormControl<Date | null>(null),
        ToDate: new FormControl<Date | null>(null),
      }),
      checked: new FormControl(),
    },
    { validators: this.all() }
  );

  loaderToggle: boolean = false;
  formName!: string;
  ownerTypeCondition = `fown_ownertype = 0`;
  companyFilter = '';
  bldgFilter = '';

  constructor(
    private _commonReport: CommonReportsService,
    private toastr: ToasterapiService,
    public _service: ServiceService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  // setHelpFilter(formControlName: string): string {

  //   this.queryForm.get(formControlName)?.valueChanges.subscribe({
  //     next: (res: any) => {
  //       if (res) {
  //         let  data = res[0][0];
  //         console.log('check',data);

  //         return data;

  //       }
  //     },
  //   });
  //   return '';
  // }

  ngOnInit(): void {
    // this._service.pageData.subscribe({
    //   next: (val) => {
    //     this.formName = val.formName;
    //   },
    // });
    // this.addFocus('proprietor');

    setTimeout(function () {
      document.getElementById('proprietor')?.focus();
    }, 100);

    // let test = this.setHelpFilter('proprietor');
    // this.companyFilter =   `coy_prop = '${test}'`;
    // console.log(test );

    // this.bldgFilter = `bldg_coy = '${this.setHelpFilter('company')}'`;
    this.queryForm.get('proprietor')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          let proprietor = res[0][0];
          console.log('proprietor :', proprietor);

          this.companyFilter = `coy_prop = '${proprietor}'`;
        }
      },
    });
    this.queryForm.get('company')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          let company = res[0][0];
          console.log('com :', company);

          this.bldgFilter = `bldg_coy = '${company}'`;
          console.log('this.bldgFilter = > ', this.bldgFilter);
        }
      },
    });
  }

  // add focus to elements by id
  addFocus(id: string) {
    this.renderer.selectRootElement(`#${id}`)?.focus();
  }

  // filterbldgCodeForCompany() {
  //   let company = this.queryForm.get('company')?.value[0][0];
  //   console.log(company);

  //   this.bldgFilter = `bldg_coy = '${company}'`;
  // }

  getReport(print: Boolean) {
    if (this.queryForm.valid) {
      let proprietor = this.queryForm.get('proprietor')?.value[0][0];
      let company = this.queryForm.get('company')?.value[0][0];
      let bldgCode = this.queryForm.get('bldgCode')?.value[0][0];
      let from = this.queryForm.get('range')?.value.FromDate;
      let to = this.queryForm.get('range')?.value.ToDate;
      let PartyName = this.queryForm.get('checked')?.value;

      if (
        this._service.printExcelChk(
          print,
          this.queryForm.get('exportType')?.value
        )
      ) {
        let payload: any = {
          name: this.queryForm.get('name')?.value,
          exportType: this.queryForm.get('exportType')?.value,
          isPrint: false,
          seqId: 1,
          reportParameters: {
            formname: this.formName,
            ACTD_ACMINOR: bldgCode,
            ACTD_COY: company,
            ACTD_PROPRIETOR: proprietor,
          },
        };
        if (PartyName) {
          payload.reportParameters.HeaderText1 = 'True';
        } else {
          payload.reportParameters.HeaderText1 = 'True';
        }
        if (from && to) {
          payload.reportParameters.FromDate = `${moment(from).format(
            'DD/MM/YYYY'
          )}`;
          payload.reportParameters.ToDate = `${moment(to).format(
            'DD/MM/YYYY'
          )}`;
        }
        console.log('PAYLOAD', payload);
        //
        this.loaderToggle = true;
        this._commonReport
          .getParameterizedReport(payload)
          .pipe(
            take(1),
            finalize(() => (this.loaderToggle = false))
          )
          .subscribe({
            next: (res: any) => {
              if (res) {
                this.commonPdfReport(print, res);
              } else {
                this.toastr.showError('No Data Found');
              }
            },
          });
      }
    } else {
      this.toastr.showError('Please fill the form properly');
      this.queryForm.markAllAsTouched();
    }
  }

  commonPdfReport(print: Boolean, res: any) {
    let filename = this._commonReport.getReportName();
    this._service.exportReport(
      print,
      res,
      this.queryForm.get('exportType')?.value,
      filename
    );
  }

  resetForm() {
    this.queryForm.reset({
      exportType: 'PDF',
      name: 'FrmAnnexure.rpt',
      proprietor: [],
      flatownerupto: [],
      billDate: [],
      carPark: [],
    });
    this.queryForm.enable();
    this.initialMode = true;
    setTimeout(function () {
      document.getElementById('proprietor')?.focus();
    }, 100);
    
  }

  all() {
    return (g: AbstractControl) => {
      return g.get('proprietor')?.value.length
        ? null
        : { atLeastOneFilter: true };
      return g.get('company')?.value.length
        ? null
        : { atLeastOneFilter: true };
      //    return g.get('wing')?.value.length ? null : { atLeastOneFilter: true };
      //    return g.get('flatNum')?.value.length ? null : { atLeastOneFilter: true };
    };
  }
}
