import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeedetailsPersonalComponent } from '../masterdetailsentryedit/reports/employeedetails-personal/employeedetails-personal.component';
import { CompanywisemonthwisepaymentdatesComponent } from './report/companywisemonthwisepaymentdates/companywisemonthwisepaymentdates.component';
import { EmployeebirthdayComponent } from './report/employeebirthday/employeebirthday.component';
import { EmployeesalarydetailsComponent } from './report/employeesalarydetails/employeesalarydetails.component';
import { EmployeesalarypackageComponent } from './report/employeesalarypackage/employeesalarypackage.component';
import { GrosssalaryinexcelComponent } from './report/grosssalaryinexcel/grosssalaryinexcel.component';
import { SoceitysalarydetailsComponent } from './report/soceitysalarydetails/soceitysalarydetails.component';

const routes: Routes = [
  {
    path: 'report/employeebirthday', 
    component: EmployeebirthdayComponent,
    title: 'Employee Birthday'
  },
  {
    path: 'report/employeesalarydetails', 
    component: EmployeesalarydetailsComponent,
    title: 'Employee Salary Details'
  }, 
  {
    path: 'report/employeesalarypackage', 
    component: EmployeesalarypackageComponent,
    title: 'Employee Salary Package Details'
  }, 
  {
    path: 'report/companywisemonthwisepaymentdates', 
    component: CompanywisemonthwisepaymentdatesComponent,
    title: 'Companywise Monthwise Payment Dates'
  }, 
  {
    path: 'report/soceitysalarydetails', 
    component: SoceitysalarydetailsComponent,
    title: 'Society Salary Data in Excel'
  }, 
  {
    path: 'report/grosssalaryinexcel', 
    component: GrosssalaryinexcelComponent,
    title: 'Gross Salary Data in Excel'
  }, 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiscellaneousfunctionsRoutingModule { }
