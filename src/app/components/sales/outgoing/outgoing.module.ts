import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OutgoingRoutingModule } from './outgoing-routing.module';
import { OutgoingRatesEntryEditComponent } from './data-entry/outgoing-rates-entry-edit/outgoing-rates-entry-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MonthwiseCollectionReportComponent } from './reports/monthwise-collection-report/monthwise-collection-report.component';
import { OutgoingbillgenerationComponent } from './reports/outgoingbillgeneration/outgoingbillgeneration.component';
import { OutgoingSummaryReportComponent } from './reports/outgoing-summary-report/outgoing-summary-report.component';
import { SocietyAccountsReportComponent } from './reports/society-accounts-report/society-accounts-report.component';
import { OutgoinginfraRateReportComponent } from './reports/outgoinginfra-rate-report/outgoinginfra-rate-report.component';
import { Annexure2Component } from './reports/annexure2/annexure2.component';
import { DefaultersReportComponent } from './reports/defaulters-report/defaulters-report.component';  

@NgModule({
  declarations: [
    OutgoingRatesEntryEditComponent,
    MonthwiseCollectionReportComponent,
    OutgoingbillgenerationComponent,
    OutgoingSummaryReportComponent,
    SocietyAccountsReportComponent,
    OutgoinginfraRateReportComponent,
    Annexure2Component,
    DefaultersReportComponent   
  ],
  imports: [
    CommonModule,
    OutgoingRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    F1Module,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ]
})
export class OutgoingModule { }
