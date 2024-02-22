import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerBillEntryeditComponent } from './data-entry/consumer-bill-entryedit/consumer-bill-entryedit.component';
import { ConsumerDepositEntryeditComponent } from './data-entry/consumer-deposit-entryedit/consumer-deposit-entryedit.component';
import { ConsumerDetailEntryeditComponent } from './data-entry/consumer-detail-entryedit/consumer-detail-entryedit.component';
import { LocationMasterEntryeditComponent } from './data-entry/location-master-entryedit/location-master-entryedit.component';
import {VacantFlatBillEntryComponent} from './data-entry/vacant-flat-bill-entry/vacant-flat-bill-entry.component';
import { ConsumerAccountInquiryComponent } from './reports/consumer-account-inquiry/consumer-account-inquiry.component';
import { ConsumerBillDepositReportComponent } from './reports/consumer-bill-deposit-report/consumer-bill-deposit-report.component';
import { ConsumerBillReportComponent } from './reports/consumer-bill-report/consumer-bill-report.component';
//import { TestDynamicMultiplecontrolComponent } from './data-entry/test-dynamic-multiplecontrol/test-dynamic-multiplecontrol.component';
const routes: Routes = [
  
  {
    path: 'dataentry/consumerbillentryedit',
    component: ConsumerBillEntryeditComponent,
    title: 'Consumer Bill Entry Edit'
  },
  {
    path: 'dataentry/vacantflatbillentry',
    component: VacantFlatBillEntryComponent,
    title: 'Vacant Flat Entry Edit' 
  },
  {
    path: 'dataentry/consumerdetailentryedit',
    component: ConsumerDetailEntryeditComponent,
    title: 'Consumer Detail Entry Edit' 
  },
  {
    path: 'dataentry/locationmasterentryedit',
    component: LocationMasterEntryeditComponent,
    title: 'Location Entry Edit' 
  },

  {
    path: 'dataentry/consumerdepositentryedit',
    component: ConsumerDepositEntryeditComponent,
    title: 'Consumer Deposite Entry Edit' 
  },

  {
    path: 'reports/consumerbillreport',
    component: ConsumerBillReportComponent,
    title: 'Consumer Bill Report' 
  },
  {
    path: 'reports/consumerbilldepositreport',
    component: ConsumerBillDepositReportComponent,
    title: 'Consumer Bill Deposite Report' 
  },
  {
    path: 'reports/consumeraccountinquiry',
    component: ConsumerAccountInquiryComponent,
    title: 'Consumer Account Enquiry' 
  },
  // {
  //   path: 'san',
  //   component: TestDynamicMultiplecontrolComponent,
  //   title: 'Consumer Account Enquiry' 
  // },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverheadsRoutingModule { }
