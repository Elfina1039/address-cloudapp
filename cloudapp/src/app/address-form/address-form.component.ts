import { Observable  } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService, CloudAppConfigService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';

import { ActivatedRoute, Router } from '@angular/router';
import { Address, ValDesc } from '../classes/address';

import { DataService } from "../data.service";
import { Subscription } from 'rxjs';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog'; 
import { DialogComponent } from '../dialog/dialog.component';
import { MatSelectChange } from '@angular/material/select'

import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})




export class AddressFormComponent extends FormComponent implements OnInit{

  
    address: Address;
    addressIndex : number;
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
      
            if(address=="-1"){ // if there is no reference to address, initialize an empty instance of Address
                ref.address = new Address({line1:""});
                ref.action="Add"; // change form action
             
            }else{
               ref.addressIndex = parseInt(address); // save address index
               ref.address = new Address(ref.userData.contact_info.address[address]); // initialize new instance of address based on the address to be edited
                console.log(ref.address);
            }
      });  
  }
    
 


    formatPostalCode(code){
        console.log(code);
        if(code.length==3){
            code = code +" ";
            console.log(code);
        }
    }

    updateCountry(){ // update country description based on the new value of country.value
        let value = this.address.country.value;
        let desc : ValDesc = this.data.countries.filter((c)=>c.value==value)[0];
        this.address.country.desc = desc.desc;
    }
    
    matchAddressType(item1, item2){
     return item1 && item2 ? item1.value===item2.value : false;
    }
    






}