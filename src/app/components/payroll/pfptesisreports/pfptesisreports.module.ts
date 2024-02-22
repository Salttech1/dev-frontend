import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfptesisreportsRoutingModule } from './pfptesisreports-routing.module';
import { PfreportComponent } from './reports/pfreport/pfreport.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PfregisterComponent } from './reports/pfregister/pfregister.component';
import { PfstatisticsComponent } from './reports/pfstatistics/pfstatistics.component';
import { Form6AComponent } from './reports/form6-a/form6-a.component';
import { Form3AComponent } from './reports/form3-a/form3-a.component';
import { PtslabmonthlyreportComponent } from './reports/ptslabmonthlyreport/ptslabmonthlyreport.component';
import { AdditionalesicregisterreportComponent } from './reports/additionalesicregisterreport/additionalesicregisterreport.component';
import { PfEdlisreportComponent } from './reports/pf-edlisreport/pf-edlisreport.component';
import { Form3abefore2004Component } from './reports/form3abefore2004/form3abefore2004.component';
import { EsicregisterComponent } from './reports/esicregister/esicregister.component';
import { Esicform5Component } from './reports/esicform5/esicform5.component';
import { EsicreturnsComponent } from './reports/esicreturns/esicreturns.component';
import { CreatemonthlypffileComponent } from './reports/createmonthlypffile/createmonthlypffile.component';
import { EmployeewiseforptExcelComponent } from './reports/employeewiseforpt-excel/employeewiseforpt-excel.component';


@NgModule({
  declarations: [
    PfreportComponent,
    PfregisterComponent,
    PfstatisticsComponent,
    Form6AComponent,
    Form3AComponent,
    PtslabmonthlyreportComponent,
    AdditionalesicregisterreportComponent,
    PfEdlisreportComponent,
    Form3abefore2004Component,
    EsicregisterComponent,
    Esicform5Component,
    EsicreturnsComponent,
    CreatemonthlypffileComponent,
    EmployeewiseforptExcelComponent
  ],
  imports: [
    CommonModule,
    PfptesisreportsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule
  ]


})
export class PfptesisreportsModule { }
