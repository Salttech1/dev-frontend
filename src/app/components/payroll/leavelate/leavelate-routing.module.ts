import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LatereportdaysComponent } from './reports/latereportdays/latereportdays.component';
import { LatereportmonthsComponent } from './reports/latereportmonths/latereportmonths.component';
import { LeaveexcessdaysComponent } from './reports/leaveexcessdays/leaveexcessdays.component';
import { LeavereportdaysComponent } from './reports/leavereportdays/leavereportdays.component';
import { LeavereportmonthsComponent } from './reports/leavereportmonths/leavereportmonths.component';


const routes: Routes = [
  
  {
    path: 'reports/leavereportmonths', 
    component: LeavereportmonthsComponent,
    title: 'Leave Report (Months)'
  },

  {
    path: 'reports/leavereportdays', 
    component: LeavereportdaysComponent,
    title: 'Leave Statement Summary (In Days)'
  },  

  {
    path: 'reports/excessleavereport', 
    component: LeaveexcessdaysComponent,
    title: 'Excess Leave Statement (In Days)'
  },  

  {
    path: 'reports/latereportdays', 
    component: LatereportdaysComponent,
    title: 'Late Coming Report (Summary)'
  },  

  {
    path: 'reports/latereportmonths', 
    component: LatereportmonthsComponent,
    title: 'Late Coming Report (Summary)'
  },  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavelateRoutingModule { }
