import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterestChequeDataEntryComponent } from './interest-cheque-data-entry/interest-cheque-data-entry.component';
import { InteresttaxentryComponent } from './interesttaxentry/interesttaxentry.component';
import { DepositrenewalglentryComponent } from './depositrenewalglentry/depositrenewalglentry.component';
import { InterestcalculationComponent } from './interestcalculation/interestcalculation.component';
import { InterestchequeprintingComponent } from './interestchequeprinting/interestchequeprinting.component';
import { Form15hgreturnsComponent } from './form15hgreturns/form15hgreturns.component';
import { Form15hgentryeditComponent } from './form15hgentryedit/form15hgentryedit.component';
import { YearendprocessingComponent } from './yearendprocessing/yearendprocessing.component';
import { DepositdischargeComponent } from './depositdischarge/depositdischarge.component';
import { DepositordetailsentryeditComponent } from './depositordetailsentryedit/depositordetailsentryedit.component';
import { DepositdetailsentryeditComponent } from './depositdetailsentryedit/depositdetailsentryedit.component';
import { DepositrenewalsComponent } from './depositrenewals/depositrenewals.component';
import { DeposittransferComponent } from './deposittransfer/deposittransfer.component';

const routes: Routes = [
  {
    path: 'interestchequedataentry',
    component: InterestChequeDataEntryComponent,
    title: 'Interest Cheque Data Entry',
  },
  {
    path: 'interest-taxentry',
    component: InteresttaxentryComponent,
    title: 'Interest-Tax Entry',
  },
  {
    path: 'depositrenewalglentry',
    component: DepositrenewalglentryComponent,
    data: { title: 'depositrenewalGlEntry' },
  },
  {
    path: 'interestcalculation',
    component: InterestcalculationComponent,
    data: { title: 'InterestcalculationComponent' },
  },
  {
    path: 'interestchequeprinting',
    component: InterestchequeprintingComponent,
    data: { title: 'Interest Cheque Printing' },
  },
  {
    path: 'form15h15greturns',
    component: Form15hgreturnsComponent,
    data: { title: 'Form 15H/G Returns' },
  },
  {
    path: 'form15h15gentryedit',
    component: Form15hgentryeditComponent,
    data: { title: 'Form 15H/G Entry Edit' },
  },
  {
    path: 'yearendprocessing',
    component: YearendprocessingComponent,
    data: { title: 'yearendprocessing' },
  },
  {
    path: 'depositdischarge',
    component: DepositdischargeComponent,
    data: { title: 'InterestcalculationComponent' },
  },
  {
    path: 'depositordetailsentryedit',
    component: DepositordetailsentryeditComponent,
    data: { title: 'Depositor Details Entry Edit' },
  },
  {
    path: 'depositdetailsentryedit',
    component: DepositdetailsentryeditComponent,
    data: { title: 'Deposit Details Entry Edit' },
  },
  {
    path: 'depositrenewals',
    component: DepositrenewalsComponent,
    data: { title: 'Deposit Renewals' },
  },
  {
    path: 'deposittransfer',
    component: DeposittransferComponent,
    data: { title: 'Deposit Transfer' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataentryRoutingModule {}
