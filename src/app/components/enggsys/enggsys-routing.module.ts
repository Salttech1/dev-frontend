import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path:'lccertificatesystem',  
    loadChildren:() => import(`../../components/enggsys/LC-Certificate-system/lc-certificate-system.module`).then(m => m.LcCertificateSystemModule),
  },
  {
    path:'certificatesystem',  
    loadChildren:() => import(`../../components/enggsys/certificate-system/certificate-system.module`).then(m => m.CertificateSystemModule),
  },
  {
    path:'managementreports',  
    loadChildren:() => import(`../../components/enggsys/managementreports/managementreports.module`).then(m => m.ManagementreportsModule),
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnggsysRoutingModule { }
