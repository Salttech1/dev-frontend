import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LccertificatelistComponent } from './Reports/lccertificatelist/lccertificatelist.component';
import { PendinglccertificatesComponent } from './Reports/pendinglccertificates/pendinglccertificates.component';
import { LcCertificateEntryComponent } from './data-entry/lc-certificate-entry/lc-certificate-entry.component';
import { LcAuthorisationEnquiryComponent } from './enquiry/lc-authorisation-enquiry/lc-authorisation-enquiry.component';
import { LcAuthorisationEntryComponent } from './data-entry/lc-authorisation-entry/lc-authorisation-entry.component';
import { LcCertificateEnquiryComponent } from './enquiry/lc-certificate-enquiry/lc-certificate-enquiry.component';
import { LcPaymentDetailsEntryComponent } from './data-entry/lc-payment-details-entry/lc-payment-details-entry.component';
import { LcInspectionComponent } from './data-entry/lc-inspection/lc-inspection.component';
import { PendinglcauthorisationsComponent } from './Reports/pendinglcauthorisations/pendinglcauthorisations.component';
import { LcauthorisationlistComponent } from './Reports/lcauthorisationlist/lcauthorisationlist.component';
import { LccertificatelistsgrformatComponent } from './Reports/lccertificatelistsgrformat/lccertificatelistsgrformat.component';
import { LcauthorisationlistsgrformatComponent } from './Reports/lcauthorisationlistsgrformat/lcauthorisationlistsgrformat.component';
import { LcstatusreportComponent } from './Reports/lcstatusreport/lcstatusreport.component';
import { LcTtEpcgreportComponent } from './Reports/lc-tt-epcgreport/lc-tt-epcgreport.component';
import { LcstatusreportAuthComponent } from './Reports/lcstatusreport-auth/lcstatusreport-auth.component';
import { LcstatusreportCertComponent } from './Reports/lcstatusreport-cert/lcstatusreport-cert.component';
import { LcauthorisationprintingComponent } from './Reports/lcauthorisationprinting/lcauthorisationprinting.component';
import { LccertificateprintingComponent } from './Reports/lccertificateprinting/lccertificateprinting.component';

const routes: Routes = [
//Reports Routing
{
    path: 'reports/lccertificatelistsgrformat',
    component: LccertificatelistsgrformatComponent,
    title: 'LC Certificate List SGR Format',
  },
  {
    path: 'reports/lcauthorisationlistsgrformat',
    component: LcauthorisationlistsgrformatComponent,
    title: 'LC Authorisation List SGR Format',
  },
  {
    path: 'reports/lcstatusreport',
    component: LcstatusreportComponent,
    title: 'LC Status Report',
  },
  {
    path: 'reports/lcstatusreport-auth',
    component: LcstatusreportAuthComponent,
    title: 'LC Status Report - Auth',
  },
  {
    path: 'reports/lcstatusreport-cert',
    component: LcstatusreportCertComponent,
    title: 'LC Status Report - Cert',
  },

  {
    path: 'reports/lc-tt-epcgreport',
    component: LcTtEpcgreportComponent,
    title: 'LC TT EPCG Report',
  },
          {
  path: 'reports/lccertificatelist',
  component: LccertificatelistComponent,
  title: 'LC Certificate List',
},
{
  path: 'reports/lcauthorisationlist',
  component: LcauthorisationlistComponent,
  title: 'LC Authorisation List',
},
{
  path: 'reports/pendinglccertificates',
  component: PendinglccertificatesComponent,
  title: 'Pending LC Certificates',
},
{
  path: 'reports/pendinglcauthorisations',
  component: PendinglcauthorisationsComponent,
  title: 'Pending LC Authorisations',
},
{
  path: 'reports/lcauthorisationprinting',
  component: LcauthorisationprintingComponent,
  title: 'LC Authorisation Printing',
},
{
  path: 'reports/lccertificateprinting',
  component: LccertificateprintingComponent,
  title: 'LC Certificate Printing',
},

//DataEntry Routing
{
  path: 'dataentry/lccertificateentry',
  component: LcCertificateEntryComponent
},
{
  path: 'dataentry/lcauthorisationentry',
  component: LcAuthorisationEntryComponent
},
// {
//   path: 'dataentry/lcpaymentdetailsentry',
//   component: LcPaymentDetailsEntryComponent
// },
// {
//   path: 'dataentry/lcinspection',
//   component: LcInspectionComponent
// },

//Enquiry Routing
{
  path: 'enquiry/lccertificateenquiry',
  component: LcCertificateEnquiryComponent
},
{
  path: 'enquiry/lcauthorisationenquiry',
  component: LcAuthorisationEnquiryComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LcCertificateSystemRoutingModule { }
