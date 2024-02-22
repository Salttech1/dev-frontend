import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleDetailsEntryComponent } from './data-entry/vehicle-details-entry/vehicle-details-entry.component';
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

const routes: Routes = [
  {
    path: 'dataentry/vehiclepurchaseentryedit', 
    component: VehicleDetailsEntryComponent,
    title: 'Vehicle Purchase Entry/Edit'
  },
  {
    path: 'dataentry/vehiclemaint.expensesgst', 
    component: VehicleMaintenanceExpensesGstComponent,
    title: 'Vehicle Maintenance Expenses GST'
  },

  {
    path: 'reports/vehicleexpenseworkcodewise', 
    component: VehicleexpenseWorkcodewiseComponent,
    title: 'Vehicle Expense Workcodewise'
  },
  {
    path: 'reports/vehicleexpensesdetailreport', 
    component: VehicleexpenseDetailReportComponent,
    title: 'Vehicle Expense Detail Report'
  },
  {
    path: 'reports/vehiclehistory', 
    component: VehicleHistoryComponent,
    title: 'Vehicle History'
  },
  {
    path: 'reports/vehiclewiseinsuranceandtaxexpirydate', 
    component: VehiclewiseInsuranceandTaxExpirydateComponent,
    title: 'Vehiclewise Insurance Tax Expiry Date'
  },
  {
    path: 'reports/monthwisedetailvehicleexpensereport', 
    component: MonthwiseDetailVehicleExpenseReportComponent,
    title: 'Monthwise Expenditure Details Statement'
  },
  {
    path: 'reports/excesskmsrunreport', 
    component: ExcessKmRunReportComponent,
    title: 'Excess Kms Run Report'
  },
  {
    path: 'reports/vehiclelist', 
    component: VehicleListComponent,
    title: 'Vehicle List'
  }, 
  {
    path: 'reports/partywiseexpensereport', 
    component: PartywiseExpenseReportComponent,
    title: 'Partywise Expsense Report'
  }, 
  {
    path: 'reports/vehiclehpareport', 
    component: VehicleReportsComponent,
    title: 'Vehicle HPA Report'
  }, 
  {
    path: 'reports/vehicledisposalreport', 
    component: VehicleReportsComponent,
    title: 'Vehicle Disposal Report'
  }, 
  {
    path: 'reports/vehiclebatteryrecords', 
    component: VehicleReportsComponent,
    title: 'Vehicle Battery Report'
  }, 
  {
    path: 'reports/vehiclemeterreadingreport', 
    component: VehicleMeterReadingReportComponent,
    title: 'Vehicle Meter Reading Report'
  }, 
  {
    path: 'reports/vehicleaveragereport', 
    component: VehicleAverageReportComponent,
    title: 'Vehicle Average Report'
  }, 
  {
    path: 'reports/insurancemaintenanceexpiryreport', 
    component: InsuranceMaintenanceExpiryReportComponent,
    title: 'Insurance Maintenance Expiry Report'
  }, 
  {
    path: 'reports/vehicleexpensecertificateprintinggst', 
    component: VehexpcertPrintingComponent,
    title: 'Vehicle Certificate Printing'
  }, 
  {
    path: 'dataentry/vehicleexpensecertificatecancellation', 
    component: VehicleCertCancellationComponent,
    title: 'Vehicle Certificate Cancellation'
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleExpensesRoutingModule { }
