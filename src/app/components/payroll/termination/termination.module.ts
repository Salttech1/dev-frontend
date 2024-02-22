import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TerminationRoutingModule } from './termination-routing.module';
import { SettlementofduesComponent } from './reports/settlementofdues/settlementofdues.component';
import { ListofterminatedemployeesComponent } from './reports/listofterminatedemployees/listofterminatedemployees.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExperiencecertificateComponent } from './reports/experiencecertificate/experiencecertificate.component';
import { SalarycertificateComponent } from './reports/salarycertificate/salarycertificate.component';

@NgModule({
  declarations: [
    SettlementofduesComponent,
    ListofterminatedemployeesComponent,
    ExperiencecertificateComponent,
    SalarycertificateComponent
  ],
  imports: [
    CommonModule,
    TerminationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule
  ]
})
export class TerminationModule { }
