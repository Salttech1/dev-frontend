import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActivedepositslistComponent } from './activedepositslist/activedepositslist.component';
import { PrematuredepositslistComponent } from './prematuredepositslist/prematuredepositslist.component';
import { CombinedInterestComponent } from './combined-interest/combined-interest.component';
import { DepositreportsComponent } from './depositreports/depositreports.component';
import { FixeddepositreceiptprintingComponent } from './fixeddepositreceiptprinting/fixeddepositreceiptprinting.component';
import { ListoftotalmonthwiserepaymentsComponent } from './listoftotalmonthwiserepayments/listoftotalmonthwiserepayments.component';
import { MailinglistofdepositorandbrokerComponent } from './mailinglistofdepositorandbroker/mailinglistofdepositorandbroker.component';
import { OutstandingDepositsComponent } from './outstanding-deposits/outstanding-deposits.component';
import { ProjectedmaturitiesreportComponent } from './projectedmaturitiesreport/projectedmaturitiesreport.component';
import { TotalinterestpaidforalldepositorsComponent } from './totalinterestpaidforalldepositors/totalinterestpaidforalldepositors.component';
import { InterestpaymentregisterPrintComponent } from './interestpaymentregister-print/interestpaymentregister-print.component';
import { CreateneftfileComponent } from './createneftfile/createneftfile.component';
import { ListofdepositorswithtotalamountComponent } from './listofdepositorswithtotalamount/listofdepositorswithtotalamount.component';
import { DepositorinterestdetailsComponent } from './depositorinterestdetails/depositorinterestdetails.component';
import { DetailsforitComponent } from './detailsforit/detailsforit.component';
import { NeftbankadviceComponent } from './neftbankadvice/neftbankadvice.component';
import { CoveringletterformaturityrenewalComponent } from './coveringletterformaturityrenewal/coveringletterformaturityrenewal.component';
import { RenewalreminderlettersnewComponent } from './renewalreminderlettersnew/renewalreminderlettersnew.component';
import { YearlyinteresttdsdetailsComponent } from './yearlyinteresttdsdetails/yearlyinteresttdsdetails.component';
import { ActivedepositindividualwiseComponent } from './activedepositindividualwise/activedepositindividualwise.component';
import { HalfyrinterestpaymentletterComponent } from './halfyrinterestpaymentletter/halfyrinterestpaymentletter.component';

const routes: Routes = [
  {
    path: 'depositreports',
    component: DepositreportsComponent,
    data: { title: 'Deposit Reports' },
  },
  {
    path: 'fixeddepositreceiptprinting',
    component: FixeddepositreceiptprintingComponent,
    data: { title: 'Fixed Deposit Receipt Prinitng' },
  },
  {
    path: 'totalinterestpaidforalldepositor',
    component: TotalinterestpaidforalldepositorsComponent,
    data: { title: 'Total Interest Paid For All Depositors' },
  },
  {
    path: 'mailinglistofdepositorandbroker',
    component: MailinglistofdepositorandbrokerComponent,
    data: { title: 'Mailimg List of Depositor And Broker' },
  },
  {
    path: 'projectedmaturitiesreport',
    component: ProjectedmaturitiesreportComponent,
    data: { title: 'Projected Maturities Report' },
  },
  {
    path: 'prematuredepositslist',
    component: PrematuredepositslistComponent,
    data: { title: 'Premature Deposits List' },
  },
  {
    path: 'listoftotalmonthwiserepayments',
    component: ListoftotalmonthwiserepaymentsComponent,
    data: { title: 'List of Total monthwise Repayments' },
  },
  {
    path: 'activedepositslist',
    component: ActivedepositslistComponent,
    data: { title: 'Active Deposit Lists' },
  },
  {
    path: 'combinedreportofinterest',
    component: CombinedInterestComponent,
    data: { title: 'Combined Report of Interest' },
  },
  {
    path: 'projectedmaturitiesreport',
    component: ProjectedmaturitiesreportComponent,
    data: { title: 'Projected Maturities Report' },
  },
  {
    path: 'outstandingdepositslist',
    component: OutstandingDepositsComponent,
    data: { title: 'Outstanding Deposits List' },
  },
  {
    path: 'interestpaymentregister-print',
    component: InterestpaymentregisterPrintComponent,
    data: { title: 'Interest Payment Register-Print' },
  },
  {
    path: 'createneftfile',
    component: CreateneftfileComponent,
    data: { title: 'Create NEFT File' },
  },
  {
    path: 'listofdepositorswithtotalamount',
    component: ListofdepositorswithtotalamountComponent,
    data: { title: 'List of Depositors with Total Amount' },
  },
  {
    path: 'detailsforit',
    component: DetailsforitComponent,
    data: { title: 'Depositor For IT' },
  },
  {
    path: 'neftbankadvice',
    component: NeftbankadviceComponent,
    data: { title: 'Neft Bank Advice' },
  },
  {
    path: 'depositorinterestdetails',
    component: DepositorinterestdetailsComponent,
    data: { title: 'Depositor Interest Detail' },
  },
  {
    path: 'coveringletterformaturity/renewal',
    component: CoveringletterformaturityrenewalComponent,
    data: { title: 'Covering Letter Maturity Renewal' },
  },
  {
    path: 'renewalreminderlettersnew',
    component: RenewalreminderlettersnewComponent,
    data: { title: 'Renewal Reminder Letters New' },
  },
  {
    path: 'yearlyinterest-tdsdetails',
    component: YearlyinteresttdsdetailsComponent,
    data: { title: 'Yearly Interest TDS Details' },
  },
  {
    path: 'activedepositindividualwise',
    component: ActivedepositindividualwiseComponent,
    data: { title: 'Active Deposit Individualwise'},
  },
  {
    path: 'detailsforit',
    component: DetailsforitComponent,
    data: { title: 'Depositor For IT' },
  },
  {
    path: 'neftbankadvice',
    component: NeftbankadviceComponent,
    data: { title: 'Neft Bank Advice' },
  },
  {
    path: 'coveringletterformaturityrenewal',
    component: CoveringletterformaturityrenewalComponent,
    data: { title: 'Covering Letter Maturity Renewal' },
  },
  {
    path: 'renewalreminderlettersnew',
    component: RenewalreminderlettersnewComponent,
    data: { title: 'Renewal Reminder Letters New' },
  },
  {
    path: 'yearlyinterest-tdsdetails',
    component: YearlyinteresttdsdetailsComponent,
    data: { title: 'Yearly Interest TDS Details' },
  },
  {
    path: 'activedepositindividualwise',
    component: ActivedepositindividualwiseComponent,
    data: { title: 'Active Deposit Individualwise'},
  },
  {
    path: 'halfyrinterestpaymentletter',
    component: HalfyrinterestpaymentletterComponent,
    data: { title: 'Half Yearly Interest Payment Letter'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule { }
