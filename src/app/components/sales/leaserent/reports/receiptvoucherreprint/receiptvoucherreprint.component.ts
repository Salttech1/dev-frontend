import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { take } from 'rxjs';
import * as constant from '../../../../../../constants/constant';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { fileConstants } from 'src/constants/fileconstants';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-receiptvoucherreprint',
  templateUrl: './receiptvoucherreprint.component.html',
  styleUrls: ['./receiptvoucherreprint.component.css'],
})
export class ReceiptvoucherreprintComponent implements OnInit {
  bringBackColumn!: number;
  tableData: any;
  columnHeader: any;
  deptDyanPop!: string;
  deptColumnHeader: any;
  receiptNoTableData: any;
  coy_condition = "ls_bldgparty='Y'";
  loaderToggle: boolean = false;
  @ViewChild(F1Component) comp!: F1Component;
  constructor(
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private changeDetector: ChangeDetectorRef,
    private toastr: ToasterapiService,
    private commonReportsService: CommonReportsService,
    private router: Router,
    private modalService: ModalService,
    private rendered: Renderer2,
    private commonService: CommonService
  ) {
    this.actionService.commonFlagCheck(
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      false,
      true,
      true
    );
    
    this.actionService.commonFlagCheck(
      true,
      true,
      true,
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true
    );
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus();
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
    this.receiptVoucherRePrintForm.patchValue({
      reportParameters: {
        ReceiptNo: this.receiptVoucherRePrintForm.get(
          'reportParameters.ReceiptNo'
        )?.value,
      },
    });
    this.actionService.commonFlagCheck(
      true,
      true,
      true,
      false,
      true,
      true,
      true,
      true,
      false,
      true,
      true
    );
    if (
      this.receiptVoucherRePrintForm.controls['reportParameters']?.get(
        'BldgParty'
      )?.value == ''
    ) {
      this.receiptVoucherRePrintForm.patchValue({
        reportParameters: {
          LeasebuildingName: '',
        },
      });
    }
    if (
      this.receiptVoucherRePrintForm.controls['reportParameters']?.get(
        'ReceiptNo'
      )?.value == ''
    ) {
      this.receiptVoucherRePrintForm.patchValue({
        reportParameters: {
          ReceiptNo: '',
        },
      });
    }
  }

  receiptVoucherRePrintForm = new FormGroup({
    name: new FormControl(),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      BldgParty: new FormControl('', Validators.required),
      LeasebuildingName: new FormControl(),
      ReceiptNo: new FormControl('', Validators.required),
      reportOption: new FormControl('', Validators.required),
    }),
  });

  updateListControl(val: any, formControl: any) {
    if (val !== undefined) {
      formControl.setValue(val[this.bringBackColumn]);
    }
  }

  updateCompanyList(lsbuildData: any) {
    if (lsbuildData !== undefined) {
      this.receiptVoucherRePrintForm.patchValue({
        reportParameters: {
          LeasebuildingName: lsbuildData[this.bringBackColumn],
        },
      });
      
      this.deptDyanPop = `LS_OWNERID='${
        lsbuildData[this.bringBackColumn - 1]
      }'`;
      this.dynapop
        .getDynaPopListObj(
          'LS_RECNUM',
          `LS_OWNERID='${lsbuildData[this.bringBackColumn - 1]}'`
        )
        .subscribe((res: any) => {
          this.deptColumnHeader = [
            res.data.colhead1,
            res.data.colhead2,
            res.data.colhead3,
            res.data.colhead4,
            res.data.colhead5,
          ];
          this.receiptNoTableData = res.data;
        });
    }
  }

  optionSelect(event: any) {
    console.log('change event', event.value);

    if (event.value == 'ReceiptNoDetail') {
      this.receiptVoucherRePrintForm.patchValue({
        name: fileConstants.LsReceipt,
      });
    } else if (event.value == 'VoucherDetails') {
      this.receiptVoucherRePrintForm.patchValue({
        name: fileConstants.LsVoucher,
      });
    }

    console.log('after selection form', this.receiptVoucherRePrintForm);
  }

  updateLoaderFlag(event: any) {
    this.loaderToggle = event;
  }

  getReport(print: boolean) {
    console.log('form value', this.receiptVoucherRePrintForm);

    if (this.receiptVoucherRePrintForm.valid) {
      this.receiptVoucherRePrintForm.value.isPrint = false;
      this.loaderToggle = true;

      let payLoad = {
        isPrint: false,
        name: this.receiptVoucherRePrintForm.value.name,
        reportParameters: {
        RecNum:this.commonService.convertArryaToString(
            this.receiptVoucherRePrintForm.value.reportParameters?.ReceiptNo
          ),
        },
      };



      
      payLoad.reportParameters= this.commonService.addSingleQuotationForString([],payLoad.reportParameters)
      console.log("final payload",payLoad);

      

      this.commonReportsService
        .getParameterizedReport(payLoad)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.loaderToggle = false;
            let pdf = new Blob([res], { type: 'application/pdf' });
            let filename = this.commonReportsService.getReportName();
            if (print) {
              const blobUrl = URL.createObjectURL(pdf);
              const oWindow = window.open(blobUrl, '_blank');
              oWindow?.print();
            } else {
              fileSaver.saveAs(pdf, filename);
            }
          },
          error: (err: any) => {
            this.loaderToggle = false;
          },
          complete: () => [(this.loaderToggle = false)],
        });
    } else {
      this.validationFields();
      this.receiptVoucherRePrintForm.markAllAsTouched();
    }
  }

  print() {
    if (this.receiptVoucherRePrintForm.valid) {
      this.receiptVoucherRePrintForm.value.isPrint = true;
      this.loaderToggle = true;
      this.commonReportsService
        .getParameterizedPrintReport(this.receiptVoucherRePrintForm.value)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.toastr.showSuccess(res.message);
            } else {
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
      this.validationFields();
      this.receiptVoucherRePrintForm.markAllAsTouched();
    }
  }
  handleExit() {
    this.router.navigate(['/dashboard']);
  }

  validationFields() {
    if (
      this.receiptVoucherRePrintForm.controls['reportParameters'].controls[
        'BldgParty'
      ].errors &&
      this.receiptVoucherRePrintForm.controls['reportParameters'].controls[
        'BldgParty'
      ].errors?.['required']
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'LsBuilding code is Required',
        (
          document.getElementById('BldgParty')
            ?.childNodes[0] as HTMLInputElement
        )?.focus(),
        'error'
      );
    } else if (
      this.receiptVoucherRePrintForm.controls['reportParameters'].controls[
        'ReceiptNo'
      ].errors &&
      this.receiptVoucherRePrintForm.controls['reportParameters'].controls[
        'ReceiptNo'
      ].errors?.['required']
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'ReceiptNo is Required',
        (
          document.getElementById('ReceiptNo')
            ?.childNodes[0] as HTMLInputElement
        )?.focus(),
        'error'
      );
    } else if (
      this.receiptVoucherRePrintForm.controls['reportParameters'].controls[
        'reportOption'
      ].errors?.['required']
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'report option is Required',
        '',
        'error'
      );
    }
  }

  updateOnChangeCompanyList(event: any) {
    console.log('tabledata', this.tableData);
    const result = this.tableData.dataSet.filter((s: any, i: any) => {
      if (
        this.tableData.dataSet[i][0].trim() ===
        event?.target?.value.toUpperCase()
      ) {
        return this.tableData.dataSet[i];
      } else {
        return null;
      }
    });
    if (event?.target?.value) {
      if (result.length == 0) {
        this.receiptVoucherRePrintForm.patchValue({
          reportParameters: { BldgParty: '' },
        });
      } else {
        this.receiptVoucherRePrintForm.patchValue({
          reportParameters: {
            LeasebuildingName: result[0][1].trim(),
          },
        });
      }
    }
  }
  updateReciptNoList() {
    this.deptDyanPop = `deptr_coy='${
      this.receiptVoucherRePrintForm.controls['reportParameters'].get(
        'BldgParty'
      )?.value
    }'`;
    this.dynapop
      .getDynaPopListObj(
        'LEASE_BLDGPARTY',
        `ls_bldgparty='${
          this.receiptVoucherRePrintForm.controls['reportParameters'].get(
            'BldgParty'
          )?.value
        }'`
      )
      .subscribe((res: any) => {
        this.deptColumnHeader = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.receiptNoTableData = res.data;
      });
  }

  updateReciptNoOnChange(event: any) {
    const result = this.receiptNoTableData.dataSet.filter((s: any, i: any) => {
      if (
        this.receiptNoTableData.dataSet[i][0].trim() ===
        event?.target?.value.toUpperCase()
      ) {
        return this.receiptNoTableData.dataSet[i];
      } else {
        return null;
      }
    });
    if (event?.target?.value) {
      if (result.length == 0) {
        this.receiptVoucherRePrintForm.patchValue({
          reportParameters: { ReceiptNo: '' },
        });
      }
    }
  }
}
