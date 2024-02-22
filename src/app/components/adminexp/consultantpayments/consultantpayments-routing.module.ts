import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultantpaymentreportComponent } from './reports/consultantpaymentreport/consultantpaymentreport.component';
import { ConsultantpaymentvoucherreceiptprintComponent } from './reports/consultantpaymentvoucherreceiptprint/consultantpaymentvoucherreceiptprint.component';
import { ConsultanttaxinvoiceprintComponent } from './reports/consultanttaxinvoiceprint/consultanttaxinvoiceprint.component';

const routes: Routes = [  {
  path: 'reports/consultantpaymentreport',
  component: ConsultantpaymentreportComponent,
},
{
  path: 'reports/consultantpaymentvoucherreceiptprint',
  component: ConsultantpaymentvoucherreceiptprintComponent,
},
{
  path: 'reports/consultanttaxinvoiceprint',
  component: ConsultanttaxinvoiceprintComponent,
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultantpaymentsRoutingModule { }
