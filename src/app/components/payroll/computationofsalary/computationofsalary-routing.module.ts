import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankadviceletterpendriveComponent } from './reports/bankadviceletterpendrive/bankadviceletterpendrive.component';
import { BasicsalarydetailsComponent } from './reports/basicsalarydetails/basicsalarydetails.component';
import { ChequeregisterComponent } from './reports/chequeregister/chequeregister.component';
import { CompanywiseoutgoingsummaryComponent } from './reports/companywiseoutgoingsummary/companywiseoutgoingsummary.component';
import { CompanywisepaymentTypewisesummaryComponent } from './reports/companywisepayment-typewisesummary/companywisepayment-typewisesummary.component';
import { EmployeewisemonthlysummaryExcelComponent } from './reports/employeewisemonthlysummary-excel/employeewisemonthlysummary-excel.component';
import { IncomingoutgoingholdemployeelistComponent } from './reports/incomingoutgoingholdemployeelist/incomingoutgoingholdemployeelist.component';
import { ReconciliationneetamanojComponent } from './reports/reconciliationneetamanoj/reconciliationneetamanoj.component';
import { SalaryreconciliationstatementComponent } from './reports/salaryreconciliationstatement/salaryreconciliationstatement.component';
import { SalaryreconcilitionsummaryComponent } from './reports/salaryreconcilitionsummary/salaryreconcilitionsummary.component';
import { EmployeesalarycomputationComponent } from './dataentry/employeesalarycomputation/employeesalarycomputation.component';
import { SalaryinitialisationComponent } from './dataentry/salaryinitialisation/salaryinitialisation.component';

const routes: Routes = [

  {
    path: 'reports/chequeregister', 
    component: ChequeregisterComponent,
    title: 'Cheque Register'
  },
  {
    path: 'reports/companywisepayment-typewisesummary', 
    component: CompanywisepaymentTypewisesummaryComponent,
    title: 'Companywise Payment Type wise Summary'
  },
  {
    path: 'reports/companywiseoutgoingsummary', 
    component: CompanywiseoutgoingsummaryComponent,
    title: 'Companywise Outgoing Summary'
  },
  {
    path: 'reports/incomingoutgoingholdemployeelist', 
    component: IncomingoutgoingholdemployeelistComponent,
    title: 'In-Out-Hold Employee List'
  },
  {
    path: 'reports/salaryreconciliationstatement', 
    component: SalaryreconciliationstatementComponent,
    title: 'Salary Reconciliation Statement'
  },
  {
    path: 'reports/reconciliationneetamanoj', 
    component: ReconciliationneetamanojComponent,
    title: 'Salary Reco Statement New Format'
  },
  {
    path: 'reports/basicsalarydetails', 
    component: BasicsalarydetailsComponent,
    title: 'Basic Salary Details'
  },
  {
    path: 'reports/salaryreconcilitionsummary', 
    component: SalaryreconcilitionsummaryComponent,
    title: 'Salary Reco Summary'
  },
  {
    path: 'reports/employeewisemonthlysummary-excel', 
    component: EmployeewisemonthlysummaryExcelComponent,
    title: 'Emp Wise Monthly Summary - Excel'
  },
  {
    path: 'reports/bankadviceletterpendrive', 
    component: BankadviceletterpendriveComponent,
    title: 'Bank Advice / Letter / PenDrive'
  },
  {
    path: 'dataentry/employeesalarycomputation',
    component: EmployeesalarycomputationComponent,
    title: 'Employee Salary Computation'
  },
  {
    path: 'dataentry/salaryinitialisation',
    component: SalaryinitialisationComponent,
    title: 'Salary Initialisation'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComputationofsalaryRoutingModule { }
