import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path:'overheads',  
    loadChildren:() => import(`../../components/adminexp/overheads/overheads.module`).then(m => m.OverheadsModule),
    data:{
      title:'overheads'
    }
  },
  {
    path:'vehicleexpenses',  
    loadChildren:() => import(`../../components/adminexp/vehicle-expenses/vehicle-expenses.module`).then(m => m.VehicleExpensesModule),
    data:{
      title:'overheads'
    }
  },
  {
    path:'insurance',  
    loadChildren:() => import(`../../components/adminexp/Insurance/insurance.module`).then(m => m.InsuranceModule),
  },
  {
    path:'billing',  
    loadChildren:() => import(`../../components/adminexp/billing/billing.module`).then(m => m.BillingModule),
  },
  {
    path:'consultantpayments',  
    loadChildren:() => import(`../../components/adminexp/consultantpayments/consultantpayments.module`).then(m => m.ConsultantpaymentsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminexpRoutingModule { }
