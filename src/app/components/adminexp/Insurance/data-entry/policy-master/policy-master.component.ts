// Developed By  - 	Shahaji
// Mode  - Data Entry
// Class Name - policyMasterComponent
// .Net Form Name -
// PB Window Name -
// Purpose - Enter policy Details
// ' Reports Used -

// ' Modification Details
// '=======================================================================================================================================================
// ' Date		Author  Version User    Reason
// '=======================================================================================================================================================

import { Component, OnInit, Renderer2 } from '@angular/core';
import { DynapopService } from 'src/app/services/dynapop.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { insuranceService } from 'src/app/services/adminexp/insurance.service';
import { take, Subject, merge, takeUntil, map, Observable } from 'rxjs';
import { ModalService } from 'src/app/services/modalservice.service';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import * as constant from '../../../../../../constants/constant';
import * as moment from 'moment';

@Component({
  selector: 'app-policy-master',
  templateUrl: './policy-master.component.html',
  styleUrls: ['./policy-master.component.css'],
})
export class PolicyMasterComponent implements OnInit {
  changesUnsubscribe = new Subject();
  initialMode: Boolean = false;
  tranMode: String = '';
  isBackClicked: boolean = false;
  loaderToggle: boolean = false;
  fetchedPolicyData: any = [];
  navTab = 'insPremPaySch';
  filter_prevPolicy = `inp_renewedyn <> 'Y'`;
  filter_company = `(coy_closedate is null or coy_closedate='01/jan/2050')`;
  varMachineName = '';
  maxDate: Date = new Date();
  filter_bldg = '';

  policySelectionsForm: FormGroup = this.fb.group({
    policyid: [null, Validators.required],
  });

  policyForm: FormGroup = this.fb.group({
    status: [''],
    prevpolicynumber: [''],
    prevPolicyID: [{ value: '', disabled: true }],
    policynumber: [[], [Validators.required]],
    policytype: [[], [Validators.required]],
    polTypeName: [{ value: '', disabled: true }, [Validators.required]],
    policysubtype: [[], [Validators.required]],
    polSubTypeName: [{ value: '', disabled: true }, [Validators.required]],
    inscoy: [[], [Validators.required]],
    agent: [[], [Validators.required]],
    coycode: [[], Validators.required],
    bldgcode: [[], [Validators.required]],
    period: this.fb.group({
      fromdate: [null, [Validators.required, checkDate()]],
      maturitydate: [null, Validators.required],
    }),
    insuredval: [null, [Validators.required, Validators.min(1)]],
    premiumfreq: [[], [Validators.required]],
    payby: [[], [Validators.required]],
    assetlocation: [[], [Validators.required]],
    covunder: ['', [Validators.maxLength(100)]],
    deductible: ['', [Validators.maxLength(100)]],
    it_section: ['', [Validators.maxLength(25)]],
    staff1: [[], [Validators.required]],
    staff2: [],
    personinsured: ['', [Validators.required]],
    nominationdet: [''],
    paymode: [[], [Validators.required]],
    bank: ['', [Validators.maxLength(50)]],
    branch: ['', [Validators.maxLength(50)]],
    ifsc: ['', [Validators.maxLength(20)]],
    acnumber: ['', [Validators.maxLength(20)]],
    acholdername: ['', [Validators.maxLength(50)]],
    module: ['', [Validators.maxLength(10)]],
    machinename: ['', [Validators.maxLength(15)]],
    renewedyn: ['', [Validators.maxLength(1)]],
    insprempayschRequestBeanList: this.fb.array([]),
    insassetiteminsuredRequestBeanList: this.fb.array([]),
  });

  constructor(
    private insuranceService: insuranceService,
    private dynapop: DynapopService,
    private modalService: ModalService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setFocus('id_policyId');
  }

  updatePremium(data: any) {
    let premiumLength = data?.insprempayschRequestBeanList?.length;

    this.policyForm
      .get('insprempayschRequestBeanList')
      ?.valueChanges.subscribe((v) => {
        // console.log(
        //   'premium',
        //   this.policyForm.get('insprempayschRequestBeanList')
        // );
      });
  }

  setFocus(id: string) {
    // Method to set focus to object on form
    setTimeout(() => {
      this.renderer.selectRootElement(`#${id}`).focus();
    }, 100);
  }

  focusField(fieldId: any) {
    let el = document.getElementById(fieldId)
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  //----------------------------------------------------------grid: add row, delete row, and F1 ----------------------------------------Start
  addNewRow() {
    if (this.navTab == 'insPremPaySch') {
      // this.premScheduleFormArr.push(this.premScheduleInitRows());

      const assetArr = this.premScheduleFormArr.value?.length;
      let lineNo = 0;
      this.premScheduleFormArr.push(this.premScheduleInitRows(true));
      if (!assetArr) {
        this.premScheduleFormArr.controls[0].get('linenumber')?.setValue(1);
      } else {
        lineNo = this.premScheduleFormArr.controls[assetArr - 1]
          .get('linenumber')
          ?.getRawValue();

        this.premScheduleFormArr.controls[assetArr]
          .get('linenumber')
          ?.setValue(++lineNo);
      }
    } else if (this.navTab == 'insAssetItem') {
      const assetArr = this.assetItemFormArr.value?.length;
      let lineNo = 0;
      this.assetItemFormArr.push(this.assetItemInitRows(true));
      this.watchForChanges();

      if (!assetArr) {
        this.assetItemFormArr.controls[0].get('linenumber')?.setValue(1);
      } else {
        lineNo = this.assetItemFormArr.controls[assetArr - 1]
          .get('linenumber')
          ?.getRawValue();

        this.assetItemFormArr.controls[assetArr]
          .get('linenumber')
          ?.setValue(++lineNo);
      }
    }
  }

  premScheduleInitRows(isAdd: boolean) {
    return this.fb.group({
      linenumber: [{ value: 1, disabled: true }],
      payamt: [0, [Validators.required, Validators.min(1)]],
      paydate: [null, [Validators.required]],
      certnum: [null, Validators.maxLength(10)],
      transer: '',
      remark: [null, Validators.maxLength(100)],
      policynumber: '',
      module: '',
      machinename: '',
      isAdd: isAdd,
    });
  }

  get premScheduleFormArr() {
    return this.policyForm.get('insprempayschRequestBeanList') as FormArray;
  }

  assetItemInitRows(isAdd: Boolean): FormGroup {
    return this.fb.group({
      linenumber: [{ value: 1, disabled: true }],
      itemserial: ['', Validators.maxLength(10)],
      groupcode: ['', Validators.maxLength(5)],
      groupname: ['', Validators.maxLength(30)],
      srno: ['', Validators.maxLength(5)],
      subgroupcode: ['', Validators.maxLength(5)],
      subgroupname: ['', Validators.maxLength(30)],
      item: ['', Validators.maxLength(50)],
      brand: ['', Validators.maxLength(50)],
      itemdesc: ['', Validators.maxLength(1000)],
      value: 0,
      epcgvalue: 0,
      valuewithduty: 0,
      revisedvalue: 0,
      qty: [0, Validators.maxLength(9)],
      qtydesc: [null, Validators.maxLength(50)],
      purchaseyear: [null, Validators.maxLength(20)],
      purchasedate: null,
      remark: [null, Validators.maxLength(100)],
      bldgcode: '',
      policynumber: '',
      module: '',
      machinename: [''],
      isAdd: isAdd,
    });
  }

  get assetItemFormArr() {
    return this.policyForm.get(
      'insassetiteminsuredRequestBeanList'
    ) as FormArray;
  }

  watchForChanges() {
    // cleanup any prior subscriptions before re-establishing new ones
    this.changesUnsubscribe.next(null);

    merge(
      ...this.assetItemFormArr.controls.map(
        (control: AbstractControl, index: number) =>
          control.valueChanges.pipe(
            takeUntil(this.changesUnsubscribe),
            map((value) => ({ rowIndex: index, control: control, data: value }))
          )
      )
    ).subscribe((changes) => {
      this.getGroupName(changes);
      this.getSubGroupName(changes);
    });
  }

  // setValue to group Code & group name
  getGroupName(changes: any) {
    let grpCode =
      this.assetItemFormArr.controls[changes.rowIndex].get('groupcode');

    // to avoid change loop, checked Object Type & length
    if (
      grpCode?.value instanceof Object &&
      grpCode.value[0] instanceof Object &&
      grpCode.value[0]?.length != 1
    ) {
      this.assetItemFormArr.controls[changes.rowIndex]
        .get('groupname')
        ?.setValue(grpCode?.value[0]?.slice(1)[0], {
          emitEvent: false, // to avoid search api trigger after patch
        });

      this.assetItemFormArr.controls[changes.rowIndex]
        .get('groupcode')
        ?.setValue(grpCode?.value[0]?.slice(0, 1)[0], {
          emitEvent: false, // to avoid search api trigger after patch
        });

      // get dirty(Updated) row while save
      this.assetItemFormArr.controls[changes.rowIndex].markAsDirty();
    }
  }

  // setValue to subgroup Code & subgroup name
  getSubGroupName(changes: any) {
    let subGrpCode =
      this.assetItemFormArr.controls[changes.rowIndex].get('subgroupcode');

    // to avoid change loop, checked Object Type & length
    if (
      subGrpCode?.value instanceof Object &&
      subGrpCode.value[0] instanceof Object &&
      subGrpCode.value[0]?.length != 1
    ) {
      this.assetItemFormArr.controls[changes.rowIndex]
        .get('subgroupname')
        ?.setValue(subGrpCode?.value[0]?.slice(1)[0], {
          emitEvent: false, // to avoid search api trigger after patch
        });

      this.assetItemFormArr.controls[changes.rowIndex]
        .get('subgroupcode')
        ?.setValue(subGrpCode?.value[0]?.slice(0, 1)[0], {
          emitEvent: false, // to avoid search api trigger after patch
        });

      // get dirty(Updated) row while save
      this.assetItemFormArr.controls[changes.rowIndex].markAsDirty();
    }
  }

  deleteRow(rowIndex: any) {
    if (this.navTab == 'insPremPaySch') {
      this.premScheduleFormArr.length > 1
        ? this.premScheduleFormArr.removeAt(rowIndex)
        : this.toastr.error(
            'Atleast one row must be present in premium schedule'
          );
    }
    //Even if assest item does not have any single row policy can be saved.
    else if (this.navTab == 'insAssetItem') {
      this.assetItemFormArr.length > 0
        ? this.assetItemFormArr.removeAt(rowIndex)
        : this.toastr.error('Atleast one row must be present in asset item');
    }
  }
  //----------------------------------------------------------grid: add row, delete row, and F1 ----------------------------------------End

  //-----------------------------------------------------------------add---------------------------------------------------------------start

  addPolicyDetails() {
    // User clicks on Add button
    this.initialMode = true;
    this.policySelectionsForm.get('policyid')?.setValue('');
    this.policySelectionsForm.disable();
    this.setFocus('id_status');
    this.tranMode = 'A';

    if ((this.tranMode = 'A')) {
      this.policyForm.get('policynumber')?.enable();
      this.policyForm
        .get('policynumber')
        ?.setAsyncValidators(
          CheckPolicyNumExists.createValidator(this.insuranceService)
        );
    }

    this.premScheduleFormArr.push(this.premScheduleInitRows(true));
    // this.watchForChanges();

    this.statusChg();

    this.companyChg();
  }

  //to Make prePolicyNumber control enable/disable
  statusChg() {
    console.log('log', this.tranMode);
    this.policyForm.get('status')?.valueChanges.subscribe((v: any) => {
      if (v instanceof Object) {
        let str1 = v?.[0]?.[0].trim().toUpperCase();
        if (str1 == 'A') {
          this.policyForm.get('prevpolicynumber')?.disable();
          this.policyForm.get('renewedyn')?.setValue('N');
        } else if (str1 == 'R') {
          this.loadPrevPolicyData();
          this.policyForm.get('prevpolicynumber')?.enable();
          this.policyForm.get('renewedyn')?.setValue('N');
        } else {
          this.policyForm.get('prevpolicynumber')?.enable();
          this.policyForm.get('renewedyn')?.setValue('');
        }
      }
    });
  }

  companyChg() {
    this.policyForm.get('coycode')?.valueChanges.subscribe((v: any) => {
      this.filter_bldg = `(bldg_coy = '${v?.[0]?.[0].trim()}' or bldg_concoy = '${v?.[0]?.[0].trim()}' or bldg_paycoy = '${v?.[0]?.[0].trim()}')`;
    });
  }

  loadPrevPolicyData() {
    this.policyForm
      .get('prevpolicynumber')
      ?.valueChanges.subscribe((val1: any) => {
        if (val1 instanceof Object) {
          // let prevPolicyNum = val1[0][0].trim().toUpperCase();
          // this.policyForm.get('prevpolicynumber')?.setValue(prevPolicyNum);
          let policyID = val1[0][1].trim().toUpperCase();
          this.policyForm.patchValue({
            prevPolicyID: policyID,
          });
          console.log(
            'Prev policy Id:',
            this.policyForm.get('prevPolicyID')?.value
          );
          if (policyID) {
            this.insuranceService
              .getPolicyDetailsByID(policyID)
              .pipe(take(1))
              .subscribe({
                next: (res) => {
                  this.fetchedPolicyData = res.data;
                  this.fillHeaderData(this.fetchedPolicyData);
                },
              });
          }
        }
      });
  }

  clearBuilding() {
    this.policyForm.get('bldgcode')?.setValue([], { emitEvent: false });
  }

  //-------------------------------------------------------------------add---------------------------------------------------------------end

  //------------------------------------------------------------------retrieve----------------------------------------------------------start

  retrievePolicyDetails() {
    if (this.policySelectionsForm.valid) {
      let policyID = this.policySelectionsForm.get('policyid')?.value[0]?.[0];

      this.loaderToggle = true;
      this.insuranceService
        .getPolicyDetailsByID(policyID)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.tranMode = 'R';
            this.initialMode = true;
            this.policySelectionsForm.disable();
            this.fetchedPolicyData = res.data;

            // To clear CheckPolicyNumExists validation while retrieve
            if (this.tranMode == 'R') {
              // remove validation
              this.policyForm.get('policynumber')?.clearAsyncValidators();

              // disable control
              this.policyForm.get('status')?.disable();
              this.policyForm.get('policynumber')?.disable();
              this.policyForm.get('prevpolicynumber')?.disable();
            }

            this.policyForm
              .get('policynumber')
              ?.setValue(this.fetchedPolicyData.policynumber);

            this.policyForm
              .get('prevpolicynumber')
              ?.setValue(this.fetchedPolicyData.prevpolicynumber);

            setTimeout(() => {
              this.policyForm
                .get('status')
                ?.setValue(this.fetchedPolicyData.status);

              this.fillHeaderData(this.fetchedPolicyData);
              this.fillDetailData(this.fetchedPolicyData);
              this.companyChg();
            });
          },
        });
      
    } else {
      this.policySelectionsForm.markAllAsTouched();
    }
  }

  updatedRow(control: FormArray) {
    let updatedArr: any[] = [];
    control.controls?.forEach((val) => {
      if (val.dirty || val?.getRawValue()?.isAdd) {
        updatedArr.push(val?.getRawValue());
      }
    });
    return updatedArr;
  }

  fillHeaderData(fetchedApiData: any) {
    this.policyForm.patchValue({
      policytype: fetchedApiData?.policytype,
      policysubtype: fetchedApiData?.policysubtype,
      inscoy: fetchedApiData?.inscoy,
      agent: fetchedApiData?.agent,
      coycode: fetchedApiData?.coycode,
      bldgcode: fetchedApiData?.bldgcode,
      period: {
        fromdate: moment(fetchedApiData?.fromdate, 'DD/MM/YYYY').toDate(),
        maturitydate: moment(
          fetchedApiData?.maturitydate,
          'DD/MM/YYYY'
        ).toDate(),
      },
      insuredval: fetchedApiData?.insuredval,
      premiumfreq: fetchedApiData?.premiumfreq,
      payby: fetchedApiData?.payby,
      assetlocation: fetchedApiData?.assetlocation,
      covunder: fetchedApiData?.covunder,
      deductible: fetchedApiData?.deductible,
      it_section: fetchedApiData?.it_section,
      staff1: fetchedApiData?.staff1,
      staff2: fetchedApiData?.staff2,
      personinsured: fetchedApiData?.personinsured,
      nominationdet: fetchedApiData?.nominationdet,
      paymode: fetchedApiData?.paymode,
      bank: fetchedApiData?.bank,
      branch: fetchedApiData?.branch,
      ifsc: fetchedApiData?.ifsc,
      acnumber: fetchedApiData?.acnumber,
      acholdername: fetchedApiData?.acholdername,
    });

    // let company = fetchedApiData?.coycode;
    // this.dynapop
    //   .getDynaPopSearchListObj('COMPANY', '', company)
    //   .subscribe((res6: any) => {
    //     let coyCode = res6.data.dataSet[0]?.[0];
    //     this.filter_bldg = `(bldg_coy = '${coyCode}' or bldg_concoy = '${coyCode}' or bldg_paycoy = '${coyCode}')`;
    //   });
  }

  fillDetailData(fetchedApiData: any) {
    fetchedApiData?.insprempayschResponseBeanList?.forEach(
      (v: any, i: number) => {
        this.premScheduleFormArr.push(this.premScheduleInitRows(false));
        // this.watchForChanges();

        this.premScheduleFormArr.controls[i].patchValue({
          ...v,
          paydate: moment(v?.paydate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        });
      }
    );

    fetchedApiData?.insassetiteminsuredResponseBeanList?.forEach(
      (v: any, i: number) => {
        this.assetItemFormArr.push(this.assetItemInitRows(false));
        this.watchForChanges();

        this.assetItemFormArr.controls[i].patchValue({
          ...v,
          purchasedate: v?.purchasedate
            ? moment(v?.purchasedate, 'DD/MM/YYYY').format('YYYY-MM-DD')
            : null,
        });
      }
    );

    this.updatePremium(fetchedApiData);
  }

  //--------------------------------------------------------------------retrieve----------------------------------------------------------End

  //------------------------------------------------------------------Save Or Update----------------------------------------------------Start
  savePolicy() {
    console.log('save', this.policyForm);

    if (this.policyForm.valid) {
      // get form value in shorter variable name
      let fv = this.policyForm.getRawValue();

      // get updated/added row and manipulate
      let insassetiteminsuredRequestBeanList = this.updatedRow(
        this.assetItemFormArr
      )?.map((v: any) => {
        v.policyid = this.policySelectionsForm
          .get('policyid')
          ?.value[0]?.[0]?.trim();
        v.policynumber = fv.policynumber;
        // v.subgroupcode = v.subgroupcode[0]?.[0];
        // v.subgroupname = v.subgroupname[0]?.[0];
        v.bldgcode = fv.bldgcode[0]?.[0]?.trim();
        v.purchasedate = v.purchasedate
          ? moment(v.purchasedate).format('DD/MM/YYYY')
          : null;
        v.machinename = this.varMachineName;
        v.module = this.tranMode == 'A' ? 'POLICY_ADD' : 'POLICY_MOD';
        return v;
      });

      // get updated/added row and manipulate
      let insprempayschRequestBeanList = this.updatedRow(
        this.premScheduleFormArr
      ).map((v: any) => {
        v.policyid = this.policySelectionsForm
          .get('policyid')
          ?.value[0]?.[0]?.trim();
        v.policynumber = fv.policynumber;
        v.status = fv.status[0]?.[0]?.trim();
        v.paydate = moment(v.paydate).format('DD/MM/YYYY');
        v.machinename = this.varMachineName;
        v.module = this.tranMode == 'A' ? 'POLICY_ADD' : 'POLICY_MOD';
        return v;
      });

      let savePayload: any = {
        ...fv, // used javascript spread operator (...) for Object destructure
        machinename: this.varMachineName,
        fromdate: moment(fv.period?.fromdate).format('DD/MM/YYYY'),
        prevpolicyId: fv.prevPolicyID,
        policynumber: fv.policynumber,
        maturitydate: moment(fv.period?.maturitydate).format('DD/MM/YYYY'),
        agent: fv?.agent?.[0]?.[0]?.trim(),
        bldgcode: fv?.bldgcode?.[0]?.[0]?.trim(),
        coycode: fv?.coycode?.[0]?.[0]?.trim(),
        inscoy: fv?.inscoy?.[0]?.[0]?.trim(),
        payby: fv?.payby?.[0]?.[0]?.trim(),
        paymode: fv?.paymode?.[0]?.[0]?.trim(),
        policysubtype: fv?.policysubtype?.[0]?.[0]?.trim(),
        policytype: fv?.policytype?.[0]?.[0]?.trim(),
        premiumfreq: fv?.premiumfreq?.[0]?.[0]?.trim(),
        staff1: fv?.staff1?.[0]?.[0]?.trim(),
        staff2: fv?.staff2?.[0]?.[0]?.trim(),
        status: fv?.status?.[0]?.[0]?.trim(),

        insprempayschRequestBeanList: insprempayschRequestBeanList,
        insassetiteminsuredRequestBeanList: insassetiteminsuredRequestBeanList,
      };

      savePayload['module'] =
        this.tranMode == 'A' ? 'POLICY_ADD' : 'POLICY_MOD';

      if (this.tranMode == 'A') {
        let sta = this.policyForm
          .get('status')
          ?.value?.[0]?.[0]?.trim()
          ?.toUpperCase();
        if (sta == 'R') {
          savePayload['prevpolicynumber'] =
            this.policyForm.get('prevpolicynumber')?.value?.[0]?.[0];
        }

        this.insuranceService
          .addInsPolicy(savePayload)
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              if (res.status) {
                this.showErrorFieldDialog(
                  'Policy Added',
                  res['message'],
                  'info'
                );
                this.back();
              }
            },
          });
      } else if (this.tranMode == 'R') {
        savePayload['policyid'] =
          this.policySelectionsForm.get('policyid')?.value[0]?.[0];

        // console.log('savePayload2', savePayload);

        // return;
        this.insuranceService.updateInsPolicy(savePayload)?.subscribe({
          next: (res) => {
            if (res.status) {
              this.toastr.success(
                res.message
                  ? res.message
                  : 'Policy has been updated successfully',
                'Policy Updated'
              );

              this.back();
            }
          },
        });
      }
    } else {
      this.toastr.error('Please fill the form properly');
    }
  }
  //---------------------------------------------------------------Save Or Update-------------------------------------------------------------End

  handleBackClick() {
    this.isBackClicked = true;
    if (this.policyForm.dirty) {
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

  back() {
    // User clicks on Back button
    this.isBackClicked = false;
    this.initialMode = false;
    this.policyForm.reset();
    this.policySelectionsForm.controls['policyid'].enable();
    this.policySelectionsForm.reset();
    this.premScheduleFormArr.clear();
    this.assetItemFormArr.clear();
    this.policySelectionsForm.enable();
    this.setFocus('id_policyId');
    this.policyForm.get('status')?.enable();
    this.policyForm.get('policynumber')?.enable();
    this.policyForm.get('prevpolicynumber')?.enable();
  }

  showErrorFieldDialog(titleVal: any, message: string, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: '',
        type: type,
      },
    });
    dialogRef.afterOpened().subscribe(() => {
      console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.focusField('policyId');
      //window.location.reload()
    });
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
}

//To make sure that entered policy number is not already exists into database
export class CheckPolicyNumExists {
  static createValidator(insuranceService: insuranceService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return insuranceService.getPolicyIDByPolicyNum(control.value).pipe(
        map((result: { status: boolean; message?: string }) => {
          return result?.status
            ? {
                policyNumExists: {
                  message: result?.message,
                  status: result?.status,
                },
              }
            : null;
        })
      );
    };
  }
}

//Validation to not accept future date in FROM DATE of policy period
export function checkDate(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (moment(control.value).isAfter(new Date())) {
      return { futureDate: true };
    }
    return null;
  };
}
