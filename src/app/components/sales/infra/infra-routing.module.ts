import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfraDefaultersListComponent } from './reports/infra-defaulters-list/infra-defaulters-list.component';
import { InfraCollectionReportComponent } from './reports/infra-collection-report/infra-collection-report.component';
import { OutgoingInfraMonthwiseComponent } from './reports/outgoing-infra-monthwise/outgoing-infra-monthwise.component';
import { InfraReceiptReportComponent } from './reports/infra-receipt-report/infra-receipt-report.component';
import { FlatwiseInfraSummaryComponent } from './reports/flatwise-infra-summary/flatwise-infra-summary.component';
import { ReceiptReportComponent } from '../auxiliary/reports/receipt-report/receipt-report.component';
import { AuxiliaryReceiptComponent } from '../auxiliary/data-entry/auxiliary-receipt/auxiliary-receipt.component';
import { InfrafuturecollectionreportComponent } from './reports/infrafuturecollectionreport/infrafuturecollectionreport.component';

const routes: Routes = [
  {
    path: 'reports/infradefaulterslist',
    component: InfraDefaultersListComponent,
  },
  {
    path: 'reports/infracollectionreport',
    component: InfraCollectionReportComponent,
  },
  {
    path: 'reports/inframonthwisereport',
    component: OutgoingInfraMonthwiseComponent,
  },
  {
    path: 'reports/infrareceiptreprintnormal',
    // component: InfraReceiptReportComponent,
    component: ReceiptReportComponent,
  },
  {
    path: 'reports/infrareceiptreprintfirst',
    component: ReceiptReportComponent,
  },
  {
    path: 'reports/flatwiseinfrasummary',
    component: FlatwiseInfraSummaryComponent,
  },
  {
    path: 'dataentry/infrareceiptentryeditgstfirst',
    component: AuxiliaryReceiptComponent,
  },
  {
    path: 'dataentry/infrareceiptentryeditgstnormal',
    component: AuxiliaryReceiptComponent,
  },
  {
    path: 'dataentry/infrareceiptentryeditnormal',
    component: AuxiliaryReceiptComponent,
  },
  {
    path: 'reports/infrafuturecollectionreport',
    component: InfrafuturecollectionreportComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfraRoutingModule {}
