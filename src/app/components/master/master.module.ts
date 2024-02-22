import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';
import { MasterComponent } from './master.component';
import { BreadcrumbComponent } from 'src/app/layout/breadcrumb/breadcrumb.component';

// import { ActionpanelComponent } from 'src/app/layout/actionpanel/actionpanel.component';
// import { SaveComponent } from 'src/app/layout/actionbuttons/save/save.component';


@NgModule({
  declarations: [
    MasterComponent,
    BreadcrumbComponent
    // ActionpanelComponent,
    // SaveComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    
  ]
 
})
export class MasterModule { }
