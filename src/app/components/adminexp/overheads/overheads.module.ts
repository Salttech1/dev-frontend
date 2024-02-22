import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { OverheadsRoutingModule } from './overheads-routing.module';
import { ConsumerBillEntryeditComponent } from './data-entry/consumer-bill-entryedit/consumer-bill-entryedit.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { DataTablesModule } from 'angular-datatables';
import { VacantFlatBillEntryComponent } from './data-entry/vacant-flat-bill-entry/vacant-flat-bill-entry.component';
import { ConsumerBillReportComponent } from './reports/consumer-bill-report/consumer-bill-report.component';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConsumerBillDepositReportComponent } from './reports/consumer-bill-deposit-report/consumer-bill-deposit-report.component';
import { ConsumerAccountInquiryComponent } from './reports/consumer-account-inquiry/consumer-account-inquiry.component';
import { ConsumerDetailEntryeditComponent } from './data-entry/consumer-detail-entryedit/consumer-detail-entryedit.component';
import { ConsumerDepositEntryeditComponent } from './data-entry/consumer-deposit-entryedit/consumer-deposit-entryedit.component';
import { LocationMasterEntryeditComponent } from './data-entry/location-master-entryedit/location-master-entryedit.component';
//import {TestDynamicMultiplecontrolComponent} from './data-entry/test-dynamic-multiplecontrol/test-dynamic-multiplecontrol.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';



@NgModule({
  declarations: [
    ConsumerBillEntryeditComponent,
    VacantFlatBillEntryComponent,
    ConsumerBillReportComponent,
    ConsumerBillDepositReportComponent,
    ConsumerAccountInquiryComponent,
    ConsumerDetailEntryeditComponent,
    ConsumerDepositEntryeditComponent,
    LocationMasterEntryeditComponent,
    //TestDynamicMultiplecontrolComponent,
    
  ],
  imports: [
    CommonModule,
    OverheadsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    F1Module,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule,
    DataTablesModule,
    LoaderModule,
    SharedModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
        
    
  ],
})
export class OverheadsModule {}
