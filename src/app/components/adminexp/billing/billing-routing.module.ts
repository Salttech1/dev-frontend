import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAdvancePaymentPassingComponent } from './data-entry/admin-advance-payment-passing/admin-advance-payment-passing.component';
import { AdminAdvancePaymentComponent } from './data-entry/admin-advance-payment/admin-advance-payment.component';
import { AdminBillCancelComponent } from './data-entry/admin-bill-cancel/admin-bill-cancel.component';
import { AdminBillEntryComponent } from './data-entry/admin-bill-entry/admin-bill-entry.component';
import { AdminBillPassingComponent } from './data-entry/admin-bill-passing/admin-bill-passing.component';
import { AdminDebitNoteEntryComponent } from './data-entry/admin-debit-note-entry/admin-debit-note-entry.component';
import { AdminDebitNoteCancellationComponent } from './data-entry/admin-debit-note-cancellation/admin-debit-note-cancellation.component';
import { AdminIntercompanyInvoiceComponent } from './data-entry/admin-intercompany-invoice/admin-intercompany-invoice.component';
import { AdminInvoiceCreationComponent } from './data-entry/admin-invoice-creation/admin-invoice-creation.component';
import { AdminBillEntrySalesComponent } from './data-entry/admin-bill-entry-sales/admin-bill-entry-sales.component';

const routes: Routes = [
  {
    path: 'dataentry/billentry',
    component: AdminBillEntryComponent,
  },

  {
    path: 'dataentry/adminbillpassing',
    component: AdminBillPassingComponent,
  },

  {
    path: 'dataentry/adminbillcancellation',
    component: AdminBillCancelComponent,
  },

  {
    path: 'dataentry/adminadvancepayment',
    component: AdminAdvancePaymentComponent,
  },

  {
    path: 'dataentry/adminadvancepaymentpassing',
    component: AdminAdvancePaymentPassingComponent,
  },
  {
    path: 'dataentry/debitnoteentry',
    component: AdminDebitNoteEntryComponent
  },
  {
    path: 'dataentry/debitnotecancellation',
    component: AdminDebitNoteCancellationComponent
  },
  {
    path: 'dataentry/intercompanyinvoice',
    component: AdminIntercompanyInvoiceComponent
  },
  {
    path: 'dataentry/invoicecreation',
    component: AdminInvoiceCreationComponent
  },
  {
    path: 'dataentry/billentrysales',
    component: AdminBillEntryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingRoutingModule {}
