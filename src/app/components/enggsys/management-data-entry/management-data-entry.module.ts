import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementDataEntryRoutingModule } from './management-data-entry-routing.module';
import { PartywiseNarrationEntryComponent } from './partywise-narration-entry/partywise-narration-entry.component';
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
import { ButtonsModule } from '../../common/buttons/buttons.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoaderModule } from '../../common/loader/loader.module';


@NgModule({
  declarations: [
    PartywiseNarrationEntryComponent,
    EstimateAndContractEntryComponent,
    PartyInfoEntryComponent,
    MaterialFlowEntryComponent,
    LogicNoteComponent,
    BoqEntryComponent,
    QuotePartyEntryComponent,
    GroupLogicNoteComponent,
    BoqSummaryDetailsComponent,
    ProjectProgressEntryComponent,
    MepProgressEntryComponent,
    ManpowerTrackingTemplateEntryComponent,
    ManpowerDailyTrasactionsEntryComponent,
    OtherDebitsBreakupEntryComponent,
    PaymentListGenerationComponent,
    LogicNoteVendorOrdernoComponent,
    LogicNoteAddtionalInformationComponent,
    LogicNoteBackupComponent
  ],
  imports: [
    CommonModule,
    ManagementDataEntryRoutingModule,
    ButtonsModule, 
    ReactiveFormsModule,
    FormsModule,
    F1Module,
    MatDatepickerModule,
    MatNativeDateModule,
    SharedModule,
    LoaderModule
  ]
})
export class ManagementDataEntryModule { }
