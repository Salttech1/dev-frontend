// Developed By  - 	KR EDP & Dilip
// Mode  - Data Entry
// Class Name - BrokerDetailsEntryComponent
// .Net Form Name - FrmBrokerDetails
// PB Window Name - \fa\SALES\SABK1\w_sabkde07
// Purpose - Enter Broker Details (Used in Sales\Bookings & Fixed Deposit)
// ' Reports Used -  

// ' Modification Details
// '=======================================================================================================================================================
// ' Date		Author  Version User    Reason              
// '=======================================================================================================================================================


import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
//  ElementRef,					//06.12.22	RS
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { DynapopService } from 'src/app/services/dynapop.service';
import { BookingsService } from 'src/app/services/sales/bookings.service';
//import { SalesService } from 'src/app/services/sales/sales.service';	//06.12.22	RS
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { AddressComponent } from 'src/app/components/common/address/address.component';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
//import { FdRoutingModule } from 'src/app/components/fd/fd-routing.module';	//06.12.22	RS

@Component({
  selector: 'app-broker-details-entry',
  templateUrl: './broker-details-entry.component.html',
  styleUrls: ['./broker-details-entry.component.css'],
})

export class BrokerDetailsEntryComponent implements OnInit, AfterViewInit {
  brokerIDColHeadings!: any[];
  brokerIDF1List!: any;       
  brokerIDF1Bbc!: any;              // Broker ID F1 Bring Back Column
  //lvar: String = 'code';          //06.12.22	RS
  //brokerDetails: Boolean = false;   //06.12.22	RS
  addressData: any;
  receivedAddressData!: FormGroup;
  //entryModeOff: Boolean = true;
  initialMode: Boolean = false;
  deleteDisabled: Boolean = true;
  tranMode: String = '';
  isDeleteClicked: boolean = false;     //06.12.22	RS
  isBackClicked: boolean = false;      //06.12.22	RS
  borkerTitleColHeadings!: any[];
  borkerTitleF1List: any;
  brokerTitleBbc: any;

  brokerSelectionsForm: FormGroup = new FormGroup({
    brokerId: new FormControl<String | null>('', Validators.required),
    brokerName: new FormControl<String | null>({ value: '', disabled: true }),
  });                                           // Form Group for Selection input fields

  @ViewChild(F1Component) initFocus!: F1Component;
  @ViewChild(AddressComponent) addressComponent!: AddressComponent;

  brokerForm: FormGroup = new FormGroup({       // Form Group for Broker Details Entry / Edit
    name: new FormControl<String>('', [
      Validators.maxLength(50),
      Validators.required,
    ]),
    title: new FormControl<String>('', [
      Validators.maxLength(5),
      Validators.required,
    ]),
    contactperson: new FormControl<String>('', [
      Validators.maxLength(50),
      Validators.required,
    ]),
    rera: new FormControl<String>('', [Validators.maxLength(12)]),
    designation: new FormControl<String>('', [
      Validators.maxLength(50),
      Validators.required,
    ]),
    pmtacnum: new FormControl<any>('', [
      Validators.required,
      Validators.maxLength(10),
      // Validators.minLength(10),
      Validators.pattern(
        '[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}'
      ),
    ]),
    gstno: new FormControl<any>('', [
      Validators.maxLength(15),
      Validators.pattern(
        '^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$'
      ),
    ]),
    brokthisyr: new FormControl<any>({ value: 0, disabled: true }),
    broklastyr: new FormControl<any>({ value: 0, disabled: true }),
    broktodate: new FormControl<any>({ value: 0, disabled: true }),
    tdsthisyr: new FormControl<any>({ value: 0, disabled: true }),
    tdslastyr: new FormControl<any>({ value: 0, disabled: true }),
    tdstodate: new FormControl<any>({ value: 0, disabled: true }),
    bussthisyr: new FormControl<any>({ value: 0, disabled: true }),
    busslastyr: new FormControl<any>({ value: 0, disabled: true }),
    busstodate: new FormControl<any>({ value: 0, disabled: true }),
    city: new FormControl<any>(''),
  });

  constructor(
    private bookingsService: BookingsService,
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private cdref: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: ModalService,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.crateF1DataForBrokers();   // Method to create F1 for Brokers List
    this.crateF1DataForTitle();        // Method to create F1 for Title
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngAfterViewInit(): void {
    this.initFocus.fo1.nativeElement.focus();
  }

  crateF1DataForBrokers() {       // Method to create F1 for Brokers List
    this.dynapop.getDynaPopListObj('BROKERS', '').subscribe((res: any) => {
      this.brokerIDColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.brokerIDF1List = res.data;
      this.brokerIDF1Bbc = res.data.bringBackColumn;
    });
  }

  crateF1DataForTitle() {            // Method to create F1 for Title
    this.dynapop.getDynaPopListObj('TITLES', '').subscribe((res: any) => {
      this.borkerTitleColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.borkerTitleF1List = res.data;
      this.brokerTitleBbc = res.data.bringBackColumn;
    });
  }

  retrieveBrokerDetails() {
    this.actionService.getReterieveClickedFlagUpdatedValue(true);
    let brokerId = this.brokerSelectionsForm.get('brokerId')?.value?.trim();
    if (brokerId) {
      this.bookingsService
        .getBrokerDetailsByCode(brokerId)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.data) {
              //this.brokerDetails = true;          //06.12.22	RS
              this.initialMode = true;
              this.deleteDisabled = false;
              //this.entryModeOff = false;          //06.12.22	RS
              this.patchForm(res);
              this.addressData = res.data[0].addressResponseBean;
              this.tranMode = 'R';
              this.setFocus('brokerTitle');
            } else {
              this.toastr.error('Broker Not Found');
            }
            this.brokerSelectionsForm.disable();
          },		
          error: (error) => {			//06.12.22	RS
            this.toastr.error(error.error.errors[0].defaultMessage);		//06.12.22	RS
          },
        });
    } else {
      this.toastr.error('Please Select broker');
    }
  }

  saveBroker() {
    if (this.brokerForm.valid) {                                  // Check whether data is entered properly
      this.brokerForm.patchValue({
        city: this.receivedAddressData.value['addressResponseBean']?.city,
      });

      let addressRequestBean = this.convertValuesToUpper(
        this.receivedAddressData.value['addressResponseBean']
      );

      console.log('form', this.brokerForm);

      let bfValuesToUpper = this.convertValuesToUpper(this.brokerForm.value);
      let userid = sessionStorage.getItem('userName');

      let partyRequestBean = {
        partyname: bfValuesToUpper.name,
        userid,
        city: addressRequestBean.city,
        pmtacnum: bfValuesToUpper.pmtacnum,
        title: bfValuesToUpper.title,
        gstno: bfValuesToUpper.gstno,
      };

      let savePayload = {
        ...this.brokerForm.value,
        partyRequestBean,
        addressRequestBean,
        gstValdiationBean: {
          state: addressRequestBean.state,
          gstNumber: bfValuesToUpper.gstno,
          panCardNumber: bfValuesToUpper.pmtacnum,
        },
        userid,
      };

      console.log('save', savePayload);
      // let updateFlag = this.brokerSelectionsForm.controls['brokerName'].value;   //06.12.22	RS
      // console.log('val', updateFlag);                                            //06.12.22	RS

      // return;
      if (this.tranMode == 'R') {                 // Retrieve Mode
        savePayload['brokCode'] = this.brokerSelectionsForm.get('brokerId')?.value;
        this.bookingsService.updateBroker(savePayload).subscribe({
          next: (res) => {
            console.log('update res', res);
            if (res.status) {
              this.modalService.showErrorDialog(
                'Broker Updated',
                res['message'],
                'info'
              );
              this.crateF1DataForBrokers();       // Refresh Broker F1 List
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
      } else if (this.tranMode == 'A') {                  // New Entry Mode
        this.bookingsService.addBroker(savePayload).subscribe({
          next: (res) => {
            console.log('save res', res);
            if (res.status) {
              this.modalService.showErrorDialog(
                'Broker Added',
                res['message'],
                'info'
              );
              this.crateF1DataForBrokers();     // Refresh Broker F1 List
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
              this.toastr.error('Something went wrongs');
            }
          },
        });
      }
    } else {
      this.toastr.error('Please fill the form properlysss');         // Data not entered properly
    }
  }

//06.12.22	RS    --Commented following code
  handleDeleteClick() {
    this.isDeleteClicked = true;
    this.showConfirmation(
      constant.ErrorDialog_Title,
      'Are you sure want to delete this brokers',
      'question',
      true
    );
  }

//06.12.22	RS    --Commented following code
  handleBackClick() {
    this.isBackClicked = true;
    if (this.brokerForm.dirty || this.receivedAddressData.dirty) {
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

//06.12.22	RS    --Commented following code
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
        if (this.isDeleteClicked) {
          this.deleteBroker();
          this.isDeleteClicked = false;
        }
        if (this.isBackClicked) {
          this.back();
        }
      }
    });
  }

  // handleConfirmation(buttonclicked: String,DisplayMessage: String) 
  // //06.12.22	RS      Show confirmation box if user clicks on Delete / Back button 
  //   {
  //     if (this.brokerForm.dirty || this.receivedAddressData.dirty) {
  //       const dialogRef = this.dialog.open(ModalComponent, {
  //         disableClose: true,
  //         data: {
  //         isF1Pressed: false,
  //         title: constant.ErrorDialog_Title,
  //         message: DisplayMessage,
  //         template: '',
  //         type: 'question',
  //         confirmationDialog: true,
  //         },
  //       });
  //     } else {
  //       this.back();
  //     }
  //     dialogRef.afterOpened().subscribe(() => {
  //       console.log('Dialog Opened');
  //     });
  //     dialogRef.afterClosed().subscribe((result: any) => {
  //       if (result) {
  //         if (buttonclicked == 'DELETE') {                              // User clicks on Delete button
  //           this.deleteBroker();
  //         }
  //         else {                                                        // User clicks on Back button
  //           this.back();
  //         }
  //       }
  //     });
  //   }

  deleteBroker() {
    this.bookingsService
      .deleteBroker(this.brokerSelectionsForm.get('brokerId')?.value)
      .subscribe({
        next: (res) => {
          console.log('delete res', res);
          if (res.status) {
            this.modalService.showErrorDialog(
              'Broker Deleted',
              res['message'],
              'info'
            );
            //this.isDeleteClicke = false;            //06.12.22	RS
            this.crateF1DataForBrokers();            // Refresh Broker F1 List
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
            this.toastr.error('Something went wrong')
          }
        },
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
    // Initialise form values from response bean
    this.brokerForm.patchValue({
      name: res.data[0]?.name,
      title: res.data[0]?.title,
      contactperson: res.data[0]?.contactperson,
      designation: res.data[0]?.designation,
      pmtacnum: res.data[0].partyResponseBean?.pmtacnum,
      rera: res.data[0]?.rera,
      gstno: res.data[0]?.partyResponseBean?.gstno,
      brokthisyr: res.data[0]?.brokthisyr,
      broklastyr: res.data[0]?.broklastyr,
      broktodate: res.data[0]?.broktodate,
      tdsthisyr: res.data[0]?.tdsthisyr,
      tdslastyr: res.data[0]?.tdslastyr,
      tdstodate: res.data[0]?.tdstodate,
      busstodate: res.data[0]?.busstodate,
      busslastyr: res.data[0]?.busslastyr,
      bussthisyr: res.data[0]?.bussthisyr,
    });
  }

  getBrokerID(e: any) {
    // Used this method in html to initialise Broker Name value
    if (e.length) {
      this.brokerSelectionsForm.patchValue({
        brokerName: e[1],
      });
    }
  }

  addBrokerDetails() {                 // User clicks on Add button
    this.tranMode = 'A';
    //this.brokerDetails = true;      //06.12.22	RS
    //this.entryModeOff = false;      //06.12.22	RS
    this.initialMode = true;
    this.brokerSelectionsForm.disable();
    this.setFocus('brokerTitle');
  }

  setFocus(id: string) {               // Method to set focus to object on form
    setTimeout(() => {
      let inF = document.getElementById(id) as HTMLElement;
      this.renderer.selectRootElement(inF.firstChild).focus();
    }, 100);
  }

  back() {                            // User clicks on Back button
    this.isBackClicked = false;         //06.12.22	RS
    this.isDeleteClicked = false;         //06.12.22	RS
    this.brokerForm.reset();
    this.brokerSelectionsForm.reset();
    this.addressData = null;
    this.addressComponent.resetAddress();
    //this.brokerDetails = false;         //06.12.22	RS
    //this.entryModeOff = true;           //06.12.22	RS
    this.initialMode = false;
    this.deleteDisabled = true;
    this.brokerSelectionsForm.controls['brokerId'].enable();
    this.initFocus.fo1.nativeElement.focus();         // Set focus on Broker ID
  }
}
