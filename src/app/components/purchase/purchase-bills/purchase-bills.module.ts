import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseBillsRoutingModule } from './purchase-bills-routing.module';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NewGstPurchaseBillEntryComponent } from './data-entry/new-gst-purchase-bill-entry/new-gst-purchase-bill-entry.component';
import { LoaderModule } from '../../common/loader/loader.module';
import { BillDetailsSummaryComponent } from './reports/bill-details-summary/bill-details-summary.component';
import { PurchaseBillsOutstandingComponent } from './reports/purchase-bills-outstanding/purchase-bills-outstanding.component';
import { BillsDebitNotesEditComponent } from './reports/bills-debit-notes-edit/bills-debit-notes-edit.component';
import { AddressModule } from '../../common/address/address.module';
import { UserWiseBillsComponent } from './reports/user-wise-bills/user-wise-bills.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanyWisePurchasesComponent } from './enquiry/company-wise-purchases/company-wise-purchases.component';
import { ChallanReportComponent } from './reports/challan-report/challan-report.component';
import { SupplierDetailsReportComponent } from './reports/supplier-details-report/supplier-details-report.component';
import { BlgMatgroupMatcodewiseBilledQtyComponent } from './reports/blg-matgroup-matcodewise-billed-qty/blg-matgroup-matcodewise-billed-qty.component';
import { ChequeWiseBillsReportComponent } from './reports/cheque-wise-bills-report/cheque-wise-bills-report.component';
import { BillDetailsEnquiresComponent } from './enquiry/bill-details-enquires/bill-details-enquires.component';
import { NewBillDetailsEnquiryComponent } from './enquiry/new-bill-details-enquiry/new-bill-details-enquiry.component';
import { PurchaseBillAdjustmentComponent } from './data-entry/purchase-bill-adjustment/purchase-bill-adjustment.component';

@NgModule({
  declarations: [
    NewGstPurchaseBillEntryComponent,
    BillDetailsSummaryComponent,
    PurchaseBillsOutstandingComponent,
    BillsDebitNotesEditComponent,
    UserWiseBillsComponent,
    ChallanReportComponent,
    SupplierDetailsReportComponent,
    CompanyWisePurchasesComponent,
    BlgMatgroupMatcodewiseBilledQtyComponent,
    BillDetailsEnquiresComponent,
    NewBillDetailsEnquiryComponent,
    ChequeWiseBillsReportComponent,
    PurchaseBillAdjustmentComponent
  ],
  imports: [
    CommonModule,
    PurchaseBillsRoutingModule,
    F1Module,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    LoaderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AddressModule,
    SharedModule,
  ],
})
export class PurchaseBillsModule {}
