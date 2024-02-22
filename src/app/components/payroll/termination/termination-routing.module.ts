import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GratuityformComponent } from '../gratuitypayment/reports/gratuityform/gratuityform.component';
import { ExperiencecertificateComponent } from './reports/experiencecertificate/experiencecertificate.component';
import { ListofterminatedemployeesComponent } from './reports/listofterminatedemployees/listofterminatedemployees.component';
import { SalarycertificateComponent } from './reports/salarycertificate/salarycertificate.component';
import { SettlementofduesComponent } from './reports/settlementofdues/settlementofdues.component';

const routes: Routes = [

  {
    path: 'reports/settlementofdues', 
    component: SettlementofduesComponent,
    title: 'Settlement of Dues Report'
  },
  {
    path: 'reports/listofterminatedemployees', 
    component: ListofterminatedemployeesComponent,
    title: 'List of Terminated Employees'
  },
  {
    path: 'reports/gratuityform', 
    component: GratuityformComponent,
    title: 'Gratuity Form'
  },  
  {
    path: 'reports/experiencecertificate', 
    component: ExperiencecertificateComponent,
    title: 'Experience Letter'
  },  
  {
    path: 'reports/salarycertificate', 
    component: SalarycertificateComponent,
    title: 'Salary Letter'
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerminationRoutingModule { }
