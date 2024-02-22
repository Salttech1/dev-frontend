import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyComponent } from './party.component';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PartyComponent],
  imports: [
    CommonModule,F1Module,
    FormsModule,ReactiveFormsModule
  ],
  exports:[PartyComponent]
})
export class PartyModule { }
