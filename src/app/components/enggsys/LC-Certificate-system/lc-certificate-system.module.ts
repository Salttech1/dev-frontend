import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F1Module } from 'src/app/shared/generic/f1/f1.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LcCertificateSystemRoutingModule } from './lc-certificate-system-routing.module';
import { LoaderModule } from '../../common/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonsModule } from '../../common/buttons/buttons.module';
import { PendinglccertificatesComponent } from './Reports/pendinglccertificates/pendinglccertificates.component';
import { LcCertificateEntryComponent } from './data-entry/lc-certificate-entry/lc-certificate-entry.component';
import { LcPaymentDetailsEntryComponent } from './data-entry/lc-payment-details-entry/lc-payment-details-entry.component';
import { LcAuthorisationEntryComponent } from './data-entry/lc-authorisation-entry/lc-authorisation-entry.component';
import { LcInspectionComponent } from './data-entry/lc-inspection/lc-inspection.component';
import { LcCertificateEnquiryComponent } from './enquiry/lc-certificate-enquiry/lc-certificate-enquiry.component';
import { LcAuthorisationEnquiryComponent } from './enquiry/lc-authorisation-enquiry/lc-authorisation-enquiry.component';
import { PendinglcauthorisationsComponent } from './Reports/pendinglcauthorisations/pendinglcauthorisations.component';
import { LcauthorisationlistComponent } from './Reports/lcauthorisationlist/lcauthorisationlist.component';
import { LccertificatelistComponent } from './Reports/lccertificatelist/lccertificatelist.component';
import { LccertificatelistsgrformatComponent } from './Reports/lccertificatelistsgrformat/lccertificatelistsgrformat.component';
import { LcauthorisationlistsgrformatComponent } from './Reports/lcauthorisationlistsgrformat/lcauthorisationlistsgrformat.component';
import { LcstatusreportComponent } from './Reports/lcstatusreport/lcstatusreport.component';
import { LcTtEpcgreportComponent } from './Reports/lc-tt-epcgreport/lc-tt-epcgreport.component';
import { LcstatusreportAuthComponent } from './Reports/lcstatusreport-auth/lcstatusreport-auth.component';
import { LcstatusreportCertComponent } from './Reports/lcstatusreport-cert/lcstatusreport-cert.component';
import { LcauthorisationprintingComponent } from './Reports/lcauthorisationprinting/lcauthorisationprinting.component';
import { LccertificateprintingComponent } from './Reports/lccertificateprinting/lccertificateprinting.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    PendinglccertificatesComponent,
    LcCertificateEntryComponent,
    LcPaymentDetailsEntryComponent,
    LcAuthorisationEntryComponent,
    LcInspectionComponent,
    LcCertificateEnquiryComponent,
    LcAuthorisationEnquiryComponent,
    PendinglcauthorisationsComponent,
    LcauthorisationlistComponent,
    LccertificatelistComponent,
    LccertificatelistsgrformatComponent,
    LcauthorisationlistsgrformatComponent,
    LcstatusreportComponent,
    LcTtEpcgreportComponent,
    LcstatusreportAuthComponent,
    LcstatusreportCertComponent,
    LcauthorisationprintingComponent,
    LccertificateprintingComponent
  ],
  imports: [
    CommonModule,
    LcCertificateSystemRoutingModule,
    F1Module,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    DataTablesModule,
    MatNativeDateModule,
    LoaderModule,
    SharedModule,
    ButtonsModule,
    PdfViewerModule
  ],
})
export class LcCertificateSystemModule {}
