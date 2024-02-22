import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XsrfinterceptorInterceptor } from './interceptors/xsrfinterceptor.interceptor';
import { HeaderComponent } from './layout/header/header.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { MenuComponent } from './layout/menu/menu.component';
import { MatIconModule } from '@angular/material/icon';
import { ModalComponent } from './shared/generic/modal/modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AutofocusDirective } from './shared/directive/autofocus.directive';
import { DeposittransfereditComponent } from './components/fd/fdcommon/deposittransferedit/deposittransferedit.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NotfoundComponent } from './components/common/notfound/notfound.component';
import { RegisterComponent } from './components/register/register.component';
import { ReportsComponent } from './components/common/reports/reports.component';
import { LoaderModule } from './components/common/loader/loader.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    LayoutComponent,
    MenuComponent,
    ModalComponent,
    DeposittransfereditComponent,
    NotfoundComponent,
    AutofocusDirective,
    RegisterComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    TabModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({ preventDuplicates: true }),
    BrowserAnimationsModule,
    MatIconModule, MatDialogModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'

    }),
    LoaderModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: XsrfinterceptorInterceptor, multi: true }
  ],

  bootstrap: [AppComponent],

})
export class AppModule { }
