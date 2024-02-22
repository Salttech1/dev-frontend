import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementreportsRoutingModule } from './managementreports-routing.module';
import { MonthwisecertAuthDetailComponent } from './monthwisecert-auth-detail/monthwisecert-auth-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonsModule } from "../../common/buttons/buttons.module";
import { BankguarreportComponent } from './bankguarreport/bankguarreport.component';
import { CertauthoutstandingreportComponent } from './certauthoutstandingreport/certauthoutstandingreport.component';
import { ContractsummaryreportComponent } from './contractsummaryreport/contractsummaryreport.component';
import { LogicnoteboqvendorComponent } from './logicnoteboqvendor/logicnoteboqvendor.component';
import { GroupwisecompositereportComponent } from './groupwisecompositereport/groupwisecompositereport.component';
import { BldgwiseannualexpensesreportComponent } from './bldgwiseannualexpensesreport/bldgwiseannualexpensesreport.component';
import { BldgwiseincrementalexpensesreportComponent } from './bldgwiseincrementalexpensesreport/bldgwiseincrementalexpensesreport.component';
import { BoqreportComponent } from './boqreport/boqreport.component';
import { AssessmenttaxreportComponent } from './assessmenttaxreport/assessmenttaxreport.component';
import { MonthlygroupexpensessummaryComponent } from './monthlygroupexpensessummary/monthlygroupexpensessummary.component';
import { BuildingwiseexpensesreportComponent } from './buildingwiseexpensesreport/buildingwiseexpensesreport.component';


@NgModule({
    declarations: [
        MonthwisecertAuthDetailComponent,
        BankguarreportComponent,
        CertauthoutstandingreportComponent,
        ContractsummaryreportComponent,
        LogicnoteboqvendorComponent,
        GroupwisecompositereportComponent,
        BldgwiseannualexpensesreportComponent,
        BldgwiseincrementalexpensesreportComponent,
        BoqreportComponent,
        AssessmenttaxreportComponent,
        MonthlygroupexpensessummaryComponent,
        BuildingwiseexpensesreportComponent
    ],
    imports: [
        CommonModule,
        ManagementreportsRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        LoaderModule,
        SharedModule,
        ButtonsModule
    ]
})
export class ManagementreportsModule { }
