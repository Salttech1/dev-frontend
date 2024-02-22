import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrokerDetailsEntryComponent } from './data-entry/broker-details-entry/broker-details-entry.component';
import { BookingEntryeditComponent } from './data-entry/booking-entryedit/booking-entryedit.component';
import { SoldunsoldreportComponent } from './reports/soldunsoldreport/soldunsoldreport.component';
import { ChecklistNegoagmtdatesComponent } from './reports/checklist-negoagmtdates/checklist-negoagmtdates.component';
import { FlatSoldUnsoldSummaryReportComponent } from './reports/flat-sold-unsold-summary-report/flat-sold-unsold-summary-report.component';
import { BookingReportComponent } from './reports/booking-report/booking-report.component';
import { FlatSoldUnsoldSummaryReportNewComponent } from './reports/flat-sold-unsold-summary-report-new/flat-sold-unsold-summary-report-new.component';
import { FlatParkingDetailsReportComponent } from './reports/flat-parking-details-report/flat-parking-details-report.component';
import { PartyDetailsReportComponent } from './reports/party-details-report/party-details-report.component';
import { BrokerAnalysisReportComponent } from './reports/broker-analysis-report/broker-analysis-report.component';
import { BankwiseLoanStatementComponent } from './reports/bankwise-loan-statement/bankwise-loan-statement.component';
import { LoanStatementComponent } from './reports/loan-statement/loan-statement.component';
import { PaymentScheduleConfirmationComponent } from './reports/payment-schedule-confirmation/payment-schedule-confirmation.component';
import { FlatsCancelledResoldReportsComponent } from './reports/flats-cancelled-resold-reports/flats-cancelled-resold-reports.component';
import { BookingByMonthComponent } from './reports/booking-by-month/booking-by-month.component';
import { BookingDetailsByCustomerCompanyComponent } from './reports/booking-details-by-customer-company/booking-details-by-customer-company.component';

const routes: Routes = [
  {
    path: 'dataentry/brokerdetailsentryedit',
    component: BrokerDetailsEntryComponent,
  },
  {
    path: 'dataentry/bookingentryedit',
    component: BookingEntryeditComponent,
    title: 'Booking Entry Edit',
  },
  {
    path: 'reports/soldunsoldreport',
    component: SoldunsoldreportComponent,
    title: 'Sold UnSold Unit Report'
  },
  {
    path: 'reports/checklist-negoagmtdates',
    component: ChecklistNegoagmtdatesComponent,
    title: 'Checklist upkeep'
  },
  {
    path: 'reports/flatsoldunsoldsummary',
    component: FlatSoldUnsoldSummaryReportNewComponent, //FlatSoldUnsoldSummaryReportComponent,
    title: 'Flat Sold/Unsold Summary ',
  },
  {
    path: 'reports/bookingreport',
    component: BookingReportComponent,
    title: 'Booking Report',
  },
  {
    path: 'reports/flatparkingdetailsreport',
    component: FlatParkingDetailsReportComponent,
    title: 'Flat Parking Details Report',
  },
  {
    path: 'reports/partydetailsreport',
    component: PartyDetailsReportComponent,
    title: 'Party Details Report',
  },
  {
    path: 'reports/brokeranalysisreport',
    component: BrokerAnalysisReportComponent,
    title: 'Broker Analysis Report',
  },
  {
    path: 'reports/paymentscheduleconfirmation',
    component: PaymentScheduleConfirmationComponent,
    title: 'Payment Schedule Confirmation',
  },
  {
    path: 'reports/loanstatement',
    component: LoanStatementComponent,
    title: 'Loan Statement',
  },
  {
    path: 'reports/bankwiseloanstatement',
    component: BankwiseLoanStatementComponent,
    title: 'Bankwise Loan Statement',
  },
  {
    path: 'reports/flatscancelledresoldreport',
    component: FlatsCancelledResoldReportsComponent,
    title: 'Flats Cancelled / Resold Report',
  },
  {
    path: 'reports/bookingbymonth',
    component: BookingByMonthComponent,
    title: 'Booking By Month',
  },
  {
    path: 'reports/bookingdetailsbycustomercompany',
    component: BookingDetailsByCustomerCompanyComponent,
    title: 'Booking Details By Customer Company',
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingsRoutingModule {}
