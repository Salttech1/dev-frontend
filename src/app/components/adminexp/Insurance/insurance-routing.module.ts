import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyendorsementmasterentryComponent } from './data-entry/policyendorsementmaster-entry/policyendorsementmaster-entry.component';
import { PolicyMasterComponent } from './data-entry/policy-master/policy-master.component';
import { PolicyMaturingLastDayComponent } from './reports/policy-maturing-last-day/policy-maturing-last-day.component';
import { PolicyMaturingUptoTodayComponent } from './reports/policy-maturing-upto-today/policy-maturing-upto-today.component';
import { PolicyProfileComponent } from './reports/policy-profile/policy-profile.component';
import { PolicySummaryComponent } from './reports/policy-summary/policy-summary.component';
import { PolicyAssetDetailsComponent } from './reports/policy-asset-details/policy-asset-details.component';

const routes: Routes = [
  {
    path: 'dataentry/policyendorsementmaster',
    component: PolicyendorsementmasterentryComponent, //ng
  },

  {
    path: 'dataentry/policymaster',
    component: PolicyMasterComponent, //sp
  },
  {
    path: 'reports/policymaturingreportuptolastdayofcurrentmonth',
    component: PolicyMaturingLastDayComponent,
    title: 'Policy Maturing Report upto last day of current month',
  },
  {
    path: 'reports/policymaturingreportuptotoday',
    component: PolicyMaturingUptoTodayComponent,
    title: 'Policy Maturing Report upto Today',
  },
  {
    path: 'reports/policyprofile',
    component: PolicyProfileComponent,
    title: 'Policy Profile',
  },
  {
    path: 'reports/policysummaryreport',
    component: PolicySummaryComponent,
    title: 'Policy Summary Report',
  },

  {
    path: 'reports/policyassetitemsinsureddetails',
    component: PolicyAssetDetailsComponent,
    title: 'Policy Asset Items Insured Details',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsuranceRoutingModule {}
