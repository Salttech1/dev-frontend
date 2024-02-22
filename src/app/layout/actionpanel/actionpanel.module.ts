import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionpanelComponent } from './actionpanel.component';
import { SaveComponent } from '../actionbuttons/save/save.component';
import { BackComponent } from '../actionbuttons/back/back.component';
import { DeleteComponent } from '../actionbuttons/delete/delete.component';
import { AddComponent } from '../actionbuttons/add/add.component';
import { ListComponent } from '../actionbuttons/list/list.component';
import { PrintComponent } from '../actionbuttons/print/print.component';
import { ExportComponent } from '../actionbuttons/export/export.component';
import { ResetComponent } from '../actionbuttons/reset/reset.component';
import { NewdepositComponent } from '../actionbuttons/newdeposit/newdeposit.component';
import { RetrieveComponent } from '../actionbuttons/retrieve/retrieve.component';
import { CalcinterestComponent } from '../actionbuttons/calcinterest/calcinterest.component';

@NgModule({
  declarations: [
    ActionpanelComponent,
    SaveComponent,
    BackComponent,
    DeleteComponent,
    AddComponent,
    ListComponent,
    PrintComponent,
    ExportComponent,
    ResetComponent,
    NewdepositComponent,
    RetrieveComponent,
    CalcinterestComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ActionpanelComponent
  ]
})
export class ActionpanelModule { }
