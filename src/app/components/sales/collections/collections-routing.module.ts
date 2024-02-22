import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionchallanreportComponent } from './reports/collectionchallanreport/collectionchallanreport.component';
import { CollectioninvoicereportComponent } from './reports/collectioninvoicereport/collectioninvoicereport.component';
import { CollectionreceiptreprintComponent } from './reports/collectionreceiptreprint/collectionreceiptreprint.component';
import { CollectionsummaryforpossessionComponent } from './reports/collectionsummaryforpossession/collectionsummaryforpossession.component';
import { DinshawcollectionreportComponent } from './reports/dinshawcollectionreport/dinshawcollectionreport.component';
import { FlatdetailsComponent } from './reports/flatdetails/flatdetails.component';
import { FuturecollectionreportComponent } from './reports/futurecollectionreport/futurecollectionreport.component';
import { RecoverystatementComponent } from './reports/recoverystatement/recoverystatement.component';

const routes: Routes = [

  {
    path: 'reports/recoverystatement',
    component: RecoverystatementComponent
  },
  {
    path: 'reports/collectionchallanreport',
    component: CollectionchallanreportComponent
  },
  {
    path: 'reports/collectioninvoicereport',
    component: CollectioninvoicereportComponent
  },
  {
    path: 'reports/futurecollectionreport',
    component: FuturecollectionreportComponent
  },
  {
    path: 'reports/flatdetails',
    component: FlatdetailsComponent
  },
  {
    path: 'reports/dinshawcollectionreport',
    component: DinshawcollectionreportComponent
  },
  {
    path: 'reports/collectionsummaryforpossession',
    component: CollectionsummaryforpossessionComponent
  },
  {
    path: 'reports/collectionreceiptreprint',
    component: CollectionreceiptreprintComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionsRoutingModule { }
