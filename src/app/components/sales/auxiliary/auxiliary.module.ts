import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuxiliaryRoutingModule } from './auxiliary-routing.module';
import { AuxiliaryReceiptEntryEditGstFirstComponent } from './data-entry/auxiliary-receipt-entry-edit-gst-first/auxiliary-receipt-entry-edit-gst-first.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AuxiliaryReceiptComponent } from './data-entry/auxiliary-receipt/auxiliary-receipt.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ButtonsModule } from '../../common/buttons/buttons.module';
import { BillGenerationComponent } from './reports/bill-generation/bill-generation.component';
import { ReceiptReportComponent } from './reports/receipt-report/receipt-report.component';
import { LoaderModule } from "../../common/loader/loader.module";
import { PdfViewerModule } from 'ng2-pdf-viewer';




@NgModule({
    declarations: [
        AuxiliaryReceiptEntryEditGstFirstComponent,
        AuxiliaryReceiptComponent,
        BillGenerationComponent,
        ReceiptReportComponent
    ],
    imports: [
        CommonModule,
        AuxiliaryRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatIconModule,
        FormsModule,
        MatButtonModule,
        ButtonsModule,
        LoaderModule,
        PdfViewerModule
    ]
})
export class AuxiliaryModule { }
