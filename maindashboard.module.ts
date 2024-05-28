import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaindashboardRoutingModule } from './maindashboard-routing.module';
import { UserdashboarComponent } from './userdashboar/userdashboar.component';
import { DashboardhearderComponent } from './dashboardhearder/dashboardhearder.component';

import { MainComponent } from './main/main.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { HeaderModule } from '../header/header.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzResultModule } from 'ng-zorro-antd/result';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { PendingorderComponent } from './pendingorder/pendingorder.component';
import { CompletedorderComponent } from './completedorder/completedorder.component';
import { SavedorderComponent } from './savedorder/savedorder.component';
import { LoaderComponent } from './loader/loader.component';
@NgModule({
  declarations: [
    UserdashboarComponent,
    DashboardhearderComponent,
    OrderlistComponent,
    MainComponent,DashboardComponent, PendingorderComponent, CompletedorderComponent, SavedorderComponent, LoaderComponent
  ],
  imports: [
    CommonModule,NzLayoutModule,NzDatePickerModule,
    NzFormModule,NzToolTipModule,NzLayoutModule,
    NzPopconfirmModule,NzDrawerModule,
    BrowserModule ,NzResultModule,
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
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzCarouselModule,MaindashboardRoutingModule
  ]
})
export class MaindashboardModule { }
