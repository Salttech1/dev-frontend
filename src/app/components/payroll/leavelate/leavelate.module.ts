import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeavelateRoutingModule } from './leavelate-routing.module';
import { LeavereportmonthsComponent } from './reports/leavereportmonths/leavereportmonths.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LeavereportdaysComponent } from './reports/leavereportdays/leavereportdays.component';
import { LeaveexcessdaysComponent } from './reports/leaveexcessdays/leaveexcessdays.component';
import { LatereportdaysComponent } from './reports/latereportdays/latereportdays.component';
import { LatereportmonthsComponent } from './reports/latereportmonths/latereportmonths.component';


@NgModule({
  declarations: [
    LeavereportmonthsComponent,
    LeavereportdaysComponent,
    LeaveexcessdaysComponent,
    LatereportdaysComponent,
    LatereportmonthsComponent
  ],
  imports: [
    CommonModule,
    LeavelateRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule
  ]
})
export class LeavelateModule { }
