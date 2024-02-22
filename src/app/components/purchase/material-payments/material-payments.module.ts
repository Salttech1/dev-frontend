import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { MaterialPaymentsRoutingModule } from './material-payments-routing.module';
import { MaterialPaymentsPrintComponent } from './reports/material-payments-print/material-payments-print.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GstMaterialPaymentsEntryComponent } from './data-entry/gst-material-payments-entry/gst-material-payments-entry.component';
import { ReverseBillEntryComponent } from './data-entry/reverse-bill-entry/reverse-bill-entry.component';
import { ReverseDebitNoteComponent } from './data-entry/reverse-debit-note/reverse-debit-note.component';
import { CancelMaterialPaymentsComponent } from './data-entry/cancel-material-payments/cancel-material-payments.component';
import { MaterialPaymentStatusComponent } from './enquiry/material-payment-status/material-payment-status.component';
import { AuthorisationSummaryReportComponent } from './reports/authorisation-summary-report/authorisation-summary-report.component';
import { AuthorisationEnquiryComponent } from './enquiry/authorisation-enquiry/authorisation-enquiry.component';
import { AuthorisationEnteredPassedComponent } from './reports/authorisation-entered-passed/authorisation-entered-passed.component';
import { AuthorisationsBldgMatSuppDetailComponent } from './reports/authorisations-bldg-mat-supp-detail/authorisations-bldg-mat-supp-detail.component';
import { AuthorisationBillwiseDetailComponent } from './reports/authorisation-billwise-detail/authorisation-billwise-detail.component';
import { ExecutiveReportComponent } from './reports/executive-report/executive-report.component';
import { ListBillsPendingAuthComponent } from './reports/list-bills-pending-auth/list-bills-pending-auth.component';
import { ListSuppliersComponent } from './reports/list-suppliers/list-suppliers.component';
import { MonthwiseMaterialConsumptionReportComponent } from './reports/monthwise-material-consumption-report/monthwise-material-consumption-report.component';
import { OutstandingAdvanceAndRetentionReportComponent } from './reports/outstanding-advance-and-retention-report/outstanding-advance-and-retention-report.component';
import { PartyAndBuildingwiseBillsComponent } from './reports/party-and-buildingwise-bills/party-and-buildingwise-bills.component';
import { AuthPaymentDetailComponent } from './reports/auth-payment-detail/auth-payment-detail.component';
import { AuthorisationReportAuthChequeComponent } from './reports/authorisation-report-auth-cheque/authorisation-report-auth-cheque.component';
import { AuthorisationReportwithBillAndPaymentDetailsComponent } from './reports/authorisation-reportwith-bill-and-payment-details/authorisation-reportwith-bill-and-payment-details.component';
import { LoaderModule } from '../../common/loader/loader.module';
import { DataTablesModule } from 'angular-datatables';
import { GstPassMaterialPaymentsComponent } from './data-entry/gst-pass-material-payments/gst-pass-material-payments.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    MaterialPaymentsPrintComponent,
    GstMaterialPaymentsEntryComponent,
    ReverseBillEntryComponent,
    ReverseDebitNoteComponent,
    CancelMaterialPaymentsComponent,
    MaterialPaymentStatusComponent,
    AuthorisationSummaryReportComponent,
    AuthorisationEnquiryComponent,
    AuthorisationEnteredPassedComponent,
    AuthorisationsBldgMatSuppDetailComponent,
    AuthorisationBillwiseDetailComponent,
    ExecutiveReportComponent,
    ListBillsPendingAuthComponent,
    ListSuppliersComponent,
    MonthwiseMaterialConsumptionReportComponent,
    OutstandingAdvanceAndRetentionReportComponent,
    AuthPaymentDetailComponent,
    PartyAndBuildingwiseBillsComponent,
    AuthorisationReportAuthChequeComponent,
    AuthorisationReportwithBillAndPaymentDetailsComponent,
    GstPassMaterialPaymentsComponent
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialPaymentsRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SharedModule,
    F1Module,
    SharedModule,
    LoaderModule,
    DataTablesModule,
    FormsModule,
    LoaderModule,
    FormsModule,
    MatIconModule,
    PdfViewerModule
  ]
})
export class MaterialPaymentsModule { }
