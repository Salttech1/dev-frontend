import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder,  FormGroup,  ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-pendingintercompanytrans',
  templateUrl: './pendingintercompanytrans.component.html',
  styleUrls: ['./pendingintercompanytrans.component.css']
})
export class PendingintercompanytransComponent implements OnInit {

  loaderToggle: boolean = false;
  qf!: FormGroup;
  formName!: string;
  constructor(private fb: FormBuilder,
    public _service: ServiceService,
    public commonReport: CommonReportsService,
  ) { }

  ngOnInit(): void {
    this.qf = this.fb.group({
      asOnDate: [moment()],
    },
      // {
      //   validators: selectDate()
      // }
    );
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`
      },
    });
  }

  getReport(print: Boolean) {
    if (this.qf.valid) {
      this.loaderToggle = true
      let asOnDt = this.qf.get('asOnDate')?.value;

      let payload: any = {
        name: "FrmFAInterCompanyPending.rpt",
        isPrint:false,
        seqId: 1,
        reportParameters: {
        },
      }
      
      if(asOnDt){
        payload.reportParameters.Pdt_AsOnDate = moment(asOnDt).format('DD/MM/yyyy')
        // payload.reportParameters.h2 =`'Certificate Cost  As on ${moment(asOnDt).format('DD.MM.yyyy')}'` ;
      }
      console.log(payload,"payload");
      this.commonReport.getParameterizedReport(payload).pipe(take(1), finalize(() => {
        this.loaderToggle = false
      }))
        .subscribe({
          next: (res: any) => {
            if (res) {
              let filename = this.commonReport.getReportName();
              this._service.exportReport(print, res,"PDF", filename)
            }
          }
        })
    }
    else {
      this.qf.markAllAsTouched()
    }
  }

}

// export function selectDate(): ValidatorFn {
//   return (c: AbstractControl): ValidationErrors | null => {
//     let asondt = c.get('asOnDate')?.value;

//     if (asondt) {
//       c.get('asOnDate')?.setErrors({ selectDate: true })
//       c.get('range')?.setErrors({ selectDate: true })
//     }
//     else if (!asondt) {
//       c.get('asOnDate')?.setErrors({ selectDate: true })
//       c.get('range')?.setErrors({ selectDate: true })
//     }
//     else {
//       c.get('asOnDate')?.setErrors(null)
//     }
//     return null
//   };

// }
