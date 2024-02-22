import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import { CommonReportsService } from 'src/app/services/reports.service';
import * as fileSaver from 'file-saver';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-employeebirthday',
  templateUrl: './employeebirthday.component.html',
  styleUrls: ['./employeebirthday.component.css']
})
export class EmployeebirthdayComponent implements OnInit {

  loaderToggle: boolean = false;
  repname : string ='PYRL_EmpBirthDayMonth.rpt'

  bithdayForm = new FormGroup({
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    birthdate: new FormControl(new Date(), Validators.required),
    month: new FormControl<any>(0),
    reportOption: new FormControl('Monthwise', Validators.required),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      month: new FormControl<any>(0),
    })
  })

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService,
    private rendered: Renderer2
  ) { }

  ngOnInit(): void {
  }

  validateInvalidFormat(event: any, id: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.toastr.error("Invalid Date");
      this.rendered.selectRootElement(`#${id}`)?.focus();
    }
  }

  getReport(print: boolean) {
    if (this.bithdayForm.valid){
      this.loaderToggle = true;

      let sessionPayload: any = {
        name: `${this.repname}`,
        isPrint: false,
        seqId: 1,
        conditionId: 1,
        reportParameters: {
          formname: '',
          month : this.repname == 'PYRL_EmpBirthDayMonth.rpt' ? moment(this.bithdayForm.get('birthdate')?.value).format("MM") : moment(this.bithdayForm.get('birthdate')?.value).format("MMDD"),
        },
      };

      this.commonReportService
        .getTtxParameterizedReport(sessionPayload)
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


  optionSelect(event: any) {
    if (event.value == "Monthwise") {
      this.repname = 'PYRL_EmpBirthDayMonth.rpt'
    }
    else if (event.value == "Datewise") {
      this.repname = 'PYRL_EmpBirthDay.rpt'
    }
    console.log("option select",this.repname);
    
  }
  
  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }
  
}
