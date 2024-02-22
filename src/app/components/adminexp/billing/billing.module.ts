import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingRoutingModule } from './billing-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminBillPassingComponent } from './data-entry/admin-bill-passing/admin-bill-passing.component';
import { AdminBillEntryComponent } from './data-entry/admin-bill-entry/admin-bill-entry.component';
import { AdminBillCancelComponent } from './data-entry/admin-bill-cancel/admin-bill-cancel.component';
import { AdminAdvancePaymentComponent } from './data-entry/admin-advance-payment/admin-advance-payment.component';
import { AdminAdvancePaymentPassingComponent } from './data-entry/admin-advance-payment-passing/admin-advance-payment-passing.component';
import { AdminBillEntrySalesComponent } from './data-entry/admin-bill-entry-sales/admin-bill-entry-sales.component';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ButtonsModule } from '../../common/buttons/buttons.module';
import { AdminDebitNoteEntryComponent } from './data-entry/admin-debit-note-entry/admin-debit-note-entry.component';
import { AdminDebitNoteCancellationComponent } from './data-entry/admin-debit-note-cancellation/admin-debit-note-cancellation.component';
import { AdminIntercompanyInvoiceComponent } from './data-entry/admin-intercompany-invoice/admin-intercompany-invoice.component';
import { AdminInvoiceCreationComponent } from './data-entry/admin-invoice-creation/admin-invoice-creation.component';
import { LoaderModule } from '../../common/loader/loader.module';

@NgModule({
  declarations: [
    AdminBillEntryComponent,
    AdminBillPassingComponent,
    AdminBillCancelComponent,
    AdminAdvancePaymentComponent,
    AdminAdvancePaymentPassingComponent,
    AdminBillEntrySalesComponent,
    AdminDebitNoteEntryComponent,
    AdminDebitNoteCancellationComponent,
    AdminIntercompanyInvoiceComponent,
    AdminInvoiceCreationComponent,
  ],
  imports: [
    CommonModule,
    BillingRoutingModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    F1Module,
    SharedModule,
    ButtonsModule,
    LoaderModule
  ],
})
export class BillingModule {}
