// Developed By  - 	Rahul & Vikram
// Mode  - Data Entry
// Class Name - BuildingEntryComponent
// .Net Form Name - FrmBuildFlatDetails_EntryEdit
// PB Window Name - \fa\projl\fapjde1\w_pjbdde01
// Purpose - Enter Building Details (Used in Arch module)
// ' Reports Used -

// ' Modification Details
// '=======================================================================================================================================================
// ' Date		Author  Version User    Reason
// '=======================================================================================================================================================

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { of, take } from 'rxjs';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ProjbldgService } from 'src/app/services/arch/projbldg.service';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { AddressComponent } from 'src/app/components/common/address/address.component';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import * as commonconstant from '../../../../../../constants/commonconstant';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
//import Swal from 'sweetalert2';

@Component({
  selector: 'app-building-entry',
  templateUrl: './building-entry.component.html',
  styleUrls: ['./building-entry.component.css'],
})
export class BuildingEntryComponent implements OnInit, AfterViewInit {
  //these variable are used for avoiding udation of values of wing and flatnumber in grid in case if user go through textbox repeatedly after inserting new value.
  // prevFlatwing:string = '';//related to input control's value of flat's grid
  // prevFlatnum:string = '';//related to input control's value of flat's grid
  // nextFlatwing:string = '';//related to input control's value of flat's grid
  // nextFlatnum:string = '';//related to input control's value of flat's grid
  
  wingColHeadings!: any[];
  wingTypeF1List!: any;
  wingF1Bbc!: any; // wing F1 Bring Back Column

  accomTypeColHeadings!: any[];
  accomTypeF1List!: any;
  accomTypeF1Bbc!: any; // Flat Accomodation type F1 Bring Back Column
  datePipe = new DatePipe('en-US');
  bldgCodeColHeadings!: any[];
  bldgCodeF1List!: any;
  bldgCodeF1Bbc!: any; // Building Code F1 Bring Back Column

  projectColHeadings!: any[];
  projectF1List!: any;
  projectF1Bbc!: any; // Project Code F1 Bring Back Column

  misprojectColHeadings!: any[];
  misprojectF1List!: any;
  misprojectF1Bbc!: any; //MIS Project Code F1 Bring Back Column

  maintCoyColHeadings!: any[];
  maintCoyF1List!: any;
  maintCoyF1Bbc!: any; //Maintenance Company F1 Bring Back Column

  misbuildingColHeadings!: any[];
  misbuildingF1List!: any;
  misbuildingF1Bbc!: any; // MIS Building Code F1 Bring Back Column

  parentBldgColHeadings!: any[];
  parentBldgF1List!: any;
  parentBldgF1Bbc!: any; // Parent Building Code F1 Bring Back Column

  propColHeadings!: any;
  propF1List!: any;
  propF1Bbc!: any; // Proprietor Code F1 Bring Back Column
  propDynaPop!: any; //Query condition for Company F1

  opt2EnggCompanyColHeadings!: any;
  opt2EnggCompanyF1List!: any;
  opt2EnggCompanyF1Bbc!: any; // Option 2 Engg Company F1 Bring Back Column

  opt2SalesCompanyColHeadings!: any;
  opt2SalesCompanyF1List!: any;
  opt2SalesCompanyF1Bbc!: any; // Option 2 Sales Company F1 Bring Back Column

  intBrokCompanyColHeadings!: any;
  intBrokCompanyF1List!: any;
  intBrokCompanyF1Bbc!: any; // Int Brokerage Company F1 Bring Back Column

  leaseCompanyColHeadings!: any;
  leaseCompanyF1List!: any;
  leaseCompanyF1Bbc!: any; // Leasing Company F1 Bring Back Column

  owningCompanyColHeadings!: any;
  owningCompanyF1List!: any;
  owningCompanyF1Bbc!: any; // Owning Company F1 Bring Back Column

  minfCoyColHeadings!: any;
  minfCoyF1List!: any;
  minfCoyF1Bbc!: any; // Mailinfo Company F1 Bring Back Column

  minfCityColHeadings!: any;
  minfCityF1List!: any;
  minfCityF1Bbc!: any; // Mailinfo Company F1 Bring Back Column

  minfTownshipColHeadings!: any;
  minfTownshipF1List!: any;
  minfTownshipF1Bbc!: any; // Mailinfo Company F1 Bring Back Column

  minfProjectColHeadings!: any;
  minfProjectF1List!: any;
  minfProjectF1Bbc!: any; // Mailinfo project F1 Bring Back Column

  payingCompanyColHeadings!: any;
  payingCompanyF1List!: any;
  payingCompanyF1Bbc!: any; // Paying Company F1 Bring Back Column

  contractingCompanyColHeadings!: any;
  contractingCompanyF1List!: any;
  contractingCompanyF1Bbc!: any; // Contracting Company Code F1 Bring Back Column

  propertyColHeadings!: any;
  propertyF1List!: any;
  propertyF1Bbc!: any; // Proprietor Code F1 Bring Back Column

  cityColHeadings!: any;
  cityF1List!: any;
  cityF1Bbc!: any; // City Code F1 Bring Back Column

  townshipColHeadings!: any;
  townshipF1List!: any;
  townshipF1Bbc!: any; // Township Code F1 Bring Back Column

  bldgTypeColHeadings!: any;
  bldgTypeF1List!: any;
  bldgTypeF1Bbc!: any; // Building type Code F1 Bring Back Column

  addressData: any;
  //bringBackColumn!: number;
  //accomTypeColumnHeader: any = []
  //accomTypeData: any;
  TabPressedOnChange: boolean = false;
  onInputAltSPressed: boolean = false;
  flatDetailsData: any = [];
  accomTypeQueryCodition!: string;
  receivedAddressData!: FormGroup;
  receivedFlatDetailsData!: FormGroup;
  initialMode: Boolean = false;
  deleteDisabled: Boolean = true;
  tranMode: String = '';
  isDeleteClicked: boolean = false;
  isBackClicked: boolean = false;
  activeTabStringValue: string = 'accountSensitiveDetails';
  //navTab:string = "" NS 30.01.2023 vikram has already used activeTabStringValue which is not as specified by Neosoft standard.

  buildingSelectionsForm: FormGroup = new FormGroup({
    code: new FormControl<string[]>([], [Validators.required]),
    //bldgName: new FormControl<String | null>({ value: '', disabled: true }), NS 27.01.2023 this line is nolonger used as old F1 control is replaced by new F1 control so name field required for description is not needed.
  }); // Form Group for Selection input fields

  buildingForm: FormGroup = new FormGroup({
    //following field is a part of solution for getting value return in next part of next method in service call inseide the component.
    // Form Group for Account Sensitive Building Details Entry / Edit
    name: new FormControl<String>('', [
      Validators.maxLength(50),
      Validators.required,
    ]),
    salesname: new FormControl<String>('', [
      Validators.maxLength(50)
    ]),
    project: new FormControl<string[]>([], [Validators.required]),
    projName: new FormControl<String | null>({ value: '', disabled: true }),
    prop: new FormControl<String>('', [
      Validators.maxLength(5),
      Validators.required,
    ]),
    propName: new FormControl<String | null>({ value: '', disabled: true }),
    coy: new FormControl<String>('', [
      Validators.maxLength(5),
      Validators.required,
    ]),
    owningCompanyName: new FormControl<String | null>({
      value: '',
      disabled: true,
    }),
    opt2engg: new FormControl<String>('', [
      Validators.maxLength(5)
    ]),
    opt2EnggCompanyName: new FormControl<String | null>({
      value: '',
      disabled: true,
    }),
    opt2sales: new FormControl<String>('', [
      Validators.maxLength(5)
    ]),
    opt2SalesCompanyName: new FormControl<String | null>({
      value: '',
      disabled: true,
    }),
    intbrokcoy: new FormControl<String>('', [
      Validators.maxLength(5)
    ]),
    intBrokCompanyName: new FormControl<String | null>({
      value: '',
      disabled: true,
    }),
    leasingcoy: new FormControl<String>('', [
      Validators.maxLength(5)
    ]),
    leaseCompanyName: new FormControl<String | null>({
      value: '',
      disabled: true,
    }),
    paycoy: new FormControl<String>('', [
      Validators.maxLength(5),
      Validators.required
    ]),
    payingCompanyName: new FormControl<String | null>({
      value: '',
      disabled: true,
    }),
    concoy: new FormControl<String>('', [
      Validators.maxLength(5)
    ]),
    contractingCompanyName: new FormControl<String | null>({
      value: '',
      disabled: true,
    }),
    property: new FormControl<String>('', [
      Validators.maxLength(5)
    ]),
    propertyName: new FormControl<String | null>({ value: '', disabled: true }),
    city: new FormControl<String>('', [
      Validators.maxLength(5),
      Validators.required,
    ]),
    cityName: new FormControl<String | null>({ value: '', disabled: true }),
    surveynum: new FormControl<String>('', [Validators.maxLength(20)]),
    tenure: new FormControl<String>('', [Validators.maxLength(1)]),
    township: new FormControl<String>('', [
      Validators.maxLength(5),
      Validators.required,
    ]),
    townshipName: new FormControl<String | null>({ value: '', disabled: true }),
    bldgtype: new FormControl<String>('', [
      Validators.maxLength(1),
      Validators.required
    ]),
    bldgTypeName: new FormControl<String | null>({ value: '', disabled: true }),
  });

  buildingForm2: FormGroup = new FormGroup({
    // Form Group for Architectural Sensitive Building Details Entry / Edit
    misproject: new FormControl<String>('', [
      Validators.maxLength(5),
      Validators.required
    ]),
    misProjName: new FormControl<String | null>({ value: '', disabled: true }),
    misbldg: new FormControl<String>('', [
      Validators.maxLength(4)
    ]),
    misBldgName: new FormControl<String | null>({ value: '', disabled: true }),
    maintcoy: new FormControl<String>('', [
      Validators.maxLength(5)
    ]),
    maintCoyName: new FormControl<String | null>({ value: '', disabled: true }),
    // parentBldg: new FormControl<String>('', [
    //   Validators.maxLength(4),
    //   Validators.required,
    // ]), //NS 23.02.2023 NOT REQUIRED
    parentbldg: new FormControl<String | null>(''),

    parentBldgName: new FormControl<String>(''),
    infrayn: new FormControl<String | null>({ value: '', disabled: true }),
    maintrate: new FormControl(),
    modagdoc: new FormControl<String>('', [Validators.maxLength(15)]),
    elecsupp: new FormControl<String>('', [Validators.maxLength(15)]),
    //region: new FormControl<String>('', [Validators.maxLength(4)]),
    region: new FormControl<string[]>(
      [],
      [Validators.required, Validators.maxLength(4)]
    ), //NS 11.03.2023
    remark: new FormControl<String>('', [Validators.maxLength(20)]),
    opendate: new FormControl<Date|null>(null), //NS 31.01.2023 30.03.2023
    closedate: new FormControl<Date>(
      moment('01/01/2050').toDate()
    ), //NS 31.01.2023 01.03.2023
    occdate: new FormControl<Date|null>(null), //NS 31.01.2023 01.03.2023 30.03.2023
    schposs: new FormControl<Date|null>(null), //NS 01.03.2023 01.03.2023 30.03.2023
    ccdate: new FormControl<Date|null>(null), //NS 31.01.2023 01.03.2023 30.03.2023
    ulcdate: new FormControl<Date|null>(null), //NS 31.01.2023 01.03.2023 30.03.2023
    areaengg: new FormControl(),
    areasales: new FormControl(),
    areaarch: new FormControl(),
  });

  mailInfoForm: FormGroup = new FormGroup({
    // Form Group for Mail Info Details Entry / Edit
    //NS 22.02.2023 minfCoy: new FormControl<String | null>(''),
    coy: new FormControl<String | null>(''),
    minfCoyName: new FormControl<String | null>({ value: '', disabled: true }),
    project: new FormControl<String | null>(''),
    minfProjName: new FormControl<String | null>({ value: '', disabled: true }),
    city: new FormControl<String | null>('', Validators.required),
    minfCityName: new FormControl<String | null>({ value: '', disabled: true }),
    township: new FormControl<String | null>('', Validators.required),
    minfTownshipName: new FormControl<String | null>({
      value: '',
      disabled: true,
    }),
    tenure: new FormControl<String>('', [Validators.maxLength(1)]),
    possdate: new FormControl<Date | null>(null), //NS 31.01.2023 10.02.2023 01.03.2023
    area1: new FormControl<String>('', [Validators.maxLength(50)]),
    area2: new FormControl<String>('', [Validators.maxLength(50)]),
    area3: new FormControl<String>('', [Validators.maxLength(50)]),
    config1: new FormControl<String>('', [Validators.maxLength(60)]),
    config2: new FormControl<String>('', [Validators.maxLength(60)]),
    config3: new FormControl<String>('', [Validators.maxLength(60)]),
    config4: new FormControl<String>('', [Validators.maxLength(60)]),
    amenity1: new FormControl<String>('', [Validators.maxLength(30)]),
    amenity2: new FormControl<String>('', [Validators.maxLength(30)]),
    amenity3: new FormControl<String>('', [Validators.maxLength(30)]),
    amenity4: new FormControl<String>('', [Validators.maxLength(30)]),
    amenity5: new FormControl<String>('', [Validators.maxLength(30)]),
  });

  flatDetailsForm: FormGroup = new FormGroup({
    // Form Group for Flat Details Entry / Edit
    //--------------------NS 25.01.2023 Flat Details Start--------------------------------
    flatDetailsBreakup: new FormArray(
      [
        this.fb.group({
          //flat details start below
          wing: new FormControl<string>(''),
          floor: new FormControl<string>(''),
          flatnum: new FormControl<string>('', Validators.required),
          accomtype: new FormControl<string>(''),
          config: new FormControl<string>(''),
          //salable area realted four properties as below
          bunitarea: new FormControl<string>('0', Validators.required),
          bparkarea: new FormControl<string>('0', Validators.required),
          bteraarea: new FormControl<string>('0', Validators.required),
          bamenarea: new FormControl<string>('0', Validators.required),
          //carpet area realted four properties as below
          cunitarea: new FormControl<string>('0', Validators.required),
          cparkarea: new FormControl<string>('0', Validators.required),
          cteraarea: new FormControl<string>('0', Validators.required),
          camenarea: new FormControl<string>('0', Validators.required),
          occupdate: new FormControl<string | null>(null), //NS 31.01.2023
          //sold status related one property as below
          soldyn: new FormControl<string>('0'),
          //RERA realted two properties as below
          curera: new FormControl<string>('0'),
          enclbalcrera: new FormControl<string>('0'),
          //other properties
          // coy: new FormControl<string>(''),
          // origcoy: new FormControl<string>(''),
          // remarks: new FormControl<string>(''),
          // ownerid:new FormControl<string>(''),
          // agprice:new FormControl<string>('0'),
          // intrate:new FormControl<string>('0'),
          // amtrec: new FormControl<string>('0'),
          // amtos: new FormControl<string>('0'),
          // loanamt:new FormControl<string>('0'),
          // loanpaid: new FormControl<string>('0'),
          // maintrate:new FormControl<string>('0'),
          // bldgcode: new FormControl<string>(''),
          // origsite: new FormControl<string|null>(''),
          // site: new FormControl<string>(''),
          //other properties which are not part of UI appearance.
          coy: new FormControl<string>(''),
          origcoy: new FormControl<string>(''),
          remarks: new FormControl<string | null>(null),
          ownerid: new FormControl<string>(''),
          agprice: new FormControl<string | null>(null),
          intrate: new FormControl<string | null>(null),
          amtrec: new FormControl<string | null>(null),
          amtos: new FormControl<string | null>(null),
          loanamt: new FormControl<string | null>(null),
          loanpaid: new FormControl<string | null>(null),
          maintrate: new FormControl<string | null>(null),
          bldgcode: new FormControl<string>(''),
          //following two fields are not part of database column, these fields are sent because these fields are utilized while updating the old records.16.02.2023
          oldwing: new FormControl<string>(''),
          oldflatnum: new FormControl<string>(''),
          //will help to determine which database operation needs to be performed. where 'I' = insert and 'U' = update
          dboperation: new FormControl<string>(''),
        })
      ]
    ),
  });
  //--------------------NS 25.01.2023 Flat Details Form Group End--------------------------------

  //--------------------NS 30.01.2023 Start------------------------------
  //following flags will help to make buttons on bottom panel disappear/visible through fucntion namely "setActionButtonsFlag(5 paraemters)"".
  disabledFlagAddRow!: boolean;
  disabledFlagBack!: boolean;
  disabledFlagRetrieve!: boolean;
  disabledFlagAdd!: boolean;
  disabledFlagSave!: boolean;
  //--------------------NS 30.01.2023 End------------------------------

  sumOfCarpetUnitArea: any = 0;
  sumOfCarpetParkArea: any = 0;
  sumOfCarpetTerraceArea: any = 0;
  sumOfCarpetAmenityArea: any = 0;

  sumOfSalableUnitArea: any = 0;
  sumOfSalableParkArea: any = 0;
  sumOfSalableTerraceArea: any = 0;
  sumOfSalableAmenityArea: any = 0;
  @ViewChild(F1Component) initFocus!: F1Component;
  @ViewChild(AddressComponent) addressComponent!: AddressComponent;
  wingF1List: any;

  constructor(
    private projbldgService: ProjbldgService,
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private cdref: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: ModalService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private el: ElementRef,
    private router: Router
  ) {
    this.setActionButtonsFlag(false, false, true, true, true); //NS 30.01.2023
    this.flatDetailsBreakupFormArr.clear(); //NS 31.01.2023 this line is a solution for garbage row that come into flats datagridview after clicking on ADD button which contains garbage value for the sold column as '0'(zero) instead of Y/N.
    this.buildingSelectionsForm.get('code')?.setValue(''); //NS 10.03.2023  this line is added because Neosofts dynapop control provided by Dilip does not provided me the provision to handle the situation of array which is placed by default in F1 dynapop control that later result in error at runtime while accessing building code when we retrieve while building code is not provided.
    this.setFocus('code');
  }

  //--------------------NS 31.01.2023 Start------------------------------
  //this logic will help to make 'Add row' button active only when click on tab(4th) namely 'Flat Details'
  // ngAfterViewChecked() {

  //     if (this.activeTabStringValue == 'Flat Details') {
  //       //if property value is 'Flat Details' && Add button is disabled.
  //     console.log("ethe error ahe");

  //       this.setActionButtonsFlag(true, true, false, false, false);
  //     } else if (
  //       this.activeTabStringValue == 'Account Sensitive Building Details' ||
  //       this.activeTabStringValue ==
  //         'Architectural Sensitive Building Details' ||
  //       this.activeTabStringValue == 'Mail Info Details' ||
  //       this.activeTabStringValue == 'Address Detail'
  //     ) {
  //       this.setActionButtonsFlag(true, true, true, false, false);
  //     }

  // }
  //--------------------NS 31.01.2023 End--------------------------------

  //--------------------NS 30.01.2023 Start------------------------------
  //following flags will help to make buttons on bottom panel disappear/visible.
  setActionButtonsFlag(
    add: boolean,
    retrieve: boolean,
    addRow: boolean,
    back: boolean,
    save: boolean
  ): void {
    this.disabledFlagAddRow = addRow;
    this.disabledFlagBack = back;
    this.disabledFlagRetrieve = retrieve;
    this.disabledFlagAdd = add;
    this.disabledFlagSave = save;
  }
  //--------------------NS 30.01.2023 End------------------------------
  ngOnInit(): void {
    //Following commented code is for trying generic calling of F1 component (not working)
    // this.createF1Data(
    //   'BUILDINGS',
    //   '',
    //   this.bldgCodeColHeadings
    // );
    // console.log("Check payload",this.createF1Data(
    //   'BUILDINGS',
    //   '',
    //   this.bldgCodeColHeadings
    // ))
    // this.bldgCodeColHeadings = [
    //   this.bldgCodeF1List?.colhead1,
    //   this.bldgCodeF1List?.colhead2,
    //   this.bldgCodeF1List?.colhead3,
    //   this.bldgCodeF1List?.colhead4,
    //   this.bldgCodeF1List?.colhead5,
    // ];
    // this.bldgCodeF1Bbc = this.bldgCodeF1List?.bringBackColumn;
    // this.projectF1List = this.createF1Data(
    //   'PROJECTS',
    //   '',
    //   this.buildingForm,
    //   this.projectF1List,
    //   this.projectF1Bbc
    // );
    // this.projectF1Bbc = this.projectF1List?.bringBackColumn;
    // this.projectF1List  = this.createF1Data(
    //   'PROJECTS',
    //   '',
    //   this.buildingForm
    // );
    // console.log("Bldg List",this.bldgCodeF1List);
    // this.propF1List  = this.createF1Data(
    //   'PROPRIETOR',
    //   '',
    //   this.propColHeadings
    // );
    // this.propF1Bbc = this.propF1List?.bringBackColumn;
    //this.createF1Data('BUILDINGS','',this.bldgCodeColHeadings,this.bldgCodeF1List,this.bldgCodeF1Bbc)

    this.crateF1DataForAccomType(); // Method to create F1 for Flat Accomodation type
    this.crateF1DataForBuildings(); // Method to create F1 for Buildings
    this.crateF1DataForProrietor(); // Method to create F1 for Proprietor
    this.crateF1DataForProjects(); // Method to create F1 for Projects
    this.crateF1DataForMisProjects(); // Method to create F1 for MIS Projects
    this.crateF1DataForMisBuildings(); // Method to create F1 for MIS Buildings
    this.crateF1DataForMaintCoy(); // Method to create F1 for Maintenance Company
    this.crateF1DataForParentBldg(); // Method to create F1 for Parent Building
    this.crateF1DataForContractingCompany(); // Method to create F1 for Contracting Company
    this.crateF1DataForOwningCompany(); // Method to create F1 for Owning Company
    this.crateF1DataForMinfCoy(); // Method to create F1 for Mailinfo Company
    this.crateF1DataForMinfCity(); // Method to create F1 for Mailinfo City
    this.crateF1DataForMinfTownship(); // Method to create F1 for Mailinfo Township
    this.crateF1DataForMinfProject(); // Method to create F1 for Mailinfo Project
    this.crateF1DataForOpt2EnggCompany(); // Method to create F1 for engg Company
    this.crateF1DataForOpt2SalesCompany(); // Method to create F1 for sales Company
    this.crateF1DataForIntBrokCompany(); // Method to create F1 for intBrok Company
    this.crateF1DataForLeaseCompany(); // Method to create F1 for leasing Company
    this.crateF1DataForPayingCompany(); // Method to create F1 for Paying Company
    this.crateF1DataForProperty(); // Method to create F1 for Property
    this.crateF1DataForCity(); // Method to create F1 for City
    this.crateF1DataForTownship(); // Method to create F1 for Township
    this.crateF1DataForBldgType(); // Method to create F1 for Building Type
    this.createF1DataForWing(); //NS 11.03.2023 Method to create F1 for Wing
  }

  //Following commented code is for trying generic calling of F1 component (not working)
  // LoopForF1List() {
  //   this.F1ListArray.forEach((val: any) => {
  //     this.bldgCodeF1List = this.createF1Data(
  //     'BUILDINGS',
  //     '',
  //     this.buildingSelectionsForm
  //   );
  //   });
  // }
  public get flatDetailsBreakupFormArr(): FormArray {
    return this.flatDetailsForm.get('flatDetailsBreakup') as FormArray;
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngAfterViewInit(): void {
    // this.initFocus.fo1.nativeElement.focus();
  }

  //Following commented code is for trying generic calling of F1 component (not working)
  // createF1Data(
  //   popID: String,
  //   extraFilter: String,
  //   colHeaderName: any
  // ) {
  //   // Method to create F1 List
  //   console.log(popID);
  //   console.log(extraFilter);
  //   this.dynapop.getDynaPopListObj(popID, extraFilter).subscribe((res: any) => {
  //     colHeaderName = [
  //       res.data.colhead1,
  //       res.data.colhead2,
  //       res.data.colhead3,
  //       res.data.colhead4,
  //       res.data.colhead5,
  //     ];
  //     console.log("From Method",res.data);
  //     this.bldgCodeF1List = res.data;

  //     //f1Bbc = res.data.bringBackColumn;
  //     //return of(res.data);
  //     console.log(this.bldgCodeF1List );
  //   });
  // }

  crateF1DataForAccomType() {
    // Method to create F1 for Brokers List
    this.dynapop
      .getDynaPopListObj('ACCOMMODATION', '')
      .subscribe((res: any) => {
        this.accomTypeColHeadings = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.accomTypeF1List = res.data;
        this.accomTypeF1Bbc = res.data.bringBackColumn;
      });
  }

  crateF1DataForBuildings() {
    // Method to create F1 for Brokers List
    this.dynapop.getDynaPopListObj('BUILDINGS', '').subscribe((res: any) => {
      this.bldgCodeColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.bldgCodeF1List = res.data;
      this.bldgCodeF1Bbc = res.data.bringBackColumn;
    });
  }

  //Following commented code is for trying generic coding for initialising description value if User types and tabs out from the field(not working)
  // displayDescription(e: any,FormGroupName: FormGroup , DescColumn: any) {
  //   // Used this method in html to initialise Building Name value
  //   console.log('DescCodisplayDescriptionlumn',e[1]);
  //   if (e.length) {
  //     // FormGroupName.patchValue({
  //     //   DescColumn: e[1],

  //     // });
  //     FormGroupName.controls[DescColumn].setValue(e[1]);
  //     console.log('FormGroupName',FormGroupName);
  //     console.log('DescColumn',DescColumn)
  //     console.log('DescColumn',e[1]);
  //   }
  // }

  getBldgCode(e: any) {
    // Used this method in html to initialise Building Name value
    if (e.length) {
      this.buildingSelectionsForm.patchValue({
        bldgName: e[1],
      });
    }
  }

  // Following code is given by Dilip for displaying description value and changed
  updateOnChangeBldgList(event: any) {
    console.log('tabledata', this.bldgCodeF1List);
    const result = this.bldgCodeF1List.dataSet.filter((s: any, i: any) => {
      if (
        this.bldgCodeF1List.dataSet[i][0].trim() ===
        event?.target?.value.toUpperCase()
      ) {
        return this.bldgCodeF1List.dataSet[i];
      } else {
        return null;
      }
    });
    if (event?.target?.value) {
      if (result.length == 0) {
        this.buildingSelectionsForm.patchValue({
          reportParameters: { code: '' },
        });
      } else {
        this.buildingSelectionsForm.patchValue({
          reportParameters: {
            bldgName: result[0][1].trim(),
          },
        });
      }
    }
    // if (event?.target?.value == '') {
    //   this.rendered.selectRootElement(this.comp?.fo1?.nativeElement)?.focus()
    // }
  }

  crateF1DataForProjects() {
    // Method to create F1 for Project List
    this.dynapop.getDynaPopListObj('PROJECTS', '').subscribe((res: any) => {
      this.projectColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.projectF1List = res.data;
      this.projectF1Bbc = res.data.bringBackColumn;
    });
  }

  getProject(e: any) {
    // Used this method in html to initialise Project Name value
    if (e.length) {
      this.buildingForm.patchValue({
        projName: e[1],
      });
    }
  }

  getProjectMailInfo(e: any) {
    // Used this method in html to initialise Project Name value
    if (e.length) {
      this.mailInfoForm.patchValue({
        minfProjName: e[1],
      });
    }
  }
  setValueToBlankForProjectNameField()
  {
    if(this.mailInfoForm.get("project")?.value.trim() == "")
    {
      this.mailInfoForm.get("minfProjName")?.setValue("");
    }
  }

  crateF1DataForMisProjects() {
    // Method to create F1 for MIS Project List
    this.dynapop.getDynaPopListObj('PROJECTS', '').subscribe((res: any) => {
      this.misprojectColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.misprojectF1List = res.data;
      this.misprojectF1Bbc = res.data.bringBackColumn;
    });
  }

  crateF1DataForMaintCoy() {
    // Method to create F1 for Maintenance Company List
    this.dynapop.getDynaPopListObj('COMPANY', '').subscribe((res: any) => {
      this.maintCoyColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.maintCoyF1List = res.data;
      this.maintCoyF1Bbc = res.data.bringBackColumn;
    });
  }

  getMaintCoy(e: any) {
    // Used this method in html to initialise Maintenance Company Name value
    if (e.length) {
      this.buildingForm2.patchValue({
        maintCoyName: e[1],
      });
    }
  }
  setValueToBlankForMaintainanceCoyNameField()
  {
    if(this.buildingForm2.get("maintcoy")?.value.trim() == "")
    {
      this.buildingForm2.get("maintCoyName")?.setValue("");
    }
  }
misProjectCurrentValue!:any;
  getMisProject(e: any) {
    // Used this method in html to initialise MIS Project Name value
    if (e.length) {
      this.misProjectCurrentValue=e[0].trim();
      this.buildingForm2.patchValue({
        misProjName: e[1],
        misproject: e[0].trim() //NS 11.04.2023
      });
    }
  }

  setValueToBlankForMisProjNameField()
  {
    if(this.buildingForm2.get("misproject")?.value.trim() == "")
    {
      this.buildingForm2.get("misProjName")?.setValue("");
    }
  }

  createF1DataForWing() {
    //NS 11.03.2023 Method to create F1 for Wing List.
    this.dynapop.getDynaPopListObj('WINGS', '').subscribe((res: any) => {
      this.wingColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.wingF1List = res.data;
      this.wingF1Bbc = res.data.bringBackColumn;
    });
  }
  crateF1DataForMisBuildings() {
    // Method to create F1 for MIS Building List
    this.dynapop.getDynaPopListObj('BUILDINGS', '').subscribe((res: any) => {
      this.misbuildingColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.misbuildingF1List = res.data;
      this.misbuildingF1Bbc = res.data.bringBackColumn;
    });
  }

  crateF1DataForParentBldg() {
    // Method to create F1 for Parent Building List
    this.dynapop.getDynaPopListObj('BUILDINGS', '').subscribe((res: any) => {
      this.parentBldgColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.parentBldgF1List = res.data;
      this.parentBldgF1Bbc = res.data.bringBackColumn;
    });
  }

  getMisBuilding(e: any) {
    // Used this method in html to initialise MIS Building Name value
    if (e.length) {
      this.buildingForm2.patchValue({
        misBldgName: e[1],
      });
    }
  }

  setValueToBlankForMisBldgNameField()
  {
    if(this.buildingForm2.get("misbldg")?.value.trim() == "")
    {
      this.buildingForm2.get("misBldgName")?.setValue("");
    }
  }
  getParentBldg(e: any) {
    // Used this method in html to initialise Parent Building Name value
    if (e.length) {
      this.buildingForm2.patchValue({
        parentBldgName: e[1],
      });
    }
  }
  setValueToBlankForParentBldgNameField()
  {
    if(this.buildingForm2.get("parentbldg")?.value.trim() == "")
    {
      this.buildingForm2.get("parentBldgName")?.setValue("");
    }
  }
  crateF1DataForProrietor() {
    // Method to create F1 for Proprietor List
    this.dynapop.getDynaPopListObj('PROPRIETOR', '').subscribe((res: any) => {
      this.propColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.propF1List = res.data;
      this.propF1Bbc = res.data.bringBackColumn;
    });
  }

  getProprietor(e: any) {
    // Used this method in html to initialise Proprietor Name value
    if (e.length) {
      this.buildingForm.patchValue({
        propName: e[1],
      });
      //  this.propDynaPop = `coy_code='${[this.propF1Bbc]}'`
      //  this.crateF1DataForOwningCompany()
    }
  }
  setValueToBlankForProprietorNameField()
  {
    if(this.buildingForm.get("prop")?.value.trim() == "")
    {
      this.buildingForm.get("propName")?.setValue("");
    }
  }

  crateF1DataForOwningCompany() {
    // Method to create F1 for Owning Company List
    this.dynapop.getDynaPopListObj('COMPANY', '').subscribe((res: any) => {
      this.owningCompanyColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.owningCompanyF1List = res.data;
      this.owningCompanyF1Bbc = res.data.bringBackColumn;
    });
  }

  crateF1DataForMinfCoy() {
    // Method to create F1 for Owning Company List
    this.dynapop.getDynaPopListObj('COMPANY', '').subscribe((res: any) => {
      this.minfCoyColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.minfCoyF1List = res.data;
      this.minfCoyF1Bbc = res.data.bringBackColumn;
    });
  }

  crateF1DataForMinfCity() {
    // Method to create F1 for Owning Company List
    this.dynapop.getDynaPopListObj('CITIES', '').subscribe((res: any) => {
      this.minfCityColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.minfCityF1List = res.data;
      this.minfCityF1Bbc = res.data.bringBackColumn;
    });
  }
  crateF1DataForMinfTownship() {
    // Method to create F1 for Owning Company List
    this.dynapop.getDynaPopListObj('TOWNS', '').subscribe((res: any) => {
      this.minfTownshipColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.minfTownshipF1List = res.data;
      this.minfTownshipF1Bbc = res.data.bringBackColumn;
    });
  }

  crateF1DataForMinfProject() {
    // Method to create F1 for Owning Company List
    this.dynapop.getDynaPopListObj('PROJECTS', '').subscribe((res: any) => {
      this.minfProjectColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.minfProjectF1List = res.data;
      this.minfProjectF1Bbc = res.data.bringBackColumn;
    });
  }
  crateF1DataForOpt2EnggCompany() {
    // Method to create F1 for Option 2 Engg Company List
    this.dynapop.getDynaPopListObj('COMPANY', '').subscribe((res: any) => {
      this.opt2EnggCompanyColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.opt2EnggCompanyF1List = res.data;
      this.opt2EnggCompanyF1Bbc = res.data.bringBackColumn;
    });
  }
  crateF1DataForOpt2SalesCompany() {
    // Method to create F1 for Option 2 Sales Company List
    this.dynapop.getDynaPopListObj('COMPANY', '').subscribe((res: any) => {
      this.opt2SalesCompanyColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.opt2SalesCompanyF1List = res.data;
      this.opt2SalesCompanyF1Bbc = res.data.bringBackColumn;
    });
  }
  crateF1DataForIntBrokCompany() {
    // Method to create F1 for Int Brokerage Company List
    this.dynapop.getDynaPopListObj('COMPANY', '').subscribe((res: any) => {
      this.intBrokCompanyColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.intBrokCompanyF1List = res.data;
      this.intBrokCompanyF1Bbc = res.data.bringBackColumn;
    });
  }
  crateF1DataForLeaseCompany() {
    // Method to create F1 for leasing Company List
    this.dynapop.getDynaPopListObj('COMPANY', '').subscribe((res: any) => {
      this.leaseCompanyColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.leaseCompanyF1List = res.data;
      this.leaseCompanyF1Bbc = res.data.bringBackColumn;
    });
  }
  getproperty(e: any) {
    // Used this method in html to initialise property Name value
    if (e.length) {
      this.buildingForm.patchValue({
        propertyName: e[1],
      });
    }
  }
  setValueToBlankForPropertyNameField()
  {
    if(this.buildingForm.get("property")?.value.trim() == "")
    {
      this.buildingForm.get("propertyName")?.setValue("");
    }
  }

  getcity(e: any) {
    // Used this method in html to initialise City Name value
    if (e.length) {
      this.buildingForm.patchValue({
        cityName: e[1],
      });
    }
  }
  setValueToBlankForBuildingFormCityNameField()
  {
    if(this.buildingForm.get("city")?.value.trim() == "")
    {
      this.buildingForm.get("cityName")?.setValue("");
    }
  }


  gettownship(e: any) {
    // Used this method in html to initialise Township Name value
    if (e.length) {
      this.buildingForm.patchValue({
        townshipName: e[1],
      });
    }
  }

  setValueToBlankForBuildingFormTownshipNameField()
  {
    if(this.buildingForm.get("township")?.value.trim() == "")
    {
      this.buildingForm.get("townshipName")?.setValue("");
    }
  }


  getbldgType(e: any) {
    // Used this method in html to initialise Building Type Name value
    if (e.length) {
      this.buildingForm.patchValue({
        bldgTypeName: e[1],
        bldgtype: e[0].trim(), //YC 28.02.2023 FIX FOR THE TRIM VALUE SO THAT FIELD ON FORM SHOULD NOT GIVE VALIDATION ERROR BECAUSE BRING BACK COLUMN IS RETREIVING THE BLANK SPACE ALONG WITH THE CHARACTER.
      });
    }
  }
  setValueToBlankForBldgTypeNameField()
  {
    if(this.buildingForm.get("bldgtype")?.value.trim() == "")
    {
      this.buildingForm.get("bldgTypeName")?.setValue("");
    }
  }

  crateF1DataForPayingCompany() {
    // Method to create F1 for Paying Company List
    this.dynapop.getDynaPopListObj('COMPANY', '').subscribe((res: any) => {
      this.payingCompanyColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.payingCompanyF1List = res.data;
      this.payingCompanyF1Bbc = res.data.bringBackColumn;
    });
  }

  getPayingCompany(e: any) {
    // Used this method in html to initialise Paying Company Name value
    if (e.length) {
      this.buildingForm.patchValue({
        payingCompanyName: e[1],
      });
    }
  }
  setValueToBlankForPayingComapnyNameField()
  {
    if(this.buildingForm.get("paycoy")?.value.trim() == "")
    {
      this.buildingForm.get("payingCompanyName")?.setValue("");
    }
  }

  crateF1DataForContractingCompany() {
    // Method to create F1 for Contracting Company List
    this.dynapop.getDynaPopListObj('COMPANY', '').subscribe((res: any) => {
      this.contractingCompanyColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.contractingCompanyF1List = res.data;
      this.contractingCompanyF1Bbc = res.data.bringBackColumn;
    });
  }

  getContractingCompany(e: any) {
    // Used this method in html to initialise Contracting Company Name value
    if (e.length) {
      this.buildingForm.patchValue({
        contractingCompanyName: e[1],
      });
    }
  }
  setValueToBlankForContractingCompanyNameField()
  {
    if(this.buildingForm.get("concoy")?.value.trim() == "")
    {
      this.buildingForm.get("contractingCompanyName")?.setValue("");
    }
  }
  

  crateF1DataForProperty() {
    // Method to create F1 for Property List
    this.dynapop.getDynaPopListObj('PROPERTY', '').subscribe((res: any) => {
      this.propertyColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.propertyF1List = res.data;
      this.propertyF1Bbc = res.data.bringBackColumn;
    });
  }

  crateF1DataForCity() {
    // Method to create F1 for City List
    this.dynapop.getDynaPopListObj('CITIES', '').subscribe((res: any) => {
      this.cityColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.cityF1List = res.data;
      this.cityF1Bbc = res.data.bringBackColumn;
    });
  }

  crateF1DataForTownship() {
    // Method to create F1 for Township List
    this.dynapop.getDynaPopListObj('TOWNS', '').subscribe((res: any) => {
      this.townshipColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.townshipF1List = res.data;
      this.townshipF1Bbc = res.data.bringBackColumn;
    });
  }

  crateF1DataForBldgType() {
    // Method to create F1 for Building Type List
    this.dynapop.getDynaPopListObj('BTYPES', '').subscribe((res: any) => {
      this.bldgTypeColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.bldgTypeF1List = res.data;
      this.bldgTypeF1Bbc = res.data.bringBackColumn;
    });
  }
  getOwningCompany(e: any) {
    // Used this method in html to initialise Owning Company Name value
    if (e.length) {
      this.buildingForm.patchValue({
        owningCompanyName: e[1],
      });
    }
  }

  setValueToBlankForOwningComapnyNameField()
  {
    if(this.buildingForm.get("coy")?.value.trim() == "")
    {
      this.buildingForm.get("owningCompanyName")?.setValue("");
    }
  }

  getminfCoy(e: any) {
    // Used this method in html to initialise mailinfo Company Name value
    if (e.length) {
      this.mailInfoForm.patchValue({
        minfCoyName: e[1],
      });
    }
  }
  setValueToBlankForMailInfoCompanyNameField()
  {
    if(this.mailInfoForm.get("coy")?.value.trim() == "")
    {
      this.mailInfoForm.get("minfCoyName")?.setValue("");
    }
  }

  getminfCity(e: any) {
    // Used this method in html to initialise mailinfo Company Name value
    if (e.length) {
      this.mailInfoForm.patchValue({
        minfCityName: e[1],
      });
    }
  }
  setValueToBlankForMailInfoCityNameField()
  {
    if(this.mailInfoForm.get("city")?.value.trim() == "")
    {
      this.mailInfoForm.get("minfCityName")?.setValue("");
    }
  }


  
  getminfTownship(e: any) {
    // Used this method in html to initialise mailinfo Company Name value
    if (e.length) {
      this.mailInfoForm.patchValue({
        minfTownshipName: e[1],
      });
    }
  }
  setValueToBlankForMailInfoFormTownshipNameField()
  {
    if(this.mailInfoForm.get("township")?.value.trim() == "")
    {
      this.mailInfoForm.get("minfTownshipName")?.setValue("");
    }
  }

  getminfProject(e: any) {
    // Used this method in html to initialise mailinfo Company Name value
    if (e.length) {
      this.mailInfoForm.patchValue({
        minfProjName: e[1],
      });
    }
  }

  getOpt2EnggCompany(e: any) {
    // Used this method in html to initialise Option 2 Engg Company Name value
    if (e.length) {
      this.buildingForm.patchValue({
        opt2EnggCompanyName: e[1],
      });
    }
  }
  setValueToBlankForOpt2EnggNameField()
  {
    if(this.buildingForm.get("opt2engg")?.value.trim() == "")
    {
      this.buildingForm.get("opt2EnggCompanyName")?.setValue("");
    }
  }
  getOpt2SalesCompany(e: any) {
    // Used this method in html to initialise Option 2 Sales Company Name value
    if (e.length) {
      this.buildingForm.patchValue({
        opt2SalesCompanyName: e[1],
      });
    }
  }

  setValueToBlankForOpt2SalesNameField()
  {
    if(this.buildingForm.get("opt2sales")?.value.trim() == "")
    {
      this.buildingForm.get("opt2SalesCompanyName")?.setValue("");
    }
  }
  getIntBrokCompany(e: any) {
    // Used this method in html to initialise Int Brokerage Company Name value
    if (e.length) {
      this.buildingForm.patchValue({
        intBrokCompanyName: e[1],
      });
    }
  }
  setValueToBlankForIntBrokCoyNameField()
  {
    if(this.buildingForm.get("intbrokcoy")?.value.trim() == "")
    {
      this.buildingForm.get("intBrokCompanyName")?.setValue("");
    }
  }
  getLeaseCompany(e: any) {
    // Used this method in html to initialise Leasing Company Name value
    if (e.length) {
      this.buildingForm.patchValue({
        leaseCompanyName: e[1],
      });
    }
  }
  setValueToBlankForLeasingCoyNameField()
  {
    if(this.buildingForm.get("leasingcoy")?.value.trim() == "")
    {
      this.buildingForm.get("leaseCompanyName")?.setValue("");
    }
  }
  

  addBuildingDetails() {
    // User clicks on Add button
    //console.log("code1", code1);

    let whitespaceFlag;
    let bldgcode = this.buildingSelectionsForm.controls['code'].value;
    if (!(typeof this.buildingSelectionsForm.get('code')?.value == 'object')) {
      let checkForWhiteSpace;
      if (bldgcode.length != 0) {
        let temp = bldgcode.trim();
        if (temp.length == 0) {
          checkForWhiteSpace = true;
        } else {
          checkForWhiteSpace = false;
        }
      }

      if (
        checkForWhiteSpace ||
        this.buildingSelectionsForm.controls['code'].value.length == 0 ||
        this.buildingSelectionsForm.controls['code'].value.length < 4 ||
        this.buildingSelectionsForm.controls['code'].value.length > 4
      ) {
        this.modalService.showErrorDialog(
          'Error',
          'Please select/enter the valid Building Code.',
          'error'
        );
      } else {
        this.tranMode = 'A';
        this.initialMode = true;
        this.buildingSelectionsForm.disable();
        this.setFocus('name');
        this.setActionButtonsFlag(true, true, false, false, false); //NS 30.01.2023
        this.buildingForm2.controls['closedate'].enable();

        let closeDate = new Date("01/01/2050");
        this.buildingForm2.controls['closedate'].setValue(closeDate); //NS 24.03.2023
        //this.buildingForm2.controls['closedate'].disable();
      }
    } else {
      this.buildingSelectionsForm.get('code')?.setValue('');
      // this.modalService.showErrorDialog(
      //   'Error',
      //   'Building Code Already Exist.',
      //   'error'
      // );
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Building Code Already Exist.',
        this.renderer.selectRootElement('#code')?.focus(),
        'error'
      ); //NS, SU 15.03.2023
      //this.focusField("code");
    }
  }

  retrieveBuildingDetails() {
    this.actionService.getReterieveClickedFlagUpdatedValue(true);
    let bldgcode;
    //console.log("typeof() -->", typeof(this.buildingSelectionsForm.get('code')?.value));

    //NS 10.03.2023 V.1(Update) for extractring code from Dilip's made F1-dynapop control by Ninad.
    // if(typeof(this.buildingSelectionsForm.get('code')?.value) == "string")
    // {
    //   bldgcode = this.buildingSelectionsForm.get('code')?.value;
    // }
    // else
    // {
    //   bldgcode = this.buildingSelectionsForm.get('code')?.value[0][0];
    // }

    //NS 10.03.2023 V.2(Update) for extractring code from Dilip's made F1-dynapop control by Ninad.
    if (typeof this.buildingSelectionsForm.get('code')?.value == 'object') {
      bldgcode = this.buildingSelectionsForm.get('code')?.value[0][0];
    } else if (
      typeof this.buildingSelectionsForm.get('code')?.value == 'string'
    ) {
      bldgcode = this.buildingSelectionsForm.get('code')?.value;
    }
    //NS 10.03.2023 adding logic to handle four cases for building code which is provided as input as suggested by vicky in testing.
    let checkForWhiteSpace;
    if (bldgcode.length != 0) {
      let temp = bldgcode.trim();
      if (temp.length == 0) {
        checkForWhiteSpace = true;
      } else {
        checkForWhiteSpace = false;
      }
    }
    if (
      checkForWhiteSpace ||
      bldgcode.length == 0 ||
      bldgcode.length < 4 ||
      bldgcode.length > 4
    ) {
      this.modalService.showErrorDialog(
        'Error',
        'Please select/enter the valid Building Code.',
        'error'
      );
    } else {
      this.projbldgService
        .getBuildingDetailsByCode(bldgcode)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.data) {
              //this.brokerDetails = true;
              this.initialMode = true;
              //this.deleteDisabled = false;
              //this.entryModeOff = false;
              this.patchForm(res);
              this.buildingForm2.controls['closedate'].disable();
              // console.log('resdata: ', res.data[0]);
              // console.log('ADDRESSdata: ', res.data[0].addressResponseBean);
              // console.log(
              //   'flatDetailsdata: ',
              //   res.data[0].flatsResponseBeanList
              // );

              this.addressData = res.data[0].addressResponseBean;
              //NS 24.02.2023 following two lines are solution for the problem of address control. Problem --> while retrieving the email, email gets retreived in Uppercase but there is check on email field that does not allowed Uppercase after validation so as a result invalid email value prevents the form from submitting successfully to bakend.
              let emailInUpperCase = this.addressData?.email;
              if (emailInUpperCase != undefined) {
                this.addressData.email = emailInUpperCase?.toLowerCase();
              }
              this.flatDetailsData = res.data[0].flatsResponseBeanList;
              console.log('flatDetailsData', this.flatDetailsData);
              if (this.flatDetailsData != undefined) {
                for (let i = 0; i < this.flatDetailsData.length; i++) {
                  this.flatDetailsData[i].occupdate = this.datePipe.transform(
                    this.flatDetailsData[i].occupdate,
                    'dd/MM/yyyy'
                  );

                  // moment(
                  //   this.flatDetailsData[i].occupdate
                  // ).format('dd/MM/yyyy');
                }
              }
              //logic for sum
              //variables are declared in the class outside this method

              if (this.flatDetailsData != undefined) {
                console.log('total rows', this.flatDetailsData.length);
                for (let i = 0; i < this.flatDetailsData.length; i++) {
                  this.sumOfSalableUnitArea =
                    this.sumOfSalableUnitArea +
                    this.flatDetailsData[i].bunitarea;
                  this.sumOfSalableParkArea =
                    this.sumOfSalableParkArea +
                    this.flatDetailsData[i].bparkarea;
                  this.sumOfSalableTerraceArea =
                    this.sumOfSalableTerraceArea +
                    this.flatDetailsData[i].bteraarea;
                  this.sumOfSalableAmenityArea =
                    this.sumOfSalableAmenityArea +
                    this.flatDetailsData[i].bamenarea;
                }
                for (let i = 0; i < this.flatDetailsData.length; i++) {
                  this.sumOfCarpetUnitArea =
                    this.sumOfCarpetUnitArea +
                    this.flatDetailsData[i].cunitarea;
                  this.sumOfCarpetParkArea =
                    this.sumOfCarpetParkArea +
                    this.flatDetailsData[i].cparkarea;
                  this.sumOfCarpetTerraceArea =
                    this.sumOfCarpetTerraceArea +
                    this.flatDetailsData[i].cteraarea;
                  this.sumOfCarpetAmenityArea =
                    this.sumOfCarpetAmenityArea +
                    this.flatDetailsData[i].camenarea;
                }
              }
              console.log('salabel unit area', this.sumOfSalableUnitArea);
              console.log('salabel park area', this.sumOfSalableParkArea);
              console.log('salabel unit area', this.sumOfSalableTerraceArea);
              console.log('salabel unit area', this.sumOfSalableAmenityArea);

              this.tranMode = 'R';
              let findNameOf = res.data[0]?.code;
              this.dynapop
                .getDynaPopSearchListObj('BUILDINGS', '', findNameOf)
                .subscribe((resname: any) => {
                  this.buildingSelectionsForm.patchValue({
                    bldgName: resname.data.dataSet[0][1],
                  });
                });

              findNameOf = res.data[0]?.mailinfoResponseBean?.coy;
              if (findNameOf != undefined) {
                this.dynapop
                  .getDynaPopSearchListObj('COMPANY', '', findNameOf)
                  .subscribe((resname: any) => {
                    this.mailInfoForm.patchValue({
                      minfCoyName: resname.data.dataSet[0][1],
                    });
                  });
              }
              findNameOf = res.data[0]?.mailinfoResponseBean?.project;
              if (findNameOf != undefined) {
                this.dynapop
                  .getDynaPopSearchListObj('PROJECTS', '', findNameOf)
                  .subscribe((resname: any) => {
                    this.mailInfoForm.patchValue({
                      minfProjName: resname.data.dataSet[0][1],
                    });
                  });
              }
              findNameOf = res.data[0]?.project;
              if (findNameOf != undefined) {
                this.dynapop
                  .getDynaPopSearchListObj('PROJECTS', '', findNameOf)
                  .subscribe((resname: any) => {
                    this.buildingForm.patchValue({
                      project: resname.data.dataSet,
                    });
                  });
              }
              findNameOf = res.data[0]?.prop;
              if (findNameOf != undefined) {
                this.dynapop
                  .getDynaPopSearchListObj('PROPRIETOR', '', findNameOf)
                  .subscribe((resname: any) => {
                    this.buildingForm.patchValue({
                      propName: resname.data.dataSet[0][1],
                    });
                  });
              }

              findNameOf = res.data[0]?.prop;
              if (findNameOf != undefined) {
                this.dynapop
                  .getDynaPopSearchListObj('PROPRIETOR', '', findNameOf)
                  .subscribe((resname: any) => {
                    this.buildingForm.patchValue({
                      propName: resname.data.dataSet[0][1],
                    });
                  });
              }
              // findNameOf = res.data[0]?.misbldg;
              // this.dynapop
              //   .getDynaPopSearchListObj('PROPRIETOR', '', findNameOf)
              //   .subscribe((resname: any) => {
              //     this.buildingForm.patchValue({
              //       misBldgName: resname.data.dataSet[0][1],
              //     });
              //   }); 24.02.2023
              //putting if because it was stopping my execution for flats grid statement added before i take charge for findNameOf was giving error due to undefined value in it.
              
              // if (res.data[0].misproject != undefined) { //NS 29.03.2023
              //   //NS 25.01.2023 only if statment added with condition and not statement in true section which was added by someoneelse.
              //   findNameOf = res.data[0]?.misproject;
              //   this.dynapop
              //   .getDynaPopSearchListObj('PROJECTS', '', findNameOf)
              //   .subscribe((resname: any) => {
              //     console.log('resname', resname);
              //     if (resname.data.dataSet.length != 0) {
              //       this.buildingForm2.patchValue({
              //         misProjName: resname.data.dataSet[0][1],
              //       });
              //     } else {
              //       this.buildingForm2.patchValue({
              //         misProjName: 'Name Not Found'
              //       });
              //     }
              //   });

              //   findNameOf = res.data[0].misproject.trim();
              //   console.log("misprojectbyninad", findNameOf);
              // }
              if(this.buildingForm2.get('misproject')?.value != undefined || this.buildingForm2.get('misproject')?.value !=null || this.buildingForm2.get('misproject')?.value != "")
              {
                this.misprojectF1List.dataSet.filter((itemId: any) => {
                  if (
                    itemId[0].trim() == this.buildingForm2.get('misproject')?.value
                  ) {
                    this.buildingForm2.patchValue({
                      misProjName: itemId[1],
                    });
                  }
                });
              }
              else
              {
                this.buildingForm2.patchValue({
                  misProjName: 'Name Not Found'
                });
              }

              this.misbuildingF1List.dataSet.filter((itemId: any) => {
                if (
                  itemId[0].trim() == this.buildingForm2.get('misbldg')?.value
                ) {
                  this.buildingForm2.patchValue({
                    misBldgName: itemId[1]
                  });
                }
              });
              findNameOf = res.data[0]?.coy;
              if (findNameOf != undefined) {
                this.dynapop
                  .getDynaPopSearchListObj('COMPANY', '', findNameOf)
                  .subscribe((resname: any) => {
                    this.buildingForm.patchValue({
                      owningCompanyName: resname.data.dataSet[0][1],
                    });
                  });
              }

              if (findNameOf != undefined) {
                findNameOf = res.data[0]?.paycoy;
                this.dynapop
                  .getDynaPopSearchListObj('COMPANY', '', findNameOf)
                  .subscribe((resname: any) => {
                    this.buildingForm.patchValue({
                      payingCompanyName: resname.data.dataSet[0][1],
                    });
                    console.log('getname', resname.data.dataSet[0][1]);
                  });
              }

              this.minfCoyF1List.dataSet.filter((itemId: any) => {
                if (itemId[0].trim() == this.mailInfoForm.get('coy')?.value) {
                  this.mailInfoForm.patchValue({
                    minfCoyName: itemId[1]
                  });
                }
              });

              this.minfTownshipF1List.dataSet.filter((itemId: any) => {
                if (
                  itemId[0].trim() == this.mailInfoForm.get('township')?.value //NS 23.03.2023
                ) {
                  this.mailInfoForm.patchValue({
                    minfTownshipName: itemId[1]
                  });
                }
              });

              this.minfCityF1List.dataSet.filter((itemId: any) => {
                if (itemId[0].trim() == this.mailInfoForm.get('city')?.value) {
                  this.mailInfoForm.patchValue({
                    minfCityName: itemId[1]
                  });
                }
              });

              this.minfProjectF1List.dataSet.filter((itemId: any) => {
                if (
                  itemId[0].trim() == this.mailInfoForm.get('project')?.value
                ) {
                  this.mailInfoForm.patchValue({
                    minfProjName: itemId[1],
                  });
                }
              });

              this.contractingCompanyF1List.dataSet.filter((itemId: any) => {
                if (
                  itemId[0].trim() == this.buildingForm.get('concoy')?.value
                ) {
                  this.buildingForm.patchValue({
                    contractingCompanyName: itemId[1],
                  });
                }
              });
              this.propertyF1List.dataSet.filter((itemId: any) => {
                if (
                  itemId[0].trim() == this.buildingForm.get('property')?.value
                ) {
                  this.buildingForm.patchValue({
                    propertyName: itemId[1],
                  });
                }
              });
              this.cityF1List.dataSet.filter((itemId: any) => {
                if (itemId[0].trim() == this.buildingForm.get('city')?.value) {
                  this.buildingForm.patchValue({
                    cityName: itemId[1],
                  });
                }
              });
              this.townshipF1List.dataSet.filter((itemId: any) => {
                if (
                  itemId[0].trim() == this.buildingForm.get('township')?.value
                ) {
                  this.buildingForm.patchValue({
                    townshipName: itemId[1],
                  });
                }
              });
              this.bldgTypeF1List.dataSet.filter((itemId: any) => {
                if (
                  itemId[0].trim() == this.buildingForm.get('bldgtype')?.value
                ) {
                  this.buildingForm.patchValue({
                    bldgTypeName: itemId[1],
                  });
                }
              });
              this.opt2EnggCompanyF1List.dataSet.filter((itemId: any) => {
                if (
                  itemId[0].trim() == this.buildingForm.get('opt2engg')?.value
                ) {
                  this.buildingForm.patchValue({
                    opt2EnggCompanyName: itemId[1],
                  });
                }
              });
              this.opt2SalesCompanyF1List.dataSet.filter((itemId: any) => {
                if (
                  itemId[0].trim() == this.buildingForm.get('opt2sales')?.value
                ) {
                  this.buildingForm.patchValue({
                    opt2SalesCompanyName: itemId[1],
                  });
                }
              });
              this.intBrokCompanyF1List.dataSet.filter((itemId: any) => {
                if (
                  itemId[0].trim() == this.buildingForm.get('intbrokcoy')?.value
                ) {
                  this.buildingForm.patchValue({
                    intBrokCompanyName: itemId[1],
                  });
                }
              });
              this.maintCoyF1List.dataSet.filter((itemId: any) => {
                if (
                  itemId[0].trim() == this.buildingForm2.get('maintcoy')?.value
                ) {
                  this.buildingForm2.patchValue({
                    maintCoyName: itemId[1],
                  });
                }
              });
              this.parentBldgF1List.dataSet.filter((itemId: any) => {
                if (
                  itemId[0].trim() ==
                  this.buildingForm2.get('parentbldg')?.value //NS 23.03.2023 CONTROL NAME WAS WRONG.
                ) {
                  this.buildingForm2.patchValue({
                    parentBldgName: itemId[1],
                  });
                }
              }); //NS 24.02.2023
              this.leaseCompanyF1List.dataSet.filter((itemId: any) => {
                if (
                  itemId[0].trim() == this.buildingForm.get('leasingcoy')?.value
                ) {
                  this.buildingForm.patchValue({
                    leaseCompanyName: itemId[1],
                  });
                }
              });
              this.buildingSelectionsForm.disable(); //NS 10.03.2023 ONLY CHANGE THE PLACEMENT OF THIS LINE WRITTEN BY PREVIOUS DEVELOPER IN ORDER TO MAKE THE EXECUTION FLOW CORRECT OR AS PER REQUIREMENT.
              this.setActionButtonsFlag(true, true, true, false, false); //NS 30.01.2023, 10.03.2023 ONLY CHANGE THE PLACEMENT OF THIS LINE
              //this.setFocus('name');
              this.setFocus('name');
            } else {
              this.toastr.error('Building Not Found');
              this.setFocus('code');
            }
          },
          error: (error) => {
            this.toastr.error(error.error.errors[0].defaultMessage);
          }
          
        });
    }
  }
misprojectDBOldValue!:string;
  patchForm(res: any) {
    // Initialise form values from response bean
    // this.receivedAddressData.patchValue({
    //   email : this.receivedAddressData.controls['email']?.value.toLowerCase()
    // })//YC 24.02.2023
    //this.receivedAddressData = this.convertValuesToLower(this.receivedAddressData.value['addressResponseBean']); //NS 24.02.2023
    //console.log("email", this.receivedAddressData.get('email')?.value);

    this.buildingForm.patchValue({
      name: res.data[0]?.name,
      salesname: res.data[0]?.salesname,
      project: res.data[0]?.project,
      //projName: res.data[0]?.projName,
      prop: res.data[0]?.prop,
      coy: res.data[0]?.coy,
      opt2engg: res.data[0]?.opt2engg,
      opt2sales: res.data[0]?.opt2sales,
      intbrokcoy: res.data[0]?.intbrokcoy,
      leasingcoy: res.data[0]?.leasingcoy,
      paycoy: res.data[0]?.paycoy,
      concoy: res.data[0]?.concoy,
      property: res.data[0]?.property,
      surveynum: res.data[0]?.surveynum,
      tenure: res.data[0]?.tenure,
      city: res.data[0]?.city,
      township: res.data[0]?.township,
      bldgtype: res.data[0]?.bldgtype,
    });

    //NS 31.03.2023 START-------------------------------------
    let opendatevalue;
    if(res.data[0]?.opendate == undefined)
    {
      opendatevalue = null;
    }
    else
    {
      opendatevalue = moment(res.data[0]?.opendate,'DD/MM/YYYY');
    }

    let ulcdatevalue;
    if(res.data[0]?.ulcdate == undefined)
    {
      ulcdatevalue = null;
    }
    else
    {
      ulcdatevalue = moment(res.data[0]?.ulcdate,'DD/MM/YYYY');
    }

    let ccdatevalue;
    if(res.data[0]?.ccdate == undefined)
    {
      ccdatevalue = null;
    }
    else
    {
      ccdatevalue = moment(res.data[0]?.ccdate,'DD/MM/YYYY');
    }

    let occdatevalue;
    if(res.data[0]?.occdate == undefined)
    {
      occdatevalue = null;
    }
    else
    {
      occdatevalue = moment(res.data[0]?.occdate,'DD/MM/YYYY');
    }

    let schpossdatevalue;
    if(res.data[0]?.schposs == undefined)
    {
      schpossdatevalue = null;
    }
    else
    {
      schpossdatevalue = moment(res.data[0]?.schposs,'DD/MM/YYYY');
    }

    let closedatevalue;
    if(res.data[0]?.closedate == undefined)
    {
      closedatevalue = null;
    }
    else
    {
      closedatevalue = moment(res.data[0]?.closedate,'DD/MM/YYYY');
    }

   

//NS 31.03.2023 END-------------------------------------
//-------------------------------------Start NS 13.04.2023---------------------------------
this.misprojectDBOldValue = res.data[0]?.misproject;

//-------------------------------------End NS 13.04.2023---------------------------------
//------------------NS 11.04.2023 Start --------------------------------

    let misprojectValue; 
    if((res.data[0]?.misproject == "") || (res.data[0]?.misproject == null) || (res.data[0]?.misproject == undefined))
    {
      // misprojectValue = "NA";
      // this.buildingForm2.patchValue({
      //   misProjName:"Not Available (In Old Record)"
      // });
      misprojectValue = "";
    }
    else
    {
      misprojectValue = res.data[0]?.misproject;
    }
//------------------NS 11.04.2023 End -----------------------------------


    this.buildingForm2.patchValue({
      
      //misproject:res.data[0]?.misproject,
      misproject: misprojectValue, //NS 11.04.2023
      misbldg: res.data[0]?.misbldg,
      maintcoy: res.data[0]?.maintcoy, //NS 23.02.2022
      parentbldg: res.data[0]?.parentbldg, //NS 23.02.2022
      infrayn: res.data[0]?.infrayn,
      maintrate: res.data[0]?.maintrate,
      //occdate: moment(res.data[0]?.occdate, 'DD/MM/YYYY'), //NS 31.03.2023 COMMENTING AS NOT FIT IN REQUIREMENT
      occdate:occdatevalue,//NS 31.03.2023
      //schposs: moment(res.data[0]?.schposs, 'DD/MM/YYYY'),//NS 31.03.2023 NS 31.03.2023 COMMENTING AS NOT FIT IN REQUIREMENT
      schposs:schpossdatevalue,//NS 31.03.2023
      //ccdate: moment(res.data[0]?.ccdate, 'DD/MM/YYYY'), //NS 31.03.2023 NS 31.03.2023 COMMENTING AS NOT FIT IN REQUIREMENT
      ccdate: ccdatevalue,//NS 31.03.2023
      //ulcdate: moment(res.data[0]?.ulcdate, 'DD/MM/YYYY'), //NS 31.03.2023 NS 31.03.2023 COMMENTING AS NOT FIT IN REQUIREMENT
      ulcdate: ulcdatevalue,//NS 31.03.2023
      areasales: res.data[0]?.areasales,
      areaengg: res.data[0]?.areaengg,
      areaarch: res.data[0]?.areaarch,
      modagdoc: res.data[0]?.modagdoc,
      elecsupp: res.data[0]?.elecsupp,
      region: res.data[0]?.region,
      remark: res.data[0]?.remark,
      //opendate: moment(res.data[0]?.opendate, 'DD/MM/YYYY').format(
      //   'YYYY-MM-DD'
      // ),//NS 31.03.2023 NS 31.03.2023 COMMENTING AS NOT FIT IN REQUIREMENT
      opendate: opendatevalue,//NS 31.03.2023
      // closedate: moment(res.data[0]?.closedate, 'DD/MM/YYYY').format(
      //   'YYYY-MM-DD'
      // ),//NS 31.03.2023 NS 31.03.2023 COMMENTING AS NOT FIT IN REQUIREMENT
      closedate: closedatevalue//NS 31.03.2023
    });
//NS 31.03.2023 START ----------------
    let possdatevalueForMailInfoTable;
    if(res.data[0]?.possdate == undefined)
    {
      possdatevalueForMailInfoTable = null;
    }
    else
    {
      possdatevalueForMailInfoTable = moment(res.data[0]?.possdate,'DD/MM/YYYY');
    }
    let mailinfocityaftertrimmed;
    if(res.data[0]?.mailinfoResponseBean?.city != undefined) {
      mailinfocityaftertrimmed = res.data[0]?.mailinfoResponseBean?.city;
      mailinfocityaftertrimmed = mailinfocityaftertrimmed?.trim();
    }
    // else{
    //   mailinfocityaftertrimmed = "NA";
    //   this.mailInfoForm.patchValue({
    //     minfCityName:"Not Available (In Old Record)"
    //   });
    // }
    

//NS 31.03.2023 END -----------------
//----------------Start NS 17.04.2023--------------------------------
    // if((res.data[0]?.mailinfoResponseBean?.city == "") || (res.data[0]?.mailinfoResponseBean?.city == null) || (res.data[0]?.mailinfoResponseBean?.city == undefined))
    // {
      
      
    // }
//----------------End NS 17.04.2023----------------------------------
    this.mailInfoForm.patchValue({
      coy: res.data[0]?.mailinfoResponseBean?.coy,
      project: res.data[0]?.mailinfoResponseBean?.project,
      city: mailinfocityaftertrimmed,
      township: res.data[0]?.mailinfoResponseBean?.township,
      tenure: res.data[0]?.mailinfoResponseBean?.tenure,
      area1: res.data[0]?.mailinfoResponseBean?.area1,
      area2: res.data[0]?.mailinfoResponseBean?.area2,
      area3: res.data[0]?.mailinfoResponseBean?.area3,
      config1: res.data[0]?.mailinfoResponseBean?.config1,
      config2: res.data[0]?.mailinfoResponseBean?.config2,
      config3: res.data[0]?.mailinfoResponseBean?.config3,
      config4: res.data[0]?.mailinfoResponseBean?.config4,
      amenity1: res.data[0]?.mailinfoResponseBean?.amenity1,
      amenity2: res.data[0]?.mailinfoResponseBean?.amenity2,
      amenity3: res.data[0]?.mailinfoResponseBean?.amenity3,
      amenity4: res.data[0]?.mailinfoResponseBean?.amenity4,
      amenity5: res.data[0]?.mailinfoResponseBean?.amenity5,
      possdate: possdatevalueForMailInfoTable //NS 23.02.2023
    });
    //--------------------NS 27.01.2023 Start---------------------------------------
    if (
      res?.data[0].flatsResponseBeanList &&
      res?.data[0].flatsResponseBeanList?.length
    ) {
      this.flatDetailsBreakupFormArr.clear(); //NS 31.01.2023 its solution to the problem of getting garbage row in flats datagridview along with retrieved record that was occured because team neosoft have not consider while designing the architecture of datagridview.
      for (
        var index = 0;
        index < res?.data[0].flatsResponseBeanList?.length;
        index++
      ) {
        //console.log("total flats count", res?.data[0].flatsResponseBeanList?.length);
        //res?.data[0].flatsResponseBeanList?.length - 1 == index
        //? ''
        //: this.flatDetailsBreakupFormArr.push(this.itemDetailFillRows(res?.data[0].flatsResponseBeanList[index]));//NS 27.01.2023 solution added for retrieve functionality of datagrid which needs to be reflected in other modules.
        //console.log('index', index)
        this.flatDetailsBreakupFormArr.push(
          this.itemDetailFillRows(res?.data[0].flatsResponseBeanList[index])
        );
        // this.flatDetailsBreakupFormArr.patchValue({
        //   ...res?.data[0].flatsResponseBeanList[index],
        // });
      }
      console.log(
        'user defined array after retrieve-->',
        this.flatDetailsBreakupFormArr.value
      );
    }
    //--------------------NS 27.01.2023 End---------------------------------------
  }
  //--------------------NS 02.03.2023 Start ------------------------------------
  //following both methods namely updatingOldWingValue() and updatingOldFlatValue() are used for updating the Flat grids value in database update query processing( in where condition where old values are required update query to work)
  prevValue!: any;
  updatingPrevValueofSalableUnitArea(event: any) {
    this.prevValue = event.target.value;
  }

  updatingSumOfSalableUnitArea(
    event: any,
    _control: FormControl,
    index: number
  ) {
    console.log(
      'value of blank string after conversion',
      parseInt(this.prevValue)
    );
    if (event.target.value != '' && this.prevValue != '') {
      let currentValue = parseInt(event.target.value);
      if (parseInt(this.prevValue) != currentValue) {
        //V3.0 NS 09.03.2023
        if (parseInt(this.sumOfSalableUnitArea) >= 0) {
          if (
            parseInt(this.sumOfSalableUnitArea) < parseInt(this.prevValue) ||
            parseInt(this.sumOfSalableUnitArea) == 0 ||
            parseInt(this.sumOfSalableUnitArea) == parseInt(this.prevValue)
          ) {
            //three cases for computation of sum
            this.sumOfSalableUnitArea =
              parseInt(this.prevValue) -
              parseInt(this.sumOfSalableUnitArea) +
              currentValue;
          } else if (
            parseInt(this.sumOfSalableUnitArea) > parseInt(this.prevValue)
          ) {
            this.sumOfSalableUnitArea =
              parseInt(this.sumOfSalableUnitArea) -
              parseInt(this.prevValue) +
              currentValue;
          }
        }
      }
    } else {
      //if the value is blank string then assign previous value after focus out event occur, following code does that.
      this.sumOfSalableUnitArea = parseInt(this.prevValue);
      _control.setValue(parseInt(this.prevValue));
    }
  }

  updatingPrevValueofSalableParkingArea(event: any) {
    this.prevValue = event.target.value;
  }

  updatingSumOfSalableParkingArea(
    event: any,
    _control: FormControl,
    index: number
  ) {
    if (event.target.value != '' && this.prevValue != '') {
      let currentValue = parseInt(event.target.value);
      if (parseInt(this.prevValue) != currentValue) {
        //V3.0 NS 09.03.2023
        if (parseInt(this.sumOfSalableParkArea) >= 0) {
          if (
            parseInt(this.sumOfSalableParkArea) < parseInt(this.prevValue) ||
            parseInt(this.sumOfSalableParkArea) == 0 ||
            parseInt(this.sumOfSalableParkArea) == parseInt(this.prevValue)
          ) {
            //three cases for computation of sum
            this.sumOfSalableParkArea =
              parseInt(this.prevValue) -
              parseInt(this.sumOfSalableParkArea) +
              currentValue;
          } else if (
            parseInt(this.sumOfSalableParkArea) > parseInt(this.prevValue)
          ) {
            this.sumOfSalableParkArea =
              parseInt(this.sumOfSalableParkArea) -
              parseInt(this.prevValue) +
              currentValue;
          }
        }
      }
    } else {
      //if the value is blank string then assign previous value after focus out event occur, following code does that.
      this.sumOfSalableParkArea = parseInt(this.prevValue);
      _control.setValue(parseInt(this.prevValue));
    }
  }

  updatingPrevValueofSalableTerraceArea(event: any) {
    this.prevValue = event.target.value;
  }

  updatingSumOfSalableTerraceArea(
    event: any,
    _control: FormControl,
    index: number
  ) {
    if (event.target.value != '' && this.prevValue != '') {
      let currentValue = parseInt(event.target.value);
      if (parseInt(this.prevValue) != currentValue) {
        //V3.0 NS 09.03.2023
        if (parseInt(this.sumOfSalableTerraceArea) >= 0) {
          if (
            parseInt(this.sumOfSalableTerraceArea) < parseInt(this.prevValue) ||
            parseInt(this.sumOfSalableTerraceArea) == 0 ||
            parseInt(this.sumOfSalableTerraceArea) == parseInt(this.prevValue)
          ) {
            //three cases for computation of sum
            this.sumOfSalableTerraceArea =
              parseInt(this.prevValue) -
              parseInt(this.sumOfSalableTerraceArea) +
              currentValue;
          } else if (
            parseInt(this.sumOfSalableTerraceArea) > parseInt(this.prevValue)
          ) {
            this.sumOfSalableTerraceArea =
              parseInt(this.sumOfSalableTerraceArea) -
              parseInt(this.prevValue) +
              currentValue;
          }
        }
      }
    } else {
      //if the value is blank string then assign previous value after focus out event occur, following code does that.
      this.sumOfSalableTerraceArea = parseInt(this.prevValue);
      _control.setValue(parseInt(this.prevValue));
    }
  }

  updatingPrevValueofSalableAmenityArea(event: any) {
    this.prevValue = event.target.value;
  }

  updatingSumOfSalableAmenityArea(
    event: any,
    _control: FormControl,
    index: number
  ) {
    if (event.target.value != '' && this.prevValue != '') {
      let currentValue = parseInt(event.target.value);

      if (parseInt(this.prevValue) != currentValue) {
        //V3.0 NS 09.03.2023
        if (parseInt(this.sumOfSalableAmenityArea) >= 0) {
          if (
            parseInt(this.sumOfSalableAmenityArea) < parseInt(this.prevValue) ||
            parseInt(this.sumOfSalableAmenityArea) == 0 ||
            parseInt(this.sumOfSalableAmenityArea) == parseInt(this.prevValue)
          ) {
            //three cases for computation of sum
            this.sumOfSalableAmenityArea =
              parseInt(this.prevValue) -
              parseInt(this.sumOfSalableAmenityArea) +
              currentValue;
          } else if (
            parseInt(this.sumOfSalableAmenityArea) > parseInt(this.prevValue)
          ) {
            this.sumOfSalableAmenityArea =
              parseInt(this.sumOfSalableAmenityArea) -
              parseInt(this.prevValue) +
              currentValue;
          }
        }
      }
    } else {
      //if the value is blank string then assign previous value after focus out event occur, following code does that.
      this.sumOfSalableAmenityArea = parseInt(this.prevValue);
      _control.setValue(parseInt(this.prevValue));
    }
  }

  updatingPrevValueofCarpetUnitArea(event: any) {
    this.prevValue = event.target.value;
  }

  updatingSumOfCarpetUnitArea(
    event: any,
    _control: FormControl,
    index: number
  ) {
    if (event.target.value != '' && this.prevValue != '') {
      let currentValue = parseInt(event.target.value);
      if (parseInt(this.prevValue) != currentValue) {
        //V3.0 NS 09.03.2023
        if (parseInt(this.sumOfCarpetUnitArea) >= 0) {
          if (
            parseInt(this.sumOfCarpetUnitArea) < parseInt(this.prevValue) ||
            parseInt(this.sumOfCarpetUnitArea) == 0 ||
            parseInt(this.sumOfCarpetUnitArea) == parseInt(this.prevValue)
          ) {
            //three cases for computation of sum
            this.sumOfCarpetUnitArea =
              parseInt(this.prevValue) -
              parseInt(this.sumOfCarpetUnitArea) +
              currentValue;
          } else if (
            parseInt(this.sumOfCarpetUnitArea) > parseInt(this.prevValue)
          ) {
            this.sumOfCarpetUnitArea =
              parseInt(this.sumOfCarpetUnitArea) -
              parseInt(this.prevValue) +
              currentValue;
          }
        }
      }
    } else {
      //if the value is blank string then assign previous value after focus out event occur, following code does that.
      this.sumOfCarpetUnitArea = parseInt(this.prevValue);
      _control.setValue(parseInt(this.prevValue));
    }
  }

  updatingPrevValueofCarpetParkingArea(event: any) {
    this.prevValue = event.target.value;
  }

  updatingSumOfCarpetParkingArea(
    event: any,
    _control: FormControl,
    index: number
  ) {
    if (event.target.value != '' && this.prevValue != '') {
      let currentValue = parseInt(event.target.value);
      if (parseInt(this.prevValue) != currentValue) {
        //V3.0 NS 09.03.2023
        if (parseInt(this.sumOfCarpetParkArea) >= 0) {
          if (
            parseInt(this.sumOfCarpetParkArea) < parseInt(this.prevValue) ||
            parseInt(this.sumOfCarpetParkArea) == 0 ||
            parseInt(this.sumOfCarpetParkArea) == parseInt(this.prevValue)
          ) {
            //three cases for computation of sum
            this.sumOfCarpetParkArea =
              parseInt(this.prevValue) -
              parseInt(this.sumOfCarpetParkArea) +
              currentValue;
          } else if (
            parseInt(this.sumOfCarpetParkArea) > parseInt(this.prevValue)
          ) {
            this.sumOfCarpetParkArea =
              parseInt(this.sumOfCarpetParkArea) -
              parseInt(this.prevValue) +
              currentValue;
          }
        }
      }
    } else {
      //if the value is blank string then assign previous value after focus out event occur, following code does that.
      this.sumOfCarpetParkArea = parseInt(this.prevValue);
      _control.setValue(parseInt(this.prevValue));
    }
  }

  updatingPrevValueofCarpetTerraceArea(event: any) {
    this.prevValue = event.target.value;
  }

  updatingSumOfCarpetTerraceArea(
    event: any,
    _control: FormControl,
    index: number
  ) {
    if (event.target.value != '' && this.prevValue != '') {
      let currentValue = parseInt(event.target.value);
      if (parseInt(this.prevValue) != currentValue) {
        //V3.0 NS 09.03.2023
        if (parseInt(this.sumOfCarpetTerraceArea) >= 0) {
          if (
            parseInt(this.sumOfCarpetTerraceArea) < parseInt(this.prevValue) ||
            parseInt(this.sumOfCarpetTerraceArea) == 0 ||
            parseInt(this.sumOfCarpetTerraceArea) == parseInt(this.prevValue)
          ) {
            //three cases for computation of sum
            this.sumOfCarpetTerraceArea =
              parseInt(this.prevValue) -
              parseInt(this.sumOfCarpetTerraceArea) +
              currentValue;
          } else if (
            parseInt(this.sumOfCarpetTerraceArea) > parseInt(this.prevValue)
          ) {
            this.sumOfCarpetTerraceArea =
              parseInt(this.sumOfCarpetTerraceArea) -
              parseInt(this.prevValue) +
              currentValue;
          }
        }
      }
    } else {
      //if the value is blank string then assign previous value after focus out event occur, following code does that.
      this.sumOfCarpetTerraceArea = parseInt(this.prevValue);
      _control.setValue(parseInt(this.prevValue));
    }
  }

  updatingPrevValueofCarpetAmenityArea(event: any) {
    this.prevValue = event.target.value;
  }

  updatingSumOfCarpetAmenityArea(
    event: any,
    _control: FormControl,
    index: number
  ) {
    if (event.target.value != '' && this.prevValue != '') {
      let currentValue = parseInt(event.target.value);
      if (parseInt(this.prevValue) != currentValue) {
        if (parseInt(this.sumOfCarpetAmenityArea) >= 0) {
          if (
            parseInt(this.sumOfCarpetAmenityArea) < parseInt(this.prevValue) ||
            parseInt(this.sumOfCarpetAmenityArea) == 0 ||
            parseInt(this.sumOfCarpetAmenityArea) == parseInt(this.prevValue)
          ) {
            //three cases for computation of sum
            this.sumOfCarpetAmenityArea =
              parseInt(this.prevValue) -
              parseInt(this.sumOfCarpetAmenityArea) +
              currentValue;
          } else if (
            parseInt(this.sumOfCarpetAmenityArea) > parseInt(this.prevValue)
          ) {
            this.sumOfCarpetAmenityArea =
              parseInt(this.sumOfCarpetAmenityArea) -
              parseInt(this.prevValue) +
              currentValue;
          }
        }
      }
    } else {
      //if the value is blank string then assign previous value after focus out event occur, following code does that.
      this.sumOfCarpetAmenityArea = parseInt(this.prevValue);
      _control.setValue(parseInt(this.prevValue));
    }
  }

  //--------------------NS 02.03.2023 End --------------------------------------
  //--------------------NS 17.02.2023 Start ------------------------------------
  //following both methods namely updatingOldWingValue() and updatingOldFlatValue() are used for updating the Flat grids value in database update query processing( in where condition where old values are required update query to work)
  // updatingOldWingValue(event:any, index:number)
  //   {
  //     if(event.target.value != null)
  //     {
  //       if(event.target.value != undefined)
  //       {
  //         let currentFlatWing = event.target.value;
  //         //following logic purpose --> if previous value when focused is not equal to current value when we focus AGAIN, then in that case it is necessary to update the latest state(value) in variable that stores previous state(value) which is requierd for update query at backend(springboot).
  //         if(this.prevFlatwing != currentFlatWing )
  //         {
  //           console.log("old wing value -->", event.target.value);
  //           this.prevFlatwing = event.target.value;
  //           //console.log("array",this.flatDetailsBreakupFormArr);
  //           this.flatDetailsBreakupFormArr.controls[index].patchValue({
  //             oldwing:this.prevFlatwing
  //           });
  //         }
  //       }
  //     }
  //   }

  // updatingOldFlatValue(event:any, index:number)
  // {
  //   if(event.target.value != null)
  //   {
  //     if(event.target.value != undefined)
  //     {
  //       let currentFlatnum = event.target.value;
  //       //following logic purpose --> if previous value when focused is not equal to current value when we focus AGAIN, then in that case it is necessary to update the latest state(value) in variable that stores previous state(value) which is requierd for update query at backend(springboot).
  //       if(this.prevFlatnum != currentFlatnum) //if will not work for two use cases.| Usecase 1] user does not entered anything after fetching data(both values prev and curr are blank string) | Usecase 2] user loose focus After entered any data and then again focus on field but dont make anychanges.
  //       {
  //         console.log("old flat value -->", event.target.value);
  //         this.prevFlatnum = event.target.value;
  //         //this.flatDetailsBreakupFormArr.controls[index].get('oldflatnum')?.setValue(this.prevFlatnum);
  //         this.flatDetailsBreakupFormArr.controls[index].patchValue({
  //           oldflatnum:this.prevFlatnum
  //         });
  //       }
  //     }
  //   }
  // }
  //   updatingOldWingValueOfNotUpdatedWings()
  //   {
  //     for(let i=0;i < this.flatDetailsBreakupFormArr?.length; i++) {
  //       for (let j = 0; j < this.flatDetailsData.length; j++) {
  //         if(this.flatDetailsBreakupFormArr.controls[i].get('wing')?.value == this.flatDetailsData.controls[i].get('wing')?.value)
  //         {
  //           this.flatDetailsBreakupFormArr.controls[i].patchValue({
  //                        oldwing:"  "
  //                       });
  //         }
  //     }

  //   }
  // }
  // updatingOldFlatValueOfNotUpdatedFlatnum()
  // {
  //   for(let i=0;i < this.flatDetailsBreakupFormArr?.length; i++) {
  //     for (let j = 0; j < this.flatDetailsData.length; j++) {
  //       if(this.flatDetailsBreakupFormArr.controls[i].get('oldflatnum')?.value == this.flatDetailsData.controls[i].get('flatnum')?.value)
  //       {
  //         this.flatDetailsBreakupFormArr.controls[i].patchValue({
  //                      old:"  "
  //                     });
  //       }
  //   }

  // }
  // }
  //--------------------NS  17.02.2023 End ---------------------------------------

  //---------------------NS, YC 21.02.2023 Start ------------------------------------
  updateListControl(
    val: any,
    formControl: FormControl,
    bringBackColumnVal: any
  ) {
    console.log(val);
    if (val != undefined) {
      if(!(val.length == 0))
      {
      formControl.setValue(val[0].trim());
      }
    }
    //NS 21.02.2023 bug found in previous version written below by yash so writting code by removing bug into it.
  }
  //---------------------NS, YC 21.02.2023 End --------------------------------------

  //--------------------- NS 11.03.2023 Start ------------------------------------
  // updateWingControl(
  //   val: any,
  //   formControl: FormControl,
  //   bringBackColumnVal: any
  // ) {
  //   // if (val[0] != undefined) {
  //   //   formControl.setValue(val[0].trim());
  //   // }
  //   if(val != undefined){
  //     formControl.setValue(val[bringBackColumnVal]);
  //     this.setFocus("wing0");
  //   }
  // }
  //---------------------NS 11.03.2023 End --------------------------------------

  //--------------------NS 27.01.2023 Start------------------------------------------
  //the following method will be used for filling the new array with retrieved data from response of fetched API.
  itemDetailFillRows(data: any) {
    console.log('flat ', data);
    return this.fb.group({
      //flat details start below
      wing: new FormControl<string>(data.wing.trim()),
      floor: new FormControl<string>(data.floor),
      flatnum: new FormControl<string>(data.flatnum, Validators.required),
      accomtype: new FormControl<string>(''),
      config: new FormControl<string>(data.config),
      //salable area realted four properties as below
      bunitarea: new FormControl<string>(data.bunitarea, Validators.required),
      bparkarea: new FormControl<string>(data.bparkarea, Validators.required),
      bteraarea: new FormControl<string>(data.bteraarea, Validators.required),
      bamenarea: new FormControl<string>(data.bamenarea, Validators.required),
      //carpet area realted four properties as below
      cunitarea: new FormControl<string>(data.cunitarea, Validators.required),
      cparkarea: new FormControl<string>(data.cparkarea, Validators.required),
      cteraarea: new FormControl<string>(data.cteraarea, Validators.required),
      camenarea: new FormControl<string>(data.camenarea, Validators.required),
      occupdate: new FormControl<Date | null>(
        data.occupdate
      ),
      //sold status related one property as below
      soldyn: new FormControl<string>(data.soldyn),
      //RERA realted two properties as below
      curera: new FormControl<string>(data.curera),
      enclbalcrera: new FormControl<string>(data.enclbalcrera),
      //other properties which are not part of UI appearance.
      coy: new FormControl<string>(data.coy),
      origcoy: new FormControl<string>(data.origcoy),
      remarks: new FormControl<string>(data.remarks),
      ownerid: new FormControl<string>(data.ownerid),
      agprice: new FormControl<string>(data.agprice),
      intrate: new FormControl<string>(data.intrate),
      amtrec: new FormControl<string>(data.amtrec),
      amtos: new FormControl<string>(data.amtos),
      loanamt: new FormControl<string>(data.loanamt),
      loanpaid: new FormControl<string>(data.loanpaid),
      maintrate: new FormControl<string>(data.maintrate),
      bldgcode: new FormControl<string>(data.bldgcode),
      //origsite: new FormControl<string|null>(data.origsite), this field is blank so not needed
      //site: new FormControl<string>(data.site),
      //following two fields are not part of database column, these fields are sent because these fields are utilized while updating the old records.16.02.2023
      oldwing: new FormControl<string>(''),
      oldflatnum: new FormControl<string>(''),
      //will help to determine which database operation needs to be performed. where 'I' = insert and 'U' = update
      dboperation: new FormControl<string>('U'),
    }
    );
  }
  //--------------------NS 27.01.2023 End----------------------------------------

  //--------------------NS 30.01.2023 Start -------------------------------------
  //following "TWO functions" will perform delete operation on rows in flat tabs's datagrid. Where Function 2 is called inside the Funciton 1 to achieve the objective of deleting the row.
  //Function 1
  deleteRow(rowIndex: any, lineNo: any) {
    //this.deleteFormArr(rowIndex);
    if(this.flatDetailsBreakupFormArr.controls[rowIndex].get("dboperation")?.value == "U")
    {
      if(this.flatDetailsBreakupFormArr.at(rowIndex).value.wing == "")
      {
        this.flatDetailsBreakupFormArr.controls[rowIndex].get('wing')?.setValue(commonconstant.doubleSpaceString);
        //this.showConfirmationForDeleteInRetrieveMode(constant.ErrorDialog_Title, "Do you want to delete?", "question", true, rowIndex);
      }
      this.showConfirmationForDeleteInRetrieveMode(constant.ErrorDialog_Title, "Do you want to delete?", "question", true, rowIndex);
      // else
      // {
      //   this.showConfirmationForDeleteInRetrieveMode(constant.ErrorDialog_Title, "Do you want to delete?", "question", true, rowIndex);
      // }
    }
    else if(this.flatDetailsBreakupFormArr.controls[rowIndex].get("dboperation")?.value == "I")
    {
      this.showConfirmationForDeleteInAddMode(constant.ErrorDialog_Title, "Do you want to delete?", "question", true, rowIndex);
    }
  }
  //Function 2
  deleteFormArr(idx: number) {
    this.flatDetailsBreakupFormArr.removeAt(idx);
  }
  //--------------------NS 30.01.2023 End ---------------------------------------

  //--------------------NS 30.01.2023 Start -------------------------------------
  //following function will help to add the new row in the flats tabs datagrid after clicking of the button with caption "Add Row".
  addRow() {
    let data: any;
    if (
      !(
        this.buildingForm.get('coy')?.value == null ||
        this.buildingForm.get('coy')?.value == '' ||
        this.buildingForm.get('coy')?.value == undefined
      )
    ) {
      this.flatDetailsBreakupFormArr.push(this.itemDetailInitRows());
      //NS 21.03.2023 following two lines will add focus on wing in newly added row.
      let indx = this.flatDetailsBreakupFormArr.length -1;
      this.focusField("wing"+indx);
    } else {
      let messageForModal =
        'Please select "Owning Company" inside the "Account Sensitive Building Details" Section.';
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        messageForModal,
        'error'
      );
    }
  }

  //--------------------NS 30.01.2023 End ----------------------------------------
  //--------------------NS 31.01.2023 Start --------------------------------------
  itemDetailInitRows() {
    let coyName = this.buildingForm.get('coy')?.value;
    let origcoyName = this.buildingForm.get('coy')?.value;
    let bldgcode = '';
    if (this.tranMode == 'R') {
      bldgcode = this.buildingSelectionsForm.get('code')?.value[0][0];
    } else if (this.tranMode == 'A') {
      bldgcode = this.buildingSelectionsForm.get('code')?.value;
    }

    return this.fb.group({
      //flat details start below
      wing: new FormControl<string>(''),
      floor: new FormControl<string>(''),
      flatnum: new FormControl<string>('', Validators.required),
      accomtype: new FormControl<string>(''),
      config: new FormControl<string>(''),
      //salable area realted four properties as below
      bunitarea: new FormControl<string>('0', Validators.required),
      bparkarea: new FormControl<string>('0', Validators.required),
      bteraarea: new FormControl<string>('0', Validators.required),
      bamenarea: new FormControl<string>('0', Validators.required),
      //carpet area realted four properties as below
      cunitarea: new FormControl<string>('0', Validators.required),
      cparkarea: new FormControl<string>('0', Validators.required),
      cteraarea: new FormControl<string>('0', Validators.required),
      camenarea: new FormControl<string>('0', Validators.required),
      occupdate: new FormControl<string | null>(null), //NS 31.01.2023
      //sold status related one property as below
      soldyn: new FormControl<string>('N'),
      //RERA realted two properties as below
      curera: new FormControl<string>('0'),
      enclbalcrera: new FormControl<string>('0'),
      //other properties which are not part of UI appearance.
      coy: new FormControl<string>(coyName),
      origcoy: new FormControl<string>(origcoyName),
      remarks: new FormControl<string | null>(null),
      ownerid: new FormControl<string>(''),
      agprice: new FormControl<string | null>(null),
      intrate: new FormControl<string | null>(null),
      amtrec: new FormControl<string | null>(null),
      amtos: new FormControl<string | null>(null),
      loanamt: new FormControl<string | null>(null),
      loanpaid: new FormControl<string | null>(null),
      maintrate: new FormControl<string | null>(null),
      bldgcode: new FormControl<string>(bldgcode),
      //following two fields are not part of database column, these fields are sent because these fields are utilized while updating the old records.16.02.2023
      oldwing: new FormControl<string>(''),
      oldflatnum: new FormControl<string>(''),
      //will help to determine which database operation needs to be performed. where 'I' = insert and 'U' = update
      dboperation: new FormControl<string>('I'),
    }
    );
  }

  //--------------------NS 31.01.2023 End ----------------------------------------
  // handleBackClick() {
  //   this.isBackClicked = true;
  //   this.buildingForm.reset();
  //   this.buildingForm2.reset();
  //   this.mailInfoForm.reset();
  //   //this.

  //   // if (
  //   //   this.buildingForm.dirty ||
  //   //   this.buildingForm2.dirty ||
  //   //   this.mailInfoForm.dirty ||
  //   //   this.flatDetailsForm.dirty ||
  //   //   this.receivedFlatDetailsData ||
  //   //   this.receivedAddressData.dirty
  //   // ) {
  //   //   this.showConfirmation(
  //   //     constant.ErrorDialog_Title,
  //   //     'Do you want to ignore the changes done?',
  //   //     'question',
  //   //     true
  //   //   );
  //   // } else {
  //   //   this.back();
  //   // }
  //   this.back();
  // }
  handleBackClick() {
    if (
      this.buildingForm.dirty ||
      this.buildingForm2.dirty ||
      this.mailInfoForm.dirty ||
      this.flatDetailsBreakupFormArr.dirty ||
      this.receivedAddressData.dirty
    ) {
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

  back() {
    // User clicks on Back button
    this.isBackClicked = false; //06.12.22	RS
    this.isDeleteClicked = false; //06.12.22	RS
    //this.buildingForm.reset();
    this.buildingForm2.reset();
    this.mailInfoForm.reset();
    this.flatDetailsForm.reset();
    //this.buildingSelectionsForm.reset();
    this.addressData = null;
    this.flatDetailsData = null;
    this.receivedAddressData.reset;
    this.addressComponent.resetAddress();
    //this.brokerDetails = false;         //06.12.22	RS
    //this.entryModeOff = true;           //06.12.22	RS
    this.initialMode = false;
    this.deleteDisabled = true;
    this.buildingSelectionsForm.controls['code'].enable();
    this.initFocus.fo1.nativeElement.focus(); // Set focus on Broker ID
    this.setActionButtonsFlag(false, false, true, true, true); //NS 30.01.2023

    this.isBackClicked = true;
    //NS 21.02.2023
    this.buildingForm.reset();
    this.buildingForm2.reset();
    this.mailInfoForm.reset();
    this.flatDetailsBreakupFormArr.clear();
    this.receivedAddressData.reset();
    this.buildingSelectionsForm.controls['code'].reset(); //clear the past value.
    this.buildingSelectionsForm.controls['code'].setValue(''); //NS 10.03.2023 assign the value string to the Dilips F1-dynapop to avoid the error message that said "can not access undefined or null value".
    //NS 22.02.2023
    this.buildingForm2.controls['closedate'].disable();
    this.setFocus('code');
    this.clearFlatGridFieldsOnPressingBack();
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

        this.back();
        // if (this.isDeleteClicked) {
        //   this.deleteBroker();
        //   this.isDeleteClicked = false;
        // }
        // if (this.isBackClicked) {
        //   this.back();
        // }
      }
    });
  }

  clearFlatGridFieldsOnPressingBack()
  {
    this.sumOfSalableUnitArea = 0;
    this.sumOfSalableParkArea = 0;
    this.sumOfSalableTerraceArea = 0;
    this.sumOfSalableAmenityArea = 0;
    this.sumOfCarpetUnitArea = 0;
    this.sumOfCarpetParkArea = 0;
    this.sumOfCarpetTerraceArea = 0;
    this.sumOfCarpetAmenityArea = 0;
  }

  // Convert Object Text values in upper case
  convertValuesToUpper(formgroup: any) {
    for (const obj of Object.keys(formgroup)) {
      if (formgroup[obj] && typeof formgroup[obj] == 'string') {
        // if(obj.toString() == "email")
        // {
        //console.log("formgroup object", obj);
        formgroup[obj] = formgroup[obj].toUpperCase();
      }
    }
    return formgroup;
  }

  // convertValuesToLower(formgroup: any) {
  //   for (const obj of Object.keys(formgroup)) {
  //     if (formgroup[obj] && typeof formgroup[obj] == 'string') {
  //       console.log("formgroup object", formgroup[obj].);
  //       formgroup[obj] = formgroup[obj].toLowerCase();
  //     }
  //   }
  //   return formgroup;
  // }

  setFloor() {
    for (let i = 0; i < this.flatDetailsBreakupFormArr?.length; i++) {
      let tempFlatno = this.flatDetailsBreakupFormArr.controls[i]
        .get('flatnum')
        ?.value.toString();
      //console.log("flat", tempFlatno);

      let tempFloorno = tempFlatno.slice(1, 3);
      //console.log("flor",tempFloorno);

      this.flatDetailsBreakupFormArr.controls[i]
        .get('floor')
        ?.setValue(tempFloorno);
    }
  }

  setDateToDbFormatForFlats() {
    for (var i = 0; i < this.flatDetailsBreakupFormArr.length; i++) {
      if (
        !(
          this.flatDetailsBreakupFormArr.controls[i].get('occupdate')?.value ==
          null
        )
      ) {
        //following code will be run for Usecase when old date is updated and updated date needs to get reflected in our array which will be sent for update towards database.
        this.flatDetailsBreakupFormArr.controls[i]
          .get('occupdate')
          ?.value.toString()
          ? this.flatDetailsBreakupFormArr.controls[i]
              .get('occupdate')
              ?.setValue(
                moment(
                  this.flatDetailsBreakupFormArr.controls[i].get('occupdate')
                    ?.value
                ).format('DD/MM/YYYY')
              )
          : this.flatDetailsBreakupFormArr.controls[i]
              .get('occupdate')
              ?.setValue(null); //this will transform the date into database oriented format.
        console.log(
          'date of flat -->',
          this.flatDetailsBreakupFormArr.controls[i].get('occupdate')?.value
        );
      }
    }

    //-------NS 10.02.2023 ---------------------------------------
    //following two variables are declared once and used at all the places inside this method for processing date in order to convert it to database supported format.

    //-------
  }
  setOwneridForNewlyAddedFlatsInGrid() {
    for (let i = 0; i < this.flatDetailsBreakupFormArr?.length; i++) {
      if (
        this.flatDetailsBreakupFormArr.controls[i].get('ownerid')?.value ==
          null ||
        this.flatDetailsBreakupFormArr.controls[i].get('ownerid')?.value ==
          undefined ||
        this.flatDetailsBreakupFormArr.controls[i].get('ownerid')?.value == ''
      ) {
        
    
        let bldgcode;
        if (typeof this.buildingSelectionsForm.get('code')?.value == 'object') {
           bldgcode = this.buildingSelectionsForm.get('code')?.value[0][0];
          } else if (
           typeof this.buildingSelectionsForm.get('code')?.value == 'string'
           ) {
           bldgcode = this.buildingSelectionsForm.get('code')?.value;
           }
        let wing;
        if (
          this.flatDetailsBreakupFormArr.controls[i].get('wing')?.value ==
            undefined ||
          this.flatDetailsBreakupFormArr.controls[i].get('wing')?.value == ''
        ) {
          wing = ' ';
          //create the ownerid
          let ownerid =
            bldgcode +
            wing +
            this.flatDetailsBreakupFormArr.controls[i].get('flatnum')?.value;
          //set the ownerid in grid control
          this.flatDetailsBreakupFormArr.controls[i]
            .get('ownerid')
            ?.setValue(ownerid);
          console.log(
            'created ownerid for bldgc{0} + flatnum{1} -->{2}',
            bldgcode,
            this.flatDetailsBreakupFormArr.controls[i].get('flatnum')?.value,
            ownerid
          );
        } else {
          wing = this.flatDetailsBreakupFormArr.controls[i].get('wing')?.value;
          //create the ownerid
          let ownerid =
            bldgcode +
            wing +
            this.flatDetailsBreakupFormArr.controls[i].get('flatnum')?.value;
          //set the ownerid in grid control
          this.flatDetailsBreakupFormArr.controls[i]
            .get('ownerid')
            ?.setValue(ownerid);
          console.log(
            'created ownerid for bldgc{0} + flatnum{1} -->{2}',
            bldgcode,
            this.flatDetailsBreakupFormArr.controls[i].get('flatnum')?.value,
            ownerid
          );
        }
      }
    }
  }

  setBlankstringToWhiteSpaceForWingInGrid() {
    //following code will help to replace the value of blank string in wing control to two white space characters
    for (let i = 0; i < this.flatDetailsBreakupFormArr?.length; i++) {
      if (
        this.flatDetailsBreakupFormArr.controls[i].get('wing')?.value.trim() ==
        ''
      ) {
        this.flatDetailsBreakupFormArr.controls[i].patchValue({
          oldwing: '  ',
          wing: '  ',
        });
      }
    }
  }

  CheckPrevstateEqualsToCurrntstateForWing() {
    for (let i = 0; i < this.flatDetailsBreakupFormArr?.length; i++) {
      if (
        this.flatDetailsBreakupFormArr.controls[i].get('dboperation')?.value ==
        'U'
      ) {
        let tempWing =
          this.flatDetailsBreakupFormArr.controls[i].get('wing')?.value;
        if (tempWing.trim() != this.flatDetailsData[i]?.wing) {
          //received data from backend server has already trimmed the value of wing column before sending it to browser(client)
          let owningcompanycode = this.buildingForm.get('coy')?.value;
          this.flatDetailsBreakupFormArr.controls[i].patchValue({
            oldwing: this.flatDetailsData[i].wing,
            coy: owningcompanycode,
          });
        } else {
          //NS. just to save the typing efforts i am putting this logic which is not needed in case if we done write if...decision statement.
          let owningcompanycode = this.buildingForm.get('coy')?.value;
          this.flatDetailsBreakupFormArr.controls[i].patchValue({
            oldwing: this.flatDetailsData[i].wing,
            coy: owningcompanycode,
          });
        }
      }
    }
  }

  CheckPrevstateEqualsToCurrntstateForFlatnum() {
    for (let i = 0; i < this.flatDetailsBreakupFormArr?.length; i++) {
      if (
        this.flatDetailsBreakupFormArr.controls[i].get('dboperation')?.value ==
        'U'
      ) {
        if (
          this.flatDetailsBreakupFormArr.controls[i]
            .get('flatnum')
            ?.value.trim() != this.flatDetailsData[i].flatnum
        ) {
          //received data from backend server has already trimmed the value of wing column before sending it to browser(client)
          let owningcompanycode = this.buildingForm.get('coy')?.value.trim();
          this.flatDetailsBreakupFormArr.controls[i].patchValue({
            oldflatnum: this.flatDetailsData[i].flatnum,
            coy: owningcompanycode,
          });
        } else {
          //NS. just to save the typing efforts i am putting this logic which is not needed in case if we done write if...decision statement.
          let owningcompanycode = this.buildingForm.get('coy')?.value.trim();
          console.log("owningcompanycode from control", owningcompanycode);
           owningcompanycode = owningcompanycode.trim();
           console.log("owningcompanycode variable", owningcompanycode);
          // this.flatDetailsBreakupFormArr.controls[i].patchValue({
          //   oldflatnum: this.flatDetailsData[i].flatnum,
          //   coy: owningcompanycode,
          // }); this solution is not right
          this.flatDetailsBreakupFormArr.controls[i].get("oldflatnum")?.setValue(this.flatDetailsData[i].flatnum);
          this.flatDetailsBreakupFormArr.controls[i].get("coy")?.setValue(owningcompanycode);

          console.log("oldflatnum after patching method", this.flatDetailsBreakupFormArr.controls[i].get("oldflatnum")?.value);
          console.log("coy after patching method", this.flatDetailsBreakupFormArr.controls[i].get("coy")?.value);

        }
      }
    }
  }
  //NS 11.03.2023 check whether duplicate flat number exist or not.
  checkDuplicateFlatWithSameWingExist(currentFlatIndex:number): boolean {
    if((this.flatDetailsBreakupFormArr.get("wing")?.value != undefined) && (this.flatDetailsBreakupFormArr.get("flatnum")?.value != undefined)){
    let allFlats = [];
    let allWings = [];
    if (typeof this.flatDetailsBreakupFormArr != undefined) {
      if (this.flatDetailsBreakupFormArr != null) {
        //Phase 1: collect all the flat numbers and wings in array for further processing. NS 23.03.2023
          //collecting all the flat numbers for comparison
          for (let index = 0;index < this.flatDetailsBreakupFormArr?.length;index++) {
            allFlats.push(
              this.flatDetailsBreakupFormArr.controls[index].get('flatnum')?.value
            );
          }
          //collecting all the wing type for comparison
          for (let index = 0;index < this.flatDetailsBreakupFormArr?.length;index++) {
            allWings.push(
              this.flatDetailsBreakupFormArr.controls[index].get('wing')?.value
            );
          }
          //testing
          console.log("flats lenth", allFlats.length);
          console.log("flats lenth", allWings.length);
          for (let index = 0;index < allWings?.length;index++) {
            console.log("Wing",allWings[index]);
          }
          for (let index = 0;index < allFlats?.length;index++) {
            console.log("Flats",allFlats[index]);
          }
        //Phase 2: Check whether flatnumber in the same wing exist or not. If exist then give error message.
        if (typeof allFlats != undefined) {
          if (allFlats != null && allWings != null) {
            if ((allFlats.length != 0 && allWings.length !=0) && (allFlats.length == allWings.length)) {
              for (let i = 0; i < allFlats.length; i++) {
                  if(i != currentFlatIndex){
                    let wingOfCurrentFlatno = this.flatDetailsBreakupFormArr.controls[currentFlatIndex].get('wing')?.value;
                  if (allFlats[i] == allFlats[currentFlatIndex] && allWings[i] == wingOfCurrentFlatno) { // NS 23.03.2023 added wing comparison for the flat number.
                    if (i != currentFlatIndex) {
                      this.modalService.showErrorDialog(
                        'Flat Details',
                        'Flat number with same wing already exist.',
                        'error'
                      );
                      return true;
                    }
                  }
                }
              }
            }
            else
            {
              this.modalService.showErrorDialog(
                'Flat Details',
                'Flat number or wing number has zero length',
                'error'
              );
            }
          }
          else
          {
            this.modalService.showErrorDialog(
              'Flat Details',
              'Flat number or wing number does not exist.',
              'error'
            );
            return true;
          }
        }
      }
    }
  }
    return false;
  }
  //NS 11.03.2023 check whether duplicate wing number exist or not.
  checkDuplicateWingExist(): boolean {
    let rawArr = [];
    if (typeof this.flatDetailsBreakupFormArr != undefined) {
      if (this.flatDetailsBreakupFormArr != null) {
        for (
          let index = 0;
          index < this.flatDetailsBreakupFormArr?.length;
          index++
        ) {
          rawArr.push(
            this.flatDetailsBreakupFormArr.controls[index].get('wing')?.value
          );
        }

        if (typeof rawArr != undefined) {
          if (rawArr != null) {
            if (rawArr.length != 0) {
              for (let i = 0; i < rawArr.length; i++) {
                for (let j = 0; j < rawArr.length; j++) {
                  if (rawArr[i] == rawArr[j]) {
                    if (i != j) {
                      this.modalService.showErrorDialog(
                        'Flat Details',
                        'Duplicate wing number exist.',
                        'error'
                      );
                      return true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return false;
  }
  InvalidFirstCharForFlatnum!:boolean;
  FirstCharOrNot(event: any, index: number) {
    let strFlatno = event.target.value.toString();
    console.log('first char string ->>', strFlatno.charCodeAt(0));
    let c = strFlatno.charCodeAt(0);
    if(event.target.value != "") //NS 23.03.2023 implementing solution in use-case in which value is blank string.
    {
      if (!((c >= 65 && c < 91) || (c >= 97 && c < 123))) {
        let flatnumControlName = 'flatnum'+index;
        //this.modalService.showErrorDialogCallBack("error",'First letter of Flat Number must be Character.', this.focusField(flatnumControlName), "error");
        //following code will make the validation message appear when control state is invalid for div tag of accomatdation type.
        let idname= 'flatnumDiv'+index;
        let divElement= <HTMLFormElement>document.getElementById(idname);
        divElement.style.display = 'block';

        //following code has been written to avoid two validation messages that appeared at the same time in case of invalid state of control. [validation 1] required message [validation 2] first character must be letter.
        this.InvalidFirstCharForFlatnum=true;
        this.cdref.detectChanges();
      }
      else
      {
        //following code will make the validation message disappear when control state is valid for div tag of accomatdation type.
        let idname= 'flatnumDiv'+index;
        let divElement= <HTMLFormElement>document.getElementById(idname);
        divElement.style.display = 'none';
        //following code has been written to avoid two validation messages that appeared at the same time in case of invalid state of control. [validation 1] required message [validation 2] first character must be letter.
        this.InvalidFirstCharForFlatnum = false;
        this.cdref.detectChanges();
      }
    }
    // else 
    // {
    //   //this.modalService.showErrorDialog("error", "Value can not be blank.", "error");
    //   this.InvalidFirstCharForFlatnum=false;
    //   this.cdref.detectChanges();
    // }
  }

  setFocus(id: string) {
    // Method to set focus to object on form
    setTimeout(() => {
      let inF = document.getElementById(id) as HTMLElement;
      this.renderer.selectRootElement(inF).focus();
    }, 100);
  }

  focusField(fieldId: any) {
    setTimeout(() => {
      let el = document.getElementById(fieldId)
        ?.childNodes[0] as HTMLInputElement;
      el?.focus();
    }, 800);
  }
  focusFieldForOwningCoy(fieldId: any) {
    setTimeout(() => {
      let el = document.getElementById(fieldId)
        ?.childNodes[0] as HTMLInputElement;
      el?.focus();
    }, 50);
  }

  focusFieldForPaycoy(fieldId: any) {
    setTimeout(() => {
      let el = document.getElementById(fieldId)
        ?.childNodes[0] as HTMLInputElement;
      el?.focus();
    }, 50);
  }
  createPayloadAndCallOperation()
  {
  
    this.buildingForm.patchValue({
      city: this.receivedAddressData.value['addressResponseBean']?.city,
      township: this.receivedAddressData.value['addressResponseBean']?.town,
    });

    let addressRequestBean = this.convertValuesToUpper(
      this.receivedAddressData.value['addressResponseBean']
    );

    //console.log('form', this.buildingForm);
    console.log('array', this.flatDetailsBreakupFormArr);

    let bfValuesToUpper = this.convertValuesToUpper(
      this.buildingForm.value
    );
    //let userid = sessionStorage.getItem('userName'); NS 01.02.2023 commenting this statement as consulted by Sneha from Neosoft because this Userid will be taken from backend springboot.

    // let partyRequestBean = {
    //   partyname: bfValuesToUpper.name,
    //   userid,
    //   city: addressRequestBean.city,
    //   township: addressRequestBean.township,
    //   pmtacnum: bfValuesToUpper.pmtacnum,
    //   title: bfValuesToUpper.title,
    //   gstno: bfValuesToUpper.gstno,
    // };
    let code1; //NS 28.02.2023 problem is that no solution was there so i concluded out this solution for problem of getting lowercase inserted in database if user forget to on caps-lock key.
    if (this.tranMode == 'R') {
      code1 = this.buildingSelectionsForm.controls['code'].value[0][0].toUpperCase();
    } else if (this.tranMode == 'A') {
      code1 = this.buildingSelectionsForm.controls['code'].value.toUpperCase();
    }

    console.log('code1', code1);
    //NS 24.03.2023 (due to drawback of F1-dynapop created by Dilip) check whether code is upperacse or not, if code is not in uppercase then convert it to uppercase.
    if(!(code1 == code1.toUpperCase())) 
    {
      code1 = code1.toUpperCase();  //convert to uppercase before sending to database.
    }
    

    let addressRequestBeanForPayLoad = this.convertValuesToUpper(
      this.receivedAddressData.value['addressResponseBean']
    );

    let temp1 = this.buildingForm.get('project')?.value.toString();
    let projectCode = temp1.substring(0, temp1.indexOf(','));
    console.log('project code', projectCode);

    // let mailinfoPossdate = this.mailInfoForm.get('possdate')?.value
    //   ? moment(this.mailInfoForm.get('possdate')?.value).format(
    //       'DD/MM/YYYY'
    //     )
    //   : null;

    // console.log("code1", code1);
    //NS 31.03.2023 start 
    let opendateforminorstable;
    if(this.buildingForm2.get('opendate')?.value == null)
    {
      opendateforminorstable = null;
    }
    else
    {
      opendateforminorstable = moment(this.buildingForm2.get('opendate')?.value).format(
        'DD/MM/YYYY'
      );
    }

    let closedatebldgmaptable;
    if(this.buildingForm2.get('closedate')?.value == null)
    {
      closedatebldgmaptable = null;
    }
    else
    {
      closedatebldgmaptable = moment(this.buildingForm2.get('closedate')?.value).format(
        'DD/MM/YYYY'
      );
    }
    let mailinfoPossdate;
    if(this.mailInfoForm.get('possdate')?.value == null)
    {
      mailinfoPossdate = null;
    }
    else
    {
      mailinfoPossdate = moment(this.mailInfoForm.get('possdate')?.value).format(
        'DD/MM/YYYY'
      ).toString(); //NS 01.04.2023
    }

    if((this.mailInfoForm.get("coy")?.value == null) || (this.mailInfoForm.get("coy")?.value == "") || (this.mailInfoForm.get("coy")?.value == undefined))
    {
      this.mailInfoForm.get("coy")?.setValue(" ");
    }
    if((this.mailInfoForm.get("project")?.value == null) || (this.mailInfoForm.get("project")?.value == "") || (this.mailInfoForm.get("project")?.value == undefined))
    {
      this.mailInfoForm.get("project")?.setValue(" ");
    }
//NS 31.03.2023 end 

    let savePayload = {
      code: code1, //NS 22.02.2023 part of buildingrequestbean
      ...this.buildingForm.value,
      project: projectCode, //NS 22.02.2023 part of account sensititve details(buildingForm in html)
      ...this.buildingForm2.value,
      // addressRequestBean: {
      //   ...addressRequestBean,
      // },
      // partyRequestBean,
      mailinfoRequestBean: {
        ...this.mailInfoForm.value,
        abldgcode: code1, //NS 21.02.2023 part of mailinfo FORM IN HTML
        ebldgcode: code1, //NS 21.02.2023 part of mailinfo FORM IN HTML
        possdate: mailinfoPossdate,
      },

      flatsRequestBeanList: this.flatDetailsBreakupFormArr.value,

      //-----------------NS 01.02.2023 start -----------------------
      bldgmapRequestBean: {
        abldgcode: code1,
        abldgname: this.buildingForm.get('name')?.value,
        blockcerttype: '',
        closedate: closedatebldgmaptable,
        coy1: this.buildingForm.get('paycoy')?.value,
        coy2: this.buildingForm.get('paycoy')?.value,
        coy3: this.buildingForm.get('coy')?.value,
        ebldgcode: this.buildingSelectionsForm
          .get('code')
          ?.value.toString()
          .substring(
            0,
            this.buildingSelectionsForm
              .get('code')
              ?.value.toString()
              .indexOf(',')
          ),
        ebldgname: this.buildingForm.get('name')?.value,
      },
      //-----------------NS 01.02.2023 end -------------------------

      //-----------------NS 01.02.2023 start -----------------------
      minorsRequestBean: {
        closedate: moment(
          this.buildingForm2.get('closedate')?.value
        ).format('DD/MM/YYYY'),
        // ), 11.02.2023 NS commented as this field is not required because it is part of constraint key and was giving error while updating
        minorscode: this.buildingSelectionsForm
          .get('code')
          ?.value.toString()
          .substring(
            0,
            this.buildingSelectionsForm
              .get('code')
              ?.value.toString()
              .indexOf(',')
          ),
        minorsname: this.buildingForm.get('name')?.value,
        minorstype: 'B',
        opendate: opendateforminorstable,
        validminor: 'Y'
      },

      addressRequestBean: addressRequestBeanForPayLoad, //NS 21.02.2023
      //-----------------NS 01.02.2023 end -------------------------

      // gstValdiationBean: {
      //   state: addressRequestBean.state,
      //   gstNumber: bfValuesToUpper.gstno,
      //   panCardNumber: bfValuesToUpper.pmtacnum,
      // },
      //userid, NS 01.02.2023
    };

    //solution given by sneha for date format problem NS 10.02.2023
    //savePayload.ccdate = savePayload.ccdate
    //console.log('ulc date', savePayload); //.ulcdate);
    //console.log(savePayload.ulcdate.format('DD/MM/YYYY'));
    // if(this.buildingForm2.get('ccdate')?.value == '')
    // {

    // }
//NS ---------------------------------------------------------------------------------------------------------------------
    savePayload.possdate =  moment(this.mailInfoForm.get('possdate')?.value, 'yyyy-MM-dd', true).isValid()
      ? moment(this.mailInfoForm.get('possdate')?.value).format(
          'DD/MM/YYYY'
        )
      : null;
      if(this.mailInfoForm.controls['possdate'].valid == false)
      {
        this.mailInfoForm.controls['possdate'].setValue(null);
      }

    savePayload.region = this.buildingForm2.controls['region'].value[0][0]; //11.03.2023 new dynapop control has been used here which required code to be extracted from the array it is throwing, thats why this code has been written.
    console.log(
      'region -->',
      this.buildingForm2.controls['region'].value[0][0]
    );

    savePayload.project = this.buildingForm.controls['project'].value[0][0]; //22.02.2023 new dynapop control has been used here which required code to be extracted from the array it is throwing, thats why this code has been written.

    savePayload.opendate = moment(savePayload.opendate, 'yyyy-MM-dd', true).isValid() //solution by neosoft dilip not working
      ? moment(savePayload.opendate).format('DD/MM/YYYY')
      : null;
      if(this.buildingForm2.controls['opendate'].valid == false)
      {
        this.buildingForm2.controls['opendate'].setValue(null);
      }


    savePayload.closedate = moment(savePayload.closedate, 'yyyy-MM-dd', true).isValid()
      ? moment(savePayload.closedate).format('DD/MM/YYYY')
      : null;
      if(this.buildingForm2.controls['closedate'].valid == false)
      {
        this.buildingForm2.controls['closedate'].setValue(null);
      }

    savePayload.occdate = moment(savePayload.occdate, 'yyyy-MM-dd', true).isValid()
      ? moment(savePayload.occdate).format('DD/MM/YYYY')
      : null;
      if(this.buildingForm2.controls['occdate'].valid == false)
      {
        this.buildingForm2.controls['occdate'].setValue(null);
      }

    savePayload.schposs = moment(savePayload.schposs, 'yyyy-MM-dd', true).isValid()
      ? moment(savePayload.schposs).format('DD/MM/YYYY')
      : null;
      if(this.buildingForm2.controls['schposs'].valid == false)
      {
        this.buildingForm2.controls['schposs'].setValue(null);
      }

    savePayload.ulcdate = moment(savePayload.ulcdate, 'yyyy-MM-dd', true).isValid()
      ? moment(savePayload.ulcdate).format('DD/MM/YYYY')
      : null;
      if(this.buildingForm2.controls['ulcdate'].valid == false)
      {
        this.buildingForm2.controls['ulcdate'].setValue(null);
      }

//console.log("ccdate2", moment(savePayload.ccdate, 'yyyy-MM-dd', true).isValid());
    savePayload.ccdate = moment(savePayload.ccdate, 'yyyy-MM-dd', true).isValid()
      ? moment(savePayload.ccdate).format('DD/MM/YYYY')
      : null;
      console.log("ccformdate", this.buildingForm2.controls['ccdate'].valid);
      
      if(this.buildingForm2.controls['ccdate'].valid == false)
      {
        this.buildingForm2.controls['ccdate'].setValue(null);
      }

     //------------------NS 11.04.2023 Start --------------------------------------------------------
      // if(this.buildingForm2.get("misproject")?.value == "NA") //13.04.2023 change value of blank string to NA.
      // {
      //   savePayload.misproject = null;
      // }
      //------------------NS 11.04.2023 End --------------------------------------------------------

      
      //this.buildingForm2.controls['ulcdate'].setValue(null); //NS 30.03.2023
     // this.buildingForm2.controls['ccdate'].setValue(null); //NS 24.03.2023
      

    //   if(this.buildingForm2.get('ccdate')?.value._isValid == false)
    //   {
    //     savePayload.ccdate = null
    //   }
    //   else{
    //     savePayload.ccdate = moment(savePayload.ccdate, 'DD/MM/YYYY');
    //   }

    //   if(this.buildingForm2.get('occdate')?.value._isValid == false)
    //   {
    //     savePayload.occdate = null
    //   }
    //   else{
    //     savePayload.occdate = moment(savePayload.occdate, 'DD/MM/YYYY');
    //   }

    //   if(this.buildingForm2.get('ulcdate')?.value._isValid == false)
    //   {
    //     savePayload.ulcdate = null
    //   }
    //   else{
    //     savePayload.ulcdate = moment(savePayload.ulcdate, 'DD/MM/YYYY');
    //   }

    //   if(this.buildingForm2.get('minfPossdate')?.value._isValid == false)
    //   {
    //     savePayload.minfPossdate = null
    //   }
    //   else{
    //     savePayload.minfPossdate = moment(savePayload.minfPossdate, 'DD/MM/YYYY');
    //   }

    //   if(this.buildingForm2.get('schposs')?.value._isValid == false)
    //   {
    //     savePayload.schposs = null
    //   }
    //   else{
    //     savePayload.schposs = moment(savePayload.schposs, 'DD/MM/YYYY');
    //   }
    //   if(this.buildingForm2.get('opendate')?.value._isValid == false)
    //   {
    //     savePayload.opendate = null
    //   }
    //   else{
    //     savePayload.opendate= moment(savePayload.opendate, 'DD/MM/YYYY');
    //   }
    //   if(this.buildingForm2.get('closedate')?.value._isValid == false)
    //   {
    //     savePayload.closedate = null
    //   }
    //   else{
    //     savePayload.closedate = moment(savePayload.closedate, 'DD/MM/YYYY');
    //   }

    // savePayload.ccdate = savePayload.ccdate
    // ? moment(savePayload.ccdate).format('DD/MM/YYYY')
    // : null;
    console.log('ccdate null or not? =', savePayload.ccdate);
    //console.log("ccdate",moment(savePayload.ccdate).format('DD/MM/YYYY'));
    //console.log("ccdate",moment(savePayload.ccdate).format('DD/MM/YYYY'));

    // savePayload.ulcdate = savePayload.ulcdate
    // ? moment(savePayload.ulcdate).format('DD/MM/YYYY')
    // : nulll

    console.log('save', savePayload);
    // let updateFlag = this.brokerSelectionsForm.controls['brokerName'].value;   //06.12.22	RS
    // console.log('val', updateFlag);                                            //06.12.22	RS

    if (this.tranMode == 'R') {
      // Retrieve Mode
      savePayload['code'] = this.buildingSelectionsForm
        .get('code')
        ?.value.toString()
        .substring(
          0,
          this.buildingSelectionsForm
            .get('code')
            ?.value.toString()
            .indexOf(',')
        ); //

      savePayload['township'] = this.buildingForm.get('township')?.value;

      this.projbldgService.updateBuilding(savePayload).subscribe({
        next: (res) => {
          console.log('update res', res);
          if (res.status) {
            this.modalService.showErrorDialog(
              'Building Updated',
              res['message'],
              'info'
            );
            //need to reset the value of sum so that it will not get miscalculated after submitting and again retrieving the data.
            this.sumOfCarpetUnitArea = 0;
            this.sumOfCarpetParkArea = 0;
            this.sumOfCarpetTerraceArea = 0;
            this.sumOfCarpetAmenityArea = 0;

            this.sumOfSalableUnitArea = 0;
            this.sumOfSalableParkArea = 0;
            this.sumOfSalableTerraceArea = 0;
            this.sumOfSalableAmenityArea = 0;

            this.crateF1DataForBuildings(); // Refresh Building F1 List
            this.back();
          }
        },
      });
    } else if (this.tranMode == 'A') {
      savePayload.closedate = savePayload.closedate
        ? moment(savePayload.closedate).format('DD/MM/YYYY')
        : null; //close date must be added only at the  time of insert/ADD otherwise it will give error while updating as closedate is a part of constraint key.

      // New Entry Mode
      this.projbldgService.addBuilding(savePayload).subscribe({
        next: (res) => {
          console.log('save res', res);
          if (res.status) {
            this.modalService.showErrorDialog(
              'Broker Added',
              res['message'],
              'info'
            );
            this.crateF1DataForBuildings(); // Refresh Broker F1 List
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
  }
  //NS 15.03.2023 shahaji suggested through chat to implement all company names should be same except paying company name.
  //   checkForProjCoySameAsBldgCoy() {
  //   let continueSaveOperation!: boolean;
  //   this.projbldgService
  //     .getProjectCompanyByCode(
  //       this.buildingForm.get('project')?.value[0][0].trim()
  //     )
  //     .subscribe({
  //       next: (res) => {
  //         if (res.status) {
  //           if (this.tranMode == 'R') {
  //             if (res.data != this.buildingForm.get('coy')?.value) {
                
  //               this.modalService.showErrorDialog(
  //                 'error',
  //                 'Project Company and Building Company must be same',
  //                 'error'
  //               );
  //               //this.setFocus("coy");
  //               setTimeout(()=>{
  //                 let element1 = document.getElementById("coy");
  //               console.log("element",element1?.childNodes);
                
  //               this.renderer.selectRootElement(element1?.childNodes[0]).focus();
  //               }, 900);
  //               continueSaveOperation = false;
  //             }
  //             else {
  //               this.createPayloadAndCallOperation();
  //               continueSaveOperation = true;
  //             }
  //           } else if (this.tranMode == 'A') {
  //             if (res.data != this.buildingForm.get('coy')?.value[0][0]) {
  //               this.modalService.showErrorDialog(
  //                 'error',
  //                 'Project Company and Building Company must be same',
  //                 'error'
  //               );
  //               this.renderer.selectRootElement('#coy')?.focus();
  //               continueSaveOperation = false;
  //             }
  //             else {
  //               this.createPayloadAndCallOperation();
  //               continueSaveOperation = true;
  //             }
  //           }
  //         }
  //       },
  //     });
  //   //return continueSaveOperation;
  // }


  // let companyNames:string[] = [];
  // Object.keys(this.buildingForm.controls).forEach((key: string) => {

  //   });

  // let companyNameToBeCompared = this.buildingForm.get("coy")?.value;
  // for(let index=0; index<companyNames.length; index++){

  // }
//------------------------------------------------------------------

checkForProjCoySameAsBldgCoy()
{
  let continueSaveOperation !: boolean;
  // this.projbldgService
  //     .getProjectCompanyByCode(
  //       this.buildingForm.get('project')?.value[0][0].trim()
  //     )
  //     .subscribe({
  //       next: (res) => {
  //         if (res.status) {
  //           if (this.tranMode == 'R') {
  //             if (res.data != this.buildingForm.get('coy')?.value) {
  //               this.modalService.showErrorDialogCallBack('error',
  //               'Project Company and Building Company must be same.', this.focusField('coy'),
  //               'error');
  //               console.log("excuted after dialog closed.");
                
                
  //               // this.modalService.showErrorDialog(
  //               //   'error',
  //               //   'Project Company and Building Company must be same',
  //               //   'error'
  //               // );
  //               //this.setFocus("coy");
  //               // Swal.fire({
  //               //   title: 'Project Company and Building Company must be same',
  //               //   showDenyButton: true,
  //               //   denyButtonText:'OK'
  //               // }).then((result) => {
  //               //   /* Read more about isConfirmed, isDenied below */
  //               //   if (result.isDenied) {
  //               //     //this.setFocus("coy");
  //               //     // let element1 = document.getElementById("coy");
  //               //     // console.log("element",element1?.childNodes);
                    
  //               //     // this.renderer.selectRootElement(element1?.childNodes[0]).focus();
  //               //     this.focusField("coy");
  //               //   }
  //               // });

             

            
  //               continueSaveOperation = false;
  //             }
  //             else {
  //               this.createPayloadAndCallOperation();
  //               continueSaveOperation = true;
  //             }
  //           } else if (this.tranMode == 'A') {
  //             if (res.data != this.buildingForm.get('coy')?.value[0][0]) {
  //               this.modalService.showErrorDialog(
  //                 'error',
  //                 'Project Company and Building Company must be same',
  //                 'error'
  //               );
  //               this.renderer.selectRootElement('#coy')?.focus();
  //               continueSaveOperation = false;
  //             }
  //             else {
  //               this.createPayloadAndCallOperation();
  //               continueSaveOperation = true;
  //             }
  //           }
  //         }
  //       },
  //       error:()=>{

  //       },
  //       complete:()=>{
  //         // this.messageShow();
  //         console.log('complete');
          
  //       }
  //     }
  //     );

}



showConfirmationForPaycoy(
  titleVal: any,
  message: string,
  type: string,
  confirmationDialog: boolean
) {
  const dialogRef = this.dialog.open(ModalComponent, {
    disableClose: true,
    data: {
      restoreFocus: false,
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
  dialogRef.afterClosed().subscribe((result) => {
    console.log("result -->", result);
    if(result)
    {      
      this.forPaycoyOnPressingYes(); //NS 28.03.2023
    }
    else
    {
      this.forPaycoyOnPressingNo(); //NS 28.03.2023
    }
    
  });
}

rowIndexForDeleteOp!:any;
showConfirmationForDeleteInRetrieveMode(
  titleVal: any,
  message: string,
  type: string,
  confirmationDialog: boolean,
  rowIndex:any
) {
  const dialogRef = this.dialog.open(ModalComponent, {
    disableClose: true,
    data: {
      restoreFocus: false,
      isF1Pressed: false,
      title: titleVal,
      message: message,
      template: '',
      type: type,
      confirmationDialog: confirmationDialog,
    },
  });
  this.rowIndexForDeleteOp = rowIndex;
  dialogRef.afterOpened().subscribe(() => {
    console.log('Dialog Opened');
  });
  dialogRef.afterClosed().subscribe((result) => {
    console.log("result -->", result);
    if(result)
    {      
      this.forDeleteBtnOnPressingYesForRetrieveMode(this.rowIndexForDeleteOp); //NS 28.03.2023
    }
    else
    {
      this.forDeleteBtnOnPressingNoForRetrieveMode(); //NS 28.03.2023
    }
    
  });
}

forDeleteBtnOnPressingYesForRetrieveMode(rowIndex:any){
  console.log("remvoe index",this.flatDetailsBreakupFormArr.at(rowIndex).value.bldgcode);
    this.projbldgService.deleteFlatByBldgCodeAndWingAndFlatnum(this.flatDetailsBreakupFormArr.at(rowIndex).value.bldgcode, this.flatDetailsBreakupFormArr.at(rowIndex).value.wing, this.flatDetailsBreakupFormArr.at(rowIndex).value.flatnum).subscribe((res)=>{
      if(res.status){
      
        //console.log(res.data);
        //this.toastr.show(res.message);
        this.showConfirmation(constant.ErrorDialog_Title, res.message, "info", false); //NS 04.04.2023
        this.deleteFormArr(rowIndex);
      }
      else{
        this.showConfirmation(constant.ErrorDialog_Title, res.message, "info", false); //NS 04.04.2023
      }    
    }
    
    
    );
}
forDeleteBtnOnPressingNoForRetrieveMode(){

}

showConfirmationForDeleteInAddMode(
  titleVal: any,
  message: string,
  type: string,
  confirmationDialog: boolean,
  rowIndex:any
) {
  const dialogRef = this.dialog.open(ModalComponent, {
    disableClose: true,
    data: {
      restoreFocus: false,
      isF1Pressed: false,
      title: titleVal,
      message: message,
      template: '',
      type: type,
      confirmationDialog: confirmationDialog,
    },
  });
  this.rowIndexForDeleteOp = rowIndex;
  dialogRef.afterOpened().subscribe(() => {
    console.log('Dialog Opened');
  });
  dialogRef.afterClosed().subscribe((result) => {
    console.log("result -->", result);
    if(result)
    {      
      this.forDeleteBtnOnPressingYesForAddMode(this.rowIndexForDeleteOp); //NS 28.03.2023
    }
    else
    {
      this.forDeleteBtnOnPressingNoForAddMode(); //NS 28.03.2023
    }
    
  });
}

forDeleteBtnOnPressingYesForAddMode(rowIndex:any)
{
  this.deleteFormArr(rowIndex);
  this.showConfirmation(constant.ErrorDialog_Title, "Deleted Successfully!", "info", false);
}

forDeleteBtnOnPressingNoForAddMode()
{

}
showConfirmationForBuildigCoy(
  titleVal: any,
  message: string,
  type: string,
  confirmationDialog: boolean
) {
  const dialogRef = this.dialog.open(ModalComponent, {
    disableClose: true,
    data: {
      restoreFocus: false,
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
  dialogRef.afterClosed().subscribe(() => {
      this.focusFieldForOwningCoy('coy');
  });
}
//-------------------------------START NS 25.03.2023 ---------------------------------------------
//IT WILL CHECK WHETHER BUILDING COMPANY IS SAME AS PROJECT COMPANY, IF SAME THEN WILL NOT ALLOW TO PERFORM SAVE OPERATION.
isBldgCoySameAsProjCoy:boolean = false;
setIsBldgCoySameAsProjCoy(val:boolean)
{
  this.isBldgCoySameAsProjCoy = val;
  console.log("inside set method", this.isBldgCoySameAsProjCoy );
  
}
checkForBldgCoySameAsProjCoy() //check both condition, [condition 1]all_coy in both tab(tab1 and tab2) must be same as proj_coy [condition 2]bldg_coy must be same as proj_coy
{
    this.projbldgService
  .getProjectCompanyByCode(
    this.buildingForm.get('project')?.value[0][0].trim()
  )
  .subscribe({
    next: (res) => {
      if(res.status){
        let allCoyNameSame!:boolean;
        let allCoyNameInTab1!:boolean;
        let allCoyNameInTab2!:boolean;
  //NS 27.03.23 All companies must be same as Project Company. Except Paying Company!
  Object.keys(this.buildingForm.controls).forEach((key: string) => {
    if(key == "concoy" || key == "opt2engg" || key == "opt2sales" || key == "intbrokcoy" || key == "leasingcoy"){
      console.log(this.buildingForm.get(key)?.value)
      if(this.buildingForm.get(key)?.value != null){
        if(this.buildingForm.get(key)?.value != ""){
          if(this.buildingForm.get(key)?.value != undefined){
        if(this.buildingForm.get(key)?.value.trim() != res.data.trim()){
          console.log(key);
          console.log("1",this.buildingForm.get(key)?.value);
          console.log("2", this.buildingForm.get('paycoy')?.value);
          
          allCoyNameInTab1 = false;
          //return;
        }
      } 
      }
    }
    }
  });
  //NS  27.03.23 All companies must be same as Project Company. Except Paying Company!
  // Object.keys(this.buildingForm2.controls).forEach((key: string) => {
  //   if(key == "maintcoy"){
  //     console.log("entered second form.");
  //     if(this.buildingForm2.get(key)?.value != null){ //NS 30.03.2023 THIS LINE IS WRITTEN TO AVOID EXCEPTION FOR VALUES WITH NULL BECAUSE COMPILER WILL THROW EXCEPTION WHILE TRY TO PROCESS THE STRING USING TRIM METHOD.
  //       if(this.buildingForm2.get(key)?.value != ""){
  //         if(this.buildingForm2.get(key)?.value != undefined){
  //     if(this.buildingForm2.get(key)?.value.trim() != res.data.trim()){
  //       console.log("1",this.buildingForm2.get(key)?.value);
  //       console.log("2", this.buildingForm.get('paycoy')?.value);
  //       allCoyNameInTab2 = false;
  //       //return;
  //     } 
  //   }
  // }
  //   }
  // }
  //   });

  //NS 27.03.2023 if any of the form out of two found mismatch with project company field then return false but if all fields are same as project company then return true.
  //if(allCoyNameInTab1 == false || allCoyNameInTab2 == false)
  if(allCoyNameInTab1 == false)
  {
    allCoyNameSame = false; //this value will be used to show error message to user.
  }
  else
  {
    allCoyNameSame = true; //this value will be used to continue save operation.
  }
  if(allCoyNameSame)
  {
    let IsBldgCoySameAsProjCoy;
  //following code will check whether building company is same as project company. if same then will give message otherwise will execute the saveoperation.
        if (this.tranMode == 'R') {
          if (res.data.trim() != this.buildingForm.get('coy')?.value.trim()) {              
            this.showConfirmationForBuildigCoy(constant.ErrorDialog_Title, 'Project Company and Building Company must be same.', 'error' , false);
            //THIS METHOD WILL SET THE CLASS PROPERTY WHICH WILL HELP TO DETERMINE WHETHER TO PERFORM SAVE OPERTATION OR NOT.
            //this.setIsBldgCoySameAsProjCoy(false);
            IsBldgCoySameAsProjCoy = false;
          }
          else{
            //this.setIsBldgCoySameAsProjCoy(true);//THIS METHOD WILL SET THE CLASS PROPERTY WHICH WILL HELP TO DETERMINE WHETHER TO PERFORM SAVE OPERTATION OR NOT.
            IsBldgCoySameAsProjCoy = true;
          }

          if(IsBldgCoySameAsProjCoy)
          {
            this.createPayloadAndCallOperation();//this will perform save operation for both Insert and Update.  
          }
          else
          {
            this.showConfirmation(constant.ErrorDialog_Title, "Building company is not same as project company.", "error", false);
          }
        }
        else if (this.tranMode == 'A') { 
          if (res.data != this.buildingForm.get('coy')?.value.trim()) {
            this.showConfirmationForBuildigCoy(constant.ErrorDialog_Title, 'Project Company and Building Company must be same.', 'error' , false);                 
            //this.setIsBldgCoySameAsProjCoy(false);//THIS METHOD WILL SET THE CLASS PROPERTY WHICH WILL HELP TO DETERMINE WHETHER TO PERFORM SAVE OPERTATION OR NOT.
            IsBldgCoySameAsProjCoy = false;
          }
          else{
            //this.setIsBldgCoySameAsProjCoy(true);//THIS METHOD WILL SET THE CLASS PROPERTY WHICH WILL HELP TO DETERMINE WHETHER TO PERFORM SAVE OPERTATION OR NOT.
            IsBldgCoySameAsProjCoy = true;
          }

          if(IsBldgCoySameAsProjCoy)
          {
            this.createPayloadAndCallOperation();//this will perform save operation for both Insert and Update.  
          }
          else
          {
            this.showConfirmation(constant.ErrorDialog_Title, "Building company is not same as project company.", "error", false);
          }
        }
        //end logic
  }
  else
  {
    //show message
    this.el.nativeElement.querySelector("a[href='#accountSensitiveDetails']")?.click(); 
    this.showConfirmation(constant.ErrorDialog_Title, "All companies must be same as Project Company. Except Paying Company!", "error", false);
  }
      }

    },
    error: (err) => {

    }
  }
  );

  }
  
//---------------------------------------END NS 25.03.2023--------------------------------

//---------------------------------------START NS 27.03.2023--------------------------------
//check whether all companies are same as paying company, if not same then give information message.
//if this function returns true then execution of saving operation will be perform without any termination else execution of saving operation will be perform.
isPayCoySameAsRestCoyInTab1!:boolean;
//isPayCoySameAsRestCoyInTab2!:boolean;
checkPayCoySameAsRestCoy():boolean
{
  //----------------------------------------------------------------------------------------------------
  //NS 27.03.23 match the value of paying company with all the companies of tab1(i.e. Account sensitive building details).
  Object.keys(this.buildingForm.controls).forEach((key: string) => {
      if(key == "coy" || key == "concoy" || key == "opt2engg" || key == "opt2sales" || key == "intbrokcoy" || key == "leasingcoy"){
        console.log(this.buildingForm.get(key)?.value)
        if(this.buildingForm.get(key)?.value != null){
          if(this.buildingForm.get(key)?.value != ""){
            if(this.buildingForm.get(key)?.value != undefined){
        if(this.buildingForm.get(key)?.value.trim() != this.buildingForm.get('paycoy')?.value.trim()){
          console.log(key);
          console.log("1",this.buildingForm.get(key)?.value);
          console.log("2", this.buildingForm.get('paycoy')?.value);          
          this.isPayCoySameAsRestCoyInTab1 = false;
          //return;
        } 
      }
    }
      }
      }
    });
  //NS  27.03.23 match the value of paying company with all the companies of tab2(i.e. Architectural sensitive building details).
    // Object.keys(this.buildingForm2.controls).forEach((key: string) => {
    //   if(key == "maintcoy"){
    //     if(this.buildingForm2.get(key)?.value != null){
    //       if(this.buildingForm2.get(key)?.value != ""){
    //         if(this.buildingForm2.get(key)?.value != undefined){
    //     if(this.buildingForm2.get(key)?.value.trim() != this.buildingForm.get('paycoy')?.value.trim()){
    //       console.log(key);      
    //       console.log("1",this.buildingForm2.get(key)?.value);
    //       console.log("2", this.buildingForm.get('paycoy')?.value);
    //       this.isPayCoySameAsRestCoyInTab2 = false;
    //       //return;
    //     } 
    //   }
    // }
    //    }
    //   }
    //   });

    //NS 27.03.2023 if any of the form out of two found mismatch with paying company field then return false but if all fields are same as paying company then return true.
    //if(this.isPayCoySameAsRestCoyInTab1 == false || this.isPayCoySameAsRestCoyInTab2 == false)
    if(this.isPayCoySameAsRestCoyInTab1 == false)
    {
      return false; //this value will be used to determine whether to show message to user or not.
    }
    else
    {
      return true;//this value will be used to determine whether to show message to user or not.
    }
}
//---------------------------------------END NS 27.03.2023----------------------------------

//---------------------------------------START NS 27.03.2023----------------------------------
forPaycoyOnPressingYes()
{

  this.checkForBldgCoySameAsProjCoy(); //NS 28.03.2023
}

forPaycoyOnPressingNo()
{
  this.el.nativeElement.querySelector("a[href='#accountSensitiveDetails']")?.click(); 

  //this.focusFieldForPaycoy('paycoy'); //NS 28.03.2023
  //this.el.nativeElement.querySelector("paycoy")?.focus();
  //this.renderer.selectRootElement('#paycoy')?.focus(); 
}
//---------------------------------------END NS 27.03.2023----------------------------------

setWhiteSpaceInWingColmnToBlankString() //NS 23.03.2023 this method will set blank string character to one white space character in order to avoid the error of inserting null values at oracle end.
{
  if(this.flatDetailsBreakupFormArr != undefined || this.flatDetailsBreakupFormArr != null)  
  {
    let allWings = [];

    for (let index = 0;index < this.flatDetailsBreakupFormArr?.length;index++) {
      allWings[index] = this.flatDetailsBreakupFormArr.controls[index].get('wing')?.value; 
      console.log("Wing", this.flatDetailsBreakupFormArr.controls[index].get('wing')?.value);
    }

    for (let index = 0;index < this.flatDetailsBreakupFormArr?.length;index++) {
      if( allWings[index] == "")
      {
        this.flatDetailsBreakupFormArr.controls[index].get('wing')?.setValue(" "); 
      }
    }
  }
}
    saveBuilding() {
      //this.createPayloadAndCallOperation();
    // let code1 = this.buildingSelectionsForm.controls['code'].value[0][0];
    // console.log("code1 for retrieve -->", code1);
    // code1 = this.buildingSelectionsForm.controls['code'].value;
    // console.log("code1 for Add -->", code1);
    // Object.keys(this.buildingForm.controls).forEach((key: string) => {
    //   if(key != "")
    // });
    //return;
    //console.log('flatdetailsform', this.flatDetailsData[1].flatnum);
    //console.log("ccdate1", this.buildingForm2.get('ccdate')?.value);
    //    return;
   // console.log("accomtype", this.flatDetailsBreakupFormArr.controls[this.flatDetailsBreakupFormArr.length-1].get("accomtype")?.value);
   
    this.FlatnumRequiredValidationOnSubmit();
    if (
      this.buildingForm.valid &&
      this.buildingForm2.valid &&
      this.mailInfoForm.valid &&
      this.receivedAddressData.valid && 
      this.flatDetailsBreakupFormArr.valid
    ) {
      // Check whether data is entered properly
      //--------------------NS 27.01.2023 Start---------------------------------------
      //below code implements validations for form in each tab.
      //tab-4 (Flat Details) validation
      //---------------------NS ------------------------------------
      // if (this.flatDetailsBreakupFormArr.errors?.['duplicateFlatExist']) {
      //   this.toastr.error('Duplicate Flat Number Exists');
      // }
      
        //NS 11.03.2023
        this.setFloor(); //NS
        this.setDateToDbFormatForFlats(); //NS
        this.setOwneridForNewlyAddedFlatsInGrid(); //NS 15.02.2023, 16.02.2023 change the name
        //this.setBlankstringToWhiteSpaceForWingInGrid();//NS 17.02.2023

        this.CheckPrevstateEqualsToCurrntstateForWing(); //NS 21.02.2023 THIS WILL SEND OLD VALUE(RETRIEVED VALUE) WHICH IS REQUIRED FOR UPDATE QUERY TO WORK AND WILL BE USED INSIDE THE WHERE PART OF UPDATE QUERY IN SPRINGBOOT.
        this.CheckPrevstateEqualsToCurrntstateForFlatnum(); //NS 21.02.2023 THIS WILL SEND OLD VALUE(RETRIEVED VALUE) WHICH IS REQUIRED FOR UPDATE QUERY TO WORK AND WILL BE USED INSIDE THE WHERE PART OF UPDATE QUERY IN SPRINGBOOT.
        //NS 17.03.2023 Start implementing function that will abort save operation upon returning the false when building code and projet code are not same.
        //let decision!:boolean;
        //setTimeout(() => {decision = this.checkForProjCoySameAsBldgCoy();}, 2000);
        
        // let temp = this.checkForProjCoySameAsBldgCoy();
        // if (temp) {
        //   this.renderer.selectRootElement('#code')?.focus(); 
        // }
        this.setWhiteSpaceInWingColmnToBlankString();
        //this.checkForProjCoySameAsBldgCoy();
        if(!this.checkPayCoySameAsRestCoy())
        {
          this.showConfirmationForPaycoy(constant.ErrorDialog_Title, 'Paying Company is not same as other companies. Do you want to continue? ', 'info' , true);
        }
        else
        {
          this.checkForBldgCoySameAsProjCoy(); //NS 28.03.2023
        }
        // console.log("this.isBldgCoySameAsProjCoy before IF", this.isBldgCoySameAsProjCoy);        
    } else {
      let invalidFormNameList ="";
      let enableBelowValiation :boolean = true;
      if(!this.buildingForm.valid)
      {
        invalidFormNameList = invalidFormNameList + "[tab 1] Account Sensitive Building Details ";
        this.el.nativeElement.querySelector("a[href='#accountSensitiveDetails']")?.click(); 
        enableBelowValiation = false;
      }

      if(!this.buildingForm2.valid && enableBelowValiation)
      {
        invalidFormNameList = invalidFormNameList + "[tab 2] Architectural Sensitive Building Details ";
        this.el.nativeElement.querySelector("a[href='#archSensitiveDetails']")?.click(); 
        enableBelowValiation = false;
      }

      if(!this.mailInfoForm.valid && enableBelowValiation)
      {
        invalidFormNameList = invalidFormNameList + "[tab 3] Mail Info Details ";
        this.el.nativeElement.querySelector("a[href='#mailInfoDetails']")?.click(); 
        enableBelowValiation = false;
      }

      if(!this.flatDetailsBreakupFormArr.valid && enableBelowValiation)
      {
        invalidFormNameList = invalidFormNameList + "[tab 4] Flat Details ";
        this.el.nativeElement.querySelector("a[href='#flatDetails']")?.click(); 
        enableBelowValiation = false;
      }

      if(!this.receivedAddressData.valid && enableBelowValiation)
      {
        invalidFormNameList = invalidFormNameList + "[tab 5] Address Details ";
        this.el.nativeElement.querySelector("a[href='#address']")?.click(); 
      }

      this.toastr.error("Please fill the following forms properly listed as followed ---->"+ invalidFormNameList); // Data not entered properly
    }
  
  }

  activeAddressField(event: any) {
    event.preventDefault();
    this.addressComponent.activeAddressFieldFocus();
    this.activeTabStringValue = 'addressDetail';
  }

  activeFlatDetailsField(event: any) {
    //this.focusField('wing0');
    //this.el.nativeElement.querySelector('[ng-reflect-name="wing0"] > input')?.focus()
    event.preventDefault();
    //    this.receivedFlatDetailsData.activeFlatDetailsFieldFocus();
    this.activeTabStringValue = 'flatDetails';
  }

  // activeAccDataField(event: any) {
  //   event.preventDefault()
  //    this.deposiotrdetailComponent.activeDepositorDetailFocus()
  //    this.activeTabStringValue = 'depositorDetail'
  // }
  getReceiveAddressData(data: any) {
    // Used this method in html for Address Data
    this.receivedAddressData = data;
  }

  getReceiveFlatDetailsData(data: any) {
    // Used this method in html for Flat Details Data
    this.receivedFlatDetailsData = data;
  }

  activeArchDataField(event: any) {}
  activeMailInfoDataField(event: any) {}

  handleExit() {
    this.router.navigate(['/dashboard'])
  }
  submitclikced:boolean = false;
  FlatnumRequiredValidationOnSubmit() {    
      this.submitclikced = true; 
      //this.cdref.detectChanges();
      let rawArr=[];
          for (let item of this.flatDetailsBreakupFormArr.controls) {
        let ig = <FormGroup>item;
        //console.log('item', ig['controls']['flatnum']);
  
        //this will automatically set the floor number by extracting it from flat number column value of respective flatnumber column.
            console.log("accomtype-->",ig['controls']['flatnum'].value);
            
        rawArr.push(ig['controls']['flatnum'].value);
      }
         if(rawArr.length != 0)
         {
          if (
              typeof rawArr != 'undefined' &&
              rawArr != null &&
              rawArr.length != null &&
              rawArr.length > 0
              ) {
                    for (let i = 0; i < rawArr.length; i++) {
                      if (typeof rawArr[i] != 'undefined' && rawArr[i] != null) {
                        if(rawArr[i] == "")
                        {
                          //following code will show the message if validation fails.
                          let idname= 'flatnumDivForRequired'+i;
                          let divElement= <HTMLFormElement>document.getElementById(idname);
                          divElement.style.display = 'block';
                        }
                        else
                        {
                          //following code will hide the div tag that contains the message when validation fails, in case if validation succeded.
                          let idname= 'flatnumDivForRequired'+i;
                          let divElement= <HTMLFormElement>document.getElementById(idname);
                          divElement.style.display = 'none';
                        }
                      }               
                    }
                    
                  } 
                } 
                
                this.cdref.detectChanges();
                   
}
  


  // getAccomType() {
  //   this.accomTypeQueryCodition = ''
  //   this.dynapop.getDynaPopListObj("ACCOMMODATION", '').subscribe((res: any) => {
  //     this.accomTypeColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
  //     this.accomTypeData = res.data
  //     this.bringBackColumn = res.data.bringBackColumn
  //   })
  // }
  // groupaccomTypeUpdateValue(event: any, index: any, viewGrpNoVal: any) {
  // }
  // getaccomTypeFielsValueChange(viewGrpNoVal: any, event: any, index: any) {
  // }
  // getKeyCodeAccomType(event: any) {
  // }

}
// export function AccomodationRequiredValidationOnSubmit(): ValidatorFn {
//   return (control: AbstractControl):ValidationErrors|null => {
//     let fg = <FormArray>control;
//     let rawArr=[];
//         for (let item of fg['controls']) {
//       let ig = <FormGroup>item;
//       //console.log('item', ig['controls']['flatnum']);

//       //this will automatically set the floor number by extracting it from flat number column value of respective flatnumber column.

//       rawArr.push(ig['controls']['accomtype'].value);
//     }
//        if(rawArr.length != 0)
//        {
//         if (
//             typeof rawArr != 'undefined' &&
//             rawArr != null &&
//             rawArr.length != null &&
//             rawArr.length > 0
//             ) {
//                   for (let i = 0; i < rawArr.length; i++) {
//                     console.log("accomtype -->", rawArr[i]);
                    
//                     if (typeof rawArr[i] != 'undefined' && rawArr[i] != null) {
//                       if(rawArr[i] == "")
//                       {
//                         return {custRequiredValueProperty:true}
//                       }
//                     }               
//                   }
//                 }
//         // if(control.value == "")
//         // {
//         //   return {custRequiredValueProperty:true}
//         // }

//        }

    
//     return null;
//   }
// }

// export function flatsValidation(): ValidatorFn {
//   return (control: AbstractControl) => {
//     //console.log("control",control);
//     // control['controls'].forEach(element => {
//     //   console.log("el",element);

//     // });

//     let fg = <FormArray>control;
//     //console.log("fg",fg);
//     let rawArr = [];
//     let i = 0;

//     for (let item of fg['controls']) {
//       let ig = <FormGroup>item;
//       //console.log('item', ig['controls']['flatnum']);

//       //this will automatically set the floor number by extracting it from flat number column value of respective flatnumber column.

//       rawArr.push(ig['controls']['flatnum'].value);
//     }

//     console.log('rwa', rawArr);
//     let rl = rawArr;
//     let nArr = [...new Set(rl)];
//     console.log('nArrL', nArr.length);

//     if (rl?.length == nArr?.length) {
//       console.log('nArrL null');
//       return null;
//     } else {
//       let formgrpWithErrorArr = [];
//       if (
//         typeof rawArr != 'undefined' &&
//         rawArr != null &&
//         rawArr.length != null &&
//         rawArr.length > 0
//       ) {
//         for (let i = 0; i < rawArr.length; i++) {
//           for (let j = 0; j < rawArr.length; j++) {
//             if (typeof rawArr[i] != 'undefined' && rawArr[i] != null) {
//               if (rawArr[i].toString() == rawArr[j].toString()) {
//                 //console.log("raw",rawArr[i].toString());
//                 //formgrpWithErrorArr.push(rawArr[i].toString());
//                 //console.log("fg",fg);
//                 return { duplicateFlatExist: true };
//               }
//             }
//           }
//         }
//       }
//       // console.log('nArrL error');
//       // return { duplicateFlatExits: true };
//     }

    // for(let i=0;i< rawArr.length; i++)
    //   {
    //     for(let j=0;j< rawArr.length; j++)
    //     {
    //       if(rawArr[i].toString() == rawArr[j].toString())
    //       {
    //         return {found:true}
    //       }
    //     }
    //   }

    // let arr_flatnum: any;
    // for (let i = 0; i < _control.value.length; i++) {
    //   if (_control.value[i]?.flatnum == undefined) {
    //     if (_control.value[i]?.flatnum) {
    //       arr_flatnum.push(_control.value[i]?.flatnum.value);
    //       console.log('test', arr_flatnum[i]);
    //     }
    //   }
    // }
    // if(!arr_flatnum == undefined)
    // {
    //   for(let i=0;i< arr_flatnum.length; i++)
    //   {
    //     for(let j=0;j< _control.value.length; j++)
    //     {
    //       if(arr_flatnum[i] == _control.value[j]?.flatnum.value)
    //       {
    //         return {found:true}
    //       }
    //     }
    //   }
    //   for(let i=0;i< arr_flatnum.length; i++)
    //   {
    //       console.log("test",arr_flatnum[i]);
    //   }
    // }
//     return null;
//   };
// }
