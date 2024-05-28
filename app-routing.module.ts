import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyMainComponent } from './main/body-main/body-main.component';
import { ShopComponent } from './myshop/shop/shop.component';
import { AboutusComponent } from './main/aboutus/aboutus.component';
import { ContactusComponent } from './main/contactus/contactus.component';

import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { AccountdetailsComponent } from './accountdetails/accountdetails.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaindashboardModule } from './maindashboard/maindashboard.module';


const routes: Routes = [
// {path:'',redirectTo:'home', pathMatch:'full'},
{path:'',component:BodyMainComponent},
{path:'home',component:BodyMainComponent},
{path:'myshop',component:ShopComponent},
{path:'about',component:AboutusComponent},
{path:'contact',component:ContactusComponent},
{path:'admin',component:AdminComponent},
{path:'login',component:LoginComponent},
{path:'accountdetails',component:AccountdetailsComponent},
{path:'maindashboard',component:MaindashboardModule}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
