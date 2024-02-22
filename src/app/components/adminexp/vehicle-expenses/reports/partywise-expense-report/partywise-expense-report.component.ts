import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-partywise-expense-report',
  templateUrl: './partywise-expense-report.component.html',
  styleUrls: ['./partywise-expense-report.component.css'],
})
export class PartywiseExpenseReportComponent implements OnInit {
  loaderToggle: boolean = false;
  formname!: any;

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private _service: ServiceService,
    private toastr: ToastrService,
    private rendered: Renderer2,
  ) {}

  ngOnInit(): void {    setTimeout(function() {
    document.getElementById("fromDateField")?.focus();
 }, 100);}

  PartywiseExpenseReport = new FormGroup({
    name: new FormControl('PartywiseExpenseReport.rpt'),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    conditionId: new FormControl(1),

    reportParameters: new FormGroup({
      formname: new FormControl(''),
      head: new FormControl(''),
      Fromdate: new FormControl<Date | null>(null, Validators.required),
      ToDate: new FormControl<Date | null>(null, Validators.required),
      TxtFrmDate: new FormControl<String>(''),
      TxtToDate: new FormControl<String>(''),
      TxtPartycode: new FormControl<String[]>([]),
    }),
  });

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  getReport(print: boolean) {
    if (this.PartywiseExpenseReport.valid) {
      this.loaderToggle = true;
      let reval =
        this.PartywiseExpenseReport.controls['reportParameters']?.get(
          'TxtPartycode'
        )?.value;
      this.loaderToggle = true;

      let trimval = reval?.map((val) => val.toString().trim());
      let PartyDet = {
        name: 'PartywiseExpenseReport.rpt',
        isPrint: false,
        seqId: 1,
        conditionId: this.PartywiseExpenseReport.controls['reportParameters']?.get('TxtPartycode')?.value?.length ? 1 : 2,
        reportParameters: {
          formname: this.formname,
          TxtPartycode: `${trimval?.join(`','`)}`,
          TxtFromDate: moment(this.PartywiseExpenseReport.controls['reportParameters'].controls['Fromdate'].value,'YYYY-MM-DD').format('DD/MM/YYYY'),
          TxtToDate: moment(this.PartywiseExpenseReport.controls['reportParameters'].controls['ToDate'].value,'YYYY-MM-DD').format('DD/MM/YYYY'),
          Fromdate: `'${moment(this.PartywiseExpenseReport.controls['reportParameters'].controls['Fromdate'].value,'YYYY-MM-DD').format('DD/MM/YYYY')}'`,
          ToDate: `'${moment(this.PartywiseExpenseReport.controls['reportParameters'].controls['ToDate'].value,'YYYY-MM-DD').format('DD/MM/YYYY')}'`
        },
      };
      this.commonReportService
        .getTtxParameterizedReportWithCondition(PartyDet)
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

  validateInvalidFormat(event: any, id: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.toastr.error("Please Enter Valid Date")
      this.rendered.selectRootElement(`#${id}`)?.focus();
    }
    else{
        let startDate = moment(this.PartywiseExpenseReport.get("reportParameters.Fromdate")?.value).format('YYYY-MM-DD')
        let endDate = moment(this.PartywiseExpenseReport.get("reportParameters.ToDate")?.value).format('YYYY-MM-DD')
        console.log(endDate)
        if (moment(startDate).isAfter(endDate)) {
          this.toastr.error("To Date Should not be Less than From Date")
          this.PartywiseExpenseReport.get("reportParameters.ToDate")?.reset()
          this.rendered.selectRootElement(`#${id}`)?.focus()
        }
    } 
  }

}
