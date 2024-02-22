import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChequeclearingdetailsComponent } from './process/chequeclearingdetails/chequeclearingdetails.component';
import { BankrecostatusofchequesissueddepositedComponent } from './process/bankrecostatusofchequesissueddeposited/bankrecostatusofchequesissueddeposited.component';

const routes: Routes = [
  {
    path: 'process/chequeclearingdetails',
    component: ChequeclearingdetailsComponent},
    
    {
      path: 'process/bankrecostatusofchequesissueddeposited',
      component: BankrecostatusofchequesissueddepositedComponent}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankreconciliationRoutingModule { }
