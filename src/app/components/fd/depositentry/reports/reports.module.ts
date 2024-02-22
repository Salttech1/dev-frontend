import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LoaderModule } from 'src/app/components/common/loader/loader.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DepositreportsComponent } from './depositreports/depositreports.component';
import { FixeddepositreceiptprintingComponent } from './fixeddepositreceiptprinting/fixeddepositreceiptprinting.component';
import { TotalinterestpaidforalldepositorsComponent } from './totalinterestpaidforalldepositors/totalinterestpaidforalldepositors.component';
import { MailinglistofdepositorandbrokerComponent } from './mailinglistofdepositorandbroker/mailinglistofdepositorandbroker.component';
import { CombinedInterestComponent } from './combined-interest/combined-interest.component';
import { ProjectedmaturitiesreportComponent } from './projectedmaturitiesreport/projectedmaturitiesreport.component';
import { PrematuredepositslistComponent } from './prematuredepositslist/prematuredepositslist.component';
import { ListoftotalmonthwiserepaymentsComponent } from './listoftotalmonthwiserepayments/listoftotalmonthwiserepayments.component';
import { ActivedepositslistComponent } from './activedepositslist/activedepositslist.component';
import { OutstandingDepositsComponent } from './outstanding-deposits/outstanding-deposits.component';
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
import { SharedModule } from 'src/app/shared/shared.module';
import { HalfyrinterestpaymentletterComponent } from './halfyrinterestpaymentletter/halfyrinterestpaymentletter.component';

@NgModule({
  declarations: [
    DepositreportsComponent,
    FixeddepositreceiptprintingComponent,
    TotalinterestpaidforalldepositorsComponent,
    MailinglistofdepositorandbrokerComponent,
    ProjectedmaturitiesreportComponent,
    PrematuredepositslistComponent,
    ListoftotalmonthwiserepaymentsComponent,
    ActivedepositslistComponent,
    CombinedInterestComponent,
    ProjectedmaturitiesreportComponent,
    OutstandingDepositsComponent,
    InterestpaymentregisterPrintComponent,
    CreateneftfileComponent,
    OutstandingDepositsComponent,
    ListofdepositorswithtotalamountComponent,
    DepositorinterestdetailsComponent,
    DetailsforitComponent,NeftbankadviceComponent,
    CoveringletterformaturityrenewalComponent,
    RenewalreminderlettersnewComponent,
    YearlyinteresttdsdetailsComponent,
    ActivedepositindividualwiseComponent,
    DetailsforitComponent,NeftbankadviceComponent,
    CoveringletterformaturityrenewalComponent,
    RenewalreminderlettersnewComponent,
    YearlyinteresttdsdetailsComponent,
    ActivedepositindividualwiseComponent,
    HalfyrinterestpaymentletterComponent
    
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    F1Module,
    LoaderModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PdfViewerModule,
    SharedModule
  ],
})
export class ReportsModule {}
