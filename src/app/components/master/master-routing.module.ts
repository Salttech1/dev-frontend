import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './master.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      {
        path: 'fd/depositentry/dataentry',
        loadChildren: () =>
          import(
            `../../components/fd/depositentry/dataentry/dataentry.module`
          ).then((m) => m.DataentryModule),
        title: 'Data Entry',
      },
      {
        path: 'fd/depositentry/reports',
        loadChildren: () =>
          import(
            `../../components/fd/depositentry/reports/reports.module`
          ).then((m) => m.ReportsModule),
        title: 'Reports',
      },
      {
        path: 'purch',
        loadChildren: () =>
          import(`../../components/purchase/purchase.module`).then(
            (m) => m.PurchaseModule
          ),
        title: 'Purchase',
      },
      {
        path: 'sales',
        loadChildren: () =>
          import(`../../components/sales/sales.module`).then(
            (m) => m.SalesModule
          ),
        title: 'Sales',
      },
      {
        path: 'adminexp',
        loadChildren: () =>
          import('../../components/adminexp/adminexp.module').then(
            (m) => m.AdminexpModule
          ),
        title: 'Adminexp',
      },
      {
        path: 'arch',
        loadChildren: () =>
          import(`../../components/arch/arch.module`).then((m) => m.ArchModule),
        title: 'Arch',
      },
      {
        path: 'enggsys',
        loadChildren: () =>
          import(`../../components/enggsys/enggsys.module`).then((m) => m.EngsysModule),
        title: 'Engg Sys',
      },
      {
        path: 'fa',
        loadChildren: () =>
          import(`../../components/fa/fa.module`).then((m) => m.FaModule),
        title: 'FA',
      },
      {
        path: 'payroll',
        loadChildren: () =>
        //src/app/components/payroll/payroll.module.ts
          import(`../../components/payroll/payroll.module`).then((m) => m.PayrollModule),
        title: 'Payroll',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
