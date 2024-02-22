import {
  AfterViewInit,
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { DynapopService } from 'src/app/services/dynapop.service';
import { DepositEntryService } from 'src/app/services/fd/deposit-entry.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-interest-cheque-data-entry',
  templateUrl: './interest-cheque-data-entry.component.html',
  styleUrls: ['./interest-cheque-data-entry.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class InterestChequeDataEntryComponent
  implements OnInit, AfterViewInit, OnChanges
{
  compHeader!: any[];
  compData: any;
  bringBackColumn!: number;
  coy_condition = `coy_fdyn='Y'`;
  bank_condition = ``;
  chequeData!: any[];
  saveDisabled: boolean = true;

  @ViewChild(F1Component) comp!: F1Component;
  @ViewChild('chIn') chIn!: ElementRef;

  interestChequeEntryForm: FormGroup = new FormGroup({
    coy: new FormControl<string | null>('', Validators.required),
    companyName: new FormControl<string | null>({ value: '', disabled: true }),
    bankCode: new FormControl<string | null>('', Validators.required),
    payMode: new FormControl<string | null>('1'),
    range: new FormGroup(
      {
        start: new FormControl<Date | null>(null, Validators.required),
        end: new FormControl<Date | null>(null, Validators.required),
      },
      Validators.required
    ),
  });

  bankHeader!: any[];
  bankData: any;
  bankbringBackColumn: any;
  dtOptions: DataTables.Settings = {};
  loader: Boolean = false;
  access: any[] = [];

  constructor(
    private dynapop: DynapopService,
    private cdref: ChangeDetectorRef,
    private toastr: ToasterapiService,
    private depositService: DepositEntryService,
    private _service: ServiceService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.getCompanyList();

    this._service.pageData.subscribe({
      next: (val) => {
        this.access = val.access ?? [];
      },
    });
  }

  ngAfterViewInit(): void {
    this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus(); //To add default focus on input field
  }

  //added to remove change detection console error
  ngOnChanges(changes: SimpleChanges): void {}

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

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

  updateCompanyList(e: any[]) {
    if (e?.length) {
      this.interestChequeEntryForm.patchValue({
        companyCode: e[0],
        companyName: e[1],
      });

      this.bank_condition = `bank_company='${e?.[0]}'`;
      this.getBankList();
    }
  }

  getBankList() {
    this.dynapop
      .getDynaPopListObj('BANKS', this.bank_condition)
      .subscribe((res: any) => {
        console.log('bank list', res);
        this.bankHeader = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.bankData = res.data;
        this.bankbringBackColumn = res.data.bringBackColumn;
      });
  }

  getBankCode(e: any[]) {
    this.interestChequeEntryForm.patchValue({
      bankCode: e[0],
    });
  }

  //retrieve cheque data
  retrieveInterestChequeData() {
    if (this.interestChequeEntryForm.valid) {
      let getInterestChequeDataParams = {
        coy: this.interestChequeEntryForm.get('coy')?.value.trim(),
        intFrom: moment(
          this.interestChequeEntryForm.get('range')?.value.start
        ).format('DD-MMM-yyyy'),
        intUpTo: moment(
          this.interestChequeEntryForm.get('range')?.value.end
        ).format('DD-MMM-yyyy'),
      };

      this.loader = true;
      this.depositService
        .getInterestChequeData(getInterestChequeDataParams)
        .pipe(
          finalize(() => {
            this.loader = false;
          })
        )
        .subscribe({
          next: (res) => {
            if (res?.data?.length) {
              this.chequeData = res.data;
              this.chequeData.map((v: any) => {
                v.bankcode =
                  this.interestChequeEntryForm.controls['bankCode'].value;
                v['oldChequeNum'] = v.chqnum; //saving old cheque no. for backend dev reference
              });
              this.focusInputs();
              this.saveDisabled = false;
              this.interestChequeEntryForm.disable();
            } else {
              this.toastr.showError('No Data found');
            }
          },
        });
    } else {
      this.toastr.showError('Please fill the form properly');
      this.interestChequeEntryForm.markAllAsTouched();
    }
  }

  //keyup.ArrowDown: Focus to next Depositor receipt incrementing cheque no. by +1
  valueChangeInput(i: number) {
    let mode = this.interestChequeEntryForm.get('payMode')?.value;
    console.log('mode', mode);
    console.log('mode1', this.chequeData[0].chqnum);

    if (mode == '1') {
      this.chequeData.map((val) => {
        val.chqnum = this.chequeData[0].chqnum;
        return val;
      });
    } else {
      let depCode = this.chequeData[i]?.depositor;
      let count = i;
      for (let j = i; depCode == this.chequeData[j]?.depositor; j++) {
        this.chequeData[j].chqnum = this.chequeData[i]?.chqnum;
        count++;
      }

      let elf = document.getElementById('inputInd' + count) as HTMLElement;
      if (elf) {
        this.renderer.selectRootElement(elf).focus();
        this.chequeData[count].chqnum =
          parseInt(this.chequeData[i]?.chqnum) + 1;
      }
    }
  }

  //update bank code and cheque no.
  save() {
    let payload = {
      coy: this.interestChequeEntryForm.get('coy')?.value,
      intFrom: moment(
        this.interestChequeEntryForm.get('range')?.value.start
      ).format('DD-MMM-yyyy'),
      intUpTo: moment(
        this.interestChequeEntryForm.get('range')?.value.end
      ).format('DD-MMM-yyyy'),
      depintBeanList: this.chequeData,
      userid: sessionStorage.getItem('userName'),
    };

    this.loader = true;
    this.saveDisabled = true;
    this.depositService
      .updateChequeNo(payload)
      .pipe(
        take(1),
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.saveDisabled = true;
          if (res?.status) {
            this.toastr.showSuccess('Interest Cheque data saved');
            this.reset();
          }
        },
        error: () => {
          this.saveDisabled = false;
        },
      });
  }

  //To focus on first input element inside table
  focusInputs() {
    setTimeout(() => {
      this.chIn.nativeElement.focus();
      this.chIn.nativeElement.select();
    }, 100);
  }

  reset() {
    this.saveDisabled = true;
    this.interestChequeEntryForm.reset({
      payMode: '1',
    });
    this.interestChequeEntryForm.enable();
    this.chequeData = [];
    this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus();
  }
}
