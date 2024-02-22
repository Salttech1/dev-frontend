import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonthlyitsummaryComponent } from './reports/monthlyitsummary/monthlyitsummary.component';
import { MonthlyitsummaryhorizontalComponent } from './reports/monthlyitsummaryhorizontal/monthlyitsummaryhorizontal.component';
import { SettledholdemployeeComponent } from './reports/settledholdemployee/settledholdemployee.component';
import { TdsauditsummaryComponent } from './reports/tdsauditsummary/tdsauditsummary.component';
import { TdssummaryComponent } from './reports/tdssummary/tdssummary.component';

const routes: Routes = [

  {
    path: 'reports/tdssummary', 
    component: TdssummaryComponent,
    title: 'Companywise TDS Statement for the Month'
  },
  {
    path: 'reports/monthlyitsummary', 
    component: MonthlyitsummaryComponent,
    title: 'Monthly Income Tax Summary'
  },
  {
    path: 'reports/tdsauditsummary', 
    component: TdsauditsummaryComponent,
    title: 'Companywise TDS Statement'
  },
  {
    path: 'reports/monthlyitsummaryhorizontal', 
    component: MonthlyitsummaryhorizontalComponent,
    title: 'Companywise TDS Statement Horizontal'
  },
  {
    path: 'reports/settledholdemployee', 
    component: SettledholdemployeeComponent,
    title: 'List of Settled Hold Employees'
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncometaxRoutingModule { }
