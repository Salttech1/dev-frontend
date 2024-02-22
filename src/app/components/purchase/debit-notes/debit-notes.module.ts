import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DebitNotesRoutingModule } from './debit-notes-routing.module';
import { GstDebitNotesEntryComponent } from './data-entry/gst-debit-notes-entry/gst-debit-notes-entry.component';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    GstDebitNotesEntryComponent
  ],
  imports: [
    CommonModule,
    DebitNotesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    F1Module,
    DataTablesModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule
   
  ]
})
export class DebitNotesModule { }
