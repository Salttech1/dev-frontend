import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchRoutingModule } from './arch-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { AddressModule } from '../common/address/address.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ArchRoutingModule,
  ],
})
export class ArchModule {}
