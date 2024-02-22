import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaserentRoutingModule } from './leaserent-routing.module';
import { DefaulterslistComponent } from './reports/defaulterslist/defaulterslist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PeriodWisecollectionreportComponent } from './reports/period-wisecollectionreport/period-wisecollectionreport.component';
import { ReceiptvoucherreprintComponent } from './reports/receiptvoucherreprint/receiptvoucherreprint.component';
import { BillprintingComponent } from './reports/billprinting/billprinting.component';


@NgModule({
  declarations: [
    DefaulterslistComponent,
    PeriodWisecollectionreportComponent,
    ReceiptvoucherreprintComponent,
    BillprintingComponent
    
  ],
  imports: [
    CommonModule,
    LeaserentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    F1Module,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class LeaserentModule { }
