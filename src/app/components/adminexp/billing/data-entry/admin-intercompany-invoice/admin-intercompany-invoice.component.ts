import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { buttonsList } from 'src/app/shared/interface/common';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { ToastrService } from 'ngx-toastr';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { api_url } from 'src/constants/constant';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-intercompany-invoice',
  templateUrl: './admin-intercompany-invoice.component.html',
  styleUrls: ['./admin-intercompany-invoice.component.css'],
})
export class AdminIntercompanyInvoiceComponent implements OnInit {
  initialMode: boolean = false;
  isBackClicked: boolean = false;
  isDisable: boolean = false;
  config = {
    isLoading: false,
    isTableMaximized: false,
    isUpdate: false,
    printHeader: '',
    invoiceType: 'O',
    invoiceTypeList: [
      { id: 'O', name: 'Original Copy' },
      { id: 'F', name: 'File Copy' },
    ],
  };

  responseData: any = [];

  // hide & show buttons
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'add',
    'retrieve',
    'delete',
    'address',
    'save',
    'accPost',
    'print',
    'back',
    'exit',
  ]);

  filter = {
    getProject: '',
    getGroupInvoiceNumber: '',
  };

  keysStartingWithTotal: any = [];

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpRequestService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private el: ElementRef,
    private _commonReport: CommonReportsService,
    public _service: ServiceService
  ) {}

  intercompanyInvoice: FormGroup = this.fb.group(
    {
      companyCode: ['', Validators.required], //SGER
      companyName: [{ value: '', disabled: true }],
      projectCode: ['', Validators.required], //CHBM
      projectCodeName: [{ value: '', disabled: true }],
      billDate: ['', Validators.required], //new Date('01/29/2024')
      billFromDate: ['', Validators.required], //new Date('12/01/2023')
      billToDate: ['', Validators.required], //new Date('12/31/2023')
      groupInvoiceNumber: [''],
      remark: [''],
      totalAcAmt: [{ value: 0, disabled: true }],
      balanceAmt: [{ value: 0, disabled: true }],

      dynamicArray: this.fb.array([]),
    },
    { validator: this.invoiceDateVlidation }
  );

  // validation
  invoiceDateVlidation(control: any): { [key: string]: boolean } | null {
    //   // first  add validation
    const invdate = new Date(control.get('billDate')?.value);
    const invfromdate = new Date(control.get('billFromDate')?.value);
    const invtodate = new Date(control.get('billToDate')?.value);

    // Check if the month of invfromdate is different from the month of invdate
    // if (invfromdate.getMonth() !== invdate.getMonth() || invfromdate.getFullYear() !== invdate.getFullYear()) {
    //   return { 'invalidMonthInvFromDate': true };
    // }

    // // Check if the month of invtodate is different from the month of invdate
    // if (invtodate.getMonth() !== invdate.getMonth() || invtodate.getFullYear() !== invdate.getFullYear()) {
    //   return { 'invalidMonthInvToDate': true };
    // }

    // Check if invtodate is less than invfromdate
    if (invtodate < invfromdate) {
      return { invalidDateOrder: true };
    }

    return null;
  }

  navigate(e: KeyboardEvent, i: number, name: String) {
    let nextRow: any = i;
    e.key == 'ArrowDown'
      ? nextRow++
      : e.key == 'ArrowUp' && nextRow > 0
      ? nextRow--
      : '';

    let nextElId = name + '_' + nextRow;
    // Get the parent element
    const parentElement = document.getElementById(nextElId);
    this.renderer.selectRootElement(parentElement)?.focus();
  }

  ngOnInit(): void {
    this.init();
    // this.getIntercompanyinvoiceDetails()
    this.setFocus('intercompany_coy');
  }

  init() {
    this.commonService.enableDisableButtonsByIds(
      ['delete', 'address', 'save', 'print', 'accPost'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['back', 'add', 'retrieve', 'exit'],
      this.buttonsList,
      false
    );
  }

  buttonAction(event: string) {
    console.log('form value', this.intercompanyInvoice);

    if (event == 'add') {
      this.onClickAdd();
    } else if (event == 'retrieve') {
      this.onClickRetrive();
    } else if (event == 'save') {
      this.onClickSave();
    } else if (event == 'accPost') {
      this.onClickAccPost();
    } else if (event == 'print') {
      this.onClickPirnt();
    } else if (event == 'back') {
      this.onClickBack();
    } else if (event == 'exit') {
      this.router.navigateByUrl('/dashboard');
    }
  }

  //////////////////////////////
  // on action button click event
  //////////////////////////////
  // on click add
  onClickAdd() {
    this.addInvoiceNumberValidationDynamicaly(false);
    if (this.intercompanyInvoice.valid) {
      this.config.isUpdate = false;
      this.getIntercompanyinvoiceDetails();
    } else {
      this.showErroPopup();
    }
  }

  onClickRetrive() {
    this.addInvoiceNumberValidationDynamicaly(true);

    if (this.intercompanyInvoice.valid) {
      this.retrivewIntercompanyInvoice();
    } else {
      this.showErroPopup();
    }
  }

  onClickSave() {
    if (this.intercompanyInvoice.valid) {
      this.saveIntercompanyInvoice();
    } else {
      if (this.intercompanyInvoice.get('balanceAmt')?.value != 0) {
        this.showErrorFieldDialog(
          'K-Raheja ERP',
          "The amounts in all columns do not match the 'ac amount' .",
          'error'
        );
      } else {
        this.showErroPopup();
      }
    }
  }
  onClickAccPost() {
    if (this.intercompanyInvoice.valid) {
      const dialogRef = this.dialog.open(ModalComponent, {
        disableClose: true,
        data: {
          isF1Pressed: false,
          title: 'K-Raheja ERP',
          message: 'Do you wan to post this entry to Accounts ?',
          template: '',
          type: 'info',
          confirmationDialog: true,
        },
      });
      dialogRef.afterOpened().subscribe(() => {});
      dialogRef.afterClosed().subscribe((result: any) => {
        this.config.isLoading = true;
        if (result) {
          this.postAccountIntercompanyInvoice();
        } else {
          this.config.isLoading = false;
        }
      });
    } else {
      if (this.intercompanyInvoice.get('balanceAmt')?.value != 0) {
        this.showErrorFieldDialog(
          'K-Raheja ERP',
          "The amounts in all columns do not match the 'ac amount' .",
          'error'
        );
      } else {
        this.showErroPopup();
      }
    }
  }

  onClickPirnt() {
    if (this.intercompanyInvoice.disabled || this.intercompanyInvoice.valid) {
      document.getElementById('printProcess')?.click();
    } else {
      if (this.intercompanyInvoice.get('balanceAmt')?.value != 0) {
        this.showErrorFieldDialog(
          'K-Raheja ERP',
          "The amounts in all columns do not match the 'ac amount' .",
          'error'
        );
      } else {
        this.showErroPopup();
      }
    }
  }

  onClickBack() {
    this.intercompanyInvoice.reset();
    const array = this.intercompanyInvoice.get('dynamicArray') as FormArray;

    array.clear();
    this.init();
    this.config.isTableMaximized = false;
    this.commonService.disableAllControls(this.intercompanyInvoice, false);

    this.keysStartingWithTotal = [];
    this.intercompanyInvoice.get('companyName')?.disable();
    this.intercompanyInvoice.get('projectCodeName')?.disable();
    this.intercompanyInvoice.get('totalAcAmt')?.disable();
    this.intercompanyInvoice.get('balanceAmt')?.disable();
  }

  /////////////////////////////////////////////
  // error handling
  /////////////////////////////////////////////
  showErroPopup() {
    this.markFormGroupAndArrayAsTouched(this.intercompanyInvoice);
    // Check if any form control is invalid
    if (this.intercompanyInvoice.errors) {
      this.toastr.error('Invalid form details.');
    } else {
      if (this.intercompanyInvoice.invalid) {
        this.toastr.error('Please fill in all required fields.');
      }
    }
  }

  markFormGroupAndArrayAsTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach((control: any) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupAndArrayAsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  addInvoiceNumberValidationDynamicaly(state: boolean) {
    // Get the invoiceType control
    const invoiceTypeControl: AbstractControl | any =
      this.intercompanyInvoice.get('groupInvoiceNumber');
    const invoiceDate: AbstractControl | any =
      this.intercompanyInvoice.get('billDate');
    const invoiceDateFrom: AbstractControl | any =
      this.intercompanyInvoice.get('billFromDate');
    const invoiceDateTO: AbstractControl | any =
      this.intercompanyInvoice.get('billToDate');

    // Conditionally set or remove the "required" validation
    if (state) {
      invoiceTypeControl.setValidators(Validators.required);
      invoiceDate.setValidators(null);
      invoiceDateFrom.setValidators(null);
      invoiceDateTO.setValidators(null);
    } else {
      invoiceTypeControl.clearValidators();
      invoiceDate.setValidators(Validators.required);
      invoiceDateFrom.setValidators(Validators.required);
      invoiceDateTO.setValidators(Validators.required);
    }

    // Update the value and validity of the control
    invoiceTypeControl.updateValueAndValidity();
    invoiceDate.updateValueAndValidity();
    invoiceDateFrom.updateValueAndValidity();
    invoiceDateTO.updateValueAndValidity();
  }

  // fetch on click add data for group invoice creation
  getIntercompanyinvoiceDetails() {
    // this.initialMode = true;
    let payload = {
      companyCode: this.commonService.convertArryaToString(
        this.intercompanyInvoice.get('companyCode')?.value
      ),
      projectCode: this.commonService.convertArryaToString(
        this.intercompanyInvoice.get('projectCode')?.value
      ),
      transactionDate: moment(
        this.intercompanyInvoice.get('billDate')?.value
      ).format('DD/MM/YYYY'), // .format('DD/MM/YYYY')
      transactionFromDate: moment(
        this.intercompanyInvoice.get('billFromDate')?.value
      ).format('DD/MM/YYYY'),
      transactionToDate: moment(
        this.intercompanyInvoice.get('billToDate')?.value
      ).format('DD/MM/YYYY'),
    };

    this.intercompanyInvoice.patchValue({
      groupInvoiceNumber: '',
    });

    var dynamicArray = this.intercompanyInvoice.get(
      'dynamicArray'
    ) as FormArray;
    this.config.isLoading = true;
    this.http
      .request('post', api_url.createIntercompanyInvoice, payload, null)
      .subscribe({
        next: (res: any) => {
          this.config.isLoading = false;
          if (res.result == 'failed') {
            this.toastr.error(res.message);
          } else {
            this.responseData = res;

            if (res.interCompanyData.length != 0) {
              res.interCompanyData.map((item: any) => {
                var dynamicFormGroup = this.fb.group({});
                dynamicFormGroup.addControl(
                  'acAmount',
                  this.fb.control({
                    value: Math.round(item.acAmount),
                    disabled: true,
                  })
                );
                dynamicFormGroup.addControl(
                  'acMinType',
                  this.fb.control({ value: item.acMinType, disabled: true })
                );
                dynamicFormGroup.addControl(
                  'acmajor',
                  this.fb.control({ value: item.acmajor, disabled: true })
                );
                dynamicFormGroup.addControl(
                  'acminor',
                  this.fb.control({ value: item.acminor, disabled: true })
                );
                dynamicFormGroup.addControl(
                  'majorName',
                  this.fb.control({ value: item.majorName, disabled: true })
                );
                dynamicFormGroup.addControl(
                  'minorName',
                  this.fb.control({ value: item.minorName, disabled: true })
                );
                dynamicFormGroup.addControl(
                  'rowDiffrence',
                  this.fb.control({ value: 0, disabled: true })
                );
                Object.entries(item.localCompanyData).forEach(
                  ([key, value]) => {
                    const val: any = value;
                    dynamicFormGroup.addControl(
                      key,
                      this.fb.control(Math.round(val))
                    );
                    this.intercompanyInvoice.addControl(
                      'total_' + key,
                      this.fb.control({ value: 0, disabled: true })
                    );
                  }
                );
                // Push the dynamicFormGroup into the dynamicArray FormArray
                dynamicArray.push(dynamicFormGroup);
              });

              dynamicArray.controls.map((item: any) => {
                Object.keys(item.controls).map((key) => {
                  const excludedFields = [
                    'acAmount',
                    'rowDiffrence',
                    'acMinType',
                    'acmajor',
                    'acminor',
                    'minorName',
                    'majorName',
                  ];

                  if (!excludedFields.includes(key))
                    this.interInvoiceBreakupCalculation(item, key);
                });
              });

              this.keysStartingWithTotal = Object.keys(
                this.intercompanyInvoice.getRawValue()
              ).filter((key) => key.startsWith('total_'));

              this.intercompanyInvoice.get('groupInvoiceNumber')?.disable();
              this.intercompanyInvoice.get('companyCode')?.disable();
              this.intercompanyInvoice.get('projectCode')?.disable();
              this.intercompanyInvoice.get('billDate')?.disable();
              this.intercompanyInvoice.get('billFromDate')?.disable();
              this.intercompanyInvoice.get('billToDate')?.disable();

              this.commonService.enableDisableButtonsByIds(
                [
                  'add',
                  'retrieve',
                  'accPost',
                  'delete',
                  'address',
                  'list',
                  'print',
                ],
                this.buttonsList,
                true
              );
              this.commonService.enableDisableButtonsByIds(
                ['save', 'back', 'exit'],
                this.buttonsList,
                false
              );
              this.updateDetailsOfcalculation();
            } else {
              this.showErrorFieldDialog(
                'K-Raheja ERP',
                'Intercompany data not found. Please select another date.',
                'error'
              );
            }
          }
        },
        error: () => {
          this.config.isLoading = false;
        },
      });
  }

  // inter compnay details sum of total manage
  updateDetailsOfcalculation() {
    const dynamicArray = this.intercompanyInvoice.get(
      'dynamicArray'
    ) as FormArray;
    const excludedFields = [
      'acAmount',
      'rowDiffrence',
      'acMinType',
      'acmajor',
      'acminor',
      'minorName',
      'majorName',
    ];

    dynamicArray.controls.map((item: any, index: any) => {
      var randomKey = '';

      Object.keys(item.controls).map((key) => {
        // Find keys not in excludedFields
        const keysNotExcluded = Object.keys(item.controls).filter(
          (k) => !excludedFields.includes(k)
        );
        // Randomly choose one key from the keysNotExcluded array
        randomKey =
          keysNotExcluded[Math.floor(Math.random() * keysNotExcluded.length)];
      });

      if (item.get('rowDiffrence')?.value != 0) {
        const updaterowValue =
          Number(item.get(randomKey)?.value) +
          Number(item.get('rowDiffrence')?.value);
        item.get(randomKey).setValue(updaterowValue);
      }
      dynamicArray.controls.map((item: any) => {
        Object.keys(item.controls).map((key) => {
          if (!excludedFields.includes(key))
            this.interInvoiceBreakupCalculation(item, key);
        });
      });
    });
  }

  // access the key only
  getKeys(obj: any): string[] {
    const InitialValue = [
      'acAmount',
      'acMinType',
      'acmajor',
      'acminor',
      'minorName',
      'majorName',
    ];
    if (obj) {
      let newArray = Object.keys(obj).filter(
        (item) => !InitialValue.includes(item)
      );
      return newArray;
    } else {
      return [];
    }
  }

  //scroll table accordingly
  syncTables(event: any): void {
    const container = event.target;
    const table1 = document.getElementById('table1') as HTMLElement;
    const table2 = document.getElementById('table2') as HTMLElement;
    table1.scrollTop = container.scrollTop;
    table2.scrollTop = container.scrollTop;
  }

  // calculate the table
  interInvoiceBreakupCalculation(
    item: any,
    fieldName: string,
    input?: HTMLInputElement
  ) {
    if (!item.get(fieldName)?.value) {
      item.get(fieldName)?.setValue(0);
    }

    // Scroll the table to bring the input into view
    if (input) {
      const targetScrollPosition = input.offsetLeft - 100; // Adjust the offset as needed
      this.tableContainer.nativeElement.scrollLeft = 0;
    }

    const excludedFields = [
      'acAmount',
      'rowDiffrence',
      'acMinType',
      'acmajor',
      'acminor',
      'minorName',
      'majorName',
    ];
    const dynamicControls = Object.keys(item.controls).filter(
      (key) => key !== 'total' && !excludedFields.includes(key)
    );

    const acAmount = item.get('acAmount')?.value;
    const sumOfDynamicControls = dynamicControls.reduce((sum, controlKey) => {
      item.get(controlKey).setErrors(null);
      const controlValue = item.get(controlKey).value;
      return sum + Number(controlValue);
    }, 0);
    const diffrenceAmt =
      Number(acAmount.toFixed(2)) - Number(sumOfDynamicControls.toFixed(2));
    item.get('rowDiffrence').setValue(Math.round(diffrenceAmt));

    if (diffrenceAmt != 0) {
      item.get(fieldName).setErrors({ invalidSum: true });
    } else {
      item.get(fieldName).setErrors(null);
    }
    dynamicControls.map((item) => {
      this.intercompanyInvoice
        .get('total_' + item)
        ?.setValue(this.calculateTotalAmmount(item));
      this.intercompanyInvoice.get('total_' + item)?.disable();
    });
    this.intercompanyInvoice
      .get('totalAcAmt')
      ?.setValue(this.calculateTotalAmmount('acAmount'));
    this.intercompanyInvoice
      .get('balanceAmt')
      ?.setValue(this.calculateTotalAmmount('rowDiffrence'));
  }

  calculateTotalAmmount(fieldName: string): any {
    const formArray = this.intercompanyInvoice.get('dynamicArray') as FormArray;

    let total = 0;
    formArray.controls.forEach((control) => {
      let amount = control.get(fieldName)?.value;
      amount ? amount : (amount = 0);
      if (!isNaN(amount)) {
        total += parseFloat(amount);
      }
    });

    return total.toFixed(2);
  }

  // save the data
  saveIntercompanyInvoice() {
    const convertedData = this.transformData(
      this.intercompanyInvoice.getRawValue()
    );

    console.log('Payload-->', convertedData);
    this.config.isLoading = true;

    this.http
      .request(
        'post',
        api_url.createInterCompanyGroupInvocie,
        convertedData,
        null
      )
      .subscribe({
        next: (res: any) => {
          this.config.isLoading = false;

          if (res.result == 'success') {
            this.onClickBack();
            // this.toastr.success(res.message)

            if (this.config.isUpdate) {
              this.showErrorFieldDialog(
                'K-Raheja ERP',
                'Invoice updated sucessfully for group Invoice No :' +
                  res.groupInvoiceNo,
                'info'
              );
            } else {
              this.showErrorFieldDialog(
                'K-Raheja ERP',
                'Invoice created sucessfully.Group Invoice No :' +
                  res.groupInvoiceNo,
                'info'
              );
            }
          } else {
            this.toastr.error(res.message);
          }
        },
        error: () => {
          this.config.isLoading = false;
        },
      });
  }

  postAccountIntercompanyInvoice() {
    this.config.isLoading = true;

    let parms = {
      groupInvoiceNum: this.commonService.convertArryaToString(
        this.intercompanyInvoice.getRawValue().groupInvoiceNumber
      ),
    };

    this.http
      .request('post', api_url.accountPostingIntercompanyInvoice, null, parms)
      .subscribe({
        next: (res: any) => {
          this.config.isLoading = false;
          if (res.result == 'success') {
            this.onClickBack();
            // this.toastr.success(res.message)

            this.showErrorFieldDialog(
              'K-Raheja ERP',
              'Account posted sucessfully.',
              'info'
            );
          } else {
            this.toastr.error(res.message);
          }
        },
        error: () => {
          this.config.isLoading = false;
        },
      });
  }

  transformData(inputData: any): any {
    const transformedData = {
      companyCode: this.commonService.convertArryaToString(
        inputData.companyCode
      ),
      projectCode: this.commonService.convertArryaToString(
        inputData.projectCode
      ),
      transactionDate: moment(inputData.billDate).format('DD/MM/YYYY'), // .format('DD/MM/YYYY')
      transactionFromDate: moment(inputData.billFromDate).format('DD/MM/YYYY'),
      transactionToDate: moment(inputData.billToDate).format('DD/MM/YYYY'),
      // billDate: moment(inputData.billDate).format('YYYY-MM-DD'), // .format('YYYY-MM-DD')
      // billFromDate: moment(inputData.billFromDate).format('YYYY-MM-DD'),
      // billToDate: moment(inputData.billToDate).format('YYYY-MM-DD'),
      remarks: inputData.remark,
      groupInvoiceNumber: inputData.groupInvoiceNumber
        ? this.commonService.convertArryaToString(inputData.groupInvoiceNumber)
        : '',
      interCompanyData: inputData.dynamicArray.map((item: any) => {
        const localCompanyData: any = {};
        // Dynamically populate localCompanyData based on dynamicArray properties
        const excludedFields = [
          'acAmount',
          'rowDiffrence',
          'acMinType',
          'acmajor',
          'acminor',
          'minorName',
          'majorName',
        ];
        Object.keys(item).forEach((key) => {
          if (!excludedFields.includes(key)) {
            localCompanyData[key] = item[key];
          }
        });

        return {
          acmajor: item.acmajor,
          majorName: item.majorName,
          acminor: item.acminor,
          minorName: item.minorName,
          acMinType: item.acMinType,
          acAmount: item.acAmount,
          localCompanyData: localCompanyData,
        };
      }),
    };

    return transformedData;
  }

  retrivewIntercompanyInvoice() {
    if (this.intercompanyInvoice.valid) {
      this.initialMode = true;

      let payload = {
        companyCode: this.commonService.convertArryaToString(
          this.intercompanyInvoice.get('companyCode')?.value
        ),
        projectCode: this.commonService.convertArryaToString(
          this.intercompanyInvoice.get('projectCode')?.value
        ),
        invoiceNumber: this.commonService.convertArryaToString(
          this.intercompanyInvoice.get('groupInvoiceNumber')?.value
        ),
      };
      var dynamicArray = this.intercompanyInvoice.get(
        'dynamicArray'
      ) as FormArray;
      this.config.isLoading = true;
      this.http
        .request('post', api_url.getIntercompanyInvoice, payload, null)
        .subscribe({
          next: (res: any) => {
            this.config.isLoading = false;
            this.config.isUpdate = true;

            if (res.result != 'success') {
              this.toastr.error(res.message);
            } else {
              this.responseData = res;
              res.interCompanyData.map((item: any) => {
                var dynamicFormGroup = this.fb.group({});
                dynamicFormGroup.addControl(
                  'acAmount',
                  this.fb.control({
                    value: Math.round(item.acAmount),
                    disabled: true,
                  })
                );
                dynamicFormGroup.addControl(
                  'acMinType',
                  this.fb.control({ value: item.acMinType, disabled: true })
                );
                dynamicFormGroup.addControl(
                  'acmajor',
                  this.fb.control({ value: item.acmajor, disabled: true })
                );
                dynamicFormGroup.addControl(
                  'acminor',
                  this.fb.control({ value: item.acminor, disabled: true })
                );
                dynamicFormGroup.addControl(
                  'majorName',
                  this.fb.control({ value: item.majorName, disabled: true })
                );
                dynamicFormGroup.addControl(
                  'minorName',
                  this.fb.control({ value: item.minorName, disabled: true })
                );
                dynamicFormGroup.addControl(
                  'rowDiffrence',
                  this.fb.control({ value: 0, disabled: true })
                );
                Object.entries(item.localCompanyData).forEach(
                  ([key, value]) => {
                    const val: any = value;
                    dynamicFormGroup.addControl(
                      key,
                      this.fb.control(Math.round(val))
                    );
                    dynamicFormGroup.addControl(key, this.fb.control(value));
                    this.intercompanyInvoice.addControl(
                      'total_' + key,
                      this.fb.control({ value: 0, disabled: true })
                    );
                  }
                );

                dynamicArray.push(dynamicFormGroup);
              });
              this.keysStartingWithTotal = Object.keys(
                this.intercompanyInvoice.getRawValue()
              ).filter((key) => key.startsWith('total_'));
              this.intercompanyInvoice.get('companyCode')?.disable();
              this.intercompanyInvoice.get('projectCode')?.disable();
              this.intercompanyInvoice.get('groupInvoiceNumber')?.disable();
              this.intercompanyInvoice.get('billDate')?.setValue(res.billDate);
              this.intercompanyInvoice
                .get('billFromDate')
                ?.setValue(res.billFromDate);
              this.intercompanyInvoice
                .get('billToDate')
                ?.setValue(res.billToDate);
              this.intercompanyInvoice.get('remark')?.setValue(res.remarks);
              this.intercompanyInvoice
                .get('companyCode')
                ?.setValue(res.companyCode);
              this.intercompanyInvoice
                .get('projectCode')
                ?.setValue(res.projectCode);

              this.intercompanyInvoice.get('groupInvoiceNumber')?.disable();
              this.intercompanyInvoice.get('companyCode')?.disable();
              this.intercompanyInvoice.get('projectCode')?.disable();
              this.intercompanyInvoice.get('billDate')?.disable();
              this.intercompanyInvoice.get('billFromDate')?.disable();
              this.intercompanyInvoice.get('billToDate')?.disable();

              dynamicArray.controls.map((item: any) => {
                Object.keys(item.controls).map((key) => {
                  this.interInvoiceBreakupCalculation(item, key);
                });
              });
              if (res.isPosted == 'Y') {
                this.isAccountPostedPopup()

              } else {
                this.commonService.enableDisableButtonsByIds(
                  ['save', 'back', 'exit', 'accPost', 'print'],
                  this.buttonsList,
                  false
                );
                this.commonService.enableDisableButtonsByIds(
                  ['add', 'retrieve'],
                  this.buttonsList,
                  true
                );
              }
              this.updateDetailsOfcalculation();
            }
          },
          error: (err: any) => {
            this.config.isLoading = false;
          },
        });
    } else {
      this.ShowErrorPopupMsg();
    }
  }

  isAccountPostedPopup() {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: 'K-Raheja ERP',
        message: 'Can not modify Group invoice. Group Invoice already posted.',
        template: '',
        type: 'info',
      },
    });
    dialogRef.afterOpened().subscribe(() => {});
    dialogRef.afterClosed().subscribe((result: any) => {

      this.commonService.enableDisableButtonsByIds(
        ['back', 'exit', 'print'],
        this.buttonsList,
        false
      );
      this.commonService.enableDisableButtonsByIds(
        ['add', 'retrieve', 'save', 'accPost'],
        this.buttonsList,
        true
      );

      this.commonService.disableAllControls(
        this.intercompanyInvoice,
        true
      );

      setTimeout(() => {
        var headerToHide = 'rowDiffrence';
        var rowHeader = document.getElementById(headerToHide);
        if (rowHeader) {
          rowHeader.style.display = 'none';
        }
      }, 0);

    });
  }

  // erro handling
  ShowErrorPopupMsg() {
    if (this.intercompanyInvoice.value.companyCode == '') {
      this.showErrorFieldDialog(
        'K-Raheja ERP',
        'Please enter company code.',
        'error'
      );
      this.setFocus('intercompany_coy');
    } else if (this.intercompanyInvoice.value.billDate == '') {
      this.showErrorFieldDialog(
        'K-Raheja ERP',
        'Please enter bill date.',
        'error'
      );
      this.setFocus('intercompany_invoice');
    } else if (this.intercompanyInvoice.value.billFromDate == '') {
      this.showErrorFieldDialog(
        'K-Raheja ERP',
        'Please enter tran from date.',
        'error'
      );
      this.setFocus('intercompany_tranfrom');
    } else if (this.intercompanyInvoice.value.billToDate == '') {
      this.showErrorFieldDialog(
        'K-Raheja ERP',
        'Please enter tran to date.',
        'error'
      );
      this.setFocus('intercompany_tranto');
    }
  }

  back() {}

  // setFocus to object on form
  setFocus(id: string) {
    // Method to set focus to object on form
    setTimeout(() => {
      this.renderer.selectRootElement(`#${id}`).focus();
    }, 100);
  }

  onLeaveCompany(val: String) {
    this.filter.getProject = "proj_company='" + val + "'";

    this.setHelpFilter();
  }

  setHelpFilter() {
    const company = this.commonService.convertArryaToString(
      this.intercompanyInvoice.getRawValue().companyCode
    );
    const project = this.commonService.convertArryaToString(
      this.intercompanyInvoice.getRawValue().projectCode
    );

    if (company) {
      this.filter.getGroupInvoiceNumber = "icbeh_coy='" + company + "'";
    }
    if (project) {
      this.filter.getGroupInvoiceNumber +=
        " and icbeh_projcode='" + project + "'";
    }

    console.log('fikltet', this.filter.getGroupInvoiceNumber);
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
    dialogRef.afterOpened().subscribe(() => {});
    dialogRef.afterClosed().subscribe((result: any) => {
      if (this.intercompanyInvoice.value.companyCode == '') {
        this.setFocus('intercompany_coy');
      } else if (this.intercompanyInvoice.value.billDate == '') {
        this.setFocus('intercompany_invoice');
      } else if (this.intercompanyInvoice.value.billFromDate == '') {
        this.setFocus('intercompany_tranfrom');
      } else if (this.intercompanyInvoice.value.billToDate == '') {
        this.setFocus('intercompany_tranto');
      }
      if (message.includes('The amounts in all columns do not match the')) {
        this.showFocusOnInputSumCal();
      }
    });
  }

  // if allocation calculations is mistmatch then show the erro msg
  showFocusOnInputSumCal() {
    const formArray = this.intercompanyInvoice.get('dynamicArray') as FormArray;
    formArray.controls.forEach((control: any, index) => {
      const inneerControl = control;
      Object.keys(inneerControl.controls).forEach((controlName) => {
        const currentControl = inneerControl.get(controlName);
        if (currentControl.hasError('invalidSum')) {
          const matchingElements: HTMLElement[] = [];
          const allElements = this.el.nativeElement.getElementsByTagName('*');
          for (const element of allElements) {
            if (element.id && element.id.includes('error-')) {
              const elementId = element.id.replace('error-', '');
              document.getElementById(elementId)?.focus();
            }
          }
        }
      });
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
    dialogRef.afterOpened().subscribe(() => {});
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (this.isBackClicked) {
          this.back();
        }
      }
    });
  }

  /////////////////////////////////
  // print report
  /////////////////////////////////

  printProcess() {
    let payload: any = {
      name: 'EN_RP_InterCompanyTaxInvoice.rpt',
      isPrint: false,
      seqId: 1,
      reportParameters: {
        formname: '',
        HeaderText1:
          this.config.invoiceType == 'O'
            ? 'Original for Recipient'
            : 'File Copy',
        strGroupInvoice:
          "'" +
          this.commonService.convertArryaToString(
            this.intercompanyInvoice.get('groupInvoiceNumber')?.value
          ) +
          "'",
      },
    };

    this.PrintReport(payload, true);
  }

  // print report from api
  PrintReport(payload: any, isPrint: boolean) {
    this._commonReport.getParameterizedReport(payload).subscribe({
      next: (res) => {
        if (res) {
          this.commonPdfReport(isPrint, res);
        }
      },
      error: (error) => {},
    });
  }

  // download the file
  commonPdfReport(print: Boolean, res: any) {
    let filename = this._commonReport.getReportName();
    this._service.exportReport(print, res, 'PDF', filename);
  }

  toggleTable() {
    this.config.isTableMaximized = !this.config.isTableMaximized;
  }

  // test code

  @ViewChild('tableContainer')
  tableContainer!: ElementRef;

  onInputFocus(input: HTMLInputElement): void {
    // Scroll the table to bring the input into view
    this.tableContainer.nativeElement.scrollLeft = input.offsetLeft - 100; // Adjust the offset as needed
  }
}
