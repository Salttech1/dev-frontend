import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartywiseNarrationEntryComponent } from './partywise-narration-entry/partywise-narration-entry.component';
import { RouterModule, Routes } from '@angular/router';
import { EstimateAndContractEntryComponent } from './estimate-and-contract-entry/estimate-and-contract-entry.component';
import { PartyInfoEntryComponent } from './party-info-entry/party-info-entry.component';
import { MaterialFlowEntryComponent } from './material-flow-entry/material-flow-entry.component';
import { LogicNoteComponent } from './logic-note/logic-note.component';
import { BoqEntryComponent } from './boq-entry/boq-entry.component';
import { QuotePartyEntryComponent } from './quote-party-entry/quote-party-entry.component';
import { GroupLogicNoteComponent } from './group-logic-note/group-logic-note.component';
import { BoqSummaryDetailsComponent } from './boq-summary-details/boq-summary-details.component';
import { ProjectProgressEntryComponent } from './project-progress-entry/project-progress-entry.component';
import { MepProgressEntryComponent } from './mep-progress-entry/mep-progress-entry.component';
import { ManpowerTrackingTemplateEntryComponent } from './manpower-tracking-template-entry/manpower-tracking-template-entry.component';
import { ManpowerDailyTrasactionsEntryComponent } from './manpower-daily-trasactions-entry/manpower-daily-trasactions-entry.component';
import { OtherDebitsBreakupEntryComponent } from './other-debits-breakup-entry/other-debits-breakup-entry.component';
import { PaymentListGenerationComponent } from './payment-list-generation/payment-list-generation.component';
import { LogicNoteVendorOrdernoComponent } from './logic-note-vendor-orderno/logic-note-vendor-orderno.component';
import { LogicNoteAddtionalInformationComponent } from './logic-note-addtional-information/logic-note-addtional-information.component';
import { LogicNoteBackupComponent } from './logic-note-backup/logic-note-backup.component';

const routes: Routes = [
  {
    path: 'partywisenarrationentry',
    component: PartywiseNarrationEntryComponent
  },
  {
    path: 'estimateandcontractentry',
    component: EstimateAndContractEntryComponent
  },
  {
    path: 'partyinfoentry',
    component: PartyInfoEntryComponent
  },
  {
    path: 'materialflowentry',
    component: MaterialFlowEntryComponent
  },
  {
    path: 'logicnote',
    component: LogicNoteComponent
  },
  {
    path: 'boqentry',
    component: BoqEntryComponent
  },
  {
    path: 'quotepartyentry',
    component: QuotePartyEntryComponent
  },
  {
    path: 'grouplogicnote',
    component: GroupLogicNoteComponent
  },
  {
    path: 'boqsummarydetails',
    component: BoqSummaryDetailsComponent
  },
  {
    path: 'projectprogressentry',
    component: ProjectProgressEntryComponent
  },
  {
    path: 'mepprogressentry',
    component: MepProgressEntryComponent
  },
  {
    path: 'manpowertrackingtemplateentry',
    component: ManpowerTrackingTemplateEntryComponent
  },
  {
    path: 'manpowerdailytransactionsentry',
    component: ManpowerDailyTrasactionsEntryComponent
  },
  {
    path: 'otherdebitsbreakupentry',
    component: OtherDebitsBreakupEntryComponent
  },
  {
    path: 'paymentlistgeneration',
    component: PaymentListGenerationComponent
  },
  {
    path: 'logicnotevendororderno',
    component: LogicNoteVendorOrdernoComponent
  },
  {
    path: 'logicnoteaddtionalinformation',
    component: LogicNoteAddtionalInformationComponent
  },
  {
    path: 'logicnotebackup',
    component: LogicNoteBackupComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ManagementDataEntryRoutingModule { }
