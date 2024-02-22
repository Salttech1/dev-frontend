import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanydeptmonthwisesummaryComponent } from './reports/companydeptmonthwisesummary/companydeptmonthwisesummary.component';
import { EmployeeprofileComponent } from './reports/employeeprofile/employeeprofile.component';
import { GratuityprojectionComponent } from './reports/gratuityprojection/gratuityprojection.component';
import { ReimbursementpaymentComponent } from './reports/reimbursementpayment/reimbursementpayment.component';

const routes: Routes = [

  {
    path: 'companydeptmonthwisesummary', 
    component: CompanydeptmonthwisesummaryComponent,
    title: 'Companywise DeptWise Monthwise Summary'
  },
  {
    path: 'gratuityprojection', 
    component: GratuityprojectionComponent,
    title: 'Gratuity Projection Report'
  },
  {
    path: 'reimbursementpayment', 
    component: ReimbursementpaymentComponent,
    title: 'Reimbursement Payment Report'
  },
  {
    path: 'employeeprofile', 
    component: EmployeeprofileComponent,
    title: 'Employee Profile'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementreportsRoutingModule { }
