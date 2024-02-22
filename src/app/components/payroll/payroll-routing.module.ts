import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'miscellaneousfunctions',  
    loadChildren:() => import(`../../components/payroll/miscellaneousfunctions/miscellaneousfunctions.module`).then(m => m.MiscellaneousfunctionsModule),
  },
  {
    path:'masterdetailsentryedit',  
    loadChildren:() => import(`../../components/payroll/masterdetailsentryedit/masterdetailsentryedit.module`).then(m => m.MasterdetailsentryeditModule),
  },
  {
    path:'leavelate',  
    loadChildren:() => import(`../../components/payroll/leavelate/leavelate.module`).then(m => m.LeavelateModule),
  },
  {
    path:'pfptesisreports',  
    loadChildren:() => import(`../../components/payroll/pfptesisreports/pfptesisreports.module`).then(m => m.PfptesisreportsModule),
  },
  {
    path:'loanreports',  
    loadChildren:() => import(`../../components/payroll/loanreports/loanreports.module`).then(m => m.LoanreportsModule),
  },
  {
    path:'conveyancereimbursement',  
    loadChildren:() => import(`../../components/payroll/conveyancereimbursement/conveyancereimbursement.module`).then(m => m.ConveyancereimbursementModule),
  },
  {
    path:'computationofsalary',  
    loadChildren:() => import(`../../components/payroll/computationofsalary/computationofsalary.module`).then(m => m.ComputationofsalaryModule),
  },
  {
    path:'incometax',  
    loadChildren:() => import(`../../components/payroll/incometax/incometax.module`).then(m => m.IncometaxModule),
  },
  {
    path:'termination',  
    loadChildren:() => import(`../../components/payroll/termination/termination.module`).then(m => m.TerminationModule),
  },
  {
    path:'gratuitypayment',  
    loadChildren:() => import(`../../components/payroll/gratuitypayment/gratuitypayment.module`).then(m => m.GratuitypaymentModule),
  },
  {
    path:'bonusincrements',  
    loadChildren:() => import(`../../components/payroll/bonusincrements/bonusincrements.module`).then(m => m.BonusincrementsModule),
  },
  {
    path:'managementreports',  
    loadChildren:() => import(`../../components/payroll/managementreports/managementreports.module`).then(m => m.ManagementreportsModule),
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollRoutingModule { }
