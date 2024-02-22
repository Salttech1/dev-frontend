import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrokerDetailsEntryComponent } from './data-entry/broker-details-entry/broker-details-entry.component';
import { BookingEntryeditComponent } from './data-entry/booking-entryedit/booking-entryedit.component';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { AddressComponent } from '../../common/address/address.component';
import { AddressModule } from '../../common/address/address.module';
import { InptfocsDirective } from 'src/app/shared/directive/inptfocs.directive';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { DataTablesModule } from 'angular-datatables';
import { BankbaranchEntryeditComponent } from './data-entry/bankbaranch-entryedit/bankbaranch-entryedit.component';
import { FlatSoldUnsoldDetailReportComponent } from './reports/flat-sold-unsold-detail-report/flat-sold-unsold-detail-report.component';
import { SoldunsoldreportComponent } from './reports/soldunsoldreport/soldunsoldreport.component';
import { ChecklistNegoagmtdatesComponent } from './reports/checklist-negoagmtdates/checklist-negoagmtdates.component';


import { FlatSoldUnsoldSummaryReportComponent } from './reports/flat-sold-unsold-summary-report/flat-sold-unsold-summary-report.component';
import { BookingReportComponent } from './reports/booking-report/booking-report.component';
import { FlatSoldUnsoldSummaryReportNewComponent } from './reports/flat-sold-unsold-summary-report-new/flat-sold-unsold-summary-report-new.component';
import { ButtonsModule } from '../../common/buttons/buttons.module';
import { PartyDetailsReportComponent } from './reports/party-details-report/party-details-report.component';
import { FlatParkingDetailsReportComponent } from './reports/flat-parking-details-report/flat-parking-details-report.component';
import { BrokerAnalysisReportComponent } from './reports/broker-analysis-report/broker-analysis-report.component';
import { BankwiseLoanStatementComponent } from './reports/bankwise-loan-statement/bankwise-loan-statement.component';
import { PaymentScheduleConfirmationComponent } from './reports/payment-schedule-confirmation/payment-schedule-confirmation.component';
import { LoanStatementComponent } from './reports/loan-statement/loan-statement.component';
import { FlatsCancelledResoldReportsComponent } from './reports/flats-cancelled-resold-reports/flats-cancelled-resold-reports.component';
import { BookingByMonthComponent } from './reports/booking-by-month/booking-by-month.component';
import { BookingDetailsByCustomerCompanyComponent } from './reports/booking-details-by-customer-company/booking-details-by-customer-company.component';

@NgModule({
  declarations: [
    BrokerDetailsEntryComponent,
    InptfocsDirective,
    BookingEntryeditComponent,
    BankbaranchEntryeditComponent,
    FlatSoldUnsoldDetailReportComponent,
    SoldunsoldreportComponent,
    ChecklistNegoagmtdatesComponent,
    
    FlatSoldUnsoldSummaryReportComponent,
    BookingReportComponent,
    FlatSoldUnsoldSummaryReportNewComponent,
    PartyDetailsReportComponent,
    FlatParkingDetailsReportComponent,
    BrokerAnalysisReportComponent,
    BankwiseLoanStatementComponent,
    PaymentScheduleConfirmationComponent,
    LoanStatementComponent,
    FlatsCancelledResoldReportsComponent,
    BookingByMonthComponent,
    BookingDetailsByCustomerCompanyComponent,
  ],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    F1Module,
    AddressModule,
    MatTabsModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule,
    ButtonsModule,
    DataTablesModule,
  ],
})
export class BookingsModule {}
