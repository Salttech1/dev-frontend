import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BonusincrementsRoutingModule } from './bonusincrements-routing.module';
import { AllotmentreportComponent } from './report/allotmentreport/allotmentreport.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BonusoutgoingreportComponent } from './report/bonusoutgoingreport/bonusoutgoingreport.component';


@NgModule({
  declarations: [
    AllotmentreportComponent,
    BonusoutgoingreportComponent
  ],
  imports: [
    CommonModule,
    BonusincrementsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule

  ]
})
export class BonusincrementsModule { }
