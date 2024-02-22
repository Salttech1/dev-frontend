// Developed By  - 	rahul.s
// Developed on - 06-05-23
// Mode  - Data Entry
// Component Name - outgoing-rates-entryComponent
// .Net Form Name -
// PB Window Name -
// Purpose - Outrate Entry / Edit
// Reports Used -

// Modification Details
// =======================================================================================================================================================
// Date		Coder  Version User    Reason
// =======================================================================================================================================================

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { OutgoingService } from 'src/app/services/sales/outgoing.service';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import * as constant from '../../../../../../constants/constant';
import * as moment from 'moment';
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';

@Component({
  selector: 'app-outgoing-rates-entry',
  templateUrl: './outgoing-rates-entry-edit.component.html',
  styleUrls: ['./outgoing-rates-entry-edit.component.css'],
})
export class OutgoingRatesEntryEditComponent implements OnInit {
  initialMode: Boolean = false;
  isReadOnly: Boolean = true;
  deleteDisabled: Boolean = true;
  tranMode: String = '';
  isDeleteClicked: boolean = false;
  isBackClicked: boolean = false;
  dtOptions: any;
  deletedRowArray: any = [];

  outRateSelectionsForm: FormGroup = new FormGroup({
    bldgCode: new FormControl<String[]>([], Validators.required),
    wing: new FormControl<String[]>([], Validators.required),
    flatnum: new FormControl<String[]>([], Validators.required),
  }); // Form Group for Selection input fields

  outRateForm = new FormGroup({
    // Form Group for Data Entry / Edit
    outrateDetailsBreakUp: new FormArray([this.outrateItemDetailInitRows()]),
  });

  @ViewChild('bldgCode') bldgcode: ElementRef | undefined;

  outrateItemDetailInitRows() {
    return this.fb.group({
      bldgcode: new FormControl<string | null>(null),
      flatnum: new FormControl<string | null>(null),
      wing: new FormControl<string | null>(null),
      startdate: new FormControl<string | null>(null),
      enddate: new FormControl<string | null>(null),
      rate: new FormControl<string>('0'),
      admincharges: new FormControl<string>('0'),
      infrrate: new FormControl<string>('0'),
      infradmin: new FormControl<string>('0'),
      proprate: new FormControl<string>('0'),
      maint: new FormControl<string>('0'),
      infra: new FormControl<string>('0'),
      propratesqft: new FormControl<string>('0'),
      oldadmin_notused: new FormControl<string>('0'),
      proponbucaarea: new FormControl<string | null>(null),
      billtype: new FormControl<string | null>(null),
      auxirate: new FormControl<string>('0'),
      auxiadmin: new FormControl<string>('0'),
      water: new FormControl<string>('0'),
      elect: new FormControl<string>('0'),
      natax: new FormControl<string>('0'),
      maint_tds: new FormControl<string>('0'),
      infra_tds: new FormControl<string>('0'),
      auxi_tds: new FormControl<string>('0'),
      isDelete: new FormControl(false),
    });
  }

  constructor(
    public router: Router,
    private OutgoingService: OutgoingService,
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private cdref: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: ModalService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private el: ElementRef
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
  }

  ngAfterViewInit() {
    this.bldgcode?.nativeElement.focus();
  }

  subidBldgcode?: string;
  subidBldgcodeAndWing?: string = '';

  setSubidBldgcode() {
    this.subidBldgcode =
      "flat_bldgcode='" +
      this.outRateSelectionsForm.get('bldgCode')?.value[0][0].trim() +
      "'";
    console.log(this.subidBldgcode);
    console.log(this.outRateSelectionsForm.get('bldgCode')?.value[0][0].trim());
  }

  setSubidBldgcodeAndWing() {
    //NS 15.05.2023
    let wing: string | undefined;
    if (
      this.outRateSelectionsForm.get('wing')?.value?.[0][0] == undefined ||
      this.outRateSelectionsForm.get('wing')?.value?.[0][0] == '' ||
      this.outRateSelectionsForm.get('wing')?.value?.[0][0] == null
    ) {
      this.subidBldgcodeAndWing = this.subidBldgcode + " and flat_wing=' '";
    } else {
      this.subidBldgcodeAndWing =
        this.subidBldgcode +
        " and flat_wing='" +
        this.outRateSelectionsForm.get('wing')?.value?.[0][0] +
        "'";
    }
    console.log('wingandbldgcode', this.subidBldgcodeAndWing);
  }

  addOutrateDetails() {
    // User clicks on Add button
    this.tranMode = 'A';
    this.initialMode = true;
    for (let i = 1; i < 2; i++) {
      this.outrateItemBreakUpFormArr.push(this.outrateItemDetailInitRows());
      this.outrateItemBreakUpFormArr.controls[i].patchValue({
        bldgcode: this.outRateSelectionsForm
          .get('bldgCode')
          ?.value[0][0].trim(),
        flatnum: this.outRateSelectionsForm.get('flatnum')?.value[0][0].trim(),
        wing: this.outRateSelectionsForm.get('wing')?.value[0][0].trim(),
      });
      // this.outrateItemBreakUpFormArr.controls[i ].get('bldgcode')?.setValue(this.outRateSelectionsForm.get('bldgCode')?.value[0][0].trim());
      // this.outrateItemBreakUpFormArr.controls[i ].get('flatnum')?.setValue(this.outRateSelectionsForm.get('flatnum')?.value[0][0].trim());
      // this.outrateItemBreakUpFormArr.controls[i ].get('wing')?.setValue(this.outRateSelectionsForm.get('wing')?.value[0][0].trim());
    }
    this.outRateSelectionsForm.disable();
    this.setFocus('Replace with First TextBox Control Name to set focus');
  }

  get outrateItemBreakUpFormArr() {
    return this.outRateForm.get('outrateDetailsBreakUp') as FormArray;
  }

  addRow() {
    let rowNo = this.outrateItemBreakUpFormArr.value.length;

    if (
      this.outrateItemBreakUpFormArr.controls[rowNo - 1].get('enddate')
        ?.value == '209912'
    ) {
      this.toastr.error('Can not Enter New Month');
    } else {
      this.outrateItemBreakUpFormArr.push(this.outrateItemDetailInitRows());
      setTimeout(() => {
        let prevEndDate;

        if (
          this.outrateItemBreakUpFormArr.controls[rowNo - 1]
            .get('enddate')
            ?.value.substring(4) == '12'
        ) {
          prevEndDate =
            Number(
              this.outrateItemBreakUpFormArr.controls[rowNo - 1]
                .get('enddate')
                ?.value.substring(0, 4)
            ) + 1;
          prevEndDate = String(prevEndDate) + '01';
        } else {
          prevEndDate =
            Number(
              this.outrateItemBreakUpFormArr.controls[rowNo - 1]
                .get('enddate')
                ?.value.substring(4)
            ) + 1;
          if (String(prevEndDate).length == 1) {
            prevEndDate =
              this.outrateItemBreakUpFormArr.controls[rowNo - 1]
                .get('enddate')
                ?.value.substring(0, 4) +
              '0' +
              String(prevEndDate);
          } else {
            prevEndDate =
              this.outrateItemBreakUpFormArr.controls[rowNo - 1]
                .get('enddate')
                ?.value.substring(0, 4) + String(prevEndDate);
          }
        }

        this.outrateItemBreakUpFormArr.controls[rowNo].patchValue({
          bldgcode: this.outRateSelectionsForm
            .get('bldgCode')
            ?.value[0][0].trim(),
          flatnum: this.outRateSelectionsForm
            .get('flatnum')
            ?.value[0][0].trim(),
          wing: this.outRateSelectionsForm.get('wing')?.value[0][0].trim(),
          startdate: prevEndDate,
          enddate: '209912',
          billtype: 'N',
          propratesqft:
            this.outrateItemBreakUpFormArr.controls[rowNo - 1].get(
              'propratesqft'
            )?.value,
          proprate:
            this.outrateItemBreakUpFormArr.controls[rowNo - 1].get('proprate')
              ?.value,
          maint:
            this.outrateItemBreakUpFormArr.controls[rowNo - 1].get('maint')
              ?.value,
          infra:
            this.outrateItemBreakUpFormArr.controls[rowNo - 1].get('infra')
              ?.value,
          water:
            this.outrateItemBreakUpFormArr.controls[rowNo - 1].get('water')
              ?.value,
          elect:
            this.outrateItemBreakUpFormArr.controls[rowNo - 1].get('elect')
              ?.value,
          natax:
            this.outrateItemBreakUpFormArr.controls[rowNo - 1].get('natax')
              ?.value,
          rate: this.outrateItemBreakUpFormArr.controls[rowNo - 1].get('rate')
            ?.value,
          admincharges:
            this.outrateItemBreakUpFormArr.controls[rowNo - 1].get(
              'admincharges'
            )?.value,
          infrrate:
            this.outrateItemBreakUpFormArr.controls[rowNo - 1].get('infrrate')
              ?.value,
          infradmin:
            this.outrateItemBreakUpFormArr.controls[rowNo - 1].get('infradmin')
              ?.value,
          auxirate:
            this.outrateItemBreakUpFormArr.controls[rowNo - 1].get('auxirate')
              ?.value,
          auxiadmin:
            this.outrateItemBreakUpFormArr.controls[rowNo - 1].get('auxiadmin')
              ?.value,
          maint_tds:
            this.outrateItemBreakUpFormArr.controls[rowNo - 1].get('maint_tds')
              ?.value,
          infra_tds:
            this.outrateItemBreakUpFormArr.controls[rowNo - 1].get('infra_tds')
              ?.value,
          auxi_tds:
            this.outrateItemBreakUpFormArr.controls[rowNo - 1].get('auxi_tds')
              ?.value,
        });

        this.isReadOnly = false;
        //this.rendered.selectRootElement('#hsncode_'.concat((this.itemBreakUpFormArr?.length-1).toString()))?.focus();
        this.el.nativeElement
          .querySelector(
            'cell' + (this.outrateItemBreakUpFormArr?.length - 1) + ' > input'
          )
          ?.focus();
      }, 100);
    }
  }

  retrieveOutrateDetails() {
    this.actionService.getReterieveClickedFlagUpdatedValue(true);
    let bldgCode = this.outRateSelectionsForm
      .get('bldgCode')
      ?.value[0][0].trim();

    let wing: string = '';

    if (this.outRateSelectionsForm.get('wing')?.value.length == 0) {
      wing = '  ';
    } else {
      wing = this.outRateSelectionsForm.get('wing')?.value[0][0]?.trim();
    }

    console.log('wingwala', wing);

    let flatnum = this.outRateSelectionsForm.get('flatnum')?.value[0][0].trim();
    if (bldgCode != '' && flatnum != '' && wing != '') {
      this.OutgoingService.getOutrateDetailsByBldgcodeAndFlatnumAndWing(
        bldgCode,
        flatnum,
        wing
      )
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.data) {
              console.log('res.data - ', res.data);

              this.initialMode = true;
              this.deleteDisabled = false;
              this.bindInputValuesWithResponseBean(res);
              for (var i = 0; i < res.data.length - 1; i++) {
                res.data[0].length - 1 == i
                  ? ''
                  : this.outrateItemBreakUpFormArr.push(
                      this.outrateItemDetailInitRows()
                    );
                this.outRateForm.controls?.outrateDetailsBreakUp.patchValue(
                  res.data
                );
              }

              this.tranMode = 'R';
              this.setFocus(
                'Replace with First TextBox Control Name to set focus'
              );
            } else {
              this.toastr.error('Outrate Not Found');
            }
            this.outRateSelectionsForm.disable();
          },
          error: (error) => {
            this.toastr.error(error.error.errors[0].defaultMessage);
          },
        });
    } else {
      this.toastr.error('No Rates Enter for This Flat');
    }
  }

  bindInputValuesWithResponseBean(res: any) {
    // Initialise form values from response bean
    this.outRateForm.patchValue({});
  }

  addOutrateRow() {
    this.outrateItemBreakUpFormArr.push(this.outrateItemDetailInitRows());
    let rowNo = this.outrateItemBreakUpFormArr.value.length - 1;
    this.outrateItemBreakUpFormArr.controls[rowNo].patchValue({
      bldgcode: this.outRateSelectionsForm.get('bldgCode')?.value[0][0].trim(),
      flatnum: this.outRateSelectionsForm.get('flatnum')?.value[0][0].trim(),
      wing: this.outRateSelectionsForm.get('wing')?.value[0][0].trim(),
    });

    // this.outrateItemBreakUpFormArr.controls[rowNo].get('bldgcode')?.setValue(this.outRateSelectionsForm.get('bldgCode')?.value[0][0].trim());
    // this.outrateItemBreakUpFormArr.controls[rowNo].get('flatnum')?.setValue(this.outRateSelectionsForm.get('flatnum')?.value[0][0].trim());
    // this.outrateItemBreakUpFormArr.controls[rowNo].get('wing')?.setValue(this.outRateSelectionsForm.get('wing')?.value[0][0].trim());
  }

  deleteOutrateRow(rowIndex: any) {
    if (this.outrateItemBreakUpFormArr.length > 1) {
      let deletedOutRow = this.outrateItemBreakUpFormArr?.at(rowIndex).value;
      deletedOutRow['isDelete'] = true;
      this.deletedRowArray.push(deletedOutRow);
      this.outrateItemBreakUpFormArr.removeAt(rowIndex);
    } else {
      this.toastr.error('Atleast One Row must be present in Rate Details');
    }
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

  saveOutrate() {
    // Method to save data entered by user
    if (this.outRateForm.valid) {
      // Check whether data is entered properly
      let valuesToUpper = this.convertValuesToUpper(this.outRateForm.value);
      let userid = sessionStorage.getItem('userName');
      console.log(
        'Outrate Value: ',
        this.outRateForm.value?.outrateDetailsBreakUp
      );
      // let savePayload = {
      // 	...this.outRateForm.value?.outrateDetailsBreakUp
      // };

      // let outrRate: number;
      // let outrMaint: number;
      // let outrPropRate: number;
      // let outrInfra: number;
      // let outrWater: number;
      // let outrElect: number;
      // let outrNATax: number;

      for (let rowNo = 0; rowNo < this.outRateForm.controls.outrateDetailsBreakUp.controls.length ; rowNo++) {
        this.calcTotRate(rowNo) ;
        // outrRate = 0;
        // outrMaint = 0;
        // outrPropRate = 0;
        // outrInfra = 0;
        // outrWater = 0;
        // outrElect = 0;
        // outrNATax = 0;
        // outrMaint =
        //   outrMaint + Number( this.outRateForm.controls.outrateDetailsBreakUp.controls[rowNo].get('maint')?.value) ;
        // outrPropRate =
        //   outrPropRate + Number( this.outRateForm.controls.outrateDetailsBreakUp.controls[rowNo].get('proprate')?.value);
        // outrInfra =
        //   outrInfra +  Number( this.outRateForm.controls.outrateDetailsBreakUp.controls[rowNo].get('infra')?.value); 
        // outrWater =
        //   outrWater + Number( this.outRateForm.controls.outrateDetailsBreakUp.controls[rowNo].get('water')?.value);  
        // outrElect =
        //   outrElect + Number( this.outRateForm.controls.outrateDetailsBreakUp.controls[rowNo].get('elect')?.value);   
        // outrNATax =
        //   outrNATax + Number( this.outRateForm.controls.outrateDetailsBreakUp.controls[rowNo].get('natax')?.value); 
       
        // outrRate =
        //   outrMaint +
        //   outrPropRate +
        //   outrInfra +
        //   outrWater +
        //   outrElect +
        //   outrNATax;

        // this.outrateItemBreakUpFormArr.controls[rowNo].patchValue({
        //   rate: outrRate,
        // });
      }

      let savePayload = this.outRateForm.value?.outrateDetailsBreakUp;

      if (this.tranMode == 'R') {
        this.deletedRowArray.forEach((val: any) => {
          savePayload?.push(val);
        });
        // Retrieve Mode
        // savePayload['bldgCode'] = this.outRateSelectionsForm.get('bldgCode')?.value;
        // savePayload['wing'] = this.outRateSelectionsForm.get('wing')?.value;
        // savePayload['flatnum'] = this.outRateSelectionsForm.get('flatnum')?.value;
        console.log('savewala', savePayload);
        this.OutgoingService.updateOutrate(savePayload).subscribe({
          next: (res) => {
            if (res.status) {
              this.modalService.showErrorDialog(
                'Outrate Updated',
                res['message'],
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
      } else if (this.tranMode == 'A') {
        // New Entry Mode
        this.OutgoingService.addOutrate(savePayload).subscribe({
          next: (res) => {
            if (res.status) {
              this.modalService.showErrorDialog(
                'Outrate Added',
                res['message'],
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
    } else {
      this.toastr.error('Please fill the form properly'); // Data not entered properly
    }
  }

  deleteOutrate() {
    let bldgCode = this.outRateSelectionsForm.get('bldgCode')?.value;
    let flatnum = this.outRateSelectionsForm.get('flatnum')?.value;
    let wing = this.outRateSelectionsForm.get('wing')?.value;
    let startdate = this.outRateSelectionsForm.get('startdate')?.value;
    this.OutgoingService.deleteOutrate(
      bldgCode,
      flatnum,
      wing,
      startdate
    ).subscribe({
      next: (res) => {
        if (res.status) {
          this.modalService.showErrorDialog(
            'Outrate Deleted',
            res['message'],
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
    if (this.outRateForm.dirty) {
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
        if (this.isDeleteClicked) {
          this.deleteOutrate();
          this.isDeleteClicked = false;
        }
        if (this.isBackClicked) {
          this.back();
        }
      }
    });
  }

  back() {
    // User clicks on Back button
    this.isBackClicked = false;
    this.isDeleteClicked = false;
    this.resetFormArray();
    this.outRateSelectionsForm.reset();
    this.outRateForm.reset();
    this.initialMode = false;
    this.deleteDisabled = true;
    this.outRateSelectionsForm.controls['bldgCode'].enable();
    this.outRateSelectionsForm.controls['wing'].enable();
    this.outRateSelectionsForm.controls['flatnum'].enable();
    this.setFocus('bldgCode'); // Set focus on first column in selection form group
    this.deletedRowArray = [];
  }

  resetFormArray() {
    this.outrateItemBreakUpFormArr.clear();
    this.outRateForm.controls?.outrateDetailsBreakUp.reset();
    this.outrateItemBreakUpFormArr.push(this.outrateItemDetailInitRows());
  }

  validateMonth(index: number, ogMonth: string, colName: string, event: Event) {
    if (ogMonth.length < 6) {
      this.toastr.error('Invalid Month');
      this.renderer.selectRootElement(event.target).focus();
      return;
    } else {
      let year = ogMonth.slice(0, 4);
      let month = ogMonth.slice(-2);
      let ogDate = moment('01/' + month + '/' + year, 'DD/MM/YYYY', true);
      console.log(ogDate);
      if (ogDate.isValid() == false) {
        this.toastr.error('Invalid Month');
        // event.target
        this.outRateForm.controls.outrateDetailsBreakUp.controls[index].get(
          colName
        )?.value == '';
        this.outrateItemBreakUpFormArr.controls[index].patchValue({
          colName: '',
        });
        this.renderer.selectRootElement(event.target).focus();
        return;
      }
      if (colName == 'enddate') {
        let startMonth =
          this.outRateForm.controls.outrateDetailsBreakUp.controls[index]
            .get('startdate')
            ?.value?.slice(-2);
        let startYear =
          this.outRateForm.controls.outrateDetailsBreakUp.controls[index]
            .get('startdate')
            ?.value?.slice(0, 4);
        if (ogDate < moment('01/' + startMonth + '/' + startYear)) {
          this.toastr.error('End Month should be greater than Start Month');
          this.renderer.selectRootElement(event.target).focus();
        }
      }
    }
  }

  validateNegativeAmt(
    index: number,
    amt: number,
    colName: string,
    event: Event
  ) {
    if (amt > 0) {
      this.toastr.error(colName + ' Cannot be Greater than Zero');
      this.renderer.selectRootElement(event.target).focus();
    }
  }

  calcTotRate(rowNo: number){
    let outrRate: number;
    let outrMaint: number;
    let outrPropRate: number;
    let outrInfra: number;
    let outrWater: number;
    let outrElect: number;
    let outrNATax: number;

    outrRate = 0;
    outrMaint = 0;
    outrPropRate = 0;
    outrInfra = 0;
    outrWater = 0;
    outrElect = 0;
    outrNATax = 0;
    outrMaint =
      outrMaint + Number( this.outRateForm.controls.outrateDetailsBreakUp.controls[rowNo].get('maint')?.value) ;
    outrPropRate =
      outrPropRate + Number( this.outRateForm.controls.outrateDetailsBreakUp.controls[rowNo].get('proprate')?.value);
    outrInfra =
      outrInfra +  Number( this.outRateForm.controls.outrateDetailsBreakUp.controls[rowNo].get('infra')?.value); 
    outrWater =
      outrWater + Number( this.outRateForm.controls.outrateDetailsBreakUp.controls[rowNo].get('water')?.value);  
    outrElect =
      outrElect + Number( this.outRateForm.controls.outrateDetailsBreakUp.controls[rowNo].get('elect')?.value);   
    outrNATax =
      outrNATax + Number( this.outRateForm.controls.outrateDetailsBreakUp.controls[rowNo].get('natax')?.value); 
   
    outrRate =
      outrMaint +
      outrPropRate +
      outrInfra +
      outrWater +
      outrElect +
      outrNATax;

    this.outrateItemBreakUpFormArr.controls[rowNo].patchValue({
      rate: outrRate,
    });

  }

}
