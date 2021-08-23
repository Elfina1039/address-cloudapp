import { Observable  } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService, CloudAppConfigService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';

import { ActivatedRoute, Router } from '@angular/router';
import { Phone, ValDesc } from '../classes/address';

import { DataService } from "../data.service";
import { Subscription } from 'rxjs';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog'; 
import { DialogComponent } from '../dialog/dialog.component';
import { MatSelectChange } from '@angular/material/select'

import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-phone-form',
  templateUrl: './phone-form.component.html',
  styleUrls: ['./phone-form.component.scss']
})




export class PhoneFormComponent extends FormComponent implements OnInit{

  
    phone: Phone;
    phoneIndex : number;
   // countries : ValDesc[];
    
  constructor(
     restService: CloudAppRestService,
     eventsService: CloudAppEventsService,
    alert: AlertService,
      config: CloudAppConfigService,
     route: ActivatedRoute, 
     router : Router,
    data : DataService,
     dialog: MatDialog
  ) {
  super(restService, eventsService, alert, config, route, router, data, dialog);
    }

  ngOnInit() {
      let ref = this;
     //this.config.set("test data").subscribe((response)=>console.log(response));
     
      
      this.subscription = this.data.currentUser.subscribe(user => this.userData = user); //get access to current user
      
        this.route.paramMap.subscribe(function(p){ //extract URL parametres
         let user : string = atob(p.get('user'));
         let address : string = p.get('address');
          ref.userLink = user;
      
            if(address=="-1"){ // if there is no reference to address, initialize an empty instance of phone
                ref.phone = new Phone({line1:""});
                ref.action="Add"; // change form action
             
            }else{
               ref.phoneIndex = parseInt(address); // save address index
               ref.phone = new Phone(ref.userData.contact_info.phone[address]); // initialize new instance of address based on the address to be edited
           
            }
      });  
  }
    

    
    matchAddressType(item1, item2){
     return item1 && item2 ? item1.value===item2.value : false;
    }
    
addSpaces(number:string){
    number=number.replace(/(\+?\d{3})(\d)/, '$1 $2');
    console.log(number);
    return number;
}

 
    




}