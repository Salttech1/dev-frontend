import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GratuityformComponent } from './reports/gratuityform/gratuityform.component';
import { SettlementofgratuityComponent } from './reports/settlementofgratuity/settlementofgratuity.component';

const routes: Routes = [

  {
    path: 'reports/settlementofgratuity', 
    component: SettlementofgratuityComponent,
    title: 'Settlement of Gratuity Report'
  },  
  {
    path: 'reports/gratuityform', 
    component: GratuityformComponent,
    title: 'Gratuity Form'
  },  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GratuitypaymentRoutingModule { }
