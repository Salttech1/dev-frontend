import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementreportsRoutingModule } from './managementreports-routing.module';
import { CompanydeptmonthwisesummaryComponent } from './reports/companydeptmonthwisesummary/companydeptmonthwisesummary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GratuityprojectionComponent } from './reports/gratuityprojection/gratuityprojection.component';
import { ReimbursementpaymentComponent } from './reports/reimbursementpayment/reimbursementpayment.component';
import { EmployeeprofileComponent } from './reports/employeeprofile/employeeprofile.component';


@NgModule({
  declarations: [
    CompanydeptmonthwisesummaryComponent,
    GratuityprojectionComponent,
    ReimbursementpaymentComponent,
    EmployeeprofileComponent
  ],
  imports: [
    CommonModule,
    ManagementreportsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule
  ]
})
export class ManagementreportsModule { }
