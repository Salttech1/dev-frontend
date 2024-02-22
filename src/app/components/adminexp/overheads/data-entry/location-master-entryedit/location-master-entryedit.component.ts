import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { OverheadsService } from 'src/app/services/adminexp/overheads.service';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';
import { pipe, take } from 'rxjs';
import Swal from 'sweetalert2';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-location-master-entryedit',
  templateUrl: './location-master-entryedit.component.html',
  styleUrls: ['./location-master-entryedit.component.css'],
})
export class LocationMasterEntryeditComponent implements OnInit {
  locationF1List: any;
  locationF1abc: any;
  locationColHeadings!: any[];
  loaderToggle: boolean = false;
  disabledFlagAdd: boolean = false;
  disabledFlagRetrieve: boolean = false;
  disableFlagDelete: boolean = false;
  disabledFlagSave: boolean = true;
  disabledFlagBack: boolean = true;
  disabledFlagExit: boolean = false;
  visibleformcontrol: boolean = false;
  duefromsocietyflag: String = '';
  tranMode: String = '';
  BuildingCodeArr!: any[];
  strBuildingcode: String = '';
  locationRequestBean: any;

  @ViewChild(F1Component) comp!: F1Component;

  constructor(
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private cdref: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: ModalService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private overheadsService: OverheadsService,
    private router: Router,
    private service: ServiceService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.createF1forLocation();
    this.focusField();
    setTimeout(function () {
      document.getElementById('location')?.focus();
    }, 100);
  }
  ngAfterViewInit(): void {
    //this.focusField();
    this.comp?.fo1?.nativeElement?.focus();
  }
  locationSelection: FormGroup = new FormGroup({
    location: new FormControl<String | null>('', [
      Validators.required,
      Validators.maxLength(5),
    ]),
  });

  locationform: FormGroup = new FormGroup({
    locationName: new FormControl<String | null>({
      value: '',
      disabled: false,
    }),
    bldgcode: new FormControl<String | null>({ value: '', disabled: false }),
    duefromsociety: new FormControl<String | null>({
      value: '',
      disabled: false,
    }),
  });
  //(updatedSelectedValue)="displayBillType($event)"
  createF1forLocation() {
    this.dynapop.getDynaPopListObj('CONSITE', '').subscribe((res: any) => {
      this.locationColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.locationF1List = res.data;
      this.locationF1abc = res.data.bringBackColumn;
    });
  }
  retriveLocationDetail() {
    if (this.locationSelection?.valid) {
      this.tranMode = 'R';
      console.log('inside retrive');
      console.log(
        "this.locationSelection.get('location')?.value",
        this.locationSelection.get('location')?.value
      );

      this.actionService.getReterieveClickedFlagUpdatedValue(true);
      this.overheadsService
        .getLocation(this.locationSelection.get('location')?.value)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res.data) {
              console.log('data', res.data);
              this.displayLocationInform(res);
              this.actionDisabledEnabledButtons(true, true, true, false, false);
              this.visibleformcontrol = true;
              this.locationSelection.get('location')?.disable();
            } else {
              this.modalService.showErrorDialog(
                'Record Not  Found for this Location',
                res['message'],
                'info'
              );
              this.back();
            }
          },
        });
    } else {
      this.toastr.error('Please Fill all Mandatory Fields');
      this.locationSelection?.markAllAsTouched();
    }
  }
  saveLocationData() {
    // if (this.locationform?.valid)
    // {
    //his.BuildingCodeArr[0]?.[0];
    let userid = sessionStorage.getItem('userName');
    let code = this.locationSelection.get('location')?.value;
    let name = this.locationform.get('locationName')?.value;
    if (!this.locationform.get('bldgcode')?.value[0]) {
      this.strBuildingcode = '';
    } else {
      this.strBuildingcode = this.locationform.get('bldgcode')?.value[0];
    }
    console.log(
      "this.locationform.get('bldgcode')?.value[0]",
      this.locationform.get('bldgcode')?.value[0]
    );

    //this.strBuildingcode = this.locationform.get('bldgcode')?.value[0];
    console.log('this.strBuildingcode', this.strBuildingcode);

    if (this.duefromsocietyflag == '') {
      this.duefromsocietyflag = '';
    }
    //console.log("this.locationSelection.value",...this.locationSelection.value);

    let savePayload = {
      ...this.locationSelection.value,
      code,
      name,
      userid,
      bldgcode: this.strBuildingcode,
      duefromsociety: this.duefromsocietyflag,
    };
    if (this.tranMode == 'A') {
      // console.log('save mode flag ', this.tranMode);
      // console.log('savePayload insert ', savePayload);
      this.loaderToggle = true;
      console.log('savePayload', savePayload);

      this.overheadsService.addLocation(savePayload).subscribe({
        next: (res) => {
          //console.log('save res', res);
          this.loaderToggle = false;
          if (res.status) {
            this.modalService.showErrorDialog(
              'Location Inserted',
              res['message'],
              'info'
            );
            this.back();
          }
        },
        error: (error: any) => {
          this.loaderToggle = false;
        },
      });
    } else if (this.tranMode == 'R') {
      //console.log('inside Rerive save', this.tranMode);
      this.loaderToggle = true;
      this.overheadsService.updateLocation(savePayload).subscribe({
        next: (res) => {
          //console.log('save res', res);
          this.loaderToggle = false;
          if (res.status) {
            this.modalService.showErrorDialog(
              'Location Inserted',
              res['message'],
              'info'
            );
            this.back();
          }
        },
        error: (error: any) => {
          this.loaderToggle = false;
        },
      });
    }
    // }
    // else {
    //   this.toastr.error('Please Fill all Mandatory Fields');
    //   this.locationform?.markAllAsTouched();
    // }
  }

  displayLocationInform(res: any) {
    //patch overheadcons details
    this.locationform.patchValue({
      locationName: res.data?.name,
      bldgcode: res.data?.bldgcode,
      duefromsociety: res.data?.duefromsociety,
    });
  }

  getduefromsocietyflag(e: any) {
    // console.log('e', e);
    if (e.target.checked) {
      this.duefromsocietyflag = 'Y';
    } else {
      this.duefromsocietyflag = 'N';
    }
  }
  back() {
    this.locationSelection.reset();
    this.locationform.reset();
    this.actionDisabledEnabledButtons(false, false, false, true, true);
    this.visibleformcontrol = false;
    this.locationSelection.get('location')?.enable();
    this.focusField();
    setTimeout(function () {
      document.getElementById('location')?.focus();
    }, 100);
  }

  // action
  actionDisabledEnabledButtons(
    isAddFlag: boolean,
    isRetrieveFlag: boolean,
    isDelete: boolean,
    isSaveFlag: boolean,
    isBack: boolean
  ) {
    this.disabledFlagAdd = isAddFlag;
    this.disabledFlagRetrieve = isRetrieveFlag;
    this.disabledFlagSave = isSaveFlag;
    this.disableFlagDelete = isDelete;
    this.disabledFlagBack = isBack;
    this.focusField();
  }

  //To add default focus on input field
  focusField() {
    //Below getElementById should be unique id in every component
    let el = document.getElementById('location')
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  // findBuildingCode(e: any) {
  //   this.BuildingCodeArr = this.locationform.get('bldgcode')?.value;
  //   //console.log("this.BuildingCodeArr",this.BuildingCodeArr);
  //   this.strBuildingcode = this.BuildingCodeArr[0]?.[0];
  //   //console.log("this.strBuildingcode",this.strBuildingcode);

  // }
  checkLocationcodeExists() {
    this.overheadsService
      .getLocationcodeexists(
        this.locationSelection.get('location')?.value instanceof Object
          ? this.locationSelection.get('location')?.value[0][0].trim()
          : this.locationSelection.get('location')?.value.trim()
      )
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          console.log('data', res);
          if (!res.status) {
            //this.recordExistorNot = true;
            this.modalService.showErrorDialogCallBack(
              'Overhead detail ',
              res['message'],
              this.el.nativeElement
                .querySelector('input[id="location"]')
                ?.focus(),
              'info'
            );
            this.back();
          } else {
            this.tranMode = 'A';
            console.log('this.tranMode ', this.tranMode);
            this.tranMode = 'A';
            this.actionDisabledEnabledButtons(true, true, true, false, false);
            this.visibleformcontrol = true;
            this.locationSelection.get('location')?.disable();
          }
        },
      });
  }
  addLocation() {
    if (this.locationSelection?.valid) {
      this.checkLocationcodeExists();
      
    }
  }
  callMyFunction(e: any) {
    // var element = $(e.currentTarget);
    // var name = element.parent().find('#name');
    // var id = element.parent().find('#id');
    console.log('inside CALL MY FUNCTION');
    this.onSubmitForm();
  }
  onSubmitForm() {
    this.service.setFocusField(
      this.locationform.controls,
      this.el.nativeElement
    );
  }
}
