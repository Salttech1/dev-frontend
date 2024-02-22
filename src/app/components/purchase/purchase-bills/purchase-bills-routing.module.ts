import { ChequeWiseBillsReportComponent } from './reports/cheque-wise-bills-report/cheque-wise-bills-report.component';
import { CompanyWisePurchasesComponent } from './enquiry/company-wise-purchases/company-wise-purchases.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewGstPurchaseBillEntryComponent } from './data-entry/new-gst-purchase-bill-entry/new-gst-purchase-bill-entry.component';
import { BillDetailsSummaryComponent } from './reports/bill-details-summary/bill-details-summary.component';
import { BillsDebitNotesEditComponent } from './reports/bills-debit-notes-edit/bills-debit-notes-edit.component';
import { PurchaseBillsOutstandingComponent } from './reports/purchase-bills-outstanding/purchase-bills-outstanding.component';
import { UserWiseBillsComponent } from './reports/user-wise-bills/user-wise-bills.component';
import { ChallanReportComponent } from './reports/challan-report/challan-report.component';
import { SupplierDetailsReportComponent } from './reports/supplier-details-report/supplier-details-report.component';
import { BlgMatgroupMatcodewiseBilledQtyComponent } from './reports/blg-matgroup-matcodewise-billed-qty/blg-matgroup-matcodewise-billed-qty.component';
import { BillDetailsEnquiresComponent } from './enquiry/bill-details-enquires/bill-details-enquires.component';
import { NewBillDetailsEnquiryComponent } from './enquiry/new-bill-details-enquiry/new-bill-details-enquiry.component';
import { PurchaseBillAdjustmentComponent } from './data-entry/purchase-bill-adjustment/purchase-bill-adjustment.component';

const routes: Routes = [
  {
    path: 'dataentry/newgst-purchasebillentry',
    component: NewGstPurchaseBillEntryComponent,
    title: 'New GST - Purchase Bill Entry',
  },
  {
    path: 'reports/billdetailandsummaryreports',
    component: BillDetailsSummaryComponent,
    title: 'Bill Detail and Summary Reports',
  },
  {
    path: 'reports/billsanddebitnoteseditlist.',
    component: BillsDebitNotesEditComponent,
    title: 'Bills And Debit Notes Edit List',
  },
  {
    path: 'reports/purchasebillsoutstanding',
    component: PurchaseBillsOutstandingComponent,
    title: 'Purchase Bills Outstanding',
  },
  {
    path: 'reports/user-wiseno.ofbills',
    component: UserWiseBillsComponent,
    title: 'User-Wise No. of Bills',
  },
  {
    path: 'reports/challanreport',
    component: ChallanReportComponent,
    title: 'Challan Report',
  },
  {
    path: 'reports/supplierdetailsreport',
    component: SupplierDetailsReportComponent,
    title: 'Supplier Details Report',
  },
  {
    path: 'enquiries/companewisepurchases',
    component: CompanyWisePurchasesComponent,
    title: 'Company-Wise Purchases',
  },
  {
    path: 'enquiries/billdetailsenquires',
    component: BillDetailsEnquiresComponent,
    title: 'Bill Details Enquires',
  },
  {
    path: 'enquiries/newbilldetailsenquiry',
    component: NewBillDetailsEnquiryComponent,
    title: 'New Bill Details Enquiry',
  },
  {
    path: 'reports/bldg-matgroup-matcodewisebilledqty',
    component: BlgMatgroupMatcodewiseBilledQtyComponent,
    title: 'Blgd-MatGroup-MatCodeWise Billed Qty',
  },
  {
    path: 'reports/chequewisebillsreport',
    component: ChequeWiseBillsReportComponent,
    title: 'Blgd-MatGroup-MatCodeWise Billed Qty',
  },
  {
    path: 'dataentry/purchasebilladjustment',
    component: PurchaseBillAdjustmentComponent,
    title: 'Purchase Bill Adjustment',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseBillsRoutingModule {}
