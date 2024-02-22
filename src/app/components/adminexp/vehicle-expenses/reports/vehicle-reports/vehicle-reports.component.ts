import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-vehicle-reports',
  templateUrl: './vehicle-reports.component.html',
  styleUrls: ['./vehicle-reports.component.css']
})
export class VehicleReportsComponent implements OnInit {
  formname!: any;
  loaderToggle: boolean = false;
  StrQuery : any;
  HeaderText1 : any;
  HeaderText2 : any;
  HeaderText3 :any;
  coylist : any;
  vehlist : any;
  RouterName : any;
  repname : string ='' ;

  VehicleRep: FormGroup = new FormGroup({
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    conditionId: new FormControl(1),
    TxtCompany: new FormControl<String[]>([]),
    TxtVehicle: new FormControl<String[]>([]),
    // name: new FormControl<string>('', Validators.required),
    range: new FormGroup({
      FromDate: new FormControl<Date | null>(null),
      ToDate: new FormControl<Date | null>(null),
    }),
  });

  constructor(
    private _service: ServiceService,
    private router: Router,
    private toastr: ToastrService,
    private commonReportService: CommonReportsService,
    ) {}

  ngOnInit(): void {
    console.log("router",this.router.url.split("/")[4])
    this.RouterName = this.router.url.split("/")[4];
    this._service.pageData.subscribe({
      next: (val) => {
        this.formname = `${val.formName}`;
        this.VehicleRep.patchValue({
          reportParameters: {
            formname: `${val.formName}`,
          },
        });
      },
    });
  }

  getReport(print: boolean) {
    if (this.RouterName == 'vehiclehpareport')
    {
      this.repname = 'VehFinanceReport.rpt';
      this.financeMakeWhereClause();
    } 
    else if (this.RouterName == 'vehicledisposalreport') 
    {
        this.repname = 'FrmVehDisposalReport.rpt';
        this.disposalMakeWhereClause();
    } 
    else if (this.RouterName == 'vehiclebatteryrecords')
    {
      this.repname = 'VehBatteryRecords.rpt';
      this.batteryMakeWhereClause();
    }

    console.log('repname',this.repname);

    console.log('before payload',this.VehicleRep)
      
      console.log(this.VehicleRep.controls['TxtCompany']?.value)
      let Coytrimval : any;
      let Vehtrimval :any;
      
      if (this.VehicleRep.controls['TxtCompany']?.value.length){
        Coytrimval = this.VehicleRep.controls['TxtCompany']?.value?.map((val:any) => val.toString().trim());
        this.coylist = `'${Coytrimval?.join(`','`)}'`;
      } 
      
      if(this.VehicleRep.controls['TxtVehicle']?.value.length){
        Vehtrimval = this.VehicleRep.controls['TxtVehicle']?.value?.map((val:any) => val.toString().trim());
        this.vehlist = `'${Vehtrimval?.join(`','`)}'`;
      }

      let sessionPayload: any = {
        name: `${this.repname}`,
        isPrint: false,
        seqId: 1,
        conditionId: 1,
        reportParameters: {
          formname: this.formname,
          // TxtCompany: `'${Coytrimval?.join(`','`)}'`,
          // TxtVehicle:`'${Vehtrimval?.join(`,`)}'`,
          StrQuery : this.StrQuery,
          HeaderText1 : this.HeaderText1,
          HeaderText2 : this.HeaderText2,
          HeaderText3 : this.HeaderText3,
        },
      };
      console.log("report name after payload",this.repname);
      

      console.log('sessionPayload', sessionPayload);
      console.log('after payload',this.VehicleRep)
      if (this.VehicleRep.valid) {
        this.loaderToggle = true;
      this.commonReportService.getParameterizedReport(sessionPayload)
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          this.loaderToggle = false;
          let pdfFile = new Blob([res], { type: 'application/pdf' });
          let fileName = this.commonReportService.getReportName();
          if (print) {
            const blobUrl = URL.createObjectURL(pdfFile);
            const oWindow = window.open(blobUrl, '_blank');
            oWindow?.print();
          } else {
            fileSaver.saveAs(pdfFile, fileName);
          }
        },
        error: (err: any) => {
          this.loaderToggle = false;
        },
        complete: () => {
          this.loaderToggle = false;
        },
      });
    } else{
      this.toastr.error('Please fill the input properly');
    }
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  financeMakeWhereClause(){
    this.StrQuery = "";
    this.HeaderText1 = this.VehicleRep.get('TxtCompany')?.value == '' ? `Company: All` : `Company: ${this.VehicleRep.get('TxtCompany')?.value}`;
    this.StrQuery = this.VehicleRep.get('TxtCompany')?.value == '' ? this.StrQuery + '' : this.StrQuery + ` and eqp_coy in ( ${this.coylist} )`;

    this.HeaderText2 = this.VehicleRep.get('TxtVehicle')?.value == '' ? `Vehicle: All` : `Vehicle: ${this.VehicleRep.get('TxtVehicle')?.value}`;
    this.StrQuery = this.VehicleRep.get('TxtVehicle')?.value == '' ? this.StrQuery + '' : this.StrQuery + ` and eqp_eqpnum in  ( ${this.vehlist} )`;

    let fromdt = moment(this.VehicleRep.get('range.FromDate')?.value).format('DD-MMM-YYYY');
    let todt = moment(this.VehicleRep.get('range.ToDate')?.value).format('DD-MMM-YYYY');
    this.HeaderText3 = this.VehicleRep.get('range.FromDate')?.value ? `Between ${fromdt} And ${todt}`: `Date : All` ;
    this.StrQuery = this.VehicleRep.get('range.FromDate')?.value ?  this.StrQuery + `AND ( eqp_emienddate between '${fromdt}' And '${todt}')` : this.StrQuery + '';
  }

  disposalMakeWhereClause(){
    this.StrQuery = "";
    this.HeaderText1 = this.VehicleRep.get('TxtCompany')?.value == '' ? `Company: All` : `Company: ${this.VehicleRep.get('TxtCompany')?.value}`;
    this.StrQuery = this.VehicleRep.get('TxtCompany')?.value == '' ? this.StrQuery + '' : this.StrQuery + ` and eqp_coy in ( ${this.coylist} )`;

    this.HeaderText2 = this.VehicleRep.get('TxtVehicle')?.value == '' ? `Vehicle: All` : `Vehicle: ${this.VehicleRep.get('TxtVehicle')?.value}`;
    this.StrQuery = this.VehicleRep.get('TxtVehicle')?.value == '' ? this.StrQuery + '' : this.StrQuery + ` and eqp_eqpnum in  ( ${this.vehlist} )`;

    let fromdt = moment(this.VehicleRep.get('range.FromDate')?.value).format('DD-MMM-YYYY');
    let todt = moment(this.VehicleRep.get('range.ToDate')?.value).format('DD-MMM-YYYY');
    this.HeaderText3 = this.VehicleRep.get('range.FromDate')?.value ? `Between ${fromdt} And ${todt}`: `Date : All` ;
    this.StrQuery = this.VehicleRep.get('range.FromDate')?.value ?  this.StrQuery + `AND ( eqp_dispdate between '${fromdt}' And '${todt}')` : this.StrQuery + '';
  }

  batteryMakeWhereClause(){
    this.StrQuery = "";
    this.HeaderText1 = this.VehicleRep.get('TxtCompany')?.value == '' ? `Company: All` : `Company: ${this.VehicleRep.get('TxtCompany')?.value}`;
    this.StrQuery = this.VehicleRep.get('TxtCompany')?.value == '' ? this.StrQuery + '' : this.StrQuery + ` and eqp_coy in ( ${this.coylist} )`;

    this.HeaderText2 = this.VehicleRep.get('TxtVehicle')?.value == '' ? `Vehicle: All` : `Vehicle: ${this.VehicleRep.get('TxtVehicle')?.value}`;
    this.StrQuery = this.VehicleRep.get('TxtVehicle')?.value == '' ? this.StrQuery + '' : this.StrQuery + ` and eqp_eqpnum in  ( ${this.vehlist} )`;

    let fromdt = moment(this.VehicleRep.get('range.FromDate')?.value).format('DD-MMM-YYYY');
    let todt = moment(this.VehicleRep.get('range.ToDate')?.value).format('DD-MMM-YYYY');
    this.HeaderText3 = this.VehicleRep.get('range.FromDate')?.value ? `Between ${fromdt} And ${todt}`: `Date : All` ;
    this.StrQuery = this.VehicleRep.get('range.FromDate')?.value ?  this.StrQuery + `AND ( eqp_batteryexpiry between '${fromdt}' And '${todt}')` : this.StrQuery + '';
  }

}
