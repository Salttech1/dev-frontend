import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjbldgRoutingModule } from './projbldg-routing.module';
import { BuildingEntryComponent } from './data-entry/building-entry/building-entry.component';
import { F1Module } from "../../../shared/generic/f1/f1.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressModule } from '../../common/address/address.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ProjectEntryComponent } from './data-entry/project-entry/project-entry.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlatAreaByBuildingComponent } from './reports/flat-area-by-building/flat-area-by-building.component';

@NgModule({
    declarations: [
        BuildingEntryComponent,
        ProjectEntryComponent,
        FlatAreaByBuildingComponent
    ],
    imports: [
        CommonModule,        
        ProjbldgRoutingModule,
        F1Module,
        ReactiveFormsModule,
        FormsModule,
        AddressModule,
        MatDatepickerModule,
        MatNativeDateModule,
        SharedModule
    ]
})
export class ProjbldgModule { }
