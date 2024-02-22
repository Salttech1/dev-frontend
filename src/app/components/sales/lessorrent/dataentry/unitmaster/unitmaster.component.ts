// Developed By  - 	Vikram Patel
// Developed on : 19th December,2023
// Mode  - Data Entry
// Class Name - LessorunitmasterComponent
// .Net Form Name - prjLessorUnitFlatMst
// Purpose - Enter Unit and Rent details of Property (Used in Lessor Rent system)
// ' Reports Used -

// ' Modification Details
// '=======================================================================================================================================================
// ' Date		Author  Version User    Reason
// '=======================================================================================================================================================

import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { buttonsList } from 'src/app/shared/interface/common';
import { ServiceService } from 'src/app/services/service.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { ToastrService } from 'ngx-toastr';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { LessorrentService } from 'src/app/services/sales/lessorrent.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { CommonService } from 'src/app/services/common.service';
import { config, filter, finalize, take } from 'rxjs';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-unitmaster',
  templateUrl: './unitmaster.component.html',
  styleUrls: ['./unitmaster.component.css'],
})
export class LessorunitmasterComponent implements OnInit, AfterViewInit {
  initialMode: Boolean = false; // use for form hide and show
  tranMode: String = '';
  maxDate = new Date(); // use for future date disabled
  isBackClicked: boolean = false; // use for back button
  loaderToggle: boolean = false; // use for loader
  readonlyAttr = true;
  config: any = {
    isLoading: false,
    url: '',
    currentDate: new Date(),
    isSaveClick: false,
  };
  filters: any = {
    coy: '',
    unitid: '',
    unitno: '',
  };
  // hide & show buttons
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'add',
    'retrieve',
    'delete',
    'save',
    'reset',
    'back',
    'exit',
  ]);
  renderer: any;
  constructor(
    private fb: FormBuilder,
    private http: HttpRequestService,
    private dailog: MatDialog,
    private service: ServiceService,
    private LessorrentService: LessorrentService,
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private cdref: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: ModalService,
    private dialog: MatDialog,
    private router: Router,
    private commonService: CommonService
  ) {}

  unitSelectionsForm: FormGroup = new FormGroup({
    propcode: new FormControl<String | null>('', [
      Validators.required,
      Validators.maxLength(5),
    ]),
    unitid: new FormControl<String | null>('', [
      Validators.required,
      Validators.maxLength(10),
    ]),
    unitno: new FormControl<String | null>('', [
      Validators.required,
      Validators.maxLength(2),
    ]),
  });

  unitForm: FormGroup = new FormGroup({
    // Form Group for Unit  Details Entry / Edit
    amenity: new FormControl<String>('', [Validators.maxLength(100)]),
    propertyName: new FormControl<String>('', [Validators.maxLength(100)]),
    // constartdate: new FormControl<any>(new Date()),
    constartdate: new FormControl('',Validators.required,),
    // conenddate: new FormControl<any>(new Date()),
    conenddate: new FormControl('',Validators.required,),
    contactperson: new FormControl<String>('', [Validators.maxLength(50)]),
    conttenuare: new FormControl<String>('', [Validators.maxLength(50)]),
    depositeamt: new FormControl<number | 0>({
      value: 0,
      disabled: false,
    }),
    flatdesc: new FormControl<String>('', [Validators.maxLength(100)]),
    furniture: new FormControl<String>('', [Validators.maxLength(100)]),
    // lockfromdate: new FormControl<any>(new Date()),
    lockfromdate: new FormControl('',Validators.required,),
    // locktodate: new FormControl<any>(new Date()),
    locktodate: new FormControl('',Validators.required,),
    partycode: new FormControl<String>('', [Validators.maxLength(12)]),
    paycycle: new FormControl<String>('', [Validators.maxLength(2)]),
    paysendingmode: new FormControl<String>('', [Validators.maxLength(2)]),
    // paystartdate: new FormControl<any>(new Date()),
    paystartdate: new FormControl('',Validators.required,),
    // paystartdate: new FormControl('',[Validators.required, validateSuppDtFuture()],this.supplierDateValidation()),
    paystatus: new FormControl<String>('', [Validators.maxLength(5)]),
    person_pay: new FormControl<String>('', [Validators.maxLength(100)]),
    person_rec: new FormControl<String>('', [Validators.maxLength(100)]),
    propcode: new FormControl<String | null>('', [Validators.maxLength(5)]),
    propname: new FormControl<String | null>({
      value: '',
      disabled: true,
    }),
    unitname: new FormControl<String | null>({
      value: '',
      disabled: true,
    }),
    remarks: new FormControl<String>('', [Validators.maxLength(400)]),
    servtax: new FormControl<number | 0>({
      value: 0,
      disabled: false,
    }),
    sharecertstatus: new FormControl<String>('', [Validators.maxLength(1)]),
    tds: new FormControl<number | 0>({
      value: 0,
      disabled: false,
    }),
    unitarea: new FormControl<number | 0>({
      value: 0,
      disabled: false,
    }),

    unitflatstatus: new FormControl<String>('', [Validators.maxLength(1)]),
    unitgroup: new FormControl<String | null>('', [
      Validators.required,
      Validators.maxLength(10),
    ]),
    unitid: new FormControl<String | null>('', [
      Validators.required,
      Validators.maxLength(10),
    ]),
    unitno: new FormControl<String | null>('', [
      Validators.required,
      Validators.maxLength(2),
    ]),
    unitstatus: new FormControl<String>('', [Validators.maxLength(1)]),
    unittype: new FormControl<String>('', [Validators.maxLength(1)]),
    //   {
    //     "ipaddress": "string",
    //     "isUpdate": true,
    //     "machinename": "string",
    //     "site": "string",
    //     "today": "2023-12-19T11:05:17.138Z",
    //     "userid": "string"
    //   }
    // flatclosedate: new FormControl<any>(new Date()),
    flatclosedate: new FormControl('',Validators.required,),
  });

  ngOnInit(): void {
    this.init();
    // this.unitForm.get('date')?.setValue(new Date());
  }

  init() {
    this.config.url =
      this.router.url.split('/')[this.router.url.split('/').length - 1];

    //disabled default buttons
    this.commonService.enableDisableButtonsByIds(
      ['delete', 'save', 'back'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['add', 'retrieve', 'reset', 'exit'],
      this.buttonsList,
      false
    );
  }

  buttonAction(event: string) {
    if (event == 'add') {
      this.addUnitValidationDynamicaly(false);
      this.addUnitDetails();
    } else if (event == 'retrieve') {
      this.addUnitValidationDynamicaly(true);
      this.retrieveUnitDetails();
    } else if (event == 'save') {
      this.config.isSave = true;
      this.saveUnit();
    } else if (event == 'delete') {
      this.deleteConfirmationPopUp();
    } else if (event == 'print') {
    } else if (event == 'reset') {
      this.unitSelectionsForm.reset();
      this.filters.coy = '';
      this.filters.unitid = '';
      this.filters.unitno = '';
      var inputElement: any = document.getElementById('propcode');
      inputElement.focus();
    } else if (event == 'back') {
      this.goBack();
    } else if (event == 'exit') {
      this.router.navigateByUrl('/dashboard');
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  addUnitValidationDynamicaly(state: boolean) {
    const propertyCode: AbstractControl | any =
      this.unitSelectionsForm.get('propcode');

    // Conditionally set or remove the "required" validation
    if (state) {
      propertyCode.setValidators(Validators.required);
    } else {
      propertyCode.clearValidators();
    }

    // Update the value and validity of the control
    propertyCode.updateValueAndValidity();
  }

  ngAfterViewInit(): void {
    // this.initFocus.fo1.nativeElement.focus();
  }
  //  on action buttons click methods
  addUnitDetails() {
    const propertyCode: any = this.unitSelectionsForm.get('propcode');
    const unitId: any = this.unitSelectionsForm.get('unitid');
    const unitNo: any = this.unitSelectionsForm.get('unitno');

    this.initialMode = true;
    this.unitSelectionsForm.disable();
    // this.unitForm.get('date')?.setValue(new Date());
    this.setFocus('unitgroup');
    //this.focusField('proptype'); // Set focus on Property  type

    this.tranMode = 'A';
    // hide show buttons
    this.commonService.enableDisableButtonsByIds(
      ['add', 'retrieve', 'reset', 'exit'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['save', 'back'],
      this.buttonsList,
      false
    );

    console.log('form propertyCode ', propertyCode);
    console.log('form unit id ', unitId);
    console.log('form unit no ', unitNo);
    console.log('form valk', this.unitSelectionsForm);
  }

  retrieveUnitDetails() {
    this.actionService.getReterieveClickedFlagUpdatedValue(true);
    let propCode = this.commonService.convertArryaToString(
      this.unitSelectionsForm.get('propcode')?.value
    );
    let unitId = this.commonService.convertArryaToString(
      this.unitSelectionsForm.get('unitid')?.value
    );
    let unitNo = this.commonService.convertArryaToString(
      this.unitSelectionsForm.get('unitno')?.value
    );
    // if (propCode) and (unitId) and (unitNo) {
    if (propCode) {
      if (unitId) {
        if (unitNo) {
          this.LessorrentService.getUnitByCode(propCode, unitId, unitNo)
            .pipe(take(1))
            .subscribe({
              next: (res) => {
                if (res.data) {
                  this.initialMode = true;
                  setTimeout(() => {
                    this.filters.coy = "coy_prop='" + res.data.propritor + "'";
                    this.filters.unitid = "lessor_propcode='" + propCode + "'";
                    this.filters.unitno =
                      "lessor_unitid='" +
                      res.data.unitid +
                      " and lessor_propcode='" +
                      propCode +
                      "' and trim(lessor_unitstatus)<>'2'";
                    this.patchForm(res);
                    this.tranMode = 'R';
                    this.commonService.enableDisableButtonsByIds(
                      ['save', 'back', 'delete'],
                      this.buttonsList,
                      false
                    );
                    this.commonService.enableDisableButtonsByIds(
                      ['add', 'retrieve', 'reset', 'exit'],
                      this.buttonsList,
                      true
                    );

                    this.unitSelectionsForm.disable();
                  }, 0);
                } else {
                  this.toastr.error('Property/Unit/Owner Not Found');
                }
              },
              error: (error) => {
                this.toastr.error(error.error.errors[0].defaultMessage);
              },
            });
        } else {
          this.toastr.error('Please Select Owner No.');
        }
      } else {
        this.toastr.error('Please Select Unit ID');
      }
    } else {
      this.toastr.error('Please Select Property');
    }
  }

  saveUnit() {
    if (this.unitForm.valid) {
      let savePayload = {
        // propname: this.commonService
        //   .convertArryaToString(this.unitForm.get('propname')?.value)
        //   ?.trimEnd(),
        amenity: this.commonService.convertArryaToString(
          this.unitForm.get('amenity')?.value
        ),
        conenddate: this.unitForm.get('conenddate')?.value,
        constartdate: this.unitForm.get('constartdate')?.value,
        contactperson: this.commonService.convertArryaToString(
          this.unitForm.get('contactperson')?.value
        ),
        conttenuare: this.commonService.convertArryaToString(
          this.unitForm.get('conttenuare')?.value
        ),
        depositeamt: this.unitForm.get('depositeamt')?.value,
        flatdesc: this.commonService.convertArryaToString(
          this.unitForm.get('flatdesc')?.value
        ),
        furniture: this.commonService.convertArryaToString(
          this.unitForm.get('furniture')?.value
        ),
        lockfromdate: this.unitForm.get('lockfromdate')?.value,
        locktodate: this.unitForm.get('locktodate')?.value,
        partycode: this.commonService.convertArryaToString(
          this.unitForm.get('partycode')?.value
        ),
        paycycle: this.commonService.convertArryaToString(
          this.unitForm.get('paycycle')?.value
        ),
        paysendingmode: this.commonService.convertArryaToString(
          this.unitForm.get('paysendingmode')?.value
        ),
        paystartdate: this.unitForm.get('paystartdate')?.value,
        paystatus: this.commonService.convertArryaToString(
          this.unitForm.get('paystatus')?.value
        ),
        person_pay: this.commonService.convertArryaToString(
          this.unitForm.get('person_pay')?.value
        ),
        person_rec: this.commonService.convertArryaToString(
          this.unitForm.get('person_rec')?.value
        ),
        propcode: this.commonService.convertArryaToString(
          this.unitSelectionsForm.get('propcode')?.value
        ),
        remarks: this.commonService.convertArryaToString(
          this.unitForm.get('remarks')?.value
        ),
        servtax: this.unitForm.get('servtax')?.value,
        sharecertstatus: this.commonService.convertArryaToString(
          this.unitForm.get('sharecertstatus')?.value
        ),
        site: sessionStorage.getItem('site'),
        today: new Date(),
        tds: this.unitForm.get('tds')?.value,
        unitarea: this.unitForm.get('unitarea')?.value,
        unitflatstatus: this.commonService.convertArryaToString(
          this.unitForm.get('unitflatstatus')?.value
        ),
        unitgroup: this.commonService.convertArryaToString(
          this.unitForm.get('unitgroup')?.value
        ),
        unitid: this.commonService.convertArryaToString(
          this.unitSelectionsForm.get('unitid')?.value
        ),
        unitno: this.commonService.convertArryaToString(
          this.unitSelectionsForm.get('unitno')?.value
        ),
        unitstatus: this.commonService.convertArryaToString(
          this.unitForm.get('unitstatus')?.value
        ),
        unittype: this.commonService.convertArryaToString(
          this.unitForm.get('unittype')?.value[0]?.[0].trim()
        ),
        userid: sessionStorage.getItem('userName'),
        paytype: this.commonService.convertArryaToString(
          this.unitForm.get('paytype')?.value[0]?.[0].trim()
        ),
        propritor: this.commonService.convertArryaToString(
          this.unitForm.get('propritor')?.value
        ),
        coy: this.commonService.convertArryaToString(
          this.unitForm.get('coy')?.value[0]?.[0].trim()
        ),
        isUpdate: false,
        //   "ipaddress": "string",
        //   "machinename": "string",
      };

      if (this.tranMode == 'R') {
        // Retrieve Mode
        savePayload['isUpdate'] = true;
        savePayload['propcode'] = this.commonService.convertArryaToString(
          this.unitSelectionsForm.get('propcode')?.value
        );
        savePayload['unitid'] = this.commonService.convertArryaToString(
          this.unitSelectionsForm.get('unitid')?.value
        );
        savePayload['unitno'] = this.commonService.convertArryaToString(
          this.unitSelectionsForm.get('unitno')?.value
        );
        this.LessorrentService.updateProperty(savePayload)?.subscribe({
          next: (res) => {
            if (res.status) {
              this.showErrorFieldDialog('Unit Updated', res['message'], 'info');
            }
          },
          error: (error) => {
            if (error.status == 400) {
              console.log('error', error.error.errors[0].defaultMessage);
              this.modalService.showErrorDialog(
                constant.ErrorDialog_Title,
                error.error.errors[0].defaultMessage,
                'error'
              );
            } else {
              console.log('unit', this.unitForm);
              this.toastr.error('Something went wrong');
            }
          },
        });
      } else if (this.tranMode == 'A') {
        // New Entry Mode
        savePayload['propcode'] = this.commonService.convertArryaToString(
          this.unitSelectionsForm.get('propcode')?.value
        );
        savePayload['unitid'] = this.commonService.convertArryaToString(
          this.unitSelectionsForm.get('unitid')?.value
        );
        savePayload['unitno'] = this.commonService.convertArryaToString(
          this.unitSelectionsForm.get('unitno')?.value
        );
        this.LessorrentService.addUnit(savePayload).subscribe({
          next: (res) => {
            if (res.status) {
              this.commonService.enableDisableButtonsByIds(
                ['save'],
                this.buttonsList,
                true
              );

              // this.unitSelectionsForm.get('propcode')?.setValue(res.data)
              this.showErrorFieldDialog('Unit Added', res['message'], 'info');
            }
          },
          error: (error) => {
            if (error.status == 400) {
              console.log('error', error.error.errors[0].defaultMessage);
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
    } else {
      this.toastr.error('Please fill the form properly'); // Data not entered properly
    }
  }

  deleteUnit() {
    this.actionService.getDeleteActionFlag(true);
    let propCode = this.commonService.convertArryaToString(
      this.unitSelectionsForm.get('propcode')?.value
    );
    let unitid = this.commonService.convertArryaToString(
      this.unitSelectionsForm.get('unitid')?.value
    );
    let unitno = this.commonService.convertArryaToString(
      this.unitSelectionsForm.get('unitno')?.value
    );

    if (propCode) {
      if (unitid) {
        if (unitno) {
          this.LessorrentService.deleteUnit(
            propCode,
            unitid,
            unitno
          )?.subscribe({
            next: (res) => {
              console.log('res-----', res);

              if (res.result == 'success') {
                this.goBack();
                this.showErrorFieldDialog(
                  'Unit Deleted',
                  'Record deleted succesfully for Unit code ' + unitid,
                  'info'
                );
              } else {
                this.showErrorFieldDialog(
                  'Unit Not Deleted',
                  res.message + unitid,
                  'info'
                );
              }
            },
            error: (error) => {
              console.log('err', error);

              if (error.status == 400) {
                console.log('error', error.error.errors[0].defaultMessage);
                this.modalService.showErrorDialog(
                  constant.ErrorDialog_Title,
                  error.error.errors[0].defaultMessage,
                  'error'
                );
              } else {
                console.log('Unit', this.unitForm);
                this.toastr.error('Something went wrong');
              }
            },
          });
        }
      }
    }
  }

  handleBackClick() {
    this.isBackClicked = true;
    if (this.unitForm.dirty) {
      this.showConfirmation(
        constant.ErrorDialog_Title,
        'Do you want to ignore the changes done?',
        'question',
        true
      );
    } else {
      this.back();
      // this.resetForm();
    }
  }

  //Object Text values in upper case
  convertValuesToUpper(formgroup: any) {
    for (const obj of Object.keys(formgroup)) {
      if (formgroup[obj] && typeof formgroup[obj] == 'string') {
        formgroup[obj] = formgroup[obj].toUpperCase();
      }
    }
    return formgroup;
  }

  patchForm(res: any) {
    console.log('res', res);

    console.log('form value', this.unitForm);

    this.unitForm.patchValue({
    
      amenity: res.data.amenity,
      // constartdate: res.data.constartdate,
      constartdate: moment(res.data?.constartdate, 'DD/MM/YYYY').format(
        'YYYY-MM-DD'
      ),
      // conenddate: res.data.conenddate,
      conenddate: moment(res.data?.conenddate, 'DD/MM/YYYY').format(
        'YYYY-MM-DD'
      ),
      // lockfromdate: res.data.lockfromdate,
      lockfromdate: moment(res.data?.lockfromdate, 'DD/MM/YYYY').format(
        'YYYY-MM-DD'
      ),
      // locktodate: res.data.locktodate,
      locktodate: moment(res.data?.locktodate, 'DD/MM/YYYY').format(
        'YYYY-MM-DD'
      ),
      paycycle: res.data.paycycle,
      paysendingmode: res.data.paysendingmode,
      // paystartdate: res.data.paystartdate,
      paystartdate: moment(res.data?.paystartdate, 'DD/MM/YYYY').format(
        'YYYY-MM-DD'
      ),
      paystatus: res.data.paystatus,
      person_pay: res.data.person_pay,
      propcode: res.data.propcode,
      remarks: res.data.remarks,
      unitflatstatus: res.data.unitflatstatus,
      unitgroup: res.data.unitgroup,
      unitid: res.data.unitid,
      unitno: res.data.unitno,
      unitstatus: res.data.unitstatus,
      unittype: res.data.unittype,
      status: res.data.status,
      depositeamt: res.data.depositeamt,
      unitarea: res.data.unitarea,
      flatdesc: res.data.flatdesc,
      partycode: res.data.partycode,
      conttenuare: res.data.conttenuare,
      contactperson: res.data.contactperson,
      tds: res.data.tds,
      servtax: res.data.servtax,
      person_rec: res.data.person_rec,
      furniture: res.data.furniture,
      sharecertstatus: res.data.sharecertstatus,
      site: res.data.site,
      userid: res.data.today,
      machinename: res.data.machinename, 
      ipaddress: res.data.ipaddress,

   });
    this.unitForm.get('date')?.setValue(new Date());

    console.log('unitForm', this.unitForm);
  }

  onLeavepropritor(val: string) {
    this.filters.coy = "coy_prop='" + val + "'";
    console.log(this.filters.coy, 'get coy');
  }

  //on leave property
  onLeaverpropcode(val: string) {
    this.filters.unitid =
      "lessor_propcode='" + val + "' and lessor_unitstatus<>'2'";
    console.log(this.filters.unitid, 'get unit id');
  }

  //on leave unit id
  onLeaveunitid(val: string) {
    let propCd = this.commonService.convertArryaToString(
      this.unitSelectionsForm.get('propcode')?.value
    );

    this.filters.unitno =
      "lessor_unitid='" +
      val +
      "' and lessor_propcode='" +
      propCd +
      "' and trim(lessor_unitstatus)<>'2'";
    console.log(this.filters.unitno, 'get owner no.');
  }

  setFocus(id: string) {
    // Method to set focus to object on form
    setTimeout(() => {
      let inF = document.getElementById(id) as HTMLElement;
      this.renderer.selectRootElement(inF).focus();
    }, 100);
  }

  focusField(fieldId: any) {
    let el = document.getElementById(fieldId)
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  back() {
    // User clicks on Back button
    this.isBackClicked = false;
    this.initialMode = false;
    this.unitSelectionsForm.reset();
    this.unitSelectionsForm.enable();
    this.unitForm.reset();

    //this.deleteDisabled = true;
    this.unitSelectionsForm.controls['propcode'].enable();
    this.focusField('propertyCode'); // Set focus on Property  ID
    var inputElement: any = document.getElementById('propcode');
    inputElement.focus();
    this.filters.coy = '';
    this.filters.unitid = '';
    this.filters.unitno = '';

    this.commonService.enableDisableButtonsByIds(
      ['save', 'back'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['add', 'retrieve', 'reset', 'exit'],
      this.buttonsList,
      false
    );

  
    this.config.isSave = false;
  }

  resetForm() {
    this.unitSelectionsForm.reset();
    this.unitSelectionsForm.enable();
    this.unitForm.reset();
    this.unitForm.get('date')?.setValue(new Date());
    this.initialMode = false;
    var inputElement: any = document.getElementById('propcode');
    inputElement.focus();

    this.commonService.enableDisableButtonsByIds(
      ['save', 'back'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['add', 'retrieve', 'reset', 'exit'],
      this.buttonsList,
      false
    );

    // if (this.unitForm.dirty) {
    //   this.showConfirmation(
    //     constant.ErrorDialog_Title,
    //     'Do you want to ignore the changes done?',
    //     'question',
    //     true
    //   );
    // } else {
    //   this.back();
    // }
  }

  goBack() {
    this.unitSelectionsForm.reset();
    this.unitSelectionsForm.enable();
    this.unitForm.reset();
    this.initialMode = false;
    this.setFocus('propertyCode');

    this.commonService.enableDisableButtonsByIds(
      ['delete', 'save', 'back'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['add', 'retrieve', 'reset', 'exit'],
      this.buttonsList,
      false
    );
  }

  // error dailog box
  showErrorFieldDialog(
    titleVal: any,
    message: string,
    type: string,
    isDelete?: boolean
  ) {
    const dialogRef = this.dailog.open(ModalComponent, {
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
      // console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (this.unitSelectionsForm.value.propcode == '') {
        var inputElement: any = document.getElementById('propcode');
        inputElement.focus();
      }
    });
  }

  // confirm dailog box
  showConfirmation(
    titleVal: any,
    message: string,
    type: string,
    confirmationDialog: boolean,
    eventType?: string
  ) {
    const dialogRef = this.dailog.open(ModalComponent, {
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
      // console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('evetn tyeo', result);
        this.unitForm.get('date')?.setValue(new Date());

        this.back();

        if (this.isBackClicked) {
          this.back();
        }
      } else {
        this.back();
      }
    });
  }

  deleteConfirmationPopUp() {
    let unitid = this.commonService.convertArryaToString(
      this.unitSelectionsForm.get('unitid')?.value
    );

    const dialogRef = this.dailog.open(ModalComponent, {
      disableClose: true,

      data: {
        isF1Pressed: false,
        title: 'Unit Delete',
        message: 'Are you sure you want to delete Unit : ' + unitid,
        template: '',
        type: 'info',
        confirmationDialog: true,
      },
    });
    dialogRef.afterOpened().subscribe(() => {
      // console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteUnit();
      }
    });
  }
}
