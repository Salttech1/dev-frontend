import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonthlyconveyancereimbursementComponent } from './reports/monthlyconveyancereimbursement/monthlyconveyancereimbursement.component';

const routes: Routes = [

  {
    path: 'reports/monthlyconveyancereimbursement', 
    component: MonthlyconveyancereimbursementComponent,
    title: 'Monthly Conveyance Reimbursement'
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConveyancereimbursementRoutingModule { }
