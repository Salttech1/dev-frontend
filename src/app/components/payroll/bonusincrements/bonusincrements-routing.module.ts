import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllotmentreportComponent } from './report/allotmentreport/allotmentreport.component';
import { BonusoutgoingreportComponent } from './report/bonusoutgoingreport/bonusoutgoingreport.component';

const routes: Routes = [

  {
    path: 'report/allotmentreport', 
    component: AllotmentreportComponent,
    title: 'Bonus Allotment Report'
  },

  {
    path: 'report/bonusoutgoingreport', 
    component: BonusoutgoingreportComponent,
    title: 'Bonus Outgoing Report'
  }  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonusincrementsRoutingModule { }
