import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdditionalesicregisterreportComponent } from './reports/additionalesicregisterreport/additionalesicregisterreport.component';
import { CreatemonthlypffileComponent } from './reports/createmonthlypffile/createmonthlypffile.component';
import { EmployeewiseforptExcelComponent } from './reports/employeewiseforpt-excel/employeewiseforpt-excel.component';
import { Esicform5Component } from './reports/esicform5/esicform5.component';
import { EsicregisterComponent } from './reports/esicregister/esicregister.component';
import { EsicreturnsComponent } from './reports/esicreturns/esicreturns.component';
import { Form3AComponent } from './reports/form3-a/form3-a.component';
import { Form3abefore2004Component } from './reports/form3abefore2004/form3abefore2004.component';
import { Form6AComponent } from './reports/form6-a/form6-a.component';
import { PfEdlisreportComponent } from './reports/pf-edlisreport/pf-edlisreport.component';
import { PfregisterComponent } from './reports/pfregister/pfregister.component';
import { PfreportComponent } from './reports/pfreport/pfreport.component';
import { PfstatisticsComponent } from './reports/pfstatistics/pfstatistics.component';
import { PtslabmonthlyreportComponent } from './reports/ptslabmonthlyreport/ptslabmonthlyreport.component';


const routes: Routes = [
  {
    path: 'pfreport', 
    component: PfreportComponent,
    title: 'PF Report for Month'
  },
  {
    path: 'pfregister', 
    component: PfregisterComponent,
    title: 'PF Register for Month'
  },  
  {
    path: 'pfstatistics', 
    component: PfstatisticsComponent,
    title: 'PF Statistics for Month'
  },    
  {
    path: 'form6-a', 
    component: Form6AComponent,
    title: 'PF Form 6-A'
  },    
  {
    path: 'form3-a', 
    component: Form3AComponent,
    title: 'PF Form 3-A'
  },    
  {
    path: 'ptslabmonthlyreport', 
    component: PtslabmonthlyreportComponent,
    title: 'PT Slab Monthly Report'
  },    
  {
    path: 'additionalesicregisterreport', 
    component: AdditionalesicregisterreportComponent,
    title: 'Additional ESIC Register Report'
  },    
  {
    path: 'pf-edlisreport', 
    component: PfEdlisreportComponent,
    title: 'PF-EDLIS Report'
  },    
  {
    path: 'form3abefore2004', 
    component: Form3abefore2004Component,
    title: 'Form 3A Before 2004'
  },    
  {
    path: 'esicregister', 
    component: EsicregisterComponent,
    title: 'ESIC Register'
  },    
  {
    path: 'esicform5', 
    component: Esicform5Component,
    title: 'ESIC Form 5'
  },    
  {
    path: 'esicreturns', 
    component: EsicreturnsComponent,
    title: 'ESIC Returns'
  },    
  {
    path: 'createmonthlypffile', 
    component: CreatemonthlypffileComponent,
    title: 'Create Monthly PF File'
  },    
  {
    path: 'employeewiseforpt-excel', 
    component: EmployeewiseforptExcelComponent,
    title: 'Create Monthly PT File in Excel'
  },    
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PfptesisreportsRoutingModule { }
