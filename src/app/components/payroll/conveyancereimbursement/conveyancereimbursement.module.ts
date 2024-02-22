import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConveyancereimbursementRoutingModule } from './conveyancereimbursement-routing.module';
import { MonthlyconveyancereimbursementComponent } from './reports/monthlyconveyancereimbursement/monthlyconveyancereimbursement.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    MonthlyconveyancereimbursementComponent
  ],
  imports: [
    CommonModule,
    ConveyancereimbursementRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule
  ]
})
export class ConveyancereimbursementModule { }
