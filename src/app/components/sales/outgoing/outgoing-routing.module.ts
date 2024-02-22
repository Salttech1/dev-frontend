import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutgoingRatesEntryEditComponent } from './data-entry/outgoing-rates-entry-edit/outgoing-rates-entry-edit.component';
import { MonthwiseCollectionReportComponent } from './reports/monthwise-collection-report/monthwise-collection-report.component';
import { OutgoingbillgenerationComponent } from './reports/outgoingbillgeneration/outgoingbillgeneration.component';  // 21.08.23   RS
import { OutgoingSummaryReportComponent } from './reports/outgoing-summary-report/outgoing-summary-report.component';
import { SocietyAccountsReportComponent } from './reports/society-accounts-report/society-accounts-report.component';
import { OutgoinginfraRateReportComponent } from './reports/outgoinginfra-rate-report/outgoinginfra-rate-report.component';
import { Annexure2Component } from './reports/annexure2/annexure2.component';
import { DefaultersReportComponent } from './reports/defaulters-report/defaulters-report.component';

const routes: Routes = [
  {
    path: 'dataentry/outgoingratesentryedit', component: OutgoingRatesEntryEditComponent
  },
  {
    path: 'reports/monthwisecollectionreport', component: MonthwiseCollectionReportComponent
  },
  { // 21.08.23   RS
    path: 'reports/generatebillsgstnormal', component: OutgoingbillgenerationComponent
  },
  { // 25.08.23   RS
    path: 'reports/generatebillsgstfirst', component: OutgoingbillgenerationComponent
  },
  { // 17.10.23   RS
    path: 'reports/summaryreport', component: OutgoingSummaryReportComponent
  },
  { // 25.10.23   RS
    path: 'reports/societyaccountsreport', component: SocietyAccountsReportComponent
  },
  { // 31.10.23   RS
    path: 'reports/outgoinginfraratereport', component: OutgoinginfraRateReportComponent
  },
  { // 01.11.23   RS
    path: 'reports/annexureii', component: Annexure2Component
  },
  { // 03.11.23   RS
    path: 'reports/defaultersreport', component: DefaultersReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutgoingRoutingModule { }
