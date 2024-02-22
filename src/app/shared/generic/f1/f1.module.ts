import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F1Component } from './f1.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms'
import { GenerictableComponent } from '../generictable/generictable.component';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

@NgModule({
  declarations: [F1Component,GenerictableComponent],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,
    DataTablesModule
  ],
  exports:[F1Component],
  providers:[
    {provide:MatDialogRef , useValue:{} },
    {provide:MAT_DIALOG_DATA , useValue:{} },
    // {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}  
  ]
})
export class F1Module { }
