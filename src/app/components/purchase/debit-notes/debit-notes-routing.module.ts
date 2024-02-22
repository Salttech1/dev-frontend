import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GstDebitNotesEntryComponent } from './data-entry/gst-debit-notes-entry/gst-debit-notes-entry.component';

const routes: Routes = [

  {
    path: 'dataentry/gst-debitnotesentry',
    component: GstDebitNotesEntryComponent,
    title: 'GST - Debit Notes Entry',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebitNotesRoutingModule { }
