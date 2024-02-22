import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterestChequeDataEntryComponent } from './interest-cheque-data-entry/interest-cheque-data-entry.component';
import { DataentryRoutingModule } from './dataentry-routing.module';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DepositrenewalglentryComponent } from './depositrenewalglentry/depositrenewalglentry.component';
import { InteresttaxentryComponent } from './interesttaxentry/interesttaxentry.component';
import { LoaderModule } from 'src/app/components/common/loader/loader.module';
import { InterestcalculationComponent } from './interestcalculation/interestcalculation.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { InterestchequeprintingComponent } from './interestchequeprinting/interestchequeprinting.component';
import { Form15hgentryeditComponent } from './form15hgentryedit/form15hgentryedit.component';
import { Form15hgreturnsComponent } from './form15hgreturns/form15hgreturns.component';
import { YearendprocessingComponent } from './yearendprocessing/yearendprocessing.component';
import { DepositdischargeComponent } from './depositdischarge/depositdischarge.component';
import { DepositordetailsentryeditComponent } from './depositordetailsentryedit/depositordetailsentryedit.component';
import { DepositordetailComponent } from '../../fdcommon/depositordetail/depositordetail.component';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { PartyModule } from 'src/app/components/common/party/party.module';
import { AddressModule } from 'src/app/components/common/address/address.module';
import { ActionpanelModule } from 'src/app/layout/actionpanel/actionpanel.module';
import { DepositdetailsentryeditComponent } from './depositdetailsentryedit/depositdetailsentryedit.component';
import { DepositrenewalsComponent } from './depositrenewals/depositrenewals.component';
import { DeposittransferComponent } from './deposittransfer/deposittransfer.component';

@NgModule({
  declarations: [
    InterestChequeDataEntryComponent,
    DepositrenewalglentryComponent,
    InteresttaxentryComponent,
    InterestcalculationComponent,
    InterestchequeprintingComponent,
    InterestcalculationComponent,
    Form15hgentryeditComponent,
    Form15hgreturnsComponent,
    YearendprocessingComponent,
    DepositdischargeComponent,
    DepositordetailsentryeditComponent,
    DepositordetailComponent,
    DepositdetailsentryeditComponent,
    DepositrenewalsComponent,
    DeposittransferComponent

  ],
  imports: [
    CommonModule,
    DataentryRoutingModule,
    F1Module, ReactiveFormsModule,
    FormsModule, DataTablesModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule, PdfViewerModule, MomentDateModule,
    PartyModule, AddressModule, ActionpanelModule
  ]
})
export class DataentryModule { }
