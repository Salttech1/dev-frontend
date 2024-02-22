// Developed By  - 	kalpana.mtest()
// Developed on - 05-01-23
// Mode  - Data Entry
// Component Name - vehicle-details-entryComponent
// .Net Form Name -
// PB Window Name -
// Purpose - Equip Entry / Edit
// Reports Used -

// Modification Details
// =======================================================================================================================================================
// Date		Author  Version User    Reason
// =======================================================================================================================================================

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  Renderer2,
  RendererStyleFlags2,
  ViewChild,

} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { DynapopService } from 'src/app/services/dynapop.service';
import { VehicleexpService } from 'src/app/services/adminexp/vehicleexp.service';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Router } from '@angular/router';
import * as commonconstant from '../../../../../../constants/commonconstant';


@Component({
  selector: 'app-vehicle-details-entry',
  templateUrl: './vehicle-details-entry.component.html',
  styleUrls: ['./vehicle-details-entry.component.css'],

})
export class VehicleDetailsEntryComponent implements OnInit, AfterViewInit {
  EqpeqpnumColHeadings!: any[];
  EqpeqpnumF1List!: any;
  EqpeqpnumF1Bbc!: any; // Eqpeqpnum F1 Bring Back Column
  EqpvehtypeColHeadings!: any[];
  EqpvehtypeF1List!: any;
  EqpvehtypeF1Bbc!: any; // Eqpvehtype F1 Bring Back Column
  EqpservstatusColHeadings!: any[];
  EqpservstatusF1List!: any;
  EqpservstatusF1Bbc!: any; // Eqpservstatus F1 Bring Back Column
  EqpcoyColHeadings!: any[];
  EqpcoyF1List!: any;
  EqpcoyF1Bbc!: any; // Eqpcoy F1 Bring Back Column
  runonColHeadings!: any[];
  runonF1List!: any;
  runonF1Bbc!: any; // runon F1 Bring Back Column
  propColHeadings!: any[];
  propF1List!: any;
  propF1Bbc!: any; // prop F1 Bring Back Column
  sitebldgColHeadings!: any[];
  sitebldgF1List!: any;
  sitebldgF1Bbc!: any; // sitebldg F1 Bring Back Column

  initialMode: Boolean = false;
  deleteDisabled: Boolean = true;
  tranMode: String = '';
  isDeleteClicked: boolean = false;
  isBackClicked: boolean = false;
  fetchRequestAPI: any;
  coyclosedate = commonconstant.coyCloseDate;
  intitialFormvalue: any;
  initialRetrievedCoy: any;
  disableReset: boolean = true;
  loaderToggle: boolean = false;
  disableSave: boolean = true;

  vehicleSelectionsForm: FormGroup = new FormGroup({
    eqpEqpnum: new FormControl<String>('',[Validators.maxLength(15), Validators.required]),
  }); // Form Group for Selection input fields

  @ViewChild(F1Component) initFocus!: F1Component;
  vehicleDetailsForm: FormGroup = new FormGroup({
    // Form Group for Data Entry / Edit
    eqpnum: new FormControl<String>('', [
      Validators.maxLength(15),
      Validators.required,
    ]),
    eqptype: new FormControl<String>('', [Validators.maxLength(5)]),
    eqpVehtypeDesc: new FormControl<string>(''),
    vehtype: new FormControl<String>('', [Validators.maxLength(1),Validators.required]),
    vehmake: new FormControl<String>('', [Validators.maxLength(15),Validators.required]),
    purcdate: new FormControl<Date | null>(null,Validators.required),
    bookvalue: new FormControl<number>(0,[Validators.required,Validators.min(1),Validators.maxLength(1)]),
    servstatus: new FormControl<String>('', [Validators.maxLength(1),Validators.required]),
    eqpServstatusDesc: new FormControl<String>(''),
    dispdate: new FormControl<Date | null>(null),
    dispvalue: new FormControl<any>(0),
    allottedto: new FormControl<String>('', [Validators.maxLength(30),Validators.required]),
    tymexp: new FormControl<any>(0),
    lymexp: new FormControl<any>(0),
    todatemexp: new FormControl<any>(0),
    tyrexp: new FormControl<any>(0),
    lyrexp: new FormControl<any>(0),
    todaterexp: new FormControl<any>(0),
    coy: new FormControl<String>('', [Validators.maxLength(5),Validators.required]),
    eqpCoyName: new FormControl<String>(''),
    prop: new FormControl<String>('', [Validators.maxLength(5)]),
    propDesc: new FormControl<String>(''),
    insexpon: new FormControl<Date | null>(null,Validators.required),
    nextmaint: new FormControl<Date | null>(null),
    bmctaxexp: new FormControl<Date | null>(null),
    rtotaxexp: new FormControl<String>('', [Validators.maxLength(15)]),
    avglast: new FormControl<any>(0),
    sitebldg: new FormControl<String>('', [Validators.maxLength(20),Validators.required]),
    kmslimit: new FormControl<number>( 0,[Validators.required,Validators.min(1),Validators.maxLength(1)]),
    runon: new FormControl<String>('', [
      Validators.maxLength(1),
      Validators.required,
    ]),
    
    runonDesc: new FormControl<String>(''),
    servicedone: new FormControl<Date | null>(null),
    servexpiry: new FormControl<Date | null>(null),
    tuneup: new FormControl<Date | null>(null),
    tuneexpiry: new FormControl<Date | null>(null),
    engineno: new FormControl<String>('', [Validators.maxLength(15),Validators.required]),
    chasisno: new FormControl<String>('', [Validators.maxLength(20),Validators.required]),
    inspolicyno: new FormControl<String>('', [Validators.maxLength(25),Validators.required]),
    inscompany: new FormControl<String>('', [Validators.maxLength(40),Validators.required]),
    hpawith: new FormControl<String>('', [Validators.maxLength(30)]),
    loanacno: new FormControl<String>('', [Validators.maxLength(30)]),
    loanamount: new FormControl<any>(0),
    loanpapersignedby: new FormControl<String>('', [Validators.maxLength(30)]),
    hpacancelledon: new FormControl<Date | null>(null),
    rcbooksignedby: new FormControl<String>('', [Validators.maxLength(30)]),
    enginecc: new FormControl<String>('', [Validators.maxLength(30)]),
    regvalidtill: new FormControl<Date | null>(null),
    emiamount: new FormControl<any>(0),
    emistartdate: new FormControl<Date | null>(null),
    emienddate: new FormControl<Date | null>(null),
    registrationauth: new FormControl<String>('', [Validators.maxLength(30)]),
    rtotaxpaidtill: new FormControl<Date | null>(null),
    fitnessvalidtill: new FormControl<Date | null>(null),
    permitvalidtill: new FormControl<Date | null>(null),
    authorisationvalidtill: new FormControl<Date | null>(null),
    batterychanged: new FormControl<Date | null>(null),
    batteryexpiry: new FormControl<Date | null>(null),
    dispchequeno: new FormControl<String>('', [Validators.maxLength(12)]),
    dispchequedate: new FormControl<Date | null>(null),
    dispname: new FormControl<String>('', [Validators.maxLength(50)]),
    dispaddress: new FormControl<String>('', [Validators.maxLength(200)]),
    dispcontactno: new FormControl<String>('', [Validators.maxLength(30)]),
    disppan: new FormControl<String>('', [Validators.maxLength(10), Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
    dispaadhaar: new FormControl<String>('', [Validators.maxLength(12), Validators.minLength(12)]),
  });
  
  constructor(
    private vehicleExpService: VehicleexpService,
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private cdref: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: ModalService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.crateF1DataForEqpeqpnum(); // Method to create F1 for Eqpeqpnum List
    this.crateF1DataForEqpvehtype(); // Method to create F1 for Eqpvehtype List
    this.crateF1DataForEqpservstatus(); // Method to create F1 for Eqpservstatus List
    this.crateF1DataForEqpcoy(); // Method to create F1 for Eqpcoy List
    this.createF1DataForFuelType(); //Method to create F1 for FuelType List
    this.createF1DataForEquipsite();
    this.vehicleDetailsForm?.controls['eqpVehtypeDesc'].disable();
    this.vehicleDetailsForm?.controls['runonDesc'].disable();
    this.vehicleDetailsForm?.controls['eqpCoyName'].disable();
    this.vehicleDetailsForm?.controls['prop'].disable();
    this.vehicleDetailsForm?.controls['propDesc'].disable();
    this.vehicleDetailsForm?.controls['eqpServstatusDesc'].disable();
    this.intitialFormvalue = this.vehicleDetailsForm?.value
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngAfterViewInit(): void {
    this.initFocus.fo1.nativeElement.focus(); // To set focus on first input in selection form
  }

  crateF1DataForEqpeqpnum() {
    // Method to create F1 for Eqpeqpnum List
    this.dynapop.getDynaPopListObj('VEHNUM', '').subscribe((res: any) => {
      this.EqpeqpnumColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.EqpeqpnumF1List = res.data;
      this.EqpeqpnumF1Bbc = res.data.bringBackColumn;
    });
  }

  crateF1DataForEqpvehtype() {
    // Method to create F1 for Eqpvehtype List
    this.dynapop.getDynaPopListObj('VEHTYPES', '').subscribe((res: any) => {
      this.EqpvehtypeColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.EqpvehtypeF1List = res.data;
      this.EqpvehtypeF1Bbc = res.data.bringBackColumn;
    });
  }



  getDescForeqpVehtype(e: any) {
    // Used this method in html to initialise eqpVehtypeDesc after selecting value from F1
    if (e.length) {
      this.vehicleDetailsForm.patchValue({
        eqpVehtypeDesc: e[1],
        vehtype:e[0].trim()
      });
    }
  }

  crateF1DataForEqpservstatus() {
    // Method to create F1 for Eqpservstatus List
    this.dynapop.getDynaPopListObj('SERVSTAT', '').subscribe((res: any) => {
      this.EqpservstatusColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.EqpservstatusF1List = res.data;
      this.EqpservstatusF1Bbc = res.data.bringBackColumn;
    });
  }

  getDescForeqpServstatus(e: any) {
    // Used this method in html to initialise eqpServstatusDesc after selecting value from F1
    if (e.length) {
      this.vehicleDetailsForm.patchValue({
        eqpServstatusDesc: e[1],
        servstatus:e[0].trim()
      });
    }
  }

  crateF1DataForEqpcoy() {
    // Method to create F1 for Eqpcoy List
    this.dynapop.getDynaPopListObj('COMPANY', '').subscribe((res: any) => {
      this.EqpcoyColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.EqpcoyF1List = res.data;
      this.EqpcoyF1Bbc = res.data.bringBackColumn;
    });
  }

  createF1DataForEquipsite(){
        // Method to create F1 for Eqpcoy List
        this.dynapop.getDynaPopListObj('EQUIPSITE', '').subscribe((res: any) => {
          this.sitebldgColHeadings = [
            res.data.colhead1,
            res.data.colhead2,
            res.data.colhead3,
            res.data.colhead4,
            res.data.colhead5,
          ];
          this.sitebldgF1List = res.data;
          this.sitebldgF1Bbc = res.data.bringBackColumn;
        });
  }

  validateInvalidFormat(event: any, id: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.toastr.error("Invalid Date");
      this.renderer.selectRootElement(`#${id}`)?.focus();
    }
  }

  billDateValidation(entdate: any, id: any) {
    if (!moment(entdate, 'yyyy-MM-dd', true).isValid()) {
      this.vehicleDetailsForm.get('batterychanged')?.reset();
      this.toastr.error("Invalid Date");
      this.renderer.selectRootElement(`#${id}`)?.focus();
    }
    else{
      let billDate = moment(entdate, 'DD/MM/YYYY');
      let currentDate = moment(new Date()).format('DD/MM/YYYY');
      if (entdate) {
        if (moment(currentDate, 'DD/MM/YYYY').isBefore(billDate)) {
          this.toastr.error('Battery Change Date cannot be greater than current date');
          this.vehicleDetailsForm.get('batterychanged')?.reset();
          this.renderer.selectRootElement(`#${id}`)?.focus();
          return;
        }
        else{
          this.validateStartAndEndDate(entdate,id);
        }
      }
    }
   
  }

  validateStartAndEndDate(date: any, id: any){
    if (!moment(date, 'yyyy-MM-dd', true).isValid()) {
      this.vehicleDetailsForm.get(id == 'batterychangedId' || id == 'batteryexpiryId' ? "batteryexpiry" : "emienddate")?.reset();
      this.toastr.error("Invalid Date");
      this.renderer.selectRootElement(`#${id}`)?.focus();
    }
    else{
    let startDate: any;
    let endDate: any;
    let controlName : any;
    let message: any;
    if(id == 'batterychangedId' || id == 'batteryexpiryId'){
      startDate = moment(this.vehicleDetailsForm.get("batterychanged")?.value).format('YYYY-MM-DD')
      endDate = moment(this.vehicleDetailsForm.get("batteryexpiry")?.value).format('YYYY-MM-DD')
      controlName = "batteryexpiry"
      message = "Battery Expiry date should be Greater than Battery Changed Date"
    }
    else{
      startDate = moment(this.vehicleDetailsForm.get("emistartdate")?.value).format('YYYY-MM-DD')
      endDate = moment(this.vehicleDetailsForm.get("emienddate")?.value).format('YYYY-MM-DD')
      controlName = "emienddate"
      message = "EMI End date should be Greater than EMI Start Date"
    }
    if(startDate && endDate){
      if (moment(startDate).isAfter(endDate)) {
        this.toastr.error(message);
        this.vehicleDetailsForm.get(controlName)?.reset()
        this.renderer.selectRootElement(`#${id}`)?.focus()
    }
    }
  }
  }

  getDescForeqpCoy(e: any) {
    // Used this method in html to initialise eqpCoyName after selecting value from F1
    if(e && e.length!=0){
        this.vehicleDetailsForm.patchValue({
          eqpCoyName: e[1],
        });
      this.getProprietorOnCompany(e[0].trim())
    }else{
      this.vehicleDetailsForm.patchValue({
        coy : "",
        eqpCoyName: "",
        prop: "",
        propDesc: ""
      })
    }
  }

  createF1DataForFuelType(){
    // Method to create F1 for Eqpcoy List
    this.dynapop.getDynaPopListObj('FUELTYPE','').subscribe((res: any) => {
      this.runonColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.runonF1List = res.data;
      this.runonF1Bbc = res.data.bringBackColumn;
    });
  }  

  getDescForRunOn(e:any){
    if (e.length){
      this.vehicleDetailsForm.patchValue({
        runonDesc: e[1],
        runon: e[0].trim()
      });

    }
  }

  // createF1DataForProp(){
  //   this.dynapop.getDynaPopListObj('PROPRIETOR','').subscribe((res: any) =>{
  //     this.propColHeadings = [
  //       res.data.colhead1,
  //       res.data.colhead2,
  //       res.data.colhead3,
  //       res.data.colhead4,
  //       res.data.colhead5,
  //     ];
  //     this.propF1List = res.data;
  //     this.propF1Bbc = res.data.bringBackColumn;
  //   });
  // }

  // getDescForProp(e:any){
  //   if (e.length){
  //     this.vehicleDetailsForm.patchValue({
  //       propDesc: e[1],
  //     });

  //   }
  // }

  addEquipDetails() {
    // User clicks on Add button
    let eqpEqpnum = this.vehicleSelectionsForm.get('eqpEqpnum')?.value?.trim();
    // debugger
    if (eqpEqpnum) {
      this.vehicleExpService.checkEqptypeAndEqpnumExists('V',eqpEqpnum)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
         if (res.status) {
          this.tranMode = 'A';
          this.disableReset = false;
          this.disableSave = false;
          this.initialMode = true;
          this.vehicleSelectionsForm.disable();
          this.setFocus('vehtype');
         } else {
            this.showErrorFieldDialog(
            'Equip Add',
            res['message'],
            'info'
            )
         }
        },
        error : (error) => {
          this.toastr.error(error.error.errors[0].defaultMessage);
        }
      });
    } else {
      this.toastr.error('Please Enter Equip');
    }
  }

  retrieveEquipDetails() {
    this.actionService.getReterieveClickedFlagUpdatedValue(true);
    let eqpEqpnum = this.vehicleSelectionsForm.get('eqpEqpnum')?.value?.trim();
    let eqpEqptype = 'V';
    // debugger
    if (eqpEqpnum) {
      this.vehicleExpService
        .getEquipDetailsByEqptypeAndEqpnum(eqpEqptype, eqpEqpnum)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.status) {
              this.initialMode = true;
              this.disableSave = false;
              this.deleteDisabled = false;
              this.bindInputValuesWithResponseBean(res);
              this.tranMode = 'R';
              this.disableReset = true;
              let l_Eqpvehtype = res.data.vehtype;
              this.dynapop
                .getDynaPopSearchListObj('VEHTYPES', '', l_Eqpvehtype)
                .subscribe((res2: any) => {
                  this.vehicleDetailsForm.patchValue({
                    eqpVehtypeDesc: res2.data.dataSet[0][1],
                  });
                });

              let l_Eqpservstatus = res.data.servstatus;
              this.dynapop
                .getDynaPopSearchListObj('SERVSTAT', '', l_Eqpservstatus)
                .subscribe((res2: any) => {
                  this.vehicleDetailsForm.patchValue({
                    eqpServstatusDesc: res2.data.dataSet[0][1],
                  });
                });
              this.initialRetrievedCoy = res.data.coy?.trim()
              let l_Eqpcoy = res.data.coy;
              this.dynapop
                .getDynaPopSearchListObj('COMPANY', '', l_Eqpcoy)
                .subscribe((res2: any) => {
                  this.vehicleDetailsForm.patchValue({
                    eqpCoyName: res2.data.dataSet[0][1],
                  });
                });

              let l_Runon = res.data.runon;
              this.dynapop
              .getDynaPopSearchListObj('FUELTYPE','',l_Runon)
              .subscribe((res2: any) => {
                this.vehicleDetailsForm.patchValue({
                  runonDesc: res2.data.dataSet[0][1],
                });
              });

              let l_prop = res.data.prop;
              this.dynapop
              .getDynaPopSearchListObj('PROPRIETOR','',l_prop)
              .subscribe((res2: any) => {
                this.vehicleDetailsForm.patchValue({
                  propDesc: res2.data.dataSet[0][1],
                });
              });

              this.setFocus('vehtype');
              } else {
                // debugger
              this.toastr.error('No Data Found for Equip: '+ this.vehicleSelectionsForm?.get('eqpEqpnum')?.value);
              this.initFocus.fo1.nativeElement.focus();
              this.vehicleSelectionsForm?.reset();
            }
            
          },
          error: (error) => {
            this.toastr.error(error.error.errors[0].defaultMessage);
            this.disableSave = true;
          },
        });
    } else {
      this.toastr.error('Please Select Equip');
      this.initFocus.fo1.nativeElement.focus();
    }
  }

  bindInputValuesWithResponseBean(res: any) {
    // Initialise form values from response bean
    this.vehicleDetailsForm.patchValue({
		eqpnum: res.data?.eqpnum,
		eqptype: res.data?.eqptype.trim(),
		vehtype: res.data?.vehtype.trim(),
		vehmake: res.data?.vehmake,
		purcdate: res.data?.purcdate ? moment(res.data?.purcdate,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		bookvalue: res.data?.bookvalue,
		servstatus: res.data?.servstatus,
		dispdate: res.data?.dispdate ? moment(res.data?.dispdate,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		dispvalue: res.data?.dispvalue,
		allottedto: res.data?.allottedto,
		tymexp: res.data?.tymexp,
		lymexp: res.data?.lymexp,
		todatemexp: res.data?.todatemexp,
		tyrexp: res.data?.tyrexp,
		lyrexp: res.data?.lyrexp,
		todaterexp: res.data?.todaterexp,
		coy: res.data?.coy,
		prop: res.data?.prop,
    insexpon: res.data?.insexpon ? moment(res.data?.insexpon,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		nextmaint: res.data?.nextmaint,
		bmctaxexp: res.data?.bmctaxexp,
		rtotaxexp: res.data?.rtotaxexp,
		avglast: res.data?.avglast,
		sitebldg: res.data?.sitebldg,
		kmslimit: res.data?.kmslimit,
		runon: res.data?.runon,
		servicedone: res.data?.servicedone? moment(res.data?.servicedone,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		servexpiry: res.data?.servexpiry? moment(res.data?.servexpiry,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		tuneup: res.data?.tuneup,
		tuneexpiry: res.data?.tuneexpiry,
		engineno: res.data?.engineno,
		chasisno: res.data?.chasisno,
		inspolicyno: res.data?.inspolicyno,
		inscompany: res.data?.inscompany,
		hpawith: res.data?.hpawith,
		loanacno: res.data?.loanacno,
		loanamount: res.data?.loanamount,
		loanpapersignedby: res.data?.loanpapersignedby,
		hpacancelledon: res.data?.hpacancelledon ? moment(res.data?.hpacancelledon,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		rcbooksignedby: res.data?.rcbooksignedby,
		enginecc: res.data?.enginecc,
		regvalidtill: res.data?.regvalidtill? moment(res.data?.regvalidtill,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		emiamount: res.data?.emiamount,
		emistartdate: res.data?.emistartdate? moment(res.data?.emistartdate,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		emienddate: res.data?.emienddate? moment(res.data?.emienddate,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		registrationauth: res.data?.registrationauth,
		rtotaxpaidtill: res.data?.rtotaxpaidtill ? moment(res.data?.rtotaxpaidtill,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		fitnessvalidtill: res.data?.fitnessvalidtill ? moment(res.data?.fitnessvalidtill,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		permitvalidtill: res.data?.permitvalidtill ? moment(res.data?.permitvalidtill,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		authorisationvalidtill: res.data?.authorisationvalidtill ? moment(res.data?.authorisationvalidtill,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		batterychanged: res.data?.batterychanged ? moment(res.data?.batterychanged,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		batteryexpiry: res.data?.batteryexpiry ? moment(res.data?.batteryexpiry,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		dispchequeno: res.data?.dispchequeno,
		dispchequedate: res.data?.dispchequedate ? moment(res.data?.dispchequedate,'DD/MM/YYYY').format('YYYY-MM-DD') :null,
		dispname: res.data?.dispname,
		dispaddress: res.data?.dispaddress,
		dispcontactno: res.data?.dispcontactno,
		disppan: res.data?.disppan,
		dispaadhaar: res.data?.dispaadhaar,
		// nextmaint: res.data?.nextmaint ? moment(res.data?.nextmaint,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		// bmctaxexp: res.data?.bmctaxexp ? moment(res.data?.bmctaxexp,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		// tuneup: res.data?.tuneup ? moment(res.data?.tuneup,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		// tuneexpiry: res.data?.tuneexpiry ? moment(res.data?.tuneexpiry,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
		

	});
  }

  setFocus(id: string) {
    // Method to set focus to object on form
    setTimeout(() => {
      let inF = document.getElementById(id) as HTMLInputElement;
      this.renderer.selectRootElement(inF?.firstChild)?.focus();
    }, 100);
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

  saveEquip() {
    // Method to save data entered by user
    this.vehicleDetailsForm.patchValue({
      eqpnum: this.vehicleSelectionsForm.get('eqpEqpnum')?.value?.trim(),
      eqptype: "V",
    })
    // debugger
    if (this.vehicleDetailsForm.valid) {
      // Check whether data is entered properly
      // let valuesToUpper = this.convertValuesToUpper(
      //   this.vehicleDetailsForm.value
      // );
      this.disableSave = true;
      let userid = sessionStorage.getItem('userName');
      let l_eqpnum = this.vehicleSelectionsForm.get('eqpEqpnum')?.value?.trim();
      console.log(l_eqpnum);

      let savePayload = {
        ...this.vehicleDetailsForm.value,

        
        purcdate: this.vehicleDetailsForm?.value.purcdate ? moment(this.vehicleDetailsForm?.value.purcdate,'YYYY-MM-DD').format('DD/MM/YYYY') :null,
        dispdate:this.vehicleDetailsForm?.value.dispdate ? moment(this.vehicleDetailsForm?.value.dispdate,'YYYY-MM-DD').format('DD/MM/YYYY'): null,
        rtotaxpaidtill:this.vehicleDetailsForm?.value.rtotaxpaidtill ? moment(this.vehicleDetailsForm?.value.rtotaxpaidtill,'YYYY-MM-DD').format('DD/MM/YYYY'):null,
        fitnessvalidtill:this.vehicleDetailsForm?.value.fitnessvalidtill ? moment(this.vehicleDetailsForm?.value.fitnessvalidtill,'YYYY-MM-DD').format('DD/MM/YYYY'):null,
        permitvalidtill:this.vehicleDetailsForm?.value.permitvalidtill ? moment(this.vehicleDetailsForm?.value.permitvalidtill,'YYYY-MM-DD').format('DD/MM/YYYY'):null,
        authorisationvalidtill:this.vehicleDetailsForm?.value.authorisationvalidtill ? moment(this.vehicleDetailsForm?.value.authorisationvalidtill,'YYYY-MM-DD').format('DD/MM/YYYY'):null,
        batterychanged:this.vehicleDetailsForm?.value.batterychanged ? moment(this.vehicleDetailsForm?.value.batterychanged,'YYYY-MM-DD').format('DD/MM/YYYY'):null,
        batteryexpiry:this.vehicleDetailsForm?.value.batteryexpiry ? moment(this.vehicleDetailsForm?.value.batteryexpiry,'YYYY-MM-DD').format('DD/MM/YYYY'):null,
        dispchequedate:this.vehicleDetailsForm?.value.dispchequedate ? moment(this.vehicleDetailsForm?.value.dispchequedate,'YYYY-MM-DD').format('DD/MM/YYYY'):null,
        servicedone:this.vehicleDetailsForm?.value.servicedone ? moment(this.vehicleDetailsForm?.value.servicedone,'YYYY-MM-DD').format('DD/MM/YYYY'):null,
        regvalidtill:this.vehicleDetailsForm?.value.regvalidtill ? moment(this.vehicleDetailsForm?.value.regvalidtill,'YYYY-MM-DD').format('DD/MM/YYYY'):null,
        servexpiry:this.vehicleDetailsForm?.value.servexpiry ? moment(this.vehicleDetailsForm?.value.servexpiry,'YYYY-MM-DD').format('DD/MM/YYYY'):null,
        emistartdate:this.vehicleDetailsForm?.value.emistartdate ? moment(this.vehicleDetailsForm?.value.emistartdate,'YYYY-MM-DD').format('DD/MM/YYYY'):null,
        emienddate: this.vehicleDetailsForm?.value.emienddate ? moment(this.vehicleDetailsForm?.value.emienddate,'YYYY-MM-DD').format('DD/MM/YYYY'):null,
				insexpon: this.vehicleDetailsForm?.value.insexpon ? moment(this.vehicleDetailsForm?.value.insexpon,'YYYY-MM-DD').format('DD/MM/YYYY') :null,
        hpacancelledon: this.vehicleDetailsForm?.value.hpacancelledon ? moment(this.vehicleDetailsForm?.value.hpacancelledon,'YYYY-MM-DD').format('DD/MM/YYYY') :null,
				// nextmaint: this.vehicleDetailsForm?.value.nextmaint ? moment(this.vehicleDetailsForm?.value.nextmaint,'YYYY-MM-DD').format('DD/MM/YYYY') :null,
				// bmctaxexp: this.vehicleDetailsForm?.value.bmctaxexp ? moment(this.vehicleDetailsForm?.value.bmctaxexp,'YYYY-MM-DD').format('DD/MM/YYYY') :null,
				// tuneup: this.vehicleDetailsForm?.value.tuneup ? moment(this.vehicleDetailsForm?.value.tuneup,'YYYY-MM-DD').format('DD/MM/YYYY') :null,
				// tuneexpiry: this.vehicleDetailsForm?.value.tuneexpiry ? moment(this.vehicleDetailsForm?.value.tuneexpiry,'YYYY-MM-DD').format('DD/MM/YYYY') :null,
        eqpnum:l_eqpnum,
        prop: this.vehicleDetailsForm?.getRawValue().prop,
        userid,
      };
      
      console.log(savePayload);
      // debugger
      this.loaderToggle = true;
      if (this.tranMode == 'R') {
        // Retrieve Mode
        savePayload['eqpEqpnum'] = this.vehicleSelectionsForm.get('eqpEqpnum')?.value;
        this.vehicleExpService.updateEquip(savePayload).subscribe({
          next: (res) => {
            this.loaderToggle = false;
            if (res.status) {
              this.showErrorFieldDialog(
                'Equip Updated',
                res['message'],
                'info'
              );
              this.crateF1DataForEqpeqpnum(); // Method to create F1 for Eqpeqpnum List

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
            this.loaderToggle = false;
            this.disableSave = false;
          },
        });
      } else if (this.tranMode == 'A') {
        // New Entry Mode
        this.vehicleExpService.addEquip(savePayload).subscribe({
          next: (res) => {
            this.loaderToggle = false;
            if (res.status) {
              this.showErrorFieldDialog(
                'Equip Added',
                res['message'],
                'info'
              );

            // if (res.status) {
            //   this.modalService.showErrorDialog(
            //     'Equip Added',
            //     res['message'],
            //     'info'
            //   );
              this.crateF1DataForEqpeqpnum(); // Method to create F1 for Eqpeqpnum List

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
            this.loaderToggle = false;
            this.disableSave = false;
          },
        });
      }
    } else {
      this.toastr.error('Please fill the form properly'); 
      this.vehicleDetailsForm?.markAllAsTouched();// Data not entered properly
    }
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
    dialogRef.afterOpened().subscribe(() => {
      console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.focusField('eqpnum');
      //window.location.reload()
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
    if (this.vehicleDetailsForm.dirty) {
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

  scrollPage(height: number) {
    console.log('Testing');
    window.scrollTo(0, height);
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
          this.isDeleteClicked = false;
        }
        if (this.isBackClicked) {
          this.back();
        }
      }
    });
  }

  focusField(fieldId: any) {
    let el = document.getElementById(fieldId)
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }
  
  back() {
    // User clicks on Back button
    this.isBackClicked = false;
    // this.isDeleteClicked = false;
    this.vehicleDetailsForm.reset(this.intitialFormvalue);
    this.vehicleSelectionsForm.reset();
    this.initialMode = false;
    // this.deleteDisabled = true;
    this.vehicleSelectionsForm.controls['eqpEqpnum'].enable();
    this.focusField('eqpnum'); // Set focus on Equip type
    this.disableReset = true;

    // this.vehicleSelectionsForm.controls['eqpEqpnum'].enable();
    // this.initFocus.fo1.nativeElement.focus(); // Set focus on first column in selection form group
  }

  reset(){
    this.vehicleDetailsForm.reset(this.intitialFormvalue);
    this.setFocus('vehtype');
  }

  getProprietorOnCompany(Coy : String){
    if(this.vehicleDetailsForm?.value.coy != null &&
      this.vehicleDetailsForm?.value.coy != ''){
        this.fetchRequestAPI = 'company/fetch-prop-details-by-coycode?companyCode='+Coy;
        console.log("API: ", this.fetchRequestAPI)
        this.vehicleExpService.getEquipPropByCoy(this.fetchRequestAPI) .subscribe((res: any) => {
          if(res.status){
            console.log(res.data);
            this.vehicleDetailsForm.patchValue({
               prop: res.data.propCode,
               propDesc: res.data.propName
              
            })
          }
        });
    }

  }

}

// Find string - "Replace with " in above script and replace with actuals
// Remove convertValuesToUpper() Method definition and call if not required
// Remove deleteEquip() Method definition and call if not required
