import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule, AlertModule } from '@exlibris/exl-cloudapp-angular-lib';



import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { FormComponent } from './form/form.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { EmailFormComponent } from './email-form/email-form.component';
import { PhoneFormComponent } from './phone-form/phone-form.component';
import { DialogComponent } from './dialog/dialog.component';
import { AddressComponent } from './address/address.component';
import { DataService } from './data.service';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ContactInfoComponent,
      FormComponent,
    AddressFormComponent,
      EmailFormComponent,
      PhoneFormComponent,
      DialogComponent,
      AddressComponent
  ],
    entryComponents:  [DialogComponent],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AlertModule,
    FormsModule,
    ReactiveFormsModule     
   //getTranslateModule()
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'standard' } },
      DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
