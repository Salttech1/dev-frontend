import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultantpaymentsRoutingModule } from './consultantpayments-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ButtonsModule } from '../../common/buttons/buttons.module';
import { LoaderModule } from '../../common/loader/loader.module';
import { ConsultantpaymentreportComponent } from './reports/consultantpaymentreport/consultantpaymentreport.component';
import { ConsultantpaymentvoucherreceiptprintComponent } from './reports/consultantpaymentvoucherreceiptprint/consultantpaymentvoucherreceiptprint.component';
import { ConsultanttaxinvoiceprintComponent } from './reports/consultanttaxinvoiceprint/consultanttaxinvoiceprint.component';



@NgModule({
  declarations: [
    ConsultantpaymentreportComponent,
    ConsultantpaymentvoucherreceiptprintComponent,
    ConsultanttaxinvoiceprintComponent
  ],
  imports: [
    CommonModule,
    ConsultantpaymentsRoutingModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    F1Module,
    SharedModule,
    ButtonsModule,
    LoaderModule,

  ]
})
export class ConsultantpaymentsModule { }
