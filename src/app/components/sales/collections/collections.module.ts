import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionsRoutingModule } from './collections-routing.module';
import { RecoverystatementComponent } from './reports/recoverystatement/recoverystatement.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ButtonsModule } from "../../common/buttons/buttons.module";
import { CollectionchallanreportComponent } from './reports/collectionchallanreport/collectionchallanreport.component';
import { CollectioninvoicereportComponent } from './reports/collectioninvoicereport/collectioninvoicereport.component';
import { FuturecollectionreportComponent } from './reports/futurecollectionreport/futurecollectionreport.component';
import { FlatdetailsComponent } from './reports/flatdetails/flatdetails.component';
import { CollectionsummaryforpossessionComponent } from './reports/collectionsummaryforpossession/collectionsummaryforpossession.component';
import { DinshawcollectionreportComponent } from './reports/dinshawcollectionreport/dinshawcollectionreport.component';
import { CollectionreceiptreprintComponent } from './reports/collectionreceiptreprint/collectionreceiptreprint.component';


@NgModule({
    declarations: [
        RecoverystatementComponent,
        CollectionchallanreportComponent,
        CollectioninvoicereportComponent,
        FuturecollectionreportComponent,
        FlatdetailsComponent,
        CollectionsummaryforpossessionComponent,
        DinshawcollectionreportComponent,
        CollectionreceiptreprintComponent
    ],
    imports: [
        CommonModule,
        CollectionsRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        F1Module,
        SharedModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ButtonsModule
    ]
})
export class CollectionsModule { }
