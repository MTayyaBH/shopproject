import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderModule } from './header/header.module';
import { BodyMainComponent } from './main/body-main/body-main.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzStepsModule } from 'ng-zorro-antd/steps';
registerLocaleData(en);
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ShopComponent } from './myshop/shop/shop.component';
import { HeaderComponentComponent } from './header/header-component/header-component.component';
import { AboutusComponent } from './main/aboutus/aboutus.component';
import { ContactusComponent } from './main/contactus/contactus.component';
import { AdminComponent } from './admin/admin.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { LoginComponent } from './login/login.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { AccountdetailsComponent } from './accountdetails/accountdetails.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { MaindashboardModule } from './maindashboard/maindashboard.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { MaindashboardRoutingModule } from './maindashboard/maindashboard-routing.module';
import { LoaderComponent } from './loader/loader.component';
@NgModule({
  declarations: [
    
    AppComponent,
    BodyMainComponent,
    ShopComponent,
    HeaderComponentComponent,
    AboutusComponent,
    ContactusComponent,
    AdminComponent,
    LoginComponent,
    AccountdetailsComponent,
    LoaderComponent
  ],
  imports: [
    NzFormModule,NzToolTipModule,NzLayoutModule,MaindashboardModule,MaindashboardRoutingModule,
    NzPopconfirmModule,NzDrawerModule,NzCollapseModule,
    BrowserModule ,
    NzButtonModule,
    NzDropDownModule,
    NzModalModule,
    NzTableModule,
    NzTypographyModule,
    NzIconModule,
    NzMessageModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzInputModule,
    NzSpinModule,
    NzStepsModule,
    BrowserModule,
    AppRoutingModule,
    HeaderModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzCarouselModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
