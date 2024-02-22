import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeedetailsPersonalComponent } from './reports/employeedetails-personal/employeedetails-personal.component';
import { EmployeedetailsphotoComponent } from './reports/employeedetailsphoto/employeedetailsphoto.component';
import { EmployeedetailsentryeditComponent } from './dataentry/employeedetailsentryedit/employeedetailsentryedit.component';

const routes: Routes = [
  {
    path: 'reports/employeedetailsphoto', 
    component: EmployeedetailsphotoComponent,
    title: 'Employee Detail Photo'
  },
  {
    path: 'reports/employeedetails-personal', 
    component: EmployeedetailsPersonalComponent,
    title: 'Employee Detail Personal'
  },
  {
    path: 'dataentry/employeedetailsentryedit', 
    component: EmployeedetailsentryeditComponent,
    title: 'Employee Detail Entry/Edit'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterdetailsentryeditRoutingModule { }
