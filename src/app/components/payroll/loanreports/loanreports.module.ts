import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanreportsRoutingModule } from './loanreports-routing.module';
import { CompanyloanstatementmonthlyComponent } from './reports/companyloanstatementmonthly/companyloanstatementmonthly.component';
import { OtherloanstatementmonthlyComponent } from './reports/otherloanstatementmonthly/otherloanstatementmonthly.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanyinterestloanComponent } from './reports/companyinterestloan/companyinterestloan.component';
import { LoanreportEmployeewiseComponent } from './reports/loanreport-employeewise/loanreport-employeewise.component';
import { LoandocumentreportComponent } from './reports/loandocumentreport/loandocumentreport.component';

@NgModule({
  declarations: [
    CompanyloanstatementmonthlyComponent,
    OtherloanstatementmonthlyComponent,
    CompanyinterestloanComponent,
    LoanreportEmployeewiseComponent,
    LoandocumentreportComponent
  ],
  imports: [
    CommonModule,
    LoanreportsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule
  ]
})
export class LoanreportsModule { }
