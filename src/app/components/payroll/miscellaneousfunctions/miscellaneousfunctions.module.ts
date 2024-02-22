import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiscellaneousfunctionsRoutingModule } from './miscellaneousfunctions-routing.module';
import { EmployeebirthdayComponent } from './report/employeebirthday/employeebirthday.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoaderModule } from '../../common/loader/loader.module';
import { EmployeesalarydetailsComponent } from './report/employeesalarydetails/employeesalarydetails.component';
import { EmployeesalarypackageComponent } from './report/employeesalarypackage/employeesalarypackage.component';
import { CompanywisemonthwisepaymentdatesComponent } from './report/companywisemonthwisepaymentdates/companywisemonthwisepaymentdates.component';
import { SoceitysalarydetailsComponent } from './report/soceitysalarydetails/soceitysalarydetails.component';
import { GrosssalaryinexcelComponent } from './report/grosssalaryinexcel/grosssalaryinexcel.component';


@NgModule({
  declarations: [
    EmployeebirthdayComponent,
    EmployeesalarydetailsComponent,
    EmployeesalarypackageComponent,
    CompanywisemonthwisepaymentdatesComponent,
    SoceitysalarydetailsComponent,
    GrosssalaryinexcelComponent
  ],
  imports: [
    CommonModule,
    MiscellaneousfunctionsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule
  ]
})
export class MiscellaneousfunctionsModule { }
