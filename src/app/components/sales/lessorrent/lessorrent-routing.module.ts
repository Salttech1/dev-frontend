import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonmasterComponent } from './dataentry/personmaster/personmaster.component';
import { PropertymasterComponent } from './dataentry/propertymaster/propertymaster.component';
import { LessorunitmasterComponent } from './dataentry/unitmaster/unitmaster.component';
import { PaymentreceiptdetailsComponent } from './reports/paymentreceiptdetails/paymentreciptdetails.component';

const routes: Routes = [
  {
    path: 'reports/paymentreceiptdetails',
    component: PaymentreceiptdetailsComponent},
  
    {
      path: 'dataentry/personmaster',
    component: PersonmasterComponent},
        
    {
      path: 'dataentry/propertymaster',
    component: PropertymasterComponent},

    {
      path: 'dataentry/unitmaster',
    component: LessorunitmasterComponent},

    

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LessorrentRoutingModule { }
