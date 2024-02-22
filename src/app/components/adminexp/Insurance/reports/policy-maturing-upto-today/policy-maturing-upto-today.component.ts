import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { fileConstants } from 'src/constants/fileconstants';
import * as fileSaver from 'file-saver';
import { ServiceService } from 'src/app/services/service.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-policy-maturing-upto-today',
  templateUrl: './policy-maturing-upto-today.component.html',
  styleUrls: ['./policy-maturing-upto-today.component.css']
})
export class PolicyMaturingUptoTodayComponent implements OnInit {
  loaderToggle: boolean = false;
  formname!: any;

  policymaturinguptotodayform: FormGroup = new FormGroup({
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    name: new FormControl<string>('Adm_RP_insurance_MaturingPolicy_ToDay.rpt', Validators.required),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      reportOption:new FormControl('Adm_RP_insurance_MaturingPolicy_ToDay'),
    }),
  });

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private _service: ServiceService,
    private commonReportService: CommonReportsService,
  ) { }

  ngOnInit(): void {
    this._service.pageData.subscribe({
      next: (val) => {
        this.formname = `${val.formName}`;
        this.policymaturinguptotodayform.patchValue({
          reportParameters: {
            formname: `${val.formName}`,
          },
        });
      },
    });
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  getReport(print: boolean) {
    console.log('form',this.policymaturinguptotodayform)
    if (this.policymaturinguptotodayform.valid){
    this.loaderToggle = true;
    this.policymaturinguptotodayform.patchValue({
      name : this.policymaturinguptotodayform.controls['reportParameters'].get('policymatuptotoday')?.value == 'polmatuptotoday' ?  'polmatuptotoday-CrossTab.rpt' :   'Adm_RP_insurance_MaturingPolicy_ToDay.rpt',
    });

    this.commonReportService
    .getParameterizedReport(this.policymaturinguptotodayform.value)
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
      this.toastr.error('Please fill the input properly')
    
    }
  }

}
