import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfraRoutingModule } from './infra-routing.module';
import { F1Module } from "../../../shared/generic/f1/f1.module";
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { LoaderModule } from '../../common/loader/loader.module';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { InfraDefaultersListComponent } from './reports/infra-defaulters-list/infra-defaulters-list.component';
import { InfraCollectionReportComponent } from './reports/infra-collection-report/infra-collection-report.component';
import { OutgoingInfraMonthwiseComponent } from './reports/outgoing-infra-monthwise/outgoing-infra-monthwise.component';
import { InfraReceiptReportComponent } from './reports/infra-receipt-report/infra-receipt-report.component';
import { FlatwiseInfraSummaryComponent } from './reports/flatwise-infra-summary/flatwise-infra-summary.component';
import { InfrafuturecollectionreportComponent } from './reports/infrafuturecollectionreport/infrafuturecollectionreport.component';


@NgModule({
  declarations: [
    InfraDefaultersListComponent,
    InfraCollectionReportComponent,
    OutgoingInfraMonthwiseComponent,
    InfraReceiptReportComponent,
    FlatwiseInfraSummaryComponent,
    InfrafuturecollectionreportComponent
  ],

  imports: [
    CommonModule,
    InfraRoutingModule,
    ReactiveFormsModule,
    F1Module,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SharedModule,
    DataTablesModule,
    FormsModule,
    LoaderModule,
    FormsModule,
    MatIconModule,
    PdfViewerModule
  ]
})
export class InfraModule { }
