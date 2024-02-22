import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseBillsOutstandingComponent } from '../purchase-bills/reports/purchase-bills-outstanding/purchase-bills-outstanding.component';
import { CancelMaterialPaymentsComponent } from './data-entry/cancel-material-payments/cancel-material-payments.component';
import { GstMaterialPaymentsEntryComponent } from './data-entry/gst-material-payments-entry/gst-material-payments-entry.component';
import { GstPassMaterialPaymentsComponent } from './data-entry/gst-pass-material-payments/gst-pass-material-payments.component';
import { ReverseBillEntryComponent } from './data-entry/reverse-bill-entry/reverse-bill-entry.component';
import { ReverseDebitNoteComponent } from './data-entry/reverse-debit-note/reverse-debit-note.component';
import { AuthorisationEnquiryComponent } from './enquiry/authorisation-enquiry/authorisation-enquiry.component';
import { MaterialPaymentStatusComponent } from './enquiry/material-payment-status/material-payment-status.component';
import { AuthPaymentDetailComponent } from './reports/auth-payment-detail/auth-payment-detail.component';
import { AuthorisationBillwiseDetailComponent } from './reports/authorisation-billwise-detail/authorisation-billwise-detail.component';
import { AuthorisationEnteredPassedComponent } from './reports/authorisation-entered-passed/authorisation-entered-passed.component';
import { AuthorisationReportAuthChequeComponent } from './reports/authorisation-report-auth-cheque/authorisation-report-auth-cheque.component';
import { AuthorisationReportwithBillAndPaymentDetailsComponent } from './reports/authorisation-reportwith-bill-and-payment-details/authorisation-reportwith-bill-and-payment-details.component';
import { AuthorisationSummaryReportComponent } from './reports/authorisation-summary-report/authorisation-summary-report.component';
import { AuthorisationsBldgMatSuppDetailComponent } from './reports/authorisations-bldg-mat-supp-detail/authorisations-bldg-mat-supp-detail.component';
import { ExecutiveReportComponent } from './reports/executive-report/executive-report.component';
import { ListBillsPendingAuthComponent } from './reports/list-bills-pending-auth/list-bills-pending-auth.component';
import { ListSuppliersComponent } from './reports/list-suppliers/list-suppliers.component';
import { MaterialPaymentsPrintComponent } from './reports/material-payments-print/material-payments-print.component';
import { MonthwiseMaterialConsumptionReportComponent } from './reports/monthwise-material-consumption-report/monthwise-material-consumption-report.component';
import { OutstandingAdvanceAndRetentionReportComponent } from './reports/outstanding-advance-and-retention-report/outstanding-advance-and-retention-report.component';
import { PartyAndBuildingwiseBillsComponent } from './reports/party-and-buildingwise-bills/party-and-buildingwise-bills.component';

const routes: Routes = [
  // reports
  {
    path: 'reports/materialpaymentsprint',
    component: MaterialPaymentsPrintComponent,
    title: 'Material Payments Print',
  },
  {
    path: 'reports/authorisationsummaryreport',
    component: AuthorisationSummaryReportComponent,
    title: 'Authorisation Summary Report',
  },
  {
    path: 'reports/authorisationenteredandpassed',
    component: AuthorisationEnteredPassedComponent,
    title: 'Authorisation Entered and Passed',
  },
  {
    path: 'reports/authorisationsbldgmatsuppdetailreport',
    component: AuthorisationsBldgMatSuppDetailComponent,
    title: 'Authorisations Bldg/Mat/Supp Detail Report',
  },
  {
    path: 'reports/authorisationbillwisedetailreport',
    component: AuthorisationBillwiseDetailComponent,
    title: 'Authorisation Billwise Detail Report',
  },
  {
    path: 'reports/executivereport',
    component: ExecutiveReportComponent,
    title: 'Executive Report',
  },
  {
    path: 'reports/listofsuppliers',
    component: ListSuppliersComponent,
    title: 'List of Suppliers',
  },
  {
    path: 'reports/listofbillswithpendingauth.no.',
    component: ListBillsPendingAuthComponent,
    title: 'List of Bills with Pending Auth. No.',
  },
  {
    path: 'reports/monthwisematerialconsumptionreport',
    component: MonthwiseMaterialConsumptionReportComponent,
    title: 'Month Wise Material Consumption Report',
  },
  {
    path: 'reports/outstandingadvanceandretentionreport',
    component: OutstandingAdvanceAndRetentionReportComponent,
    title: 'Outstanding Advance And Retention report',
  },
  {
    path: 'reports/partyandbuildingwisebills',
    component: PartyAndBuildingwiseBillsComponent,
    title: 'Party And Building wise Bills.',
  },
  {
    path: 'reports/auth.paymentdetails',
    component: AuthPaymentDetailComponent,
    title: 'Authorisation Payments Detail',
  },
  {
    path: 'reports/supplierageingreport',
    component: PurchaseBillsOutstandingComponent,
    title: 'Supplier Ageing Report Component.',
  },
  {
    path: 'reports/authorisationreport-authcheque',
    component: AuthorisationReportAuthChequeComponent,
    title: 'Authorisation Report Auth Cheque Component',
  },
  {
    path: 'reports/authorisationreportwithbillandpaymentdetails',
    component: AuthorisationReportwithBillAndPaymentDetailsComponent,
    title: 'Authorisation Report with Bill and Payment Details',
  },

  // data entry
  {
    path: 'dataentry/gst-materialpaymentsentryedit',
    component: GstMaterialPaymentsEntryComponent,
    title: 'Gst Material Payments Entry/Edit',
  },
  {
    path: 'dataentry/reversebillentry',
    component: ReverseBillEntryComponent,
    title: 'Reverse Bill Entry',
  },
  {
    path: 'dataentry/reversedebitnote',
    component: ReverseDebitNoteComponent,
    title: 'Reverse Debit Note',
  },
  {
    path: 'dataentry/cancelmaterialpayments',
    component: CancelMaterialPaymentsComponent,
    title: 'Cancel Material Payments',
  },
  {
    path: 'dataentry/gst-passmaterialpayments',
    component: GstPassMaterialPaymentsComponent,
    title: 'Gst Pass Material Payments',
  },
  // enquriy
  {
    path: 'enquiry/materialpaymentstatusenquiry',
    component: MaterialPaymentStatusComponent,
    title: 'Material Payment Status Enquiry',
  },
  {
    path: 'enquiry/authorisationenquiry',
    component: AuthorisationEnquiryComponent,
    title: 'Authorisation Enquiry',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialPaymentsRoutingModule {}
