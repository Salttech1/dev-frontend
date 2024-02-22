import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as constant from '../../../../../../constants/constant';
import { VehicleexpService } from 'src/app/services/adminexp/vehicleexp.service';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'src/app/services/modalservice.service';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
@Component({
  selector: 'app-vehicle-cert-cancellation',
  templateUrl: './vehicle-cert-cancellation.component.html',
  styleUrls: ['./vehicle-cert-cancellation.component.css'],
})
export class VehicleCertCancellationComponent implements OnInit {
  initialMode: Boolean = false;
  selectedCerNum: any = '';
  selectedTranser: any = '';
  deleteDisabled: Boolean = true;
  tranMode: String = '';
  isDeleteClicked: boolean = false;
  isBackClicked: boolean = false;
  dtOptions: any;
  detailRow: any[] = [];
  initDetailRow: any[] = [];
  vehcondition = 'eqp_dispdate is null';
  CancelArray: any = [];
  isDataRecieved: boolean = false;
  loaderToggle: boolean = false;
  vehSelectionsForm: FormGroup = new FormGroup({
    equipid: new FormControl<String | null>('', Validators.required),
  }); // Form Group for Selection input fields

  vehCancelForm = new FormGroup({
    // Form Group for Data Entry / Edit
    admexphDetailsBreakUp: new FormArray([this.admexphItemDetailInitRows()]),
    admexpdDetailsBreakUp: new FormArray([this.admexpdItemDetailInitRows()]),
  });

  admexphItemDetailInitRows() {
    return this.fb.group({
      certnum: new FormControl<string | null>(null),
      certrevnum: new FormControl<string>('0'),
      certtype: new FormControl<string | null>(null),
      certdate: new FormControl(),
      printed: new FormControl<string>('0'),
      printedon: new FormControl(),
      passedon: new FormControl(),
      certstatus: new FormControl<string | null>(null),
      coy: new FormControl<string | null>(null),
      prop: new FormControl<string | null>(null),
      socid: new FormControl<string | null>(null),
      equipid: new FormControl<string | null>(null),
      meterid: new FormControl<string | null>(null),
      partytype: new FormControl<string | null>(null),
      partycode: new FormControl<string | null>(null),
      certamount: new FormControl<string>('0'),
      smeterred: new FormControl<string>('0'),
      emeterred: new FormControl<string>('0'),
      gasqty: new FormControl<string>('0'),
      average: new FormControl<string>('0'),
      payref: new FormControl<string | null>(null),
      paydate: new FormControl(),
      payamount: new FormControl<string>('0'),
      transer: new FormControl<string | null>(null),
      remarks: new FormControl<string | null>(null),
      prv_certnum: new FormControl<string | null>(null),
      prv_date: new FormControl(),
      prv_type: new FormControl<string | null>(null),
      prv_amt: new FormControl<string>('0'),
      t_payment: new FormControl<string>('0'),
      estimatedkm: new FormControl<string>('0'),
      billno: new FormControl<string | null>(null),
      partybillref: new FormControl<string | null>(null),
      partybilldate: new FormControl(),
      gstyn: new FormControl<string | null>(null),
      isSelected: new FormControl(false),
      allottedto: new FormControl<String>(''),
      vehtype: new FormControl<String>(''),
    });
  }

  admexpdItemDetailInitRows() {
    return this.fb.group({
      certnum: new FormControl<string | null>(null),
      workcode: new FormControl<string | null>(null),
      billref: new FormControl<string | null>(null),
      billdate: new FormControl(),
      billamount: new FormControl<string>('0'),
      durationFrom: new FormControl(),
      durationUpto: new FormControl(),
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
    private router: Router
  ) {}

  ngOnInit(): void {}

  ///For Payload
  // this.vehCancelForm.controls.admexphDetailsBreakUp?.value.filter((val) => {
  //   val.isSelected
  // })

  get admexphItemBreakUpFormArr() {
    return this.vehCancelForm.get('admexphDetailsBreakUp') as FormArray;
  }

  get admexpdItemBreakUpFormArr() {
    return this.vehCancelForm.get('admexpdDetailsBreakUp') as FormArray;
  }

  triggerFormCheck(i: any, event: any) {
    this.selectedCerNum =
      this.vehCancelForm.controls?.['admexphDetailsBreakUp']?.value[i]?.certnum;
    this.selectedTranser =
      this.vehCancelForm.controls?.['admexphDetailsBreakUp']?.value[i]?.transer;
    let testArr: any = [];
    this.initDetailRow.forEach((val) => {
      val.certnum == this.selectedCerNum ? testArr.push(val) : () => {};
    });
    console.log('fedf', testArr);
    this.detailRow = [];
    this.detailRow = testArr;
    // this.detailRow.forEach((val:any) => {
    // 	this.detailRow.slice(val)
    // })
  }

  focusInputs(id: any) {
    setTimeout(() => {
      let focusElement3 = document.getElementById(id) as HTMLElement;
      this.renderer.selectRootElement(focusElement3).focus();
    }, 100);
  }

  onEnterTriggerFormCheck(i: any, event: any) {
    this.triggerFormCheck(i, event);
  }

  retrieve() {

    let equipid = this.vehSelectionsForm.get('equipid')?.value[0][0];
    this.loaderToggle = true;
    this.VehicleexpService.findByEquipid(equipid)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.loaderToggle = false;
          if (res.status) {
            this.isDataRecieved = true;
            console.log('data', res.data);
            console.log('length', res.data.unPostedCertBean.length);

            for (var i = 0; i < res.data.unPostedCertBean?.length; i++) {
              res.data?.unPostedCertBean?.length - 1 == i
                ? ''
                : this.admexphItemBreakUpFormArr.push(
                    this.admexphItemDetailInitRows()
                  );
              this.vehCancelForm.controls.admexphDetailsBreakUp.patchValue(
                res.data.unPostedCertBean
              );
            }
            for (var i = 0; i < res.data.unPosterCertDetailBean?.length; i++) {
              this.detailRow.push(res.data.unPosterCertDetailBean[i]);
            }
            this.initDetailRow = this.detailRow;
            this.triggerFormCheck(0, null);
            this.initialMode = true;
            this.selectedCerNum =
              this.vehCancelForm.controls?.[
                'admexphDetailsBreakUp'
              ]?.value[0]?.certnum;
            this.selectedTranser =
              this.vehCancelForm.controls?.[
                'admexphDetailsBreakUp'
              ]?.value[0]?.transer;
            this.focusInputs('radioid_0');
          } else {
            this.vehCancelForm.controls['admexphDetailsBreakUp'].reset();
            this.toastr.error(res.message, 'Error', {
              disableTimeOut: true,
              tapToDismiss: false,
              closeButton: true,
            });
          }
        },
        error: (error) => {
          this.toastr.error(error.error.errors[0].defaultMessage);
        },
      });
  }

  update() {
    this.loaderToggle = true;
    this.VehicleexpService.updatecancelUnPostedCertificateAdmexph(this.selectedCerNum,this.selectedTranser)
    .pipe(take(1))
    .subscribe({
      next: (res) => {
        this.loaderToggle = false;
        if (res.status) {
          this.toastr.info(res.message);
          this.reset();
        }
      },
      error: (error) => {
        this.toastr.error(error.error.errors[0].defaultMessage);
      },
    });
    
  }

  reset() {
    this.admexphItemBreakUpFormArr.clear();
    this.vehCancelForm.controls?.admexphDetailsBreakUp.reset();
    this.admexphItemBreakUpFormArr.push(this.admexphItemDetailInitRows());
    this.initDetailRow = [];
    this.detailRow = [];
    this.isDataRecieved = false;
    this.focusInputs('equipid');
    this.vehSelectionsForm.reset();
    this.initialMode = false;
    // this.admexpdItemBreakUpFormArr.clear();
    // this.vehCancelForm.controls?.admexpdDetailsBreakUp.reset()
    // this.admexpdItemBreakUpFormArr.push(this.admexpdItemDetailInitRows())
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }
  handleUpdateClick() {
    this.showDialog(
      constant.ErrorDialog_Title,
      'Do you want to Cancel Certificate ' +
        this.selectedCerNum,
      'question',
      true
    );
  }

  showDialog(
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
    dialogRef.afterClosed().subscribe((result: any) => {
      if (confirmationDialog && result) {
        this.update();
      }
    });
  }
}

