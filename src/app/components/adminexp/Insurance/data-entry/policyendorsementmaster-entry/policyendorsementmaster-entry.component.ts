// Developed By  - 	nilesh.g
// Developed on - 16-03-23
// Mode  - Data Entry
// Component Name - policyEndorsementMaster-entryComponent
// .Net Form Name -
// PB Window Name -
// Purpose - Inspolendorsement Entry / Edit
// Reports Used -

// Modification Details
// =======================================================================================================================================================
// Date		Coder  Version User    Reason
// =======================================================================================================================================================

import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { merge, pipe, take } from 'rxjs';
import { insuranceService } from 'src/app/services/adminexp/insurance.service';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { DynapopService } from 'src/app/services/dynapop.service';
import { Date1Directive } from 'src/app/shared/directive/date1.directive';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-policyEndorsementMaster-entry',
  templateUrl: './policyEndorsementMaster-entry.component.html',
  styleUrls: ['./policyEndorsementMaster-entry.component.css'],
})
export class PolicyendorsementmasterentryComponent implements OnInit {
  initialMode: Boolean = false;
  tranMode: String = '';
  isBackClicked: boolean = false;
  dtOptions: any;
  filter_prevPolicy = `inp_renewedyn <> 'Y'`;
  fetchedPolicyData: any = [];
  disabledAdd = false;
  module = '';
  machinename = '';
  certstat = '';
  endorFlag: boolean = false;
  maxDate: Date = new Date();

  policyEndorsementMasterForm = new FormGroup({
    // Form Group for Data Entry / Edit
    polendorseid: new FormControl<String | null>('', [
      Validators.maxLength(10),
      Validators.required,
    ]),

    policyno: new FormControl<String>('', [
      Validators.required,
      Validators.maxLength(50),
    ]),

    status: new FormControl<string>({ value: '', disabled: true }),
    statusName: new FormControl<string>({ value: '', disabled: true }),

    policytype: new FormControl<string>({ value: '', disabled: true }),
    polTypeName: new FormControl<string>({ value: '', disabled: true }),

    policysubtype: new FormControl<string>({ value: '', disabled: true }),
    polSubTypeName: new FormControl<string>({ value: '', disabled: true }),

    inscoy: new FormControl<string>({ value: '', disabled: true }),
    insCompanyName: new FormControl<string>({ value: '', disabled: true }),

    agent: new FormControl<string>({ value: '', disabled: true }),
    agentName: new FormControl<string>({ value: '', disabled: true }),

    coycode: new FormControl<string>({ value: '', disabled: true }),
    companyName: new FormControl<string>({ value: '', disabled: true }),

    bldgcode: new FormControl<string>({ value: '', disabled: true }),
    buildingName: new FormControl<string>({ value: '', disabled: true }),

    fromdate: new FormControl({ value: '', disabled: true }),
    maturitydate: new FormControl({ value: '', disabled: true }),
    insuredval: new FormControl<string>({ value: '', disabled: true }),
    prevpolicynumber: new FormControl<string>({ value: '', disabled: true }),
    assetlocation: new FormControl<String>({ value: '', disabled: true }),
    policyid: new FormControl<string>({ value: '', disabled: true }),
    deductible: new FormControl<String>({ value: '', disabled: true }),

    payby: new FormControl<string>({ value: '', disabled: true }),
    paidByName: new FormControl<string>({ value: '', disabled: true }),

    staff1: new FormControl<string>({ value: '', disabled: true }),
    staff2: new FormControl<string>({ value: '', disabled: true }),
    personinsured: new FormControl<String>({ value: '', disabled: true }),
    nominationdetails: new FormControl<String>({ value: '', disabled: true }),
    bank: new FormControl<String>({ value: '', disabled: true }),
    branch: new FormControl<String>({ value: '', disabled: true }),
    ifsc: new FormControl<String>({ value: '', disabled: true }),
    accountNo: new FormControl<String>({ value: '', disabled: true }),
    accountName: new FormControl<String>({ value: '', disabled: true }),

    coverUnder: new FormControl<String>({ value: '', disabled: true }),
    itsection: new FormControl<String>({ value: '', disabled: true }),

    premiumfreq: new FormControl<string>({ value: '', disabled: true }),
    premiumfreqName: new FormControl<string>({ value: '', disabled: true }),

    paymode: new FormControl<String>({ value: '', disabled: true }),
    paymodeName: new FormControl<String>({ value: '', disabled: true }),

    polendorsenum: new FormControl<String>('', [
      Validators.maxLength(50),
      Validators.required,
    ]),

    polendorsedt: new FormControl('', Validators.required),
    endrfrdt: new FormControl(),
    endruptodt: new FormControl(),

    endorsetp: new FormControl<String>('', [
      Validators.maxLength(1),
      Validators.required,
    ]),

    endorsetpName: new FormControl<String>({ value: '', disabled: true }, [
      Validators.maxLength(50),
      Validators.required,
    ]),

    endrinsval: new FormControl<String>('0',[Validators.required,]),
    endrpremium: new FormControl<String>('0',[Validators.required,]),
    endrdetail: new FormControl<String>('', [
      Validators.maxLength(1000),
      Validators.required,
    ]),
    certnum: new FormControl<String>('', [Validators.maxLength(10)]),
    transer: new FormControl<String>('', [Validators.maxLength(10)]),

    certstat: new FormControl<String>('1', [
      Validators.maxLength(1),
      //Validators.required,
    ]),
    endrpaymode: new FormControl<String>('', [
      Validators.maxLength(1),
      Validators.required,
    ]),

    endrpaymodeName: new FormControl<String>({ value: '', disabled: true }, [
      Validators.maxLength(50),
      Validators.required,
    ]),

    endrpayby: new FormControl<String>('', [
      Validators.maxLength(5),
      Validators.required,
    ]),

    endrpaybyName: new FormControl<String>({ value: '', disabled: true }, [
      Validators.maxLength(50),
      Validators.required,
    ]),

    module: new FormControl<String>('', [
      Validators.maxLength(10),
      //Validators.required,
    ]),
    // add: new FormGroup({
    //   field1: new FormControl(''),
    //   field2: new FormControl(''),
    //   field3: new FormControl(''),
    //   field4: new FormControl(''),
    // }),
  });

  constructor(
    private insuranceService: insuranceService,
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private toastr: ToastrService,
    private modalService: ModalService,
    private dialog: MatDialog
  ) {}

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
    //this.loadinsPolicynoData();
    this.getpolicyid();
    this.loadStatus();
    this.loadPolicyType();
    this.loadPolicySubType();
    this.loadInsCompany();
    this.loadAgent();
    this.loadCompany();
    this.loadBuilding();
    this.loadPaidBy();
    this.loadStaff1();
    this.loadStaff2();
    this.loadPayMode();
    this.loadpremiumfreq();
  }

  getpolicyid() {
    this.policyEndorsementMasterForm
      .get('polendorseid')
      ?.valueChanges.subscribe((v) => {
        console.log('vvv', v);
        if (v) {
          this.disabledAdd = true;
        } else {
          this.disabledAdd = false;
        }
      });
  }

  addInspolendorsementDetails() {
    this.initialMode = true;
    this.policyEndorsementMasterForm.get('polendorseid')?.disable();
    this.policyEndorsementMasterForm
      .get('module')
      ?.setValue('ENDRO_ADD', { emitEvent: false });
    this.setFocus('policyno');
    this.tranMode = 'A';
    if ((this.tranMode = 'A')) {
      this.policyEndorsementMasterForm.get('policyno')?.enable();
    }
  }

  loadinsPolicynoData() {
    this.policyEndorsementMasterForm
      .get('policyno')
      ?.valueChanges.subscribe((val1: any) => {
        if (val1 instanceof Object) {
          let policyid = val1[0][0].trim().toUpperCase();
          this.policyEndorsementMasterForm.get('policyid')?.setValue(policyid);
          this.policyEndorsementMasterForm
            .get('policyno')
            ?.setValue(val1[0][1], { emitEvent: false });
          let policyNum = val1[0][1].trim().toUpperCase();

          let parms1 = {
            isAdd: true,
            policyNo: policyNum,
            polendorseid: '',
          };

          console.log('Policy Number :: ', policyNum);
          console.log('Policy Id :: ', policyid);

          if (policyNum) {
            this.insuranceService
              .getInspolendorsementDetailsByPolendorseid(parms1)
              .pipe(take(1))
              .subscribe({
                next: (res) => {
                  this.fetchedPolicyData = res;
                  if (res.status) {
                    setTimeout(() => {
                      this.bindInputValuesWithResponseBean(
                        this.fetchedPolicyData
                      );
                    }, 50);
                  } else {
                    this.toastr.error(res.message);
                  }
                },
              });
          }
        }
      });
  }

  loadStatus() {
    this.policyEndorsementMasterForm
      .get('status')
      ?.valueChanges.subscribe((val: any) => {
        if (val instanceof Object) {
          let code = val[0][0].trim();
          let desc = val[0][1].trim();
          this.policyEndorsementMasterForm.get('status')?.setValue(code);
          this.policyEndorsementMasterForm.get('statusName')?.setValue(desc);
        } else if (val == '') {
          this.policyEndorsementMasterForm.get('statusName')?.setValue('');
        }
      });
  }

  loadPolicyType() {
    this.policyEndorsementMasterForm
      .get('policytype')
      ?.valueChanges.subscribe((val: any) => {
        if (val instanceof Object) {
          let code = val[0][0].trim();
          let desc = val[0][1].trim();
          this.policyEndorsementMasterForm.get('policytype')?.setValue(code);
          this.policyEndorsementMasterForm.get('polTypeName')?.setValue(desc);
        } else if (val == '') {
          this.policyEndorsementMasterForm.get('polTypeName')?.setValue('');
        }
      });
  }

  loadPolicySubType() {
    this.policyEndorsementMasterForm
      .get('policysubtype')
      ?.valueChanges.subscribe((val: any) => {
        if (val instanceof Object) {
          let code = val[0][0].trim();
          let desc = val[0][1].trim();
          this.policyEndorsementMasterForm.get('policysubtype')?.setValue(code);
          this.policyEndorsementMasterForm
            .get('polSubTypeName')
            ?.setValue(desc);
        } else if (val == '') {
          this.policyEndorsementMasterForm.get('polSubTypeName')?.setValue('');
        }
      });
  }

  loadInsCompany() {
    this.policyEndorsementMasterForm
      .get('inscoy')
      ?.valueChanges.subscribe((val: any) => {
        if (val instanceof Object) {
          let code = val[0][0].trim();
          let desc = val[0][1].trim();
          this.policyEndorsementMasterForm.get('inscoy')?.setValue(code);
          this.policyEndorsementMasterForm
            .get('insCompanyName')
            ?.setValue(desc);
        } else if (val == '') {
          this.policyEndorsementMasterForm.get('insCompanyName')?.setValue('');
        }
      });
  }

  loadAgent() {
    this.policyEndorsementMasterForm
      .get('agent')
      ?.valueChanges.subscribe((val: any) => {
        if (val instanceof Object) {
          let code = val[0][0].trim();
          let desc = val[0][1].trim();
          this.policyEndorsementMasterForm.get('agent')?.setValue(code);
          this.policyEndorsementMasterForm.get('agentName')?.setValue(desc);
        } else if (val == '') {
          this.policyEndorsementMasterForm.get('agentName')?.setValue('');
        }
      });
  }

  loadCompany() {
    this.policyEndorsementMasterForm
      .get('coycode')
      ?.valueChanges.subscribe((val: any) => {
        if (val instanceof Object) {
          let code = val[0][0].trim();
          let desc = val[0][1].trim();
          this.policyEndorsementMasterForm.get('coycode')?.setValue(code);
          this.policyEndorsementMasterForm.get('companyName')?.setValue(desc);
        } else if (val == '') {
          this.policyEndorsementMasterForm.get('companyName')?.setValue('');
        }
      });
  }

  loadBuilding() {
    this.policyEndorsementMasterForm
      .get('bldgcode')
      ?.valueChanges.subscribe((val: any) => {
        if (val instanceof Object) {
          let code = val[0][0].trim();
          let desc = val[0][1].trim();
          this.policyEndorsementMasterForm.get('bldgcode')?.setValue(code);
          this.policyEndorsementMasterForm.get('buildingName')?.setValue(desc);
        } else if (val == '') {
          this.policyEndorsementMasterForm.get('buildingName')?.setValue('');
        }
      });
  }

  loadPaidBy() {
    this.policyEndorsementMasterForm
      .get('payby')
      ?.valueChanges.subscribe((val: any) => {
        if (val instanceof Object) {
          let code = val[0][0].trim();
          let desc = val[0][1].trim();
          this.policyEndorsementMasterForm.get('payby')?.setValue(code);
          this.policyEndorsementMasterForm.get('paidByName')?.setValue(desc);
        } else if (val == '') {
          this.policyEndorsementMasterForm.get('paidByName')?.setValue('');
        }
      });
  }

  loadStaff1() {
    this.policyEndorsementMasterForm
      .get('staff1')
      ?.valueChanges.subscribe((val: any) => {
        if (val instanceof Object) {
          let code = val[0][0].trim();
          this.policyEndorsementMasterForm.get('staff1')?.setValue(code);
        }
      });
  }

  loadStaff2() {
    this.policyEndorsementMasterForm
      .get('staff2')
      ?.valueChanges.subscribe((val: any) => {
        if (val instanceof Object) {
          let code = val[0][0].trim();
          this.policyEndorsementMasterForm.get('staff2')?.setValue(code);
        }
      });
  }

  loadPayMode() {
    this.policyEndorsementMasterForm
      .get('paymode')
      ?.valueChanges.subscribe((val: any) => {
        if (val instanceof Object) {
          let code = val[0][0].trim();
          let desc = val[0][1].trim();
          this.policyEndorsementMasterForm.get('paymode')?.setValue(code);
          this.policyEndorsementMasterForm.get('paymodeName')?.setValue(desc);
        } else if (val == '') {
          this.policyEndorsementMasterForm.get('paymodeName')?.setValue('');
        }
      });
  }

  loadpremiumfreq() {
    this.policyEndorsementMasterForm
      .get('premiumfreq')
      ?.valueChanges.subscribe((val: any) => {
        if (val instanceof Object) {
          let code = val[0][0].trim();
          let desc = val[0][1].trim();
          this.policyEndorsementMasterForm.get('premiumfreq')?.setValue(code);
          this.policyEndorsementMasterForm
            .get('premiumfreqName')
            ?.setValue(desc);
        } else if (val == '') {
          this.policyEndorsementMasterForm.get('premiumfreqName')?.setValue('');
        }
      });
  }

  retrieveInspolendorsementDetails() {
    let inspolendorseid: any =
      this.policyEndorsementMasterForm.get('polendorseid')?.value?.[0]?.[0];
    if (
      inspolendorseid &&
      this.policyEndorsementMasterForm.get('polendorseid')?.valid
    ) {
      let parms1 = {
        isAdd: false,
        polendorseid: inspolendorseid,
      };
      this.insuranceService
        .getInspolendorsementDetailsByPolendorseid(parms1)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.data) {
              let r = res.data.inspolendorsementResponseBeanList;
              this.initialMode = true;
              if (r[0]?.polendorsenum) {
                this.endorFlag = true;
              } else {
                this.endorFlag = false;
              }

              // to coloumn name data base -module add and modified endorsement
              this.policyEndorsementMasterForm.valueChanges.subscribe(() => {
                if (this.chkMod() && this.endorFlag) {
                  this.policyEndorsementMasterForm
                    .get('module')
                    ?.setValue('ENDROS_MOD', { emitEvent: false });
                } else if (!this.endorFlag) {
                  this.policyEndorsementMasterForm
                    .get('module')
                    ?.setValue('Endros_ADD', { emitEvent: false });
                }
              });

              // r[0]?.polendorsenum ? '' : '';
              this.tranMode = 'R';

              if ((this.tranMode = 'R')) {
                this.policyEndorsementMasterForm.get('policyno')?.disable();
              }

              setTimeout(() => {
                this.bindInputValuesWithResponseBean(res);
              }, 50);
              this.setFocus('polendorseid');
            } else {
              debugger;
              this.toastr.error('Inspolendorsement Not Found');
            }
            this.policyEndorsementMasterForm.get('polendorseid')?.disable();
          },
          error: (error) => {
            this.toastr.error(error.error.errors[0].defaultMessage);
          },
        });
    } else {
      this.toastr.error('Please Select Inspolendorsement');
    }
  }

  chkMod() {
    let control = [
      'certnum',
      'certstat',
      'endorsetp',
      'endrdetail',
      'endrfrdt',
      'endrinsval',
      'endrpayby',
      'endrpaymode',
      'endrpremium',
      'endruptodt',
      'polendorsedt',
      'polendorsenum',
      'policyid',
      'policyno',
      'transer',
    ];

    let mod = control.some((v) => {
      return this.policyEndorsementMasterForm.get(v)?.dirty == true;
    });

    console.log('Changed', mod);
    return mod;
  }

  bindInputValuesWithResponseBean(res: any) {
    let d = res.data.inspolendorsementResponseBeanList[0];
    let v = res.data.inspolicyResponseBeanList[0];
    // Initialise form values from response bean
    this.policyEndorsementMasterForm.patchValue({
      polendorseid: this.tranMode == 'R' ? d?.polendorseid : '',
      policyid:
        res.data.inspolendorsementResponseBeanList.length > 0
          ? d?.policyid
          : v?.policyid,
      polendorsenum:
        res.data.inspolendorsementResponseBeanList.length > 0
          ? d?.polendorsenum
          : v?.policynumber,
      // policyno: v?.policynumber,
      status: v?.status,
      policytype: v?.policytype,
      polTypeName: v?.polTypeName,
      policysubtype: v?.policysubtype,
      polSubTypeName: v?.polSubTypeName,
      inscoy: v?.inscoy,
      insCompanyName: v?.insCompanyName,
      agent: v?.agent,
      agentName: v?.agentName,
      coycode: v?.coycode,
      companyName: v?.companyName,
      bldgcode: v?.bldgcode,
      buildingName: v?.buildingName,
      fromdate: v?.fromdate
        ? moment(v?.fromdate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      maturitydate: v?.maturitydate
        ? moment(v?.maturitydate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      insuredval: v?.insuredval,
      prevpolicynumber: v?.prevpolicynumber,
      assetlocation: v?.assetlocation,
      deductible: v?.deductible,

      payby: v?.payby,
      paidByName: v?.paidByName,

      paymode: v?.paymode,
      paymodeName: v?.paymodeName,

      staff1: v?.staff1,
      staff2: v?.staff2,
      personinsured: v?.personinsured,
      nominationdetails: v?.nominationdetails,
      bank: v?.bank,
      branch: v?.branch,
      ifsc: v?.ifsc,
      accountNo: v?.accountNo,
      accountName: v?.accountName,
      coverUnder: v?.coverUnder,
      itsection: v?.itSection,

      premiumfreq: v?.premiumfreq,
      premiumfreqName: v?.premiumfreqName,

      polendorsedt: d?.polendorsedt
        ? moment(d?.polendorsedt, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      endrfrdt: v?.fromdate
        ? moment(v?.fromdate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      endruptodt: v?.maturitydate
        ? moment(v?.maturitydate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,

      endorsetp: d?.endorsetp,
      endorsetpName: d?.endorsetpName,

      endrinsval: d?.endrinsval ?? 0,
      endrpremium: d?.endrpremium ?? 0,
      endrdetail: d?.endrdetail ?? '',
      certnum: d?.certnum ?? '',
      transer: d?.transer ?? '',
      certstat: d?.certstat ?? '1',

      endrpaymode:
        res.data.inspolendorsementResponseBeanList.length > 0
          ? d?.endrpaymode
          : v?.paymode,
      endrpaymodeName: d?.endrpaymodeName,

      endrpayby:
        res.data.inspolendorsementResponseBeanList.length > 0
          ? d?.endrpayby
          : v?.payby,
      endrpaybyName:
        res.data.inspolendorsementResponseBeanList.length > 0
          ? d?.endrpaybyName
          : v?.paidByName,
    });

    this.policyEndorsementMasterForm
      .get('policyno')
      ?.setValue(v?.policynumber, { emitEvent: false });

    let policyStatus = v?.status;
    this.dynapop
      .getDynaPopSearchListObj('POLICYSTATUS', '', policyStatus)
      .subscribe((res1: any) => {
        this.policyEndorsementMasterForm.patchValue({
          statusName: res1.data.dataSet[0]?.[1],
        });
      });

    let policyType = v?.policytype;
    this.dynapop
      .getDynaPopSearchListObj('POLICYTYPE', '', policyType)
      .subscribe((res2: any) => {
        this.policyEndorsementMasterForm.patchValue({
          polTypeName: res2.data.dataSet[0]?.[1],
        });
      });

    let policySubType = v?.policysubtype;
    this.dynapop
      .getDynaPopSearchListObj('POLICYSUBTYPE', '', policySubType)
      .subscribe((res3: any) => {
        this.policyEndorsementMasterForm.patchValue({
          polSubTypeName: res3.data.dataSet[0]?.[1],
        });
      });

    let insCompany = v?.inscoy;
    this.dynapop
      .getDynaPopSearchListObj('INSCOMPANY', '', insCompany)
      .subscribe((res4: any) => {
        this.policyEndorsementMasterForm.patchValue({
          insCompanyName: res4.data.dataSet[0]?.[1],
        });
      });

    let agent = v?.agent;
    this.dynapop
      .getDynaPopSearchListObj('INSAGENT', '', agent)
      .subscribe((res5: any) => {
        this.policyEndorsementMasterForm.patchValue({
          agentName: res5.data.dataSet[0]?.[1],
        });
      });

    let companyName = v?.inscoy;
    this.dynapop
      .getDynaPopSearchListObj('INSCOMPANY', '', companyName)
      .subscribe((res4: any) => {
        this.policyEndorsementMasterForm.patchValue({
          companyName: res4.data.dataSet[0]?.[1],
        });
      });

    let buildingName = v?.bldgcode;
    this.dynapop
      .getDynaPopSearchListObj('BUILDINGS', '', buildingName)
      .subscribe((res7: any) => {
        this.policyEndorsementMasterForm.patchValue({
          buildingName: res7.data.dataSet[0]?.[1],
        });
      });

    let paidByName = v?.payby;
    this.dynapop
      .getDynaPopSearchListObj('POLICYPREMPDBY', '', paidByName)
      .subscribe((res9: any) => {
        this.policyEndorsementMasterForm.patchValue({
          paidByName: res9.data.dataSet[0]?.[1],
        });
      });

    let premiumfreqName = v?.premiumfreq;
    this.dynapop
      .getDynaPopSearchListObj('POLICYPREMFREQ', '', premiumfreqName)
      .subscribe((res10: any) => {
        this.policyEndorsementMasterForm.patchValue({
          premiumfreqName: res10.data.dataSet[0]?.[1],
        });
      });

    let paymodeName = v?.paymode;
    this.dynapop
      .getDynaPopSearchListObj('PAYMODES', '', paymodeName)
      .subscribe((res10: any) => {
        this.policyEndorsementMasterForm.patchValue({
          paymodeName: res10.data.dataSet[0]?.[1],
        });
      });

    let endorsetpName = d?.endorsetp;
    this.dynapop
      .getDynaPopSearchListObj('POLICYENDOSETYPE', '', endorsetpName)
      .subscribe((res10: any) => {
        this.policyEndorsementMasterForm.patchValue({
          endorsetpName: res10.data.dataSet[0]?.[1],
        });
      });

    let endrpaymodeName = v?.paymode;
    this.dynapop
      .getDynaPopSearchListObj('PAYMODES', '', endrpaymodeName)
      .subscribe((res10: any) => {
        this.policyEndorsementMasterForm.patchValue({
          endrpaymodeName: res10.data.dataSet[0][1],
        });
      });

    let endrpaybyName = v?.payby;
    this.dynapop
      .getDynaPopSearchListObj('POLICYPREMPDBY', '', endrpaybyName)
      .subscribe((res10: any) => {
        this.policyEndorsementMasterForm.patchValue({
          endrpaybyName: res10.data.dataSet[0][1],
        });
      });
  }

  setFocus(id: any) {
    // Method to set focus to object on form
    let elementToFocus = document.getElementById(id)
      ?.childNodes[0] as HTMLInputElement;
    elementToFocus?.focus();
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

  saveInspolendorsement() {
    console.log('how', this.policyEndorsementMasterForm);
    let vv = Object.keys(this.policyEndorsementMasterForm.value);
    console.log('vv1', vv);

    for (let item of vv) {
      if (this.policyEndorsementMasterForm.get(item)?.status == 'INVALID')
        console.log('in', item);
    }
    // Method to save data entered by user
    if (this.policyEndorsementMasterForm.valid) {
      let savePayload = {
        ...this.policyEndorsementMasterForm.value,
        module: 'ENDORS_ADD',
        machinename: 'Nilesh',
        certstat: '1',
      };

      let pm = this.policyEndorsementMasterForm.getRawValue();
      let payload: any = {
        certnum: pm.certnum ?? '',
        certstat: pm.certstat,
        endorsetp: pm.endorsetp?.[0]?.[0],
        endrdetail: pm.endrdetail,
        endrfrdt: moment(pm.endrfrdt, 'YYYY-MM-DD').format('DD/MM/YYYY'),
        endrinsval: pm.endrinsval,
        endrpayby: pm.endrpayby?.[0]?.[0],
        endrpaymode: pm.endrpaymode?.[0]?.[0],
        endrpremium: pm.endrpremium,
        endruptodt: moment(pm.endruptodt, 'YYYY-MM-DD').format('DD/MM/YYYY'),
        module: pm.module,
        polendorsedt: moment(pm.polendorsedt, 'YYYY-MM-DD').format(
          'DD/MM/YYYY'
        ),
        polendorsenum: pm.polendorsenum,
        policyid: pm.policyid,
        policyno: pm.policyno,
        transer: pm.transer ?? '',
      };

      console.log('savvv', payload);

      if (this.tranMode == 'R') {
        // Retrieve Mode
        console.log('rrrrrrr', pm);

        payload['polendorseid'] = pm.polendorseid?.[0]?.[0];
        console.log('rrrppppprrrr', payload);
        // return;
        this.insuranceService.updateInspolendorsement(payload).subscribe({
          next: (res: any) => {
            console.log('jk', res);

            if (res) {
              this.modalService.showErrorDialog(
                'Inspolendorsement Updated',
                res['message'],
                'info'
              );
              this.back();
            }
          },
          error: (err) => {
            console.log('err', err);
          },
        });
      } else if (this.tranMode == 'A') {
        console.log('savvv Add', payload);
        // New Entry Mode
        this.insuranceService.addInspolendorsement(payload).subscribe({
          next: (res) => {
            if (res.status) {
              this.modalService.showErrorDialog(
                'Inspolendorsement Added',
                res['message'],
                'info'
              );
              this.back();
            } else {
              this.toastr.error(
                res.message ?? 'Something went wrong',
                'Failed'
              );
            }
          },
        });
      }
    } else {
      this.toastr.error('Please fill the form properly'); // Data not entered properly
    }
  }

  setCode(entCode: string, col: string) {
    if (!(entCode.length == 0)) {
      let code = entCode.split(',');
      this.policyEndorsementMasterForm.get(`${col}`)?.patchValue(code[0]);
    }
  }

  handleBackClick() {
    this.isBackClicked = true;
    if (this.policyEndorsementMasterForm.dirty) {
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
    dialogRef.afterOpened().subscribe(() => {
      console.log('Dialog Opened');
    });
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
    this.policyEndorsementMasterForm.reset();
    this.initialMode = false;
    this.policyEndorsementMasterForm.controls['polendorseid'].enable();
    this.setFocus('polendorseid'); // Set focus on first column in selection form group
  }

  resetFormArray() {}
}
