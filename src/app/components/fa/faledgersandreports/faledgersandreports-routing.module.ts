import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsmepartiesreportComponent } from './reports1/msmepartiesreport/msmepartiesreport.component';
import { PendingintercompanytransComponent } from './reports/pendingintercompanytrans/pendingintercompanytrans.component';

const routes: Routes = [
  {
    path: 'reports1/msmepartiesreport',
    component: MsmepartiesreportComponent},

    // 20/02/24  RS   --Start
    {
      path: 'reports/pendingintercompanytrans.',
      component: PendingintercompanytransComponent}
  // 20/02/24  RS   --End

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaledgersandreportsRoutingModule { }
