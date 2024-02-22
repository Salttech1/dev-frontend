import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterdetailsentryeditRoutingModule } from './masterdetailsentryedit-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeedetailsphotoComponent } from './reports/employeedetailsphoto/employeedetailsphoto.component';
import { EmployeedetailsPersonalComponent } from './reports/employeedetails-personal/employeedetails-personal.component';
import { EmployeedetailsentryeditComponent } from './dataentry/employeedetailsentryedit/employeedetailsentryedit.component';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { AddressModule } from '../../common/address/address.module';


@NgModule({
  declarations: [
    EmployeedetailsphotoComponent,
    EmployeedetailsPersonalComponent,
    EmployeedetailsentryeditComponent
  ],
  imports: [
    CommonModule,
    MasterdetailsentryeditRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    F1Module,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule,
    AddressModule,
  ]
})
export class MasterdetailsentryeditModule { }
