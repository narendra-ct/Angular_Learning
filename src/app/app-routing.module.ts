import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpinwheelComponent } from './spinwheel/spinwheel.component'
import { WelcomeComponent } from './welcome/welcome.component'; 


const routes: Routes = [{path:'',component:WelcomeComponent},{path:'spinwheel',component:SpinwheelComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
