import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ButtonsModule } from '../../common/buttons/buttons.module';
import { LoaderModule } from '../../common/loader/loader.module';
import { LessorrentRoutingModule } from './lessorrent-routing.module';
import { PaymentreceiptdetailsComponent } from './reports/paymentreceiptdetails/paymentreciptdetails.component';
import { PersonmasterComponent } from './dataentry/personmaster/personmaster.component';
import { PropertymasterComponent } from './dataentry/propertymaster/propertymaster.component';
import { LessorunitmasterComponent } from './dataentry/unitmaster/unitmaster.component';


@NgModule({
  declarations: [
    PaymentreceiptdetailsComponent,
    PersonmasterComponent,
    PropertymasterComponent,
    LessorunitmasterComponent
  ],
  imports: [
    CommonModule,
    LessorrentRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    F1Module,
    MatDatepickerModule,
    MatNativeDateModule,
    ButtonsModule
  ]
})
export class LessorrentModule { }