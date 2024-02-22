import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ButtonsModule } from './../common/buttons/buttons.module';
import { LoaderModule } from './../common/loader/loader.module';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { InfraModule } from './infra/infra.module';
import { BookingsModule } from './bookings/bookings.module';
import { LeaserentModule } from './leaserent/leaserent.module';
import { LessorrentModule } from './lessorrent/lessorrent.module';

@NgModule({
  declarations: [SalesComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    InfraModule,
    BookingsModule,
    LeaserentModule,
    LessorrentModule,
    ButtonsModule,
  ],
})
export class SalesModule {}
