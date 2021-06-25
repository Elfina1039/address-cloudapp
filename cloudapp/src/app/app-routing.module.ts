import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { FormComponent } from './form/form.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { EmailFormComponent } from './email-form/email-form.component';
import { PhoneFormComponent } from './phone-form/phone-form.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'contactinfo/:user', component: ContactInfoComponent },
    { path: 'renew/:user', component: FormComponent },
    { path: 'form/address/:user/:address', component: AddressFormComponent},
     { path: 'form/email/:user/:address', component: EmailFormComponent},
     { path: 'form/phone/:user/:address', component: PhoneFormComponent}
   // { path: 'form/add/:user/:address', component: AddressFormComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
