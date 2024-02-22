import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GratuitypaymentRoutingModule } from './gratuitypayment-routing.module';
import { SettlementofgratuityComponent } from './reports/settlementofgratuity/settlementofgratuity.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GratuityformComponent } from './reports/gratuityform/gratuityform.component';


@NgModule({
  declarations: [
    SettlementofgratuityComponent,
    GratuityformComponent,
  ],
  imports: [
    CommonModule,
    GratuitypaymentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule
  ]
})
export class GratuitypaymentModule { }
