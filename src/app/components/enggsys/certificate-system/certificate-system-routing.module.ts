import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractDebitEntryComponent } from './data-entry/contract-debit-entry/contract-debit-entry.component';
import { GstCertBillEntryComponent } from './data-entry/gst-cert-bill-entry/gst-cert-bill-entry.component';
import { CreateRecIdComponent } from './data-entry/create-rec-id/create-rec-id.component';
import { GstCertificateEntryComponent } from './data-entry/gst-certificate-entry/gst-certificate-entry.component';
import { NongstCertificateEntryComponent } from './data-entry/nongst-certificate-entry/nongst-certificate-entry.component';
import { DebitNoteEntryComponent } from './data-entry/debit-note-entry/debit-note-entry.component';
import { DetailsOfRecIdComponent } from './reports/details-of-rec-id/details-of-rec-id.component';
import { BuildingwisePartyDetailsComponent } from './reports/buildingwise-party-details/buildingwise-party-details.component';
import { StatementOfChequeInFavourComponent } from './reports/statement-of-cheque-in-favour/statement-of-cheque-in-favour.component';
import { BuildingExpensesSummaryComponent } from './reports/building-expenses-summary/building-expenses-summary.component';
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

const routes: Routes = [
  {
    path: 'dataentry/contractdebitentry',
    component: ContractDebitEntryComponent,
    title: 'Contract Debit Entry',
  },
  {
    path: 'dataentry/gst-certbillentry',
    component: GstCertBillEntryComponent,
    title: 'Gst-Cert Bill Entry',
  },
  {
    path: 'dataentry/createrecid',
    component: CreateRecIdComponent,
    title: 'Create Rec Id',
  },
  {
    path: 'dataentry/gst-certificateentry',
    component: GstCertificateEntryComponent,
    title: 'GST - Certificate Entry',
  },
  {
    path: 'dataentry/nongstcertificateentry',
    component: NongstCertificateEntryComponent,
    title: 'NonGST - Certificate Entry',
  },
  {
    path: 'dataentry/debitnoteentry',
    component: DebitNoteEntryComponent,
    title: 'Debit Note Entry',
  },
  {
    path: 'dataentry/gst-certificatepassing',
    component: GstCertificatePassingComponent,
    title: 'Gst-Certificate Passing',
  },
  {
    path: 'dataentry/cancelcontractbill',
    component: CancelContractBillComponent,
    title: 'Cancel Contract Bill',
  },
  {
    path: 'dataentry/advancereceiptentry',
    component: AdvanceReceiptEntryComponent,
    title: 'Advance Receipt Entry',
  },
  {
    path: 'dataentry/multiplelinking',
    component: MultipleLinkingComponent,
    title: 'Multiple Linking',
  },
  {
    path: 'dataentry/tdsprovision',
    component: TDSProvisionComponent,
    title: 'TDS Provision',
  },
  {
    path: 'dataentry/enggpartyaddition',
    component: PartyAdditionComponent,
    title: 'Engg Party Addition'
  },
  // reports
  {
    path: 'reports/detailsofrecid.',
    component: DetailsOfRecIdComponent,
    title: 'Details Of Rec Id',
  },
  {
    path: 'reports/buildingexpensessummary',
    component: BuildingExpensesSummaryComponent,
    title: 'Building Expenses Summary',
  },
  {
    path: 'reports/buildingwisepartydetails',
    component: BuildingwisePartyDetailsComponent,
    title: 'Buildingwise Party Details',
  },
  {
    path: 'reports/statementofchequeinfavour',
    component: StatementOfChequeInFavourComponent,
    title: 'Statement Of Cheque in Favour',
  },
  {
    path: 'reports/listofretentionoutstandingcertificate',
    component: ListOfRetentionOutstandingCertificateComponent,
    title: 'List Of Retention Outstanding Certificate',
  },
  //report1
  {
    path: 'reports1/contractwisebillwisepaymentdetails',
    component: ContractwiseBillwisePaymentDetailsComponent,
    title: 'Contractwise Billwise Payment Details',
  },
  {
    path: 'reports1/contractorageingreport',
    component: ContractorAgeingReportComponent,
    title: 'Contractor Ageing Report',
  },
  // 11/12/23  RS   --Start
  {
    path: 'reports/contractwiseworkwisesummary',
    component: ContractWiseWorkwiseSummaryComponent,
    title: 'Contractwise Workwise Summary Report',
  },
  // 11/12/23  RS   --End

  // 12/12/23  RS   --Start
  {
    path: 'reports/listofinterimcertificate',
    component: ListOfInterimCertificateReportComponent,
    title: 'List of Interim Certificate Report',
  },
  // 12/12/23  RS   --End

  // 18/12/23  RS   --Start
  {
    path: 'reports/contractwisecertificatewisedetails',
    component: ContractwiseCertificatewsiseDetailsReportComponent,
    title: 'Contractwise Certificatewise Details Report',
  },
  // 18/12/23  RS   --End

  // 20/12/23  RS   --Start
  {
    path: 'reports/statusofcontrator',
    component: StatusOfContractorComponent,
    title: 'Status Of Contractor Report',
  },
  // 20/12/23  RS   --End

  // 21/12/23  RS   --Start
  {
    path: 'reports/listofadvanceoutstanding',
    component: ListOfRetentionOutstandingCertificateComponent,
    title: 'List Of Advance Outstanding Certificate',
  },
  // 21/12/23  RS   --End

  // 26/12/23  RS   --Start
  {
    path: 'reports/monthlyexpenditure',
    component: MonthlyExpenditureComponent,
    title: 'Monthly Expenditure Report',
  },
  // 26/12/23  RS   --End

  // 28/12/23  RS   --Start
  {
    path: 'reports/certificatelist-unpassedcertificate',
    component: UnpassedCertListComponent,
    title: 'Unpassed Certificate List',
  },
  // 28/12/23  RS   --End

  // 29/12/23  RS   --Start
  {
    path: 'reports/listofcontrator',
    component: ListOfContractorComponent,
    title: 'List Of Contractors',
  },
  // 29/12/23  RS   --End

  // 29/12/23  RS   --Start
  {
    path: 'reports/passcertificatelist',
    component: PassedCertificateListComponent,
    title: 'Passed Certificate List',
  },
  // 29/12/23  RS   --End

  // 30/12/23  RS   --Start
  {
    path: 'reports/outstandingpaymentstatusreport',
    component: OutstandingPaymentStatusReportComponent,
    title: 'Outstanding Payment Status Report',
  },
  // 30/12/23  RS   --End

  // 04/01/24  RS   --Start
  {
    path: 'reports/workwisesummaryreport',
    component: WorkwiseSummaryReportComponent,
    title: 'Work-wise Summary Report',
  },
  // 04/01/24  RS   --End

  // 17/01/24  RS   --Start
  {
    path: 'reports/contractwisecertificatewisesummary',
    component: ContractwiseCertificatewiseSummaryComponent,
    title: 'Contractwise Certificatewise Summary Report',
  },
  // 17/01/24  RS   --End

  // 18/01/24  RS   --Start
  {
    path: 'reports/durationwjsepaymentsummary',
    component: DurationwisePaymentSummaryComponent,
    title: 'Durationwise Payment Summary Report',
  },
  // 18/01/24  RS   --End

  // 22/01/24  RS   --Start
  {
    path: 'reports/contractorworkwisedebitsummary',
    component: ContractorWorkwiseDebitSummaryComponent,
    title: 'Contractor Workwise DebitSummary Summary',
  },
  // 22/01/24  RS   --End

  // 23/01/24  RS   --Start
  {
    path: 'reports/contractdebitreport',
    component: ContractDebitReportComponent,
    title: 'Contract Debit Report',
  },
  // 23/01/24  RS   --End
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertificateSystemRoutingModule {}
