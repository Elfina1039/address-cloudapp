import { Observable  } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService, CloudAppConfigService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';

import { ActivatedRoute, Router } from '@angular/router';
import { Email, ValDesc } from '../classes/address';

import { DataService } from "../data.service";
import { Subscription } from 'rxjs';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog'; 
import { DialogComponent } from '../dialog/dialog.component';
import { MatSelectChange } from '@angular/material/select'

import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss']
})




export class EmailFormComponent extends FormComponent implements OnInit{

  
    email: Email;
    emailIndex : number;
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
                ref.email = new Email({email_address:""});
                ref.action="Add"; // change form action
             
            }else{
               ref.emailIndex = parseInt(address); // save address index
               ref.email = new Email(ref.userData.contact_info.email[address]); // initialize new instance of address based on the address to be edited
              
            }
      });  
  }
    
 


 




}