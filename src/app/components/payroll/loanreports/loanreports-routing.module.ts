import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyinterestloanComponent } from './reports/companyinterestloan/companyinterestloan.component';
import { CompanyloanstatementmonthlyComponent } from './reports/companyloanstatementmonthly/companyloanstatementmonthly.component';
import { LoandocumentreportComponent } from './reports/loandocumentreport/loandocumentreport.component';
import { LoanreportEmployeewiseComponent } from './reports/loanreport-employeewise/loanreport-employeewise.component';
import { OtherloanstatementmonthlyComponent } from './reports/otherloanstatementmonthly/otherloanstatementmonthly.component';

const routes: Routes = [

  {
    path: 'reports/companyloanstatementmonthly', 
    component: CompanyloanstatementmonthlyComponent,
    title: 'Company Loan Statement'
  },

  {
    path: 'reports/otherloanstatementmonthly', 
    component: OtherloanstatementmonthlyComponent,
    title: 'Other Loan Statement'
  },

  {
    path: 'reports/companyloandocumentreport', 
    component: LoandocumentreportComponent,
    title: 'Company Loan Document Report'
  },

  {
    path: 'reports/companyinterestloan', 
    component: CompanyinterestloanComponent,
    title: 'Company Interst Loan'
  },

  {
    path: 'reports/companyloanreport-employeewise', 
    component: LoanreportEmployeewiseComponent,
    title: 'Company Loan Report - Employeewise'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanreportsRoutingModule { }
