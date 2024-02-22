import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'bankreconciliation',
    loadChildren: () =>
      import(
        `../../components/fa/bankreconciliation/bankreconciliation.module`
      ).then((m) => m.BankreconciliationModule),
  },
  {
    path: 'bankingtransactions',
    loadChildren: () =>
      import(
        '../../components/fa/bankingtransactions/bankingtransactions.module'
      ).then((m) => m.BankingtransactionsModule),
  },
  {
    path: 'faledgersandreports',
    loadChildren: () =>
      import(
        '../../components/fa/faledgersandreports/faledgersandreports.module'
      ).then((m) => m.FaledgersandreportsModule),
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaRoutingModule {}
