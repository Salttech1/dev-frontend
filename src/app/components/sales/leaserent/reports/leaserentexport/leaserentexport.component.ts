import { ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { take } from 'rxjs';
import * as constant from '../../../../../../constants/constant';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { CommonService } from 'src/app/services/common.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { fileConstants } from 'src/constants/fileconstants';
import * as moment from 'moment';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-leaserentexport',
  templateUrl: './leaserentexport.component.html',
  styleUrls: ['./leaserentexport.component.css']
})
export class LeaserentexportComponent implements OnInit {
  bringBackColumn!: number;
  tableData: any;
  columnHeader: any;
  deptDyanPop!: string;
  deptColumnHeader: any;
  receiptNoTableData: any;
  coy_condition = "ls_bldgparty='Y'";
  loaderToggle: boolean = false;
  @ViewChild(F1Component) comp!: F1Component;
  formname: any;
  bldgCodeVal: any;
  regionCode: any;
  constructor(
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private changeDetector: ChangeDetectorRef,
    private toastr: ToasterapiService,
    private commonReportsService: CommonReportsService,
    private router: Router,
    private modalService: ModalService,
    private rendered: Renderer2,
    private commonService: CommonService,
    private service: ServiceService,
    public _service: ServiceService
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
    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val: { formName: any; }) => {
        this.formname = `'${val.formName}'`;
      },
    });
    this.leaserentexportform.get('region')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          this.regionCode = res[0][0];
        }
      },
    })
    this.leaserentexportform.get('bldgCode')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          this.bldgCodeVal = res[0][0];
        }
      },
    })
  }

  ngAfterViewInit() {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus();
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
    this.leaserentexportform.patchValue({
      reportParameters: {
        ReceiptNo: this.leaserentexportform.get(
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
      this.leaserentexportform.controls['reportParameters']?.get(
        'BldgParty'
      )?.value == ''
    ) {
      this.leaserentexportform.patchValue({
        reportParameters: {
          LeasebuildingName: '',
        },
      });
    }
    if (
      this.leaserentexportform.controls['reportParameters']?.get(
        'ReceiptNo'
      )?.value == ''
    ) {
      this.leaserentexportform.patchValue({
        reportParameters: {
          ReceiptNo: '',
        },
      });
    }
  }

  leaserentexportform = new FormGroup({
    name: new FormControl(),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      BldgParty: new FormControl('', Validators.required),
      LeasebuildingName: new FormControl(),
      ReceiptNo: new FormControl('', Validators.required),
      reportOption: new FormControl('', Validators.required),
      Fromdate: new FormControl<Date | null>(null, Validators.required),
      ToDate: new FormControl<Date | null>(null, Validators.required),
      TxtFrmDate: new FormControl<String>(''),
      TxtToDate: new FormControl<String>(''),
    }),
  });

  updateListControl(val: any, formControl: any) {
    if (val !== undefined) {
      formControl.setValue(val[this.bringBackColumn]);
    }
  }

  updateCompanyList(lsbuildData: any) {
    if (lsbuildData !== undefined) {
      this.leaserentexportform.patchValue({
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
      this.leaserentexportform.patchValue({
        name: fileConstants.LsReceipt,
      });
    } else if (event.value == 'VoucherDetails') {
      this.leaserentexportform.patchValue({
        name: fileConstants.LsVoucher,
      });
    }

    console.log('after selection form', this.leaserentexportform);
  }

  updateLoaderFlag(event: any) {
    this.loaderToggle = event;
  }

  getReport(print: boolean) {
    if (this.leaserentexportform.valid) {
      this.loaderToggle = true;
      let reval =
        this.leaserentexportform.controls['reportParameters']?.get(
          'TxtPartycode'
        )?.value;
      this.loaderToggle = true;

      // let trimval = reval?.map((val: { toString: () => string; }) => val.toString().trim());
      let PartyDet = {
        name: ' ',
        isPrint: false,
        seqId: 1,
        // conditionId: this.leaserentexportform.controls['reportParameters']?.get('TxtPartycode')?.value?.length ? 1 : 2,
        reportParameters: {
          formname: this.formname,
          // TxtPartycode: `${trimval?.join(`','`)}`,
          TxtFromDate: moment(this.leaserentexportform.controls['reportParameters'].controls['Fromdate'].value,'YYYY-MM-DD').format('DD/MM/YYYY'),
          TxtToDate: moment(this.leaserentexportform.controls['reportParameters'].controls['ToDate'].value,'YYYY-MM-DD').format('DD/MM/YYYY'),
          Fromdate: `'${moment(this.leaserentexportform.controls['reportParameters'].controls['Fromdate'].value,'YYYY-MM-DD').format('DD/MM/YYYY')}'`,
          ToDate: `'${moment(this.leaserentexportform.controls['reportParameters'].controls['ToDate'].value,'YYYY-MM-DD').format('DD/MM/YYYY')}'`
        },
      };
      this.commonReportsService
        .getTtxParameterizedReportWithCondition(PartyDet)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.loaderToggle = false;
            let pdfFile = new Blob([res], { type: 'application/pdf' });
            let fileName = this.commonReportsService.getReportName();
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
      // this.toastr.error('Please fill the input properly')
    }
  }

  validateInvalidFormat(event: any, id: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      // this.toastr.error("Please Enter Valid Date")
      this.rendered.selectRootElement(`#${id}`)?.focus();
    }
    else{
        let startDate = moment(this.leaserentexportform.get("reportParameters.Fromdate")?.value).format('YYYY-MM-DD')
        let endDate = moment(this.leaserentexportform.get("reportParameters.ToDate")?.value).format('YYYY-MM-DD')
        console.log(endDate)
        if (moment(startDate).isAfter(endDate)) {
          // this.toastr.error("To Date Should not be Less than From Date")
          this.leaserentexportform.get("reportParameters.ToDate")?.reset()
          this.rendered.selectRootElement(`#${id}`)?.focus()
        }
    } 
  }

  print() {
    if (this.leaserentexportform.valid) {
      this.leaserentexportform.value.isPrint = true;
      this.loaderToggle = true;
      this.commonReportsService
        .getParameterizedPrintReport(this.leaserentexportform.value)
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
      this.leaserentexportform.markAllAsTouched();
    }
  }
  handleExit() {
    this.router.navigate(['/dashboard']);
  }

  validationFields() {
    if (
      this.leaserentexportform.controls['reportParameters'].controls[
        'BldgParty'
      ].errors &&
      this.leaserentexportform.controls['reportParameters'].controls[
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
      this.leaserentexportform.controls['reportParameters'].controls[
        'ReceiptNo'
      ].errors &&
      this.leaserentexportform.controls['reportParameters'].controls[
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
      this.leaserentexportform.controls['reportParameters'].controls[
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
        this.leaserentexportform.patchValue({
          reportParameters: { BldgParty: '' },
        });
      } else {
        this.leaserentexportform.patchValue({
          reportParameters: {
            LeasebuildingName: result[0][1].trim(),
          },
        });
      }
    }
  }
  updateReciptNoList() {
    this.deptDyanPop = `deptr_coy='${
      this.leaserentexportform.controls['reportParameters'].get(
        'BldgParty'
      )?.value
    }'`;
    this.dynapop
      .getDynaPopListObj(
        'LEASE_BLDGPARTY',
        `ls_bldgparty='${
          this.leaserentexportform.controls['reportParameters'].get(
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
}
