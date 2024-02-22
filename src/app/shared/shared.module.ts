import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Date1Directive } from './directive/date1.directive';
import { F1Directive } from './directive/f1.directive';
import { DecimalPointDirective } from './directive/decimal-point-directive';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { F1PopupComponent } from './generic/f1-popup/f1-popup.component';
import { UpperCaseDirective } from './directive/upper-case.directive';
import { YearmonthformatdirectiveDirective } from 'src/app/shared/directive/yearmonthformatdirective.directive';
import { YearDirective } from './directive/year.directive';
import { MonthyearDirective } from './directive/monthyear.directive';
import { CommonAutoFocusDirective } from './directive/common-auto-focus.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { PercentageDirective } from './directive/percentage.directive';
import { CodeHelpComponent } from './generic/code-help/code-help.component';
import { SharedRoutingModule } from './shared-routing.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LoaderModule } from '../components/common/loader/loader.module';
import { FavouriteComponent } from './generic/favourite/favourite.component';
import { PipesPipe } from './pipe/pipes.pipe';
import { CellNaviDirective } from './directive/cell-navi.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [
    Date1Directive,
    F1Directive,
    F1PopupComponent,
    UpperCaseDirective,
    YearmonthformatdirectiveDirective,
    YearDirective,
    MonthyearDirective,
    CommonAutoFocusDirective,
    PercentageDirective,
    DecimalPointDirective,
    CodeHelpComponent,
    FavouriteComponent,
    PipesPipe,
    CellNaviDirective,
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatDialogModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    NgSelectModule,
    SharedRoutingModule,
    LoaderModule,
    DragDropModule
  ],
  exports: [
    Date1Directive,
    F1Directive,
    CellNaviDirective,
    F1PopupComponent,
    UpperCaseDirective,
    YearmonthformatdirectiveDirective,
    YearDirective,
    MonthyearDirective,
    CommonAutoFocusDirective,
    NgSelectModule,
    PercentageDirective,
    DecimalPointDirective,
    PipesPipe,
  ],
  providers: [PipesPipe],
})
export class SharedModule {}
