import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomeComponent } from './welcome/welcome.component'; 

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbdModalBasic} from './modal-basic'



@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    NgbdModalBasic
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
