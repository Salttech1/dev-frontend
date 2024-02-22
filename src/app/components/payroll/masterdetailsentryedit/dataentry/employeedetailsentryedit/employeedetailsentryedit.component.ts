import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Logger, row } from '@syncfusion/ej2-angular-grids';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AddressComponent } from 'src/app/components/common/address/address.component';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { PaydataentryService } from 'src/app/services/payroll/dataentry/paydataentry.service';
import * as commonconstant from '../../../../../../constants/commonconstant';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-employeedetailsentryedit',
  templateUrl: './employeedetailsentryedit.component.html',
  styleUrls: ['./employeedetailsentryedit.component.css'],
  providers: [
    AddressComponent,
  ],
})
export class EmployeedetailsentryeditComponent implements OnInit {
  datePipe = new DatePipe('en-US');
  loaderToggle: boolean = false;
  disabledFlagAddRow: boolean = false;
  disabledFlagBack: boolean = true;
  disabledFlagAdd: boolean = false;
  disabledFlagRetrieve: boolean = false;
  disabledFlagSave: boolean = true;
  employeeDetailsContainer: boolean = false;
  navTab = 'personal';
  mailaddressFetchData: any;
  resaddressFetchData: any;
  receivedmailAddressData!: FormGroup;
  receivedresAddressData!: FormGroup;
  bloodGroupList!: any;
  regionList!:any;
  initialMode: Boolean = false;
  deleteDisabled: Boolean = true;
  tranMode: String = '';
  empcoy:String ='';
  bank:String='';
  cspkCoy:String='';
  titles:String= "ENT_CLASS = 'TITLE' AND ENT_ID <> '00000' AND ENT_CHAR3 = 'PAYRL     '";
  isDeleteClicked: boolean = false;
  isBackClicked: boolean = false;
  imgurl!: string;
  isHidden: Boolean = false;
  empjobstatus: any;
  emppersonalrowcount: any;
  empjobinforowcount: any;
  empResonseBean:any;
  empjobResonseBean:any;
  eperBackward: Boolean = true;
  eperForward: Boolean = true;
  ejinBackward: Boolean = false;
  ejinForward: Boolean = false;
  employeeDetailPayload: any;
  enableAllYN : String = 'Y';
  
  employeeSelectionsForm: FormGroup = new FormGroup({
    eperEmpcode: new FormControl<String[]>([], Validators.required),
  }); // Form Group for Selection input fields

  @ViewChild(AddressComponent) addressComponent!: AddressComponent;
  @ViewChild(AddressComponent) addressPerComponent!: AddressComponent;

  @ViewChild("mailadd") mailadd: ElementRef | undefined;
  @ViewChild("resadd") resadd: ElementRef | undefined;


  employeeForm = new FormGroup({
    // Form Group for Data Entry / Edit
    empcode: new FormControl<String[]>([]), //, [Validators.required]
    title: new FormControl<String>('', [Validators.maxLength(10),Validators.required]),
    fullname: new FormControl<String>('', [
      Validators.maxLength(50),
      Validators.required,
    ]),
    gender: new FormControl<String>('', [
      Validators.maxLength(1),
      Validators.required,
    ]),
    birthdate: new FormControl('',[Validators.required,BirthdateValidation()]), //,Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)
    maritalstat: new FormControl<String>('', [
      Validators.maxLength(1),
      Validators.required,
    ]),
    weddingdate: new FormControl(),
    noofchildren: new FormControl<any>(0,[Validators.max(12), Validators.min(0)]),
    height: new FormControl<any>(0,[Validators.max(215), Validators.min(0)]),
    weight: new FormControl<any>(0,[Validators.max(300), Validators.min(0)]),
    bloodgrp: new FormControl<String>('', [Validators.maxLength(10)]),
    religion: new FormControl<String[]>([], []),
    nationality: new FormControl<String[]>([], []),
    mothertongue: new FormControl<String[]>([], []),
    hobbies: new FormControl<String>('', [Validators.maxLength(200)]),
    panno: new FormControl<String>('', [
      Validators.maxLength(10),
      Validators.required,
      Validators.pattern('([A-Z]{5}[0-9]{4}[A-Z]{1}|PANAPPLIED|NOTAPPLIED)'),
    ]),
    photopath: new FormControl<String>('', [Validators.maxLength(50)]),
    epereffectivefrom: new FormControl('',Validators.required),
    epereffectiveupto: new FormControl('',Validators.required),
    remark: new FormControl<String>('', [Validators.maxLength(50)]),
    module: new FormControl<String>('', [
      Validators.maxLength(10),
    ]),
    aadhaarno: new FormControl<String>('', [Validators.maxLength(12),Validators.pattern('^[2-9]{1}[0-9]{11}$')]),
    handicapyn: new FormControl<String>('', [Validators.maxLength(1)]),
    pfuan: new FormControl<String>('', [Validators.maxLength(12),Validators.pattern('^[0-9]{12}$')]), //^[0-9]{12}$
    // pmtacnum: new FormControl<any>('', [
    //   Validators.required,
    //   Validators.maxLength(10),
    //   Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}'), //Validators.pattern('[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}')
    // ]),
    salpackdetailtype:new FormControl<String>('', [
      Validators.maxLength(1),
      Validators.required,
    ]),
    mthGross: new FormControl<any>(0),
    ctc: new FormControl<any>(0),
   
    empjobinfoDetailsBreakUp: new FormArray([this.empjobinfoItemDetailInitRows()
    ]),
    empeducationDetailsBreakUp: new FormArray([
      this.empeducationItemDetailInitRows(),
    ]),
    empleaveinfoDetailsBreakUp: new FormArray([
      this.empleaveinfoItemDetailInitRows(),
    ]),
    empschemeinfoDetailsBreakUp: new FormArray([
      this.empschemeinfoItemDetailInitRows(),
    ]),
    empfamilyDetailsBreakUp: new FormArray([
      this.empfamilyItemDetailInitRows(),
    ]),
    empexperienceDetailsBreakUp: new FormArray([
      this.empexperienceItemDetailInitRows(),
    ]),
    empreferenceDetailsBreakUp: new FormArray([
      this.empreferenceItemDetailInitRows(),
    ]),
    empassetinfoDetailsBreakUp: new FormArray([
      this.empassetinfoItemDetailInitRows(),
    ]),
    empsalarypackageDetailsBreakUp: new FormArray([
      this.empsalarypackageItemDetailInitRows(),
    ]),
    empsalarypackageDDetailsBreakUp: new FormArray([
      this.empsalarypackageDItemDetailInitRows(),
    ]),
  });

  constructor(
    public router: Router,
    private paydataentryService: PaydataentryService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private actionService: ActionservicesService,
    private commonService:CommonService
  ) {}

  ngOnInit(): void {
    this.GetBloodGroupList();
    this.getRegionList();
    this.focusById('eperEmpcode');
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['company']?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          this.empcoy = res[0][0];
          this.bank = `epba_company  = '${this.empcoy}'`
          this.cspkCoy = `cspk_coy  = '${this.empcoy}'`
        }
      },
    });
  }

  GetBloodGroupList() {
    this.paydataentryService.getBloodgroupList().subscribe({
      next: (res: any) => {
        if (res?.status) {
          this.bloodGroupList = res?.data;
          console.log(res);
        }
      },
    });
  }

  getRegionList() {
    this.paydataentryService.getRegionList().subscribe({
      next: (res: any) => {
        if (res?.status) {
          this.regionList = res?.data;
          console.log(res);
        }
      },
    });
  }

  add() {
    this.tranMode = "A"
    this.employeeDetailsContainer = true;
    this.setActionButtonsFlag(true, true, false, false, false);
    this.imgurl = '/assets/images/employee.png';
    this.employeeSelectionsForm.patchValue({eperEmpcode : ''});
    this.employeeSelectionsForm.disable();
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['probmonths'].setValue(6)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['dutyhours'].setValue(0)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['noticedays'].setValue(60)
    this.employeeForm.controls?.salpackdetailtype.setValue("C")
     this.employeeForm.patchValue({
            height: 0,
            weight: 0,
          });
    setTimeout(() => {
    this.focusById('titleid');
  }, 10);
  }

  onblurJoindate(joindt: string){
    if (this.tranMode == 'A'){
      if (joindt == "" || joindt == null){
        console.log("null","joindt is null");
      } else {
        if (this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['joindate'].invalid){
          console.log(joindt,"joindt is invalid");
        } else {
          // this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['jobfrom'].setValue(joindt);
          this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['jobfrom'].setValue(moment(joindt,'DD/MM/YYYY').format('YYYY-MM-DD'));
          this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['effectivefrom'].setValue(moment(joindt,'DD/MM/YYYY').format('YYYY-MM-DD'));
          this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['origjoindate'].setValue(moment(joindt,'DD/MM/YYYY').format('YYYY-MM-DD'));
          let probmth = Number(this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['probmonths'].value)
          this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['probationupto'].setValue(moment(joindt,'DD/MM/YYYY').add(probmth, 'months'));
          this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['effectiveupto'].setValue(moment(commonconstant.coyCloseDate,'DD/MM/YYYY').format('YYYY-MM-DD'));
          this.employeeForm.patchValue({
            epereffectivefrom: moment(joindt,'DD/MM/YYYY').format('YYYY-MM-DD'),
            epereffectiveupto: moment(commonconstant.coyCloseDate,'DD/MM/YYYY').format('YYYY-MM-DD'),
          });
          this.setdateInSalaryPackage(joindt);
          this.setdateInScheme(joindt);
          this.insertLeaveDetailsOnAdd();
        }
      }
    }
  }

  onblurAppointedon(appointon: string){
    if (this.tranMode == 'A'){
      if (appointon == "" || appointon == null){
        console.log("null","appointon is null");
      } else {
        if (this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['appointedon'].invalid){
          console.log(appointon,"joindt is invalid");
        } else {
          this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['jobfrom'].setValue(moment(appointon,'DD/MM/YYYY').format('YYYY-MM-DD'));
          this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['effectivefrom'].setValue(moment(appointon,'DD/MM/YYYY').format('YYYY-MM-DD'));
          this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['origjoindate'].setValue(moment(appointon,'DD/MM/YYYY').format('YYYY-MM-DD'));
          this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['joindate'].setValue(moment(appointon,'DD/MM/YYYY').format('YYYY-MM-DD'));
          let probmth = Number(this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['probmonths'].value)
          this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['probationupto'].setValue(moment(appointon,'DD/MM/YYYY').add(probmth, 'months'));
          this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['jobupto'].setValue(moment(commonconstant.coyCloseDate,'DD/MM/YYYY').format('YYYY-MM-DD'));
          this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['effectiveupto'].setValue(moment(commonconstant.coyCloseDate,'DD/MM/YYYY').format('YYYY-MM-DD'));
          this.employeeForm.patchValue({
            epereffectivefrom: moment(appointon,'DD/MM/YYYY').format('YYYY-MM-DD'),
            epereffectiveupto: moment(commonconstant.coyCloseDate,'DD/MM/YYYY').format('YYYY-MM-DD'),
          });

          this.setdateInSalaryPackage(appointon);
          this.setdateInScheme(appointon);
          this.insertLeaveDetailsOnAdd();
        }
      }
    }
  }


  onblurProbMonths(probmth: string){
    if (this.tranMode == 'A'){
      if (probmth==""|| probmth==null){

      } else {
        if (this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['probmonths'].invalid){

        } else {
          this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['probationupto'].setValue(moment(this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['joindate'].value).add(Number(probmth), 'months'));
      }
    }
    }
  }

  onblurEperTitle(epertitle:string){
    if (this.tranMode == 'A'){
      epertitle.trim() =='MS' || epertitle.trim()=='MRS' ? this.employeeForm.patchValue({gender: 'F'}) : this.employeeForm.patchValue({gender: 'M'})
      epertitle.trim()=='MRS' ? this.employeeForm.patchValue({maritalstat: 'M'}) : this.employeeForm.patchValue({maritalstat: 'S'})
      this.insertFamilyDetailsOnAdd(epertitle.trim());
    }
  }

  insertFamilyDetailsOnAdd(epertitle:string){
    if (this.tranMode == 'A'){
      if (epertitle.trim()=='MRS'){
        this.employeeForm.controls?.['empfamilyDetailsBreakUp'].controls[0].patchValue({relation: 'P'});
      } else {
        this.employeeForm.controls?.['empfamilyDetailsBreakUp'].controls[0].patchValue({relation: 'F'});
      }
    }
  }

  onblurEjinCompany(){
    if (this.tranMode == 'A'){
      //setTimeout is used since if user type fast then in API "F" use to go instead of "FEHO" and no rows were set in earn and deduction and scheme grid
      setTimeout(() => {
      if (this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['company']?.value?.length!=0){
          let ejincoy : any = this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['company']?.value;
        // for Earn salary package
        this.paydataentryService.fetchCoySalaryPackageDetails(ejincoy[0][0].trim()).subscribe({
          next: (res: any) => {
            if (res?.status){
              console.log(res,"<-coysalarypackage");
              //Reset the table first then set details
              this.empsalarypackageItemBreakUpFormArr.clear();
              this.employeeForm.controls?.['empsalarypackageDetailsBreakUp'].reset();
              //set details here
              for (var i = 0; i < res.data?.length; i++) {
                res.data?.length - 1 == i
                  ? ''
                  : this.empsalarypackageItemBreakUpFormArr.push(
                      this.empsalarypackageItemDetailInitRows()
                    );
                this.employeeForm.controls?.empsalarypackageDetailsBreakUp.patchValue(
                  res.data
                );
              }
            }
            console.log("RES",res);
          },
          error: (error) => {
            this.toastr.error('Error in getting Company Salary Details');
          },
        });
        // for deduction salary package
        this.paydataentryService.fetchCompanySalDedPackage(ejincoy[0][0].trim()).subscribe({
          next: (res: any) => {
            if (res?.status){
              console.log(res,"<-coyDedsalarypackage");
              //Reset the table first then set details
              this.empsalarypackageDItemBreakUpFormArr.clear();
              this.employeeForm.controls?.['empsalarypackageDDetailsBreakUp'].reset();
              console.log("res.data?.length",res.data?.length);
              res.data?.length == 1 ? this.empsalarypackageDItemBreakUpFormArr.push(this.empsalarypackageDItemDetailInitRows()) : '';
              for (var i = 0; i < res.data?.length; i++) {
                res.data?.length - 1 == i
                  ? ''
                  : this.empsalarypackageDItemBreakUpFormArr.push(
                      this.empsalarypackageDItemDetailInitRows()
                    );
                this.employeeForm.controls?.empsalarypackageDDetailsBreakUp.patchValue(
                  res.data
                );
              }
            }
          },
          error: (error) => {
            this.toastr.error('Error in getting Company Salary Deduction Details');
          },
        });
        //for scheme
        let joinpaymonth : string;
        if (this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['joindate'].value == "" || this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['joindate'].value == null) {
          joinpaymonth = moment(new Date()).format('YYYYMM')
        }else{
          joinpaymonth = moment(this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['joindate'].value).format('YYYYMM')
        }
        console.log("joinpaymonth----->",joinpaymonth);
        
        this.paydataentryService.fetchCompanySchemeDetails(ejincoy[0][0].trim(),joinpaymonth).subscribe({
          next: (res: any) => {
            if (res?.status){
              //Reset the table first then set details
              this.empschemeinfoItemBreakUpFormArr.clear();
              this.employeeForm.controls?.['empschemeinfoDetailsBreakUp'].reset();
              //set details here
              for (var i = 0; i < res.data?.length; i++) {
                res.data?.length - 1 == i
                  ? ''
                  : this.empschemeinfoItemBreakUpFormArr.push(
                      this.empschemeinfoItemDetailInitRows()
                    );
                this.employeeForm.controls?.empschemeinfoDetailsBreakUp.patchValue(
                  res.data
                );
              }

              console.log("res api",res.data);
              
              console.log("form valyue",   this.employeeForm.controls?.empschemeinfoDetailsBreakUp);
              
            }
          },
          error: (error) => {
            this.toastr.error('Error in getting Company Scheme Details');
          },
        });

        //for Leave
        this.insertLeaveDetailsOnAdd()
      }

    }, 1000)
    }
  }

  setdateInSalaryPackage(Joindt: string){
    const formArray = this.employeeForm.get('empsalarypackageDetailsBreakUp') as FormArray;
    for (var i = 0; i < formArray.length; i++) {
      this.employeeForm.controls.empsalarypackageDetailsBreakUp.controls[i].controls['effectivefrom'].setValue(moment(Joindt,'DD/MM/YYYY').format('YYYY-MM-DD'))
      this.employeeForm.controls.empsalarypackageDetailsBreakUp.controls[i].controls['effectiveupto'].setValue(moment(commonconstant.coyCloseDate,'DD/MM/YYYY').format('YYYY-MM-DD'))
    }
    //for deduction rows
    const formArrayded = this.employeeForm.get('empsalarypackageDDetailsBreakUp') as FormArray;
    for (var i = 0; i < formArrayded.length; i++) {
      this.employeeForm.controls.empsalarypackageDDetailsBreakUp.controls[i].controls['effectivefrom'].setValue(moment(Joindt,'DD/MM/YYYY').format('YYYY-MM-DD'))
      this.employeeForm.controls.empsalarypackageDDetailsBreakUp.controls[i].controls['effectiveupto'].setValue(moment(commonconstant.coyCloseDate,'DD/MM/YYYY').format('YYYY-MM-DD'))
    }
  }

  setdateInScheme(Joindt: string){
    const formArray = this.employeeForm.get('empschemeinfoDetailsBreakUp') as FormArray;
    for (var i = 0; i < formArray.length; i++) {
      this.employeeForm.controls.empschemeinfoDetailsBreakUp.controls[i].controls['effectivefrom'].setValue(moment(Joindt,'DD/MM/YYYY').format('YYYY-MM-DD'))
      this.employeeForm.controls.empschemeinfoDetailsBreakUp.controls[i].controls['effectiveupto'].setValue(moment(commonconstant.coyCloseDate,'DD/MM/YYYY').format('YYYY-MM-DD'))
      this.employeeForm.controls.empschemeinfoDetailsBreakUp.controls[i].controls['entrydate'].setValue(moment(Joindt,'DD/MM/YYYY').format('YYYY-MM-DD'))
      this.employeeForm.controls.empschemeinfoDetailsBreakUp.controls[i].controls['schemeenddate'].setValue(moment(commonconstant.coyCloseDate,'DD/MM/YYYY').format('YYYY-MM-DD'))
    }
  }

  insertLeaveDetailsOnAdd(){
    if (this.tranMode == 'A'){
      if (this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['company']?.value?.length!=0){
        if (this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['emptype']?.value?.length!=0){
          if (this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['joindate']?.value?.length!=0){
            let ejincoy:any = this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['company']?.value;
            let joindate = moment(this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['joindate'].value).format('DD-MMM-YYYY')
            let emptype:any = this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['emptype']?.value;
            console.log('lvejincoy',ejincoy[0][0].trim());
            console.log('lvjoindate',joindate);
            console.log('lvemptype',emptype[0][0].trim());

            this.paydataentryService.fetchCompanyLeaveDetails(ejincoy[0][0].trim(), joindate, emptype[0][0].trim()).subscribe({
              next: (res: any) => {
                if (res?.status){
                  for (var i = 0; i < res.data?.length; i++) {
                    res.data?.length - 1 == i
                      ? ''
                      : this.empleaveinfoItemBreakUpFormArr.push(
                          this.empleaveinfoItemDetailInitRows()
                        );
                    this.employeeForm.controls?.empleaveinfoDetailsBreakUp.patchValue(
                      res.data
                    );
                  }
                  console.log("Lv res api",res.data);
                  console.log("Lv form valyue",   this.employeeForm.controls?.empleaveinfoDetailsBreakUp);
                }
                console.log("LeaveRES",res);
              },
              error: (error) => {
                this.toastr.error('Error in getting Leave Details');
              },
            });
          }
        }
      }
    }
  }

  retrieve() {
    console.log("mail",this.mailaddressFetchData);
    console.log("res",this.resaddressFetchData);
    this.actionService.getReterieveClickedFlagUpdatedValue(true);
    if (!(this.employeeSelectionsForm.get('eperEmpcode')?.value.length == 0)) {
      // this.toastr.error('Retrieve');
      this.loaderToggle = true;
      this.employeeSelectionsForm.disable();
      this.employeeDetailsContainer = true;

      let eperEmpcode = this.employeeSelectionsForm
        .get('eperEmpcode')
        ?.value[0][0].trim();
      this.paydataentryService.retrieveEmployeeDetails(eperEmpcode).subscribe({
        next: (res: any) => {
          if (res?.status) {
            console.log('Just After API',res)
            this.tranMode = 'R';
            this.initialMode = true;
            this.deleteDisabled = false;
            this.setActionButtonsFlag(true, true, false, false, false);
            this.emppersonalrowcount = res.data.emppersonalResponseBean.length -1
            this.bindEmppersonalInputValuesWithResponseBean(res,this.emppersonalrowcount);

            let photodata = res.data.empPhoto;
            this.imgurl = `data:image/png;base64,${photodata}`;

            this.retrieveEmpeducationDetails(res);

            this.empjobinforowcount = res.data.empjobinfoResponseBean.length -1
            this.retrieveEmpjobinfoDetails(res);
            this.retrieveEmpleaveinfoDetails(res);
            this.retrieveEmpschemeinfoDetails(res);
            this.retrieveEmpfamilyDetails(res);
            this.retrieveEmpexperienceDetails(res);
            this.retrieveEmpreferenceDetails(res);
            this.retrieveEmpassetinfoDetails(res);
            this.retrieveEmpsalarypackageDetails(res);
            this.retrieveEmpsalarypackageDDetails(res);
            this.employeeForm.patchValue({salpackdetailtype : 'C'});

            this.employeeForm.patchValue({mthGross : res.data.mthlygross[0]});
            this.employeeForm.patchValue({ctc : res.data.ctc[0]});

            console.log('res.data', res.data);
            this.mailaddressFetchData = res.data.addressmail;
            this.resaddressFetchData = res.data.addressres;
            this.loaderToggle = false;
            if(this.empjobstatus == 'T'){
              this.employeeForm.disable();
              this.receivedmailAddressData.disable();
              this.receivedresAddressData.disable();
            } else {
              this.employeeForm.enable();
              this.receivedmailAddressData.enable();
              this.receivedresAddressData.enable();
            }
            debugger
            if (res.data.firstSalaryYN == 'Y'){
              this.enableAllYN = 'Y';
              this.enableDisableFieldForModification('empsalarypackageDetailsBreakUp')
              this.enableDisableFieldForModification('empsalarypackageDDetailsBreakUp')
            } else {
              this.enableAllYN = 'N';
              this.enableDisableFieldForModification('empsalarypackageDetailsBreakUp')
              this.enableDisableFieldForModification('empsalarypackageDDetailsBreakUp')
            }
            //set retrieve employee date in empResonseBean
            this.empResonseBean = res;

            if (res.data.emppersonalResponseBean.length - 1 > 0){
              this.eperBackward = false;
              this.eperForward = true;
            } else {
              this.eperBackward = true;
              this.eperForward = true;
            }
            this.empjobinforowcount = res.data.empjobinfoResponseBean?.length -1
            if (this.empjobinforowcount > 0){
              this.ejinBackward = false;
              this.ejinForward = true;
            } else {
              this.ejinBackward = true;
              this.ejinForward = true;
            }
          } else {
            this.loaderToggle = false;
            this.toastr.error(res?.message);
            this.back();
          }
        },
        error: (error) => {
          this.loaderToggle = false;
          this.toastr. error(error.error.errors[0].defaultMessage);
          this.toastr.error('Error in getting Employee Details');
          
        },
      });
    } else {
      this.toastr.error('Please Select Employee');
    }
  }

  back() {
    // clear all values
    this.resetFormArray();
    this.setActionButtonsFlag(false, false, true, true, true);
    this.mailaddressFetchData = undefined;
    this.resaddressFetchData = undefined;
    this.addressComponent.resetAddress();
    console.log("Inback mail",this.mailaddressFetchData);
    console.log("Inback res",this.resaddressFetchData);

    //if previous retrieve is terminated employee than form was diable so following is done
    this.employeeForm.enable();

    this.employeeDetailsContainer = false;
    this.employeeSelectionsForm.enable();
    this.focusById('eperEmpcode');
  }

  resetFormArray() {
    this.empeducationItemBreakUpFormArr.clear();
    this.employeeForm.controls?.['empeducationDetailsBreakUp'].reset();
    this.empeducationItemBreakUpFormArr.push(
      this.empeducationItemDetailInitRows()
    );
    this.empleaveinfoItemBreakUpFormArr.clear();
    this.employeeForm.controls?.['empleaveinfoDetailsBreakUp'].reset();
    this.empleaveinfoItemBreakUpFormArr.push(
      this.empleaveinfoItemDetailInitRows()
    );
    this.empschemeinfoItemBreakUpFormArr.clear();
    this.employeeForm.controls?.['empschemeinfoDetailsBreakUp'].reset();
    this.empschemeinfoItemBreakUpFormArr.push(
      this.empschemeinfoItemDetailInitRows()
    );
    this.empfamilyItemBreakUpFormArr.clear();
    this.employeeForm.controls?.['empfamilyDetailsBreakUp'].reset();
    this.empfamilyItemBreakUpFormArr.push(this.empfamilyItemDetailInitRows());
    this.empexperienceItemBreakUpFormArr.clear();
    this.employeeForm.controls?.['empexperienceDetailsBreakUp'].reset();
    this.empexperienceItemBreakUpFormArr.push(
      this.empexperienceItemDetailInitRows()
    );
    this.empreferenceItemBreakUpFormArr.clear();
    this.employeeForm.controls?.['empreferenceDetailsBreakUp'].reset();
    this.empreferenceItemBreakUpFormArr.push(
      this.empreferenceItemDetailInitRows()
    );
    this.empassetinfoItemBreakUpFormArr.clear();
    this.employeeForm.controls?.['empassetinfoDetailsBreakUp'].reset();
    this.empassetinfoItemBreakUpFormArr.push(
      this.empassetinfoItemDetailInitRows()
    );
    this.empsalarypackageItemBreakUpFormArr.clear();
    this.employeeForm.controls?.['empsalarypackageDetailsBreakUp'].reset();
    this.empsalarypackageItemBreakUpFormArr.push(
      this.empsalarypackageItemDetailInitRows()
    );
    this.empsalarypackageDItemBreakUpFormArr.clear();
    this.employeeForm.controls?.['empsalarypackageDDetailsBreakUp'].reset();
    this.empsalarypackageDItemBreakUpFormArr.push(
      this.empsalarypackageDItemDetailInitRows()
    );
    this.empjobinfoItemBreakUpFormArr.clear();
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].reset();
    this.empjobinfoItemBreakUpFormArr.push(
      this.empjobinfoItemDetailInitRows()
    );
    this.employeeSelectionsForm.reset();
    this.employeeForm.reset();
  }

  setActionButtonsFlag(
    add: boolean,
    retrieve: boolean,
    addRow: boolean,
    back: boolean,
    save: boolean
  ) {
    this.disabledFlagAddRow = addRow;
    this.disabledFlagBack = back;
    this.disabledFlagRetrieve = retrieve;
    this.disabledFlagAdd = add;
    this.disabledFlagSave = save;
  }

  focusById(id: string) {
    this.renderer.selectRootElement(`#${id}`)?.focus();
  }

  payloadSaveEmployeeDetails(){
    this.employeeDetailPayload = {
      addressmail: this.receivedmailAddressData.getRawValue().addressResponseBean,
      addressres: this.receivedresAddressData.valid ? this.receivedresAddressData.getRawValue().addressResponseBean : null, 
      empassetinfoRequestBean: this.employeeForm.controls?.['empassetinfoDetailsBreakUp']?.getRawValue(),
      empeducationRequestBean: this.employeeForm.controls?.['empeducationDetailsBreakUp']?.getRawValue(), 
      empexperienceRequestBean: this.employeeForm.controls?.['empexperienceDetailsBreakUp']?.getRawValue(),
      empfamilyRequestBean: this.employeeForm.controls?.['empfamilyDetailsBreakUp'].getRawValue(),
      empjobinfoRequestBean: {
            empcode : this.tranMode == 'A' ? '' : this.employeeSelectionsForm.get('eperEmpcode')?.value[0][0].trim(),
            appliedon: this.datePipe.transform(this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['appliedon']?.value,'dd/MM/yyyy'),
            appointedby: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['appointedby']?.value?.[0]?.[0].trim(),
            appointedon: this.datePipe.transform(this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['appointedon']?.value,'dd/MM/yyyy'),
            bank: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['bank']?.value?.[0]?.[0].trim(),
            bankacno: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['bankacno']?.value,
            bankactype: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['bankactype']?.value?.[0]?.[0].trim(),
            bankbranch: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['bankbranch']?.value,
            company: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['company']?.value?.[0]?.[0].trim(),
            department: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['department']?.value?.[0]?.[0].trim(),
            desigpost: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['desigpost']?.value?.[0]?.[0].trim(),
            desigtax: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['desigtax']?.value?.[0]?.[0].trim(),
            dutyhours: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['dutyhours']?.value == null || this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['dutyhours']?.value == "" ? 0 : this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['dutyhours']?.value,
            emptype: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['emptype']?.value?.[0]?.[0].trim(),
            jobfrom: this.datePipe.transform(this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['jobfrom']?.value,'dd/MM/yyyy'),
            jobstatus: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['jobstatus']?.value,
            jobtype: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['jobtype']?.value?.[0]?.[0].trim(),
            jobupto: this.datePipe.transform(this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['jobupto']?.value,'dd/MM/yyyy'),
            joindate: this.datePipe.transform(this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['joindate']?.value,'dd/MM/yyyy'),
            joinedyn: "Y",
            location: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['location']?.value?.[0]?.[0].trim(),
            noticedays: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['noticedays']?.value == null || this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['noticedays']?.value == "" ? 0 : this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['noticedays']?.value,
            origjoindate: this.datePipe.transform(this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['origjoindate']?.value,'dd/MM/yyyy'),
            paymode: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['paymode']?.value?.[0]?.[0].trim(),
            prevcoy: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['prevcoy']?.value,
            probationupto: this.datePipe.transform(this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['probationupto']?.value,'dd/MM/yyyy'),
            probmonths: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['probmonths']?.value == null || this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['probmonths']?.value == "" ? 0 : this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['probmonths']?.value,
            worksite: this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['worksite']?.value?.[0]?.[0].trim(),
      },
      empleaveinfoRequestBean: this.employeeForm.controls?.['empleaveinfoDetailsBreakUp'].value,
      emppersonalRequestBean: {
            empcode : this.tranMode == 'A' ? '' : this.employeeSelectionsForm.get('eperEmpcode')?.value[0][0].trim(),
            aadhaarno: this.employeeForm.get('aadhaarno')?.value,
            birthdate:  this.datePipe.transform(this.employeeForm.get('birthdate')?.value,'dd/MM/yyyy'),
            bloodgrp: this.employeeForm.get('bloodgrp')?.value,
            fullname: this.employeeForm.get('fullname')?.value,
            gender: this.employeeForm.get('gender')?.value!= undefined && this.employeeForm.get('gender')?.value!= null && this.employeeForm.get('gender')?.value!= "" ? this.employeeForm.get('gender')?.value : "M",
            height: this.employeeForm.get('height')?.value == null || this.employeeForm.get('height')?.value == "" ? 0 : this.employeeForm.get('height')?.value, 
            hobbies: this.employeeForm.get('hobbies')?.value == null ? "" : this.employeeForm.get('hobbies')?.value,
            maritalstat: this.employeeForm.get('maritalstat')?.value!= undefined && this.employeeForm.get('maritalstat')?.value!= null && this.employeeForm.get('maritalstat')?.value!= "" ? this.employeeForm.get('maritalstat')?.value : "S",
            module: "MAINSCRADD",
            mothertongue: (this.employeeForm.get('mothertongue')?.value != null && this.employeeForm.get('mothertongue')?.value != undefined && this.employeeForm.getRawValue().mothertongue?.length!=0)? this.employeeForm.get('mothertongue')?.value?.[0][0] : '' ,
            nationality: (this.employeeForm.get('nationality')?.value != null && this.employeeForm.get('nationality')?.value != undefined && this.employeeForm.getRawValue().nationality?.length!=0)? this.employeeForm.get('nationality')?.value?.[0][0] : '' ,
            noofchildren: this.employeeForm.get('noofchildren')?.value == null || this.employeeForm.get('noofchildren')?.value == "" ? 0 : this.employeeForm.get('noofchildren')?.value,
            panno: this.employeeForm.get('panno')?.value,
            pfuan: this.employeeForm.get('pfuan')?.value,
            religion: (this.employeeForm.get('religion')?.value != null && this.employeeForm.get('religion')?.value != undefined && this.employeeForm.getRawValue().religion?.length!=0)? this.employeeForm.get('religion')?.value?.[0][0] : '' ,
            remark: this.employeeForm.get('remark')?.value == null ? "" : this.employeeForm.get('remark')?.value,
            title: this.employeeForm.get('title')?.value?.[0]?.[0].trim(),
            weddingdate: this.employeeForm.get('weddingdate')?.value ?  this.datePipe.transform(this.employeeForm.get('weddingdate')?.value,'dd/MM/yyyy') : null,
            weight: this.employeeForm.get('weight')?.value == null || this.employeeForm.get('weight')?.value == "" ? 0 : this.employeeForm.get('weight')?.value
      },
      empreferenceRequestBean: this.employeeForm.controls?.['empreferenceDetailsBreakUp'].getRawValue(),
      empsalarypackageRequestBean: this.employeeForm.controls?.['empsalarypackageDetailsBreakUp'].value,
      empsalarypackagededRequestBean: this.employeeForm.controls?.['empsalarypackageDDetailsBreakUp'].value,
      empschemeinfoRequestBean: this.employeeForm.controls?.['empschemeinfoDetailsBreakUp'].getRawValue(),
      partyRequestBean : {
        partytype : "W",
        title : this.employeeForm.get('title')?.value?.[0]?.[0].trim(),
        partyname : this.employeeForm.get('fullname')?.value?.trim(),
        aadharpanlinkedyn : "Y",
        city : this.receivedmailAddressData.getRawValue().addressResponseBean.city.value?.trim(),
        ltdcoyn : "N",
        pmtacnum : this.employeeForm.get('panno')?.value != "PANAPPLIED" && this.employeeForm.get('panno')?.value != "NOTAPPLIED" ? this.employeeForm.get('panno')?.value : ""
      }
    };

    //for asset table
    let arrAssetList = this.employeeDetailPayload.empassetinfoRequestBean;
    for (var j = 0; j < arrAssetList.length; j++) {
      arrAssetList[j].assetcode?.length!=0 && arrAssetList[j].assetcode != null ? arrAssetList[j].assetcode = this.commonService.convertArryaToString(arrAssetList[j].assetcode)?.trimEnd()  : arrAssetList[j].assetcode = "";
      arrAssetList[j].issuedate ? arrAssetList[j].issuedate = this.datePipe.transform(arrAssetList[j].issuedate,'dd/MM/yyyy') : arrAssetList[j].issuedate = null;
      arrAssetList[j].issuedby?.length!=0 && arrAssetList[j].issuedby != null? arrAssetList[j].issuedby = arrAssetList[j].issuedby[0]?.[0].trim() : arrAssetList[j].issuedby = "";
      arrAssetList[j].receivedby?.length!=0 && arrAssetList[j].receivedby != null ? arrAssetList[j].receivedby = arrAssetList[j].receivedby[0]?.[0].trim() : arrAssetList[j].receivedby = "";
      arrAssetList[j].authby?.length!=0 && arrAssetList[j].authby != null ? arrAssetList[j].authby = arrAssetList[j].authby[0]?.[0].trim() : arrAssetList[j].authby = "";
      arrAssetList[j].returndate ? (arrAssetList[j].returndate = this.datePipe.transform(arrAssetList[j].returndate,'dd/MM/yyyy')) : (arrAssetList[j].returndate = null);
    }

    //for education table
    let arrEducList = this.employeeDetailPayload.empeducationRequestBean;
    for (var j = 0; j < arrEducList.length; j++) {
      arrEducList[j].attendedfromdate ? arrEducList[j].attendedfromdate = this.datePipe.transform(arrEducList[j].attendedfromdate,'dd/MM/yyyy') : arrEducList[j].attendedfromdate = null;
      arrEducList[j].attendedtodate   ? arrEducList[j].attendedtodate   = this.datePipe.transform(arrEducList[j].attendedtodate,'dd/MM/yyyy')   : arrEducList[j].attendedtodate = null;
    }
    //for experience table
    let arrExperienceList = this.employeeDetailPayload.empexperienceRequestBean;
    for (var j = 0; j < arrExperienceList.length; j++) {
      arrExperienceList[j].workedfrom ? (arrExperienceList[j].workedfrom = this.datePipe.transform(arrExperienceList[j].workedfrom,'dd/MM/yyyy')) : (arrExperienceList[j].workedfrom = null);
      arrExperienceList[j].workedupto ? (arrExperienceList[j].workedupto = this.datePipe.transform(arrExperienceList[j].workedupto,'dd/MM/yyyy')) : (arrExperienceList[j].workedupto = null);
    }
    //for family table
    let arrFamilyList = this.employeeDetailPayload.empfamilyRequestBean;
    for (var j = 0; j < arrFamilyList.length; j++) {
      arrFamilyList[j].relation?.length!=0 && arrFamilyList[j].relation != null ? arrFamilyList[j].relation = this.commonService.convertArryaToString(arrFamilyList[j].relation)?.trimEnd() : arrFamilyList[j].relation = "";
      (arrFamilyList[j] && arrFamilyList[j].birthdate) ? (arrFamilyList[j].birthdate = this.datePipe.transform(arrFamilyList[j].birthdate,'dd/MM/yyyy')) : (arrFamilyList[j].birthdate = null);
      (arrFamilyList[j] && arrFamilyList[j].weddingdate) ? (arrFamilyList[j].weddingdate = this.datePipe.transform(arrFamilyList[j].weddingdate,'dd/MM/yyyy')) : (arrFamilyList[j].weddingdate = null);
    }
    //for reference table
    let arrReferenceList = this.employeeDetailPayload.empreferenceRequestBean;
    for(var j = 0; j < arrReferenceList.length; j++){
      arrReferenceList[j].knownfrom ? (arrReferenceList[j].knownfrom = this.datePipe.transform(arrReferenceList[j].knownfrom,'dd/MM/yyyy')) : (arrReferenceList[j].knownfrom = null);
    }
    //for leave table
    let arrLeaveList = this.employeeDetailPayload.empleaveinfoRequestBean;
    for(var j = 0; j < arrLeaveList.length; j++){
      arrLeaveList[j].leavecode?.length!=0 && arrLeaveList[j].leavecode != null ? arrLeaveList[j].leavecode = this.commonService.convertArryaToString(arrLeaveList[j].leavecode)?.trimEnd() : arrLeaveList[j].leavecode = "";
    }
    //for schemeinfo table
    let arrSchemeList = this.employeeDetailPayload.empschemeinfoRequestBean;
    for(var j = 0; j < arrSchemeList.length; j++){
      arrSchemeList[j].schemecode?.length!=0 && arrSchemeList[j].schemecode != null ? arrSchemeList[j].schemecode = this.commonService.convertArryaToString(arrSchemeList[j].schemecode)?.trimEnd() : arrSchemeList[j].schemecode = "";
      arrSchemeList[j].entrydate ? (arrSchemeList[j].entrydate = this.datePipe.transform(arrSchemeList[j].entrydate,'dd/MM/yyyy')) : (arrSchemeList[j].entrydate = null);
      arrSchemeList[j].schemeenddate ? (arrSchemeList[j].schemeenddate = this.datePipe.transform(arrSchemeList[j].schemeenddate,'dd/MM/yyyy')) : (arrSchemeList[j].schemeenddate = null);
      arrSchemeList[j].effectivefrom ? (arrSchemeList[j].effectivefrom = this.datePipe.transform(arrSchemeList[j].effectivefrom,'dd/MM/yyyy')) : (arrSchemeList[j].effectivefrom = null);
      arrSchemeList[j].effectiveupto ? (arrSchemeList[j].effectiveupto = this.datePipe.transform(arrSchemeList[j].effectiveupto,'dd/MM/yyyy')) : (arrSchemeList[j].effectiveupto = null);
      arrSchemeList[j].schemepercentage != null ? arrSchemeList[j].schemepercentage = parseFloat(arrSchemeList[j].schemepercentage) : 0;
      arrSchemeList[j].schemeamount != null ? arrSchemeList[j].schemeamount = parseFloat(arrSchemeList[j].schemeamount) : 0;
    }
    //for empsalarypackage table -earning
    let arrSalarypackageEList = this.employeeDetailPayload.empsalarypackageRequestBean;
    for(var j = 0; j < arrSalarypackageEList.length; j++){
      console.log("Earndedcode",arrSalarypackageEList[j].earndedcode);
      arrSalarypackageEList[j].earndedcode?.length!=0 && arrSalarypackageEList[j].earndedcode != null ? arrSalarypackageEList[j].earndedcode =  this.commonService.convertArryaToString(arrSalarypackageEList[j].earndedcode)?.trimEnd() : arrSalarypackageEList[j].earndedcode = "";
      arrSalarypackageEList[j].earndedrate != null ? arrSalarypackageEList[j].earndedrate = parseFloat(arrSalarypackageEList[j].earndedrate) : 0;
      arrSalarypackageEList[j].effectivefrom ? (arrSalarypackageEList[j].effectivefrom = this.datePipe.transform(arrSalarypackageEList[j].effectivefrom,'dd/MM/yyyy')) : (arrSalarypackageEList[j].effectivefrom = null);
      arrSalarypackageEList[j].effectiveupto ? (arrSalarypackageEList[j].effectiveupto = this.datePipe.transform(arrSalarypackageEList[j].effectiveupto,'dd/MM/yyyy')) : (arrSalarypackageEList[j].effectiveupto = null);
    }
      //for empsalarypackage table -deduction
        let arrSalarypackageDList = this.employeeDetailPayload.empsalarypackagededRequestBean;
        for(var j = 0; j < arrSalarypackageDList.length; j++){
          arrSalarypackageDList[j].earndedcode?.length!=0 && arrSalarypackageDList[j].earndedcode != null ? arrSalarypackageDList[j].earndedcode = this.commonService.convertArryaToString(arrSalarypackageDList[j].earndedcode)?.trimEnd() : arrSalarypackageDList[j].earndedcode = "";
          arrSalarypackageDList[j].earndedrate != null ? arrSalarypackageDList[j].earndedrate = parseFloat(arrSalarypackageDList[j].earndedrate) : 0;
          arrSalarypackageDList[j].effectivefrom ? (arrSalarypackageDList[j].effectivefrom = this.datePipe.transform(arrSalarypackageDList[j].effectivefrom,'dd/MM/yyyy')) : (arrSalarypackageDList[j].effectivefrom = null);
          arrSalarypackageDList[j].effectiveupto ? (arrSalarypackageDList[j].effectiveupto = this.datePipe.transform(arrSalarypackageDList[j].effectiveupto,'dd/MM/yyyy')) : (arrSalarypackageDList[j].effectiveupto = null);
        }
  }

  deletesalzerorows(){
    for (let i = this.empsalarypackageItemBreakUpFormArr.length - 1; i >= 0; i--) {
      if (this.empsalarypackageItemBreakUpFormArr.length > 0 ){
        if (this.empsalarypackageItemBreakUpFormArr.controls[i].get('earndedrate')?.value == "0" || this.empsalarypackageItemBreakUpFormArr.controls[i].get('earndedrate')?.value == "" || this.empsalarypackageItemBreakUpFormArr.controls[i].get('earndedrate')?.value == null) {
          this.empsalarypackageItemBreakUpFormArr.removeAt(i);
        }
      }
    }
  }

  deletesaldedzerorows(){
    for (let i = this.empsalarypackageDItemBreakUpFormArr.length - 1; i >= 0; i--) {
      if (this.empsalarypackageDItemBreakUpFormArr.length > 0 ){
        if (this.empsalarypackageDItemBreakUpFormArr.controls[i].get('earndedrate')?.value == "0" || this.empsalarypackageDItemBreakUpFormArr.controls[i].get('earndedrate')?.value == "" || this.empsalarypackageDItemBreakUpFormArr.controls[i].get('earndedrate')?.value == null) {
          this.empsalarypackageDItemBreakUpFormArr.removeAt(i);
        }
    }
    }
  }

  deleteEduBlankRow(){
    for (let i = this.empeducationItemBreakUpFormArr.length - 1; i >= 0; i--){
      if(this.empeducationItemBreakUpFormArr.length > 0){
        if (!this.empeducationItemBreakUpFormArr.controls[i].value.percofmarks) {
          this.empeducationItemBreakUpFormArr.removeAt(i);
        }
      }
    }
  }

  deleteExpBlankRow(){
    for (let i = this.empexperienceItemBreakUpFormArr.length - 1; i >= 0; i--){
      if(this.empexperienceItemBreakUpFormArr.length > 0){
        if (!this.empexperienceItemBreakUpFormArr.controls[i].value.totalservice) {
          this.empexperienceItemBreakUpFormArr.removeAt(i);
        }
      }
    }
  }

  deleteAssetBlankRow(){
    for (let i = this.empassetinfoItemBreakUpFormArr.length - 1; i >= 0; i--){
      if(this.empassetinfoItemBreakUpFormArr.length > 0){
        if (!this.empassetinfoItemBreakUpFormArr.controls[i].value.assetcode) {
          this.empassetinfoItemBreakUpFormArr.removeAt(i);
        }
      }
    }
  }

  deleteRefBlankRow(){
    for (let i = this.empreferenceItemBreakUpFormArr.length - 1; i >= 0; i--){
      if(this.empreferenceItemBreakUpFormArr.length > 0){
        if (!this.empreferenceItemBreakUpFormArr.controls[i].value.refrencename) {
          this.empreferenceItemBreakUpFormArr.removeAt(i);
        }
      }
    }
  }


  insertOneBlankRow(){
    this.empsalarypackageItemBreakUpFormArr.length == 0 ? this.empsalarypackageItemBreakUpFormArr.push(this.empsalarypackageItemDetailInitRows()) : '';
    this.empsalarypackageDItemBreakUpFormArr.length == 0 ? this.empsalarypackageDItemBreakUpFormArr.push(this.empsalarypackageDItemDetailInitRows()) : '';
    this.empeducationItemBreakUpFormArr.length == 0 ? this.empeducationItemBreakUpFormArr.push(this.empeducationItemDetailInitRows()) :'' ;
    this.empexperienceItemBreakUpFormArr.length == 0 ? this.empexperienceItemBreakUpFormArr.push(this.empexperienceItemDetailInitRows()) : '';
    this.empassetinfoItemBreakUpFormArr.length == 0 ? this.empassetinfoItemBreakUpFormArr.push(this.empassetinfoItemDetailInitRows()) : '';
    this.empreferenceItemBreakUpFormArr.length ==0 ? this.empreferenceItemBreakUpFormArr.push(this.empreferenceItemDetailInitRows()) : '';
  }

  save() {
    if (this.tranMode == 'A'){
      console.log("Form---->",this.employeeForm);
      this.deleteEduBlankRow();
      this.deleteExpBlankRow();
      this.deleteRefBlankRow();
      this.deleteAssetBlankRow();
      this.deletesalzerorows();
      this.deletesaldedzerorows();

      // this.setdateInSalaryPackage("");
      this.payloadSaveEmployeeDetails();
      console.log("payload",this.employeeDetailPayload);
      debugger

      if (this.employeeForm.valid){
        this.loaderToggle = true;
        //call add service here
        this.paydataentryService.insertEmployeeDetails(this.employeeDetailPayload).subscribe({
          next: (res: any) => {
            if (res?.status){
              this.loaderToggle = false;
              this.toastr.info(res.message,"Employee Info",{
                disableTimeOut: true,
                tapToDismiss: false,
                closeButton: true,
              });
            } else{
              console.log("RES",res);
            }
            console.log("RES",res);
          },
          error: (error) => {
            this.toastr.error('Error in Adding Employee Salary Details');
            this.loaderToggle = false;
          },
        });
        this.loaderToggle = false;
        this.back();
      } else {
        this.toastr.error('Please fill the form properly');
        this.validateAllFormFields(this.employeeForm);
        this.validateAllFormArraryFields(this.employeeForm);
        this.validAddress();
        this.validPerAddress();
        this.insertOneBlankRow();
      }
    } else {   //this.tranMode = 'R' when data is retrieve and modified and saving is called
      if (this.enableAllYN == 'N') {
        this.toastr.error('Limited Modification are Saved')
      } else {
      console.log("Form---->",this.employeeForm);
      this.deleteEduBlankRow();
      this.deleteExpBlankRow();
      this.deleteRefBlankRow();
      this.deleteAssetBlankRow();
      this.deletesalzerorows();
      this.deletesaldedzerorows();
      this.payloadSaveEmployeeDetails();
      let strjoindt  = this.datePipe.transform(this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['origjoindate']?.value,'dd/MM/yyyy')
      console.log("strjoindt",strjoindt);

      console.log("payload",this.employeeDetailPayload);
      debugger
      if (this.employeeForm.valid){
        this.loaderToggle = true;
        //call add service here
        this.paydataentryService.updateNewEmployeeDetails(this.employeeDetailPayload).subscribe({
          next: (res: any) => {
            if (res?.status){
              this.loaderToggle = false;
              this.toastr.info(res.message,"Employee Info",{
                disableTimeOut: true,
                tapToDismiss: false,
                closeButton: true,
              });
            } else{
              console.log("RES",res);
            }
            console.log("RES",res);
          },
          error: (error) => {
            this.toastr.error('Error in Adding Employee Salary Details');
            this.loaderToggle = false;
          },
        });
        this.loaderToggle = false;
        this.back();
      } else {
        this.toastr.error('Please fill the form properly');
        this.validateAllFormFields(this.employeeForm);
        this.validateAllFormArraryFields(this.employeeForm);
        this.validAddress();
        this.validPerAddress();
        this.insertOneBlankRow();
      }
      this.toastr.error('Modification are Saved');
    }
  }
  }

  bindEmppersonalInputValuesWithResponseBean(res: any, i:any) {
    this.employeeForm.patchValue({
      empcode: res.data.emppersonalResponseBean[i]?.empcode,
      title: res.data.emppersonalResponseBean[i]?.title,
      fullname: res.data.emppersonalResponseBean[i]?.fullname,
      gender: res.data.emppersonalResponseBean[i]?.gender,
      birthdate: res.data.emppersonalResponseBean[i]?.birthdate
        ? moment(
            res.data.emppersonalResponseBean[0]?.birthdate,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
        : null,
      maritalstat: res.data.emppersonalResponseBean[i]?.maritalstat,
      weddingdate: res.data.emppersonalResponseBean[i]?.weddingdate
        ? moment(
            res.data.emppersonalResponseBean[i]?.weddingdate,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
        : null,
      noofchildren: res.data.emppersonalResponseBean[i]?.noofchildren,
      height: res.data.emppersonalResponseBean[i]?.height,
      weight: res.data.emppersonalResponseBean[i]?.weight,
      bloodgrp: res.data.emppersonalResponseBean[i]?.bloodgrp,
      religion: res.data.emppersonalResponseBean[i]?.religion,
      nationality: res.data.emppersonalResponseBean[i]?.nationality,
      mothertongue: res.data.emppersonalResponseBean[i]?.mothertongue,
      hobbies: res.data.emppersonalResponseBean[i]?.hobbies,
      panno: res.data.emppersonalResponseBean[i]?.panno,
      photopath: res.data.emppersonalResponseBean[i]?.photopath,
      epereffectivefrom: res.data.emppersonalResponseBean[i]?.effectivefrom
        ? moment(
            res.data.emppersonalResponseBean[i]?.effectivefrom,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
        : null,
      epereffectiveupto: res.data.emppersonalResponseBean[i]?.effectiveupto
        ? moment(
            res.data.emppersonalResponseBean[i]?.effectiveupto,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD')
        : null,
      remark: res.data.emppersonalResponseBean[i]?.remark,
      module: res.data.emppersonalResponseBean[i]?.module,
      aadhaarno: res.data.emppersonalResponseBean[i]?.aadhaarno,
      handicapyn: res.data.emppersonalResponseBean[i]?.handicapyn,
      pfuan: res.data.emppersonalResponseBean[i]?.pfuan,
      // pmtacnum: res.data.emppersonalResponseBean[i].partyResponseBean?.pmtacnum,
    });
  }

  empeducationItemDetailInitRows() {
    return this.fb.group({
      empcode: new FormControl<string | null>(null),
      educsrno: new FormControl<string>('0'),
      degree: new FormControl<string | null>(null),
      coursename: new FormControl<string | null>(null),
      institute: new FormControl<string | null>(null),
      attendedfromdate: new FormControl(),
      attendedtodate: new FormControl(),
      percofmarks: new FormControl<any>(null,[Validators.max(100), Validators.min(0),Validators.required]),
      class: new FormControl<string | null>(null),
      mainsubjetcs: new FormControl<string | null>(null),
      module: new FormControl<string | null>(null),
    });
  }

  get empeducationItemBreakUpFormArr() {
    return this.employeeForm.get('empeducationDetailsBreakUp') as FormArray;
  }

  retrieveEmpeducationDetails(res: any) {
    for (var i = 0; i < res.data.empeducationResponseBean?.length; i++) {
      res.data.empeducationResponseBean[i].attendedfromdate = res.data.empeducationResponseBean[i].attendedfromdate ? moment(res.data.empeducationResponseBean[i]?.attendedfromdate,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empeducationResponseBean[i].attendedtodate = res.data.empeducationResponseBean[i].attendedtodate ? moment(res.data.empeducationResponseBean[i]?.attendedtodate,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empeducationResponseBean?.length - 1 == i
        ? ''
        : this.empeducationItemBreakUpFormArr.push(
            this.empeducationItemDetailInitRows()
          );
      this.employeeForm.controls?.empeducationDetailsBreakUp.patchValue(
        res.data.empeducationResponseBean
      );
    }
  }

  addEmpeducationRow(i: number) {
    this.empeducationItemBreakUpFormArr.push(this.empeducationItemDetailInitRows());
    let newindex: number = 1;
    newindex = newindex + i;
    this.empeducationItemBreakUpFormArr.length - 1 == newindex
      ? setTimeout(() => {
          this.focusById('degree' + newindex);
        }, 10)
      : this.focusById('degree' + newindex);
  }

  deleteEmpeducationRow(rowIndex: any) {
    this.empeducationItemBreakUpFormArr.length == 1
      ? this.toastr.error('Cannot delete this row')
      : this.empeducationItemBreakUpFormArr.removeAt(rowIndex);
  }

  empleaveinfoItemDetailInitRows() {
    return this.fb.group({
      empcode: new FormControl<string | null>(null),
      leavecode: new FormControl<string | null>(null,Validators.required),
      acyear: new FormControl<string | null>('',[Validators.required, Validators.minLength(8), yearRange()]),
      daysentitled: new FormControl<any>(null,[Validators.required,Validators.max(366), Validators.min(0)]),
      maxdaysenc: new FormControl<any>(null,[Validators.required,Validators.max(366), Validators.min(0)]),
      maxdayscf: new FormControl<any>(null,[Validators.required,Validators.max(366), Validators.min(0)]),
      daysbf: new FormControl<any>(null,[Validators.required,Validators.max(366), Validators.min(0)]),
      daysavailed: new FormControl<any>(null,[Validators.required,Validators.max(366), Validators.min(0)]),
      daysencashed: new FormControl<any>(null,[Validators.required,Validators.max(366), Validators.min(0)]),
      dayexcessadj: new FormControl<any>(null,[Validators.required,Validators.max(366), Validators.min(0)]),
      compoffearned: new FormControl<any>(null,[Validators.required,Validators.max(366), Validators.min(0)]),
      remark: new FormControl<string | null>(null),
      module: new FormControl<string | null>(null),
    });
  }

  get empleaveinfoItemBreakUpFormArr() {
    return this.employeeForm.get('empleaveinfoDetailsBreakUp') as FormArray;
  }

  retrieveEmpleaveinfoDetails(res: any) {
    for (var i = 0; i < res.data.empleaveinfoResponseBean?.length; i++) {
      res.data.empleaveinfoResponseBean?.length - 1 == i
        ? ''
        : this.empleaveinfoItemBreakUpFormArr.push(
            this.empleaveinfoItemDetailInitRows()
          );
      this.employeeForm.controls?.empleaveinfoDetailsBreakUp.patchValue(
        res.data.empleaveinfoResponseBean
      );
    }
  }

  empschemeinfoItemDetailInitRows() {
    return this.fb.group({
      empcode: new FormControl<string | null>(null),
      schemecode: new FormControl<string | null>(null,Validators.required),
      schemecodedesc: new FormControl<string | null>(null),
      schemecentre: new FormControl<string | null>(null,Validators.required),
      empschemeno: new FormControl<string | null>(null,Validators.required),
      entrydate: new FormControl('',Validators.required),
      schemepercentage: new FormControl<any>(null,Validators.required),
      schemeenddate: new FormControl('',Validators.required),
      effectivefrom: new FormControl('',Validators.required),
      effectiveupto: new FormControl('',Validators.required),
      remark: new FormControl<string | null>(null),
      module: new FormControl<string | null>(null),
      applicableyn: new FormControl<string | null>('N', [Validators.required]),
      schemeamount: new FormControl<any>(null),
    });
  }

  retrieveEmpschemeinfoDetails(res: any) {
    for (var i = 0; i < res.data.empschemeinfoResponseBean?.length; i++) {
      res.data.empschemeinfoResponseBean[i].entrydate = res.data.empschemeinfoResponseBean[i].entrydate ? moment(res.data?.empschemeinfoResponseBean[i]?.entrydate,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empschemeinfoResponseBean[i].schemeenddate = res.data.empschemeinfoResponseBean[i].schemeenddate ? moment(res.data?.empschemeinfoResponseBean[i]?.schemeenddate,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empschemeinfoResponseBean[i].effectivefrom  = res.data.empschemeinfoResponseBean[i].effectivefrom ? moment(res.data?.empschemeinfoResponseBean[i]?.effectivefrom,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empschemeinfoResponseBean[i].effectiveupto = res.data.empschemeinfoResponseBean[i].effectiveupto ? moment(res.data?.empschemeinfoResponseBean[i]?.effectiveupto,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empschemeinfoResponseBean[i].schemecode = res.data.empschemeinfoResponseBean[i].schemecode ? res.data.empschemeinfoResponseBean[i].schemecode + " " : null
      console.log("schemeCode",res.data.empschemeinfoResponseBean[i].schemecode);
      
      res.data.empschemeinfoResponseBean?.length - 1 == i
        ? ''
        : this.empschemeinfoItemBreakUpFormArr.push(
            this.empschemeinfoItemDetailInitRows()
          );
      this.employeeForm.controls?.empschemeinfoDetailsBreakUp.patchValue(
        res.data.empschemeinfoResponseBean
      );
    }
  }

  get empschemeinfoItemBreakUpFormArr() {
    return this.employeeForm.get('empschemeinfoDetailsBreakUp') as FormArray;
  }

  empfamilyItemDetailInitRows() {
    return this.fb.group({
      empcode: new FormControl<string | null>(null),
      srno: new FormControl<string>('0'),
      relation: new FormControl<string | null>(null,Validators.required),
      fullname: new FormControl<string | null>(null,Validators.required),
      birthdate: new FormControl(),
      weddingdate: new FormControl(),
      occupation: new FormControl<string | null>(null),
      module: new FormControl<string | null>(null),
    });
  }

  retrieveEmpfamilyDetails(res: any) {
    for (var i = 0; i < res.data.empfamilyResponseBean?.length; i++) {
      res.data.empfamilyResponseBean[i].birthdate = res.data.empfamilyResponseBean[i].birthdate ? moment(res.data?.empfamilyResponseBean[i]?.birthdate,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empfamilyResponseBean[i].weddingdate = res.data.empfamilyResponseBean[i].weddingdate ? moment(res.data?.empfamilyResponseBean[i]?.weddingdate,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empfamilyResponseBean?.length - 1 == i
        ? ''
        : this.empfamilyItemBreakUpFormArr.push(
            this.empfamilyItemDetailInitRows()
          );
      this.employeeForm.controls?.empfamilyDetailsBreakUp.patchValue(
        res.data.empfamilyResponseBean
      );
    }
  }

  get empfamilyItemBreakUpFormArr() {
    return this.employeeForm.get('empfamilyDetailsBreakUp') as FormArray;
  }

  empexperienceItemDetailInitRows() {
    return this.fb.group({
      empcode: new FormControl<string | null>(null),
      jobsrno: new FormControl<any>(null),
      companyname: new FormControl<string | null>(null),
      workedfrom: new FormControl(),
      workedupto: new FormControl(),
      totalservice: new FormControl<any>(null,Validators.required),
      startpost: new FormControl<string | null>(null),
      endpost: new FormControl<string | null>(null),
      startgrade: new FormControl<string | null>(null),
      endgrade: new FormControl<string | null>(null),
      startlevel: new FormControl<string | null>(null),
      endlevel: new FormControl<string | null>(null),
      startreportingto: new FormControl<string | null>(null),
      endreportingto: new FormControl<string | null>(null),
      startpackage: new FormControl<any>(null),
      endpackage: new FormControl<any>(null),
      startgrosspermth: new FormControl<any>(null),
      endgrosspermth: new FormControl<any>(null),
      jobprofile: new FormControl<string | null>(null),
      reasonforleaving: new FormControl<string | null>(null),
      module: new FormControl<string | null>(null),
    });
  }

  retrieveEmpexperienceDetails(res: any) {
    for (var i = 0; i < res.data.empexperienceResponseBean?.length; i++) {
      res.data.empexperienceResponseBean[i].workedfrom = res.data.empexperienceResponseBean[i].workedfrom ? moment(res.data?.empexperienceResponseBean[i]?.workedfrom,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empexperienceResponseBean[i].workedupto = res.data.empexperienceResponseBean[i].workedupto ? moment(res.data?.empexperienceResponseBean[i]?.workedupto,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empexperienceResponseBean?.length - 1 == i
        ? ''
        : this.empexperienceItemBreakUpFormArr.push(
            this.empexperienceItemDetailInitRows()
          );
      this.employeeForm.controls?.empexperienceDetailsBreakUp.patchValue(
        res.data.empexperienceResponseBean
      );
    }
  }

  get empexperienceItemBreakUpFormArr() {
    return this.employeeForm.get('empexperienceDetailsBreakUp') as FormArray;
  }

  empreferenceItemDetailInitRows() {
    return this.fb.group({
      empcode: new FormControl<string | null>(null),
      srno: new FormControl<string>('0'),
      refrencename: new FormControl<string | null>(null,Validators.required),
      referenceaddress: new FormControl<string | null>(null),
      referencetelno: new FormControl<string | null>(null),
      referencecellno: new FormControl<string | null>(null),
      refrelation: new FormControl<string | null>(null),
      knownfrom: new FormControl(),
      companyname: new FormControl<string | null>(null),
      post: new FormControl<string | null>(null),
      module: new FormControl<string | null>(null),
    });
  }

  retrieveEmpreferenceDetails(res: any) {
    for (var i = 0; i < res.data.empreferenceResponseBean?.length; i++) {
      res.data.empreferenceResponseBean[i].knownfrom = res.data.empreferenceResponseBean[i].knownfrom ? moment(res.data?.empreferenceResponseBean[i]?.knownfrom,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empreferenceResponseBean?.length - 1 == i
        ? ''
        : this.empreferenceItemBreakUpFormArr.push(
            this.empreferenceItemDetailInitRows()
          );
      this.employeeForm.controls?.empreferenceDetailsBreakUp.patchValue(
        res.data.empreferenceResponseBean
      );
    }
  }

  get empreferenceItemBreakUpFormArr() {
    return this.employeeForm.get('empreferenceDetailsBreakUp') as FormArray;
  }

  empassetinfoItemDetailInitRows() {
    return this.fb.group({
      empcode: new FormControl<string | null>(null),
      assetcode: new FormControl<string | null>(null,Validators.required),
      assetname: new FormControl<string | null>(null,Validators.required),
      assetdesc: new FormControl<string | null>(null),
      issuedate: new FormControl('',Validators.required),
      returndate: new FormControl(),
      issuedby: new FormControl<string | null>(null,Validators.required),
      receivedby: new FormControl<string | null>(null,Validators.required),
      authby: new FormControl<string | null>(null,Validators.required),
      remark: new FormControl<string | null>(null),
      module: new FormControl<string | null>(null),
    });
  }

  retrieveEmpassetinfoDetails(res: any) {
    for (var i = 0; i < res.data.empassetinfoResponseBean?.length; i++) {
      res.data.empassetinfoResponseBean[i].issuedate = res.data.empassetinfoResponseBean[i].issuedate ? moment(res.data?.empassetinfoResponseBean[i]?.issuedate,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empassetinfoResponseBean[i].returndate = res.data.empassetinfoResponseBean[i].returndate ? moment(res.data?.empassetinfoResponseBean[i]?.returndate,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empassetinfoResponseBean?.length - 1 == i
        ? ''
        : this.empassetinfoItemBreakUpFormArr.push(
            this.empassetinfoItemDetailInitRows()
          );
      this.employeeForm.controls?.empassetinfoDetailsBreakUp.patchValue(
        res.data.empassetinfoResponseBean
      );
    }
  }

  get empassetinfoItemBreakUpFormArr() {
    return this.employeeForm.get('empassetinfoDetailsBreakUp') as FormArray;
  }

  empsalarypackageItemDetailInitRows() {
    return this.fb.group({
      empcode: new FormControl<string | null>(null),
      earndedcode: new FormControl<string | null>(null,Validators.required),
      earndeddesc: new FormControl<string | null>(null),
      earndedrate: new FormControl<any>(null,Validators.required),
      paycycle: new FormControl<string | null>(null,Validators.required),
      ratecycle: new FormControl<string | null>(null,Validators.required),
      effectivefrom: new FormControl('',Validators.required),
      effectiveupto: new FormControl('',Validators.required),
      module: new FormControl<string | null>(null),
      active: new FormControl<string | null>(null),
      activeTF : new FormControl<Boolean>(false),
    });
  }

  retrieveEmpsalarypackageDetails(res: any) {
    for (var i = 0; i < res.data.empsalarypackageResponseBean?.length; i++) {
      res.data.empsalarypackageResponseBean[i].effectivefrom = res.data.empsalarypackageResponseBean[i].effectivefrom ? moment(res.data?.empsalarypackageResponseBean[i]?.effectivefrom,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empsalarypackageResponseBean[i].effectiveupto = res.data.empsalarypackageResponseBean[i].effectiveupto ? moment(res.data?.empsalarypackageResponseBean[i]?.effectiveupto,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empsalarypackageResponseBean?.length - 1 == i
        ? ''
        : this.empsalarypackageItemBreakUpFormArr.push(
            this.empsalarypackageItemDetailInitRows()
          );
      res.data.empsalarypackageResponseBean[i].activeTF = res.data.empsalarypackageResponseBean[i].active.value == 'A' ? false : true; 
      this.employeeForm.controls?.empsalarypackageDetailsBreakUp.patchValue(
        res.data.empsalarypackageResponseBean
      );
      // this.enableDisableField('empsalarypackageDetailsBreakUp','active','A');
      this.enableDisableFieldForModification('empsalarypackageDetailsBreakUp')
    }
  }

  get empsalarypackageItemBreakUpFormArr() {
    return this.employeeForm.get('empsalarypackageDetailsBreakUp') as FormArray;
  }

  empsalarypackageDItemDetailInitRows() {
    return this.fb.group({
      empcode: new FormControl<string | null>(null),
      earndedcode: new FormControl<string | null>(null,Validators.required),
      earndeddesc: new FormControl<string | null>(null),
      earndedrate: new FormControl<any>(null,Validators.required),
      paycycle: new FormControl<string | null>(null,Validators.required),
      ratecycle: new FormControl<string | null>(null,Validators.required),
      effectivefrom: new FormControl('',Validators.required),
      effectiveupto: new FormControl('',Validators.required),
      module: new FormControl<string | null>(null),
      active: new FormControl<string | null>(null),
      activeTF : new FormControl<Boolean>(false),
    });
  }

  retrieveEmpsalarypackageDDetails(res: any) {
    for (var i = 0; i < res.data.empsalarypackagededResponseBean?.length; i++) {
      // res.data?.empjobinfoResponseBean[i]?.effectivefrom ? this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['effectivefrom'].setValue(moment(res.data?.empjobinfoResponseBean[i]?.effectivefrom,'DD/MM/YYYY').format('YYYY-MM-DD')) : null
      res.data.empsalarypackagededResponseBean[i].effectivefrom = res.data.empsalarypackagededResponseBean[i].effectivefrom ? moment(res.data?.empsalarypackagededResponseBean[i]?.effectivefrom,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empsalarypackagededResponseBean[i].effectiveupto = res.data.empsalarypackagededResponseBean[i].effectiveupto ? moment(res.data?.empsalarypackagededResponseBean[i]?.effectiveupto,'DD/MM/YYYY').format('YYYY-MM-DD') : null
      res.data.empsalarypackagededResponseBean?.length - 1 == i
        ? ''
        : this.empsalarypackageDItemBreakUpFormArr.push(
            this.empsalarypackageDItemDetailInitRows()
          );
      res.data.empsalarypackagededResponseBean[i].activeTF = res.data.empsalarypackagededResponseBean[i].active.value == 'A' ? false : true;
      this.employeeForm.controls?.empsalarypackageDDetailsBreakUp.patchValue(
        res.data.empsalarypackagededResponseBean
      );
      // this.enableDisableField('empsalarypackageDDetailsBreakUp','active','A');
      this.enableDisableFieldForModification('empsalarypackageDDetailsBreakUp')
    }
  }

  get empsalarypackageDItemBreakUpFormArr() {
    return this.employeeForm.get(
      'empsalarypackageDDetailsBreakUp'
    ) as FormArray;
  }

  empjobinfoItemDetailInitRows(){
    return this.fb.group({
      empcode: new FormControl<String[]>([], [
        Validators.maxLength(10),
      ]),
      company: new FormControl<String[]>([], [
        Validators.required,
        ]),
      ticketno: new FormControl<String>('', [
        Validators.maxLength(5),
        ]),
      punchcardno: new FormControl<String>('', [
        Validators.maxLength(10),
        ]),
      region: new FormControl<String>('', [
        Validators.maxLength(1),
        ]),
      location: new FormControl<String[]>([], [
        Validators.required,
        ]),
      worksite: new FormControl<String[]>([], [
        Validators.required,
        ]),
      branch: new FormControl<String>('', [
        Validators.maxLength(4),
        ]),
      division: new FormControl<String>('', [
        Validators.maxLength(4),
        ]),
      department: new FormControl<String[]>([], [
        Validators.required,
        ]),
      section: new FormControl<String>('', [
        Validators.maxLength(4),
        ]),
      costcentre: new FormControl<String>('', [
        Validators.maxLength(4),
        ]),
      salarygrpcode: new FormControl<String[]>([], [
        ]),
      emptype: new FormControl<String[]>([], [
        Validators.required,
        ]),
      jobtype: new FormControl<String[]>([], [
        Validators.required,
        ]),
      jobstatus: new FormControl<String>('L', [
        Validators.maxLength(1),
        Validators.required,
        ]),
      deputedincoy: new FormControl<String[]>([], [
        ]),
      prevcoy: new FormControl<String>('', [
        Validators.maxLength(15),
        ]),
      appliedon: new FormControl(),
      appointedon: new FormControl('',Validators.required),
      appointedby: new FormControl<String[]>([], [
        ]),
      probmonths: new FormControl<any>(null,[Validators.required,Validators.max(12), Validators.min(0)]),
      joinedyn: new FormControl<String>('', [
        Validators.maxLength(1),
        ]),
      joindate: new FormControl('',[Validators.required,joindateValidation()]),
      origjoindate: new FormControl('',Validators.required),
      traineeupto: new FormControl(),
      probationupto: new FormControl(),
      jobfrom: new FormControl(),
      jobupto: new FormControl(),
      termdate: new FormControl(),
      settlementdate: new FormControl(),
      xferdate: new FormControl(),
      reasonofleav: new FormControl<String>('', [
        Validators.maxLength(50),
        ]),
      grade: new FormControl<String[]>([], [
        ]),
      level: new FormControl<String>('', [
        Validators.maxLength(4),
        ]),
      reportingto: new FormControl<String[]>([], [
        ]),
      desigtax: new FormControl<String[]>([], [
        Validators.required,
        ]),
      desigpost: new FormControl<String[]>([], [
        Validators.required,
        ]),
      shiftcode: new FormControl<String>('', [
        Validators.maxLength(2),
        ]),
      dutyhours: new FormControl<any>(0,[Validators.required,Validators.max(24), Validators.min(0)]),
      noticedays: new FormControl<any>(0,[Validators.required,Validators.max(120), Validators.min(0)]),
      paymode: new FormControl<String[]>([], [
        Validators.required,
        ]),
      bankacno: new FormControl<String>('', [
        Validators.maxLength(18),
        ]),
      bankactype: new FormControl<String[]>([], [
        ]),
      bank: new FormControl<String[]>([], [
        ]),
      bankbranch: new FormControl<String>('', [
        Validators.maxLength(30),
        ]),
      effectivefrom: new FormControl('',Validators.required),
      effectiveupto: new FormControl('',Validators.required),
      remark: new FormControl<String>('', [
        Validators.maxLength(50),
        ]),
      module: new FormControl<String>('', [
        Validators.maxLength(10),
        ]),
      oldbank: new FormControl<String>('', [
        Validators.maxLength(4),
        ]),
      oldbankacno: new FormControl<String>('', [
        Validators.maxLength(18),
        ]),
      directoryn: new FormControl<String>('', [
        Validators.maxLength(1),
        ]),
      gratuitypaymonth: new FormControl<String>('', [
        Validators.maxLength(6),
        ]),
      gratuitydate: new FormControl(),
    });
  }

  retrieveEmpjobinfoDetails(res: any) {
    // this.bindInputValuesWithResponseBeanforempjobinfo(res,res.data.empjobinfoResponseBean.length-1);
    this.bindInputValuesWithResponseBeanforempjobinfoIndividual(res,res.data.empjobinfoResponseBean.length-1);
  }

  bindInputValuesWithResponseBeanforempjobinfoIndividual(res: any,i:any){
    // this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['remark'].setValue("TestKalpana")
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['empcode'].setValue(res.data?.empjobinfoResponseBean[i]?.empcode)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['company'].setValue(res.data?.empjobinfoResponseBean[i]?.company)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['ticketno'].setValue(res.data?.empjobinfoResponseBean[i]?.ticketno)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['punchcardno'].setValue(res.data?.empjobinfoResponseBean[i]?.punchcardno)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['region'].setValue(res.data?.empjobinfoResponseBean[i]?.region)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['location'].setValue(res.data?.empjobinfoResponseBean[i]?.location)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['worksite'].setValue(res.data?.empjobinfoResponseBean[i]?.worksite)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['branch'].setValue(res.data?.empjobinfoResponseBean[i]?.branch)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['division'].setValue(res.data?.empjobinfoResponseBean[i]?.division)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['department'].setValue(res.data?.empjobinfoResponseBean[i]?.department)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['section'].setValue(res.data?.empjobinfoResponseBean[i]?.section)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['costcentre'].setValue(res.data?.empjobinfoResponseBean[i]?.costcentre)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['salarygrpcode'].setValue(res.data?.empjobinfoResponseBean[i]?.salarygrpcode)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['emptype'].setValue(res.data?.empjobinfoResponseBean[i]?.emptype)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['jobtype'].setValue(res.data?.empjobinfoResponseBean[i]?.jobtype)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['jobstatus'].setValue(res.data?.empjobinfoResponseBean[i]?.jobstatus)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['deputedincoy'].setValue(res.data?.empjobinfoResponseBean[i]?.deputedincoy)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['prevcoy'].setValue(res.data?.empjobinfoResponseBean[i]?.prevcoy)
    res.data?.empjobinfoResponseBean[i]?.appliedon ? this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['appliedon'].setValue(moment(res.data?.empjobinfoResponseBean[i]?.appliedon,'DD/MM/YYYY').format('YYYY-MM-DD')) : null
    res.data?.empjobinfoResponseBean[i]?.appointedon ? this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['appointedon'].setValue(moment(res.data?.empjobinfoResponseBean[i]?.appointedon,'DD/MM/YYYY').format('YYYY-MM-DD')) :null
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['appointedby'].setValue(res.data?.empjobinfoResponseBean[i]?.appointedby)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['probmonths'].setValue(res.data?.empjobinfoResponseBean[i]?.probmonths)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['joinedyn'].setValue(res.data?.empjobinfoResponseBean[i]?.joinedyn)
    res.data?.empjobinfoResponseBean[i]?.joindate ? this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['joindate'].setValue(moment(res.data?.empjobinfoResponseBean[i]?.joindate,'DD/MM/YYYY').format('YYYY-MM-DD')) : null
    res.data?.empjobinfoResponseBean[i]?.origjoindate ? this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['origjoindate'].setValue(moment(res.data?.empjobinfoResponseBean[i]?.origjoindate,'DD/MM/YYYY').format('YYYY-MM-DD')) : null
    res.data?.empjobinfoResponseBean[i]?.traineeupto ? this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['traineeupto'].setValue(moment(res.data?.empjobinfoResponseBean[i]?.traineeupto,'DD/MM/YYYY').format('YYYY-MM-DD')) : null
    res.data?.empjobinfoResponseBean[i]?.probationupto ? this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['probationupto'].setValue(moment(res.data?.empjobinfoResponseBean[i]?.probationupto,'DD/MM/YYYY').format('YYYY-MM-DD')) : null
    res.data?.empjobinfoResponseBean[i]?.jobfrom ? this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['jobfrom'].setValue(moment(res.data?.empjobinfoResponseBean[i]?.jobfrom,'DD/MM/YYYY').format('YYYY-MM-DD')) : null
    res.data?.empjobinfoResponseBean[i]?.jobupto ? this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['jobupto'].setValue(moment(res.data?.empjobinfoResponseBean[i]?.jobupto,'DD/MM/YYYY').format('YYYY-MM-DD')) : null
    res.data?.empjobinfoResponseBean[i]?.termdate ? this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['termdate'].setValue(moment(res.data?.empjobinfoResponseBean[i]?.termdate,'DD/MM/YYYY').format('YYYY-MM-DD')) : null
    res.data?.empjobinfoResponseBean[i]?.settlementdate ? this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['settlementdate'].setValue(moment(res.data?.empjobinfoResponseBean[i]?.settlementdate,'DD/MM/YYYY').format('YYYY-MM-DD')) : null
    res.data?.empjobinfoResponseBean[i]?.xferdate ? this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['xferdate'].setValue(moment(res.data?.empjobinfoResponseBean[i]?.xferdate,'DD/MM/YYYY').format('YYYY-MM-DD')) : null
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['reasonofleav'].setValue(res.data?.empjobinfoResponseBean[i]?.reasonofleav)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['grade'].setValue(res.data?.empjobinfoResponseBean[i]?.grade)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['level'].setValue(res.data?.empjobinfoResponseBean[i]?.level)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['reportingto'].setValue(res.data?.empjobinfoResponseBean[i]?.reportingto)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['desigtax'].setValue(res.data?.empjobinfoResponseBean[i]?.desigtax)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['desigpost'].setValue(res.data?.empjobinfoResponseBean[i]?.desigpost)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['shiftcode'].setValue(res.data?.empjobinfoResponseBean[i]?.shiftcode)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['dutyhours'].setValue(res.data?.empjobinfoResponseBean[i]?.dutyhours)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['noticedays'].setValue(res.data?.empjobinfoResponseBean[i]?.noticedays)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['paymode'].setValue(res.data?.empjobinfoResponseBean[i]?.paymode)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['bankacno'].setValue(res.data?.empjobinfoResponseBean[i]?.bankacno)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['bankactype'].setValue(res.data?.empjobinfoResponseBean[i]?.bankactype)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['bank'].setValue(res.data?.empjobinfoResponseBean[i]?.bank)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['bankbranch'].setValue(res.data?.empjobinfoResponseBean[i]?.bankbranch)
    res.data?.empjobinfoResponseBean[i]?.effectivefrom ? this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['effectivefrom'].setValue(moment(res.data?.empjobinfoResponseBean[i]?.effectivefrom,'DD/MM/YYYY').format('YYYY-MM-DD')) : null
    res.data?.empjobinfoResponseBean[i]?.effectiveupto ? this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['effectiveupto'].setValue(moment(res.data?.empjobinfoResponseBean[i]?.effectiveupto,'DD/MM/YYYY').format('YYYY-MM-DD')) : null
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['remark'].setValue(res.data?.empjobinfoResponseBean[i]?.remark)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['module'].setValue(res.data?.empjobinfoResponseBean[i]?.module)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['oldbank'].setValue(res.data?.empjobinfoResponseBean[i]?.oldbank)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['oldbankacno'].setValue(res.data?.empjobinfoResponseBean[i]?.oldbankacno)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['directoryn'].setValue(res.data?.empjobinfoResponseBean[i]?.directoryn)
    this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['gratuitypaymonth'].setValue(res.data?.empjobinfoResponseBean[i]?.gratuitypaymonth)
    res.data?.empjobinfoResponseBean[i]?.gratuitydate ? this.employeeForm.controls?.['empjobinfoDetailsBreakUp'].controls[0].controls['gratuitydate'].setValue(moment(res.data?.empjobinfoResponseBean[i]?.gratuitydate,'DD/MM/YYYY').format('YYYY-MM-DD')) : null
    this.empjobstatus = res.data?.empjobinfoResponseBean[i]?.jobstatus;
  }

  bindInputValuesWithResponseBeanforempjobinfo(res: any,lasti:any){ 
// this method is not used now
    // console.log(lasti,"last");
    for (var i = 0; i < res.data.empjobinfoResponseBean?.length; i++) {
      res.data.empjobinfoResponseBean[i].appliedon = moment(res.data?.empjobinfoResponseBean[i]?.appliedon, 'DD/MM/YYYY').format('YYYY-MM-DD');
      res.data.empjobinfoResponseBean[i].appointedon = moment(res.data?.empjobinfoResponseBean[i]?.appointedon, 'DD/MM/YYYY').format('YYYY-MM-DD');
      res.data.empjobinfoResponseBean[i].joindate = moment(res.data?.empjobinfoResponseBean[i]?.joindate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      res.data.empjobinfoResponseBean[i].origjoindate = moment(res.data?.empjobinfoResponseBean[i]?.origjoindate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      res.data.empjobinfoResponseBean[i].traineeupto = moment(res.data?.empjobinfoResponseBean[i]?.traineeupto, 'DD/MM/YYYY').format('YYYY-MM-DD');
      res.data.empjobinfoResponseBean[i].probationupto = moment(res.data?.empjobinfoResponseBean[i]?.probationupto, 'DD/MM/YYYY').format('YYYY-MM-DD');
      res.data.empjobinfoResponseBean[i].jobfrom = moment(res.data?.empjobinfoResponseBean[i]?.jobfrom, 'DD/MM/YYYY').format('YYYY-MM-DD');
      res.data.empjobinfoResponseBean[i].jobupto = moment(res.data?.empjobinfoResponseBean[i]?.jobupto, 'DD/MM/YYYY').format('YYYY-MM-DD');
      res.data.empjobinfoResponseBean[i].termdate = moment(res.data?.empjobinfoResponseBean[i]?.termdate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      res.data.empjobinfoResponseBean[i].settlementdate = moment(res.data?.empjobinfoResponseBean[i]?.settlementdate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      res.data.empjobinfoResponseBean[i].xferdate = moment(res.data?.empjobinfoResponseBean[i]?.xferdate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      res.data.empjobinfoResponseBean[i].effectivefrom = moment(res.data?.empjobinfoResponseBean[i]?.effectivefrom, 'DD/MM/YYYY').format('YYYY-MM-DD');
      res.data.empjobinfoResponseBean[i].effectiveupto = moment(res.data?.empjobinfoResponseBean[i]?.effectiveupto, 'DD/MM/YYYY').format('YYYY-MM-DD');
      res.data.empjobinfoResponseBean[i].gratuitydate = moment(res.data?.empjobinfoResponseBean[i]?.gratuitydate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      
      this.employeeForm.controls?.empjobinfoDetailsBreakUp.patchValue(
        res.data.empjobinfoResponseBean
      );
    }

    this.empjobstatus = res.data.empjobinfoResponseBean[res.data.empjobinfoResponseBean.length-1].jobstatus;
  }

	get empjobinfoItemBreakUpFormArr() {
		return this.employeeForm.get('empjobinfoDetailsBreakUp') as FormArray;
	}

  getReceivemailAddressData(data: any) {
    // Used this method in html for Address Data
    this.receivedmailAddressData = data;
  }

  getReceiveresAddressData(data: any) {
    // Used this method in html for Address Data
    this.receivedresAddressData = data;
  }

  emppersonalbackward(){
    debugger
    if (this.emppersonalrowcount == 0){
      this.eperBackward = true;
      this.eperForward = false;
    } else {
    this.emppersonalrowcount = this.emppersonalrowcount -1
    if(this.emppersonalrowcount < 0){
      // this.toastr.info("Frist row")
      this.bindEmppersonalInputValuesWithResponseBean(this.empResonseBean, 0) 
      this.emppersonalrowcount = 0
      this.eperBackward = true;
      this.eperForward = false;
    } else {
      // this.toastr.info("retrieve")
      this.bindEmppersonalInputValuesWithResponseBean(this.empResonseBean, this.emppersonalrowcount) 
      if(this.empResonseBean.data.emppersonalResponseBean.length - 1 > this.emppersonalrowcount){
        this.eperForward = false;
        if(this.emppersonalrowcount == 0){
          this.eperBackward = true;
        }
      }
    }
    if(this.emppersonalrowcount == this.empResonseBean.data.emppersonalResponseBean.length - 1){
      this.employeeForm.enable();
    } else {
      this.employeeForm.disable();
    }
  }
  }

  emppersonalforward(){
    debugger
    if(this.emppersonalrowcount == this.empResonseBean.data.emppersonalResponseBean.length - 1){
      this.eperForward = true;
      this.eperBackward = false;
    } else {
      this.emppersonalrowcount = this.emppersonalrowcount + 1
      if(this.emppersonalrowcount < this.empResonseBean.data.emppersonalResponseBean.length - 1){
        // this.toastr.info("Retrieve")
        this.bindEmppersonalInputValuesWithResponseBean(this.empResonseBean, this.emppersonalrowcount)
        this.eperBackward = false;
        if(this.emppersonalrowcount == this.empResonseBean.data.emppersonalResponseBean.length - 1){
          this.eperForward = true;
        }
      } else {
        // this.toastr.info("Last")
        this.emppersonalrowcount = this.empResonseBean.data.emppersonalResponseBean.length - 1;
        this.bindEmppersonalInputValuesWithResponseBean(this.empResonseBean, this.emppersonalrowcount)
        this.eperForward = true;
        this.eperBackward = false;
      }
    }
    if(this.emppersonalrowcount == this.empResonseBean.data.emppersonalResponseBean.length - 1){
      this.employeeForm.enable();
    } else {
      this.employeeForm.disable();
    }
  }

  empjobinfoforward(){
    debugger
    if(this.empjobinforowcount == this.empResonseBean.data.empjobinfoResponseBean.length - 1){
      this.ejinForward = true;
      this.ejinBackward = false;
    } else {
      this.empjobinforowcount = this.empjobinforowcount + 1
      if(this.empjobinforowcount < this.empResonseBean.data.empjobinfoResponseBean.length - 1){
        // this.toastr.info("Retrieve")
        this.bindInputValuesWithResponseBeanforempjobinfoIndividual(this.empResonseBean, this.empjobinforowcount)
        this.ejinBackward = false;
        if(this.empjobinforowcount == this.empResonseBean.data.empjobinfoResponseBean.length - 1){
          this.ejinForward = true;
        }
      } else {
        // this.toastr.info("Last")
        this.empjobinforowcount = this.empResonseBean.data.empjobinfoResponseBean.length - 1;
        this.bindInputValuesWithResponseBeanforempjobinfoIndividual(this.empResonseBean, this.empjobinforowcount)
        this.ejinForward = true;
        this.ejinBackward = false;
      }
    }
    if(this.empjobinforowcount == this.empResonseBean.data.empjobinfoResponseBean.length - 1){
      this.employeeForm.enable();
    } else {
      this.employeeForm.disable();
    }
  }

  empjobinfobackward(){
    debugger
    if (this.empjobinforowcount == 0){
      this.ejinBackward = true;
      this.ejinForward = false;
    } else {
    this.empjobinforowcount = this.empjobinforowcount -1
    if(this.empjobinforowcount < 0){
      // this.toastr.info("Frist row")
      this.bindInputValuesWithResponseBeanforempjobinfoIndividual(this.empResonseBean, 0) 
      this.empjobinforowcount = 0
      this.ejinBackward = true;
      this.ejinForward = false;
    } else {
      // this.toastr.info("retrieve")
      this.bindInputValuesWithResponseBeanforempjobinfoIndividual(this.empResonseBean, this.empjobinforowcount) 
      if(this.empResonseBean.data.empjobinfoResponseBean.length - 1 > this.empjobinforowcount){
        this.ejinForward = false;
        if(this.empjobinforowcount == 0){
          this.ejinBackward = true;
        }
      }
    }
    if(this.empjobinforowcount == this.empResonseBean.data.empjobinfoResponseBean.length - 1){
      this.employeeForm.enable();
    } else {
      this.employeeForm.disable();
    }
  }
  }

  fetchSalarypackage(currentAll :string){
    if (this.tranMode == 'R'){
      this.empsalarypackageItemBreakUpFormArr.clear();
      this.employeeForm.controls?.['empsalarypackageDetailsBreakUp'].reset();
      this.empsalarypackageItemBreakUpFormArr.push(
        this.empsalarypackageItemDetailInitRows()
      );
      this.empsalarypackageDItemBreakUpFormArr.clear();
      this.employeeForm.controls?.['empsalarypackageDDetailsBreakUp'].reset();
      this.empsalarypackageDItemBreakUpFormArr.push(
        this.empsalarypackageDItemDetailInitRows()
      );
      let eperEmpcode = this.employeeSelectionsForm
          .get('eperEmpcode')
          ?.value[0][0].trim();
      this.paydataentryService.fetchSalaryPackageDetails(eperEmpcode,currentAll).subscribe({
        next: (res: any) => {
          if (res?.status){
            this.retrieveEmpsalarypackageDetails(res);
            this.retrieveEmpsalarypackageDDetails(res);
          }
          console.log("RES",res);
        },
        error: (error) => {
          this.toastr.error('Error in getting Employee Salary Details');
        },
      });
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  validateAllFormArraryFields(formGroup: FormGroup){
  Object.keys(formGroup.controls).forEach(field => {
    const formArray = formGroup.get(field) as FormArray;;
    if (formArray instanceof FormArray) {
      // console.log("FormArray Name -->",  formArray);
      Object.keys(formArray.controls).forEach(formGroup => {
          const control = formArray.get(formGroup);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
          } else if (control instanceof FormGroup) {
            this.validateAllFormFields(control);
          }
      });
    }      
  });
  }

  addTableRow(
    formArray: any,
    funtionName: keyof EmployeedetailsentryeditComponent,
    index: number,
    id: string
  ) {
    const arry = formArray as FormArray;

    arry.push(this[funtionName]());

    let newindex: number = 1;
    newindex = newindex + index;
    arry.length - 1 == newindex
      ? setTimeout(() => {
          this.focusById(id + newindex);
        }, 10)
      : this.focusById(id + newindex);
  }

  deleteTableRows(formArray: any, rowIndex: number) {
    const array = formArray as FormArray;
    array.length == 1
      ? this.toastr.error('Cannot delete this row')
      : array.removeAt(rowIndex);
  }

  enableDisableFieldForModification(formArrayName:string){
    // e.g. 'empsalarypackageDetailsBreakUp' //active // A
    const formArrayTableName =this.employeeForm.get(formArrayName) as FormArray;
    formArrayTableName.controls.map((item)=>{
      if (this.enableAllYN == 'N') {
        item.disable()
      }else{
        item.enable()
      }
    })
  }

  enableDisableField(formArrayName:string, fieldName:string,CheckValue:string){
     // e.g. 'empsalarypackageDetailsBreakUp' //active // A
     const formArrayTableName =this.employeeForm.get(formArrayName) as FormArray;
     formArrayTableName.controls.map((item)=>{
       if (item.get(fieldName)?.value!==CheckValue) {
         item.disable()
       }else{
         item.enable()
       }
     })
   }

  //not in use
  validateEmpeducation(){
    this.employeeForm.controls?.['empeducationDetailsBreakUp'].controls.forEach(formGroup => {
      Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFormFields(control);
        }
      });
    });
  }
//end of not in use


  validAddress(){
    let formGroup = this.addressComponent.addressForm;
    // console.log("formGroup",formGroup);
    // let formGp = this.mailadd?.nativeElement.input;
    // console.log("formGp",formGp);

    console.log("address 1->",this.addressComponent);
   
    
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  validPerAddress(){
    let formGroup = this.addressPerComponent.addressForm;
    console.log("address 2->",this.addressPerComponent);
    
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  salarypackagetabclicked(){
    // this.toastr.error('tab clicked');
    // setTimeout(() => {
    //   console.log("cell--->",'cell'+ 0 + '-' + 3);
    //   let newindex : number = 0;
    //   this.focusById('earndedrate' + newindex);
    // }, 100)
  }

}

//validation for Birthdate
export function BirthdateValidation(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let entereddate = moment(control.value) //.format('DD/MM/YYYY')
    let today = moment(new Date()) //.format('DD/MM/YYYY')
    let diff = entereddate.diff(today, 'years')
    var yearDiff = today.diff(entereddate, 'years');

    if (yearDiff >= 100) {
      return { veryOld: true };
    } else {
      if (yearDiff < 18){
        return { less18: true };
      }
      return null;
    }
  };

}

export function joindateValidation(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let establishdate = moment(moment('01/01/1956', 'MM-DD-YYYY'))
    let entereddate = moment(control.value)

    if (entereddate.isBefore(establishdate)){
      return {beforeestablishment : true};
    }
    return null;
  };
}

export function yearRange(): ValidatorFn {
  return (_control: AbstractControl): ValidationErrors | null => {
    let yearVal = _control.value
    if (!yearVal){
      return null
    } else {
    let firstFourCharacter = yearVal.slice(0, 4)
    let secondFourCharacter = yearVal.slice(4, 8)
    if (secondFourCharacter > firstFourCharacter && secondFourCharacter - firstFourCharacter == 1) {
      return null
    }
    return { 'yearVal': true }
  }
  };

}
