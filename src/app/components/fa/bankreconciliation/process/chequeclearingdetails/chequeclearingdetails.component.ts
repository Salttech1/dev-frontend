// import { finalize, switchMap, take } from 'rxjs';
// import { SalesService } from 'src/app/services/sales/sales.service';
// import { ServiceService } from 'src/app/services/service.service';
// import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { DynapopService } from 'src/app/services/dynapop.service';
// import * as commonConstant from '../../../../../../constants/commonconstant';

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
  selector: 'app-chequeclearingdetails',
  templateUrl: './chequeclearingdetails.component.html',
  styleUrls: ['./chequeclearingdetails.component.css']
})
export class ChequeclearingdetailsComponent implements OnInit {
  loaderToggle: boolean = false;
  payLoad: any;
  fetchRequestAPI: any;
  coyCodeFilter = '';

  exportTypes = [
    { name: 'PDF', id: 'PDF' },
    { name: 'Excel (Report - Data Format)', id: 'EXCEL_REPORT_DATA_FORMAT' },
    { name: ' Excel (Template Format)', id: 'EXCEL_TEMPLATE_FORMAT' },
  ];

  Chequeclearingdetails: FormGroup = new FormGroup(
    {
      name: new FormControl('ChequeClearingDetails.rpt'),
      isPrint: new FormControl(false),
      reportParameters: new FormGroup({
        exportType: new FormControl('PDF'),
        formname: new FormControl(''),
        StrPrmCoy: new FormControl<string[]>([]),
        StrPrmBank: new FormControl<string[]>([]),
        StrPrmTranSer: new FormControl<string[]>([]),
        StrPrmChqNo: new FormControl<string[]>([]),
        StrPrmChqDate: new FormControl<Date | null>(new Date('01/01/2050')),
        decPrmTranAmt: new FormControl<number | 0>({
          value: 0,
          disabled: false,
        }),
  
      }),
    }
    // { validators: all() }
  );

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService,
    private rendered: Renderer2,
    private payreportsService: PayreportsService,
    private _dynapop: DynapopService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.GetDefaultValue();
    this.Chequeclearingdetails.get(
      'reportParameters.StrPrmCoy'
    )?.valueChanges.subscribe((res: any) => {
      console.log('res', res);

      if (res) {

        let coy =this.commonService.convertArryaToString( res)?.trimEnd();
        this.coyCodeFilter = `bank_company = '${coy}'`;
        console.log('coyCodeFilter', this.coyCodeFilter);
      }
    });

  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  reset(){
    this.Chequeclearingdetails.reset();
  }

  getReport(print: boolean) {
    console.log('fromvalue', this.Chequeclearingdetails.value);
    if (this.Chequeclearingdetails.valid) {
      this.loaderToggle = true;
      this.setReportValue();
      console.log('payload', this.payLoad); //FOR DEBUG

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
      name: 'ChequeClearingDetails.rpt',
      isPrint: false,
      reportParameters: {
        // StrPrmCoy: this.queryForm.get('StrPrmCoy')?.value.length &&
        // this.queryForm.get('StrPrmCoy')?.value[0] != 'ALL'
        // ? `'${this.queryForm.get('StrPrmCoy')?.value.join(`','`)}'`
        // : `'ALL'`,
        // StrPrmCoy:
        //   this.Chequeclearingdetails.controls['reportParameters']?.get('StrPrmCoy')
        //     ?.value.length &&
        //   this.Chequeclearingdetails.controls['reportParameters']?.get('StrPrmCoy')
        //     ?.value[0] != 'ALL'
        //     ? `'${this.Chequeclearingdetails.controls['reportParameters']
        //         ?.get('StrPrmCoy')
        //         ?.value.join(`','`)}'`
        //     : `'ALL'`,


        StrPrmCoy: this.Chequeclearingdetails.controls['reportParameters']?.get(
          'StrPrmCoy'
        )?.value
          ? 
            this.commonService.convertArryaToString(
              this.Chequeclearingdetails.controls['reportParameters']?.get(
                'StrPrmCoy'
              )?.value
            )
          : 'ALL',
          StrPrmBank: this.Chequeclearingdetails.controls['reportParameters']?.get(
          'StrPrmBank'
        )?.value
          ? 
            this.commonService.convertArryaToString(
              this.Chequeclearingdetails.controls['reportParameters']?.get(
                'StrPrmBank'
              )?.value
            )
          : 'ALL',

          // StrPrmTranSer:
        //   this.Chequeclearingdetails.controls['reportParameters']?.get('StrPrmTranSer')
        //     ?.value.length &&
        //   this.Chequeclearingdetails.controls['reportParameters']?.get('StrPrmTranSer')
        //     ?.value[0] != 'ALL'
        //     ? `'${this.Chequeclearingdetails.controls['reportParameters']
        //         ?.get('StrPrmTranSer')
        //         ?.value.join(`','`)}'`
        //     : `'ALL'`,
        StrPrmTranSer: this.Chequeclearingdetails.controls['reportParameters']?.get(
          'StrPrmTranSer'
        )?.value
          ? 
            this.commonService.convertArryaToString(
              this.Chequeclearingdetails.controls['reportParameters']?.get(
                'StrPrmTranSer'
              )?.value
            ) 
          : 'ALL',
        StrPrmChqNo: this.Chequeclearingdetails.controls['reportParameters']?.get('StrPrmChqNo')
          ?.value
          ? 
            this.commonService.convertArryaToString(
              this.Chequeclearingdetails.controls['reportParameters']?.get('StrPrmChqNo')
                ?.value
            )
          : 'ALL',

          StrPrmChqDate:
          moment(
            this.Chequeclearingdetails.getRawValue().reportParameters.StrPrmChqDate
          ).format('DD/MM/YYYY') ,

          decPrmTranAmt: this.Chequeclearingdetails.controls['reportParameters'].get('decPrmTranAmt')?.value,

      },
    };
  }

  GetDefaultValue() {
    this.fetchRequestAPI = 'payrollreports/reportparameters';
    this.payreportsService.GetReportParameters().subscribe((res: any) => {
      if (res.status) {
        console.log(res.data);
        this.Chequeclearingdetails.patchValue({
          reportParameters: {
            StrPrmCoy: res.data.StrPrmCoy,
            StrPrmTranSer: res.data.StrPrmTranSer,
            StrPrmChqNo: res.data.StrPrmChqNo,
            StrPrmBank: res.data.StrPrmBank,
          },
        });
      }
    });
  }
}
export function all() {
  return (g: AbstractControl) => {
    return g.get('StrPrmCoy')?.value.length ? null : { atLeastOneFilter: true };
    return g.get('StrPrmTranSer')?.value.length ? null : { atLeastOneFilter: true };
    return g.get('StrPrmChqNo')?.value.length ? null : { atLeastOneFilter: true };
    return g.get('StrPrmBank')?.value.length ? null : { atLeastOneFilter: true };
  };
}
