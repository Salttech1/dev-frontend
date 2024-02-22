import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'bookings',  
    loadChildren:() => import(`../../components/sales/bookings/bookings.module`).then(m => m.BookingsModule),
    data:{
      title:'Bookings'
    }
  },
  {
    path:'collections',
    loadChildren:() => import(`../../components/sales/collections/collections.module`).then(m => m.CollectionsModule),
    // data:{
    //   title:'collections'
    // }
  },
  {
    path:'auxiliary',
    loadChildren:() => import(`../../components/sales/auxiliary/auxiliary.module`).then(m => m.AuxiliaryModule),
    data:{
      title:'Auxiliary'
    }
  },
  {
    path:'outgoing',
    loadChildren:() => import(`../../components/sales/outgoing/outgoing.module`).then(m => m.OutgoingModule),
    data:{
      title:'outgoing'
    }
  },
  {
    path:'infra',
    loadChildren:() => import(`../../components/sales/infra/infra.module`).then(m => m.InfraModule),
    data:{
      title:'infra'
    }
  },
  {
    path:'leaserent',
    loadChildren:() => import(`../../components/sales/leaserent/leaserent.module`).then(m => m.LeaserentModule),
    data:{
      title:'leaserent'
    }
  },

  {
    path:'lessorrent',
    loadChildren:() => import(`../../components/sales/lessorrent/lessorrent.module`).then(m => m.LessorrentModule),
    data:{
      title:'lessorrent'
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
