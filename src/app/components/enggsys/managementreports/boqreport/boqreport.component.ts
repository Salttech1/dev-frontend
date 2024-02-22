import { Component, OnInit } from '@angular/core';
import { CommonReportsService } from 'src/app/services/reports.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { finalize, switchMap, take } from 'rxjs';

import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';


@Component({
  selector: 'app-boqreport',
  templateUrl: './boqreport.component.html',
  styleUrls: ['./boqreport.component.css']
})
export class BoqreportComponent implements OnInit {
  boqReportForm: FormGroup = new FormGroup({
    txtLogicNote: new FormControl<string[]>([' ']),
    txtProjectCode: new FormControl<string[]>([' ']),
    txtBOQNo: new FormControl<string[]>(['']),
    name: new FormControl<string>('', Validators.required),
    // name2: new FormControl<string>(' ', Validators.required),
    // name3: new FormControl<string>(' ', Validators.required),
    report: new FormControl<string>('All', Validators.required),
    ChkWithPrintImange: new FormControl<string | null>(''),
    exportType: new FormControl('PDF'),
  });

  filters: any = {
    getRacNum: '',
    getBOQNum: ''
  }

  loaderToggle: boolean = false;
  formName!: string;

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    public _service: ServiceService
  ) {}

  ngOnInit(): void {
    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
  }

  onLeaveProject(val :string){
    this.filters.getRacNum = "mclh_projcode='" + val + "'"  
  }

  onLeaveRacNo(val: string){
  }

  getReport(print: Boolean) {
    console.log('boqReportForm', this.boqReportForm);

    if (this.boqReportForm.valid) {
      if (
        this._service.printExcelChk(
          print,
          this.boqReportForm.get('exportType')?.value
        )
      ) {

        // manipulate report name as required in payload but not for last 3 report
        let name = this.boqReportForm.get('name')?.value;
        // let name2 = this.boqReportForm.get('name')?.value;
        // let name3 = this.boqReportForm.get('name')?.value;

        // get h2, it is displayed in pdf header to be sent in the payload
        // let h2 = '';
        let report =
          this.boqReportForm.get('report')?.value == 'RbAllVendor'
            ? 'RbAllVendor'
            : 'RbIndividual';
        // h2 =
        //   name == 'RbMaterial'? `'${report} - RbMaterial'`
        // : name2 == 'RbLabour'? `' ${report} - RbLabour'`
        // : name3 == 'RbMatLab'? `' ${report} - RbMatLab'`
        // : `'RbAllVendor and RbIndividual Reports'`;

        // ...continue manipulate report name
        let rptConStr = this.boqReportForm.get('report')?.value;
        if ((name == 'RbMaterial' || name == 'RbLabour' || name == 'RbMatLab') && report == 'All') {
          rptConStr = 'All';
        }

        //billdetsumm_mod.rpt  &&
        

        let ReportRbMaterial = '';
        if (name == 'RbMaterial' && rptConStr == 'All') {
          ReportRbMaterial = 'RP_BOQQtyWithMatrial.rpt';
        } else {
          name =
            name == 'RP_BOQQtyWithMatrial_GR6' ||
            name == 'RP_BOQQtyWithMatrial_GR15-24' ||
            name == 'RP_BOQQtyWithMatrial_GR25-50' ||
            name == 'RP_BOQQtyWithMatrial_GR50-75'
              ? `${name}.rpt`
              : `${name}${rptConStr}.rpt`;
        }


        let ReportRbLabour = '';
        if (name == 'RbLabour' && rptConStr == 'All') {
          ReportRbLabour = 'RP_BOQQtyWithLabour.rpt';
        } else {
          name =
          name == 'RP_BOQQtyWithLabour_GRT6' ||
          name == 'RP_BOQQtyWithLabour_GRT15-24' ||
          name == 'RP_BOQQtyWithLabour_GRT25-50' ||
          name == 'RP_BOQQtyWithLabour_GRT50-75'
              ? `${name}.rpt`
              : `${name}${rptConStr}.rpt`;
        }


        let ReportRbMatLab = '';
        if (name == 'RbMatLab' && rptConStr == 'All') {
          ReportRbMatLab = 'RP_BOQQtyWithMatrialLabour.rpt';
        } else {
          name =
          name == 'RP_BOQQtyWithMatrialLabour_GR6' ||
          name == 'RP_BOQQtyWithMatrialLabour_GR15-24' ||
          name == 'RP_BOQQtyWithMatrialLabour_GRT25-50' ||
          name == 'RP_BOQQtyWithMatrialLabour_GRT50-75'
              ? `${name}.rpt`
              : `${name}${rptConStr}.rpt`;
        }




        /* get ChkWithPrintImange, due to 1 odd radio btn 'Specific Material-wise',
      below condition checked on the basis of name also */
        let ChkWithPrintImange = this.boqReportForm.get('ChkWithPrintImange')?.value;
        ChkWithPrintImange =
          name != 'EN_RP_BOQQuantityDetailsWithMaterial.rpt' && ChkWithPrintImange == 'Material'
            ? `and  StrLocCertType = ' '`
            : name !== 'EN_RP_BOQQuantityDetailsWithLabour.rpt' && ChkWithPrintImange == 'Labour'
            ? `and  StrLocCertType = ' '`
            : name !== 'EN_RP_BOQQuantityDetailsWithMaterialLabour.rpt' && ChkWithPrintImange == 'Material/Labour'
            ? `and  StrLocCertType = ' '`
            : name !== 'EN_RP_BOQQuantityDetails.rpt' && ChkWithPrintImange == ' '
            ? `and  StrLocCertType = ' '`
            : '';

        let payload: any = {
          name:
            name == 'RbMaterial' && rptConStr == 'All'
              ? ReportRbMaterial
              : name,
              name1:
            name == 'RbLabour' && rptConStr == 'All'
              ? ReportRbLabour
              : name,
              name2:
            name == 'RbMatLab' && rptConStr == 'All'
              ? ReportRbMatLab
              : name,
              
          seqId: 1,
          exportType: this.boqReportForm.get('exportType')?.value,
          reportParameters: {
            txtLogicNote:
              this.boqReportForm.get('txtLogicNote')?.value &&
              this.boqReportForm.get('txtLogicNote')?.value[0] != 'ALL'
                ? `'${this.boqReportForm.get('txtLogicNote')?.value.join(`','`)}'`
                : `'ALL'`,
            txtBOQNo:
              this.boqReportForm.get('txtBOQNo')?.value &&
              this.boqReportForm.get('txtBOQNo')?.value[0] != 'ALL'
                ? `'${this.boqReportForm.get('txtBOQNo')?.value.join(`','`)}'`
                : `'ALL'`,
            // h2:
            //   this.boqReportForm.get('name')?.value == 'MatRbLabour' &&
            //   rptConStr == 'All'
            //     ? ''
            //     : h2,
            ChkWithPrintImange: ChkWithPrintImange,
            formname:
              this.boqReportForm.get('name')?.value == ' ' &&
              rptConStr == 'All'
                ? ''
                : this.formName,
          },
          isPrint: false,
        };

        console.log('payload', payload);
        // return;

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
                let filename = this._commonReport.getReportName();
                this._service.exportReport(
                  print,
                  res,
                  this.boqReportForm.get('exportType')?.value,
                  filename
                );
              }
            },
          });
      }
    } else {
      this.toastr.showError('Please fill the form properly');
      this.boqReportForm.markAllAsTouched();
    }
  }

  
  resetForm(){
    this.boqReportForm.reset({
      name: 'txtLogicNote',
      txtLogicNote:[' '],
      txtProjectCode:[' '],
      txtBOQNo: ['ALL'],
      exportType: 'PDF',
      report: 'All',
      ChkWithPrintImange: '',
      
    })
    setTimeout(function() {
      document.getElementById("ProjectCode123")?.focus();
   }, 100);
  }
   }
