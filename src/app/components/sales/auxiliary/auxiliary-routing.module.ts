import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuxiliaryReceiptEntryEditGstFirstComponent } from './data-entry/auxiliary-receipt-entry-edit-gst-first/auxiliary-receipt-entry-edit-gst-first.component';
import { InfraDefaultersListComponent } from '../infra/reports/infra-defaulters-list/infra-defaulters-list.component';
import { InfraReceiptReportComponent } from '../infra/reports/infra-receipt-report/infra-receipt-report.component';
import { AuxiliaryReceiptComponent } from './data-entry/auxiliary-receipt/auxiliary-receipt.component';
import { BillGenerationComponent } from './reports/bill-generation/bill-generation.component';
import { ReceiptReportComponent } from './reports/receipt-report/receipt-report.component';
const routes: Routes = [
  {
    path: 'dataentry/auxiliaryreceiptentryeditgstfirst',
    component: AuxiliaryReceiptComponent,
  },
  {
    path: 'dataentry/auxiliaryreceiptentryeditgstnormal',
    component: AuxiliaryReceiptComponent,
  },
  {
    path: 'reports/auxidefaultersreport',
    component: InfraDefaultersListComponent,
  },
  {
    path: 'reports/auxiliaryreceiptreportfirst',
    component: ReceiptReportComponent,
  },
  {
    path: 'reports/auxiliaryreceiptreportnormal',
    component: ReceiptReportComponent,
  },
  {
    path: 'reports/auxibillgenerationgstfirst',
    component: BillGenerationComponent,
  },
  {
    path: 'reports/auxibillgenerationgstnormal',
    component: BillGenerationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuxiliaryRoutingModule {}
