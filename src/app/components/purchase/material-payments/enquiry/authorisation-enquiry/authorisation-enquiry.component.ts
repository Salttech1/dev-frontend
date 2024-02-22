import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DataEntryService } from 'src/app/services/purch/data-entry.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';

@Component({
  selector: 'app-authorisation-enquiry',
  templateUrl: './authorisation-enquiry.component.html',
  styleUrls: ['./authorisation-enquiry.component.css'],
})
export class AuthorisationEnquiryComponent implements OnInit {
  loaderToggle: boolean = false;
  party_condition = " par_partytype='S' and par_closedate='01-JAN-2050' ";
  auth_condition: any;
  requestAuthNo: any;
  requestSupplierCode: any;
  authEnquiryData: any[] = [];
  isDataRecieved: boolean = false;
  constructor(
    private toastr: ToasterapiService,
    private fb: FormBuilder,
    private dataEntryService: DataEntryService,
    private rendered: Renderer2,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    setTimeout(function () {
      document.getElementById('suppCode1243')?.focus();
    }, 100);

    this.authEnquiryForm.get('suppCode')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          let party = res[0][0];
          this.requestSupplierCode = party;
          this.auth_condition = `auth_authtype <> 'A' and auth_partycode ='${party}'`;
        }
      },
    });
  }

  authEnquiryForm: FormGroup = new FormGroup({
    suppCode: new FormControl('', Validators.required),
    authNos: new FormControl<string[] | string>(['']),
    formname: new FormControl<string>('ListofSuppliers.rpt'),
    authorisationEnquiryDetails: new FormArray([
      this.fb.group({
        billNo: new FormControl<string | null>(''),
        billDate: new FormControl<string | null>(''),
        qty: new FormControl<string | null>(''),
        netAmt: new FormControl<string | null>(''),
      }),
    ]),
  });

  initRows() {
    return this.fb.group({
      billNo: new FormControl<string | null>(''),
      billDate: new FormControl<string | null>(''),
      qty: new FormControl<string | null>(''),
      netAmt: new FormControl<string | null>(''),
    });
  }

  get authEnquiryFormArray() {
    return this.authEnquiryForm.get('authorisationEnquiryDetails') as FormArray;
  }

  setRequestParamValue() {
    this.requestAuthNo =
      this.authEnquiryForm.get('authNos')?.value &&
      this.authEnquiryForm.get('authNos')?.value[0] != ''
        ? `'${this.authEnquiryForm.get('authNos')?.value.join(`','`)}'`
        : '';
    this.requestSupplierCode = this.authEnquiryForm
      .get('suppCode')
      ?.value?.split('/')[0]
      .trim()
      .toUpperCase();

    console.log('AuthNos: ', this.requestAuthNo);
  }

  fetchAuthorisationEnquiryDetails() {
    if (this.authEnquiryForm?.valid) {
      this.loaderToggle = true;
      this.requestAuthNo =
        this.authEnquiryForm.get('authNos')?.value &&
        this.authEnquiryForm.get('authNos')?.value[0] != ''
          ? `'${this.authEnquiryForm.get('authNos')?.value.join(`','`)}'`
          : '';
      this.dataEntryService
        .fetchAuthorisationEnquiry(this.requestSupplierCode, this.requestAuthNo)
        .subscribe({
          next: (res: any) => {
            this.loaderToggle = false;
            if (res.status) {
              this.authEnquiryForm.get('suppCode')?.disable();
              this.authEnquiryForm.get('authNos')?.disable();
              this.setAuthEnquiryDetails(res.data);

              this.el.nativeElement
                .querySelector('input[id="test_0"]')
                ?.focus();
              this.isDataRecieved = true;
              console.log(
                'Testing ELement: ',
                document.querySelector('#test_0')
              );
            } else {
              this.toastr.showError(res.message);
              this.back();
            }
          },
          error: () => {},
          complete: () => {},
        });
    } else {
      this.authEnquiryForm?.markAllAsTouched();
      this.rendered.selectRootElement('#suppCode1243').focus();
    }
  }

  back() {
    this.isDataRecieved = false;
    this.authEnquiryForm.reset();
    this.authEnquiryFormArray.clear();
    this.authEnquiryForm.get('suppCode')?.enable();
    this.authEnquiryForm.get('authNos')?.enable();
    this.authEnquiryFormArray.push(this.initRows());
    setTimeout(function () {
      document.getElementById('suppCode1243')?.focus();
    }, 100);
  }

  setAuthEnquiryDetails(data: any) {
    for (var i = 0; i < data.length; i++) {
      data?.length - 1 == i
        ? ''
        : this.authEnquiryFormArray.push(this.initRows());
      this.authEnquiryForm.get('authorisationEnquiryDetails')?.patchValue(data);
    }
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

}
