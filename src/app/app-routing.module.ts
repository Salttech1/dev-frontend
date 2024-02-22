import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './shared/auth/auth.guard';
import { NotfoundComponent } from './components/common/notfound/notfound.component';
import { RegisterComponent } from './components/register/register.component';
import { ReportsComponent } from './components/common/reports/reports.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login',
    },
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'reports',
    canActivate: [AuthGuard],
    component: ReportsComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/master/master.module').then((m) => m.MasterModule),
  },
  {
    path: 'shared',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(`./shared/shared.module`).then((m) => m.SharedModule),
    title: 'Code Help',
  },
  {
    path: '**',
    component: NotfoundComponent,
    data: {
      title: 'Page Not Found',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
