import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChequeprintingComponent } from './reports/chequeprinting/chequeprinting.component';
import { NotreconciledtransactionsreportComponent } from './reports/notreconciledtransactionsreport/notreconciledtransactionsreport.component';

const routes: Routes = [
  {
    path: 'reports/notreconciledtransactionsreport',
    component: NotreconciledtransactionsreportComponent,
  },
  {
    path: 'reports/chequeprinting',
    component: ChequeprintingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankingtransactionsRoutingModule {}
