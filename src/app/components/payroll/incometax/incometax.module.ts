import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncometaxRoutingModule } from './incometax-routing.module';
import { TdssummaryComponent } from './reports/tdssummary/tdssummary.component';
import { MonthlyitsummaryComponent } from './reports/monthlyitsummary/monthlyitsummary.component';
import { TdsauditsummaryComponent } from './reports/tdsauditsummary/tdsauditsummary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MonthlyitsummaryhorizontalComponent } from './reports/monthlyitsummaryhorizontal/monthlyitsummaryhorizontal.component';
import { SettledholdemployeeComponent } from './reports/settledholdemployee/settledholdemployee.component';


@NgModule({
  declarations: [
    TdssummaryComponent,
    MonthlyitsummaryComponent,
    TdsauditsummaryComponent,
    MonthlyitsummaryhorizontalComponent,
    SettledholdemployeeComponent
  ],
  imports: [
    CommonModule,
    IncometaxRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule
  ]
})
export class IncometaxModule { }
