import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../common/loader/loader.module';
import { VehicleExpensesRoutingModule } from './vehicle-expenses-routing.module';
import { VehicleDetailsEntryComponent } from './data-entry/vehicle-details-entry/vehicle-details-entry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { SharedModule } from 'src/app/shared/shared.module';
import { VehicleexpenseWorkcodewiseComponent } from './reports/vehicleexpense-workcodewise/vehicleexpense-workcodewise.component';
import { VehicleexpenseDetailReportComponent } from './reports/vehicleexpense-detail-report/vehicleexpense-detail-report.component';
import { VehicleHistoryComponent } from './reports/vehicle-history/vehicle-history.component';
import { VehiclewiseInsuranceandTaxExpirydateComponent } from './reports/vehiclewise-insuranceand-tax-expirydate/vehiclewise-insuranceand-tax-expirydate.component';
import { MonthwiseDetailVehicleExpenseReportComponent } from './reports/monthwise-detail-vehicle-expense-report/monthwise-detail-vehicle-expense-report.component';
import { ExcessKmRunReportComponent } from './reports/excess-km-run-report/excess-km-run-report.component';
import { VehicleListComponent } from './reports/vehicle-list/vehicle-list.component';
import { PartywiseExpenseReportComponent } from './reports/partywise-expense-report/partywise-expense-report.component';
import { VehicleReportsComponent } from './reports/vehicle-reports/vehicle-reports.component';
import { VehicleMeterReadingReportComponent } from './reports/vehicle-meter-reading-report/vehicle-meter-reading-report.component';
import { VehicleAverageReportComponent } from './reports/vehicle-average-report/vehicle-average-report.component';
import { InsuranceMaintenanceExpiryReportComponent } from './reports/insurance-maintenance-expiry-report/insurance-maintenance-expiry-report.component';
import { VehicleMaintenanceExpensesGstComponent } from './data-entry/vehicle-maintenance-expenses-gst/vehicle-maintenance-expenses-gst.component';
import { VehexpcertPrintingComponent } from './reports/vehexpcert-printing/vehexpcert-printing.component';
import { VehicleCertCancellationComponent } from './data-entry/vehicle-cert-cancellation/vehicle-cert-cancellation.component';


@NgModule({
  declarations: [
    VehicleDetailsEntryComponent,
    VehicleexpenseWorkcodewiseComponent,
    VehicleexpenseDetailReportComponent,
    VehicleHistoryComponent,
    VehiclewiseInsuranceandTaxExpirydateComponent,
    MonthwiseDetailVehicleExpenseReportComponent,
    ExcessKmRunReportComponent,
    VehicleListComponent,
    PartywiseExpenseReportComponent,
    VehicleReportsComponent,
    VehicleMeterReadingReportComponent,
    VehicleAverageReportComponent,
    InsuranceMaintenanceExpiryReportComponent,
    VehicleMaintenanceExpensesGstComponent,
    VehexpcertPrintingComponent,
    VehicleCertCancellationComponent,
  ],
  imports: [
    CommonModule,
    VehicleExpensesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    F1Module,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule,
    SharedModule, LoaderModule
  ]
})
export class VehicleExpensesModule { }
