import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderRoutingModule } from './loader-routing.module';
import { LoaderComponent } from './loader.component';
import { WsdemoComponent } from 'src/app/shared/generic/wsdemo/wsdemo.component';


@NgModule({
  declarations: [
    LoaderComponent,
    WsdemoComponent
  ],
  imports: [
    CommonModule,
    LoaderRoutingModule
  ],
  exports:[LoaderComponent]
})
export class LoaderModule { }
