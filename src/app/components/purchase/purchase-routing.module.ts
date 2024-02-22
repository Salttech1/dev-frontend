import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'purchasebills',  
    loadChildren:() => import(`../../components/purchase/purchase-bills/purchase-bills.module`).then(m => m.PurchaseBillsModule),
  },
  {
    path:'debitnotes',  
    loadChildren:() => import(`../../components/purchase/debit-notes/debit-notes.module`).then(m => m.DebitNotesModule),
  },
  {
    path:'materialpayments',  
    loadChildren:() => import(`../../components/purchase/material-payments/material-payments.module`).then(m => m.MaterialPaymentsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
