// Developed By  - 	Shahaji & Nilesh
// Mode  - Data Entry
// Class Name - ProjectEntryComponent
// .Net Form Name - FrmProjectDetails
// PB Window Name -
// Purpose - Enter Project Details (Used in Arch\Project/building details)
// ' Reports Used -

// ' Modification Details
// '=======================================================================================================================================================
// ' Date		Author  Version User    Reason
// '=======================================================================================================================================================

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { AddressComponent } from 'src/app/components/common/address/address.component';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { ProjbldgService } from 'src/app/services/arch/projbldg.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';

@Component({
  selector: 'app-project-entry',
  templateUrl: './project-entry.component.html',
  styleUrls: ['./project-entry.component.css'],
})
export class ProjectEntryComponent implements OnInit, AfterViewInit {
  projectIDColHeadings!: any[];
  projectIDF1List!: any;
  projectIDF1Bbc!: any; //Project ID F1 Bring Back Column

  addressData: any;
  receivedAddressData!: FormGroup;
  initialMode: Boolean = false;
  //deleteDisabled: Boolean = true;
  tranMode: String = '';
  isBackClicked: boolean = false;

  proprietorIDColHeadings!: any[];
  proprietorIDF1List!: any;
  proprietorIDF1Bbc!: any;

  companyIDColHeadings!: any[];
  companyIDF1List!: any;
  companyIDF1Bbc!: any;

  townshipIDColHeadings!: any[];
  townshipIDF1List!: any;
  townshipIDF1Bbc!: any;

  cityIDColHeadings!: any[];
  cityIDF1List!: any;
  cityIDF1Bbc!: any;

  readonlyAttr = true;
  disabledFlagAdd: boolean = false;
  disabledFlagRetrieve: boolean = false;
  disabledFlagSave: boolean = true;
  disabledFlagReset: boolean = true;
  disabledFlagBack: boolean = true;

  activeTabStringValue: string = 'address1';

  //  tableData: any;

  projectSelectionsForm: FormGroup = new FormGroup({
    code: new FormControl<String | null>('', [
      Validators.required,
      Validators.maxLength(4),
    ]),
    projectName: new FormControl<String | null>({ value: '', disabled: true }),
  });

  @ViewChild(F1Component) initFocus!: F1Component;
  @ViewChild(AddressComponent) addressComponent!: AddressComponent;

  projectForm: FormGroup = new FormGroup({
    // Form Group for Project Details Entry / Edit
    name: new FormControl<String>('', [
      Validators.maxLength(50),
      Validators.required,
    ]),
    details: new FormControl<String>('', [
      Validators.maxLength(50),
      Validators.required,
    ]),
    proprietor: new FormControl<string>('', [
      Validators.maxLength(5),
      Validators.required,
    ]),
    proprietorName: new FormControl<string>({ value: '', disabled: true }, [
      Validators.maxLength(50),
      Validators.required,
    ]),
    company: new FormControl<string>('', [
      Validators.maxLength(5),
      Validators.required,
    ]),
    companyName: new FormControl<string>({ value: '', disabled: true }, [
      Validators.maxLength(50),
      Validators.required,
    ]),
    township: new FormControl<string>('', [Validators.maxLength(5)]),
    townshipName: new FormControl<string>({ value: '', disabled: true }, [
      Validators.maxLength(50),
    ]),
    city: new FormControl<string>('', [Validators.maxLength(5)]),
    cityName: new FormControl<string>({ value: '', disabled: true }, [
      Validators.maxLength(50),
    ]),
    bldgcount: new FormControl<string>('', [Validators.maxLength(3)]),
    tenure: new FormControl<any>({ value: '', disabled: true }),
    areaarch: new FormControl<any>({ value: '', disabled: true }),
    areaengg: new FormControl<any>({ value: '', disabled: true }),
    areasales: new FormControl<any>({ value: '', disabled: true }),
    desc1: new FormControl<string>('', [Validators.maxLength(80)]),
    desc2: new FormControl<string>('', [Validators.maxLength(80)]),
    desc3: new FormControl<string>('', [Validators.maxLength(80)]),
    desc4: new FormControl<string>('', [Validators.maxLength(80)]),
    desc5: new FormControl<string>('', [Validators.maxLength(80)]),
  });

  constructor(
    private projbldgService: ProjbldgService,
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private cdref: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: ModalService,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.createF1DataForProjects(); // Method to create F1 for Project List
    this.createF1DataForProprietor(); // Method to create F1 for Proprietor List
    // this.createF1DataForCompany(); // Method to create F1 for Company List
    this.createF1DataForTownship(); // Method to create F1 for Township List
    this.createF1DataForCity(); // Method to create F1 for City List
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngAfterViewInit(): void {
    this.initFocus.fo1.nativeElement.focus();
  }

  createF1DataForProjects() {
    // Method to create F1 for Project List
    this.dynapop.getDynaPopListObj('PROJECTS', '').subscribe((res: any) => {
      this.projectIDColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.projectIDF1List = res.data;
      this.projectIDF1Bbc = res.data.bringBackColumn;
    });
  }

  createF1DataForProprietor() {
    // Method to create F1 for Proprietor
    this.dynapop.getDynaPopListObj('PROPRIETOR', '').subscribe((res: any) => {
      this.proprietorIDColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.proprietorIDF1List = res.data;
      this.proprietorIDF1Bbc = res.data.bringBackColumn;
    });
  }

  createF1DataForCompany() {
    // Method to create F1 for Company
    this.dynapop
      .getDynaPopListObj(
        'COMPANY',
        `coy_prop='${this.projectForm.get('proprietor')?.value}'`
      )
      .subscribe((res: any) => {
        this.companyIDColHeadings = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.companyIDF1List = res.data;
        this.companyIDF1Bbc = res.data.bringBackColumn;
      });
  }

  // Commented below code and added above code to display companies for selected proprietor (Shahaji 13/01/2023)
  // createF1DataForCompany() {
  //   // Method to create F1 for Company
  //   this.dynapop.getDynaPopListObj('COMPANY', '').subscribe((res: any) => {
  //     this.companyIDColHeadings = [
  //       res.data.colhead1,
  //       res.data.colhead2,
  //       res.data.colhead3,
  //       res.data.colhead4,
  //       res.data.colhead5,
  //     ];
  //     this.companyIDF1List = res.data;
  //     this.companyIDF1Bbc = res.data.bringBackColumn;
  //   });
  // }

  createF1DataForTownship() {
    // Method to create F1 for Township
    this.dynapop.getDynaPopListObj('TOWNS', '').subscribe((res: any) => {
      this.townshipIDColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.townshipIDF1List = res.data;
      this.townshipIDF1Bbc = res.data.bringBackColumn;
    });
  }

  createF1DataForCity() {
    // Method to create F1 for City
    this.dynapop.getDynaPopListObj('CITIES', '').subscribe((res: any) => {
      this.cityIDColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.cityIDF1List = res.data;
      this.cityIDF1Bbc = res.data.bringBackColumn;
    });
  }

  addProjectDetails() {
    // User clicks on Add button
    this.actionService.getReterieveClickedFlagUpdatedValue(true);
    let Code = this.projectSelectionsForm.get('code')?.value?.trim();
    if (Code) {
      this.projbldgService
        .getProjectByCode(Code)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.status) {
              this.modalService.showErrorDialog(
                'K.Raheja ERP',
                'Project code already exists',
                'error'
              );
            } else {
              if (this.projectSelectionsForm.valid) {
                this.initialMode = true;
                this.projectSelectionsForm.disable();
                this.setFocus('Name2');
                this.tranMode = 'A';
              }
            }
          },
        });
    } else {
      this.toastr.error('Project code can not be blank');
    }
  }

  retrieveProjectDetails() {
    this.actionService.getReterieveClickedFlagUpdatedValue(true);
    let Code = this.projectSelectionsForm.get('code')?.value?.trim();
    if (Code) {
      this.projbldgService
        .getProjectByCode(Code)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.data) {
              this.initialMode = true;
              this.patchForm(res);
              this.addressData = res.data[0].addressResponseBean;
              this.tranMode = 'R';

              this.dynapop
                .getDynaPopSearchListObj('PROJECTS', '', Code)
                .subscribe((res1: any) => {
                  this.projectSelectionsForm.patchValue({
                    projectName: res1.data.dataSet[0][1],
                  });
                });

              let projProp = res.data[0].proprietor;
              this.dynapop
                .getDynaPopSearchListObj('PROPRIETOR', '', projProp)
                .subscribe((res2: any) => {
                  this.projectForm.patchValue({
                    proprietorName: res2.data.dataSet[0][1],
                  });
                });

              let projComp = res.data[0].company;
              this.dynapop
                .getDynaPopSearchListObj('COMPANY', '', projComp)
                .subscribe((res3: any) => {
                  this.projectForm.patchValue({
                    companyName: res3.data.dataSet[0][1],
                  });
                });

              let projTown = res.data[0].township;
              this.dynapop
                .getDynaPopSearchListObj('TOWNS', '', projTown)
                .subscribe((res4: any) => {
                  this.projectForm.patchValue({
                    townshipName:
                      res4.data.dataSet.length != 0
                        ? res4.data.dataSet[0][1]
                        : '',
                  });
                });

              let projCity = res.data[0].city;
              this.dynapop
                .getDynaPopSearchListObj('CITIES', '', projCity)
                .subscribe((res5: any) => {
                  console.log(res5);
                  this.projectForm.patchValue({
                    cityName:
                      res5.data.dataSet.length != 0
                        ? res5.data.dataSet[0][1]
                        : '',
                  });
                });

              if (this.projectForm.get('tenure')?.value != undefined) {
                let tenureValue =
                  res.data[0].tenure == 'F' ? 'Free Hold' : 'Lease Hold';
                this.projectForm.patchValue({
                  tenure: tenureValue,
                });
              }

              this.setFocus('Name2');
              this.projectSelectionsForm.disable();
            } else {
              this.toastr.error('Project Not Found');
            }
          },
          error: (error) => {
            this.toastr.error(error.error.errors[0].defaultMessage);
          },
        });
    } else {
      this.toastr.error('Please Select project');
    }
  }

  saveProject() {
    if (this.projectForm.valid && this.receivedAddressData.valid) {
      let emailid = this.receivedAddressData.value['addressResponseBean'].email;

      let addressRequestBean = this.convertValuesToUpper(
        this.receivedAddressData.value['addressResponseBean']
      );

      let userid = sessionStorage.getItem('userName');

      let savePayload = {
        ...this.projectForm.value, //it shows project form data
        city: addressRequestBean.city,
        township: addressRequestBean.town,
        addressRequestBean: {
          ...addressRequestBean,
          email: emailid,
        },
        userid,
      };

      if (this.tranMode == 'R') {
        // Retrieve Mode
        savePayload['code'] = this.projectSelectionsForm.get('code')?.value;
        this.projbldgService.updateProject(savePayload)?.subscribe({
          next: (res) => {
            if (res.status) {
              this.showErrorFieldDialog(
                'Project Updated',
                res['message'],
                'info'
              );
              this.createF1DataForProjects(); // Refresh Project F1 List
              this.back();
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
              console.log('project', this.projectForm);
              this.toastr.error('Something went wrong');
            }
          },
        });
      } else if (this.tranMode == 'A') {
        // New Entry Mode
        savePayload['code'] = this.projectSelectionsForm.get('code')?.value;
        this.projbldgService.addProject(savePayload).subscribe({
          next: (res) => {
            if (res.status) {
              this.showErrorFieldDialog(
                'Project Added',
                res['message'],
                'info'
              );
              this.createF1DataForProjects(); // Refresh project F1 List
              this.back();
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

  handleBackClick() {
    this.isBackClicked = true;
    if (this.projectForm.dirty || this.receivedAddressData.dirty) {
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

  //Object Text values in upper case
  convertValuesToUpper(formgroup: any) {
    for (const obj of Object.keys(formgroup)) {
      if (formgroup[obj] && typeof formgroup[obj] == 'string') {
        formgroup[obj] = formgroup[obj].toUpperCase();
      }
    }
    return formgroup;
  }

  getReceiveAddressData(data: any) {
    // Used this method in html for Address Data
    this.receivedAddressData = data;
  }

  patchForm(res: any) {
    this.projectForm.patchValue({
      name: res.data[0]?.name,
      details: res.data[0]?.details,
      proprietor: res.data[0]?.proprietor,
      company: res.data[0]?.company,
      township: res.data[0]?.township,
      city: res.data[0]?.city,
      bldgcount: res.data[0]?.bldgcount,
      tenure: res.data[0]?.tenure,
      areaarch: res.data[0]?.areaarch,
      areaengg: res.data[0]?.areaengg,
      areasales: res.data[0]?.areasales,
      desc1: res.data[0]?.desc1,
      desc2: res.data[0]?.desc2,
      desc3: res.data[0]?.desc3,
      desc4: res.data[0]?.desc4,
      desc5: res.data[0]?.desc5,
    });
  }

  getProjectID(e: any) {
    // Used this method in html to initialise Project Name value
    if (e.length) {
      this.projectSelectionsForm.patchValue({
        projectName: e[1],
      });
    }
  }

  getProprietorID(e: any) {
    // Used this method in html to initialise Proprietor Name value
    if (e.length) {
      this.projectForm.patchValue({
        proprietorName: e[1],
      });
      this.createF1DataForCompany();
    }
  }

  getCompanyID(e: any) {
    // Used this method in html to initialise Company Name value
    if (e.length) {
      this.projectForm.patchValue({
        companyName: e[1],
      });
    }
  }
  getTownshipID(e: any) {
    // Used this method in html to initialise Township Name value
    if (e.length) {
      this.projectForm.patchValue({
        townshipName: e[1],
      });
    }
  }
  getCityID(e: any) {
    // Used this method in html to initialise City Name value
    if (e.length) {
      this.projectForm.patchValue({
        cityName: e[1],
      });
    }
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
    this.projectForm.reset();
    this.projectSelectionsForm.reset();
    this.addressData = null;
    this.addressComponent.resetAddress();
    this.initialMode = false;
    //this.deleteDisabled = true;
    this.projectSelectionsForm.controls['code'].enable();
    this.focusField('projectCode'); // Set focus on Project ID
  }

  // activeAddressField(event: any) {
  //   event.preventDefault();
  //   this.addressComponent.activeAddressFieldFocus();
  //   this.activeTabStringValue = 'addressDetail';
  // }

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
      this.focusField('projectCode');
      //window.location.reload()
    });
  }
}
