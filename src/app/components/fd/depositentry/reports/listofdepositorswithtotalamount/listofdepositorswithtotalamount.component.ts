import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import { fileConstants } from 'src/constants/fileconstants';
import * as constant from '../../../../../../constants/constant';
import * as fileSaver from 'file-saver';
import { CommonReportsService } from 'src/app/services/reports.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/services/modalservice.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { take } from 'rxjs';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-listofdepositorswithtotalamount',
  templateUrl: './listofdepositorswithtotalamount.component.html',
  styleUrls: ['./listofdepositorswithtotalamount.component.css'],
})
export class ListofdepositorswithtotalamountComponent implements OnInit {
  compHeader!: any[];
  compData!: any;
  columnHeader!: any[];
  bringBackColumn!: number;
  loaderToggle: boolean = false;
  coy_condition = "coy_fdyn='Y'";
  @ViewChild(F1Component) comp!: F1Component;
  constructor(
    private dynapop: DynapopService,
    private modalService: ModalService,
    private toastr: ToasterapiService,
    private router: Router,
    private rendered: Renderer2,
    private commonReportService: CommonReportsService,
    private changeDetectRef: ChangeDetectorRef,
    private _service: ServiceService
  ) {}

  ngOnInit(): void {
    this.listOfDepTotalAmntForm.controls['reportParameters']
      .get('companyName')
      ?.disable();
    this.getCompanyList();
    this._service.pageData.subscribe({
      next: (val) => {
        this.listOfDepTotalAmntForm.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
  }

  ngAfterViewInit(): void {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus();
  }

  ngAfterContentChecked() {
    this.changeDetectRef.detectChanges();
    if (
      this.listOfDepTotalAmntForm.controls['reportParameters'].get('TxtCoyCode')
        ?.value == ''
    ) {
      this.listOfDepTotalAmntForm.patchValue({
        reportParameters: {
          companyName: '',
        },
      });
    }
  }

  listOfDepTotalAmntForm = new FormGroup({
    name: new FormControl(fileConstants.listOfTotalDepAmnt),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    reportParameters: new FormGroup({
      TxtCoyCode: new FormControl('', Validators.required),
      companyName: new FormControl(''),
      h1: new FormControl(),
      h2: new FormControl('List of Depositors With Total Deposit Amount'),
      formname: new FormControl(''),
      listType: new FormControl('S'),
    }),
  });

  getCompanyList() {
    this.dynapop
      .getDynaPopListObj('COMPANY', "coy_fdyn='Y'")
      .subscribe((res: any) => {
        this.compHeader = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.compData = res.data;
        this.bringBackColumn = res.data.bringBackColumn;
      });
  }

  setReportValues() {
    console.log(
      'set',
      this.listOfDepTotalAmntForm.controls['reportParameters']?.get(
        'companyName'
      )?.value
    );
    this.listOfDepTotalAmntForm.patchValue({
      seqId:
        this.listOfDepTotalAmntForm.value.reportParameters?.listType == 'S'
          ? 1
          : 2,
      reportParameters: {
        h1: `'${
          this.listOfDepTotalAmntForm.controls['reportParameters']?.get(
            'companyName'
          )?.value
        }'`,
        h2:
          this.listOfDepTotalAmntForm.value.reportParameters?.listType == 'S'
            ? `'List of Depositors With Total Deposit Amount (Simple List)'`
            : `'List of Depositors With Total Deposit Amount (Active List)'`,
      },
    });
  }

  updateCompanyList(compData: any) {
    if (compData && compData.length) {
      this.listOfDepTotalAmntForm.patchValue({
        reportParameters: {
          companyName: compData[this.bringBackColumn].trim(),
        },
      });
    } else {
      this.listOfDepTotalAmntForm.patchValue({
        reportParameters: {
          companyName: '',
        },
      });
    }
  }

  getReport(print: boolean) {
    if (this.validateFields()) {
      this.setReportValues();
      this.loaderToggle = true;
      this.listOfDepTotalAmntForm.value.isPrint = false;
      this.commonReportService
        .getTtxParameterizedReport(this.listOfDepTotalAmntForm.value)
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
            // if (res.status) {
            //   this.toastr.showSuccess(
            //     'Request has been added. Please goto Reports page'
            //   );
            // }
          },
          error: (err: any) => {
            this.loaderToggle = false;
          },
          complete: () => {
            this.loaderToggle = false;
          },
        });
    }
  }

  print() {
    this.listOfDepTotalAmntForm.patchValue({
      isPrint: true,
    });
    this.setReportValues();
    console.log('print', this.listOfDepTotalAmntForm.value);
    if (this.listOfDepTotalAmntForm?.valid) {
      this.loaderToggle = true;
      this.commonReportService
        .getTtxParameterizedPrintReport(this.listOfDepTotalAmntForm?.value)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.loaderToggle = false;
              this.toastr.showSuccess(res.message);
            } else {
              this.loaderToggle = false;
              this.toastr.showError(res.message);
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
      this.validateFields();
      this.listOfDepTotalAmntForm.markAllAsTouched();
    }
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  validateFields() {
    if (
      this.listOfDepTotalAmntForm.controls['reportParameters'].controls[
        'TxtCoyCode'
      ].errors &&
      this.listOfDepTotalAmntForm.controls['reportParameters'].controls[
        'TxtCoyCode'
      ].errors?.['required']
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Company code cannot be left blank',
        this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus(),
        'error'
      );
      return false;
    } else {
      return true;
    }
  }

  updateOnChangeCompanyList(event: any) {
    const result = this.compData.dataSet.filter((s: any, i: any) => {
      if (
        this.compData.dataSet[i][0].trim() ===
        event?.target?.value.toUpperCase()
      ) {
        return this.compData.dataSet[i];
      } else {
        return null;
      }
    });
    if (event?.target?.value) {
      if (result.length == 0) {
        this.listOfDepTotalAmntForm.patchValue({
          reportParameters: { TxtCoyCode: '' },
        });
      } else {
        this.listOfDepTotalAmntForm.patchValue({
          reportParameters: {
            companyName: result[0][1].trim(),
          },
        });
      }
    }
    if (event?.target?.value == '') {
      this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus();
    }
  }
}
