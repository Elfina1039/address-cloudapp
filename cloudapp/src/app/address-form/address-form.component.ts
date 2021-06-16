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

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})




export class AddressFormComponent implements OnInit, OnDestroy{

    loading = false;
    action : string = "Edit"; // current form action
    form: any;
    address: Address;
    addressIndex : number;
   // countries : ValDesc[];
    
    userData : any;
    userLink : string;
    subscription: Subscription;
    
  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private alert: AlertService,
      private config: CloudAppConfigService,
    private route: ActivatedRoute, 
    private router : Router,
     public data : DataService,
     public dialog: MatDialog
  ) {
  
    }

  ngOnInit() {
      let ref = this;
     //this.config.set("test data").subscribe((response)=>console.log(response));
     
      
      this.subscription = this.data.currentUser.subscribe(user => this.userData = user); //get access to current user
      
        this.route.paramMap.subscribe(function(p){ //extract URL parametres
         let user : string = atob(p.get('user'));
         let address : string = p.get('address');
            
            ref.userLink = user;
      
            if(address=="undefined" || address==null){ // if there is no reference to address, initialize an empty instance of Address
                ref.address = new Address({line1:""});
                ref.action="Add"; // change form action
             
            }else{
               ref.addressIndex = parseInt(address); // save address index
               ref.address = new Address(ref.userData.contact_info.address[address]); // initialize new instance of address based on the address to be edited
                console.log(ref.address);
            }
      });  
  }
    
 

  ngOnDestroy() {
       this.subscription.unsubscribe();
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
    

confirm(){ // open dialog asking for confirmation
    let address = this.address;
    let userId = this.userData.primary_id;
    let dialogRef = this.dialog.open(DialogComponent, {data:{address:address, userId:userId}});
     this.config.get().subscribe((result)=>console.log(result));
    return dialogRef;
}

    

update(){ // modify the address in userData and call save()
    this.confirm().afterClosed().subscribe((result)=>{
        if(result=="true"){
            this.userData.contact_info.address[this.addressIndex] = this.address;
    this.save();
        }
         
    });
   
}    
    
add(){ // add the new address to userData and call save
        this.confirm().afterClosed().subscribe((result)=>{
        if(result=="true"){
            this.userData.contact_info.address.push(this.address);
    this.save();
        }
    });
} 
    
  save() { // sent the PUT request to Alma API
    const requestBody = this.userData;
      console.log(JSON.stringify(requestBody));
    this.loading = true;
    let request: Request = {
      url: this.userLink, 
   // queryParams:{override:"contact_info.address.preferred"},
      method: HttpMethod.PUT,
      requestBody
    };

    this.restService.call(request)
    .pipe(finalize(()=>this.loading=false))
    .subscribe({
      next: result => {
         this.eventsService.refreshPage().subscribe(
          ()=>this.alert.success('Record ' + result.primary_id + "updated.")
        );
      },
      error: (e: RestErrorResponse) => {
        this.alert.error('Failed to update data: ' + e.message);
        console.error(e);
      }
    });    
  }

    
      private tryParseJson(value: any) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
    return undefined;
  }




}