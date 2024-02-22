import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuranceRoutingModule } from './insurance-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { DataTablesModule } from 'angular-datatables';
import { PolicyendorsementmasterentryComponent } from './data-entry/policyendorsementmaster-entry/policyendorsementmaster-entry.component';
import { PolicyMasterComponent } from './data-entry/policy-master/policy-master.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoaderModule } from '../../common/loader/loader.module';
import { PolicyMaturingLastDayComponent } from './reports/policy-maturing-last-day/policy-maturing-last-day.component';
import { PolicyMaturingUptoTodayComponent } from './reports/policy-maturing-upto-today/policy-maturing-upto-today.component';
import { PolicyProfileComponent } from './reports/policy-profile/policy-profile.component';
import { PolicySummaryComponent } from './reports/policy-summary/policy-summary.component';
import { PolicyAssetDetailsComponent } from './reports/policy-asset-details/policy-asset-details.component';

@NgModule({
  declarations: [
    PolicyendorsementmasterentryComponent,
    PolicyMasterComponent,
    PolicyMaturingLastDayComponent,
    PolicyMaturingUptoTodayComponent,
    PolicyProfileComponent,
    PolicySummaryComponent,
    PolicyAssetDetailsComponent
  ],
  imports: [
    CommonModule,
    InsuranceRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    F1Module,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule,
    DataTablesModule,
    SharedModule,LoaderModule
  ]
})
export class InsuranceModule { }
