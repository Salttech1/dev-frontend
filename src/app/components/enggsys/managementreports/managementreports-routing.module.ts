import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmenttaxreportComponent } from './assessmenttaxreport/assessmenttaxreport.component';
import { BankguarreportComponent } from './bankguarreport/bankguarreport.component';
import { BldgwiseannualexpensesreportComponent } from './bldgwiseannualexpensesreport/bldgwiseannualexpensesreport.component';
import { BldgwiseincrementalexpensesreportComponent } from './bldgwiseincrementalexpensesreport/bldgwiseincrementalexpensesreport.component';
import { BoqreportComponent } from './boqreport/boqreport.component';
import { BuildingwiseexpensesreportComponent } from './buildingwiseexpensesreport/buildingwiseexpensesreport.component';
import { CertauthoutstandingreportComponent } from './certauthoutstandingreport/certauthoutstandingreport.component';
import { ContractsummaryreportComponent } from './contractsummaryreport/contractsummaryreport.component';
import { GroupwisecompositereportComponent } from './groupwisecompositereport/groupwisecompositereport.component';
import { LogicnoteboqvendorComponent } from './logicnoteboqvendor/logicnoteboqvendor.component';
import { MonthlygroupexpensessummaryComponent } from './monthlygroupexpensessummary/monthlygroupexpensessummary.component';
import { MonthwisecertAuthDetailComponent } from './monthwisecert-auth-detail/monthwisecert-auth-detail.component';

const routes: Routes = [
  {
    path: 'monthwisecert.auth.detail',
    component: MonthwisecertAuthDetailComponent
  },
  {
    path: 'bankguarreport',
    component: BankguarreportComponent
  },
  {
    path: 'certauthoutstandingreport',
    component: CertauthoutstandingreportComponent
  },
  {
    path: 'contractsummaryreport',
    component: ContractsummaryreportComponent
  },
  {
    path: 'groupwisecompositereport',
    component: GroupwisecompositereportComponent
  },
  {
    path: 'logicnoteboqvendor',
    component: LogicnoteboqvendorComponent
  },
  {
    path: 'bldgwiseannualexpensesreport',
    component: BldgwiseannualexpensesreportComponent
  },

  {
    path: 'boqreport',
    component: BoqreportComponent
  },

  {
    path: 'assessmenttaxreport',
    component: AssessmenttaxreportComponent
  },
  {
    path: 'buildingwiseexpensesreport',
    component: BuildingwiseexpensesreportComponent
  },
  {
    path: 'monthlygroupexpensessummary',
    component: MonthlygroupexpensessummaryComponent
  },
  {
    path: 'bldgwiseincrementalexpensesreport',
    component: BldgwiseincrementalexpensesreportComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementreportsRoutingModule { }
