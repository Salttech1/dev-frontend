import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ButtonsModule } from '../../common/buttons/buttons.module';
import { LoaderModule } from '../../common/loader/loader.module';
import { BankreconciliationRoutingModule } from './bankreconciliation-routing.module';
import { ChequeclearingdetailsComponent } from './process/chequeclearingdetails/chequeclearingdetails.component';
import { BankrecostatusofchequesissueddepositedComponent } from './process/bankrecostatusofchequesissueddeposited/bankrecostatusofchequesissueddeposited.component';


@NgModule({
  declarations: [
    ChequeclearingdetailsComponent,
    BankrecostatusofchequesissueddepositedComponent
  ],
  imports: [
    LoaderModule,
    SharedModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    F1Module,
    MatDatepickerModule,
    MatNativeDateModule,
    ButtonsModule,    
    BankreconciliationRoutingModule
  ]
})
export class BankreconciliationModule { }
