import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressComponent } from './address.component';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
@NgModule({
  declarations: [AddressComponent],
  imports: [
    CommonModule,F1Module,ReactiveFormsModule,FormsModule
  ],
  exports:[AddressComponent]
})
export class AddressModule { }
