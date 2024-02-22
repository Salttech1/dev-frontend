import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillprintingComponent } from './reports/billprinting/billprinting.component';
import { DefaulterslistComponent } from './reports/defaulterslist/defaulterslist.component';
import { PeriodWisecollectionreportComponent } from './reports/period-wisecollectionreport/period-wisecollectionreport.component';
import { ReceiptvoucherreprintComponent } from './reports/receiptvoucherreprint/receiptvoucherreprint.component';

const routes: Routes = [

  {
    path: 'reports/defaulterslist',
    component: DefaulterslistComponent
  },
  {
    path: 'reports/period-wisecollectionreport',
    component: PeriodWisecollectionreportComponent
  },
  {
    path: 'reports/receiptvoucherreprint',
    component: ReceiptvoucherreprintComponent
  },

  {
    path: 'reports/billprinting',
    component:  BillprintingComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaserentRoutingModule { 

}
