import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  // ValidationErrors,
  // ValidatorFn,
  Validators,
} from '@angular/forms';
import { finalize, switchMap, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { OutgoingService } from 'src/app/services/sales/outgoing.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import * as constant from '../../../../../../constants/constant';
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
import * as moment from 'moment';
import { validateDebitNoteDate } from 'src/app/components/purchase/debit-notes/data-entry/gst-debit-notes-entry/gst-debit-notes-entry.component';

@Component({
  selector: 'app-outgoingbillgeneration',
  templateUrl: './outgoingbillgeneration.component.html',
  styleUrls: ['./outgoingbillgeneration.component.css'],
})
export class OutgoingbillgenerationComponent implements OnInit {
  initialMode: Boolean = true;
  // deleteDisabled: Boolean = false;
  queryForm: FormGroup = new FormGroup(
    {
      flatownerfrom: new FormControl<string[]>([], [Validators.required]),
      flatownerupto: new FormControl<string[]>([], [Validators.required]),
      billDate: new FormControl<string[]>([], [Validators.required]),
      checkCarPark: new FormControl(),
    },
    { validators: this.all() }
  );

  loaderToggle: boolean = false;
  formName!: string;
  ownerTypeCondition = `fown_ownertype = 0`;
  url!: string;
  billType!: string;

  constructor(
    private _commonReport: CommonReportsService,
    private OutgoingService: OutgoingService,
    private actionService: ActionservicesService,
    private toastr: ToastrService,
    // private _sales: SalesService,
    public _service: ServiceService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.addFocus('flatownerfrom');
    this.url =
      this.router.url.split('/')[this.router.url.split('/').length - 1];
    //  this.url == 'generatebillsgstfirst' ? this.queryForm.patchValue({chargeCode: 'AUXI'}) : this.queryForm.patchValue({chargeCode: 'INAP'})
    this.url == 'generatebillsgstfirst'
      ? (this.billType = 'F')
      : (this.billType = 'N');
    checked: this.billType == 'F' ? true : false;
    this.initialMode = true;
  }

  resetForm() {
    this.queryForm.reset({
      exportType: 'PDF',
      name: 'Rpt_OutgoingMonthlyCollRpt.rpt',
      flatownerfrom: [],
      flatownerupto: [],
      billDate: [],
      carPark: [],
    });
    this.queryForm.enable();
    this.initialMode = true;
    setTimeout(function () {
      document.getElementById('flatownerfrom')?.focus();
    }, 100);
  }

  setBillDate() {
    //To initialise bill date for First OG Bill
    let bldgCode = this.queryForm
      .get('flatownerfrom')
      ?.value[0][0].substring(0, 4);
    let flatNum = this.queryForm
      .get('flatownerfrom')
      ?.value[0][0].substring(5, 10)
      .trim();
    let wing = this.queryForm.get('flatownerfrom')?.value[0][0].substring(4, 5);
    this.OutgoingService.getOutrateDetailsByBldgcodeAndFlatnumAndWing(
      bldgCode,
      flatNum,
      wing
    )
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.data) {
            console.log('res.data - ', res.data);
            if (res.data.length == 0) {
              this.toastr.error('Outrate Data Not Found');
              this.addFocus('flatownerfrom');
            }
            if (this.billType == 'F') {
              for (var i = 0; i < res.data.length - 1; i++) {
                if (res.data[i].billtype == 'F') {
                  this.queryForm.controls?.['billDate'].patchValue(
                    new Date(
                      res.data[0].startdate.substring(0, 4) +
                        '/' +
                        res.data[0].startdate.substring(4, 6) +
                        '/' +
                        '01'
                    )
                  );
                  this.queryForm.controls?.['billDate'].disabled;
                }
              }
            }
          } else {
            this.toastr.error('Outrate Data Not Found');
            this.addFocus('flatownerfrom');
          }
        },
        error: (error) => {
          this.toastr.error(error.error.errors[0].defaultMessage);
          this.addFocus('flatownerfrom');
        },
      });
  }

  generateOutgoingBills() {
    if (this.queryForm.invalid) {
      this.toastr.error('Invalid Selections');
      this.addFocus('flatownerfrom');
    } else {
      let bldgCodeFrom = this.queryForm
        .get('flatownerfrom')
        ?.value[0][0].substring(0, 4);
      let wingFrom = this.queryForm
        .get('flatownerfrom')
        ?.value[0][0].substring(4, 5);
      let bldgCodeUpto = this.queryForm
        .get('flatownerupto')
        ?.value[0][0].substring(0, 4);
      let wingUpto = this.queryForm
        .get('flatownerupto')
        ?.value[0][0].substring(4, 5);
      if (bldgCodeFrom != bldgCodeUpto || wingFrom != wingUpto) {
        //
        this.toastr.error(
          'From and To owners should belong to same building and wing'
        );
        this.addFocus('flatownerfrom');
      } else {
        // this.actionService.getReterieveClickedFlagUpdatedValue(true);

        let billDate = this.queryForm.get('billDate')?.value;
        if (new Date(billDate) < new Date('07/01/2017')) {
          this.toastr.error('BillDate Cannot be less than 01/July/2017');
        } else {
          let flatOwnerFrom = this.queryForm
            .get('flatownerfrom')
            ?.value[0][0].trim();
          let flatOwnerUpto = this.queryForm
            .get('flatownerupto')
            ?.value[0][0].trim();
          // let flatOwnerFrom = `"${this.queryForm
          //   .get('flatownerfrom')
          //   ?.value[0][0].trim()}"`;
          // let flatOwnerUpto = `"${this.queryForm
          //   .get('flatownerupto')
          //   ?.value[0][0].trim()}"`;
          // let billDate = `"${this.queryForm.get('billDate')?.value}"`;
          // if (flatOwnerFrom != '' && flatOwnerUpto != '') {
          let sessionPayload: any = {
            flatOwnerFrom: flatOwnerFrom,
            flatOwnerUpto: flatOwnerUpto,
            billGenerationDate: moment(billDate).format('DD/MM/YYYY'),
            billType: this.billType
          };
          console.log('sessionPayload : ', sessionPayload);

          this.OutgoingService.generateOGBills(sessionPayload)
            .pipe(take(1))
            .subscribe({
              next: (res) => {
                if (res) {
                  console.log('res.data - ', res);

                  this.initialMode = false;
                  // this.deleteDisabled = false;
                } else {
                  this.toastr.error('No Data Found for generation');
                  this.addFocus('flatownerfrom');
                }
                this.queryForm.disable();
              },
              error: (error) => {
                this.toastr.error(error.error.errors[0].defaultMessage);
                this.addFocus('flatownerfrom');
              },
            });
        }

        // } else {
        //   this.toastr.error('Invalid Selections');
        // }
      }
    }
  }

  // setFocus(id: any) {
  //   // Method to set focus to object on form
  //   let elementToFocus = document.getElementById(id)
  //     ?.childNodes[0] as HTMLInputElement;
  //   elementToFocus?.focus();
  // }

  // add focus to elements by id
  addFocus(id: string) {
    this.renderer.selectRootElement(`#${id}`)?.focus();
  }

  all() {
    return (g: AbstractControl) => {
      return g.get('flatownerfrom')?.value.length
        ? null
        : { atLeastOneFilter: true };
      return g.get('flatownerupto')?.value.length
        ? null
        : { atLeastOneFilter: true };
      //    return g.get('wing')?.value.length ? null : { atLeastOneFilter: true };
      //    return g.get('flatNum')?.value.length ? null : { atLeastOneFilter: true };
    };
  }
}

// export function all() {
//   return (g: AbstractControl) => {
//     return g.get('flatownerfrom')?.value.length
//       ? null
//       : { atLeastOneFilter: true };
//     return g.get('flatownerupto')?.value.length
//       ? null
//       : { atLeastOneFilter: true };
//     //    return g.get('wing')?.value.length ? null : { atLeastOneFilter: true };
//     //    return g.get('flatNum')?.value.length ? null : { atLeastOneFilter: true };
//   };
// }
