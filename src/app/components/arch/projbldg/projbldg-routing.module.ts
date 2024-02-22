import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuildingEntryComponent } from './data-entry/building-entry/building-entry.component';
import { ProjectEntryComponent } from './data-entry/project-entry/project-entry.component';   //imported project entry component (sp)
import { FlatAreaByBuildingComponent } from './reports/flat-area-by-building/flat-area-by-building.component';

const routes: Routes = [
{
  path: 'dataentry/buildingdetailsentryedit', component: BuildingEntryComponent
},

{
  path: 'dataentry/projectdetailsentryedit', component: ProjectEntryComponent    //sp
},

{
  path: 'reports/flatareabybuilding', component: FlatAreaByBuildingComponent    //sp
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjbldgRoutingModule { }
