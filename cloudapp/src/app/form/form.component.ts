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
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})




export class FormComponent implements OnDestroy{

    loading = false;
    action : string = "Edit"; // current form action
    form: any;
  //  address: Address;
    itemIndex : number;
   // countries : ValDesc[];
    
    userData : any;
    userLink : string;
    subscription: Subscription;
    
    newExpiry : Date;
    
  constructor(
    protected restService: CloudAppRestService,
    protected eventsService: CloudAppEventsService,
    protected alert: AlertService,
      protected config: CloudAppConfigService,
    protected route: ActivatedRoute, 
    protected router : Router,
     public data : DataService,
     public dialog: MatDialog
  ) {
  
    }

  ngOnInit() {
      let ref = this;
     //this.config.set("test data").subscribe((response)=>console.log(response));
     this.route.paramMap.subscribe(function(p){ //extract URL parametres
         let user : string = atob(p.get('user'));
      
            ref.userLink = user;});
      
      this.subscription = this.data.currentUser.subscribe(user => {ref.userData = user;
                                                                    ref.calcRenewal();
                                                                  }); //get access to current user
      
  }
    
 

  ngOnDestroy() {
       this.subscription.unsubscribe();
  }
    
 

    
 matchAddressType(item1, item2){
     return item1 && item2 ? item1.value===item2.value : false;
    }
    

confirm(data){ // open dialog asking for confirmation
    let address = data;
    let dialog = this.data.language.dialog;
 
    let userId = this.userData.primary_id;
    let dialogRef = this.dialog.open(DialogComponent, {data:{address:data, userId:userId, dialog:dialog}});
     this.config.get().subscribe((result)=>console.log(result));
    return dialogRef;
}
    
    calcRenewal(){
        let today = new Date();
    
        let renewIn = 1;
        let year = 365*24*60*60*1000;
        
        
        let newExpiry= today.getTime()+(1*year);
        this.newExpiry = new Date(newExpiry);
    }

    renewAccount(){
        this.userData.expiry_date = this.newExpiry;
         this.userData.purge_date = this.newExpiry;
        
        this.save();
    }
    
    dispreferr(contacts){
               contacts.forEach((c)=>{
            c.preferred = false;
        });
        
        
    }
    
    preferrSingle(){
           if(this.userData.contact_info.address.length==1){
             this.userData.contact_info.address.forEach((c)=>{
            c.preferred = true;
        });}
        
          if(this.userData.contact_info.email.length==1){
             this.userData.contact_info.email.forEach((c)=>{
            c.preferred = true;
        });}
        
          if(this.userData.contact_info.phone.length==1){
             this.userData.contact_info.phone.forEach((c)=>{
            c.preferred = true;
        });}
    }
    
    
update(data, field, index){ // modify the address in userData and call save()
    
    this.confirm(data).afterClosed().subscribe((result)=>{
        if(result=="true"){
            if(data.preferred==true){
                console.log("contact is preferred");
                this.dispreferr(this.userData.contact_info[field]);
                data.preferred=true;
            }
            
            this.userData.contact_info[field][index] = data;
            
           
            
            console.log(this.userData.contact_info[field][index]);
    this.save();
    
        }
         
    });
   
}    
    
add(data, field){ // add the new address to userData and call save
     
        this.confirm(data).afterClosed().subscribe((result)=>{
        if(result=="true"){
            if(data.preferred==true){
                this.dispreferr(this.userData.contact_info[field]);
                 data.preferred=true;
            }
            this.userData.contact_info[field].push(data);
    this.save();
         
        }
    });
} 
    
    

    
  save() { // sent the PUT request to Alma API
    this.userData.user_title.value="";
    const requestBody = this.userData;
  console.log(requestBody);
    this.loading = true;
    let request: Request = {
      url: this.userLink, 
   // queryParams:{override:"contact_info.address.preferred"},
      method: HttpMethod.PUT,
      requestBody
    };

      let ref = this;
      this.preferrSingle();
      
    this.restService.call(request)
    .pipe(finalize(()=>this.loading=false))
    .subscribe({
      next: result => {
         this.eventsService.refreshPage().subscribe(
          ()=>{this.alert.success('Record ' + result.primary_id + "updated.");
               ref.action="Edit";
              }
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