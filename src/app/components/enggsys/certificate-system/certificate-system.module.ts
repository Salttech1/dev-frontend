import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CertificateSystemRoutingModule } from './certificate-system-routing.module';
import { ContractDebitEntryComponent } from './data-entry/contract-debit-entry/contract-debit-entry.component';
import { GstCertBillEntryComponent } from './data-entry/gst-cert-bill-entry/gst-cert-bill-entry.component';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GstCertificateEntryComponent } from './data-entry/gst-certificate-entry/gst-certificate-entry.component';
import { CreateRecIdComponent } from './data-entry/create-rec-id/create-rec-id.component';
import { NongstCertificateEntryComponent } from './data-entry/nongst-certificate-entry/nongst-certificate-entry.component';
import { DebitNoteEntryComponent } from './data-entry/debit-note-entry/debit-note-entry.component';
import { DetailsOfRecIdComponent } from './reports/details-of-rec-id/details-of-rec-id.component';
import { BuildingExpensesSummaryComponent } from './reports/building-expenses-summary/building-expenses-summary.component';
import { BuildingwisePartyDetailsComponent } from './reports/buildingwise-party-details/buildingwise-party-details.component';
import { StatementOfChequeInFavourComponent } from './reports/statement-of-cheque-in-favour/statement-of-cheque-in-favour.component';
import { ListOfRetentionOutstandingCertificateComponent } from './reports/list-of-retention-outstanding-certificate/list-of-retention-outstanding-certificate.component';

import { ContractorAgeingReportComponent } from './reports1/contractor-ageing-report/contractor-ageing-report.component';
import { GstCertificatePassingComponent } from './data-entry/gst-certificate-passing/gst-certificate-passing.component';
import { ContractWiseWorkwiseSummaryComponent } from './reports/contract-wise-workwise-summary/contract-wise-workwise-summary.component';
import { ListOfInterimCertificateReportComponent } from './reports/list-of-interim-certificate-report/list-of-interim-certificate-report.component';
import { ContractwiseCertificatewsiseDetailsReportComponent } from './reports/contractwise-certificatewsise-details-report/contractwise-certificatewsise-details-report.component';
import { StatusOfContractorComponent } from './reports/status-of-contractor/status-of-contractor.component';
import { MonthlyExpenditureComponent } from './reports/monthly-expenditure/monthly-expenditure.component';
import { UnpassedCertListComponent } from './reports/unpassed-cert-list/unpassed-cert-list.component';
import { ListOfContractorComponent } from './reports/list-of-contractor/list-of-contractor.component';
import { PassedCertificateListComponent } from './reports/passed-certificate-list/passed-certificate-list.component';
import { OutstandingPaymentStatusReportComponent } from './reports/outstanding-payment-status-report/outstanding-payment-status-report.component';
import { CancelContractBillComponent } from './data-entry/cancel-contract-bill/cancel-contract-bill.component';
import { ButtonsModule } from '../../common/buttons/buttons.module';
import { AdvanceReceiptEntryComponent } from './data-entry/advance-receipt-entry/advance-receipt-entry.component';
import { MultipleLinkingComponent } from './data-entry/multiple-linking/multiple-linking.component';
import { WorkwiseSummaryReportComponent } from './reports/workwise-summary-report/workwise-summary-report.component';
import { ContractwiseCertificatewiseSummaryComponent } from './reports/contractwise-certificatewise-summary/contractwise-certificatewise-summary.component';
import { TDSProvisionComponent } from './data-entry/tds-provision/tds-provision.component';
import { DurationwisePaymentSummaryComponent } from './reports/durationwise-payment-summary/durationwise-payment-summary.component';
import { ContractorWorkwiseDebitSummaryComponent } from './reports/contractor-workwise-debit-summary/contractor-workwise-debit-summary.component';
import { ContractDebitReportComponent } from './reports/contract-debit-report/contract-debit-report.component';
import { ContractwiseBillwisePaymentDetailsComponent } from './reports1/contractwise-billwise-payment-details/contractwise-billwise-payment-details.component';
import { PartyAdditionComponent } from './data-entry/party-addition/party-addition.component';

@NgModule({
  declarations: [
    ContractDebitEntryComponent,
    GstCertBillEntryComponent,
    GstCertificateEntryComponent,
    GstCertBillEntryComponent,
    CreateRecIdComponent,
    NongstCertificateEntryComponent,
    DebitNoteEntryComponent,
    DetailsOfRecIdComponent,
    BuildingExpensesSummaryComponent,
    BuildingwisePartyDetailsComponent,
    StatementOfChequeInFavourComponent,
    ListOfRetentionOutstandingCertificateComponent,
    ContractwiseBillwisePaymentDetailsComponent,
    ContractorAgeingReportComponent,
    GstCertificatePassingComponent,
    ContractWiseWorkwiseSummaryComponent,
    ListOfInterimCertificateReportComponent,
    ContractwiseCertificatewsiseDetailsReportComponent,
    StatusOfContractorComponent,
    MonthlyExpenditureComponent,
    UnpassedCertListComponent,
    ListOfContractorComponent,
    PassedCertificateListComponent,
    OutstandingPaymentStatusReportComponent,
    CancelContractBillComponent,
    AdvanceReceiptEntryComponent,
    MultipleLinkingComponent,
    WorkwiseSummaryReportComponent,
    ContractwiseCertificatewiseSummaryComponent,
    TDSProvisionComponent,
    DurationwisePaymentSummaryComponent,
    ContractorWorkwiseDebitSummaryComponent,
    ContractDebitReportComponent,
    PartyAdditionComponent
  ],
  imports: [
    CommonModule,
    CertificateSystemRoutingModule,
    F1Module,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    DataTablesModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule,
    ButtonsModule
  ],
})
export class CertificateSystemModule {}
