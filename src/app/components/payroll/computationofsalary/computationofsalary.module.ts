import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComputationofsalaryRoutingModule } from './computationofsalary-routing.module';
import { ChequeregisterComponent } from './reports/chequeregister/chequeregister.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanywisepaymentTypewisesummaryComponent } from './reports/companywisepayment-typewisesummary/companywisepayment-typewisesummary.component';
import { CompanywiseoutgoingsummaryComponent } from './reports/companywiseoutgoingsummary/companywiseoutgoingsummary.component';
import { IncomingoutgoingholdemployeelistComponent } from './reports/incomingoutgoingholdemployeelist/incomingoutgoingholdemployeelist.component';
import { SalaryreconciliationstatementComponent } from './reports/salaryreconciliationstatement/salaryreconciliationstatement.component';
import { ReconciliationneetamanojComponent } from './reports/reconciliationneetamanoj/reconciliationneetamanoj.component';
import { BasicsalarydetailsComponent } from './reports/basicsalarydetails/basicsalarydetails.component';
import { SalaryreconcilitionsummaryComponent } from './reports/salaryreconcilitionsummary/salaryreconcilitionsummary.component';
import { EmployeewisemonthlysummaryExcelComponent } from './reports/employeewisemonthlysummary-excel/employeewisemonthlysummary-excel.component';
import { BankadviceletterpendriveComponent } from './reports/bankadviceletterpendrive/bankadviceletterpendrive.component';
import { EmployeesalarycomputationComponent } from './dataentry/employeesalarycomputation/employeesalarycomputation.component';
import { SalaryinitialisationComponent } from './dataentry/salaryinitialisation/salaryinitialisation.component';


@NgModule({
  declarations: [
    ChequeregisterComponent,
    CompanywisepaymentTypewisesummaryComponent,
    CompanywiseoutgoingsummaryComponent,
    IncomingoutgoingholdemployeelistComponent,
    SalaryreconciliationstatementComponent,
    ReconciliationneetamanojComponent,
    BasicsalarydetailsComponent,
    SalaryreconcilitionsummaryComponent,
    EmployeewisemonthlysummaryExcelComponent,
    BankadviceletterpendriveComponent,
    EmployeesalarycomputationComponent,
    SalaryinitialisationComponent
  ],
  imports: [
    CommonModule,
    ComputationofsalaryRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule
  ]
})
export class ComputationofsalaryModule { }
