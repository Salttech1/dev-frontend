import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, take, takeLast } from 'rxjs';
import { DynapopService } from 'src/app/services/dynapop.service';
import { VehicleexpService } from 'src/app/services/adminexp/vehicleexp.service';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as commonConstant from '../../../../../../constants/commonconstant';

@Component({
  selector: 'app-vehicle-maintenance-expenses-gst',
  templateUrl: './vehicle-maintenance-expenses-gst.component.html',
  styleUrls: ['./vehicle-maintenance-expenses-gst.component.css'],
})
export class VehicleMaintenanceExpensesGstComponent implements OnInit {
  initialMode: Boolean = false;
  deleteDisabled: Boolean = true;
  tranMode: String = '';
  isDeleteClicked: boolean = false;
  isBackClicked: boolean = false;
  dtOptions: any;
  vehcondition = 'eqp_dispdate is null';
  vehSubid = '';
  partySubid = ` par_partytype = 'Z'`;
  wSubid = ` ent_id <> 'PETR'`;
  radioPetrol: boolean = false;
  admexphPayload: any;
  retrievedPartyCode: any;
  loaderToggle: boolean = false;
  disableSave: boolean = true;

  vehicleExpSelectionsForm: FormGroup = new FormGroup({
    vehnum: new FormControl<String[]>([], Validators.required),
    certnumsel: new FormControl<String[]>([], Validators.required),
    billnum: new FormControl<string>({ value: '', disabled: true }),
  }); // Form Group for Selection input fields

  vehicleExpForm: FormGroup = new FormGroup({
    // Form Group for Data Entry / Edit
    certnum: new FormControl<String>('', [Validators.maxLength(10)]), //,Validators.required,
    eqpVehtypeDesc: new FormControl<String>({ value: '', disabled: true }),
    allottedto: new FormControl<String>({ value: '', disabled: true }),
    CoyName: new FormControl<String>({ value: '', disabled: true }),
    propDesc: new FormControl<String>({ value: '', disabled: true }),
    coygst: new FormControl<String>({ value: '', disabled: true }),
    certrevnum: new FormControl<any>(0),
    certtype: new FormControl<String>('', [Validators.maxLength(5)]),
    certdate: new FormControl(),
    printed: new FormControl<any>(0),
    printedon: new FormControl(),
    passedon: new FormControl(),
    certstatus: new FormControl<String>('', [Validators.maxLength(1)]),
    coy: new FormControl<String>({ value: '', disabled: true }),
    prop: new FormControl<String>({ value: '', disabled: true }),
    socid: new FormControl<String>('', [Validators.maxLength(10)]),
    equipid: new FormControl<String>('', [Validators.maxLength(15)]),
    meterid: new FormControl<String>('', [Validators.maxLength(15)]),
    partytype: new FormControl<String>('', [Validators.maxLength(1)]),
    partycode: new FormControl<String>('', [
      Validators.maxLength(12),
      Validators.required,
    ]),
    partyDesc: new FormControl<String>({ value: '', disabled: true }),
    partygst: new FormControl<String>({ value: '', disabled: true }),
    certamount: new FormControl<any>(0),
    smeterred: new FormControl<any>({ value: 0, disabled: true }),
    emeterred: new FormControl<any>(0),
    gasqty: new FormControl<any>(0),
    average: new FormControl<any>(0),
    payref: new FormControl<String>('', [Validators.maxLength(10)]),
    paydate: new FormControl(),
    payamount: new FormControl<any>(0),
    transer: new FormControl<String>('', [Validators.maxLength(10)]),
    remarks: new FormControl<String>('', [Validators.maxLength(50)]),
    prv_certnum: new FormControl<String>('', [Validators.maxLength(10)]),
    prv_date: new FormControl(),
    prv_type: new FormControl<String>('', [Validators.maxLength(5)]),
    prv_amt: new FormControl<any>(0),
    t_payment: new FormControl<any>(0),
    estimatedkm: new FormControl<any>(0),
    billno: new FormControl<String>('', [Validators.maxLength(10)]),
    partybillref: new FormControl<String>('', [
      Validators.maxLength(16),
      Validators.required,
    ]),
    partybilldate: new FormControl<Date | null>(null, Validators.required),
    gstyn: new FormControl<String>('', [Validators.maxLength(1)]),
    kmsused: new FormControl<any>({ value: 0, disabled: true }),
    Averageused: new FormControl<any>({ value: 0, disabled: true }),
    WkCode: new FormControl('others', Validators.required),

    admexpdDetailsBreakUp: new FormArray([this.admexpdItemDetailInitRows()]),
  });
  //Validators.pattern(/^[0-9]+(\.[0-9]{0,2})?$/),
  admexpdItemDetailInitRows() {
    return this.fb.group({
      certnum: new FormControl<string | null>(null),
      bunum: new FormControl<any>(0),
      workcode: new FormControl<string | null>(null, [
        Validators.maxLength(5),
        Validators.required,
      ]),
      billref: new FormControl<string | null>(null),
      billdate: new FormControl(),
      billamount: new FormControl<any>(0, [Validators.maxLength(22), Validators.required,]),
      durationfrom: new FormControl(null,Validators.required),
      durationupto: new FormControl(null,Validators.required),
      hsmscode: new FormControl<string | null>(null,Validators.required),
      sgst: new FormControl<string>('0'),
      cgst: new FormControl<string>('0'),
      igst: new FormControl<string>('0'),
      ugst: new FormControl<string>('0'),
      sgstperc: new FormControl<any>(0, [Validators.maxLength(5)]),
      cgstperc: new FormControl<any>(0, [Validators.maxLength(5)]),
      igstperc: new FormControl<any>(0, [Validators.maxLength(5)]),
      ugstperc: new FormControl<any>(0, [Validators.maxLength(5)]),
      tdsperc: new FormControl<any>(0, [Validators.maxLength(5)]),
      tds: new FormControl<any>(0),
    });
  }

  constructor(
    private VehicleexpService: VehicleexpService,
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private cdref: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: ModalService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private el: ElementRef,
    private http: HttpClient
  ) {}

  billAmtTot: number = 0;
  sgstTot: number = 0;
  cgstTot: number = 0;
  igstTot: number = 0;
  ugstTot: number = 0;
  tdsTot: number = 0;
  certamt: number = 0;
  payamt: number = 0;

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthChange: true,
      pageLength: 10,
      Info: true,
      scrollY: '50vh',
      scrollCollapse: false,
      scrollX: true,
    };

    this.vehicleExpSelectionsForm.get('vehnum')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          let Vehno = res[0][0];
          this.vehSubid = ` admh_socid = 'VEHICLE' and admh_passedon is null  and admh_equipid = '${Vehno}'`;
        }
      },
    });
    this.updateInputPartyCode();
  }

  updateInputPartyCode() {
    let pc = this.vehicleExpForm.get('partycode');
    pc?.valueChanges.subscribe((val: any) => {
      if (val instanceof Object && val?.length) {
        pc?.patchValue(val?.[0]?.[0].trim());
      }
    });
  }

  addAdmexphDetails() {
    // User clicks on Add button to add row in table
    if (this.vehicleExpSelectionsForm.get('vehnum')?.invalid) {
      // this.vehicleExpSelectionsForm.get('vehnum')?.markAsTouched();
      this.focusById('vehnum');
      return;
    }
    this.tranMode = 'A';
    this.initialMode = true;
    this.disableSave = false;
    this.vehicleExpForm.patchValue({ WkCode: 'others' });
    this.getsetVehicleData();
    for (let i = 1; i < 1; i++) {
      this.admexpdItemBreakUpFormArr.push(this.admexpdItemDetailInitRows());
    }
    setTimeout(() => {
      this.focusById('partycode');
    }, 10);
    this.vehicleExpSelectionsForm.disable();
    this.vehicleExpForm.get('WkCode')?.enable();
  }

  get admexpdItemBreakUpFormArr() {
    return this.vehicleExpForm.get('admexpdDetailsBreakUp') as FormArray;
  }

  retrieveAdmexphDetails() {
    this.tranMode = 'R';

    if (this.vehicleExpSelectionsForm.valid) {
      this.actionService.getReterieveClickedFlagUpdatedValue(true);
      let certnum =
        this.vehicleExpSelectionsForm.get('certnumsel')?.value[0][0];
      let equipid = this.vehicleExpSelectionsForm.get('vehnum')?.value[0][0];

      this.VehicleexpService.getAdmexphDetailsByCertnumAndCoyAndCerttype(
        certnum,
        equipid
      )

        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.data) {
              this.disableSave = false;
              this.initialMode = true;
              this.retrievedPartyCode = res.data.partycode;
              this.bindInputValuesWithResponseBean(res);
              for (var i = 0; i < res.data.admexpdResponseBean?.length; i++) {
                res.data.admexpdResponseBean[i].durationfrom = moment(
                  res.data?.admexpdResponseBean[i]?.durationfrom,
                  'DD/MM/YYYY'
                ).format('YYYY-MM-DD');
                res.data.admexpdResponseBean[i].durationupto = moment(
                  res.data?.admexpdResponseBean[i]?.durationupto,
                  'DD/MM/YYYY'
                ).format('YYYY-MM-DD');
                res.data.admexpdResponseBean?.length - 1 == i
                  ? ''
                  : this.admexpdItemBreakUpFormArr.push(
                      this.admexpdItemDetailInitRows()
                    );
                this.vehicleExpForm.controls?.[
                  'admexpdDetailsBreakUp'
                ].patchValue(res.data.admexpdResponseBean);
                // debugger
                let wcode = res.data.admexpdResponseBean[i].workcode;
                if (wcode.trim() == 'PETR') {
                  this.radioPetrol = true;
                }
              }

              if (this.radioPetrol == true) {
                this.vehicleExpForm.patchValue({ WkCode: 'petrol' });
                this.wSubid = ` ent_id = 'PETR'`;
              } else {
                this.vehicleExpForm.patchValue({ WkCode: 'others' });
                this.wSubid = ` ent_id <> 'PETR'`;
              }
              this.vehicleExpForm.get('WkCode')?.disable();
              this.billAmtTot = this.totamount('billamount');
              this.sgstTot = this.totamount('sgst');
              this.cgstTot = this.totamount('cgst');
              this.igstTot = this.totamount('igst');
              this.ugstTot = this.totamount('ugst');
              this.tdsTot = this.totamount('tds');
              this.certamt = this.findCertamount();
              this.payamt = this.certamt;

              setTimeout(() => {
                this.focusById('partycode');
              }, 10);
            } else {
              this.toastr.error('Admexph Not Found');
            }
            this.vehicleExpSelectionsForm.disable();
          },
          error: (error) => {
            this.toastr.error(error.error.errors[0].defaultMessage);
            this.disableSave = true;
          },
        });
    } else {
      {
        // for (const key of Object.keys(this.vehicleExpSelectionsForm.controls)) {
        //   if (this.vehicleExpSelectionsForm.controls[key].invalid) {
        //     const invalidControl = this.el.nativeElement.querySelector(
        //       '[formcontrolname="' + key + '"]'
        //     );
        //     this.vehicleExpSelectionsForm.controls[key].markAsTouched();
        //     this.renderer.selectRootElement(invalidControl)?.focus();
        //     break;
        //   }
        // }
      }
    }
  }

  bindInputValuesWithResponseBean(res: any) {
    // Initialise form values from response bean
    this.vehicleExpForm.patchValue({
      certnum: res.data?.certnum,
      certrevnum: res.data?.certrevnum,
      certtype: res.data?.certtype,
      certdate: res.data?.certdate
        ? moment(res.data?.certdate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      printed: res.data?.printed,
      printedon: res.data?.printedon
        ? moment(res.data?.printedon, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      passedon: res.data?.passedonkmsused
        ? moment(res.data?.passedon, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      certstatus: res.data?.certstatus,
      coy: res.data?.coy,
      prop: res.data?.prop,
      socid: res.data?.socid,
      equipid: res.data?.equipid,
      meterid: res.data?.meterid,
      partytype: res.data?.partytype,
      partycode: res.data?.partycode.trim(),
      certamount: res.data?.certamount,
      smeterred: res.data?.smeterred,
      emeterred: res.data?.emeterred,
      kmsused: res.data?.emeterred - res.data?.smeterred,
      gasqty: res.data?.gasqty,
      average: res.data?.average,
      payref: res.data?.payref,
      paydate: res.data?.paydate
        ? moment(res.data?.paydate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      payamount: res.data?.payamount,
      transer: res.data?.transer,
      remarks: res.data?.remarks,
      prv_certnum: res.data?.prv_certnum,
      prv_date: res.data?.prv_date
        ? moment(res.data?.prv_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      prv_type: res.data?.prv_type,
      prv_amt: res.data?.prv_amt,
      t_payment: res.data?.t_payment,
      estimatedkm: res.data?.estimatedkm,
      Averageused: res.data?.average, 
      billno: res.data?.billno,
      partybillref: res.data?.partybillref,
      partybilldate: res.data?.partybilldate
        ? moment(res.data?.partybilldate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      gstyn: res.data?.gstyn,
    });
    this.vehicleExpSelectionsForm.patchValue({
      billnum: res.data?.billno,
    });
    this.getsetVehicleData();
    this.getPartyNameGST(
      res.data?.partycode,
      this.vehicleExpSelectionsForm.get('vehnum')?.value[0][0]
    );
  }

  addAdmexpdRow(i: number) {
    this.admexpdItemBreakUpFormArr.push(this.admexpdItemDetailInitRows());
    let newindex: number = 1;
    newindex = newindex + i;
    this.admexpdItemBreakUpFormArr.length - 1 == newindex
      ? setTimeout(() => {
          this.focusById('workcode' + newindex);
        }, 10)
      : this.focusById('workcode' + newindex);
  }

  deleteAdmexpdRow(rowIndex: any) {
    this.admexpdItemBreakUpFormArr.length == 1
      ? this.toastr.error('Cannot delete this row')
      : this.admexpdItemBreakUpFormArr.removeAt(rowIndex);
    this.billAmtTot = this.totamount('billamount');
    this.sgstTot = this.totamount('sgst');
    this.cgstTot = this.totamount('cgst');
    this.igstTot = this.totamount('igst');
    this.ugstTot = this.totamount('ugst');
    this.tdsTot = this.totamount('tds');
    this.certamt = this.findCertamount();
    this.payamt = this.certamt;
  }

  setFocus(id: any) {
    // Method to set focus to object on form
    let elementToFocus = document.getElementById(id)
      ?.childNodes[0] as HTMLInputElement;
    elementToFocus?.focus();
  }

  focusById(id: string) {
    this.renderer.selectRootElement(`#${id}`)?.focus();
  }

  convertValuesToUpper(formgroup: any) {
    // Method to convert all string input values to uppercase
    for (const obj of Object.keys(formgroup)) {
      if (formgroup[obj] && typeof formgroup[obj] == 'string') {
        formgroup[obj] = formgroup[obj].toUpperCase();
      }
    }
    return formgroup;
  }

  findCertamount(): number {
    let billamt: number;
    let tdsamt: number;
    tdsamt = this.totamount('tds');
    billamt =
      tdsamt > 0
        ? this.totamount('billamount') - tdsamt
        : this.totamount('billamount') +
          this.totamount('sgst') +
          this.totamount('cgst') +
          this.totamount('igst') +
          this.totamount('ugst');
    return parseFloat(billamt.toFixed(2));
  }

  SendCertamount(): number {
    let billamt: number;
    let tdsamt: number;
    tdsamt = this.totamount('tds');
    billamt =
      tdsamt > 0
        ? this.totamount('billamount') 
        : this.totamount('billamount') +
          this.totamount('sgst') +
          this.totamount('cgst') +
          this.totamount('igst') +
          this.totamount('ugst');
    return parseFloat(billamt.toFixed(2));
  }

  createPayload(vehicleNum: any, certNum: any) {
    let userid = sessionStorage.getItem('userName');

    // let lequipid = this.vehicleExpSelectionsForm?.value.vehnum[0][0];
    let lcertamt = this.SendCertamount();
    let lpayamount = this.findCertamount();

    let lpartygst = this.vehicleExpForm?.getRawValue().partygst;
    let lgstyn = '';
    lpartygst == null || lpartygst == undefined
      ? (lgstyn = 'N')
      : (lgstyn = 'Y');

    this.setAverage();
    console.log(this.vehicleExpForm?.getRawValue(),"<----Average");
//    return
    this.admexphPayload = {
      coy: this.vehicleExpForm?.getRawValue().coy,
      prop: this.vehicleExpForm?.getRawValue().prop,
      equipid: vehicleNum,
      certnum: certNum,
      billno: this.vehicleExpForm?.getRawValue().billno,
      partycode: this.vehicleExpForm?.value.partycode,
      partytype: 'Z',
      certamount: lcertamt,
      payamount: lpayamount,
      gstyn: lgstyn,
      remarks: this.vehicleExpForm?.value.remarks,
      partybillref: this.vehicleExpForm?.value.partybillref,
      partybilldate: this.vehicleExpForm?.value.partybilldate
        ? moment(this.vehicleExpForm?.value.partybilldate, 'YYYY-MM-DD').format(
            'DD/MM/YYYY'
          )
        : null,
      smeterred:
        this.vehicleExpForm?.value.WkCode == 'others'
          ? 0
          : this.vehicleExpForm?.getRawValue().smeterred,
      emeterred:
        this.vehicleExpForm?.value.WkCode == 'others'
          ? 0
          : this.vehicleExpForm?.value.emeterred,
      kmsused:
        this.vehicleExpForm?.value.WkCode == 'others'
          ? 0
          : this.vehicleExpForm?.getRawValue().kmsused,
      estimatedkm:
        this.vehicleExpForm?.value.WkCode == 'others'
          ? 0
          : (this.vehicleExpForm?.getRawValue().kmsused > 0 ? 0 : this.vehicleExpForm?.value.estimatedkm) ,
      gasqty:
        this.vehicleExpForm?.value.WkCode == 'others'
          ? 0
          : this.vehicleExpForm?.value.gasqty,
        average:
        this.vehicleExpForm?.getRawValue().WkCode == 'others'
          ? 0
          : this.vehicleExpForm?.getRawValue().Averageused,
      isUpdate: this.tranMode == 'R' ? true : false,
      admexpdRequestBean:
        this.vehicleExpForm.controls['admexpdDetailsBreakUp']?.value,
    };

    let arrList = this.admexphPayload.admexpdRequestBean;
    for (var j = 0; j < arrList.length; j++) {
      arrList[j].durationfrom
        ? (arrList[j].durationfrom = moment(
            arrList[j].durationfrom,
            'YYYY-MM-DD'
          ).format('DD/MM/YYYY'))
        : (arrList[j].durationfrom = null);
      arrList[j].durationupto
        ? (arrList[j].durationupto = moment(
            arrList[j].durationupto,
            'YYYY-MM-DD'
          ).format('DD/MM/YYYY'))
        : (arrList[j].durationupto = null);
    }

    // console.log(this.admexphPayload, 'admexphPayload<--------');
  }
  saveAdmexph() {
    const formArray = this.vehicleExpForm.get(
      'admexpdDetailsBreakUp'
    ) as FormArray;
    for (let i = 0; i < formArray.length; i++) {
      if (!this.admexpdItemBreakUpFormArr.controls[i].value.workcode) {
        this.admexpdItemBreakUpFormArr.removeAt(i);
        i = -1;
      }
    }

    if (this.vehicleExpForm.valid) {
      this.disableSave = true;
      this.loaderToggle = true;
      if (this.tranMode == 'R') {
        this.createPayload(
          this.vehicleExpSelectionsForm?.value.vehnum[0][0],
          this.vehicleExpSelectionsForm?.value.certnumsel[0][0]
        );
        this.VehicleexpService.addAdmexph(this.admexphPayload).subscribe({
          next: (res) => {
            this.loaderToggle = false;
            if (res.status) {
              this.modalService.showErrorDialogCallBack(
                'Admexph Updated',
                res['message'],
                this.back(),
                'info'
              );
            }
          },
          error: (error) => {
            if (error.status == 400) {
              this.modalService.showErrorDialog(
                constant.ErrorDialog_Title,
                error.error.errors[0].defaultMessage,
                'error'
              );
            } else {
              this.toastr.error('Something went wrong');
            }
            this.disableSave = false;
          },
        });
      } else if (this.tranMode == 'A') {
        this.createPayload(
          this.vehicleExpSelectionsForm?.value.vehnum[0][0],
          null
        );
        // New Entry Mode
        this.VehicleexpService.addAdmexph(this.admexphPayload).subscribe({
          next: (res) => {
            this.loaderToggle = false;
            if (res.status) {
              this.modalService.showErrorDialog(
                'Admexph Added',
                res.message,
                'info'
              );

              this.back();
            }
          },
          error: (error) => {
            if (error.status == 400) {
              this.modalService.showErrorDialog(
                constant.ErrorDialog_Title,
                error.error.errors[0].defaultMessage,
                'error'
              );
            } else {
              this.toastr.error('Something went wrong');
            }
            this.disableSave = false;
          },
        });
      }
    } else {
      this.toastr.error('Please fill the form properly'); // Data not entered properly
      for (const key of Object.keys(this.vehicleExpForm.controls)) {
        if (this.vehicleExpForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formcontrolname="' + key + '"]'
          );
          this.vehicleExpForm.controls[key].markAsTouched();
          this.renderer.selectRootElement(invalidControl)?.focus();
          break;
        }
      }
    }
  }

  passCert() {
    this.createPayload(
      this.vehicleExpSelectionsForm?.value.vehnum[0][0],
      this.vehicleExpSelectionsForm?.value.certnumsel[0][0]
    );
    // console.log('admexphPayload', this.admexphPayload);
    this.VehicleexpService.passVehicleCert(this.admexphPayload).subscribe({
      next: (res) => {
        if (res.status) {
          this.modalService.showErrorDialog(
            'Admexph Passed',
            res.message,
            'info'
          );

          this.back();
        }
      },
      error: (error) => {
        if (error.status == 400) {
          this.modalService.showErrorDialog(
            constant.ErrorDialog_Title,
            error.error.errors[0].defaultMessage,
            'error'
          );
        } else {
          this.toastr.error('Something went wrong');
        }
      },
    });
  }

  getsetVehicleData() {
    let getRetrieveAPI =
      'admexph/fetch-vehicleInfo' +
      '?vehnum=' +
      this.vehicleExpSelectionsForm.get('vehnum')?.value[0][0].trim();
    this.http.get(`${environment.API_URL}${getRetrieveAPI}`).subscribe({
      next: (res: any) => {
        if (!res.status) {
          this.showErrorDialog(
            constant.ErrorDialog_Title,
            res.message,
            'error'
          );
        } else {
          this.vehicleExpForm.patchValue({
            eqpVehtypeDesc: res.data?.vehtype,
            allottedto: res.data?.eqpAllottedto,
            coy: res.data?.eqpCoy,
            CoyName: res.data?.coyname,
            prop: res.data?.eqpProp,
            propDesc: res.data?.propname,
            coygst: res.data?.gstno,
            smeterred:
              this.tranMode == 'A'
                ? res.data?.startmeter
                : this.vehicleExpForm.get('smeterred')?.value,
          });
        }
      },
      error: () => {
        this.toastr.error('Error fetching vehicle info');
      },
    });
  }

  SetPartyDetails() {
    if (this.tranMode == 'R') {
      if (
        !(
          this.retrievedPartyCode.trim() ==
          this.vehicleExpForm.get('partycode')?.value
        )
      ) {
        this.getPartyInfo(
          this.vehicleExpForm.get('partycode')?.value.trim(),
          this.vehicleExpSelectionsForm.get('vehnum')?.value?.[0]?.[0]?.trim()
        );
      } else {
        this.getPartyNameGST(
          this.vehicleExpForm.get('partycode')?.value.trim(),
          this.vehicleExpSelectionsForm.get('vehnum')?.value?.[0]?.[0]?.trim()
        );
      }
    } else {
      if (this.vehicleExpForm.get('partycode')?.value){
        this.getPartyInfo(
          this.vehicleExpForm.get('partycode')?.value.trim(),
          this.vehicleExpSelectionsForm.get('vehnum')?.value?.[0]?.[0]?.trim()
        );
      }
    }
  }

  getPartyInfo(partyCode: string, vehiclenum: string) {
    let getRetrieveAPI = '';
    getRetrieveAPI =
      'admexph/fetch-partyInfo' +
      '?partycode=' +
      partyCode +
      '&vehicleno=' +
      vehiclenum;
    this.http
      .get(`${environment.API_URL}${getRetrieveAPI}`)
      .subscribe((res: any) => {
        if (!res.status) {
          this.toastr.error(res.message, 'Error', {
            disableTimeOut: true,
            tapToDismiss: false,
            closeButton: true,
          });
          this.vehicleExpForm.patchValue({
            partycode: '',
            partyDesc: '',
            partygst: '',
          });
          this.focusById('partycode');
        } else {
          if (partyCode == 'QQQQ') {
            this.toastr.info('Remember to enter Party Name in Remarks Field');
          }
          this.vehicleExpForm.patchValue({
            partyDesc: res.data?.partyname,
            partygst: res.data?.parGstno,
          });
        }
      });
  }

  getPartyNameGST(partyCode: string, vehiclenum: string) {
    let getRetrieveAPI = '';
    getRetrieveAPI =
      'party/fetch-partyNameGst' + '?partycode=' + partyCode + '&partytype=Z ';
    this.http
      .get(`${environment.API_URL}${getRetrieveAPI}`)
      .subscribe((res: any) => {
        if (!res.status) {
          this.toastr.error(res.message);
          this.focusById('partycode');
        } else {
          this.vehicleExpForm.patchValue({
            partycode: partyCode,
            partyDesc: res.data?.partyname,
            partygst: res.data?.parGstno,
          });
        }
      });
  }

  getsetGSTPercentage(
    i: any,
    coy: string,
    hsncode: string,
    partycode: string,
    partybilldate: string
  ) {
    //http://localhost:8080/common-gst/fetch-gst-perc?adPartyType=LOC&adowner=FEHO&adrPartySegment=PARTY&adtype=LOC&hsncode=998599&isUpdate=false&partycode=NEWB&segment=COY&suppbilldt=30%2F03%2F2023
    setTimeout(() => {
      let payload: any = {
        adPartyType: commonConstant.AdType.LOC,
        adowner: coy,
        adrPartySegment: commonConstant.segment.PARTY,
        adtype: commonConstant.AdType.LOC,
        hsncode: hsncode,
        isUpdate: false,
        partycode: partycode,
        segment: commonConstant.segment.COY,
        suppbilldt: partybilldate,
      };
      this.dynapop.getGst(payload).subscribe({
        next: (res: any) => {
          if (res.status) {
            const formArray = this.vehicleExpForm.get(
              'admexpdDetailsBreakUp'
            ) as FormArray;
            formArray.controls[i]
              .get('sgstperc')
              ?.patchValue(res.data?.sgstperc);
            formArray.controls[i]
              .get('cgstperc')
              ?.patchValue(res.data?.cgstperc);
            formArray.controls[i]
              .get('igstperc')
              ?.patchValue(res.data?.igstperc);
            formArray.controls[i]
              .get('ugstperc')
              ?.patchValue(res.data?.ugstperc);
            this.calcGST(i);
          } else {
            this.toastr.error(res.message);
            this.focusById('hsmscode');
          }
        },
      });
    }, 10);
  }

  setCode(entCode: string, i: any, col: string) {
    if (!(entCode.length == 0)) {
      let code = entCode.split(',');
      const formArray = this.vehicleExpForm.get(
        'admexpdDetailsBreakUp'
      ) as FormArray;
      formArray.controls[i].get(`${col}`)?.patchValue(code[0]);
    }
  }

  sethsnCode(hsn: string, i: any, colname: string) {
    if (!(hsn.length == 0)) {
      this.setCode(hsn, i, colname);
      const formArray = this.vehicleExpForm.get(
        'admexpdDetailsBreakUp'
      ) as FormArray;
      let company = this.vehicleExpForm.get('coy')?.value;
      let hsncode = formArray.controls[i].get('hsmscode')?.value;
      let partycd = this.vehicleExpForm?.value.partycode.trim();
      let partyrefbilldt = moment(
        this.vehicleExpForm?.value.partybilldate,
        'YYYY-MM-DD'
      ).format('DD/MM/YYYY');
      if (partycd == '') {
        this.toastr.error('Party Code cannot be empty');
        this.focusById('partycode');
        return;
      }
      if (partyrefbilldt == '' || partyrefbilldt == 'Invalid date') {
        this.toastr.error('Bill Date cannot be empty');
        this.focusById('partybilldate');
        return;
      }
      this.getsetGSTPercentage(i, company, hsncode, partycd, partyrefbilldt);
    }
  }

  getEndMeterReading() {
    let lsmeterred = this.vehicleExpForm.get('smeterred')?.value;
    let lemeterred = this.vehicleExpForm.get('emeterred')?.value;

    if (lsmeterred > lemeterred && lemeterred !== 0) {
      this.toastr.error(
        'End Meter Reading should be greater or equal to Start Meter Reading'
      );
      this.focusById('emeterred');
      return;
    }
    lsmeterred < lemeterred
      ? this.vehicleExpForm.patchValue({ kmsused: lemeterred - lsmeterred })
      : this.vehicleExpForm.patchValue({ kmsused: 0 });
    this.setAverage();
  }

  setAverage() {
    let lgasqty: any = this.vehicleExpForm.get('gasqty')?.value;
    let lestimatedkm: any = this.vehicleExpForm.get('estimatedkm')?.value;
    let lkmused: any =
      parseFloat(this.vehicleExpForm?.value.emeterred) -
      parseFloat(this.vehicleExpForm?.getRawValue().smeterred);
    if (lgasqty > 0) {
      if (lgasqty > 0 && lestimatedkm > 0) {
        let lavg: any = lestimatedkm / lgasqty;
        this.vehicleExpForm.patchValue({
          Averageused: parseFloat(lavg).toFixed(2),
        });
      } else {
        let lavg: any = lkmused / lgasqty;
        this.vehicleExpForm.patchValue({
          Averageused: parseFloat(lavg).toFixed(2),
        });
      }

      // if (lgasqty > 0 && lkmused > 0) {
      //   let lavg: any = lkmused / lgasqty;
      //   this.vehicleExpForm.patchValue({
      //     Averageused: parseFloat(lavg).toFixed(2),
      //   });
      // } else {
      //   let lavg: any = lestimatedkm / lgasqty;
      //   this.vehicleExpForm.patchValue({
      //     Averageused: parseFloat(lavg).toFixed(2),
      //   });
      // }
    } else {
      this.vehicleExpForm.patchValue({
        Averageused: 0,
      });
    }
  }

  billDateValidation(entdate: any) {
    let billDate = moment(entdate, 'DD/MM/YYYY');
    let currentDate = moment(new Date()).format('DD/MM/YYYY');
    if (entdate) {
      if (moment(currentDate, 'DD/MM/YYYY').isBefore(billDate)) {
        this.toastr.error('Bill Date cannot be greater than current date');
        this.vehicleExpForm.get('partybilldate')?.reset();
        this.focusById('partybilldate');
        return;
      }
    }
  }

  totamount(col: string): number {
    let total: number = 0;
    const formArray = this.vehicleExpForm.get(
      'admexpdDetailsBreakUp'
    ) as FormArray;
    for (var j = 0; j < formArray.length; j++) {
      total += parseFloat(`${formArray.controls[j].get(`${col}`)?.value}`);
    }
    return parseFloat(total.toFixed(2));
  }

  get items() {
    return this.vehicleExpForm.get('admexpdDetailsBreakUp') as FormArray;
  }

  valreq(i: number){
    debugger
    let val = this.items.controls[i].value;
    console.log("Bill Value",val);
    
    if (val.billamount == 0){
      this.items.controls[i].patchValue({
        billamount : ''
      });
    }
  }

  calcGST(i: number) {
    let val = this.items.controls[i].value;
    if (val.billamount > 0) {
      this.items.controls[i].patchValue({
        cgst:
          val.cgstperc > 0
            ? parseFloat(((val.cgstperc / 100) * val.billamount).toFixed(2))
            : 0,
        igst:
          val.igstperc > 0
            ? parseFloat(((val.igstperc / 100) * val.billamount).toFixed(2))
            : 0,
        sgst:
          val.sgstperc > 0
            ? parseFloat(((val.sgstperc / 100) * val.billamount).toFixed(2))
            : 0,
        ugst:
          val.ugstperc > 0
            ? parseFloat(((val.ugstperc / 100) * val.billamount).toFixed(2))
            : 0,
        tds:
          val.tdsperc > 0
            ? parseFloat(((val.tdsperc / 100) * val.billamount).toFixed(2))
            : 0,
      });
    }
    this.billAmtTot = this.totamount('billamount');
    this.sgstTot = this.totamount('sgst');
    this.cgstTot = this.totamount('cgst');
    this.igstTot = this.totamount('igst');
    this.ugstTot = this.totamount('ugst');
    this.tdsTot = this.totamount('tds');
    this.certamt = this.findCertamount();
    this.payamt = this.certamt;
  }

  handleDeleteClick() {
    this.isDeleteClicked = true;
    this.showConfirmation(
      constant.ErrorDialog_Title,
      'Are you sure want to delete this entry',
      'question',
      true
    );
  }

  handleBackClick() {
    this.isBackClicked = true;
    if (this.vehicleExpForm.dirty) {
      this.showConfirmation(
        constant.ErrorDialog_Title,
        'Do you want to ignore the changes done?',
        'question',
        true
      );
    } else {
      this.back();
    }
  }
  showErrorDialog(ErrorDialog_Title: string, message: any, arg2: string) {
    this.modalService.showErrorDialog(ErrorDialog_Title, message, arg2);
  }

  showConfirmation(
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
    dialogRef.afterOpened().subscribe(() => {});
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (this.isBackClicked) {
          this.back();
        }
      }
    });
  }

  back() {
    // User clicks on Back button
    this.isBackClicked = false;
    this.resetFormArray();
    this.vehicleExpSelectionsForm.reset();
    this.vehicleExpForm.reset();
    this.initialMode = false;
    this.deleteDisabled = true;
    this.tranMode = 'A';
    this.vehicleExpSelectionsForm.controls['certnumsel'].enable();
    this.vehicleExpSelectionsForm.controls['vehnum'].enable();
    this.radioPetrol = false;
    this.wSubid = ` ent_id <> 'PETR'`;
    this.billAmtTot = 0;
    this.sgstTot = 0;
    this.cgstTot = 0;
    this.igstTot = 0;
    this.ugstTot = 0;
    this.tdsTot = 0;
    this.certamt = 0;
    this.payamt = 0;
    this.vehicleExpForm.get('WkCode')?.enable();
    this.focusById('vehnum'); // Set focus on first column in selection form group
    this.retrievedPartyCode = '';
    this.disableSave = true;
  }
  optionSelect(event: any) {
    if (event.value == 'petrol') {
      this.vehicleExpForm.patchValue({ WkCode: 'petrol' });
      this.radioPetrol = true;
      this.wSubid = ` ent_id = 'PETR'`;
      this.vehicleExpForm.get('emeterred')?.setValidators(Validators.required);
      this.focusById('emeterred');
      this.deleteInsertRow();
      this.vehicleExpForm.get('emeterred')?.updateValueAndValidity();
    } else if (event.value == 'others') {
      this.vehicleExpForm.patchValue({ WkCode: 'others' });
      this.radioPetrol = false;
      this.wSubid = ` ent_id <> 'PETR'`;
      this.vehicleExpForm.get('emeterred')?.clearValidators;
      this.deleteInsertRow();
      this.focusById('workcode' + 0);
      this.vehicleExpForm.get('emeterred')?.updateValueAndValidity();
    }
  }

  deleteInsertRow() {
    // delete all rows in table
    const formArray = this.vehicleExpForm.get(
      'admexpdDetailsBreakUp'
    ) as FormArray;
    let deleterows = formArray.length;
    for (var j = deleterows; deleterows >= j && j >= 0; j--) {
      this.admexpdItemBreakUpFormArr.removeAt(j - 1);
    }
    // insert two rows
    for (let i = 0; i < 1; i++) {
      this.admexpdItemBreakUpFormArr.push(this.admexpdItemDetailInitRows());
    }
    this.billAmtTot = 0;
    this.sgstTot = 0;
    this.cgstTot = 0;
    this.igstTot = 0;
    this.ugstTot = 0;
    this.tdsTot = 0;
    this.certamt = 0;
    this.payamt = 0;
  }

  resetFormArray() {
    this.admexpdItemBreakUpFormArr.clear();
    this.vehicleExpForm.controls?.['admexpdDetailsBreakUp'].reset();
    this.admexpdItemBreakUpFormArr.push(this.admexpdItemDetailInitRows());
  }
}
