import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path:'projectbuildingdetails',  
  loadChildren:() => import(`../../components/arch/projbldg/projbldg.module`).then(m => m.ProjbldgModule),
  data:{
    title:'Projbldg'
  }
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchRoutingModule { }
