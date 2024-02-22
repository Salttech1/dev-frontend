import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonButtonsComponent } from './buttons.component';



@NgModule({
  declarations: [
    CommonButtonsComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[CommonButtonsComponent]
})
export class ButtonsModule { }
