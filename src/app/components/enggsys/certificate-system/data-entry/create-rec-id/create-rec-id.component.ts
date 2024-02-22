import { Component, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { DataEntryService } from 'src/app/services/enggsys/data-entry.service';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';

@Component({
  selector: 'app-create-rec-id',
  templateUrl: './create-rec-id.component.html',
  styleUrls: ['./create-rec-id.component.css']
})
export class CreateRecIdComponent implements OnInit {
  rf!: FormGroup
  loaderToggle: boolean = false
  actionbtn = [false, true, true, true, true, false] // add,retrieve,save,reset,back,other btn(code help && exit)
  bldgSQ = `(bmap_closedate >= to_date('${moment().format('DD.MM.yyyy')}','dd.mm.yyyy') or bmap_closedate is null)`
  conttorSQ = `par_partytype = 'E'`
  details: boolean = false // details container hide and show for add/retrieve
  modalTitle = 'K Raheja'
  isUpdate: boolean = false
  constructor(private fb: FormBuilder,
    private ds: DataEntryService,
    private renderer: Renderer2,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalComponent>
  ) { }

  ngOnInit(): void {
    this.rf = this.fb.group({
      bldgcode: ['', Validators.required],
      bldgName: [{ value: '', disabled: true }],
      recid: ['', Validators.required],
      coy: [{ value: '', disabled: true }],
      conttor: ['', Validators.required],
      conttorName: [{ value: '', disabled: true }],
      tdsptype: [['E    ', 'Contractors                   '], Validators.required],
      range: this.fb.group({
        tdsfrom: [null],
        tdsupto: [null]
      }),
      tdscode: [2],
      tdsper: [0],
      workcode: ['', Validators.required],
      workcodeName: [{ value: '', disabled: true }],
      adline1: [{ value: '', disabled: true }],
      adline2: [{ value: '', disabled: true }],
      adline3: [{ value: '', disabled: true }],
      adline4: [{ value: '', disabled: true }],
      adline5: [{ value: '', disabled: true }],
      pmtacnum: [{ value: '', disabled: true }],
      gstno: [{ value: '', disabled: true }],
      vatnum: [{ value: '', disabled: true }],
      tinnum: [{ value: '', disabled: true }],
      servicetaxnum: [{ value: '', disabled: true }],
      sptdsper: [{ value: 0, disabled: true }]
    },
      {
        validators:properDate()
      }
    )
    this.updateCoy()
    this.applicablePerc()
    this.noTds()
    this.recIdTrigger()
  }

  // modal dialog
  // show modal popup for dialogRef Object
  openDialog(
    titleVal: any,
    templateField: any,
    isF1PressedFlag: boolean,
    type: string | null,
    msg: string
  ) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        isF1Pressed: isF1PressedFlag,
        title: titleVal,
        message: msg,
        template: templateField,
        type: type,
      },
    });
    this.dialogRef = dialogRef;
  }

  dFields() {
    this.rf.get('recid')?.disable();
    this.rf.get('bldgcode')?.disable();
    this.rf.get('conttor')?.disable();
    this.rf.get('workcode')?.disable();
  }

  addContDetail(action: string) {
    // for recid checking api call
    let payLoad: any = {}
    let fc = ['bldgcode', 'workcode', 'conttor', 'tdsptype', 'coy'];
    for (let i = 0; i < fc.length; i++) {
      let cc = this.rf.get(fc[i]);
      if (cc?.getRawValue() instanceof Object) {
        payLoad[fc[i]] = cc.getRawValue()?.[0]?.[0]?.trim()
      }
      else {
        payLoad = {}
        break
      }
    }
    if (Object.keys(payLoad).length) {
      payLoad['partycode'] = payLoad['conttor']
      payLoad['partytype'] = 'E'
      action == 'add' ? payLoad['tdsptypeCheck'] = false : payLoad['tdsptypeCheck'] = true
      action == 'add' && (this.loaderToggle = true)
      this.ds.addContractDetail(payLoad).pipe(take(1), finalize(() => { this.loaderToggle = false }))
        .subscribe({
          next: (res: any) => {
            if (res?.status) {
              if (action == 'add') {
                // handle for add 
                console.log(res, "for add");
                this.details = true;
                setTimeout(() => {
                  this.rf.patchValue(res.data.addressResponseBean)
                  this.rf.patchValue(res.data.partyResponseBean)
                })
                this.dFields()
                this.actionbtn = [true, true, false, true, false, true]
                setTimeout(() => {
                  this.renderer.selectRootElement("#tdsptype")?.focus()
                })
              }
              if (action == 'change') {
                // handle while tdsptype value change
                this.rf.get('tdsper')?.patchValue(res?.extraData)
              }
            }
            else {
              this.openDialog(this.modalTitle, '', false, 'error', res.message)
              this.dialogRef.afterClosed().subscribe((res: any) => {
                if (action == 'add') {
                  this.rf.get('bldgcode')?.reset();
                  this.rf.get('conttor')?.reset();
                  this.rf.get('workcode')?.reset();
                  this.renderer.selectRootElement('#bldgid')?.focus()
                }
              })
            }
          }
        })
    }
  }

  add() {
    this.rf.get('tdsptype')?.patchValue(['E    ', 'Contractors                   '])
    let bc = this.rf.get('bldgcode');
    let wc = this.rf.get('workcode');
    let ct = this.rf.get('conttor');
    if (bc?.valid && wc?.valid && ct?.valid) {
      this.isUpdate = false
      this.addContDetail('add')
    }
    else {
      bc?.markAsTouched();
      wc?.markAsTouched();
      ct?.markAsTouched();
    }
  }

  retrieve() {
    this.isUpdate = true
    let rid = this.rf.get('recid')?.value?.[0]?.[0]?.trim()
    console.log(this.rf);
    if (this.rf.get('recid')?.valid) {
      if (rid) {
        this.ds.fetchRecId(rid).pipe(take(1), finalize(() => {
        })).subscribe({
          next: (res: any) => {
            if (res?.status) {
              this.details = true
              setTimeout(() => {
                this.rf.patchValue(res.data);
                this.rf.patchValue(res.data.addressResponseBean)
                this.rf.patchValue(res.data.partyResponseBean)
                // formating tdsfroma tdsupto date value
                this.rf.get('range.tdsfrom')?.patchValue(moment(res?.data?.tdsfrom, 'DD/MM/yyyy')?.format('yyyy-MM-DD'))
                this.rf.get('range.tdsupto')?.patchValue(moment(res?.data?.tdsupto, 'DD/MM/yyyy')?.format('yyyy-MM-DD'))
              })
              this.dFields()
              this.actionbtn = [true, true, false, true, false, true]
            }
          }
        })
      }
    } else {
      this.rf.get('recid')?.markAsTouched()
      this.renderer.selectRootElement('#recid')?.focus()
    }
  }

  updateCoy() {
    // when building changes updating company value 
    this.rf.get('bldgcode')?.valueChanges.subscribe((val) => {
      if (val instanceof Object) {
        let bc = val?.[0]?.[0]?.trim();
        console.log(bc, "bc");

        this.ds.updateCoy(bc).subscribe({
          next: (res: any) => {
            if (res?.status) {
              let d: any = [];
              d.push([res.data.coycode, res.data.coyname]); // pushing coy code and name from api to update company value
              this.rf.get('coy')?.patchValue(d)
            }
            else {
              this.rf.get('coy')?.patchValue('')
            }
          }
        })
      }
      else {
        this.rf.get('coy')?.setValue('')
      }
    })
  }

  applicablePerc() {
    // when tdsfrom and tdsto date will be there special tds % will be enabled else diabled
    this.rf.get('range')?.valueChanges.subscribe((val) => {
      let tf = this.rf.get('range.tdsfrom')?.value;
      let tu = this.rf.get('range.tdsupto')?.value;
      if (tf && tu) {
        this.rf.get('sptdsper')?.enable()
      }
      else {
        this.rf.get('sptdsper')?.disable()
      }
    })
  }

  noTds() {
    this.rf.get('tdsptype')?.valueChanges.subscribe((val) => {
      if (val instanceof Object) {
        let tpt = val?.[0]?.[0]?.trim().toUpperCase();
        setTimeout(() => {
          // for type N not to call tds% api call 
          tpt != 'N' && this.addContDetail('change')
        }, 50);

        if (tpt == 'N') {
          // for tdsptype 'N' (no tds), below fields will be disabled.
          this.rf.get('tdscode')?.disable()
          this.rf.get('tdsper')?.disable()
          this.rf.get('range')?.disable()
          this.rf.get('sptdsper')?.disable()
          this.rf.get('tdsper')?.patchValue(0)
          this.rf.get('tdscode')?.patchValue(0)
        }
        else {
          let tf = this.rf.get('range.tdsfrom')?.value;
          let tu = this.rf.get('range.tdsupto')?.value;
          this.rf.get('tdscode')?.enable()
          this.rf.get('tdsper')?.enable()
          this.rf.get('range')?.enable();
          if (tf && tu) {
            this.rf.get('sptdsper')?.enable()
          }
        }
      }
    })
  }

  //if recid filled enabled retrieve
  recIdTrigger() {
    this.rf.get('recid')?.valueChanges.subscribe((val: any) => {
      if (val instanceof Object) {
        // if recid holds value retrieve button will be enabled , add button,building contractor,work code (actionbtn[0]) disabled 
        this.actionbtn[1] = false // for retrieve
        this.actionbtn[0] = true// for add
        // disabled fields
        this.rf.get('bldgcode')?.disable();
        this.rf.get('conttor')?.disable();
        this.rf.get('workcode')?.disable();
      }
      else {
        // if recid does not holds value retrieve button will be disabled , add button,building contractor,work code (actionbtn[0]) enabled 
        this.actionbtn[1] = false // for retrieve
        this.actionbtn[1] = true
        this.actionbtn[0] = false
        // enabled fields
        this.rf.get('bldgcode')?.enable();
        this.rf.get('conttor')?.enable();
        this.rf.get('workcode')?.enable();
      }
    })
  }

  save() {
    let payLoad = this.rf?.value;
    let tdsfromdt = this.rf.get('range.tdsfrom')?.value
    let tdsuptodt = this.rf.get('range.tdsupto')?.value
    let tdsFrom = tdsfromdt ? moment(tdsfromdt).format('DD/MM/yyyy') : null
    let tdsTo = tdsuptodt ? moment(tdsuptodt).format('DD/MM/yyyy') : null
    if (tdsFrom && tdsTo) {
      // if tds from and to date there then key will be added
      payLoad['tdsfrom'] = tdsFrom
      payLoad['tdsupto'] = tdsTo
    }
    let recid = this.rf.get('recid')?.value;
    if (recid instanceof Object) {
      payLoad['contract'] = recid?.[0]?.[0]?.trim()
    }
    payLoad['tdsptype'] = payLoad['tdsptype']?.[0]?.[0]?.trim()
    payLoad['bldgcode'] = this.rf.get('bldgcode')?.value?.[0]?.[0]?.trim()
    payLoad['bldgname'] = this.rf.get('bldgcode')?.value?.[0]?.[1]?.trim()
    payLoad['coy'] = this.rf.get('coy')?.value?.[0]?.[0]?.trim()
    payLoad['coyname'] = this.rf.get('coy')?.value?.[0]?.[1]?.trim()
    payLoad['workcode'] = this.rf.get('workcode')?.value?.[0]?.[0]?.trim()
    payLoad['workname'] = this.rf.get('workcode')?.value?.[0]?.[1]?.trim()
    payLoad['conttor'] = this.rf.get('conttor')?.value?.[0]?.[0]?.trim()
    payLoad['contractorname'] = this.rf.get('conttor')?.value?.[0]?.[1]?.trim()
    payLoad['tdsper'] = payLoad['tdsper'] ? payLoad['tdsper'] : null
    payLoad['partytype'] = 'E'
    payLoad['partycode'] = payLoad['conttor']
    payLoad['isUpdate'] = this.isUpdate
    //  return
    this.ds.saveContractDetail(payLoad).pipe(take(1), finalize(() => { }))
      .subscribe({
        next: (res: any) => {
          console.log(res, "for save");
          if (res?.status) {
            this.openDialog(this.modalTitle, '', false, 'info', res?.message)
            this.dialogRef.afterClosed().subscribe((res: any) => {
              this.back()
            })
          }
          else {
            this.openDialog(this.modalTitle, '', false, 'error', res?.message)

          }
        },
        complete: () => { }
      })
  }

  back() {
    // reset default value
    this.rf.reset({
      tdscode: 2,
      sptdsperc: { value: 0, disabled: true },
      tdsptype: { value: ['E    ', 'Contractors                   '] },
    });
    this.rf.get('recid')?.enable();
    this.rf.get('bldgcode')?.enable();
    this.rf.get('conttor')?.enable();
    this.rf.get('workcode')?.enable();
    this.actionbtn = [false, true, true, true, true, false]
    this.details = false
    this.renderer.selectRootElement('#recid')?.focus()
    this.isUpdate = false
  }
}

export function properDate(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    let fromdt = c.get('range.tdsfrom')?.value;
    let toDt = c.get('range.tdsupto')?.value;
    if (fromdt && !toDt) {
      c.get('range')?.setErrors({ properDate: true })
    }
    else if (!fromdt && toDt) {
      c.get('range')?.setErrors({ properDate: true })
    }
    else {
      c.get('range')?.setErrors(null)
    }
    return null
  }
}