import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminexpRoutingModule } from './adminexp-routing.module';
import { OverheadsModule } from './overheads/overheads.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AdminexpRoutingModule,
    OverheadsModule
  ]
})
export class AdminexpModule { }
