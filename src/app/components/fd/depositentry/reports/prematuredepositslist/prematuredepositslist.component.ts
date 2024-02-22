import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { CommonReportsService } from 'src/app/services/reports.service';
import { take } from 'rxjs';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import * as fileSaver from 'file-saver';
import { fileConstants } from 'src/constants/fileconstants';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-prematuredepositslist',
  templateUrl: './prematuredepositslist.component.html',
  styleUrls: ['./prematuredepositslist.component.css'],
})
export class PrematuredepositslistComponent implements OnInit {
  compHeader!: any[];
  compData!: any;
  columnHeader!: any[];
  bringBackColumn!: number;
  coy_condition = "coy_fdyn='Y'";
  loaderToggle: boolean = false;

  @ViewChild(F1Component) comp!: F1Component;

  constructor(
    private dynapop: DynapopService,
    private modalService: ModalService,
    private router: Router,
    private rendered: Renderer2,
    private commonReportService: CommonReportsService,
    private _service: ServiceService,
    private toastr: ToasterapiService
  ) {}

  ngOnInit(): void {
    this.getCompanyList();
    this.prematureDepositForm.controls['reportParameters'].controls[
      'companyName'
    ]?.disable();

    this._service.pageData.subscribe({
      next: (val) => {
        this.prematureDepositForm.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
  }

  prematureDepositForm = new FormGroup({
    name: new FormControl(fileConstants.prematurDepositLists),
    seqId: new FormControl(1),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      TxtCoyCode: new FormControl('', Validators.required),
      companyName: new FormControl(''),
      h1: new FormControl(),
      h2: new FormControl(),
      h3: new FormControl("'" + "'"),
      formname: new FormControl(''),
      Remark: new FormControl("'" + 'Premature' + "'"),
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

  setH2AndH1() {
    this.prematureDepositForm.patchValue({
      reportParameters: {
        h2: "'" + 'List of Refunds' + "'",
        h1: `'${
          this.prematureDepositForm.controls['reportParameters']?.get(
            'companyName'
          )?.value
        }'`,
      },
    });
  }

  updateCompanyList(compData: any) {
    this.prematureDepositForm.patchValue({
      reportParameters: {
        companyName: compData[this.bringBackColumn].trim(),
      },
    });
  }

  ngAfterViewInit(): void {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus();
  }

  setCompanyName() {
    for (let i = 0; i < this.compData.dataSet.length; i++) {
      if (
        this.compData.dataSet[i][0].startsWith(
          this.prematureDepositForm?.value.reportParameters?.TxtCoyCode
        )
      ) {
        this.prematureDepositForm.patchValue({
          reportParameters: {
            companyName: this.compData.dataSet[i][1].trim(),
          },
        });
      }
    }
  }

  getReport(print: boolean) {
    if (this.validateCompanyField()) {
      this.setCompanyName();
      this.setH2AndH1();
      this.loaderToggle = true;
      this.commonReportService
        .getTtxParameterizedReport(this.prematureDepositForm.value)
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
    }
  }

  print() {
    if (this.prematureDepositForm.valid) {
      this.setCompanyName();
      this.setH2AndH1();
      this.prematureDepositForm.value.isPrint = true;
      this.loaderToggle = true;
      this.commonReportService
        .getTtxParameterizedPrintReport(this.prematureDepositForm.value)
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
      this.validateCompanyField();
    }
  }

  focusField(fieldId: any) {
    let el = document.getElementById(fieldId)
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  validateCompanyField() {
    if (this.prematureDepositForm?.value.reportParameters?.TxtCoyCode == '') {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Company code cannot be left blank',
        this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus(),
        'error'
      );
      return false;
    } else {
      return true;
    }
  }
}
