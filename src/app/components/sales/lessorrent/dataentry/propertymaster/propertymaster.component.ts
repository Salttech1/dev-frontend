// Developed By  - 	Vikram Patel
// Developed on : 6th December,2023
// Mode  - Data Entry
// Class Name - PropertymasterComponent
// .Net Form Name - prjLessorPropMst
// Purpose - Enter Property Details (Used in Lessor Rent system)
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

@Component({
  selector: 'app-propertymaster',
  templateUrl: './propertymaster.component.html',
  styleUrls: ['./propertymaster.component.css'],
})
export class PropertymasterComponent implements OnInit, AfterViewInit {
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

  propertySelectionsForm: FormGroup = new FormGroup({
    propcode: new FormControl<String | null>('', [
      Validators.required,
      Validators.maxLength(5),
    ]),
    propertyName: new FormControl<String | null>({ value: '', disabled: true }),
  });

  propertyForm: FormGroup = new FormGroup({
    // Form Group for Property  Details Entry / Edit
    propname: new FormControl<String>('', [
      Validators.maxLength(150),
      Validators.required,
    ]),
    description: new FormControl<String>('', [
      Validators.maxLength(150),
      Validators.required,
    ]),
    location: new FormControl<string>('', [Validators.maxLength(5)]),
    locationName: new FormControl<String | null>({ value: '', disabled: true }),
    paytype: new FormControl<string>('', [Validators.maxLength(1)]),
    paytypeName: new FormControl<String | null>({ value: '', disabled: true }),
    propritor: new FormControl<string>('', [
      Validators.maxLength(5),
      Validators.required,
    ]),
    propritorName: new FormControl<String | null>({
      value: '',
      disabled: true,
    }),
    coy: new FormControl<string>('', [
      Validators.maxLength(5),
      Validators.required,
    ]),
    coyName: new FormControl<String | null>({ value: '', disabled: true }),
    proptype: new FormControl<any>('', [Validators.maxLength(1)]),
    proptypeName: new FormControl<String | null>({ value: '', disabled: true }),
    date: new FormControl<any>(new Date()),
  });

  ngOnInit(): void {
    this.init();
    this.propertyForm.get('date')?.setValue(new Date());
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
      this.addPropertyCodeValidationDynamicaly(false);
      this.addPropertyDetails();
    } else if (event == 'retrieve') {
      this.addPropertyCodeValidationDynamicaly(true);
      this.retrievePropertyDetails();
    } else if (event == 'save') {
      this.config.isSave = true;
      this.saveProperty();
    } else if (event == 'delete') {
      this.deleteConfirmationPopUp();
    } else if (event == 'print') {
    } else if (event == 'reset') {
      this.propertySelectionsForm.reset();
      this.filters.coy = '';
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

  addPropertyCodeValidationDynamicaly(state: boolean) {
    // Get the invoiceType control
    const propertyCode: AbstractControl | any =
      this.propertySelectionsForm.get('propcode');

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
  addPropertyDetails() {
    const propertyCode: any = this.propertySelectionsForm.get('propcode');

    this.initialMode = true;
    this.propertySelectionsForm.disable();
    this.propertyForm.get('date')?.setValue(new Date());
    this.setFocus('proptypeId');
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

    console.log('form propertyCode', propertyCode);
    console.log('form valk', this.propertySelectionsForm);
  }

  retrievePropertyDetails() {
    this.actionService.getReterieveClickedFlagUpdatedValue(true);
    let propCode = this.commonService.convertArryaToString(
      this.propertySelectionsForm.get('propcode')?.value
    );
    if (propCode) {
      this.LessorrentService.getPropertyByCode(propCode)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.data) {
              this.initialMode = true;
              setTimeout(() => {
                this.filters.coy = "coy_prop='" + res.data.propritor + "'";
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

                this.propertySelectionsForm.disable();
              }, 0);
            } else {
              this.toastr.error('Property  Not Found');
            }
          },
          error: (error) => {
            this.toastr.error(error.error.errors[0].defaultMessage);
          },
        });
    } else {
      this.toastr.error('Please Select Property');
    }
  }

  saveProperty() {

    if (this.propertyForm.valid) {

      let savePayload = {
        propcode: this.commonService.convertArryaToString(
          this.propertySelectionsForm.get('propcode')?.value
        ),
        propname: this.commonService
          .convertArryaToString(this.propertyForm.get('propname')?.value)
          ?.trimEnd(),
        description: this.commonService.convertArryaToString(
          this.propertyForm.get('description')?.value
        ),
        location: this.commonService.convertArryaToString(
          this.propertyForm.get('location')?.value[0]?.[0].trim()
        ),
        paytype: this.commonService.convertArryaToString(
          this.propertyForm.get('paytype')?.value[0]?.[0].trim()
        ),
        propritor: this.commonService.convertArryaToString(
          this.propertyForm.get('propritor')?.value
        ),
        coy: this.commonService.convertArryaToString(
          this.propertyForm.get('coy')?.value[0]?.[0].trim()
        ),
        proptype: this.commonService
          .convertArryaToString(this.propertyForm.get('proptype')?.value)
          ?.trimEnd(),
        site: sessionStorage.getItem('site'),
        today: new Date(),
        userid: sessionStorage.getItem('userName'),
        isUpdate: false,
      };

      if (this.tranMode == 'R') {
        // Retrieve Mode
        savePayload['isUpdate'] = true;
        savePayload['propcode'] = this.commonService.convertArryaToString(
          this.propertySelectionsForm.get('propcode')?.value
        );
        this.LessorrentService.updateProperty(savePayload)?.subscribe({
          next: (res) => {
            if (res.status) {
              this.showErrorFieldDialog(
                'Property  Updated',
                res['message'],
                'info'
              );
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
              console.log('property', this.propertyForm);
              this.toastr.error('Something went wrong');
            }
          },
        });
      } else if (this.tranMode == 'A') {
        // New Entry Mode
        savePayload['propcode'] = this.commonService.convertArryaToString(
          this.propertySelectionsForm.get('propcode')?.value
        );
        this.LessorrentService.addProperty(savePayload).subscribe({
          next: (res) => {
            if (res.status) {

              this.commonService.enableDisableButtonsByIds(
                [ 'save'],
                this.buttonsList,
                true
              );

              this.propertySelectionsForm.get('propcode')?.setValue(res.data)
              this.showErrorFieldDialog(
                'Property  Added',
                res['message'],
                'info'
              );
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

  deleteProperty() {
    this.actionService.getDeleteActionFlag(true);
    let propCode = this.commonService.convertArryaToString(
      this.propertySelectionsForm.get('propcode')?.value
    );

    if (propCode) {
      this.LessorrentService.deleteProperty(propCode)?.subscribe({
        next: (res) => {
          console.log('res-----', res);

          if (res.result == 'success') {
            this.goBack();
            this.showErrorFieldDialog(
              'Property Deleted',
              'Record deleted succesfully for property code ' + propCode,
              'info'
            );
          } else {
            this.showErrorFieldDialog(
              'Property Not Deleted',
              res.message + propCode,
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
            console.log('property', this.propertyForm);
            this.toastr.error('Something went wrong');
          }
        },
      });
    }
  }

  handleBackClick() {
    this.isBackClicked = true;
    if (this.propertyForm.dirty) {
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

    console.log('form value', this.propertyForm);

    this.propertyForm.patchValue({
      propname: res.data.propname,
      description: res.data.description,
      location: res.data.location.trimEnd(),
      paytype: res.data.paytype,
      propritor: res.data.propritor,
      coy: res.data.coy,
      proptype: res.data.proptype.trimEnd(),

      //   "propcode": "P0001",
      //   "propname": "70 Kurla                                                                                                                                              ",
      //   "description": "One time settlement to be done. As per their advocate they are asking for indemnity bon/declaration from SGR",
      //   "location": ".                             ",
      //   "paytype": "P",
      //   "propritor": "SAGR ",
      //   "coy": "SAGR ",
      //   "proptype": "2    ",

      // "ipaddress": "192.168.50.50",
      // "machinename": "Sandesh        ",
      // "site": "MUM  ",
      // "today": "2009-09-18T14:46:01",
      // "userid": "SHAWMAN   "
    });
    this.propertyForm.get('date')?.setValue(new Date());

    console.log('propertyForm', this.propertyForm);
  }

  //on leave compny
  onLeavepropritor(val: string) {
    this.filters.coy = "coy_prop='" + val + "'";
    console.log(this.filters.coy, 'get bldg');
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
    this.propertySelectionsForm.reset();
    this.propertySelectionsForm.enable();
    this.propertyForm.reset();

    //this.deleteDisabled = true;
    this.propertySelectionsForm.controls['propcode'].enable();
    this.focusField('propertyCode'); // Set focus on Property  ID
    var inputElement: any = document.getElementById('propcode');
    inputElement.focus();
    this.filters.coy = '';

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

    // this.addAdminAdvancePaymentForm.patchValue({
    //   orderby: '',
    //   tdsacmajor: '',
    //   tdsamount: 0,
    //   narration: '',
    // })

    this.config.isSave = false;
  }

  // back to admin advance payment form
  resetForm() {
    this.propertySelectionsForm.reset();
    this.propertySelectionsForm.enable();
    this.propertyForm.reset();
    this.propertyForm.get('date')?.setValue(new Date());
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

    // if (this.propertyForm.dirty) {
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
    this.propertySelectionsForm.reset();
    this.propertySelectionsForm.enable();
    this.propertyForm.reset();
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
      if (this.propertySelectionsForm.value.propcode == '') {
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
        this.propertyForm.get('date')?.setValue(new Date());

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
    let propCode = this.commonService.convertArryaToString(
      this.propertySelectionsForm.get('propcode')?.value
    );

    const dialogRef = this.dailog.open(ModalComponent, {
      disableClose: true,
      
      data: {
        isF1Pressed: false,
        title: 'Property Delete',
        message: 'Are you sure you want to delete property code : ' + propCode,
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
        this.deleteProperty();
      }
    });
  }
}
