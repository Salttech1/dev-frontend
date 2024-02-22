import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { DebitNoteService } from '../../../debit-notes/debit-note.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import * as constant from '../../../../../../constants/constant';
import { ModalService } from 'src/app/services/modalservice.service';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-reverse-debit-note',
  templateUrl: './reverse-debit-note.component.html',
  styleUrls: ['./reverse-debit-note.component.css'],
})
export class ReverseDebitNoteComponent implements OnInit {
  supplierData: any;
  debitNoteTableData: any;
  bringBackColumn: any;
  supplier_condition = "par_partytype = 'S'";
  gstDebitNoteDetails: boolean = false;
  debitnote_condition = 'dbnh_partycode = ';
  readonlyAttr: boolean = true;
  datePipe = new DatePipe('en-US');
  loader: boolean = false;
  debitNoteReversed: boolean = false;
  @ViewChild(F1Component) comp!: F1Component;

  reverseDebitNoteForm: FormGroup = new FormGroup({
    suppCode: new FormControl<string[] | string>('', Validators.required),
    supplierName: new FormControl(''),
    debitNote: new FormControl<string[] | string>('', Validators.required),
    debitNoteSupplierName: new FormControl(''),
    matgroup: new FormControl(''),
    matcode: new FormControl(''),
    amt: new FormControl(),
    buildingName: new FormControl(''),
    debitNoteMatCodeName: new FormControl(''),
    uom: new FormControl(''),
    debitNoteCompanyName: new FormControl(''),
    projetcName: new FormControl(''),
    sku: new FormControl(''),
    itemCode: new FormControl(''),
    lineQty: new FormControl(),
    skuQty: new FormControl(),
    narration: new FormControl(''),
    itemRate: new FormControl(''),
    skuRate: new FormControl(''),
    transerNo: new FormControl(''),
    lineValue: new FormControl(''),
    suppBillDate: new FormControl(''),
    billAmt: new FormControl(''),
    debitNoteDate: new FormControl(''),
    debitNoteAmnt: new FormControl(''),
    description1: new FormControl(''),
    description2: new FormControl(''),
    description3: new FormControl(''),
    description4: new FormControl(''),
  });

  loaderToggle: boolean = false;
  formName!: string;

  constructor(
    private toastr: ToasterapiService,
    private dynapop: DynapopService,
    private cderf: ChangeDetectorRef,
    private debitNoteService: DebitNoteService,
    private router: Router,
    private modalService: ModalService,
    private dialog: MatDialog,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    setTimeout(function () {
      document.getElementById('suppCode123')?.focus();
    }, 100);
    this.setDebitNoteCondition();
  }

  checkIsDebitNoteDateValid(debitNoteDate: any) {
    let checkYear =
      new Date().getMonth() < 3
        ? new Date().getFullYear() - 1
        : new Date().getFullYear();
    let checkDate = new Date('04-01-' + checkYear);
    let debitDate = new Date(
      `${debitNoteDate.split('/')[1]}-` +
        `${debitNoteDate.split('/')[0]}-` +
        `${debitNoteDate.split('/')[2]}`
    );
    if (debitDate < checkDate) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Check , Date Cannot be less than ' +
          this.datePipe.transform(checkDate, 'dd/MM/yyyy'),
        this.back(),
        'error'
      );
      return;
    } else {
      return true;
    }
  }


  getSupplierList() {
    this.dynapop
      .getDynaPopListObj('PARTYCODE', this.supplier_condition)
      .subscribe((res: any) => {
        this.supplierData = res.data;
        this.bringBackColumn = res.data.bringBackColumn;
      });
  }

  getDebitNotesList() {
    this.debitnote_condition =
      this.debitnote_condition +
      `'${this.reverseDebitNoteForm.get('suppCode')?.value}'`;
    this.dynapop
      .getDynaPopListObj('DEBITNOTES', this.debitnote_condition)
      .subscribe((res: any) => {
        this.debitNoteTableData = res.data;
      });
  }


  getDataName(
    dynapopId: any,
    searchText: any,
    query: any,
    controlName: string
  ) {
    this.dynapop
      .getDynaPopSearchListObj(dynapopId, query, searchText)
      .subscribe((res: any) => {
        this.reverseDebitNoteForm
          .get(controlName)
          ?.setValue(
            res.data.dataSet.length != 0 ? res.data.dataSet[0][1].trim() : ''
          );
      });
  }

  retrieveData() {
    if (
      this.reverseDebitNoteForm.get('debitNote')?.valid &&
      this.reverseDebitNoteForm.get('suppCode')?.valid
    ) {
      this.loader = true;
      this.debitNoteService
        .fetchDebitNoteForReversal(
          this.reverseDebitNoteForm.get('debitNote')?.value instanceof Object ? this.reverseDebitNoteForm.get('debitNote')?.value[0][0]?.trim() : this.reverseDebitNoteForm.get('debitNote')?.value.trim()
        )
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              if (this.checkIsDebitNoteDateValid(res.data[0].date)) {
                this.reverseDebitNoteForm.get('suppCode')?.disable()
                this.reverseDebitNoteForm.get('debitNote')?.disable();
                this.gstDebitNoteDetails = true;
                this.setRetrievedDebitNoteData(res.data[0]);
              }
            } else {
                this.modalService.showErrorDialogCallBack(
                  constant.ErrorDialog_Title,
                  res.message,
                  this.el.nativeElement
                    .querySelector('input[id="suppCode123"]')
                    ?.focus(),
                    res.data?.isBillAuthorized ? 'info' : 'error'
                );
                this.reverseDebitNoteForm.get('suppCode')?.patchValue('');
                this.reverseDebitNoteForm.get('debitNote')?.patchValue('');
                this.loader = false;
            }
          },
          error: () => {this.loader = false;},
          complete: () => {this.loader = false;},
        });
    } else {
      this.reverseDebitNoteForm.markAllAsTouched();
      this.setFocusOnEmptyField();
    }
  }

  reverseDebitNote() {
    this.loader = true;
    this.debitNoteService
      .reverseDebitNote(
        this.reverseDebitNoteForm.get('debitNote')?.value[0][0].trim(),
        this.reverseDebitNoteForm.get('matgroup')?.value?.trim(),
        Number(this.reverseDebitNoteForm.get('lineQty')?.value)
      )
      .subscribe({
        next: (res: any) => {
          if (res.status) {
            this.loader = false;
            this.debitNoteReversed = true;
            this.showDialog(
              constant.ErrorDialog_Title,
              res.message,
              'info',
              false
            );
          } else {
            this.toastr.showError(res.message);
          }
        },
        error: () => {
          this.loader = false;
        },
        complete: () => {},
      });
  }

  fetchBillAnount(debitNoteData: any) {
    this.debitNoteService
      .fetchPbillAmountForRevereDebitNote(
        debitNoteData.suppbillno.trim(),
        debitNoteData.partycode.trim(),
        debitNoteData.project.trim(),
        debitNoteData.suppbilldt.trim(),
        debitNoteData.authno != undefined ? debitNoteData.authno : ''
      )
      .subscribe({
        next: (res: any) => {
          if (res.status) {
            this.reverseDebitNoteForm.get('billAmt')?.patchValue(res.data);
          }
        },
        error: () => {},
        complete: () => {},
      });
  }

  setDebitNoteCondition() {
    let mgc = this.reverseDebitNoteForm?.get('suppCode');
    let mc = this.reverseDebitNoteForm?.get('debitNote');
    mgc?.valueChanges.subscribe((val: any) => {
      console.log("Value: ", val)
      !val && mc?.setValue(null);
      this.debitnote_condition = `dbnh_partycode = '${
        val ? val instanceof Object && val[0][0].trim() : ''
      }'`;
    });
  }

  setRetrievedDebitNoteData(debitNoteData: any) {
    this.getDataName(
      'SUPPLIERS',
      debitNoteData.partycode.trim(),
      '',
      'debitNoteSupplierName'
    );
    this.getDataName(
      'BUILDINGS',
      debitNoteData.bldgcode.trim(),
      '',
      'buildingName'
    );
    this.getDataName(
      'BUILDINGS',
      debitNoteData.project.trim(),
      '',
      'projetcName'
    );
    this.getDataName(
      'COMPANY',
      debitNoteData.coy.trim(),
      '',
      'debitNoteCompanyName'
    );
    this.reverseDebitNoteForm.patchValue({
      narration: debitNoteData.narration,
      suppBillDate:
        debitNoteData.suppbilldt != undefined
          ? this.datePipe.transform(
              new Date(
                `${debitNoteData.suppbilldt.split('/')[1]}-` +
                  `${debitNoteData.suppbilldt.split('/')[0]}-` +
                  `${debitNoteData.suppbilldt.split('/')[2]}`
              ),
              'dd.MM.yyyy'
            )
          : '',
      projetcName: this.reverseDebitNoteForm.get('buildingName')?.value,
      debitNoteDate:
        debitNoteData.suppbilldt != undefined
          ? this.datePipe.transform(
              new Date(
                `${debitNoteData.date.split('/')[1]}-` +
                  `${debitNoteData.date.split('/')[0]}-` +
                  `${debitNoteData.date.split('/')[2]}`
              ),
              'dd.MM.yyyy'
            )
          : '',
      transerNo: debitNoteData.transer,
      description1: debitNoteData.description1,
      description2: debitNoteData.description2,
      description3: debitNoteData.description3,
      description4: debitNoteData.description4,
      lineValue: debitNoteData.amount,
      matgroup: debitNoteData.dbnotedResponses[0].matgroup,
      debitNoteAmnt: debitNoteData.amount,
      amt: debitNoteData.amount,
      itemRate:
        debitNoteData.dbnotedResponses[0].derate != undefined
          ? debitNoteData.dbnotedResponses[0].derate
          : '0.00',
      skuRate:
        debitNoteData.dbnotedResponses[0].rate != undefined
          ? debitNoteData.dbnotedResponses[0].rate
          : '0.00',
      skuQty: debitNoteData.dbnotedResponses[0].quantity,
      lineQty: debitNoteData.dbnotedResponses[0].dequantity,
      uom:
        debitNoteData.dbnotedResponses[0].deuom != undefined
          ? debitNoteData.dbnotedResponses[0].deuom
          : '',
      sku:
        debitNoteData.dbnotedResponses[0].deuom != undefined
          ? debitNoteData.dbnotedResponses[0].deuom
          : '',
    });
    this.fetchBillAnount(debitNoteData);
    this.loader = false;
  }

  back() {
    this.reverseDebitNoteForm.get('suppCode')?.enable();
    this.reverseDebitNoteForm.get('debitNote')?.enable();
    this.gstDebitNoteDetails = false;
    this.reverseDebitNoteForm.reset();
    this.debitnote_condition = '';
    this.loader = false;
    setTimeout(function () {
      document.getElementById('suppCode123')?.focus();
    }, 100);
    this.debitNoteReversed = false;
  }

  setFocusOnEmptyField() {
    if (!this.reverseDebitNoteForm.get('suppCode')?.value) {
      setTimeout(function () {
        document.getElementById('suppCode123')?.focus();
      }, 100);
    } else if (!this.reverseDebitNoteForm.get('debitNote')?.value) {
      setTimeout(function () {
        document.getElementById('debNote123')?.focus();
      }, 100);
    }
  }

  handleBackClick() {
    this.showDialog(
      constant.ErrorDialog_Title,
      'Data not saved. Do you want to exit?',
      'question',
      true
    );
  }

  reset() {
    this.reverseDebitNoteForm.get('suppCode')?.reset();
    this.reverseDebitNoteForm.get('debitNote')?.reset();
    this.reverseDebitNoteForm.get('supplierName')?.reset();
    this.debitnote_condition = 'dbnh_partycode = ';
    setTimeout(function () {
      document.getElementById('suppCode123')?.focus();
    }, 100);
    this.debitNoteReversed = false;
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  showDialog(
    titleVal: any,
    message: string,
    type: string,
    confirmationDialog: boolean
  ) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: '',
        type: type,
        confirmationDialog: confirmationDialog,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (confirmationDialog && result) {
        console.log('Testing');
        this.back();
      } else {
        if (this.debitNoteReversed) {
          this.back();
        }
      }
    });
  }
}
