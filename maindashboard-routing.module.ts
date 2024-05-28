import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { UserdashboarComponent } from './userdashboar/userdashboar.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { PendingorderComponent } from './pendingorder/pendingorder.component';
import { CompletedorderComponent } from './completedorder/completedorder.component';
import { SavedorderComponent } from './savedorder/savedorder.component';

const routes: Routes = [
  
{path:'maindashboard',component:MainComponent,
  children:[
    {path:'',redirectTo:'MainDashBoard',pathMatch:'full'},
    {path:'MainDashBoard',component:UserdashboarComponent},
    {path:'OredrList',component:OrderlistComponent},
    {path:'PendingOrder',component:PendingorderComponent},
    {path:'Completedorder',component:CompletedorderComponent},
    {path:'SavedOreder',component:SavedorderComponent}

  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaindashboardRoutingModule { }
