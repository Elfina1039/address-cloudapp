import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { FormComponent } from './form/form.component';
import { AddressFormComponent } from './address-form/address-form.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'contactinfo/:user', component: ContactInfoComponent },
    { path: 'renew/:user', component: FormComponent },
    { path: 'form/edit/:user/:address', component: AddressFormComponent}
   // { path: 'form/add/:user/:address', component: AddressFormComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
