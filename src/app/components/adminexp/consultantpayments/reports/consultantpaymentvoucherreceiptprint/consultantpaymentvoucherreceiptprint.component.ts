import { DynapopService } from 'src/app/services/dynapop.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-consultantpaymentvoucherreceiptprint',
  templateUrl: './consultantpaymentvoucherreceiptprint.component.html',
  styleUrls: ['./consultantpaymentvoucherreceiptprint.component.css']
})
export class ConsultantpaymentvoucherreceiptprintComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;
  payMonthFilter = '';
  coyCodeFilter = '';
  coyFrom = '0000';
  coyTo = 'ZZZZ';
  paymonth = '190000';

Consultantpaymentvoucherreceiptprint: FormGroup = new FormGroup({
    name: new FormControl('PYRL_ConsultantFeesVoucher_Receipt.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PPayMonth: new FormControl('', Validators.required),      
      PConsultCoyfrm: new FormControl('', Validators.required),
      PConsultCoyTo: new FormControl('', Validators.required),
      PConsultFrom: new FormControl('', Validators.required),
      PConsultTo: new FormControl('', Validators.required),
    }),
  });


  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService,
    private rendered: Renderer2,
    private payreportsService: PayreportsService,
    private CommonService: CommonService
  ) {}

  ngOnInit(): void {
    this.GetDefaultValue();
    this.Consultantpaymentvoucherreceiptprint.get(
      'reportParameters.PPayMonth'
    )?.valueChanges.subscribe((res: any) => {
      console.log('res1', res);

      if (res) {

        this.paymonth = res;
        // company_code in (Select cmth_coy from consultantmth where cmth_paymonth = '" + Trim(TxtPaymonth.Text) + "' and cmth_paystatus = '7')        
        this.payMonthFilter = `company_code in (Select cmth_coy from consultantmth where cmth_paymonth = '${this.paymonth}' and cmth_paystatus = '7')`;
        console.log('payMonthFilter', this.payMonthFilter);
      }
    });
    this.Consultantpaymentvoucherreceiptprint.get(
      'reportParameters.PConsultCoyfrm'
    )?.valueChanges.subscribe((res: any) => {
      console.log('res2', res);

      if (res) {

        this.coyFrom =this.CommonService.convertArryaToString( res)?.trimEnd();
        this.paymonth =  `${this.Consultantpaymentvoucherreceiptprint.controls['reportParameters']?.get('PPayMonth')?.value}`;
        this.coyTo =  `${this.Consultantpaymentvoucherreceiptprint.controls['reportParameters']?.get('PConsultCoyTo')?.value}`;
        this.coyCodeFilter = `cinf_code in (Select cmth_code from consultantmth where  cmth_paymonth = '${this.paymonth}' and cmth_paystatus = '7' and cmth_coy between '${this.coyFrom}' and '${this.coyTo}')`;
        console.log('coyCodeFilter1', this.coyCodeFilter);
      }
    });
    this.Consultantpaymentvoucherreceiptprint.get(
      'reportParameters.PConsultCoyTo'
    )?.valueChanges.subscribe((res: any) => {
      console.log('res3', res);

      if (res) {

        this.coyTo =this.CommonService.convertArryaToString( res)?.trimEnd();
        this.paymonth =  `${this.Consultantpaymentvoucherreceiptprint.controls['reportParameters']?.get('PPayMonth')?.value}`;
        this.coyFrom =  `${this.Consultantpaymentvoucherreceiptprint.controls['reportParameters']?.get('PConsultCoyfrm')?.value}`;
        this.coyCodeFilter = `cinf_code in (Select cmth_code from consultantmth where  cmth_paymonth = '${this.paymonth}' and cmth_paystatus = '7' and cmth_coy between '${this.coyFrom}' and '${this.coyTo}')`;
        console.log('coyCodeFilter2', this.coyCodeFilter);
      }
    });

  }

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }


  getReport(print: boolean) {
    console.log("fromvalue",this.Consultantpaymentvoucherreceiptprint.value);    
    if (this.Consultantpaymentvoucherreceiptprint.valid) {

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
    this.payLoad = {
      name: 'PYRL_ConsultantFeesVoucher_Receipt.rpt',
      isPrint: false,
      reportParameters: {
        PPayMonth: `${this.Consultantpaymentvoucherreceiptprint.controls['reportParameters']?.get('PPayMonth')?.value}`,
        PConsultCoyfrm: `${this.Consultantpaymentvoucherreceiptprint.controls['reportParameters']?.get('PConsultCoyfrm')?.value[0][0].trimEnd()}`,
        PConsultCoyTo: `${this.Consultantpaymentvoucherreceiptprint.controls['reportParameters']?.get('PConsultCoyTo')?.value[0][0].trimEnd()}`,
        PConsultFrom: `${this.Consultantpaymentvoucherreceiptprint.controls['reportParameters']?.get('PConsultFrom')?.value[0][0].trimEnd()}`,
        PConsultTo: `${this.Consultantpaymentvoucherreceiptprint.controls['reportParameters']?.get('PConsultTo')?.value[0][0].trimEnd()}`,
      }
    } ;
  }

GetDefaultValue(){
  this.fetchRequestAPI = 'payrollreports/reportparameters';
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      console.log(res.data);
      this.Consultantpaymentvoucherreceiptprint.patchValue({
        reportParameters: {
        PPayMonth: res.data.frompaymonth,
        PConsultCoyfrm: res.data.fromcoy.trimEnd(),
        PConsultCoyTo: res.data.tocoy.trimEnd(),
        PConsultFrom: res.data.fromcons.trimEnd(),  
        PConsultTo: res.data.tocons.trimEnd(),
        }
     })
    }
  });
  }
}
