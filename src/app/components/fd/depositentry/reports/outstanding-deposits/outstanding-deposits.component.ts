import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
import { take, finalize } from 'rxjs';
import { DynapopService } from 'src/app/services/dynapop.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { fileConstants } from 'src/constants/fileconstants';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-outstanding-deposits',
  templateUrl: './outstanding-deposits.component.html',
  styleUrls: ['./outstanding-deposits.component.css'],
})
export class OutstandingDepositsComponent
  implements OnInit, AfterViewInit, OnChanges
{
  queryForm: FormGroup = new FormGroup({
    coy: new FormControl<string | null>('', Validators.required),
    companyName: new FormControl<string | null>(
      { value: '', disabled: true },
      Validators.required
    ),
  });

  company: any;
  coy_condition = "coy_fdyn='Y'";
  transer: any;
  companyColumns!: any[];
  transerColumns!: any[];
  loaderToggle: boolean = false;
  formName: String = '';

  @ViewChild(F1Component) comp!: F1Component;
  constructor(
    private dynapop: DynapopService,
    private toastr: ToasterapiService,
    private cdref: ChangeDetectorRef,
    private renderer: Renderer2,
    private commonReportService: CommonReportsService,
    private _service: ServiceService
  ) {}

  ngOnInit(): void {
    this.getCompanyList();

    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
  }

  ngAfterViewInit(): void {
    this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus(); //To add default focus on input field
  }

  //added to remove change detection console error
  ngOnChanges(changes: SimpleChanges): void {}

  //added to remove change detection console error
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getCompanyList() {
    this.dynapop
      .getDynaPopListObj('COMPANY', "coy_fdyn='Y'")
      .subscribe((res: any) => {
        this.company = res.data;
        this.companyColumns = [
          res?.data?.colhead1,
          res?.data?.colhead2,
          res?.data?.colhead3,
          res?.data?.colhead4,
          res?.data?.colhead5,
        ];
      });
  }

  getSelectedCompany(e: any[]) {
    if (e?.length) {
      this.queryForm.patchValue({
        coy: e[0],
        companyName: e[1],
      });
    }
  }

  getReport(print: Boolean) {
    if (this.queryForm.valid) {
      let payload = {
        name: fileConstants.outstandingDeposit,
        isPrint: false,
        seqId: 1,
        reportParameters: {
          coy: this.queryForm.get('coy')?.value,
          h1: `'${this.queryForm.get('companyName')?.value}'`,
          h2: "'Outstanding Deposits List'",
          formname: this.formName,
        },
      };

      this.loaderToggle = true;
      this.commonReportService
        .getTtxParameterizedReport(payload)
        .pipe(
          take(1),
          finalize(() => (this.loaderToggle = false))
        )
        .subscribe({
          next: (res: any) => {
            // if (res.status) {
            //   this.toastr.showSuccess('Request has been added. Please goto Reports page')
            // }
            if (res) {
              let pdf = new Blob([res], { type: 'application/pdf' });
              let filename = this.commonReportService.getReportName();
              if (print) {
                const blobUrl = URL.createObjectURL(pdf);
                const oWindow = window.open(blobUrl, '_blank');
                oWindow?.print();
              } else {
                fileSaver.saveAs(pdf, filename);
              }
            }
          },
        });
    } else {
      this.toastr.showError('Please fill the form properly to retrieve data');
      this.queryForm.markAllAsTouched();
    }
  }
}
