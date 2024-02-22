import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FaledgersandreportsRoutingModule } from './faledgersandreports-routing.module';
import { MsmepartiesreportComponent } from './reports1/msmepartiesreport/msmepartiesreport.component';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PendingintercompanytransComponent } from './reports/pendingintercompanytrans/pendingintercompanytrans.component';

@NgModule({
  declarations: [
    MsmepartiesreportComponent, 
    PendingintercompanytransComponent
  ],
  imports: [
    CommonModule,
    F1Module,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    DataTablesModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule,
    FaledgersandreportsRoutingModule,
  ],
})
export class FaledgersandreportsModule {}
